import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

/* ── helpers ── */
const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 9);

export const getTodayString = () => {
  const d = new Date();
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
};

const getStartOfWeek = () => {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const mon = new Date(d.setDate(diff));
  return mon.getFullYear() + '-' +
    String(mon.getMonth() + 1).padStart(2, '0') + '-' +
    String(mon.getDate()).padStart(2, '0');
};

const getStartOfMonth = () => {
  const d = new Date();
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-01';
};

/* ── seed data ── */
const SEED_CLASSES = [
  { id: 'cls1', name: 'Computer Science 101', startDate: '2026-01-15', createdAt: '2026-01-15T08:00:00' },
  { id: 'cls2', name: 'Mathematics 201', startDate: '2026-02-01', createdAt: '2026-02-01T08:00:00' },
  { id: 'cls3', name: 'Physics 301', startDate: '2026-03-10', createdAt: '2026-03-10T08:00:00' },
];

const SEED_STUDENTS = [
  { id: 'stu1', classId: 'cls1', name: 'Alice Johnson', phone: '555-0101', email: 'alice@example.com', rollNumber: 'CS001', createdAt: '2026-01-16T08:00:00' },
  { id: 'stu2', classId: 'cls1', name: 'Bob Williams', phone: '555-0102', email: 'bob@example.com', rollNumber: 'CS002', createdAt: '2026-01-16T08:00:00' },
  { id: 'stu3', classId: 'cls2', name: 'Carol Davis', phone: '555-0201', email: 'carol@example.com', rollNumber: 'MT001', createdAt: '2026-02-02T08:00:00' },
  { id: 'stu4', classId: 'cls2', name: 'David Brown', phone: '555-0202', email: 'david@example.com', rollNumber: 'MT002', createdAt: '2026-02-02T08:00:00' },
  { id: 'stu5', classId: 'cls3', name: 'Eva Martinez', phone: '555-0301', email: 'eva@example.com', rollNumber: 'PH001', createdAt: '2026-03-11T08:00:00' },
];

const buildSeedAttendance = () => {
  const today = getTodayString();
  return [
    { id: 'att1', studentId: 'stu1', classId: 'cls1', date: today, status: 'present', markedAt: new Date().toISOString() },
    { id: 'att2', studentId: 'stu2', classId: 'cls1', date: today, status: 'absent', markedAt: new Date().toISOString() },
    { id: 'att3', studentId: 'stu3', classId: 'cls2', date: today, status: 'present', markedAt: new Date().toISOString() },
    { id: 'att4', studentId: 'stu4', classId: 'cls2', date: today, status: 'late', markedAt: new Date().toISOString() },
    { id: 'att5', studentId: 'stu5', classId: 'cls3', date: today, status: 'present', markedAt: new Date().toISOString() },
    { id: 'att6', studentId: 'stu1', classId: 'cls1', date: '2026-05-14', status: 'present', markedAt: '2026-05-14T09:00:00' },
    { id: 'att7', studentId: 'stu2', classId: 'cls1', date: '2026-05-14', status: 'present', markedAt: '2026-05-14T09:00:00' },
    { id: 'att8', studentId: 'stu3', classId: 'cls2', date: '2026-05-14', status: 'absent', markedAt: '2026-05-14T09:00:00' },
    { id: 'att9', studentId: 'stu4', classId: 'cls2', date: '2026-05-13', status: 'present', markedAt: '2026-05-13T09:00:00' },
    { id: 'att10', studentId: 'stu5', classId: 'cls3', date: '2026-05-13', status: 'late', markedAt: '2026-05-13T09:00:00' },
  ];
};

/* ── localStorage helpers ── */
const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
};
const save = (key, data) => localStorage.setItem(key, JSON.stringify(data));

/* ── provider ── */
export function AppProvider({ children }) {
  const [classes, setClasses] = useState(() => {
    const stored = load('attendease_classes', null);
    if (stored) return stored;
    save('attendease_classes', SEED_CLASSES);
    return SEED_CLASSES;
  });

  const [students, setStudents] = useState(() => {
    const stored = load('attendease_students', null);
    if (stored) return stored;
    save('attendease_students', SEED_STUDENTS);
    return SEED_STUDENTS;
  });

  const [attendance, setAttendance] = useState(() => {
    const stored = load('attendease_attendance', null);
    if (stored) return stored;
    const seed = buildSeedAttendance();
    save('attendease_attendance', seed);
    return seed;
  });

  // persist on change
  useEffect(() => { save('attendease_classes', classes); }, [classes]);
  useEffect(() => { save('attendease_students', students); }, [students]);
  useEffect(() => { save('attendease_attendance', attendance); }, [attendance]);

  /* ── class CRUD ── */
  const addClass = (cls) => {
    const newCls = { ...cls, id: generateId(), createdAt: new Date().toISOString() };
    setClasses(prev => [...prev, newCls]);
  };
  const editClass = (id, updates) => setClasses(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  const deleteClass = (id) => {
    setClasses(prev => prev.filter(c => c.id !== id));
    setStudents(prev => prev.filter(s => s.classId !== id));
    setAttendance(prev => prev.filter(a => a.classId !== id));
  };

  /* ── student CRUD ── */
  const addStudent = (stu) => {
    const newStu = { ...stu, id: generateId(), createdAt: new Date().toISOString() };
    setStudents(prev => [...prev, newStu]);
  };
  const editStudent = (id, updates) => setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  const deleteStudent = (id) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    setAttendance(prev => prev.filter(a => a.studentId !== id));
  };

  /* ── attendance ── */
  const saveAttendanceBatch = (records) => {
    setAttendance(prev => {
      let updated = [...prev];
      records.forEach(rec => {
        const idx = updated.findIndex(a => a.studentId === rec.studentId && a.classId === rec.classId && a.date === rec.date);
        if (idx >= 0) {
          updated[idx] = { ...updated[idx], status: rec.status, markedAt: new Date().toISOString() };
        } else {
          updated.push({ ...rec, id: generateId(), markedAt: new Date().toISOString() });
        }
      });
      return updated;
    });
  };

  /* ── helpers ── */
  const getAttendancePercentage = useCallback((studentId) => {
    const records = attendance.filter(a => a.studentId === studentId);
    if (records.length === 0) return 0;
    const present = records.filter(a => a.status === 'present').length;
    return Math.round((present / records.length) * 100);
  }, [attendance]);

  const getClassName = useCallback((classId) => {
    const cls = classes.find(c => c.id === classId);
    return cls ? cls.name : 'Unknown';
  }, [classes]);

  const getStudentName = useCallback((studentId) => {
    const stu = students.find(s => s.id === studentId);
    return stu ? stu.name : 'Unknown';
  }, [students]);

  const value = {
    classes, students, attendance,
    addClass, editClass, deleteClass,
    addStudent, editStudent, deleteStudent,
    saveAttendanceBatch,
    getAttendancePercentage, getClassName, getStudentName,
    getTodayString, getStartOfWeek, getStartOfMonth,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export default AppContext;
