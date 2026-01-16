import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TransactionFormComponent } from './components/transaction-form/transaction-form.component';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { ToastComponent } from './components/toast/toast.component';
import { ReportsComponent } from './components/reports/reports.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SettingsComponent } from './components/settings/settings.component';
import { LayoutService } from './services/layout.service';
import { BudgetService } from './services/budget.service';
import { TranslationService } from './services/translation.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        SidebarComponent,
        DashboardComponent,
        TransactionFormComponent,
        TransactionListComponent,
        ReportsComponent,
        ProfileComponent,
        SettingsComponent,
        ToastComponent
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    layoutService = inject(LayoutService);
    budgetService = inject(BudgetService);
    ts = inject(TranslationService);
    today = new Date();

    getIncomeDashArray(): string {
        const income = this.budgetService.totalIncome();
        const expense = this.budgetService.totalExpense();
        const total = income + expense;

        if (total === 0) return '0, 100';

        const percentage = (income / total) * 100;
        return `${percentage}, 100`;
    }
}
