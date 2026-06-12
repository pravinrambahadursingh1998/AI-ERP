import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { HelperService } from '../../../core/services/helper.service';
import { Invoice } from '../../../core/models';

@Component({
  selector: 'app-invoices',
  standalone: true,
  templateUrl: './invoices.component.html',
})
export class InvoicesComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly helper = inject(HelperService);

  invoices = signal<Invoice[]>([]);

  ngOnInit(): void {
    this.api.getInvoices().subscribe((data) => this.invoices.set(data));
  }

  download(id: string): void {
    this.api.downloadInvoice(id);
    this.helper.showToast('Invoice downloaded', 'success');
  }

  formatMethod(method: string): string {
    const labels: Record<string, string> = {
      card: 'Card',
      paypal: 'PayPal',
      bank_transfer: 'Bank Transfer',
    };
    return labels[method] ?? method;
  }
}
