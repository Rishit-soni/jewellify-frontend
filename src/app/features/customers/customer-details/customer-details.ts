import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { catchError, of } from 'rxjs';

import { MessageService } from 'primeng/api';
import { CustomerService } from '../../../core/services/customer.service';
import {
  Customer,
  CustomerDetailsResponse,
  CustomerOrder,
  OutstandingPayment,
  TransactionEntry,
  CustomerStatistics
} from '../../../core/models/customer.model';

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TableModule,
    TagModule,
    SkeletonModule,

  ],
  templateUrl: './customer-details.html',
  styleUrls: ['./customer-details.css'],
})
export class CustomerDetails implements OnInit {
  customer: Customer | null = null;
  loading = false;
  customerId: string | null = null;
  recentOrders: CustomerOrder[] = [];
  outstandingPayments: OutstandingPayment[] = [];
  transactionHistory: TransactionEntry[] = [];
  statistics: CustomerStatistics | null = null;
  outstandingAmount = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.customerId = this.route.snapshot.paramMap.get('id');
    if (this.customerId) {
      this.loadCustomerDetailsWithSkipLoader();
    }
  }

  loadCustomerDetails(): void {
    if (!this.customerId) return;

    this.loading = true;
    this.customerService.getCustomerDetails(this.customerId)
      .pipe(
        catchError((err) => {
          console.error('Failed to load customer details', err);
          // Fallback to basic customer data if details endpoint fails
          this.loadCustomerBasic();
          return of(null); // Return an empty observable to continue the pipeline
        })
      )
      .subscribe((response: CustomerDetailsResponse | null) => {
        if (response) {
          this.customer = response.customer;
          this.recentOrders = response.recentOrders;
          this.outstandingPayments = response.outstandingPayments;
          this.transactionHistory = response.transactionHistory;
          this.statistics = response.statistics;
          this.outstandingAmount = response.outstandingAmount;
        }
        this.loading = false;
      });
  }

  loadCustomerDetailsWithSkipLoader(): void {
    if (!this.customerId) return;

    this.loading = true;
    // Use HTTP request with skip loader header
    this.customerService.getCustomerDetails(this.customerId, true)
      .pipe(
        catchError((err) => {
          console.error('Failed to load customer details', err);
          // Fallback to basic customer data if details endpoint fails
          this.loadCustomerBasic();
          return of(null); // Return an empty observable to continue the pipeline
        })
      )
      .subscribe((response: CustomerDetailsResponse | null) => {
        if (response) {
          this.customer = response.customer;
          this.recentOrders = response.recentOrders;
          this.outstandingPayments = response.outstandingPayments;
          this.transactionHistory = response.transactionHistory;
          this.statistics = response.statistics;
          this.outstandingAmount = response.outstandingAmount;
        }
        this.loading = false;
      });
  }

  loadCustomerBasic(): void {
    if (!this.customerId) return;

    this.customerService.getCustomerById(this.customerId)
      .pipe(
        catchError((err) => {
          console.error('Failed to load customer details', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load customer details',
          });
          return of(null); // Return an empty observable to continue the pipeline
        })
      )
      .subscribe((customer) => {
        if (customer) {
          this.customer = customer;
          // Set mock data for demonstration
          this.setMockData();
        }
        this.loading = false;
      });
  }

  setMockData(): void {
    this.recentOrders = [
      {
        _id: '1',
        orderId: 'ORD001',
        date: '2024-01-15T10:00:00.000Z',
        items: ['Gold Necklace', 'Silver Ring'],
        total: 75000,
        status: 'Completed',
        itemDetails: [
          { itemCode: 'GN001', name: 'Gold Necklace', qty: 1, price: 50000, weight: 22.5 },
          { itemCode: 'SR001', name: 'Silver Ring', qty: 1, price: 25000, weight: 8.2 }
        ]
      },
      {
        _id: '2',
        orderId: 'ORD002',
        date: '2024-01-10T10:00:00.000Z',
        items: ['Diamond Earrings'],
        total: 125000,
        status: 'Pending',
        itemDetails: [
          { itemCode: 'DE001', name: 'Diamond Earrings', qty: 1, price: 125000, weight: 15.8 }
        ]
      },
    ];

    this.outstandingPayments = [
      {
        orderId: 'ORD002',
        amount: 125000,
        dueDate: '2024-02-10T10:00:00.000Z',
        status: 'Pending',
      },
    ];

    this.transactionHistory = [
      {
        _id: '1',
        date: '2024-01-15T10:00:00.000Z',
        type: 'Payment',
        description: 'Payment for ORD001',
        amount: 75000,
        balance: 0,
      },
      {
        _id: '2',
        date: '2024-01-10T10:00:00.000Z',
        type: 'Order',
        description: 'Order ORD002 placed',
        amount: -125000,
        balance: -125000,
      },
    ];

    this.statistics = {
      totalOrders: 2,
      completedOrders: 1,
      pendingOrders: 1,
      totalOrderValue: 200000,
      averageOrderValue: 100000,
      lastOrderDate: '2024-01-15T10:00:00.000Z',
    };

    this.outstandingAmount = 125000;
  }

  onEditCustomer(): void {
    if (this.customerId) {
      this.router.navigate(['/customers/edit', this.customerId]);
    }
  }

  onBackToList(): void {
    this.router.navigate(['/customers']);
  }

  getStatusSeverity(status: string): "success" | "info" | "warn" | "danger" | "secondary" {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'paid':
        return 'success';
      case 'pending':
      case 'overdue':
        return 'warn';
      case 'cancelled':
      case 'failed':
        return 'danger';
      default:
        return 'info';
    }
  }

  getTransactionTypeSeverity(type: string): "success" | "info" | "warn" | "danger" | "secondary" {
    switch (type.toLowerCase()) {
      case 'payment':
        return 'success';
      case 'order':
        return 'info';
      case 'refund':
        return 'warn';
      default:
        return 'secondary';
    }
  }
}
