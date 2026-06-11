import { Component } from '@angular/core';

@Component({
  selector: 'app-roles',
  standalone: true,
  templateUrl: './roles.component.html',
})
export class RolesComponent {
  roles = [
    { name: 'Tenant Admin', users: 2, permissions: ['All Access'], color: 'bg-brand-500' },
    { name: 'Manager', users: 8, permissions: ['Users', 'Reports', 'AI Chat'], color: 'bg-violet-500' },
    { name: 'Employee', users: 75, permissions: ['AI Chat', 'My Reports'], color: 'bg-emerald-500' },
  ];
}
