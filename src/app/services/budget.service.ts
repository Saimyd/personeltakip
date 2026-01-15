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

    private transactionsSignal = signal<BudgetTransaction[]>([]);

    readonly transactions = this.transactionsSignal.asReadonly();

    readonly totalIncome = computed(() =>
        this.transactionsSignal()
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0)
    );

    readonly totalExpense = computed(() =>
        this.transactionsSignal()
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0)
    );

    readonly totalBalance = computed(() => this.totalIncome() - this.totalExpense());

    constructor() {
        this.loadTransactions();
    }

    private loadTransactions() {
        const data = this.storageService.getItem<BudgetTransaction[]>('transactions');
        if (data) {
            this.transactionsSignal.set(data);
        }
    }

    addTransaction(transaction: Omit<BudgetTransaction, 'id'>) {
        const newTransaction: BudgetTransaction = {
            ...transaction,
            id: crypto.randomUUID()
        };

        this.transactionsSignal.update(current => [newTransaction, ...current]);
        this.saveToStorage();
        this.notificationService.showSuccess('İşlem başarıyla eklendi.');
    }

    updateTransaction(updatedTransaction: BudgetTransaction) {
        this.transactionsSignal.update(current =>
            current.map(t => t.id === updatedTransaction.id ? updatedTransaction : t)
        );
        this.saveToStorage();
        this.notificationService.showSuccess('İşlem güncellendi.');
    }

    deleteTransaction(id: string) {
        this.transactionsSignal.update(current => current.filter(t => t.id !== id));
        this.saveToStorage();
        this.notificationService.showError('İşlem silindi.');
    }

    private saveToStorage() {
        this.storageService.setItem('transactions', this.transactionsSignal());
    }

    // Demo Data Generator
    generateDemoData() {
        const demoData: BudgetTransaction[] = [
            { id: crypto.randomUUID(), description: 'Maaş', amount: 45000, type: 'income', date: new Date().toISOString() },
            { id: crypto.randomUUID(), description: 'Kira', amount: 12000, type: 'expense', date: new Date().toISOString() },
            { id: crypto.randomUUID(), description: 'Freelance Gelir', amount: 8500, type: 'income', date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString() },
            { id: crypto.randomUUID(), description: 'Market Alışverişi', amount: 3200, type: 'expense', date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString() },
            { id: crypto.randomUUID(), description: 'Faturalar', amount: 1850, type: 'expense', date: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString() },
            { id: crypto.randomUUID(), description: 'Yatırım Getirisi', amount: 2500, type: 'income', date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString() },
            { id: crypto.randomUUID(), description: 'Araç Bakımı', amount: 4500, type: 'expense', date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString() },
        ];
        this.transactionsSignal.set(demoData);
        this.saveToStorage();
        this.notificationService.showSuccess('Örnek veriler yüklendi.');
    }
}
