import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { ApplicationService } from '../../../core/services/application.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="hidden md:flex flex-col h-full w-[280px] p-6 gap-6 bg-surface dark:bg-[#18171f] border-r border-outline-variant dark:border-[#2f2e3a] fixed left-0 top-0 z-40 shrink-0 transition-colors duration-300">
      <!-- App Header / Logo -->
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm">
          <span class="material-symbols-outlined text-2xl font-bold">work</span>
        </div>
        <div>
          <h1 class="text-lg font-bold tracking-tight text-primary dark:text-primary-fixed-dim leading-none">CareerStream</h1>
          <p class="text-xs uppercase tracking-wider font-semibold text-on-surface-variant dark:text-gray-400 mt-1">Pro Account</p>
        </div>
      </div>

      <!-- Add Application Action Button -->
      <button 
        (click)="navigateToAdd()"
        class="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-primary text-on-primary rounded-xl font-medium text-sm hover:opacity-90 shadow-sm transition-all duration-200 cursor-pointer active:scale-[0.98]">
        <span class="material-symbols-outlined text-lg">add</span>
        <span>Add Application</span>
      </button>

      <!-- Navigation Links -->
      <nav class="flex-1 flex flex-col gap-1 overflow-y-auto">
        <a 
          routerLink="/dashboard" 
          routerLinkActive="bg-primary-container text-on-primary-container font-semibold shadow-sm"
          [routerLinkActiveOptions]="{ exact: true }"
          class="flex items-center gap-3 px-3.5 py-2.5 text-on-surface-variant dark:text-gray-300 hover:bg-surface-container-high dark:hover:bg-[#262530] transition-colors duration-200 rounded-xl text-sm font-medium">
          <span class="material-symbols-outlined text-xl">dashboard</span>
          <span>Dashboard</span>
        </a>

        <a 
          routerLink="/applications" 
          routerLinkActive="bg-primary-container text-on-primary-container font-semibold shadow-sm"
          class="flex items-center gap-3 px-3.5 py-2.5 text-on-surface-variant dark:text-gray-300 hover:bg-surface-container-high dark:hover:bg-[#262530] transition-colors duration-200 rounded-xl text-sm font-medium">
          <span class="material-symbols-outlined text-xl">work</span>
          <div class="flex items-center justify-between w-full">
            <span>Applications</span>
            <span *ngIf="stats.total > 0" class="text-xs px-2 py-0.5 rounded-full bg-surface-container dark:bg-[#383745] text-on-surface-variant dark:text-gray-300">
              {{ stats.total }}
            </span>
          </div>
        </a>

        <a 
          routerLink="/interviews" 
          routerLinkActive="bg-primary-container text-on-primary-container font-semibold shadow-sm"
          class="flex items-center gap-3 px-3.5 py-2.5 text-on-surface-variant dark:text-gray-300 hover:bg-surface-container-high dark:hover:bg-[#262530] transition-colors duration-200 rounded-xl text-sm font-medium">
          <span class="material-symbols-outlined text-xl">event</span>
          <div class="flex items-center justify-between w-full">
            <span>Interviews</span>
            <span *ngIf="stats.interview > 0" class="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-semibold">
              {{ stats.interview }}
            </span>
          </div>
        </a>

        <a 
          routerLink="/saved" 
          routerLinkActive="bg-primary-container text-on-primary-container font-semibold shadow-sm"
          class="flex items-center gap-3 px-3.5 py-2.5 text-on-surface-variant dark:text-gray-300 hover:bg-surface-container-high dark:hover:bg-[#262530] transition-colors duration-200 rounded-xl text-sm font-medium">
          <span class="material-symbols-outlined text-xl">bookmark</span>
          <div class="flex items-center justify-between w-full">
            <span>Saved Jobs</span>
            <span *ngIf="stats.saved > 0" class="text-xs px-2 py-0.5 rounded-full bg-surface-container dark:bg-[#383745] text-on-surface-variant dark:text-gray-300">
              {{ stats.saved }}
            </span>
          </div>
        </a>

        <a 
          routerLink="/analytics" 
          routerLinkActive="bg-primary-container text-on-primary-container font-semibold shadow-sm"
          class="flex items-center gap-3 px-3.5 py-2.5 text-on-surface-variant dark:text-gray-300 hover:bg-surface-container-high dark:hover:bg-[#262530] transition-colors duration-200 rounded-xl text-sm font-medium">
          <span class="material-symbols-outlined text-xl">analytics</span>
          <span>Analytics</span>
        </a>

        <a 
          routerLink="/settings" 
          routerLinkActive="bg-primary-container text-on-primary-container font-semibold shadow-sm"
          class="flex items-center gap-3 px-3.5 py-2.5 text-on-surface-variant dark:text-gray-300 hover:bg-surface-container-high dark:hover:bg-[#262530] transition-colors duration-200 rounded-xl text-sm font-medium mt-auto">
          <span class="material-symbols-outlined text-xl">settings</span>
          <span>Settings</span>
        </a>
      </nav>

      <!-- Theme Toggle & User Info -->
      <div class="pt-3 border-t border-outline-variant dark:border-[#2f2e3a] flex flex-col gap-2">
        <button 
          (click)="toggleTheme()"
          class="flex items-center justify-between w-full px-3.5 py-2 text-on-surface-variant dark:text-gray-300 hover:bg-surface-container-high dark:hover:bg-[#262530] rounded-xl text-sm font-medium transition-colors cursor-pointer">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-xl">
              {{ themeService.isDarkMode ? 'light_mode' : 'dark_mode' }}
            </span>
            <span>{{ themeService.isDarkMode ? 'Light Mode' : 'Dark Mode' }}</span>
          </div>
          <span class="text-xs text-on-surface-variant/70 dark:text-gray-400 capitalize">{{ themeService.theme }}</span>
        </button>

        <!-- User Profile Avatar Pill -->
        <div class="flex items-center gap-3 p-2 rounded-xl bg-surface-container-low dark:bg-[#1f1e28] border border-outline-variant/50 dark:border-[#2f2e3a]">
          <div class="w-8 h-8 rounded-full bg-primary-container text-on-primary-container font-bold text-xs flex items-center justify-center">
            AD
          </div>
          <div class="overflow-hidden">
            <p class="text-xs font-semibold text-on-surface dark:text-gray-200 truncate">Alex Doe</p>
            <p class="text-[11px] text-on-surface-variant dark:text-gray-400 truncate">alex&#64;example.com</p>
          </div>
        </div>
      </div>
    </aside>
  `
})
export class SidebarComponent implements OnInit {
  stats = { total: 0, interview: 0, saved: 0 };

  constructor(
    public themeService: ThemeService,
    private applicationService: ApplicationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.applicationService.applications$.subscribe(() => {
      const s = this.applicationService.getStats();
      this.stats = {
        total: s.total,
        interview: s.interview,
        saved: s.saved
      };
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  navigateToAdd(): void {
    this.router.navigate(['/applications/new']);
  }
}