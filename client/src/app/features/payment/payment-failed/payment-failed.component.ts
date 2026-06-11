import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-payment-failed',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './payment-failed.component.html',
})
export class PaymentFailedComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  reason = signal('Payment could not be processed. Please try again.');

  ngOnInit(): void {
    const r = this.route.snapshot.queryParamMap.get('reason');
    if (r) this.reason.set(r);
  }
}
