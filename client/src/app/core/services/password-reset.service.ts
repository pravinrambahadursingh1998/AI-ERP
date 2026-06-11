import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

const RESET_SESSION_KEY = 'ai_erp_password_reset';

interface ResetSession {
  email: string;
  otp: string;
  expiresAt: number;
  verified: boolean;
}

const REGISTERED_EMAILS = [
  'superadmin@ai-erp.com',
  'admin@company.com',
  'employee@company.com',
];

@Injectable({ providedIn: 'root' })
export class PasswordResetService {
  sendOtp(email: string): Observable<{ success: boolean; demoOtp?: string }> {
    const normalized = email.toLowerCase().trim();
    if (!REGISTERED_EMAILS.includes(normalized)) {
      return of({ success: false }).pipe(delay(600));
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const session: ResetSession = {
      email: normalized,
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
      verified: false,
    };
    sessionStorage.setItem(RESET_SESSION_KEY, JSON.stringify(session));

    return of({ success: true, demoOtp: otp }).pipe(delay(800));
  }

  verifyOtp(email: string, otp: string): boolean {
    const session = this.getSession();
    if (!session) return false;
    if (session.email !== email.toLowerCase().trim()) return false;
    if (Date.now() > session.expiresAt) return false;
    if (session.otp !== otp.trim()) return false;

    session.verified = true;
    sessionStorage.setItem(RESET_SESSION_KEY, JSON.stringify(session));
    return true;
  }

  isVerified(): boolean {
    const session = this.getSession();
    return !!session?.verified && Date.now() <= session.expiresAt;
  }

  getVerifiedEmail(): string | null {
    const session = this.getSession();
    if (!session?.verified || Date.now() > session.expiresAt) return null;
    return session.email;
  }

  resetPassword(newPassword: string): Observable<boolean> {
    if (!this.isVerified() || newPassword.length < 8) {
      return of(false).pipe(delay(400));
    }
    sessionStorage.removeItem(RESET_SESSION_KEY);
    return of(true).pipe(delay(600));
  }

  resendOtp(): Observable<{ success: boolean; demoOtp?: string }> {
    const session = this.getSession();
    if (!session) return of({ success: false });
    return this.sendOtp(session.email);
  }

  clearSession(): void {
    sessionStorage.removeItem(RESET_SESSION_KEY);
  }

  private getSession(): ResetSession | null {
    const raw = sessionStorage.getItem(RESET_SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as ResetSession;
    } catch {
      return null;
    }
  }
}
