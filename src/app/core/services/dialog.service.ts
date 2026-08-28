import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private dialogSubject = new BehaviorSubject<ConfirmDialogOptions | null>(null);

  get dialog$(): Observable<ConfirmDialogOptions | null> {
    return this.dialogSubject.asObservable();
  }

  confirm(options: ConfirmDialogOptions): void {
    this.dialogSubject.next(options);
  }

  close(): void {
    this.dialogSubject.next(null);
  }
}
