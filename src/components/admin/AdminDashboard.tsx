import React, { useState } from 'react';
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
import { NotificationCenter } from '../notifications/NotificationCenter';
import { LiveClassroomHub } from '../classroom/LiveClassroomHub';
import { useTenant } from '../../context/TenantContext';
import { ToastMessage } from '../ui/Toast';
import { Button } from '../ui';
import { ExternalLink, Menu, SlidersHorizontal, Globe } from 'lucide-react';

interface AdminDashboardProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
  onViewLiveSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onAddToast,
  onViewLiveSite,
}) => {
  const { tenant, direction, language, setLanguage } = useTenant();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isOnboardingWizardOpen, setIsOnboardingWizardOpen] = useState(false);
  const [isPlanUpgradeModalOpen, setIsPlanUpgradeModalOpen] = useState(false);

  const plan = tenant.subscriptionPlan || 'free';

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
        {/* Top Header — Highly Responsive on Mobile */}
        <header className="bg-white border-b border-slate-200 py-2.5 sm:py-3.5 px-3 sm:px-8 flex items-center justify-between gap-2 sm:gap-4 sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 sm:p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none cursor-pointer shrink-0"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Breadcrumb (Hidden completely on mobile screens as requested) */}
            <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="font-semibold text-slate-800">{tenant.name}</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-900 font-bold capitalize text-sm">
                {isOnboardingWizardOpen ? 'Setup Wizard' : activeTab === 'overview' ? 'Academy Overview & Analytics' : activeTab.replace('_', ' ')}
              </span>
            </div>

            {/* Mobile Title (Clean, no breadcrumbs) */}
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

            {/* Real-time Notification Center */}
            <NotificationCenter onNavigateTab={(tab) => setActiveTab(tab as AdminTab)} />

            {/* Clean Upgrade CTA (No free tier tag, No emojis) */}
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
              className="px-2.5 sm:px-3.5"
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
              onAddToast={onAddToast}
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
              {activeTab === 'analytics' && (
                <AnalyticsDashboard onOpenUpgradeModal={() => setIsPlanUpgradeModalOpen(true)} />
              )}
              {activeTab === 'page_builder' && (
                <RealGrapesBuilder onAddToast={onAddToast} />
              )}
              {activeTab === 'form_builder' && (
                <VisualFormBuilder onAddToast={onAddToast} />
              )}
              {activeTab === 'curriculum' && (
                <CourseBuilder onAddToast={onAddToast} />
              )}
              {activeTab === 'classroom' && (
                <div className="h-[calc(100vh-140px)] min-h-[600px] rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                  <LiveClassroomHub
                    roomTitle={`${tenant.name} Live Session`}
                    courseTitle={tenant.tagline || 'Interactive Curriculum'}
                    userRole="teacher"
                    currentUserName="Academy Director"
                    niche={tenant.niche || 'quran'}
                  />
                </div>
              )}
              {activeTab === 'pricing' && (
                <TenantPricingEditor onAddToast={onAddToast} />
              )}
              {activeTab === 'payment_gateways' && (
                <PaymentGatewaySetup onAddToast={onAddToast} />
              )}
              {activeTab === 'crm' && (
                <LeadsCRM onAddToast={onAddToast} />
              )}
              {activeTab === 'integrations' && (
                <IntegrationsManager onAddToast={onAddToast} />
              )}
              {activeTab === 'settings' && (
                <ModernAcademySettings onAddToast={onAddToast} onOpenUpgradeModal={() => setIsPlanUpgradeModalOpen(true)} />
              )}
              {activeTab === 'profile' && (
                <UserProfilePage onAddToast={onAddToast} />
              )}
            </>
          )}
        </main>
      </div>

      {/* Subscription Plan Upgrade Modal */}
      <PlanUpgradeModal
        isOpen={isPlanUpgradeModalOpen}
        onClose={() => setIsPlanUpgradeModalOpen(false)}
        onAddToast={onAddToast}
      />
    </div>
  );
};
