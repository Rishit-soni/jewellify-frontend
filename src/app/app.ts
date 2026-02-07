import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { KeyboardService } from './core/services/keyboard.service';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule, ConfirmDialogModule, LoaderComponent],
  template: `
    <app-loader></app-loader>
    <router-outlet></router-outlet>
    <p-toast position="top-right"></p-toast>
    <p-confirmDialog></p-confirmDialog>
  `
})
export class AppComponent {
  constructor(
    private keyboardService: KeyboardService,
    private themeService: ThemeService
  ) { }
}
