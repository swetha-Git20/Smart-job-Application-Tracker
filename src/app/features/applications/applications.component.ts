import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApplicationService } from '../../core/services/application.service';
import { ToastService } from '../../core/services/toast.service';
import { DialogService } from '../../core/services/dialog.service';
import { Application, ApplicationStatus, JobType } from '../../shared/models/application.model';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="flex-1 p-4 md:p-10 max-w-7xl mx-auto w-full flex flex-col gap-6">
      <!-- Page Header & Actions -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl md:text-3xl font-bold tracking-tight text-on-surface dark:text-[#fcf8ff]">Applications</h2>
          <p class="text-sm md:text-base text-on-surface-variant dark:text-gray-400 mt-1">
            Manage and track your job application pipeline.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <!-- View Toggle -->
          <div class="hidden sm:flex items-center bg-surface-container-low dark:bg-[#262530] border border-outline-variant dark:border-[#3d3b4a] rounded-xl p-1">
            <button 
              (click)="viewMode = 'table'"
              [ngClass]="viewMode === 'table' ? 'bg-surface dark:bg-[#383745] text-primary dark:text-primary-fixed-dim shadow-xs' : 'text-on-surface-variant dark:text-gray-400'"
              class="p-1.5 rounded-lg transition-all"
              title="Table View">
              <span class="material-symbols-outlined text-lg">view_list</span>
            </button>
            <button 
              (click)="viewMode = 'grid'"
              [ngClass]="viewMode === 'grid' ? 'bg-surface dark:bg-[#383745] text-primary dark:text-primary-fixed-dim shadow-xs' : 'text-on-surface-variant dark:text-gray-400'"
              class="p-1.5 rounded-lg transition-all"
              title="Card Grid View">
              <span class="material-symbols-outlined text-lg">grid_view</span>
            </button>
          </div>

          <button 
            (click)="navigateToAdd()"
            class="px-4 py-2 bg-primary text-on-primary rounded-xl text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-2 shadow-sm cursor-pointer active:scale-95">
            <span class="material-symbols-outlined text-lg">add</span>
            <span>Add Application</span>
          </button>
        </div>
      </div>

      <!-- Filters & Search Toolbar -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-surface dark:bg-[#262530] p-4 rounded-2xl border border-outline-variant dark:border-[#3d3b4a] shadow-sm">
        <!-- Live Search -->
        <div class="relative flex-1 min-w-[240px]">
          <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-gray-400 text-lg">search</span>
          <input 
            [(ngModel)]="searchQuery"
            (input)="onFilterChange()"
            class="w-full pl-10 pr-4 py-2 bg-surface-container-lowest dark:bg-[#1f1e28] border border-outline-variant dark:border-[#3d3b4a] rounded-xl text-sm text-on-surface dark:text-[#fcf8ff] placeholder:text-on-surface-variant/60 dark:placeholder:text-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
            placeholder="Search companies, roles, locations..." 
            type="text"/>
        </div>

        <!-- Filter Dropdowns -->
        <div class="flex flex-wrap items-center gap-2.5">
          <!-- Status Filter -->
          <div class="relative">
            <select 
              [(ngModel)]="statusFilter"
              (change)="onFilterChange()"
              class="appearance-none bg-surface-container-lowest dark:bg-[#1f1e28] border border-outline-variant dark:border-[#3d3b4a] rounded-xl pl-3.5 pr-8 py-2 text-sm text-on-surface dark:text-[#fcf8ff] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer transition-all">
              <option value="all">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
            <span class="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-base">arrow_drop_down</span>
          </div>

          <!-- Job Type Filter -->
          <div class="relative">
            <select 
              [(ngModel)]="jobTypeFilter"
              (change)="onFilterChange()"
              class="appearance-none bg-surface-container-lowest dark:bg-[#1f1e28] border border-outline-variant dark:border-[#3d3b4a] rounded-xl pl-3.5 pr-8 py-2 text-sm text-on-surface dark:text-[#fcf8ff] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer transition-all">
              <option value="all">All Work Models</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Onsite">On-site</option>
            </select>
            <span class="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-base">arrow_drop_down</span>
          </div>

          <!-- Sort Order -->
          <div class="relative">
            <select 
              [(ngModel)]="sortBy"
              (change)="onFilterChange()"
              class="appearance-none bg-surface-container-lowest dark:bg-[#1f1e28] border border-outline-variant dark:border-[#3d3b4a] rounded-xl pl-3.5 pr-8 py-2 text-sm text-on-surface dark:text-[#fcf8ff] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer transition-all">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="company_az">Company A-Z</option>
              <option value="company_za">Company Z-A</option>
            </select>
            <span class="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-base">arrow_drop_down</span>
          </div>

          <!-- Reset Filters Button if Active -->
          <button 
            *ngIf="searchQuery || statusFilter !== 'all' || jobTypeFilter !== 'all' || sortBy !== 'newest'"
            (click)="resetFilters()"
            class="p-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors flex items-center gap-1"
            title="Reset Filters">
            <span class="material-symbols-outlined text-base">filter_alt_off</span>
            <span class="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      <!-- Results Count Bar -->
      <div class="flex items-center justify-between text-xs text-on-surface-variant dark:text-gray-400 px-1">
        <span>Showing <strong class="text-on-surface dark:text-[#fcf8ff]">{{ filteredApplications.length }}</strong> applications</span>
        <span *ngIf="activeFiltersCount > 0" class="text-primary dark:text-primary-fixed-dim font-medium">
          {{ activeFiltersCount }} filter(s) active
        </span>
      </div>

      <!-- TABLE VIEW (Desktop default) -->
      <div *ngIf="viewMode === 'table'" class="hidden md:block bg-surface dark:bg-[#262530] border border-outline-variant dark:border-[#3d3b4a] rounded-2xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-surface-container-low dark:bg-[#1f1e28] border-b border-outline-variant dark:border-[#3d3b4a]">
                <th class="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-gray-400">Company</th>
                <th class="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-gray-400">Role</th>
                <th class="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-gray-400">Status</th>
                <th class="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-gray-400">Date Applied</th>
                <th class="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-gray-400">Work Model</th>
                <th class="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/60 dark:divide-[#3d3b4a]">
              <tr 
                *ngFor="let app of filteredApplications" 
                class="hover:bg-surface-container-low/70 dark:hover:bg-[#32313f] transition-colors group cursor-pointer"
                (click)="navigateToDetail(app.id)">
                
                <!-- Company -->
                <td class="px-5 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-secondary-container text-on-secondary-container font-bold text-sm flex items-center justify-center shrink-0">
                      {{ app.company.charAt(0).toUpperCase() }}
                    </div>
                    <div>
                      <span class="font-semibold text-sm text-on-surface dark:text-[#fcf8ff] group-hover:text-primary dark:group-hover:text-primary-fixed-dim transition-colors">
                        {{ app.company }}
                      </span>
                      <p class="text-xs text-on-surface-variant dark:text-gray-400">{{ app.location || 'Remote' }}</p>
                    </div>
                  </div>
                </td>

                <!-- Role -->
                <td class="px-5 py-4">
                  <span class="text-sm font-medium text-on-surface dark:text-[#fcf8ff]">{{ app.role }}</span>
                  <p *ngIf="app.salaryRange" class="text-xs text-on-surface-variant dark:text-gray-400 font-mono">{{ app.salaryRange }}</p>
                </td>

                <!-- Status -->
                <td class="px-5 py-4" (click)="$event.stopPropagation()">
                  <div class="relative inline-block">
                    <select 
                      [ngModel]="app.status"
                      (ngModelChange)="onQuickStatusChange(app, $event)"
                      [ngClass]="getStatusBadgeClass(app.status)"
                      class="appearance-none font-semibold text-xs uppercase tracking-wider px-3 py-1 rounded-full cursor-pointer pr-6 focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="Applied">Applied</option>
                      <option value="Interview">Interview</option>
                      <option value="Offer">Offer</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                    <span class="material-symbols-outlined absolute right-1.5 top-1/2 -translate-y-1/2 text-xs pointer-events-none opacity-70">arrow_drop_down</span>
                  </div>
                </td>

                <!-- Date Applied -->
                <td class="px-5 py-4 text-sm text-on-surface-variant dark:text-gray-400">
                  {{ formatDate(app.appliedDate) }}
                </td>

                <!-- Job Type -->
                <td class="px-5 py-4">
                  <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container-low dark:bg-[#1f1e28] border border-outline-variant/60 dark:border-[#3d3b4a] text-xs font-medium text-on-surface-variant dark:text-gray-300">
                    <span class="material-symbols-outlined text-xs">{{ app.jobType === 'Remote' ? 'home_work' : (app.jobType === 'Hybrid' ? 'domain' : 'apartment') }}</span>
                    {{ app.jobType }}
                  </span>
                </td>

                <!-- Actions -->
                <td class="px-5 py-4 text-right" (click)="$event.stopPropagation()">
                  <div class="flex items-center justify-end gap-1">
                    <!-- Bookmark button -->
                    <button 
                      (click)="toggleSave(app)"
                      class="p-1.5 rounded-lg hover:bg-surface-container-high dark:hover:bg-[#383745] text-on-surface-variant dark:text-gray-400 transition-colors"
                      [title]="app.isSaved ? 'Remove from Saved' : 'Save / Bookmark'">
                      <span class="material-symbols-outlined text-lg" [ngClass]="app.isSaved ? 'text-amber-500 filled' : ''">
                        {{ app.isSaved ? 'bookmark' : 'bookmark_border' }}
                      </span>
                    </button>

                    <!-- Edit button -->
                    <button 
                      (click)="navigateToEdit(app.id)"
                      class="p-1.5 rounded-lg hover:bg-surface-container-high dark:hover:bg-[#383745] text-on-surface-variant dark:text-gray-400 transition-colors"
                      title="Edit Application">
                      <span class="material-symbols-outlined text-lg">edit</span>
                    </button>

                    <!-- Delete button -->
                    <button 
                      (click)="confirmDelete(app)"
                      class="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 transition-colors"
                      title="Delete Application">
                      <span class="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- CARD / GRID VIEW (Mobile & Alternative Desktop) -->
      <div [ngClass]="viewMode === 'table' ? 'md:hidden' : ''" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          *ngFor="let app of filteredApplications"
          class="bg-surface dark:bg-[#262530] border border-outline-variant dark:border-[#3d3b4a] rounded-2xl p-5 shadow-sm hover:border-primary/50 transition-all flex flex-col justify-between gap-4 cursor-pointer group"
          (click)="navigateToDetail(app.id)">
          
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-container font-bold text-sm flex items-center justify-center shrink-0">
                {{ app.company.charAt(0).toUpperCase() }}
              </div>
              <div>
                <h4 class="font-bold text-sm sm:text-base text-on-surface dark:text-[#fcf8ff] group-hover:text-primary dark:group-hover:text-primary-fixed-dim transition-colors">
                  {{ app.company }}
                </h4>
                <p class="text-xs text-on-surface-variant dark:text-gray-400">{{ app.role }}</p>
              </div>
            </div>

            <button 
              (click)="$event.stopPropagation(); toggleSave(app)"
              class="p-1 rounded-lg text-on-surface-variant dark:text-gray-400 hover:bg-surface-container-high transition-colors">
              <span class="material-symbols-outlined text-xl" [ngClass]="app.isSaved ? 'text-amber-500 filled' : ''">
                {{ app.isSaved ? 'bookmark' : 'bookmark_border' }}
              </span>
            </button>
          </div>

          <div class="flex flex-wrap items-center gap-2 text-xs">
            <span [ngClass]="getStatusBadgeClass(app.status)" class="px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider">
              {{ app.status }}
            </span>
            <span class="px-2.5 py-0.5 rounded-lg bg-surface-container-low dark:bg-[#1f1e28] border border-outline-variant/60 dark:border-[#3d3b4a] text-on-surface-variant dark:text-gray-300">
              {{ app.jobType }}
            </span>
            <span *ngIf="app.location" class="text-on-surface-variant dark:text-gray-400">
              &bull; {{ app.location }}
            </span>
          </div>

          <div class="pt-3 border-t border-outline-variant/50 dark:border-[#3d3b4a] flex items-center justify-between text-xs text-on-surface-variant dark:text-gray-400">
            <span>Applied {{ formatDate(app.appliedDate) }}</span>
            <div class="flex items-center gap-1" (click)="$event.stopPropagation()">
              <button 
                (click)="navigateToEdit(app.id)"
                class="p-1 rounded-lg hover:bg-surface-container-high text-on-surface-variant dark:text-gray-300">
                <span class="material-symbols-outlined text-base">edit</span>
              </button>
              <button 
                (click)="confirmDelete(app)"
                class="p-1 rounded-lg hover:bg-rose-50 text-rose-600">
                <span class="material-symbols-outlined text-base">delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div 
        *ngIf="filteredApplications.length === 0" 
        class="bg-surface dark:bg-[#262530] border border-outline-variant dark:border-[#3d3b4a] rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3">
        <div class="w-14 h-14 rounded-full bg-surface-container dark:bg-[#383745] flex items-center justify-center text-primary dark:text-primary-fixed-dim">
          <span class="material-symbols-outlined text-3xl">search_off</span>
        </div>
        <h3 class="text-lg font-bold text-on-surface dark:text-[#fcf8ff]">No applications found</h3>
        <p class="text-sm text-on-surface-variant dark:text-gray-400 max-w-md">
          {{ allApplications.length === 0 ? 'You have not added any job applications yet.' : 'No applications match your current search and filter settings.' }}
        </p>
        <div class="flex items-center gap-2 mt-2">
          <button 
            *ngIf="activeFiltersCount > 0"
            (click)="resetFilters()"
            class="px-4 py-2 border border-outline-variant dark:border-[#3d3b4a] rounded-xl text-sm font-medium hover:bg-surface-container-high transition-colors">
            Clear Filters
          </button>
          <button 
            (click)="navigateToAdd()"
            class="px-4 py-2 bg-primary text-on-primary rounded-xl text-sm font-semibold hover:opacity-90 transition-all">
            + Add New Application
          </button>
        </div>
      </div>
    </main>
  `
})
export class ApplicationsComponent implements OnInit {
  allApplications: Application[] = [];
  filteredApplications: Application[] = [];

  searchQuery: string = '';
  statusFilter: string = 'all';
  jobTypeFilter: string = 'all';
  sortBy: string = 'newest';
  viewMode: 'table' | 'grid' = 'table';

  constructor(
    private applicationService: ApplicationService,
    private toastService: ToastService,
    private dialogService: DialogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.applicationService.applications$.subscribe(() => {
      this.loadApplications();
    });
  }

  get activeFiltersCount(): number {
    let count = 0;
    if (this.searchQuery) count++;
    if (this.statusFilter !== 'all') count++;
    if (this.jobTypeFilter !== 'all') count++;
    if (this.sortBy !== 'newest') count++;
    return count;
  }

  loadApplications(): void {
    this.allApplications = this.applicationService.getActiveApplications();
    this.filterApplications();
  }

  onFilterChange(): void {
    this.filterApplications();
  }

  filterApplications(): void {
    this.filteredApplications = this.applicationService.filterApplications(
      this.allApplications,
      this.searchQuery,
      this.statusFilter,
      this.jobTypeFilter,
      this.sortBy
    );
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.statusFilter = 'all';
    this.jobTypeFilter = 'all';
    this.sortBy = 'newest';
    this.filterApplications();
  }

  onQuickStatusChange(app: Application, newStatus: ApplicationStatus): void {
    if (app.status !== newStatus) {
      this.applicationService.updateStatus(app.id, newStatus);
      this.toastService.success(`Updated status of ${app.company} to ${newStatus}`);
    }
  }

  toggleSave(app: Application): void {
    const isNowSaved = this.applicationService.toggleSave(app.id);
    if (isNowSaved) {
      this.toastService.success(`Saved ${app.company} to bookmarks`);
    } else {
      this.toastService.info(`Removed ${app.company} from bookmarks`);
    }
  }

  confirmDelete(app: Application): void {
    this.dialogService.confirm({
      title: 'Delete Application',
      message: `Are you sure you want to delete your application for ${app.role} at ${app.company}? This will also delete any linked interviews.`,
      confirmText: 'Delete',
      isDestructive: true,
      onConfirm: () => {
        this.applicationService.deleteApplication(app.id);
        this.toastService.success(`Deleted application for ${app.company}`);
      }
    });
  }

  formatDate(date: string | Date): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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

  navigateToEdit(id: string): void {
    this.router.navigate(['/applications', id, 'edit']);
  }

  navigateToAdd(): void {
    this.router.navigate(['/applications/new']);
  }
}