import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { HelperService } from '../../../core/services/helper.service';
import { Tenant } from '../../../core/models';

@Component({
  selector: 'app-tenants',
  standalone: true,
  templateUrl: './tenants.component.html',
})
export class TenantsComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly helper = inject(HelperService);
  tenants = signal<Tenant[]>([]);

  ngOnInit(): void {
    this.helper.showSpinner();
    this.api.getTenants().subscribe({
      next: (data) => {
        this.tenants.set(data);
        this.helper.hideSpinner();
      },
    });
  }
}
