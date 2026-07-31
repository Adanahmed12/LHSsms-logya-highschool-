import React from 'react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Briefcase,
  CalendarCheck2,
  BookOpenCheck,
  CalendarDays,
  Receipt,
  BookMarked,
  Video,
  FileCheck2,
  MessageSquare,
  UserCheck,
  UserCheck2,
  FileSpreadsheet,
  DownloadCloud,
  Settings2,
  ChevronRight,
} from 'lucide-react';
import { UserRole, LanguageCode, NavigationTab } from '../types';
import { translations } from '../data/translations';

interface SidebarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  currentUserRole?: UserRole;
  currentLang: LanguageCode;
  collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  currentUserRole = 'SUPER_ADMIN',
  currentLang,
  collapsed = false,
}) => {
  const t = translations[currentLang] || translations.EN;

  interface NavItem {
    id: NavigationTab;
    label: string;
    icon: React.ReactNode;
    badge?: string;
    allowedRoles?: UserRole[];
  }

  interface NavGroup {
    groupTitle: string;
    items: NavItem[];
  }

  const allNavGroups: NavGroup[] = [
    {
      groupTitle: 'Overview',
      items: [
        {
          id: 'dashboard',
          label: t.navDashboard || 'Dashboard',
          icon: <LayoutDashboard className="w-4 h-4" />,
          allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'STAFF'],
        },
      ],
    },
    {
      groupTitle: 'Role Portals',
      items: [
        {
          id: 'teacherPortal',
          label: t.navTeacherPortal || 'Teacher Portal',
          icon: <UserCheck className="w-4 h-4" />,
          allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'TEACHER'],
          badge: 'My Classes',
        },
        {
          id: 'studentPortal',
          label: t.navStudentPortal || 'Student Portal',
          icon: <GraduationCap className="w-4 h-4" />,
          allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'STUDENT'],
          badge: 'My Grades',
        },
        {
          id: 'parentPortal',
          label: t.navParentPortal || 'Parent Portal',
          icon: <UserCheck2 className="w-4 h-4" />,
          allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'PARENT'],
          badge: 'Child Hub',
        },
      ],
    },
    {
      groupTitle: 'Core Administration',
      items: [
        {
          id: 'students',
          label: t.navStudents || 'Students',
          icon: <GraduationCap className="w-4 h-4" />,
          badge: '1.8K',
          allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STAFF'],
        },
        {
          id: 'teachers',
          label: t.navTeachers || 'Teachers',
          icon: <Users className="w-4 h-4" />,
          badge: '82',
          allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'STAFF'],
        },
      ],
    },
    {
      groupTitle: 'Academic Operations',
      items: [
        {
          id: 'attendance',
          label: t.navAttendance || 'Attendance',
          icon: <CalendarCheck2 className="w-4 h-4" />,
          allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'PARENT'],
        },
        {
          id: 'academics',
          label: t.navAcademics || 'Academics',
          icon: <BookOpenCheck className="w-4 h-4" />,
          allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
        },
        {
          id: 'timetable',
          label: t.navTimetable || 'Timetable',
          icon: <CalendarDays className="w-4 h-4" />,
          allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT'],
        },
      ],
    },
    {
      groupTitle: 'Services & Learning',
      items: [
        {
          id: 'finance',
          label: t.navFinance || 'Finance',
          icon: <Receipt className="w-4 h-4" />,
          allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'STAFF', 'PARENT'],
        },
        {
          id: 'library',
          label: t.navLibrary || 'Library',
          icon: <BookMarked className="w-4 h-4" />,
          allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT', 'STAFF'],
        },
        {
          id: 'digitalLearning',
          label: t.navDigitalLearning || 'Digital E-Learning',
          icon: <Video className="w-4 h-4" />,
          allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT'],
        },
        {
          id: 'onlineExam',
          label: t.navOnlineExam || 'Online Exams',
          icon: <FileCheck2 className="w-4 h-4" />,
          badge: 'Live',
          allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT'],
        },
        {
          id: 'communication',
          label: t.navCommunication || 'Announcements & SMS',
          icon: <MessageSquare className="w-4 h-4" />,
          allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'STAFF'],
        },
      ],
    },
    {
      groupTitle: 'Tools & Documentation',
      items: [
        {
          id: 'reports',
          label: t.navReports || 'Reports & Transcripts',
          icon: <FileSpreadsheet className="w-4 h-4" />,
          allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'STAFF'],
        },
        {
          id: 'importExport',
          label: t.navImportExport || 'Data Import & Export',
          icon: <DownloadCloud className="w-4 h-4" />,
          allowedRoles: ['SUPER_ADMIN', 'ADMIN'],
        },
        {
          id: 'settingsDocs',
          label: t.navSettingsDocs || 'System Docs & Rules',
          icon: <Settings2 className="w-4 h-4" />,
          allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'STAFF'],
        },
      ],
    },
  ];

  // Filter items based on active role permissions
  const filteredNavGroups = allNavGroups
    .map((group) => {
      const allowedItems = group.items.filter((item) => {
        if (!item.allowedRoles) return true;
        return (item.allowedRoles as string[]).includes(currentUserRole);
      });
      return { ...group, items: allowedItems };
    })
    .filter((group) => group.items.length > 0);

  return (
    <aside
      className={`bg-slate-900 border-r border-slate-800 text-slate-300 transition-all duration-300 flex flex-col h-[calc(100vh-53px)] sticky top-[53px] z-30 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex-1 overflow-y-auto py-3 px-2 custom-scrollbar">
        {filteredNavGroups.map((group, idx) => (
          <div key={idx} className="mb-4">
            {!collapsed && (
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                {group.groupTitle}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={isActive ? 'text-slate-950' : 'text-amber-400'}>{item.icon}</span>
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!collapsed && (
                      <div className="flex items-center gap-1.5">
                        {item.badge && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                              isActive
                                ? 'bg-slate-950 text-amber-400'
                                : 'bg-slate-800 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight
                          className={`w-3 h-3 transition-transform ${
                            isActive ? 'text-slate-950 translate-x-0.5' : 'text-slate-600'
                          }`}
                        />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};
