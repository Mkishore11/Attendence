import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import {
  RiAddLine, RiEditLine, RiDeleteBinLine, RiCloseLine,
  RiSearchLine, RiGroupLine,
} from 'react-icons/ri';

export default function Students() {
  const { classes, students, addStudent, editStudent, deleteStudent, getAttendancePercentage, getClassName } = useAppContext();
  const [filterClass, setFilterClass] = useState('');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', rollNumber: '', classId: '' });

  const openAdd = () => {
    setForm({ name: '', phone: '', email: '', rollNumber: '', classId: classes[0]?.id || '' });
    setModal('add');
  };

  const openEdit = (stu) => {
    setForm({ name: stu.name, phone: stu.phone, email: stu.email, rollNumber: stu.rollNumber, classId: stu.classId });
    setModal({ editing: stu });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.classId) return;
    if (modal === 'add') {
      addStudent(form);
    } else {
      editStudent(modal.editing.id, form);
    }
    setModal(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this student and all their attendance records?')) {
      deleteStudent(id);
    }
  };

  const filtered = students.filter(s => {
    if (filterClass && s.classId !== filterClass) return false;
    if (search) {
      const q = search.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.rollNumber.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Students</h1>
          <p>Manage your student roster</p>
        </div>
        <button className="btn btn--primary" onClick={openAdd}><RiAddLine /> Add Student</button>
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
            placeholder="Search name or roll…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <RiGroupLine />
            <p>No students found.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Batch</th>
                  <th>Attendance %</th>
                  <th style={{ width: 100 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(stu => {
                  const pct = getAttendancePercentage(stu.id);
                  return (
                    <tr key={stu.id}>
                      <td style={{ fontWeight: 600 }}>{stu.rollNumber}</td>
                      <td>{stu.name}</td>
                      <td>{stu.phone}</td>
                      <td>{stu.email}</td>
                      <td>{getClassName(stu.classId)}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="progress-bar">
                            <div
                              className={`progress-bar__fill progress-bar__fill--${pct >= 80 ? 'green' : pct >= 60 ? 'blue' : 'red'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{pct}%</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button className="btn btn--ghost btn--sm" onClick={() => openEdit(stu)}><RiEditLine /></button>
                          <button className="btn btn--ghost btn--sm" onClick={() => handleDelete(stu.id)} style={{ color: 'var(--red)' }}><RiDeleteBinLine /></button>
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

      {/* modal */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal__header">
              <h2>{modal === 'add' ? 'Add Student' : 'Edit Student'}</h2>
              <button className="modal__close" onClick={() => setModal(null)}><RiCloseLine /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required autoFocus />
              </div>
              <div className="form-group">
                <label>Roll Number</label>
                <input className="form-control" value={form.rollNumber} onChange={e => setForm({ ...form, rollNumber: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input className="form-control" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input className="form-control" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Class</label>
                <select className="form-control" value={form.classId} onChange={e => setForm({ ...form, classId: e.target.value })} required>
                  <option value="">Select class</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="modal__actions">
                <button type="button" className="btn btn--outline" onClick={() => setModal(null)}>Cancel</button>
                <button type="submit" className="btn btn--primary">{modal === 'add' ? 'Add' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
