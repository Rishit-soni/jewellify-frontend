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
import { MessageService } from 'primeng/api';
import { UserService, CreateUserRequest, User } from '../../core/services/user.service';

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
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  showUserDialog = false;
  loading = false;

  newUser: CreateUserRequest = {
    userName: '',
    email: '',
    password: '',
    role: 'Manager',
    phone: '',
  };

  roleOptions = [
    { label: 'Manager', value: 'Manager' },
    { label: 'Staff', value: 'Staff' },
  ];

  users: User[] = [];

  constructor(private userService: UserService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadUsers();
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
      phone: '',
    };
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
}
