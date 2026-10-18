import React, { useState, useEffect } from 'react';
import { Sidebar, AdminTab } from '../layout/Sidebar';
import { RealGrapesBuilder } from '../builder/RealGrapesBuilder';
import { ModularSectionPageBuilder } from '../builder/ModularSectionPageBuilder';
import { VisualFormBuilder } from '../builder/VisualFormBuilder';
import { CourseBuilder } from './CourseBuilder';
import { TenantPricingEditor } from './TenantPricingEditor';
import { PaymentGatewaySetup } from './PaymentGatewaySetup';
import { LeadsCRM } from './LeadsCRM';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { ModernAcademySettings } from './ModernAcademySettings';
import { GeneralAcademySettings } from './settings/GeneralAcademySettings';
import { StaffRolesManager } from './settings/StaffRolesManager';
import { BrandingWhiteLabeling } from './settings/BrandingWhiteLabeling';
import { IntegrationsManager } from './IntegrationsManager';
import { OnboardingWizard } from './OnboardingWizard';
import { UserProfilePage } from '../profile/UserProfilePage';
import { PlanUpgradeModal } from './PlanUpgradeModal';
import { PlatformTourGuide } from './PlatformTourGuide';
import { NotificationCenter } from '../notifications/NotificationCenter';
import { LiveClassroomHub } from '../classroom/LiveClassroomHub';
import { FormResponsesTable } from './FormResponsesTable';
import { AutomationsManager } from './AutomationsManager';
import { ChatAnalyticsSummary } from './ChatAnalyticsSummary';
import { LMSCommunityForum } from '../forum/LMSCommunityForum';
import { CommunicationAutomationHub } from './CommunicationAutomationHub';
import { SanadCertificateBuilder } from './SanadCertificateBuilder';
import { LockedFeatureCard } from './LockedFeatureCard';
import { StaffAndStudentManager } from './StaffAndStudentManager';
import { RevenueFinanceManager } from './RevenueFinanceManager';
import { useTenant } from '../../context/TenantContext';
import { useToast } from '../../context/ToastContext';
import { ToastMessage } from '../ui/Toast';
import { detectTenantNicheType } from '../../services/classroomCustomizationService';
import { Button } from '../ui';
import { Search, X, Command, Sparkles, BookOpen, Users, Video, Bell, CreditCard, Award, Settings, Layout, FileText, CheckCircle2, Key } from 'lucide-react';
import { ExternalLink, Menu, SlidersHorizontal, Globe } from 'lucide-react';

interface SearchOption {
  title: string;
  category: string;
  tab: AdminTab;
  icon: React.ReactNode;
}

const SEARCH_SHORTCUTS: SearchOption[] = [
  { title: 'Curriculum', category: 'Academics', tab: 'curriculum', icon: <BookOpen className="w-4 h-4 text-emerald-600" /> },
  { title: 'Faculty & Students', category: 'Academics', tab: 'users_staff', icon: <Users className="w-4 h-4 text-emerald-600" /> },
  { title: 'Student CRM', category: 'Admissions', tab: 'crm', icon: <Users className="w-4 h-4 text-blue-600" /> },
  { title: 'Submissions', category: 'Admissions', tab: 'form_responses', icon: <FileText className="w-4 h-4 text-indigo-600" /> },
  { title: 'Live Classroom', category: 'Academics', tab: 'classroom', icon: <Video className="w-4 h-4 text-purple-600" /> },
  { title: 'Revenue & Finance', category: 'Finance', tab: 'revenue', icon: <CreditCard className="w-4 h-4 text-emerald-600" /> },
  { title: 'Notifications', category: 'Comms', tab: 'notifications_hub', icon: <Bell className="w-4 h-4 text-amber-600" /> },
  { title: 'Tuition & Plans', category: 'Finance', tab: 'pricing', icon: <CreditCard className="w-4 h-4 text-emerald-600" /> },
  { title: 'Payment Gateways', category: 'Finance', tab: 'payment_gateways', icon: <CreditCard className="w-4 h-4 text-teal-600" /> },
  { title: 'Integrations & API Keys', category: 'Finance', tab: 'integrations', icon: <Key className="w-4 h-4 text-amber-600" /> },
  { title: 'Certificates', category: 'Academics', tab: 'certificate_studio', icon: <Award className="w-4 h-4 text-amber-600" /> },
  { title: 'Staff & Roles', category: 'Administration', tab: 'staff_roles', icon: <Users className="w-4 h-4 text-emerald-600" /> },
  { title: 'Branding & White-label', category: 'Design', tab: 'white_labeling', icon: <Layout className="w-4 h-4 text-purple-600" /> },
  { title: 'Page Builder', category: 'Design', tab: 'page_builder', icon: <Layout className="w-4 h-4 text-pink-600" /> },
  { title: 'Form Builder', category: 'Design', tab: 'form_builder', icon: <FileText className="w-4 h-4 text-cyan-600" /> },
  { title: 'Academy Settings', category: 'Administration', tab: 'settings', icon: <Settings className="w-4 h-4 text-slate-600" /> },
  { title: 'Community Forum', category: 'Academics', tab: 'forum', icon: <Users className="w-4 h-4 text-blue-600" /> },
];

