import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CleaningIncidentDto, IncidentStatus } from '../../../types/incidents.types';
import { InventoryService } from '../../../services/inventory.service';
import { IncidentsService } from '../../../services/incidents.service';

@Component({
  selector: 'app-incidents-page',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './incidents-page.component.html',
  styleUrl: './incidents-page.component.css'
})
export class IncidentsPageComponent {
  private api = inject(IncidentsService);
  private invApi = inject(InventoryService);

  tab = signal<IncidentStatus>('PENDING');
  pending = signal<CleaningIncidentDto[]>([]);
  done = signal<CleaningIncidentDto[]>([]);
  error = signal<string | null>(null);
  loading = signal(false);

  // asignar
  assignId = signal<string | null>(null);
  assignEmail = '';
  // resolver
  resolveId = signal<string | null>(null);
  consumptions = signal<{ name: string; quantity: number }[]>([]);
  consName = ''; consQty = 1;

  // inventario (para sugerir nombres)
  inventoryNames = signal<string[]>([]);

  // helper para *ngIf en fila
  get incToogleId() {
    return this.assignId() || this.resolveId();
  }

  async ngOnInit() {
    await this.loadTab();
    await this.loadInventoryNames();
  }

  async loadInventoryNames() {
    try {
      const items = await this.invApi.list();
      this.inventoryNames.set(items.map(i => i.name));
    } catch { /* silencioso */ }
  }

  setTab(t: IncidentStatus) {
    this.tab.set(t);
    this.assignId.set(null);
    this.resolveId.set(null);
    this.error.set(null);
    this.loadTab();
  }

  async loadTab() {
    this.loading.set(true); this.error.set(null);
    try {
      if (this.tab()==='PENDING') {
        this.pending.set(await this.api.list('PENDING'));
      } else {
        this.done.set(await this.api.list('DONE'));
      }
    } catch (e: any) {
      this.error.set(this.parseErr(e, 'No se pudo cargar incidencias'));
    } finally {
      this.loading.set(false);
    }
  }

  toggleAssign(inc: CleaningIncidentDto) {
    this.resolveId.set(null);
    this.assignId.set(inc.id);
    this.assignEmail = inc.assignedStaffEmail || '';
  }
  cancelAssign() { this.assignId.set(null); this.assignEmail = ''; }

  async assign() {
    const id = this.assignId(); if (!id) return;
    this.loading.set(true); this.error.set(null);
    try {
      await this.api.assign(id, { staffEmail: this.assignEmail });
      this.cancelAssign();
      await this.loadTab();
    } catch (e: any) {
      this.error.set(this.parseErr(e, 'No se pudo asignar'));
    } finally { this.loading.set(false); }
  }

  toggleResolve(inc: CleaningIncidentDto) {
    this.assignId.set(null);
    this.resolveId.set(inc.id);
    this.consumptions.set([]);
    this.consName = ''; this.consQty = 1;
  }
  cancelResolve() {
    this.resolveId.set(null);
    this.consumptions.set([]);
    this.consName = ''; this.consQty = 1;
  }

  addCons() {
    if (!this.consName || !this.consQty || this.consQty < 1) return;
    const arr = [...this.consumptions()];
    const i = arr.findIndex(a => a.name === this.consName);
    if (i >= 0) arr[i] = { name: this.consName, quantity: arr[i].quantity + this.consQty };
    else arr.push({ name: this.consName, quantity: this.consQty });
    this.consumptions.set(arr);
    this.consName = ''; this.consQty = 1;
  }
  removeCons(i: number) {
    const arr = [...this.consumptions()]; arr.splice(i,1); this.consumptions.set(arr);
  }

  async resolve() {
    const id = this.resolveId(); if (!id) return;
    this.loading.set(true); this.error.set(null);
    try {
      await this.api.resolve(id, { consumption: this.consumptions() });
      this.cancelResolve();
      // al resolver, desaparecerá de PENDING; opcionalmente refrescamos también DONE
      await Promise.all([this.loadTab(), this.refreshDone()]);
    } catch (e: any) {
      this.error.set(this.parseErr(e, 'No se pudo resolver la incidencia'));
    } finally { this.loading.set(false); }
  }

  private async refreshDone() {
    try { this.done.set(await this.api.list('DONE')); } catch { /* no-op */ }
  }

  private parseErr(e: any, fb: string) {
    const api = e?.error;
    if (api?.error === 'validation_error' && api?.details) {
      return Object.entries(api.details).map(([k,v]) => `${k}: ${v}`).join(' • ');
    }
    return api?.error || api?.message || fb;
  }
}
