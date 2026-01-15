import { Component, effect, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService, ActiveView } from '../../services/layout.service';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
    layoutService = inject(LayoutService);
    isDarkMode = signal<boolean>(false);
    isExpanded = signal<boolean>(true);

    constructor() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.isDarkMode.set(savedTheme === 'dark');
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.isDarkMode.set(prefersDark);
        }

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
