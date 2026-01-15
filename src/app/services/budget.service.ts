import { Injectable, signal, computed, inject } from '@angular/core';
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
        if (data && data.length > 0) {
            this.transactionsSignal.set(data);
        } else {
            // Auto-load rich demo data for the first time user
            this.generateDemoData();
        }
    }

    addTransaction(transaction: Omit<BudgetTransaction, 'id'>) {
        const newTransaction: BudgetTransaction = {
            ...transaction,
            id: crypto.randomUUID()
        };

        this.transactionsSignal.update(current => [newTransaction, ...current]);
        this.saveToStorage();
        this.notificationService.success('İşlem başarıyla eklendi.');
    }

    updateTransaction(updatedTransaction: BudgetTransaction) {
        this.transactionsSignal.update(current =>
            current.map(t => t.id === updatedTransaction.id ? updatedTransaction : t)
        );
        this.saveToStorage();
        this.notificationService.success('İşlem güncellendi.');
    }

    deleteTransaction(id: string) {
        this.transactionsSignal.update(current => current.filter(t => t.id !== id));
        this.saveToStorage();
        this.notificationService.error('İşlem silindi.');
    }

    private saveToStorage() {
        this.storageService.setItem('transactions', this.transactionsSignal());
    }

    // Demo Data Generator
    generateDemoData() {
        const now = new Date();
        const prevMonth = new Date(new Date().setMonth(now.getMonth() - 1));
        const twoMonthsAgo = new Date(new Date().setMonth(now.getMonth() - 2));

        const demoData: BudgetTransaction[] = [
            // This Month
            { id: crypto.randomUUID(), description: 'Maaş', amount: 45000, type: 'income', category: 'salary', date: now.toISOString() },
            { id: crypto.randomUUID(), description: 'Kira', amount: 15000, type: 'expense', category: 'housing', date: now.toISOString() },
            { id: crypto.randomUUID(), description: 'Market', amount: 3500, type: 'expense', category: 'food', date: new Date(new Date().setDate(now.getDate() - 2)).toISOString() },
            { id: crypto.randomUUID(), description: 'Elektrik Faturası', amount: 850, type: 'expense', category: 'utilities', date: new Date(new Date().setDate(now.getDate() - 5)).toISOString() },

            // Previous Month
            { id: crypto.randomUUID(), description: 'Maaş', amount: 45000, type: 'income', category: 'salary', date: prevMonth.toISOString() },
            { id: crypto.randomUUID(), description: 'Kira', amount: 15000, type: 'expense', category: 'housing', date: prevMonth.toISOString() },
            { id: crypto.randomUUID(), description: 'Araç Bakımı', amount: 5000, type: 'expense', category: 'transport', date: prevMonth.toISOString() },
            { id: crypto.randomUUID(), description: 'Restoran', amount: 1200, type: 'expense', category: 'food', date: prevMonth.toISOString() },

            // Two Months Ago
            { id: crypto.randomUUID(), description: 'Freelance Proje', amount: 12000, type: 'income', category: 'freelance', date: twoMonthsAgo.toISOString() },
            { id: crypto.randomUUID(), description: 'Kira', amount: 15000, type: 'expense', category: 'housing', date: twoMonthsAgo.toISOString() },
        ];

        this.transactionsSignal.set(demoData);
        this.saveToStorage();
        this.notificationService.success('Kategorili örnek veriler yüklendi.');
    }
}
