import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { ToastMessage } from '../ui/Toast';
import { Button, Card, Badge } from '../ui';
import {
  BookOpen,
  Award,
  CreditCard,
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
  Calendar,
  Sparkles,
  Volume2,
  Clock,
  Play,
  Copy,
  Check,
  Users
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LiveClassroomHub, StudentLevelTier } from '../classroom/LiveClassroomHub';
import { NotificationCenter } from '../notifications/NotificationCenter';
import { LMSCommunityForum } from '../forum/LMSCommunityForum';
import { TeacherDashboard } from '../teacher/TeacherDashboard';
import { UserProfilePage } from '../profile/UserProfilePage';
import { classroomSessionService, LiveClassSession } from '../../services/classroomSessionService';

// Modular Imports
import { detectLmsEngineType, LMS_MODULE_REGISTRY, LmsNavTabConfig } from '../../modules/registry';
import { QuranLMSContainer } from '../../modules/lms-quran';
import { SchoolLMSContainer } from '../../modules/lms-school';
import { CodingLMSContainer } from '../../modules/lms-coding';
import { StudentTuitionPortal } from '../../modules/common/billing';

interface StudentLMSProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen className="w-4 h-4" />,
  Volume2: <Volume2 className="w-4 h-4" />,
  Award: <Award className="w-4 h-4" />,
  Radio: <Radio className="w-4 h-4" />,
  GraduationCap: <GraduationCap className="w-4 h-4" />,
  FileCheck2: <FileCheck2 className="w-4 h-4" />,
  Calendar: <Calendar className="w-4 h-4" />,
  Code2: <Code2 className="w-4 h-4" />,
  MessageSquare: <MessageSquare className="w-4 h-4" />,
  CreditCard: <CreditCard className="w-4 h-4" />,
  User: <User className="w-4 h-4" />,
  Settings: <Settings className="w-4 h-4" />
};

