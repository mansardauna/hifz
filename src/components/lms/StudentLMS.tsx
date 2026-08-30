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
  Globe
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { LiveClassroomHub } from '../classroom/LiveClassroomHub';
import { CodingSandboxWorkspace } from '../../plugins/coding/CodingSandboxWorkspace';
import { NotificationCenter } from '../notifications/NotificationCenter';

export type StudentTab = 'quran' | 'classroom' | 'coding' | 'audio' | 'progress' | 'tuition' | 'profile' | 'settings';

interface StudentLMSProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const StudentLMS: React.FC<StudentLMSProps> = ({ onAddToast }) => {
  const router = useRouter();
  const { tenant, direction, language, setLanguage } = useTenant();
  const { user, logout } = useAuth();

  const isCodingNiche = tenant.niche === 'coding' || tenant.subdomain.includes('code');
  const isQuranNiche = !tenant.niche || tenant.niche === 'quran' || tenant.subdomain.includes('furqan') || tenant.subdomain.includes('dar') || tenant.subdomain.includes('hifz');

  const [activeTab, setActiveTab] = useState<StudentTab>(isCodingNiche ? 'coding' : 'quran');
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

  // Strictly filter navigation items by tenant niche (No coding in Quran academies, and NO Quran in coding academies)
  const studentNavItems = useMemo(() => {
    const items: { id: StudentTab; label: string; icon: any }[] = [];

    if (isCodingNiche) {
      items.push({ id: 'coding', label: 'Coding Sandbox Lab', icon: Code2 });
      items.push({ id: 'classroom', label: 'Live Video Classroom', icon: Radio });
    } else if (isQuranNiche) {
      items.push({ id: 'quran', label: 'Quran Reader & Tajweed', icon: BookOpen });
      items.push({ id: 'audio', label: 'Audio Looper & Recorder', icon: Sliders });
      items.push({ id: 'classroom', label: 'Live Virtual Classroom', icon: Radio });
    } else {
      items.push({ id: 'classroom', label: 'Live Virtual Classroom', icon: Radio });
    }

    items.push({ id: 'progress', label: 'Curriculum & Progress', icon: Award });
    items.push({ id: 'tuition', label: 'Tuition & Invoices', icon: CreditCard });
    items.push({ id: 'profile', label: 'My Student Profile', icon: User });
    items.push({ id: 'settings', label: 'Account & Security', icon: Settings });

    return items;
  }, [isCodingNiche, isQuranNiche]);

  const handleStudentNavClick = (id: StudentTab) => {
    setActiveTab(id);
    setIsMobileNavOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans text-slate-900" dir={direction}>
      {/* Mobile Drawer Backdrop */}
      {isMobileNavOpen && (
        <div
          onClick={() => setIsMobileNavOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* 1. Student Left Sidebar */}
      <aside
        className={`bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col justify-between z-50 transition-all duration-200 ${
          isMobileNavOpen
            ? 'fixed inset-y-0 left-0 w-64 shadow-2xl flex'
            : 'hidden lg:flex lg:w-64 lg:sticky lg:top-0 lg:h-screen'
        }`}
      >
        <div>
          {/* Academy Brand Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center font-bold text-xs shrink-0">
                {isCodingNiche ? <Code2 className="w-4 h-4 text-blue-400" /> : <BookOpen className="w-4 h-4 text-emerald-400" />}
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-xs text-white truncate">{tenant.name}</h2>
                <p className="text-[10px] text-slate-400 font-mono truncate">{tenant.subdomain}.techmadrasah.app</p>
              </div>
            </div>

            {isMobileNavOpen && (
              <button
                onClick={() => setIsMobileNavOpen(false)}
                className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Student Profile Snapshot in Sidebar */}
          <div className="p-3 mx-3 my-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-xs">
                {user?.name?.charAt(0).toUpperCase() || 'M'}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-xs text-white truncate">{user?.name || 'Enrolled Student'}</p>
                <Badge variant="success">Active Learner</Badge>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {studentNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleStudentNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white/10 text-white shadow-2xs font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Action Controls */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-slate-300 bg-slate-800/60 border-slate-700 hover:bg-slate-800"
            onClick={() => router.push(`/${tenant.subdomain}`)}
            rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
          >
            Live Academy Site
          </Button>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 2. Main LMS Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 py-3 px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none cursor-pointer"
              aria-label="Open Student Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="font-semibold text-slate-800 hidden sm:inline">{tenant.name}</span>
              <span className="text-slate-300 hidden sm:inline">/</span>
              <span className="text-slate-900 font-bold capitalize text-sm">
                {activeTab === 'quran' && 'Medina Mushaf Reader & Tajweed'}
                {activeTab === 'classroom' && 'Live Classroom Hub'}
                {activeTab === 'coding' && 'Coding Lab & Interactive Challenges'}
                {activeTab === 'audio' && 'Recitation Looper & Audio Homework'}
                {activeTab === 'progress' && 'Milestones & Teacher Feedback'}
                {activeTab === 'tuition' && 'Student Tuition & Invoices'}
                {activeTab === 'profile' && 'Student Profile'}
                {activeTab === 'settings' && 'Account & Security Settings'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Language Switcher */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer text-slate-700"
              title="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{language === 'ar' ? 'English' : 'العربية'}</span>
            </button>

            <NotificationCenter onNavigateTab={(tab) => setActiveTab(tab as StudentTab)} />

            <Button
              variant="primary"
              size="sm"
              onClick={() => setActiveTab('classroom')}
              leftIcon={<Radio className="w-3.5 h-3.5" />}
            >
              Join Live Class
            </Button>
          </div>
        </header>

        {/* Tab Viewport Main Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {activeTab === 'classroom' && (
            <div className="h-[750px] rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
              <LiveClassroomHub
                roomTitle={`${tenant.name} Live Masterclass`}
                courseTitle={tenant.tagline || 'Interactive Learning Session'}
                userRole="student"
                currentUserName={user?.name || 'Enrolled Student'}
                niche={isCodingNiche ? 'coding' : 'quran'}
                onLeaveRoom={() => setActiveTab(isCodingNiche ? 'coding' : 'quran')}
                renderWorkspacePlugin={
                  isCodingNiche ? (
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

          {activeTab === 'coding' && isCodingNiche && (
            <CodingSandboxWorkspace />
          )}

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

          {activeTab === 'progress' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <StudentProgress onAddToast={onAddToast} />
            </div>
          )}

          {activeTab === 'tuition' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Enrolled Tuition Invoices</h3>
                    <p className="text-xs text-slate-500">View and download official payment receipts issued by {tenant.name}.</p>
                  </div>
                  <Badge variant="success">Account Current (No Dues)</Badge>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800">Spring Semester Term Tuition</span>
                    <span className="text-slate-500 ml-2 font-mono">#INV-2026-089</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold font-mono text-emerald-700">$65.00 Paid</span>
                    <Button size="sm" variant="outline">Download PDF</Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-4xl mx-auto">
              <UserProfilePage onAddToast={onAddToast} />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-4xl mx-auto">
              <UserProfilePage onAddToast={onAddToast} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
