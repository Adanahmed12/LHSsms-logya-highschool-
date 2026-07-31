import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LoginView } from './components/LoginView';
import { DashboardView } from './components/DashboardView';
import { StudentManagementView } from './components/StudentManagementView';
import { TeacherManagementView } from './components/TeacherManagementView';
import { AttendanceView } from './components/AttendanceView';
import { AcademicView } from './components/AcademicView';
import { TimetableManagerView } from './components/TimetableManagerView';
import { FinanceView } from './components/FinanceView';
import { LibraryView } from './components/LibraryView';
import { OnlineExamView } from './components/OnlineExamView';
import { DigitalLearningView } from './components/DigitalLearningView';
import { CommunicationView } from './components/CommunicationView';
import { ParentPortalView } from './components/ParentPortalView';
import { StudentPortalView } from './components/StudentPortalView';
import { TeacherPortalView } from './components/TeacherPortalView';
import { ReportsView } from './components/ReportsView';
import { ImportExportView } from './components/ImportExportView';
import { SettingsDocsView } from './components/SettingsDocsView';
import { AiAssistantModal } from './components/AiAssistantModal';

import {
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_SUBJECTS,
  INITIAL_ATTENDANCE,
  INITIAL_MARKS,
  INITIAL_TIMETABLE,
  INITIAL_FEE_STRUCTURES,
  INITIAL_PAYMENTS,
  INITIAL_EXPENSES,
  INITIAL_LIBRARY_BOOKS,
  INITIAL_BOOK_ISSUES,
  INITIAL_EXAMS,
  INITIAL_LEARNING_MATERIALS,
  INITIAL_ANNOUNCEMENTS,
} from './data/initialData';

