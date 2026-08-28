import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationService } from '../../core/services/application.service';
import { Application, ApplicationStats } from '../../shared/models/application.model';

interface StatusPercentage {
  status: string;
  count: number;
  percentage: number;
  color: string;
  badgeClass: string;
}

interface MonthData {
  label: string;
  count: number;
  percentage: number;
}

interface JobTypeData {
  type: string;
  count: number;
  percentage: number;
  icon: string;
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="flex-1 p-4 md:p-10 max-w-7xl mx-auto w-full flex flex-col gap-8">
      <!-- Page Header -->
      <header>
        <h2 class="text-2xl md:text-3xl font-bold tracking-tight text-on-surface dark:text-[#fcf8ff]">Analytics Overview</h2>
        <p class="text-sm md:text-base text-on-surface-variant dark:text-gray-400 mt-1">
          Live statistics, funnel conversion rates, and pipeline trends calculated from your job data.
        </p>
      </header>

      <!-- Stat Cards Grid -->
      <section class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <!-- Total Applications -->
        <div class="bg-surface dark:bg-[#262530] rounded-2xl border border-outline-variant dark:border-[#3d3b4a] p-6 shadow-sm flex flex-col justify-between gap-3">
          <div class="flex justify-between items-start">
            <p class="text-xs uppercase tracking-wider font-semibold text-on-surface-variant dark:text-gray-400">Total Applications</p>
            <div class="flex items-center gap-1 text-primary dark:text-primary-fixed-dim bg-primary/10 dark:bg-primary/20 px-2.5 py-1 rounded-full text-xs font-semibold">
              <span class="material-symbols-outlined text-xs">trending_up</span>
              <span>Pipeline</span>
            </div>
          </div>
          <h3 class="text-3xl md:text-4xl font-extrabold text-on-surface dark:text-[#fcf8ff]">{{ stats.total }}</h3>
          <p class="text-xs text-on-surface-variant dark:text-gray-400">
            {{ activeApps.length }} active &bull; {{ stats.saved }} saved
          </p>
        </div>

        <!-- Interview Conversion Rate -->
        <div class="bg-surface dark:bg-[#262530] rounded-2xl border border-outline-variant dark:border-[#3d3b4a] p-6 shadow-sm flex flex-col justify-between gap-3">
          <div class="flex justify-between items-start">
            <p class="text-xs uppercase tracking-wider font-semibold text-on-surface-variant dark:text-gray-400">Interview Conv. %</p>
            <div class="flex items-center gap-1 text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full text-xs font-semibold">
              <span class="material-symbols-outlined text-xs">arrow_upward</span>
              <span>{{ stats.interviewRate }}%</span>
            </div>
          </div>
          <h3 class="text-3xl md:text-4xl font-extrabold text-on-surface dark:text-[#fcf8ff]">{{ stats.interviewRate }}%</h3>
          <p class="text-xs text-on-surface-variant dark:text-gray-400">
            {{ stats.interview + stats.offer }} of {{ stats.total }} advanced to rounds
          </p>
        </div>

        <!-- Offer Rate -->
        <div class="bg-surface dark:bg-[#262530] rounded-2xl border border-outline-variant dark:border-[#3d3b4a] p-6 shadow-sm flex flex-col justify-between gap-3">
          <div class="flex justify-between items-start">
            <p class="text-xs uppercase tracking-wider font-semibold text-on-surface-variant dark:text-gray-400">Offer Rate %</p>
            <div class="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full text-xs font-semibold">
              <span class="material-symbols-outlined text-xs">celebration</span>
              <span>{{ stats.offerRate }}%</span>
            </div>
          </div>
          <h3 class="text-3xl md:text-4xl font-extrabold text-on-surface dark:text-[#fcf8ff]">{{ stats.offerRate }}%</h3>
          <p class="text-xs text-on-surface-variant dark:text-gray-400">
            {{ stats.offer }} successful offers extended
          </p>
        </div>
      </section>

