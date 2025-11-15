import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { CustomerService } from '../../core/services/customer.service';
import { CreateCustomerRequest, Customer } from '../../core/models/customer.model';

@Component({
    selector: 'app-customer-form',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        InputTextModule,
        TextareaModule,
        ButtonModule,
        CardModule,
    ],
    templateUrl: './customer-form.component.html',
    styleUrls: ['./customer-form.component.css'],
})
export class CustomerFormComponent implements OnInit {
    customerData: CreateCustomerRequest = {
        name: '',
        phone: '',
        email: '',
        address: '',
        panNumber: '',
        note: '',
    };

    loading = false;
    isEditMode = false;
    customerId: string | null = null;

    constructor(
        private customerService: CustomerService,
        private router: Router,
        private route: ActivatedRoute,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.customerId = this.route.snapshot.paramMap.get('id');
        if (this.customerId) {
            this.isEditMode = true;
            this.loadCustomer();
        }
    }

    loadCustomer(): void {
        if (!this.customerId) return;

        this.loading = true;
        this.customerService.getCustomerById(this.customerId).subscribe({
            next: (customer: Customer) => {
                this.customerData = {
                    name: customer.name,
                    phone: customer.phone,
                    email: customer.email,
                    address: customer.address,
                    panNumber: customer.panNumber,
                    note: customer.note,
                };
                this.loading = false;
            },
            error: (err: any) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: err.userMessage || 'Failed to load customer',
                });
                this.loading = false;
                this.router.navigate(['/customers']);
            },
        });
    }

    onSaveCustomer(): void {
        if (!this.validateForm()) {
            return;
        }

        this.loading = true;
        const request$ =
            this.isEditMode && this.customerId
                ? this.customerService.updateCustomer(this.customerId, this.customerData)
                : this.customerService.createCustomer(this.customerData);

        request$.subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: `Customer ${this.isEditMode ? 'updated' : 'created'} successfully`,
                });
                this.router.navigate(['/customers']);
            },
            error: (err: any) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: err.userMessage || `Failed to ${this.isEditMode ? 'update' : 'create'} customer`,
                });
                this.loading = false;
            },
        });
    }

    validateForm(): boolean {
        const { name, phone } = this.customerData;

        if (!name || !phone) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validation Error',
                detail: 'Please fill in all required fields (Name and Phone)',
            });
            return false;
        }

        // Basic phone validation (Indian phone number format)
        const phoneRegex = /^(\+91[-\s]?)?[0]?(91)?[6789]\d{9}$/;
        if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validation Error',
                detail: 'Please enter a valid phone number',
            });
            return false;
        }

        // Basic email validation if provided
        if (this.customerData.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(this.customerData.email)) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Validation Error',
                    detail: 'Please enter a valid email address',
                });
                return false;
            }
        }

        // PAN number validation if provided
        if (this.customerData.panNumber) {
            const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
            if (!panRegex.test(this.customerData.panNumber.toUpperCase())) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Validation Error',
                    detail: 'Please enter a valid PAN number (format: AAAAA9999A)',
                });
                return false;
            }
            this.customerData.panNumber = this.customerData.panNumber.toUpperCase();
        }

        return true;
    }

    onCancel(): void {
        this.router.navigate(['/customers']);
    }
}
