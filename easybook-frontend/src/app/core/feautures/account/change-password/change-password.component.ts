import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../../services/users.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-password',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  private fb = inject(FormBuilder);
  private api = inject(UsersService);

  form = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]]
  });

  loading = signal(false);
  error = signal<string | null>(null);
  ok = signal(false);

  private parseErr(e: any, fb: string)  {
    const api = e?.error;
    if (api?.error === 'validation_error' && api?.details) {
      return Object.entries(api.details).map(([k, v]) => `${k}: ${v}`).join(' • ');
    }
    return api?.error || api?.message || fb;
  }

  async submit() {
    if (this.form.invalid) return;
    this.loading.set(true); this.error.set(null); this.ok.set(false);
    try {
      await this.api.changeOwnPassword(this.form.value as any);
      this.ok.set(true);
      this.form.reset();
    } catch (e: any) {
      this.error.set(this.parseErr(e, 'No se pudo cambiar la contraseña'));
    } finally { this.loading.set(false); }
  }


}
