import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Invoice } from '../../../core/models';
import { PaymentService } from '../../../core/services/payment.service';
import { HelperService } from '../../../core/services/helper.service';

@Component({
  selector: 'app-billing-history',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './billing-history.component.html',
})
export class BillingHistoryComponent implements OnInit {
  private readonly paymentService = inject(PaymentService);
  private readonly helper = inject(HelperService);

  invoices = signal<Invoice[]>([]);

  ngOnInit(): void {
    this.helper.showSpinner();
    this.paymentService.getBillingHistory().subscribe({
      next: (data) => {
        this.invoices.set(data);
        this.helper.hideSpinner();
      },
    });
  }

  download(id: string): void {
    this.paymentService.downloadInvoice(id);
    this.helper.showToast('Invoice downloaded', 'success');
  }

  formatMethod(method: string): string {
    return this.paymentService.formatMethod(method as Invoice['paymentMethod']);
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      paid: 'bg-emerald-100 text-emerald-700',
      pending: 'bg-amber-100 text-amber-700',
      failed: 'bg-red-100 text-red-700',
      refunded: 'bg-slate-100 text-slate-600',
    };
    return map[status] ?? map['pending'];
  }
}
