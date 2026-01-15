import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetService } from '../../services/budget.service';
import { EditStateService } from '../../services/edit-state.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
    budgetService = inject(BudgetService);

    editState = inject(EditStateService); // For clicking transactions

    calculateIncomePercentage(): number {
        const total = this.budgetService.totalIncome() + this.budgetService.totalExpense();
        if (total === 0) return 50; // default for visual balance
        return (this.budgetService.totalIncome() / total) * 100;
    }

    calculateExpensePercentage(): number {
        const total = this.budgetService.totalIncome() + this.budgetService.totalExpense();
        if (total === 0) return 0;
        return (this.budgetService.totalExpense() / total) * 100;
    }

    calculatePercentage(): number {
        const income = this.budgetService.totalIncome();
        const expense = this.budgetService.totalExpense();
        if (income === 0) return 0;
        return Math.round((expense / income) * 100);
    }

    getCategoryIcon(category: string, description: string = ''): string {
        // 1. Try strict category match
        const icons: any = {
            'salary': 'bi-cash-stack',
            'freelance': 'bi-laptop',
            'investment': 'bi-graph-up-arrow',
            'housing': 'bi-house-door',
            'house': 'bi-house-door', // fallback alias
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

        // 2. Smart Guess based on Description (for old data or 'other')
        const desc = description.toLowerCase();
        if (desc.includes('maaş') || desc.includes('gelir') || desc.includes('avans')) return 'bi-cash-stack';
        if (desc.includes('kira') || desc.includes('aidat') || desc.includes('ev')) return 'bi-house-door';
        if (desc.includes('market') || desc.includes('gıda') || desc.includes('yemek')) return 'bi-basket';
        if (desc.includes('fatura') || desc.includes('elektrik') || desc.includes('su')) return 'bi-lightning-charge';
        if (desc.includes('benzin') || desc.includes('taksi') || desc.includes('ulaşım')) return 'bi-fuel-pump';
        if (desc.includes('kahve') || desc.includes('restoran')) return 'bi-cup-hot';
        if (desc.includes('telefon') || desc.includes('internet')) return 'bi-router';

        // 3. Default
        return 'bi-receipt';
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
