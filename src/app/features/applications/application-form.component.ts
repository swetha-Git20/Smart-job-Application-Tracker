import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationService } from '../../core/services/application.service';
import { ToastService } from '../../core/services/toast.service';
import { Application } from '../../shared/models/application.model';

@Component({
  selector: 'app-application-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="p-4 md:p-10 max-w-2xl mx-auto">
      <div class="bg-surface rounded-xl border border-outline-variant shadow-lg flex flex-col max-h-[90vh]">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-outline-variant">
          <h2 class="text-xl font-semibold text-on-surface">{{ isEdit ? 'Edit Application' : 'Add Application' }}</h2>
          <button 
            (click)="cancel()"
            class="p-1 text-on-surface-variant hover:bg-surface-container-highest rounded-full transition-colors">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 overflow-y-auto flex-1">
          <form id="application-form" [formGroup]="applicationForm" (ngSubmit)="saveApplication()" class="space-y-6">
            <!-- Core Details -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1 md:col-span-2">
                <label class="block text-sm font-semibold text-on-surface" for="company">Company Name *</label>
                <input 
                  formControlName="company"
                  class="w-full bg-surface-container-lowest border border-outline-variant text-on-surface placeholder:text-on-surface-variant/50 rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
                  id="company"
                  placeholder="e.g. Acme Corp" 
                  type="text"/>
                <p *ngIf="applicationForm.get('company')?.invalid && applicationForm.get('company')?.touched" 
                   class="text-sm text-error">Company name is required.</p>
              </div>

              <div class="space-y-1 md:col-span-2">
                <label class="block text-sm font-semibold text-on-surface" for="role">Role Title</label>
                <input 
                  formControlName="role"
                  class="w-full bg-surface-container-lowest border border-outline-variant text-on-surface placeholder:text-on-surface-variant/50 rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
                  id="role"
                  placeholder="e.g. Senior Frontend Engineer" 
                  type="text"/>
              </div>

              <div class="space-y-1 md:col-span-2">
                <label class="block text-sm font-semibold text-on-surface" for="jobLink">Job Posting URL</label>
                <div class="relative flex items-center">
                  <span class="material-symbols-outlined absolute left-4 text-on-surface-variant">link</span>
                  <input 
                    formControlName="jobLink"
                    class="w-full bg-surface-container-lowest border border-outline-variant text-on-surface placeholder:text-on-surface-variant/50 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
                    id="jobLink"
                    placeholder="https://..." 
                    type="url"/>
                </div>
                <p *ngIf="applicationForm.get('jobLink')?.invalid && applicationForm.get('jobLink')?.touched" 
                   class="text-sm text-error">Please enter a valid URL.</p>
              </div>
            </div>

            <hr class="border-outline-variant">

            <!-- Logistics & Status -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="block text-sm font-semibold text-on-surface" for="status">Status</label>
                <select 
                  formControlName="status"
                  class="w-full appearance-none bg-surface-container-lowest border border-outline-variant text-on-surface rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
                  id="status">
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div class="space-y-1">
                <label class="block text-sm font-semibold text-on-surface" for="appliedDate">Applied Date</label>
                <input 
                  formControlName="appliedDate"
                  class="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
                  id="appliedDate"
                  type="date"/>
              </div>

              <div class="space-y-1">
                <label class="block text-sm font-semibold text-on-surface" for="location">Location</label>
                <input 
                  formControlName="location"
                  class="w-full bg-surface-container-lowest border border-outline-variant text-on-surface placeholder:text-on-surface-variant/50 rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
                  id="location"
                  placeholder="City, State" 
                  type="text"/>
              </div>

              <div class="space-y-1">
                <label class="block text-sm font-semibold text-on-surface" for="jobType">Work Model</label>
                <select 
                  formControlName="jobType"
                  class="w-full appearance-none bg-surface-container-lowest border border-outline-variant text-on-surface rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
                  id="jobType">
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Onsite">On-site</option>
                </select>
              </div>

              <div class="space-y-1 md:col-span-2">
                <label class="block text-sm font-semibold text-on-surface" for="salaryRange">Salary Expectation</label>
                <div class="relative flex items-center">
                  <span class="absolute left-4 text-on-surface-variant">$</span>
                  <input 
                    formControlName="salaryRange"
                    class="w-full bg-surface-container-lowest border border-outline-variant text-on-surface placeholder:text-on-surface-variant/50 rounded-lg pl-8 pr-4 py-2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
                    id="salaryRange"
                    placeholder="120,000" 
                    type="text"/>
                </div>
              </div>
            </div>

            <!-- Notes -->
            <div class="space-y-1">
              <label class="block text-sm font-semibold text-on-surface" for="notes">Notes</label>
              <textarea 
                formControlName="notes"
                class="w-full bg-surface-container-lowest border border-outline-variant text-on-surface placeholder:text-on-surface-variant/50 rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-y" 
                id="notes"
                placeholder="Referral details, specific requirements, etc." 
                rows="3"></textarea>
            </div>
          </form>
        </div>

        <!-- Modal Footer -->
        <div class="p-6 border-t border-outline-variant bg-surface-container-lowest/50 rounded-b-xl flex justify-end gap-3">
          <button 
            type="button"
            (click)="cancel()"
            class="px-4 py-2 rounded-lg border border-outline-variant text-on-surface font-medium hover:bg-surface-container-high transition-colors">
            Cancel
          </button>
          <button 
            form="application-form"
            type="submit"
            [disabled]="applicationForm.invalid"
            class="px-4 py-2 rounded-lg bg-primary text-on-primary font-medium hover:opacity-90 shadow-sm transition-all flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed">
            <span class="material-symbols-outlined text-[18px]">save</span>
            {{ isEdit ? 'Update' : 'Save' }} Application
          </button>
        </div>
      </div>
    </div>
  `
})
export class ApplicationFormComponent implements OnInit {
  applicationForm: FormGroup;
  isEdit = false;
  applicationId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private applicationService: ApplicationService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.applicationForm = this.fb.group({
      company: ['', Validators.required],
      role: [''],
      jobLink: ['', Validators.pattern('https?://.+')],
      location: [''],
      status: ['Applied'],
      appliedDate: [new Date().toISOString().split('T')[0]],
      jobType: ['Remote'],
      salaryRange: [''],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.applicationId = params['id'];
        this.loadApplication(params['id']);
      }
    });
  }

  loadApplication(id: string): void {
    const application = this.applicationService.getApplicationById(id);
    if (application) {
      this.applicationForm.patchValue({
        company: application.company,
        role: application.role,
        jobLink: application.jobLink,
        location: application.location,
        status: application.status,
        appliedDate: new Date(application.appliedDate).toISOString().split('T')[0],
        jobType: application.jobType,
        salaryRange: application.salaryRange,
        notes: application.notes
      });
    }
  }

  saveApplication(): void {
    if (this.applicationForm.invalid) return;

    const formValue = this.applicationForm.value;
    
    if (this.isEdit && this.applicationId) {
      this.applicationService.updateApplication(this.applicationId, {
        ...formValue,
        appliedDate: new Date(formValue.appliedDate)
      });
      this.toastService.success('Application updated successfully');
      this.router.navigate(['/applications', this.applicationId]);
      return;
    }

    const newApplication = this.applicationService.createApplication({
      ...formValue,
      appliedDate: new Date(formValue.appliedDate)
    });
    this.toastService.success('Application created successfully');
    this.router.navigate(['/applications', newApplication.id]);
  }

  cancel(): void {
    this.router.navigate(['/applications']);
  }
}