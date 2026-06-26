import { MenuItem } from '../models';

export const SUPER_ADMIN_MENU: MenuItem[] = [
  { label: 'Dashboard', icon: 'lightning', route: '/super-admin/dashboard', moduleKey: 'dashboard' },
  {
    label: 'Tenant Management',
    icon: 'building',
    children: [
      {
        label: 'Tenant Requests',
        icon: 'requests',
        route: '/super-admin/tenant-requests',
        moduleKey: 'tenant-requests',
      },
      {
        label: 'Tenant List',
        icon: 'building',
        route: '/super-admin/tenants',
        exact: true,
        withoutQueryParams: ['status'],
        moduleKey: 'tenant-list',
      },
      {
        label: 'Tenant Details',
        icon: 'users',
        route: '/super-admin/tenants',
        activePrefix: '/super-admin/tenants/',
        moduleKey: 'tenant-details',
      },
      {
        label: 'Tenant Approval',
        icon: 'shield',
        route: '/super-admin/tenant-requests',
        moduleKey: 'tenant-approval',
      },
      {
        label: 'Tenant Suspension',
        icon: 'shield',
        route: '/super-admin/tenants',
        queryParams: { status: 'suspended' },
        moduleKey: 'tenant-suspension',
      },
    ],
  },
  {
    label: 'Subscription Management',
    icon: 'book',
    children: [
      {
        label: 'Subscriptions',
        icon: 'book',
        route: '/super-admin/subscriptions',
        moduleKey: 'subscriptions',
      },
      {
        label: 'Plans',
        icon: 'book',
        route: '/super-admin/plans',
        exact: true,
        moduleKey: 'plans',
      },
      {
        label: 'Create Plan',
        icon: 'book',
        route: '/super-admin/plans/create',
        moduleKey: 'create-plan',
      },
      {
        label: 'Plan Features',
        icon: 'book',
        route: '/super-admin/plan-features',
        moduleKey: 'plan-features',
      },
    ],
  },
  {
    label: 'Payment Management',
    icon: 'card',
    children: [
      {
        label: 'Payments',
        icon: 'card',
        route: '/super-admin/payments',
        moduleKey: 'payments',
      },
      {
        label: 'Invoices',
        icon: 'card',
        route: '/super-admin/invoices',
        moduleKey: 'invoices',
      },
      {
        label: 'Refund Management',
        icon: 'card',
        route: '/super-admin/refunds',
        moduleKey: 'refunds',
      },
    ],
  },
  {
    label: 'AI Dashboard',
    icon: 'chart',
    route: '/super-admin/ai-dashboard',
    moduleKey: 'ai-dashboard',
  },
  {
    label: 'Module Settings',
    icon: 'shield',
    route: '/super-admin/module-settings',
    moduleKey: 'module-settings',
  },
];

export const TENANT_ADMIN_MENU: MenuItem[] = [
  { label: 'Dashboard', icon: 'lightning', route: '/tenant-admin/dashboard', moduleKey: 'dashboard' },
  { label: 'Users', icon: 'users', route: '/tenant-admin/users', moduleKey: 'users' },
  { label: 'Roles', icon: 'shield', route: '/tenant-admin/roles', moduleKey: 'roles' },
  { label: 'AI Chat', icon: 'chat', route: '/tenant-admin/ai-chat', moduleKey: 'ai-chat' },
  {
    label: 'AI Dashboard',
    icon: 'chart',
    route: '/tenant-admin/ai-dashboard',
    moduleKey: 'ai-dashboard',
  },
  { label: 'Billing', icon: 'card', route: '/tenant-admin/billing', moduleKey: 'billing' },
  {
    label: 'Module Settings',
    icon: 'shield',
    route: '/tenant-admin/module-settings',
    moduleKey: 'module-settings',
  },
];

export const EMPLOYEE_MENU: MenuItem[] = [
  { label: 'Dashboard', icon: 'lightning', route: '/employee/dashboard', moduleKey: 'dashboard' },
  { label: 'AI Chat', icon: 'chat', route: '/employee/ai-chat', moduleKey: 'ai-chat' },
];
