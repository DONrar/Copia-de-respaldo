import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private auth = inject(AuthService);
  private router = inject(Router);

  email = 'admin@easybook.com';
  password = 'Admin123!';
  loading = signal(false);
  error = signal<string | null>(null);

  async submit() {
    this.loading.set(true);
    this.error.set(null);
    try {
      await this.auth.login(this.email, this.password);
      this.router.navigateByUrl('/');
    } catch (e: any) {
      this.error.set(e?.message ?? 'No se pudo iniciar sesión');
    } finally {
      this.loading.set(false);
    }
  }

}
