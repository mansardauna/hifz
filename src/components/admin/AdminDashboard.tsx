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
import { Button, Badge } from '../ui';
import { ExternalLink, Menu, SlidersHorizontal, Globe } from 'lucide-react';

interface AdminDashboardProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
  onViewLiveSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onAddToast,
  onViewLiveSite,
}) => {
  const { tenant, updateTenantConfig, direction, language, setLanguage } = useTenant();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isOnboardingWizardOpen, setIsOnboardingWizardOpen] = useState(false);
  const [isPlanUpgradeModalOpen, setIsPlanUpgradeModalOpen] = useState(false);

  const plan = tenant.subscriptionPlan || 'free';

  // 1. Calculate real dynamic setup wizard completion percentage
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
    <div className="min-h-screen bg-slate-100 flex font-sans text-slate-900" dir={direction}>
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
        <header className="bg-white border-b border-slate-200 py-3 px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="font-semibold text-slate-800 hidden sm:inline">{tenant.name}</span>
              <span className="text-slate-300 hidden sm:inline">/</span>
              <span className="text-slate-900 font-bold capitalize text-sm">
                {isOnboardingWizardOpen ? 'Setup Wizard' : activeTab === 'overview' ? 'Academy Overview & Analytics' : activeTab.replace('_', ' ')}
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

            {/* Real-time Notification Center */}
            <NotificationCenter onNavigateTab={(tab) => setActiveTab(tab as AdminTab)} />

            {/* Clean Upgrade CTA (No free tier tag, No emojis) */}
            {plan !== 'enterprise' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPlanUpgradeModalOpen(true)}
                className="font-bold"
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
            >
              {isOnboardingWizardOpen ? 'Exit Wizard' : `Setup (${setupProgress.percentage}%)`}
            </Button>

            {/* Live Site CTA */}
            <Button
              variant="primary"
              size="sm"
              onClick={onViewLiveSite}
              rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
            >
              Live Site
            </Button>
          </div>
        </header>

        {/* Tab Content Body */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
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
                <div className="h-[750px] rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
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
