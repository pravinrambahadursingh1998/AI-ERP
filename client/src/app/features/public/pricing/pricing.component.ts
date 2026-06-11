import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { Plan } from '../../../core/models';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './pricing.component.html',
})
export class PricingComponent implements OnInit {
  private readonly api = inject(ApiService);
  plans = signal<Plan[]>([]);

  ngOnInit(): void {
    this.api.getPlans().subscribe((plans) => this.plans.set(plans));
  }
}
