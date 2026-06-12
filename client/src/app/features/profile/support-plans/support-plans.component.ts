import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { HelperService } from '../../../core/services/helper.service';

interface SupportPlan {
  id: string;
  name: string;
  price: number | null;
  priceLabel?: string;
  bestFor: string;
  description: string;
  feature: string;
  popular?: boolean;
  cta: string;
  action: 'choose' | 'contact';
}

@Component({
  selector: 'app-support-plans',
  standalone: true,
  imports: [RouterLink, NgClass],
  templateUrl: './support-plans.component.html',
})
export class SupportPlansComponent {
  private readonly helper = inject(HelperService);
  readonly auth = inject(AuthService);

  readonly plans: SupportPlan[] = [
    {
      id: 'basic',
      name: 'BASIC',
      price: 29,
      bestFor: 'Getting started with your first AI agent.',
      description: '',
      feature: '1 simple agent per month (e.g., FAQ bot, message taker, simple call router)',
      cta: 'Choose Basic',
      action: 'choose',
    },
    {
      id: 'standard',
      name: 'STANDARD',
      price: 99,
      bestFor: 'Regular agent development for growing businesses.',
      description: '',
      feature: '1 feature-rich agent OR 2 simple agents per month',
      popular: true,
      cta: 'Choose Standard',
      action: 'choose',
    },
    {
      id: 'premium',
      name: 'PREMIUM',
      price: 499,
      bestFor: 'Complex agents and high-volume development needs.',
      description: '',
      feature: '2 feature-rich agents OR 1 advanced agent per month',
      cta: 'Choose Premium',
      action: 'choose',
    },
    {
      id: 'enterprise',
      name: 'ENTERPRISE',
      price: null,
      priceLabel: 'Custom',
      bestFor: 'Large teams building many agents with custom needs.',
      description: '',
      feature: 'Unlimited agent builds (No monthly limits — build as many as you need)',
      cta: 'Contact Sales',
      action: 'contact',
    },
  ];

  get profileRoute(): string {
    const role = this.auth.user()?.role;
    if (role === 'super-admin') return '/super-admin/profile';
    if (role === 'tenant-admin') return '/tenant-admin/profile';
    return '/employee/profile';
  }

  onPlanAction(plan: SupportPlan): void {
    if (plan.action === 'contact') {
      this.helper.showToast('Our sales team will contact you shortly', 'info');
      return;
    }

    this.helper.showToast(`${plan.name} plan selected — checkout coming soon`, 'success');
  }
}
