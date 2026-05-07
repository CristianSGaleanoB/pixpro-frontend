import { Injectable, inject } from '@angular/core';
import { filter, Observable, Subject, takeWhile } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { AuthStore } from '../stores/auth';
import { WorkerMessage, WorkerStatus } from '../interfaces/worker-message';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: Socket | null = null;
  private readonly authStore = inject(AuthStore);
  private readonly messageSubject = new Subject<WorkerMessage>();
  private readonly connectionStatus$ = new Subject<'connected' | 'disconnected'>();

  readonly status$: Observable<'connected' | 'disconnected'> =
    this.connectionStatus$.asObservable();

  async connect(url: string): Promise<void> {
    if (this.socket?.connected) {
      return;
    }

    try {
      const token = this.authStore.token();
      if (!token) {
        console.warn('[WebSocketService] User is not logged in. Skipping socket connection.');
        return;
      }

      console.log('[WebSocketService] Connecting to Socket.IO at', url);

      // Initialize Socket.IO connection with Keycloak token
      this.socket = io(url, {
        transports: ['websocket'],
        auth: { token },
        query: { token },
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 2000,
      });

      this.socket.on('connect', () => {
        console.log('[WebSocketService] Connected to Socket.IO server');
        this.connectionStatus$.next('connected');
      });

      this.socket.on('disconnect', () => {
        console.log('[WebSocketService] Disconnected from Socket.IO server');
        this.connectionStatus$.next('disconnected');
      });

      this.socket.on('connect_error', (error) => {
        console.error('[WebSocketService] Connection Error:', error);
        this.connectionStatus$.next('disconnected');
      });

      this.socket.on(
        'pipeline_status',
        (data: {
          image_id: string;
          status: string;
          message: string;
          progress?: number;
          result_url?: string;
        }) => {
          console.log('[WebSocketService] Received pipeline_status:', data);
          const message: WorkerMessage = {
            taskId: data.image_id,
            status: data.status as WorkerStatus,
            progress: data.progress ?? 0,
            imageUrl: data.result_url,
          };
          this.messageSubject.next(message);
        }
      );
    } catch (error) {
      console.error('[WebSocketService] Failed to initialize connection:', error);
      this.connectionStatus$.next('disconnected');
    }
  }

  disconnect(): void {
    if (this.socket) {
      console.log('[WebSocketService] Disconnecting Socket.IO...');
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getTaskUpdates(taskId: string): Observable<WorkerMessage> {
    return this.messageSubject.asObservable().pipe(
      filter((msg) => msg.taskId === taskId),
      takeWhile((msg) => msg.status !== 'complete' && msg.status !== 'failed', true)
    );
  }
}
