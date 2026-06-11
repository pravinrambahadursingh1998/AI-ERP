import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './ai-chat.component.html',
})
export class AiChatComponent {
  input = '';
  messages = signal<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI ERP assistant. I can help you with attendance reports, employee summaries, revenue analysis, and payroll reports. How can I assist you today?',
      time: this.now(),
    },
  ]);

  suggestions = [
    'Show attendance report',
    'Generate employee summary',
    'Show revenue analysis',
    'Generate payroll report',
  ];

  sendMessage(text?: string): void {
    const msg = (text ?? this.input).trim();
    if (!msg) return;

    this.messages.update((list) => [
      ...list,
      { role: 'user', content: msg, time: this.now() },
    ]);
    this.input = '';

    setTimeout(() => {
      this.messages.update((list) => [
        ...list,
        {
          role: 'assistant',
          content: this.mockResponse(msg),
          time: this.now(),
        },
      ]);
    }, 800);
  }

  private mockResponse(query: string): string {
    const q = query.toLowerCase();
    if (q.includes('attendance')) {
      return 'Here\'s the attendance summary for this month:\n\n• Present: 92%\n• Absent: 5%\n• On Leave: 3%\n\nTop department: Engineering (96% attendance)';
    }
    if (q.includes('employee') || q.includes('summary')) {
      return 'Employee Summary:\n\n• Total Employees: 85\n• Active: 82\n• New Hires (30 days): 4\n• Departments: 8\n\nWould you like a detailed breakdown by department?';
    }
    if (q.includes('revenue')) {
      return 'Revenue Analysis (Q2 2026):\n\n• Total Revenue: $1.2M (+15% YoY)\n• Top Product: Enterprise Plan\n• Churn Rate: 2.1%\n\nShall I generate a full PDF report?';
    }
    if (q.includes('payroll')) {
      return 'Payroll Report (June 2026):\n\n• Total Payroll: $425,000\n• Employees Paid: 82\n• Average Salary: $5,182\n• Pending Approvals: 3\n\nExport options: PDF, Excel, CSV';
    }
    return 'I understand your request. In the full version, I\'ll connect to your ERP data to provide real-time insights. Try asking about attendance, employees, revenue, or payroll.';
  }

  private now(): string {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
