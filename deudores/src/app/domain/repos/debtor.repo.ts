import { Injectable } from '@angular/core';
import { StorageService } from '../../core/storage/storage';
import { Debtor, ID } from '../models';

const KEY = 'debtors';

@Injectable({ providedIn: 'root' })
export class DebtorRepo {
  constructor(private store: StorageService) {}

  private async all(): Promise<Debtor[]> {
    return (await this.store.get<Debtor[]>(KEY)) ?? [];
    }

  private async saveAll(list: Debtor[]) {
    return this.store.set(KEY, list);
  }

  async list(): Promise<Debtor[]> {
    return this.all();
  }

  async get(id: ID): Promise<Debtor | undefined> {
    return (await this.all()).find(d => d.id === id);
  }

  async upsert(input: Partial<Debtor> & Pick<Debtor, 'name'>): Promise<Debtor> {
    const list = await this.all();
    if (input.id) {
      const idx = list.findIndex(d => d.id === input.id);
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...input, updatedAt: Date.now() } as Debtor;
        await this.saveAll(list);
        return list[idx];
      }
    }
    const now = Date.now();
    const debtor: Debtor = {
      id: crypto.randomUUID(),
      name: input.name,
      phone: input.phone,
      notes: input.notes,
      createdAt: now,
      updatedAt: now,
    };
    list.push(debtor);
    await this.saveAll(list);
    return debtor;
  }

  async remove(id: ID) {
    const list = await this.all();
    await this.saveAll(list.filter(d => d.id !== id));
  }
}
