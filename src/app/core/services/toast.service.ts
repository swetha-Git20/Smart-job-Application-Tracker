import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);

  get toasts$(): Observable<Toast[]> {
    return this.toastsSubject.asObservable();
  }

  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration: number = 3500): void {
    const id = 'toast-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 5);
    const toast: Toast = { id, message, type, duration };
    
    this.toastsSubject.next([...this.toastsSubject.value, toast]);

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }
  }

  success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }

  warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  remove(id: string): void {
    this.toastsSubject.next(this.toastsSubject.value.filter(t => t.id !== id));
  }
}