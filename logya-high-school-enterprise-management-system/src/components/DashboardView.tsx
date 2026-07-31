import React from 'react';
import {
  Users,
  GraduationCap,
  CalendarCheck,
  BookOpen,
  DollarSign,
  TrendingUp,
  UserPlus,
  CheckSquare,
  FileText,
  Send,
  PlusCircle,
  Award,
  AlertCircle,
  Clock,
  ArrowUpRight,
  School,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { SchoolInfo, LanguageCode } from '../types';
import { translations } from '../data/translations';

interface DashboardViewProps {
  schoolInfo: SchoolInfo;
  currentLang: LanguageCode;
  onNavigate: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ schoolInfo, currentLang, onNavigate }) => {
  const t = translations[currentLang];

  // Data for Charts
  const attendanceTrendData = [
    { day: 'Mon', Grade9: 95, Grade10: 97, Grade11: 98, Grade12: 96 },
    { day: 'Tue', Grade9: 96, Grade10: 96, Grade11: 97, Grade12: 97 },
    { day: 'Wed', Grade9: 94, Grade10: 98, Grade11: 99, Grade12: 98 },
    { day: 'Thu', Grade9: 97, Grade10: 95, Grade11: 97, Grade12: 95 },
    { day: 'Fri', Grade9: 98, Grade10: 99, Grade11: 98, Grade12: 99 },
  ];

  const gradeDistributionData = [
    { name: 'Grade 9', students: 510, color: '#3b82f6' },
    { name: 'Grade 10', students: 480, color: '#10b981' },
    { name: 'Grade 11', students: 440, color: '#f59e0b' },
    { name: 'Grade 12', students: 412, color: '#8b5cf6' },
  ];

  const financialTrendData = [
    { month: 'Sep', Revenue: 320000, Expense: 95000 },
    { month: 'Oct', Revenue: 280000, Expense: 88000 },
    { month: 'Nov', Revenue: 210000, Expense: 110000 },
    { month: 'Dec', Revenue: 180000, Expense: 92000 },
    { month: 'Jan', Revenue: 255000, Expense: 100000 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 text-white shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-emerald-500/5 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-500/20 text-amber-400 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">
                Logya, Afar Region
              </span>
              <span className="text-slate-400 text-xs">• 1,842 Enrolled Students</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Logya High School Management Dashboard
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Real-time EMIS analytics for Logya Secondary & Preparatory School. Managing Grades 9-12 with automated attendance, gradebook, financial ledgers, and multi-language support.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('students')}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t.registerStudent}</span>
            </button>
            <button
              onClick={() => onNavigate('attendance')}
              className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-xs font-bold border border-slate-700 transition flex items-center gap-1.5"
            >
              <CheckSquare className="w-4 h-4 text-emerald-400" />
              <span>{t.markAttendance}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Students */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">{t.totalStudents}</span>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">1,842</span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +4.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Grades 9 to 12 (Sec A-E)</p>
        </div>

        {/* Total Teachers */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">{t.totalTeachers}</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">82</span>
            <span className="text-xs text-slate-400 font-medium">Full-Time Staff</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">8 Academic Departments</p>
        </div>

        {/* Attendance Rate */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">{t.todayAttendance}</span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">96.4%</span>
            <span className="text-xs text-emerald-400 font-semibold">1,775 Present</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">67 Excused / Absent</p>
        </div>

        {/* Library Catalogue */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">{t.libraryBooks}</span>
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">565</span>
            <span className="text-xs text-slate-400 font-medium">Textbooks & Ref</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">471 Copies Available</p>
        </div>

        {/* Revenue Collection */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">{t.totalRevenue}</span>
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-white">1,245,000 ETB</span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 font-semibold">Net Surplus: +760,000 ETB</p>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Rate Area Chart */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-emerald-400" />
                Weekly Student Attendance Rate (%)
              </h2>
              <p className="text-xs text-slate-400">Daily presence tracking by Grade level</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorG11" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorG12" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[80, 100]} stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="Grade11" stroke="#f59e0b" fillOpacity={1} fill="url(#colorG11)" />
                <Area type="monotone" dataKey="Grade12" stroke="#10b981" fillOpacity={1} fill="url(#colorG12)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grade Distribution Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <School className="w-4 h-4 text-blue-400" />
                Student Enrollment Breakdown by Grade
              </h2>
              <p className="text-xs text-slate-400">Total student population across Grades 9 - 12</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeDistributionData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="students" radius={[8, 8, 0, 0]}>
                  {gradeDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Financial Overview & Quick Action Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Flow */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                Semester Revenue & Expense Ledger (ETB)
              </h2>
              <p className="text-xs text-slate-400">Monthly financial cashflow analysis</p>
            </div>
            <button
              onClick={() => onNavigate('finance')}
              className="text-xs text-amber-400 hover:underline font-semibold"
            >
              View Full Finance →
            </button>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Activity Feeds */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-amber-400" />
              Upcoming Academic Schedule
            </h2>
            <div className="space-y-2.5">
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-100">Grade 12 EUEEE Mock Exam</p>
                  <p className="text-[11px] text-slate-400">Natural & Social Science Streams</p>
                </div>
                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                  Mon, Aug 04
                </span>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-100">PTA & Regional Education Assembly</p>
                  <p className="text-[11px] text-slate-400">Logya Town Assembly Hall</p>
                </div>
                <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30">
                  Fri, Aug 08
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <p className="text-[11px] font-semibold text-slate-400 mb-2">System Quick Shortcuts:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onNavigate('academics')}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
              >
                <FileText className="w-3.5 h-3.5 text-purple-400" />
                <span>Marks Entry</span>
              </button>
              <button
                onClick={() => onNavigate('communication')}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
              >
                <Send className="w-3.5 h-3.5 text-emerald-400" />
                <span>Send SMS</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
