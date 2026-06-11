import { Component, inject, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Plan } from '../../../core/models';
import { PaymentService } from '../../../core/services/payment.service';
import { HelperService } from '../../../core/services/helper.service';

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

  plans = signal<Plan[]>([]);
  selectedPlanId = signal<string | null>(null);
  billingCycle = signal<'monthly' | 'yearly'>('monthly');

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
