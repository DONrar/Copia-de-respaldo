import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [

  {
    path: 'login',
    loadComponent: () => import('../app/core/feautures/auth/login/login.component')
      .then(m => m.LoginComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('../app/core/feautures/dashboard/dashboard/dashboard.component')
      .then(m => m.DashboardComponent),
  },
  {
    path: 'rooms',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'STAFF'] },
    loadComponent: () => import('../app/core/feautures/rooms/room-list/room-list.component').then(m => m.RoomListComponent),
  },
  {
    path: 'inventory',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'STAFF'] },
    loadComponent: () => import('../app/core/feautures/inventory/inventory-page/inventory-page.component')
      .then(m => m.InventoryPageComponent),
  },
  {
    path: 'incidents',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'STAFF'] },
    loadComponent: () => import('../app/core/feautures/incidents/incidents-page/incidents-page.component')
      .then(m => m.IncidentsPageComponent),
  },
  {
    path: 'stays',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'STAFF'] },
    loadComponent: () => import('../app/core/feautures/stays/stays-page/stays-page.component')
      .then(m => m.StaysPageComponent),
  },
  {
    path: 'users',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () => import('../app/core/feautures/users-page/users-page.component')
      .then(m => m.UsersPageComponent),
  },
  {
    path: 'account/password',
    canActivate: [authGuard],
    loadComponent: () => import('../app/core/feautures/account/change-password/change-password.component')
      .then(m => m.ChangePasswordComponent),
  },
    // Más adelante: rooms, stays, incidents, inventory, users...
  { path: '**', redirectTo: '' }
];
