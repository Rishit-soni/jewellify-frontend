import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, RouterLink],
  template: `
    <div class="p-4 md:p-6">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p class="text-gray-600">Welcome to Jewellify Inventory System</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-100 text-sm mb-1">Total Items</p>
              <h3 class="text-3xl font-bold">0</h3>
            </div>
            <i class="pi pi-box text-4xl opacity-30"></i>
          </div>
        </div>

        <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-100 text-sm mb-1">Total Customers</p>
              <h3 class="text-3xl font-bold">0</h3>
            </div>
            <i class="pi pi-users text-4xl opacity-30"></i>
          </div>
        </div>

        <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-purple-100 text-sm mb-1">Total Orders</p>
              <h3 class="text-3xl font-bold">0</h3>
            </div>
            <i class="pi pi-shopping-cart text-4xl opacity-30"></i>
          </div>
        </div>

        <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-orange-100 text-sm mb-1">Low Stock Items</p>
              <h3 class="text-3xl font-bold">0</h3>
            </div>
            <i class="pi pi-exclamation-triangle text-4xl opacity-30"></i>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <p-card header="Quick Actions">
          <div class="flex flex-col gap-3">
            <p-button
              label="Add New Item"
              icon="pi pi-plus"
              routerLink="/inventory/add"
              styleClass="w-full justify-center"
              severity="primary"
            ></p-button>
            <p-button
              label="View Inventory"
              icon="pi pi-box"
              routerLink="/inventory"
              styleClass="w-full justify-center"
              severity="secondary"
              [outlined]="true"
            ></p-button>
            <p-button
              label="Manage Customers"
              icon="pi pi-users"
              routerLink="/customers"
              styleClass="w-full justify-center"
              severity="secondary"
              [outlined]="true"
            ></p-button>
          </div>
        </p-card>

        <p-card header="Recent Activity">
          <div class="text-center py-8 text-gray-400">
            <i class="pi pi-inbox text-4xl mb-3"></i>
            <p>No recent activity</p>
          </div>
        </p-card>
      </div>
    </div>
  `
})
export class DashboardComponent {}
