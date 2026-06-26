import {
  EMPLOYEE_MENU,
  SUPER_ADMIN_MENU,
  TENANT_ADMIN_MENU,
} from './menu.config';
import { AppModule, MenuItem, PortalType } from '../models';

export function slugifyModuleKey(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function extractModulesFromMenu(
  menu: MenuItem[],
  portal: PortalType,
  group?: string
): AppModule[] {
  const modules: AppModule[] = [];

  for (const item of menu) {
    const currentGroup = item.children?.length ? item.label : group;

    if (item.moduleKey && item.route) {
      modules.push({
        key: item.moduleKey,
        label: item.label,
        description: `Access ${item.label}`,
        portal,
        route: item.route,
        icon: item.icon,
        group: currentGroup,
      });
    }

    if (item.children?.length) {
      modules.push(...extractModulesFromMenu(item.children, portal, item.label));
    }
  }

  return modules;
}

export const SUPER_ADMIN_MODULES = extractModulesFromMenu(
  SUPER_ADMIN_MENU,
  'super-admin'
);

export const TENANT_ADMIN_MODULES = extractModulesFromMenu(
  TENANT_ADMIN_MENU,
  'tenant-admin'
);

export const EMPLOYEE_MODULES = extractModulesFromMenu(EMPLOYEE_MENU, 'employee');

/** Modules super admin can grant to tenants (tenant-admin + employee portals). */
export const TENANT_ASSIGNABLE_MODULES = [
  ...TENANT_ADMIN_MODULES,
  ...EMPLOYEE_MODULES.filter(
    (module) => !TENANT_ADMIN_MODULES.some((existing) => existing.key === module.key)
  ),
];

export const ALL_APP_MODULES = [
  ...SUPER_ADMIN_MODULES,
  ...TENANT_ASSIGNABLE_MODULES.filter(
    (module) => !SUPER_ADMIN_MODULES.some((existing) => existing.key === module.key)
  ),
];

export function getModuleByKey(key: string): AppModule | undefined {
  return ALL_APP_MODULES.find((module) => module.key === key);
}

export function getModulesForPortal(portal: PortalType): AppModule[] {
  switch (portal) {
    case 'super-admin':
      return SUPER_ADMIN_MODULES;
    case 'tenant-admin':
      return TENANT_ADMIN_MODULES;
    case 'employee':
      return EMPLOYEE_MODULES;
  }
}

export function getDefaultTenantModuleKeys(): string[] {
  return TENANT_ASSIGNABLE_MODULES.map((module) => module.key);
}

export function getAllSuperAdminModuleKeys(): string[] {
  return SUPER_ADMIN_MODULES.map((module) => module.key);
}

/** Always available to tenant admin — super admin cannot revoke these. */
export const TENANT_ADMIN_ONLY_MODULE_KEYS: string[] = ['roles', 'module-settings'];
