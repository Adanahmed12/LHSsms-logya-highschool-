import React, { useState } from 'react';
import {
  Receipt,
  DollarSign,
  Plus,
  Search,
  Printer,
  FileSpreadsheet,
  FileText,
  CreditCard,
  TrendingUp,
  TrendingDown,
  X,
  CheckCircle2,
} from 'lucide-react';
import { FeePayment, FeeStructure, ExpenseRecord, Student, LanguageCode } from '../types';
import { translations } from '../data/translations';
import { exportToPDF, exportToExcel, triggerPrint } from '../utils/exportUtils';

interface FinanceViewProps {
  students: Student[];
  feeStructures: FeeStructure[];
  feePayments: FeePayment[];
  expenseRecords: ExpenseRecord[];
  onAddPayment: (payment: FeePayment) => void;
  onAddExpense: (expense: ExpenseRecord) => void;
  currentLang: LanguageCode;
}

export const FinanceView: React.FC<FinanceViewProps> = ({
  students,
  feeStructures,
  feePayments,
  expenseRecords,
  onAddPayment,
  onAddExpense,
  currentLang,
}) => {
  const t = translations[currentLang];

  const [activeSubTab, setActiveSubTab] = useState<'PAYMENTS' | 'EXPENSES' | 'FEE_STRUCTURE'>('PAYMENTS');
  const [showNewPaymentModal, setShowNewPaymentModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<FeePayment | null>(null);

  // New Payment Form
  const [paymentForm, setPaymentForm] = useState({
    studentId: students[0]?.id || '',
    feeName: 'PTA & Technology Development Fee',
    amountPaid: 450,
    paymentMethod: 'CBE_BIRR' as 'CASH' | 'BANK_TRANSFER' | 'CBE_BIRR' | 'TELEBIRR',
  });

  const totalRevenue = feePayments.reduce((acc, p) => acc + p.amountPaid, 0);
  const totalExpense = expenseRecords.reduce((acc, e) => acc + e.amount, 0);
  const netBalance = totalRevenue - totalExpense;

  const handleCreatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.id === paymentForm.studentId) || students[0];
    const newPay: FeePayment = {
      id: `PAY-${Date.now()}`,
      receiptNumber: `REC-2026-${Math.floor(100 + Math.random() * 900)}`,
      studentId: st.id,
      studentName: st.fullName,
      grade: st.grade,
      feeName: paymentForm.feeName,
      amountPaid: Number(paymentForm.amountPaid),
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: paymentForm.paymentMethod,
      status: 'PAID',
    };

    onAddPayment(newPay);
    setShowNewPaymentModal(false);
    setSelectedReceipt(newPay);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <Receipt className="w-6 h-6 text-indigo-400" />
            <h1 className="text-xl font-extrabold text-white">{t.navFinance}</h1>
            <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-indigo-500/30">
              Logya High Treasury
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Logya High School Financial Ledger, Student Fee Receipts, CBE Birr & Telebirr Collections
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNewPaymentModal(true)}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Collect Fee Payment</span>
          </button>
        </div>
      </div>

      {/* Financial Overview KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <p className="text-xs text-slate-400 font-semibold mb-1">Total Fee Revenue Collected</p>
          <p className="text-2xl font-extrabold text-emerald-400">{totalRevenue.toLocaleString()} ETB</p>
          <p className="text-[11px] text-slate-500 mt-1">100% CBE Birr & Telebirr Verified</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <p className="text-xs text-slate-400 font-semibold mb-1">Total Operating Expenses</p>
          <p className="text-2xl font-extrabold text-red-400">{totalExpense.toLocaleString()} ETB</p>
          <p className="text-[11px] text-slate-500 mt-1">Approved School Vouchers</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <p className="text-xs text-slate-400 font-semibold mb-1">Net Treasury Surplus</p>
          <p className="text-2xl font-extrabold text-amber-400">{netBalance.toLocaleString()} ETB</p>
          <p className="text-[11px] text-emerald-400 mt-1 font-semibold">Positive Cash Flow</p>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('PAYMENTS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeSubTab === 'PAYMENTS'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-800/60'
          }`}
        >
          Fee Collection Receipts ({feePayments.length})
        </button>

        <button
          onClick={() => setActiveSubTab('EXPENSES')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeSubTab === 'EXPENSES'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-800/60'
          }`}
        >
          School Expense Ledger ({expenseRecords.length})
        </button>

        <button
          onClick={() => setActiveSubTab('FEE_STRUCTURE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeSubTab === 'FEE_STRUCTURE'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-800/60'
          }`}
        >
          Fee Structure Setup
        </button>
      </div>

      {/* PAYMENTS SUB-TAB */}
      {activeSubTab === 'PAYMENTS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                <tr>
                  <th className="py-3 px-4">Receipt No</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Fee Item</th>
                  <th className="py-3 px-4">Amount (ETB)</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Payment Date</th>
                  <th className="py-3 px-4 text-right">Receipt Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {feePayments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-800/50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">{pay.receiptNumber}</td>
                    <td className="py-3 px-4 font-bold text-white">{pay.studentName} (Grade {pay.grade})</td>
                    <td className="py-3 px-4 text-slate-300">{pay.feeName}</td>
                    <td className="py-3 px-4 font-extrabold text-emerald-400">{pay.amountPaid} ETB</td>
                    <td className="py-3 px-4">
                      <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-mono text-[10px] border border-slate-700">
                        {pay.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{pay.paymentDate}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedReceipt(pay)}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-[11px] font-bold transition flex items-center gap-1 ml-auto"
                      >
                        <Printer className="w-3 h-3 text-amber-400" />
                        <span>Print Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EXPENSES SUB-TAB */}
      {activeSubTab === 'EXPENSES' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                <tr>
                  <th className="py-3 px-4">Voucher No</th>
                  <th className="py-3 px-4">Expense Category</th>
                  <th className="py-3 px-4">Title / Description</th>
                  <th className="py-3 px-4">Amount (ETB)</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Approved By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {expenseRecords.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-800/50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-red-400">{exp.voucherNumber}</td>
                    <td className="py-3 px-4 font-bold text-white">{exp.category}</td>
                    <td className="py-3 px-4 text-slate-300">{exp.title}</td>
                    <td className="py-3 px-4 font-extrabold text-red-400">{exp.amount.toLocaleString()} ETB</td>
                    <td className="py-3 px-4 text-slate-400">{exp.date}</td>
                    <td className="py-3 px-4 text-slate-300">{exp.approvedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FEE STRUCTURE SUB-TAB */}
      {activeSubTab === 'FEE_STRUCTURE' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {feeStructures.map((fee) => (
            <div key={fee.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
              <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                Grade {fee.grade}
              </span>
              <h3 className="text-sm font-bold text-white">{fee.feeName}</h3>
              <p className="text-xl font-extrabold text-emerald-400">{fee.amount} ETB</p>
              <p className="text-[11px] text-slate-400">{fee.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* NEW PAYMENT COLLECTION MODAL */}
      {showNewPaymentModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowNewPaymentModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-4">Logya High Fee Payment Desk</h3>

            <form onSubmit={handleCreatePayment} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Select Student *</label>
                <select
                  value={paymentForm.studentId}
                  onChange={(e) => setPaymentForm({ ...paymentForm, studentId: e.target.value })}
                  className="w-full bg-slate-800 text-white rounded-xl p-2.5 border border-slate-700 focus:outline-none"
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.fullName} ({st.admissionNo} - Grade {st.grade})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Fee Item *</label>
                <input
                  type="text"
                  value={paymentForm.feeName}
                  onChange={(e) => setPaymentForm({ ...paymentForm, feeName: e.target.value })}
                  className="w-full bg-slate-800 text-white rounded-xl p-2.5 border border-slate-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Amount Paid (ETB) *</label>
                <input
                  type="number"
                  value={paymentForm.amountPaid}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amountPaid: Number(e.target.value) })}
                  className="w-full bg-slate-800 text-white rounded-xl p-2.5 border border-slate-700 focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Payment Method *</label>
                <select
                  value={paymentForm.paymentMethod}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value as any })}
                  className="w-full bg-slate-800 text-white rounded-xl p-2.5 border border-slate-700 focus:outline-none font-semibold"
                >
                  <option value="CBE_BIRR">CBE Birr Mobile Banking</option>
                  <option value="TELEBIRR">Telebirr Direct</option>
                  <option value="CASH">Cash Deposit</option>
                  <option value="BANK_TRANSFER">Bank Direct Transfer</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewPaymentModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl"
                >
                  Confirm & Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE OFFICIAL RECEIPT MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="bg-slate-950 border-2 border-emerald-500/60 p-5 rounded-2xl text-white space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-black text-amber-400">LOGYA HIGH SCHOOL RECEIPT</h3>
                  <p className="text-[9px] text-slate-400">Logya Town, Afar Region, Ethiopia</p>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400">{selectedReceipt.receiptNumber}</span>
              </div>

              <div className="text-xs space-y-1.5 pt-1 text-slate-300">
                <p><span className="text-slate-400">Student Name:</span> <strong className="text-white">{selectedReceipt.studentName}</strong></p>
                <p><span className="text-slate-400">Fee Purpose:</span> {selectedReceipt.feeName}</p>
                <p><span className="text-slate-400">Amount Paid:</span> <strong className="text-emerald-400 text-sm">{selectedReceipt.amountPaid} ETB</strong></p>
                <p><span className="text-slate-400">Payment Method:</span> {selectedReceipt.paymentMethod}</p>
                <p><span className="text-slate-400">Date:</span> {selectedReceipt.paymentDate}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500 text-center">
                Official Treasury Copy • Logya Secondary School
              </div>
            </div>

            <button
              onClick={triggerPrint}
              className="mt-4 w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Receipt</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
