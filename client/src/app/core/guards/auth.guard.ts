import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DashboardMenuService } from '../services/dashboard-menu.service';
import { ModulePermissionService } from '../services/module-permission.service';
import { ApiService } from '../services/api.service';
import { UserRole } from '../models';

function getRequiredRole(route: ActivatedRouteSnapshot): UserRole | undefined {
  let current: ActivatedRouteSnapshot | null = route;
  while (current) {
    if (current.data['role']) {
      return current.data['role'] as UserRole;
    }
    current = current.parent;
  }
  return undefined;
}

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const menuService = inject(DashboardMenuService);
  const modulePermissions = inject(ModulePermissionService);
  const api = inject(ApiService);

  if (!auth.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  const portal = menuService.resolveFromUrl(state.url);
  const requiredRole = getRequiredRole(route) ?? (portal?.role as UserRole | undefined);

  if (requiredRole && auth.role() !== requiredRole) {
    return router.createUrlTree([auth.getDashboardRoute(auth.role()!)]);
  }

  const user = auth.user();
  const rolePermissions = user ? api.getUserRolePermissions(user) : [];
  if (user && !modulePermissions.canAccessRoute(state.url, user, rolePermissions)) {
    return router.createUrlTree([auth.getDashboardRoute(user.role)]);
  }

  return true;
};
