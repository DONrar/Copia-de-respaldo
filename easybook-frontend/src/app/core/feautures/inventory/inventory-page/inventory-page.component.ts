import { Component, inject, signal } from '@angular/core';
import { InventoryItemDto } from '../../../types/inventory.types';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InventoryService } from '../../../services/inventory.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventory-page',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './inventory-page.component.html',
  styleUrl: './inventory-page.component.css'
})
export class InventoryPageComponent {
  private fb = inject(FormBuilder);
  private api = inject(InventoryService);

  items = signal<InventoryItemDto[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  // create
  okCreate = signal(false);
  createForm = this.fb.group({
    name: ['', [Validators.required]],
    quantity: [0, [Validators.required, Validators.min(0)]],
    unit: ['unidad', [Validators.required]]
  });

  // edit inline
  editingId = signal<string | null>(null);
  editQty = 0;
  editUnit = '';

  // consume
  consumptions = signal<{ name: string; quantity: number }[]>([]);
  consName = '';
  consQty = 1;
  okConsume = signal(false);

  async ngOnInit() { await this.refresh(); }

  private parseError(e: any, fallback = 'Operación no realizada') {
    const api = e?.error;
    if (api?.error === 'validation_error' && api?.details) {
      return Object.entries(api.details).map(([k, v]) => `${k}: ${v}`).join(' • ');
    }
    return api?.error || api?.message || fallback;
  }

  async refresh() {
    this.loading.set(true); this.error.set(null);
    try {
      this.items.set(await this.api.list());
    } catch (e: any) {
      this.error.set(this.parseError(e, 'No se pudo cargar el inventario'));
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
      this.createForm.reset({ name: '', quantity: 0, unit: 'unidad' });
      await this.refresh();
    } catch (e: any) {
      this.error.set(this.parseError(e, 'No se pudo crear el producto'));
    } finally {
      this.loading.set(false);
    }
  }

  startEdit(it: InventoryItemDto) {
    this.editingId.set(it.id);
    this.editQty = it.quantity ?? 0;
    this.editUnit = it.unit ?? '';
  }

  cancelEdit() {
    this.editingId.set(null);
    this.editQty = 0;
    this.editUnit = '';
  }

  async saveEdit(it: InventoryItemDto) {
    this.loading.set(true); this.error.set(null);
    try {
      await this.api.update(it.id, { quantity: this.editQty, unit: this.editUnit });
      this.cancelEdit();
      await this.refresh();
    } catch (e: any) {
      this.error.set(this.parseError(e, 'No se pudo actualizar'));
    } finally {
      this.loading.set(false);
    }
  }

  addLine() {
    if (!this.consName || !this.consQty || this.consQty < 1) return;
    const arr = this.consumptions();
    const idx = arr.findIndex(a => a.name === this.consName);
    if (idx >= 0) arr[idx] = { name: this.consName, quantity: arr[idx].quantity + this.consQty };
    else arr.push({ name: this.consName, quantity: this.consQty });
    this.consumptions.set([...arr]);
    this.consName = ''; this.consQty = 1;
  }

  removeLine(i: number) {
    const arr = [...this.consumptions()];
    arr.splice(i, 1);
    this.consumptions.set(arr);
  }

  async consume() {
    if (!this.consumptions().length) return;
    this.loading.set(true); this.error.set(null); this.okConsume.set(false);
    try {
      await this.api.consume({ items: this.consumptions() });
      this.okConsume.set(true);
      this.consumptions.set([]);
      await this.refresh();
    } catch (e: any) {
      this.error.set(this.parseError(e, 'No se pudo consumir inventario'));
    } finally {
      this.loading.set(false);
    }
  }
}
