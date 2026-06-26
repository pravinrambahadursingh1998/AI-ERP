import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { HelperService } from '../../../../core/services/helper.service';
import { ModulePermissionService } from '../../../../core/services/module-permission.service';
import { getModuleByKey } from '../../../../core/config/modules.config';
import { AppModule, ModuleKey, TenantRoleColor } from '../../../../core/models';

@Component({
  selector: 'app-edit-role',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './edit-role.component.html',
})
export class EditRoleComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly helper = inject(HelperService);
  private readonly modulePermissions = inject(ModulePermissionService);

  roleId = '';
  userCount = 0;
  loading = true;
  isSystemRole = false;

  colorOptions: Array<{ value: TenantRoleColor; label: string }> = [
    { value: 'bg-brand-500', label: 'Blue' },
    { value: 'bg-violet-500', label: 'Purple' },
    { value: 'bg-emerald-500', label: 'Green' },
    { value: 'bg-amber-500', label: 'Amber' },
    { value: 'bg-rose-500', label: 'Rose' },
  ];

  availablePermissions: AppModule[] = [];
  selectedPermissions = new Set<ModuleKey>();

  form = this.fb.group({
    name: ['', Validators.required],
    color: ['bg-brand-500' as TenantRoleColor, Validators.required],
  });

  ngOnInit(): void {
    this.roleId = this.route.snapshot.paramMap.get('id') ?? '';
    if (!this.roleId) {
      this.router.navigate(['/tenant-admin/roles']);
      return;
    }

    const tenantId = this.auth.user()?.tenantId ?? 'default-tenant';
    this.availablePermissions = this.modulePermissions.getDelegatableModulesForSubRoles(tenantId);

    this.helper.showSpinner();
    this.api.getTenantRole(this.roleId).subscribe({
      next: (role) => {
        this.helper.hideSpinner();
        if (!role) {
          this.helper.showToast('Role not found', 'error');
          this.router.navigate(['/tenant-admin/roles']);
          return;
        }

        this.userCount = role.users;
        this.isSystemRole = !!role.isSystemRole;
        this.form.patchValue({
          name: role.name,
          color: role.color,
        });

        const allowedKeys = new Set(this.availablePermissions.map((module) => module.key));
        this.selectedPermissions = new Set(
          role.permissions.filter((permission) => allowedKeys.has(permission))
        );

        this.loading = false;
      },
      error: () => {
        this.helper.hideSpinner();
        this.helper.showToast('Failed to load role', 'error');
        this.router.navigate(['/tenant-admin/roles']);
      },
    });
  }

  permissionLabel(key: ModuleKey): string {
    return getModuleByKey(key)?.label ?? key;
  }

  isPermissionChecked(key: ModuleKey): boolean {
    return this.selectedPermissions.has(key);
  }

  togglePermission(key: ModuleKey): void {
    if (key === 'dashboard') return;

    const next = new Set(this.selectedPermissions);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    this.selectedPermissions = next;
  }

  get selectedColor(): TenantRoleColor {
    return this.form.get('color')?.value as TenantRoleColor;
  }

  selectColor(color: TenantRoleColor): void {
    this.form.get('color')?.setValue(color);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, color } = this.form.getRawValue();
    const allowedKeys = new Set(this.availablePermissions.map((module) => module.key));
    const selectedPermissions = [...this.selectedPermissions].filter((key) =>
      allowedKeys.has(key)
    );

    if (!selectedPermissions.length) {
      this.helper.showToast('Select at least one permission', 'warning');
      return;
    }

    this.helper.showSpinner();
    this.api
      .updateTenantRole(this.roleId, {
        name: name!,
        color: color!,
        permissions: [...new Set(['dashboard', ...selectedPermissions])],
      })
      .subscribe({
        next: (role) => {
          this.helper.hideSpinner();
          if (!role) {
            this.helper.showToast('Failed to update role', 'error');
            return;
          }
          this.helper.showToast('Role updated successfully', 'success');
          this.router.navigate(['/tenant-admin/roles']);
        },
        error: () => {
          this.helper.hideSpinner();
          this.helper.showToast('Failed to update role', 'error');
        },
      });
  }
}
