import { Injectable, signal, computed, effect } from '@angular/core';
import { BudgetTransaction } from '../models/transaction.model';

@Injectable({
    providedIn: 'root'
})
export class BudgetService {
    private storageKey = 'budget_transactions';

    // Signals for reactive state management
    transactions = signal<BudgetTransaction[]>([]);

    // Computed values
    totalBalance = computed(() => this.transactions().reduce((acc, t) =>
        t.type === 'income' ? acc + t.amount : acc - t.amount, 0));

    totalIncome = computed(() => this.transactions()
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0));

    totalExpense = computed(() => this.transactions()
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0));

    constructor() {
        this.loadFromStorage();

        // Auto-save whenever transactions change
        effect(() => {
            localStorage.setItem(this.storageKey, JSON.stringify(this.transactions()));
        });
    }

    private loadFromStorage() {
        const data = localStorage.getItem(this.storageKey);
        if (data) {
            try {
                this.transactions.set(JSON.parse(data));
            } catch (e) {
                console.error('Failed to parse transactions', e);
                this.transactions.set([]);
            }
        }
    }

    addTransaction(transaction: Omit<BudgetTransaction, 'id'>) {
        const newTransaction: BudgetTransaction = {
            ...transaction,
            id: crypto.randomUUID()
        };
        this.transactions.update(items => [newTransaction, ...items]);
    }

    deleteTransaction(id: string) {
        this.transactions.update(items => items.filter(t => t.id !== id));
    }
}
