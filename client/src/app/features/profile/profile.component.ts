import { DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HelperService } from '../../core/services/helper.service';
import { UserRole } from '../../core/models';

type ProfileTab = 'profile' | 'security' | 'account' | 'billing' | 'danger';

interface ProfileNavItem {
  id: ProfileTab;
  label: string;
  icon: 'profile' | 'security' | 'account' | 'billing' | 'danger';
  danger?: boolean;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, DecimalPipe],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly helper = inject(HelperService);
  private readonly route = inject(ActivatedRoute);
  readonly auth = inject(AuthService);

  readonly activeTab = signal<ProfileTab>('profile');
  readonly userCredits = signal(0.04);
  readonly hasSupportPlan = signal(false);
  readonly supportPlanName = signal('');
  readonly isAccountVerified = signal(true);

  readonly navItems: ProfileNavItem[] = [
    { id: 'profile', label: 'Profile', icon: 'profile' },
    { id: 'security', label: 'Security', icon: 'security' },
    { id: 'account', label: 'Account', icon: 'account' },
    { id: 'billing', label: 'Billing & Usage', icon: 'billing' },
    { id: 'danger', label: 'Danger Zone', icon: 'danger', danger: true },
  ];

  readonly profileForm = this.fb.nonNullable.group({
    name: [this.auth.user()?.name ?? '', Validators.required],
    email: [{ value: this.auth.user()?.email ?? '', disabled: true }],
  });

  readonly passwordForm = this.fb.nonNullable.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  });

  readonly roleLabels: Record<UserRole, string> = {
    'super-admin': 'Super Admin',
    'tenant-admin': 'Tenant Admin',
    employee: 'Employee',
  };

  get roleLabel(): string {
    const role = this.auth.user()?.role;
    return role ? this.roleLabels[role] : '';
  }

  get billingPortalRoute(): string {
    const role = this.auth.user()?.role;
    if (role === 'tenant-admin') return '/tenant-admin/billing';
    return '/payment/billing-history';
  }

  get supportPlansRoute(): string {
    const role = this.auth.user()?.role;
    if (role === 'super-admin') return '/super-admin/support-plans';
    if (role === 'tenant-admin') return '/tenant-admin/support-plans';
    return '/employee/support-plans';
  }

  ngOnInit(): void {
    const tab = this.route.snapshot.queryParamMap.get('tab') as ProfileTab | null;
    if (tab && this.navItems.some((item) => item.id === tab)) {
      this.activeTab.set(tab);
    }
  }

  setTab(tab: ProfileTab): void {
    this.activeTab.set(tab);
  }

  onSaveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const { name } = this.profileForm.getRawValue();
    this.auth.updateProfile({ name });
    this.helper.showToast('Profile updated successfully', 'success');
  }

  onChangePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const { newPassword, confirmPassword } = this.passwordForm.getRawValue();
    if (newPassword !== confirmPassword) {
      this.helper.showToast('New passwords do not match', 'error');
      return;
    }

    this.passwordForm.reset();
    this.helper.showToast('Password updated successfully', 'success');
  }

  onAddCredits(): void {
    this.helper.showToast('Add credits flow coming soon', 'info');
  }

  onDeleteAccount(): void {
    this.helper.showToast('Account deletion is disabled in demo mode', 'warning');
  }
}
