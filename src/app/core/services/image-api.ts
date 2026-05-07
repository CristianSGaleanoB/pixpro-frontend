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
    const taskId = 'task-' + Math.random().toString(36).substring(2, 9);

    // We send mock data to the backend to fulfill UploadImageDto
    // The DTO requires a valid UUID for projectId — 'p1' is a mock ID that fails validation.
    // We use a fixed mock UUID until real project IDs are wired up.
    const MOCK_PROJECT_UUID = 'b8a1c7c9-5509-4113-a4c3-883a45c366fb';
    const payload = {
      projectId: MOCK_PROJECT_UUID,
      storagePath: 'mock/cdn/path/' + file.name,
      upscaler: true,
      grayscale: false,
      restore: true,
      watermark: 'PixPro Mock',
    };

    return this.http
      .post<{
        message: string;
        correlationId: string;
        imageId: string;
      }>(`${environment.apiUrl}/images/upload`, payload)
      .pipe(
        map((response) => {
          const newImage: ProjectImage = {
            id: response.imageId || taskId,
            projectId,
            filename: file.name,
            sizeBytes: file.size,
            uploadDate: new Date().toISOString(),
            status: 'idle',
            progress: 0,
          };
          return { taskId: response.imageId || taskId, image: newImage };
        })
      );
  }
}
