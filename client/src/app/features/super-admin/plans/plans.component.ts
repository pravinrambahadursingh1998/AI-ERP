import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Plan } from '../../../core/models';

@Component({
  selector: 'app-plans',
  standalone: true,
  templateUrl: './plans.component.html',
})
export class PlansComponent implements OnInit {
  private readonly api = inject(ApiService);
  plans = signal<Plan[]>([]);

  ngOnInit(): void {
    this.api.getPlans().subscribe((plans) => this.plans.set(plans));
  }
}
