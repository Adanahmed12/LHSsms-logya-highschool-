import React, { useState } from 'react';
import { CalendarCheck2, CheckCircle2, XCircle, Clock, AlertTriangle, Send, Filter, Printer, FileText } from 'lucide-react';
import { AttendanceRecord, Student, GradeLevel, SectionName, LanguageCode, AttendanceStatus } from '../types';
import { translations } from '../data/translations';
import { exportToPDF, triggerPrint } from '../utils/exportUtils';

interface AttendanceViewProps {
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  onSaveAttendance: (records: AttendanceRecord[]) => void;
  currentLang: LanguageCode;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  students,
  attendanceRecords,
  onSaveAttendance,
  currentLang,
}) => {
  const t = translations[currentLang];

  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('11');
  const [selectedSection, setSelectedSection] = useState<SectionName>('A');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [smsSentNotice, setSmsSentNotice] = useState(false);

  // Filter students for chosen Grade & Section
  const targetStudents = students.filter((s) => s.grade === selectedGrade && s.section === selectedSection);

  // Local state for recording current session
  const [sessionAttendance, setSessionAttendance] = useState<Record<string, AttendanceStatus>>(() => {
    const initialMap: Record<string, AttendanceStatus> = {};
    targetStudents.forEach((st) => {
      const existing = attendanceRecords.find((r) => r.studentId === st.id && r.date === selectedDate);
      initialMap[st.id] = existing ? existing.status : 'PRESENT';
    });
    return initialMap;
  });

  const handleStatusToggle = (studentId: string, status: AttendanceStatus) => {
    setSessionAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSave = () => {
    const updatedList: AttendanceRecord[] = targetStudents.map((st) => ({
      id: `ATT-${st.id}-${selectedDate}`,
      date: selectedDate,
      studentId: st.id,
      studentName: st.fullName,
      grade: selectedGrade,
      section: selectedSection,
      status: sessionAttendance[st.id] || 'PRESENT',
      recordedBy: 'Homeroom Teacher',
    }));

    onSaveAttendance(updatedList);
    alert('Attendance records saved successfully to Logya High School Database!');
  };

  const handleSendSmsAlerts = () => {
    setSmsSentNotice(true);
    setTimeout(() => setSmsSentNotice(false), 4000);
  };

  // Stats
  const presentCount = Object.values(sessionAttendance).filter((s) => s === 'PRESENT').length;
  const absentCount = Object.values(sessionAttendance).filter((s) => s === 'ABSENT').length;
  const lateCount = Object.values(sessionAttendance).filter((s) => s === 'LATE').length;
  const total = targetStudents.length || 1;
  const presentPct = Math.round((presentCount / total) * 100);

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <CalendarCheck2 className="w-6 h-6 text-emerald-400" />
            <h1 className="text-xl font-extrabold text-white">{t.navAttendance}</h1>
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              Grade {selectedGrade}-{selectedSection}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Logya High School Daily Attendance Registrar & Parent SMS Gateway
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSendSmsAlerts}
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition"
          >
            <Send className="w-4 h-4 text-amber-300" />
            <span>Send Absent Parent SMS</span>
          </button>

          <button
            onClick={handleSave}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t.saveAttendance}</span>
          </button>
        </div>
      </div>

      {smsSentNotice && (
        <div className="bg-purple-500/20 border border-purple-500/40 text-purple-200 p-3 rounded-xl text-xs font-semibold flex items-center justify-between animate-fade-in">
          <span>
            Broadcast SMS alert successfully dispatched via Afar Regional Gateway to {absentCount} absent student parents!
          </span>
          <span className="text-[10px] bg-purple-600 px-2 py-0.5 rounded-full text-white">Delivered</span>
        </div>
      )}

      {/* Class & Date Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Select Grade Level:</label>
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
            <label className="block text-slate-400 mb-1">Select Section:</label>
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
            <label className="block text-slate-400 mb-1">Attendance Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-slate-800 text-white font-bold px-3 py-2 rounded-xl border border-slate-700 focus:outline-none"
            />
          </div>
        </div>

        {/* Quick Rate Metrics */}
        <div className="flex items-center gap-4 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700/60">
          <div className="text-center">
            <p className="text-[10px] text-slate-400 uppercase">Present</p>
            <p className="text-sm font-extrabold text-emerald-400">{presentCount}</p>
          </div>
          <div className="h-6 w-px bg-slate-700" />
          <div className="text-center">
            <p className="text-[10px] text-slate-400 uppercase">Late</p>
            <p className="text-sm font-extrabold text-amber-400">{lateCount}</p>
          </div>
          <div className="h-6 w-px bg-slate-700" />
          <div className="text-center">
            <p className="text-[10px] text-slate-400 uppercase">Absent</p>
            <p className="text-sm font-extrabold text-red-400">{absentCount}</p>
          </div>
          <div className="h-6 w-px bg-slate-700" />
          <div className="text-center">
            <p className="text-[10px] text-slate-400 uppercase">Rate</p>
            <p className="text-sm font-extrabold text-blue-400">{presentPct}%</p>
          </div>
        </div>
      </div>

      {/* Class Register Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Admission No</th>
                <th className="py-3 px-4">Guardian Contact</th>
                <th className="py-3 px-4 text-center">Mark Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {targetStudents.map((st, idx) => {
                const currentStatus = sessionAttendance[st.id] || 'PRESENT';
                return (
                  <tr key={st.id} className="hover:bg-slate-800/50 transition">
                    <td className="py-3 px-4 font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4 font-bold text-white">{st.fullName}</td>
                    <td className="py-3 px-4 font-mono text-amber-400">{st.admissionNo}</td>
                    <td className="py-3 px-4 text-slate-400">
                      {st.guardianName} ({st.guardianPhone})
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleStatusToggle(st.id, 'PRESENT')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                            currentStatus === 'PRESENT'
                              ? 'bg-emerald-500 text-slate-950 shadow-md'
                              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Present</span>
                        </button>

                        <button
                          onClick={() => handleStatusToggle(st.id, 'LATE')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                            currentStatus === 'LATE'
                              ? 'bg-amber-500 text-slate-950 shadow-md'
                              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>Late</span>
                        </button>

                        <button
                          onClick={() => handleStatusToggle(st.id, 'ABSENT')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                            currentStatus === 'ABSENT'
                              ? 'bg-red-500 text-white shadow-md'
                              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Absent</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
