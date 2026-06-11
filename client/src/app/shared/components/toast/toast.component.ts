import { Component, inject } from '@angular/core';
import { HelperService } from '../../../core/services/helper.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      @for (toast of helper.toasts(); track toast.id) {
        <div
          class="pointer-events-auto px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white animate-[slideIn_0.3s_ease]"
          [class]="toastClass(toast.type)"
          role="alert"
        >
          {{ toast.message }}
        </div>
      }
    </div>
  `,
  styles: `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `,
})
export class ToastComponent {
  readonly helper = inject(HelperService);

  toastClass(type: string): string {
    const map: Record<string, string> = {
      success: 'bg-emerald-600',
      error: 'bg-red-600',
      warning: 'bg-amber-500',
      info: 'bg-brand-600',
    };
    return map[type] ?? map['info'];
  }
}
