import { Component } from '@angular/core';
import { ExpenseService, Expense } from '../services/expense.service';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonList, IonItem, IonLabel],
})
export class HomePage {
  expenses: Expense[] = [];
  newExpense: Expense = { description: '', amount: 0, date: '' };
  editExpense: Expense | null = null;

  constructor(private expenseService: ExpenseService) {
    this.loadExpenses();
  }

  loadExpenses() {
    this.expenseService.getExpenses().subscribe(data => {
      this.expenses = data;
    });
  }

  addExpense() {
    if (!this.newExpense.description || !this.newExpense.amount) return;
    this.expenseService.addExpense(this.newExpense).subscribe(() => {
      this.newExpense = { description: '', amount: 0, date: '' };
      this.loadExpenses();
    });
  }

  setEdit(expense: Expense) {
    this.editExpense = { ...expense };
  }

  updateExpense() {
    if (!this.editExpense || !this.editExpense._id) return;
    this.expenseService.updateExpense(this.editExpense._id, this.editExpense).subscribe(() => {
      this.editExpense = null;
      this.loadExpenses();
    });
  }

  deleteExpense(id: string) {
    this.expenseService.deleteExpense(id).subscribe(() => {
      this.loadExpenses();
    });
  }
}
