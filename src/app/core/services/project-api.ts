import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../interfaces/project';
import { environment } from '../../../environments/environment';
import { UpdateProject } from '../interfaces/update-project';

@Injectable({ providedIn: 'root' })
export class ProjectApiService {
  private readonly http = inject(HttpClient);

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${environment.apiUrl}/projects/`);
  }

  deleteProject(projectId: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/projects/${projectId}`);
  }

  createProject(projectName: string): Observable<Project> {
    return this.http.post<Project>(`${environment.apiUrl}/projects/`, { name: projectName });
  }

  editProject(projectId: string, info: UpdateProject): Observable<Project> {
    return this.http.patch<Project>(`${environment.apiUrl}/projects/${projectId}`, info);
  }
}
