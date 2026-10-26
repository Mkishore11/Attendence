# AttendEase — Simple Modern Attendance Tracker

A fully offline React.js single-page application for tracking student attendance across multiple classes.

## Features

- **Dashboard** — Live stat cards, batch overview, recent activity
- **Classes** — Create, edit, delete class batches
- **Students** — Manage student roster with search & filter
- **Mark Attendance** — Toggle Present/Absent/Late per student per day
- **History** — Browse past records with Today/Week/Month tabs
- **Statistics** — Per-student breakdown with color-coded progress bars
- **Export** — Download PDF or Excel attendance reports

## Tech Stack

- React (Create React App)
- react-router-dom v6
- jspdf + jspdf-autotable (PDF export)
- xlsx / SheetJS (Excel export)
- react-icons (Remix Icon set)
- localStorage (data persistence — no backend needed)

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Install additional libraries (if not already in package.json)
npm install react-router-dom react-icons jspdf jspdf-autotable xlsx

# 3. Start the dev server
npm start
```

The app opens at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  components/
    Sidebar.jsx
    Dashboard.jsx
    Classes.jsx
    Students.jsx
    MarkAttendance.jsx
    AttendanceHistory.jsx
    Statistics.jsx
    ExportReport.jsx
  context/
    AppContext.jsx
  App.jsx
  App.css
  index.js
```

## Data Persistence

All data is stored in `localStorage` under the keys:
- `attendease_classes`
- `attendease_students`
- `attendease_attendance`

On first load, sample seed data (3 classes, 5 students, 10 attendance records) is automatically generated so the app looks populated.

## License

MIT
