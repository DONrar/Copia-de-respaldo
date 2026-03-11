import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environment/environment';
import {
  UserDetailsDto, CreateUserRequest, UpdateUserRequest, ResetPasswordResponse,
  AdminSetPasswordRequest, ChangePasswordRequest, Role
} from '../types/users.types';
import { PageResponse } from '../types/page.types';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/users`;

  list(opts: { search?: string; role?: Role | ''; enabled?: '' | 'true' | 'false'; page?: number; size?: number } = {}) {
    let params = new HttpParams()
      .set('page', String(opts.page ?? 0))
      .set('size', String(opts.size ?? 20));
    if (opts.search) params = params.set('search', opts.search);
    if (opts.role) params = params.set('role', opts.role);
    if (opts.enabled) params = params.set('enabled', opts.enabled);
    return firstValueFrom(this.http.get<PageResponse<UserDetailsDto>>(this.base, { params }));
  }

  create(req: CreateUserRequest) {
    return firstValueFrom(this.http.post<UserDetailsDto>(this.base, req));
  }

  get(id: string) {
    return firstValueFrom(this.http.get<UserDetailsDto>(`${this.base}/${id}`));
  }

  update(id: string, req: UpdateUserRequest) {
    return firstValueFrom(this.http.put<UserDetailsDto>(`${this.base}/${id}`, req));
  }

  enable(id: string) {
    return firstValueFrom(this.http.post<void>(`${this.base}/${id}/enable`, {}));
  }

  disable(id: string) {
    return firstValueFrom(this.http.post<void>(`${this.base}/${id}/disable`, {}));
  }

  resetPassword(id: string) {
    return firstValueFrom(this.http.post<ResetPasswordResponse>(`${this.base}/${id}/reset-password`, {}));
  }

  adminSetPassword(id: string, newPassword: string) {
    const body: AdminSetPasswordRequest = { newPassword };
    return firstValueFrom(this.http.post<void>(`${this.base}/${id}/set-password`, body));
  }

  delete(id: string) {
    return firstValueFrom(this.http.delete<void>(`${this.base}/${id}`));
  }

  changeOwnPassword(body: ChangePasswordRequest) {
    return firstValueFrom(this.http.post<void>(`${this.base}/me/change-password`, body));
  }
}
