import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetService } from '../../services/budget.service';

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

    selectedPeriod = signal<Period>('month'); // Default to month for better UX

    // Filter transactions based on period
    filteredTransactions = computed(() => {
        const period = this.selectedPeriod();
        const all = this.budgetService.transactions();
        const now = new Date();

        if (period === 'all') return all;

        return all.filter(t => {
            const tDate = new Date(t.date);
            const isSameYear = tDate.getFullYear() === now.getFullYear();
            if (period === 'year') return isSameYear;
            // Month
            return isSameYear && tDate.getMonth() === now.getMonth();
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

    // Donut Logic
    getIncomeDashArray(): string {
        const income = this.filteredIncome();
        const expense = this.filteredExpense();
        const total = income + expense;
        if (total === 0) return '0, 100';
        return `${(income / total) * 100}, 100`;
    }

    // Demo Generator
    addDemoData() {
        this.budgetService.generateDemoData();
    }
}
