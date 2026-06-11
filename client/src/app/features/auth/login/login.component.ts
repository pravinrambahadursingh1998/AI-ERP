import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthCardComponent } from '../../../shared/components/auth-card/auth-card.component';
import { AuthService } from '../../../core/services/auth.service';
import { HelperService } from '../../../core/services/helper.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, AuthCardComponent, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly helper = inject(HelperService);

  showPassword = signal(false);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    remember: [false],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password, remember } = this.form.getRawValue();
    this.helper.showSpinner();

    setTimeout(() => {
      const success = this.auth.login(email!, password!, remember ?? false);
      this.helper.hideSpinner();

      if (success) {
        this.helper.showToast('Login successful!', 'success');
        this.router.navigate([this.auth.getDashboardRoute(this.auth.role()!)]);
      } else {
        this.helper.showToast('Invalid email or password', 'error');
      }
    }, 600);
  }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }
}
