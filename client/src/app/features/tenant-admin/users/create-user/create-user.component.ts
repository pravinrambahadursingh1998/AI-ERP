import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { HelperService } from '../../../../core/services/helper.service';
import { TenantUserRole } from '../../../../core/models';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './create-user.component.html',
})
export class CreateUserComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly helper = inject(HelperService);

  roles: TenantUserRole[] = ['Manager', 'Employee'];

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['Employee' as TenantUserRole, Validators.required],
    status: ['active' as 'active' | 'inactive', Validators.required],
  });

  get isActive(): boolean {
    return this.form.get('status')?.value === 'active';
  }

  toggleStatus(): void {
    const control = this.form.get('status');
    control?.setValue(control.value === 'active' ? 'inactive' : 'active');
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, email, role, status } = this.form.getRawValue();

    this.helper.showSpinner();
    this.api
      .createTenantUser({
        name: name!,
        email: email!,
        role: role!,
        status: status!,
      })
      .subscribe({
        next: () => {
          this.helper.hideSpinner();
          this.helper.showToast('User created successfully', 'success');
          this.router.navigate(['/tenant-admin/users']);
        },
        error: () => {
          this.helper.hideSpinner();
          this.helper.showToast('Failed to create user', 'error');
        },
      });
  }
}
