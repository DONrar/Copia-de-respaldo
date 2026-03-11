import { Routes } from '@angular/router';

export const routes: Routes = [
 {
    path: 'users',
    loadComponent: () => import('./pages/users/users.page').then( m => m.UsersPage)
  },
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full',
  },

];
