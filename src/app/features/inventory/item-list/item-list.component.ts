import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ItemService } from '../../../core/services/item.service';
import { Item, ItemFilters, ItemsResponse } from '../../../core/models/item.model';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    TagModule,
    CardModule,
    ConfirmDialogModule,
    TooltipModule
  ],
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css'],
  providers: [ConfirmationService]
})
export class ItemListComponent implements OnInit {
  items: Item[] = [];
  loading = false;
  totalRecords = 0;

  filters: ItemFilters = {
    search: '',
    category: '',
    stockStatus: undefined,
    page: 1,
    limit: 10
  };

  categories = [
    { label: 'All Categories', value: '' },
    { label: 'Ring', value: 'Ring' },
    { label: 'Necklace', value: 'Necklace' },
    { label: 'Earring', value: 'Earring' },
    { label: 'Bracelet', value: 'Bracelet' },
    { label: 'Pendant', value: 'Pendant' }
  ];

  stockStatuses = [
    { label: 'All Stock Status', value: '' },
    { label: 'In Stock', value: 'inStock' },
    { label: 'Low Stock', value: 'lowStock' },
    { label: 'Out of Stock', value: 'outOfStock' }
  ];

  constructor(
    private itemService: ItemService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }
  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.loading = true;
    this.itemService.getAllItems(this.filters).subscribe({
      next: (response: ItemsResponse) => {
        this.items = response.items;
        this.totalRecords = response.totalItems;
        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.userMessage || 'Failed to load items'
        });
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.filters.page = 1;
    this.loadItems();
  }

  onCategoryChange(): void {
    this.filters.page = 1;
    this.loadItems();
  }

  onStockStatusChange(): void {
    this.filters.page = 1;
    this.loadItems();
  }

  onPageChange(event: any): void {
    this.filters.page = event.first / event.rows + 1;
    this.filters.limit = event.rows;
    this.loadItems();
  }

  getStockSeverity(stockQty: number): 'success' | 'danger' | 'warn' {
    if (stockQty === 0) return 'danger';
    if (stockQty <= 5) return 'warn';
    return 'success';
  }

  getStockLabel(stockQty: number): string {
    if (stockQty === 0) return 'Out of Stock';
    if (stockQty <= 5) return 'Low Stock';
    return 'In Stock';
  }

  onAddItem(): void {
    this.router.navigate(['/inventory/add']);
  }

  onEditItem(item: Item): void {
    this.router.navigate(['/inventory/edit', item._id]);
  }

  onDeleteItem(item: Item): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${item.name}?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.itemService.deleteItem(item._id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Item deleted successfully'
            });
            this.loadItems();
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.userMessage || 'Failed to delete item'
            });
          }
        });
      }
    });
  }

  clearFilters(): void {
    this.filters = {
      search: '',
      category: '',
      stockStatus: undefined,
      page: 1,
      limit: 10
    };
    this.loadItems();
  }
}
