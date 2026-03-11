import { Injectable } from '@angular/core';
import { StorageService } from  '../../core/storage/storage';
import { Debt, DebtItem, DebtStatus, ID } from '../models';
import { calcDebtTotals, calcItemTotal } from '../totals.util';

const KEY = 'debts';

@Injectable({ providedIn: 'root' })
export class DebtRepo {
  constructor(private store: StorageService) {}

  private async all(): Promise<Debt[]> {
    return (await this.store.get<Debt[]>(KEY)) ?? [];
  }
  private async saveAll(list: Debt[]) {
    return this.store.set(KEY, list);
  }

  async listAll(): Promise<Debt[]> { return this.all(); }

  async listByDebtor(debtorId: ID): Promise<Debt[]> {
    return (await this.all()).filter(d => d.debtorId === debtorId);
  }

  async get(id: ID): Promise<Debt | undefined> {
    return (await this.all()).find(d => d.id === id);
  }

  async create(params: {
    debtorId: ID;
    date: string;
    items: Array<Pick<DebtItem, 'product' | 'qty' | 'unitPrice'>>;
    note?: string;
  }): Promise<Debt> {
    const items: DebtItem[] = params.items.map(it => ({
      id: crypto.randomUUID(),
      product: (it.product ?? '').trim(),
      qty: Number(it.qty) || 0,
      unitPrice: Number(it.unitPrice) || 0,
      total: calcItemTotal(Number(it.qty) || 0, Number(it.unitPrice) || 0),
    }));
    const totals = calcDebtTotals(items);
    const now = Date.now();
    const debt: Debt = {
      id: crypto.randomUUID(),
      debtorId: params.debtorId,
      date: params.date,
      items,
      total: totals.total,
      paid: 0,
      balance: totals.balance,
      status: 'OPEN' as DebtStatus,
      note: params.note,
      createdAt: now,
      updatedAt: now,
    };
    const list = await this.all();
    list.push(debt);
    await this.saveAll(list);
    return debt;
  }
}
