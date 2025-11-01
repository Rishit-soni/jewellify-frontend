import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest } from '../../../core/models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    CardModule,
    InputTextModule,
    ButtonModule,
    PasswordModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerData: RegisterRequest = {
    name: '',
    email: '',
    password: '',
    shopName: '',
    phone: ''
  };
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  onRegister(): void {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.authService.register(this.registerData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Registration successful!'
        });
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Registration Failed',
          detail: err.userMessage || 'Registration failed'
        });
        this.loading = false;
      }
    });
  }

  private validateForm(): boolean {
    const { name, email, password, shopName, phone } = this.registerData;

    if (!name || !email || !password || !shopName || !phone) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please fill in all fields'
      });
      return false;
    }

    if (password.length < 6) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Password must be at least 6 characters'
      });
      return false;
    }

    return true;
  }
}
