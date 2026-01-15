import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetService } from '../../services/budget.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
    budgetService = inject(BudgetService);

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
}
