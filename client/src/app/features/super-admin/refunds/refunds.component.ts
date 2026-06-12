import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { HelperService } from '../../../core/services/helper.service';
import { Payment, Refund } from '../../../core/models';

@Component({
  selector: 'app-refunds',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './refunds.component.html',
})
export class RefundsComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly helper = inject(HelperService);
  private readonly fb = inject(FormBuilder);

  refunds = signal<Refund[]>([]);
  payments = signal<Payment[]>([]);
  showForm = signal(false);
  processing = signal(false);

  form = this.fb.group({
    paymentId: ['', Validators.required],
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
    reason: ['', Validators.required],
  });

  ngOnInit(): void {
    this.load();
    this.api.getPayments().subscribe((data) => this.payments.set(data));
  }

  load(): void {
    this.api.getRefunds().subscribe((data) => this.refunds.set(data));
  }

  eligiblePayments(): Payment[] {
    return this.payments().filter((p) => p.status === 'completed');
  }

  toggleForm(): void {
    this.showForm.update((v) => !v);
    this.form.reset();
  }

  submit(approve: boolean): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { paymentId, amount, reason } = this.form.getRawValue();
    this.processing.set(true);
    this.helper.showSpinner();

    this.api.processRefund(paymentId!, amount!, reason!, approve).subscribe({
      next: () => {
        this.processing.set(false);
        this.helper.hideSpinner();
        this.helper.showToast(approve ? 'Refund processed' : 'Refund rejected', approve ? 'success' : 'info');
        this.showForm.set(false);
        this.form.reset();
        this.load();
        this.api.getPayments().subscribe((data) => this.payments.set(data));
      },
      error: () => {
        this.processing.set(false);
        this.helper.hideSpinner();
        this.helper.showToast('Failed to process refund', 'error');
      },
    });
  }
}
