import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/auth.model';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    DrawerModule,
    ButtonModule,
    AvatarModule,
    MenuModule,
    TooltipModule
  ],
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.css']
})
export class AppLayoutComponent implements OnInit {
  sidebarVisible = false;
  currentUser: User | null = null;
  
  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      routerLink: '/dashboard'
    },
    {
      label: 'Inventory',
      icon: 'pi pi-box',
      routerLink: '/inventory'
    },
    {
      label: 'Customers',
      icon: 'pi pi-users',
      routerLink: '/customers'
    },
    {
      label: 'Orders',
      icon: 'pi pi-shopping-cart',
      routerLink: '/orders'
    },
    {
      label: 'Quotations',
      icon: 'pi pi-file-edit',
      routerLink: '/quotations'
    },
    {
      label: 'Ledger',
      icon: 'pi pi-book',
      routerLink: '/ledger'
    }
  ];

  profileMenuItems: MenuItem[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.profileMenuItems = [
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        routerLink: '/settings'
      },
      {
        separator: true
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => this.onLogout()
      }
    ];
  }

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }

  onLogout(): void {
    this.authService.logout();
  }
}
