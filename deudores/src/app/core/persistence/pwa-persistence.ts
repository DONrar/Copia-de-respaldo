import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PwaPersistenceService {
  /**
   * Solicita "almacenamiento persistente" en PWA para minimizar que el SO limpie datos.
   * Devuelve true si fue concedido por el navegador.
   */
  async request(): Promise<boolean> {
    try {
      const anyNav: any = navigator;
      if (!anyNav?.storage?.persist) return false;
      // Si ya es persistente, retorna true
      if (await anyNav.storage.persisted()) return true;
      return await anyNav.storage.persist();
    } catch {
      return false;
    }
  }
}
