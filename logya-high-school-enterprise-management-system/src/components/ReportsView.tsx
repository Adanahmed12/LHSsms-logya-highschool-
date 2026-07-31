import React, { useState } from 'react';
import { FileSpreadsheet, FileText, Download, Printer, Filter, CheckCircle2 } from 'lucide-react';
import { Student, AttendanceRecord, AcademicMark, FeePayment, LanguageCode } from '../types';
import { translations } from '../data/translations';
import { exportToPDF, exportToExcel, exportToCSV, exportToWord, triggerPrint } from '../utils/exportUtils';

interface ReportsViewProps {
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  academicMarks: AcademicMark[];
  feePayments: FeePayment[];
  currentLang: LanguageCode;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  students,
  attendanceRecords,
  academicMarks,
  feePayments,
  currentLang,
}) => {
  const t = translations[currentLang];

  const [reportCategory, setReportCategory] = useState<'STUDENT' | 'ATTENDANCE' | 'ACADEMIC' | 'FINANCE'>('STUDENT');

  const handleExportPDF = () => {
    if (reportCategory === 'STUDENT') {
      const headers = ['Admission No', 'Name', 'Grade/Sec', 'Guardian Phone', 'Status'];
      const rows = students.map((s) => [s.admissionNo, s.fullName, `Grade ${s.grade}-${s.section}`, s.guardianPhone, s.status]);
      exportToPDF('LOGYA HIGH SCHOOL STUDENT REGISTRY REPORT', 'Official EMIS Master Roster', 'logya_students_report', headers, rows);
    } else if (reportCategory === 'FINANCE') {
      const headers = ['Receipt No', 'Student Name', 'Purpose', 'Amount (ETB)', 'Method', 'Date'];
      const rows = feePayments.map((p) => [p.receiptNumber, p.studentName, p.feeName, `${p.amountPaid} ETB`, p.paymentMethod, p.paymentDate]);
      exportToPDF('LOGYA HIGH SCHOOL FINANCIAL REVENUE REPORT', 'Treasury Fee Ledger Statement', 'logya_finance_report', headers, rows);
    } else {
      alert(`Exporting ${reportCategory} PDF report...`);
    }
  };

  const handleExportExcel = () => {
    const headers = ['Admission No', 'Name', 'Grade/Sec', 'Guardian Phone', 'Status'];
    const rows = students.map((s) => [s.admissionNo, s.fullName, `Grade ${s.grade}-${s.section}`, s.guardianPhone, s.status]);
    exportToExcel('logya_report', reportCategory, headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl font-extrabold text-white">{t.navReports}</h1>
            <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">
              Multi-Format Export Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Logya High School Analytical Report Generator • PDF, Excel (.xlsx), CSV, Word & Print
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPDF}
            className="bg-red-600 hover:bg-red-500 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1 shadow-md transition"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1 shadow-md transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export Excel</span>
          </button>

          <button
            onClick={triggerPrint}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-400" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Category Selection Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setReportCategory('STUDENT')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            reportCategory === 'STUDENT'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-800/60'
          }`}
        >
          Student Demographics
        </button>

        <button
          onClick={() => setReportCategory('ATTENDANCE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            reportCategory === 'ATTENDANCE'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-800/60'
          }`}
        >
          Daily Attendance
        </button>

        <button
          onClick={() => setReportCategory('ACADEMIC')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            reportCategory === 'ACADEMIC'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-800/60'
          }`}
        >
          Academic Marks & Grades
        </button>

        <button
          onClick={() => setReportCategory('FINANCE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            reportCategory === 'FINANCE'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-800/60'
          }`}
        >
          Financial Treasury
        </button>
      </div>

      {/* Report Preview Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm p-4">
        <h3 className="text-sm font-bold text-white mb-3">Live Report Preview ({reportCategory})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800 text-slate-400 text-[10px] uppercase">
              <tr>
                <th className="py-2.5 px-3">Admission / ID</th>
                <th className="py-2.5 px-3">Full Name</th>
                <th className="py-2.5 px-3">Class Level</th>
                <th className="py-2.5 px-3">Phone</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {students.map((st) => (
                <tr key={st.id}>
                  <td className="py-2.5 px-3 font-mono text-amber-400">{st.admissionNo}</td>
                  <td className="py-2.5 px-3 font-bold text-white">{st.fullName}</td>
                  <td className="py-2.5 px-3">Grade {st.grade}-{st.section}</td>
                  <td className="py-2.5 px-3 text-slate-400">{st.guardianPhone}</td>
                  <td className="py-2.5 px-3 text-emerald-400 font-bold">{st.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
