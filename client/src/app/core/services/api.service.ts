import { Injectable, inject } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Payment, Plan, Tenant, TenantPermission, TenantRequest, TenantRole, TenantUser } from '../models';
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
    },
    {
      id: 'T-002',
      companyName: 'EduPrime University',
      industry: 'Education',
      plan: 'Enterprise',
      status: 'active',
      users: 320,
      createdAt: '2026-03-20',
    },
    {
      id: 'T-003',
      companyName: 'RetailMax',
      industry: 'Retail',
      plan: 'Starter',
      status: 'suspended',
      users: 42,
      createdAt: '2025-11-08',
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

  getTenantRequests(): Observable<TenantRequest[]> {
    return of([...this.tenantRequests]).pipe(delay(300));
  }

  getTenants(): Observable<Tenant[]> {
    return of([...this.tenants]).pipe(delay(300));
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
