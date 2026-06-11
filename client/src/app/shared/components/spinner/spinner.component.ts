import { Component, inject } from '@angular/core';
import { HelperService } from '../../../core/services/helper.service';

@Component({
  selector: 'app-spinner',
  standalone: true,
  template: `
    @if (helper.loading()) {
      <div class="fixed inset-0 z-[99] flex items-center justify-center bg-black/30 backdrop-blur-sm">
        <div class="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
      </div>
    }
  `,
})
export class SpinnerComponent {
  readonly helper = inject(HelperService);
}
