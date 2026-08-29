import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApplicationService } from '../../core/services/application.service';
import { Application } from '../../shared/models/application.model';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-4 md:p-10 min-h-screen">
      <header class="mb-8">
        <h2 class="text-3xl font-bold text-on-background">Analytics Overview</h2>
        <p class="text-base text-on-surface-variant mt-1">Track your application performance and pipeline health.</p>
      </header>

      <!-- Stat Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div class="bg-surface rounded-xl border border-outline-variant p-6 shadow-sm flex flex-col justify-between">
          <div class="flex justify-between items-start mb-2">
            <p class="text-xs uppercase tracking-wider text-on-surface-variant">Total Applications</p>
            <div class="flex items-center text-primary bg-primary/10 px-2 py-1 rounded-full">
              <span class="material-symbols-outlined text-sm mr-1">arrow_upward</span>
              <span class="text-xs uppercase tracking-wider">Active</span>
            </div>
          </div>
          <h3 class="text-2xl font-bold text-on-background">{{ stats.total }}</h3>
        </div>

        <div class="bg-surface rounded-xl border border-outline-variant p-6 shadow-sm flex flex-col justify-between">
          <div class="flex justify-between items-start mb-2">
            <p class="text-xs uppercase tracking-wider text-on-surface-variant">Interview Conv %</p>
            <div class="flex items-center text-primary bg-primary/10 px-2 py-1 rounded-full">
              <span class="material-symbols-outlined text-sm mr-1">arrow_upward</span>
              <span class="text-xs uppercase tracking-wider">{{ interviewRate }}%</span>
            </div>
          </div>
          <h3 class="text-2xl font-bold text-on-background">{{ interviewRate }}%</h3>
        </div>

        <div class="bg-surface rounded-xl border border-outline-variant p-6 shadow-sm flex flex-col justify-between">
          <div class="flex justify-between items-start mb-2">
            <p class="text-xs uppercase tracking-wider text-on-surface-variant">Offer Rate %</p>
            <div class="flex items-center text-on-surface-variant bg-surface-variant px-2 py-1 rounded-full">
              <span class="material-symbols-outlined text-sm mr-1">horizontal_rule</span>
              <span class="text-xs uppercase tracking-wider">{{ offerRate }}%</span>
            </div>
          </div>
          <h3 class="text-2xl font-bold text-on-background">{{ offerRate }}%</h3>
        </div>
      </div>

      <!-- Bento Grid Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <!-- Donut Chart: Apps by Status -->
        <div class="bg-surface rounded-xl border border-outline-variant p-6 shadow-sm lg:col-span-1 flex flex-col">
          <h3 class="text-base font-semibold text-on-background mb-4">Pipeline Status</h3>
          <div class="flex-1 flex items-center justify-center relative min-h-[200px]">
            <!-- CSS Donut Chart -->
            <div class="w-40 h-40 rounded-full flex items-center justify-center relative" 
                 [style.background]="'conic-gradient(' + donutGradient + ')'">
              <div class="w-28 h-28 bg-surface rounded-full flex flex-col items-center justify-center shadow-inner z-10 absolute">
                <span class="text-lg font-bold text-on-background">{{ stats.total }}</span>
                <span class="text-xs uppercase tracking-wider text-on-surface-variant">Active</span>
              </div>
            </div>
          </div>
          <div class="mt-4 space-y-2">
            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center">
                <div class="w-3 h-3 rounded-full bg-[#4f46e5] mr-2"></div>
                <span class="text-on-surface-variant">Applied</span>
              </div>
              <span class="font-medium">{{ stats.applied }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center">
                <div class="w-3 h-3 rounded-full bg-[#d97706] mr-2"></div>
                <span class="text-on-surface-variant">Interview</span>
              </div>
              <span class="font-medium">{{ stats.interview }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center">
                <div class="w-3 h-3 rounded-full bg-[#16a34a] mr-2"></div>
                <span class="text-on-surface-variant">Offer</span>
              </div>
              <span class="font-medium">{{ stats.offer }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center">
                <div class="w-3 h-3 rounded-full bg-[#ba1a1a] mr-2"></div>
                <span class="text-on-surface-variant">Rejected</span>
              </div>
              <span class="font-medium">{{ stats.rejected }}</span>
            </div>
          </div>
        </div>

        <!-- Bar Chart: Activity over time -->
        <div class="bg-surface rounded-xl border border-outline-variant p-6 shadow-sm lg:col-span-2 flex flex-col">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-base font-semibold text-on-background">Application Volume</h3>
            <select 
              [(ngModel)]="timeRange"
              (change)="updateBarChart()"
              class="bg-surface text-sm border-none text-on-surface-variant focus:ring-0 cursor-pointer py-1 pl-2 pr-6">
              <option value="6weeks">Last 6 Weeks</option>
              <option value="3months">Last 3 Months</option>
            </select>
          </div>
          <div class="flex-1 flex items-end justify-between space-x-2 pt-8 border-b border-outline-variant/30 pb-2 h-[240px]">
            <div *ngFor="let value of barChartData" class="w-full flex flex-col items-center justify-end h-full group">
              <div class="w-full max-w-[40px] bg-primary/60 rounded-t-sm relative transition-all group-hover:bg-primary/70" 
                   [style.height.%]="getBarHeight(value)">
                <div class="absolute -top-6 left-1/2 -translate-x-1/2 text-xs uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-inverse-on-surface px-2 py-1 rounded">
                  {{ value }}
                </div>
              </div>
              <span class="text-xs uppercase tracking-wider text-on-surface-variant mt-2">W{{ barChartData.indexOf(value) + 1 }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Horizontal Bar: Apps by Job Type -->
      <div class="bg-surface rounded-xl border border-outline-variant p-6 shadow-sm mb-8">
        <h3 class="text-base font-semibold text-on-background mb-4">Job Type Distribution</h3>
        <div class="space-y-4">
          <div>
            <div class="flex justify-between items-center mb-1">
              <span class="text-sm text-on-surface-variant">Remote</span>
              <span class="text-sm font-medium text-on-background">{{ getJobTypePercentage('Remote') }}%</span>
            </div>
            <div class="w-full bg-surface-variant rounded-full h-2">
              <div class="bg-primary h-2 rounded-full" [style.width.%]="getJobTypePercentage('Remote')"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between items-center mb-1">
              <span class="text-sm text-on-surface-variant">Hybrid</span>
              <span class="text-sm font-medium text-on-background">{{ getJobTypePercentage('Hybrid') }}%</span>
            </div>
            <div class="w-full bg-surface-variant rounded-full h-2">
              <div class="bg-primary h-2 rounded-full" [style.width.%]="getJobTypePercentage('Hybrid')"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between items-center mb-1">
              <span class="text-sm text-on-surface-variant">On-site</span>
              <span class="text-sm font-medium text-on-background">{{ getJobTypePercentage('Onsite') }}%</span>
            </div>
            <div class="w-full bg-surface-variant rounded-full h-2">
              <div class="bg-primary h-2 rounded-full" [style.width.%]="getJobTypePercentage('Onsite')"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AnalyticsComponent implements OnInit {
  stats = { total: 0, applied: 0, interview: 0, offer: 0, rejected: 0, saved: 0 };
  interviewRate = 0;
  offerRate = 0;
  timeRange = '6weeks';
  barChartData: number[] = [0, 0, 0, 0, 0, 0];

  get donutGradient(): string {
    const applied = this.stats.applied || 0;
    const interview = this.stats.interview || 0;
    const offer = this.stats.offer || 0;
    const rejected = this.stats.rejected || 0;
    const total = applied + interview + offer + rejected;
    
    if (total === 0) return '#e4e1ee 0% 100%';
    
    const appliedEnd = (applied / total) * 100;
    const interviewEnd = appliedEnd + (interview / total) * 100;
    const offerEnd = interviewEnd + (offer / total) * 100;
    
    return `#4f46e5 0% ${appliedEnd}%, #d97706 ${appliedEnd}% ${interviewEnd}%, #16a34a ${interviewEnd}% ${offerEnd}%, #ba1a1a ${offerEnd}% 100%`;
  }

  constructor(private applicationService: ApplicationService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.stats = this.applicationService.getStats();
    
    // Calculate rates
    if (this.stats.total > 0) {
      this.interviewRate = Math.round((this.stats.interview / this.stats.total) * 100);
      this.offerRate = Math.round((this.stats.offer / this.stats.total) * 100);
    }

    // Update bar chart
    this.updateBarChart();
  }

  updateBarChart(): void {
    const applications = this.applicationService.applications;
    const now = new Date();
    let weeks = 6;
    let data: number[] = [];

    if (this.timeRange === '6weeks') {
      weeks = 6;
      for (let i = weeks - 1; i >= 0; i--) {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - (i * 7));
        weekStart.setHours(0, 0, 0, 0);
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        const count = applications.filter((app: Application) => {
          const appDate = new Date(app.appliedDate);
          return appDate >= weekStart && appDate <= weekEnd;
        }).length;

        data.push(count);
      }
    } else {
      weeks = 12;
      for (let i = weeks - 1; i >= 0; i--) {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - (i * 7));
        weekStart.setHours(0, 0, 0, 0);
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        const count = applications.filter((app: Application) => {
          const appDate = new Date(app.appliedDate);
          return appDate >= weekStart && appDate <= weekEnd;
        }).length;

        data.push(count);
      }
    }

    this.barChartData = data;
  }

  getBarHeight(value: number): number {
    const max = Math.max(...this.barChartData, 1);
    return (value / max) * 100;
  }

  getJobTypePercentage(type: string): number {
    const applications = this.applicationService.applications;
    if (applications.length === 0) return 0;
    
    const count = applications.filter((app: Application) => app.jobType === type).length;
    return Math.round((count / applications.length) * 100);
  }
}