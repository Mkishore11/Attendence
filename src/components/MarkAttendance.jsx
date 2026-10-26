import React, { useState, useMemo } from 'react';
import { useAppContext, getTodayString } from '../context/AppContext';
import { RiCheckDoubleLine, RiSaveLine } from 'react-icons/ri';

export default function MarkAttendance() {
  const { classes, students, attendance, saveAttendanceBatch } = useAppContext();
  const [selectedClass, setSelectedClass] = useState(classes[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [toast, setToast] = useState('');

  const classStudents = useMemo(
    () => students.filter(s => s.classId === selectedClass),
    [students, selectedClass]
  );

  // Build local status map from existing attendance
  const initialStatuses = useMemo(() => {
    const map = {};
    classStudents.forEach(s => {
      const existing = attendance.find(
        a => a.studentId === s.id && a.classId === selectedClass && a.date === selectedDate
      );
      map[s.id] = existing ? existing.status : '';
    });
    return map;
  }, [classStudents, attendance, selectedClass, selectedDate]);

  const [statuses, setStatuses] = useState(initialStatuses);

  // Sync when class/date changes
  React.useEffect(() => {
    const map = {};
    classStudents.forEach(s => {
      const existing = attendance.find(
        a => a.studentId === s.id && a.classId === selectedClass && a.date === selectedDate
      );
      map[s.id] = existing ? existing.status : '';
    });
    setStatuses(map);
  }, [classStudents, attendance, selectedClass, selectedDate]);

  const toggleStatus = (studentId, status) => {
    setStatuses(prev => ({
      ...prev,
      [studentId]: prev[studentId] === status ? '' : status,
    }));
  };

  const handleSave = () => {
    const records = classStudents
      .filter(s => statuses[s.id])
      .map(s => ({
        studentId: s.id,
        classId: selectedClass,
        date: selectedDate,
        status: statuses[s.id],
      }));

    if (records.length === 0) {
      setToast('Please mark at least one student.');
      setTimeout(() => setToast(''), 2500);
      return;
    }

    saveAttendanceBatch(records);
    setToast(`Attendance saved for ${records.length} student(s)!`);
    setTimeout(() => setToast(''), 2500);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Mark Attendance</h1>
          <p>Select a class and date, then mark each student</p>
        </div>
        <button className="btn btn--primary" onClick={handleSave}>
          <RiSaveLine /> Save All
        </button>
      </div>

      <div className="filter-bar">
        <select
          className="form-control"
          value={selectedClass}
          onChange={e => setSelectedClass(e.target.value)}
        >
          <option value="">Select Class</option>
          {classes.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input
          type="date"
          className="form-control"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
        />
      </div>

      <div className="card">
        {!selectedClass ? (
          <div className="empty-state">
            <RiCheckDoubleLine />
            <p>Select a class to begin marking attendance.</p>
          </div>
        ) : classStudents.length === 0 ? (
          <div className="empty-state">
            <RiCheckDoubleLine />
            <p>No students in this class yet.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {classStudents.map(stu => (
                  <tr key={stu.id}>
                    <td style={{ fontWeight: 600 }}>{stu.rollNumber}</td>
                    <td>{stu.name}</td>
                    <td>
                      <div className="att-btn-group">
                        <button
                          className={`att-btn${statuses[stu.id] === 'present' ? ' att-btn--present' : ''}`}
                          onClick={() => toggleStatus(stu.id, 'present')}
                          title="Present"
                        >P</button>
                        <button
                          className={`att-btn${statuses[stu.id] === 'absent' ? ' att-btn--absent' : ''}`}
                          onClick={() => toggleStatus(stu.id, 'absent')}
                          title="Absent"
                        >A</button>
                        <button
                          className={`att-btn${statuses[stu.id] === 'late' ? ' att-btn--late' : ''}`}
                          onClick={() => toggleStatus(stu.id, 'late')}
                          title="Late"
                        >L</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
