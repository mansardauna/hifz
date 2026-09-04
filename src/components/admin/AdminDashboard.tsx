import React, { useState, useEffect } from 'react';
import { Sidebar, AdminTab } from '../layout/Sidebar';
import { RealGrapesBuilder } from '../builder/RealGrapesBuilder';
import { VisualFormBuilder } from '../builder/VisualFormBuilder';
import { CourseBuilder } from './CourseBuilder';
import { TenantPricingEditor } from './TenantPricingEditor';
import { PaymentGatewaySetup } from './PaymentGatewaySetup';
import { LeadsCRM } from './LeadsCRM';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { ModernAcademySettings } from './ModernAcademySettings';
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
import { useTenant } from '../../context/TenantContext';
import { useToast } from '../../context/ToastContext';
import { ToastMessage } from '../ui/Toast';
import { Button } from '../ui';
import { ExternalLink, Menu, SlidersHorizontal, Globe, Compass } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isOnboardingWizardOpen, setIsOnboardingWizardOpen] = useState(false);
  const [isPlanUpgradeModalOpen, setIsPlanUpgradeModalOpen] = useState(false);
  const [isTourGuideOpen, setIsTourGuideOpen] = useState(false);

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

  // Check if tour should auto-trigger for fresh academies
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tourDone = localStorage.getItem('techmadrasah_tour_completed');
      if (!tourDone) {
        const timer = setTimeout(() => setIsTourGuideOpen(true), 600);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  // Calculate real dynamic setup wizard completion percentage
  const calculateSetupProgress = () => {
    let completed = 0;
    const total = 5;
    if (tenant.name && tenant.contactEmail) completed += 1;
    if (tenant.theme?.primaryColor) completed += 1;
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
    <div className="min-h-screen bg-slate-100 flex font-sans text-slate-900 overflow-x-hidden" dir={direction}>
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
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 py-2.5 sm:py-3.5 px-3 sm:px-8 flex items-center justify-between gap-2 sm:gap-4 sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 sm:p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none cursor-pointer shrink-0"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Breadcrumb */}
            <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="font-semibold text-slate-800">{tenant.name}</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-900 font-bold capitalize text-sm">
                {isOnboardingWizardOpen
                  ? 'Setup Wizard'
                  : activeTab === 'overview'
                  ? 'Academy Overview & Analytics'
                  : activeTab === 'notifications_hub'
                  ? 'Email & WhatsApp Notifications'
                  : activeTab === 'certificate_studio'
                  ? 'Sanad & Ijazah Studio'
                  : activeTab.replace('_', ' ')}
              </span>
            </div>

            {/* Mobile Title */}
            <div className="md:hidden flex items-center gap-1.5 min-w-0">
              <span className="text-xs font-extrabold text-slate-900 truncate">
                {isOnboardingWizardOpen ? 'Setup' : activeTab === 'overview' ? 'Overview' : activeTab.replace('_', ' ')}
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

            {/* Interactive Tour Guide Button */}
            <button
              type="button"
              onClick={() => setIsTourGuideOpen(true)}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-bold rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center gap-1.5 cursor-pointer select-none min-h-[36px]"
              title="Launch Platform Tour Guide"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="hidden sm:inline">Tour Guide</span>
              <span className="sm:hidden">Tour</span>
            </button>

            {/* Real-time Notification Center */}
            <NotificationCenter onNavigateTab={(tab) => setActiveTab(tab as AdminTab)} />

            {/* Upgrade CTA */}
            {plan !== 'enterprise' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPlanUpgradeModalOpen(true)}
                className="font-bold hidden sm:inline-flex"
              >
                Upgrade
              </Button>
            )}

            {/* Dynamic Setup Wizard Button showing percentage */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsOnboardingWizardOpen(!isOnboardingWizardOpen)}
              leftIcon={<SlidersHorizontal className="w-3.5 h-3.5" />}
              className="px-2.5 sm:px-3.5"
            >
              <span className="hidden sm:inline">{isOnboardingWizardOpen ? 'Exit' : `Setup (${setupProgress.percentage}%)`}</span>
              <span className="sm:hidden">{setupProgress.percentage}%</span>
            </Button>

            {/* Live Site CTA */}
            <Button
              variant="primary"
              size="sm"
              onClick={onViewLiveSite}
              rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
              className="px-2.5 sm:px-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
            >
              <span className="hidden sm:inline">Live Site</span>
              <span className="sm:hidden">Live</span>
            </Button>
          </div>
        </header>

        {/* Tab Content Body */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 overflow-y-auto">
          {isOnboardingWizardOpen ? (
            <OnboardingWizard
              onAddToast={handleToast}
              onComplete={() => {
                setIsOnboardingWizardOpen(false);
                setActiveTab('overview');
              }}
            />
          ) : (
            <>
              {activeTab === 'overview' && (
                <AnalyticsDashboard onOpenUpgradeModal={() => setIsPlanUpgradeModalOpen(true)} />
              )}
              {activeTab === 'notifications_hub' && (
                !isPlanUnlocked('growth') ? (
                  <LockedFeatureCard
                    title="Automated Email & WhatsApp Communication Hub"
                    description="Automate welcome emails with student portal credentials, parent WhatsApp reminders for upcoming halaqahs, and tuition invoice alerts via Resend & Twilio."
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
                    title="Sanad & Ijazah Certificate Generator Studio"
                    description="Create authenticated graduation certificates with authentic Islamic Khatam borders, Sheikh wax seals, and public QR code tamper-proof verification."
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
                    description="Host HD live halaqah sessions, interactive multi-student recitations, whiteboard tajweed diagrams, and automated attendance logging."
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
                      niche={tenant.niche || 'quran'}
                    />
                  </div>
                )
              )}
              {activeTab === 'forum' && (
                !isPlanUnlocked('qari') ? (
                  <LockedFeatureCard
                    title="LMS Community & Discussion Forum"
                    description="Engage students and teachers in dedicated halaqah threads, recitation peer feedback, and community announcements."
                    requiredPlan="qari"
                    onUpgrade={() => setIsPlanUpgradeModalOpen(true)}
                  />
                ) : (
                  <LMSCommunityForum onAddToast={handleToast} />
                )
              )}
              {activeTab === 'pricing' && (
                <TenantPricingEditor onAddToast={handleToast} />
              )}
              {activeTab === 'payment_gateways' && (
                <PaymentGatewaySetup onAddToast={handleToast} />
              )}
              {activeTab === 'crm' && (
                <LeadsCRM onAddToast={handleToast} />
              )}
              {activeTab === 'settings' && (
                <ModernAcademySettings onAddToast={handleToast} onOpenUpgradeModal={() => setIsPlanUpgradeModalOpen(true)} />
              )}
              {activeTab === 'profile' && (
                <UserProfilePage onAddToast={handleToast} />
              )}
            </>
          )}
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
