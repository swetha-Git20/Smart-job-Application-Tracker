import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <div 
        *ngFor="let toast of toasts" 
        class="pointer-events-auto flex items-center justify-between p-3.5 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 animate-fade-in"
        [ngClass]="getToastClasses(toast.type)">
        
        <div class="flex items-center gap-2.5">
          <span class="material-symbols-outlined text-xl">
            {{ getToastIcon(toast.type) }}
          </span>
          <p class="text-sm font-medium leading-snug">{{ toast.message }}</p>
        </div>

        <button 
          (click)="removeToast(toast.id)"
          class="ml-3 p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors opacity-75 hover:opacity-100">
          <span class="material-symbols-outlined text-base">close</span>
        </button>
      </div>
    </div>
  `
})
export class ToastComponent implements OnInit {
  toasts: Toast[] = [];

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.toasts$.subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  removeToast(id: string): void {
    this.toastService.remove(id);
  }

  getToastClasses(type: string): string {
    switch (type) {
      case 'success':
        return 'bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950/90 dark:text-emerald-200 dark:border-emerald-800';
      case 'error':
        return 'bg-rose-50 text-rose-900 border-rose-200 dark:bg-rose-950/90 dark:text-rose-200 dark:border-rose-800';
      case 'warning':
        return 'bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/90 dark:text-amber-200 dark:border-amber-800';
      case 'info':
      default:
        return 'bg-surface-container-lowest text-on-surface border-outline-variant dark:bg-[#262530] dark:text-[#fcf8ff] dark:border-[#3d3b4a]';
    }
  }

  getToastIcon(type: string): string {
    switch (type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'info';
    }
  }
}