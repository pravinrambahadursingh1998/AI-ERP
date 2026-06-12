import { Component, inject, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Plan } from '../../../core/models';
import { PaymentService } from '../../../core/services/payment.service';
import { HelperService } from '../../../core/services/helper.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-choose-plan',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './choose-plan.component.html',
})
export class ChoosePlanComponent implements OnInit {
  private readonly paymentService = inject(PaymentService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly helper = inject(HelperService);
  private readonly auth = inject(AuthService);

  plans = signal<Plan[]>([]);
  selectedPlanId = signal<string | null>(null);
  billingCycle = signal<'monthly' | 'yearly'>('monthly');

  get backRoute(): string | null {
    const role = this.auth.user()?.role;
    if (role === 'tenant-admin') return '/tenant-admin/billing';
    return null;
  }

  ngOnInit(): void {
    this.paymentService.getPlans().subscribe((plans) => this.plans.set(plans));
    const preselect = this.route.snapshot.queryParamMap.get('plan');
    if (preselect) this.selectedPlanId.set(preselect);
  }

  selectPlan(planId: string): void {
    this.selectedPlanId.set(planId);
  }

  continueToCheckout(): void {
    const planId = this.selectedPlanId();
    if (!planId) {
      this.helper.showToast('Please select a plan', 'warning');
      return;
    }
    if (this.paymentService.selectPlan(planId)) {
      this.router.navigate(['/payment/checkout']);
    }
  }
}
