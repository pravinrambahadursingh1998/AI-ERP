import { Injectable, inject } from '@angular/core';
import { HelperService } from './helper.service';

export interface SentEmail {
  to: string;
  subject: string;
  body: string;
  link?: string;
  sentAt: string;
}

const SENT_EMAILS_KEY = 'ai_erp_sent_emails';
const SUPER_ADMIN_EMAIL = 'superadmin@ai-erp.com';

@Injectable({ providedIn: 'root' })
export class EmailService {
  private readonly helper = inject(HelperService);

  sendNewTenantRequestToAdmin(request: {
    id: string;
    companyName: string;
    contactPerson: string;
    email: string;
    industry: string;
    country: string;
    employeeCount: number;
  }): void {
    const reviewLink = `${window.location.origin}/super-admin/tenant-requests`;
    const subject = `New Tenant Registration Request — ${request.companyName}`;
    const body = `Dear Super Admin,

A new organization has submitted a registration request on AI ERP Platform.

Request ID:     ${request.id}
Company:        ${request.companyName}
Contact Person: ${request.contactPerson}
Email:          ${request.email}
Industry:       ${request.industry}
Country:        ${request.country}
Employees:      ${request.employeeCount}

Please review and approve or reject this request:
${reviewLink}

Best regards,
AI ERP Platform`;

    this.storeEmail({ to: SUPER_ADMIN_EMAIL, subject, body, link: reviewLink, sentAt: new Date().toISOString() });

    this.helper.showToast(`Super Admin notified at ${SUPER_ADMIN_EMAIL}`, 'info');
  }

  sendRegistrationInvite(to: string, companyName: string, registrationLink: string): void {
    const subject = 'Complete Your AI ERP Registration';
    const body = `Dear ${companyName} Team,

Your organization has been approved and payment received successfully.

Please complete your full registration to activate your tenant admin account:

${registrationLink}

This link expires in 7 days.

Best regards,
AI ERP Platform Team`;

    this.storeEmail({ to, subject, body, link: registrationLink, sentAt: new Date().toISOString() });

    this.helper.showToast(`Registration email sent to ${to}`, 'success');
    this.helper.showToast(`Demo link: ${registrationLink}`, 'info');
  }

  sendApprovalPendingPayment(to: string, companyName: string): void {
    const subject = 'Your AI ERP Request Has Been Approved';
    const body = `Dear ${companyName} Team,

Your organization registration request has been approved by our team.

Please complete your subscription payment to receive your full registration form link.

Visit: ${window.location.origin}/payment/choose-plan

Best regards,
AI ERP Platform Team`;

    this.storeEmail({ to, subject, body, sentAt: new Date().toISOString() });
    this.helper.showToast(`Approval email sent to ${to}. Awaiting payment.`, 'info');
  }

  getSentEmails(): SentEmail[] {
    const raw = localStorage.getItem(SENT_EMAILS_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as SentEmail[];
    } catch {
      return [];
    }
  }

  private storeEmail(email: SentEmail): void {
    const emails = this.getSentEmails();
    emails.unshift(email);
    localStorage.setItem(SENT_EMAILS_KEY, JSON.stringify(emails.slice(0, 20)));
  }
}
