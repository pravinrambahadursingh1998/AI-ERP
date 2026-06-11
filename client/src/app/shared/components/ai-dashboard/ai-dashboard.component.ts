import { Component, inject, OnInit, signal, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { AiAnalyticsService, AiDashboardData } from '../../../core/services/ai-analytics.service';
import { HelperService } from '../../../core/services/helper.service';

@Component({
  selector: 'app-ai-dashboard',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './ai-dashboard.component.html',
})
export class AiDashboardComponent implements OnInit {
  private readonly analytics = inject(AiAnalyticsService);
  private readonly helper = inject(HelperService);

  scope = input<'platform' | 'tenant'>('tenant');

  data = signal<AiDashboardData | null>(null);
  maxUsage = signal(0);
  maxTokenDay = signal(0);

  ngOnInit(): void {
    this.helper.showSpinner();
    const request =
      this.scope() === 'platform'
        ? this.analytics.getPlatformDashboard()
        : this.analytics.getTenantDashboard();

    request.subscribe({
      next: (d) => {
        this.data.set(d);
        this.maxUsage.set(Math.max(...d.usageByMonth.map((m) => m.queries)));
        this.maxTokenDay.set(Math.max(...d.tokenUsage.map((t) => t.tokens)));
        this.helper.hideSpinner();
      },
    });
  }

  barHeight(value: number, max: number): number {
    return max > 0 ? (value / max) * 100 : 0;
  }

  trendClass(trend: string): string {
    return trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-600' : 'text-slate-500';
  }

  formatTokens(n: number): string {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return String(n);
  }
}
