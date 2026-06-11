import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthCardComponent } from '../../../shared/components/auth-card/auth-card.component';
import { ApiService } from '../../../core/services/api.service';
import { HelperService } from '../../../core/services/helper.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, AuthCardComponent, RouterLink],
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly helper = inject(HelperService);

  industries = ['Technology', 'Healthcare', 'Education', 'Manufacturing', 'Retail', 'Finance', 'Other'];
  countries = ['United States', 'Canada', 'United Kingdom', 'India', 'Australia', 'Germany', 'Other'];
  employeeCounts = ['1-10', '11-50', '51-200', '201-500', '500+'];

  form = this.fb.group({
    companyName: ['', Validators.required],
    industry: ['', Validators.required],
    contactPerson: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    mobile: ['', Validators.required],
    employeeCount: ['', Validators.required],
    country: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]],
    acceptTerms: [false, Validators.requiredTrue],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const data = this.form.getRawValue();
    this.helper.showSpinner();

    this.api
      .submitTenantRequest({
        companyName: data.companyName!,
        industry: data.industry!,
        contactPerson: data.contactPerson!,
        email: data.email!,
        mobile: data.mobile!,
        employeeCount: parseInt(data.employeeCount!.split('-')[0]) || 10,
        country: data.country!,
      })
      .subscribe({
        next: () => {
          this.helper.hideSpinner();
          this.helper.showToast('Registration submitted! Pending admin approval.', 'success');
          this.helper.showToast('Super Admin has been notified by email to review your request.', 'info');
          this.helper.showToast('After approval, complete payment to receive your registration link.', 'info');
          this.router.navigate(['/login']);
        },
        error: () => {
          this.helper.hideSpinner();
          this.helper.showToast('Registration failed. Please try again.', 'error');
        },
      });
  }
}
