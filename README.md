# CareerStream — Smart Job Application Tracker

A modern, responsive, full-featured **Job Application Tracker** built with **Angular (Standalone Components) + TypeScript + HTML/CSS & Tailwind CSS**, faithfully matching the Stitch UI SaaS design system.

---

## 🌟 Overview & Features

CareerStream helps job seekers organize, track, and analyze their entire job search journey in one clean, streamlined interface with instant reactive updates and zero external backend requirements.

### 📌 Core Features

1. **📊 Interactive Dashboard (`/dashboard`)**
   - Live KPI Stat Cards: Total Applications, Scheduled Interviews, Active Offers, and Rejections.
   - Recent Applications list with real-time status badges and direct navigation to detailed job views.
   - Upcoming Interviews widget with date callouts, interview modes, and meeting links.
   - Quick one-click "Export Report" action.

2. **💼 Comprehensive Application Pipeline (`/applications`)**
   - Full CRUD support (Create, Read, Update, Delete) with automatic status timeline tracking.
   - Instant live search across Company Name, Role, Location, and Notes.
   - Multi-parameter filtering by Status (`Applied`, `Interview`, `Offer`, `Rejected`) and Work Model (`Remote`, `Hybrid`, `Onsite`).
   - Multiple sorting options: Newest First, Oldest First, Company A-Z, Company Z-A.
   - Seamless toggle between **Table View** and **Card Grid View**.
   - Inline status quick-changers and bookmarking toggles.

3. **📝 Application Add & Edit Forms (`/applications/new` & `/applications/:id/edit`)**
   - Reactive Forms (`FormGroup`) with inline validation for required fields, URL format checking, and numeric salary formatting.
   - Clean sectional layout for Role details, Logistics, and Preparation Notes.

4. **🔍 In-Depth Application Detail & Status Timeline (`/applications/:id`)**
   - Detailed position overview: Work Model, Location, Applied Date, Salary Range, and direct link to the original job posting.
   - Interactive **Status History Timeline** showing the chronological progression of stages with precise timestamps.
   - Formatted notes section with inline editing and saving.
   - Linked interviews module with a "Schedule Interview" modal button.

5. **📅 Interview Tracker (`/interviews`)**
   - Bento grid cards for each round with Date, Time, Format (Online / Onsite / Phone), Preparation Notes, and Meeting links.
   - Tabbed filtering for **Upcoming** vs. **Past** interviews.
   - Full interview scheduling and editing modal dialogs linked directly to target applications.

6. **⭐ Saved Jobs & Opportunities (`/saved`)**
   - Bookmarked jobs board for positions under research.
   - **"Move to Active Applications"** one-click conversion that transitions a saved job into the active pipeline with toast notification.
   - Quick unsave and delete options.

7. **📈 Live Pipeline Analytics (`/analytics`)**
   - Dynamically calculated metric cards: Total Applications, Interview Conversion Rate %, and Offer Rate %.
   - **Status Funnel Donut Chart**: Dynamic visual breakdown of applications by stage.
   - **Monthly Activity Bar Chart**: Timeline chart tracking applications submitted per month.
   - Work Model distribution (Remote vs. Hybrid vs. Onsite) and conversion health ratios.

8. **⚙️ Preferences & Data Management (`/settings`)**
   - **Dark / Light Mode Toggle**: Smooth theme switching persisted across reloads via `localStorage`.
   - **Compact View Mode**: Adjusts UI density for maximum information throughput.
   - **JSON Data Backup & Export**: Downloads a complete `.json` file of all saved applications and interviews.
   - **Danger Zone / Reset All Data**: Restores clean starter sample data with a confirmation modal.

9. **📱 Fully Mobile Responsive**
   - Desktop persistent sidebar (`w-[280px]`) with logo, active link indicators, and user avatar.
   - Mobile top header with dark mode toggle and quick add action.
   - Fixed mobile bottom navigation bar (`h-16 pb-safe`) with 5 primary routes and floating action button (FAB).

---

## 🛠️ Tech Stack & Architecture

- **Framework**: Angular (Latest stable, 100% Standalone Components)
- **Language**: TypeScript throughout with strict typing
- **Routing**: Angular Router with standalone route configuration (`app.routes.ts`)
- **Forms**: Angular Reactive Forms (`FormBuilder`, `Validators`, `ReactiveFormsModule`)
- **State Management**: Angular Services with RxJS `BehaviorSubject` reactive streams (`StorageService`, `ApplicationService`, `InterviewService`, `ThemeService`, `ToastService`, `DialogService`)
- **Styling**: Tailwind CSS design system + Custom SCSS variables and animations
- **Data Persistence**: `localStorage` (no external database or authentication required)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── core/
│   │   └── services/
│   │       ├── application.service.ts  # Application CRUD, search, filter, stats
│   │       ├── dialog.service.ts       # Global confirmation modal state
│   │       ├── interview.service.ts    # Interview CRUD & upcoming/past filtering
│   │       ├── storage.service.ts      # LocalStorage sync & seed data
│   │       ├── theme.service.ts        # Dark/light mode manager
│   │       └── toast.service.ts        # Toast notifications
│   ├── features/
│   │   ├── analytics/
│   │   │   └── analytics.component.ts  # Charts & conversion rate analytics
│   │   ├── applications/
│   │   │   ├── application-detail.component.ts  # Detail view & timeline
│   │   │   ├── application-form.component.ts    # Add/Edit reactive form
│   │   │   └── applications.component.ts        # Table/grid list & filters
│   │   ├── dashboard/
│   │   │   └── dashboard.component.ts  # KPI stats, recent apps, interview widget
│   │   ├── interviews/
│   │   │   └── interviews.component.ts # Interview schedule & bento cards
│   │   ├── saved/
│   │   │   └── saved.component.ts      # Bookmarked jobs & move to apps
│   │   └── settings/
│   │       └── settings.component.ts   # Theme toggle, export JSON, reset data
│   ├── shared/
│   │   ├── components/
│   │   │   ├── confirm-dialog/         # Destructive action modal
│   │   │   ├── mobile-nav/             # Mobile top bar, bottom nav & FAB
│   │   │   ├── sidebar/                # Desktop sidebar navigation
│   │   │   └── toast/                  # Floating notification pills
│   │   └── models/
│   │       └── application.model.ts    # TypeScript models & interfaces
│   ├── app.component.ts                # Main application layout shell
│   └── app.routes.ts                   # Client-side route declarations
├── index.html                          # Stitch tokens, Google Fonts, Tailwind CDN
├── main.ts                             # Application bootstrap
└── styles.scss                         # Global design system styles & animations
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18.x, v20.x, or v22.x)
- npm (v9.x or later)

### Installation & Run

1. Clone or open the repository directory:
   ```bash
   cd "resume project"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Angular development server:
   ```bash
   npm start
   ```
   *(or `ng serve`)*

4. Open your browser and navigate to:
   ```
   http://localhost:4200/
   ```

5. Build for production:
   ```bash
   npm run build
   ```
