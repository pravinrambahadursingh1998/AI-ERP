import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PaymentService } from '../../../core/services/payment.service';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './payment-success.component.html',
})
export class PaymentSuccessComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly paymentService = inject(PaymentService);

  txnId = signal('');
  invoiceId = signal('');
  planName = signal('');
  total = signal(0);
  registrationLink = signal<string | null>(null);
  emailSent = signal(false);
  awaitingApproval = signal(false);

  ngOnInit(): void {
    const txn = this.route.snapshot.queryParamMap.get('txn');
    const inv = this.route.snapshot.queryParamMap.get('inv');
    const last = this.paymentService.getLastTransaction();

    this.txnId.set(txn ?? last?.transactionId ?? '');
    this.invoiceId.set(inv ?? last?.invoiceId ?? '');
    this.planName.set(last?.planName ?? 'Selected');
    this.total.set(last?.total ?? 0);

    const link = last?.registrationLink;
    if (link) {
      this.registrationLink.set(link);
      this.emailSent.set(true);
    } else if (last?.email) {
      this.awaitingApproval.set(true);
    }
  }

  downloadInvoice(): void {
    const id = this.invoiceId();
    if (id) this.paymentService.downloadInvoice(id);
  }
}
