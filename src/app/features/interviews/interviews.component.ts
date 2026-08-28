import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InterviewService } from '../../core/services/interview.service';
import { ApplicationService } from '../../core/services/application.service';
import { ToastService } from '../../core/services/toast.service';
import { DialogService } from '../../core/services/dialog.service';
import { Application, Interview, InterviewMode } from '../../shared/models/application.model';

@Component({
  selector: 'app-interviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="flex-1 p-4 md:p-10 max-w-7xl mx-auto w-full flex flex-col gap-6">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl md:text-3xl font-bold tracking-tight text-on-surface dark:text-[#fcf8ff]">Interview Tracker</h2>
          <p class="text-sm md:text-base text-on-surface-variant dark:text-gray-400 mt-1">
            Keep track of scheduled rounds, video links, preparation notes, and interview outcomes.
          </p>
        </div>

        <button 
          (click)="openScheduleModal()"
          class="px-4 py-2 bg-primary text-on-primary rounded-xl text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-2 shadow-sm cursor-pointer active:scale-95 self-start sm:self-auto">
          <span class="material-symbols-outlined text-lg">add_circle</span>
          <span>Schedule Interview</span>
        </button>
      </div>

      <!-- Filter Controls Toolbar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface dark:bg-[#262530] p-4 rounded-2xl border border-outline-variant dark:border-[#3d3b4a] shadow-sm">
        <!-- Upcoming / Past Tabs -->
        <div class="flex gap-1.5 bg-surface-container-low dark:bg-[#1f1e28] p-1 rounded-xl border border-outline-variant/60 dark:border-[#3d3b4a] self-start">
          <button 
            (click)="selectedTab = 'upcoming'; filterInterviews()"
            [ngClass]="selectedTab === 'upcoming' ? 'bg-surface dark:bg-[#2f2e3a] text-primary dark:text-primary-fixed-dim font-bold shadow-xs' : 'text-on-surface-variant dark:text-gray-400'"
            class="px-4 py-1.5 text-xs font-semibold rounded-lg transition-all">
            Upcoming ({{ upcomingCount }})
          </button>
          <button 
            (click)="selectedTab = 'past'; filterInterviews()"
            [ngClass]="selectedTab === 'past' ? 'bg-surface dark:bg-[#2f2e3a] text-primary dark:text-primary-fixed-dim font-bold shadow-xs' : 'text-on-surface-variant dark:text-gray-400'"
            class="px-4 py-1.5 text-xs font-semibold rounded-lg transition-all">
            Past ({{ pastCount }})
          </button>
        </div>

        <!-- Search Input -->
        <div class="relative w-full sm:w-72">
          <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-gray-400 text-lg">search</span>
          <input 
            [(ngModel)]="searchQuery"
            (input)="filterInterviews()"
            placeholder="Search interviews or companies..."
            class="w-full pl-10 pr-4 py-2 bg-surface-container-lowest dark:bg-[#1f1e28] border border-outline-variant dark:border-[#3d3b4a] rounded-xl text-sm text-on-surface dark:text-[#fcf8ff] placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"/>
        </div>
      </div>

      <!-- Bento Grid of Interview Cards -->
      <div *ngIf="displayedInterviews.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div 
          *ngFor="let interview of displayedInterviews" 
          class="bg-surface dark:bg-[#262530] border border-outline-variant dark:border-[#3d3b4a] rounded-2xl p-5 shadow-sm hover:border-primary/50 transition-all flex flex-col justify-between gap-4 group">
          
          <!-- Card Header: Company & Round -->
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-xl bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-fixed-dim font-bold text-base flex items-center justify-center shrink-0">
                {{ getCompanyInitials(interview.applicationId) }}
              </div>
              <div class="min-w-0">
                <h3 
                  (click)="navigateToApplication(interview.applicationId)"
                  class="font-bold text-base text-on-surface dark:text-[#fcf8ff] group-hover:text-primary dark:group-hover:text-primary-fixed-dim transition-colors cursor-pointer truncate">
                  {{ getCompanyName(interview.applicationId) }}
                </h3>
                <p class="text-xs text-on-surface-variant dark:text-gray-400 truncate">
                  {{ getRoleName(interview.applicationId) }}
                </p>
              </div>
            </div>

            <span class="px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shrink-0">
              {{ interview.roundName }}
            </span>
          </div>

          <!-- Schedule Metrics Box Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-surface-container-low dark:bg-[#1f1e28] p-3 rounded-xl border border-outline-variant/50 dark:border-[#3d3b4a]">
            <!-- Date -->
            <div class="flex flex-col">
              <span class="text-[10px] uppercase tracking-wider font-semibold text-on-surface-variant/70 dark:text-gray-400 flex items-center gap-1">
                <span class="material-symbols-outlined text-xs">calendar_today</span> Date
              </span>
              <span class="text-xs font-semibold text-on-surface dark:text-[#fcf8ff] mt-0.5">
                {{ formatDate(interview.dateTime) }}
              </span>
            </div>

            <!-- Time -->
            <div class="flex flex-col">
              <span class="text-[10px] uppercase tracking-wider font-semibold text-on-surface-variant/70 dark:text-gray-400 flex items-center gap-1">
                <span class="material-symbols-outlined text-xs">schedule</span> Time
              </span>
              <span class="text-xs font-semibold text-on-surface dark:text-[#fcf8ff] mt-0.5">
                {{ formatTime(interview.dateTime) }}
              </span>
            </div>

            <!-- Mode -->
            <div class="col-span-2 sm:col-span-1 flex flex-col">
              <span class="text-[10px] uppercase tracking-wider font-semibold text-on-surface-variant/70 dark:text-gray-400 flex items-center gap-1">
                <span class="material-symbols-outlined text-xs">{{ getModeIcon(interview.mode) }}</span> Format
              </span>
              <span class="text-xs font-semibold text-on-surface dark:text-[#fcf8ff] mt-0.5 truncate">
                {{ interview.mode }}
              </span>
            </div>
          </div>

          <!-- Notes Snippet (if any) -->
          <div *ngIf="interview.notes" class="text-xs text-on-surface-variant dark:text-gray-300 bg-surface-container-lowest dark:bg-[#18171f] p-3 rounded-xl border border-outline-variant/40 dark:border-[#3d3b4a] line-clamp-3">
            <span class="font-semibold text-on-surface dark:text-gray-200">Notes: </span>
            {{ interview.notes }}
          </div>

          <!-- Card Actions Footer -->
          <div class="pt-3 border-t border-outline-variant/50 dark:border-[#3d3b4a] flex items-center justify-between text-xs">
            <div class="flex items-center gap-2">
              <a 
                *ngIf="interview.meetingLink" 
                [href]="interview.meetingLink" 
                target="_blank" 
                class="inline-flex items-center gap-1 text-primary dark:text-primary-fixed-dim font-bold hover:underline">
                <span class="material-symbols-outlined text-base">videocam</span>
                <span>Join Call</span>
              </a>
              <button 
                (click)="navigateToApplication(interview.applicationId)"
                class="text-on-surface-variant dark:text-gray-400 hover:text-primary hover:underline">
                View Role
              </button>
            </div>

            <div class="flex items-center gap-1">
              <button 
                (click)="openEditModal(interview)"
                class="p-1.5 rounded-lg hover:bg-surface-container-high dark:hover:bg-[#383745] text-on-surface-variant dark:text-gray-400 transition-colors"
                title="Edit Interview">
                <span class="material-symbols-outlined text-base">edit</span>
              </button>
              <button 
                (click)="confirmDelete(interview)"
                class="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 transition-colors"
                title="Delete Interview">
                <span class="material-symbols-outlined text-base">delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div 
        *ngIf="displayedInterviews.length === 0" 
        class="bg-surface dark:bg-[#262530] border border-outline-variant dark:border-[#3d3b4a] rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3">
        <div class="w-14 h-14 rounded-full bg-surface-container dark:bg-[#383745] flex items-center justify-center text-primary dark:text-primary-fixed-dim">
          <span class="material-symbols-outlined text-3xl">event_busy</span>
        </div>
        <h3 class="text-lg font-bold text-on-surface dark:text-[#fcf8ff]">
          {{ selectedTab === 'upcoming' ? 'No upcoming interviews' : 'No past interviews recorded' }}
        </h3>
        <p class="text-sm text-on-surface-variant dark:text-gray-400 max-w-md">
          {{ selectedTab === 'upcoming' ? 'You do not have any upcoming interviews scheduled yet. Keep applying!' : 'Past interviews will appear here after the scheduled date and time.' }}
        </p>
        <button 
          (click)="openScheduleModal()"
          class="mt-2 px-5 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-semibold hover:opacity-90 transition-all">
          + Schedule An Interview
        </button>
      </div>

      <!-- Schedule / Edit Interview Modal -->
      <div 
        *ngIf="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm modal-backdrop">
        <div class="bg-surface dark:bg-[#262530] border border-outline-variant dark:border-[#3d3b4a] rounded-2xl p-6 max-w-lg w-full shadow-2xl animate-fade-in flex flex-col gap-4">
          <div class="flex items-center justify-between border-b border-outline-variant/40 dark:border-[#3d3b4a] pb-3">
            <h3 class="text-lg font-bold text-on-surface dark:text-[#fcf8ff]">
              {{ isEditModal ? 'Edit Interview' : 'Schedule New Interview' }}
            </h3>
            <button (click)="showModal = false" class="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container-high">
              <span class="material-symbols-outlined text-base">close</span>
            </button>
          </div>

          <div class="flex flex-col gap-4">
            <!-- Linked Application Selector -->
            <div class="flex flex-col gap-1">
              <label class="text-xs font-semibold text-on-surface dark:text-gray-200">Linked Job Application *</label>
              <select 
                [(ngModel)]="formData.applicationId" 
                class="w-full bg-surface-container-lowest dark:bg-[#1f1e28] border border-outline-variant dark:border-[#3d3b4a] text-on-surface dark:text-[#fcf8ff] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary">
                <option value="" disabled>Select an application</option>
                <option *ngFor="let app of availableApplications" [value]="app.id">
                  {{ app.company }} — {{ app.role }} ({{ app.status }})
                </option>
              </select>
            </div>

            <!-- Round Name -->
            <div class="flex flex-col gap-1">
              <label class="text-xs font-semibold text-on-surface dark:text-gray-200">Round Title *</label>
              <input 
                [(ngModel)]="formData.roundName" 
                placeholder="e.g. Technical Round 2, System Design, Hiring Manager"
                class="w-full bg-surface-container-lowest dark:bg-[#1f1e28] border border-outline-variant dark:border-[#3d3b4a] text-on-surface dark:text-[#fcf8ff] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"/>
            </div>

            <!-- Date/Time & Mode -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="flex flex-col gap-1">
                <label class="text-xs font-semibold text-on-surface dark:text-gray-200">Date & Time *</label>
                <input 
                  type="datetime-local" 
                  [(ngModel)]="formData.dateTime" 
                  class="w-full bg-surface-container-lowest dark:bg-[#1f1e28] border border-outline-variant dark:border-[#3d3b4a] text-on-surface dark:text-[#fcf8ff] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"/>
              </div>

              <div class="flex flex-col gap-1">
                <label class="text-xs font-semibold text-on-surface dark:text-gray-200">Format / Mode</label>
                <select 
                  [(ngModel)]="formData.mode" 
                  class="w-full bg-surface-container-lowest dark:bg-[#1f1e28] border border-outline-variant dark:border-[#3d3b4a] text-on-surface dark:text-[#fcf8ff] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary">
                  <option value="Online">Online / Video</option>
                  <option value="Onsite">On-site</option>
                  <option value="Phone">Phone Call</option>
                </select>
              </div>
            </div>

            <!-- Meeting URL -->
            <div class="flex flex-col gap-1">
              <label class="text-xs font-semibold text-on-surface dark:text-gray-200">Meeting Link (optional)</label>
              <input 
                [(ngModel)]="formData.meetingLink" 
                placeholder="https://meet.google.com/..."
                class="w-full bg-surface-container-lowest dark:bg-[#1f1e28] border border-outline-variant dark:border-[#3d3b4a] text-on-surface dark:text-[#fcf8ff] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"/>
            </div>

            <!-- Notes -->
            <div class="flex flex-col gap-1">
              <label class="text-xs font-semibold text-on-surface dark:text-gray-200">Preparation Notes</label>
              <textarea 
                [(ngModel)]="formData.notes" 
                rows="3"
                placeholder="Key questions to prepare, interviewer background, architecture topics..."
                class="w-full bg-surface-container-lowest dark:bg-[#1f1e28] border border-outline-variant dark:border-[#3d3b4a] text-on-surface dark:text-[#fcf8ff] rounded-xl p-2.5 text-sm focus:outline-none focus:border-primary"></textarea>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t border-outline-variant/40 dark:border-[#3d3b4a]">
            <button 
              (click)="showModal = false"
              class="px-4 py-2 border border-outline-variant dark:border-[#3d3b4a] text-xs font-medium rounded-xl hover:bg-surface-container-high transition-colors">
              Cancel
            </button>
            <button 
              (click)="saveInterview()"
              [disabled]="!formData.applicationId || !formData.roundName || !formData.dateTime"
              class="px-5 py-2 bg-primary text-on-primary text-xs font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50">
              {{ isEditModal ? 'Update Interview' : 'Schedule Interview' }}
            </button>
          </div>
        </div>
      </div>
    </main>
  `
})
export class InterviewsComponent implements OnInit {
  allInterviews: Interview[] = [];
  displayedInterviews: Interview[] = [];
  availableApplications: Application[] = [];

  selectedTab: 'upcoming' | 'past' = 'upcoming';
  searchQuery: string = '';

  upcomingCount: number = 0;
  pastCount: number = 0;

  showModal: boolean = false;
  isEditModal: boolean = false;
  editingId: string | null = null;

  formData = {
    applicationId: '',
    roundName: '',
    dateTime: '',
    mode: 'Online' as InterviewMode,
    meetingLink: '',
    notes: ''
  };

  constructor(
    private interviewService: InterviewService,
    private applicationService: ApplicationService,
    private toastService: ToastService,
    private dialogService: DialogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.interviewService.interviews$.subscribe(() => {
      this.loadData();
    });

    this.applicationService.applications$.subscribe(() => {
      this.availableApplications = this.applicationService.getActiveApplications();
    });
  }

  loadData(): void {
    this.allInterviews = this.interviewService.interviews;
    this.upcomingCount = this.interviewService.getUpcomingInterviews().length;
    this.pastCount = this.interviewService.getPastInterviews().length;
    this.filterInterviews();
  }

  filterInterviews(): void {
    this.displayedInterviews = this.interviewService.filterInterviews(
      this.allInterviews,
      this.searchQuery,
      this.selectedTab
    );
  }

  getCompanyName(applicationId: string): string {
    const app = this.applicationService.getApplicationById(applicationId);
    return app ? app.company : 'Unknown Company';
  }

  getRoleName(applicationId: string): string {
    const app = this.applicationService.getApplicationById(applicationId);
    return app ? app.role : 'Position';
  }

  getCompanyInitials(applicationId: string): string {
    const app = this.applicationService.getApplicationById(applicationId);
    return app && app.company ? app.company.charAt(0).toUpperCase() : 'I';
  }

  getModeIcon(mode: InterviewMode): string {
    switch (mode) {
      case 'Phone':
        return 'phone';
      case 'Onsite':
        return 'apartment';
      case 'Online':
      default:
        return 'videocam';
    }
  }

  formatDate(date: string | Date): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  formatTime(date: string | Date): string {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  openScheduleModal(): void {
    this.isEditModal = false;
    this.editingId = null;
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    tomorrow.setHours(10, 0, 0, 0);

    const defaultAppId = this.availableApplications.length > 0 ? this.availableApplications[0].id : '';

    this.formData = {
      applicationId: defaultAppId,
      roundName: '',
      dateTime: tomorrow.toISOString().slice(0, 16),
      mode: 'Online',
      meetingLink: '',
      notes: ''
    };
    this.showModal = true;
  }

  openEditModal(interview: Interview): void {
    this.isEditModal = true;
    this.editingId = interview.id;
    let dtStr = '';
    try {
      dtStr = new Date(interview.dateTime).toISOString().slice(0, 16);
    } catch {
      dtStr = '';
    }

    this.formData = {
      applicationId: interview.applicationId,
      roundName: interview.roundName,
      dateTime: dtStr,
      mode: interview.mode,
      meetingLink: interview.meetingLink || '',
      notes: interview.notes || ''
    };
    this.showModal = true;
  }

  saveInterview(): void {
    if (!this.formData.applicationId || !this.formData.roundName || !this.formData.dateTime) {
      this.toastService.error('Please complete all required fields.');
      return;
    }

    if (this.isEditModal && this.editingId) {
      this.interviewService.updateInterview(this.editingId, {
        applicationId: this.formData.applicationId,
        roundName: this.formData.roundName,
        dateTime: new Date(this.formData.dateTime).toISOString(),
        mode: this.formData.mode,
        meetingLink: this.formData.meetingLink,
        notes: this.formData.notes
      });
      this.toastService.success('Interview updated successfully');
    } else {
      this.interviewService.createInterview({
        applicationId: this.formData.applicationId,
        roundName: this.formData.roundName,
        dateTime: new Date(this.formData.dateTime).toISOString(),
        mode: this.formData.mode,
        meetingLink: this.formData.meetingLink,
        notes: this.formData.notes
      });
      this.toastService.success('Interview scheduled successfully');
    }

    this.showModal = false;
  }

  confirmDelete(interview: Interview): void {
    this.dialogService.confirm({
      title: 'Delete Interview',
      message: `Are you sure you want to delete "${interview.roundName}" for ${this.getCompanyName(interview.applicationId)}?`,
      confirmText: 'Delete',
      isDestructive: true,
      onConfirm: () => {
        this.interviewService.deleteInterview(interview.id);
        this.toastService.success('Interview deleted');
      }
    });
  }

  navigateToApplication(applicationId: string): void {
    if (applicationId) {
      this.router.navigate(['/applications', applicationId]);
    }
  }
}