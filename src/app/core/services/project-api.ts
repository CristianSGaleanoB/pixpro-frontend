import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../interfaces/project';
import { AuthStore } from '../stores/auth';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProjectApiService {
  private readonly http = inject(HttpClient);
  private readonly authStore = inject(AuthStore);

  getProjects(): Observable<Project[]> {
    const userId = this.authStore.user()?.id;
    if (!userId) {
      throw new Error('User ID not available');
    }
    return this.http.get<Project[]>(`${environment.apiUrl}/projects/user/${userId}`);
  }

  deleteProject(projectId: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/projects/${projectId}`);
  }
}
