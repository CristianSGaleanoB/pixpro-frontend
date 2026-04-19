import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { AuthState } from '../interfaces/auth';
import { AuthGuardData } from 'keycloak-angular';

const initialState: AuthState = {
  user: null,
  token: '',
  status: 'idle',
};

/**
 * Auth state for the UI + token for HttpInterceptor. Login navigates to /dashboard on success;
 * logout clears state and navigates home (single place for post-auth navigation after IAM).
 */
export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ user, token }) => ({
    isAuthenticated: () => user() !== null && token().length > 0,
  })),
  withMethods((store, router = inject(Router)) => ({
    login(token: AuthGuardData): void {
      const sub = token.keycloak.tokenParsed?.sub;
      const email = token.keycloak.tokenParsed?.['email'];
      const role = token.grantedRoles.realmRoles;

      if (!sub) {
        throw new Error('Token inválido: sub no existe');
      }

      patchState(store, {
        user: {
          id: sub,
          email: email,
          role: role,
        },
        token: token.keycloak.token,
        status: 'authenticated',
      });
    },
    logout(): void {
      patchState(store, initialState);
      void router.navigate(['/']);
    },
  }))
);
