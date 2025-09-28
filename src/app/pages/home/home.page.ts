import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ExpenseService, Expense } from '../../services/expense.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController, AlertController } from '@ionic/angular';
import { EditExpenseModalComponent } from './edit-expense-modal.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
})
export class HomePage implements OnInit {
  isAuth = false;
  username = '';
  expenses: Expense[] = [];
  newExpense: Expense = { description: '', amount: 0, date: '' };
  editExpense: Expense | null = null;

  showAddModal = false;
  // showEditModal = false;

  constructor(
    private auth: AuthService,
    private expenseService: ExpenseService,
    private router: Router,
    private alertController: AlertController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit(): void {
    this.updateAuthState();
    this.loadExpenses();
  }

  ionViewWillEnter() {
    this.updateAuthState();
    this.loadExpenses();
  }

  updateAuthState() {
    this.isAuth = this.auth.isAuthenticated();
    this.username = localStorage.getItem('username') || '';
  }

  async logout() {
    this.auth.logout();
    this.isAuth = false;
    localStorage.removeItem('username');
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  loadExpenses() {
    this.expenseService.getExpenses().subscribe(data => {
      this.expenses = data;
    });
  }

  openAddModal() {
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
    this.newExpense = { description: '', amount: 0, date: '' };
  }

  addExpense() {
    if (!this.newExpense.description || !this.newExpense.amount) return;
    this.expenseService.addExpense(this.newExpense).subscribe({
      next: () => {
        this.closeAddModal();
        this.loadExpenses();
      },
      error: (err) => {
        console.error('Error al guardar gasto:', err);
        alert('No se pudo guardar el gasto: ' + (err.error?.error || err.message || 'Error desconocido'));
      }
    });
  }

  async setEdit(expense: Expense) {
    const modal = await this.modalCtrl.create({
      component: EditExpenseModalComponent,
      componentProps: { expense: { ...expense } }
    });
    const { data } = await modal.present().then(() => modal.onDidDismiss());
    if (data) {
      this.updateExpenseData(data);
    }
  }

  updateExpenseData(updated: Expense) {
    if (!updated._id) return;
    this.expenseService.updateExpense(updated._id, updated).subscribe(() => {
      this.loadExpenses();
    });
  }

  // El modal de edición ahora se maneja con ModalController

  async deleteExpense(id?: string) {
    if (!id) return;
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar este gasto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.expenseService.deleteExpense(id).subscribe(() => {
              this.expenses = this.expenses.filter(e => e._id !== id);
            });
          },
        }
      ]
    });
    await alert.present();
  }
}
