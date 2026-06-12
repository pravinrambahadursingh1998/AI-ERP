import { MenuItem } from '../models';

export const SUPER_ADMIN_MENU: MenuItem[] = [
  { label: 'Dashboard', icon: 'lightning', route: '/super-admin/dashboard' },
  {
    label: 'Tenant Management',
    icon: 'building',
    children: [
      { label: 'Tenant Requests', icon: 'requests', route: '/super-admin/tenant-requests' },
      {
        label: 'Tenant List',
        icon: 'building',
        route: '/super-admin/tenants',
        exact: true,
        withoutQueryParams: ['status'],
      },
      {
        label: 'Tenant Details',
        icon: 'users',
        route: '/super-admin/tenants',
        activePrefix: '/super-admin/tenants/',
      },
      { label: 'Tenant Approval', icon: 'shield', route: '/super-admin/tenant-requests' },
      {
        label: 'Tenant Suspension',
        icon: 'shield',
        route: '/super-admin/tenants',
        queryParams: { status: 'suspended' },
      },
    ],
  },
  {
    label: 'Subscription Management',
    icon: 'book',
    children: [
      { label: 'Subscriptions', icon: 'book', route: '/super-admin/subscriptions' },
      { label: 'Plans', icon: 'book', route: '/super-admin/plans', exact: true },
      { label: 'Create Plan', icon: 'book', route: '/super-admin/plans/create' },
      { label: 'Plan Features', icon: 'book', route: '/super-admin/plan-features' },
    ],
  },
  {
    label: 'Payment Management',
    icon: 'card',
    children: [
      { label: 'Payments', icon: 'card', route: '/super-admin/payments' },
      { label: 'Invoices', icon: 'card', route: '/super-admin/invoices' },
      { label: 'Refund Management', icon: 'card', route: '/super-admin/refunds' },
    ],
  },
  { label: 'AI Dashboard', icon: 'chart', route: '/super-admin/ai-dashboard' },
];

export const TENANT_ADMIN_MENU: MenuItem[] = [
  { label: 'Dashboard', icon: 'lightning', route: '/tenant-admin/dashboard' },
  { label: 'Users', icon: 'users', route: '/tenant-admin/users' },
  { label: 'Roles', icon: 'shield', route: '/tenant-admin/roles' },
  { label: 'AI Chat', icon: 'chat', route: '/tenant-admin/ai-chat' },
  { label: 'AI Dashboard', icon: 'chart', route: '/tenant-admin/ai-dashboard' },
  { label: 'Billing', icon: 'card', route: '/tenant-admin/billing' },
];

export const EMPLOYEE_MENU: MenuItem[] = [
  { label: 'Dashboard', icon: 'lightning', route: '/employee/dashboard' },
  { label: 'AI Chat', icon: 'chat', route: '/employee/ai-chat' },
];
