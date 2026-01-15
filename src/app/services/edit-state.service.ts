import { Injectable, signal } from '@angular/core';
import { BudgetTransaction } from '../models/transaction.model';

@Injectable({
    providedIn: 'root'
})
export class EditStateService {
    editingTransaction = signal<BudgetTransaction | null>(null);

    startEdit(t: BudgetTransaction) {
        this.editingTransaction.set(t);
    }

    cancelEdit() {
        this.editingTransaction.set(null);
    }
}
