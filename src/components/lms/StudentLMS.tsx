import React, { useState } from 'react';
import { Ayah } from '../../types';
import { QuranViewer } from './QuranViewer';
import { AudioRecitationPlayer } from './AudioRecitationPlayer';
import { StudentProgress } from './StudentProgress';
import { UserProfileModal } from '../profile/UserProfileModal';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { ToastMessage } from '../ui/Toast';
import {
  BookOpen,
  Award,
  Flame,
  CheckCircle2,
  Calendar,
  CreditCard,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Bookmark,
  Clock,
  User,
  Sliders,
  ExternalLink,
  Globe,
  LogOut,
  Menu,
  X,
  Settings
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { IslamicStarPattern, CrescentVector } from '../ui/IslamicArtDecoration';

export type StudentTab = 'quran' | 'audio' | 'progress' | 'tuition' | 'profile' | 'settings';

interface StudentLMSProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const StudentLMS: React.FC<StudentLMSProps> = ({ onAddToast }) => {
  const router = useRouter();
  const { tenant, language, toggleLanguage, direction } = useTenant();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<StudentTab>('quran');
  const [selectedAyah, setSelectedAyah] = useState<Ayah | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  const isAr = language === 'ar';

  const handleSelectAyah = (ayah: Ayah) => {
    setSelectedAyah(ayah);
  };

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const studentNavItems: { id: StudentTab; label: string; labelAr: string; icon: any }[] = [
    { id: 'quran', label: 'Quran Reader & Tajweed', labelAr: 'المصحف وأحكام التجويد', icon: BookOpen },
    { id: 'audio', label: 'Audio Looper & Recorder', labelAr: 'التسجيل الصوتي والتكرار', icon: Sliders },
    { id: 'progress', label: 'Progress & Reviews', labelAr: 'نسبة الإنجاز والمراجعة', icon: Award },
    { id: 'tuition', label: 'Tuition & Invoices', labelAr: 'الرسوم الدراسية والفواتير', icon: CreditCard },
    { id: 'profile', label: 'My Student Profile & Bio', labelAr: 'ملفي الشخصي وسيرتي', icon: User },
    { id: 'settings', label: 'Account & Security Settings', labelAr: 'إعدادات الحساب والأمان', icon: Settings },
  ];

  const handleStudentNavClick = (id: StudentTab) => {
    if (id === 'profile' || id === 'settings') {
      setIsProfileModalOpen(true);
    } else {
      setActiveTab(id);
    }
    setIsMobileNavOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans text-slate-900" dir={direction}>
      {/* Mobile Drawer Backdrop */}
      {isMobileNavOpen && (
        <div
          onClick={() => setIsMobileNavOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* ------------------------------------------------------------- */}
      {/* 1. DEDICATED STUDENT LMS LEFT SIDEBAR */}
      {/* ------------------------------------------------------------- */}
      <aside
        className={`bg-emerald-950 text-white border-r border-emerald-900 flex flex-col justify-between z-50 transition-all duration-200 ${
          isMobileNavOpen
            ? 'fixed inset-y-0 left-0 w-72 shadow-2xl flex'
            : 'hidden lg:flex lg:w-72 lg:sticky lg:top-0 lg:h-screen'
        }`}
      >
        {/* Top Header Branding */}
        <div>
          <div className="p-5 border-b border-emerald-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-emerald-900 border border-emerald-700 text-amber-300 flex items-center justify-center font-bold text-xl shadow-sm shrink-0">
                {tenant.faviconUrl || '📖'}
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-sm text-white truncate font-display">
                  {isAr ? tenant.nameAr : tenant.name}
                </h2>
                <p className="text-[11px] text-emerald-400 font-mono truncate">
                  Student Portal LMS
                </p>
              </div>
            </div>

            {isMobileNavOpen && (
              <button
                onClick={() => setIsMobileNavOpen(false)}
                className="lg:hidden p-1 rounded-md text-emerald-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Student Profile Card in Sidebar */}
          <div className="p-4 mx-3 my-4 bg-emerald-900/60 rounded-md border border-emerald-800/80 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-md bg-amber-400 text-slate-950 flex items-center justify-center font-extrabold font-display text-sm border border-amber-300 shadow-xs shrink-0">
                  {user?.name?.[0] || 'M'}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-white truncate font-display">
                    {user?.name || 'Mariam Mansoor'}
                  </p>
                  <span className="inline-block px-2 py-0.5 bg-emerald-800 text-emerald-200 text-[10px] font-bold rounded-md mt-0.5">
                    Intensive Hifz Track
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="p-1.5 rounded-md text-emerald-300 hover:text-white hover:bg-emerald-800 transition-colors cursor-pointer shrink-0"
                title="Profile & Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Metrics Inside Sidebar */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-800 text-xs">
              <div className="bg-emerald-950/80 p-2 rounded-md border border-emerald-800 text-center">
                <div className="flex items-center justify-center gap-1 text-amber-400 font-bold text-xs">
                  <Flame className="w-3.5 h-3.5 fill-amber-400" />
                  <span>14 Days</span>
                </div>
                <p className="text-[9px] text-emerald-300 uppercase tracking-wider mt-0.5">Streak</p>
              </div>

              <div className="bg-emerald-950/80 p-2 rounded-md border border-emerald-800 text-center">
                <div className="flex items-center justify-center gap-1 text-emerald-300 font-bold text-xs">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Juz 3/30</span>
                </div>
                <p className="text-[9px] text-emerald-300 uppercase tracking-wider mt-0.5">10% Done</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu Items with Enhanced Spacing & Larger Typography */}
          <nav className="px-3 space-y-1.5">
            {studentNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleStudentNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-900 text-white font-bold border-l-4 border-amber-400 shadow-md ring-1 ring-emerald-700/50'
                      : 'text-emerald-200 hover:text-white hover:bg-emerald-900/60'
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-amber-400' : 'text-emerald-400'}`} />
                  <span className="truncate">{isAr ? item.labelAr : item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Action Controls */}
        <div className="p-4 border-t border-emerald-900 space-y-3">
          <button
            onClick={() => router.push(`/${tenant.subdomain}`)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-emerald-900 hover:bg-emerald-850 text-amber-300 font-bold text-xs border border-emerald-700 transition-colors shadow-xs cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Academy Website</span>
          </button>

          <div className="flex items-center justify-between pt-1">
            <div className="text-[11px] text-emerald-300">
              <span>{isAr ? 'اللغة:' : 'Language:'}</span>
              <button
                onClick={toggleLanguage}
                className="ms-1.5 font-bold text-white hover:underline cursor-pointer"
              >
                {isAr ? 'English' : 'العربية'}
              </button>
            </div>

            <button
              onClick={logout}
              className="p-1.5 rounded-md text-emerald-300 hover:text-rose-400 hover:bg-emerald-900 transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* 2. MAIN LMS CONTENT AREA WITH GENEROUS SPACING */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-100">
        {/* Top Header Bar for Mobile & Quick Actions */}
        <header className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Trigger */}
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="lg:hidden p-2 rounded-md text-slate-700 hover:bg-slate-100 focus:outline-none cursor-pointer"
              aria-label="Open Student Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold font-display uppercase tracking-wider text-emerald-700 block">
                {isAr ? tenant.nameAr : tenant.name}
              </span>
              <h1 className="text-base sm:text-lg font-bold font-display text-slate-900 leading-tight">
                {activeTab === 'quran' && (isAr ? 'المصحف الشريف وأحكام التجويد' : 'Interactive Medina Mushaf & Tajweed')}
                {activeTab === 'audio' && (isAr ? 'مكرر التلاوة وتسجيل الواجبات' : 'Recitation Looper & Audio Homework')}
                {activeTab === 'progress' && (isAr ? 'تقارير الحفظ والإنجاز' : 'Curriculum Milestones & Teacher Feedback')}
                {activeTab === 'tuition' && (isAr ? 'الرسوم الدراسية والفواتير' : 'Student Tuition & Billing Portal')}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="hidden sm:inline text-slate-500">
              Teacher: <strong>Shaykh Ahmad Al-Mansoor</strong>
            </span>
            <span className="hidden sm:inline px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-md">
              Live Session: Today 5:30 PM
            </span>
          </div>
        </header>

        {/* Tab Viewport Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {activeTab === 'quran' && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              {/* Left / Main Quran Viewer */}
              <div className="xl:col-span-8">
                <QuranViewer
                  activeAyahNumber={selectedAyah?.number || null}
                  onSelectAyah={handleSelectAyah}
                  isPlaying={isPlaying}
                  onTogglePlay={handleTogglePlay}
                />
              </div>

              {/* Right / Audio Reciter & Looper */}
              <div className="xl:col-span-4 space-y-6">
                <AudioRecitationPlayer
                  currentAyah={selectedAyah}
                  isPlaying={isPlaying}
                  onTogglePlay={handleTogglePlay}
                  onAddToast={onAddToast}
                />
              </div>
            </div>
          )}

          {activeTab === 'audio' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-md border border-slate-200 shadow-md">
                <AudioRecitationPlayer
                  currentAyah={selectedAyah}
                  isPlaying={isPlaying}
                  onTogglePlay={handleTogglePlay}
                  onAddToast={onAddToast}
                />
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="max-w-5xl mx-auto">
              <StudentProgress onAddToast={onAddToast} />
            </div>
          )}

          {activeTab === 'tuition' && (
            <div className="max-w-5xl mx-auto bg-white p-6 sm:p-10 rounded-md border border-slate-200 shadow-md space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900">
                    Student Tuition & Payment History
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Direct tuition billing processed securely by {tenant.name}
                  </p>
                </div>
                <span className="px-3.5 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-md self-start sm:self-auto">
                  Active Subscription • Auto-Renewal
                </span>
              </div>

              {/* Active Plan Card */}
              <div className="p-6 bg-slate-50 rounded-md border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Enrolled Plan</span>
                  <h4 className="text-lg sm:text-xl font-bold font-display text-slate-900 mt-0.5">Intensive Hifz Program</h4>
                  <p className="text-xs text-slate-600 mt-1">4 live 1-on-1 sessions weekly • Sanad Ijazah Prep • Daily Audio Review</p>
                </div>
                <div className="sm:text-right">
                  <p className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-700">
                    $140.00 <span className="text-xs text-slate-500 font-sans font-normal">/ month</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Next Billing Date: September 15, 2026</p>
                </div>
              </div>

              {/* Invoice History Table */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold font-display uppercase tracking-wider text-slate-700">
                  Official Invoices & Receipts
                </h4>
                <div className="overflow-x-auto rounded-md border border-slate-200">
                  <table className="w-full text-xs text-left min-w-[600px]">
                    <thead className="bg-slate-100 text-slate-600 uppercase font-semibold font-display">
                      <tr>
                        <th className="p-4">Invoice #</th>
                        <th className="p-4">Program Track</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Payment Method</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Billing Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      <tr className="hover:bg-slate-50">
                        <td className="p-4 font-mono font-bold text-slate-900">INV-2026-0819</td>
                        <td className="p-4 font-semibold text-slate-800">Intensive Hifz Program</td>
                        <td className="p-4 font-mono font-bold text-emerald-700 text-sm">$140.00 USD</td>
                        <td className="p-4">Stripe Card (•••• 4242)</td>
                        <td className="p-4"><span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-md">Paid</span></td>
                        <td className="p-4 text-slate-500">Aug 15, 2026</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-4 font-mono font-bold text-slate-900">INV-2026-0715</td>
                        <td className="p-4 font-semibold text-slate-800">Intensive Hifz Program</td>
                        <td className="p-4 font-mono font-bold text-emerald-700 text-sm">$140.00 USD</td>
                        <td className="p-4">Moyasar Apple Pay</td>
                        <td className="p-4"><span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-md">Paid</span></td>
                        <td className="p-4 text-slate-500">Jul 15, 2026</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Profile & Settings Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onAddToast={onAddToast}
      />
    </div>
  );
};
