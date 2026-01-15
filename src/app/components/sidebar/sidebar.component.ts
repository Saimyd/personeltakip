import { Component, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
    isDarkMode = signal<boolean>(false);
    isExpanded = signal<boolean>(true);

    constructor() {
        // Check system preference or local storage
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.isDarkMode.set(savedTheme === 'dark');
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.isDarkMode.set(prefersDark);
        }

        // Apply theme effect
        effect(() => {
            document.body.setAttribute('data-theme', this.isDarkMode() ? 'dark' : 'light');
            localStorage.setItem('theme', this.isDarkMode() ? 'dark' : 'light');
        });
    }

    toggleTheme() {
        this.isDarkMode.update(v => !v);
    }

    toggleSidebar() {
        this.isExpanded.update(v => !v);
    }
}
