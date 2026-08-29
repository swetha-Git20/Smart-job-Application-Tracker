import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/services/theme.service';
import { StorageService } from '../../core/services/storage.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4 md:p-10 max-w-4xl mx-auto min-h-screen">
      <header class="mb-8 hidden md:flex justify-between items-center">
        <div>
          <h2 class="text-3xl font-bold text-on-background">Settings</h2>
          <p class="text-base text-on-surface-variant mt-2">Manage your application preferences and data.</p>
        </div>
      </header>

      <div class="space-y-8">
        <!-- Appearance Section -->
        <section class="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm p-6 md:p-8">
          <div class="mb-6">
            <h3 class="text-xl font-semibold text-on-background flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">palette</span>
              Appearance
            </h3>
            <p class="text-sm text-on-surface-variant mt-1">Customize the look and feel of CareerStream.</p>
          </div>
          
          <div class="flex items-center justify-between py-4 border-t border-outline-variant border-dashed">
            <div>
              <div class="text-base font-medium text-on-background">Theme Preference</div>
              <div class="text-sm text-on-surface-variant mt-1">Switch between light and dark mode.</div>
            </div>
            <div class="relative inline-block w-14 align-middle select-none transition duration-200 ease-in">
              <input 
                [checked]="isDarkMode"
                (change)="toggleTheme()"
                type="checkbox"
                class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer z-10 top-1 left-1 checked:right-1 checked:left-auto transition-all"
                id="theme-toggle"/>
              <label 
                for="theme-toggle"
                class="toggle-label block overflow-hidden h-8 rounded-full bg-surface-variant cursor-pointer transition-colors duration-200 border border-outline-variant"
                [ngClass]="{ 'bg-primary': isDarkMode }"></label>
            </div>
          </div>
        </section>

        <!-- Data Management Section -->
        <section class="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm p-6 md:p-8">
          <div class="mb-6">
            <h3 class="text-xl font-semibold text-on-background flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">database</span>
              Data Management
            </h3>
            <p class="text-sm text-on-surface-variant mt-1">Export your data or permanently delete your account information.</p>
          </div>
          
          <div class="flex flex-col md:flex-row md:items-center justify-between py-4 border-t border-outline-variant border-dashed gap-4">
            <div>
              <div class="text-base font-medium text-on-background">Export Data</div>
              <div class="text-sm text-on-surface-variant mt-1">Download all your application data as a JSON file.</div>
            </div>
            <button 
              (click)="exportData()"
              class="bg-transparent border border-outline-variant text-on-background py-2 px-4 rounded-lg text-sm font-medium hover:bg-surface-variant transition-colors flex items-center justify-center gap-2 shrink-0">
              <span class="material-symbols-outlined text-lg">download</span>
              Export as JSON
            </button>
          </div>
          
          <div class="flex flex-col md:flex-row md:items-center justify-between py-4 border-t border-error/20 border-dashed gap-4 mt-4 bg-error-container/10 p-4 -mx-4 md:-mx-6 rounded-lg">
            <div>
              <div class="text-base font-medium text-error">Danger Zone</div>
              <div class="text-sm text-on-surface-variant mt-1">Permanently delete all your application tracking data. This cannot be undone.</div>
            </div>
            <button 
              (click)="resetAllData()"
              class="bg-error text-on-error py-2 px-4 rounded-lg text-sm font-medium hover:bg-error/90 transition-colors flex items-center justify-center gap-2 shrink-0 shadow-sm">
              <span class="material-symbols-outlined text-lg">delete_forever</span>
              Reset All Data
            </button>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .toggle-checkbox:checked {
      right: 0;
      border-color: #3525cd;
    }
    .toggle-checkbox:checked + .toggle-label {
      background-color: #3525cd;
    }
    .toggle-checkbox:checked + .toggle-label:after {
      transform: translateX(100%);
      border-color: white;
    }
  `]
})
export class SettingsComponent implements OnInit {
  isDarkMode = false;

  constructor(
    private themeService: ThemeService,
    private storageService: StorageService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.themeService.theme$.subscribe((theme: string) => {
      this.isDarkMode = theme === 'dark';
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
    this.toastService.success(`Switched to ${this.isDarkMode ? 'light' : 'dark'} mode`);
  }

  exportData(): void {
    const data = this.storageService.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'careerstream-export.json';
    a.click();
    URL.revokeObjectURL(url);
    this.toastService.success('Data exported successfully');
  }

  resetAllData(): void {
    if (confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
      this.storageService.resetAllData();
      this.toastService.success('All data has been reset');
    }
  }
}