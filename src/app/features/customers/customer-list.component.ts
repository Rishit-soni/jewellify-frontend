import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CustomerService } from '../../core/services/customer.service';
import { Customer, CustomerFilters, CustomersResponse } from '../../core/models/customer.model';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    ConfirmDialogModule,
    TooltipModule,
    SkeletonModule,
  ],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
  providers: [ConfirmationService],
})
export class CustomerListComponent implements OnInit {
  customers: Customer[] = [];
  loading = false;
  totalRecords = 0;
  skeletonItems = Array(10).fill({});
  filters: CustomerFilters = {
    search: '',
    page: 1,
    limit: 10,
  };

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.loading = true;
    this.customerService.getAllCustomers(this.filters).subscribe({
      next: (response: CustomersResponse) => {
        this.customers = response.customers;
        this.totalRecords = response.totalCustomers;
        this.loading = false;
      },
      error: (err: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.userMessage || 'Failed to load customers',
        });
        this.loading = false;
      },
    });
  }

  onSearch(): void {
    this.filters.page = 1;
    this.loadCustomers();
  }

  onPageChange(event: any): void {
    this.filters.page = event.first / event.rows + 1;
    this.filters.limit = event.rows;
    this.loadCustomers();
  }

  onAddCustomer(): void {
    this.router.navigate(['/customers/add']);
  }

  onEditCustomer(customer: Customer): void {
    this.router.navigate(['/customers/edit', customer._id]);
  }

  onDeleteCustomer(customer: Customer): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${customer.name}?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.customerService.deleteCustomer(customer._id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Customer deleted successfully',
            });
            this.loadCustomers();
          },
          error: (err: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.userMessage || 'Failed to delete customer',
            });
          },
        });
      },
    });
  }

  onRowClick(customer: Customer): void {
    this.router.navigate(['/customers', customer._id]);
  }

  clearFilters(): void {
    this.filters = {
      search: '',
      page: 1,
      limit: 10,
    };
    this.loadCustomers();
  }
}
