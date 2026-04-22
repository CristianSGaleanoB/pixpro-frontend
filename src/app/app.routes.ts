import { Routes } from '@angular/router';
import { canActivateAuthRole } from './core/guards/auth';
import HomePage from './features/home/home';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'dashboard',
    canActivate: [canActivateAuthRole],
    data: { role: 'user' },
    loadComponent: () => import('./features/dashboard/dashboard'),
  },
];
