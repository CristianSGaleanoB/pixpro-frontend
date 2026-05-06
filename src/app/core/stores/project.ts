import { inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, switchMap, tap } from 'rxjs';
import { LoadStatus, Project } from '../interfaces/project';
import { ProjectApiService } from '../services/project-api';

export const ProjectStore = signalStore(
  { providedIn: 'root' },
  withState({
    projects: [] as Project[],
    loadStatus: 'idle' as LoadStatus,
    errorMessage: null as string | null,
  }),
  withComputed(({ projects, loadStatus, errorMessage }) => ({
    isLoading: () => loadStatus() === 'loading',
    hasError: () => loadStatus() === 'error',
    isEmpty: () => loadStatus() === 'success' && projects().length === 0,
    hasProjects: () => loadStatus() === 'success' && projects().length > 0,
    errorMessage: () => errorMessage(),
  })),
  withMethods((store, api = inject(ProjectApiService)) => ({
    load: rxMethod<void>((trigger$) =>
      trigger$.pipe(
        tap(() => patchState(store, { loadStatus: 'loading', errorMessage: null })),
        switchMap(() =>
          api.getProjects().pipe(
            tap({
              next: (projects) => patchState(store, { projects, loadStatus: 'success' }),
            }),
            catchError((error) => {
              patchState(store, {
                projects: [],
                loadStatus: 'error',
                errorMessage: error.message || 'Failed to load projects',
              });
              return EMPTY;
            })
          )
        )
      )
    ),
  }))
);
