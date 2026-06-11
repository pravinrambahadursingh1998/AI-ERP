import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface AiStat {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface TokenUsageDay {
  day: string;
  tokens: number;
}

export interface UserActivity {
  user: string;
  role: string;
  queries: number;
  tokens: number;
  lastActive: string;
}

export interface PopularQuery {
  query: string;
  count: number;
  category: string;
}

export interface AiDashboardData {
  stats: AiStat[];
  usageByMonth: { month: string; queries: number }[];
  tokenUsage: TokenUsageDay[];
  tokenByModel: { model: string; tokens: number; percent: number }[];
  userActivity: UserActivity[];
  popularQueries: PopularQuery[];
}

@Injectable({ providedIn: 'root' })
export class AiAnalyticsService {
  getPlatformDashboard(): Observable<AiDashboardData> {
    const data: AiDashboardData = {
      stats: [
        { label: 'Total AI Queries', value: '48.2K', change: '+22% this month', trend: 'up' },
        { label: 'Tokens Consumed', value: '12.8M', change: '+18% vs last month', trend: 'up' },
        { label: 'Active Users', value: '1,240', change: 'Across 24 tenants', trend: 'neutral' },
        { label: 'Avg Response Time', value: '1.4s', change: '-0.3s improved', trend: 'up' },
      ],
      usageByMonth: [
        { month: 'Jan', queries: 5200 },
        { month: 'Feb', queries: 6100 },
        { month: 'Mar', queries: 5800 },
        { month: 'Apr', queries: 7200 },
        { month: 'May', queries: 8100 },
        { month: 'Jun', queries: 9400 },
      ],
      tokenUsage: [
        { day: 'Mon', tokens: 420000 },
        { day: 'Tue', tokens: 380000 },
        { day: 'Wed', tokens: 510000 },
        { day: 'Thu', tokens: 470000 },
        { day: 'Fri', tokens: 620000 },
        { day: 'Sat', tokens: 290000 },
        { day: 'Sun', tokens: 210000 },
      ],
      tokenByModel: [
        { model: 'GPT-4o', tokens: 6200000, percent: 48 },
        { model: 'Claude 3.5', tokens: 4100000, percent: 32 },
        { model: 'Gemini Pro', tokens: 2500000, percent: 20 },
      ],
      userActivity: [
        { user: 'Sarah Johnson', role: 'Tenant Admin', queries: 342, tokens: 89000, lastActive: '2 min ago' },
        { user: 'John Doe', role: 'Manager', queries: 218, tokens: 54000, lastActive: '15 min ago' },
        { user: 'Jane Smith', role: 'Employee', queries: 156, tokens: 32000, lastActive: '1 hour ago' },
        { user: 'Dr. Michael Chen', role: 'Tenant Admin', queries: 289, tokens: 76000, lastActive: '3 hours ago' },
        { user: 'Alice Brown', role: 'Employee', queries: 98, tokens: 18000, lastActive: 'Yesterday' },
      ],
      popularQueries: [
        { query: 'Show attendance report', count: 1240, category: 'HR' },
        { query: 'Generate employee summary', count: 980, category: 'HR' },
        { query: 'Show revenue analysis', count: 870, category: 'Finance' },
        { query: 'Generate payroll report', count: 756, category: 'Payroll' },
        { query: 'Export sales data to Excel', count: 642, category: 'Sales' },
        { query: 'Summarize uploaded policy document', count: 534, category: 'Knowledge Base' },
      ],
    };
    return of(data).pipe(delay(300));
  }

  getTenantDashboard(): Observable<AiDashboardData> {
    const data: AiDashboardData = {
      stats: [
        { label: 'Total AI Queries', value: '1,842', change: '+15% this month', trend: 'up' },
        { label: 'Tokens Consumed', value: '428K', change: '72% of plan limit', trend: 'neutral' },
        { label: 'Active Users', value: '68', change: 'Of 85 total users', trend: 'neutral' },
        { label: 'Avg Response Time', value: '1.2s', change: '-0.2s improved', trend: 'up' },
      ],
      usageByMonth: [
        { month: 'Jan', queries: 210 },
        { month: 'Feb', queries: 245 },
        { month: 'Mar', queries: 280 },
        { month: 'Apr', queries: 310 },
        { month: 'May', queries: 340 },
        { month: 'Jun', queries: 457 },
      ],
      tokenUsage: [
        { day: 'Mon', tokens: 18500 },
        { day: 'Tue', tokens: 16200 },
        { day: 'Wed', tokens: 22100 },
        { day: 'Thu', tokens: 19800 },
        { day: 'Fri', tokens: 25400 },
        { day: 'Sat', tokens: 8900 },
        { day: 'Sun', tokens: 6200 },
      ],
      tokenByModel: [
        { model: 'GPT-4o', tokens: 205000, percent: 48 },
        { model: 'Claude 3.5', tokens: 137000, percent: 32 },
        { model: 'Gemini Pro', tokens: 86000, percent: 20 },
      ],
      userActivity: [
        { user: 'John Doe', role: 'Manager', queries: 142, tokens: 34000, lastActive: '5 min ago' },
        { user: 'Jane Smith', role: 'Employee', queries: 98, tokens: 22000, lastActive: '20 min ago' },
        { user: 'Alice Brown', role: 'Manager', queries: 87, tokens: 19500, lastActive: '1 hour ago' },
        { user: 'Bob Wilson', role: 'Employee', queries: 64, tokens: 14000, lastActive: '2 hours ago' },
        { user: 'Charlie Davis', role: 'Employee', queries: 45, tokens: 9800, lastActive: 'Yesterday' },
      ],
      popularQueries: [
        { query: 'Show attendance report', count: 89, category: 'HR' },
        { query: 'Generate employee summary', count: 72, category: 'HR' },
        { query: 'Show revenue analysis', count: 58, category: 'Finance' },
        { query: 'Generate payroll report', count: 45, category: 'Payroll' },
        { query: 'Leave balance for employee', count: 38, category: 'HR' },
        { query: 'Department-wise headcount', count: 31, category: 'Reports' },
      ],
    };
    return of(data).pipe(delay(300));
  }
}
