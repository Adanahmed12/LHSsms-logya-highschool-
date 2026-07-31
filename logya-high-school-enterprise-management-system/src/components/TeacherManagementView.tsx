import React, { useState } from 'react';
import { Users, Search, Plus, Mail, Phone, BookOpen, Award, ShieldCheck, Printer, FileText, FileSpreadsheet } from 'lucide-react';
import { Teacher, LanguageCode } from '../types';
import { translations } from '../data/translations';
import { exportToPDF, exportToExcel, triggerPrint } from '../utils/exportUtils';

interface TeacherManagementViewProps {
  teachers: Teacher[];
  currentLang: LanguageCode;
}

export const TeacherManagementView: React.FC<TeacherManagementViewProps> = ({ teachers, currentLang }) => {
  const t = translations[currentLang];
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTeachers = teachers.filter(
    (tch) =>
      tch.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tch.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tch.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportHeaders = ['Employee ID', 'Full Name', 'Department', 'Qualification', 'Phone', 'Email', 'Status'];
  const exportRows = filteredTeachers.map((t) => [
    t.employeeId,
    t.fullName,
    t.department,
    t.qualification,
    t.phone,
    t.email,
    t.status,
  ]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-400" />
            <h1 className="text-xl font-extrabold text-white">{t.navTeachers}</h1>
            <span className="bg-blue-500/20 text-blue-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-500/30">
              82 Active Faculty
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Logya High School Academic Faculty Roster & Department Workload Allocations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportToPDF('TEACHER FACULTY ROSTER', 'Logya High School Staff', 'logya_teachers', exportHeaders, exportRows)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition"
          >
            <FileText className="w-3.5 h-3.5 text-red-400" />
            <span>PDF</span>
          </button>
          <button
            onClick={() => exportToExcel('logya_teachers', 'Teachers', exportHeaders, exportRows)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Excel</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search teacher by name, employee ID, or department..."
            className="w-full bg-slate-800 text-white text-xs rounded-xl pl-9 pr-4 py-2.5 border border-slate-700 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachers.map((tch) => (
          <div
            key={tch.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 font-extrabold flex items-center justify-center text-sm border border-blue-500/30">
                  {tch.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight">{tch.fullName}</h3>
                  <p className="text-[11px] text-amber-400 font-mono font-semibold">{tch.employeeId}</p>
                </div>
              </div>

              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                {tch.status}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-800 text-xs space-y-1.5 text-slate-300">
              <p className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-purple-400" />
                <span className="font-semibold">{tch.qualification}</span>
              </p>
              <p className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Dept: <strong className="text-white">{tch.department}</strong></span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>{tch.phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span className="truncate">{tch.email}</span>
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Assigned Classes:</span>
              <span className="font-bold text-white">
                {tch.assignedSections.map((s) => `Grade ${s.grade}-${s.section}`).join(', ')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