import {
  Student,
  Teacher,
  AttendanceRecord,
  AcademicMark,
  FeePayment,
  ExpenseRecord,
  LanguageCode,
  UserRole,
  NavigationTab,
  User as UserType,
} from './types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole>('SUPER_ADMIN');
  const [currentLang, setCurrentLang] = useState<LanguageCode>('EN');
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Application State
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [teachers, setTeachers] = useState<Teacher[]>(INITIAL_TEACHERS);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [academicMarks, setAcademicMarks] = useState<AcademicMark[]>(INITIAL_MARKS);
  const [feePayments, setFeePayments] = useState<FeePayment[]>(INITIAL_PAYMENTS);
  const [expenseRecords, setExpenseRecords] = useState<ExpenseRecord[]>(INITIAL_EXPENSES);

  const handleLogin = (user: UserType) => {
    setCurrentUser(user);
    setCurrentRole(user.role);

    // Auto-direct to the role's default workspace tab
    if (user.role === 'TEACHER') {
      setActiveTab('teacherPortal');
    } else if (user.role === 'STUDENT') {
      setActiveTab('studentPortal');
    } else if (user.role === 'PARENT') {
      setActiveTab('parentPortal');
    } else if (user.role === 'STAFF') {
      setActiveTab('finance');
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    if (newRole === 'TEACHER') {
      setActiveTab('teacherPortal');
    } else if (newRole === 'STUDENT') {
      setActiveTab('studentPortal');
    } else if (newRole === 'PARENT') {
      setActiveTab('parentPortal');
    } else if (newRole === 'STAFF') {
      setActiveTab('finance');
    } else {
      setActiveTab('dashboard');
    }
  };

  // State Handler Actions
  const handleAddStudent = (newStudent: Student) => {
    setStudents((prev) => [newStudent, ...prev]);
  };

  const handleUpdateStudent = (updated: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleSaveAttendance = (newRecords: AttendanceRecord[]) => {
    setAttendanceRecords((prev) => {
      const filtered = prev.filter(
        (existing) => !newRecords.some((nr) => nr.studentId === existing.studentId && nr.date === existing.date)
      );
      return [...newRecords, ...filtered];
    });
  };

  const handleUpdateMark = (updatedMark: AcademicMark) => {
    setAcademicMarks((prev) => {
      const exists = prev.some((m) => m.id === updatedMark.id);
      if (exists) {
        return prev.map((m) => (m.id === updatedMark.id ? updatedMark : m));
      }
      return [updatedMark, ...prev];
    });
  };

  const handleAddFeePayment = (newPay: FeePayment) => {
    setFeePayments((prev) => [newPay, ...prev]);
  };

  const handleAddExpense = (newExp: ExpenseRecord) => {
    setExpenseRecords((prev) => [newExp, ...prev]);
  };

  // If not logged in, render the Role-based Login View directly
  if (!currentUser) {
    return (
      <LoginView
        onLogin={handleLogin}
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navigation Header */}
      <Header
        currentUser={currentUser}
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        onOpenAiAssistant={() => setIsAiModalOpen(true)}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          currentUserRole={currentRole}
          currentLang={currentLang}
        />

        {/* Main Workspace Canvas */}
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardView
              students={students}
              teachers={teachers}
              attendanceRecords={attendanceRecords}
              academicMarks={academicMarks}
              feePayments={feePayments}
              expenseRecords={expenseRecords}
              currentLang={currentLang}
            />
          )}

          {activeTab === 'students' && (
            <StudentManagementView
              students={students}
              onAddStudent={handleAddStudent}
              onUpdateStudent={handleUpdateStudent}
              currentLang={currentLang}
            />
          )}

          {activeTab === 'teachers' && (
            <TeacherManagementView teachers={teachers} currentLang={currentLang} />
          )}

          {activeTab === 'attendance' && (
            <AttendanceView
              students={students}
              attendanceRecords={attendanceRecords}
              onSaveAttendance={handleSaveAttendance}
              currentLang={currentLang}
            />
          )}

          {activeTab === 'academics' && (
            <AcademicView
              students={students}
              subjects={INITIAL_SUBJECTS}
              academicMarks={academicMarks}
              onUpdateMark={handleUpdateMark}
              currentLang={currentLang}
            />
          )}

          {activeTab === 'timetable' && (
            <TimetableManagerView
              timetableSlots={INITIAL_TIMETABLE}
              subjects={INITIAL_SUBJECTS}
              teachers={teachers}
              currentLang={currentLang}
            />
          )}

          {activeTab === 'finance' && (
            <FinanceView
              students={students}
              feeStructures={INITIAL_FEE_STRUCTURES}
              feePayments={feePayments}
              expenseRecords={expenseRecords}
              onAddPayment={handleAddFeePayment}
              onAddExpense={handleAddExpense}
              currentLang={currentLang}
            />
          )}

          {activeTab === 'library' && (
            <LibraryView
              books={INITIAL_LIBRARY_BOOKS}
              bookIssues={INITIAL_BOOK_ISSUES}
              currentLang={currentLang}
            />
          )}

          {activeTab === 'onlineExam' && (
            <OnlineExamView exams={INITIAL_EXAMS} currentLang={currentLang} />
          )}

          {activeTab === 'digitalLearning' && (
            <DigitalLearningView materials={INITIAL_LEARNING_MATERIALS} currentLang={currentLang} />
          )}

          {activeTab === 'communication' && (
            <CommunicationView announcements={INITIAL_ANNOUNCEMENTS} currentLang={currentLang} />
          )}

          {activeTab === 'parentPortal' && (
            <ParentPortalView
              students={students}
              academicMarks={academicMarks}
              feePayments={feePayments}
              currentLang={currentLang}
            />
          )}

          {activeTab === 'studentPortal' && (
            <StudentPortalView
              students={students}
              timetableSlots={INITIAL_TIMETABLE}
              academicMarks={academicMarks}
              onNavigate={setActiveTab}
              currentLang={currentLang}
            />
          )}

          {activeTab === 'teacherPortal' && (
            <TeacherPortalView teachers={teachers} onNavigate={setActiveTab} currentLang={currentLang} />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              students={students}
              attendanceRecords={attendanceRecords}
              academicMarks={academicMarks}
              feePayments={feePayments}
              currentLang={currentLang}
            />
          )}

          {activeTab === 'importExport' && <ImportExportView currentLang={currentLang} />}

          {activeTab === 'settingsDocs' && <SettingsDocsView currentLang={currentLang} />}
        </main>
      </div>

      {/* Gemini AI Academic Specialist Modal */}
      <AiAssistantModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
    </div>
  );
}
