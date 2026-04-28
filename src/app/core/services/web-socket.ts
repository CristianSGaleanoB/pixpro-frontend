import { Injectable } from '@angular/core';
import { filter, Observable, Subject, timer, takeWhile } from 'rxjs';
import { WorkerMessage } from '../interfaces/worker-message';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private ws: WebSocket | null = null;
  private readonly messageSubject = new Subject<WorkerMessage>();
  private readonly connectionStatus$ = new Subject<'connected' | 'disconnected'>();

  readonly status$: Observable<'connected' | 'disconnected'> =
    this.connectionStatus$.asObservable();

  connect(url: string): void {
    if (this.ws) {
      console.warn('[WebSocketService] Already connected.');
      return;
    }

    console.log('[WebSocketService] Connecting to', url);

    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log('[WebSocketService] Connected.');
      this.connectionStatus$.next('connected');
    };

    ws.onmessage = (event: MessageEvent) => {
      try {
        const data: WorkerMessage = JSON.parse(event.data);
        this.messageSubject.next(data);
      } catch (e) {
        console.error('[WebSocketService] Error parsing message', e);
      }
    };

    ws.onerror = (error) => {
      console.error('[WebSocketService] Error:', error);
      this.connectionStatus$.next('disconnected');
    };

    ws.onclose = () => {
      console.log('[WebSocketService] Disconnected.');
      this.ws = null;
      this.connectionStatus$.next('disconnected');
      timer(3000).subscribe(() => this.connect(url));
    };

    this.ws = ws;
  }

  disconnect(): void {
    if (this.ws) {
      console.log('[WebSocketService] Disconnecting...');
      this.ws.close();
      this.ws = null;
    }
  }

  getTaskUpdates(taskId: string): Observable<WorkerMessage> {
    return this.messageSubject.asObservable().pipe(
      filter((msg) => msg.taskId === taskId),
      takeWhile((msg) => msg.status !== 'complete' && msg.status !== 'failed', true)
    );
  }

  simulateWorkerProcessing(taskId: string): void {
    setTimeout(() => {
      this.messageSubject.next({ taskId, status: 'processing', progress: 25 });
    }, 1000);

    setTimeout(() => {
      this.messageSubject.next({ taskId, status: 'processing', progress: 65 });
    }, 2500);

    setTimeout(() => {
      this.messageSubject.next({ taskId, status: 'processing', progress: 100 });
    }, 4000);

    setTimeout(() => {
      this.messageSubject.next({
        taskId,
        status: 'complete',
        progress: 100,
        imageUrl: `https://picsum.photos/seed/${taskId}/800/600`,
      });
    }, 5000);
  }
}
