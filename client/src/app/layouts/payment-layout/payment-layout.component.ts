import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-payment-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgClass],
  templateUrl: './payment-layout.component.html',
})
export class PaymentLayoutComponent {
  private readonly router = inject(Router);

  readonly steps = [
    { label: 'Choose Plan', path: '/payment/choose-plan' },
    { label: 'Checkout', path: '/payment/checkout' },
    { label: 'Complete', path: '/payment/success' },
  ];

  readonly currentPath = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e) => (e as NavigationEnd).urlAfterRedirects),
      startWith(this.router.url)
    ),
    { initialValue: this.router.url }
  );

  stepIndex(): number {
    const url = this.currentPath() ?? '';
    if (url.includes('success') || url.includes('failed')) return 2;
    if (url.includes('checkout')) return 1;
    return 0;
  }

  isActive(index: number): boolean {
    return this.stepIndex() >= index;
  }
}
