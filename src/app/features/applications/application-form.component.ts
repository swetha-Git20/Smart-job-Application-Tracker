import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApplicationService } from '../../core/services/application.service';
import { ToastService } from '../../core/services/toast.service';
import { Application, ApplicationStatus, JobType } from '../../shared/models/application.model';

@Component({
  selector: 'app-application-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <main class="flex-1 p-4 md:p-10 max-w-4xl mx-auto w-full flex flex-col gap-6">
      <!-- Top Navigation Breadcrumb -->
      <div class="flex items-center gap-2 text-sm text-on-surface-variant dark:text-gray-400">
        <a routerLink="/applications" class="hover:text-primary dark:hover:text-primary-fixed-dim flex items-center gap-1 transition-colors">
          <span class="material-symbols-outlined text-base">arrow_back</span>
          <span>Back to Applications</span>
        </a>
      </div>

      <!-- Main Form Card matching Stitch Design -->
      <div class="bg-surface dark:bg-[#262530] border border-outline-variant dark:border-[#3d3b4a] rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <!-- Form Header -->
        <div class="p-6 border-b border-outline-variant/60 dark:border-[#3d3b4a] bg-surface-container-low/40 dark:bg-[#1f1e28]/60 flex items-center justify-between">
          <div>
            <h2 class="text-xl md:text-2xl font-bold text-on-surface dark:text-[#fcf8ff]">
              {{ isEditMode ? 'Edit Job Application' : 'Add New Job Application' }}
            </h2>
            <p class="text-xs md:text-sm text-on-surface-variant dark:text-gray-400 mt-1">
              {{ isEditMode ? 'Update the details and pipeline status for this role.' : 'Track a new opportunity by providing key position details.' }}
            </p>
          </div>

          <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary dark:text-primary-fixed-dim flex items-center justify-center">
            <span class="material-symbols-outlined text-2xl">
              {{ isEditMode ? 'edit_document' : 'post_add' }}
            </span>
          </div>
        </div>

        <!-- Form Body -->
        <form [formGroup]="appForm" (ngSubmit)="onSubmit()" class="p-6 md:p-8 flex flex-col gap-6">
          <!-- SECTION 1: Basic Information -->
          <div class="flex flex-col gap-4">
            <h3 class="text-xs font-bold uppercase tracking-wider text-primary dark:text-primary-fixed-dim flex items-center gap-1.5 border-b border-outline-variant/40 dark:border-[#3d3b4a] pb-2">
              <span class="material-symbols-outlined text-base">domain</span>
              <span>Role & Company</span>
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Company Name -->
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-on-surface dark:text-gray-200" for="company">
                  Company Name <span class="text-rose-500">*</span>
                </label>
                <div class="relative">
                  <input 
                    id="company"
                    type="text" 
                    formControlName="company"
                    placeholder="e.g. Google, Stripe, Linear" 
                    [ngClass]="{'border-rose-500 ring-1 ring-rose-500': isFieldInvalid('company')}"
                    class="w-full bg-surface-container-lowest dark:bg-[#1f1e28] border border-outline-variant dark:border-[#3d3b4a] text-on-surface dark:text-[#fcf8ff] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"/>
                </div>
                <span *ngIf="isFieldInvalid('company')" class="text-xs text-rose-500">Company name is required.</span>
              </div>

              <!-- Job Role -->
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-on-surface dark:text-gray-200" for="role">
                  Job Role / Title <span class="text-rose-500">*</span>
                </label>
                <div class="relative">
                  <input 
                    id="role"
                    type="text" 
                    formControlName="role"
                    placeholder="e.g. Senior Frontend Engineer" 
                    [ngClass]="{'border-rose-500 ring-1 ring-rose-500': isFieldInvalid('role')}"
                    class="w-full bg-surface-container-lowest dark:bg-[#1f1e28] border border-outline-variant dark:border-[#3d3b4a] text-on-surface dark:text-[#fcf8ff] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"/>
                </div>
                <span *ngIf="isFieldInvalid('role')" class="text-xs text-rose-500">Job role is required.</span>
              </div>

              <!-- Location -->
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-on-surface dark:text-gray-200" for="location">Location</label>
                <input 
                  id="location"
                  type="text" 
                  formControlName="location"
                  placeholder="e.g. San Francisco, CA or Remote" 
                  class="w-full bg-surface-container-lowest dark:bg-[#1f1e28] border border-outline-variant dark:border-[#3d3b4a] text-on-surface dark:text-[#fcf8ff] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"/>
              </div>

              <!-- Job Link URL -->
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-on-surface dark:text-gray-200" for="jobLink">Job Posting URL</label>
                <div class="relative">
                  <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">link</span>
                  <input 
                    id="jobLink"
                    type="url" 
                    formControlName="jobLink"
                    placeholder="https://careers.company.com/job/123" 
                    [ngClass]="{'border-rose-500 ring-1 ring-rose-500': isFieldInvalid('jobLink')}"
                    class="w-full bg-surface-container-lowest dark:bg-[#1f1e28] border border-outline-variant dark:border-[#3d3b4a] text-on-surface dark:text-[#fcf8ff] rounded-xl pl-10 pr-3.5 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"/>
                </div>
                <span *ngIf="isFieldInvalid('jobLink')" class="text-xs text-rose-500">Please enter a valid URL (starting with http:// or https://).</span>
              </div>
            </div>
          </div>

          <!-- SECTION 2: Status & Logistics -->
          <div class="flex flex-col gap-4">
            <h3 class="text-xs font-bold uppercase tracking-wider text-primary dark:text-primary-fixed-dim flex items-center gap-1.5 border-b border-outline-variant/40 dark:border-[#3d3b4a] pb-2">
              <span class="material-symbols-outlined text-base">tune</span>
              <span>Status & Logistics</span>
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <!-- Pipeline Status -->
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-on-surface dark:text-gray-200" for="status">Status</label>
                <div class="relative">
                  <select 
                    id="status"
                    formControlName="status"
                    class="w-full appearance-none bg-surface-container-lowest dark:bg-[#1f1e28] border border-outline-variant dark:border-[#3d3b4a] text-on-surface dark:text-[#fcf8ff] rounded-xl px-3.5 py-2.5 pr-8 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer">
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <span class="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-base">arrow_drop_down</span>
                </div>
              </div>

              <!-- Work Model / Job Type -->
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-on-surface dark:text-gray-200" for="jobType">Work Model</label>
                <div class="relative">
                  <select 
                    id="jobType"
                    formControlName="jobType"
                    class="w-full appearance-none bg-surface-container-lowest dark:bg-[#1f1e28] border border-outline-variant dark:border-[#3d3b4a] text-on-surface dark:text-[#fcf8ff] rounded-xl px-3.5 py-2.5 pr-8 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer">
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Onsite">On-site</option>
                  </select>
                  <span class="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-base">arrow_drop_down</span>
                </div>
              </div>

              <!-- Applied Date -->
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-on-surface dark:text-gray-200" for="appliedDate">Date Applied</label>
                <input 
                  id="appliedDate"
                  type="date" 
                  formControlName="appliedDate"
                  class="w-full bg-surface-container-lowest dark:bg-[#1f1e28] border border-outline-variant dark:border-[#3d3b4a] text-on-surface dark:text-[#fcf8ff] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"/>
              </div>

              <!-- Salary Range -->
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-on-surface dark:text-gray-200" for="salaryRange">Salary Range</label>
                <input 
                  id="salaryRange"
                  type="text" 
                  formControlName="salaryRange"
                  placeholder="e.g. $160k - $190k" 
                  class="w-full bg-surface-container-lowest dark:bg-[#1f1e28] border border-outline-variant dark:border-[#3d3b4a] text-on-surface dark:text-[#fcf8ff] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"/>
              </div>
            </div>
          </div>

          <!-- SECTION 3: Notes & Referrals -->
          <div class="flex flex-col gap-4">
            <h3 class="text-xs font-bold uppercase tracking-wider text-primary dark:text-primary-fixed-dim flex items-center gap-1.5 border-b border-outline-variant/40 dark:border-[#3d3b4a] pb-2">
              <span class="material-symbols-outlined text-base">description</span>
              <span>Notes & Preparation</span>
            </h3>

            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold text-on-surface dark:text-gray-200" for="notes">Application Notes</label>
              <textarea 
                id="notes"
                formControlName="notes"
                rows="4" 
                placeholder="Include referral contacts, key requirements mentioned in description, interview prep notes, etc."
                class="w-full bg-surface-container-lowest dark:bg-[#1f1e28] border border-outline-variant dark:border-[#3d3b4a] text-on-surface dark:text-[#fcf8ff] rounded-xl p-3.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-y"></textarea>
            </div>
          </div>

          <!-- Form Actions Footer -->
          <div class="pt-4 border-t border-outline-variant/60 dark:border-[#3d3b4a] flex items-center justify-end gap-3">
            <button 
              type="button" 
              (click)="onCancel()"
              class="px-5 py-2.5 border border-outline-variant dark:border-[#3d3b4a] text-on-surface dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-surface-container-high dark:hover:bg-[#383745] transition-colors cursor-pointer">
              Cancel
            </button>
            <button 
              type="submit"
              [disabled]="appForm.invalid"
              class="px-6 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95">
              <span class="material-symbols-outlined text-base">save</span>
              <span>{{ isEditMode ? 'Update Application' : 'Save Application' }}</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  `
})
export class ApplicationFormComponent implements OnInit {
  appForm!: FormGroup;
  isEditMode: boolean = false;
  applicationId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private applicationService: ApplicationService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.applicationId = id;
        this.loadApplicationData(id);
      }
    });
  }

  private initForm(): void {
    const today = new Date().toISOString().split('T')[0];
    
    this.appForm = this.fb.group({
      company: ['', [Validators.required, Validators.minLength(2)]],
      role: ['', [Validators.required, Validators.minLength(2)]],
      jobLink: ['', [Validators.pattern('https?://.+')]],
      location: [''],
      jobType: ['Remote', Validators.required],
      status: ['Applied', Validators.required],
      appliedDate: [today, Validators.required],
      salaryRange: [''],
      notes: ['']
    });
  }

  private loadApplicationData(id: string): void {
    const app = this.applicationService.getApplicationById(id);
    if (app) {
      let formattedDate = '';
      if (app.appliedDate) {
        try {
          formattedDate = new Date(app.appliedDate).toISOString().split('T')[0];
        } catch {
          formattedDate = '';
        }
      }

      this.appForm.patchValue({
        company: app.company,
        role: app.role,
        jobLink: app.jobLink || '',
        location: app.location || '',
        jobType: app.jobType || 'Remote',
        status: app.status || 'Applied',
        appliedDate: formattedDate,
        salaryRange: app.salaryRange || '',
        notes: app.notes || ''
      });
    } else {
      this.toastService.error('Application not found');
      this.router.navigate(['/applications']);
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.appForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit(): void {
    if (this.appForm.invalid) {
      this.appForm.markAllAsTouched();
      return;
    }

    const formValues = this.appForm.value;

    if (this.isEditMode && this.applicationId) {
      this.applicationService.updateApplication(this.applicationId, formValues);
      this.toastService.success(`Updated application for ${formValues.company}`);
      this.router.navigate(['/applications', this.applicationId]);
    } else {
      const created = this.applicationService.createApplication(formValues);
      this.toastService.success(`Added application for ${formValues.company}`);
      this.router.navigate(['/applications', created.id]);
    }
  }

  onCancel(): void {
    if (this.isEditMode && this.applicationId) {
      this.router.navigate(['/applications', this.applicationId]);
    } else {
      this.router.navigate(['/applications']);
    }
  }
}