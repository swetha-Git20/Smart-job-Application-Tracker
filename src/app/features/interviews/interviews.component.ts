import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InterviewService } from '../../core/services/interview.service';
import { ApplicationService } from '../../core/services/application.service';
import { ToastService } from '../../core/services/toast.service';
import { Interview, Application } from '../../shared/models/application.model';

@Component({
  selector: 'app-interviews',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="flex flex-col min-h-screen">
      <!-- Header -->
      <header class="h-16 px-4 md:px-10 flex items-center justify-between border-b border-outline-variant bg-surface/80 backdrop-blur-md sticky top-0 z-40">
        <div class="flex items-center gap-4">
          <h2 class="text-xl font-semibold text-on-background">Interviews</h2>
        </div>
        <div class="flex items-center gap-4">
          <button 
            (click)="openAddModal()"
            class="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:opacity-90 shadow-sm">
            <span class="material-symbols-outlined text-[18px]">add_circle</span>
            Schedule Interview
          </button>
        </div>
      </header>

      <!-- Page Content -->
      <div class="p-4 md:p-10 flex-1 flex flex-col gap-8">
        <!-- Action Bar -->
        <div class="flex items-center justify-between">
          <div class="flex gap-2 bg-surface-container p-1 rounded-lg border border-outline-variant/50">
            <button 
              (click)="filter = 'upcoming'"
              [ngClass]="{'bg-surface text-on-surface shadow-sm border border-outline-variant/30': filter === 'upcoming'}"
              class="px-4 py-1.5 text-sm font-medium rounded transition-colors">
              Upcoming
            </button>
            <button 
              (click)="filter = 'past'"
              [ngClass]="{'bg-surface text-on-surface shadow-sm border border-outline-variant/30': filter === 'past'}"
              class="px-4 py-1.5 text-sm font-medium rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 transition-colors">
              Past
            </button>
          </div>
        </div>

        <!-- Interview Cards -->
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div *ngFor="let interview of filteredInterviews" 
               class="bg-surface border border-outline-variant rounded-xl p-6 flex flex-col gap-4 relative overflow-hidden shadow-sm hover:border-outline transition-colors">
            <div class="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10"></div>
            
            <div class="flex justify-between items-start">
              <div class="flex gap-4 items-center">
                <div class="w-12 h-12 rounded-lg bg-surface-container-high border border-outline-variant flex items-center justify-center">
                  <span class="material-symbols-outlined text-secondary">event</span>
                </div>
                <div>
                  <h3 class="font-semibold text-on-surface">{{ getApplicationName(interview.applicationId) }}</h3>
                  <p class="text-sm text-on-surface-variant">{{ interview.roundName }}</p>
                </div>
              </div>
              <span [ngClass]="getModeClass(interview.mode)" 
                    class="px-2 py-0.5 rounded-full text-xs uppercase tracking-wider border">
                {{ interview.mode }}
              </span>
            </div>

            <div class="grid grid-cols-3 gap-2 mt-2">
              <div class="bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-2 flex flex-col gap-1">
                <span class="text-xs uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">calendar_today</span>
                  Date
                </span>
                <span class="text-sm font-medium text-on-surface">{{ formatDate(interview.dateTime) }}</span>
              </div>
              <div class="bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-2 flex flex-col gap-1">
                <span class="text-xs uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">schedule</span>
                  Time
                </span>
                <span class="text-sm font-medium text-on-surface">{{ formatTime(interview.dateTime) }}</span>
              </div>
              <div class="bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-2 flex flex-col gap-1">
                <span class="text-xs uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">videocam</span>
                  Format
                </span>
                <span class="text-sm font-medium text-on-surface">{{ interview.mode }}</span>
              </div>
            </div>

            <div class="mt-2 border-t border-outline-variant/50 pt-4 flex items-start gap-3">
              <span class="material-symbols-outlined text-on-surface-variant text-sm">sticky_note_2</span>
              <div class="flex-1">
                <p class="text-sm text-on-surface-variant line-clamp-2">
                  {{ interview.notes || 'No notes added yet.' }}
                </p>
              </div>
              <button 
                (click)="editInterview(interview)"
                class="text-primary text-sm font-medium hover:underline whitespace-nowrap">
                Edit
              </button>
            </div>

            <div class="flex gap-2 mt-auto pt-2">
              <button 
                (click)="editInterview(interview)"
                class="flex-1 px-3 py-2 rounded-lg border border-outline-variant text-sm font-medium hover:bg-surface-container-high transition-colors">
                Edit
              </button>
              <button 
                (click)="deleteInterview(interview.id)"
                class="px-3 py-2 rounded-lg border border-outline-variant text-sm font-medium hover:bg-error-container hover:text-on-error-container transition-colors">
                Delete
              </button>
            </div>
          </div>

          <div *ngIf="filteredInterviews.length === 0" 
               class="col-span-full text-center py-12 text-on-surface-variant">
            <span class="material-symbols-outlined text-4xl mb-2">event_busy</span>
            <p>No {{ filter }} interviews found.</p>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 border-t border-outline-variant/50 pt-8">
          <div>
            <p class="text-xs uppercase tracking-wider text-on-surface-variant mb-1">This Week</p>
            <p class="text-2xl font-bold text-on-surface">{{ getThisWeekCount() }}</p>
          </div>
          <div>
            <p class="text-xs uppercase tracking-wider text-on-surface-variant mb-1">Next Week</p>
            <p class="text-2xl font-bold text-on-surface">{{ getNextWeekCount() }}</p>
          </div>
          <div>
            <p class="text-xs uppercase tracking-wider text-on-surface-variant mb-1">Completed</p>
            <p class="text-2xl font-bold text-on-surface">{{ pastInterviews.length }}</p>
          </div>
        </div>
      </div>

      <!-- Add/Edit Modal -->
      <div *ngIf="showModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-surface rounded-xl border border-outline-variant shadow-xl max-w-md w-full p-6">
          <h2 class="text-xl font-semibold mb-4">{{ isEditMode ? 'Edit Interview' : 'Schedule Interview' }}</h2>
          <form [formGroup]="interviewForm" class="space-y-4">
            <div class="space-y-1">
              <label class="block text-sm font-semibold text-on-surface">Application</label>
              <select 
                formControlName="applicationId"
                class="w-full appearance-none bg-surface-container-lowest border border-outline-variant text-on-surface rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
                <option value="">Select Application</option>
                <option *ngFor="let app of applications" [value]="app.id">
                  {{ app.company }} - {{ app.role }}
                </option>
              </select>
            </div>

            <div class="space-y-1">
              <label class="block text-sm font-semibold text-on-surface">Round Name</label>
              <input 
                formControlName="roundName"
                class="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="e.g. Technical Round 1">
            </div>

            <div class="space-y-1">
              <label class="block text-sm font-semibold text-on-surface">Date & Time</label>
              <input 
                formControlName="dateTime"
                type="datetime-local"
                class="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
            </div>

            <div class="space-y-1">
              <label class="block text-sm font-semibold text-on-surface">Mode</label>
              <select 
                formControlName="mode"
                class="w-full appearance-none bg-surface-container-lowest border border-outline-variant text-on-surface rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
                <option value="Online">Online</option>
                <option value="Onsite">Onsite</option>
                <option value="Phone">Phone</option>
              </select>
            </div>

            <div class="space-y-1">
              <label class="block text-sm font-semibold text-on-surface">Notes</label>
              <textarea 
                formControlName="notes"
                class="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-y"
                rows="3"
                placeholder="Interview details, preparation notes, etc."></textarea>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button 
                (click)="closeModal()"
                type="button"
                class="px-4 py-2 rounded-lg border border-outline-variant text-on-surface font-medium hover:bg-surface-container-high transition-colors">
                Cancel
              </button>
              <button 
                (click)="saveInterview()"
                type="button"
                [disabled]="interviewForm.invalid"
                class="px-4 py-2 rounded-lg bg-primary text-on-primary font-medium hover:opacity-90 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {{ isEditMode ? 'Update' : 'Schedule' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class InterviewsComponent implements OnInit {
  interviews: Interview[] = [];
  applications: Application[] = [];
  upcomingInterviews: Interview[] = [];
  pastInterviews: Interview[] = [];
  filteredInterviews: Interview[] = [];
  filter = 'upcoming';
  
  showModal = false;
  isEditMode = false;
  editingInterviewId: string | null = null;
  
  interviewForm: FormGroup;

  constructor(
    private interviewService: InterviewService,
    private applicationService: ApplicationService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.interviewForm = this.fb.group({
      applicationId: ['', Validators.required],
      roundName: ['', Validators.required],
      dateTime: ['', Validators.required],
      mode: ['Online'],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadData();
    
    // Check if applicationId is passed in query params
    this.route.queryParams.subscribe(params => {
      if (params['applicationId']) {
        this.interviewForm.patchValue({ applicationId: params['applicationId'] });
        this.openAddModal();
      }
    });
  }

  loadData(): void {
    this.interviewService.interviews$.subscribe((interviews: Interview[]) => {
      this.interviews = interviews;
      this.upcomingInterviews = this.interviewService.getUpcomingInterviews();
      this.pastInterviews = this.interviewService.getPastInterviews();
      this.applyFilter();
    });

    this.applicationService.applications$.subscribe((apps: Application[]) => {
      this.applications = apps;
    });
  }

  applyFilter(): void {
    this.filteredInterviews = this.filter === 'upcoming' ? this.upcomingInterviews : this.pastInterviews;
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.editingInterviewId = null;
    this.interviewForm.reset({
      applicationId: '',
      roundName: '',
      dateTime: '',
      mode: 'Online',
      notes: ''
    });
    this.showModal = true;
  }

  editInterview(interview: Interview): void {
    this.isEditMode = true;
    this.editingInterviewId = interview.id;
    this.interviewForm.patchValue({
      applicationId: interview.applicationId,
      roundName: interview.roundName,
      dateTime: new Date(interview.dateTime).toISOString().slice(0, 16),
      mode: interview.mode,
      notes: interview.notes
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.interviewForm.reset();
  }

  saveInterview(): void {
    if (this.interviewForm.invalid) return;

    const formValue = this.interviewForm.value;
    
    if (this.isEditMode && this.editingInterviewId) {
      this.interviewService.updateInterview(this.editingInterviewId, {
        ...formValue,
        dateTime: new Date(formValue.dateTime)
      });
      this.toastService.success('Interview updated successfully');
    } else {
      this.interviewService.createInterview({
        ...formValue,
        dateTime: new Date(formValue.dateTime)
      });
      this.toastService.success('Interview scheduled successfully');
    }

    this.closeModal();
  }

  deleteInterview(id: string): void {
    if (confirm('Are you sure you want to delete this interview?')) {
      this.interviewService.deleteInterview(id);
      this.toastService.success('Interview deleted successfully');
    }
  }

  getApplicationName(applicationId: string): string {
    const app = this.applications.find((a: Application) => a.id === applicationId);
    return app ? `${app.company} - ${app.role}` : 'Unknown Application';
  }

  getModeClass(mode: string): string {
    switch (mode) {
      case 'Online': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Onsite': return 'bg-green-100 text-green-800 border-green-200';
      case 'Phone': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-surface-container text-on-surface-variant border-outline-variant';
    }
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  formatTime(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  getThisWeekCount(): number {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    return this.upcomingInterviews.filter((int: Interview) => {
      const d = new Date(int.dateTime);
      return d >= weekStart && d <= weekEnd;
    }).length;
  }

  getNextWeekCount(): number {
    const now = new Date();
    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(now.getDate() - now.getDay());
    
    const nextWeekStart = new Date(thisWeekStart);
    nextWeekStart.setDate(thisWeekStart.getDate() + 7);
    
    const nextWeekEnd = new Date(nextWeekStart);
    nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
    nextWeekEnd.setHours(23, 59, 59, 999);

    return this.upcomingInterviews.filter((int: Interview) => {
      const d = new Date(int.dateTime);
      return d >= nextWeekStart && d <= nextWeekEnd;
    }).length;
  }
}