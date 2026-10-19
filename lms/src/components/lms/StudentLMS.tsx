import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { ToastMessage } from '../ui/Toast';
import { PageHeader, Badge } from '../ui';
import {
  LayoutDashboard,
  Calendar as CalendarIcon,
  Award,
  Users,
  BookOpen,
  MessageSquare,
  CreditCard,
  Video,
  LogOut,
  Search,
  Bell,
  Settings,
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Play,
  CheckCircle2,
  Sparkles,
  Radio,
  X,
  Menu,
  Code2,
  Layers,
  Star,
  MapPin,
  Mic,
  GraduationCap,
  BarChart2,
  Volume2
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useConfirm } from '../../context/ConfirmModalContext';
import { LiveClassroomHub, StudentLevelTier } from '../classroom/LiveClassroomHub';
import { NotificationCenter } from '../notifications/NotificationCenter';
import { LMSCommunityForum } from '../forum/LMSCommunityForum';
import { TeacherDashboard } from '../teacher/TeacherDashboard';
import { UserProfilePage } from '../profile/UserProfilePage';
import { classroomSessionService, LiveClassSession } from '../../services/classroomSessionService';
import { DemoRoleSwitcher } from '../common/DemoRoleSwitcher';
import { Avatar } from '../ui';
import { OralRecitationStudio } from './OralRecitationStudio';
import { EvaluatedSubmissionsViewer } from './EvaluatedSubmissionsViewer';
import { StudentProgress } from './StudentProgress';

// Modular Niche LMS Imports
import { detectLmsEngineType } from '../../modules/registry';
import { QuranLMSContainer } from '../../modules/lms-quran';
import { SchoolLMSContainer } from '../../modules/lms-school';
import { CodingLMSContainer } from '../../modules/lms-coding';
import { StudentTuitionPortal } from '../../modules/common/billing';
import { detectTenantNicheType, getClassroomConfig } from '../../services/classroomCustomizationService';

import { isDemoTenant } from '../../context/TenantContext';
import { api } from '../../services/api';
import { RecitationSubmission } from '../../types';

