export type WorkerStatus = 'processing' | 'complete' | 'error' | 'failed';

export interface WorkerMessage {
  taskId: string;
  status: WorkerStatus;
  progress?: number;
  imageUrl?: string;
  errorMessage?: string;
}
