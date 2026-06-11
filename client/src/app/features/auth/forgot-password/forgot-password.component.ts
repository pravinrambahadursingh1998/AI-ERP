import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthCardComponent } from '../../../shared/components/auth-card/auth-card.component';
import { OtpInputComponent } from '../../../shared/components/otp-input/otp-input.component';
import { PasswordResetService } from '../../../core/services/password-reset.service';
import { HelperService } from '../../../core/services/helper.service';

type Step = 'email' | 'otp';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, AuthCardComponent, OtpInputComponent],
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly resetService = inject(PasswordResetService);
  private readonly router = inject(Router);
  private readonly helper = inject(HelperService);

  step = signal<Step>('email');
  email = signal('');
  resendCooldown = signal(0);
  private cooldownTimer?: ReturnType<typeof setInterval>;

  emailForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  otpForm = this.fb.group({
    otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
  });

  sendOtp(): void {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }

    const email = this.emailForm.getRawValue().email!;
    this.helper.showSpinner();

    this.resetService.sendOtp(email).subscribe({
      next: (res) => {
        this.helper.hideSpinner();
        if (!res.success) {
          this.helper.showToast('No account found with this email address', 'error');
          return;
        }
        this.email.set(email);
        this.step.set('otp');
        this.startResendCooldown();
        this.helper.showToast('OTP sent to your email', 'success');
        if (res.demoOtp) {
          this.helper.showToast(`Demo OTP: ${res.demoOtp}`, 'info');
        }
      },
    });
  }

  verifyOtp(): void {
    const otp = this.otpForm.getRawValue().otp ?? '';
    if (otp.length !== 6) {
      this.otpForm.markAllAsTouched();
      this.helper.showToast('Please enter the 6-digit OTP', 'warning');
      return;
    }

    this.helper.showSpinner();
    setTimeout(() => {
      const valid = this.resetService.verifyOtp(this.email(), otp);
      this.helper.hideSpinner();

      if (valid) {
        this.helper.showToast('OTP verified successfully', 'success');
        this.router.navigate(['/reset-password']);
      } else {
        this.helper.showToast('Invalid or expired OTP', 'error');
      }
    }, 500);
  }

  resendOtp(): void {
    if (this.resendCooldown() > 0) return;

    this.helper.showSpinner();
    this.resetService.resendOtp().subscribe({
      next: (res) => {
        this.helper.hideSpinner();
        if (res.success) {
          this.otpForm.reset();
          this.startResendCooldown();
          this.helper.showToast('New OTP sent', 'success');
          if (res.demoOtp) {
            this.helper.showToast(`Demo OTP: ${res.demoOtp}`, 'info');
          }
        }
      },
    });
  }

  backToEmail(): void {
    this.step.set('email');
    this.otpForm.reset();
    this.resetService.clearSession();
  }

  private startResendCooldown(): void {
    this.resendCooldown.set(60);
    clearInterval(this.cooldownTimer);
    this.cooldownTimer = setInterval(() => {
      const next = this.resendCooldown() - 1;
      this.resendCooldown.set(next);
      if (next <= 0) clearInterval(this.cooldownTimer);
    }, 1000);
  }
}
