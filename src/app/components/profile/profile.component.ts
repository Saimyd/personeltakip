import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { NotificationService } from '../../services/notification.service';
import { TranslationService } from '../../services/translation.service';
import { UserProfile } from '../../models/user-profile.model';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
    private fb = inject(FormBuilder);
    public profileService = inject(ProfileService);
    private notificationService = inject(NotificationService);
    public ts = inject(TranslationService);

    profileForm: FormGroup = this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        role: ['Pro Plan']
    });

    ngOnInit() {
        const currentProfile = this.profileService.profile();
        this.profileForm.patchValue({
            firstName: currentProfile.firstName,
            lastName: currentProfile.lastName,
            email: currentProfile.email,
            role: currentProfile.role
        });
    }

    onSubmit() {
        if (this.profileForm.valid) {
            this.profileService.updateProfile(this.profileForm.value as UserProfile);
            const msg = this.ts.currentLang() === 'tr' ? 'Profil bilgileriniz başarıyla güncellendi.' : 'Profile information updated successfully.';
            this.notificationService.success(msg);
        }
    }

    isFieldInvalid(field: string): boolean {
        const control = this.profileForm.get(field);
        return control ? (control.invalid && (control.dirty || control.touched)) : false;
    }
}
