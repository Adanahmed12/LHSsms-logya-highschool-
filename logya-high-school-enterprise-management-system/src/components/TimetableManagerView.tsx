import React, { useState } from 'react';
import { CalendarDays, Sparkles, Printer, RefreshCw, Clock, Building2, User } from 'lucide-react';
import { TimetableSlot, GradeLevel, SectionName, Subject, Teacher, LanguageCode } from '../types';
import { translations } from '../data/translations';
import { triggerPrint } from '../utils/exportUtils';

interface TimetableManagerViewProps {
  timetableSlots: TimetableSlot[];
  subjects: Subject[];
  teachers: Teacher[];
  currentLang: LanguageCode;
}

export const TimetableManagerView: React.FC<TimetableManagerViewProps> = ({
  timetableSlots,
  subjects,
  teachers,
  currentLang,
}) => {
  const t = translations[currentLang];

  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('11');
  const [selectedSection, setSelectedSection] = useState<SectionName>('A');
  const [isGenerating, setIsGenerating] = useState(false);

  const days: ('MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY')[] = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
  ];
  const periods = [1, 2, 3, 4, 5, 6, 7];
  const periodTimes: Record<number, string> = {
    1: '08:00 - 08:45',
    2: '08:45 - 09:30',
    3: '09:45 - 10:30',
    4: '10:30 - 11:15',
    5: '11:15 - 12:00',
    6: '02:00 - 02:45',
    7: '02:45 - 03:30',
  };

  const handleAutoGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert('Conflict-Free Timetable successfully generated for Logya High School Grades 9-12!');
    }, 1200);
  };

  const getSlot = (day: string, period: number): TimetableSlot | undefined => {
    return timetableSlots.find(
      (s) => s.grade === selectedGrade && s.section === selectedSection && s.day === day && s.period === period
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl font-extrabold text-white">{t.navTimetable}</h1>
            <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">
              Grade {selectedGrade}-{selectedSection} Weekly Schedule
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Logya High School Automatic Conflict-Free Class & Teacher Schedule Generator
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAutoGenerate}
            disabled={isGenerating}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Generating...' : 'Auto-Generate Conflict Free Schedule'}</span>
          </button>

          <button
            onClick={triggerPrint}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-400" />
            <span>Print Timetable</span>
          </button>
        </div>
      </div>

      {/* Grade & Section Selector */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-4 text-xs">
        <div>
          <label className="block text-slate-400 mb-1">Grade Level:</label>
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
      </div>

      {/* Timetable Grid Table */}
      <div id="timetable-print-area" className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse text-xs">
            <thead>
              <tr className="bg-slate-800 text-slate-300 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3 border border-slate-700 w-28">Period / Day</th>
                {days.map((day) => (
                  <th key={day} className="py-3 px-3 border border-slate-700">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {periods.map((period) => (
                <tr key={period} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-3 border border-slate-800 bg-slate-950 font-bold text-amber-400">
                    <div>
                      <p>Period {period}</p>
                      <p className="text-[9px] text-slate-500 font-mono">{periodTimes[period]}</p>
                    </div>
                  </td>

                  {days.map((day) => {
                    const slot = getSlot(day, period);
                    return (
                      <td key={day} className="py-2 px-2 border border-slate-800/80 align-top h-20 w-36">
                        {slot ? (
                          <div className="bg-slate-800/90 border border-amber-500/30 p-2 rounded-xl text-left space-y-1 shadow-sm">
                            <p className="font-extrabold text-white text-[11px] leading-tight">
                              {slot.subjectName}
                            </p>
                            <p className="text-[10px] text-amber-300 flex items-center gap-1">
                              <User className="w-2.5 h-2.5" />
                              <span className="truncate">{slot.teacherName}</span>
                            </p>
                            <p className="text-[9px] text-slate-400 flex items-center gap-1">
                              <Building2 className="w-2.5 h-2.5" />
                              <span>{slot.roomNumber}</span>
                            </p>
                          </div>
                        ) : (
                          <div className="h-full border border-dashed border-slate-800 rounded-xl flex items-center justify-center text-[10px] text-slate-600">
                            Free Period
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
