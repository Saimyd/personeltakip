import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BudgetService } from '../../services/budget.service';
import { EditStateService } from '../../services/edit-state.service';
import { TranslationService } from '../../services/translation.service';
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
    ts = inject(TranslationService);

    transactionForm: FormGroup = this.fb.group({
        description: ['', [Validators.required, Validators.minLength(3)]],
        amount: [null, [Validators.required, Validators.min(0.01)]],
        type: ['expense', Validators.required],
        category: ['other', Validators.required],
        date: [new Date().toISOString().substring(0, 10), Validators.required]
    });

    isEditMode = false;
    editingId: string | null = null;

    constructor() {
        effect(() => {
            const transactionToEdit = this.editState.editingTransaction();
            if (transactionToEdit) {
                this.startEdit(transactionToEdit);
            }
        });
    }

    startEdit(transaction: BudgetTransaction) {
        this.isEditMode = true;
        this.editingId = transaction.id;
        this.transactionForm.patchValue({
            description: transaction.description,
            amount: transaction.amount,
            type: transaction.type,
            category: transaction.category || 'other',
            date: transaction.date.substring(0, 10)
        });
    }

    cancelEdit() {
        this.isEditMode = false;
        this.editingId = null;
        this.transactionForm.reset({
            type: 'expense',
            category: 'other',
            date: new Date().toISOString().substring(0, 10)
        });
        this.editState.clearEdit();
    }

    onSubmit() {
        if (this.transactionForm.valid) {
            const formValue = this.transactionForm.value;
            const transactionData = {
                description: formValue.description,
                amount: formValue.amount,
                type: formValue.type,
                category: formValue.category,
                date: new Date(formValue.date).toISOString()
            };

            if (this.isEditMode && this.editingId) {
                // Fix: Ensure we pass the COMPLETE transaction object with ID
                this.budgetService.updateTransaction({
                    id: this.editingId,
                    ...transactionData
                });
                this.cancelEdit();
            } else {
                this.budgetService.addTransaction(transactionData);
                this.transactionForm.reset({
                    type: 'expense',
                    category: 'other',
                    date: new Date().toISOString().substring(0, 10)
                });
            }
        }
    }

    isFieldInvalid(field: string): boolean {
        const control = this.transactionForm.get(field);
        return control ? (control.invalid && (control.dirty || control.touched)) : false;
    }
}
