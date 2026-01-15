import { Component } from '@angular/core';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TransactionFormComponent } from './components/transaction-form/transaction-form.component';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [DashboardComponent, TransactionFormComponent, TransactionListComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    title = 'budget-app';
}
