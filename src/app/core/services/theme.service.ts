import { Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly THEME_KEY = 'jewelify-theme';

    // Using signals for reactive state management (Angular 16+)
    theme = signal<Theme>('light');

    constructor() {
        this.initializeTheme();
    }

    toggleTheme(): void {
        const newTheme = this.theme() === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    setTheme(theme: Theme): void {
        this.theme.set(theme);
        localStorage.setItem(this.THEME_KEY, theme);
        document.documentElement.setAttribute('data-theme', theme);

        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }

    private initializeTheme(): void {
        const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme;
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme) {
            this.setTheme(savedTheme);
        } else if (systemPrefersDark) {
            this.setTheme('dark');
        } else {
            this.setTheme('light');
        }
    }
}
