import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Role, UserDetailsDto } from '../../types/users.types';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-users-page',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.css'
})
export class UsersPageComponent {
  private fb = inject(FormBuilder);
  private api = inject(UsersService);

  // listado
  rows = signal<UserDetailsDto[]>([]);
  page = signal(0);
  size = signal(10);
  totalPages = signal(1);
  loading = signal(false);
  error = signal<string | null>(null);

  // filtros
  search = '';
  roleFilter: '' | Role = '';
  enabledFilter: '' | 'true' | 'false' = '';

  // crear
  okCreate = signal(false);
  createForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    fullName: ['', [Validators.required]],
    role: ['GUEST', [Validators.required]],
    password: ['']
  });

  // edición
  editId = signal<string | null>(null);
  editName = '';
  editRole: Role = 'GUEST';

  // reset / set password
  resetResultId = signal<string | null>(null);
  resetTempPassword = '';
  setPassId = signal<string | null>(null);
  setPassValue = '';

  async ngOnInit() {
    await this.load();
  }

  private parseErr(e: any, fb: string) {
    const api = e?.error;
    if (api?.error === 'validation_error' && api?.details) {
      return Object.entries(api.details).map(([k, v]) => `${k}: ${v}`).join(' • ');
    }
    return api?.error || api?.message || fb;
  }

  async load() {
    this.loading.set(true); this.error.set(null);
    try {
      const res = await this.api.list({
        search: this.search || undefined,
        role: this.roleFilter || undefined,
        enabled: this.enabledFilter || undefined,
        page: this.page(),
        size: this.size()
      });
      this.rows.set(res.content);
      this.totalPages.set(Math.max(1, res.totalPages || 1));
    } catch (e: any) {
      this.error.set(this.parseErr(e, 'No se pudo cargar usuarios'));
    } finally {
      this.loading.set(false);
    }
  }

  async create() {
    if (this.createForm.invalid) return;
    this.loading.set(true); this.error.set(null); this.okCreate.set(false);
    try {
      await this.api.create(this.createForm.value as any);
      this.okCreate.set(true);
      this.createForm.reset({ email: '', fullName: '', role: 'GUEST', password: '' });
      this.page.set(0);
      await this.load();
    } catch (e: any) {
      this.error.set(this.parseErr(e, 'No se pudo crear'));
    } finally { this.loading.set(false); }
  }

  startEdit(u: UserDetailsDto) {
    this.editId.set(u.id);
    this.editName = u.fullName;
    this.editRole = u.role;
  }

  cancelEdit() {
    this.editId.set(null);
    this.editName = '';
    this.editRole = 'GUEST';
  }

  async saveEdit(u: UserDetailsDto) {
    this.loading.set(true); this.error.set(null);
    try {
      await this.api.update(u.id, { fullName: this.editName, role: this.editRole });
      this.cancelEdit();
      await this.load();
    } catch (e: any) {
      this.error.set(this.parseErr(e, 'No se pudo actualizar'));
    } finally { this.loading.set(false); }
  }

  async toggleEnable(u: UserDetailsDto) {
    this.loading.set(true); this.error.set(null);
    try {
      if (u.enabled) await this.api.disable(u.id);
      else await this.api.enable(u.id);
      await this.load();
    } catch (e: any) {
      this.error.set(this.parseErr(e, 'No se pudo cambiar el estado'));
    } finally { this.loading.set(false); }
  }

  async doReset(u: UserDetailsDto) {
    this.loading.set(true); this.error.set(null);
    try {
      const res = await this.api.resetPassword(u.id);
      this.resetResultId.set(u.id);
      this.resetTempPassword = res.temporaryPassword;
    } catch (e: any) {
      this.error.set(this.parseErr(e, 'No se pudo resetear la contraseña'));
    } finally { this.loading.set(false); }
  }

  openSetPass(u: UserDetailsDto) {
    this.setPassId.set(u.id);
    this.setPassValue = '';
  }

  cancelSetPass() {
    this.setPassId.set(null);
    this.setPassValue = '';
  }

  async confirmSetPass() {
    const id = this.setPassId(); if (!id) return;
    if (!this.setPassValue || this.setPassValue.length < 6) {
      this.error.set('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    this.loading.set(true); this.error.set(null);
    try {
      await this.api.adminSetPassword(id, this.setPassValue);
      this.cancelSetPass();
    } catch (e: any) {
      this.error.set(this.parseErr(e, 'No se pudo establecer la contraseña'));
    } finally { this.loading.set(false); }
  }

  async remove(u: UserDetailsDto) {
    if (!confirm(`¿Eliminar usuario ${u.email}?`)) return;
    this.loading.set(true); this.error.set(null);
    try {
      await this.api.delete(u.id);
      await this.load();
    } catch (e: any) {
      this.error.set(this.parseErr(e, 'No se pudo eliminar'));
    } finally { this.loading.set(false); }
  }

  next() { if (this.page() < this.totalPages() - 1) { this.page.set(this.page() + 1); this.load(); } }
  prev() { if (this.page() > 0) { this.page.set(this.page() - 1); this.load(); } }
}
