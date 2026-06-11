import { Component } from '@angular/core';

@Component({
  selector: 'app-users',
  standalone: true,
  templateUrl: './users.component.html',
})
export class UsersComponent {
  users = [
    { id: 1, name: 'John Doe', email: 'john@acme.com', role: 'Manager', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@acme.com', role: 'Employee', status: 'active' },
    { id: 3, name: 'Bob Wilson', email: 'bob@acme.com', role: 'Employee', status: 'inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice@acme.com', role: 'Manager', status: 'active' },
    { id: 5, name: 'Charlie Davis', email: 'charlie@acme.com', role: 'Employee', status: 'active' },
  ];
}
