import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { HelperService } from '../../../core/services/helper.service';
import { getModuleByKey } from '../../../core/config/modules.config';
import { TenantRole } from '../../../core/models';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './roles.component.html',
})
export class RolesComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly helper = inject(HelperService);

  roles = signal<TenantRole[]>([]);

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.helper.showSpinner();
    this.api.getTenantRoles().subscribe({
      next: (roles) => {
        this.helper.hideSpinner();
        this.roles.set(roles);
      },
      error: () => {
        this.helper.hideSpinner();
        this.helper.showToast('Failed to load roles', 'error');
      },
    });
  }

  moduleLabel(key: string): string {
    return getModuleByKey(key)?.label ?? key;
  }
}
