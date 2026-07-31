import React from 'react';
import { UserCheck, CheckSquare, FileText, Upload, Calendar, BookOpen } from 'lucide-react';
import { Teacher, LanguageCode } from '../types';

interface TeacherPortalViewProps {
  teachers: Teacher[];
  onNavigate: (tab: any) => void;
  currentLang: LanguageCode;
}

export const TeacherPortalView: React.FC<TeacherPortalViewProps> = ({ teachers, onNavigate }) => {
  const teacher = teachers[0]; // Kedija Ahmed

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/30 p-5 rounded-2xl text-white">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500 text-slate-950 rounded-2xl font-bold">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30">
              Faculty Instructor Portal
            </span>
            <h1 className="text-xl font-extrabold text-white mt-1">
              Welcome, {teacher.fullName}
            </h1>
            <p className="text-xs text-slate-300">
              Dept: {teacher.department} • {teacher.qualification} • ID: <strong className="text-amber-300">{teacher.employeeId}</strong>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
          <CheckSquare className="w-6 h-6 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">Class Attendance Registrar</h3>
          <p className="text-xs text-slate-400">Mark daily attendance for Grade 11-A, 11-B and 12-A.</p>
          <button
            onClick={() => onNavigate('attendance')}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-2 rounded-xl text-xs"
          >
            Mark Attendance
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
          <FileText className="w-6 h-6 text-purple-400" />
          <h3 className="text-sm font-bold text-white">Gradebook Marks Entry</h3>
          <p className="text-xs text-slate-400">Input Continuous Assessment (20%), Mid (30%), Final (50%).</p>
          <button
            onClick={() => onNavigate('academics')}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 rounded-xl text-xs"
          >
            Open Gradebook
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
          <Upload className="w-6 h-6 text-amber-400" />
          <h3 className="text-sm font-bold text-white">Course Material Upload</h3>
          <p className="text-xs text-slate-400">Publish lecture PDFs and assignment problems.</p>
          <button
            onClick={() => onNavigate('digitalLearning')}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-2 rounded-xl text-xs"
          >
            Upload Material
          </button>
        </div>
      </div>
    </div>
  );
};
