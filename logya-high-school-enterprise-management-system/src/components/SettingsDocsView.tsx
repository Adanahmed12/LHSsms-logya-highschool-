import React, { useState } from 'react';
import { Settings2, Database, BookOpen, ShieldCheck, FileCode, CheckCircle2, Copy } from 'lucide-react';
import { LanguageCode } from '../types';
import { translations } from '../data/translations';

interface SettingsDocsViewProps {
  currentLang: LanguageCode;
}

export const SettingsDocsView: React.FC<SettingsDocsViewProps> = ({ currentLang }) => {
  const t = translations[currentLang];
  const [activeTab, setActiveTab] = useState<'DATABASE' | 'ERD' | 'DICTIONARY' | 'MANUALS'>('DATABASE');
  const [copied, setCopied] = useState(false);

  const sqlDDL = `
-- LOGYA HIGH SCHOOL ENTERPRISE MANAGEMENT SYSTEM
-- MySQL 8.0 3NF Normalized Database Schema
-- Location: Logya, Afar Regional State, Ethiopia

CREATE TABLE students (
  id VARCHAR(50) PRIMARY KEY,
  admission_no VARCHAR(50) NOT NULL UNIQUE,
  full_name VARCHAR(200) NOT NULL,
  gender ENUM('MALE', 'FEMALE') NOT NULL,
  date_of_birth DATE NOT NULL,
  grade ENUM('9', '10', '11', '12') NOT NULL,
  section ENUM('A', 'B', 'C', 'D', 'E') NOT NULL,
  stream ENUM('NATURAL_SCIENCE', 'SOCIAL_SCIENCE', 'GENERAL') DEFAULT 'GENERAL',
  guardian_name VARCHAR(200) NOT NULL,
  guardian_phone VARCHAR(50) NOT NULL,
  status ENUM('ACTIVE', 'TRANSFERRED', 'PROMOTED', 'GRADUATED') DEFAULT 'ACTIVE',
  INDEX idx_student_grade_sec (grade, section)
) ENGINE=InnoDB;

CREATE TABLE academic_marks (
  id VARCHAR(50) PRIMARY KEY,
  student_id VARCHAR(50) NOT NULL,
  subject_id VARCHAR(50) NOT NULL,
  continuous_assessment DECIMAL(5,2) DEFAULT 0.00, -- Max 20
  mid_exam DECIMAL(5,2) DEFAULT 0.00, -- Max 30
  final_exam DECIMAL(5,2) DEFAULT 0.00, -- Max 50
  total_mark DECIMAL(5,2) DEFAULT 0.00,
  letter_grade CHAR(2),
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
) ENGINE=InnoDB;
  `;

  const copySql = () => {
    navigator.clipboard.writeText(sqlDDL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <Settings2 className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl font-extrabold text-white">{t.navSettingsDocs}</h1>
            <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">
              Database DDL & System Manuals
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Logya High School Complete Architecture Specifications, ER Diagram & User Guides
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('DATABASE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'DATABASE' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white bg-slate-800/60'
          }`}
        >
          SQL DDL Schema
        </button>
        <button
          onClick={() => setActiveTab('ERD')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'ERD' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white bg-slate-800/60'
          }`}
        >
          ER Diagram
        </button>
        <button
          onClick={() => setActiveTab('DICTIONARY')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'DICTIONARY' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white bg-slate-800/60'
          }`}
        >
          Data Dictionary
        </button>
        <button
          onClick={() => setActiveTab('MANUALS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'MANUALS' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white bg-slate-800/60'
          }`}
        >
          System Manuals
        </button>
      </div>

      {/* SQL DDL VIEW */}
      {activeTab === 'DATABASE' && (
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <FileCode className="w-4 h-4 text-emerald-400" />
              MySQL 8.0 3NF Relational Database Script
            </h3>
            <button
              onClick={copySql}
              className="bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold px-3 py-1.5 rounded-xl text-xs border border-slate-700 flex items-center gap-1"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied!' : 'Copy SQL Script'}</span>
            </button>
          </div>
          <pre className="bg-slate-950 text-emerald-400 font-mono text-xs p-4 rounded-xl overflow-x-auto border border-slate-800">
            {sqlDDL}
          </pre>
        </div>
      )}

      {/* ERD VIEW */}
      {activeTab === 'ERD' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-white space-y-4">
          <h3 className="text-sm font-bold text-white">Logya High School 3NF Relational Entity Relationship Diagram</h3>
          <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl space-y-4 text-xs font-mono">
            <div className="flex items-center justify-around text-center">
              <div className="p-3 bg-blue-500/20 border border-blue-500/40 rounded-xl text-blue-300">
                STUDENTS (PK: id)
              </div>
              <span className="text-amber-400">1 : N</span>
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300">
                ATTENDANCE (FK: student_id)
              </div>
            </div>

            <div className="flex items-center justify-around text-center">
              <div className="p-3 bg-purple-500/20 border border-purple-500/40 rounded-xl text-purple-300">
                SUBJECTS (PK: id)
              </div>
              <span className="text-amber-400">1 : N</span>
              <div className="p-3 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-300">
                MARKS (FK: student_id, subject_id)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DICTIONARY VIEW */}
      {activeTab === 'DICTIONARY' && (
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-xs">
          <h3 className="text-sm font-bold text-white mb-3">Database Data Dictionary (Key Tables)</h3>
          <table className="w-full text-left">
            <thead className="bg-slate-800 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="py-2 px-3">Column Name</th>
                <th className="py-2 px-3">Data Type</th>
                <th className="py-2 px-3">Constraint</th>
                <th className="py-2 px-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              <tr>
                <td className="py-2 px-3 font-mono text-amber-400">admission_no</td>
                <td className="py-2 px-3 font-mono">VARCHAR(50)</td>
                <td className="py-2 px-3 font-bold text-red-400">UNIQUE NOT NULL</td>
                <td className="py-2 px-3">Unique Logya High registration identifier</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-mono text-amber-400">total_mark</td>
                <td className="py-2 px-3 font-mono">DECIMAL(5,2)</td>
                <td className="py-2 px-3">Calculated</td>
                <td className="py-2 px-3">Sum of CA (20%) + Mid (30%) + Final (50%)</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* MANUALS VIEW */}
      {activeTab === 'MANUALS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <h3 className="font-bold text-white text-sm">Administrator Guide</h3>
            <p className="text-slate-400">Complete operations manual for managing student admissions, promotions, staff payroll, and system backups.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <h3 className="font-bold text-white text-sm">Teacher Guide</h3>
            <p className="text-slate-400">Instructions for registering class attendance, entering marks into the 20/30/50 gradebook, and uploading digital materials.</p>
          </div>
        </div>
      )}
    </div>
  );
};
