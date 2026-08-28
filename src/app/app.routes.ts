import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ApplicationsComponent } from './features/applications/applications.component';
import { ApplicationFormComponent } from './features/applications/application-form.component';
import { ApplicationDetailComponent } from './features/applications/application-detail.component';
import { InterviewsComponent } from './features/interviews/interviews.component';
import { SavedComponent } from './features/saved/saved.component';
import { AnalyticsComponent } from './features/analytics/analytics.component';
import { SettingsComponent } from './features/settings/settings.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'applications', component: ApplicationsComponent },
  { path: 'applications/new', component: ApplicationFormComponent },
  { path: 'applications/:id', component: ApplicationDetailComponent },
  { path: 'applications/:id/edit', component: ApplicationFormComponent },
  { path: 'interviews', component: InterviewsComponent },
  { path: 'saved', component: SavedComponent },
  { path: 'analytics', component: AnalyticsComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '**', redirectTo: '/dashboard' }
];