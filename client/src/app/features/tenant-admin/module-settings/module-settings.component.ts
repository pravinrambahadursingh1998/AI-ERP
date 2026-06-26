import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { HelperService } from '../../../core/services/helper.service';
import { ModulePermissionService } from '../../../core/services/module-permission.service';
import { AppModule, ModuleKey, TenantRole, TenantUser } from '../../../core/models';

type AssignMode = 'role' | 'user';

@Component({
  selector: 'app-tenant-module-settings',
  standalone: true,
  templateUrl: './module-settings.component.html',
})
export class TenantModuleSettingsComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly helper = inject(HelperService);
  private readonly modulePermissions = inject(ModulePermissionService);

  assignMode = signal<AssignMode>('role');
  roles = signal<TenantRole[]>([]);
  users = signal<TenantUser[]>([]);
  selectedRoleId = signal('');
  selectedUserId = signal<number | null>(null);
  selectedModules = signal<Set<ModuleKey>>(new Set());
  useRoleDefaults = signal(true);
  saving = signal(false);
  loading = signal(true);

  readonly tenantId = this.auth.user()?.tenantId ?? 'default-tenant';

  readonly availableModules = computed(() =>
    this.modulePermissions.getDelegatableModulesForSubRoles(this.tenantId)
  );

  readonly assignableRoles = computed(() =>
    this.roles().filter((role) => !role.isSystemRole)
  );

  readonly selectedRole = computed(() =>
    this.assignableRoles().find((role) => role.id === this.selectedRoleId())
  );

  readonly selectedUser = computed(() =>
    this.users().find((user) => user.id === this.selectedUserId())
  );

  readonly enabledModuleCount = computed(() => this.modulePermissions.getTenantEnabledModules(this.tenantId).length);

  ngOnInit(): void {
    this.helper.showSpinner();
    this.api.getTenantRoles().subscribe({
      next: (roles) => {
        this.roles.set(roles);
        const firstRole = roles.find((role) => !role.isSystemRole);
        if (firstRole) {
          this.selectedRoleId.set(firstRole.id);
          this.loadRoleModules(firstRole);
        }

        this.api.getTenantUsers().subscribe({
          next: (users) => {
            this.helper.hideSpinner();
            this.users.set(users);
            this.loading.set(false);
          },
          error: () => {
            this.helper.hideSpinner();
            this.loading.set(false);
            this.helper.showToast('Failed to load users', 'error');
          },
        });
      },
      error: () => {
        this.helper.hideSpinner();
        this.loading.set(false);
        this.helper.showToast('Failed to load roles', 'error');
      },
    });
  }

  setAssignMode(mode: AssignMode): void {
    this.assignMode.set(mode);
    if (mode === 'role') {
      const role = this.selectedRole();
      if (role) this.loadRoleModules(role);
      return;
    }

    if (!this.selectedUserId() && this.users().length) {
      this.selectedUserId.set(this.users()[0].id);
    }
    const user = this.selectedUser();
    if (user) this.loadUserModules(user);
  }

  onRoleChange(roleId: string): void {
    this.selectedRoleId.set(roleId);
    const role = this.assignableRoles().find((item) => item.id === roleId);
    if (role) this.loadRoleModules(role);
  }

  onUserChange(userId: string): void {
    const id = Number(userId);
    this.selectedUserId.set(id);
    const user = this.users().find((item) => item.id === id);
    if (user) this.loadUserModules(user);
  }

  isModuleChecked(key: ModuleKey): boolean {
    return this.selectedModules().has(key);
  }

  toggleModule(key: ModuleKey): void {
    if (key === 'dashboard') return;

    const next = new Set(this.selectedModules());
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    this.selectedModules.set(next);
    this.useRoleDefaults.set(false);
  }

  selectAll(): void {
    const next = new Set<ModuleKey>(['dashboard']);
    for (const module of this.availableModules()) {
      next.add(module.key);
    }
    this.selectedModules.set(next);
    this.useRoleDefaults.set(false);
  }

  clearAll(): void {
    this.selectedModules.set(new Set(['dashboard']));
    this.useRoleDefaults.set(false);
  }

  resetUserToRoleDefaults(): void {
    const user = this.selectedUser();
    if (!user) return;

    this.helper.showSpinner();
    this.api.clearTenantUserModuleOverrides(user.id).subscribe({
      next: (updated) => {
        this.helper.hideSpinner();
        if (!updated) {
          this.helper.showToast('Failed to reset user permissions', 'error');
          return;
        }
        this.users.update((items) =>
          items.map((item) => (item.id === updated.id ? updated : item))
        );
        this.loadUserModules(updated);
        this.useRoleDefaults.set(true);
        this.helper.showToast('User reset to role defaults', 'success');
      },
      error: () => {
        this.helper.hideSpinner();
        this.helper.showToast('Failed to reset user permissions', 'error');
      },
    });
  }

  save(): void {
    const modules = [...this.selectedModules()];
    if (!modules.length) {
      this.helper.showToast('Select at least one module', 'warning');
      return;
    }

    const allowedKeys = new Set(this.availableModules().map((module) => module.key));
    const sanitized = [...new Set(['dashboard', ...modules])].filter((key) => allowedKeys.has(key));

    this.saving.set(true);
    this.helper.showSpinner();

    if (this.assignMode() === 'role') {
      const role = this.selectedRole();
      if (!role) return;

      this.api
        .updateTenantRole(role.id, {
          name: role.name,
          color: role.color,
          permissions: sanitized,
        })
        .subscribe({
          next: (updated) => {
            this.helper.hideSpinner();
            this.saving.set(false);
            if (!updated) {
              this.helper.showToast('Failed to update role', 'error');
              return;
            }
            this.roles.update((items) =>
              items.map((item) => (item.id === updated.id ? updated : item))
            );
            this.selectedModules.set(new Set(updated.permissions));
            this.helper.showToast(`Module access updated for ${updated.name}`, 'success');
          },
          error: () => {
            this.helper.hideSpinner();
            this.saving.set(false);
            this.helper.showToast('Failed to update role', 'error');
          },
        });
      return;
    }

    const user = this.selectedUser();
    if (!user) return;

    this.api.updateTenantUserModules(user.id, sanitized).subscribe({
      next: (updated) => {
        this.helper.hideSpinner();
        this.saving.set(false);
        if (!updated) {
          this.helper.showToast('Failed to update user', 'error');
          return;
        }
        this.users.update((items) =>
          items.map((item) => (item.id === updated.id ? updated : item))
        );
        this.selectedModules.set(new Set(updated.modulePermissions ?? sanitized));
        this.useRoleDefaults.set(false);
        this.helper.showToast(`Module access updated for ${updated.name}`, 'success');
      },
      error: () => {
        this.helper.hideSpinner();
        this.saving.set(false);
        this.helper.showToast('Failed to update user', 'error');
      },
    });
  }

  moduleGroupLabel(module: AppModule): string {
    if (module.portal === 'employee') return 'Employee Portal';
    return 'Organization';
  }

  private loadRoleModules(role: TenantRole): void {
    const allowedKeys = new Set(this.availableModules().map((module) => module.key));
    this.selectedModules.set(
      new Set(role.permissions.filter((permission) => allowedKeys.has(permission)))
    );
    this.useRoleDefaults.set(true);
  }

  private loadUserModules(user: TenantUser): void {
    const allowedKeys = new Set(this.availableModules().map((module) => module.key));

    if (user.modulePermissions?.length) {
      this.selectedModules.set(
        new Set(user.modulePermissions.filter((permission) => allowedKeys.has(permission)))
      );
      this.useRoleDefaults.set(false);
      return;
    }

    const role = this.roles().find((item) => item.id === user.roleId);
    this.selectedModules.set(
      new Set((role?.permissions ?? ['dashboard']).filter((permission) => allowedKeys.has(permission)))
    );
    this.useRoleDefaults.set(true);
  }
}
