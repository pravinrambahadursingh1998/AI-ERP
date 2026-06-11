import { MenuItem } from '../models';

export const SUPER_ADMIN_MENU: MenuItem[] = [
  { label: 'Dashboard', icon: 'lightning', route: '/super-admin/dashboard' },
  { label: 'Tenant Requests', icon: 'requests', route: '/super-admin/tenant-requests' },
  { label: 'Tenants', icon: 'building', route: '/super-admin/tenants' },
  { label: 'Plans', icon: 'book', route: '/super-admin/plans' },
  { label: 'Payments', icon: 'card', route: '/super-admin/payments' },
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
