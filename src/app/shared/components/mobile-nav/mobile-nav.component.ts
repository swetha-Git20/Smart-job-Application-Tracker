import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-mobile-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <!-- Top Mobile Header -->
    <header class="md:hidden flex justify-between items-center w-full px-4 h-14 fixed top-0 left-0 z-40 bg-surface/90 dark:bg-[#18171f]/90 backdrop-blur-md border-b border-outline-variant dark:border-[#2f2e3a] transition-colors">
      <div class="flex items-center gap-2">
        <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-[#4f46e5] flex items-center justify-center text-white shadow-md">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8 12 L12 10 L16 12 L16 18 L12 20 L8 18 Z"/>
            <path d="M8 12 L12 14 L16 12"/>
            <path d="M12 14 L12 20"/>
            <circle cx="12" cy="16" r="1.5" fill="currentColor"/>
          </svg>
        </div>
        <h1 class="font-bold text-base tracking-tight text-primary dark:text-primary-fixed-dim">CareerStream</h1>
      </div>
      <div class="flex items-center gap-1">
        <button 
          (click)="toggleTheme()"
          aria-label="Toggle Theme"
          class="p-2 text-on-surface-variant dark:text-gray-300 hover:bg-surface-container-low dark:hover:bg-[#262530] transition-colors rounded-full active:scale-95">
          <span class="material-symbols-outlined text-xl">{{ themeService.isDarkMode ? 'light_mode' : 'dark_mode' }}</span>
        </button>
        <button 
          (click)="navigateToAdd()"
          aria-label="Add Application"
          class="p-2 text-primary hover:bg-primary/10 transition-colors rounded-full active:scale-95">
          <span class="material-symbols-outlined text-xl">add_circle</span>
        </button>
      </div>
    </header>

    <!-- Floating Action Button (FAB) on Mobile -->
    <div class="md:hidden fixed bottom-20 right-4 z-40">
      <button 
        (click)="navigateToAdd()"
        aria-label="Create Application"
        class="w-13 h-13 rounded-full bg-primary text-on-primary shadow-lg flex items-center justify-center hover:opacity-90 active:scale-95 transition-all">
        <span class="material-symbols-outlined text-2xl font-bold">add</span>
      </button>
    </div>

    <!-- Bottom Navigation Bar for Mobile -->
    <nav class="md:hidden fixed bottom-0 left-0 w-full z-40 bg-surface/95 dark:bg-[#18171f]/95 backdrop-blur-md border-t border-outline-variant dark:border-[#2f2e3a] shadow-lg flex justify-around items-center h-16 pb-safe transition-colors">
      <a 
        routerLink="/dashboard" 
        routerLinkActive="text-primary dark:text-primary-fixed-dim font-bold"
        [routerLinkActiveOptions]="{ exact: true }"
        class="flex flex-col items-center justify-center text-on-surface-variant dark:text-gray-400 active:bg-surface-variant/20 w-full h-full text-[11px] gap-0.5">
        <span class="material-symbols-outlined text-xl">dashboard</span>
        <span>Dashboard</span>
      </a>

      <a 
        routerLink="/applications" 
        routerLinkActive="text-primary dark:text-primary-fixed-dim font-bold"
        class="flex flex-col items-center justify-center text-on-surface-variant dark:text-gray-400 active:bg-surface-variant/20 w-full h-full text-[11px] gap-0.5">
        <span class="material-symbols-outlined text-xl">work</span>
        <span>Apps</span>
      </a>

      <a 
        routerLink="/interviews" 
        routerLinkActive="text-primary dark:text-primary-fixed-dim font-bold"
        class="flex flex-col items-center justify-center text-on-surface-variant dark:text-gray-400 active:bg-surface-variant/20 w-full h-full text-[11px] gap-0.5">
        <span class="material-symbols-outlined text-xl">event</span>
        <span>Interviews</span>
      </a>

      <a 
        routerLink="/saved" 
        routerLinkActive="text-primary dark:text-primary-fixed-dim font-bold"
        class="flex flex-col items-center justify-center text-on-surface-variant dark:text-gray-400 active:bg-surface-variant/20 w-full h-full text-[11px] gap-0.5">
        <span class="material-symbols-outlined text-xl">bookmark</span>
        <span>Saved</span>
      </a>

      <a 
        routerLink="/analytics" 
        routerLinkActive="text-primary dark:text-primary-fixed-dim font-bold"
        class="flex flex-col items-center justify-center text-on-surface-variant dark:text-gray-400 active:bg-surface-variant/20 w-full h-full text-[11px] gap-0.5">
        <span class="material-symbols-outlined text-xl">analytics</span>
        <span>Analytics</span>
      </a>

      <a 
        routerLink="/settings" 
        routerLinkActive="text-primary dark:text-primary-fixed-dim font-bold"
        class="flex flex-col items-center justify-center text-on-surface-variant dark:text-gray-400 active:bg-surface-variant/20 w-full h-full text-[11px] gap-0.5">
        <span class="material-symbols-outlined text-xl">settings</span>
        <span>Settings</span>
      </a>
    </nav>
  `
})
export class MobileNavComponent {
  constructor(
    public themeService: ThemeService,
    private router: Router
  ) {}

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  navigateToAdd(): void {
    this.router.navigate(['/applications/new']);
  }
}