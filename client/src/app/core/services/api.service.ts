import { Injectable, inject } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  Invoice,
  Payment,
  PaymentMethodType,
  Plan,
  Refund,
  Subscription,
  Tenant,
  TenantPermission,
  TenantRequest,
  TenantRole,
  TenantUser,
} from '../models';
import { TenantOnboardingService } from './tenant-onboarding.service';
import { EmailService } from './email.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly onboarding = inject(TenantOnboardingService);
  private readonly emailService = inject(EmailService);
  private tenantRequests: TenantRequest[] = [
    {
      id: 'TR-001',
      companyName: 'TechVision Ltd',
      industry: 'Technology',
      contactPerson: 'Sarah Johnson',
      email: 'sarah@techvision.com',
      mobile: '+1 555-0101',
      employeeCount: 120,
      country: 'United States',
      status: 'pending',
      submittedAt: '2026-06-08',
    },
    {
      id: 'TR-002',
      companyName: 'GreenHealth Hospital',
      industry: 'Healthcare',
      contactPerson: 'Dr. Michael Chen',
      email: 'mchen@greenhealth.org',
      mobile: '+1 555-0102',
      employeeCount: 450,
      country: 'Canada',
      status: 'pending',
      submittedAt: '2026-06-09',
    },
    {
      id: 'TR-003',
      companyName: 'EduPrime University',
      industry: 'Education',
      contactPerson: 'Emily Davis',
      email: 'emily@eduprime.edu',
      mobile: '+44 20 7946 0958',
      employeeCount: 800,
      country: 'United Kingdom',
      status: 'approved',
      submittedAt: '2026-06-01',
    },
  ];

  private tenants: Tenant[] = [
    {
      id: 'T-001',
      companyName: 'Acme Corp',
      industry: 'Manufacturing',
      plan: 'Professional',
      status: 'active',
      users: 85,
      createdAt: '2026-01-15',
      contactPerson: 'John Smith',
      email: 'admin@acmecorp.com',
      mobile: '+1 555-0201',
      country: 'United States',
      website: 'https://acmecorp.com',
    },
    {
      id: 'T-002',
      companyName: 'EduPrime University',
      industry: 'Education',
      plan: 'Enterprise',
      status: 'active',
      users: 320,
      createdAt: '2026-03-20',
      contactPerson: 'Emily Davis',
      email: 'emily@eduprime.edu',
      mobile: '+44 20 7946 0958',
      country: 'United Kingdom',
      website: 'https://eduprime.edu',
    },
    {
      id: 'T-003',
      companyName: 'RetailMax',
      industry: 'Retail',
      plan: 'Starter',
      status: 'suspended',
      users: 42,
      createdAt: '2025-11-08',
      contactPerson: 'Lisa Park',
      email: 'ops@retailmax.com',
      mobile: '+1 555-0203',
      country: 'Canada',
    },
  ];

  private plans: Plan[] = [
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

  private tenantRoles: TenantRole[] = [
    {
      id: 'R-001',
      name: 'Tenant Admin',
      users: 2,
      permissions: ['Users', 'Reports', 'AI Chat', 'AI Dashboard', 'Billing', 'Knowledge Base', 'Settings'],
      color: 'bg-brand-500',
    },
    {
      id: 'R-002',
      name: 'Manager',
      users: 8,
      permissions: ['Users', 'Reports', 'AI Chat'],
      color: 'bg-violet-500',
    },
    {
      id: 'R-003',
      name: 'Employee',
      users: 75,
      permissions: ['AI Chat', 'My Reports'],
      color: 'bg-emerald-500',
    },
  ];

  private tenantUsers: TenantUser[] = [
    { id: 1, name: 'John Doe', email: 'john@acme.com', role: 'Manager', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@acme.com', role: 'Employee', status: 'active' },
    { id: 3, name: 'Bob Wilson', email: 'bob@acme.com', role: 'Employee', status: 'inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice@acme.com', role: 'Manager', status: 'active' },
    { id: 5, name: 'Charlie Davis', email: 'charlie@acme.com', role: 'Employee', status: 'active' },
  ];

  private payments: Payment[] = [
    {
      id: 'PAY-001',
      tenant: 'Acme Corp',
      amount: 149,
      plan: 'Professional',
      status: 'completed',
      date: '2026-06-01',
    },
    {
      id: 'PAY-002',
      tenant: 'EduPrime University',
      amount: 399,
      plan: 'Enterprise',
      status: 'completed',
      date: '2026-06-01',
    },
    {
      id: 'PAY-003',
      tenant: 'RetailMax',
      amount: 49,
      plan: 'Starter',
      status: 'failed',
      date: '2026-05-28',
    },
  ];

  private subscriptions: Subscription[] = [
    {
      id: 'SUB-001',
      tenantId: 'T-001',
      tenant: 'Acme Corp',
      planId: 'P-002',
      plan: 'Professional',
      amount: 149,
      billingCycle: 'monthly',
      status: 'active',
      startDate: '2026-01-15',
      renewalDate: '2026-07-01',
    },
    {
      id: 'SUB-002',
      tenantId: 'T-002',
      tenant: 'EduPrime University',
      planId: 'P-003',
      plan: 'Enterprise',
      amount: 399,
      billingCycle: 'monthly',
      status: 'active',
      startDate: '2026-03-20',
      renewalDate: '2026-07-01',
    },
    {
      id: 'SUB-003',
      tenantId: 'T-003',
      tenant: 'RetailMax',
      planId: 'P-001',
      plan: 'Starter',
      amount: 49,
      billingCycle: 'monthly',
      status: 'past_due',
      startDate: '2025-11-08',
      renewalDate: '2026-06-08',
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
      tenant: 'EduPrime University',
      plan: 'Enterprise',
      amount: 399,
      tax: 39.9,
      total: 438.9,
      status: 'paid',
      date: '2026-06-01',
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
      date: '2026-05-01',
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
      date: '2026-05-28',
      paymentMethod: 'card',
    },
  ];

  private refunds: Refund[] = [
    {
      id: 'REF-001',
      paymentId: 'PAY-001',
      tenant: 'Acme Corp',
      amount: 50,
      reason: 'Partial service outage credit',
      status: 'completed',
      requestedAt: '2026-05-15',
      processedAt: '2026-05-16',
    },
    {
      id: 'REF-002',
      paymentId: 'PAY-002',
      tenant: 'EduPrime University',
      amount: 399,
      reason: 'Duplicate charge',
      status: 'pending',
      requestedAt: '2026-06-10',
    },
  ];

  getTenantRequests(): Observable<TenantRequest[]> {
    return of([...this.tenantRequests]).pipe(delay(300));
  }

  getTenants(): Observable<Tenant[]> {
    return of([...this.tenants]).pipe(delay(300));
  }

  getTenant(id: string): Observable<Tenant | undefined> {
    return of(this.tenants.find((t) => t.id === id)).pipe(delay(300));
  }

  suspendTenant(id: string): Observable<Tenant | undefined> {
    const tenant = this.tenants.find((t) => t.id === id);
    if (tenant?.status === 'active') {
      tenant.status = 'suspended';
    }
    return of(tenant).pipe(delay(300));
  }

  activateTenant(id: string): Observable<Tenant | undefined> {
    const tenant = this.tenants.find((t) => t.id === id);
    if (tenant?.status === 'suspended') {
      tenant.status = 'active';
    }
    return of(tenant).pipe(delay(300));
  }

  getPlans(): Observable<Plan[]> {
    return of([...this.plans]).pipe(delay(300));
  }

  getTenantUsers(): Observable<TenantUser[]> {
    return of([...this.tenantUsers]).pipe(delay(300));
  }

  getTenantRoles(): Observable<TenantRole[]> {
    return of([...this.tenantRoles]).pipe(delay(300));
  }

  getTenantRole(id: string): Observable<TenantRole | undefined> {
    return of(this.tenantRoles.find((r) => r.id === id)).pipe(delay(300));
  }

  updateTenantRole(
    id: string,
    data: Pick<TenantRole, 'name' | 'permissions' | 'color'>
  ): Observable<TenantRole | undefined> {
    const role = this.tenantRoles.find((r) => r.id === id);
    if (role) {
      role.name = data.name;
      role.permissions = [...data.permissions] as TenantPermission[];
      role.color = data.color;
    }
    return of(role).pipe(delay(500));
  }

  createTenantUser(data: Omit<TenantUser, 'id'>): Observable<TenantUser> {
    const user: TenantUser = {
      ...data,
      id: Math.max(0, ...this.tenantUsers.map((u) => u.id)) + 1,
    };
    this.tenantUsers.push(user);
    return of(user).pipe(delay(500));
  }

  createPlan(data: Omit<Plan, 'id'>): Observable<Plan> {
    const plan: Plan = {
      ...data,
      id: `P-${String(this.plans.length + 1).padStart(3, '0')}`,
    };
    this.plans.push(plan);
    return of(plan).pipe(delay(500));
  }

  getPayments(): Observable<Payment[]> {
    return of([...this.payments]).pipe(delay(300));
  }

  getSubscriptions(): Observable<Subscription[]> {
    return of([...this.subscriptions]).pipe(delay(300));
  }

  cancelSubscription(id: string): Observable<Subscription | undefined> {
    const sub = this.subscriptions.find((s) => s.id === id);
    if (sub?.status === 'active' || sub?.status === 'past_due' || sub?.status === 'trialing') {
      sub.status = 'cancelled';
    }
    return of(sub).pipe(delay(500));
  }

  getPlan(id: string): Observable<Plan | undefined> {
    return of(this.plans.find((p) => p.id === id)).pipe(delay(300));
  }

  updatePlan(id: string, data: Partial<Pick<Plan, 'features' | 'active'>>): Observable<Plan | undefined> {
    const plan = this.plans.find((p) => p.id === id);
    if (plan) {
      if (data.features) plan.features = [...data.features];
      if (data.active !== undefined) plan.active = data.active;
    }
    return of(plan).pipe(delay(500));
  }

  getInvoices(): Observable<Invoice[]> {
    return of([...this.invoices]).pipe(delay(300));
  }

  getInvoice(id: string): Observable<Invoice | undefined> {
    return of(this.invoices.find((inv) => inv.id === id)).pipe(delay(300));
  }

  downloadInvoice(id: string): void {
    const invoice = this.invoices.find((inv) => inv.id === id);
    if (!invoice) return;

    const content = `
AI ERP PLATFORM - INVOICE
=========================
Invoice ID:    ${invoice.id}
Date:          ${invoice.date}
Tenant:        ${invoice.tenant}
Plan:          ${invoice.plan}
Payment Method: ${this.formatPaymentMethod(invoice.paymentMethod)}

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

  getRefunds(): Observable<Refund[]> {
    return of([...this.refunds]).pipe(delay(300));
  }

  processRefund(
    paymentId: string,
    amount: number,
    reason: string,
    approve: boolean
  ): Observable<Refund | undefined> {
    const payment = this.payments.find((p) => p.id === paymentId);
    if (!payment) return of(undefined).pipe(delay(500));

    const refund: Refund = {
      id: `REF-${String(this.refunds.length + 1).padStart(3, '0')}`,
      paymentId,
      tenant: payment.tenant,
      amount,
      reason,
      status: approve ? 'completed' : 'rejected',
      requestedAt: new Date().toISOString().split('T')[0],
      processedAt: new Date().toISOString().split('T')[0],
    };
    this.refunds.unshift(refund);

    if (approve) {
      payment.status = 'refunded';
      const invoice = this.invoices.find(
        (inv) => inv.tenant === payment.tenant && inv.plan === payment.plan && inv.status === 'paid'
      );
      if (invoice) invoice.status = 'refunded';
    }

    return of(refund).pipe(delay(500));
  }

  private formatPaymentMethod(method: PaymentMethodType): string {
    const labels: Record<PaymentMethodType, string> = {
      card: 'Credit / Debit Card',
      paypal: 'PayPal',
      bank_transfer: 'Bank Transfer',
    };
    return labels[method];
  }

  submitTenantRequest(data: Omit<TenantRequest, 'id' | 'status' | 'submittedAt'>): Observable<TenantRequest> {
    const request: TenantRequest = {
      ...data,
      id: `TR-${String(this.tenantRequests.length + 1).padStart(3, '0')}`,
      status: 'pending',
      submittedAt: new Date().toISOString().split('T')[0],
    };
    this.tenantRequests.unshift(request);
    this.onboarding.createFromSignup(request);
    this.emailService.sendNewTenantRequestToAdmin(request);
    return of(request).pipe(delay(500));
  }

  approveTenantRequest(id: string): Observable<{ success: boolean; email?: string }> {
    const req = this.tenantRequests.find((r) => r.id === id);
    if (req) {
      req.status = 'approved';
      this.onboarding.ensureFromRequest(req);
      this.onboarding.markApproved(id);
      return of({ success: true, email: req.email }).pipe(delay(300));
    }
    return of({ success: false }).pipe(delay(300));
  }

  rejectTenantRequest(id: string): Observable<boolean> {
    const req = this.tenantRequests.find((r) => r.id === id);
    if (req) req.status = 'rejected';
    return of(!!req).pipe(delay(300));
  }
}
