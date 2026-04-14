import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, switchMap, tap } from 'rxjs';
import { AuthState } from '../interfaces/auth';
import { MockAuthService } from '../services/mock-auth';

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
  withMethods((store, remote = inject(MockAuthService), router = inject(Router)) => ({
    login: rxMethod<void>((trigger$) =>
      trigger$.pipe(
        tap(() => patchState(store, { status: 'loading' })),
        switchMap(() =>
          remote.login$().pipe(
            tap({
              next: ({ user: u, token: t }) => {
                patchState(store, { user: u, token: t, status: 'authenticated' });
                void router.navigate(['/dashboard']);
              },
            }),
            catchError(() => {
              patchState(store, { status: 'error' });
              return EMPTY;
            })
          )
        )
      )
    ),
    logout(): void {
      patchState(store, initialState);
      void router.navigate(['/']);
    },
  }))
);
