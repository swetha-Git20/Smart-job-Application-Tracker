import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogService, ConfirmDialogOptions } from '../../../core/services/dialog.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      *ngIf="dialog" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm modal-backdrop">
      
      <div 
        class="bg-surface dark:bg-[#262530] border border-outline-variant dark:border-[#3d3b4a] rounded-2xl p-6 max-w-md w-full shadow-2xl animate-fade-in flex flex-col gap-4">
        
        <div class="flex items-start gap-4">
          <div 
            [ngClass]="dialog.isDestructive ? 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400' : 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-fixed-dim'"
            class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-2xl">
              {{ dialog.isDestructive ? 'warning' : 'help' }}
            </span>
          </div>

          <div class="flex-1">
            <h3 class="text-lg font-bold text-on-surface dark:text-[#fcf8ff]">
              {{ dialog.title }}
            </h3>
            <p class="text-sm text-on-surface-variant dark:text-gray-300 mt-1 leading-relaxed">
              {{ dialog.message }}
            </p>
          </div>
        </div>

        <div class="flex justify-end gap-2.5 mt-2 pt-3 border-t border-outline-variant/40 dark:border-[#3d3b4a]">
          <button 
            (click)="onCancel()"
            class="px-4 py-2 rounded-xl text-sm font-medium text-on-surface-variant dark:text-gray-300 hover:bg-surface-container-high dark:hover:bg-[#383745] transition-colors">
            {{ dialog.cancelText || 'Cancel' }}
          </button>
          
          <button 
            (click)="onConfirm()"
            [ngClass]="dialog.isDestructive ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-primary hover:bg-primary/90 text-on-primary'"
            class="px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm active:scale-95">
            {{ dialog.confirmText || 'Confirm' }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class ConfirmDialogComponent implements OnInit {
  dialog: ConfirmDialogOptions | null = null;

  constructor(private dialogService: DialogService) {}

  ngOnInit(): void {
    this.dialogService.dialog$.subscribe(dialog => {
      this.dialog = dialog;
    });
  }

  onConfirm(): void {
    if (this.dialog) {
      this.dialog.onConfirm();
      this.dialogService.close();
    }
  }

  onCancel(): void {
    if (this.dialog && this.dialog.onCancel) {
      this.dialog.onCancel();
    }
    this.dialogService.close();
  }
}