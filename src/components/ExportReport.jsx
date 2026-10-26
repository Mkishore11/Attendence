import React, { useState } from 'react';
import { useAppContext, getTodayString } from '../context/AppContext';
import { RiFilePdf2Line, RiFileExcel2Line, RiDownloadLine } from 'react-icons/ri';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function ExportReport() {
  const { classes, students, attendance, getClassName, getStudentName, getStartOfWeek, getStartOfMonth } = useAppContext();
  const [pdfClass, setPdfClass] = useState('');
  const [pdfPeriod, setPdfPeriod] = useState('today');
  const [excelClass, setExcelClass] = useState('');
  const [excelPeriod, setExcelPeriod] = useState('today');
  const [toast, setToast] = useState('');

  const today = getTodayString();

  const getDateRange = (period) => {
    if (period === 'today') return { start: today, end: today, label: `Today (${today})` };
    if (period === 'week') return { start: getStartOfWeek(), end: today, label: `This Week (${getStartOfWeek()} to ${today})` };
    return { start: getStartOfMonth(), end: today, label: `This Month (${getStartOfMonth()} to ${today})` };
  };

  const buildRows = (classId, period) => {
    const { start, end } = getDateRange(period);
    const classStudents = classId ? students.filter(s => s.classId === classId) : students;

    return classStudents.map(stu => {
      const records = attendance.filter(a => {
        if (a.studentId !== stu.id) return false;
        if (classId && a.classId !== classId) return false;
        return a.date >= start && a.date <= end;
      });
      const total = records.length;
      const present = records.filter(r => r.status === 'present').length;
      const absent = records.filter(r => r.status === 'absent').length;
      const late = records.filter(r => r.status === 'late').length;
      const pct = total > 0 ? Math.round((present / total) * 100) : 0;
      return {
        name: stu.name,
        rollNumber: stu.rollNumber,
        batch: getClassName(stu.classId),
        total,
        present,
        absent,
        late,
        pct: `${pct}%`,
      };
    });
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  /* ── PDF Export ── */
  const handlePdfExport = () => {
    const { label } = getDateRange(pdfPeriod);
    const className = pdfClass ? getClassName(pdfClass) : 'All Classes';
    const rows = buildRows(pdfClass, pdfPeriod);

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('AttendEase — Attendance Report', 14, 20);

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Class: ${className}`, 14, 30);
    doc.text(`Period: ${label}`, 14, 36);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 42);

    doc.autoTable({
      startY: 50,
      head: [['Name', 'Roll No', 'Batch', 'Total', 'Present', 'Absent', 'Late', 'Att. %']],
      body: rows.map(r => [r.name, r.rollNumber, r.batch, r.total, r.present, r.absent, r.late, r.pct]),
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 248, 255] },
    });

    doc.save(`attendease_report_${pdfPeriod}.pdf`);
    showToast('PDF exported successfully!');
  };

  /* ── Excel Export ── */
  const handleExcelExport = () => {
    const className = excelClass ? getClassName(excelClass) : 'All Classes';
    const rows = buildRows(excelClass, excelPeriod);

    const wsData = [
      ['AttendEase — Attendance Report'],
      [`Class: ${className}`, '', `Period: ${getDateRange(excelPeriod).label}`],
      [],
      ['Name', 'Roll No', 'Batch', 'Total Days', 'Present', 'Absent', 'Late', 'Attendance %'],
      ...rows.map(r => [r.name, r.rollNumber, r.batch, r.total, r.present, r.absent, r.late, r.pct]),
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // column widths
    ws['!cols'] = [
      { wch: 22 }, { wch: 12 }, { wch: 22 }, { wch: 10 },
      { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 14 },
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
    XLSX.writeFile(wb, `attendease_report_${excelPeriod}.xlsx`);
    showToast('Excel exported successfully!');
  };

  const PeriodSelect = ({ value, onChange }) => (
    <select className="form-control" value={value} onChange={e => onChange(e.target.value)}>
      <option value="today">Today</option>
      <option value="week">This Week</option>
      <option value="month">This Month</option>
    </select>
  );

  const ClassSelect = ({ value, onChange }) => (
    <select className="form-control" value={value} onChange={e => onChange(e.target.value)}>
      <option value="">All Classes</option>
      {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
    </select>
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Export Report</h1>
          <p>Download attendance data as PDF or Excel</p>
        </div>
      </div>

      <div className="export-grid">
        {/* PDF card */}
        <div className="card export-card">
          <div className="export-card__icon export-card__icon--pdf">
            <RiFilePdf2Line />
          </div>
          <h3>Export as PDF</h3>
          <div className="form-group">
            <label>Class</label>
            <ClassSelect value={pdfClass} onChange={setPdfClass} />
          </div>
          <div className="form-group">
            <label>Period</label>
            <PeriodSelect value={pdfPeriod} onChange={setPdfPeriod} />
          </div>
          <button className="btn btn--primary" onClick={handlePdfExport} style={{ width: '100%', justifyContent: 'center' }}>
            <RiDownloadLine /> Download PDF
          </button>
        </div>

        {/* Excel card */}
        <div className="card export-card">
          <div className="export-card__icon export-card__icon--excel">
            <RiFileExcel2Line />
          </div>
          <h3>Export as Excel</h3>
          <div className="form-group">
            <label>Class</label>
            <ClassSelect value={excelClass} onChange={setExcelClass} />
          </div>
          <div className="form-group">
            <label>Period</label>
            <PeriodSelect value={excelPeriod} onChange={setExcelPeriod} />
          </div>
          <button className="btn btn--primary" onClick={handleExcelExport} style={{ width: '100%', justifyContent: 'center', background: 'var(--green)' }}>
            <RiDownloadLine /> Download Excel
          </button>
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
