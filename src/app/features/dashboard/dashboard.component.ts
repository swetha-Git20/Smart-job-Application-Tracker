import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApplicationService } from '../../core/services/application.service';
import { InterviewService } from '../../core/services/interview.service';
import { ToastService } from '../../core/services/toast.service';
import { StorageService } from '../../core/services/storage.service';
import { Application, Interview, ApplicationStats } from '../../shared/models/application.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="flex-1 p-4 md:p-10 max-w-7xl mx-auto w-full flex flex-col gap-8">
      <!-- Page Header -->
      <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl md:text-3xl font-bold tracking-tight text-on-surface dark:text-[#fcf8ff]">Dashboard</h2>
          <p class="text-sm md:text-base text-on-surface-variant dark:text-gray-400 mt-1">Overview of your application pipeline & upcoming milestones.</p>
        </div>
        
        <div class="flex items-center gap-3">
          <button 
            (click)="exportReport()"
            class="px-4 py-2 rounded-xl bg-surface-container-low dark:bg-[#262530] border border-outline-variant dark:border-[#3d3b4a] text-on-surface dark:text-[#fcf8ff] text-sm font-semibold hover:bg-surface-container-high dark:hover:bg-[#383745] transition-colors flex items-center gap-2 cursor-pointer shadow-sm">
            <span class="material-symbols-outlined text-lg">download</span>
            <span>Export Report</span>
          </button>
          
          <button 
            (click)="navigateToAdd()"
            class="px-4 py-2 rounded-xl bg-primary text-on-primary text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer shadow-sm">
            <span class="material-symbols-outlined text-lg">add</span>
            <span>Add Job</span>
          </button>
        </div>
      </header>

      <!-- Stat Cards Grid -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Apps Card -->
        <div class="bg-surface dark:bg-[#262530] p-6 rounded-2xl border border-outline-variant dark:border-[#3d3b4a] shadow-sm flex flex-col gap-2 transition-all hover:border-primary/50">
          <div class="flex justify-between items-center text-on-surface-variant dark:text-gray-400">
            <span class="text-xs uppercase tracking-wider font-semibold">Total Apps</span>
            <div class="w-8 h-8 rounded-lg bg-primary/10 text-primary dark:text-primary-fixed-dim flex items-center justify-center">
              <span class="material-symbols-outlined text-lg">work</span>
            </div>
          </div>
          <div class="text-3xl font-bold text-on-surface dark:text-[#fcf8ff]">{{ stats.total }}</div>
          <div class="flex items-center gap-1 text-xs font-medium text-primary dark:text-primary-fixed-dim">
            <span class="material-symbols-outlined text-sm">trending_up</span> Active Pipeline
          </div>
        </div>

        <!-- Interviews Card -->
        <div class="bg-surface dark:bg-[#262530] p-6 rounded-2xl border border-outline-variant dark:border-[#3d3b4a] shadow-sm flex flex-col gap-2 transition-all hover:border-amber-500/50">
          <div class="flex justify-between items-center text-on-surface-variant dark:text-gray-400">
            <span class="text-xs uppercase tracking-wider font-semibold">Interviews</span>
            <div class="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <span class="material-symbols-outlined text-lg">event</span>
            </div>
          </div>
          <div class="text-3xl font-bold text-on-surface dark:text-[#fcf8ff]">{{ stats.interview }}</div>
          <div class="flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
            <span class="material-symbols-outlined text-sm">schedule</span> {{ upcomingInterviews.length }} upcoming
          </div>
        </div>

        <!-- Offers Card -->
        <div class="bg-surface dark:bg-[#262530] p-6 rounded-2xl border border-outline-variant dark:border-[#3d3b4a] shadow-sm flex flex-col gap-2 transition-all hover:border-emerald-500/50">
          <div class="flex justify-between items-center text-on-surface-variant dark:text-gray-400">
            <span class="text-xs uppercase tracking-wider font-semibold">Offers</span>
            <div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <span class="material-symbols-outlined text-lg">workspace_premium</span>
            </div>
          </div>
          <div class="text-3xl font-bold text-on-surface dark:text-[#fcf8ff]">{{ stats.offer }}</div>
          <div class="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <span class="material-symbols-outlined text-sm">celebration</span> {{ stats.offer > 0 ? 'Offer extended!' : 'In progress' }}
          </div>
        </div>

        <!-- Rejections Card -->
        <div class="bg-surface dark:bg-[#262530] p-6 rounded-2xl border border-outline-variant dark:border-[#3d3b4a] shadow-sm flex flex-col gap-2 transition-all hover:border-rose-500/50">
          <div class="flex justify-between items-center text-on-surface-variant dark:text-gray-400">
            <span class="text-xs uppercase tracking-wider font-semibold">Rejections</span>
            <div class="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <span class="material-symbols-outlined text-lg">cancel</span>
            </div>
          </div>
          <div class="text-3xl font-bold text-on-surface dark:text-[#fcf8ff]">{{ stats.rejected }}</div>
          <div class="flex items-center gap-1 text-xs font-medium text-on-surface-variant dark:text-gray-400">
            <span class="material-symbols-outlined text-sm">archive</span> Archived
          </div>
        </div>
      </section>

      <!-- Main Dashboard Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <!-- Recent Applications Section (2 cols) -->
        <section class="lg:col-span-2 flex flex-col gap-4">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-bold text-on-surface dark:text-[#fcf8ff]">Recent Applications</h3>
            <a routerLink="/applications" class="text-sm font-semibold text-primary dark:text-primary-fixed-dim hover:underline flex items-center gap-1">
              <span>View All</span>
              <span class="material-symbols-outlined text-base">arrow_forward</span>
            </a>
          </div>
          
          <div class="bg-surface dark:bg-[#262530] rounded-2xl border border-outline-variant dark:border-[#3d3b4a] shadow-sm overflow-hidden">
            <ul class="divide-y divide-outline-variant/50 dark:divide-[#3d3b4a]">
              <li *ngFor="let app of recentApplications" 
                  class="p-4 hover:bg-surface-container-low dark:hover:bg-[#32313f] transition-colors flex items-center justify-between gap-4 cursor-pointer group"
                  (click)="navigateToDetail(app.id)">
                
                <div class="flex items-center gap-3.5 flex-1 min-w-0">
                  <div class="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-container font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                    {{ app.company.charAt(0).toUpperCase() }}
                  </div>
                  <div class="truncate">
                    <h4 class="font-semibold text-sm md:text-base text-on-surface dark:text-[#fcf8ff] group-hover:text-primary dark:group-hover:text-primary-fixed-dim transition-colors truncate">
                      {{ app.role }}
                    </h4>
                    <p class="text-xs md:text-sm text-on-surface-variant dark:text-gray-400 truncate">
                      {{ app.company }} &bull; {{ app.location || 'Remote' }}
                    </p>
                  </div>
                </div>

                <div class="hidden sm:block shrink-0">
                  <span [ngClass]="getStatusBadgeClass(app.status)" class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                    {{ app.status }}
                  </span>
                </div>

                <div class="text-right shrink-0">
                  <p class="text-xs md:text-sm font-medium text-on-surface-variant dark:text-gray-400">{{ formatDate(app.appliedDate) }}</p>
                  <span class="sm:hidden mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider" [ngClass]="getStatusBadgeClass(app.status)">
                    {{ app.status }}
                  </span>
                </div>
              </li>
              
              <!-- Empty State -->
              <li *ngIf="recentApplications.length === 0" class="p-10 text-center flex flex-col items-center justify-center gap-3 text-on-surface-variant dark:text-gray-400">
                <div class="w-12 h-12 rounded-full bg-surface-container dark:bg-[#383745] flex items-center justify-center text-primary">
                  <span class="material-symbols-outlined text-2xl">work_off</span>
                </div>
                <div>
                  <p class="font-semibold text-base text-on-surface dark:text-[#fcf8ff]">No applications yet</p>
                  <p class="text-xs mt-1">Start tracking your career pipeline by adding your first application.</p>
                </div>
                <button 
                  (click)="navigateToAdd()"
                  class="mt-2 px-4 py-2 bg-primary text-on-primary rounded-xl text-sm font-medium hover:opacity-90 transition-all">
                  + Add First Application
                </button>
              </li>
            </ul>
          </div>
        </section>

        <!-- Upcoming Interviews Widget (1 col) -->
        <aside class="flex flex-col gap-4">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-bold text-on-surface dark:text-[#fcf8ff]">Upcoming Interviews</h3>
            <a routerLink="/interviews" class="text-sm font-semibold text-primary dark:text-primary-fixed-dim hover:underline flex items-center gap-1">
              <span>View All</span>
              <span class="material-symbols-outlined text-base">arrow_forward</span>
            </a>
          </div>

          <div class="bg-surface dark:bg-[#262530] rounded-2xl border border-outline-variant dark:border-[#3d3b4a] shadow-sm p-4 flex flex-col gap-3">
            <div *ngFor="let interview of upcomingInterviews" 
                 class="flex gap-3.5 p-3.5 rounded-xl bg-surface-container-low dark:bg-[#1f1e28] border border-outline-variant/60 dark:border-[#3d3b4a] hover:border-primary/40 transition-all">
              
              <!-- Date Box -->
              <div class="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-surface dark:bg-[#262530] border border-outline-variant/50 dark:border-[#3d3b4a] shrink-0">
                <span class="text-[10px] font-bold uppercase tracking-wider text-primary dark:text-primary-fixed-dim leading-none">
                  {{ getMonth(interview.dateTime) }}
                </span>
                <span class="text-base font-extrabold text-on-surface dark:text-[#fcf8ff] leading-none mt-1">
                  {{ getDay(interview.dateTime) }}
                </span>
              </div>

              <!-- Details -->
              <div class="flex-1 min-w-0">
                <h4 class="font-semibold text-sm text-on-surface dark:text-[#fcf8ff] truncate">
                  {{ interview.roundName }}
                </h4>
                <p class="text-xs font-medium text-primary dark:text-primary-fixed-dim truncate mt-0.5">
                  {{ getApplicationName(interview.applicationId) }}
                </p>
                <div class="flex items-center gap-2 mt-1.5 text-[11px] text-on-surface-variant dark:text-gray-400">
                  <span class="flex items-center gap-1">
                    <span class="material-symbols-outlined text-xs">schedule</span>
                    {{ formatTime(interview.dateTime) }}
                  </span>
                  <span>&bull;</span>
                  <span class="flex items-center gap-1">
                    <span class="material-symbols-outlined text-xs">{{ interview.mode === 'Phone' ? 'phone' : (interview.mode === 'Onsite' ? 'apartment' : 'videocam') }}</span>
                    {{ interview.mode }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Empty State for Upcoming Interviews -->
            <div *ngIf="upcomingInterviews.length === 0" class="text-center py-8 px-4 flex flex-col items-center justify-center gap-2 text-on-surface-variant dark:text-gray-400">
              <div class="w-10 h-10 rounded-full bg-surface-container dark:bg-[#383745] flex items-center justify-center text-on-surface-variant">
                <span class="material-symbols-outlined text-xl">event_available</span>
              </div>
              <p class="text-sm font-medium text-on-surface dark:text-[#fcf8ff]">No upcoming interviews</p>
              <p class="text-xs">Schedule an interview from any active job application.</p>
              <button 
                routerLink="/interviews"
                class="mt-2 px-3.5 py-1.5 bg-surface-container-high dark:bg-[#383745] text-on-surface dark:text-[#fcf8ff] rounded-xl text-xs font-semibold hover:bg-primary hover:text-white transition-all">
                Schedule Interview
              </button>
            </div>
          </div>
        </aside>
      </div>
    </main>
  `
})
export class DashboardComponent implements OnInit {
  stats: ApplicationStats = {
    total: 0,
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
    saved: 0,
    interviewRate: 0,
    offerRate: 0
  };

  recentApplications: Application[] = [];
  upcomingInterviews: Interview[] = [];

  constructor(
    private applicationService: ApplicationService,
    private interviewService: InterviewService,
    private storageService: StorageService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.applicationService.applications$.subscribe(() => {
      this.loadDashboardData();
    });

    this.interviewService.interviews$.subscribe(() => {
      this.loadDashboardData();
    });
  }

  private loadDashboardData(): void {
    this.stats = this.applicationService.getStats();
    const active = this.applicationService.getActiveApplications();
    this.recentApplications = [...active]
      .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
      .slice(0, 5);
    
    this.upcomingInterviews = this.interviewService.getUpcomingInterviews().slice(0, 4);
  }

  getApplicationName(applicationId: string): string {
    const app = this.applicationService.getApplicationById(applicationId);
    return app ? `${app.company} (${app.role})` : 'Application';
  }

  formatDate(date: string | Date): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  formatTime(date: string | Date): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  getMonth(date: string | Date): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  }

  getDay(date: string | Date): string {
    if (!date) return '';
    return new Date(date).getDate().toString();
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Applied':
        return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800';
      case 'Interview':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200 dark:border-amber-800';
      case 'Offer':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-200 dark:border-rose-800';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  }

  navigateToDetail(id: string): void {
    this.router.navigate(['/applications', id]);
  }

  navigateToAdd(): void {
    this.router.navigate(['/applications/new']);
  }

  exportReport(): void {
    const jsonStr = this.storageService.exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `careerstream_report_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    this.toastService.success('Report exported successfully!');
  }
}