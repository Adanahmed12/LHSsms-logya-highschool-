import React from 'react';
import { Video, FileText, Download, Upload, BookOpen, Film, Presentation } from 'lucide-react';
import { LearningMaterial, LanguageCode } from '../types';
import { translations } from '../data/translations';

interface DigitalLearningViewProps {
  materials: LearningMaterial[];
  currentLang: LanguageCode;
}

export const DigitalLearningView: React.FC<DigitalLearningViewProps> = ({ materials, currentLang }) => {
  const t = translations[currentLang];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <Video className="w-6 h-6 text-indigo-400" />
            <h1 className="text-xl font-extrabold text-white">{t.navDigitalLearning}</h1>
            <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-indigo-500/30">
              E-Learning Repository
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Logya High School Digital Learning Platform • Video Lessons, Course Notes & Assignments
          </p>
        </div>

        <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition">
          <Upload className="w-4 h-4" />
          <span>Upload New Material</span>
        </button>
      </div>

      {/* Materials Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {materials.map((mat) => (
          <div key={mat.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 hover:border-slate-700 transition">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
                  {mat.materialType === 'VIDEO' ? <Film className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                </div>
                <div>
                  <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                    Grade {mat.grade} • {mat.subjectName}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1 leading-tight">{mat.title}</h3>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400">{mat.description}</p>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <span>By {mat.teacherName}</span>
              <button className="bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1">
                <Download className="w-3.5 h-3.5" /> Download ({mat.fileSize})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
