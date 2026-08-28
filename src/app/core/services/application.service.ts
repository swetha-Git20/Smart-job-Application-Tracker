import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StorageService } from './storage.service';
import { Application, ApplicationStats, ApplicationStatus, JobType, StatusHistory } from '../../shared/models/application.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  constructor(private storageService: StorageService) {}

  private generateId(): string {
    return 'app-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 7);
  }

  get applications$(): Observable<Application[]> {
    return this.storageService.applications$;
  }

  get applications(): Application[] {
    return this.storageService.applications;
  }

  getActiveApplications(): Application[] {
    return this.applications.filter(app => !app.isSaved);
  }

  getSavedApplications(): Application[] {
    return this.applications.filter(app => app.isSaved);
  }

  getApplicationById(id: string): Application | undefined {
    return this.applications.find(app => app.id === id);
  }

  createApplication(data: Partial<Application>): Application {
    const nowIso = new Date().toISOString();
    const initialStatus: ApplicationStatus = data.status || 'Applied';
    
    const newApplication: Application = {
      id: this.generateId(),
      company: data.company?.trim() || 'Untitled Company',
      role: data.role?.trim() || 'Untitled Role',
      jobLink: data.jobLink?.trim() || '',
      location: data.location?.trim() || 'Remote',
      jobType: data.jobType || 'Remote',
      status: initialStatus,
      appliedDate: data.appliedDate || nowIso,
      salaryRange: data.salaryRange?.trim() || '',
      notes: data.notes?.trim() || '',
      statusHistory: [
        {
          status: initialStatus,
          date: data.appliedDate || nowIso,
          notes: 'Application created'
        }
      ],
      isSaved: !!data.isSaved
    };

    this.storageService.addApplication(newApplication);
    return newApplication;
  }

  updateApplication(id: string, updates: Partial<Application>): Application | undefined {
    const existing = this.getApplicationById(id);
    if (!existing) return undefined;

    const updatedHistory: StatusHistory[] = [...existing.statusHistory];

    // If status changed, append new timeline entry with current timestamp
    if (updates.status && updates.status !== existing.status) {
      updatedHistory.push({
        status: updates.status,
        date: new Date().toISOString(),
        notes: `Status changed to ${updates.status}`
      });
    }

    const updatedApplication: Application = {
      ...existing,
      ...updates,
      id: existing.id, // Immutable ID
      statusHistory: updatedHistory
    };

    this.storageService.updateApplication(id, updatedApplication);
    return updatedApplication;
  }

  deleteApplication(id: string): void {
    this.storageService.deleteApplication(id);
  }

  toggleSave(id: string): boolean {
    const app = this.getApplicationById(id);
    if (app) {
      const newSavedState = !app.isSaved;
      this.updateApplication(id, { isSaved: newSavedState });
      return newSavedState;
    }
    return false;
  }

  moveToApplications(id: string): void {
    const app = this.getApplicationById(id);
    if (app) {
      this.updateApplication(id, { isSaved: false });
    }
  }

  updateNotes(id: string, notes: string): void {
    this.updateApplication(id, { notes });
  }

  updateStatus(id: string, status: ApplicationStatus): void {
    this.updateApplication(id, { status });
  }

  getStats(): ApplicationStats {
    const apps = this.applications;
    const active = apps.filter(a => !a.isSaved);
    const total = active.length;
    const applied = active.filter(a => a.status === 'Applied').length;
    const interview = active.filter(a => a.status === 'Interview').length;
    const offer = active.filter(a => a.status === 'Offer').length;
    const rejected = active.filter(a => a.status === 'Rejected').length;
    const saved = apps.filter(a => a.isSaved).length;

    const interviewRate = total > 0 ? Math.round(((interview + offer) / total) * 100 * 10) / 10 : 0;
    const offerRate = total > 0 ? Math.round((offer / total) * 100 * 10) / 10 : 0;

    return {
      total,
      applied,
      interview,
      offer,
      rejected,
      saved,
      interviewRate,
      offerRate
    };
  }

  filterApplications(
    list: Application[],
    query: string = '',
    status: string = 'all',
    jobType: string = 'all',
    sortBy: string = 'newest'
  ): Application[] {
    let result = [...list];

    // Search query across company, role, location, notes
    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter(app => 
        app.company.toLowerCase().includes(q) ||
        app.role.toLowerCase().includes(q) ||
        (app.location && app.location.toLowerCase().includes(q))
      );
    }

    // Status filter
    if (status && status !== 'all') {
      result = result.filter(app => app.status.toLowerCase() === status.toLowerCase());
    }

    // Job Type filter
    if (jobType && jobType !== 'all') {
      result = result.filter(app => app.jobType.toLowerCase() === jobType.toLowerCase());
    }

    // Sorting
    result.sort((a, b) => {
      const dateA = new Date(a.appliedDate).getTime();
      const dateB = new Date(b.appliedDate).getTime();

      switch (sortBy) {
        case 'oldest':
          return dateA - dateB;
        case 'company_az':
          return a.company.localeCompare(b.company);
        case 'company_za':
          return b.company.localeCompare(a.company);
        case 'newest':
        default:
          return dateB - dateA;
      }
    });

    return result;
  }
}