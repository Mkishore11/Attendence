import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  RiDashboardLine,
  RiBookOpenLine,
  RiGroupLine,
  RiCheckDoubleLine,
  RiHistoryLine,
  RiBarChartBoxLine,
  RiFileDownloadLine,
  RiCalendarCheckLine,
} from 'react-icons/ri';

const links = [
  { to: '/', label: 'Dashboard', icon: <RiDashboardLine /> },
  { to: '/classes', label: 'Classes', icon: <RiBookOpenLine /> },
  { to: '/students', label: 'Students', icon: <RiGroupLine /> },
  { to: '/mark-attendance', label: 'Mark Attendance', icon: <RiCheckDoubleLine /> },
  { to: '/history', label: 'History', icon: <RiHistoryLine /> },
  { to: '/statistics', label: 'Statistics', icon: <RiBarChartBoxLine /> },
  { to: '/export', label: 'Export', icon: <RiFileDownloadLine /> },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <RiCalendarCheckLine />
        <span>Attendance</span>
      </div>
      <nav className="sidebar__nav">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
            }
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar__footer">© 2026 Attendance</div>
    </aside>
  );
}
