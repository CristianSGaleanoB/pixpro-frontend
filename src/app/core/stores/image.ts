import { inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, filter, first, mergeMap, switchMap, tap, pipe } from 'rxjs';
import { ImageStatus, ProjectImage } from '../interfaces/image';
import { ImageApiService } from '../services/image-api';
import { WebSocketService } from '../services/web-socket';
import { toast } from 'ngx-sonner';

export interface ImageState {
  images: ProjectImage[];
  loadStatus: 'idle' | 'loading' | 'success' | 'error';
  errorMessage: string | null;
}

const initialState: ImageState = {
  images: [],
  loadStatus: 'idle',
  errorMessage: null,
};

export const ImageStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ images, loadStatus, errorMessage }) => ({
    isLoading: () => loadStatus() === 'loading',
    hasError: () => loadStatus() === 'error',
    isEmpty: () => loadStatus() === 'success' && images().length === 0,
    hasImages: () => loadStatus() === 'success' && images().length > 0,
    errorMessage: () => errorMessage(),
  })),
  withMethods((store, api = inject(ImageApiService), ws = inject(WebSocketService)) => ({
    loadImages: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loadStatus: 'loading', errorMessage: null })),
        switchMap((projectId) =>
          api.getImages(projectId).pipe(
            tap({
              next: (images) => patchState(store, { images, loadStatus: 'success' }),
            }),
            catchError((error) => {
              patchState(store, {
                images: [],
                loadStatus: 'error',
                errorMessage: error.message || 'Failed to load images',
              });
              return EMPTY;
            })
          )
        )
      )
    ),

    uploadImage: rxMethod<{ projectId: string; file: File }>(
      pipe(
        mergeMap(({ projectId, file }) =>
          api.uploadImage(projectId, file).pipe(
            switchMap(({ taskId, image }) => {
              patchState(store, (state) => ({
                images: [image, ...state.images],
              }));

              ws.simulateWorkerProcessing(taskId);

              return ws.getTaskUpdates(taskId).pipe(
                tap(
                  (msg: {
                    taskId: string;
                    status: string;
                    progress?: number;
                    imageUrl?: string;
                  }) => {
                    patchState(store, (state) => ({
                      images: state.images.map((img) => {
                        if (img.id === taskId) {
                          const updated: ProjectImage = {
                            ...img,
                            status: msg.status as ImageStatus,
                            progress: msg.progress ?? img.progress,
                          };
                          if (msg.imageUrl) {
                            updated.thumbnailUrl = msg.imageUrl;
                            updated.originalUrl = msg.imageUrl;
                          }

                          if (msg.status === 'complete' && img.status !== 'complete') {
                            toast.success(`Image ${image.filename} processed successfully`);
                          }

                          return updated;
                        }
                        return img;
                      }),
                    }));
                  }
                ),
                filter((msg) => msg.status === 'complete' || msg.status === 'failed'),
                first(),
                catchError(() => {
                  toast.error(`Processing failed for ${image.filename}`);
                  patchState(store, (state) => ({
                    images: state.images.map((img) =>
                      img.id === taskId ? { ...img, status: 'failed' as ImageStatus } : img
                    ),
                  }));
                  return EMPTY;
                })
              );
            }),
            catchError((error) => {
              toast.error('Failed to upload image');
              patchState(store, {
                errorMessage: error.message || 'Upload failed',
              });
              return EMPTY;
            })
          )
        )
      )
    ),
  }))
);
