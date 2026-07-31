import React, { useState } from 'react';
import {
  BookOpenCheck,
  Search,
  Award,
  FileSpreadsheet,
  FileText,
  Printer,
  X,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  UserCheck,
} from 'lucide-react';
import { Student, Subject, AcademicMark, GradeLevel, SectionName, LanguageCode } from '../types';
import { translations } from '../data/translations';
import { exportToPDF, exportToExcel, triggerPrint } from '../utils/exportUtils';

interface AcademicViewProps {
  students: Student[];
  subjects: Subject[];
  academicMarks: AcademicMark[];
  onUpdateMark: (updatedMark: AcademicMark) => void;
  currentLang: LanguageCode;
}

export const AcademicView: React.FC<AcademicViewProps> = ({
  students,
  subjects,
  academicMarks,
  onUpdateMark,
  currentLang,
}) => {
  const t = translations[currentLang];

  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('11');
  const [selectedSection, setSelectedSection] = useState<SectionName>('A');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('SUB-01'); // Math default
  const [selectedStudentForTranscript, setSelectedStudentForTranscript] = useState<Student | null>(null);

  const gradeStudents = students.filter((s) => s.grade === selectedGrade && s.section === selectedSection);
  const currentSubject = subjects.find((sub) => sub.id === selectedSubjectId) || subjects[0];

  // Helper to get or default mark
  const getMarkForStudent = (studentId: string): AcademicMark => {
    const existing = academicMarks.find(
      (m) => m.studentId === studentId && m.subjectId === selectedSubjectId
    );
    if (existing) return existing;

    return {
      id: `MRK-${studentId}-${selectedSubjectId}`,
      studentId,
      subjectId: selectedSubjectId,
      subjectName: currentSubject.name,
      academicYear: '2025/2026',
      semester: 'SEMESTER_1',
      continuousAssessment: 16,
      midExam: 24,
      finalExam: 42,
      totalMark: 82,
      letterGrade: 'A',
    };
  };

  const calculateGrade = (total: number): 'A' | 'B' | 'C' | 'D' | 'F' => {
    if (total >= 85) return 'A';
    if (total >= 75) return 'B';
    if (total >= 60) return 'C';
    if (total >= 50) return 'D';
    return 'F';
  };

  const handleMarkChange = (
    studentId: string,
    field: 'continuousAssessment' | 'midExam' | 'finalExam',
    val: number
  ) => {
    const current = getMarkForStudent(studentId);
    const updated = { ...current, [field]: val };
    updated.totalMark = Number(updated.continuousAssessment) + Number(updated.midExam) + Number(updated.finalExam);
    updated.letterGrade = calculateGrade(updated.totalMark);
    onUpdateMark(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <BookOpenCheck className="w-6 h-6 text-purple-400" />
            <h1 className="text-xl font-extrabold text-white">{t.navAcademics}</h1>
            <span className="bg-purple-500/20 text-purple-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-purple-500/30">
              Grade {selectedGrade}-{selectedSection} Gradebook
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Logya High School Continuous Assessment (20%), Mid-Term (30%), & Final Exam (50%) Gradebook
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={triggerPrint}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-400" />
            <span>Print Gradebook</span>
          </button>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Grade:</label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value as GradeLevel)}
              className="bg-slate-800 text-white font-bold px-3 py-2 rounded-xl border border-slate-700 focus:outline-none"
            >
              <option value="9">Grade 9</option>
              <option value="10">Grade 10</option>
              <option value="11">Grade 11</option>
              <option value="12">Grade 12</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Section:</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value as SectionName)}
              className="bg-slate-800 text-white font-bold px-3 py-2 rounded-xl border border-slate-700 focus:outline-none"
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
              <option value="D">Section D</option>
              <option value="E">Section E</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Subject Course:</label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="bg-slate-800 text-amber-400 font-bold px-3 py-2 rounded-xl border border-slate-700 focus:outline-none"
            >
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name} ({sub.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Gradebook Matrix Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Student & Adm No</th>
                <th className="py-3 px-4 text-center">Continuous Assmt (20%)</th>
                <th className="py-3 px-4 text-center">Mid Exam (30%)</th>
                <th className="py-3 px-4 text-center">Final Exam (50%)</th>
                <th className="py-3 px-4 text-center">Total (100%)</th>
                <th className="py-3 px-4 text-center">Grade</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {gradeStudents.map((st) => {
                const mark = getMarkForStudent(st.id);
                return (
                  <tr key={st.id} className="hover:bg-slate-800/50 transition">
                    <td className="py-3 px-4 font-bold text-white">
                      <div>
                        <p>{st.fullName}</p>
                        <p className="text-[10px] text-amber-400 font-mono">{st.admissionNo}</p>
                      </div>
                    </td>

                    {/* CA (20%) */}
                    <td className="py-3 px-4 text-center">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={mark.continuousAssessment}
                        onChange={(e) =>
                          handleMarkChange(st.id, 'continuousAssessment', Math.min(20, Math.max(0, Number(e.target.value))))
                        }
                        className="w-16 bg-slate-800 text-center font-bold text-white py-1 rounded-lg border border-slate-700 focus:border-amber-500"
                      />
                    </td>

                    {/* Mid (30%) */}
                    <td className="py-3 px-4 text-center">
                      <input
                        type="number"
                        min="0"
                        max="30"
                        value={mark.midExam}
                        onChange={(e) =>
                          handleMarkChange(st.id, 'midExam', Math.min(30, Math.max(0, Number(e.target.value))))
                        }
                        className="w-16 bg-slate-800 text-center font-bold text-white py-1 rounded-lg border border-slate-700 focus:border-amber-500"
                      />
                    </td>

                    {/* Final (50%) */}
                    <td className="py-3 px-4 text-center">
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={mark.finalExam}
                        onChange={(e) =>
                          handleMarkChange(st.id, 'finalExam', Math.min(50, Math.max(0, Number(e.target.value))))
                        }
                        className="w-16 bg-slate-800 text-center font-bold text-white py-1 rounded-lg border border-slate-700 focus:border-amber-500"
                      />
                    </td>

                    <td className="py-3 px-4 text-center font-extrabold text-sm text-amber-400">
                      {mark.totalMark}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-black ${
                          mark.letterGrade === 'A'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : mark.letterGrade === 'B'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {mark.letterGrade}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedStudentForTranscript(st)}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-[11px] font-bold transition"
                      >
                        Generate Transcript
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* OFFICIAL STUDENT TRANSCRIPT MODAL */}
      {selectedStudentForTranscript && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setSelectedStudentForTranscript(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Transcript Printable Sheet */}
            <div className="bg-slate-950 border-2 border-slate-700 p-6 rounded-2xl text-white space-y-4">
              <div className="text-center border-b border-slate-800 pb-4">
                <h2 className="text-lg font-black text-amber-400 uppercase tracking-wide">
                  LOGYA HIGH SCHOOL - OFFICIAL TRANSCRIPT
                </h2>
                <p className="text-xs text-slate-300">Logya Town, Afar Regional State, Ethiopia</p>
                <p className="text-[11px] text-slate-400">Academic Year: 2025/2026 (2018 E.C.) • Semester I</p>
              </div>

              {/* Student Metadata Header */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-900 p-3 rounded-xl border border-slate-800">
                <div>
                  <p><span className="text-slate-400">Student Name:</span> <strong className="text-white">{selectedStudentForTranscript.fullName}</strong></p>
                  <p><span className="text-slate-400">Admission No:</span> <strong className="text-amber-400">{selectedStudentForTranscript.admissionNo}</strong></p>
                </div>
                <div>
                  <p><span className="text-slate-400">Class:</span> <strong className="text-white">Grade {selectedStudentForTranscript.grade} - Section {selectedStudentForTranscript.section}</strong></p>
                  <p><span className="text-slate-400">Stream:</span> <strong className="text-white">{selectedStudentForTranscript.stream}</strong></p>
                </div>
              </div>

              {/* Marks Table */}
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                    <th className="py-2">Subject</th>
                    <th className="py-2 text-center">CA (20%)</th>
                    <th className="py-2 text-center">Mid (30%)</th>
                    <th className="py-2 text-center">Final (50%)</th>
                    <th className="py-2 text-center">Total</th>
                    <th className="py-2 text-center">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {subjects.slice(0, 6).map((sub) => (
                    <tr key={sub.id}>
                      <td className="py-2 font-semibold text-white">{sub.name}</td>
                      <td className="py-2 text-center text-slate-300">18</td>
                      <td className="py-2 text-center text-slate-300">26</td>
                      <td className="py-2 text-center text-slate-300">45</td>
                      <td className="py-2 text-center font-bold text-amber-400">89</td>
                      <td className="py-2 text-center font-extrabold text-emerald-400">A</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <p className="text-slate-400">Semester Average: <strong className="text-amber-400">88.5%</strong></p>
                  <p className="text-slate-400">Section Rank: <strong className="text-emerald-400">1st / 45 Students</strong></p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400">Principal Signature & Stamp</p>
                  <p className="text-[10px] text-slate-500 mt-2">Ato Mohammed Hassan Ali</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={triggerPrint}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Transcript</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
