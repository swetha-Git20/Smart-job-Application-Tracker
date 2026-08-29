import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApplicationService } from '../../../core/services/application.service';
import { InterviewService } from '../../../core/services/interview.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <aside class="hidden md:flex flex-col w-[280px] h-screen bg-surface border-r border-outline-variant fixed left-0 top-0 z-50">
      <!-- Logo -->
      <div class="p-6 border-b border-outline-variant">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-[#4f46e5] flex items-center justify-center shadow-lg">
            <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8 12 L12 10 L16 12 L16 18 L12 20 L8 18 Z"/>
              <path d="M8 12 L12 14 L16 12"/>
              <path d="M12 14 L12 20"/>
              <circle cx="12" cy="16" r="1.5" fill="currentColor"/>
            </svg>
          </div>
          <div>
            <h1 class="font-bold text-lg text-on-surface">CareerStream</h1>
            <p class="text-xs text-on-surface-variant">Job Application Tracker</p>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
        <a 
          routerLink="/dashboard"
          routerLinkActive="bg-primary-container/10 text-primary"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-highest transition-colors">
          <span class="material-symbols-outlined text-lg">dashboard</span>
          Dashboard
        </a>
        
        <a 
          routerLink="/applications"
          routerLinkActive="bg-primary-container/10 text-primary"
          class="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-highest transition-colors">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-lg">work</span>
            Applications
          </div>
          <span class="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{{ applicationCount }}</span>
        </a>
        
        <a 
          routerLink="/interviews"
          routerLinkActive="bg-primary-container/10 text-primary"
          class="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-highest transition-colors">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-lg">event</span>
            Interviews
          </div>
          <span class="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{{ interviewCount }}</span>
        </a>
        
        <a 
          routerLink="/saved"
          routerLinkActive="bg-primary-container/10 text-primary"
          class="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-highest transition-colors">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-lg">bookmark</span>
            Saved Jobs
          </div>
          <span class="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{{ savedCount }}</span>
        </a>
        
        <a 
          routerLink="/analytics"
          routerLinkActive="bg-primary-container/10 text-primary"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-highest transition-colors">
          <span class="material-symbols-outlined text-lg">analytics</span>
          Analytics
        </a>
        
        <a 
          routerLink="/settings"
          routerLinkActive="bg-primary-container/10 text-primary"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-highest transition-colors">
          <span class="material-symbols-outlined text-lg">settings</span>
          Settings
        </a>
      </nav>

      <!-- Bottom Actions -->
      <div class="p-4 border-t border-outline-variant space-y-2">
        <button 
          (click)="toggleTheme()"
          class="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-highest transition-colors">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-lg">{{ isDarkMode ? 'light_mode' : 'dark_mode' }}</span>
            {{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}
          </div>
        </button>
        
        <a 
          routerLink="/applications/new"
          class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium bg-primary text-on-primary hover:opacity-90 transition-colors">
          <span class="material-symbols-outlined text-lg">add_circle</span>
          Add Application
        </a>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  applicationCount = 0;
  interviewCount = 0;
  savedCount = 0;
  isDarkMode = false;

  constructor(
    private applicationService: ApplicationService,
    private interviewService: InterviewService,
    private themeService: ThemeService,
    private router: Router
  ) {
    this.applicationService.applications$.subscribe(apps => {
      this.applicationCount = apps.length;
      this.savedCount = apps.filter(app => app.isSaved).length;
    });
    
    this.interviewService.interviews$.subscribe(interviews => {
      this.interviewCount = interviews.length;
    });
    
    this.themeService.theme$.subscribe(theme => {
      this.isDarkMode = theme === 'dark';
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}