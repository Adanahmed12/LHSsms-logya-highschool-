import React, { useState } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  User,
  Lock,
  ArrowRight,
  Globe,
  Sparkles,
  BookOpen,
  Users,
  Briefcase,
  CheckCircle2,
  KeyRound,
  AlertCircle,
} from 'lucide-react';
import { UserRole, LanguageCode, User as UserType } from '../types';
import { translations } from '../data/translations';

interface LoginViewProps {
  onLogin: (user: UserType) => void;
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}

export const DEMO_USERS: (UserType & { passwordHint: string; roleDescription: string })[] = [
  {
    id: 'USR-001',
    username: 'admin',
    name: 'Ato Mohammed Hassan',
    email: 'm.hassan@logyahigh.edu.et',
    role: 'SUPER_ADMIN',
    passwordHint: 'admin123',
    roleDescription: 'Principal & System Admin (Full System Control & EMIS)',
    associatedId: 'LHS-ADMIN-01',
  },
  {
    id: 'USR-002',
    username: 'teacher',
    name: 'W/ro Fatuma Ahmed',
    email: 'f.ahmed@logyahigh.edu.et',
    role: 'TEACHER',
    passwordHint: 'teacher123',
    roleDescription: 'Physics & IT Department Lead Teacher',
    associatedId: 'LHS-T-001',
  },
  {
    id: 'USR-003',
    username: 'student',
    name: 'Bilal Abdu Ibrahim',
    email: 'bilal.abdu@student.logya.edu.et',
    role: 'STUDENT',
    passwordHint: 'student123',
    roleDescription: 'Grade 11 Natural Science Student (LHS/2026/001)',
    associatedId: 'LHS/2026/001',
  },
  {
    id: 'USR-004',
    username: 'parent',
    name: 'Ato Abdu Ibrahim',
    email: 'abdu.ibrahim@gmail.com',
    role: 'PARENT',
    passwordHint: 'parent123',
    roleDescription: 'Guardian of Bilal Abdu (Grade 11-A)',
    associatedId: 'P-10023',
  },
  {
    id: 'USR-005',
    username: 'staff',
    name: 'W/rt Aisha Omer',
    email: 'aisha.o@logyahigh.edu.et',
    role: 'STAFF',
    passwordHint: 'staff123',
    roleDescription: 'Chief Financial Accountant & Registrar',
    associatedId: 'LHS-S-008',
  },
];

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, currentLang, onLanguageChange }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const t = translations[currentLang] || translations.EN;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const found = DEMO_USERS.find(
        (u) =>
          u.username.toLowerCase() === username.trim().toLowerCase() &&
          (password === u.passwordHint || password === 'admin123' || password === '123456')
      );

      if (found) {
        onLogin(found);
      } else {
        setError('Invalid username or password. You can click any Quick Demo Account below to log in instantly.');
        setIsLoading(false);
      }
    }, 200);
  };

  const handleQuickLogin = (demoUser: UserType) => {
    setUsername(demoUser.username);
    setPassword('admin123');
    setIsLoading(true);

    setTimeout(() => {
      onLogin(demoUser);
    }, 150);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950 relative overflow-hidden">
      {/* Background Decorative Gradient Blurs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-amber-500 to-amber-600 p-2.5 rounded-2xl shadow-lg flex items-center justify-center text-slate-950 font-bold">
            <GraduationCap className="w-7 h-7 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-lg sm:text-xl text-white tracking-tight">Logya High School</h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" /> EMIS Verified
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Logya, Afar Regional State • Ethiopia</p>
          </div>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-amber-400" />
          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              type="button"
              onClick={() => onLanguageChange('EN')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                currentLang === 'EN' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('AM')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                currentLang === 'AM' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              አማ
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('AA')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                currentLang === 'AA' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              QAF
            </button>
          </div>
        </div>
      </header>

      {/* Main Login Workspace */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Branding & Features Info */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Next-Gen School Portal • 2025/2026 Academic Year</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Role-Based Unified Portal for <span className="text-amber-400">Logya High School</span>
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed">
              Log in with your designated account credentials. The system will automatically serve the customized interface, permission set, and academic records specifically tailored to your role.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-purple-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">Super Admin</h4>
                  <p className="text-[11px] text-slate-400">Full System & Reports</p>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-blue-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">Teachers</h4>
                  <p className="text-[11px] text-slate-400">Attendance & Marks</p>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl flex items-center gap-3">
                <GraduationCap className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">Students</h4>
                  <p className="text-[11px] text-slate-400">Portal & Online Exams</p>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl flex items-center gap-3">
                <Users className="w-6 h-6 text-amber-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">Parents</h4>
                  <p className="text-[11px] text-slate-400">Child Progress & Fees</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Login Box */}
          <div className="lg:col-span-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
              <div className="mb-6">
                <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-amber-400" /> Account Authentication
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Enter your assigned username and password to proceed.
                </p>
              </div>

              {error && (
                <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start gap-3 text-red-300 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Username / ID
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. admin, teacher, student"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-white focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Security Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-white focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Authenticating Role...</span>
                  ) : (
                    <>
                      <span>Log In to Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* 1-Click Demo Roles Section */}
              <div className="mt-6 pt-5 border-t border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Instant 1-Click Role Login
                  </span>
                  <span className="text-[10px] text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-full">
                    Demo Mode
                  </span>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                  {DEMO_USERS.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => handleQuickLogin(user)}
                      className="w-full text-left p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-amber-500/50 hover:bg-slate-800/50 transition flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg font-black flex items-center justify-center text-xs shrink-0 ${
                            user.role === 'SUPER_ADMIN'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : user.role === 'TEACHER'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : user.role === 'STUDENT'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : user.role === 'PARENT'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          }`}
                        >
                          {user.role.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-extrabold text-white group-hover:text-amber-400 transition truncate">
                            {user.name}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">{user.roleDescription}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 group-hover:text-amber-400 shrink-0 ml-2">
                        Login &rarr;
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500">
        <p>
          Logya High School Information System • Afar Regional Education Bureau • Powering Academic Excellence
        </p>
      </footer>
    </div>
  );
};
