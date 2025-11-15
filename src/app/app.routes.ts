import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { AppLayoutComponent } from './shared/components/layout/app-layout/app-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ItemListComponent } from './features/inventory/item-list/item-list.component';
import { ItemFormComponent } from './features/inventory/item-form/item-form.component';
import { ItemDetailsComponent } from './features/inventory/item-details/item-details.component';
import { CustomerListComponent } from './features/customers/customer-list.component';
import { CustomerFormComponent } from './features/customers/customer-form.component';
import { CustomerDetails } from './features/customers/customer-details/customer-details';
import { OrderListComponent } from './features/orders/order-list.component';
import { SettingsComponent } from './features/settings/settings.component';
import { ComingSoonComponent } from './features/coming-soon/coming-soon.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'inventory', component: ItemListComponent },
      { path: 'inventory/add', component: ItemFormComponent },
      { path: 'inventory/edit/:id', component: ItemFormComponent },
      { path: 'inventory/view/:id', component: ItemDetailsComponent },
      { path: 'customers', component: CustomerListComponent },
      { path: 'customers/add', component: CustomerFormComponent },
      { path: 'customers/edit/:id', component: CustomerFormComponent },
      { path: 'customers/:id', component: CustomerDetails },
      { path: 'orders', component: OrderListComponent },
      { path: 'quotations', component: ComingSoonComponent, canActivate: [authGuard] },
      { path: 'ledger', component: ComingSoonComponent, canActivate: [authGuard] },
      { path: 'settings', component: SettingsComponent, canActivate: [authGuard] },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
