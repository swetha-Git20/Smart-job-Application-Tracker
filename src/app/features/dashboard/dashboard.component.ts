import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApplicationService } from '../../core/services/application.service';
import { InterviewService } from '../../core/services/interview.service';
import { Application } from '../../shared/models/application.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="p-4 md:p-10 max-w-7xl mx-auto flex flex-col gap-8">
      <!-- Page Header -->
      <header class="flex justify-between items-end mb-2">
        <div>
          <h2 class="text-3xl font-bold text-on-surface">Dashboard</h2>
          <p class="text-base text-on-surface-variant mt-1">Overview of your application pipeline.</p>
        </div>
        <div class="hidden md:flex gap-2">
          <button 
            (click)="exportData()"
            class="px-4 py-2 rounded-lg bg-surface-container border border-outline-variant text-on-surface font-semibold hover:bg-surface-container-high transition-colors">
            Export Report
          </button>
        </div>
      </header>

      <!-- Stat Cards -->
      <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-surface p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col gap-2">
          <div class="flex justify-between items-center text-on-surface-variant">
            <span class="text-xs uppercase tracking-wider font-semibold">Total Apps</span>
            <span class="material-symbols-outlined text-primary">work</span>
          </div>
          <div class="text-3xl font-bold text-on-surface">{{ stats.total }}</div>
          <div class="flex items-center gap-1 text-xs uppercase tracking-wider text-secondary">
            <span class="material-symbols-outlined text-sm">trending_up</span> Active
          </div>
        </div>

        <div class="bg-surface p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col gap-2">
          <div class="flex justify-between items-center text-on-surface-variant">
            <span class="text-xs uppercase tracking-wider font-semibold">Interviews</span>
            <span class="material-symbols-outlined text-tertiary-container">event</span>
          </div>
          <div class="text-3xl font-bold text-on-surface">{{ stats.interview }}</div>
          <div class="flex items-center gap-1 text-xs uppercase tracking-wider text-secondary">
            <span class="material-symbols-outlined text-sm">schedule</span> {{ upcomingInterviews.length }} upcoming
          </div>
        </div>

        <div class="bg-surface p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col gap-2">
          <div class="flex justify-between items-center text-on-surface-variant">
            <span class="text-xs uppercase tracking-wider font-semibold">Offers</span>
            <span class="material-symbols-outlined text-primary-container">workspace_premium</span>
          </div>
          <div class="text-3xl font-bold text-on-surface">{{ stats.offer }}</div>
          <div class="flex items-center gap-1 text-xs uppercase tracking-wider text-secondary">
            <span class="material-symbols-outlined text-sm">celebration</span> Congratulations
          </div>
        </div>

        <div class="bg-surface p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col gap-2">
          <div class="flex justify-between items-center text-on-surface-variant">
            <span class="text-xs uppercase tracking-wider font-semibold">Rejections</span>
            <span class="material-symbols-outlined text-error">cancel</span>
          </div>
          <div class="text-3xl font-bold text-on-surface">{{ stats.rejected }}</div>
          <div class="flex items-center gap-1 text-xs uppercase tracking-wider text-secondary">
            <span class="material-symbols-outlined text-sm">archive</span> Keep going
          </div>
        </div>
      </section>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <!-- Recent Applications -->
        <section class="lg:col-span-2 flex flex-col gap-4">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-on-surface">Recent Applications</h3>
            <a routerLink="/applications" class="text-primary font-semibold hover:underline">View All</a>
          </div>
          
          <div class="bg-surface rounded-xl border border-outline-variant shadow-sm overflow-hidden">
            <ul class="divide-y divide-outline-variant">
              <li *ngFor="let app of recentApplications" 
                  class="p-4 hover:bg-surface-container-lowest transition-colors flex items-center justify-between gap-4 group cursor-pointer"
                  (click)="navigateToDetail(app.id)">
                <div class="flex items-center gap-4 flex-1">
                  <div class="w-10 h-10 rounded bg-surface-container flex items-center justify-center shrink-0">
                    <span class="material-symbols-outlined text-primary">corporate_fare</span>
                  </div>
                  <div>
                    <h4 class="font-semibold text-on-surface">{{ app.role }}</h4>
                    <p class="text-sm text-on-surface-variant">{{ app.company }} • {{ app.location || 'Remote' }}</p>
                  </div>
                </div>
                <div class="hidden sm:block text-right">
                  <span [ngClass]="getStatusClass(app.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs uppercase tracking-wider">
                    {{ app.status }}
                  </span>
                </div>
                <div class="text-right shrink-0 min-w-[80px]">
                  <p class="text-sm text-on-surface-variant">{{ formatDate(app.appliedDate) }}</p>
                </div>
              </li>
              
              <li *ngIf="recentApplications.length === 0" class="p-8 text-center text-on-surface-variant">
                <span class="material-symbols-outlined text-4xl mb-2">work_off</span>
                <p>No applications yet. Start by adding your first application!</p>
              </li>
            </ul>
          </div>
        </section>

        <!-- Upcoming Interviews -->
        <aside class="flex flex-col gap-4">
          <h3 class="text-lg font-semibold text-on-surface">Upcoming Interviews</h3>
          <div class="bg-surface rounded-xl border border-outline-variant shadow-sm p-4 flex flex-col gap-4">
            <div *ngFor="let interview of upcomingInterviews" 
                 class="flex gap-4 p-3 rounded-lg bg-surface-container-low border border-outline-variant/50">
              <div class="flex flex-col items-center justify-start min-w-[48px]">
                <span class="text-xs uppercase tracking-wider text-primary">{{ getMonth(interview.dateTime) }}</span>
                <span class="text-xl font-bold text-on-surface">{{ getDay(interview.dateTime) }}</span>
              </div>
              <div class="flex-1 border-l-2 border-primary-container/20 pl-4 py-1">
                <h4 class="font-semibold text-on-surface">{{ interview.roundName }}</h4>
                <p class="text-sm text-on-surface-variant">{{ getApplicationName(interview.applicationId) }}</p>
                <p class="text-xs text-on-surface-variant mt-1">{{ formatDateTime(interview.dateTime) }} • {{ interview.mode }}</p>
              </div>
            </div>

            <div *ngIf="upcomingInterviews.length === 0" class="text-center text-on-surface-variant py-8">
              <span class="material-symbols-outlined text-4xl mb-2">event_busy</span>
              <p>No upcoming interviews scheduled.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  stats = { total: 0, applied: 0, interview: 0, offer: 0, rejected: 0, saved: 0 };
  recentApplications: Application[] = [];
  upcomingInterviews: any[] = [];

  constructor(
    private applicationService: ApplicationService,
    private interviewService: InterviewService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.stats = this.applicationService.getStats();
    this.recentApplications = this.applicationService.applications
      .sort((a: Application, b: Application) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
      .slice(0, 5);
    this.upcomingInterviews = this.interviewService.getUpcomingInterviews().slice(0, 3);
  }

  navigateToDetail(id: string): void {
    this.router.navigate(['/applications', id]);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Applied': return 'bg-secondary-container text-on-secondary-container';
      case 'Interview': return 'bg-primary-container/10 text-primary';
      case 'Offer': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-error-container text-on-error-container';
      default: return 'bg-surface-container text-on-surface-variant';
    }
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  getMonth(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  }

  getDay(date: Date | string): string {
    const d = new Date(date);
    return d.getDate().toString();
  }

  formatDateTime(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  }

  getApplicationName(applicationId: string): string {
    const app = this.applicationService.getApplicationById(applicationId);
    return app ? `${app.company} - ${app.role}` : 'Unknown Application';
  }

  exportData(): void {
    const data = JSON.stringify({
      applications: this.applicationService.applications,
      interviews: this.interviewService.interviews,
      exportDate: new Date().toISOString()
    }, null, 2);
    
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'careerstream-export.json';
    a.click();
    URL.revokeObjectURL(url);
  }
}