import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // For generic pipes if needed, though mostly using signals
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
}
