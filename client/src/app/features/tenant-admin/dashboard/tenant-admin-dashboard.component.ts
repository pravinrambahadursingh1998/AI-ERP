import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-tenant-admin-dashboard',
  standalone: true,
  templateUrl: './tenant-admin-dashboard.component.html',
})
export class TenantAdminDashboardComponent {
  readonly auth = inject(AuthService);

  stats = [
    { label: 'Total Users', value: '85', icon: 'users' },
    { label: 'AI Queries Today', value: '142', icon: 'ai' },
    { label: 'Active Employees', value: '78', icon: 'active' },
    { label: 'Reports Generated', value: '23', icon: 'reports' },
  ];
}
