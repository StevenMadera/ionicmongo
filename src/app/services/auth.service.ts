import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'http://localhost:5000/api/auth'; // dirección del backend

  constructor(private http: HttpClient) {}

  // login: envía email y password, recibe token
  login(email: string, password: string) {
    return new Promise<void>((resolve, reject) => {
      this.http.post<{ token: string }>(`${this.api}/login`, { email, password })
        .subscribe({
          next: res => {
            // guardar token (considera usar Ionic Storage en producción)
            localStorage.setItem('token', res.token);
            resolve();
          },
          error: err => {
            reject(new Error(err.error?.message || 'Login falló'));
          }
        });
    });
  }

  logout() {
    localStorage.removeItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  register(name: string, email: string, password: string) {
  return new Promise<void>((resolve, reject) => {
    this.http.post(`${this.api}/register`, { name, email, password })
      .subscribe({
        next: () => resolve(),
        error: err => reject(new Error(err.error?.message || 'Registro falló'))
      });
  });
}

}
