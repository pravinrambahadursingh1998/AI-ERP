import { Injectable } from '@angular/core';
import { MenuItem, PortalType } from '../models';
import { ModulePermissionService } from './module-permission.service';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

export interface PortalConfig {
  menu: MenuItem[];
  title: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class DashboardMenuService {
  constructor(
    private readonly modulePermissions: ModulePermissionService,
    private readonly api: ApiService,
    private readonly auth: AuthService
  ) {}

  resolveFromUrl(url: string): PortalConfig | null {
    const portal = this.resolvePortal(url);
    if (!portal) return null;

    const user = this.auth.user();
    const rolePermissions = user ? this.api.getUserRolePermissions(user) : [];
    const menu = this.modulePermissions.getPortalMenu(portal, user, rolePermissions);

    const titles: Record<PortalType, string> = {
      'super-admin': 'Super Admin',
      'tenant-admin': 'Tenant Admin',
      employee: 'Employee Portal',
    };

    return { menu, title: titles[portal], role: portal };
  }

  private resolvePortal(url: string): PortalType | null {
    if (url.startsWith('/super-admin')) return 'super-admin';
    if (url.startsWith('/tenant-admin')) return 'tenant-admin';
    if (url.startsWith('/employee')) return 'employee';
    return null;
  }
}
