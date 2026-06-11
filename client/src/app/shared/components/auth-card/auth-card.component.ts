import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-card',
  standalone: true,
  imports: [RouterLink, NgClass],
  templateUrl: './auth-card.component.html',
})
export class AuthCardComponent {
  @Input() variant: 'default' | 'signup' = 'default';
  @Input() title = 'Sign in';
  @Input() subtitle = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';
  @Input() welcomeTitle = 'WELCOME';
  @Input() welcomeHeadline = 'AI ERP PLATFORM';
  @Input() welcomeText =
    'Transform your business with AI-powered ERP solutions. Manage tenants, subscriptions, and intelligent workflows from one unified platform.';
  @Input() footerText = "Don't have an account?";
  @Input() footerLinkText = 'Sign Up';
  @Input() footerLink = '/signup';
}
