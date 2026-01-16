import { Injectable, signal, computed, inject } from '@angular/core';
import { StorageService } from './storage.service';

export type Language = 'tr' | 'en';
export type Currency = 'TRY' | 'USD' | 'EUR' | 'GBP';

@Injectable({
    providedIn: 'root'
})
export class TranslationService {
    private storageService = inject(StorageService);

    // Default language is Turkish
    private currentLangSignal = signal<Language>('tr');
    readonly currentLang = this.currentLangSignal.asReadonly();

    // Default currency is TRY
    private currentCurrencySignal = signal<Currency>('TRY');
    readonly currentCurrency = this.currentCurrencySignal.asReadonly();

    private translations: Record<Language, any> = {
        tr: {
            // Sidebar & Navigation
            dashboard: 'Genel Bakış',
            transactions: 'İşlemler',
            reports: 'Finansal Raporlar',
            categories: 'Kategoriler',
            settings: 'Ayarlar',
            newTransaction: 'Yeni İşlem',
            profile: 'Profil Ayarları',
            appSettings: 'Uygulama Ayarları',
            manageFinance: 'Finansal durumunuzu yönetin',

            // Dashboard
            totalBalance: 'Toplam Bakiye',
            monthlyIncome: 'Aylık Gelir',
            monthlyExpense: 'Aylık Gider',
            savingsRate: 'Birikim Oranı',
            recentTransactions: 'Son İşlemler',
            viewAll: 'Tümünü Yönet',
            noTransactions: 'Henüz işlem bulunmuyor.',

            // Transaction Form
            desc: 'Açıklama',
            amt: 'Miktar',
            type: 'Tür',
            category: 'Kategori',
            date: 'Tarih',
            income: 'Gelir',
            expense: 'Gider',
            add: 'Ekle',
            save: 'Kaydet',
            cancel: 'İptal',
            editTransaction: 'İşlemi Düzenle',

            // Settings
            dataManagement: 'Veri Yönetimi',
            backupData: 'Verilerinizi yedekleyin veya temizleyin',
            exportData: 'Verileri Dışa Aktar',
            downloadJson: 'Tüm işlemlerinizi JSON olarak indirin',
            download: 'İndir',
            loadDemo: 'Örnek Verileri Yükle',
            loadDemoDesc: 'Uygulamayı 6 aylık veriyle doldurur',
            load: 'Yükle',
            clearData: 'Tüm Verileri Sil',
            clearDataDesc: 'Tüm geçmişi kalıcı olarak temizler',
            reset: 'Sıfırla',
            appPrefs: 'Uygulama Tercihleri',
            appPrefsDesc: 'Görünüm ve yerelleştirme ayarları',
            currency: 'Para Birimi',
            language: 'Dil',
            notifications: 'Bildirimler',
            budgetAlerts: 'Bütçe limit aşımlarında uyar',
            version: 'Bütçem Pro v1.4.0',
            madeWith: 'ile geliştirildi',

            // Notifications & Prompts
            confirmDeleteAll: 'Tüm verilerinizi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.',
            confirmDemo: 'Mevcut verileriniz silinecek ve örnek veriler yüklenecek. Onaylıyor musunuz?',
            dataExportSuccess: 'Verileriniz başarıyla dışa aktarıldı.',
            dataClearSuccess: 'Tüm uygulama verileri temizlendi.',
            demoLoadSuccess: 'Örnek veriler başarıyla yüklendi.',
            langChangeSuccess: 'Dil başarıyla değiştirildi.'
        },
        en: {
            // Sidebar & Navigation
            dashboard: 'Dashboard',
            transactions: 'Transactions',
            reports: 'Financial Reports',
            categories: 'Categories',
            settings: 'Settings',
            newTransaction: 'New Transaction',
            profile: 'Profile Settings',
            appSettings: 'App Settings',
            manageFinance: 'Manage your financial situation',

            // Dashboard
            totalBalance: 'Total Balance',
            monthlyIncome: 'Monthly Income',
            monthlyExpense: 'Monthly Expense',
            savingsRate: 'Savings Rate',
            recentTransactions: 'Recent Transactions',
            viewAll: 'Manage All',
            noTransactions: 'No transactions yet.',

            // Transaction Form
            desc: 'Description',
            amt: 'Amount',
            type: 'Type',
            category: 'Category',
            date: 'Date',
            income: 'Income',
            expense: 'Expense',
            add: 'Add',
            save: 'Save',
            cancel: 'Cancel',
            editTransaction: 'Edit Transaction',

            // Settings
            dataManagement: 'Data Management',
            backupData: 'Backup or clear your data',
            exportData: 'Export Data',
            downloadJson: 'Download all transactions as JSON',
            download: 'Download',
            loadDemo: 'Load Demo Data',
            loadDemoDesc: 'Populates app with 6 months of data',
            load: 'Load',
            clearData: 'Clear All Data',
            clearDataDesc: 'Permanently wipes all history',
            reset: 'Reset',
            appPrefs: 'App Preferences',
            appPrefsDesc: 'Appearance and localization settings',
            currency: 'Currency',
            language: 'Language',
            notifications: 'Notifications',
            budgetAlerts: 'Warn on budget limit exceed',
            version: 'Budget Pro v1.4.0',
            madeWith: 'developed with',

            // Notifications & Prompts
            confirmDeleteAll: 'Are you sure you want to delete all data? This cannot be undone.',
            confirmDemo: 'Current data will be deleted and demo data will be loaded. Confirm?',
            dataExportSuccess: 'Your data has been successfully exported.',
            dataClearSuccess: 'All application data has been cleared.',
            demoLoadSuccess: 'Demo data has been successfully loaded.',
            langChangeSuccess: 'Language changed successfully.'
        }
    };

    constructor() {
        this.loadLang();
    }

    private loadLang() {
        const savedLang = this.storageService.getItem<Language>('app_lang');
        if (savedLang) {
            this.currentLangSignal.set(savedLang);
        }

        const savedCurrency = this.storageService.getItem<Currency>('app_currency');
        if (savedCurrency) {
            this.currentCurrencySignal.set(savedCurrency);
        }
    }

    setLanguage(lang: Language) {
        this.currentLangSignal.set(lang);
        this.storageService.setItem('app_lang', lang);
    }

    setCurrency(currency: Currency) {
        this.currentCurrencySignal.set(currency);
        this.storageService.setItem('app_currency', currency);
    }

    getCurrencySymbol(): string {
        const symbols: Record<Currency, string> = {
            TRY: '₺',
            USD: '$',
            EUR: '€',
            GBP: '£'
        };
        return symbols[this.currentCurrencySignal()];
    }

    translate(key: string): string {
        const lang = this.currentLangSignal();
        return this.translations[lang][key] || key;
    }

    // Sugar for template
    t(key: string): string {
        return this.translate(key);
    }
}
