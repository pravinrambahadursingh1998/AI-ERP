import { Injectable, inject } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { TenantOnboardingService } from './tenant-onboarding.service';
import {
  CheckoutSession,
  Invoice,
  PaymentDetails,
  PaymentMethodType,
  PaymentResult,
  Plan,
} from '../models';

const CHECKOUT_KEY = 'ai_erp_checkout';
const LAST_TXN_KEY = 'ai_erp_last_txn';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly onboarding = inject(TenantOnboardingService);

  private readonly plans: Plan[] = [
    {
      id: 'P-001',
      name: 'Starter',
      price: 49,
      billingCycle: 'monthly',
      features: ['Up to 25 users', 'AI Chat Assistant', 'Basic Reports', 'Email Support'],
      active: true,
    },
    {
      id: 'P-002',
      name: 'Professional',
      price: 149,
      billingCycle: 'monthly',
      features: [
        'Up to 100 users',
        'AI Chat & Reports',
        'Knowledge Base',
        'Priority Support',
        'API Access',
      ],
      active: true,
    },
    {
      id: 'P-003',
      name: 'Enterprise',
      price: 399,
      billingCycle: 'monthly',
      features: [
        'Unlimited users',
        'Full AI Suite',
        'Custom Integrations',
        'Dedicated Support',
        'SLA Guarantee',
      ],
      active: true,
    },
  ];

  private invoices: Invoice[] = [
    {
      id: 'INV-2026-06',
      tenant: 'Acme Corp',
      plan: 'Professional',
      amount: 149,
      tax: 14.9,
      total: 163.9,
      status: 'paid',
      date: '2026-06-01',
      paymentMethod: 'card',
    },
    {
      id: 'INV-2026-05',
      tenant: 'Acme Corp',
      plan: 'Professional',
      amount: 149,
      tax: 14.9,
      total: 163.9,
      status: 'paid',
      date: '2026-05-01',
      paymentMethod: 'card',
    },
    {
      id: 'INV-2026-04',
      tenant: 'Acme Corp',
      plan: 'Professional',
      amount: 149,
      tax: 14.9,
      total: 163.9,
      status: 'paid',
      date: '2026-04-01',
      paymentMethod: 'paypal',
    },
    {
      id: 'INV-2026-03-FAIL',
      tenant: 'RetailMax',
      plan: 'Starter',
      amount: 49,
      tax: 4.9,
      total: 53.9,
      status: 'failed',
      date: '2026-03-28',
      paymentMethod: 'card',
    },
  ];

  getPlans(): Observable<Plan[]> {
    return of([...this.plans]).pipe(delay(200));
  }

  getPlanById(planId: string): Plan | undefined {
    return this.plans.find((p) => p.id === planId);
  }

  selectPlan(planId: string, email?: string): boolean {
    const plan = this.getPlanById(planId);
    if (!plan) return false;

    const tax = +(plan.price * 0.1).toFixed(2);
    const session: CheckoutSession = {
      planId: plan.id,
      planName: plan.name,
      price: plan.price,
      billingCycle: plan.billingCycle,
      tax,
      total: +(plan.price + tax).toFixed(2),
      email: email ?? this.onboarding.getPendingEmail() ?? undefined,
    };
    sessionStorage.setItem(CHECKOUT_KEY, JSON.stringify(session));
    return true;
  }

  setCheckoutEmail(email: string): void {
    const session = this.getCheckoutSession();
    if (session) {
      session.email = email.toLowerCase();
      sessionStorage.setItem(CHECKOUT_KEY, JSON.stringify(session));
    }
  }

  getCheckoutSession(): CheckoutSession | null {
    const raw = sessionStorage.getItem(CHECKOUT_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as CheckoutSession;
    } catch {
      return null;
    }
  }

  clearCheckout(): void {
    sessionStorage.removeItem(CHECKOUT_KEY);
  }

  processPayment(details: PaymentDetails): Observable<PaymentResult> {
    const session = this.getCheckoutSession();
    if (!session) {
      return of({ success: false, errorMessage: 'No active checkout session' }).pipe(delay(400));
    }

    // Demo: card ending in 0000 simulates failure
    if (details.method === 'card' && details.cardNumber.replace(/\s/g, '').endsWith('0000')) {
      return of({
        success: false,
        errorMessage: 'Payment declined. Please try a different card.',
      }).pipe(delay(1200));
    }

    const txnId = `TXN-${Date.now()}`;
    const invoiceId = `INV-${new Date().toISOString().slice(0, 7)}-${String(this.invoices.length + 1).padStart(2, '0')}`;

    const invoice: Invoice = {
      id: invoiceId,
      tenant: 'Acme Corp',
      plan: session.planName,
      amount: session.price,
      tax: session.tax,
      total: session.total,
      status: 'paid',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: details.method,
    };
    this.invoices.unshift(invoice);

    let registrationLink: string | null = null;
    if (session.email) {
      this.onboarding.markPaymentCompleted(session.email, session.planName);
      registrationLink = this.onboarding.sendRegistrationInviteIfReady(session.email);
    }

    sessionStorage.setItem(
      LAST_TXN_KEY,
      JSON.stringify({
        transactionId: txnId,
        invoiceId,
        planName: session.planName,
        total: session.total,
        email: session.email,
        registrationLink,
      })
    );
    this.clearCheckout();

    return of({ success: true, transactionId: txnId, invoiceId, registrationLink: registrationLink ?? undefined }).pipe(delay(1500));
  }

  getLastTransaction(): {
    transactionId: string;
    invoiceId: string;
    planName: string;
    total: number;
    email?: string;
    registrationLink?: string | null;
  } | null {
    const raw = sessionStorage.getItem(LAST_TXN_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  getBillingHistory(): Observable<Invoice[]> {
    return of([...this.invoices]).pipe(delay(300));
  }

  getInvoice(id: string): Invoice | undefined {
    return this.invoices.find((inv) => inv.id === id);
  }

  downloadInvoice(id: string): void {
    const invoice = this.getInvoice(id);
    if (!invoice) return;

    const content = `
AI ERP PLATFORM - INVOICE
=========================
Invoice ID:    ${invoice.id}
Date:          ${invoice.date}
Tenant:        ${invoice.tenant}
Plan:          ${invoice.plan}
Payment Method: ${this.formatMethod(invoice.paymentMethod)}

Subtotal:      $${invoice.amount.toFixed(2)}
Tax (10%):     $${invoice.tax.toFixed(2)}
-----------------------------
Total:         $${invoice.total.toFixed(2)}
Status:        ${invoice.status.toUpperCase()}

Thank you for your business!
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${invoice.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  formatMethod(method: PaymentMethodType): string {
    const labels: Record<PaymentMethodType, string> = {
      card: 'Credit / Debit Card',
      paypal: 'PayPal',
      bank_transfer: 'Bank Transfer',
    };
    return labels[method];
  }
}
