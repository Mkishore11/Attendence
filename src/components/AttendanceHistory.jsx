import React, { useState, useMemo } from 'react';
import { useAppContext, getTodayString } from '../context/AppContext';
import { RiSearchLine, RiHistoryLine } from 'react-icons/ri';

export default function AttendanceHistory() {
  const { classes, attendance, getClassName, getStudentName, getStartOfWeek, getStartOfMonth } = useAppContext();
  const [tab, setTab] = useState('today'); // today | week | month
  const [filterClass, setFilterClass] = useState('');
  const [search, setSearch] = useState('');

  const today = getTodayString();
  const weekStart = getStartOfWeek();
  const monthStart = getStartOfMonth();

  const filtered = useMemo(() => {
    let records = [...attendance];

    // period filter
    if (tab === 'today') {
      records = records.filter(a => a.date === today);
    } else if (tab === 'week') {
      records = records.filter(a => a.date >= weekStart && a.date <= today);
    } else {
      records = records.filter(a => a.date >= monthStart && a.date <= today);
    }

    // class filter
    if (filterClass) {
      records = records.filter(a => a.classId === filterClass);
    }

    // search
    if (search) {
      const q = search.toLowerCase();
      records = records.filter(a => getStudentName(a.studentId).toLowerCase().includes(q));
    }

    // sort newest first
    records.sort((a, b) => b.date.localeCompare(a.date) || new Date(b.markedAt) - new Date(a.markedAt));

    return records;
  }, [attendance, tab, filterClass, search, today, weekStart, monthStart, getStudentName]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Attendance History</h1>
          <p>Review past attendance records</p>
        </div>
      </div>

      {/* tabs */}
      <div className="tabs">
        {['today', 'week', 'month'].map(t => (
          <button
            key={t}
            className={`tab-btn${tab === t ? ' tab-btn--active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'today' ? 'Today' : t === 'week' ? 'This Week' : 'This Month'}
          </button>
        ))}
      </div>

      <div className="filter-bar">
        <select className="form-control" value={filterClass} onChange={e => setFilterClass(e.target.value)}>
          <option value="">All Classes</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div className="search-input">
          <RiSearchLine />
          <input
            className="form-control"
            placeholder="Search student…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <RiHistoryLine />
            <p>No records found for this period.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Student Name</th>
                  <th>Batch</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(rec => (
                  <tr key={rec.id}>
                    <td>{rec.date}</td>
                    <td style={{ fontWeight: 500 }}>{getStudentName(rec.studentId)}</td>
                    <td>{getClassName(rec.classId)}</td>
                    <td><span className={`pill pill--${rec.status}`}>{rec.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
