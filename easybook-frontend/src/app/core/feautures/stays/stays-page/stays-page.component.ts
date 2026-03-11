import { Component, inject, signal } from '@angular/core';
import { StaysService } from '../../../services/stay.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RoomsService } from '../../../services/rooms.service';
import { RoomDto } from '../../../types/room.types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stays-page',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './stays-page.component.html',
  styleUrl: './stays-page.component.css'
})
export class StaysPageComponent {

  private fb = inject(FormBuilder);
  private roomsApi = inject(RoomsService);
  private staysApi = inject(StaysService);

  rooms = signal<RoomDto[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  okIn = signal(false);
  okOut = signal(false);

  inForm = this.fb.group({
    roomNumber: ['', Validators.required],
    guestEmail: ['', [Validators.required, Validators.email]],
    guestFullName: ['', Validators.required],
  });

  outForm = this.fb.group({
    roomNumber: ['', Validators.required],
    assignedStaffEmail: [''] // opcional
  });

  async ngOnInit() { await this.refreshRooms(); }

  availableRooms() {
    // Si backend no expone status, dejamos seleccionar todas
    const list = this.rooms();
    if (!list.length || list.every(r => !r.status)) return list;
    return list.filter(r => r.status === 'AVAILABLE');
  }

  occupiedRooms() {
    const list = this.rooms();
    if (!list.length || list.every(r => !r.status)) return list;
    return list.filter(r => r.status === 'OCCUPIED');
  }

  private parseErr(e: any, fallback: string) {
    const api = e?.error;
    if (api?.error === 'validation_error' && api?.details) {
      return Object.entries(api.details).map(([k, v]) => `${k}: ${v}`).join(' • ');
    }
    return api?.error || api?.message || fallback;
  }

  async refreshRooms() {
    this.loading.set(true); this.error.set(null);
    try { this.rooms.set(await this.roomsApi.list()); }
    catch (e: any) { this.error.set(this.parseErr(e, 'No se pudo cargar habitaciones')); }
    finally { this.loading.set(false); }
  }

  async doCheckIn() {
    if (this.inForm.invalid) return;
    this.loading.set(true); this.error.set(null); this.okIn.set(false);
    try {
      await this.staysApi.checkIn(this.inForm.value as any);
      this.okIn.set(true);
      this.inForm.reset({ roomNumber: '', guestEmail: '', guestFullName: '' });
      await this.refreshRooms();
    } catch (e: any) {
      console.error('check-in error', e);
      this.error.set(this.parseErr(e, 'No se pudo hacer el check-in'));
    }
    finally { this.loading.set(false); }
  }

  async doCheckOut() {
    if (this.outForm.invalid) return;
    this.loading.set(true); this.error.set(null); this.okOut.set(false);
    try {
      await this.staysApi.checkOut(this.outForm.value as any);
      this.okOut.set(true);
      this.outForm.reset({ roomNumber: '', assignedStaffEmail: '' });
      await this.refreshRooms();
    } catch (e: any) {
      this.error.set(this.parseErr(e, 'No se pudo hacer el check-out'));
    } finally { this.loading.set(false); }
  }
}
