import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApplicationService } from '../../core/services/application.service';
import { ToastService } from '../../core/services/toast.service';
import { DialogService } from '../../core/services/dialog.service';
import { Application } from '../../shared/models/application.model';

@Component({
  selector: 'app-saved',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="flex-1 p-4 md:p-10 max-w-7xl mx-auto w-full flex flex-col gap-6">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5">
            <h2 class="text-2xl md:text-3xl font-bold tracking-tight text-on-surface dark:text-[#fcf8ff]">Saved Jobs</h2>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-fixed-dim">
              {{ savedJobs.length }}
            </span>
          </div>
          <p class="text-sm md:text-base text-on-surface-variant dark:text-gray-400 mt-1">
            Bookmarked positions to research, tailor resumes for, or apply to later.
          </p>
        </div>

        <button 
          (click)="navigateToAddSaved()"
          class="px-4 py-2 bg-primary text-on-primary rounded-xl text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-2 shadow-sm cursor-pointer active:scale-95 self-start sm:self-auto">
          <span class="material-symbols-outlined text-lg">bookmark_add</span>
          <span>Bookmark New Job</span>
        </button>
      </div>

      <!-- Saved Jobs Grid -->
      <div *ngIf="savedJobs.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div 
          *ngFor="let job of savedJobs"
          class="bg-surface dark:bg-[#262530] border border-outline-variant dark:border-[#3d3b4a] rounded-2xl p-6 shadow-sm hover:border-primary/50 transition-all flex flex-col justify-between gap-5 group">
          
          <!-- Header: Logo, Company & Role -->
          <div>
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="w-11 h-11 rounded-xl bg-secondary-container text-on-secondary-container font-bold text-base flex items-center justify-center shrink-0">
                  {{ job.company.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <h3 class="font-bold text-base text-on-surface dark:text-[#fcf8ff] group-hover:text-primary dark:group-hover:text-primary-fixed-dim transition-colors">
                    {{ job.company }}
                  </h3>
                  <p class="text-xs text-on-surface-variant dark:text-gray-400">{{ job.location || 'Remote' }}</p>
                </div>
              </div>

              <!-- Unsave Icon Button -->
              <button 
                (click)="unsaveJob(job)"
                class="p-1.5 rounded-lg text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
                title="Remove from Saved">
                <span class="material-symbols-outlined text-xl filled">bookmark</span>
              </button>
            </div>

            <!-- Role Title -->
            <h4 class="font-semibold text-sm md:text-base text-on-surface dark:text-[#fcf8ff] mt-3">
              {{ job.role }}
            </h4>

            <!-- Metadata Badges -->
            <div class="flex flex-wrap items-center gap-2 mt-2 text-xs">
              <span class="px-2.5 py-0.5 rounded-lg bg-surface-container-low dark:bg-[#1f1e28] border border-outline-variant/60 dark:border-[#3d3b4a] text-on-surface-variant dark:text-gray-300">
                {{ job.jobType }}
              </span>
              <span *ngIf="job.salaryRange" class="px-2.5 py-0.5 rounded-lg bg-surface-container-low dark:bg-[#1f1e28] border border-outline-variant/60 dark:border-[#3d3b4a] text-on-surface-variant dark:text-gray-300 font-mono">
                {{ job.salaryRange }}
              </span>
            </div>

            <!-- Notes Snippet -->
            <p *ngIf="job.notes" class="text-xs text-on-surface-variant dark:text-gray-300 mt-3 line-clamp-3 bg-surface-container-low dark:bg-[#1f1e28] p-3 rounded-xl border border-outline-variant/40 dark:border-[#3d3b4a]">
              {{ job.notes }}
            </p>
          </div>

          <!-- Actions Footer -->
          <div class="pt-4 border-t border-outline-variant/50 dark:border-[#3d3b4a] flex flex-col gap-2.5">
            <!-- Move to Applications Pipeline CTA -->
            <button 
              (click)="moveToApplications(job)"
              class="w-full py-2 bg-primary text-on-primary rounded-xl text-xs font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-98">
              <span class="material-symbols-outlined text-base">send</span>
              <span>Move to Active Applications</span>
            </button>

            <!-- Links & Delete Sub-actions -->
            <div class="flex items-center justify-between text-xs pt-1">
              <a 
                *ngIf="job.jobLink" 
                [href]="job.jobLink" 
                target="_blank" 
                class="inline-flex items-center gap-1 text-primary dark:text-primary-fixed-dim hover:underline font-medium">
                <span class="material-symbols-outlined text-sm">open_in_new</span>
                <span>Job Posting</span>
              </a>
              <span *ngIf="!job.jobLink"></span>

              <button 
                (click)="confirmDelete(job)"
                class="text-rose-600 hover:underline flex items-center gap-0.5">
                <span class="material-symbols-outlined text-sm">delete</span>
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div 
        *ngIf="savedJobs.length === 0" 
        class="bg-surface dark:bg-[#262530] border border-outline-variant dark:border-[#3d3b4a] rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3">
        <div class="w-14 h-14 rounded-full bg-surface-container dark:bg-[#383745] flex items-center justify-center text-primary dark:text-primary-fixed-dim">
          <span class="material-symbols-outlined text-3xl">bookmark_border</span>
        </div>
        <h3 class="text-lg font-bold text-on-surface dark:text-[#fcf8ff]">No saved jobs yet</h3>
        <p class="text-sm text-on-surface-variant dark:text-gray-400 max-w-md">
          When browsing roles or saving positions to apply to later, bookmark them to keep them organized right here.
        </p>
        <button 
          (click)="navigateToAddSaved()"
          class="mt-2 px-5 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-semibold hover:opacity-90 transition-all">
          + Bookmark First Opportunity
        </button>
      </div>
    </main>
  `
})
export class SavedComponent implements OnInit {
  savedJobs: Application[] = [];

  constructor(
    private applicationService: ApplicationService,
    private toastService: ToastService,
    private dialogService: DialogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.applicationService.applications$.subscribe(() => {
      this.loadSavedJobs();
    });
  }

  private loadSavedJobs(): void {
    this.savedJobs = this.applicationService.getSavedApplications();
  }

  moveToApplications(job: Application): void {
    this.applicationService.moveToApplications(job.id);
    this.toastService.success(`Moved ${job.company} (${job.role}) to active applications!`);
  }

  unsaveJob(job: Application): void {
    this.applicationService.toggleSave(job.id);
    this.toastService.info(`Removed ${job.company} from saved jobs`);
  }

  confirmDelete(job: Application): void {
    this.dialogService.confirm({
      title: 'Delete Saved Job',
      message: `Are you sure you want to delete this saved position for ${job.role} at ${job.company}?`,
      confirmText: 'Delete',
      isDestructive: true,
      onConfirm: () => {
        this.applicationService.deleteApplication(job.id);
        this.toastService.success(`Deleted ${job.company}`);
      }
    });
  }

  navigateToAddSaved(): void {
    this.router.navigate(['/applications/new']);
  }
}