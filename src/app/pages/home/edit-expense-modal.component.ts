import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Expense } from '../../services/expense.service';

@Component({
  selector: 'app-edit-expense-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Editar Gasto</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-item>
        <ion-label position="stacked">Descripción</ion-label>
        <ion-input [(ngModel)]="expense.description"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="stacked">Monto</ion-label>
        <ion-input type="number" [(ngModel)]="expense.amount"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="stacked">Fecha</ion-label>
        <ion-input type="date" [(ngModel)]="expense.date"></ion-input>
      </ion-item>
      <ion-button expand="block" (click)="save()">Guardar Cambios</ion-button>
      <ion-button expand="block" color="medium" (click)="close()">Cancelar</ion-button>
    </ion-content>
  `,
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
})
export class EditExpenseModalComponent {
  @Input() expense!: Expense;

  constructor(private modalCtrl: ModalController) {}

  save() {
    this.modalCtrl.dismiss(this.expense);
  }

  close() {
    this.modalCtrl.dismiss(null);
  }
}
