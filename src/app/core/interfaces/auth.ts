export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
}

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'error';

export interface AuthState {
  user: AuthUser | null;
  token: string;
  status: AuthStatus;
}
