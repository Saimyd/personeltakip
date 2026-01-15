import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BudgetService } from '../../services/budget.service';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-transaction-form',
    standalone: true,
    imports: [ReactiveFormsModule, NgIf],
    templateUrl: './transaction-form.component.html',
    styleUrl: './transaction-form.component.css'
})
export class TransactionFormComponent {
    private fb = inject(FormBuilder);
    private budgetService = inject(BudgetService);

    transactionForm: FormGroup = this.fb.group({
        description: ['', [Validators.required, Validators.minLength(3)]],
        amount: [null, [Validators.required, Validators.min(0.01)]],
        type: ['expense', Validators.required]
    });

    onSubmit() {
        if (this.transactionForm.valid) {
            this.budgetService.addTransaction({
                ...this.transactionForm.value,
                date: new Date().toISOString()
            });
            this.transactionForm.reset({ type: 'expense' });
        } else {
            this.transactionForm.markAllAsTouched();
        }
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.transactionForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }
}
