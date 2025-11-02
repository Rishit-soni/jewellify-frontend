import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TabsModule } from 'primeng/tabs';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../core/services/auth.service';
import { RegisterRequest } from '../../core/models/auth.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    TabsModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    DialogModule,
    SelectModule
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  showUserDialog = false;
  loading = false;

  newUser: RegisterRequest = {
    userName: '',
    email: '',
    password: '',
    role: 'Manager',
    businessName: '',
    ownerName: '',
    phone: ''
  };

  roleOptions = [
    { label: 'Admin', value: 'Admin' },
    { label: 'Manager', value: 'Manager' }
  ];

  users: any[] = [];

  constructor(
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // TODO: Load users from API when endpoint is available
  }

  openUserDialog(): void {
    this.resetForm();
    this.showUserDialog = true;
  }

  closeUserDialog(): void {
    this.showUserDialog = false;
    this.resetForm();
  }

  resetForm(): void {
    this.newUser = {
      userName: '',
      email: '',
      password: '',
      role: 'Manager',
      businessName: '',
      ownerName: '',
      phone: ''
    };
  }

  createUser(): void {
    if (!this.newUser.userName || !this.newUser.email || !this.newUser.password) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please fill all required fields'
      });
      return;
    }

    this.loading = true;
    this.authService.register(this.newUser).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User created successfully!'
        });
        this.closeUserDialog();
        this.loading = false;
        // TODO: Reload users list
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.userMessage || 'Failed to create user'
        });
        this.loading = false;
      }
    });
  }
}
