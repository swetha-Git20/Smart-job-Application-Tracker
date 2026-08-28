import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Application, Interview } from '../../shared/models/application.model';

const STORAGE_KEYS = {
  APPLICATIONS: 'careerstream_applications',
  INTERVIEWS: 'careerstream_interviews',
  THEME: 'careerstream_theme',
  COMPACT_VIEW: 'careerstream_compact_view'
};

const SEED_APPLICATIONS: Application[] = [
  {
    id: 'app-1',
    company: 'Google',
    role: 'Frontend Engineer',
    jobLink: 'https://careers.google.com/jobs/results/123456',
    location: 'Mountain View, CA',
    jobType: 'Hybrid',
    status: 'Applied',
    appliedDate: '2023-10-24T10:00:00.000Z',
    salaryRange: '$180k - $220k',
    notes: '- Emphasized experience with Angular and TypeScript performance optimization.\n- Reached out to engineering hiring manager on LinkedIn.\n- Need to review frontend system design architectures.',
    statusHistory: [
      { status: 'Applied', date: '2023-10-24T10:00:00.000Z', notes: 'Submitted via Google careers portal' }
    ],
    isSaved: false
  },
  {
    id: 'app-2',
    company: 'Stripe',
    role: 'Senior Product Designer',
    jobLink: 'https://stripe.com/jobs/designer-platform',
    location: 'San Francisco, CA',
    jobType: 'Remote',
    status: 'Interview',
    appliedDate: '2023-10-18T14:30:00.000Z',
    salaryRange: '$190k - $230k',
    notes: '- Completed recruiter screen with flying colors.\n- Technical Round 2 scheduled for system architecture and design systems.',
    statusHistory: [
      { status: 'Applied', date: '2023-10-18T14:30:00.000Z', notes: 'Applied online' },
      { status: 'Interview', date: '2023-10-22T09:00:00.000Z', notes: 'Recruiter screen passed' }
    ],
    isSaved: false
  },
  {
    id: 'app-3',
    company: 'Linear',
    role: 'Fullstack Engineer',
    jobLink: 'https://linear.app/careers/fullstack',
    location: 'Remote',
    jobType: 'Remote',
    status: 'Offer',
    appliedDate: '2023-10-05T11:00:00.000Z',
    salaryRange: '$165k - $195k',
    notes: '- Formal offer extended! Base $175k + equity package.\n- Decision deadline in 2 weeks.',
    statusHistory: [
      { status: 'Applied', date: '2023-10-05T11:00:00.000Z' },
      { status: 'Interview', date: '2023-10-12T15:00:00.000Z' },
      { status: 'Offer', date: '2023-10-20T16:00:00.000Z', notes: 'Received official offer letter' }
    ],
    isSaved: false
  },
  {
    id: 'app-4',
    company: 'Figma',
    role: 'UI/UX Engineer',
    jobLink: 'https://figma.com/careers/ui-eng',
    location: 'San Francisco, CA',
    jobType: 'Hybrid',
    status: 'Rejected',
    appliedDate: '2023-10-02T16:00:00.000Z',
    salaryRange: '$170k - $210k',
    notes: 'Position filled by internal candidate. Recruiter suggested reconnecting in Q1.',
    statusHistory: [
      { status: 'Applied', date: '2023-10-02T16:00:00.000Z' },
      { status: 'Rejected', date: '2023-10-15T10:00:00.000Z' }
    ],
    isSaved: false
  },
  {
    id: 'app-5',
    company: 'Vercel',
    role: 'Developer Advocate',
    jobLink: 'https://vercel.com/careers/dev-advocate',
    location: 'New York, NY',
    jobType: 'Remote',
    status: 'Interview',
    appliedDate: '2023-10-21T09:15:00.000Z',
    salaryRange: '$150k - $185k',
    notes: 'Demo presentation and panel interview scheduled.',
    statusHistory: [
      { status: 'Applied', date: '2023-10-21T09:15:00.000Z' },
      { status: 'Interview', date: '2023-10-25T13:00:00.000Z' }
    ],
    isSaved: false
  },
  {
    id: 'app-6',
    company: 'Airbnb',
    role: 'Frontend Platform Engineer',
    jobLink: 'https://careers.airbnb.com/positions/frontend-platform',
    location: 'San Francisco, CA',
    jobType: 'Remote',
    status: 'Applied',
    appliedDate: '2023-10-25T12:00:00.000Z',
    salaryRange: '$180k - $225k',
    notes: 'Need to tailor resume to emphasize micro-frontends and Webpack to Vite migration experience.',
    statusHistory: [
      { status: 'Applied', date: '2023-10-25T12:00:00.000Z' }
    ],
    isSaved: true
  },
  {
    id: 'app-7',
    company: 'GitHub',
    role: 'Staff Systems Engineer',
    jobLink: 'https://github.com/about/careers',
    location: 'Seattle, WA',
    jobType: 'Hybrid',
    status: 'Applied',
    appliedDate: '2023-10-26T15:00:00.000Z',
    salaryRange: '$210k - $250k',
    notes: 'Interesting developer tooling role. Waiting for portfolio updates before submitting.',
    statusHistory: [
      { status: 'Applied', date: '2023-10-26T15:00:00.000Z' }
    ],
    isSaved: true
  }
];

