import { Component, inject } from '@angular/core';
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
}
