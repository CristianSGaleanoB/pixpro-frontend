import { Routes } from '@angular/router';
import { canActivateAuthRole } from './core/guards/auth';
import HomePage from './features/home/home';
import AuthPage from './features/auth/auth';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'auth',
    component: AuthPage,
  },
  {
    path: 'dashboard',
    canActivate: [canActivateAuthRole],
    data: { role: 'user' },
    loadComponent: () => import('./features/dashboard/dashboard'),
  },
];
