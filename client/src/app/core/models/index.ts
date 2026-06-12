export type UserRole = 'super-admin' | 'tenant-admin' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company?: string;
  avatar?: string;
}

export type TenantUserRole = 'Manager' | 'Employee';

export type TenantRoleColor = 'bg-brand-500' | 'bg-violet-500' | 'bg-emerald-500' | 'bg-amber-500' | 'bg-rose-500';

export type TenantPermission =
  | 'Users'
  | 'Reports'
  | 'AI Chat'
  | 'My Reports'
  | 'AI Dashboard'
  | 'Billing'
  | 'Knowledge Base'
  | 'Settings';

export interface TenantRole {
  id: string;
  name: string;
  users: number;
  permissions: TenantPermission[];
  color: TenantRoleColor;
}

export interface TenantUser {
  id: number;
  name: string;
  email: string;
  role: TenantUserRole;
  status: 'active' | 'inactive';
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
  route: string;
}
