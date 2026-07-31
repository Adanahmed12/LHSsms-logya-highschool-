import React from 'react';
import { GraduationCap, Calendar, FileText, Sparkles, BookOpen, Clock, Award } from 'lucide-react';
import { Student, TimetableSlot, AcademicMark, LanguageCode } from '../types';

interface StudentPortalViewProps {
  students: Student[];
  timetableSlots: TimetableSlot[];
  academicMarks: AcademicMark[];
  onNavigate: (tab: any) => void;
  currentLang: LanguageCode;
}

export const StudentPortalView: React.FC<StudentPortalViewProps> = ({
  students,
  timetableSlots,
  academicMarks,
  onNavigate,
}) => {
  const student = students[0]; // Amina Ibrahim Hassan

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border border-emerald-500/30 p-5 rounded-2xl text-white">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500 text-slate-950 rounded-2xl font-bold">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
              Student Workspace
            </span>
            <h1 className="text-xl font-extrabold text-white mt-1">
              Welcome back, {student.fullName}!
            </h1>
            <p className="text-xs text-slate-300">
              Grade {student.grade}-{student.section} • {student.stream} Stream • Admission No: <strong className="text-amber-300">{student.admissionNo}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">Online Examination Engine</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xs text-slate-400">Take active timed online quizzes & exams.</p>
          <button
            onClick={() => onNavigate('onlineExam')}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-2 rounded-xl text-xs"
          >
            Launch Exam Center
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">Digital Learning Notes</span>
            <BookOpen className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-xs text-slate-400">Download course materials and lecture slides.</p>
          <button
            onClick={() => onNavigate('digitalLearning')}
            className="w-full bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold py-2 rounded-xl text-xs border border-slate-700"
          >
            Access E-Learning Repository
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">My Academic Transcript</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xs text-slate-400">View complete grade breakdown and section ranking.</p>
          <button
            onClick={() => onNavigate('academics')}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2 rounded-xl text-xs border border-slate-700"
          >
            View Gradebook
          </button>
        </div>
      </div>
    </div>
  );
};
