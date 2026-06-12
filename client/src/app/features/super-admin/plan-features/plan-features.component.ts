import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { Plan } from '../../../core/models';

@Component({
  selector: 'app-plan-features',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './plan-features.component.html',
})
export class PlanFeaturesComponent implements OnInit {
  private readonly api = inject(ApiService);
  plans = signal<Plan[]>([]);

  ngOnInit(): void {
    this.api.getPlans().subscribe((plans) => this.plans.set(plans));
  }
}
