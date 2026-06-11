import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CheckoutSession, PaymentMethodType } from '../../../core/models';
import { PaymentService } from '../../../core/services/payment.service';
import { TenantOnboardingService } from '../../../core/services/tenant-onboarding.service';
import { HelperService } from '../../../core/services/helper.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly paymentService = inject(PaymentService);
  private readonly onboarding = inject(TenantOnboardingService);
  private readonly router = inject(Router);
  private readonly helper = inject(HelperService);

  billingEmail = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  session = signal<CheckoutSession | null>(null);
  paymentMethod = signal<PaymentMethodType>('card');
  showCvv = signal(false);

  cardForm = this.fb.group({
    cardName: ['', Validators.required],
    cardNumber: ['', [Validators.required, Validators.minLength(16)]],
    expiry: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
    cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
  });

  paypalForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  bankForm = this.fb.group({
    accountName: ['', Validators.required],
    accountNumber: ['', Validators.required],
    bankName: ['', Validators.required],
  });

  ngOnInit(): void {
    const checkout = this.paymentService.getCheckoutSession();
    if (!checkout) {
      this.helper.showToast('Please select a plan first', 'warning');
      this.router.navigate(['/payment/choose-plan']);
      return;
    }
    this.session.set(checkout);
    const email = checkout.email ?? this.onboarding.getPendingEmail() ?? '';
    if (email) {
      this.billingEmail.patchValue({ email });
      this.paymentService.setCheckoutEmail(email);
    }
  }

  updateBillingEmail(): void {
    const email = this.billingEmail.getRawValue().email;
    if (email) this.paymentService.setCheckoutEmail(email);
  }

  setMethod(method: PaymentMethodType): void {
    this.paymentMethod.set(method);
  }

  pay(): void {
    if (this.billingEmail.invalid) {
      this.billingEmail.markAllAsTouched();
      this.helper.showToast('Please enter your registered email', 'warning');
      return;
    }
    this.updateBillingEmail();

    const method = this.paymentMethod();
    let details;

    if (method === 'card') {
      if (this.cardForm.invalid) {
        this.cardForm.markAllAsTouched();
        return;
      }
      const v = this.cardForm.getRawValue();
      details = {
        method: 'card' as const,
        cardName: v.cardName!,
        cardNumber: v.cardNumber!,
        expiry: v.expiry!,
        cvv: v.cvv!,
      };
    } else if (method === 'paypal') {
      if (this.paypalForm.invalid) {
        this.paypalForm.markAllAsTouched();
        return;
      }
      details = { method: 'paypal' as const, email: this.paypalForm.getRawValue().email! };
    } else {
      if (this.bankForm.invalid) {
        this.bankForm.markAllAsTouched();
        return;
      }
      const v = this.bankForm.getRawValue();
      details = {
        method: 'bank_transfer' as const,
        accountName: v.accountName!,
        accountNumber: v.accountNumber!,
        bankName: v.bankName!,
      };
    }

    this.helper.showSpinner();
    this.paymentService.processPayment(details).subscribe({
      next: (result) => {
        this.helper.hideSpinner();
        if (result.success) {
          this.router.navigate(['/payment/success'], {
            queryParams: { txn: result.transactionId, inv: result.invoiceId },
          });
        } else {
          this.router.navigate(['/payment/failed'], {
            queryParams: { reason: result.errorMessage },
          });
        }
      },
    });
  }

  formatCardNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '').slice(0, 16);
    input.value = value.replace(/(.{4})/g, '$1 ').trim();
    this.cardForm.patchValue({ cardNumber: value });
  }

  formatExpiry(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '').slice(0, 4);
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    input.value = value;
    this.cardForm.patchValue({ expiry: value });
  }
}
