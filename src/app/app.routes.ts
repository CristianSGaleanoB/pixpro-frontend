import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth';
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
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard'),
  },
];
