import { Injectable, inject } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { FullRegistrationData, TenantOnboarding, TenantRequest } from '../models';
import { EmailService } from './email.service';

const ONBOARDING_KEY = 'ai_erp_onboarding';
const PENDING_EMAIL_KEY = 'ai_erp_pending_tenant_email';

@Injectable({ providedIn: 'root' })
export class TenantOnboardingService {
  private readonly emailService = inject(EmailService);

  private getRecords(): TenantOnboarding[] {
    const raw = localStorage.getItem(ONBOARDING_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as TenantOnboarding[];
    } catch {
      return [];
    }
  }

  private saveRecords(records: TenantOnboarding[]): void {
    localStorage.setItem(ONBOARDING_KEY, JSON.stringify(records));
  }

  createFromSignup(request: TenantRequest): void {
    const records = this.getRecords();
    const existing = records.find((r) => r.email === request.email.toLowerCase());
    if (existing) return;

    const record: TenantOnboarding = {
      requestId: request.id,
      email: request.email.toLowerCase(),
      companyName: request.companyName,
      industry: request.industry,
      contactPerson: request.contactPerson,
      mobile: request.mobile,
      country: request.country,
      employeeCount: request.employeeCount,
      approved: false,
      paymentCompleted: false,
      inviteSent: false,
      registrationCompleted: false,
      createdAt: new Date().toISOString(),
    };
    records.push(record);
    this.saveRecords(records);
    this.setPendingEmail(request.email);
  }

  setPendingEmail(email: string): void {
    sessionStorage.setItem(PENDING_EMAIL_KEY, email.toLowerCase());
  }

  getPendingEmail(): string | null {
    return sessionStorage.getItem(PENDING_EMAIL_KEY);
  }

  ensureFromRequest(request: TenantRequest): void {
    const records = this.getRecords();
    if (!records.find((r) => r.requestId === request.id)) {
      this.createFromSignup(request);
    }
  }

  markApproved(requestId: string): TenantOnboarding | null {
    const records = this.getRecords();
    let record = records.find((r) => r.requestId === requestId);
    if (!record) return null;

    record.approved = true;
    this.saveRecords(records);
    this.setPendingEmail(record.email);

    if (record.paymentCompleted) {
      this.sendRegistrationInviteIfReady(record.email);
    } else {
      this.emailService.sendApprovalPendingPayment(record.email, record.companyName);
    }
    return record;
  }

  markPaymentCompleted(email: string, planName: string): TenantOnboarding | null {
    const records = this.getRecords();
    const record = records.find((r) => r.email === email.toLowerCase());
    if (!record) return null;

    record.paymentCompleted = true;
    record.planName = planName;
    this.saveRecords(records);

    if (record.approved) {
      this.sendRegistrationInviteIfReady(record.email);
    }
    return record;
  }

  sendRegistrationInviteIfReady(email: string): string | null {
    const records = this.getRecords();
    const record = records.find((r) => r.email === email.toLowerCase());
    if (!record || !record.approved || !record.paymentCompleted || record.registrationCompleted) {
      return null;
    }

    if (!record.inviteToken) {
      record.inviteToken = this.generateToken();
    }
    record.inviteSent = true;
    this.saveRecords(records);

    const link = `${window.location.origin}/complete-registration?token=${record.inviteToken}`;
    this.emailService.sendRegistrationInvite(record.email, record.companyName, link);
    return link;
  }

  getByToken(token: string): TenantOnboarding | null {
    const record = this.getRecords().find((r) => r.inviteToken === token);
    if (!record || record.registrationCompleted) return null;
    if (!record.approved || !record.paymentCompleted) return null;
    return record;
  }

  completeRegistration(token: string, data: FullRegistrationData): Observable<boolean> {
    const records = this.getRecords();
    const record = records.find((r) => r.inviteToken === token);
    if (!record) return of(false).pipe(delay(400));

    record.registrationCompleted = true;
    record.companyName = data.companyName;
    record.contactPerson = data.contactPerson;
    record.mobile = data.mobile;
    record.country = data.country;
    this.saveRecords(records);
    sessionStorage.removeItem(PENDING_EMAIL_KEY);

    return of(true).pipe(delay(800));
  }

  getOnboardingStatus(email: string): TenantOnboarding | undefined {
    return this.getRecords().find((r) => r.email === email.toLowerCase());
  }

  private generateToken(): string {
    return `REG-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }
}
