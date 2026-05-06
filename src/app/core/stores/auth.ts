import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { AuthState } from '../interfaces/auth';
import { AuthGuardData } from 'keycloak-angular';
import Keycloak from 'keycloak-js';

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
    /**
     * Initialize auth state from Keycloak instance directly.
     * Used when guard hasn't run but Keycloak is already authenticated.
     */
    initFromKeycloak(keycloak: Keycloak): void {
      if (!keycloak.authenticated || !keycloak.token) {
        return;
      }

      const sub = keycloak.tokenParsed?.sub;
      const email = keycloak.tokenParsed?.['email'];
      const roles = keycloak.realmAccess?.roles || [];

      if (!sub) {
        throw new Error('Invalid token: sub does not exist');
      }

      patchState(store, {
        user: {
          id: sub,
          email: email || '',
          role: roles,
        },
        token: keycloak.token,
        status: 'authenticated',
      });
    },
    login(token: AuthGuardData): void {
      const sub = token.keycloak.tokenParsed?.sub;
      const email = token.keycloak.tokenParsed?.['email'];
      const role = token.grantedRoles.realmRoles;

      if (!sub) {
        throw new Error('Invalid token: sub does not exist');
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
