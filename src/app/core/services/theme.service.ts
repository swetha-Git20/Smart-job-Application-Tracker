import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  constructor(private storageService: StorageService) {
    this.initTheme();
  }

  get theme$() {
    return this.storageService.theme$;
  }

  get theme(): string {
    return this.storageService.theme;
  }

  get isDarkMode(): boolean {
    return this.theme === 'dark';
  }

  initTheme(): void {
    const current = this.storageService.theme;
    this.applyTheme(current);
  }

  toggleTheme(): void {
    const next = this.theme === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  }

  setTheme(theme: 'light' | 'dark'): void {
    this.storageService.setTheme(theme);
    this.applyTheme(theme);
  }

  private applyTheme(theme: string): void {
    if (typeof document !== 'undefined') {
      const htmlEl = document.documentElement;
      const bodyEl = document.body;
      if (theme === 'dark') {
        htmlEl.classList.add('dark');
        htmlEl.classList.remove('light');
        bodyEl.classList.add('dark');
        bodyEl.classList.remove('light');
      } else {
        htmlEl.classList.remove('dark');
        htmlEl.classList.add('light');
        bodyEl.classList.remove('dark');
        bodyEl.classList.add('light');
      }
    }
  }
}