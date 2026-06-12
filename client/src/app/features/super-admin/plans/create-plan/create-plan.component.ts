import { TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { HelperService } from '../../../../core/services/helper.service';

@Component({
  selector: 'app-create-plan',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, TitleCasePipe],
  templateUrl: './create-plan.component.html',
})
export class CreatePlanComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly helper = inject(HelperService);

  billingCycles: Array<'monthly' | 'yearly'> = ['monthly', 'yearly'];

  form = this.fb.group({
    name: ['', Validators.required],
    price: [null as number | null, [Validators.required, Validators.min(0)]],
    billingCycle: ['monthly' as 'monthly' | 'yearly', Validators.required],
    features: this.fb.array([this.createFeatureControl()]),
    active: [true],
  });

  get features(): FormArray {
    return this.form.get('features') as FormArray;
  }

  createFeatureControl(value = ''): ReturnType<FormBuilder['control']> {
    return this.fb.control(value, Validators.required);
  }

  addFeature(): void {
    this.features.push(this.createFeatureControl());
  }

  removeFeature(index: number): void {
    if (this.features.length > 1) {
      this.features.removeAt(index);
    }
  }

  get isActive(): boolean {
    return !!this.form.get('active')?.value;
  }

  toggleActive(): void {
    const control = this.form.get('active');
    control?.setValue(!control.value);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, price, billingCycle, active } = this.form.getRawValue();
    const features = this.features.controls
      .map((c) => (c.value as string).trim())
      .filter(Boolean);

    if (!features.length) {
      this.helper.showToast('Add at least one feature', 'warning');
      return;
    }

    this.helper.showSpinner();
    this.api
      .createPlan({
        name: name!,
        price: price!,
        billingCycle: billingCycle!,
        features,
        active: active ?? true,
      })
      .subscribe({
        next: () => {
          this.helper.hideSpinner();
          this.helper.showToast('Plan created successfully', 'success');
          this.router.navigate(['/super-admin/plans']);
        },
        error: () => {
          this.helper.hideSpinner();
          this.helper.showToast('Failed to create plan', 'error');
        },
      });
  }
}
