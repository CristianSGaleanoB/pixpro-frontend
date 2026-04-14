export interface Project {
  id: string;
  name: string;
  description?: string;
}

export type LoadStatus = 'idle' | 'loading' | 'success' | 'error';
