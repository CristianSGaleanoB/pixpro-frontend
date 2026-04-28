import { Injectable } from '@angular/core';
import { filter, Observable, Subject } from 'rxjs';
import { WorkerMessage } from '../interfaces/worker-message';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private ws: WebSocket | null = null;
  private messageSubject = new Subject<WorkerMessage>();

  connect(url: string): void {
    if (this.ws) {
      console.warn('[WebSocketService] Already connected.');
      return;
    }

    console.log('[WebSocketService] Connecting to', url);
    try {
      /**
       * REAL INTEGRATION POINT:
       * Initialize the native WebSocket connection using the provided URL.
       * Once the Backend/Worker is ready, this will be the primary entry point for real-time messages.
       */
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        console.log('[WebSocketService] Real WebSocket connection opened.');
      };

      /**
       * MESSAGE HANDLER:
       * Listen for incoming binary or text messages from the Worker.
       * The messages are validated and parsed into the WorkerMessage format before being emitted.
       */
      this.ws.onmessage = (event: MessageEvent) => {
        try {
          const data: WorkerMessage = JSON.parse(event.data);
          /**
           * Broadcast the parsed message to the internal Subject.
           * All active subscribers (e.g., the ImageStore) will react to these updates in real-time.
           */
          this.messageSubject.next(data);
        } catch (e) {
          console.error('[WebSocketService] Error parsing WebSocket message', e);
        }
      };

      this.ws.onerror = (error) => {
        console.error('[WebSocketService] WebSocket Error:', error);
      };

      this.ws.onclose = (event) => {
        console.log('[WebSocketService] WebSocket connection closed.', event.reason);
        this.ws = null;
      };
    } catch (error) {
      console.error('[WebSocketService] Failed to establish WebSocket connection', error);
    }
  }

  disconnect(): void {
    if (this.ws) {
      console.log('[WebSocketService] Disconnecting...');
      this.ws.close();
      this.ws = null;
    }
  }

  subscribe(taskId: string): Observable<WorkerMessage> {
    return this.messageSubject.asObservable().pipe(filter((msg) => msg.taskId === taskId));
  }

  /**
   * MOCK SIMULATOR:
   * This method artificially simulates the processing lifecycle of an image (0% -> 100% -> Complete).
   * It is intended for frontend development only and should be replaced by real server-side events
   * in the next sprint once the Python Digester Worker is fully integrated.
   */
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
        imageUrl: `https://picsum.photos/seed/${taskId}/800/600`, // Mock CDN image
      });
    }, 5000);
  }
}
