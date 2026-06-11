import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

@Injectable({ providedIn: 'root' })
export class HelperService {
  private toastId = 0;
  readonly loading = signal(false);
  readonly toasts = signal<Toast[]>([]);

  showSpinner(): void {
    this.loading.set(true);
  }

  hideSpinner(): void {
    this.loading.set(false);
  }

  showToast(message: string, type: Toast['type'] = 'info'): void {
    const id = ++this.toastId;
    this.toasts.update((list) => [...list, { id, message, type }]);
    setTimeout(() => this.removeToast(id), 4000);
  }

  removeToast(id: number): void {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }
}
