import { Component } from '@angular/core';

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  templateUrl: './super-admin-dashboard.component.html',
})
export class SuperAdminDashboardComponent {
  stats = [
    { label: 'Total Tenants', value: '24', change: '+3 this month', color: 'bg-brand-500' },
    { label: 'Pending Requests', value: '7', change: '2 urgent', color: 'bg-amber-500' },
    { label: 'Monthly Revenue', value: '$12.4K', change: '+18% vs last month', color: 'bg-emerald-500' },
    { label: 'Active Subscriptions', value: '21', change: '87.5% retention', color: 'bg-violet-500' },
  ];
}
