import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApplicationService } from '../../core/services/application.service';
import { ToastService } from '../../core/services/toast.service';
import { Application } from '../../shared/models/application.model';

@Component({
  selector: 'app-saved',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-4 md:p-10 max-w-7xl mx-auto flex flex-col gap-8">
      <!-- Page Header -->
      <header class="flex justify-between items-end border-b border-outline-variant pb-4">
        <div>
          <h2 class="text-3xl font-bold text-on-surface">Saved Jobs</h2>
          <p class="text-base text-on-surface-variant mt-2">Manage and review your bookmarked opportunities.</p>
        </div>
        <div class="hidden sm:flex items-center gap-2">
          <span class="text-xs uppercase tracking-wider text-on-surface-variant">Sort by:</span>
          <select 
            [(ngModel)]="sortBy"
            (change)="sortSavedJobs()"
            class="bg-surface border border-outline-variant text-sm rounded-md py-1 px-2 focus:ring-primary focus:border-primary">
            <option value="newest">Date Saved (Newest)</option>
            <option value="oldest">Date Saved (Oldest)</option>
            <option value="company">Company (A-Z)</option>
          </select>
        </div>
      </header>

      <!-- Grid Content -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let app of savedApplications" 
             class="bg-surface rounded-xl border border-outline-variant p-4 flex flex-col justify-between hover:shadow-sm transition-shadow relative overflow-hidden group">
          <div class="absolute top-0 right-0 w-32 h-32 bg-primary-fixed/20 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
          
          <div>
            <div class="flex justify-between items-start mb-4 relative z-10">
              <div class="flex items-center gap-2">
                <div class="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center border border-outline-variant">
                  <span class="material-symbols-outlined text-primary">business</span>
                </div>
                <div>
                  <h3 class="font-semibold text-on-surface">{{ app.company }}</h3>
                </div>
              </div>
              <button 
                (click)="unsaveJob(app.id)"
                class="text-primary hover:text-primary-container focus:outline-none"
                title="Unsave job">
                <span class="material-symbols-outlined filled">bookmark</span>
              </button>
            </div>
            <h4 class="text-lg font-semibold text-on-background mb-2 relative z-10">{{ app.role }}</h4>
            <div class="flex flex-wrap gap-2 mb-4 relative z-10">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs uppercase tracking-wider bg-secondary-fixed text-on-secondary-fixed">
                <span class="material-symbols-outlined text-sm mr-1">location_on</span>
                {{ app.location || 'Remote' }}
              </span>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs uppercase tracking-wider bg-surface-container-high text-on-surface-variant border border-outline-variant">
                <span class="material-symbols-outlined text-sm mr-1">schedule</span>
                {{ app.jobType }}
              </span>
            </div>
          </div>
          
          <div class="flex items-center justify-between mt-auto pt-4 border-t border-outline-variant/50 relative z-10">
            <span class="text-xs uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">history</span>
              Saved {{ getTimeSinceSaved(app.appliedDate) }}
            </span>
            <button 
              (click)="moveToApplications(app.id)"
              class="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2">
              Apply Now <span class="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>

        <div *ngIf="savedApplications.length === 0" 
             class="col-span-full text-center py-12 text-on-surface-variant">
          <span class="material-symbols-outlined text-4xl mb-2">bookmark_border</span>
          <p>No saved jobs yet. Bookmark applications from the Applications page to see them here.</p>
        </div>
      </div>
    </div>
  `
})
export class SavedComponent implements OnInit {
  savedApplications: Application[] = [];
  sortBy = 'newest';

  constructor(
    private applicationService: ApplicationService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSavedApplications();
  }

  loadSavedApplications(): void {
    this.savedApplications = this.applicationService.getSavedApplications();
    this.sortSavedJobs();
  }

  sortSavedJobs(): void {
    switch (this.sortBy) {
      case 'newest':
        this.savedApplications.sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime());
        break;
      case 'oldest':
        this.savedApplications.sort((a, b) => new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime());
        break;
      case 'company':
        this.savedApplications.sort((a, b) => a.company.localeCompare(b.company));
        break;
    }
  }

  unsaveJob(id: string): void {
    this.applicationService.toggleSave(id);
    this.toastService.success('Job removed from saved');
    this.loadSavedApplications();
  }

  moveToApplications(id: string): void {
    this.applicationService.moveToApplications(id);
    this.toastService.success('Job moved to applications');
    this.loadSavedApplications();
  }

  getTimeSinceSaved(date: Date | string): string {
    const now = new Date();
    const savedDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - savedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1d ago';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}mo ago`;
  }
}