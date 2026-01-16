import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetService } from '../../services/budget.service';
import { TranslationService } from '../../services/translation.service';

type Period = 'all' | 'year' | 'month';

@Component({
    selector: 'app-reports',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './reports.component.html',
    styleUrl: './reports.component.css'
})
export class ReportsComponent {
    budgetService = inject(BudgetService);
    ts = inject(TranslationService);

    selectedPeriod = signal<Period>('month'); // Default to month for better UX

    // Filter transactions based on period
    filteredTransactions = computed(() => {
        const period = this.selectedPeriod();
        const all = this.budgetService.transactions();
        const now = new Date();

        if (period === 'all') return all;

        return all.filter(t => {
            const tDate = new Date(t.date);
            const timeDiff = now.getTime() - tDate.getTime();
            const daysDiff = timeDiff / (1000 * 3600 * 24);

            if (period === 'year') {
                return daysDiff >= 0 && daysDiff <= 365;
            }
            // Month (Last 30 days)
            return daysDiff >= 0 && daysDiff <= 30;
        });
    });

    filteredIncome = computed(() =>
        this.filteredTransactions()
            .filter(t => t.type === 'income')
            .reduce((a, b) => a + b.amount, 0)
    );

    filteredExpense = computed(() =>
        this.filteredTransactions()
            .filter(t => t.type === 'expense')
            .reduce((a, b) => a + b.amount, 0)
    );

    filteredBalance = computed(() => this.filteredIncome() - this.filteredExpense());

    setPeriod(period: Period) {
        this.selectedPeriod.set(period);
    }

    categoryStats = computed(() => {
        const transactions = this.filteredTransactions().filter(t => t.type === 'expense');
        const total = this.filteredExpense();
        const groups: Record<string, number> = {};

        transactions.forEach(t => {
            // Smart Category Resolution
            let cat = t.category || 'other';
            if (cat === 'other') {
                const desc = (t.description || '').toLowerCase();
                if (desc.includes('maaş') || desc.includes('salary')) cat = 'salary';
                else if (desc.includes('kira') || desc.includes('rent') || desc.includes('ev') || desc.includes('house')) cat = 'housing';
                else if (desc.includes('market') || desc.includes('food') || desc.includes('yemek')) cat = 'food';
                else if (desc.includes('fatura') || desc.includes('bill') || desc.includes('elektrik')) cat = 'utilities';
                else if (desc.includes('benzin') || desc.includes('fuel') || desc.includes('ulaşım') || desc.includes('transport')) cat = 'transport';
                else if (desc.includes('health') || desc.includes('sağlık')) cat = 'health';
                else if (desc.includes('spor') || desc.includes('sport') || desc.includes('hobi') || desc.includes('hobby')) cat = 'hobby';
                else if (desc.includes('bakım') || desc.includes('beauty')) cat = 'beauty';
            }

            groups[cat] = (groups[cat] || 0) + t.amount;
        });

        // Ensure specific important categories are always in the list for better visibility
        const mandatoryCategories = ['hobby', 'beauty'];
        mandatoryCategories.forEach(cat => {
            if (!groups[cat]) groups[cat] = 0;
        });

        const stats = Object.entries(groups).map(([category, amount]) => ({
            category,
            amount,
            percentage: total > 0 ? (amount / total) * 100 : 0
        }));

        // Sort by amount descending
        return stats.sort((a, b) => b.amount - a.amount);
    });

    getCategoryIcon(category: string, description: string = ''): string {
        const icons: any = {
            'salary': 'bi-cash-stack',
            'freelance': 'bi-laptop',
            'investment': 'bi-graph-up-arrow',
            'housing': 'bi-house-door',
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

            'other': 'bi-circle'
        };

        if (category && category !== 'other' && icons[category]) return icons[category];

        const desc = (description || '').toLowerCase();
        if (desc.includes('maaş')) return 'bi-cash-stack';
        if (desc.includes('kira')) return 'bi-house-door';
        if (desc.includes('market')) return 'bi-basket';
        if (desc.includes('spor')) return 'bi-bicycle';
        if (desc.includes('bakım') || desc.includes('kuaför')) return 'bi-scissors';


        return 'bi-receipt';
    }

    getCategoryName(category: string): string {
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
        return currentNames[category] || currentNames['other'];
    }

    getCategoryColor(category: string): string {
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

            'other': 'secondary'
        };
        return colors[category] || 'secondary';
    }

    // Chart and Visual Helpers
    getIncomeDashArray(): string {
        const income = this.filteredIncome();
        const expense = this.filteredExpense();
        const total = income + expense;

        if (total === 0) return '0, 100';

        // Ratio of income in the total flow
        const incomeShare = (income / total) * 100;
        return `${incomeShare}, 100`;
    }

    getSavingsRate(): number {
        const income = this.filteredIncome();
        const expense = this.filteredExpense();
        if (income === 0) return 0;

        const savings = income - expense;
        return Math.max(0, Math.round((savings / income) * 100));
    }

    getFinancialStatus(): string {
        const rate = this.getSavingsRate();
        const lang = this.ts.currentLang();
        if (lang === 'tr') {
            if (rate >= 40) return 'Harika Gidiyor';
            if (rate >= 20) return 'Dengeli Bütçe';
            if (rate > 0) return 'Tasarruf Gerekli';
            return 'Bütçe Aşımı';
        } else {
            if (rate >= 40) return 'Doing Great';
            if (rate >= 20) return 'Balanced Budget';
            if (rate > 0) return 'Need Saving';
            return 'Budget Exceeded';
        }
    }

    getFinancialStatusClass(): string {
        const rate = this.getSavingsRate();
        return rate >= 20 ? 'status-good' : 'status-warning';
    }

    // Historical Chart Helpers
    monthlyHistory = this.budgetService.monthlyHistory;

    maxHistoryValue = computed(() => {
        const history = this.monthlyHistory();
        if (history.length === 0) return 0;
        return Math.max(...history.map(h => Math.max(h.income, h.expense, Math.abs(h.savings))), 1);
    });

    getChartHeight(value: number): string {
        const max = this.maxHistoryValue();
        const height = (Math.abs(value) / max) * 100;
        return `${Math.max(5, height)}%`; // Min 5% height for visibility
    }

    getTrendPoints(): string {
        const history = this.monthlyHistory();
        const max = this.maxHistoryValue();
        if (history.length < 2) return "0,100 100,100";

        const width = 100;
        const height = 100;
        const stepX = width / (history.length - 1);

        return history.map((h, i) => {
            const x = i * stepX;
            const y = height - (h.expense / max) * height;
            return `${x},${y}`;
        }).join(" ");
    }
}
