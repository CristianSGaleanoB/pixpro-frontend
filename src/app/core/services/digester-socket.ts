import { Injectable } from '@angular/core';
import { Observable, NEVER } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DigesterSocketService {
  messages$(): Observable<never> {
    return NEVER;
  }
}
