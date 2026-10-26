import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { RiBarChartBoxLine } from 'react-icons/ri';

export default function Statistics() {
  const { classes, students, attendance, getClassName } = useAppContext();
  const [filterClass, setFilterClass] = useState('');

  const stats = useMemo(() => {
    let filtered = filterClass
      ? students.filter(s => s.classId === filterClass)
      : students;

    return filtered.map(stu => {
      const records = attendance.filter(a => a.studentId === stu.id);
      const total = records.length;
      const present = records.filter(a => a.status === 'present').length;
      const absent = records.filter(a => a.status === 'absent').length;
      const late = records.filter(a => a.status === 'late').length;
      const pct = total > 0 ? Math.round((present / total) * 100) : 0;
      return {
        id: stu.id,
        name: stu.name,
        rollNumber: stu.rollNumber,
        batch: getClassName(stu.classId),
        total,
        present,
        absent,
        late,
        pct,
      };
    });
  }, [students, attendance, filterClass, getClassName]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Statistics</h1>
          <p>Detailed attendance statistics per student</p>
        </div>
      </div>

      <div className="filter-bar">
        <select className="form-control" value={filterClass} onChange={e => setFilterClass(e.target.value)}>
          <option value="">All Classes</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="card">
        {stats.length === 0 ? (
          <div className="empty-state">
            <RiBarChartBoxLine />
            <p>No student data available.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Batch</th>
                  <th>Total Days</th>
                  <th>Present</th>
                  <th>Absent</th>
                  <th>Late</th>
                  <th>Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {stats.map(s => {
                  const barColor = s.pct >= 80 ? 'green' : s.pct >= 60 ? 'amber' : 'red';
                  return (
                    <tr key={s.id}>
                      <td>
                        <div>
                          <div style={{ fontWeight: 600 }}>{s.name}</div>
                          <div style={{ fontSize: '0.8rem', color: '#888' }}>{s.rollNumber}</div>
                        </div>
                      </td>
                      <td>{s.batch}</td>
                      <td>{s.total}</td>
                      <td style={{ color: 'var(--green)', fontWeight: 600 }}>{s.present}</td>
                      <td style={{ color: 'var(--red)', fontWeight: 600 }}>{s.absent}</td>
                      <td style={{ color: 'var(--amber)', fontWeight: 600 }}>{s.late}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="progress-bar">
                            <div
                              className={`progress-bar__fill progress-bar__fill--${barColor}`}
                              style={{ width: `${s.pct}%` }}
                            />
                          </div>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{s.pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
