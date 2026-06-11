import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import {
  SUPER_ADMIN_MENU,
  TENANT_ADMIN_MENU,
  EMPLOYEE_MENU,
} from './core/config/menu.config';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/public-layout/public-layout.component').then(
        (m) => m.PublicLayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/public/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'pricing',
        loadComponent: () =>
          import('./features/public/pricing/pricing.component').then((m) => m.PricingComponent),
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./features/auth/signup/signup.component').then((m) => m.SignupComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./features/auth/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent
      ),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./features/auth/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent
      ),
  },
  {
    path: 'complete-registration',
    loadComponent: () =>
      import('./features/auth/complete-registration/complete-registration.component').then(
        (m) => m.CompleteRegistrationComponent
      ),
  },
  {
    path: 'payment',
    loadComponent: () =>
      import('./layouts/payment-layout/payment-layout.component').then(
        (m) => m.PaymentLayoutComponent
      ),
    children: [
      { path: '', redirectTo: 'choose-plan', pathMatch: 'full' },
      {
        path: 'choose-plan',
        loadComponent: () =>
          import('./features/payment/choose-plan/choose-plan.component').then(
            (m) => m.ChoosePlanComponent
          ),
      },
      {
        path: 'checkout',
        loadComponent: () =>
          import('./features/payment/checkout/checkout.component').then(
            (m) => m.CheckoutComponent
          ),
      },
      {
        path: 'success',
        loadComponent: () =>
          import('./features/payment/payment-success/payment-success.component').then(
            (m) => m.PaymentSuccessComponent
          ),
      },
      {
        path: 'failed',
        loadComponent: () =>
          import('./features/payment/payment-failed/payment-failed.component').then(
            (m) => m.PaymentFailedComponent
          ),
      },
      {
        path: 'billing-history',
        loadComponent: () =>
          import('./features/payment/billing-history/billing-history.component').then(
            (m) => m.BillingHistoryComponent
          ),
      },
    ],
  },
  {
    path: 'super-admin',
    loadComponent: () =>
      import('./layouts/dashboard-layout/dashboard-layout.component').then(
        (m) => m.DashboardLayoutComponent
      ),
    canActivate: [authGuard],
    data: { role: 'super-admin', menu: SUPER_ADMIN_MENU, title: 'Super Admin' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/super-admin/dashboard/super-admin-dashboard.component').then(
            (m) => m.SuperAdminDashboardComponent
          ),
      },
      {
        path: 'tenant-requests',
        loadComponent: () =>
          import('./features/super-admin/tenant-requests/tenant-requests.component').then(
            (m) => m.TenantRequestsComponent
          ),
      },
      {
        path: 'tenants',
        loadComponent: () =>
          import('./features/super-admin/tenants/tenants.component').then(
            (m) => m.TenantsComponent
          ),
      },
      {
        path: 'plans',
        loadComponent: () =>
          import('./features/super-admin/plans/plans.component').then((m) => m.PlansComponent),
      },
      {
        path: 'payments',
        loadComponent: () =>
          import('./features/super-admin/payments/payments.component').then(
            (m) => m.PaymentsComponent
          ),
      },
      {
        path: 'ai-dashboard',
        loadComponent: () =>
          import('./features/super-admin/ai-dashboard/super-admin-ai-dashboard.component').then(
            (m) => m.SuperAdminAiDashboardComponent
          ),
      },
    ],
  },
  {
    path: 'tenant-admin',
    loadComponent: () =>
      import('./layouts/dashboard-layout/dashboard-layout.component').then(
        (m) => m.DashboardLayoutComponent
      ),
    canActivate: [authGuard],
    data: { role: 'tenant-admin', menu: TENANT_ADMIN_MENU, title: 'Tenant Admin' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/tenant-admin/dashboard/tenant-admin-dashboard.component').then(
            (m) => m.TenantAdminDashboardComponent
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/tenant-admin/users/users.component').then((m) => m.UsersComponent),
      },
      {
        path: 'roles',
        loadComponent: () =>
          import('./features/tenant-admin/roles/roles.component').then((m) => m.RolesComponent),
      },
      {
        path: 'ai-chat',
        loadComponent: () =>
          import('./features/tenant-admin/ai-chat/tenant-ai-chat.component').then(
            (m) => m.TenantAiChatComponent
          ),
      },
      {
        path: 'ai-dashboard',
        loadComponent: () =>
          import('./features/tenant-admin/ai-dashboard/tenant-admin-ai-dashboard.component').then(
            (m) => m.TenantAdminAiDashboardComponent
          ),
      },
      {
        path: 'billing',
        loadComponent: () =>
          import('./features/tenant-admin/billing/billing.component').then(
            (m) => m.BillingComponent
          ),
      },
    ],
  },
  {
    path: 'employee',
    loadComponent: () =>
      import('./layouts/dashboard-layout/dashboard-layout.component').then(
        (m) => m.DashboardLayoutComponent
      ),
    canActivate: [authGuard],
    data: { role: 'employee', menu: EMPLOYEE_MENU, title: 'Employee Portal' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/employee/dashboard/employee-dashboard.component').then(
            (m) => m.EmployeeDashboardComponent
          ),
      },
      {
        path: 'ai-chat',
        loadComponent: () =>
          import('./features/employee/ai-chat/employee-ai-chat.component').then(
            (m) => m.EmployeeAiChatComponent
          ),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
