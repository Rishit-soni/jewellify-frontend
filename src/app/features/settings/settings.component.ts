import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { UserService, CreateUserRequest, User } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { CategoryService } from '../../core/services/category.service';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../../core/models/category.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    DialogModule,
    SelectModule,
    TagModule,
    ConfirmDialogModule,
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  showUserDialog = false;
  showCategoryDialog = false;
  loading = false;
  passwordLoading = false;
  categoryLoading = false;

  newUser: CreateUserRequest = {
    userName: '',
    email: '',
    password: '',
    role: 'Manager',
    phone: '',
  };

  newCategory: CreateCategoryRequest = {
    name: '',
  };

  editingCategory: Category | null = null;

  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  roleOptions = [
    { label: 'Manager', value: 'Manager' },
    { label: 'Staff', value: 'Staff' },
  ];

  users: User[] = [];
  categories: Category[] = [];
  currentUserRole: string = '';
  passwordForm: any;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private categoryService: CategoryService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.loadCurrentUser();
    // Load categories for all users (needed for item creation)
    this.loadCategories();
    // Only load users if current user is admin
    if (this.currentUserRole === 'Admin') {
      this.loadUsers();
    }
  }

  loadCurrentUser(): void {
    const user = this.authService.getCurrentUser();
    this.currentUserRole = user?.role || '';
  }

  openUserDialog(): void {
    this.resetForm();
    this.showUserDialog = true;
  }

  closeUserDialog(): void {
    this.showUserDialog = false;
    this.resetForm();
  }

  openCategoryDialog(category?: Category): void {
    this.resetCategoryForm();
    if (category) {
      this.editingCategory = category;
      this.newCategory.name = category.name;
    }
    this.showCategoryDialog = true;
  }

  closeCategoryDialog(): void {
    this.showCategoryDialog = false;
    this.resetCategoryForm();
  }

  resetForm(): void {
    this.newUser = {
      userName: '',
      email: '',
      password: '',
      role: 'Manager',
      phone: '',
    };
  }

  resetCategoryForm(): void {
    this.newCategory = {
      name: '',
    };
    this.editingCategory = null;
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        this.users = response.users;
        console.log('Loaded users:', this.users);
      },
      error: (err: any) => {
        console.error('Error loading users:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Failed to load users',
        });
      },
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.categories;
        console.log('Loaded categories:', this.categories);
      },
      error: (err: any) => {
        console.error('Error loading categories:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Failed to load categories',
        });
      },
    });
  }

  createUser(): void {
    if (!this.newUser.userName || !this.newUser.email || !this.newUser.password) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please fill all required fields (Name, Email, Password, Role)',
      });
      return;
    }

    if (this.newUser.password.length < 6) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Password must be at least 6 characters long',
      });
      return;
    }

    this.loading = true;
    console.log('Creating user:', this.newUser);

    this.userService.createUser(this.newUser).subscribe({
      next: (response) => {
        console.log('User created successfully:', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `User ${response.user.userName} created successfully!`,
        });
        this.closeUserDialog();
        this.loading = false;
        this.loadUsers();
      },
      error: (err: any) => {
        console.error('Error creating user:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || err.userMessage || 'Failed to create user',
        });
        this.loading = false;
      },
    });
  }

  createCategory(): void {
    if (!this.newCategory.name?.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Category name is required',
      });
      return;
    }

    if (this.newCategory.name.trim().length < 2) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Category name must be at least 2 characters long',
      });
      return;
    }

    this.categoryLoading = true;

    if (this.editingCategory) {
      // Update category
      this.categoryService.updateCategory(this.editingCategory._id, { name: this.newCategory.name.trim() }).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Category updated successfully!',
          });
          this.closeCategoryDialog();
          this.categoryLoading = false;
          this.loadCategories();
        },
        error: (err: any) => {
          console.error('Error updating category:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'Failed to update category',
          });
          this.categoryLoading = false;
        },
      });
    } else {
      // Create new category
      this.categoryService.createCategory({ name: this.newCategory.name.trim() }).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Category created successfully!',
          });
          this.closeCategoryDialog();
          this.categoryLoading = false;
          this.loadCategories();
        },
        error: (err: any) => {
          console.error('Error creating category:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'Failed to create category',
          });
          this.categoryLoading = false;
        },
      });
    }
  }

  deleteCategory(category: Category): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the category "${category.name}"? This action cannot be undone.`,
      header: 'Delete Category',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.categoryService.deleteCategory(category._id).subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Category deleted successfully!',
            });
            this.loadCategories();
          },
          error: (err: any) => {
            console.error('Error deleting category:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error?.message || 'Failed to delete category',
            });
          },
        });
      },
    });
  }

  changePassword(): void {
    // Comprehensive validation
    if (!this.passwordData.currentPassword?.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Current password is required',
      });
      return;
    }

    if (!this.passwordData.newPassword?.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'New password is required',
      });
      return;
    }

    if (!this.passwordData.confirmNewPassword?.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Password confirmation is required',
      });
      return;
    }

    if (this.passwordData.newPassword.length < 6) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'New password must be at least 6 characters long',
      });
      return;
    }

    if (this.passwordData.newPassword !== this.passwordData.confirmNewPassword) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'New password and confirmation do not match',
      });
      return;
    }

    if (this.passwordData.currentPassword === this.passwordData.newPassword) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'New password must be different from current password',
      });
      return;
    }

    this.passwordLoading = true;

    this.authService.changePassword({
      currentPassword: this.passwordData.currentPassword.trim(),
      newPassword: this.passwordData.newPassword.trim(),
      confirmNewPassword: this.passwordData.confirmNewPassword.trim(),
    }).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Password changed successfully!',
        });
        this.resetPasswordForm();
        this.passwordLoading = false;
      },
      error: (err: any) => {
        console.error('Error changing password:', err);

        // Handle different error scenarios
        let errorMessage = 'Failed to change password';

        if (err.error?.message) {
          errorMessage = err.error.message;
        } else if (err.message) {
          errorMessage = err.message;
        } else if (err.status === 400) {
          errorMessage = 'Invalid request. Please check your input.';
        } else if (err.status === 401) {
          errorMessage = 'Current password is incorrect.';
        } else if (err.status === 403) {
          errorMessage = 'You do not have permission to change password.';
        } else if (err.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage,
        });
        this.passwordLoading = false;
      },
    });
  }

  resetPasswordForm(): void {
    this.passwordData = {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    };
    this.showCurrentPassword = false;
    this.showNewPassword = false;
    this.showConfirmPassword = false;
    // Reset form validation state
    if (this.passwordForm) {
      this.passwordForm.resetForm();
      this.passwordForm.form.markAsPristine();
      this.passwordForm.form.markAsUntouched();
      Object.keys(this.passwordForm.form.controls).forEach(key => {
        this.passwordForm.form.get(key)?.setErrors(null);
      });
    }
  }

  togglePasswordVisibility(field: 'current' | 'new' | 'confirm'): void {
    switch (field) {
      case 'current':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }
}
