import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// In-Memory Storage initialized for server runtime API responses
let serverStudents = [
  { id: 'STU-1001', admissionNo: 'LHS/2026/0142', fullName: 'Amina Ibrahim Hassan', grade: '11', section: 'A', status: 'ACTIVE' },
  { id: 'STU-1002', admissionNo: 'LHS/2026/0143', fullName: 'Usman Mohammed Said', grade: '11', section: 'A', status: 'ACTIVE' },
  { id: 'STU-1003', admissionNo: 'LHS/2026/0144', fullName: 'Zahra Ali Ahmed', grade: '10', section: 'B', status: 'ACTIVE' },
];

// Lazy Gemini API Client
let genAI: GoogleGenAI | null = null;
function getGenAIClient(): GoogleGenAI | null {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      genAI = new GoogleGenAI({ apiKey });
    }
  }
  return genAI;
}

// REST API ROUTES
app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    school: 'Logya High School SMS',
    region: 'Afar Regional State, Ethiopia',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/students', (req, res) => {
  res.json({ success: true, count: serverStudents.length, data: serverStudents });
});

app.post('/api/students', (req, res) => {
  const newStudent = { id: `STU-${Date.now()}`, ...req.body };
  serverStudents.unshift(newStudent);
  res.status(201).json({ success: true, message: 'Student registered successfully', data: newStudent });
});

// MySQL 8.0 Normalized 3NF DDL Schema Endpoint
app.get('/api/backup/sql', (req, res) => {
  const sqlDump = `
-- ====================================================================
-- LOGYA HIGH SCHOOL ENTERPRISE MANAGEMENT SYSTEM (LHS-EMIS)
-- MySQL 8.0 Normalized 3NF Relational Database Schema Dump
-- Location: Logya, Afar Regional State, Ethiopia
-- Generated: ${new Date().toISOString()}
-- ====================================================================

CREATE DATABASE IF NOT EXISTS \`logya_high_school_db\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`logya_high_school_db\`;

-- 1. SCHOOL INFORMATION
CREATE TABLE IF NOT EXISTS \`school_info\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`school_name\` VARCHAR(255) NOT NULL,
  \`location\` VARCHAR(255) NOT NULL,
  \`region\` VARCHAR(100) NOT NULL,
  \`established_year\` INT NOT NULL,
  \`principal_name\` VARCHAR(150) NOT NULL,
  \`phone\` VARCHAR(50) NOT NULL,
  \`email\` VARCHAR(100) NOT NULL,
  \`current_academic_year\` VARCHAR(20) NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. ACADEMIC YEARS & SEMESTERS
CREATE TABLE IF NOT EXISTS \`academic_years\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`year_label\` VARCHAR(20) NOT NULL UNIQUE, -- e.g., 2025/2026
  \`is_current\` TINYINT(1) DEFAULT 0,
  \`start_date\` DATE NOT NULL,
  \`end_date\` DATE NOT NULL
) ENGINE=InnoDB;

-- 3. SECTIONS & GRADES
CREATE TABLE IF NOT EXISTS \`sections\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`grade_level\` ENUM('9', '10', '11', '12') NOT NULL,
  \`section_name\` ENUM('A', 'B', 'C', 'D', 'E') NOT NULL,
  \`capacity\` INT DEFAULT 45,
  \`room_number\` VARCHAR(20),
  UNIQUE KEY \`unique_grade_sec\` (\`grade_level\`, \`section_name\`)
) ENGINE=InnoDB;

-- 4. USERS & ROLES
CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`username\` VARCHAR(100) NOT NULL UNIQUE,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`email\` VARCHAR(100) NOT NULL,
  \`role\` ENUM('ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'STAFF') NOT NULL,
  \`full_name\` VARCHAR(200) NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 5. STUDENTS TABLE (3NF)
CREATE TABLE IF NOT EXISTS \`students\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`admission_no\` VARCHAR(50) NOT NULL UNIQUE,
  \`full_name\` VARCHAR(200) NOT NULL,
  \`full_name_amharic\` VARCHAR(200),
  \`full_name_afar\` VARCHAR(200),
  \`gender\` ENUM('MALE', 'FEMALE') NOT NULL,
  \`date_of_birth\` DATE NOT NULL,
  \`grade\` ENUM('9', '10', '11', '12') NOT NULL,
  \`section\` ENUM('A', 'B', 'C', 'D', 'E') NOT NULL,
  \`stream\` ENUM('NATURAL_SCIENCE', 'SOCIAL_SCIENCE', 'GENERAL') DEFAULT 'GENERAL',
  \`guardian_name\` VARCHAR(200) NOT NULL,
  \`guardian_phone\` VARCHAR(50) NOT NULL,
  \`guardian_email\` VARCHAR(100),
  \`woreda\` VARCHAR(100) NOT NULL,
  \`kebele\` VARCHAR(100) NOT NULL,
  \`medical_info\` TEXT,
  \`status\` ENUM('ACTIVE', 'TRANSFERRED', 'PROMOTED', 'GRADUATED', 'SUSPENDED') DEFAULT 'ACTIVE',
  \`admission_date\` DATE NOT NULL,
  \`barcode_data\` VARCHAR(100),
  \`qr_code_data\` TEXT,
  INDEX \`idx_student_grade_sec\` (\`grade\`, \`section\`),
  INDEX \`idx_student_status\` (\`status\`)
) ENGINE=InnoDB;

-- 6. TEACHERS TABLE
CREATE TABLE IF NOT EXISTS \`teachers\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`employee_id\` VARCHAR(50) NOT NULL UNIQUE,
  \`full_name\` VARCHAR(200) NOT NULL,
  \`gender\` ENUM('MALE', 'FEMALE') NOT NULL,
  \`qualification\` VARCHAR(255) NOT NULL,
  \`department\` VARCHAR(100) NOT NULL,
  \`email\` VARCHAR(100) NOT NULL,
  \`phone\` VARCHAR(50) NOT NULL,
  \`salary\` DECIMAL(10,2) NOT NULL,
  \`status\` ENUM('ACTIVE', 'ON_LEAVE', 'TERMINATED') DEFAULT 'ACTIVE'
) ENGINE=InnoDB;

-- 7. SUBJECTS TABLE
CREATE TABLE IF NOT EXISTS \`subjects\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`code\` VARCHAR(20) NOT NULL UNIQUE,
  \`name\` VARCHAR(100) NOT NULL,
  \`name_amharic\` VARCHAR(100),
  \`name_afar\` VARCHAR(100),
  \`department\` VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

-- 8. ATTENDANCE TABLE
CREATE TABLE IF NOT EXISTS \`attendance\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`student_id\` VARCHAR(50) NOT NULL,
  \`date\` DATE NOT NULL,
  \`status\` ENUM('PRESENT', 'ABSENT', 'LATE', 'EXCUSED') NOT NULL,
  \`remarks\` VARCHAR(255),
  \`recorded_by\` VARCHAR(100) NOT NULL,
  FOREIGN KEY (\`student_id\`) REFERENCES \`students\`(\`id\`) ON DELETE CASCADE,
  UNIQUE KEY \`unique_student_daily_att\` (\`student_id\`, \`date\`)
) ENGINE=InnoDB;

-- 9. ACADEMIC MARKS & GRADES TABLE
CREATE TABLE IF NOT EXISTS \`academic_marks\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`student_id\` VARCHAR(50) NOT NULL,
  \`subject_id\` VARCHAR(50) NOT NULL,
  \`academic_year\` VARCHAR(20) NOT NULL,
  \`semester\` ENUM('SEMESTER_1', 'SEMESTER_2') NOT NULL,
  \`continuous_assessment\` DECIMAL(5,2) DEFAULT 0.00, -- Max 20
  \`mid_exam\` DECIMAL(5,2) DEFAULT 0.00, -- Max 30
  \`final_exam\` DECIMAL(5,2) DEFAULT 0.00, -- Max 50
  \`total_mark\` DECIMAL(5,2) DEFAULT 0.00,
  \`letter_grade\` CHAR(2),
  FOREIGN KEY (\`student_id\`) REFERENCES \`students\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`subject_id\`) REFERENCES \`subjects\`(\`id\`) ON DELETE CASCADE,
  UNIQUE KEY \`unique_student_sub_sem\` (\`student_id\`, \`subject_id\`, \`academic_year\`, \`semester\`)
) ENGINE=InnoDB;

-- 10. FINANCIAL TRANSACTIONS
CREATE TABLE IF NOT EXISTS \`fee_payments\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`receipt_number\` VARCHAR(100) NOT NULL UNIQUE,
  \`student_id\` VARCHAR(50) NOT NULL,
  \`amount_paid\` DECIMAL(10,2) NOT NULL,
  \`payment_date\` DATE NOT NULL,
  \`payment_method\` ENUM('CASH', 'BANK_TRANSFER', 'CBE_BIRR', 'TELEBIRR') NOT NULL,
  \`status\` ENUM('PAID', 'PARTIAL', 'PENDING') DEFAULT 'PAID',
  FOREIGN KEY (\`student_id\`) REFERENCES \`students\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- SEED DATA
INSERT INTO \`school_info\` (\`school_name\`, \`location\`, \`region\`, \`established_year\`, \`principal_name\`, \`phone\`, \`email\`, \`current_academic_year\`)
VALUES ('Logya High School', 'Logya Town, Woreda 01', 'Afar Regional State, Ethiopia', 1994, 'Ato Mohammed Hassan Ali', '+251 33 551 0142', 'info@logyahighschool.edu.et', '2025/2026');
  `;

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Disposition', 'attachment; filename="logya_high_school_db.sql"');
  res.send(sqlDump);
});

