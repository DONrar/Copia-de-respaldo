import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    router.navigateByUrl('/login');
    return false;
  }
  // Si hay token pero aún no cargamos el usuario, intentamos /auth/me
  if (!auth.currentUser()) {
    try { await auth.fetchMe(); } catch { /* el interceptor manejará 401 */ }
  }
  return !!auth.currentUser();
};
