import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private _storage?: Storage;

  async init() {
    this._storage = new Storage({
      name: '__deudores_db',
      // 👇 Usa los nombres de driver soportados por localforage
      driverOrder: ['indexeddb', 'localstorage'] as const
    });
    await this._storage.create();
  }

  private get store() {
    if (!this._storage) throw new Error('Storage not initialized');
    return this._storage;
  }

  set<T = unknown>(key: string, value: T)    { return this.store.set(key, value); }
  get<T = unknown>(key: string)              { return this.store.get(key) as Promise<T | null>; }
  remove(key: string)                        { return this.store.remove(key); }
  keys()                                     { return this.store.keys(); }
  clear()                                    { return this.store.clear(); }
}
