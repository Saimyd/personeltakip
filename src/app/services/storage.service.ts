import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    getItem<T>(key: string): T | null {
        const data = localStorage.getItem(key);
        if (!data) return null;
        try {
            return JSON.parse(data) as T;
        } catch (e) {
            console.error(`Error parsing data for key ${key}`, e);
            return null;
        }
    }

    setItem<T>(key: string, value: T): void {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error(`Error saving data for key ${key}`, e);
            // In a real app, we might propagate this error to a notification service
        }
    }

    removeItem(key: string): void {
        localStorage.removeItem(key);
    }

    clear(): void {
        localStorage.clear();
    }
}
