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
import { SkeletonModule } from 'primeng/skeleton';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ItemService } from '../../../core/services/item.service';
import { CategoryService } from '../../../core/services/category.service';

import { Item, ItemFilters, ItemsResponse } from '../../../core/models/item.model';
import { Category } from '../../../core/models/category.model';

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
    TooltipModule,
    SkeletonModule,
  ],
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css'],
  providers: [ConfirmationService],
})
export class ItemListComponent implements OnInit {
  items: Item[] = [];
  loading = false;
  totalRecords = 0;
  skeletonItems = Array(10).fill({});
  categories: Category[] = [];
  filters: ItemFilters = {
    search: '',
    category: '',
    page: 1,
    limit: 10,
  };

  categoryOptions = [
    { label: 'All Categories', value: '' },
  ];

  constructor(
    private itemService: ItemService,
    private categoryService: CategoryService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }
  ngOnInit(): void {
    this.loadCategories();
    this.loadItems();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.categories;
        this.categoryOptions = [
          { label: 'All Categories', value: '' },
          ...response.categories.map(category => ({
            label: category.name,
            value: category.name
          }))
        ];
      },
      error: (err) => {
        console.error('Failed to load categories', err);
      },
    });
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
          detail: err.userMessage || 'Failed to load items',
        });
        this.loading = false;
      },
    });
  }



  onSearch(): void {
    this.filters.page = 1;
    this.loadItems();
  }

  onSearchInputChange(): void {
    // If search is cleared, reload all items
    if (!this.filters.search || this.filters.search.trim() === '') {
      this.filters.page = 1;
      this.loadItems();
    }
  }

  onCategoryChange(): void {
    this.filters.page = 1;
    this.loadItems();
  }

  onPageChange(event: any): void {
    this.filters.page = event.first / event.rows + 1;
    this.filters.limit = event.rows;
    this.loadItems();
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
              detail: 'Item deleted successfully',
            });
            this.loadItems();
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.userMessage || 'Failed to delete item',
            });
          },
        });
      },
    });
  }

  clearFilters(): void {
    this.filters = {
      search: '',
      category: '',
      page: 1,
      limit: 10,
    };
    this.loadItems();
  }
}
