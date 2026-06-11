import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar-icon',
  standalone: true,
  template: `
    <svg
      class="shrink-0"
      [class]="sizeClass"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.25"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      @switch (name) {
        @case ('lightning') {
          <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
        }
        @case ('building') {
          <path d="M3 21h18" />
          <path d="M5 21V7l7-4 7 4v14" />
          <path d="M9 21v-6h6v6" />
          <path d="M9 9h.01M15 9h.01M9 13h.01M15 13h.01" />
        }
        @case ('requests') {
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
          <path d="M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        }
        @case ('chat') {
          <path d="M21 15a4 4 0 01-4 4H8l-5 3V7a4 4 0 014-4h10a4 4 0 014 4v8z" />
          <path d="M8 10h.01M12 10h.01M16 10h.01" />
        }
        @case ('card') {
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M2 10h20" />
          <path d="M6 15h.01M10 15h4" />
        }
        @case ('book') {
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
        }
        @case ('shield') {
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        }
        @case ('chart') {
          <path d="M18 20V10" />
          <path d="M12 20V4" />
          <path d="M6 20v-6" />
        }
        @case ('users') {
          <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 00-3-3.87" />
          <path d="M16 3.13a4 4 0 010 7.75" />
        }
        @default {
          <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
        }
      }
    </svg>
  `,
})
export class SidebarIconComponent {
  @Input({ required: true }) name!: string;
  @Input() sizeClass = 'w-6 h-6';
}
