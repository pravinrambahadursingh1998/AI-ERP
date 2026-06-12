import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { HelperService } from '../../../../core/services/helper.service';
import { TenantPermission, TenantRoleColor } from '../../../../core/models';

@Component({
  selector: 'app-edit-role',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './edit-role.component.html',
})
export class EditRoleComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly helper = inject(HelperService);

  roleId = '';
  userCount = 0;
  loading = true;

  colorOptions: Array<{ value: TenantRoleColor; label: string }> = [
    { value: 'bg-brand-500', label: 'Blue' },
    { value: 'bg-violet-500', label: 'Purple' },
    { value: 'bg-emerald-500', label: 'Green' },
    { value: 'bg-amber-500', label: 'Amber' },
    { value: 'bg-rose-500', label: 'Rose' },
  ];

  availablePermissions: Array<{ key: TenantPermission; description: string }> = [
    { key: 'Users', description: 'Manage organization users' },
    { key: 'Reports', description: 'View and export reports' },
    { key: 'AI Chat', description: 'Access AI chat assistant' },
    { key: 'My Reports', description: 'View personal reports only' },
    { key: 'AI Dashboard', description: 'View AI usage analytics' },
    { key: 'Billing', description: 'Manage subscription and invoices' },
    { key: 'Knowledge Base', description: 'Manage knowledge base content' },
    { key: 'Settings', description: 'Configure organization settings' },
  ];

  selectedPermissions = new Set<TenantPermission>();

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
        this.form.patchValue({
          name: role.name,
          color: role.color,
        });

        this.selectedPermissions = new Set(role.permissions);

        this.loading = false;
      },
      error: () => {
        this.helper.hideSpinner();
        this.helper.showToast('Failed to load role', 'error');
        this.router.navigate(['/tenant-admin/roles']);
      },
    });
  }

  isPermissionChecked(key: TenantPermission): boolean {
    return this.selectedPermissions.has(key);
  }

  togglePermission(key: TenantPermission): void {
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
    const selectedPermissions = [...this.selectedPermissions];

    if (!selectedPermissions.length) {
      this.helper.showToast('Select at least one permission', 'warning');
      return;
    }

    this.helper.showSpinner();
    this.api
      .updateTenantRole(this.roleId, {
        name: name!,
        color: color!,
        permissions: selectedPermissions,
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
