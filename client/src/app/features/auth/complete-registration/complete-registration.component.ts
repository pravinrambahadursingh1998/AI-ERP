import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthCardComponent } from '../../../shared/components/auth-card/auth-card.component';
import { TenantOnboardingService } from '../../../core/services/tenant-onboarding.service';
import { HelperService } from '../../../core/services/helper.service';
import { TenantOnboarding } from '../../../core/models';

function passwordMatch(group: AbstractControl): ValidationErrors | null {
  const p = group.get('adminPassword')?.value;
  const c = group.get('confirmPassword')?.value;
  return p === c ? null : { mismatch: true };
}

@Component({
  selector: 'app-complete-registration',
  standalone: true,
  imports: [ReactiveFormsModule, AuthCardComponent, RouterLink],
  templateUrl: './complete-registration.component.html',
})
export class CompleteRegistrationComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly onboarding = inject(TenantOnboardingService);
  private readonly helper = inject(HelperService);

  onboardingData = signal<TenantOnboarding | null>(null);
  invalidToken = signal(false);
  showPassword = signal(false);

  industries = ['Technology', 'Healthcare', 'Education', 'Manufacturing', 'Retail', 'Finance', 'Other'];
  countries = ['United States', 'Canada', 'United Kingdom', 'India', 'Australia', 'Germany', 'Other'];

  form = this.fb.group(
    {
      companyName: ['', Validators.required],
      industry: ['', Validators.required],
      contactPerson: ['', Validators.required],
      email: [{ value: '', disabled: true }, Validators.required],
      mobile: ['', Validators.required],
      country: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      website: [''],
      taxId: ['', Validators.required],
      adminPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue],
    },
    { validators: passwordMatch }
  );

  private token = '';

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    if (!this.token) {
      this.invalidToken.set(true);
      return;
    }

    const data = this.onboarding.getByToken(this.token);
    if (!data) {
      this.invalidToken.set(true);
      return;
    }

    this.onboardingData.set(data);
    this.form.patchValue({
      companyName: data.companyName,
      industry: data.industry,
      contactPerson: data.contactPerson,
      email: data.email,
      mobile: data.mobile,
      country: data.country,
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    this.helper.showSpinner();

    this.onboarding
      .completeRegistration(this.token, {
        companyName: raw.companyName!,
        industry: raw.industry!,
        contactPerson: raw.contactPerson!,
        email: raw.email!,
        mobile: raw.mobile!,
        country: raw.country!,
        address: raw.address!,
        city: raw.city!,
        state: raw.state!,
        zipCode: raw.zipCode!,
        website: raw.website ?? '',
        taxId: raw.taxId!,
        adminPassword: raw.adminPassword!,
      })
      .subscribe({
        next: (success) => {
          this.helper.hideSpinner();
          if (success) {
            this.helper.showToast('Registration completed! You can now login.', 'success');
            this.router.navigate(['/login']);
          } else {
            this.helper.showToast('Registration failed. Invalid or expired link.', 'error');
          }
        },
      });
  }
}
