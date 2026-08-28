import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/services/theme.service';
import { StorageService } from '../../core/services/storage.service';
import { ToastService } from '../../core/services/toast.service';
import { DialogService } from '../../core/services/dialog.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="flex-1 p-4 md:p-10 max-w-4xl mx-auto w-full flex flex-col gap-6">
      <!-- Page Header -->
      <header>
        <h2 class="text-2xl md:text-3xl font-bold tracking-tight text-on-surface dark:text-[#fcf8ff]">Settings</h2>
        <p class="text-sm md:text-base text-on-surface-variant dark:text-gray-400 mt-1">
          Manage your application preferences, appearance, and local storage data.
        </p>
      </header>

      <div class="flex flex-col gap-6">
        <!-- Appearance Section -->
        <section class="bg-surface dark:bg-[#262530] border border-outline-variant dark:border-[#3d3b4a] rounded-2xl p-6 shadow-sm flex flex-col gap-6">
          <div class="flex items-center gap-3 pb-3 border-b border-outline-variant/40 dark:border-[#3d3b4a]">
            <div class="w-9 h-9 rounded-xl bg-primary/10 text-primary dark:text-primary-fixed-dim flex items-center justify-center">
              <span class="material-symbols-outlined text-xl">palette</span>
            </div>
            <div>
              <h3 class="text-base font-bold text-on-surface dark:text-[#fcf8ff]">Appearance</h3>
              <p class="text-xs text-on-surface-variant dark:text-gray-400">Customize the visual theme and layout density</p>
            </div>
          </div>

          <!-- Theme Preference Toggle -->
          <div class="flex items-center justify-between py-2">
            <div>
              <h4 class="text-sm font-semibold text-on-surface dark:text-[#fcf8ff]">Dark Theme Mode</h4>
              <p class="text-xs text-on-surface-variant dark:text-gray-400 mt-0.5">Switch between sleek dark mode and light theme</p>
            </div>
            <button 
              (click)="toggleTheme()"
              [ngClass]="themeService.isDarkMode ? 'bg-primary' : 'bg-surface-container-high dark:bg-[#383745]'"
              class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none shadow-xs">
              <span 
                [ngClass]="themeService.isDarkMode ? 'translate-x-5 bg-white' : 'translate-x-0 bg-white'"
                class="pointer-events-none inline-block h-5 w-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out"></span>
            </button>
          </div>

          <!-- Compact View Toggle -->
          <div class="flex items-center justify-between py-2 border-t border-outline-variant/40 dark:border-[#3d3b4a]">
            <div>
              <h4 class="text-sm font-semibold text-on-surface dark:text-[#fcf8ff]">Compact View Density</h4>
              <p class="text-xs text-on-surface-variant dark:text-gray-400 mt-0.5">Optimize list spacing for dense information display</p>
            </div>
            <button 
              (click)="toggleCompactView()"
              [ngClass]="isCompact ? 'bg-primary' : 'bg-surface-container-high dark:bg-[#383745]'"
              class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none shadow-xs">
              <span 
                [ngClass]="isCompact ? 'translate-x-5 bg-white' : 'translate-x-0 bg-white'"
                class="pointer-events-none inline-block h-5 w-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out"></span>
            </button>
          </div>
        </section>

        <!-- User Profile Card -->
        <section class="bg-surface dark:bg-[#262530] border border-outline-variant dark:border-[#3d3b4a] rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <div class="flex items-center gap-3 pb-3 border-b border-outline-variant/40 dark:border-[#3d3b4a]">
            <div class="w-9 h-9 rounded-xl bg-primary/10 text-primary dark:text-primary-fixed-dim flex items-center justify-center">
              <span class="material-symbols-outlined text-xl">person</span>
            </div>
            <div>
              <h3 class="text-base font-bold text-on-surface dark:text-[#fcf8ff]">Profile & Account</h3>
              <p class="text-xs text-on-surface-variant dark:text-gray-400">Local demo account credentials</p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-full bg-primary-container text-on-primary-container font-extrabold text-lg flex items-center justify-center shadow-xs">
              AD
            </div>
            <div>
              <h4 class="text-sm font-bold text-on-surface dark:text-[#fcf8ff]">Alex Doe</h4>
              <p class="text-xs text-on-surface-variant dark:text-gray-400">alex&#64;example.com &bull; <span class="text-primary dark:text-primary-fixed-dim font-semibold">Pro License</span></p>
            </div>
          </div>
        </section>

        <!-- Data Management Section -->
        <section class="bg-surface dark:bg-[#262530] border border-outline-variant dark:border-[#3d3b4a] rounded-2xl p-6 shadow-sm flex flex-col gap-6">
          <div class="flex items-center gap-3 pb-3 border-b border-outline-variant/40 dark:border-[#3d3b4a]">
            <div class="w-9 h-9 rounded-xl bg-primary/10 text-primary dark:text-primary-fixed-dim flex items-center justify-center">
              <span class="material-symbols-outlined text-xl">database</span>
            </div>
            <div>
              <h3 class="text-base font-bold text-on-surface dark:text-[#fcf8ff]">Data Management</h3>
              <p class="text-xs text-on-surface-variant dark:text-gray-400">Backup, export, or reset all stored application tracking records</p>
            </div>
          </div>

          <!-- Export Data Action -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
            <div>
              <h4 class="text-sm font-semibold text-on-surface dark:text-[#fcf8ff]">Export Data as JSON</h4>
              <p class="text-xs text-on-surface-variant dark:text-gray-400 mt-0.5">Download a real JSON backup containing all your tracked jobs and interviews</p>
            </div>
            <button 
              (click)="exportData()"
              class="px-4 py-2 bg-surface-container-high dark:bg-[#383745] hover:bg-primary hover:text-white text-on-surface dark:text-[#fcf8ff] rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-xs active:scale-95">
              <span class="material-symbols-outlined text-base">download</span>
              <span>Export as JSON</span>
            </button>
          </div>

          <!-- Danger Zone: Reset All Data -->
          <div class="p-4 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
            <div>
              <h4 class="text-sm font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                <span class="material-symbols-outlined text-base">warning</span>
                <span>Danger Zone — Reset All Data</span>
              </h4>
              <p class="text-xs text-rose-900/70 dark:text-rose-300/80 mt-0.5">
                Clear all custom changes and restore clean starter sample applications and scheduled interviews.
              </p>
            </div>
            <button 
              (click)="confirmResetAllData()"
              class="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-xs cursor-pointer active:scale-95">
              <span class="material-symbols-outlined text-base">restart_alt</span>
              <span>Reset All Data</span>
            </button>
          </div>
        </section>
      </div>
    </main>
  `
})
export class SettingsComponent implements OnInit {
  isCompact: boolean = false;

  constructor(
    public themeService: ThemeService,
    private storageService: StorageService,
    private toastService: ToastService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.storageService.compactView$.subscribe(val => {
      this.isCompact = val;
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
    this.toastService.success(`Switched to ${this.themeService.theme} mode`);
  }

  toggleCompactView(): void {
    this.storageService.setCompactView(!this.isCompact);
    this.toastService.info(`Compact view ${!this.isCompact ? 'enabled' : 'disabled'}`);
  }

  exportData(): void {
    const jsonStr = this.storageService.exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `careerstream_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    this.toastService.success('Data exported successfully!');
  }

  confirmResetAllData(): void {
    this.dialogService.confirm({
      title: 'Reset All Data?',
      message: 'This will reset all applications, interviews, and settings back to the default portfolio starter data. Do you wish to proceed?',
      confirmText: 'Reset Everything',
      isDestructive: true,
      onConfirm: () => {
        this.storageService.resetAllData();
        this.toastService.success('All data has been reset to default starter state');
      }
    });
  }
}