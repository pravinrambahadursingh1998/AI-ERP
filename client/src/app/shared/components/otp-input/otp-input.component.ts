import { Component, forwardRef, signal, ElementRef, viewChildren } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-otp-input',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OtpInputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="flex justify-center gap-2 sm:gap-3">
      @for (i of digits; track i) {
        <input
          #otpBox
          type="text"
          inputmode="numeric"
          maxlength="1"
          [value]="values()[i]"
          (input)="onInput($event, i)"
          (keydown)="onKeydown($event, i)"
          (paste)="onPaste($event)"
          class="w-11 h-12 sm:w-12 sm:h-14 text-center text-lg font-bold bg-slate-100 rounded-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
        />
      }
    </div>
  `,
})
export class OtpInputComponent implements ControlValueAccessor {
  readonly digits = [0, 1, 2, 3, 4, 5];
  readonly values = signal<string[]>(['', '', '', '', '', '']);
  private readonly boxes = viewChildren<ElementRef<HTMLInputElement>>('otpBox');

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    const chars = (value ?? '').padEnd(6, '').slice(0, 6).split('');
    this.values.set(chars.map((c) => (/^\d$/.test(c) ? c : '')));
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const char = input.value.replace(/\D/g, '').slice(-1);
    input.value = char;

    const next = [...this.values()];
    next[index] = char;
    this.values.set(next);
    this.emit();

    if (char && index < 5) {
      this.boxes()[index + 1]?.nativeElement.focus();
    }
  }

  onKeydown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.values()[index] && index > 0) {
      this.boxes()[index - 1]?.nativeElement.focus();
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pasted = event.clipboardData?.getData('text')?.replace(/\D/g, '').slice(0, 6) ?? '';
    if (!pasted) return;

    const chars = pasted.padEnd(6, '').slice(0, 6).split('');
    this.values.set(chars);
    this.emit();
    const focusIndex = Math.min(pasted.length, 5);
    this.boxes()[focusIndex]?.nativeElement.focus();
  }

  private emit(): void {
    const code = this.values().join('');
    this.onChange(code);
    this.onTouched();
  }
}