interface AdminDashboardProps {
  onAddToast?: (toast: Omit<ToastMessage, 'id'>) => void;
  onViewLiveSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onAddToast,
  onViewLiveSite,
}) => {
  const { tenant, direction, language, setLanguage } = useTenant();
  const { addToast } = useToast();
  const niche = detectTenantNicheType(tenant);
  const isQuran = niche === 'quran';
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isOnboardingWizardOpen, setIsOnboardingWizardOpen] = useState(false);
  const [isPlanUpgradeModalOpen, setIsPlanUpgradeModalOpen] = useState(false);
  const [isTourGuideOpen, setIsTourGuideOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global Keyboard Shortcut: Ctrl+K or / opens Universal Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered search results
  const filteredShortcuts = SEARCH_SHORTCUTS.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectSearchResult = (tab: AdminTab) => {
    setIsOnboardingWizardOpen(false);
    setActiveTab(tab);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const plan = tenant.subscriptionPlan || 'free';

  // Helper to check plan hierarchy
  const isPlanUnlocked = (required?: 'qari' | 'growth' | 'enterprise'): boolean => {
    if (!required) return true;
    const tierWeights: Record<string, number> = {
      free: 1,
      qari: 2,
      growth: 3,
      enterprise: 4,
    };
    return (tierWeights[plan] || 1) >= (tierWeights[required] || 1);
  };

  // Forward toast to either parent callback or universal ToastContext
  const handleToast = (toast: Omit<ToastMessage, 'id'>) => {
    if (onAddToast) onAddToast(toast);
    else addToast(toast);
  };

  // Setup Wizard & Tour Guide Lifecycle Orchestration
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const setupCompleted =
        localStorage.getItem(`setup_completed_${tenant.subdomain}`) === 'true' ||
        Boolean((tenant.settings as any)?.onboardingCompleted);
      const setupDismissed = localStorage.getItem(`setup_dismissed_${tenant.subdomain}`);
      if (!setupCompleted && !setupDismissed) {
        setIsOnboardingWizardOpen(true);
      } else {
        setIsOnboardingWizardOpen(false);
      }
    }
  }, [tenant.subdomain, (tenant.settings as any)?.onboardingCompleted]);

  // Calculate real dynamic setup wizard completion percentage
  const calculateSetupProgress = () => {
    const isCompleted =
      (typeof window !== 'undefined' &&
        localStorage.getItem(`setup_completed_${tenant.subdomain}`) === 'true') ||
      Boolean((tenant.settings as any)?.onboardingCompleted);

    if (isCompleted) {
      return { completed: 8, total: 8, percentage: 100 };
    }

    let completed = 0;
    const total = 5;
    if (tenant.name && tenant.contactEmail) completed += 1;
    if (tenant.theme?.primaryColor || (tenant as any).brandColor) completed += 1;
    if (tenant.pricingPlans && tenant.pricingPlans.length > 0) completed += 1;
    if (tenant.paymentGateways && tenant.paymentGateways.some((g) => g.enabled)) completed += 1;
    if (tenant.customFormFields && tenant.customFormFields.length > 0) completed += 1;
    const percentage = Math.round((completed / total) * 100);
    return { completed, total, percentage };
  };

  const setupProgress = calculateSetupProgress();

  const toggleLanguage = () => {
    const nextLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(nextLang);
  };

  return (
    <div className="h-screen w-full flex overflow-hidden font-sans text-slate-900 bg-slate-100" dir={direction}>
      {/* Sidebar with Direct Tab Switchers */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setIsOnboardingWizardOpen(false);
          setActiveTab(tab);
        }}
        onViewLiveSite={onViewLiveSite}
        isOpenOnMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenProfile={() => {
          setIsOnboardingWizardOpen(false);
          setActiveTab('profile');
        }}
        onOpenUpgrade={() => setIsPlanUpgradeModalOpen(true)}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto bg-slate-50">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 py-2.5 sm:py-3.5 px-3 sm:px-8 flex items-center justify-between gap-2 sm:gap-4 sticky top-0 z-20 shadow-xs shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-xl">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 sm:p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none cursor-pointer shrink-0"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Universal Search Bar (Replaces static breadcrumb) */}
            <div className="relative flex-1">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  placeholder="Search courses, students, leads, settings... (Ctrl+K)"
                  className="w-full pl-9 pr-14 py-2 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 placeholder:text-slate-400 font-medium"
                />
                <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-200/80 rounded absolute right-2.5 border border-slate-300">
                  Ctrl K
                </kbd>
              </div>

              {/* Floating Search Results Palette */}
              {isSearchOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsSearchOpen(false)}
                  />
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 max-h-80 overflow-y-auto p-2 space-y-1 divide-y divide-slate-100 font-sans">
                    <div className="px-3 py-1.5 text-[10px] font-semibold capitalize tracking-wider text-slate-400 flex items-center justify-between">
                      <span>Quick Navigation Results</span>
                      <button onClick={() => setIsSearchOpen(false)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="pt-1 space-y-0.5">
                      {filteredShortcuts.length > 0 ? (
                        filteredShortcuts.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSelectSearchResult(item.tab)}
                            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left cursor-pointer group"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-slate-500 group-hover:text-emerald-600 shrink-0">
                                {item.icon}
                              </span>
                              <div>
                                <div className="text-xs font-semibold text-slate-900 group-hover:text-emerald-700">
                                  {item.title}
                                </div>
                                <span className="text-[10px] text-slate-400 font-medium">Category: {item.category}</span>
                              </div>
                            </div>
                            <span className="text-[10px] font-semibold text-slate-400 group-hover:text-emerald-600">Jump →</span>
                          </button>
                        ))
                      ) : (
                        <div className="p-4 text-center text-xs text-slate-400">
                          No matching portal feature found. Try "courses", "leads", "settings" or "classroom".
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Language Switcher */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer text-slate-700 select-none min-h-[36px]"
              title="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="hidden sm:inline">{language === 'ar' ? 'English' : 'العربية'}</span>
              <span className="sm:hidden">{language === 'ar' ? 'EN' : 'عر'}</span>
            </button>

            {/* Real-time Notification Center */}
            <NotificationCenter onNavigateTab={(tab) => setActiveTab(tab as AdminTab)} />

            {/* Upgrade CTA */}
            {plan !== 'enterprise' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPlanUpgradeModalOpen(true)}
                className="font-semibold hidden sm:inline-flex"
              >
                Upgrade
              </Button>
            )}

            {/* Dynamic Setup Wizard Button: only show if setup is NOT 100% */}
            {setupProgress.percentage < 100 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsOnboardingWizardOpen(!isOnboardingWizardOpen)}
                leftIcon={<SlidersHorizontal className="w-3.5 h-3.5" />}
                className="px-2.5 sm:px-3.5 bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100"
              >
                <span className="hidden sm:inline">{isOnboardingWizardOpen ? 'Exit' : `Setup (${setupProgress.percentage}%)`}</span>
                <span className="sm:hidden">{setupProgress.percentage}%</span>
              </Button>
            )}
          </div>
        </header>

        {/* Tab Content Body */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="w-11/12 mx-auto space-y-6">
            {isOnboardingWizardOpen ? (
            <OnboardingWizard
              onAddToast={handleToast}
              onComplete={() => {
                setIsOnboardingWizardOpen(false);
                if (typeof window !== 'undefined') {
                  localStorage.setItem(`setup_completed_${tenant.subdomain}`, 'true');
                }
                setActiveTab('overview');
                // Automatically launch the Guided Tour now that setup is complete!
                setTimeout(() => setIsTourGuideOpen(true), 400);
              }}
            />
          ) : (
            <>
              {activeTab === 'overview' && (
                <AnalyticsDashboard
                  onOpenUpgradeModal={() => setIsPlanUpgradeModalOpen(true)}
                  onNavigateToCourses={() => setActiveTab('curriculum')}
                  onNavigateToAdmissions={() => setActiveTab('crm')}
                  onNavigateTab={(tab: any) => setActiveTab(tab)}
                />
              )}
              {activeTab === 'notifications_hub' && (
                !isPlanUnlocked('growth') ? (
                  <LockedFeatureCard
                    title={isQuran ? "Automated Email & WhatsApp Communication Hub" : "Automated Student & Staff Communication Hub"}
                    description={isQuran ? "Automate welcome emails with student portal credentials, parent WhatsApp reminders for upcoming halaqahs, and tuition invoice alerts via Resend & Twilio." : "Automate welcome emails with student credentials, SMS/WhatsApp reminders for upcoming live classes, and tuition invoice receipts via Resend & Twilio."}
                    requiredPlan="growth"
                    onUpgrade={() => setIsPlanUpgradeModalOpen(true)}
                  />
                ) : (
                  <CommunicationAutomationHub />
                )
              )}
              {activeTab === 'certificate_studio' && (
                !isPlanUnlocked('enterprise') ? (
                  <LockedFeatureCard
                    title={isQuran ? "Sanad & Ijazah Certificate Generator Studio" : "Institutional Certificate Generator Studio"}
                    description={isQuran ? "Create authenticated graduation certificates with authentic Islamic Khatam borders, Sheikh wax seals, and public QR code tamper-proof verification." : "Create authenticated course graduation certificates with institutional emblems, department director seals, and tamper-proof verification."}
                    requiredPlan="enterprise"
                    onUpgrade={() => setIsPlanUpgradeModalOpen(true)}
                  />
                ) : (
                  <SanadCertificateBuilder />
                )
              )}
              {activeTab === 'page_builder' && (
                <RealGrapesBuilder onAddToast={handleToast} />
              )}
              {activeTab === 'form_builder' && (
                <VisualFormBuilder onAddToast={handleToast} />
              )}
              {activeTab === 'form_responses' && (
                <FormResponsesTable onAddToast={handleToast} />
              )}
              {activeTab === 'curriculum' && (
                <CourseBuilder onAddToast={handleToast} />
              )}
              {activeTab === 'classroom' && (
                !isPlanUnlocked('growth') ? (
                  <LockedFeatureCard
                    title="Live Virtual Classroom with Real-time WebRTC"
                    description={isQuran ? "Host HD live halaqah sessions, interactive multi-student recitations, whiteboard tajweed diagrams, and automated attendance logging." : "Host HD live interactive classroom sessions, breakout pods, real-time whiteboard diagrams, and automated attendance logging."}
                    requiredPlan="growth"
                    onUpgrade={() => setIsPlanUpgradeModalOpen(true)}
                  />
                ) : (
                  <div className="h-[calc(100vh-140px)] min-h-[600px] rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                    <LiveClassroomHub
                      roomTitle={`${tenant.name} Live Session`}
                      courseTitle={tenant.tagline || 'Interactive Curriculum'}
                      userRole="teacher"
                      currentUserName="Academy Director"
                      niche={niche}
                    />
                  </div>
                )
              )}
              {activeTab === 'forum' && (
                !isPlanUnlocked('qari') ? (
                  <LockedFeatureCard
                    title="LMS Community & Discussion Forum"
                    description={isQuran ? "Engage students and teachers in dedicated halaqah threads, recitation peer feedback, and community announcements." : "Engage students and instructors in dedicated cohort discussion channels, project collaboration, and community announcements."}
                    requiredPlan="qari"
                    onUpgrade={() => setIsPlanUpgradeModalOpen(true)}
                  />
                ) : (
                  <LMSCommunityForum onAddToast={handleToast} />
                )
              )}
              {activeTab === 'users_staff' && (
                <StaffAndStudentManager />
              )}
              {activeTab === 'revenue' && (
                <RevenueFinanceManager />
              )}
              {activeTab === 'pricing' && (
                <TenantPricingEditor onAddToast={handleToast} />
              )}
              {activeTab === 'payment_gateways' && (
                <PaymentGatewaySetup onAddToast={handleToast} />
              )}
              {activeTab === 'integrations' && (
                <IntegrationsManager onAddToast={handleToast} />
              )}
              {activeTab === 'crm' && (
                <LeadsCRM onAddToast={handleToast} />
              )}
              {activeTab === 'staff_roles' && (
                <StaffRolesManager />
              )}
              {activeTab === 'white_labeling' && (
                <BrandingWhiteLabeling onOpenUpgradeModal={() => setIsPlanUpgradeModalOpen(true)} />
              )}
              {activeTab === 'settings' && (
                <GeneralAcademySettings onOpenUpgradeModal={() => setIsPlanUpgradeModalOpen(true)} />
              )}
              {activeTab === 'profile' && (
                <UserProfilePage onAddToast={handleToast} />
              )}
            </>
          )}
          </div>
        </main>
      </div>

      {/* Subscription Plan Upgrade Modal */}
      <PlanUpgradeModal
        isOpen={isPlanUpgradeModalOpen}
        onClose={() => setIsPlanUpgradeModalOpen(false)}
        onAddToast={handleToast}
      />

      {/* Interactive Platform Tour Guide */}
      <PlatformTourGuide
        isOpen={isTourGuideOpen}
        onClose={() => setIsTourGuideOpen(false)}
        onNavigateTab={(tab) => {
          setIsOnboardingWizardOpen(false);
          setActiveTab(tab);
        }}
        academyName={tenant.name || 'Your Academy'}
      />
    </div>
  );
};
