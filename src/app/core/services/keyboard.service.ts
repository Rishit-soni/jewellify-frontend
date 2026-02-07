import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class KeyboardService implements OnDestroy {
    private subscription: Subscription = new Subscription();

    constructor(private router: Router) {
        this.initKeyboardListeners();
    }

    private initKeyboardListeners(): void {
        this.subscription.add(
            fromEvent<KeyboardEvent>(window, 'keydown')
                .pipe(
                    // Filter for Alt key combinations or other global shortcuts
                    filter((event: KeyboardEvent) => event.altKey || (event.ctrlKey && event.key === 'k'))
                )
                .subscribe((event: KeyboardEvent) => {
                    this.handleGlobalShortcuts(event);
                })
        );
    }

    private handleGlobalShortcuts(event: KeyboardEvent): void {
        // Global Search (Ctrl + K)
        if (event.ctrlKey && event.key === 'k') {
            event.preventDefault();
            const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
            if (searchInput) {
                searchInput.focus();
            }
            return;
        }

        // Alt + Key Navigation
        if (event.altKey) {
            switch (event.code) {
                case 'KeyD': // Alt + D -> Dashboard
                    event.preventDefault();
                    this.router.navigate(['/dashboard']);
                    break;
                case 'KeyI': // Alt + I -> Inventory
                    event.preventDefault();
                    this.router.navigate(['/inventory']);
                    break;
                case 'KeyC': // Alt + C -> Customers
                    event.preventDefault();
                    this.router.navigate(['/customers']);
                    break;
                case 'KeyS': // Alt + S -> Settings
                    event.preventDefault();
                    this.router.navigate(['/settings']);
                    break;
                case 'KeyH': // Alt + H -> Home
                    event.preventDefault();
                    this.router.navigate(['/']);
                    break;
            }
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
