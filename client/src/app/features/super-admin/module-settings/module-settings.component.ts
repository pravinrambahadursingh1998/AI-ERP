import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { HelperService } from '../../../core/services/helper.service';
import { ModulePermissionService } from '../../../core/services/module-permission.service';
import { TENANT_ASSIGNABLE_MODULES } from '../../../core/config/modules.config';
import { ModuleKey, Tenant } from '../../../core/models';

@Component({
  selector: 'app-module-settings',
  standalone: true,
  templateUrl: './module-settings.component.html',
})
export class ModuleSettingsComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly helper = inject(HelperService);
  private readonly modulePermissions = inject(ModulePermissionService);

  tenants = signal<Tenant[]>([]);
  selectedTenantId = signal('default-tenant');
  selectedModules = signal<Set<ModuleKey>>(new Set());
  saving = signal(false);

  readonly assignableModules = TENANT_ASSIGNABLE_MODULES;

  readonly tenantAdminModules = computed(() =>
    this.assignableModules.filter((module) => module.portal === 'tenant-admin')
  );

  readonly employeeModules = computed(() =>
    this.assignableModules.filter((module) => module.portal === 'employee')
  );

  readonly selectedTenant = computed(() =>
    this.tenants().find((tenant) => tenant.id === this.selectedTenantId())
  );

  ngOnInit(): void {
    this.helper.showSpinner();
    this.api.getTenants().subscribe({
      next: (tenants) => {
        this.helper.hideSpinner();
        this.tenants.set(tenants);
        this.loadTenantModules(this.selectedTenantId());
      },
      error: () => {
        this.helper.hideSpinner();
        this.helper.showToast('Failed to load tenants', 'error');
        this.loadTenantModules(this.selectedTenantId());
      },
    });
  }

  onTenantChange(tenantId: string): void {
    this.selectedTenantId.set(tenantId);
    this.loadTenantModules(tenantId);
  }

  isModuleChecked(key: ModuleKey): boolean {
    return this.selectedModules().has(key);
  }

  toggleModule(key: ModuleKey): void {
    const next = new Set(this.selectedModules());
    if (key === 'dashboard') return;

    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    this.selectedModules.set(next);
  }

  selectAllForPortal(portal: 'tenant-admin' | 'employee'): void {
    const next = new Set(this.selectedModules());
    const modules =
      portal === 'tenant-admin' ? this.tenantAdminModules() : this.employeeModules();

    for (const module of modules) {
      next.add(module.key);
    }
    this.selectedModules.set(next);
  }

  clearPortal(portal: 'tenant-admin' | 'employee'): void {
    const next = new Set(this.selectedModules());
    const modules =
      portal === 'tenant-admin' ? this.tenantAdminModules() : this.employeeModules();

    for (const module of modules) {
      if (module.key !== 'dashboard') {
        next.delete(module.key);
      }
    }
    this.selectedModules.set(next);
  }

  save(): void {
    const modules = [...this.selectedModules()];
    if (!modules.length) {
      this.helper.showToast('Select at least one module', 'warning');
      return;
    }

    this.saving.set(true);
    this.helper.showSpinner();

    const saved = this.modulePermissions.saveTenantEnabledModules(
      this.selectedTenantId(),
      modules
    );

    this.helper.hideSpinner();
    this.saving.set(false);
    this.selectedModules.set(new Set(saved));
    this.helper.showToast('Module permissions updated', 'success');
  }

  private loadTenantModules(tenantId: string): void {
    const enabled = this.modulePermissions.getTenantEnabledModules(tenantId);
    this.selectedModules.set(new Set(enabled));
  }
}
