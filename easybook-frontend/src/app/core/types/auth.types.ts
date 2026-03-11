export interface AuthRequest {
  email: string;
  password: string;
}
export interface AuthResponse {
  type: 'Bearer';
  token: string;
  expiresAt: string; // ISO date
}
export interface UserDto {
  id: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'STAFF' | 'GUEST';
  enabled: boolean;
}
