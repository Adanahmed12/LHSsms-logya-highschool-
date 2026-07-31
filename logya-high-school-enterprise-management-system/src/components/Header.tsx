import React, { useState } from 'react';
import {
  GraduationCap,
  Globe,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  BookOpen,
  User as UserIcon,
  Users,
  Briefcase,
  CheckCircle2,
  LogOut,
  UserCheck,
} from 'lucide-react';
import { UserRole, LanguageCode, User as UserType } from '../types';
import { translations } from '../data/translations';

interface HeaderProps {
  currentUser: UserType | null;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onOpenAiAssistant: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  currentRole,
  onRoleChange,
  currentLang,
  onLanguageChange,
  onOpenAiAssistant,
  onLogout,
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const t = translations[currentLang] || translations.EN;

  const roleLabels: Record<UserRole, { label: string; icon: React.ReactNode }> = {
    SUPER_ADMIN: { label: t.roleAdmin || 'Super Admin', icon: <ShieldCheck className="w-4 h-4 text-purple-400" /> },
    ADMIN: { label: t.roleAdmin || 'Admin', icon: <ShieldCheck className="w-4 h-4 text-purple-400" /> },
    TEACHER: { label: t.roleTeacher || 'Teacher', icon: <BookOpen className="w-4 h-4 text-blue-400" /> },
    STUDENT: { label: t.roleStudent || 'Student', icon: <UserIcon className="w-4 h-4 text-emerald-400" /> },
    PARENT: { label: t.roleParent || 'Parent', icon: <Users className="w-4 h-4 text-amber-400" /> },
    STAFF: { label: t.roleStaff || 'Staff', icon: <Briefcase className="w-4 h-4 text-indigo-400" /> },
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Left Brand Banner */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-amber-500 to-amber-600 p-2 rounded-xl shadow-inner flex items-center justify-center text-slate-950 font-bold">
            <GraduationCap className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-white leading-none">
                Logya High School
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" /> EMIS Verified
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              Logya, Afar Regional State, Ethiopia • 2025/2026 Academic Year
            </p>
          </div>
        </div>

        {/* Right Tools & Switchers */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Assistant Button */}
          <button
            onClick={onOpenAiAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-extrabold shadow-md transition active:scale-95"
            title="Open Logya High School Gemini AI Assistant"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span className="hidden sm:inline">AI Advisor</span>
          </button>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLangDropdown(!showLangDropdown);
                setShowRoleDropdown(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs text-slate-200 border border-slate-700 transition"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold uppercase">{currentLang}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showLangDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-1 z-50 text-xs">
                <button
                  onClick={() => {
                    onLanguageChange('EN');
                    setShowLangDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 hover:bg-slate-700 flex items-center justify-between ${
                    currentLang === 'EN' ? 'text-amber-400 font-bold bg-slate-700/50' : 'text-slate-300'
                  }`}
                >
                  <span>English</span>
                  <span className="text-[10px] text-slate-400">EN</span>
                </button>
                <button
                  onClick={() => {
                    onLanguageChange('AM');
                    setShowLangDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 hover:bg-slate-700 flex items-center justify-between ${
                    currentLang === 'AM' ? 'text-amber-400 font-bold bg-slate-700/50' : 'text-slate-300'
                  }`}
                >
                  <span>አማርኛ</span>
                  <span className="text-[10px] text-slate-400">AM</span>
                </button>
                <button
                  onClick={() => {
                    onLanguageChange('AA');
                    setShowLangDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 hover:bg-slate-700 flex items-center justify-between ${
                    currentLang === 'AA' ? 'text-amber-400 font-bold bg-slate-700/50' : 'text-slate-300'
                  }`}
                >
                  <span>Qafaraf</span>
                  <span className="text-[10px] text-slate-400">AA</span>
                </button>
              </div>
            )}
          </div>

          {/* User Profile & Role Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRoleDropdown(!showRoleDropdown);
                setShowLangDropdown(false);
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs shadow-inner">
                {currentUser?.name ? currentUser.name.charAt(0) : currentRole.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-extrabold text-slate-100 truncate max-w-[130px]">
                  {currentUser?.name || 'Logged User'}
                </p>
                <p className="text-[10px] text-amber-400 font-bold leading-none">
                  {roleLabels[currentRole]?.label}
                </p>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-60 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl py-2 z-50 text-xs">
                <div className="px-3 py-2 border-b border-slate-700/80 mb-1">
                  <p className="text-xs font-extrabold text-white">{currentUser?.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{currentUser?.email}</p>
                  <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-extrabold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                    <UserCheck className="w-3 h-3 text-amber-400" /> Active Role: {roleLabels[currentRole]?.label}
                  </div>
                </div>

                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Role View Switcher
                </div>

                {(['SUPER_ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'STAFF'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      onRoleChange(r);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-slate-700/80 flex items-center justify-between transition ${
                      currentRole === r ? 'bg-slate-700/60 font-bold text-amber-400' : 'text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {roleLabels[r]?.icon}
                      <span>{roleLabels[r]?.label}</span>
                    </div>
                  </button>
                ))}

                <div className="mt-2 pt-2 border-t border-slate-700/80 px-2">
                  <button
                    onClick={() => {
                      setShowRoleDropdown(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl font-bold flex items-center gap-2 transition"
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                    <span>Log Out & Exit</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
