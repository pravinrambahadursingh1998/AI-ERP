import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { HelperService } from '../../../../core/services/helper.service';
import { Payment, Tenant } from '../../../../core/models';

@Component({
  selector: 'app-tenant-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './tenant-detail.component.html',
})
export class TenantDetailComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly helper = inject(HelperService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  tenant = signal<Tenant | null>(null);
  payments = signal<Payment[]>([]);
  loading = signal(true);
  actionLoading = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/super-admin/tenants']);
      return;
    }
    this.load(id);
  }

  load(id: string): void {
    this.loading.set(true);
    this.helper.showSpinner();

    this.api.getTenant(id).subscribe({
      next: (tenant) => {
        if (!tenant) {
          this.helper.hideSpinner();
          this.helper.showToast('Tenant not found', 'error');
          this.router.navigate(['/super-admin/tenants']);
          return;
        }

        this.tenant.set(tenant);
        this.api.getPayments().subscribe({
          next: (allPayments) => {
            this.payments.set(allPayments.filter((p) => p.tenant === tenant.companyName));
            this.loading.set(false);
            this.helper.hideSpinner();
          },
        });
      },
    });
  }

  suspend(): void {
    const tenant = this.tenant();
    if (!tenant || tenant.status !== 'active' || this.actionLoading()) return;

    this.actionLoading.set(true);
    this.api.suspendTenant(tenant.id).subscribe({
      next: (updated) => {
        this.actionLoading.set(false);
        if (updated) {
          this.tenant.set(updated);
          this.helper.showToast(`${updated.companyName} has been suspended`, 'warning');
        }
      },
    });
  }

  activate(): void {
    const tenant = this.tenant();
    if (!tenant || tenant.status !== 'suspended' || this.actionLoading()) return;

    this.actionLoading.set(true);
    this.api.activateTenant(tenant.id).subscribe({
      next: (updated) => {
        this.actionLoading.set(false);
        if (updated) {
          this.tenant.set(updated);
          this.helper.showToast(`${updated.companyName} has been reactivated`, 'success');
        }
      },
    });
  }
}
