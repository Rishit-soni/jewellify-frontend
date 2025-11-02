import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardSummary } from '../../core/models/dashboard.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    ChartModule,
    TagModule,
    SkeletonModule,
    RouterLink,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  summary: DashboardSummary | null = null;
  loading = true;
  chartData: any;
  chartOptions: any;

  constructor(private dashboardService: DashboardService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadDashboard();
    this.initChartOptions();
  }

  loadDashboard(): void {
    this.loading = true;
    console.log('Dashboard: Loading started, loading =', this.loading);
    
    this.dashboardService.getSummary().subscribe({
      next: (data) => {
        console.log('Dashboard: Data received', data);
        this.summary = data;
        this.prepareChartData();
        this.loading = false;
        console.log('Dashboard: Loading finished, loading =', this.loading);
      },
      error: (err) => {
        console.error('Dashboard: Error loading data', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || err.userMessage || 'Failed to load dashboard data',
        });
        this.loading = false;
        console.log('Dashboard: Loading finished (error), loading =', this.loading);
      },
    });
  }

  prepareChartData(): void {
    if (!this.summary) return;

    const labels = this.summary.weeklyRevenue.map((r) => {
      const date = new Date(r.date);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    });

    const data = this.summary.weeklyRevenue.map((r) => r.revenue);

    this.chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Revenue',
          data: data,
          fill: true,
          borderColor: '#4f46e5',
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          tension: 0.4,
        },
      ],
    };
  }

  initChartOptions(): void {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value: any) {
              return '₹' + value.toLocaleString();
            },
          },
        },
      },
    };
  }

  formatCurrency(value: number | null | undefined): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '₹0';
    }
    return '₹' + value.toLocaleString('en-IN');
  }

  getTotalWeeklyRevenue(): number {
    if (!this.summary || !this.summary.weeklyRevenue) return 0;
    return this.summary.weeklyRevenue.reduce((sum, r) => sum + (r.revenue || 0), 0);
  }
}