export const StudentLMS: React.FC<StudentLMSProps> = ({ onAddToast }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { tenant, direction, language, setLanguage } = useTenant();
  const { user, logout } = useAuth();

  // If authenticated user is a Teacher, route to dedicated Instructor Studio
  if (user?.role === 'teacher') {
    return <TeacherDashboard onAddToast={onAddToast} />;
  }

  // Detect active LMS Engine Architecture (Quran, School, or Coding)
  const engineType = detectLmsEngineType(tenant.niche, tenant.subdomain);
  const descriptor = LMS_MODULE_REGISTRY[engineType];

  const [activeTab, setActiveTab] = useState<string>(descriptor.defaultTab);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  const [activeLiveSession, setActiveLiveSession] = useState<LiveClassSession | null>(null);
  const [studentLevel, setStudentLevel] = useState<StudentLevelTier>('intermediate');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Auto-detect URL query params (?tab=classroom&roomId=...) on mount
  useEffect(() => {
    const tabParam = searchParams?.get('tab');
    const roomIdParam = searchParams?.get('roomId');
    if (tabParam && tabParam === 'classroom') {
      setActiveTab('classroom');
      if (roomIdParam) {
        const found = classroomSessionService.getSessionById(tenant.subdomain, roomIdParam);
        if (found) setActiveLiveSession(found);
      }
    }
  }, [searchParams]);

  // Subscribe to Live Sessions broadcast by teachers
  useEffect(() => {
    const active = classroomSessionService.getActiveSessionForStudent(
      tenant.subdomain,
      user?.id,
      user?.cohort,
      studentLevel
    );
    if (active) setActiveLiveSession(active);

    const unsubscribe = classroomSessionService.subscribe((event) => {
      if (event.type === 'SESSION_STARTED' && event.session && event.session.subdomain === tenant.subdomain) {
        setActiveLiveSession(event.session);
      } else if (event.type === 'SESSION_ENDED') {
        setActiveLiveSession((prev) => (prev && prev.id === event.sessionId ? null : prev));
      }
    });
    return () => unsubscribe();
  }, [tenant.subdomain, user?.id, user?.cohort, studentLevel]);

  const handleCopyClassroomInvite = () => {
    const roomUrl = `${window.location.origin}/${tenant.subdomain}/lms?tab=classroom&roomId=${activeLiveSession?.id || 'live-room'}`;
    navigator.clipboard.writeText(roomUrl);
    setCopiedLink(true);
    onAddToast({
      type: 'success',
      title: 'Invite Link Copied',
      message: 'Classroom link copied to clipboard.'
    });
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const isRTL = direction === 'rtl' || language === 'ar';

  return (
    <div
      className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white ${
        isRTL ? 'rtl' : 'ltr'
      }`}
    >
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="p-2 -ml-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            aria-label="Toggle Navigation"
          >
            {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-3">
            {tenant.logoUrl ? (
              <img
                src={tenant.logoUrl}
                alt={tenant.name}
                className="w-8 h-8 rounded-xl object-contain bg-slate-800 p-1"
              />
            ) : (
              <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center font-black text-white text-sm shadow-md">
                {tenant.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-sm font-black tracking-tight text-white leading-tight">
                {isRTL && tenant.nameAr ? tenant.nameAr : tenant.name}
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">
                {descriptor.displayName}
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Bar */}
        <div className="flex items-center gap-2.5">
          {/* Notification Center */}
          <NotificationCenter />

          {/* Language Switcher */}
          <button
            type="button"
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          {/* User Profile Capsule */}
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-xs shadow-inner">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'ST'}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-bold text-slate-200 line-clamp-1">{user?.name || 'Student'}</p>
              <p className="text-[10px] text-emerald-400 font-medium capitalize">{user?.role || 'Enrolled Student'}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main App Layout */}
      <div className="flex-1 flex">
        {/* Navigation Sidebar */}
        <aside
          className={`fixed lg:sticky top-[57px] z-30 h-[calc(100vh-57px)] w-64 bg-slate-900/95 lg:bg-slate-900/50 border-r border-slate-800/80 p-4 flex flex-col justify-between transition-transform duration-200 ${
            isMobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 px-3">
                Learning Modules
              </span>
              <nav className="mt-2 space-y-1">
                {descriptor.tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsMobileNavOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={isActive ? 'text-white' : 'text-slate-400'}>
                          {ICON_MAP[tab.iconName] || <BookOpen className="w-4 h-4" />}
                        </span>
                        <span>{isRTL ? tab.labelAr : tab.label}</span>
                      </div>

                      {tab.isCommon && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          Shared
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Quick Support Badge */}
          <div className="p-3 bg-slate-800/50 border border-slate-800 rounded-2xl text-[11px] text-slate-400 flex items-center justify-between">
            <span className="font-medium">Version 2.4 Modular</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </aside>

        {/* Dynamic Content Workspace */}
        <main className="flex-1 p-4 lg:p-8 max-w-[1600px] mx-auto w-full overflow-y-auto">
          {/* 1. Common Live Classroom Hub (WebRTC Video + Interactive Whiteboard + Chat + Live Dock) */}
          {activeTab === 'classroom' && (
            <div className="space-y-6">
              {activeLiveSession ? (
                <LiveClassroomHub
                  roomTitle={activeLiveSession.title}
                  courseTitle={activeLiveSession.courseTitle}
                  userRole="student"
                  currentUserName={user?.name || 'Student'}
                  niche={tenant.niche}
                  studentLevel={studentLevel}
                  onLeaveRoom={() => setActiveLiveSession(null)}
                />
              ) : (
                <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                    <Radio className="w-8 h-8 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Live Classroom Portal</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      No active live halaqah or lecture broadcast detected. You can launch a standby session or wait for the teacher.
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <Button
                      variant="primary"
                      onClick={() => {
                        const mockSession: LiveClassSession = {
                          id: `room-${tenant.subdomain}-${Date.now().toString().slice(-4)}`,
                          title: descriptor.displayName,
                          courseTitle: tenant.tagline || `${tenant.name} Class`,
                          teacherId: 'teacher-1',
                          teacherName: 'Instructor',
                          targetLevel: 'intermediate',
                          targetCohort: user?.cohort || 'Assigned Cohort',
                          allowedStudentIds: [],
                          startedAt: new Date().toLocaleTimeString(),
                          status: 'live',
                          subdomain: tenant.subdomain,
                          niche: tenant.niche
                        };
                        classroomSessionService.startSession(mockSession);
                        setActiveLiveSession(mockSession);
                      }}
                      className="font-bold text-xs gap-2"
                    >
                      <Play className="w-4 h-4" /> Enter Interactive Room
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. Common Community Forum */}
          {activeTab === 'forum' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <LMSCommunityForum onAddToast={onAddToast} />
            </div>
          )}

          {/* 3. Common Tuition & Invoicing Portal */}
          {activeTab === 'tuition' && (
            <StudentTuitionPortal onAddToast={onAddToast} />
          )}

          {/* 4. Common Profile & Settings */}
          {(activeTab === 'profile' || activeTab === 'settings') && (
            <div className="max-w-4xl mx-auto">
              <UserProfilePage onAddToast={onAddToast} />
            </div>
          )}

          {/* 5. Domain-Peculiar Quran LMS */}
          {engineType === 'quran' && (activeTab === 'quran' || activeTab === 'audio' || activeTab === 'progress') && (
            <QuranLMSContainer
              activeSubTab={activeTab as 'quran' | 'audio' | 'progress'}
              onAddToast={onAddToast}
            />
          )}

          {/* 6. Domain-Peculiar School & Vocational LMS */}
          {engineType === 'school' && (activeTab === 'courses' || activeTab === 'assessments' || activeTab === 'assignments' || activeTab === 'grades' || activeTab === 'schedule') && (
            <SchoolLMSContainer
              activeSubTab={activeTab as any}
              onAddToast={onAddToast}
            />
          )}

          {/* 7. Domain-Peculiar Coding LMS */}
          {engineType === 'coding' && (activeTab === 'coding' || activeTab === 'challenges' || activeTab === 'syllabus') && (
            <CodingLMSContainer
              activeSubTab={activeTab as any}
              onAddToast={onAddToast}
            />
          )}
        </main>
      </div>
    </div>
  );
};
