import { Component } from '@angular/core';
import { AiDashboardComponent } from '../../../shared/components/ai-dashboard/ai-dashboard.component';

@Component({
  selector: 'app-super-admin-ai-dashboard',
  standalone: true,
  imports: [AiDashboardComponent],
  template: `<app-ai-dashboard scope="platform" />`,
})
export class SuperAdminAiDashboardComponent {}
