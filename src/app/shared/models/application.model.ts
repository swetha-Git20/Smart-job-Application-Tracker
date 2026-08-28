export type JobType = 'Remote' | 'Onsite' | 'Hybrid';
export type ApplicationStatus = 'Applied' | 'Interview' | 'Offer' | 'Rejected';
export type InterviewMode = 'Online' | 'Onsite' | 'Phone';

export interface StatusHistory {
  status: ApplicationStatus;
  date: string | Date;
  notes?: string;
}

export interface Application {
  id: string;
  company: string;
  role: string;
  jobLink?: string;
  location?: string;
  jobType: JobType;
  status: ApplicationStatus;
  appliedDate: string | Date;
  salaryRange?: string;
  notes?: string;
  statusHistory: StatusHistory[];
  isSaved: boolean;
}

export interface Interview {
  id: string;
  applicationId: string;
  roundName: string;
  dateTime: string | Date;
  mode: InterviewMode;
  notes?: string;
  meetingLink?: string;
}

export interface ApplicationStats {
  total: number;
  applied: number;
  interview: number;
  offer: number;
  rejected: number;
  saved: number;
  interviewRate: number;
  offerRate: number;
}