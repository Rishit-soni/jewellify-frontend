import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { ItemService } from '../../../core/services/item.service';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';
import { CreateItemRequest } from '../../../core/models/item.model';

@Component({
  selector: 'app-item-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    TextareaModule,
    SelectModule,
    FileUploadModule,
    ButtonModule,
    CardModule,
  ],
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css'],
})
export class ItemFormComponent implements OnInit {
  itemData: CreateItemRequest = {
    name: '',
    category: '',
    source: '',
    description: '',
    grossWeight: 0,
    netWeight: 0,
    huid: '',
  };

  files: File[] = [];
  loading = false;
  isEditMode = false;
  itemId: string | null = null;
  categories: Category[] = [];
  categoryOptions: any[] = [];

  constructor(
    private itemService: ItemService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.itemId = this.route.snapshot.paramMap.get('id');
    if (this.itemId) {
      this.isEditMode = true;
      this.loadItem();
    }
    this.loadCategories();
  }

  loadItem(): void {
    if (!this.itemId) return;

    this.loading = true;
    this.itemService.getItemById(this.itemId).subscribe({
      next: (item) => {
        this.itemData = {
          name: item.name,
          category: item.category,
          source: item.source,
          description: item.description,
          grossWeight: item.grossWeight,
          netWeight: item.netWeight,
          huid: item.huid,
        };
        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.userMessage || 'Failed to load item',
        });
        this.loading = false;
        this.router.navigate(['/inventory']);
      },
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.categories;
        this.categoryOptions = this.categories.map(category => ({
          label: category.name,
          value: category.name
        }));
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load categories',
        });
      },
    });
  }

  onFileSelect(event: any): void {
    this.files = Array.from(event.files);
  }

  onRemoveFile(event: any): void {
    this.files = this.files.filter((f) => f !== event.file);
  }

  onSaveItem(): void {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    const formData = new FormData();

    Object.keys(this.itemData).forEach((key) => {
      const value = (this.itemData as any)[key];
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    this.files.slice(0, 5).forEach((file) => {
      formData.append('images', file, file.name);
    });

    const request$ =
      this.isEditMode && this.itemId
        ? this.itemService.updateItem(this.itemId, formData)
        : this.itemService.createItem(formData);

    request$.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Item ${this.isEditMode ? 'updated' : 'created'} successfully`,
        });
        this.router.navigate(['/inventory']);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.userMessage || `Failed to ${this.isEditMode ? 'update' : 'create'} item`,
        });
        this.loading = false;
      },
    });
  }

  validateForm(): boolean {
    const { name, category, source, grossWeight, netWeight, huid } = this.itemData;

    if (!name || !category || !source || !huid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields',
      });
      return false;
    }

    if (grossWeight <= 0 || netWeight <= 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Weight must be greater than 0',
      });
      return false;
    }

    if (this.files.length > 5) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Maximum 5 images allowed',
      });
      return false;
    }

    return true;
  }

  onCancel(): void {
    this.router.navigate(['/inventory']);
  }
}
