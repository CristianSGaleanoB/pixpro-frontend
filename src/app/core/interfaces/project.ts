export interface Project {
  _id: string;
  name: string;
  ownerId: string;
  tags: string[];
  totalImages: number;
  processedImages: number;
  status: 'active' | 'processing' | 'completed';
  isPublic: boolean;
}

export type LoadStatus = 'idle' | 'loading' | 'success' | 'error';
