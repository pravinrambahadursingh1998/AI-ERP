import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { HelperService } from '../../../core/services/helper.service';
import { Tenant } from '../../../core/models';

@Component({
  selector: 'app-tenants',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './tenants.component.html',
})
export class TenantsComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly helper = inject(HelperService);
  private readonly route = inject(ActivatedRoute);

  tenants = signal<Tenant[]>([]);
  searchQuery = signal('');
  statusFilter = signal<string | null>(null);

  filteredTenants = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const status = this.statusFilter();

    return this.tenants().filter((tenant) => {
      if (status && tenant.status !== status) return false;
      if (!query) return true;

      return (
        tenant.companyName.toLowerCase().includes(query) ||
        tenant.industry.toLowerCase().includes(query) ||
        tenant.plan.toLowerCase().includes(query) ||
        tenant.id.toLowerCase().includes(query)
      );
    });
  });

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.statusFilter.set(params.get('status'));
    });
    this.load();
  }

  load(): void {
    this.helper.showSpinner();
    this.api.getTenants().subscribe({
      next: (data) => {
        this.tenants.set(data);
        this.helper.hideSpinner();
      },
    });
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  suspendTenant(tenant: Tenant, event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (tenant.status !== 'active') return;

    this.api.suspendTenant(tenant.id).subscribe({
      next: (updated) => {
        if (updated) {
          this.tenants.update((list) => list.map((t) => (t.id === updated.id ? updated : t)));
          this.helper.showToast(`${updated.companyName} has been suspended`, 'warning');
        }
      },
    });
  }

  activateTenant(tenant: Tenant, event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (tenant.status !== 'suspended') return;

    this.api.activateTenant(tenant.id).subscribe({
      next: (updated) => {
        if (updated) {
          this.tenants.update((list) => list.map((t) => (t.id === updated.id ? updated : t)));
          this.helper.showToast(`${updated.companyName} has been reactivated`, 'success');
        }
      },
    });
  }
}
