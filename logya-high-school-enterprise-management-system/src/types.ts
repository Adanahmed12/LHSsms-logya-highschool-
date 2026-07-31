/**
 * Enterprise School Management System (SMS) - Logya High School, Afar, Ethiopia
 * Global TypeScript Interfaces and Enums
 */

export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT' | 'STAFF' | 'SUPER_ADMIN';

export type NavigationTab =
  | 'dashboard'
  | 'students'
  | 'teachers'
  | 'attendance'
  | 'academics'
  | 'timetable'
  | 'finance'
  | 'library'
  | 'onlineExam'
  | 'digitalLearning'
  | 'communication'
  | 'parentPortal'
  | 'studentPortal'
  | 'teacherPortal'
  | 'reports'
  | 'importExport'
  | 'settingsDocs';

export type LanguageCode = 'EN' | 'AM' | 'AA'; // English, Amharic, Afar

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  associatedId?: string; // Student ID, Teacher ID, or Parent ID
}

export type GradeLevel = '9' | '10' | '11' | '12';
export type SectionName = 'A' | 'B' | 'C' | 'D' | 'E';

export interface Student {
  id: string;
  admissionNo: string; // e.g., LHS/2026/001
  fullName: string;
  fullNameAmharic?: string;
  fullNameAfar?: string;
  gender: 'MALE' | 'FEMALE';
  dateOfBirth: string;
  grade: GradeLevel;
  section: SectionName;
  stream?: 'NATURAL_SCIENCE' | 'SOCIAL_SCIENCE' | 'GENERAL';
  guardianName: string;
  guardianPhone: string;
  guardianEmail?: string;
  woreda: string;
  kebele: string;
  medicalInfo?: string;
  photoUrl?: string;
  status: 'ACTIVE' | 'TRANSFERRED' | 'PROMOTED' | 'GRADUATED' | 'SUSPENDED';
  admissionDate: string;
  qrCodeData: string;
  barcodeData: string;
}

export interface Teacher {
  id: string;
  employeeId: string; // LHS-T-001
  fullName: string;
  gender: 'MALE' | 'FEMALE';
  qualification: string;
  department: string; // e.g., Natural Sciences, Languages, Social Sciences, IT
  email: string;
  phone: string;
  assignedSubjects: string[]; // Subject IDs
  assignedSections: { grade: GradeLevel; section: SectionName }[];
  salary: number;
  joinDate: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED';
}

export interface Staff {
  id: string;
  employeeId: string;
  fullName: string;
  roleTitle: string; // e.g., Accountant, Librarian, Registrar, IT Specialist
  department: string;
  phone: string;
  email: string;
  salary: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  nameAmharic: string;
  nameAfar: string;
  gradeLevels: GradeLevel[];
  periodsPerWeek: number;
  department: string;
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export interface AttendanceRecord {
  id: string;
  date: string;
  studentId: string;
  studentName: string;
  grade: GradeLevel;
  section: SectionName;
  status: AttendanceStatus;
  remarks?: string;
  recordedBy: string;
}

export interface AcademicMark {
  id: string;
  studentId: string;
  subjectId: string;
  subjectName: string;
  academicYear: string; // e.g., 2025/2026
  semester: 'SEMESTER_1' | 'SEMESTER_2';
  continuousAssessment: number; // Max 20
  midExam: number; // Max 30
  finalExam: number; // Max 50
  totalMark: number; // Max 100
  letterGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  remarks?: string;
}

export interface TimetableSlot {
  id: string;
  day: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY';
  period: number; // 1 to 7
  time: string; // e.g., "08:30 - 09:15"
  grade: GradeLevel;
  section: SectionName;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  roomNumber: string;
}

export interface FeeStructure {
  id: string;
  feeName: string;
  grade: GradeLevel;
  amount: number; // In ETB (Ethiopian Birr)
  dueDate: string;
  description: string;
}

export interface FeePayment {
  id: string;
  receiptNumber: string;
  studentId: string;
  studentName: string;
  grade: GradeLevel;
  feeName: string;
  amountPaid: number;
  paymentDate: string;
  paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'CBE_BIRR' | 'TELEBIRR';
  status: 'PAID' | 'PARTIAL' | 'PENDING';
}

export interface ExpenseRecord {
  id: string;
  voucherNumber: string;
  category: string;
  title: string;
  amount: number;
  date: string;
  approvedBy: string;
  notes?: string;
}

export interface LibraryBook {
  id: string;
  isbn: string;
  title: string;
  author: string;
  category: string;
  subject?: string;
  totalCopies: number;
  availableCopies: number;
  barcode: string;
  coverImage?: string;
}

export interface BookIssue {
  id: string;
  bookId: string;
  bookTitle: string;
  borrowerId: string; // Student or Teacher ID
  borrowerName: string;
  borrowerType: 'STUDENT' | 'TEACHER';
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  fineAmount: number;
  status: 'ISSUED' | 'RETURNED' | 'OVERDUE';
}

export interface DisciplinaryIncident {
  id: string;
  studentId: string;
  studentName: string;
  grade: GradeLevel;
  section: SectionName;
  incidentDate: string;
  title: string;
  description: string;
  severity: 'MINOR' | 'MODERATE' | 'SEVERE';
  actionTaken: string;
  parentNotified: boolean;
  status: 'OPEN' | 'RESOLVED' | 'UNDER_REVIEW';
}

export interface LearningMaterial {
  id: string;
  title: string;
  description: string;
  grade: GradeLevel;
  subjectId: string;
  subjectName: string;
  teacherName: string;
  materialType: 'PDF' | 'VIDEO' | 'PRESENTATION' | 'DOCUMENT';
  fileSize?: string;
  uploadDate: string;
  downloadUrl: string;
}

export interface ExamQuestion {
  id: string;
  questionText: string;
  questionType: 'MCQ' | 'TRUE_FALSE' | 'ESSAY';
  options?: string[];
  correctAnswer: string | number; // Index or string
  explanation?: string;
  points: number;
}

export interface OnlineExam {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  grade: GradeLevel;
  durationMinutes: number;
  totalPoints: number;
  questions: ExamQuestion[];
  instructions: string;
  status: 'ACTIVE' | 'UPCOMING' | 'COMPLETED';
}

export interface ExamResult {
  id: string;
  examId: string;
  examTitle: string;
  studentId: string;
  studentName: string;
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  submittedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  targetAudience: 'ALL' | 'TEACHERS' | 'STUDENTS' | 'PARENTS';
  postedBy: string;
  date: string;
  isUrgent?: boolean;
}

export interface SystemAuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  action: string;
  module: string;
  ipAddress: string;
}

export interface SchoolInfo {
  name: string;
  location: string;
  region: string;
  schoolType: string;
  establishedYear: number;
  totalStudents: number;
  totalTeachers: number;
  totalStaff: number;
  principalName: string;
  phone: string;
  email: string;
  academicYear: string;
  currentTerm: string;
  logoUrl?: string;
}
