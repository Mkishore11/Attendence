import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { RiAddLine, RiEditLine, RiDeleteBinLine, RiCloseLine, RiBookOpenLine, RiGroupLine, RiCalendarLine } from 'react-icons/ri';

export default function Classes() {
  const { classes, students, addClass, editClass, deleteClass } = useAppContext();
  const [modal, setModal] = useState(null); // null | 'add' | {editing: classObj}
  const [form, setForm] = useState({ name: '', startDate: '' });

  const openAdd = () => {
    setForm({ name: '', startDate: '' });
    setModal('add');
  };

  const openEdit = (cls) => {
    setForm({ name: cls.name, startDate: cls.startDate });
    setModal({ editing: cls });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (modal === 'add') {
      addClass({ name: form.name.trim(), startDate: form.startDate });
    } else {
      editClass(modal.editing.id, { name: form.name.trim(), startDate: form.startDate });
    }
    setModal(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this class and all its students & attendance records?')) {
      deleteClass(id);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Classes</h1>
          <p>Manage your class batches</p>
        </div>
        <button className="btn btn--primary" onClick={openAdd}><RiAddLine /> New Class</button>
      </div>

      {classes.length === 0 ? (
        <div className="card empty-state">
          <RiBookOpenLine />
          <p>No classes yet. Create your first class!</p>
        </div>
      ) : (
        <div className="classes-grid">
          {classes.map(cls => {
            const count = students.filter(s => s.classId === cls.id).length;
            return (
              <div className="card class-card" key={cls.id}>
                <div className="class-card__actions">
                  <button className="btn btn--ghost btn--sm" onClick={() => openEdit(cls)} title="Edit">
                    <RiEditLine />
                  </button>
                  <button className="btn btn--ghost btn--sm" onClick={() => handleDelete(cls.id)} title="Delete" style={{ color: 'var(--red)' }}>
                    <RiDeleteBinLine />
                  </button>
                </div>
                <div className="class-card__name">{cls.name}</div>
                <div className="class-card__meta">
                  <span><RiGroupLine style={{ marginRight: 6, verticalAlign: 'middle' }} />{count} student{count !== 1 ? 's' : ''}</span>
                  <span><RiCalendarLine style={{ marginRight: 6, verticalAlign: 'middle' }} />Started {cls.startDate || '—'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* modal */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal__header">
              <h2>{modal === 'add' ? 'New Class' : 'Edit Class'}</h2>
              <button className="modal__close" onClick={() => setModal(null)}><RiCloseLine /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Class Name</label>
                <input
                  className="form-control"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Computer Science 101"
                  autoFocus
                  required
                />
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.startDate}
                  onChange={e => setForm({ ...form, startDate: e.target.value })}
                />
              </div>
              <div className="modal__actions">
                <button type="button" className="btn btn--outline" onClick={() => setModal(null)}>Cancel</button>
                <button type="submit" className="btn btn--primary">{modal === 'add' ? 'Create' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
