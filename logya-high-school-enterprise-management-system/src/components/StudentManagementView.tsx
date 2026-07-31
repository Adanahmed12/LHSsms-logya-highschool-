import React, { useState } from 'react';
import {
  GraduationCap,
  Search,
  Plus,
  Filter,
  Download,
  Printer,
  QrCode,
  Eye,
  Edit,
  Trash2,
  FileSpreadsheet,
  FileText,
  X,
  CheckCircle2,
  UserCheck,
  Shield,
  Phone,
  MapPin,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Student, GradeLevel, SectionName, LanguageCode } from '../types';
import { translations } from '../data/translations';
import { exportToPDF, exportToExcel, exportToCSV, exportToWord, triggerPrint } from '../utils/exportUtils';
import { generateBarcodeSVG, generateQRCodeSVG } from '../utils/qrBarcodeUtils';

interface StudentManagementViewProps {
  students: Student[];
  onAddStudent: (newStudent: Student) => void;
  onUpdateStudent: (updatedStudent: Student) => void;
  onDeleteStudent: (id: string) => void;
  currentLang: LanguageCode;
}

export const StudentManagementView: React.FC<StudentManagementViewProps> = ({
  students,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  currentLang,
}) => {
  const t = translations[currentLang];

  const [searchQuery, setSearchQuery] = useState('');
  const [filterGrade, setFilterGrade] = useState<string>('ALL');
  const [filterSection, setFilterSection] = useState<string>('ALL');
  const [selectedStudentForIdCard, setSelectedStudentForIdCard] = useState<Student | null>(null);
  const [selectedStudentProfile, setSelectedStudentProfile] = useState<Student | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Student Form State
  const [formData, setFormData] = useState({
    fullName: '',
    fullNameAmharic: '',
    fullNameAfar: '',
    gender: 'FEMALE' as 'MALE' | 'FEMALE',
    dateOfBirth: '2008-01-01',
    grade: '11' as GradeLevel,
    section: 'A' as SectionName,
    stream: 'NATURAL_SCIENCE' as any,
    guardianName: '',
    guardianPhone: '+251 9',
    woreda: 'Logya Woreda 01',
    kebele: 'Kebele 01',
    medicalInfo: '',
  });

  // Filtered Students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.guardianPhone.includes(searchQuery);
    const matchesGrade = filterGrade === 'ALL' || s.grade === filterGrade;
    const matchesSection = filterSection === 'ALL' || s.section === filterSection;
    return matchesSearch && matchesGrade && matchesSection;
  });

  // Export Table Data Setup
  const exportHeaders = ['Admission No', 'Full Name', 'Gender', 'Grade & Sec', 'Guardian Name', 'Guardian Phone', 'Woreda/Kebele', 'Status'];
  const exportRows = filteredStudents.map((s) => [
    s.admissionNo,
    s.fullName,
    s.gender,
    `Grade ${s.grade}-${s.section}`,
    s.guardianName,
    s.guardianPhone,
    `${s.woreda}, ${s.kebele}`,
    s.status,
  ]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const newAdmissionNo = `LHS/2026/0${140 + students.length + 1}`;
    const newStudent: Student = {
      id: `STU-${Date.now()}`,
      admissionNo: newAdmissionNo,
      fullName: formData.fullName,
      fullNameAmharic: formData.fullNameAmharic || formData.fullName,
      fullNameAfar: formData.fullNameAfar || formData.fullName,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
      grade: formData.grade,
      section: formData.section,
      stream: formData.stream,
      guardianName: formData.guardianName,
      guardianPhone: formData.guardianPhone,
      woreda: formData.woreda,
      kebele: formData.kebele,
      medicalInfo: formData.medicalInfo || 'Healthy',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      status: 'ACTIVE',
      admissionDate: new Date().toISOString().split('T')[0],
      qrCodeData: `STU:${newAdmissionNo}|${formData.fullName}|Grade${formData.grade}${formData.section}`,
      barcodeData: `${Date.now()}`.slice(-12),
    };

    onAddStudent(newStudent);
    setShowAddModal(false);
    setFormData({
      fullName: '',
      fullNameAmharic: '',
      fullNameAfar: '',
      gender: 'FEMALE',
      dateOfBirth: '2008-01-01',
      grade: '11',
      section: 'A',
      stream: 'NATURAL_SCIENCE',
      guardianName: '',
      guardianPhone: '+251 9',
      woreda: 'Logya Woreda 01',
      kebele: 'Kebele 01',
      medicalInfo: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl font-extrabold text-white">{t.navStudents}</h1>
            <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">
              {filteredStudents.length} Students
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Logya High School Official Admission & Profile Management Engine
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>{t.registerStudent}</span>
          </button>

          <button
            onClick={() => exportToPDF('STUDENT ROSTER', 'Logya High School Official Registry', 'logya_students', exportHeaders, exportRows)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition"
          >
            <FileText className="w-3.5 h-3.5 text-red-400" />
            <span>PDF</span>
          </button>

          <button
            onClick={() => exportToExcel('logya_students', 'Students', exportHeaders, exportRows)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Excel</span>
          </button>

          <button
            onClick={triggerPrint}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-400" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, admission number, guardian phone..."
            className="w-full bg-slate-800 text-white text-xs rounded-xl pl-9 pr-4 py-2.5 border border-slate-700 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Grade Filter */}
          <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl text-xs">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Grade:</span>
            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Grades</option>
              <option value="9" className="bg-slate-900">Grade 9</option>
              <option value="10" className="bg-slate-900">Grade 10</option>
              <option value="11" className="bg-slate-900">Grade 11</option>
              <option value="12" className="bg-slate-900">Grade 12</option>
            </select>
          </div>

          {/* Section Filter */}
          <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-slate-400">Section:</span>
            <select
              value={filterSection}
              onChange={(e) => setFilterSection(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Sec</option>
              <option value="A" className="bg-slate-900">Sec A</option>
              <option value="B" className="bg-slate-900">Sec B</option>
              <option value="C" className="bg-slate-900">Sec C</option>
              <option value="D" className="bg-slate-900">Sec D</option>
              <option value="E" className="bg-slate-900">Sec E</option>
            </select>
          </div>
        </div>
      </div>

      {/* Student Roster Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Student & Adm No</th>
                <th className="py-3 px-4">Gender</th>
                <th className="py-3 px-4">Class Level</th>
                <th className="py-3 px-4">Stream</th>
                <th className="py-3 px-4">Guardian Contact</th>
                <th className="py-3 px-4">Woreda / Kebele</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-500">
                    No student records matching search filter.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((stu) => (
                  <tr key={stu.id} className="hover:bg-slate-800/50 transition">
                    <td className="py-3 px-4 font-semibold">
                      <div className="flex items-center gap-3">
                        <img
                          src={stu.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                          alt={stu.fullName}
                          className="w-8 h-8 rounded-full object-cover border border-amber-500/40"
                        />
                        <div>
                          <p className="font-bold text-white leading-tight">{stu.fullName}</p>
                          <p className="text-[10px] text-amber-400 font-mono">{stu.admissionNo}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${stu.gender === 'FEMALE' ? 'bg-pink-500/20 text-pink-300' : 'bg-blue-500/20 text-blue-300'}`}>
                        {stu.gender}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-100">
                        Grade {stu.grade} - Section {stu.section}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-400">
                      {stu.stream || 'GENERAL'}
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-200">{stu.guardianName}</p>
                      <p className="text-[10px] text-slate-400">{stu.guardianPhone}</p>
                    </td>

                    <td className="py-3 px-4 text-slate-400">
                      {stu.woreda}, {stu.kebele}
                    </td>

                    <td className="py-3 px-4">
                      <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                        {stu.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right space-x-1">
                      {/* ID Card Button */}
                      <button
                        onClick={() => setSelectedStudentForIdCard(stu)}
                        className="p-1.5 bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-slate-950 rounded-lg transition"
                        title="Generate Printable ID Card"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                      </button>

                      {/* Profile View */}
                      <button
                        onClick={() => setSelectedStudentProfile(stu)}
                        className="p-1.5 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg transition"
                        title="View Detailed Profile"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => onDeleteStudent(stu.id)}
                        className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition"
                        title="Delete Student Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRINTABLE STUDENT ID CARD MODAL */}
      {selectedStudentForIdCard && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setSelectedStudentForIdCard(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-4">
              <h3 className="text-base font-bold text-white">Logya High School Student ID</h3>
              <p className="text-xs text-slate-400">Official Smart Barcode & QR Identification</p>
            </div>

            {/* Visual ID Card Printable Container */}
            <div id="student-id-card-print" className="bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 border-2 border-amber-500/60 rounded-2xl p-5 shadow-2xl text-white relative overflow-hidden">
              {/* Header Badge */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs">
                    LHS
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider">Logya High School</h4>
                    <p className="text-[9px] text-slate-400">Logya, Afar Region, Ethiopia</p>
                  </div>
                </div>
                <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  ACADEMIC ID
                </span>
              </div>

              {/* Photo & Info Grid */}
              <div className="grid grid-cols-3 gap-3 items-center mb-4">
                <div className="col-span-1">
                  <img
                    src={selectedStudentForIdCard.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                    alt={selectedStudentForIdCard.fullName}
                    className="w-24 h-24 rounded-xl object-cover border-2 border-amber-400 shadow-md mx-auto"
                  />
                </div>

                <div className="col-span-2 space-y-1 text-left">
                  <h3 className="text-sm font-extrabold text-white leading-tight">
                    {selectedStudentForIdCard.fullName}
                  </h3>
                  <p className="text-[10px] text-amber-300 font-mono font-bold">
                    ID: {selectedStudentForIdCard.admissionNo}
                  </p>

                  <div className="pt-1 text-[10px] text-slate-300 space-y-0.5">
                    <p><span className="text-slate-400">Class:</span> Grade {selectedStudentForIdCard.grade}-{selectedStudentForIdCard.section}</p>
                    <p><span className="text-slate-400">Stream:</span> {selectedStudentForIdCard.stream}</p>
                    <p><span className="text-slate-400">Emergency:</span> {selectedStudentForIdCard.guardianPhone}</p>
                  </div>
                </div>
              </div>

              {/* Barcode & QR Code Row */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div
                  dangerouslySetInnerHTML={{
                    __html: generateBarcodeSVG(selectedStudentForIdCard.barcodeData, 160, 36),
                  }}
                />
                <div
                  dangerouslySetInnerHTML={{
                    __html: generateQRCodeSVG(selectedStudentForIdCard.qrCodeData, 50),
                  }}
                />
              </div>
            </div>

            {/* Print Action Button */}
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={triggerPrint}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Card</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW STUDENT ADMISSION MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 relative my-8">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Logya High School New Student Admission</h3>
            </div>

            <form onSubmit={handleRegister} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Full Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Amina Ibrahim Hassan"
                    className="w-full bg-slate-800 text-white rounded-xl p-2.5 border border-slate-700 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Full Name (Amharic)</label>
                  <input
                    type="text"
                    value={formData.fullNameAmharic}
                    onChange={(e) => setFormData({ ...formData, fullNameAmharic: e.target.value })}
                    placeholder="እ.ኤ.አ. አሚና ኢብራሂም"
                    className="w-full bg-slate-800 text-white rounded-xl p-2.5 border border-slate-700 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full bg-slate-800 text-white rounded-xl p-2.5 border border-slate-700 focus:outline-none focus:border-amber-500"
                  >
                    <option value="FEMALE">Female</option>
                    <option value="MALE">Male</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full bg-slate-800 text-white rounded-xl p-2.5 border border-slate-700 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Grade Level *</label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value as GradeLevel })}
                    className="w-full bg-slate-800 text-white rounded-xl p-2.5 border border-slate-700 focus:outline-none focus:border-amber-500"
                  >
                    <option value="9">Grade 9</option>
                    <option value="10">Grade 10</option>
                    <option value="11">Grade 11</option>
                    <option value="12">Grade 12</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Section *</label>
                  <select
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value as SectionName })}
                    className="w-full bg-slate-800 text-white rounded-xl p-2.5 border border-slate-700 focus:outline-none focus:border-amber-500"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                    <option value="D">Section D</option>
                    <option value="E">Section E</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Guardian Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.guardianName}
                    onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                    placeholder="e.g. Ibrahim Hassan Ali"
                    className="w-full bg-slate-800 text-white rounded-xl p-2.5 border border-slate-700 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Guardian Phone *</label>
                  <input
                    type="text"
                    required
                    value={formData.guardianPhone}
                    onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                    placeholder="+251 91 ..."
                    className="w-full bg-slate-800 text-white rounded-xl p-2.5 border border-slate-700 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl"
                >
                  Save Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
