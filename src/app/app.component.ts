import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TransactionFormComponent } from './components/transaction-form/transaction-form.component';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { ToastComponent } from './components/toast/toast.component';
import { LayoutService } from './services/layout.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule, // Added for ngIf/ngSwitch
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
    layoutService = inject(LayoutService);
}
