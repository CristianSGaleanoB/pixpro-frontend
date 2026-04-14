import { inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, switchMap, tap } from 'rxjs';
import { LoadStatus, Project } from '../interfaces/project';
import { ProjectApiService } from '../services/project-api';

/**
 * Loads projects via REST (ProjectApiService). For live job/image status, subscribe inside
 * an rxMethod (or withHooks) to DigesterSocketService.messages$() and patchState rows — see core/digester.
 */
export const ProjectStore = signalStore(
  { providedIn: 'root' },
  withState({
    projects: [] as Project[],
    loadStatus: 'idle' as LoadStatus,
  }),
  withComputed(({ projects, loadStatus }) => ({
    isLoading: () => loadStatus() === 'loading',
    hasError: () => loadStatus() === 'error',
    isEmpty: () => loadStatus() === 'success' && projects().length === 0,
    hasProjects: () => loadStatus() === 'success' && projects().length > 0,
  })),
  withMethods((store, api = inject(ProjectApiService)) => ({
    load: rxMethod<void>((trigger$) =>
      trigger$.pipe(
        tap(() => patchState(store, { loadStatus: 'loading' })),
        switchMap(() =>
          api.getProjects().pipe(
            tap({
              next: (projects) => patchState(store, { projects, loadStatus: 'success' }),
            }),
            catchError(() => {
              patchState(store, { projects: [], loadStatus: 'error' });
              return EMPTY;
            })
          )
        )
      )
    ),
  }))
);
