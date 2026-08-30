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
import { VideoClassroomRoom } from '../../collaboration/VideoClassroomRoom';
import { useTenant } from '../../context/TenantContext';
import { ToastMessage } from '../ui/Toast';
import { Button, Badge } from '../ui';
import { ExternalLink, Menu, Sparkles, SlidersHorizontal, Shield } from 'lucide-react';

interface AdminDashboardProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
  onViewLiveSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onAddToast,
  onViewLiveSite,
}) => {
  const { tenant, updateTenantConfig, direction } = useTenant();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isOnboardingWizardOpen, setIsOnboardingWizardOpen] = useState(false);
  const [isPlanUpgradeModalOpen, setIsPlanUpgradeModalOpen] = useState(false);

  const plan = tenant.subscriptionPlan || 'free';

  const planLabels = {
    free: { label: 'Free Tier', variant: 'warning' as const },
    qari: { label: 'Qari Solo', variant: 'default' as const },
    growth: { label: 'Growth Plan', variant: 'success' as const },
    enterprise: { label: 'Enterprise VIP', variant: 'success' as const },
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
        <header className="bg-white border-b border-slate-200 py-3 px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-20">
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
            {/* Real-time Notification Center */}
            <NotificationCenter onNavigateTab={(tab) => setActiveTab(tab as AdminTab)} />

            {/* Active Plan Pill & Upgrade CTA */}
            <div className="hidden sm:flex items-center gap-2">
              <Badge variant={planLabels[plan].variant}>
                {planLabels[plan].label}
              </Badge>
              {plan !== 'enterprise' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPlanUpgradeModalOpen(true)}
                  leftIcon={<Sparkles className="w-3.5 h-3.5 text-amber-500" />}
                >
                  Upgrade
                </Button>
              )}
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsOnboardingWizardOpen(!isOnboardingWizardOpen)}
              leftIcon={<SlidersHorizontal className="w-3.5 h-3.5" />}
            >
              {isOnboardingWizardOpen ? 'Exit Wizard' : 'Setup Wizard'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsOnboardingWizardOpen(false);
                setActiveTab('settings');
              }}
            >
              Settings
            </Button>

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
              {/* Analytics IS the Primary Academy Overview */}
              {activeTab === 'overview' && (
                <AnalyticsDashboard onOpenUpgradeModal={() => setIsPlanUpgradeModalOpen(true)} />
              )}

              {activeTab === 'classroom' && (
                <div className="max-w-7xl mx-auto">
                  <VideoClassroomRoom
                    roomTitle="Instructor Live Classroom & Whiteboard"
                    courseTitle="Live Teaching & Interactive Review"
                    userRole="teacher"
                    currentUserName="Ustadh Ahmad (Instructor)"
                    niche={tenant.niche === 'coding' ? 'coding' : 'quran'}
                    onLeaveRoom={() => setActiveTab('overview')}
                  />
                </div>
              )}

              {activeTab === 'page_builder' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden min-h-[700px]">
                  <RealGrapesBuilder onAddToast={onAddToast} />
                </div>
              )}

              {activeTab === 'form_builder' && <VisualFormBuilder onAddToast={onAddToast} />}
              {activeTab === 'curriculum' && <CourseBuilder onAddToast={onAddToast} />}
              {activeTab === 'pricing' && <TenantPricingEditor onAddToast={onAddToast} />}
              {activeTab === 'payment_gateways' && <PaymentGatewaySetup onAddToast={onAddToast} />}
              {activeTab === 'crm' && <LeadsCRM onAddToast={onAddToast} />}
              {activeTab === 'analytics' && (
                <AnalyticsDashboard onOpenUpgradeModal={() => setIsPlanUpgradeModalOpen(true)} />
              )}
              {activeTab === 'settings' && <ModernAcademySettings onAddToast={onAddToast} />}
              {activeTab === 'integrations' && <IntegrationsManager onAddToast={onAddToast} />}
              {activeTab === 'profile' && <UserProfilePage onAddToast={onAddToast} />}
            </>
          )}
        </main>
      </div>

      {/* Plan Upgrade & Tier Switcher Modal */}
      <PlanUpgradeModal
        isOpen={isPlanUpgradeModalOpen}
        onClose={() => setIsPlanUpgradeModalOpen(false)}
        onAddToast={onAddToast}
      />
    </div>
  );
};
