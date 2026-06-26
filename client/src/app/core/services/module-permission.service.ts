import { Injectable, signal } from '@angular/core';
import {
  EMPLOYEE_MENU,
  SUPER_ADMIN_MENU,
  TENANT_ADMIN_MENU,
} from '../config/menu.config';
import {
  getAllSuperAdminModuleKeys,
  getDefaultTenantModuleKeys,
  getModuleByKey,
  TENANT_ADMIN_ONLY_MODULE_KEYS,
  TENANT_ASSIGNABLE_MODULES,
} from '../config/modules.config';
import { MenuItem, ModuleKey, PortalType, TenantModuleSettings, User } from '../models';

const TENANT_MODULES_STORAGE_KEY = 'ai_erp_tenant_module_settings';

@Injectable({ providedIn: 'root' })
export class ModulePermissionService {
  private readonly tenantSettings = signal<Record<string, ModuleKey[]>>(this.loadTenantSettings());

  readonly tenantSettingsState = this.tenantSettings.asReadonly();

  getSuperAdminModules(): ModuleKey[] {
    return getAllSuperAdminModuleKeys();
  }

  getTenantEnabledModules(tenantId: string): ModuleKey[] {
    const settings = this.tenantSettings();

    if (settings[tenantId]?.length) {
      return [...settings[tenantId]];
    }

    if (tenantId !== 'default-tenant' && settings['default-tenant']?.length) {
      return [...settings['default-tenant']];
    }

    return getDefaultTenantModuleKeys();
  }

  saveTenantEnabledModules(tenantId: string, modules: ModuleKey[]): ModuleKey[] {
    const assignable = new Set(TENANT_ASSIGNABLE_MODULES.map((module) => module.key));
    const sanitized = modules.filter((key) => assignable.has(key));
    const nextModules = [...new Set(['dashboard', ...sanitized])];

    const nextSettings = {
      ...this.tenantSettings(),
      [tenantId]: nextModules,
    };

    this.tenantSettings.set(nextSettings);
    this.persistTenantSettings(nextSettings);
    return nextModules;
  }

  getTenantModuleSettings(tenantId: string): TenantModuleSettings {
    return {
      tenantId,
      enabledModules: this.getTenantEnabledModules(tenantId),
      updatedAt: new Date().toISOString(),
    };
  }

  getAssignableModulesForTenantAdmin(tenantId: string) {
    const enabledKeys = new Set(this.getTenantEnabledModules(tenantId));
    return TENANT_ASSIGNABLE_MODULES.filter((module) => enabledKeys.has(module.key));
  }

  /** Modules tenant admin can grant to managers, employees, and other subordinate roles. */
  getDelegatableModulesForSubRoles(tenantId: string) {
    const adminOnlyKeys = new Set(TENANT_ADMIN_ONLY_MODULE_KEYS);
    return this.getAssignableModulesForTenantAdmin(tenantId).filter(
      (module) => !adminOnlyKeys.has(module.key) && !this.isSuperAdminOnlyModule(module.key)
    );
  }

  getUserModuleKeys(user: User | null, rolePermissions: ModuleKey[] = []): ModuleKey[] {
    if (!user) return [];

    if (user.role === 'super-admin') {
      return this.getSuperAdminModules();
    }

    const tenantId = user.tenantId ?? 'default-tenant';
    const tenantEnabled = new Set(this.getTenantEnabledModules(tenantId));

    if (user.role === 'tenant-admin') {
      const portalModules = TENANT_ASSIGNABLE_MODULES.filter(
        (module) =>
          tenantEnabled.has(module.key) &&
          (module.portal === 'tenant-admin' || module.key === 'dashboard')
      ).map((module) => module.key);

      return [...new Set([...portalModules, ...TENANT_ADMIN_ONLY_MODULE_KEYS])];
    }

    const granted = rolePermissions.filter((key) => tenantEnabled.has(key));
    return granted.length ? [...new Set(['dashboard', ...granted])] : ['dashboard'];
  }

  filterMenuByModules(menu: MenuItem[], allowedModules: Set<ModuleKey>): MenuItem[] {
    return menu
      .map((item) => {
        if (item.children?.length) {
          const children = this.filterMenuByModules(item.children, allowedModules);
          return children.length ? { ...item, children } : null;
        }

        if (!item.moduleKey) {
          return item;
        }

        return allowedModules.has(item.moduleKey) ? item : null;
      })
      .filter((item): item is MenuItem => !!item);
  }

  getPortalMenu(portal: PortalType, user: User | null, rolePermissions: ModuleKey[] = []): MenuItem[] {
    const menu = this.getRawPortalMenu(portal);

    if (!user || user.role === 'super-admin') {
      return menu;
    }

    const allowed = new Set(this.getUserModuleKeys(user, rolePermissions));
    return this.filterMenuByModules(menu, allowed);
  }

  canAccessRoute(url: string, user: User | null, rolePermissions: ModuleKey[] = []): boolean {
    if (!user) return false;
    if (user.role === 'super-admin') return true;

    const path = url.split('?')[0];
    const portal = this.resolvePortalFromUrl(path);
    if (!portal) return true;

    const allowed = new Set(this.getUserModuleKeys(user, rolePermissions));
    const menu = this.getRawPortalMenu(portal);

    return this.menuContainsRoute(menu, path, allowed);
  }

  isSuperAdminOnlyModule(moduleKey: ModuleKey): boolean {
    const module = getModuleByKey(moduleKey);
    return module?.portal === 'super-admin';
  }

  private getRawPortalMenu(portal: PortalType): MenuItem[] {
    switch (portal) {
      case 'super-admin':
        return structuredClone(SUPER_ADMIN_MENU);
      case 'tenant-admin':
        return structuredClone(TENANT_ADMIN_MENU);
      case 'employee':
        return structuredClone(EMPLOYEE_MENU);
    }
  }

  private resolvePortalFromUrl(url: string): PortalType | null {
    if (url.startsWith('/super-admin')) return 'super-admin';
    if (url.startsWith('/tenant-admin')) return 'tenant-admin';
    if (url.startsWith('/employee')) return 'employee';
    return null;
  }

  private menuContainsRoute(
    menu: MenuItem[],
    path: string,
    allowedModules: Set<ModuleKey>
  ): boolean {
    for (const item of menu) {
      if (item.children?.length) {
        if (this.menuContainsRoute(item.children, path, allowedModules)) {
          return true;
        }
        continue;
      }

      if (!item.route || !item.moduleKey) continue;
      if (!allowedModules.has(item.moduleKey)) continue;

      if (item.route.endsWith('dashboard')) {
        if (path === item.route) return true;
        continue;
      }

      if (path === item.route || path.startsWith(`${item.route}/`)) {
        return true;
      }
    }

    return path.endsWith('/profile') || path.endsWith('/support-plans');
  }

  private loadTenantSettings(): Record<string, ModuleKey[]> {
    try {
      const raw = localStorage.getItem(TENANT_MODULES_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Record<string, ModuleKey[]>) : {};
    } catch {
      return {};
    }
  }

  private persistTenantSettings(settings: Record<string, ModuleKey[]>): void {
    localStorage.setItem(TENANT_MODULES_STORAGE_KEY, JSON.stringify(settings));
  }
}
