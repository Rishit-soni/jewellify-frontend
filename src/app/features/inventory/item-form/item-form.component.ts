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
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';
import { ItemService } from '../../../core/services/item.service';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';
import { CreateItemRequest, LabourDetails, OtherCharge } from '../../../core/models/item.model';
import { finalize } from 'rxjs';

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
    CheckboxModule,
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
    sameWeight: true,
    labour: {
      mode: 'percentage_per_gram',
      amount: 0,
    },
    otherCharges: [],
  };

  get labourAmountLabel(): string {
    switch (this.itemData.labour?.mode) {
      case 'percentage_per_gram':
        return 'Percentage (%)';
      case 'rupees_per_gram':
        return 'Amount (₹/g)';
      case 'fixed_amount':
        return 'Amount (₹)';
      default:
        return 'Amount';
    }
  }

  get labourAmountMax(): number | undefined {
    return this.itemData.labour?.mode === 'percentage_per_gram' ? 100 : undefined;
  }

  get sameWeight(): boolean {
    return this.itemData.sameWeight ?? true;
  }

  set sameWeight(value: boolean) {
    this.itemData.sameWeight = value;
  }

  files: File[] = [];
  loading = false;
  isEditMode = false;
  itemId: string | null = null;
  categories: Category[] = [];
  categoryOptions: any[] = [];

  labourModeOptions = [
    { label: 'Percentage per gram', value: 'percentage_per_gram' },
    { label: 'Rupees per gram', value: 'rupees_per_gram' },
    { label: 'Fixed amount', value: 'fixed_amount' },
  ];

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
    // Initialize same weight logic
    this.onSameWeightChange();
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
          labour: {
            mode: item.labour?.mode || 'percentage_per_gram',
            amount: item.labour?.amount || 0,
          },
          otherCharges: item.otherCharges || [],
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

    // Handle basic fields
    const basicFields = ['name', 'category', 'source', 'description', 'grossWeight', 'netWeight', 'huid'];
    basicFields.forEach((key) => {
      const value = (this.itemData as any)[key];
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, value.toString());
      }
    });

    // Handle labour data
    if (this.itemData.labour) {
      formData.append('labour.mode', this.itemData.labour.mode || 'percentage_per_gram');
      formData.append('labour.amount', (this.itemData.labour.amount || 0).toString());
    }

    // Handle otherCharges
    if (this.itemData.otherCharges && this.itemData.otherCharges.length > 0) {
      formData.append('otherCharges', JSON.stringify(this.itemData.otherCharges));
    }

    // Handle images
    this.files.slice(0, 5).forEach((file) => {
      formData.append('images', file, file.name);
    });

    const request$ =
      this.isEditMode && this.itemId
        ? this.itemService.updateItem(this.itemId, formData)
        : this.itemService.createItem(formData);

    request$.pipe(finalize(() => (this.loading = false))).subscribe({
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

  onNetWeightChange(): void {
    if (this.itemData.sameWeight) {
      this.itemData.grossWeight = this.itemData.netWeight;
    }
  }

  onSameWeightChange(): void {
    if (this.itemData.sameWeight) {
      this.itemData.grossWeight = this.itemData.netWeight;
    }
  }

  addOtherCharge(): void {
    if (!this.itemData.otherCharges) {
      this.itemData.otherCharges = [];
    }
    this.itemData.otherCharges.push({ name: '', amount: 0 });
  }

  removeOtherCharge(index: number): void {
    if (this.itemData.otherCharges) {
      this.itemData.otherCharges.splice(index, 1);
    }
  }
}
