import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Payment } from '../../../core/models';

@Component({
  selector: 'app-payments',
  standalone: true,
  templateUrl: './payments.component.html',
})
export class PaymentsComponent implements OnInit {
  private readonly api = inject(ApiService);
  payments = signal<Payment[]>([]);

  ngOnInit(): void {
    this.api.getPayments().subscribe((data) => this.payments.set(data));
  }
}
