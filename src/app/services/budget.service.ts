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

    // Monthly-specific signals for consistent UI across Dashboard and Reports
    readonly currentMonthTransactions = computed(() => {
        const now = new Date();
        return this.transactionsSignal().filter(t => {
            const tDate = new Date(t.date);
            return tDate.getFullYear() === now.getFullYear() && tDate.getMonth() === now.getMonth();
        });
    });

    readonly monthlyIncome = computed(() =>
        this.currentMonthTransactions()
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0)
    );

    readonly monthlyExpense = computed(() =>
        this.currentMonthTransactions()
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0)
    );

    readonly monthlyBalance = computed(() => this.monthlyIncome() - this.monthlyExpense());

    readonly monthlyHistory = computed(() => {
        const transactions = this.transactionsSignal();
        const history: { month: string, income: number, expense: number, savings: number }[] = [];
        const now = new Date();

        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthName = d.toLocaleString('tr-TR', { month: 'short' });

            const monthTransactions = transactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate.getMonth() === d.getMonth() && tDate.getFullYear() === d.getFullYear();
            });

            const income = monthTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
            const expense = monthTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

            history.push({
                month: monthName,
                income,
                expense,
                savings: income - expense
            });
        }
        return history;
    });

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
        const demoData: BudgetTransaction[] = [];
        const now = new Date();

        // Helper to generate a date relative to today
        const getPastDate = (monthsAgo: number, day: number = 10) => {
            const d = new Date(now.getFullYear(), now.getMonth() - monthsAgo, day);
            return d.toISOString();
        };

        // Create 6 months of data
        for (let i = 0; i < 6; i++) {
            // Incomes (Varied slightly)
            const baseSalary = 45000 + (Math.random() * 2000 - 1000);
            demoData.push({ id: crypto.randomUUID(), description: 'Maaş', amount: Math.round(baseSalary), type: 'income', category: 'salary', date: getPastDate(i, 1) });

            if (i % 2 === 0) {
                demoData.push({ id: crypto.randomUUID(), description: 'Freelance İşi', amount: 8000 + (Math.random() * 5000), type: 'income', category: 'freelance', date: getPastDate(i, 15) });
            }

            // Fixed Expenses
            demoData.push({ id: crypto.randomUUID(), description: 'Kira', amount: 15000, type: 'expense', category: 'housing', date: getPastDate(i, 5) });
            demoData.push({ id: crypto.randomUUID(), description: 'Faturalar', amount: 1200 + (Math.random() * 300), type: 'expense', category: 'utilities', date: getPastDate(i, 20) });

            // Variable Expenses (Increasing trend for 'Spending Trend' visualization demo)
            const foodMultiplier = 1 + (i * 0.1); // Slight increase over months
            demoData.push({ id: crypto.randomUUID(), description: 'Market Alışverişi', amount: 4000 * foodMultiplier, type: 'expense', category: 'food', date: getPastDate(i, 12) });

            // Random High Expense in some months to show negative savings
            if (i === 3) {
                demoData.push({ id: crypto.randomUUID(), description: 'Tatil / Uçak Bileti', amount: 35000, type: 'expense', category: 'other', date: getPastDate(i, 18) });
            }

            // Small expenses
            demoData.push({ id: crypto.randomUUID(), description: 'Kahve', amount: 150 + (Math.random() * 50), type: 'expense', category: 'food', date: getPastDate(i, now.getDate()) });
            demoData.push({ id: crypto.randomUUID(), description: 'Hobi', amount: 500 + (Math.random() * 1000), type: 'expense', category: 'hobby', date: getPastDate(i, 25) });
        }

        this.transactionsSignal.set(demoData);
        this.saveToStorage();
        this.notificationService.success('6 aylık örnek veri başarıyla oluşturuldu.');
    }

    clearAllData() {
        this.transactionsSignal.set([]);
        this.saveToStorage();
    }

}

