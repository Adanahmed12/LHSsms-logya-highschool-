import React, { useState } from 'react';
import { BookMarked, Search, Plus, Download, Printer, CheckCircle2, Clock, AlertTriangle, BookOpen } from 'lucide-react';
import { LibraryBook, BookIssue, LanguageCode } from '../types';
import { translations } from '../data/translations';
import { generateBarcodeSVG } from '../utils/qrBarcodeUtils';

interface LibraryViewProps {
  books: LibraryBook[];
  bookIssues: BookIssue[];
  currentLang: LanguageCode;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ books, bookIssues, currentLang }) => {
  const t = translations[currentLang];
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'CATALOG' | 'ISSUES' | 'DIGITAL_EBOOK'>('CATALOG');

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.isbn.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <BookMarked className="w-6 h-6 text-purple-400" />
            <h1 className="text-xl font-extrabold text-white">{t.navLibrary}</h1>
            <span className="bg-purple-500/20 text-purple-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-purple-500/30">
              565 Cataloged Textbooks
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Logya High School Digital & Physical Library System • Circulation & Barcode Ledger
          </p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('CATALOG')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'CATALOG'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-800/60'
          }`}
        >
          Book Catalog ({books.length})
        </button>

        <button
          onClick={() => setActiveTab('ISSUES')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'ISSUES'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-800/60'
          }`}
        >
          Borrow / Return Desk ({bookIssues.length})
        </button>

        <button
          onClick={() => setActiveTab('DIGITAL_EBOOK')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'DIGITAL_EBOOK'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-800/60'
          }`}
        >
          Digital E-Library PDFs
        </button>
      </div>

      {/* CATALOG VIEW */}
      {activeTab === 'CATALOG' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search book title, author, subject, or ISBN..."
                className="w-full bg-slate-800 text-white text-xs rounded-xl pl-9 pr-4 py-2.5 border border-slate-700 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBooks.map((bk) => (
              <div key={bk.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-sm hover:border-slate-700 transition">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                      {bk.category} • {bk.subject || 'General'}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-1 leading-tight">{bk.title}</h3>
                    <p className="text-xs text-slate-400">By {bk.author}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Available Copies:</span>
                  <span className="font-extrabold text-emerald-400">{bk.availableCopies} / {bk.totalCopies}</span>
                </div>

                <div
                  className="pt-2"
                  dangerouslySetInnerHTML={{
                    __html: generateBarcodeSVG(bk.barcode, 180, 36),
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ISSUES VIEW */}
      {activeTab === 'ISSUES' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                <tr>
                  <th className="py-3 px-4">Book Title</th>
                  <th className="py-3 px-4">Borrower Name</th>
                  <th className="py-3 px-4">Issue Date</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Overdue Fine</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {bookIssues.map((iss) => (
                  <tr key={iss.id} className="hover:bg-slate-800/50 transition">
                    <td className="py-3 px-4 font-bold text-white">{iss.bookTitle}</td>
                    <td className="py-3 px-4 text-slate-300">{iss.borrowerName} ({iss.borrowerType})</td>
                    <td className="py-3 px-4 text-slate-400">{iss.issueDate}</td>
                    <td className="py-3 px-4 text-slate-400">{iss.dueDate}</td>
                    <td className="py-3 px-4 font-bold text-amber-400">{iss.fineAmount} ETB</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${iss.status === 'OVERDUE' ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                        {iss.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DIGITAL EBOOK VIEW */}
      {activeTab === 'DIGITAL_EBOOK' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="p-2 bg-purple-500/10 text-purple-400 w-fit rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white">Ministry of Education Grade 11 Mathematics PDF</h3>
            <p className="text-xs text-slate-400">Complete curriculum textbook for Logya High School students.</p>
            <button className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1">
              <Download className="w-3.5 h-3.5" /> Download PDF (12.4 MB)
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="p-2 bg-blue-500/10 text-blue-400 w-fit rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white">Afar Af Qadab kee Derafa (Afar Grammar Manual)</h3>
            <p className="text-xs text-slate-400">Regional mother tongue language study material.</p>
            <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1">
              <Download className="w-3.5 h-3.5" /> Download PDF (8.2 MB)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
