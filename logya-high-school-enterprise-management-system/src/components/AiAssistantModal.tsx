import React, { useState } from 'react';
import { Bot, Send, X, Sparkles, User, RefreshCw } from 'lucide-react';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'USER' | 'AI'; text: string }>>([
    {
      sender: 'AI',
      text: 'Greetings! I am the Logya High School Gemini Academic Advisor AI Specialist. How can I assist you with lesson plans, Ethiopian curriculum alignment, student performance analytics, or Afar regional educational guidelines today?',
    },
  ]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userText = prompt;
    setMessages((prev) => [...prev, { sender: 'USER', text: userText }]);
    setPrompt('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          sender: 'AI',
          text: data.reply || 'Apologies, I could not generate a response at this moment.',
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'AI',
          text: 'Error communicating with Logya High School Gemini AI server. Please verify network connectivity.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full h-[520px] flex flex-col relative shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 rounded-xl font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">Logya High Gemini AI Academic Advisor</h3>
              <p className="text-[10px] text-amber-400">Server-Side Gemini AI Powered</p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 max-w-[85%] ${
                m.sender === 'USER' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-bold ${
                  m.sender === 'USER' ? 'bg-amber-500 text-slate-950' : 'bg-blue-600 text-white'
                }`}
              >
                {m.sender === 'USER' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-3 rounded-2xl font-sans ${
                  m.sender === 'USER'
                    ? 'bg-amber-500/20 text-white border border-amber-500/30'
                    : 'bg-slate-950 text-slate-200 border border-slate-800'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs italic">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span>Gemini AI is analyzing Logya High School curriculum context...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask AI for lesson plans, exam questions, or student advice..."
            className="flex-1 bg-slate-900 text-white text-xs rounded-xl px-3.5 py-2.5 border border-slate-700 focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1 disabled:opacity-50 transition"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
