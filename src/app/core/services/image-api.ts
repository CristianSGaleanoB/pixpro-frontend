import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { ProjectImage } from '../interfaces/image';

const MOCK_IMAGES: ProjectImage[] = [
  {
    id: 'img-1',
    projectId: 'p1',
    filename: 'banner-hero.webp',
    sizeBytes: 1024 * 500,
    uploadDate: new Date().toISOString(),
    status: 'complete',
    progress: 100,
    thumbnailUrl: 'https://picsum.photos/seed/img-1/400/300',
    originalUrl: 'https://picsum.photos/seed/img-1/800/600',
  },
  {
    id: 'img-2',
    projectId: 'p1',
    filename: 'social-post.png',
    sizeBytes: 1024 * 1200,
    uploadDate: new Date(Date.now() - 86400000).toISOString(),
    status: 'complete',
    progress: 100,
    thumbnailUrl: 'https://picsum.photos/seed/img-2/400/300',
    originalUrl: 'https://picsum.photos/seed/img-2/800/600',
  },
];

@Injectable({
  providedIn: 'root',
})
export class ImageApiService {
  getImages(projectId: string): Observable<ProjectImage[]> {
    /**
     * MOCK REST API:
     * Simulates fetching images associated with a project.
     * Artificial delay is added to verify UI loading states (spinners/skeletons).
     */
    const filtered = MOCK_IMAGES.filter((img) => img.projectId === projectId || projectId === 'p1');
    return of(filtered.length > 0 ? filtered : []).pipe(delay(800));
  }

  uploadImage(projectId: string, file: File): Observable<{ taskId: string; image: ProjectImage }> {
    /**
     * MOCK UPLOAD PROCESS:
     * Simulates the initial image metadata registration in the database.
     * Returns a unique 'taskId' used to track the asynchronous processing status via WebSockets.
     */
    const taskId = 'task-' + Math.random().toString(36).substring(2, 9);

    const newImage: ProjectImage = {
      id: taskId,
      projectId,
      filename: file.name,
      sizeBytes: file.size,
      uploadDate: new Date().toISOString(),
      status: 'idle',
      progress: 0,
    };

    return of({ taskId, image: newImage }).pipe(delay(600));
  }
}
