import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Printer,
  Sparkles,
} from 'lucide-react';
import { OnlineExam, ExamQuestion, ExamResult, LanguageCode } from '../types';
import { translations } from '../data/translations';
import { triggerPrint } from '../utils/exportUtils';

interface OnlineExamViewProps {
  exams: OnlineExam[];
  currentLang: LanguageCode;
}

export const OnlineExamView: React.FC<OnlineExamViewProps> = ({ exams, currentLang }) => {
  const t = translations[currentLang];

  const [activeExam, setActiveExam] = useState<OnlineExam | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(1800); // 30 mins
  const [examSubmittedResult, setExamSubmittedResult] = useState<ExamResult | null>(null);

  useEffect(() => {
    let interval: any = null;
    if (activeExam && !examSubmittedResult && timeLeftSeconds > 0) {
      interval = setInterval(() => {
        setTimeLeftSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeExam, examSubmittedResult, timeLeftSeconds]);

  const handleStartExam = (exam: OnlineExam) => {
    setActiveExam(exam);
    setUserAnswers({});
    setTimeLeftSeconds(exam.durationMinutes * 60);
    setExamSubmittedResult(null);
  };

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const handleSubmitExam = () => {
    if (!activeExam) return;

    let score = 0;
    activeExam.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        score += q.points;
      }
    });

    const percentage = Math.round((score / activeExam.totalPoints) * 100);

    const result: ExamResult = {
      id: `RES-${Date.now()}`,
      examId: activeExam.id,
      examTitle: activeExam.title,
      studentId: 'STU-1001',
      studentName: 'Amina Ibrahim Hassan',
      score,
      totalPoints: activeExam.totalPoints,
      percentage,
      passed: percentage >= 50,
      submittedAt: new Date().toLocaleTimeString(),
    };

    setExamSubmittedResult(result);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-emerald-400" />
            <h1 className="text-xl font-extrabold text-white">{t.navOnlineExam}</h1>
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              Auto-Graded Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Logya High School Online Examination Center • Timed MCQ, True/False & Auto-Graded Assessment
          </p>
        </div>
      </div>

      {!activeExam ? (
        /* Exams Available List */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exams.map((ex) => (
            <div key={ex.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                  Grade {ex.grade} • {ex.subjectName}
                </span>
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> {ex.durationMinutes} Mins
                </span>
              </div>

              <h3 className="text-base font-bold text-white">{ex.title}</h3>
              <p className="text-xs text-slate-400">{ex.instructions}</p>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Total Points: <strong className="text-white">{ex.totalPoints} pts</strong></span>
                <button
                  onClick={() => handleStartExam(ex)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start Online Exam</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* LIVE TIMED EXAM SESSION OR RESULT CERTIFICATE */
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
          {!examSubmittedResult ? (
            /* Live Exam Player */
            <>
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-base font-bold text-white">{activeExam.title}</h2>
                  <p className="text-xs text-slate-400">Logya High School Official Examination Engine</p>
                </div>

                <div className="flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 px-3 py-1.5 rounded-xl text-amber-300 font-mono font-bold text-sm">
                  <Clock className="w-4 h-4 animate-pulse" />
                  <span>Time Remaining: {formatTime(timeLeftSeconds)}</span>
                </div>
              </div>

              <div className="space-y-6">
                {activeExam.questions.map((q, qIdx) => (
                  <div key={q.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                    <p className="text-xs font-bold text-white">
                      Q{qIdx + 1}. {q.questionText} <span className="text-amber-400 font-mono">({q.points} pts)</span>
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      {q.options?.map((opt, optIdx) => (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`p-3 rounded-xl text-left font-semibold border transition ${
                            userAnswers[q.id] === optIdx
                              ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold'
                              : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                          }`}
                        >
                          <span className="font-mono mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setActiveExam(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmitExam}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-lg transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Exam & Auto-Grade</span>
                </button>
              </div>
            </>
          ) : (
            /* EXAM RESULT CERTIFICATE MODAL */
            <div className="space-y-6 text-center">
              <div className="bg-slate-950 border-2 border-emerald-500/60 p-8 rounded-2xl max-w-xl mx-auto space-y-4">
                <div className="p-3 bg-emerald-500/20 text-emerald-400 w-fit rounded-full mx-auto border border-emerald-500/40">
                  <Award className="w-10 h-10" />
                </div>

                <h2 className="text-xl font-black text-amber-400 tracking-wide">
                  EXAMINATION COMPLETION CERTIFICATE
                </h2>
                <p className="text-xs text-slate-400">Logya Secondary School Online Assessment Center</p>

                <div className="py-4 border-y border-slate-800 text-xs space-y-2 text-slate-300">
                  <p><span className="text-slate-400">Student:</span> <strong className="text-white text-sm">{examSubmittedResult.studentName}</strong></p>
                  <p><span className="text-slate-400">Exam Title:</span> {examSubmittedResult.examTitle}</p>
                  <p className="text-lg font-black text-emerald-400 pt-2">
                    Score: {examSubmittedResult.score} / {examSubmittedResult.totalPoints} ({examSubmittedResult.percentage}%)
                  </p>
                  <p className="text-xs font-bold text-emerald-400 uppercase">
                    Status: {examSubmittedResult.passed ? 'PASSED WITH EXCELLENCE' : 'REQUIRES RETAKE'}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveExam(null)}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Back to Exams
                  </button>
                  <button
                    onClick={triggerPrint}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-5 py-2 rounded-xl text-xs flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print Certificate
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
