import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirm = control.get('confirmPassword')?.value;
  return password === confirm ? null : { mismatch: true };
}
import { Router } from '@angular/router';
import { AuthCardComponent } from '../../../shared/components/auth-card/auth-card.component';
import { PasswordResetService } from '../../../core/services/password-reset.service';
import { HelperService } from '../../../core/services/helper.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, AuthCardComponent],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly resetService = inject(PasswordResetService);
  private readonly router = inject(Router);
  private readonly helper = inject(HelperService);

  email = signal('');
  showPassword = signal(false);
  showConfirm = signal(false);

  form = this.fb.group(
    {
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordMatchValidator }
  );

  ngOnInit(): void {
    const verifiedEmail = this.resetService.getVerifiedEmail();
    if (!verifiedEmail) {
      this.helper.showToast('Please verify OTP first', 'warning');
      this.router.navigate(['/forgot-password']);
      return;
    }
    this.email.set(verifiedEmail);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const password = this.form.getRawValue().password!;
    this.helper.showSpinner();

    this.resetService.resetPassword(password).subscribe({
      next: (success) => {
        this.helper.hideSpinner();
        if (success) {
          this.helper.showToast('Password reset successfully!', 'success');
          this.router.navigate(['/login']);
        } else {
          this.helper.showToast('Failed to reset password', 'error');
        }
      },
    });
  }

}