      <!-- Bento Grid Charts -->
      <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Donut Chart Card: Status Breakdown (1 col) -->
        <div class="bg-surface dark:bg-[#262530] rounded-2xl border border-outline-variant dark:border-[#3d3b4a] p-6 shadow-sm flex flex-col justify-between gap-6">
          <div>
            <h3 class="text-base font-bold text-on-surface dark:text-[#fcf8ff]">Pipeline Funnel</h3>
            <p class="text-xs text-on-surface-variant dark:text-gray-400 mt-0.5">Distribution of applications by current status</p>
          </div>

          <!-- Dynamic Conic Gradient Donut -->
          <div class="flex items-center justify-center py-4">
            <div 
              class="w-48 h-48 rounded-full flex items-center justify-center relative shadow-sm"
              [style.background]="getDonutGradient()">
              <div class="w-32 h-32 bg-surface dark:bg-[#262530] rounded-full flex flex-col items-center justify-center shadow-inner z-10">
                <span class="text-2xl font-extrabold text-on-surface dark:text-[#fcf8ff] leading-none">{{ stats.total }}</span>
                <span class="text-[11px] uppercase tracking-wider font-semibold text-on-surface-variant dark:text-gray-400 mt-1">Applications</span>
              </div>
            </div>
          </div>

          <!-- Status Legend -->
          <div class="space-y-2.5 pt-2 border-t border-outline-variant/40 dark:border-[#3d3b4a]">
            <div *ngFor="let item of statusPercentages" class="flex items-center justify-between text-xs">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full" [style.backgroundColor]="item.color"></div>
                <span class="font-medium text-on-surface dark:text-gray-200">{{ item.status }}</span>
              </div>
              <div class="flex items-center gap-2 font-mono">
                <span class="text-on-surface-variant dark:text-gray-400">({{ item.count }})</span>
                <span class="font-bold text-on-surface dark:text-[#fcf8ff] w-10 text-right">{{ item.percentage }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Monthly Applications Bar Chart (2 cols) -->
        <div class="lg:col-span-2 bg-surface dark:bg-[#262530] rounded-2xl border border-outline-variant dark:border-[#3d3b4a] p-6 shadow-sm flex flex-col justify-between gap-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 class="text-base font-bold text-on-surface dark:text-[#fcf8ff]">Application Volume Over Time</h3>
              <p class="text-xs text-on-surface-variant dark:text-gray-400 mt-0.5">Timeline of job applications submitted by month</p>
            </div>
            <span class="text-xs font-semibold px-3 py-1 bg-surface-container-high dark:bg-[#383745] text-on-surface dark:text-[#fcf8ff] rounded-xl self-start">
              Last 6 Months
            </span>
          </div>

          <!-- Bar Chart Visualizer -->
          <div class="flex items-end justify-between gap-2 sm:gap-4 h-56 pt-8 pb-2 px-2">
            <div *ngFor="let m of monthlyData" class="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <!-- Value tooltip badge on hover -->
              <span class="text-xs font-bold font-mono text-primary dark:text-primary-fixed-dim opacity-0 group-hover:opacity-100 transition-opacity">
                {{ m.count }}
              </span>
              
              <!-- The Bar -->
              <div class="w-full max-w-[48px] bg-surface-container-low dark:bg-[#1f1e28] rounded-xl overflow-hidden flex flex-col justify-end h-full">
                <div 
                  class="w-full bg-primary dark:bg-primary-fixed-dim rounded-t-xl transition-all duration-500 group-hover:opacity-90"
                  [style.height.%]="m.percentage">
                </div>
              </div>

              <!-- Month Label -->
              <span class="text-xs font-semibold text-on-surface-variant dark:text-gray-400 whitespace-nowrap">
                {{ m.label }}
              </span>
            </div>
          </div>

          <!-- Summary info footer -->
          <div class="pt-3 border-t border-outline-variant/40 dark:border-[#3d3b4a] flex flex-wrap items-center justify-between text-xs text-on-surface-variant dark:text-gray-400">
            <span>Peak Application Velocity: <strong>{{ maxMonthlyCount }} apps/month</strong></span>
            <span>Average: <strong>{{ avgMonthlyCount }} apps/month</strong></span>
          </div>
        </div>
      </section>

      <!-- Second Row: Work Model Breakdown & Pipeline Health -->
      <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Work Model / Job Type Breakdown -->
        <div class="bg-surface dark:bg-[#262530] rounded-2xl border border-outline-variant dark:border-[#3d3b4a] p-6 shadow-sm flex flex-col gap-5">
          <div>
            <h3 class="text-base font-bold text-on-surface dark:text-[#fcf8ff]">Work Model Breakdown</h3>
            <p class="text-xs text-on-surface-variant dark:text-gray-400 mt-0.5">Preferences across Remote, Hybrid, and On-site opportunities</p>
          </div>

          <div class="space-y-4">
            <div *ngFor="let jt of jobTypeData" class="flex flex-col gap-1.5">
              <div class="flex justify-between items-center text-xs">
                <span class="font-semibold text-on-surface dark:text-[#fcf8ff] flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-sm text-primary">{{ jt.icon }}</span>
                  {{ jt.type }}
                </span>
                <span class="font-mono text-on-surface-variant dark:text-gray-400">{{ jt.count }} roles ({{ jt.percentage }}%)</span>
              </div>
              <div class="w-full h-2.5 rounded-full bg-surface-container-high dark:bg-[#1f1e28] overflow-hidden">
                <div 
                  class="h-full rounded-full bg-primary dark:bg-primary-container transition-all duration-500"
                  [style.width.%]="jt.percentage">
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Funnel Health & Insights -->
        <div class="bg-surface dark:bg-[#262530] rounded-2xl border border-outline-variant dark:border-[#3d3b4a] p-6 shadow-sm flex flex-col justify-between gap-4">
          <div>
            <h3 class="text-base font-bold text-on-surface dark:text-[#fcf8ff]">Pipeline Health & Insights</h3>
            <p class="text-xs text-on-surface-variant dark:text-gray-400 mt-0.5">Key ratios to optimize your application strategy</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 rounded-xl bg-surface-container-low dark:bg-[#1f1e28] border border-outline-variant/40 dark:border-[#3d3b4a]">
              <span class="text-xs text-on-surface-variant dark:text-gray-400">Response Rate</span>
              <p class="text-xl font-bold text-on-surface dark:text-[#fcf8ff] mt-1">{{ responseRate }}%</p>
              <p class="text-[11px] text-on-surface-variant/80 dark:text-gray-400 mt-0.5">Heard back (interview/reject/offer)</p>
            </div>

            <div class="p-4 rounded-xl bg-surface-container-low dark:bg-[#1f1e28] border border-outline-variant/40 dark:border-[#3d3b4a]">
              <span class="text-xs text-on-surface-variant dark:text-gray-400">Interview-to-Offer</span>
              <p class="text-xl font-bold text-on-surface dark:text-[#fcf8ff] mt-1">{{ interviewToOfferRate }}%</p>
              <p class="text-[11px] text-on-surface-variant/80 dark:text-gray-400 mt-0.5">Offers per interview attended</p>
            </div>
          </div>

          <p class="text-xs text-on-surface-variant dark:text-gray-400 bg-surface-container-high/40 dark:bg-[#1f1e28] p-3 rounded-xl border border-outline-variant/40 dark:border-[#3d3b4a] leading-relaxed">
            <strong class="text-on-surface dark:text-[#fcf8ff]">Pro Tip:</strong> An interview conversion rate above 15% indicates strong resume alignment with position requirements. Continue tracking interviews to keep momentum high!
          </p>
        </div>
      </section>
    </main>
  `
})
export class AnalyticsComponent implements OnInit {
  stats: ApplicationStats = {
    total: 0,
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
    saved: 0,
    interviewRate: 0,
    offerRate: 0
  };

  activeApps: Application[] = [];
  statusPercentages: StatusPercentage[] = [];
  monthlyData: MonthData[] = [];
  jobTypeData: JobTypeData[] = [];

  maxMonthlyCount: number = 0;
  avgMonthlyCount: number = 0;
  responseRate: number = 0;
  interviewToOfferRate: number = 0;

  constructor(private applicationService: ApplicationService) {}

  ngOnInit(): void {
    this.applicationService.applications$.subscribe(() => {
      this.calculateAnalytics();
    });
  }

  private calculateAnalytics(): void {
    this.stats = this.applicationService.getStats();
    this.activeApps = this.applicationService.getActiveApplications();

    const total = this.activeApps.length;

    // Status breakdown percentages
    const appliedCount = this.activeApps.filter(a => a.status === 'Applied').length;
    const interviewCount = this.activeApps.filter(a => a.status === 'Interview').length;
    const offerCount = this.activeApps.filter(a => a.status === 'Offer').length;
    const rejectedCount = this.activeApps.filter(a => a.status === 'Rejected').length;

    this.statusPercentages = [
      {
        status: 'Applied',
        count: appliedCount,
        percentage: total > 0 ? Math.round((appliedCount / total) * 100) : 0,
        color: '#4f46e5',
        badgeClass: 'text-indigo-600'
      },
      {
        status: 'Interview',
        count: interviewCount,
        percentage: total > 0 ? Math.round((interviewCount / total) * 100) : 0,
        color: '#d97706',
        badgeClass: 'text-amber-600'
      },
      {
        status: 'Offer',
        count: offerCount,
        percentage: total > 0 ? Math.round((offerCount / total) * 100) : 0,
        color: '#16a34a',
        badgeClass: 'text-emerald-600'
      },
      {
        status: 'Rejected',
        count: rejectedCount,
        percentage: total > 0 ? Math.round((rejectedCount / total) * 100) : 0,
        color: '#ba1a1a',
        badgeClass: 'text-rose-600'
      }
    ];

    // Work model data
    const remoteCount = this.activeApps.filter(a => a.jobType === 'Remote').length;
    const hybridCount = this.activeApps.filter(a => a.jobType === 'Hybrid').length;
    const onsiteCount = this.activeApps.filter(a => a.jobType === 'Onsite').length;

    this.jobTypeData = [
      {
        type: 'Remote',
        count: remoteCount,
        percentage: total > 0 ? Math.round((remoteCount / total) * 100) : 0,
        icon: 'home_work'
      },
      {
        type: 'Hybrid',
        count: hybridCount,
        percentage: total > 0 ? Math.round((hybridCount / total) * 100) : 0,
        icon: 'domain'
      },
      {
        type: 'On-site',
        count: onsiteCount,
        percentage: total > 0 ? Math.round((onsiteCount / total) * 100) : 0,
        icon: 'apartment'
      }
    ];

    // Monthly volume over last 6 months
    this.calculateMonthlyTimeline();

    // Ratios
    const respondedCount = interviewCount + offerCount + rejectedCount;
    this.responseRate = total > 0 ? Math.round((respondedCount / total) * 100) : 0;
    const interviewAndOffer = interviewCount + offerCount;
    this.interviewToOfferRate = interviewAndOffer > 0 ? Math.round((offerCount / interviewAndOffer) * 100) : 0;
  }

  private calculateMonthlyTimeline(): void {
    const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
    const counts: { [key: string]: number } = {};
    months.forEach(m => (counts[m] = 0));

    this.activeApps.forEach(app => {
      if (app.appliedDate) {
        const monthName = new Date(app.appliedDate).toLocaleDateString('en-US', { month: 'short' });
        if (counts[monthName] !== undefined) {
          counts[monthName]++;
        } else {
          // If in October or recent
          counts['Oct'] = (counts['Oct'] || 0) + 1;
        }
      }
    });

    const values = Object.values(counts);
    const maxVal = Math.max(...values, 1);
    this.maxMonthlyCount = maxVal;
    this.avgMonthlyCount = Math.round((this.activeApps.length / months.length) * 10) / 10;

    this.monthlyData = months.map(m => {
      const c = counts[m] || (m === 'Oct' ? this.activeApps.length : 0);
      return {
        label: m,
        count: c,
        percentage: Math.max(12, Math.round((c / maxVal) * 100))
      };
    });
  }

  getDonutGradient(): string {
    const p1 = this.statusPercentages[0].percentage;
    const p2 = p1 + this.statusPercentages[1].percentage;
    const p3 = p2 + this.statusPercentages[2].percentage;

    return `conic-gradient(
      #4f46e5 0% ${p1}%, 
      #d97706 ${p1}% ${p2}%, 
      #16a34a ${p2}% ${p3}%, 
      #ba1a1a ${p3}% 100%
    )`;
  }
}