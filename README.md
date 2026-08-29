# Smart Job Application Tracker

A complete Angular portfolio project for tracking job applications, interviews, and career progress. Built with modern Angular standalone components, TypeScript, and localStorage for data persistence.

## Features

### Core Functionality
- **Application Management**: Create, edit, delete, and track job applications with full CRUD operations
- **Interview Scheduling**: Schedule and manage interviews linked to specific applications
- **Status Tracking**: Track application status (Applied, Interview, Offer, Rejected) with timeline history
- **Search & Filtering**: Real-time search by company/role with status and job type filters
- **Sorting**: Sort applications by date, company name, or recency
- **Bookmarking**: Save interesting job opportunities for later review
- **Analytics Dashboard**: Visual charts showing application pipeline health and performance metrics
- **Data Export**: Export all data as JSON for backup
- **Theme Switching**: Dark/light mode with persistent preferences
- **Responsive Design**: Fully responsive for desktop (1440px+) and mobile (375px+)

### Pages
1. **Dashboard** - Overview with stat cards, recent applications, and upcoming interviews
2. **Applications** - Full application list with search, filters, and management
3. **Application Detail** - Detailed view with status timeline, notes, and linked interviews
4. **Application Form** - Add/edit applications with validation
5. **Interview Tracker** - Manage interviews with scheduling and filtering
6. **Saved Jobs** - Bookmark and review saved opportunities
7. **Analytics** - Visual analytics with charts and performance metrics
8. **Settings** - Theme toggle, data export, and reset functionality

## Technology Stack

- **Framework**: Angular 20.3.30 (Standalone Components)
- **Language**: TypeScript
- **Styling**: SCSS/CSS with Material Design patterns
- **Routing**: Angular Router
- **Forms**: Reactive Forms with validation
- **State Management**: RxJS BehaviorSubject (simple, lightweight)
- **Data Persistence**: localStorage
- **Icons**: Material Symbols Outlined
- **Fonts**: Inter (UI) and JetBrains Mono (data)
- **Build Tool**: Angular CLI

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   └── services/
│   │       ├── storage.service.ts      # localStorage wrapper
│   │       ├── application.service.ts # Application CRUD
│   │       ├── interview.service.ts   # Interview CRUD
│   │       ├── theme.service.ts       # Theme management
│   │       └── toast.service.ts       # Notification system
│   ├── features/
│   │   ├── dashboard/
│   │   ├── applications/
│   │   ├── interviews/
│   │   ├── saved/
│   │   ├── analytics/
│   │   └── settings/
│   ├── shared/
│   │   ├── components/
│   │   │   ├── sidebar/
│   │   │   ├── mobile-nav/
│   │   │   ├── toast/
│   │   │   └── confirm-dialog/
│   │   └── models/
│   │       └── application.model.ts
│   ├── app.component.ts
│   ├── app.routes.ts
│   └── app.config.ts
├── index.html
└── styles.scss
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. **Clone or extract the project** to your desired location

2. **Navigate to the project directory**:
   ```bash
   cd "C:\Users\acer\Music\resume project"
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Run the development server**:
   ```bash
   ng serve
   ```

5. **Open your browser** and navigate to:
   ```
   http://localhost:4200
   ```

### Build for Production

```bash
ng build
```

The production build will be created in the `dist/` directory.

## Usage

### First Run
The application automatically seeds with sample data (Google, Stripe, Linear, etc.) on first load to demonstrate functionality.

### Adding Applications
1. Navigate to the Applications page
2. Click "Add Application" or use the mobile FAB
3. Fill in the form with company, role, job link, and other details
4. Click "Save Application"

### Managing Interviews
1. Go to the Interview Tracker page
2. Click "Schedule Interview"
3. Select the linked application and enter interview details
4. Interviews also appear on the linked application's detail page

### Using Analytics
- View the Analytics page for:
  - Application status distribution (donut chart)
  - Application volume over time (bar chart)
  - Job type breakdown (progress bars)
  - Interview and offer conversion rates

### Theme Switching
- Toggle between light and dark mode in Settings
- Theme preference persists across sessions

### Data Management
- **Export**: Download all data as JSON from Settings
- **Reset**: Clear all data and restore seed data from Settings

## Data Models

### Application
```typescript
{
  id: string;
  company: string;
  role: string;
  jobLink: string;
  location: string;
  jobType: 'Remote' | 'Hybrid' | 'Onsite';
  status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
  appliedDate: Date | string;
  salaryRange?: string;
  notes?: string;
  statusHistory: { status: string; date: Date | string; notes?: string }[];
  isSaved: boolean;
}
```

### Interview
```typescript
{
  id: string;
  applicationId: string;
  roundName: string;
  dateTime: Date | string;
  mode: 'Online' | 'Onsite' | 'Phone';
  notes?: string;
}
```

## Design

The application follows the supplied Stitch UI designs with:
- **Primary Color**: Purple/Indigo theme (#3525cd, #4f46e5)
- **Typography**: Inter for UI, JetBrains Mono for data
- **Components**: Material Design-inspired cards, badges, and navigation
- **Responsive**: Desktop sidebar navigation, mobile bottom navigation
- **Dark Mode**: Full theme support with persistent preferences

## Key Features Explained

### localStorage Persistence
All data is stored in the browser's localStorage, making the app work entirely client-side without a backend. Data persists across browser sessions.

### Reactive State Management
Uses RxJS BehaviorSubject for simple, effective state management without the complexity of NgRx or similar libraries.

### Form Validation
- Required fields validation
- URL validation for job links
- Real-time validation feedback
- Error messages displayed inline

### Responsive Design
- Desktop (1440px+): Full sidebar navigation
- Tablet: Adapted layouts with responsive grids
- Mobile (375px+): Bottom navigation, FAB actions, stacked layouts

## Notes

- This is a portfolio/resume project designed for demonstration purposes
- Not intended for production use
- No authentication, real API calls, or external database
- Charts implemented using pure CSS (no external chart libraries)
- Material Icons loaded via Google Fonts CDN

## License

This project is created for educational and portfolio demonstration purposes.