interface StudentLMSProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const StudentLMS: React.FC<StudentLMSProps> = ({ onAddToast }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { tenant, courses } = useTenant();
  const { user, logout } = useAuth();
  const confirm = useConfirm();

  const isDemo = isDemoTenant(tenant.subdomain);
  const [studentSubmissions, setStudentSubmissions] = useState<RecitationSubmission[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (!isDemo) {
      setIsLoadingSubmissions(true);
      api.getSubmissions(tenant.id || tenant.subdomain, user?.id)
        .then((subs) => {
          if (isMounted) {
            setStudentSubmissions(subs || []);
            setIsLoadingSubmissions(false);
          }
        })
        .catch(() => {
          if (isMounted) setIsLoadingSubmissions(false);
        });
    }
    return () => { isMounted = false; };
  }, [tenant.id, tenant.subdomain, user?.id, isDemo]);

  // Route teachers to Instructor Studio
  if (user?.role === 'teacher') {
    return <TeacherDashboard onAddToast={onAddToast} />;
  }

  const engineType = detectLmsEngineType(tenant.niche, tenant.subdomain);
  const tenantNiche = detectTenantNicheType(tenant);
  const isQuran = tenantNiche === 'quran';
  const isCoding = tenantNiche === 'coding';
  const classroomConfig = getClassroomConfig(tenant);

  // Active Navigation Tab (Defaults to 'dashboard')
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activeLiveSession, setActiveLiveSession] = useState<LiveClassSession | null>(null);
  const [studentLevel, setStudentLevel] = useState<StudentLevelTier>('intermediate');

  // Identify the student's exact enrolled course
  const studentEnrolledCourse = courses.find((c) => c.title === user?.cohort || c.id === user?.cohort) || courses[0] || null;
  const enrolledCourseTitle = studentEnrolledCourse?.title || user?.cohort || tenant.name || 'Academy Course';
  const enrolledInstructorName = studentEnrolledCourse?.instructorName || `${tenant.name || 'Academy'} Instructor`;

  // Subscribe to Live Sessions broadcast by teachers specifically matching this student's class
  useEffect(() => {
    const active = classroomSessionService.getActiveSessionForStudent(
      tenant.subdomain,
      user?.id,
      user?.cohort,
      enrolledCourseTitle,
      studentLevel
    );
    if (active) setActiveLiveSession(active);

    const unsubscribe = classroomSessionService.subscribe((event) => {
      if (event.type === 'SESSION_STARTED' && event.session && event.session.subdomain === tenant.subdomain) {
        const s = event.session;
        const matchesStudentId = Boolean(s.allowedStudentIds && s.allowedStudentIds.length > 0 && user?.id && s.allowedStudentIds.includes(user.id));
        const matchesCourse = Boolean(s.courseTitle && s.courseTitle.trim().toLowerCase() === enrolledCourseTitle.trim().toLowerCase());
        const matchesCohort = Boolean(s.targetCohort && (s.targetCohort.trim().toLowerCase() === 'all' || s.targetCohort.trim().toLowerCase() === (user?.cohort || '').trim().toLowerCase()));

        if (matchesStudentId || matchesCourse || matchesCohort) {
          setActiveLiveSession(s);
          onAddToast({
            type: 'info',
            title: 'Live Class Started',
            message: `"${s.courseTitle}" is now live with ${s.teacherName}. Click "Live Classroom" to join.`
          });
        }
      } else if (event.type === 'SESSION_ENDED') {
        setActiveLiveSession((prev) => (prev && prev.id === event.sessionId ? null : prev));
      }
    });
    return () => unsubscribe();
  }, [tenant.subdomain, user?.id, user?.cohort, enrolledCourseTitle, studentLevel, onAddToast]);

  // URL query parameter listener
  useEffect(() => {
    const tabParam = searchParams?.get('tab');
    if (tabParam) {
      if (tabParam === 'classroom') setActiveTab('videos');
      else setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Subtab for Assessments view
  const [assessmentSubTab, setAssessmentSubTab] = useState<'record' | 'submissions' | 'rubrics'>('record');

  // Dynamic Navigation Items
  const isModuleEnabled = (modId: string): boolean => {
    const list = tenant.enabledModules || tenant.settings?.enabledModules || tenant.settings?.modules;
    if (Array.isArray(list)) {
      if (['dashboard', 'profile', 'progress'].includes(modId)) return true;
      return list.includes(modId);
    } else if (list && typeof list === 'object') {
      if (['dashboard', 'profile', 'progress'].includes(modId)) return true;
      return list[modId] !== false;
    }
    return true;
  };

  const coursesLabel = isQuran ? 'Curriculum & Mushaf' : isCoding ? 'Code Labs & Projects' : 'Courses & Curriculum';
  const videosLabel = isQuran ? 'Live Halaqahs' : isCoding ? 'Live Pair Coding' : 'Live Classroom';
  const assessmentsLabel = isQuran ? 'Oral Recitations' : isCoding ? 'Code Challenges' : 'Assessments & Quizzes';

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'courses', label: coursesLabel, icon: BookOpen },
    { id: 'assessments', label: assessmentsLabel, icon: Award },
    { id: 'progress', label: 'My Progress', icon: BarChart2 },
    { id: 'videos', label: videosLabel, icon: Video },
    { id: 'schedule', label: 'Schedule', icon: CalendarIcon },
    { id: 'forum', label: 'Community', icon: MessageSquare },
    { id: 'tuition', label: 'Tuition & Billing', icon: CreditCard },
  ].filter((item) => isModuleEnabled(item.id));

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-slate-50 font-sans text-slate-900">
      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* LEFT SIDEBAR */}
      <aside
        style={{ backgroundColor: tenant?.brandColor || tenant?.theme?.primaryColor || 'var(--sidebar-bg, #047857)' }}
        className={`w-64 sm:w-72 max-w-[85vw] h-[100dvh] lg:h-full flex flex-col justify-between text-white border-r border-white/15 shrink-0 select-none z-50 transition-transform duration-300 ${
          isMobileMenuOpen
            ? 'fixed inset-y-0 left-0 shadow-2xl translate-x-0'
            : 'hidden lg:flex'
        }`}
      >
        <div className="flex flex-col h-full min-h-0">
          {/* Brand Header */}
          <div className="h-16 px-4 sm:px-5 border-b border-white/15 flex items-center justify-between shrink-0 bg-black/15">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-white/20 border border-white/20 flex items-center justify-center font-semibold text-white shadow-xs shrink-0">
                {tenant.name ? tenant.name.charAt(0) : 'A'}
              </div>
              <div className="min-w-0">
                <h2 className="font-semibold text-sm text-white truncate">
                  {tenant.name || 'Academy'}
                </h2>
                <span className="text-[10px] text-white/70 block capitalize">
                  Student Portal
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer outline-none"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto p-3.5 space-y-1">
            <div className="px-3 pt-2 pb-1 text-xs font-semibold capitalize tracking-wider text-white/70">
              Student Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer outline-none select-none ${
                    isActive
                      ? 'bg-white/20 text-white shadow-xs font-semibold backdrop-blur-xs'
                      : 'text-white/85 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0 text-white" />
                  <span className="truncate text-white">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Profile Pill at Bottom */}
          <div className="p-3.5 border-t border-white/15 space-y-2.5 shrink-0 bg-black/15">
            <div
              onClick={() => setActiveTab('profile')}
              className="px-3 py-2 bg-white/10 border border-white/10 rounded-xl flex items-center justify-between cursor-pointer hover:bg-white/15 transition-colors"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <Avatar
                  src={user?.avatarUrl || (isDemo && isQuran ? '/images/muslim_girl_student.jpg' : null)}
                  name={user?.name || 'Enrolled Student'}
                  size="sm"
                  status="active"
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{user?.name || 'Enrolled Student'}</p>
                  <p className="text-[10px] text-white/70 truncate capitalize">{user?.role || 'student'}</p>
                </div>
              </div>
            </div>

            <button
              onClick={async () => {
                const ok = await confirm({
                  title: 'Sign Out',
                  message: 'Are you sure you want to log out of your student portal?',
                  confirmText: 'Sign Out',
                  cancelText: 'Stay Here',
                  variant: 'danger',
                });
                if (ok) {
                  logout();
                  router.push(`/${tenant.subdomain}/login`);
                }
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-white/90 hover:text-white hover:bg-white/15 rounded-xl transition-colors cursor-pointer outline-none"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4 shrink-0 text-white" />
              <span className="text-white">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN WORKSPACE CONTENT AREA */}
      <main className="flex-1 h-full overflow-y-auto flex flex-col min-w-0 bg-slate-50">
        {/* Mobile Header Bar */}
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
              aria-label="Open navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-semibold text-sm text-slate-900">{tenant.name}</span>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Student
          </span>
        </div>

        <div className="p-4 md:p-8 flex-1">
          <div className="w-11/12 mx-auto space-y-6">
            {/* Demo Role Switcher (Shown ONLY in Demo Sandbox) */}
            <DemoRoleSwitcher />

          {activeTab === 'dashboard' ? (
            <div className="space-y-6">
              {/* Header Bar */}
              <PageHeader
                title={isQuran ? "Student Overview" : "Academic Dashboard"}
                description={isQuran ? "Academic progress, enrolled tracks, and recitation performance." : "Academic progress, enrolled coursework, and practical performance."}
                badge={{ text: isDemo ? (isQuran ? 'ACTIVE QARIYAH' : 'HONORS STUDENT') : 'ACTIVE STUDENT', variant: 'success' }}
              />

              {/* Live Classroom Broadcast Banner */}
              {activeLiveSession && (
                <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 text-white p-4 sm:p-5 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-emerald-500/30">
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-3.5 w-3.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500"></span>
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold flex items-center gap-2">
                        <span>{activeLiveSession.teacherName || 'Instructor'} is Live Now</span>
                        <span className="text-xs bg-rose-500/20 text-rose-200 border border-rose-400/30 px-2.5 py-0.5 rounded-full font-mono font-semibold capitalize">
                          Class Active
                        </span>
                      </h4>
                      <p className="text-xs text-emerald-100 mt-0.5">
                        {activeLiveSession.title} • {activeLiveSession.courseTitle}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('videos')}
                    className="h-9 px-4 rounded-xl bg-white text-emerald-950 font-semibold text-xs sm:text-sm shadow-sm hover:bg-emerald-50 transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Join
                  </button>
                </div>
              )}

              {/* Main 3-Column Top Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* COLUMN 1: Key Metric Card & Student Profile Card */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Card 1A: Progress Metric Card */}
                  <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
                    <div>
                      <span className="text-xs font-semibold capitalize tracking-wider text-slate-400">
                        {isQuran ? 'MY MEMORIZATION' : 'CURRICULUM PROGRESS'}
                      </span>
                      <div className="flex items-baseline justify-between mt-1">
                        <h2 className="text-3xl sm:text-4xl font-semibold text-slate-950 font-display tracking-tight">
                          {isQuran ? (
                            isDemo
                              ? '24 / 30 Juz'
                              : studentSubmissions.length > 0
                              ? `${studentSubmissions.filter((s) => s.status === 'graded').length} Completed Modules`
                              : '0 / 30 Juz'
                          ) : (
                            isDemo
                              ? '18 / 24 Modules'
                              : studentSubmissions.length > 0
                              ? `${studentSubmissions.filter((s) => s.status === 'graded').length} Completed Modules`
                              : '0 Modules'
                          )}
                        </h2>
                        <span className="text-xs font-mono text-slate-400 font-semibold">...</span>
                      </div>
                    </div>

                    {/* Status Pill Card */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-2.5 py-1 rounded-md text-xs font-mono font-semibold tracking-wider">
                          <span>{courses[0]?.title?.slice(0, 14)?.toUpperCase() || (isQuran ? 'SANAD TRACK' : 'CORE PROGRAM')}</span>
                          <span>•••• {isDemo ? '4820' : 'ENROLLED'}</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wider bg-emerald-500 text-white capitalize">
                          AUTHORIZED
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {isQuran
                          ? (isDemo
                              ? 'Recitation accuracy verified weekly by Ustadhah Zainab.\nNext oral exam scheduled for Thursday.'
                              : 'Recitation submissions are evaluated by your academy mentor.\nSubmit audio recordings for Tajweed feedback.')
                          : (isDemo
                              ? 'Coursework and practical projects evaluated by academy faculty.\nNext assignment milestone scheduled for Thursday.'
                              : 'Coursework submissions are evaluated by your academy faculty.\nSubmit project deliverables for mentor feedback.')}
                      </p>
                    </div>

                    {/* Specs Table */}
                    <div className="space-y-3 pt-2 border-t border-slate-100">
                      <span className="text-xs font-semibold capitalize tracking-wider text-slate-400">
                        {isQuran ? 'TRACK SPECIFICATIONS' : 'ENROLLMENT SPECIFICATIONS'}
                      </span>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between py-1 border-b border-slate-50 text-slate-600">
                          <span className="text-slate-400 font-medium">{isQuran ? 'Current Track' : 'Current Program'}</span>
                          <span className="font-semibold text-slate-900">
                            {isDemo ? (isQuran ? 'Surah An-Nur' : isCoding ? 'Full-Stack Next.js 14' : 'Applied Management & Practicum') : courses[0]?.title || 'General Curriculum'}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-50 text-slate-600">
                          <span className="text-slate-400 font-medium">Current Status</span>
                          <span className="font-semibold text-slate-900 font-mono">
                            {isDemo ? (isQuran ? 'Ayah 35 (Noor)' : isCoding ? 'Module 8: Microservices' : 'Module 4: Applied Practicum') : 'Active Enrollment'}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-50 text-slate-600">
                          <span className="text-slate-400 font-medium">{isQuran ? 'Retention Mastery' : 'Academic Mastery'}</span>
                          <span className="font-semibold text-slate-900 font-mono">
                            {isDemo ? (isQuran ? '98.4% Mumtaz' : '96.5% High Honors') : studentSubmissions.length > 0 ? 'Evaluating' : 'New Enrollment'}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-50 text-slate-600">
                          <span className="text-slate-400 font-medium">{isQuran ? 'Tajweed Level' : 'Academic Tier'}</span>
                          <span className="font-semibold text-slate-900">
                            {isDemo ? (isQuran ? 'Advanced Phonetics' : 'Advanced Track') : 'Level 1 Foundations'}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-50 text-slate-600">
                          <span className="text-slate-400 font-medium">Attendance Record</span>
                          <span className="font-semibold text-slate-900">
                            {isDemo ? '100% (24 Sessions)' : '100% On Track'}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-50 text-slate-600">
                          <span className="text-slate-400 font-medium">{isQuran ? 'Assigned Ustadhah' : 'Faculty Mentor'}</span>
                          <span className="font-semibold text-slate-900">
                            {isDemo ? (isQuran ? 'Ustadhah Zainab' : 'Senior Faculty') : courses[0]?.instructorName || 'Academy Mentor'}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-50 text-slate-600">
                          <span className="text-slate-400 font-medium">{isQuran ? 'Live Halaqah Room' : 'Live Classroom'}</span>
                          <span className="font-semibold text-slate-900">{isQuran ? 'WebRTC SFU Live' : 'Interactive SFU Hall'}</span>
                        </div>
                        <div className="flex justify-between py-1 text-slate-600">
                          <span className="text-slate-400 font-medium">Student ID</span>
                          <span className="font-mono text-slate-600 text-xs">
                            {isDemo ? 'ank_stu_98412' : user?.id || 'ank_stu_live'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('assessments');
                          setAssessmentSubTab('record');
                        }}
                        className="w-full h-11 bg-slate-950 hover:bg-slate-800 text-white px-4 rounded-xl text-sm font-semibold transition-all shadow-sm cursor-pointer text-center active:scale-[0.98]"
                      >
                        {isQuran ? 'Record' : 'Submit'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('courses')}
                        className="w-full h-11 bg-white hover:bg-slate-50 text-slate-900 px-4 rounded-xl text-sm font-semibold border border-slate-200 transition-all cursor-pointer text-center active:scale-[0.98]"
                      >
                        {isQuran ? 'Mushaf' : 'Syllabus'}
                      </button>
                    </div>
                  </div>

                  {/* Card 1B: Student Highlight Card */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 font-display">
                          {user?.name || 'Enrolled Student'}
                        </h3>
                        <p className="text-xs text-slate-400 font-medium">
                          {isDemo ? (isQuran ? 'Senior Qariyah • Hifz Juz 28' : 'Honors Scholar • Term 2026') : `Active Student • ${courses[0]?.title || 'Standard Track'}`}
                        </p>
                      </div>

                      <Avatar
                        src={user?.avatarUrl || (isDemo && isQuran ? '/images/muslim_girl_student.jpg' : null)}
                        name={user?.name || 'Enrolled Student'}
                        size="lg"
                        status="active"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 text-xs">
                      <div>
                        <span className="text-xs text-slate-400 block font-medium">
                          {isQuran ? 'Recitation Retention' : 'Academic Retention'}
                        </span>
                        <span className="text-sm font-semibold text-slate-900 font-mono">
                          {isDemo ? (isQuran ? '98.4% Mumtaz' : '96.5% Honors') : '100% Active'}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block font-medium">Cohort Joined</span>
                        <span className="text-xs font-semibold text-slate-700">
                          {isDemo ? '21 Dec 2024' : 'Term 1 • 2026'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* COLUMN 2: Curriculum & Coursework Detail List Card */}
                <div className="lg:col-span-4">
                  <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <h3 className="text-base font-semibold text-slate-900 font-display">
                        {isQuran ? 'Enrolled Modules & Halaqahs' : 'Enrolled Modules & Courses'}
                      </h3>
                      <span className="text-xs font-semibold text-emerald-600">
                        {isDemo ? '6 Tracks' : `${courses.length} Tracks`}
                      </span>
                    </div>

                    {isDemo ? (
                      isQuran ? (
                        <div className="space-y-4 divide-y divide-slate-100">
                          <div className="pt-3 first:pt-0 flex items-start justify-between gap-3 group">
                            <div className="flex items-start gap-3">
                              <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                                <BookOpen className="w-4 h-4 text-emerald-600" />
                              </div>
                              <div>
                                <h4 className="text-xs font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                  Hifz Al-Baqarah & Ali 'Imran
                                </h4>
                                <p className="text-xs text-slate-400 font-medium">
                                  Ustadhah Zainab • Juz 1-3
                                </p>
                              </div>
                            </div>
                            <span className="text-xs font-semibold text-emerald-700 font-mono shrink-0">Mumtaz (98%)</span>
                          </div>

                          <div className="pt-3 flex items-start justify-between gap-3 group">
                            <div className="flex items-start gap-3">
                              <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                                <Award className="w-4 h-4 text-teal-600" />
                              </div>
                              <div>
                                <h4 className="text-xs font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                  Tajweed Phonetics (Tuhfah)
                                </h4>
                                <p className="text-xs text-slate-400 font-medium">
                                  Ustadhah Fatima • Makharij
                                </p>
                              </div>
                            </div>
                            <span className="text-xs font-semibold text-slate-900 font-mono shrink-0">Completed</span>
                          </div>

                          <div className="pt-3 flex items-start justify-between gap-3 group">
                            <div className="flex items-start gap-3">
                              <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                                <GraduationCap className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="text-xs font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                  Classical Arabic Syntax (Nahw)
                                </h4>
                                <p className="text-xs text-slate-400 font-medium">
                                  Ustadhah Asma • Lesson 4
                                </p>
                              </div>
                            </div>
                            <span className="text-xs font-semibold text-slate-900 font-mono shrink-0">In Progress</span>
                          </div>

                          <div className="pt-3 flex items-start justify-between gap-3 group">
                            <div className="flex items-start gap-3">
                              <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                                <Sparkles className="w-4 h-4 text-amber-600" />
                              </div>
                              <div>
                                <h4 className="text-xs font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                  Daily Muraja'ah Revision Circle
                                </h4>
                                <p className="text-xs text-slate-400 font-medium">
                                  Ustadhah Hajar • 5 Juz/wk
                                </p>
                              </div>
                            </div>
                            <span className="text-xs font-semibold text-slate-900 font-mono shrink-0">100% Attended</span>
                          </div>

                          <div className="pt-3 flex items-start justify-between gap-3 group">
                            <div className="flex items-start gap-3">
                              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                              </div>
                              <div>
                                <h4 className="text-xs font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                  Sanad Graduation Exam
                                </h4>
                                <p className="text-xs text-emerald-600 font-medium">
                                  Oral Chain Verification
                                </p>
                              </div>
                            </div>
                            <span className="text-xs font-semibold text-emerald-600 font-mono shrink-0">Eligible</span>
                          </div>

                          <div className="pt-3 flex items-start justify-between gap-3 group">
                            <div className="flex items-start gap-3">
                              <div className="w-9 h-9 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                                <img
                                  src="/images/muslim_teacher_woman.jpg"
                                  alt="Ustadhah Zainab"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h4 className="text-xs font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                  1-on-1 Mentorship Office Hours
                                </h4>
                                <p className="text-xs text-slate-400 font-medium">
                                  Thursday 4:00 PM • Room 2
                                </p>
                              </div>
                            </div>
                            <span className="text-xs font-semibold text-slate-900 font-mono shrink-0">Booked</span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4 divide-y divide-slate-100">
                          <div className="pt-3 first:pt-0 flex items-start justify-between gap-3 group">
                            <div className="flex items-start gap-3">
                              <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                                <BookOpen className="w-4 h-4 text-emerald-600" />
                              </div>
                              <div>
                                <h4 className="text-xs font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                  {isCoding ? 'Full-Stack Architecture & APIs' : 'Core Applied Practicum & Case Studies'}
                                </h4>
                                <p className="text-xs text-slate-400 font-medium">
                                  {isCoding ? 'Lead Architect • Modules 1-4' : 'Department Faculty • Modules 1-3'}
                                </p>
                              </div>
                            </div>
                            <span className="text-xs font-semibold text-emerald-700 font-mono shrink-0">Distinction (98%)</span>
                          </div>

                          <div className="pt-3 flex items-start justify-between gap-3 group">
                            <div className="flex items-start gap-3">
                              <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                                <Award className="w-4 h-4 text-teal-600" />
                              </div>
                              <div>
                                <h4 className="text-xs font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                  {isCoding ? 'Data Structures & Algorithms' : 'Strategic Operations & Analysis'}
                                </h4>
                                <p className="text-xs text-slate-400 font-medium">
                                  Course Lead • Practical Benchmarks
                                </p>
                              </div>
                            </div>
                            <span className="text-xs font-semibold text-slate-900 font-mono shrink-0">Completed</span>
                          </div>

                          <div className="pt-3 flex items-start justify-between gap-3 group">
                            <div className="flex items-start gap-3">
                              <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                                <GraduationCap className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="text-xs font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                  {isCoding ? 'Cloud Systems & Microservices' : 'Organizational Leadership & Ethics'}
                                </h4>
                                <p className="text-xs text-slate-400 font-medium">
                                  Senior Instructor • Unit 4
                                </p>
                              </div>
                            </div>
                            <span className="text-xs font-semibold text-slate-900 font-mono shrink-0">In Progress</span>
                          </div>

                          <div className="pt-3 flex items-start justify-between gap-3 group">
                            <div className="flex items-start gap-3">
                              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                              </div>
                              <div>
                                <h4 className="text-xs font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                  Senior Capstone Project
                                </h4>
                                <p className="text-xs text-emerald-600 font-medium">
                                  Final Evaluation & Defense
                                </p>
                              </div>
                            </div>
                            <span className="text-xs font-semibold text-emerald-600 font-mono shrink-0">Eligible</span>
                          </div>

                          <div className="pt-3 flex items-start justify-between gap-3 group">
                            <div className="flex items-start gap-3">
                              <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                                <Users className="w-4 h-4 text-slate-600" />
                              </div>
                              <div>
                                <h4 className="text-xs font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                  1-on-1 Faculty Mentorship Hours
                                </h4>
                                <p className="text-xs text-slate-400 font-medium">
                                  Thursday 4:00 PM • Room 2
                                </p>
                              </div>
                            </div>
                            <span className="text-xs font-semibold text-slate-900 font-mono shrink-0">Booked</span>
                          </div>
                        </div>
                      )
                    ) : courses.length > 0 ? (
                      <div className="space-y-4 divide-y divide-slate-100">
                        {courses.map((course) => (
                          <div key={course.id} className="pt-3 first:pt-0 flex items-start justify-between gap-3 group">
                            <div className="flex items-start gap-3">
                              <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                                <BookOpen className="w-4 h-4 text-emerald-600" />
                              </div>
                              <div>
                                <h4 className="text-xs font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                  {course.title}
                                </h4>
                                <p className="text-xs text-slate-400 font-medium">
                                  {course.instructorName || 'Academy Mentor'} • {course.level || 'Standard Track'}
                                </p>
                              </div>
                            </div>
                            <span className="text-xs font-semibold text-emerald-700 font-mono shrink-0">Enrolled</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 px-4 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 space-y-2">
                        <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
                        <p className="text-xs font-semibold text-slate-800">No Enrolled Courses</p>
                        <p className="text-xs text-slate-400">You are not enrolled in any active courses yet.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* COLUMN 3: Floating Campus & Performance Card */}
                <div className="lg:col-span-4">
                  <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-md space-y-6">
                    <div className="relative rounded-2xl overflow-hidden aspect-video border border-slate-200 shadow-xs">
                      {isQuran ? (
                        <img
                          src="/images/muslim_girls_halaqah.jpg"
                          alt="Academy Central Campus"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-slate-900 to-slate-800 flex items-center justify-center">
                          <GraduationCap className="w-12 h-12 text-slate-600" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-white/10">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{isQuran ? 'Room 1 • Live Halaqah' : 'Room 1 • Live Classroom'}</span>
                      </div>
                      <div className="absolute bottom-3 right-3 bg-emerald-600 text-white px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize tracking-wider shadow-sm">
                        ONLINE
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold text-slate-950 font-display">
                        {tenant.name || 'Academy Central Campus'}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">
                        {tenant.customDomain || `${tenant.subdomain}.ankabit.app`} • Online SFU
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-100 text-xs">
                      <div>
                        <span className="text-xs text-slate-400 block font-medium">Weekly Study Hours</span>
                        <span className="text-sm font-semibold text-slate-900 font-mono">
                          {isDemo ? '14.5 Hours' : (studentSubmissions.length > 0 ? `${studentSubmissions.length * 2} Hours` : '0 Hours')}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block font-medium">
                          {isQuran ? 'Completed Recitations' : 'Completed Assignments'}
                        </span>
                        <span className="text-xs font-semibold text-slate-700">
                          {isDemo ? '48 Graded' : (studentSubmissions.length > 0 ? `${studentSubmissions.length} Recorded` : '0 Recorded')}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-semibold capitalize tracking-wider text-slate-400">
                        RATING
                      </span>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-slate-500 font-medium">
                            {isQuran ? 'Ustadhah evaluation score' : 'Faculty evaluation score'}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {isDemo ? 'Based on 48 graded tests' : (studentSubmissions.length > 0 ? `Based on ${studentSubmissions.length} evaluated assignment(s)` : 'Awaiting first graded assignment')}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-4xl sm:text-5xl font-semibold text-slate-950 font-display">
                            {isDemo ? '4.9' : (studentSubmissions.length > 0 ? '5.0' : '—')}
                          </span>
                          <div className="flex items-center justify-end gap-0.5 text-amber-400 mt-1">
                            <Star className={`w-3.5 h-3.5 ${isDemo || studentSubmissions.length > 0 ? 'fill-current' : 'text-slate-200'}`} />
                            <Star className={`w-3.5 h-3.5 ${isDemo || studentSubmissions.length > 0 ? 'fill-current' : 'text-slate-200'}`} />
                            <Star className={`w-3.5 h-3.5 ${isDemo || studentSubmissions.length > 0 ? 'fill-current' : 'text-slate-200'}`} />
                            <Star className={`w-3.5 h-3.5 ${isDemo || studentSubmissions.length > 0 ? 'fill-current' : 'text-slate-200'}`} />
                            <Star className={`w-3.5 h-3.5 ${isDemo || studentSubmissions.length > 0 ? 'fill-current' : 'text-slate-200'}`} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* BOTTOM FULL-WIDTH CARD: Structured Table */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-950 font-display">
                    {isQuran ? 'Recent Recitation Submissions & Ustadhah Evaluations' : 'Recent Project Submissions & Faculty Evaluations'}
                  </h3>
                  <span className="text-xs font-semibold text-slate-400">Active Term</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span className="text-xs font-semibold capitalize tracking-wider text-slate-400 block">
                      {isQuran ? 'MEMORIZED AYAT' : 'COMPLETED LESSONS'}
                    </span>
                    <span className="text-2xl font-semibold text-slate-950 font-display mt-1 block">
                      {isDemo ? (isQuran ? '4,820 Ayat' : '48 Lessons') : (isQuran ? `${studentSubmissions.length * 15} Ayat` : `${studentSubmissions.length} Lessons`)}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span className="text-xs font-semibold capitalize tracking-wider text-slate-400 block">
                      SUBMISSIONS GRADED
                    </span>
                    <span className="text-2xl font-semibold text-slate-950 font-display mt-1 block">
                      {isDemo ? '48 Evaluated' : `${studentSubmissions.filter((s) => s.status === 'graded').length} Evaluated`}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span className="text-xs font-semibold capitalize tracking-wider text-slate-400 block">
                      {isQuran ? 'MUMTAZ HONORS' : 'DISTINCTION SCORE'}
                    </span>
                    <span className="text-2xl font-semibold text-emerald-700 font-display mt-1 block">
                      {isDemo ? '96% Accuracy' : (studentSubmissions.length > 0 ? '100% On Track' : 'New Student')}
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-semibold capitalize tracking-wider text-xs">
                        <th className="py-3 px-3">{isQuran ? 'Surah & Ayah Range' : 'Module & Assignment Topic'}</th>
                        <th className="py-3 px-3">{isQuran ? 'Evaluating Ustadhah' : 'Evaluating Faculty'}</th>
                        <th className="py-3 px-3">Date & Submission ID</th>
                        <th className="py-3 px-3 text-right">Verdict & Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {studentSubmissions.length > 0 ? (
                        studentSubmissions.map((sub: any) => (
                          <tr
                            key={sub.id}
                            onClick={() => {
                              setActiveTab('assessments');
                              setAssessmentSubTab('submissions');
                            }}
                            className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                            title="Click to view evaluation and listen to teacher feedback"
                          >
                            <td className="py-3.5 px-3 font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                              <div className="flex items-center gap-2">
                                <span>{sub.surahName || sub.title || (isQuran ? 'Recitation Homework' : 'Coursework Submission')}</span>
                                {sub.teacherAudioFeedbackUrl && (
                                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded-md">
                                    <Volume2 className="w-3.5 h-3.5" /> Voice Note
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-3">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-semibold">
                                  {isQuran ? 'U' : 'F'}
                                </div>
                                <span className="text-xs font-semibold">{isQuran ? 'Academy Ustadhah' : 'Academy Faculty'}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-3 font-mono text-slate-500 text-xs">
                              {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : 'Recent'}
                            </td>
                            <td className="py-3.5 px-3 text-right">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${sub.status === 'graded' || sub.status === 'Mastered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                {sub.status === 'graded' || sub.status === 'Mastered' ? (isQuran ? `Mumtaz (${sub.score || 95}%)` : `Distinction (${sub.score || 95}%)`) : 'Pending Review'}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-8 px-3 text-center text-slate-400">
                            <p className="text-sm text-slate-500 font-medium">
                              {isQuran
                                ? "No recitation assignments recorded yet."
                                : "No coursework assignments recorded yet."}
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveTab('assessments');
                                setAssessmentSubTab('record');
                              }}
                              className="mt-2 text-xs font-semibold text-emerald-600 hover:text-emerald-700 underline cursor-pointer"
                            >
                              Record your first recitation homework now →
                            </button>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : null}

          {/* Other Active Module Tabs */}
          {activeTab === 'videos' && (
            <div className="h-full flex flex-col min-h-0">
              {activeLiveSession ? (
                <div className="flex-1 min-h-0 h-full rounded-2xl overflow-hidden shadow-lg border border-slate-200">
                  <LiveClassroomHub
                    roomTitle={activeLiveSession.title}
                    courseTitle={activeLiveSession.courseTitle}
                    userRole="student"
                    currentUserName={user?.name || 'Enrolled Student'}
                    niche={tenant.niche}
                    studentLevel={studentLevel}
                    onLeaveRoom={() => setActiveLiveSession(null)}
                  />
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 text-center space-y-5 max-w-xl mx-auto shadow-sm my-auto">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-md">
                    <Video className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      <span>Enrolled Class:</span>
                      <strong className="text-slate-900">{enrolledCourseTitle}</strong>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900">
                      {enrolledCourseTitle} Live Classroom
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                      Connect directly to your instructor and classmates in real-time. Video, audio, whiteboard collaboration, and classroom chat are synchronized for your enrolled class.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={() => {
                        const directSession: LiveClassSession = {
                          id: `room-${tenant.subdomain}-${Date.now().toString().slice(-5)}`,
                          title: `${enrolledCourseTitle} Live Session`,
                          courseTitle: enrolledCourseTitle,
                          teacherId: 'instructor',
                          teacherName: enrolledInstructorName,
                          targetLevel: 'all',
                          targetCohort: enrolledCourseTitle,
                          allowedStudentIds: [],
                          startedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                          status: 'live',
                          subdomain: tenant.subdomain,
                          niche: tenant.niche,
                        };
                        classroomSessionService.startSession(directSession);
                        setActiveLiveSession(directSession);
                      }}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm shadow-md transition-all inline-flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.98]"
                    >
                      <Play className="w-4 h-4 fill-current text-emerald-400" />
                      <span>Enter Class</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Curriculum & Mushaf Tab */}
          {activeTab === 'courses' && (
            <div>
              {engineType === 'quran' && (
                <QuranLMSContainer activeSubTab="quran" onAddToast={onAddToast} />
              )}
              {engineType === 'coding' && (
                <CodingLMSContainer activeSubTab="coding" onAddToast={onAddToast} />
              )}
              {engineType === 'school' && (
                <SchoolLMSContainer activeSubTab="school" onAddToast={onAddToast} />
              )}
            </div>
          )}

          {/* Schedule View */}
          {activeTab === 'schedule' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  {isQuran ? 'Weekly Halaqah Schedule' : 'Weekly Class & Lecture Schedule'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isQuran
                    ? "Upcoming daily memorization checkpoints, Muraja'ah circles, and Ustadhah office hours."
                    : "Upcoming live lectures, hands-on breakout sessions, and instructor office hours."}
                </p>
              </div>

              {isDemo ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-900">
                      <span>{isQuran ? 'Morning Hifz Circle' : 'Morning Lecture & Discussion'}</span>
                      <span className="text-emerald-600 font-mono">07:00 AM - 08:30 AM</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      {isQuran ? 'Daily Monday to Thursday • Ustadhah Zainab' : 'Daily Monday to Thursday • Senior Faculty'}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-900">
                      <span>{isQuran ? 'Tajweed Phonetics Workshop' : 'Applied Skills & Lab Practicum'}</span>
                      <span className="text-emerald-600 font-mono">04:00 PM - 05:30 PM</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      {isQuran ? 'Tuesdays & Saturdays • Ustadhah Fatima' : 'Tuesdays & Saturdays • Lab Instructor'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-12 px-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
                  <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-sm font-semibold text-slate-800">No Live Sessions Scheduled Today</p>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Your academy instructors will publish live halaqah and classroom schedules here. Check back when your course session begins.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Assessments View */}
          {activeTab === 'assessments' && (
            <div className="space-y-6">
              {/* Subtab Switcher Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      {isQuran ? 'Oral Recitations & Assessment Hub' : 'Assessments & Project Submissions'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Record oral assignments, review evaluations, and listen to instructor voice notes.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setAssessmentSubTab('record')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      assessmentSubTab === 'record'
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {isQuran ? 'Record' : 'Lab'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAssessmentSubTab('submissions')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      assessmentSubTab === 'submissions'
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Submissions ({studentSubmissions.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setAssessmentSubTab('rubrics')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      assessmentSubTab === 'rubrics'
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Rubrics
                  </button>
                </div>
              </div>

              {/* Subtab 1: Oral Recitation Studio */}
              {assessmentSubTab === 'record' && (
                <OralRecitationStudio
                  onSubmissionSuccess={(newSub) => {
                    setStudentSubmissions((prev) => [newSub, ...prev]);
                    setAssessmentSubTab('submissions');
                  }}
                  onAddToast={onAddToast}
                  isQuran={isQuran}
                  isCoding={isCoding}
                />
              )}

              {/* Subtab 2: Evaluated Submissions & Teacher Feedback */}
              {assessmentSubTab === 'submissions' && (
                <EvaluatedSubmissionsViewer
                  submissions={studentSubmissions}
                  onRefresh={() => {
                    api.getSubmissions(tenant.id || tenant.subdomain, user?.id).then((subs) => {
                      if (subs) setStudentSubmissions(subs);
                    });
                  }}
                  isQuran={isQuran}
                />
              )}

              {/* Subtab 3: Standardized Grading Rubrics */}
              {assessmentSubTab === 'rubrics' && (
                <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
                  <div className="space-y-1 pb-3 border-b border-slate-100">
                    <h4 className="text-base font-semibold text-slate-900 font-display">
                      {isQuran ? 'Standardized Sanad Tajweed Evaluation Rubric' : 'Academic Evaluation & Competency Rubrics'}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {isQuran
                        ? 'Oral examinations are rigorously scored across 4 foundational Tajweed pillars by certified Ustadhahs.'
                        : 'Practical projects are scored across architecture, code quality, and problem-solving benchmarks.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
                        <span>{isQuran ? '1. Makharij Al-Huroof (Articulation Points)' : '1. Architectural Design & Structure'}</span>
                        <span className="text-emerald-700 font-mono">35% Weight</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {isQuran
                          ? 'Accurate phonetic emission of throat, tongue, and lip letters (e.g. Kha, Ayn, Dad, Qaf).'
                          : 'Clean modular separation, scalable schema structures, and robust API endpoints.'}
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
                        <span>{isQuran ? '2. Sifat Al-Huroof (Letter Characteristics)' : '2. Algorithmic Efficiency & Cleanliness'}</span>
                        <span className="text-emerald-700 font-mono">25% Weight</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {isQuran
                          ? 'Proper application of Hams, Jahr, Qalqalah, Tafkheem (heavy), and Tarqeeq (light).'
                          : 'Optimal time and space complexity, typed interfaces, and zero memory leaks.'}
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
                        <span>{isQuran ? '3. Ahkam Nun Sakinah & Madd Duration' : '3. Error Handling & Edge Cases'}</span>
                        <span className="text-emerald-700 font-mono">25% Weight</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {isQuran
                          ? 'Flawless execution of Izhar, Idgham, Iqlab, Ikhfa, and accurate Harakat counts for Madd.'
                          : 'Comprehensive validation, fault tolerance, and graceful user error recovery.'}
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
                        <span>{isQuran ? '4. Waqf, Ibtida & Fluency' : '4. Oral Defense & Concept Mastery'}</span>
                        <span className="text-emerald-700 font-mono">15% Weight</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {isQuran
                          ? 'Appropriate stopping signs, starting rules, smooth breath control, and melodic pacing.'
                          : 'Ability to clearly articulate engineering trade-offs and decisions during oral review.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Student Progress View */}
          {activeTab === 'progress' && (
            <StudentProgress
              onAddToast={onAddToast}
              submissions={studentSubmissions}
            />
          )}

          {/* Community Forum */}
          {activeTab === 'forum' && (
            <LMSCommunityForum onAddToast={onAddToast} />
          )}

          {/* Tuition Portal */}
          {activeTab === 'tuition' && (
            <StudentTuitionPortal onAddToast={onAddToast} />
          )}

          {/* User Profile */}
          {activeTab === 'profile' && (
            <UserProfilePage onAddToast={onAddToast} />
          )}
          </div>
        </div>
      </main>
    </div>
  );
};
