import { Component } from '@angular/core';
import { AiChatComponent } from '../../../shared/components/ai-chat/ai-chat.component';

@Component({
  selector: 'app-tenant-ai-chat',
  standalone: true,
  imports: [AiChatComponent],
  template: `
    <div class="mb-4">
      <h1 class="text-2xl font-bold text-slate-900">AI Chat Assistant</h1>
      <p class="text-slate-500 text-sm mt-1">Ask questions and generate reports from your ERP data</p>
    </div>
    <app-ai-chat />
  `,
})
export class TenantAiChatComponent {}