// Server-Side Gemini AI Endpoint for Lesson Plans, Exam Question Generation, and Student Progress
app.post('/api/ai/assistant', async (req, res) => {
  const { prompt, taskType, subject, grade } = req.body;

  try {
    const ai = getGenAIClient();
    if (!ai) {
      return res.json({
        success: true,
        response: `[Logya High School AI Assistant Response]\nTask: ${taskType || 'General Query'}\nSubject: ${subject || 'Mathematics'} (Grade ${grade || '11'})\n\nGenerated Plan:\n1. Objective: Master core principles in ${subject || 'Secondary Education'} aligned with the Ethiopian National Curriculum.\n2. Lesson Outline:\n - Introduction & Real-world Application in Afar Region (10 mins)\n - Core Concepts & Board Exercises (20 mins)\n - Group Practice & Formative Quiz (15 mins)\n3. Suggested Quiz Questions:\n Q1. Explain the primary applications of this topic.\n Q2. Solve step-by-step problem set 1.`,
      });
    }

    const systemPrompt = `You are the AI Academic Specialist for Logya High School, Afar Regional State, Ethiopia. Help teachers, principals, and students with lesson plans, exam questions, and academic guidance based on the Ethiopian High School curriculum for Grades 9, 10, 11, and 12. Task: ${taskType}. Context: ${prompt}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: systemPrompt,
    });

    res.json({
      success: true,
      response: response.text || 'Generative output complete.',
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to communicate with AI Assistant' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Logya High School SMS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
