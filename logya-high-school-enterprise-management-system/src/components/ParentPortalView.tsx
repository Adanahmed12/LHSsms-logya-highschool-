import React from 'react';
import { UserCheck2, CalendarCheck, Award, Receipt, MessageSquare, Phone } from 'lucide-react';
import { Student, AcademicMark, FeePayment, LanguageCode } from '../types';

interface ParentPortalViewProps {
  students: Student[];
  academicMarks: AcademicMark[];
  feePayments: FeePayment[];
  currentLang: LanguageCode;
}

export const ParentPortalView: React.FC<ParentPortalViewProps> = ({
  students,
  academicMarks,
  feePayments,
  currentLang,
}) => {
  const child = students[0]; // Amina Ibrahim Hassan

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 border border-amber-500/30 p-5 rounded-2xl text-white">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500 text-slate-950 rounded-2xl font-bold">
            <UserCheck2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
              Logya High Guardian Portal
            </span>
            <h1 className="text-xl font-extrabold text-white mt-1">
              Welcome, Guardian Ato Ibrahim Hassan Ali
            </h1>
            <p className="text-xs text-slate-300">
              Monitoring Child: <strong className="text-amber-300">{child.fullName}</strong> ({child.admissionNo} • Grade {child.grade}-{child.section})
            </p>
          </div>
        </div>
      </div>

      {/* Child Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Attendance */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Attendance Record</span>
            <CalendarCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-400">98.5% Present</p>
          <p className="text-[11px] text-slate-400">100% On-time arrival rate this semester</p>
        </div>

        {/* Exam GPA */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Semester GPA Rank</span>
            <Award className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-amber-400">1st in Section 11-A</p>
          <p className="text-[11px] text-slate-400">Average Score: 89.4% (Grade A)</p>
        </div>

        {/* Fee Payment */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Fee Account Status</span>
            <Receipt className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-2xl font-extrabold text-blue-400">Fully Paid (0 ETB Balance)</p>
          <p className="text-[11px] text-slate-400">CBE Birr Receipt REC-2026-081</p>
        </div>
      </div>

      {/* Recent Grade Summary */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          Child's Continuous Assessment & Exam Report Card
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800 text-slate-400 text-[10px] uppercase">
              <tr>
                <th className="py-2.5 px-3">Subject Course</th>
                <th className="py-2.5 px-3 text-center">CA (20%)</th>
                <th className="py-2.5 px-3 text-center">Mid (30%)</th>
                <th className="py-2.5 px-3 text-center">Final (50%)</th>
                <th className="py-2.5 px-3 text-center">Total</th>
                <th className="py-2.5 px-3 text-center">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {academicMarks.slice(0, 3).map((m) => (
                <tr key={m.id}>
                  <td className="py-2.5 px-3 font-bold text-white">{m.subjectName}</td>
                  <td className="py-2.5 px-3 text-center text-slate-300">{m.continuousAssessment}</td>
                  <td className="py-2.5 px-3 text-center text-slate-300">{m.midExam}</td>
                  <td className="py-2.5 px-3 text-center text-slate-300">{m.finalExam}</td>
                  <td className="py-2.5 px-3 text-center font-extrabold text-amber-400">{m.totalMark}</td>
                  <td className="py-2.5 px-3 text-center font-black text-emerald-400">{m.letterGrade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
