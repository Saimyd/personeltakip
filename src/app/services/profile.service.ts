import { Injectable, signal, computed, inject } from '@angular/core';
import { StorageService } from './storage.service';
import { UserProfile } from '../models/user-profile.model';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    private storageService = inject(StorageService);

    private profileSignal = signal<UserProfile>({
        firstName: 'Saim',
        lastName: 'Akman',
        email: 'saim@example.com',
        role: 'Pro Plan',
        avatarText: 'SA'
    });

    readonly profile = this.profileSignal.asReadonly();

    readonly fullName = computed(() => `${this.profileSignal().firstName} ${this.profileSignal().lastName}`);

    constructor() {
        this.loadProfile();
    }

    private loadProfile() {
        const saved = this.storageService.getItem<UserProfile>('user_profile');
        if (saved) {
            this.profileSignal.set(saved);
        }
    }

    updateProfile(data: UserProfile) {
        const avatar = (data.firstName[0] || '') + (data.lastName[0] || '');
        const updated = { ...data, avatarText: avatar.toUpperCase() };

        this.profileSignal.set(updated);
        this.storageService.setItem('user_profile', updated);
    }
}
