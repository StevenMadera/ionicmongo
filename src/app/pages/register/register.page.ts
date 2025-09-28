import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule
  ]
})
export class RegisterPage {
  registerForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  async onSubmit() {
    if (this.registerForm.invalid) return;

    const { name, email, password } = this.registerForm.value;

    try {
      await this.auth.register(name!, email!, password!);
      // login automático tras registro
      await this.auth.login(email!, password!);
      localStorage.setItem('username', email!);
      const toast = await this.toastCtrl.create({
        message: 'Usuario registrado y sesión iniciada',
        duration: 2000,
        color: 'success'
      });
      toast.present();
      // redirige a home con sesión iniciada
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (err: any) {
      const toast = await this.toastCtrl.create({
        message: err.message || 'Error al registrar',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    }
  }
  
    goToLogin() {
      this.router.navigate(['/login']);
    }
}
