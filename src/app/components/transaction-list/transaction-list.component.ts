import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetService } from '../../services/budget.service';
import { EditStateService } from '../../services/edit-state.service';

@Component({
    selector: 'app-transaction-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './transaction-list.component.html',
    styleUrl: './transaction-list.component.css'
})
export class TransactionListComponent {
    budgetService = inject(BudgetService);
    editState = inject(EditStateService);

    // Signals
    searchTerm = signal('');

    // Computed: Filter -> Sort -> Group
    groupedTransactions = computed(() => {
        const term = this.searchTerm().toLowerCase();
        let list = this.budgetService.transactions();

        // 1. Filter
        if (term) {
            list = list.filter(t =>
                t.description.toLowerCase().includes(term) ||
                this.getCategoryName(t.category).toLowerCase().includes(term)
            );
        }

        // 2. Sort (Newest First)
        list = [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        // 3. Group by Date
        const groups: { date: string, items: any[] }[] = [];
        list.forEach(t => {
            const dateKey = t.date.substring(0, 10); // YYYY-MM-DD
            const existingGroup = groups.find(g => g.date === dateKey);
            if (existingGroup) {
                existingGroup.items.push(t);
            } else {
                groups.push({ date: dateKey, items: [t] });
            }
        });

        return groups;
    });

    // Semantic Date Helper (Today, Yesterday, etc.)
    getSemanticDate(dateStr: string): string {
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return 'Bugün';
        if (date.toDateString() === yesterday.toDateString()) return 'Dün';

        return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' }).format(date);
    }

    getCategoryIcon(category: string, description: string = ''): string {
        // 1. Try strict category match
        const icons: any = {
            'salary': 'bi-cash-stack',
            'freelance': 'bi-laptop',
            'investment': 'bi-graph-up-arrow',
            'housing': 'bi-house-door',
            'house': 'bi-house-door',
            'food': 'bi-basket',
            'transport': 'bi-fuel-pump',
            'utilities': 'bi-lightning-charge',
            'entertainment': 'bi-controller',
            'health': 'bi-heart-pulse',
            'shopping': 'bi-bag',
            'education': 'bi-book',
            'tech': 'bi-phone',
            'gift': 'bi-gift',
            'other': 'bi-circle'
        };

        if (category && category !== 'other' && icons[category]) {
            return icons[category];
        }

        // 2. Smart Guess based on Description
        const desc = description.toLowerCase();
        if (desc.includes('maaş') || desc.includes('gelir') || desc.includes('avans')) return 'bi-cash-stack';
        if (desc.includes('kira') || desc.includes('aidat') || desc.includes('ev')) return 'bi-house-door';
        if (desc.includes('market') || desc.includes('gıda') || desc.includes('yemek')) return 'bi-basket';
        if (desc.includes('fatura') || desc.includes('elektrik') || desc.includes('su')) return 'bi-lightning-charge';
        if (desc.includes('benzin') || desc.includes('taksi') || desc.includes('ulaşım')) return 'bi-fuel-pump';
        if (desc.includes('kahve') || desc.includes('restoran')) return 'bi-cup-hot';
        if (desc.includes('telefon') || desc.includes('internet')) return 'bi-router';

        return 'bi-receipt';
    }

    getCategoryName(category: string, description: string = ''): string {
        const names: any = {
            'salary': 'Maaş',
            'freelance': 'Freelance',
            'investment': 'Yatırım',
            'housing': 'Kira/Konut',
            'food': 'Gıda/Market',
            'transport': 'Ulaşım',
            'utilities': 'Faturalar',
            'entertainment': 'Eğlence',
            'health': 'Sağlık',
            'shopping': 'Alışveriş',
            'education': 'Eğitim',
            'tech': 'Teknoloji',
            'gift': 'Hediye',
            'other': 'Diğer'
        };

        if (category && category !== 'other' && names[category]) {
            return names[category];
        }

        // Smart Names
        const desc = description.toLowerCase();
        if (desc.includes('maaş')) return 'Maaş';
        if (desc.includes('kira')) return 'Kira/Konut';
        if (desc.includes('market')) return 'Gıda/Market';
        if (desc.includes('fatura')) return 'Faturalar';

        return 'Diğer';
    }

    getCategoryColor(category: string, description: string = ''): string {
        const colors: any = {
            'salary': 'success',
            'freelance': 'info',
            'investment': 'primary',
            'housing': 'warning',
            'food': 'danger',
            'transport': 'secondary',
            'utilities': 'warning',
            'entertainment': 'purple',
            'health': 'danger',
            'shopping': 'pink',
            'education': 'info',
            'tech': 'dark',
            'gift': 'danger',
            'other': 'secondary'
        };

        if (category && category !== 'other' && colors[category]) {
            return colors[category];
        }

        // Smart Guess Colors
        const desc = description.toLowerCase();
        if (desc.includes('maaş')) return 'success';
        if (desc.includes('kira')) return 'warning';
        if (desc.includes('market')) return 'danger';
        if (desc.includes('fatura')) return 'warning';

        return 'secondary';
    }
}
