export type UserRole = 'super-admin' | 'tenant-admin' | 'employee';
export type PortalType = 'super-admin' | 'tenant-admin' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company?: string;
  tenantId?: string;
  tenantRoleId?: string;
  avatar?: string;
}

export type TenantUserRole = 'Manager' | 'Employee';

export type TenantRoleColor = 'bg-brand-500' | 'bg-violet-500' | 'bg-emerald-500' | 'bg-amber-500' | 'bg-rose-500';

export type ModuleKey = string;

export interface AppModule {
  key: ModuleKey;
  label: string;
  description: string;
  portal: PortalType;
  route?: string;
  icon: string;
  group?: string;
}

export interface TenantModuleSettings {
  tenantId: string;
  enabledModules: ModuleKey[];
  updatedAt: string;
}

export interface TenantRole {
  id: string;
  name: string;
  users: number;
  permissions: ModuleKey[];
  color: TenantRoleColor;
  isSystemRole?: boolean;
}

export interface TenantUser {
  id: number;
  name: string;
  email: string;
  role: TenantUserRole;
  roleId: string;
  status: 'active' | 'inactive';
  /** Optional per-user module overrides (falls back to role permissions). */
  modulePermissions?: ModuleKey[];
}

export interface TenantRequest {
  id: string;
  companyName: string;
  industry: string;
  contactPerson: string;
  email: string;
  mobile: string;
  employeeCount: number;
  country: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface Tenant {
  id: string;
  companyName: string;
  industry: string;
  plan: string;
  status: 'active' | 'suspended' | 'pending';
  users: number;
  createdAt: string;
  contactPerson: string;
  email: string;
  mobile: string;
  country: string;
  website?: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  active: boolean;
}

export interface Payment {
  id: string;
  tenant: string;
  amount: number;
  plan: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  date: string;
}

export interface Subscription {
  id: string;
  tenantId: string;
  tenant: string;
  planId: string;
  plan: string;
  amount: number;
  billingCycle: 'monthly' | 'yearly';
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  startDate: string;
  renewalDate: string;
}

export interface Refund {
  id: string;
  paymentId: string;
  tenant: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requestedAt: string;
  processedAt?: string;
}

export type PaymentMethodType = 'card' | 'paypal' | 'bank_transfer';

export interface Invoice {
  id: string;
  tenant: string;
  plan: string;
  amount: number;
  tax: number;
  total: number;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  date: string;
  paymentMethod: PaymentMethodType;
}

export interface CheckoutSession {
  planId: string;
  planName: string;
  price: number;
  billingCycle: string;
  tax: number;
  total: number;
  email?: string;
}

export interface TenantOnboarding {
  requestId: string;
  email: string;
  companyName: string;
  industry: string;
  contactPerson: string;
  mobile: string;
  country: string;
  employeeCount: number;
  approved: boolean;
  paymentCompleted: boolean;
  planName?: string;
  inviteToken?: string;
  inviteSent: boolean;
  registrationCompleted: boolean;
  createdAt: string;
}

export interface FullRegistrationData {
  companyName: string;
  industry: string;
  contactPerson: string;
  email: string;
  mobile: string;
  country: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  website: string;
  taxId: string;
  adminPassword: string;
}

export interface CardPaymentDetails {
  method: 'card';
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

export interface PayPalPaymentDetails {
  method: 'paypal';
  email: string;
}

export interface BankTransferDetails {
  method: 'bank_transfer';
  accountName: string;
  accountNumber: string;
  bankName: string;
}

export type PaymentDetails = CardPaymentDetails | PayPalPaymentDetails | BankTransferDetails;

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  invoiceId?: string;
  registrationLink?: string;
  errorMessage?: string;
}

export interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  /** Unique key used for dynamic module permissions. */
  moduleKey?: string;
  children?: MenuItem[];
  /** Match only the exact route (no child paths). */
  exact?: boolean;
  /** Highlight when the current URL starts with this prefix (and is not the parent list route). */
  activePrefix?: string;
  queryParams?: Record<string, string>;
  /** Do not highlight when any of these query params are present. */
  withoutQueryParams?: string[];
}
