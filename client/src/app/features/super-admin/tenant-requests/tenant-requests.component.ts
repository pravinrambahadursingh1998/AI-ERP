import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { HelperService } from '../../../core/services/helper.service';
import { TenantRequest } from '../../../core/models';

@Component({
  selector: 'app-tenant-requests',
  standalone: true,
  templateUrl: './tenant-requests.component.html',
})
export class TenantRequestsComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly helper = inject(HelperService);
  requests = signal<TenantRequest[]>([]);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.helper.showSpinner();
    this.api.getTenantRequests().subscribe({
      next: (data) => {
        this.requests.set(data);
        this.helper.hideSpinner();
      },
    });
  }

  approve(id: string): void {
    this.api.approveTenantRequest(id).subscribe((res) => {
      if (res.success) {
        this.helper.showToast('Tenant request approved', 'success');
        this.helper.showToast(
          'User will receive registration email after payment is completed',
          'info'
        );
      }
      this.load();
    });
  }

  reject(id: string): void {
    this.api.rejectTenantRequest(id).subscribe(() => {
      this.helper.showToast('Tenant request rejected', 'warning');
      this.load();
    });
  }
}