const SEED_INTERVIEWS: Interview[] = [
  {
    id: 'int-1',
    applicationId: 'app-2',
    roundName: 'Technical Round 2 (System Architecture)',
    dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    mode: 'Online',
    notes: 'Focus will be on React/Angular performance optimization and state management architecture. Review recent project documentation.',
    meetingLink: 'https://meet.google.com/abc-defg-hij'
  },
  {
    id: 'int-2',
    applicationId: 'app-5',
    roundName: 'Demo Project Presentation & Panel',
    dateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    mode: 'Online',
    notes: 'Prepare 15-minute presentation on frontend architecture and CI/CD developer workflow.',
    meetingLink: 'https://zoom.us/j/9876543210'
  },
  {
    id: 'int-3',
    applicationId: 'app-1',
    roundName: 'Recruiter Screening Call',
    dateTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    mode: 'Phone',
    notes: 'Discussed salary expectations ($190k base), hybrid schedule, and next technical round scheduling.'
  }
];

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private applicationsSubject = new BehaviorSubject<Application[]>([]);
  private interviewsSubject = new BehaviorSubject<Interview[]>([]);
  private themeSubject = new BehaviorSubject<string>('light');
  private compactViewSubject = new BehaviorSubject<boolean>(false);

  constructor() {
    this.initStorage();
  }

  private initStorage(): void {
    try {
      const storedApps = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      if (storedApps) {
        this.applicationsSubject.next(JSON.parse(storedApps));
      } else {
        // Seed initial applications
        this.setApplications(SEED_APPLICATIONS);
      }

      const storedInterviews = localStorage.getItem(STORAGE_KEYS.INTERVIEWS);
      if (storedInterviews) {
        this.interviewsSubject.next(JSON.parse(storedInterviews));
      } else {
        // Seed initial interviews
        this.setInterviews(SEED_INTERVIEWS);
      }

      const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
      this.themeSubject.next(storedTheme);

      const storedCompact = localStorage.getItem(STORAGE_KEYS.COMPACT_VIEW);
      if (storedCompact !== null) {
        this.compactViewSubject.next(JSON.parse(storedCompact));
      }
    } catch (e) {
      console.error('Error initializing storage:', e);
      this.applicationsSubject.next(SEED_APPLICATIONS);
      this.interviewsSubject.next(SEED_INTERVIEWS);
    }
  }

  // Applications
  get applications$(): Observable<Application[]> {
    return this.applicationsSubject.asObservable();
  }

  get applications(): Application[] {
    return this.applicationsSubject.value;
  }

  setApplications(apps: Application[]): void {
    this.applicationsSubject.next(apps);
    this.saveToStorage(STORAGE_KEYS.APPLICATIONS, apps);
  }

  addApplication(app: Application): void {
    const updated = [app, ...this.applications];
    this.setApplications(updated);
  }

  updateApplication(id: string, updatedApp: Application): void {
    const current = this.applications;
    const index = current.findIndex(app => app.id === id);
    if (index !== -1) {
      const updated = [...current];
      updated[index] = updatedApp;
      this.setApplications(updated);
    }
  }

  deleteApplication(id: string): void {
    const updated = this.applications.filter(app => app.id !== id);
    this.setApplications(updated);
    this.deleteInterviewsByApplicationId(id);
  }

  // Interviews
  get interviews$(): Observable<Interview[]> {
    return this.interviewsSubject.asObservable();
  }

  get interviews(): Interview[] {
    return this.interviewsSubject.value;
  }

  setInterviews(interviews: Interview[]): void {
    this.interviewsSubject.next(interviews);
    this.saveToStorage(STORAGE_KEYS.INTERVIEWS, interviews);
  }

  addInterview(interview: Interview): void {
    const updated = [interview, ...this.interviews];
    this.setInterviews(updated);
  }

  updateInterview(id: string, updatedInterview: Interview): void {
    const current = this.interviews;
    const index = current.findIndex(int => int.id === id);
    if (index !== -1) {
      const updated = [...current];
      updated[index] = updatedInterview;
      this.setInterviews(updated);
    }
  }

  deleteInterview(id: string): void {
    const updated = this.interviews.filter(int => int.id !== id);
    this.setInterviews(updated);
  }

  deleteInterviewsByApplicationId(applicationId: string): void {
    const updated = this.interviews.filter(int => int.applicationId !== applicationId);
    this.setInterviews(updated);
  }

  // Theme
  get theme$(): Observable<string> {
    return this.themeSubject.asObservable();
  }

  get theme(): string {
    return this.themeSubject.value;
  }

  setTheme(theme: string): void {
    this.themeSubject.next(theme);
    this.saveToStorage(STORAGE_KEYS.THEME, theme);
  }

  // Compact View
  get compactView$(): Observable<boolean> {
    return this.compactViewSubject.asObservable();
  }

  get compactView(): boolean {
    return this.compactViewSubject.value;
  }

  setCompactView(compact: boolean): void {
    this.compactViewSubject.next(compact);
    this.saveToStorage(STORAGE_KEYS.COMPACT_VIEW, compact);
  }

  private saveToStorage(key: string, data: any): void {
    try {
      localStorage.setItem(key, typeof data === 'string' ? data : JSON.stringify(data));
    } catch (e) {
      console.error('Error saving to storage:', e);
    }
  }

  resetAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
    localStorage.removeItem(STORAGE_KEYS.INTERVIEWS);
    localStorage.removeItem(STORAGE_KEYS.THEME);
    localStorage.removeItem(STORAGE_KEYS.COMPACT_VIEW);
    
    this.setApplications(SEED_APPLICATIONS);
    this.setInterviews(SEED_INTERVIEWS);
    this.setTheme('light');
    this.setCompactView(false);
  }

  exportData(): string {
    const data = {
      appName: 'CareerStream Smart Job Application Tracker',
      exportDate: new Date().toISOString(),
      applications: this.applications,
      interviews: this.interviews,
      theme: this.theme,
      version: '1.0.0'
    };
    return JSON.stringify(data, null, 2);
  }
}