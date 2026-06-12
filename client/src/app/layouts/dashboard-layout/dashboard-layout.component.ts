import { Component, inject, signal, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NgClass } from '@angular/common';
import { filter, Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { DashboardMenuService } from '../../core/services/dashboard-menu.service';
import { MenuItem } from '../../core/models';
import { SidebarIconComponent } from '../../shared/components/sidebar-icon/sidebar-icon.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgClass, SidebarIconComponent],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css',
})
export class DashboardLayoutComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly menuService = inject(DashboardMenuService);
  private readonly platformId = inject(PLATFORM_ID);
  private navSub?: Subscription;

  readonly auth = inject(AuthService);

  menuItems = signal<MenuItem[]>([]);
  expandedGroups = signal<Set<string>>(new Set());
  portalTitle = signal('Portal');
  sidebarOpen = signal(false);
  sidebarCollapsed = signal(false);

  ngOnInit(): void {
    this.loadMenu(this.router.url);

    this.navSub = this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e) => this.loadMenu((e as NavigationEnd).urlAfterRedirects));

    if (isPlatformBrowser(this.platformId)) {
      this.syncSidebarForViewport();
      window.addEventListener('resize', this.onResize);
    }
  }

  ngOnDestroy(): void {
    this.navSub?.unsubscribe();
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.onResize);
    }
  }

  private readonly onResize = (): void => {
    this.syncSidebarForViewport();
  };

  private syncSidebarForViewport(): void {
    if (window.innerWidth >= 1024) {
      this.sidebarOpen.set(true);
    } else {
      this.sidebarOpen.set(false);
    }
  }

  private loadMenu(url: string): void {
    const portal = this.menuService.resolveFromUrl(url);
    if (portal) {
      this.menuItems.set(portal.menu);
      this.portalTitle.set(portal.title);
      this.syncExpandedGroups(portal.menu, url);
    }
  }

  private syncExpandedGroups(menu: MenuItem[], url: string): void {
    const path = url.split('?')[0];
    const expanded = new Set(this.expandedGroups());

    for (const item of menu) {
      if (item.children?.some((child) => this.isItemActive(child, path, url))) {
        expanded.add(item.label);
      }
    }

    this.expandedGroups.set(expanded);
  }

  hasChildren(item: MenuItem): boolean {
    return !!item.children?.length;
  }

  isGroupExpanded(label: string): boolean {
    return this.expandedGroups().has(label);
  }

  toggleGroup(label: string): void {
    if (this.sidebarCollapsed()) {
      this.sidebarCollapsed.set(false);
    }

    this.expandedGroups.update((groups) => {
      const next = new Set(groups);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  }

  isItemActive(item: MenuItem, path = this.router.url.split('?')[0], fullUrl = this.router.url): boolean {
    if (!item.route) return false;

    const query = new URLSearchParams(fullUrl.split('?')[1] ?? '');

    if (item.withoutQueryParams?.some((key) => query.has(key))) {
      return false;
    }

    if (item.activePrefix) {
      return path.startsWith(item.activePrefix) && path.length > item.route.length;
    }

    if (item.queryParams) {
      return (
        path === item.route &&
        Object.entries(item.queryParams).every(([key, value]) => query.get(key) === value)
      );
    }

    if (item.exact || item.route.endsWith('dashboard')) {
      return path === item.route;
    }

    return path === item.route || path.startsWith(`${item.route}/`);
  }

  isGroupActive(item: MenuItem): boolean {
    return !!item.children?.some((child) => this.isItemActive(child));
  }

  trackMenuItem(item: MenuItem): string {
    return item.route ?? item.label;
  }

  toggleSidebar(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (window.innerWidth < 1024) {
      this.sidebarOpen.update((v) => !v);
    } else {
      this.sidebarCollapsed.update((v) => !v);
    }
  }

  closeMobileSidebar(): void {
    if (isPlatformBrowser(this.platformId) && window.innerWidth < 1024) {
      this.sidebarOpen.set(false);
    }
  }

  profileRoute(): string {
    const url = this.router.url;
    if (url.startsWith('/super-admin')) return '/super-admin/profile';
    if (url.startsWith('/tenant-admin')) return '/tenant-admin/profile';
    if (url.startsWith('/employee')) return '/employee/profile';
    return '/login';
  }
}
