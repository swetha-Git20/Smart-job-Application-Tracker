import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApplicationService } from '../../core/services/application.service';
import { InterviewService } from '../../core/services/interview.service';
import { ToastService } from '../../core/services/toast.service';
import { DialogService } from '../../core/services/dialog.service';
import { Application, ApplicationStatus, Interview } from '../../shared/models/application.model';

@Component({
  selector: 'app-application-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <main *ngIf="application" class="flex-1 p-4 md:p-10 max-w-6xl mx-auto w-full flex flex-col gap-6">
      <!-- Top Navigation Breadcrumb -->
      <div class="flex items-center justify-between text-sm text-on-surface-variant dark:text-gray-400">
        <a routerLink="/applications" class="hover:text-primary dark:hover:text-primary-fixed-dim flex items-center gap-1 transition-colors">
          <span class="material-symbols-outlined text-base">arrow_back</span>
          <span>Back to Applications</span>
        </a>

        <div class="flex items-center gap-2">
          <!-- Bookmark Button -->
          <button 
            (click)="toggleBookmark()"
            class="p-2 rounded-xl border border-outline-variant dark:border-[#3d3b4a] hover:bg-surface-container-high dark:hover:bg-[#383745] transition-colors flex items-center gap-1 text-xs font-semibold"
            [title]="application.isSaved ? 'Remove from Saved' : 'Save to Bookmarks'">
            <span class="material-symbols-outlined text-lg" [ngClass]="application.isSaved ? 'text-amber-500 filled' : ''">
              {{ application.isSaved ? 'bookmark' : 'bookmark_border' }}
            </span>
            <span>{{ application.isSaved ? 'Saved' : 'Save' }}</span>
          </button>

          <!-- Edit Button -->
          <button 
            (click)="navigateToEdit()"
            class="px-3.5 py-2 rounded-xl border border-outline-variant dark:border-[#3d3b4a] hover:bg-surface-container-high dark:hover:bg-[#383745] text-xs font-semibold text-on-surface dark:text-[#fcf8ff] transition-colors flex items-center gap-1.5">
            <span class="material-symbols-outlined text-base">edit</span>
            <span>Edit</span>
          </button>

          <!-- Delete Button -->
          <button 
            (click)="confirmDelete()"
            class="p-2 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-xs font-semibold transition-colors"
            title="Delete Application">
            <span class="material-symbols-outlined text-base">delete</span>
          </button>
        </div>
      </div>

      <!-- Application Header Banner -->
      <div class="bg-surface dark:bg-[#262530] border border-outline-variant dark:border-[#3d3b4a] rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="flex items-start gap-4">
          <div class="w-14 h-14 rounded-2xl bg-secondary-container text-on-secondary-container font-extrabold text-2xl flex items-center justify-center shrink-0 shadow-sm">
            {{ application.company.charAt(0).toUpperCase() }}
          </div>
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h2 class="text-xl md:text-3xl font-extrabold text-on-surface dark:text-[#fcf8ff] tracking-tight">
                {{ application.role }}
              </h2>
            </div>
            <p class="text-base text-on-surface-variant dark:text-gray-400 font-medium mt-1">
              {{ application.company }} &bull; {{ application.location || 'Remote' }}
            </p>
          </div>
        </div>

        <!-- Status Pill Dropdown -->
        <div class="flex items-center gap-3">
          <div class="relative">
            <select 
              [ngModel]="application.status"
              (ngModelChange)="onStatusChange($event)"
              [ngClass]="getStatusBadgeClass(application.status)"
              class="appearance-none font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-full cursor-pointer pr-8 focus:outline-none focus:ring-2 focus:ring-primary shadow-xs">
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
            <span class="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-sm pointer-events-none opacity-80">arrow_drop_down</span>
          </div>
        </div>
      </div>

      <!-- Two-Column Grid: Overview & Interviews vs Status Timeline -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <!-- Left Column: Details & Interviews (2 cols) -->
        <div class="lg:col-span-2 flex flex-col gap-6">
          <!-- Job Details Overview Card -->
          <div class="bg-surface dark:bg-[#262530] border border-outline-variant dark:border-[#3d3b4a] rounded-2xl p-6 shadow-sm flex flex-col gap-5">
            <h3 class="text-sm font-bold uppercase tracking-wider text-on-surface-variant dark:text-gray-400 border-b border-outline-variant/40 dark:border-[#3d3b4a] pb-3 flex items-center gap-2">
              <span class="material-symbols-outlined text-lg">info</span>
              <span>Position Overview</span>
            </h3>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-on-surface-variant/70 dark:text-gray-400">Work Model</p>
                <p class="text-sm font-semibold text-on-surface dark:text-[#fcf8ff] mt-1 flex items-center gap-1">
                  <span class="material-symbols-outlined text-base text-primary">work</span>
                  {{ application.jobType }}
                </p>
              </div>

              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-on-surface-variant/70 dark:text-gray-400">Date Applied</p>
                <p class="text-sm font-semibold text-on-surface dark:text-[#fcf8ff] mt-1 flex items-center gap-1">
                  <span class="material-symbols-outlined text-base text-primary">calendar_today</span>
                  {{ formatDate(application.appliedDate) }}
                </p>
              </div>

              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-on-surface-variant/70 dark:text-gray-400">Salary Range</p>
                <p class="text-sm font-semibold text-on-surface dark:text-[#fcf8ff] mt-1 font-mono">
                  {{ application.salaryRange || 'Not specified' }}
                </p>
              </div>

              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-on-surface-variant/70 dark:text-gray-400">Location</p>
                <p class="text-sm font-semibold text-on-surface dark:text-[#fcf8ff] mt-1 truncate">
                  {{ application.location || 'Remote' }}
                </p>
              </div>
            </div>

            <!-- Job Posting URL Button -->
            <div *ngIf="application.jobLink" class="pt-4 border-t border-outline-variant/40 dark:border-[#3d3b4a]">
              <a 
                [href]="application.jobLink" 
                target="_blank" 
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-high dark:bg-[#383745] hover:bg-primary hover:text-white text-on-surface dark:text-[#fcf8ff] text-xs font-semibold transition-all">
                <span class="material-symbols-outlined text-base">open_in_new</span>
                <span>View Original Job Posting</span>
              </a>
            </div>
          </div>

          <!-- Notes Card with Inline Editing -->
          <div class="bg-surface dark:bg-[#262530] border border-outline-variant dark:border-[#3d3b4a] rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <div class="flex items-center justify-between border-b border-outline-variant/40 dark:border-[#3d3b4a] pb-3">
              <h3 class="text-sm font-bold uppercase tracking-wider text-on-surface-variant dark:text-gray-400 flex items-center gap-2">
                <span class="material-symbols-outlined text-lg">sticky_note_2</span>
                <span>Notes & Referral Context</span>
              </h3>
              <button 
                *ngIf="!isEditingNotes"
                (click)="isEditingNotes = true"
                class="text-xs font-semibold text-primary dark:text-primary-fixed-dim hover:underline flex items-center gap-1 cursor-pointer">
                <span class="material-symbols-outlined text-sm">edit</span>
                <span>Edit Notes</span>
              </button>
            </div>

            <div *ngIf="!isEditingNotes">
              <p *ngIf="application.notes" class="text-sm text-on-surface dark:text-gray-200 whitespace-pre-line leading-relaxed">
                {{ application.notes }}
              </p>
              <p *ngIf="!application.notes" class="text-sm italic text-on-surface-variant/70 dark:text-gray-500">
                No notes added for this application. Click Edit to add notes.
              </p>
            </div>

            <!-- Notes Edit Mode -->
            <div *ngIf="isEditingNotes" class="flex flex-col gap-3">
              <textarea 
                [(ngModel)]="editedNotes"
                rows="4" 
                placeholder="Write preparation notes, referral contact info, questions asked, etc."
                class="w-full bg-surface-container-lowest dark:bg-[#1f1e28] border border-outline-variant dark:border-[#3d3b4a] text-on-surface dark:text-[#fcf8ff] rounded-xl p-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"></textarea>
              <div class="flex justify-end gap-2">
                <button 
                  (click)="isEditingNotes = false"
                  class="px-3 py-1.5 border border-outline-variant dark:border-[#3d3b4a] text-xs font-medium rounded-lg hover:bg-surface-container-high transition-colors">
                  Cancel
                </button>
                <button 
                  (click)="saveNotes()"
                  class="px-4 py-1.5 bg-primary text-on-primary text-xs font-semibold rounded-lg hover:opacity-90 transition-all shadow-xs">
                  Save Notes
                </button>
              </div>
            </div>
          </div>

          <!-- Linked Interviews Section -->
          <div class="bg-surface dark:bg-[#262530] border border-outline-variant dark:border-[#3d3b4a] rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <div class="flex items-center justify-between border-b border-outline-variant/40 dark:border-[#3d3b4a] pb-3">
              <h3 class="text-sm font-bold uppercase tracking-wider text-on-surface-variant dark:text-gray-400 flex items-center gap-2">
                <span class="material-symbols-outlined text-lg">event</span>
                <span>Scheduled Interviews ({{ linkedInterviews.length }})</span>
              </h3>
              <button 
                (click)="openAddInterviewModal()"
                class="px-3 py-1.5 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim text-xs font-semibold rounded-xl hover:bg-primary hover:text-white transition-all flex items-center gap-1 shadow-xs cursor-pointer">
                <span class="material-symbols-outlined text-base">add</span>
                <span>Schedule Interview</span>
              </button>
            </div>

            <!-- Interviews List -->
            <div *ngIf="linkedInterviews.length > 0" class="flex flex-col gap-3">
              <div 
                *ngFor="let interview of linkedInterviews" 
                class="p-4 rounded-xl bg-surface-container-low dark:bg-[#1f1e28] border border-outline-variant/60 dark:border-[#3d3b4a] flex flex-col gap-2">
                
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <h4 class="font-bold text-sm text-on-surface dark:text-[#fcf8ff]">{{ interview.roundName }}</h4>
                    <p class="text-xs text-on-surface-variant dark:text-gray-400 mt-0.5">
                      {{ formatDateTime(interview.dateTime) }} &bull; {{ interview.mode }}
                    </p>
                  </div>
                  
                  <div class="flex items-center gap-1">
                    <button 
                      (click)="deleteInterview(interview.id)"
                      class="p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 transition-colors"
                      title="Delete Interview">
                      <span class="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                </div>

                <p *ngIf="interview.notes" class="text-xs text-on-surface-variant dark:text-gray-300 bg-surface dark:bg-[#262530] p-2.5 rounded-lg border border-outline-variant/40 dark:border-[#3d3b4a]">
                  {{ interview.notes }}
                </p>

                <div *ngIf="interview.meetingLink" class="mt-1">
                  <a 
                    [href]="interview.meetingLink" 
                    target="_blank" 
                    class="inline-flex items-center gap-1 text-xs font-semibold text-primary dark:text-primary-fixed-dim hover:underline">
                    <span class="material-symbols-outlined text-sm">videocam</span>
                    <span>Join Meeting Link</span>
                  </a>
                </div>
              </div>
            </div>

            <div *ngIf="linkedInterviews.length === 0" class="text-center py-6 text-on-surface-variant dark:text-gray-400 text-xs">
              <p>No interviews scheduled for this role yet.</p>
            </div>
          </div>
        </div>

        <!-- Right Column: Status Timeline (1 col) -->
        <div class="flex flex-col gap-6">
          <div class="bg-surface dark:bg-[#262530] border border-outline-variant dark:border-[#3d3b4a] rounded-2xl p-6 shadow-sm flex flex-col gap-5">
            <h3 class="text-sm font-bold uppercase tracking-wider text-on-surface dark:text-[#fcf8ff] border-b border-outline-variant/40 dark:border-[#3d3b4a] pb-3 flex items-center gap-2">
              <span class="material-symbols-outlined text-lg text-primary">timeline</span>
              <span>Status Timeline</span>
            </h3>

            <!-- Chronological Timeline List -->
            <div class="relative pl-1">
              <div 
                *ngFor="let item of application.statusHistory; let last = last; let i = index" 
                class="timeline-line relative pl-8 pb-6">
                
                <!-- Timeline Dot / Icon -->
                <div 
                  [ngClass]="getTimelineDotClass(item.status, last)"
                  class="absolute left-0 top-0.5 w-6 h-6 rounded-full flex items-center justify-center shadow-xs z-10">
                  <span class="material-symbols-outlined text-xs font-bold text-white">
                    {{ getTimelineDotIcon(item.status) }}
                  </span>
                </div>

                <div>
                  <h4 class="text-sm font-bold text-on-surface dark:text-[#fcf8ff] leading-none">
                    {{ item.status }}
                  </h4>
                  <p class="text-xs text-on-surface-variant dark:text-gray-400 mt-1 font-mono">
                    {{ formatDateTime(item.date) }}
                  </p>
                  <p *ngIf="item.notes" class="text-xs text-on-surface-variant/80 dark:text-gray-300 mt-1">
                    {{ item.notes }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Quick Status Change Buttons -->
            <div class="pt-4 border-t border-outline-variant/40 dark:border-[#3d3b4a] flex flex-col gap-2">
              <span class="text-xs font-semibold text-on-surface-variant dark:text-gray-400">Advance Pipeline:</span>
              <div class="grid grid-cols-2 gap-2">
                <button 
                  (click)="onStatusChange('Interview')"
                  [disabled]="application.status === 'Interview'"
                  class="px-2.5 py-1.5 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-semibold hover:bg-amber-100 dark:hover:bg-amber-950/70 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                  + Interview
                </button>
                <button 
                  (click)="onStatusChange('Offer')"
                  [disabled]="application.status === 'Offer'"
                  class="px-2.5 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-950/70 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                  + Offer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Interview Modal -->
      <div 
        *ngIf="showAddInterviewModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm modal-backdrop">
        <div class="bg-surface dark:bg-[#262530] border border-outline-variant dark:border-[#3d3b4a] rounded-2xl p-6 max-w-lg w-full shadow-2xl animate-fade-in flex flex-col gap-4">
          <div class="flex items-center justify-between border-b border-outline-variant/40 dark:border-[#3d3b4a] pb-3">
            <h3 class="text-lg font-bold text-on-surface dark:text-[#fcf8ff]">Schedule Interview</h3>
            <button (click)="showAddInterviewModal = false" class="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container-high">
              <span class="material-symbols-outlined text-base">close</span>
            </button>
          </div>

          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-1">
              <label class="text-xs font-semibold text-on-surface dark:text-gray-200">Round Name *</label>
              <input 
                [(ngModel)]="newInterview.roundName" 
                placeholder="e.g. Technical Screen, System Design, Final Panel"
                class="w-full bg-surface-container-lowest dark:bg-[#1f1e28] border border-outline-variant dark:border-[#3d3b4a] text-on-surface dark:text-[#fcf8ff] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"/>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="flex flex-col gap-1">
                <label class="text-xs font-semibold text-on-surface dark:text-gray-200">Date & Time *</label>
                <input 
                  type="datetime-local" 
                  [(ngModel)]="newInterview.dateTime" 
                  class="w-full bg-surface-container-lowest dark:bg-[#1f1e28] border border-outline-variant dark:border-[#3d3b4a] text-on-surface dark:text-[#fcf8ff] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"/>
              </div>

              <div class="flex flex-col gap-1">
                <label class="text-xs font-semibold text-on-surface dark:text-gray-200">Format / Mode</label>
                <select 
                  [(ngModel)]="newInterview.mode" 
                  class="w-full bg-surface-container-lowest dark:bg-[#1f1e28] border border-outline-variant dark:border-[#3d3b4a] text-on-surface dark:text-[#fcf8ff] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary">
                  <option value="Online">Online / Video</option>
                  <option value="Onsite">On-site</option>
                  <option value="Phone">Phone</option>
                </select>
              </div>
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-xs font-semibold text-on-surface dark:text-gray-200">Meeting Link (optional)</label>
              <input 
                [(ngModel)]="newInterview.meetingLink" 
                placeholder="https://meet.google.com/..."
                class="w-full bg-surface-container-lowest dark:bg-[#1f1e28] border border-outline-variant dark:border-[#3d3b4a] text-on-surface dark:text-[#fcf8ff] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"/>
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-xs font-semibold text-on-surface dark:text-gray-200">Preparation Notes (optional)</label>
              <textarea 
                [(ngModel)]="newInterview.notes" 
                rows="2"
                placeholder="Topics to prepare, interviewer names, etc."
                class="w-full bg-surface-container-lowest dark:bg-[#1f1e28] border border-outline-variant dark:border-[#3d3b4a] text-on-surface dark:text-[#fcf8ff] rounded-xl p-2.5 text-sm focus:outline-none focus:border-primary"></textarea>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t border-outline-variant/40 dark:border-[#3d3b4a]">
            <button 
              (click)="showAddInterviewModal = false"
              class="px-4 py-2 border border-outline-variant dark:border-[#3d3b4a] text-xs font-medium rounded-xl hover:bg-surface-container-high transition-colors">
              Cancel
            </button>
            <button 
              (click)="saveScheduledInterview()"
              [disabled]="!newInterview.roundName || !newInterview.dateTime"
              class="px-5 py-2 bg-primary text-on-primary text-xs font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50">
              Schedule Interview
            </button>
          </div>
        </div>
      </div>
    </main>
  `
})
export class ApplicationDetailComponent implements OnInit {
  application: Application | undefined;
  linkedInterviews: Interview[] = [];
  
  isEditingNotes: boolean = false;
  editedNotes: string = '';

  showAddInterviewModal: boolean = false;
  newInterview = {
    roundName: '',
    dateTime: '',
    mode: 'Online' as const,
    notes: '',
    meetingLink: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private applicationService: ApplicationService,
    private interviewService: InterviewService,
    private toastService: ToastService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadApplication(id);
      }
    });

    this.interviewService.interviews$.subscribe(() => {
      if (this.application) {
        this.linkedInterviews = this.interviewService.getInterviewsByApplicationId(this.application.id);
      }
    });
  }

  private loadApplication(id: string): void {
    this.application = this.applicationService.getApplicationById(id);
    if (this.application) {
      this.editedNotes = this.application.notes || '';
      this.linkedInterviews = this.interviewService.getInterviewsByApplicationId(this.application.id);
    } else {
      this.toastService.error('Application not found');
      this.router.navigate(['/applications']);
    }
  }

  onStatusChange(newStatus: ApplicationStatus): void {
    if (this.application && this.application.status !== newStatus) {
      this.applicationService.updateStatus(this.application.id, newStatus);
      this.application = this.applicationService.getApplicationById(this.application.id);
      this.toastService.success(`Updated status to ${newStatus}`);
    }
  }

  toggleBookmark(): void {
    if (this.application) {
      const isSaved = this.applicationService.toggleSave(this.application.id);
      this.application = this.applicationService.getApplicationById(this.application.id);
      if (isSaved) {
        this.toastService.success('Saved to bookmarks');
      } else {
        this.toastService.info('Removed from bookmarks');
      }
    }
  }

  saveNotes(): void {
    if (this.application) {
      this.applicationService.updateNotes(this.application.id, this.editedNotes);
      this.application = this.applicationService.getApplicationById(this.application.id);
      this.isEditingNotes = false;
      this.toastService.success('Notes updated successfully');
    }
  }

  openAddInterviewModal(): void {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    tomorrow.setHours(10, 0, 0, 0);
    this.newInterview = {
      roundName: '',
      dateTime: tomorrow.toISOString().slice(0, 16),
      mode: 'Online',
      notes: '',
      meetingLink: ''
    };
    this.showAddInterviewModal = true;
  }

  saveScheduledInterview(): void {
    if (this.application && this.newInterview.roundName && this.newInterview.dateTime) {
      this.interviewService.createInterview({
        applicationId: this.application.id,
        roundName: this.newInterview.roundName,
        dateTime: new Date(this.newInterview.dateTime).toISOString(),
        mode: this.newInterview.mode,
        notes: this.newInterview.notes,
        meetingLink: this.newInterview.meetingLink
      });

      this.showAddInterviewModal = false;
      this.loadApplication(this.application.id);
      this.toastService.success('Interview scheduled successfully');
    }
  }

  deleteInterview(interviewId: string): void {
    this.dialogService.confirm({
      title: 'Delete Interview',
      message: 'Are you sure you want to delete this scheduled interview?',
      confirmText: 'Delete',
      isDestructive: true,
      onConfirm: () => {
        this.interviewService.deleteInterview(interviewId);
        this.toastService.success('Interview deleted');
      }
    });
  }

  confirmDelete(): void {
    if (this.application) {
      this.dialogService.confirm({
        title: 'Delete Application',
        message: `Are you sure you want to delete your application for ${this.application.role} at ${this.application.company}?`,
        confirmText: 'Delete',
        isDestructive: true,
        onConfirm: () => {
          if (this.application) {
            this.applicationService.deleteApplication(this.application.id);
            this.toastService.success(`Deleted application for ${this.application.company}`);
            this.router.navigate(['/applications']);
          }
        }
      });
    }
  }

  navigateToEdit(): void {
    if (this.application) {
      this.router.navigate(['/applications', this.application.id, 'edit']);
    }
  }

  formatDate(date: string | Date): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  formatDateTime(date: string | Date): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' at ' +
           d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
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

  getTimelineDotClass(status: string, isLatest: boolean): string {
    switch (status) {
      case 'Applied':
        return 'bg-indigo-600';
      case 'Interview':
        return 'bg-amber-600';
      case 'Offer':
        return 'bg-emerald-600';
      case 'Rejected':
        return 'bg-rose-600';
      default:
        return 'bg-gray-600';
    }
  }

  getTimelineDotIcon(status: string): string {
    switch (status) {
      case 'Applied':
        return 'send';
      case 'Interview':
        return 'event';
      case 'Offer':
        return 'celebration';
      case 'Rejected':
        return 'close';
      default:
        return 'check';
    }
  }
}