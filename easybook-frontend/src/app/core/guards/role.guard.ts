import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = async (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const roles = (route.data?.['roles'] as string[]) ?? [];
  if (!auth.isLoggedIn()) {
    router.navigateByUrl('/login');
    return false;
  }
  if (!auth.currentUser()) {
    try { await auth.fetchMe(); } catch { router.navigateByUrl('/login'); return false; }
  }
  const me = auth.currentUser();
  if (!me) { router.navigateByUrl('/login'); return false; }

  if (roles.length && !roles.includes(me.role)) {
    // sin permiso → vuelve al dashboard
    router.navigateByUrl('/');
    return false;
  }
  return true;
};
