import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiService, LoginRequest, LoginResponse } from './api-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  private currentUser = new BehaviorSubject<any>(null);

  constructor(private apiService: ApiService) {
    this.checkToken();
  }

  async checkToken() {
    const token = await this.getToken();
    if (token) {
      this.apiService.validateToken().subscribe({
        next: (response) => {
          if (response.success) {
            this.isAuthenticated.next(true);
          } else {
            this.logout();
          }
        },
        error: () => this.logout()
      });
    }
  }

  login(credentials: LoginRequest): Observable<boolean> {
    return this.apiService.login(credentials).pipe(
      tap(async response => {
        if (response.success) {
          await Preferences.set({
            key: 'token',
            value: response.data.token
          });
          await Preferences.set({
            key: 'user',
            value: JSON.stringify(response.data)
          });
          this.isAuthenticated.next(true);
          this.currentUser.next(response.data);
        }
      }),
      map(response => response.success)
    );
  }

  async logout() {
    await Preferences.remove({ key: 'token' });
    await Preferences.remove({ key: 'user' });
    this.isAuthenticated.next(false);
    this.currentUser.next(null);
  }

  async getToken(): Promise<string | null> {
    const { value } = await Preferences.get({ key: 'token' });
    return value;
  }

  async getUser(): Promise<any> {
    const { value } = await Preferences.get({ key: 'user' });
    return value ? JSON.parse(value) : null;
  }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  getCurrentUser(): Observable<any> {
    return this.currentUser.asObservable();
  }
}
