import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BudgetService } from '../../services/budget.service';
import { EditStateService } from '../../services/edit-state.service';
import { BudgetTransaction } from '../../models/transaction.model';

@Component({
    selector: 'app-transaction-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './transaction-form.component.html',
    styleUrl: './transaction-form.component.css'
})
export class TransactionFormComponent {
    fb = inject(FormBuilder);
    budgetService = inject(BudgetService);
    editState = inject(EditStateService);

    transactionForm: FormGroup = this.fb.group({
        description: ['', [Validators.required, Validators.minLength(3)]],
        amount: [null, [Validators.required, Validators.min(0.01)]],
        type: ['expense', Validators.required],
        date: [new Date().toISOString().split('T')[0]]
    });

    constructor() {
        // Monitor edit state changes
        effect(() => {
            const t = this.editState.editingTransaction();
            if (t) {
                this.transactionForm.patchValue({
                    description: t.description,
                    amount: t.amount,
                    type: t.type,
                    date: t.date
                });
            } else {
                // Reset form when edit is cancelled
                this.transactionForm.reset({ type: 'expense', date: new Date().toISOString().split('T')[0] });
            }
        });
    }

    cancelEdit() {
        this.editState.cancelEdit();
    }

    onSubmit() {
        if (this.transactionForm.valid) {
            const formValue = this.transactionForm.value;
            const t = this.editState.editingTransaction();

            if (t) {
                // Update
                this.budgetService.updateTransaction(t.id, {
                    ...formValue,
                    date: formValue.date || new Date().toISOString()
                });
                this.editState.cancelEdit();
            } else {
                // Create
                this.budgetService.addTransaction({
                    description: formValue.description,
                    amount: formValue.amount,
                    type: formValue.type,
                    date: formValue.date || new Date().toISOString()
                });
                this.transactionForm.reset({ type: 'expense', date: new Date().toISOString().split('T')[0] });
            }
        } else {
            Object.keys(this.transactionForm.controls).forEach(key => {
                const control = this.transactionForm.get(key);
                if (control?.invalid) {
                    control.markAsTouched();
                }
            });
        }
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.transactionForm.get(fieldName);
        return field ? (field.invalid && (field.dirty || field.touched)) : false;
    }
}
