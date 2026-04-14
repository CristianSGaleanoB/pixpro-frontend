import { Injectable, signal, effect, inject } from '@angular/core';
import { LocalStorageService } from './local-storage';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private localStorage = inject(LocalStorageService);

  theme = signal<string>(this.localStorage.get('theme') ?? 'dark');

  constructor() {
    effect(() => {
      const val = this.theme();
      document.documentElement.setAttribute('data-theme', val);
      this.localStorage.set('theme', val);
    });
  }

  setTheme(name: string) {
    this.theme.set(name);
  }
}
