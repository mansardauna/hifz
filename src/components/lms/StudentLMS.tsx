import React, { useState, useMemo } from 'react';
import { Ayah } from '../../types';
import { QuranViewer } from './QuranViewer';
import { AudioRecitationPlayer } from './AudioRecitationPlayer';
import { StudentProgress } from './StudentProgress';
import { UserProfilePage } from '../profile/UserProfilePage';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { ToastMessage } from '../ui/Toast';
import { Button, Card, Badge } from '../ui';
import {
  BookOpen,
  Award,
  CreditCard,
  Sliders,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Radio,
  Code2,
  User,
  Settings,
  Globe,
  MessageSquare,
  GraduationCap,
  FileCheck2,
  Calendar
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { LiveClassroomHub } from '../classroom/LiveClassroomHub';
import { CodingSandboxWorkspace } from '../../plugins/coding/CodingSandboxWorkspace';
import { SchoolCoursesView } from '../../plugins/school/SchoolCoursesView';
import { SchoolAssignmentsPortal } from '../../plugins/school/SchoolAssignmentsPortal';
import { SchoolReportCardView } from '../../plugins/school/SchoolReportCardView';
import { SchoolTimetableView } from '../../plugins/school/SchoolTimetableView';
import { SchoolLMSWorkspace } from '../../plugins/school/SchoolLMSWorkspace';
import { NotificationCenter } from '../notifications/NotificationCenter';
import { LMSCommunityForum } from '../forum/LMSCommunityForum';
import { TeacherDashboard } from '../teacher/TeacherDashboard';

export type StudentTab =
  | 'courses'
  | 'assignments'
  | 'grades'
  | 'schedule'
  | 'quran'
  | 'classroom'
  | 'coding'
  | 'audio'
  | 'forum'
  | 'progress'
  | 'tuition'
  | 'profile'
  | 'settings';

interface StudentLMSProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const StudentLMS: React.FC<StudentLMSProps> = ({ onAddToast }) => {
  const router = useRouter();
  const { tenant, direction, language, setLanguage } = useTenant();
  const { user, logout } = useAuth();

  // If authenticated user is a Teacher, render dedicated Instructor Dashboard & Grading Studio
  if (user?.role === 'teacher') {
    return <TeacherDashboard onAddToast={onAddToast} />;
  }

  const isCodingNiche = tenant.niche === 'coding' || tenant.niche === 'code_academy' || tenant.subdomain.includes('code');
  const isSchoolNiche = tenant.niche === 'school' || tenant.subdomain.includes('school') || tenant.subdomain.includes('oxford') || tenant.subdomain.includes('horizon');
  const isQuranNiche = (!isCodingNiche && !isSchoolNiche) && (!tenant.niche || tenant.niche === 'quran' || tenant.niche === 'madrasat' || tenant.subdomain.includes('furqan') || tenant.subdomain.includes('dar') || tenant.subdomain.includes('hifz'));

  const defaultTab: StudentTab = isCodingNiche ? 'coding' : isSchoolNiche ? 'courses' : 'quran';
  const [activeTab, setActiveTab] = useState<StudentTab>(defaultTab);
  const [selectedAyah, setSelectedAyah] = useState<Ayah | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  const toggleLanguage = () => {
    const nextLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(nextLang);
  };

  const handleSelectAyah = (ayah: Ayah) => {
    setSelectedAyah(ayah);
  };

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  // Strictly filter navigation items by tenant niche
  const studentNavItems = useMemo(() => {
    const items: { id: StudentTab; label: string; icon: any }[] = [];

    if (isSchoolNiche) {
      items.push({ id: 'courses', label: 'Academic Courses & Syllabi', icon: BookOpen });
      items.push({ id: 'assignments', label: 'Homework & Drop-box', icon: FileCheck2 });
      items.push({ id: 'grades', label: 'Report Card & GPA (3.94)', icon: Award });
      items.push({ id: 'schedule', label: 'Timetable & Attendance', icon: Calendar });
      items.push({ id: 'classroom', label: 'Live Virtual Classroom', icon: Radio });
      items.push({ id: 'forum', label: 'Student Study Hall Forum', icon: MessageSquare });
      items.push({ id: 'tuition', label: 'Tuition & School Fees', icon: CreditCard });
    } else if (isCodingNiche) {
      items.push({ id: 'coding', label: 'Coding Sandbox Lab', icon: Code2 });
      items.push({ id: 'classroom', label: 'Live Video Classroom', icon: Radio });
      items.push({ id: 'forum', label: 'Developer Community', icon: MessageSquare });
      items.push({ id: 'progress', label: 'Curriculum & Progress', icon: Award });
      items.push({ id: 'tuition', label: 'Tuition & Invoices', icon: CreditCard });
    } else {
      // Madrasat / Quran Niche
      items.push({ id: 'quran', label: 'Quran Reader & Tajweed', icon: BookOpen });
      items.push({ id: 'audio', label: 'Audio Looper & Recorder', icon: Sliders });
      items.push({ id: 'classroom', label: 'Live Virtual Classroom', icon: Radio });
      items.push({ id: 'forum', label: 'Halaqah Community Forum', icon: MessageSquare });
      items.push({ id: 'progress', label: 'Memorization Milestones', icon: Award });
      items.push({ id: 'tuition', label: 'Tuition & Invoices', icon: CreditCard });
    }

    items.push({ id: 'profile', label: isSchoolNiche ? 'Student & Guardian Profile' : 'My Student Profile', icon: User });
    items.push({ id: 'settings', label: 'Account & Security', icon: Settings });

    return items;
  }, [isCodingNiche, isSchoolNiche, isQuranNiche]);

  const handleStudentNavClick = (id: StudentTab) => {
    setActiveTab(id);
    setIsMobileNavOpen(false);
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-slate-100 font-sans text-slate-900" dir={direction}>
      {/* Mobile Drawer Backdrop */}
      {isMobileNavOpen && (
        <div
          onClick={() => setIsMobileNavOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* 1. Student Left Sidebar (Fixed & Non-Scrolling) */}
      <aside
        style={{ backgroundColor: 'var(--sidebar-bg, #0f172a)' }}
        className={`w-64 xl:w-72 h-full flex flex-col justify-between text-slate-200 border-r border-slate-800 shrink-0 select-none z-30 transition-transform duration-300 ${
          isMobileNavOpen
            ? 'fixed inset-y-0 left-0 shadow-2xl translate-x-0'
            : 'hidden lg:flex'
        }`}
      >
        <div className="flex flex-col h-full min-h-0">
          {/* Academy Brand Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-black/20">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-white/10 text-white flex items-center justify-center font-bold text-xs shrink-0">
                {isSchoolNiche ? (
                  <GraduationCap className="w-4.5 h-4.5 text-purple-400" />
                ) : isCodingNiche ? (
                  <Code2 className="w-4.5 h-4.5 text-blue-400" />
                ) : (
                  <BookOpen className="w-4.5 h-4.5 text-emerald-400" />
                )}
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-xs sm:text-sm text-white truncate">{tenant.name}</h2>
                <p className="text-[10px] sm:text-[11px] text-slate-400 font-mono truncate">{tenant.subdomain}.ankabit.app</p>
              </div>
            </div>

            {isMobileNavOpen && (
              <button
                onClick={() => setIsMobileNavOpen(false)}
                className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                aria-label="Close navigation"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Student Profile Snapshot in Sidebar */}
          <div className="p-3.5 mx-3.5 my-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                {user?.name?.charAt(0).toUpperCase() || (isSchoolNiche ? 'A' : 'M')}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-xs sm:text-sm text-white truncate">{user?.name || (isSchoolNiche ? 'Alex Mercer (Grade 11)' : 'Enrolled Student')}</p>
                <Badge variant="success">
                  {isSchoolNiche ? "Dean's Honor Roll" : 'Active Learner'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Navigation Links with Generous Touch Targets */}
          <nav className="flex-1 overflow-y-auto px-3.5 space-y-1.5 min-h-0 py-1">
            {studentNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleStudentNavClick(item.id)}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer select-none ${
                    isActive
                      ? 'bg-[var(--color-primary,#6b21a8)] text-white shadow-sm font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Action Controls */}
        <div className="p-3.5 border-t border-slate-800 space-y-2 shrink-0 bg-slate-950/40">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-slate-300 bg-slate-800/60 border-slate-700 hover:bg-slate-800 py-2.5 text-xs"
            onClick={() => router.push(`/${tenant.subdomain}`)}
            rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
          >
            Live Academy Site
          </Button>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-950/40 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 2. Main LMS Content Area (Scrolls Independently) */}
      <div className="flex-1 h-full overflow-y-auto flex flex-col min-w-0 bg-slate-50">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 py-2.5 sm:py-3.5 px-3 sm:px-8 flex items-center justify-between gap-2 sm:gap-4 sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="lg:hidden p-2 sm:p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none cursor-pointer shrink-0"
              aria-label="Open Student Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Breadcrumb */}
            <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="font-semibold text-slate-800">{tenant.name}</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-900 font-bold capitalize text-sm">
                {activeTab === 'courses' && 'Academic Courses & Interactive Syllabi'}
                {activeTab === 'assignments' && 'Homework Drop-box & Rubric Evaluations'}
                {activeTab === 'grades' && 'Official Gradebook & Cumulative GPA (3.94)'}
                {activeTab === 'schedule' && 'Weekly Class Timetable & Attendance'}
                {activeTab === 'quran' && 'Medina Mushaf Reader & Tajweed'}
                {activeTab === 'classroom' && 'Live Virtual Classroom'}
                {activeTab === 'coding' && 'Coding Sandbox Lab & Challenges'}
                {activeTab === 'audio' && 'Recitation Looper & Audio Homework'}
                {activeTab === 'progress' && 'Milestones & Faculty Feedback'}
                {activeTab === 'forum' && (isSchoolNiche ? 'Student Study Hall & Peer Discussions' : isCodingNiche ? 'Developer Community' : 'Halaqah Community')}
                {activeTab === 'tuition' && (isSchoolNiche ? 'School Tuition & Fee Statements' : 'Student Tuition & Invoices')}
                {activeTab === 'profile' && (isSchoolNiche ? 'Student & Guardian Profile' : 'Student Profile')}
                {activeTab === 'settings' && 'Account & Security Settings'}
              </span>
            </div>

            {/* Mobile Title */}
            <div className="md:hidden flex items-center gap-1.5 min-w-0">
              <span className="text-xs font-extrabold text-slate-900 truncate capitalize">
                {activeTab === 'courses'
                  ? 'Courses'
                  : activeTab === 'assignments'
                  ? 'Assignments'
                  : activeTab === 'grades'
                  ? 'Report Card'
                  : activeTab === 'schedule'
                  ? 'Timetable'
                  : activeTab === 'quran'
                  ? 'Mushaf Reader'
                  : activeTab === 'classroom'
                  ? 'Classroom'
                  : activeTab === 'coding'
                  ? 'Code Lab'
                  : activeTab}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Language Switcher */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-bold rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer text-slate-700 select-none min-h-[36px]"
              title="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="hidden sm:inline">{language === 'ar' ? 'English' : 'العربية'}</span>
              <span className="sm:hidden">{language === 'ar' ? 'EN' : 'عر'}</span>
            </button>

            <NotificationCenter onNavigateTab={(tab) => setActiveTab(tab as StudentTab)} />

            <Button
              variant="primary"
              size="sm"
              onClick={() => setActiveTab('classroom')}
              leftIcon={<Radio className="w-3.5 h-3.5" />}
              className="px-2.5 sm:px-3.5"
            >
              <span className="hidden sm:inline">Join Live Class</span>
              <span className="sm:hidden">Join</span>
            </Button>
          </div>
        </header>

        {/* Tab Viewport Main Content */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 overflow-y-auto">
          {/* School Niche Specific Views */}
          {activeTab === 'courses' && isSchoolNiche && (
            <SchoolCoursesView
              onNavigateToTab={(tab) => setActiveTab(tab as StudentTab)}
            />
          )}

          {activeTab === 'assignments' && isSchoolNiche && (
            <SchoolAssignmentsPortal onAddToast={onAddToast} />
          )}

          {activeTab === 'grades' && isSchoolNiche && (
            <SchoolReportCardView />
          )}

          {activeTab === 'schedule' && isSchoolNiche && (
            <SchoolTimetableView />
          )}

          {/* Live Virtual Classroom (Adapts dynamically to niche) */}
          {activeTab === 'classroom' && (
            <div className="h-[calc(100vh-140px)] min-h-[600px] rounded-2xl overflow-hidden border border-slate-200 shadow-md">
              <LiveClassroomHub
                roomTitle={`${tenant.name} Live Lecture`}
                courseTitle={tenant.tagline || 'Interactive Learning Session'}
                userRole="student"
                currentUserName={user?.name || (isSchoolNiche ? 'Alex Mercer' : 'Enrolled Student')}
                niche={isCodingNiche ? 'coding' : isSchoolNiche ? 'school' : 'quran'}
                onLeaveRoom={() => setActiveTab(isCodingNiche ? 'coding' : isSchoolNiche ? 'courses' : 'quran')}
                renderWorkspacePlugin={
                  isSchoolNiche ? (
                    <SchoolLMSWorkspace onAddToast={onAddToast} />
                  ) : isCodingNiche ? (
                    <CodingSandboxWorkspace />
                  ) : (
                    <QuranViewer
                      activeAyahNumber={selectedAyah?.number || null}
                      onSelectAyah={handleSelectAyah}
                      isPlaying={isPlaying}
                      onTogglePlay={handleTogglePlay}
                    />
                  )
                }
              />
            </div>
          )}

          {/* Coding Sandbox Workspace */}
          {activeTab === 'coding' && isCodingNiche && (
            <CodingSandboxWorkspace />
          )}

          {/* Madrasat Quran Reader */}
          {activeTab === 'quran' && isQuranNiche && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <QuranViewer
                activeAyahNumber={selectedAyah?.number || null}
                onSelectAyah={handleSelectAyah}
                isPlaying={isPlaying}
                onTogglePlay={handleTogglePlay}
              />
            </div>
          )}

          {/* Madrasat Audio Looper */}
          {activeTab === 'audio' && isQuranNiche && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <AudioRecitationPlayer
                isPlaying={isPlaying}
                onTogglePlay={handleTogglePlay}
                currentAyah={selectedAyah}
                onAddToast={onAddToast}
              />
            </div>
          )}

          {/* Forum / Study Hall */}
          {activeTab === 'forum' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <LMSCommunityForum onAddToast={onAddToast} />
            </div>
          )}

          {/* Progress / Milestones */}
          {activeTab === 'progress' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <StudentProgress onAddToast={onAddToast} />
            </div>
          )}

          {/* Tuition & Invoices */}
          {activeTab === 'tuition' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <Card className="p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {isSchoolNiche ? 'School Tuition & Academic Fee Statement' : 'Enrolled Tuition Invoices'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      View and download official payment receipts issued by {tenant.name}.
                    </p>
                  </div>
                  <Badge variant="success">Account Current - Paid in Full</Badge>
                </div>

                <div className="space-y-2.5">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="font-bold text-slate-800 block sm:inline">
                        {isSchoolNiche ? 'Term 1 Comprehensive Academic Tuition & Lab Fees' : 'Spring Semester Term Tuition'}
                      </span>
                      <span className="text-slate-500 sm:ml-2 font-mono">#INV-2026-089</span>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <span className="font-bold font-mono text-emerald-700">
                        {isSchoolNiche ? '$1,450.00 Paid' : '$65.00 Paid'}
                      </span>
                      <Button size="sm" variant="outline">Download PDF Receipt</Button>
                    </div>
                  </div>

                  {isSchoolNiche && (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="font-bold text-slate-800 block sm:inline">
                          AP & Laboratory Science Materials Surcharge
                        </span>
                        <span className="text-slate-500 sm:ml-2 font-mono">#INV-2026-042</span>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-3">
                        <span className="font-bold font-mono text-emerald-700">$180.00 Paid</span>
                        <Button size="sm" variant="outline">Download PDF Receipt</Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* Student Profile / Settings */}
          {(activeTab === 'profile' || activeTab === 'settings') && (
            <div className="max-w-4xl mx-auto">
              <UserProfilePage onAddToast={onAddToast} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
