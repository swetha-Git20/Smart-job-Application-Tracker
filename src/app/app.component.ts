import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { MobileNavComponent } from './shared/components/mobile-nav/mobile-nav.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    MobileNavComponent,
    ToastComponent,
    ConfirmDialogComponent
  ],
  template: `
    <div class="bg-background dark:bg-[#1b1b24] text-on-background dark:text-[#fcf8ff] min-h-screen flex flex-col font-sans transition-colors duration-300">
      <!-- Desktop Sidebar -->
      <app-sidebar></app-sidebar>

      <!-- Mobile Top & Bottom Navigation + FAB -->
      <app-mobile-nav></app-mobile-nav>

      <!-- Main Router View Area -->
      <div class="flex-1 md:ml-[280px] min-h-screen pt-14 md:pt-0 pb-20 md:pb-0 flex flex-col">
        <router-outlet></router-outlet>
      </div>

      <!-- Global Floating Components -->
      <app-toast></app-toast>
      <app-confirm-dialog></app-confirm-dialog>
    </div>
  `
})
export class AppComponent {}