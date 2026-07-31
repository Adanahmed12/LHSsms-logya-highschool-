import React, { useState } from 'react';
import { MessageSquare, Send, Bell, AlertTriangle, CheckCircle2, PhoneCall } from 'lucide-react';
import { Announcement, LanguageCode } from '../types';
import { translations } from '../data/translations';

interface CommunicationViewProps {
  announcements: Announcement[];
  currentLang: LanguageCode;
}

export const CommunicationView: React.FC<CommunicationViewProps> = ({ announcements, currentLang }) => {
  const t = translations[currentLang];

  const [smsRecipient, setSmsRecipient] = useState<'ALL_PARENTS' | 'GRADE_11_PARENTS' | 'TEACHERS'>('ALL_PARENTS');
  const [smsMessage, setSmsMessage] = useState('Logya High School Notice: Final Semester I examinations commence next Monday. Please ensure students arrive at 8:00 AM.');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const handleSendBroadcastSMS = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-emerald-400" />
            <h1 className="text-xl font-extrabold text-white">{t.navCommunication}</h1>
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              Afar Telecom Regional Gateway
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Logya High School SMS Broadcast & Emergency Parent Alert Center
          </p>
        </div>
      </div>

      {sendSuccess && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 p-4 rounded-xl text-xs font-bold flex items-center justify-between animate-fade-in">
          <span>Broadcast SMS successfully dispatched to 1,842 parents/guardians via Afar Regional SMS Server!</span>
          <span className="bg-emerald-600 px-2 py-0.5 rounded-full text-white text-[10px]">Delivered</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Broadcast SMS Dispatcher Form */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold text-white">Broadcast Parent SMS Gateway</h2>
          </div>

          <form onSubmit={handleSendBroadcastSMS} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Target Recipient Group:</label>
              <select
                value={smsRecipient}
                onChange={(e) => setSmsRecipient(e.target.value as any)}
                className="w-full bg-slate-800 text-white font-bold p-2.5 rounded-xl border border-slate-700 focus:outline-none"
              >
                <option value="ALL_PARENTS">All Parents / Guardians (1,842 Contacts)</option>
                <option value="GRADE_11_PARENTS">Grade 11 Parents Only (440 Contacts)</option>
                <option value="TEACHERS">Academic Teachers & Faculty (82 Contacts)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">SMS Text Message Content:</label>
              <textarea
                rows={4}
                required
                value={smsMessage}
                onChange={(e) => setSmsMessage(e.target.value)}
                className="w-full bg-slate-800 text-white font-mono p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">Character Count: {smsMessage.length} / 160 (1 SMS Segment)</p>
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition"
            >
              <Send className="w-4 h-4" />
              <span>{isSending ? 'Sending Broadcast...' : 'Send Emergency SMS Broadcast'}</span>
            </button>
          </form>
        </div>

        {/* Recent School Announcements */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-400" />
            <h2 className="text-sm font-bold text-white">Official School Announcements</h2>
          </div>

          <div className="space-y-3">
            {announcements.map((anc) => (
              <div key={anc.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30">
                    {anc.targetAudience}
                  </span>
                  <span className="text-[10px] text-slate-400">{anc.date}</span>
                </div>
                <h3 className="text-xs font-bold text-white">{anc.title}</h3>
                <p className="text-xs text-slate-400">{anc.content}</p>
                <p className="text-[10px] text-amber-400 font-semibold">— Posted by {anc.postedBy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
