import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetService } from '../../services/budget.service';
import { NotificationService } from '../../services/notification.service';
import { TranslationService, Language } from '../../services/translation.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  budgetService = inject(BudgetService);
  notificationService = inject(NotificationService);
  ts = inject(TranslationService);

  exportData() {
    const data = this.budgetService.transactions();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `butcem-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    this.notificationService.success(this.ts.t('dataExportSuccess'));
  }

  clearAllData() {
    if (confirm(this.ts.t('confirmDeleteAll'))) {
      this.budgetService.clearAllData();
      this.notificationService.warning(this.ts.t('dataClearSuccess'));
    }
  }

  resetDemoData() {
    if (confirm(this.ts.t('confirmDemo'))) {
      this.budgetService.generateDemoData();
      this.notificationService.info(this.ts.t('demoLoadSuccess'));
    }
  }

  onLanguageChange(event: any) {
    const lang = event.target.value as Language;
    this.ts.setLanguage(lang);
    this.notificationService.success(this.ts.t('langChangeSuccess'));
  }

  onCurrencyChange(event: any) {
    const currency = event.target.value as any;
    this.ts.setCurrency(currency);
    this.notificationService.success(this.ts.currentLang() === 'tr' ? 'Para birimi güncellendi.' : 'Currency updated.');
  }
}
