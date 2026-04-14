import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { AuthSession } from '../interfaces/auth';

@Injectable({ providedIn: 'root' })
export class MockAuthService {
  login$(): Observable<AuthSession> {
    return of({
      user: {
        id: 'mock-user-1',
        email: 'dev@example.com',
        name: 'Dev User',
      },
      token: 'mock.jwt.token',
    }).pipe(delay(200));
  }
}
