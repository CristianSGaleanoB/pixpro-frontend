import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Project } from '../interfaces/project';

const MOCK_PROJECTS: Project[] = [
  { id: 'p1', name: 'Marketing assets', description: 'Banners and social creatives' },
  { id: 'p2', name: 'Product photos', description: 'E-commerce catalog batch' },
  { id: 'p3', name: 'Research set', description: 'Microscopy and lab captures' },
  { id: 'p4', name: 'Archive 2025', description: 'Legacy uploads pending review' },
];

@Injectable({ providedIn: 'root' })
export class ProjectApiService {
  getProjects(): Observable<Project[]> {
    // TODO: inject HttpClient and return this.http.get<Project[]>(`${environment.apiUrl}/projects`);
    return of(MOCK_PROJECTS).pipe(delay(280));
  }
}
