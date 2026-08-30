import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApplicationService } from '../../core/services/application.service';
import { InterviewService } from '../../core/services/interview.service';
import { ToastService } from '../../core/services/toast.service';
import { Application, Interview } from '../../shared/models/application.model';

@Component({
  selector: 'app-application-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="px-4 md:px-10 py-8 max-w-7xl mx-auto">
      <!-- Header -->
      <header class="flex items-start justify-between mb-8">
        <div class="flex items-center gap-4">
          <button 
            (click)="goBack()"
            class="p-2 rounded-full hover:bg-surface-container-high transition-colors flex items-center justify-center text-on-surface-variant border border-outline-variant">
            <span class="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <div class="flex items-center gap-2 mb-1">
              <div class="w-8 h-8 rounded bg-surface-container flex items-center justify-center">
                <span class="material-symbols-outlined text-primary">business</span>
              </div>
              <h1 class="text-3xl font-bold text-on-surface">{{ application?.role }}</h1>
            </div>
            <p class="text-lg text-on-surface-variant">{{ application?.company }}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span [ngClass]="getStatusClass(application?.status)" class="inline-flex items-center px-3 py-1 rounded-full text-xs uppercase tracking-wider">
            {{ application?.status }}
          </span>

          <select
            *ngIf="application"
            (change)="onStatusChange($any($event.target).value)"
            [value]="application.status"
            class="bg-surface-container-lowest border border-outline-variant text-on-surface text-xs uppercase tracking-wider rounded-full px-3 py-1 focus:outline-none focus:border-primary">
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>

          <button 
            (click)="editApplication()"
            class="px-4 py-2 rounded-lg border border-outline-variant font-medium hover:bg-surface-container-highest transition-colors">
            Edit
          </button>
          <button 
            (click)="deleteApplication()"
            class="p-2 rounded-lg border border-outline-variant hover:bg-error-container hover:text-on-error-container hover:border-error transition-colors flex items-center justify-center">
            <span class="material-symbols-outlined text-on-surface-variant">delete</span>
          </button>
        </div>
      </header>

      <!-- Bento Grid Layout -->
      <div class="grid grid-cols-12 gap-6" *ngIf="application">
        <!-- Left Column: Info & Notes -->
        <div class="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <!-- Info Card -->
          <div class="bg-surface border border-outline-variant rounded-xl p-6 shadow-sm">
            <h2 class="text-lg font-semibold mb-4 pb-2 border-b border-outline-variant">Details</h2>
            <div class="grid grid-cols-2 gap-y-4 gap-x-6">
              <div>
                <p class="text-xs uppercase tracking-wider text-on-surface-variant mb-1">Location</p>
                <p class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-lg text-on-surface-variant">location_on</span>
                  {{ application.location || 'Not specified' }}{{ application.location && application.jobType ? ' (' + application.jobType + ')' : '' }}
                </p>
              </div>
              <div>
                <p class="text-xs uppercase tracking-wider text-on-surface-variant mb-1">Job Type</p>
                <p class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-lg text-on-surface-variant">work</span>
                  {{ application.jobType }}
                </p>
              </div>
              <div>
                <p class="text-xs uppercase tracking-wider text-on-surface-variant mb-1">Applied Date</p>
                <p class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-lg text-on-surface-variant">calendar_today</span>
                  {{ formatDate(application.appliedDate) }}
                </p>
              </div>
              <div>
                <p class="text-xs uppercase tracking-wider text-on-surface-variant mb-1">Salary / Comp</p>
                <p class="flex items-center gap-1 font-mono text-sm">
                  <span class="material-symbols-outlined text-lg text-on-surface-variant">payments</span>
                  {{ application.salaryRange || 'Not specified' }}
                </p>
              </div>
            </div>
            <div class="mt-6 pt-4 border-t border-outline-variant" *ngIf="application.jobLink">
              <a 
                [href]="application.jobLink" 
                target="_blank"
                class="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-surface-container-highest font-medium hover:opacity-90 transition-opacity">
                <span class="material-symbols-outlined text-lg">link</span>
                View Job Posting
              </a>
            </div>
          </div>

          <!-- Notes Card -->
          <div class="bg-surface border border-outline-variant rounded-xl p-6 shadow-sm flex-1">
            <div class="flex justify-between items-center mb-4 pb-2 border-b border-outline-variant">
              <h2 class="text-lg font-semibold">Notes</h2>
              <button 
                (click)="editNotes()"
                class="text-primary hover:underline font-medium text-sm">
                Edit
              </button>
            </div>
            <div class="text-sm text-on-surface-variant whitespace-pre-line">
              {{ application.notes || 'No notes added yet.' }}
            </div>
          </div>
        </div>

        <!-- Right Column: Timeline & Interviews -->
        <div class="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <!-- Status Timeline -->
          <div class="bg-surface border border-outline-variant rounded-xl p-6 shadow-sm">
            <h2 class="text-lg font-semibold mb-4 pb-2 border-b border-outline-variant">Status Timeline</h2>
            <div class="relative pl-1">
              <div *ngFor="let history of application.statusHistory; let last = last" 
                   class="relative pl-6 pb-6 timeline-item" 
                   [class.last]="last">
                <div class="absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center z-10 shadow-sm"
                     [ngClass]="getTimelineDotClass(history.status, isCurrentStatus(history.status))">
                  <span *ngIf="isPastStatus(history.status)" class="material-symbols-outlined text-sm text-on-primary font-bold">check</span>
                  <div *ngIf="isCurrentStatus(history.status)" class="w-2 h-2 rounded-full bg-primary"></div>
                </div>
                <h3 class="font-semibold" [ngClass]="{'text-primary': isCurrentStatus(history.status)}">{{ history.status }}</h3>
                <p class="text-xs uppercase tracking-wider text-on-surface-variant mt-1">{{ formatDate(history.date) }}</p>
              </div>
            </div>
          </div>

          <!-- Linked Interviews -->
          <div class="bg-surface border border-outline-variant rounded-xl p-6 shadow-sm">
            <div class="flex justify-between items-center mb-4 pb-2 border-b border-outline-variant">
              <h2 class="text-lg font-semibold">Interviews</h2>
              <button 
                (click)="addInterview()"
                class="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-sm font-medium hover:opacity-90 transition-colors flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[18px]">add</span>
                Schedule Interview
              </button>
            </div>
            <div class="flex flex-col gap-3">
              <div *ngFor="let interview of interviews" 
                   class="p-3 rounded-lg border border-outline-variant bg-surface-container-lowest hover:border-primary/50 transition-colors cursor-pointer"
                   (click)="viewInterview(interview.id)">
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-semibold text-sm">{{ interview.roundName }}</h4>
                  <span class="material-symbols-outlined text-sm text-primary">event</span>
                </div>
                <div class="text-xs uppercase tracking-wider text-on-surface-variant flex flex-col gap-1">
                  <span>{{ formatDateTime(interview.dateTime) }}</span>
                  <span>{{ interview.mode }}</span>
                </div>
              </div>

              <div *ngIf="interviews.length === 0" class="text-center text-on-surface-variant py-4">
                <p class="text-sm">No interviews scheduled yet.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .timeline-item::before {
      content: '';
      position: absolute;
      left: 11px;
      top: 24px;
      bottom: -8px;
      width: 2px;
      background-color: #e4e1ee;
      z-index: 0;
    }
    .timeline-item.last::before {
      display: none;
    }
  `]
})
export class ApplicationDetailComponent implements OnInit {
  application: Application | null = null;
  interviews: Interview[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private applicationService: ApplicationService,
    private interviewService: InterviewService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadApplication(id);
      }
    });
  }

  loadApplication(id: string): void {
    this.application = this.applicationService.getApplicationById(id) || null;
    if (this.application) {
      this.interviews = this.interviewService.getInterviewsByApplicationId(id);
    } else {
      this.toastService.error('Application not found');
      this.router.navigate(['/applications']);
    }
  }

  goBack(): void {
    this.router.navigate(['/applications']);
  }

  editApplication(): void {
    if (this.application) {
      this.router.navigate(['/applications', this.application.id, 'edit']);
    }
  }

  deleteApplication(): void {
    if (this.application && confirm('Are you sure you want to delete this application? This will also delete all associated interviews.')) {
      this.applicationService.deleteApplication(this.application.id);
      this.toastService.success('Application deleted successfully');
      this.router.navigate(['/applications']);
    }
  }

  editNotes(): void {
    if (this.application) {
      this.router.navigate(['/applications', this.application.id, 'edit']);
    }
  }

  onStatusChange(newStatus: string): void {
    if (!this.application) return;
    this.applicationService.updateStatus(this.application.id, newStatus as any);
    this.toastService.success(`Status updated to ${newStatus}`);
    this.loadApplication(this.application.id);
  }

  addInterview(): void {
    if (this.application) {
      this.router.navigate(['/interviews'], { queryParams: { applicationId: this.application.id } });
    }
  }

  viewInterview(interviewId: string): void {
    this.router.navigate(['/interviews']);
  }

  getStatusClass(status?: string): string {
    if (!status) return '';
    switch (status) {
      case 'Applied': return 'bg-secondary-container text-on-secondary-container';
      case 'Interview': return 'bg-primary-container/10 text-primary';
      case 'Offer': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-error-container text-on-error-container';
      default: return 'bg-surface-container text-on-surface-variant';
    }
  }

  getTimelineDotClass(status: string, isCurrent: boolean): string {
    if (isCurrent) {
      return 'bg-surface border-2 border-primary';
    }
    return 'bg-primary';
  }

  isCurrentStatus(status: string): boolean {
    return this.application?.status === status;
  }

  isPastStatus(status: string): boolean {
    if (!this.application) return false;
    const currentIndex = this.application.statusHistory.findIndex(h => h.status === status);
    const currentStatusIndex = this.application.statusHistory.findIndex(h => h.status === this.application?.status);
    return currentIndex < currentStatusIndex;
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
}