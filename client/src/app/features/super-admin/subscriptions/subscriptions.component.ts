import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { HelperService } from '../../../core/services/helper.service';
import { Subscription } from '../../../core/models';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './subscriptions.component.html',
})
export class SubscriptionsComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly helper = inject(HelperService);

  subscriptions = signal<Subscription[]>([]);
  actionLoading = signal<string | null>(null);
  activeCount = computed(() => this.subscriptions().filter((s) => s.status === 'active').length);
  pastDueCount = computed(() => this.subscriptions().filter((s) => s.status === 'past_due').length);
  cancelledCount = computed(() => this.subscriptions().filter((s) => s.status === 'cancelled').length);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.api.getSubscriptions().subscribe((data) => this.subscriptions.set(data));
  }

  cancel(id: string): void {
    this.actionLoading.set(id);
    this.api.cancelSubscription(id).subscribe({
      next: () => {
        this.actionLoading.set(null);
        this.helper.showToast('Subscription cancelled', 'success');
        this.load();
      },
      error: () => {
        this.actionLoading.set(null);
        this.helper.showToast('Failed to cancel subscription', 'error');
      },
    });
  }
}
