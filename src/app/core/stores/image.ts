import { inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, mergeMap, switchMap, tap, pipe } from 'rxjs';
import { ImageStatus, ProjectImage } from '../interfaces/image';
import { ImageApiService } from '../services/image-api';
import { WebSocketService } from '../services/web-socket';
import { toast } from 'ngx-sonner';

export interface ImageState {
  images: ProjectImage[];
  loadStatus: 'idle' | 'loading' | 'success' | 'error';
}

const initialState: ImageState = {
  images: [],
  loadStatus: 'idle',
};

export const ImageStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ images, loadStatus }) => ({
    isLoading: () => loadStatus() === 'loading',
    hasError: () => loadStatus() === 'error',
    isEmpty: () => loadStatus() === 'success' && images().length === 0,
    hasImages: () => loadStatus() === 'success' && images().length > 0,
  })),
  withMethods((store, api = inject(ImageApiService), ws = inject(WebSocketService)) => ({
    loadImages: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loadStatus: 'loading' })),
        switchMap((projectId) =>
          api.getImages(projectId).pipe(
            tap({
              next: (images) => patchState(store, { images, loadStatus: 'success' }),
            }),
            catchError(() => {
              patchState(store, { images: [], loadStatus: 'error' });
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
            tap(({ taskId, image }) => {
              patchState(store, (state) => ({
                images: [image, ...state.images],
              }));

              /**
               * WEBSOCKET SUBSCRIPTION:
               * After a successful upload, we subscribe to the WebSocket service using the unique taskId.
               * This allows the UI to receive real-time updates directly from the Worker as the image is processed.
               */
              ws.subscribe(taskId).subscribe((msg) => {
                patchState(store, (state) => ({
                  images: state.images.map((img) => {
                    if (img.id === taskId) {
                      /**
                       * REACTIVE STATE UPDATE:
                       * We update the specific image's status and progress based on the incoming WebSocket message.
                       * This triggers an automatic UI refresh through Angular Signals.
                       */
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
                        toast.success(`Image ${img.filename} processed successfully`);
                      }

                      return updated;
                    }
                    return img;
                  }),
                }));
              });

              /**
               * MOCK EXECUTION:
               * For current development, we manually trigger the mock worker simulation.
               * IN PRODUCTION: This line should be removed as the real Worker will emit events automatically
               * once the backend persists the image and forwards the task to RabbitMQ.
               */
              ws.simulateWorkerProcessing(taskId);
            }),
            catchError(() => {
              toast.error('Failed to upload image');
              return EMPTY;
            })
          )
        )
      )
    ),
  }))
);
