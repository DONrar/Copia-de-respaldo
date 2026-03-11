import { Injectable } from '@angular/core';

const TOKEN_KEY = 'easybook_token';

@Injectable({ providedIn: 'root' })
export class TokenStorage {
  set(token: string) { localStorage.setItem(TOKEN_KEY, token); }
  get(): string | null { return localStorage.getItem(TOKEN_KEY); }
  clear() { localStorage.removeItem(TOKEN_KEY); }
}
