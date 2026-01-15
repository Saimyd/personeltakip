import { Component } from '@angular/core';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TransactionFormComponent } from './components/transaction-form/transaction-form.component';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { ToastComponent } from './components/toast/toast.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        SidebarComponent,
        DashboardComponent,
        TransactionFormComponent,
        TransactionListComponent,
        ToastComponent
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    title = 'budget-app';
}
