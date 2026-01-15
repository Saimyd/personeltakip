import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { BudgetTransaction } from '../models/transaction.model';
import { StorageService } from './storage.service';
import { NotificationService } from './notification.service';

@Injectable({
    providedIn: 'root'
})
export class BudgetService {
    private storageService = inject(StorageService);
    private notificationService = inject(NotificationService);
    private storageKey = 'budget_transactions';

    // Signals
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

        // Auto-save effect
        effect(() => {
            this.storageService.setItem(this.storageKey, this.transactions());
        });
    }

    private loadFromStorage() {
        const data = this.storageService.getItem<BudgetTransaction[]>(this.storageKey);
        if (data) {
            this.transactions.set(data);
        }
    }

    addTransaction(transaction: Omit<BudgetTransaction, 'id'>) {
        try {
            const newTransaction: BudgetTransaction = {
                ...transaction,
                id: crypto.randomUUID()
            };
            this.transactions.update(items => [newTransaction, ...items]);
            this.notificationService.success('İşlem başarıyla eklendi');
        } catch (error) {
            this.notificationService.error('İşlem eklenirken hata oluştu');
            console.error(error);
        }
    }

    deleteTransaction(id: string) {
        try {
            this.transactions.update(items => items.filter(t => t.id !== id));
            this.notificationService.show('İşlem silindi', 'info');
        } catch (error) {
            this.notificationService.error('İşlem silinirken hata oluştu');
            console.error(error);
        }
    }
}
