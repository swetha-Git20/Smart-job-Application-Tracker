import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { ApplicationService } from './application.service';
import { Application, Interview } from '../../shared/models/application.model';

@Injectable({
  providedIn: 'root'
})
export class InterviewService {
  constructor(
    private storageService: StorageService,
    private applicationService: ApplicationService
  ) {}

  private generateId(): string {
    return 'int-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 7);
  }

  get interviews$(): Observable<Interview[]> {
    return this.storageService.interviews$;
  }

  get interviews(): Interview[] {
    return this.storageService.interviews;
  }

  getInterviewById(id: string): Interview | undefined {
    return this.interviews.find(i => i.id === id);
  }

  getInterviewsByApplicationId(applicationId: string): Interview[] {
    return this.interviews.filter(i => i.applicationId === applicationId);
  }

  getUpcomingInterviews(): Interview[] {
    const now = new Date().getTime();
    return this.interviews
      .filter(i => new Date(i.dateTime).getTime() >= now - 1000 * 60 * 60 * 2) // Within last 2 hours or future
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  }

  getPastInterviews(): Interview[] {
    const now = new Date().getTime();
    return this.interviews
      .filter(i => new Date(i.dateTime).getTime() < now - 1000 * 60 * 60 * 2)
      .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
  }

  createInterview(data: Partial<Interview>): Interview {
    const newInterview: Interview = {
      id: this.generateId(),
      applicationId: data.applicationId || '',
      roundName: data.roundName?.trim() || 'General Round',
      dateTime: data.dateTime || new Date().toISOString(),
      mode: data.mode || 'Online',
      notes: data.notes?.trim() || '',
      meetingLink: data.meetingLink?.trim() || ''
    };

    this.storageService.addInterview(newInterview);

    // If parent application is still in "Applied" status, automatically upgrade to "Interview"
    if (newInterview.applicationId) {
      const app = this.applicationService.getApplicationById(newInterview.applicationId);
      if (app && app.status === 'Applied') {
        this.applicationService.updateStatus(app.id, 'Interview');
      }
    }

    return newInterview;
  }

  updateInterview(id: string, updates: Partial<Interview>): Interview | undefined {
    const existing = this.getInterviewById(id);
    if (!existing) return undefined;

    const updatedInterview: Interview = {
      ...existing,
      ...updates,
      id: existing.id
    };

    this.storageService.updateInterview(id, updatedInterview);
    return updatedInterview;
  }

  deleteInterview(id: string): void {
    this.storageService.deleteInterview(id);
  }

  getApplicationName(applicationId: string): string {
    const app = this.applicationService.getApplicationById(applicationId);
    return app ? `${app.company} — ${app.role}` : 'Unknown Application';
  }

  getApplication(applicationId: string): Application | undefined {
    return this.applicationService.getApplicationById(applicationId);
  }

  filterInterviews(list: Interview[], query: string = '', tab: 'upcoming' | 'past' | 'all' = 'upcoming'): Interview[] {
    const now = new Date().getTime();
    let result = [...list];

    if (tab === 'upcoming') {
      result = result.filter(i => new Date(i.dateTime).getTime() >= now - 1000 * 60 * 60 * 2);
      result.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    } else if (tab === 'past') {
      result = result.filter(i => new Date(i.dateTime).getTime() < now - 1000 * 60 * 60 * 2);
      result.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
    }

    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter(i => {
        const app = this.applicationService.getApplicationById(i.applicationId);
        const companyMatch = app?.company.toLowerCase().includes(q) || false;
        const roleMatch = app?.role.toLowerCase().includes(q) || false;
        const roundMatch = i.roundName.toLowerCase().includes(q);
        const notesMatch = i.notes ? i.notes.toLowerCase().includes(q) : false;
        return companyMatch || roleMatch || roundMatch || notesMatch;
      });
    }

    return result;
  }
}