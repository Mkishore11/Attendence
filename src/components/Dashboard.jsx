import React from 'react';
import { useAppContext, getTodayString } from '../context/AppContext';
import { RiGroupLine, RiCheckLine, RiCloseLine, RiTimeLine } from 'react-icons/ri';

export default function Dashboard() {
  const { classes, students, attendance, getClassName, getStudentName, getAttendancePercentage } = useAppContext();
  const today = getTodayString();

  const todayRecords = attendance.filter(a => a.date === today);
  const presentToday = todayRecords.filter(a => a.status === 'present').length;
  const absentToday  = todayRecords.filter(a => a.status === 'absent').length;
  const lateToday    = todayRecords.filter(a => a.status === 'late').length;

  // batch overview
  const batchData = classes.map(cls => {
    const clsStudents = students.filter(s => s.classId === cls.id);
    const clsTodayRecs = todayRecords.filter(a => a.classId === cls.id);
    const presentCount = clsTodayRecs.filter(a => a.status === 'present').length;
    const pct = clsTodayRecs.length > 0 ? Math.round((presentCount / clsTodayRecs.length) * 100) : 0;
    return { ...cls, total: clsStudents.length, present: presentCount, pct };
  });

  // recent activity (last 5)
  const recentActivity = [...attendance]
    .sort((a, b) => new Date(b.markedAt) - new Date(a.markedAt))
    .slice(0, 5);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's your attendance overview.</p>
        </div>
      </div>

      {/* stat cards */}
      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-card__icon stat-card__icon--blue"><RiGroupLine /></div>
          <div>
            <div className="stat-card__value">{students.length}</div>
            <div className="stat-card__label">Total Students</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-card__icon stat-card__icon--green"><RiCheckLine /></div>
          <div>
            <div className="stat-card__value">{presentToday}</div>
            <div className="stat-card__label">Present Today</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-card__icon stat-card__icon--red"><RiCloseLine /></div>
          <div>
            <div className="stat-card__value">{absentToday}</div>
            <div className="stat-card__label">Absent Today</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-card__icon stat-card__icon--amber"><RiTimeLine /></div>
          <div>
            <div className="stat-card__value">{lateToday}</div>
            <div className="stat-card__label">Late Today</div>
          </div>
        </div>
      </div>

      {/* batch overview */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 className="section-title">Batch Overview</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Class</th>
                <th>Students</th>
                <th>Present Today</th>
                <th>Attendance %</th>
              </tr>
            </thead>
            <tbody>
              {batchData.map(b => (
                <tr key={b.id}>
                  <td style={{ fontWeight: 600 }}>{b.name}</td>
                  <td>{b.total}</td>
                  <td>{b.present}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="progress-bar">
                        <div
                          className={`progress-bar__fill progress-bar__fill--${b.pct >= 80 ? 'green' : b.pct >= 60 ? 'amber' : 'red'}`}
                          style={{ width: `${b.pct}%` }}
                        />
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{b.pct}%</span>
                    </div>
                  </td>
                </tr>
              ))}
              {batchData.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: 'center', color: '#999' }}>No classes yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* recent activity */}
      <div className="card">
        <h3 className="section-title">Recent Activity</h3>
        {recentActivity.length === 0 ? (
          <p style={{ color: '#999', fontSize: '0.9rem' }}>No attendance records yet.</p>
        ) : (
          <div className="activity-list">
            {recentActivity.map(rec => (
              <div className="activity-item" key={rec.id}>
                <div className="activity-item__info">
                  <span className="activity-item__name">{getStudentName(rec.studentId)}</span>
                  <span className="activity-item__sub">{getClassName(rec.classId)} · {rec.date}</span>
                </div>
                <span className={`pill pill--${rec.status}`}>{rec.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
