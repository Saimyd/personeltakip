import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetService } from '../../services/budget.service';
import { EditStateService } from '../../services/edit-state.service';
import { TranslationService } from '../../services/translation.service';

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
    ts = inject(TranslationService);

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

        const lang = this.ts.currentLang();

        if (date.toDateString() === today.toDateString()) return lang === 'tr' ? 'Bugün' : 'Today';
        if (date.toDateString() === yesterday.toDateString()) return lang === 'tr' ? 'Dün' : 'Yesterday';

        return new Intl.DateTimeFormat(lang === 'tr' ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' }).format(date);
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
            'hobby': 'bi-bicycle',
            'beauty': 'bi-scissors',
            'fashion': 'bi-bag-check',
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
        if (desc.includes('spor') || desc.includes('fitness') || desc.includes('hobi')) return 'bi-bicycle';
        if (desc.includes('bakım') || desc.includes('kuaför')) return 'bi-scissors';
        if (desc.includes('kredi') || desc.includes('borç')) return 'bi-bank';

        return 'bi-receipt';
    }

    getCategoryName(category: string, description: string = ''): string {
        const lang = this.ts.currentLang();
        const names: any = {
            tr: {
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
                'hobby': 'Hobi / Spor',
                'beauty': 'Kişisel Bakım',
                'other': 'Diğer'
            },
            en: {
                'salary': 'Salary',
                'freelance': 'Freelance',
                'investment': 'Investment',
                'housing': 'Housing',
                'food': 'Food/Market',
                'transport': 'Transport',
                'utilities': 'Utilities',
                'entertainment': 'Entertainment',
                'health': 'Health',
                'shopping': 'Shopping',
                'education': 'Education',
                'tech': 'Technology',
                'gift': 'Gift',
                'hobby': 'Hobby / Sport',
                'beauty': 'Personal Care',
                'other': 'Other'
            }
        };

        const currentNames = names[lang];

        if (category && category !== 'other' && currentNames[category]) {
            return currentNames[category];
        }

        // Smart Names
        const desc = description.toLowerCase();
        if (desc.includes('maaş') || desc.includes('salary')) return currentNames['salary'];
        if (desc.includes('kira') || desc.includes('rent')) return currentNames['housing'];
        if (desc.includes('market') || desc.includes('food')) return currentNames['food'];
        if (desc.includes('fatura') || desc.includes('bill')) return currentNames['utilities'];
        if (desc.includes('spor') || desc.includes('sport')) return currentNames['hobby'];
        if (desc.includes('bakım') || desc.includes('beauty')) return currentNames['beauty'];

        return currentNames['other'];
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
            'hobby': 'primary',
            'beauty': 'pink',
            'fashion': 'purple',
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
        if (desc.includes('spor')) return 'primary';
        if (desc.includes('bakım')) return 'pink';
        if (desc.includes('kredi')) return 'dark';

        return 'secondary';
    }
}
