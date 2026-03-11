import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RoomDto } from '../../../types/room.types';
import { RoomsService } from '../../../services/rooms.service';

@Component({
  selector: 'app-room-list',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.css'
})
export class RoomListComponent {

  private fb = inject(FormBuilder);
  private api = inject(RoomsService);

  rooms = signal<RoomDto[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  ok = signal(false);

  form = this.fb.group({
    number: ['', [Validators.required]],
    type: ['double', [Validators.required]]
  });

  async ngOnInit() { await this.refresh(); }

  async refresh() {
    this.loading.set(true); this.error.set(null); this.ok.set(false);
    try {
      this.rooms.set(await this.api.list());
    } catch (e: any) {
      this.error.set(e?.error?.message || 'No se pudo cargar rooms');
    } finally {
      this.loading.set(false);
    }
  }

  async create() {
    if (this.form.invalid) return;
    this.loading.set(true); this.error.set(null); this.ok.set(false);
    try {
      await this.api.create(this.form.value as any);
      this.ok.set(true);
      this.form.reset({ number: '', type: 'double' });
      await this.refresh();
    } catch (e: any) {
      const api = e?.error;
      const msg =
        api?.error === 'validation_error' && api?.details
          ? Object.entries(api.details).map(([k, v]) => `${k}: ${v}`).join(' • ')
          : api?.error || api?.message || 'No se pudo crear la habitación';
      this.error.set(msg);
    } finally {
      this.loading.set(false);
    }
  }

  async delete(r: RoomDto) {
    if (!confirm(`Eliminar la habitación ${r.number}?`)) return;
    this.loading.set(true); this.error.set(null);
    try {
      await this.api.remove(r.number);
      await this.refresh();
    } catch (e: any) {
      this.error.set(e?.error?.message || 'No se pudo eliminar');
    } finally {
      this.loading.set(false);
    }
  }
}
