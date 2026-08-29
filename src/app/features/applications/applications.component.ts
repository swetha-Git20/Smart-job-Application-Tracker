import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApplicationService } from '../../core/services/application.service';
import { ToastService } from '../../core/services/toast.service';
import { Application } from '../../shared/models/application.model';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-4 md:p-10 max-w-[1200px] mx-auto flex flex-col gap-8">
      <!-- Page Header & Filters -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 class="text-3xl font-bold text-on-surface">Applications</h2>
          <p class="text-base text-on-surface-variant mt-2">Manage and track your job application pipeline.</p>
        </div>
        <div class="flex flex-wrap items-center gap-4 mt-4 lg:mt-0">
          <div class="relative w-full sm:w-auto">
            <span class="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant">search</span>
            <input 
              [(ngModel)]="searchQuery"
              (input)="filterApplications()"
              class="w-full sm:w-64 pl-10 pr-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm text-on-surface placeholder:text-on-surface-variant transition-all" 
              placeholder="Search companies or roles..." 
              type="text"/>
          </div>
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <select 
              [(ngModel)]="statusFilter"
              (change)="filterApplications()"
              class="flex-1 sm:flex-none appearance-none bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 pr-8 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer transition-all">
              <option value="all">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
            <select 
              [(ngModel)]="sortBy"
              (change)="filterApplications()"
              class="flex-1 sm:flex-none appearance-none bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 pr-8 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer transition-all">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="company_az">Company A-Z</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Applications Table -->
      <div class="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-surface-container-low border-b border-outline-variant">
                <th class="px-4 py-3 text-xs uppercase tracking-wider text-on-surface-variant font-semibold">Company</th>
                <th class="px-4 py-3 text-xs uppercase tracking-wider text-on-surface-variant font-semibold">Role</th>
                <th class="px-4 py-3 text-xs uppercase tracking-wider text-on-surface-variant font-semibold">Status</th>
                <th class="px-4 py-3 text-xs uppercase tracking-wider text-on-surface-variant font-semibold hidden sm:table-cell">Date Applied</th>
                <th class="px-4 py-3 text-xs uppercase tracking-wider text-on-surface-variant font-semibold hidden md:table-cell">Job Type</th>
                <th class="px-4 py-3 text-xs uppercase tracking-wider text-on-surface-variant font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant">
              <tr *ngFor="let app of filteredApplications" 
                  class="hover:bg-surface-container-low transition-colors duration-150 group">
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-sm">
                      {{ app.company.charAt(0).toUpperCase() }}
                    </div>
                    <span class="font-medium text-on-surface">{{ app.company }}</span>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <span class="text-sm text-on-surface">{{ app.role }}</span>
                </td>
                <td class="px-4 py-3">
                  <span [ngClass]="getStatusClass(app.status)" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs uppercase tracking-wider">
                    {{ app.status }}
                  </span>
                </td>
                <td class="px-4 py-3 hidden sm:table-cell text-on-surface-variant text-sm">
                  {{ formatDate(app.appliedDate) }}
                </td>
                <td class="px-4 py-3 hidden md:table-cell">
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-outline-variant text-xs uppercase tracking-wider text-on-surface-variant">
                    <span class="material-symbols-outlined text-sm">home_work</span>
                    {{ app.jobType }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right">
                  <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button 
                      (click)="toggleSave(app)"
                      [title]="app.isSaved ? 'Unsave' : 'Save'"
                      class="p-1 text-on-surface-variant hover:text-primary transition-colors rounded hover:bg-surface-container-highest">
                      <span class="material-symbols-outlined text-[20px]" [ngClass]="{ 'filled': app.isSaved }">bookmark</span>
                    </button>
                    <button 
                      (click)="editApplication(app.id)"
                      class="p-1 text-on-surface-variant hover:text-primary transition-colors rounded hover:bg-surface-container-highest"
                      title="Edit">
                      <span class="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    <button 
                      (click)="deleteApplication(app.id)"
                      class="p-1 text-on-surface-variant hover:text-error transition-colors rounded hover:bg-error-container"
                      title="Delete">
                      <span class="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
              
              <tr *ngIf="filteredApplications.length === 0">
                <td colspan="6" class="px-4 py-8 text-center text-on-surface-variant">
                  <span class="material-symbols-outlined text-4xl mb-2">search_off</span>
                  <p>No applications found matching your criteria.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class ApplicationsComponent implements OnInit {
  applications: Application[] = [];
  filteredApplications: Application[] = [];
  searchQuery = '';
  statusFilter = 'all';
  sortBy = 'newest';

  constructor(
    private applicationService: ApplicationService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.applicationService.applications$.subscribe(apps => {
      this.applications = apps;
      this.filterApplications();
    });
  }

  filterApplications(): void {
    let filtered = [...this.applications];

    // Search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(app => 
        app.company.toLowerCase().includes(query) ||
        app.role.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === this.statusFilter);
    }

    // Sort
    switch (this.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime());
        break;
      case 'company_az':
        filtered.sort((a, b) => a.company.localeCompare(b.company));
        break;
    }

    this.filteredApplications = filtered;
  }

  toggleSave(app: Application): void {
    this.applicationService.toggleSave(app.id);
    this.toastService.success(app.isSaved ? 'Application removed from saved' : 'Application saved');
  }

  editApplication(id: string): void {
    this.router.navigate(['/applications', id, 'edit']);
  }

  deleteApplication(id: string): void {
    if (confirm('Are you sure you want to delete this application? This will also delete all associated interviews.')) {
      this.applicationService.deleteApplication(id);
      this.toastService.success('Application deleted successfully');
    }
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
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}