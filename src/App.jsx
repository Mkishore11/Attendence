import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Classes from './components/Classes';
import Students from './components/Students';
import MarkAttendance from './components/MarkAttendance';
import AttendanceHistory from './components/AttendanceHistory';
import Statistics from './components/Statistics';
import ExportReport from './components/ExportReport';

function App() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/students" element={<Students />} />
          <Route path="/mark-attendance" element={<MarkAttendance />} />
          <Route path="/history" element={<AttendanceHistory />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/export" element={<ExportReport />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
