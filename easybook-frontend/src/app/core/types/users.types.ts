export type Role = 'ADMIN' | 'STAFF' | 'GUEST';

export interface UserDetailsDto {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  enabled: boolean;
}

export interface CreateUserRequest {
  email: string;
  fullName: string;
  role?: Role;            // default GUEST si no envías
  password?: string;      // opcional; si no envías, backend genera temporal
}

export interface UpdateUserRequest {
  fullName?: string;
  role?: Role;
  enabled?: boolean;
}

export interface ResetPasswordResponse {
  temporaryPassword: string;
}

export interface AdminSetPasswordRequest {
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
