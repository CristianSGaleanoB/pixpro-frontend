import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
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
  private readonly http = inject(HttpClient);

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
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', projectId);
    formData.append('upscaler', 'true');
    formData.append('grayscale', 'false');
    formData.append('restore', 'true');
    formData.append('watermark', 'PixPro Mock');

    return this.http
      .post<{
        message: string;
        correlationId: string;
        imageId: string;
      }>(`${environment.apiUrl}/images/upload`, formData)
      .pipe(
        map((response) => {
          const newImage: ProjectImage = {
            id: response.imageId,
            projectId,
            filename: file.name,
            sizeBytes: file.size,
            uploadDate: new Date().toISOString(),
            status: 'idle',
            progress: 0,
          };
          return { taskId: response.imageId, image: newImage };
        })
      );
  }
}
