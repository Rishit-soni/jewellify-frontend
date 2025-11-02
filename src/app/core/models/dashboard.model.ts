import { User, Tenant } from './auth.model';

export interface DashboardSummary {
  user: User;
  tenant: Tenant;
  totalStockValue: number;
  todaysSales: number;
  pendingPayments: number;
  weeklyRevenue: WeeklyRevenue[];
  topSellingItems: TopSellingItem[];
}

export interface WeeklyRevenue {
  date: string;
  revenue: number;
}

export interface TopSellingItem {
  itemCode: string;
  name: string;
  qty: number;
  revenue: number;
}
