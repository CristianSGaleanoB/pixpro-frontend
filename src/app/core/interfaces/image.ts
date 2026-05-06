export type ImageStatus = 'idle' | 'uploading' | 'processing' | 'complete' | 'error';

export interface ProjectImage {
  id: string;
  projectId: string;
  filename: string;
  sizeBytes: number;
  uploadDate: string;
  status: ImageStatus;
  progress: number;
  thumbnailUrl?: string;
  originalUrl?: string;
}
