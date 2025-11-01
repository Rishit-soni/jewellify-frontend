import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, CardModule],
  template: `
    <div class="p-4 md:p-6">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Orders</h1>
        <p class="text-gray-600">Manage your orders</p>
      </div>

      <p-card>
        <div class="text-center py-12 text-gray-400">
          <i class="pi pi-shopping-cart text-6xl mb-4"></i>
          <p class="text-xl mb-2">Order Management</p>
          <p class="text-sm">This feature will be available soon</p>
        </div>
      </p-card>
    </div>
  `
})
export class OrderListComponent {}
