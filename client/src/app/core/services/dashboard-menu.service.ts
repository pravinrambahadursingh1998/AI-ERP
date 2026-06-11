import { Injectable } from '@angular/core';
import {
  EMPLOYEE_MENU,
  SUPER_ADMIN_MENU,
  TENANT_ADMIN_MENU,
} from '../config/menu.config';
import { MenuItem } from '../models';

export interface PortalConfig {
  menu: MenuItem[];
  title: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class DashboardMenuService {
  resolveFromUrl(url: string): PortalConfig | null {
    if (url.startsWith('/super-admin')) {
      return { menu: SUPER_ADMIN_MENU, title: 'Super Admin', role: 'super-admin' };
    }
    if (url.startsWith('/tenant-admin')) {
      return { menu: TENANT_ADMIN_MENU, title: 'Tenant Admin', role: 'tenant-admin' };
    }
    if (url.startsWith('/employee')) {
      return { menu: EMPLOYEE_MENU, title: 'Employee Portal', role: 'employee' };
    }
    return null;
  }
}
