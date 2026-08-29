import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { MobileNavComponent } from './shared/components/mobile-nav/mobile-nav.component';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    MobileNavComponent,
    ToastComponent
  ],
  template: `
    <div class="bg-background text-on-background font-sans antialiased h-screen flex overflow-hidden">
      <!-- Desktop Sidebar -->
      <app-sidebar></app-sidebar>
      
      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col h-full overflow-hidden">
        <!-- Mobile Navigation -->
        <app-mobile-nav></app-mobile-nav>
        
        <!-- Router Outlet for Page Content -->
        <div class="flex-1 md:ml-[280px] h-full overflow-y-auto">
          <router-outlet></router-outlet>
        </div>
        
        <!-- Toast Notifications -->
        <app-toast></app-toast>
      </div>
    </div>
  `
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    // Remove loading screen when Angular app initializes
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.style.opacity = '0';
      setTimeout(() => {
        loadingScreen.remove();
      }, 300);
    }
  }
}