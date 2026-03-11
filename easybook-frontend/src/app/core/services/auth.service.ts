import { Injectable, effect, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorage } from './token-storage.service';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environment/environment';
import { UserDto, AuthResponse, AuthRequest } from '../types/auth.types';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private storage = inject(TokenStorage);

  private _user = signal<UserDto | null>(null);
  currentUser = this._user;

  isLoggedIn() { return !!this.storage.get(); }
  token(): string | null { return this.storage.get(); }

  async login(email: string, password: string) {
    const url = `${environment.apiBaseUrl}/auth/login`;
    const body: AuthRequest = { email, password };

    try {
      const res = await firstValueFrom(
        this.http.post<AuthResponse>(url, body, {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        })
      );
      this.storage.set(res.token);
      await this.fetchMe();
    } catch (err: any) {
      // Propaga mensaje legible al componente
      const api = err?.error;
      const msg =
        api?.error === 'validation_error' && api?.details
          ? Object.entries(api.details).map(([k, v]) => `${k}: ${v}`).join(' • ')
          : api?.error || api?.message || 'No se pudo iniciar sesión';
      throw { message: msg };
    }
  }

  async fetchMe() {
    const url = `${environment.apiBaseUrl}/auth/me`;
    const me = await firstValueFrom(this.http.get<UserDto>(url));
    this._user.set(me);
  }

  logout() {
    this.storage.clear();
    this._user.set(null);
  }
}
