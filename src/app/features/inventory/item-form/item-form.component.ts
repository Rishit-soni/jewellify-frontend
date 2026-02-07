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
  filePreviews: { file: File; url: string }[] = []; // For preview of new uploads
  existingImages: string[] = []; // Existing images from server (Cloudinary URLs)
  imagesToDelete: string[] = []; // Track which existing images to delete
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

  // Image validation constants (Cloudinary limits)
  readonly MAX_IMAGES = 5;
  readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
  readonly ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

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
        // Load existing images
        this.existingImages = item.images || [];
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
    const newFiles = Array.from(event.files) as File[];

    // Check total count (existing + current + new)
    const totalCount = this.existingImages.length - this.imagesToDelete.length + this.files.length + newFiles.length;
    if (totalCount > this.MAX_IMAGES) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Too Many Images',
        detail: `Maximum ${this.MAX_IMAGES} images allowed. You have ${this.existingImages.length - this.imagesToDelete.length} existing and ${this.files.length} selected.`,
      });
      return;
    }

    // Validate each file
    for (const file of newFiles) {
      // Check file size
      if (file.size > this.MAX_FILE_SIZE) {
        this.messageService.add({
          severity: 'warn',
          summary: 'File Too Large',
          detail: `${file.name} exceeds 5MB limit. File size: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
        });
        return;
      }

      // Check file type
      if (!this.ALLOWED_IMAGE_TYPES.includes(file.type)) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Invalid File Type',
          detail: `${file.name} is not a valid image. Allowed: JPG, PNG, GIF, WebP`,
        });
        return;
      }
    }

    // All validations passed, add files and create previews
    this.files = [...this.files, ...newFiles];

    // Create previews for new files
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.filePreviews.push({ file, url: e.target.result });
      };
      reader.readAsDataURL(file);
    });

    const existingCount = this.existingImages.length - this.imagesToDelete.length;
    this.messageService.add({
      severity: 'success',
      summary: 'Images Added',
      detail: `${newFiles.length} image(s) selected. Total: ${existingCount + this.files.length}/${this.MAX_IMAGES}`,
    });
  }

  onRemoveFile(event: any): void {
    const removedFile = event.file;
    this.files = this.files.filter((f) => f !== removedFile);
    this.filePreviews = this.filePreviews.filter((p) => p.file !== removedFile);

    const existingCount = this.existingImages.length - this.imagesToDelete.length;
    this.messageService.add({
      severity: 'info',
      summary: 'Image Removed',
      detail: `Images remaining: ${existingCount + this.files.length}/${this.MAX_IMAGES}`,
    });
  }

  // Remove a new file preview (before upload)
  removeNewFilePreview(file: File): void {
    this.files = this.files.filter((f) => f !== file);
    this.filePreviews = this.filePreviews.filter((p) => p.file !== file);

    const existingCount = this.existingImages.length - this.imagesToDelete.length;
    this.messageService.add({
      severity: 'info',
      summary: 'Image Removed',
      detail: `Images remaining: ${existingCount + this.files.length}/${this.MAX_IMAGES}`,
    });
  }

  // Mark existing image for deletion
  removeExistingImage(imageUrl: string): void {
    this.imagesToDelete.push(imageUrl);

    const existingCount = this.existingImages.length - this.imagesToDelete.length;
    this.messageService.add({
      severity: 'info',
      summary: 'Image Marked for Deletion',
      detail: `Will be deleted on save. Images remaining: ${existingCount + this.files.length}/${this.MAX_IMAGES}`,
    });
  }

  // Undo deletion of existing image
  undoRemoveExistingImage(imageUrl: string): void {
    this.imagesToDelete = this.imagesToDelete.filter((url) => url !== imageUrl);

    const existingCount = this.existingImages.length - this.imagesToDelete.length;
    this.messageService.add({
      severity: 'success',
      summary: 'Image Restored',
      detail: `Images: ${existingCount + this.files.length}/${this.MAX_IMAGES}`,
    });
  }

  // Check if image is marked for deletion
  isMarkedForDeletion(imageUrl: string): boolean {
    return this.imagesToDelete.includes(imageUrl);
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

    // Handle images to delete (for edit mode)
    if (this.imagesToDelete.length > 0) {
      formData.append('imagesToDelete', JSON.stringify(this.imagesToDelete));
    }

    // Handle new images
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
        // Enhanced error handling for Cloudinary and validation errors
        let errorMessage = err.userMessage || `Failed to ${this.isEditMode ? 'update' : 'create'} item`;

        // Check for specific Cloudinary errors
        if (err.error?.message) {
          const backendMessage = err.error.message;

          if (backendMessage.includes('Maximum 5 images')) {
            errorMessage = 'Too many images! Maximum 5 images allowed per item.';
          } else if (backendMessage.includes('File too large')) {
            errorMessage = 'One or more files exceed 5MB limit. Please reduce file size.';
          } else if (backendMessage.includes('Only image files')) {
            errorMessage = 'Only image files are allowed (JPG, PNG, GIF, WebP).';
          } else if (backendMessage.includes('Upload failed')) {
            errorMessage = 'Image upload failed. Please check your internet connection and try again.';
          } else {
            errorMessage = backendMessage;
          }
        }

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage,
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

  onCategoryChange(): void {
    // Auto-fill name with category name when category is selected
    // Only auto-fill if name is empty or matches a previous category name
    if (this.itemData.category && (!this.itemData.name || this.categories.some(cat => cat.name === this.itemData.name))) {
      this.itemData.name = this.itemData.category;
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
