import { Injectable, signal } from '@angular/core';

export type ActiveView = 'dashboard' | 'transactions' | 'reports' | 'profile' | 'settings';

@Injectable({
    providedIn: 'root'
})
export class LayoutService {
    activeView = signal<ActiveView>('dashboard');

    setView(view: ActiveView) {
        this.activeView.set(view);
    }
}
