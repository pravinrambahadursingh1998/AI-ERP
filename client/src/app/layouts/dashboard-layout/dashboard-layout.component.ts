import { Component, inject, signal, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NgClass } from '@angular/common';
import { filter, Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { DashboardMenuService } from '../../core/services/dashboard-menu.service';
import { MenuItem } from '../../core/models';
import { SidebarIconComponent } from '../../shared/components/sidebar-icon/sidebar-icon.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgClass, SidebarIconComponent],
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
    }
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
}
