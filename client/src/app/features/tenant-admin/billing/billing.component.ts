import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Invoice } from '../../../core/models';
import { PaymentService } from '../../../core/services/payment.service';
import { HelperService } from '../../../core/services/helper.service';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './billing.component.html',
})
export class BillingComponent implements OnInit {
  private readonly paymentService = inject(PaymentService);
  private readonly helper = inject(HelperService);

  invoices = signal<Invoice[]>([]);

  ngOnInit(): void {
    this.paymentService.getBillingHistory().subscribe((data) => this.invoices.set(data));
  }

  download(id: string): void {
    this.paymentService.downloadInvoice(id);
    this.helper.showToast('Invoice downloaded', 'success');
  }
}
