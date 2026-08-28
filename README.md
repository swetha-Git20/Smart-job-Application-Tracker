# CareerStream — Smart Job Application Tracker

A modern, responsive, full-featured **Job Application Tracker** built with **Angular (Standalone Components) + TypeScript + HTML/CSS & Tailwind CSS**, faithfully matching the Stitch UI SaaS design system.

---

## ⚡ Quick Start (One-Click Run)

### 🖱️ Windows One-Click Starter
Simply double-click **`start.bat`** (or **`run.bat`**) in the project folder:
1. It automatically checks and installs any missing dependencies (`npm install`).
2. It starts the Angular development server on `http://localhost:4200/`.
3. It opens the app directly in **Full Screen Mode** in your browser.
*(Tip: Press `F11` anytime to toggle full screen mode on or off).*

---

## 🌟 Features & Pages

### 1. 📊 Interactive Dashboard (`/dashboard`)
- **KPI Stat Cards**: Real-time count of Total Applications, Scheduled Interviews, Offers, and Rejections.
- **Recent Applications**: Displays recent job entries with color-coded status badges and quick navigation to detail views.
- **Upcoming Interviews Widget**: Quick-glance calendar box with dates, times, format (Online/Onsite/Phone), and meeting links.
- **Export Report**: Instant JSON report export button.

### 2. 💼 Applications Pipeline (`/applications`)
- **Full CRUD Support**: Add, view, edit, and delete applications with instant state synchronization.
- **Live Search**: Instant real-time filtering across Company Name, Role, Location, and Notes.
- **Filter by Status & Work Model**: Filter by `Applied`, `Interview`, `Offer`, `Rejected` and `Remote`, `Hybrid`, `Onsite`.
- **Sorting**: Sort by Newest First, Oldest First, Company A-Z, or Company Z-A.
- **View Toggle**: Switch between **Table View** and **Responsive Card Grid View**.
- **Quick Status Changer & Bookmarking**: Update status or save to bookmarks directly from the list.

### 3. 📝 Application Add & Edit Forms (`/applications/new` & `/applications/:id/edit`)
- **Reactive Forms (`FormGroup`)**: Enforces required fields, proper URL validation for job posting links, and salary formatting.
- Clean structured sections for Position details, Logistics, and Preparation Notes.

### 4. 🔍 Application Detail & Status Timeline (`/applications/:id`)
- **Position Overview**: Work model, location, applied date, salary range, and direct link to job posting.
- **Interactive Chronological Status Timeline**: Displays history of status changes with timestamps.
- **Notes & Context**: Full notes viewer with inline editing and saving.
- **Linked Interviews**: View and schedule interview rounds tied directly to this position.

### 5. 📅 Interview Tracker (`/interviews`)
- **Bento Grid Cards**: Round details, Date, Time, Format badges (Online/Onsite/Phone), notes, and direct **Join Meeting** call links.
- **Upcoming vs. Past Tabs**: Easily filter between upcoming and past interviews.
- **Schedule Interview Modal**: Form to schedule new rounds with parent application selector.

### 6. ⭐ Saved Jobs & Opportunities (`/saved`)
- Bookmarked jobs board for positions to research or apply to later.
- **"Move to Active Applications"**: Converts a saved job into the active pipeline with a single click and toast notification.

### 7. 📈 Live Pipeline Analytics (`/analytics`)
- **Computed Metrics**: Total Applications, Interview Conversion Rate %, and Offer Rate %.
- **Status Funnel Donut Chart**: Dynamic SVG/conic visual breakdown by stage.
- **Monthly Volume Bar Chart**: Applications submitted per month over time.
- **Work Model Distribution**: Breakdown of Remote vs. Hybrid vs. On-site positions.

### 8. ⚙️ Settings & Data Management (`/settings`)
- **Dark / Light Mode Toggle**: Smooth theme transition persisted app-wide in `localStorage`.
- **Compact View Mode**: Adjusts padding for dense information displays.
- **Export Data as JSON**: Downloads a complete backup `.json` file of all saved applications and interviews.
- **Reset All Data**: Restores clean starter sample data with a confirmation modal.

---

## 🛠️ Tech Stack

- **Framework**: Angular (Latest stable, 100% Standalone Components)
- **Language**: TypeScript
- **Routing**: Angular Router (`app.routes.ts`)
- **Forms**: Angular Reactive Forms (`FormBuilder`, `Validators`, `ReactiveFormsModule`)
- **State Management**: Angular Services with RxJS `BehaviorSubject` reactive streams (`StorageService`, `ApplicationService`, `InterviewService`, `ThemeService`, `ToastService`, `DialogService`)
- **Styling**: Tailwind CSS + Custom SCSS variables and animations
- **Data Persistence**: `localStorage` (no external backend or DB required)

---

## 📁 Project Structure

```
resume project/
├── start.bat                           # 🚀 One-click full screen launcher
├── run.bat                             # Alias launcher
├── e2e-screenshots/                    # Captured E2E browser screenshots
├── scripts/
│   └── e2e-test.mjs                    # Automated E2E test script (Puppeteer + Edge)
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   └── services/               # Storage, Application, Interview, Theme, Toast, Dialog
│   │   ├── features/
│   │   │   ├── analytics/              # Live charts & conversion funnel
│   │   │   ├── applications/           # Table/grid list, add/edit form, detail view
│   │   │   ├── dashboard/              # Stat cards, recent apps, interview widget
│   │   │   ├── interviews/             # Schedule modal, upcoming/past bento cards
│   │   │   ├── saved/                  # Bookmarked jobs & move to pipeline
│   │   │   └── settings/               # Dark mode, JSON export, reset data
│   │   ├── shared/
│   │   │   ├── components/             # Sidebar, MobileNav, Toast, ConfirmDialog
│   │   │   └── models/                 # TypeScript models & interfaces
│   │   ├── app.component.ts            # Global shell layout
│   │   └── app.routes.ts               # Route declarations
│   ├── index.html                      # Stitch tokens, Google Fonts, Tailwind CDN
│   ├── main.ts                         # Bootstrap
│   └── styles.scss                     # Global styles, scrollbars, timeline lines
├── angular.json                        # Angular CLI build configuration
├── package.json                        # Dependencies & scripts
└── README.md                           # Project documentation
```

---

## 🚀 Manual Running Instructions

If you prefer using the terminal directly:

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Open in browser**:
   Navigate to:
   ```
   http://localhost:4200/
   ```

4. **Run E2E Browser Test Suite**:
   ```bash
   node scripts/e2e-test.mjs
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```
