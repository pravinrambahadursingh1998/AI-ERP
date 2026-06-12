import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { User, UserRole } from '../models';

const STORAGE_KEY = 'ai_erp_session';

const DEMO_USERS: Record<string, { password: string; user: User }> = {
  'superadmin@ai-erp.com': {
    password: 'password',
    user: {
      id: '1',
      name: 'Super Admin',
      email: 'superadmin@ai-erp.com',
      role: 'super-admin',
    },
  },
  'admin@company.com': {
    password: 'password',
    user: {
      id: '2',
      name: 'Tenant Admin',
      email: 'admin@company.com',
      role: 'tenant-admin',
      company: 'Acme Corp',
    },
  },
  'employee@company.com': {
    password: 'password',
    user: {
      id: '3',
      name: 'John Employee',
      email: 'employee@company.com',
      role: 'employee',
      company: 'Acme Corp',
    },
  },
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUser = signal<User | null>(this.loadSession());

  readonly user = this.currentUser.asReadonly();
  readonly isAuthenticated = computed(() => !!this.currentUser());
  readonly role = computed(() => this.currentUser()?.role ?? null);

  constructor(private router: Router) {}

  login(email: string, password: string, remember = false): boolean {
    const account = DEMO_USERS[email.toLowerCase()];
    if (!account || account.password !== password) {
      return false;
    }
    this.currentUser.set(account.user);
    if (remember) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(account.user));
    } else {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(account.user));
    }
    return true;
  }

  updateProfile(updates: Partial<Pick<User, 'name'>>): void {
    const current = this.currentUser();
    if (!current) return;

    const updated = { ...current, ...updates };
    this.currentUser.set(updated);

    if (localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } else if (sessionStorage.getItem(STORAGE_KEY)) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    this.router.navigate(['/login']);
  }

  getDashboardRoute(role: UserRole): string {
    const routes: Record<UserRole, string> = {
      'super-admin': '/super-admin/dashboard',
      'tenant-admin': '/tenant-admin/dashboard',
      employee: '/employee/dashboard',
    };
    return routes[role];
  }

  private loadSession(): User | null {
    const stored =
      sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as User;
    } catch {
      return null;
    }
  }
}
