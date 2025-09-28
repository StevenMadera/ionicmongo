import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule
  ]
})
export class LoginPage {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  async onSubmit() {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;
    try {
      await this.auth.login(email!, password!);
      localStorage.setItem('username', email!);
      const toast = await this.toastCtrl.create({
        message: 'Login exitoso',
        duration: 2000,
        color: 'success'
      });
      toast.present();
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (err: any) {
      const toast = await this.toastCtrl.create({
        message: err.message || 'Error al iniciar sesión',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
