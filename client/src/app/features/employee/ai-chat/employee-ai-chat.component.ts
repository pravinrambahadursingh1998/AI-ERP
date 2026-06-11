import { Component } from '@angular/core';
import { AiChatComponent } from '../../../shared/components/ai-chat/ai-chat.component';

@Component({
  selector: 'app-employee-ai-chat',
  standalone: true,
  imports: [AiChatComponent],
  template: `
    <div class="mb-4">
      <h1 class="text-2xl font-bold text-slate-900">AI Chat</h1>
      <p class="text-slate-500 text-sm mt-1">Your personal AI assistant for ERP queries</p>
    </div>
    <app-ai-chat />
  `,
})
export class EmployeeAiChatComponent {}
