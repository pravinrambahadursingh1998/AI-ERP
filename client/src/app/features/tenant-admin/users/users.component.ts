import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { TenantUser } from '../../../core/models';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  private readonly api = inject(ApiService);
  users = signal<TenantUser[]>([]);

  ngOnInit(): void {
    this.api.getTenantUsers().subscribe((users) => this.users.set(users));
  }
}
