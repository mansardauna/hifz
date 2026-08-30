import React, { useState } from 'react';
import { Sidebar, AdminTab } from '../layout/Sidebar';
import { RealGrapesBuilder } from '../builder/RealGrapesBuilder';
import { VisualFormBuilder } from '../builder/VisualFormBuilder';
import { CourseBuilder } from './CourseBuilder';
import { LandingCoursesEditor } from './LandingCoursesEditor';
import { TenantPricingEditor } from './TenantPricingEditor';
import { PaymentGatewaySetup } from './PaymentGatewaySetup';
import { LeadsCRM } from './LeadsCRM';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { SiteBuilder } from './SiteBuilder';
import { ModernAcademySettings } from './ModernAcademySettings';
import { OnboardingWizard } from './OnboardingWizard';
import { UserProfileModal } from '../profile/UserProfileModal';
import { VideoClassroomRoom } from '../../collaboration/VideoClassroomRoom';
import { useTenant } from '../../context/TenantContext';
import { ToastMessage } from '../ui/Toast';
import { ExternalLink, Sparkles, ShieldCheck, Layers, CheckCircle2, Menu, User, Settings, Rocket } from 'lucide-react';

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
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isOnboardingWizardOpen, setIsOnboardingWizardOpen] = useState(false);

  const plan = tenant.subscriptionPlan || 'growth';

  const planDetails = {
    qari: {
      name: 'Independent Qari Plan',
      badge: '🌱 Independent Qari',
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      quota: '42 / 50 Active Students',
      features: ['1 Teacher Seat', 'Subdomain (*.hifz.app)', 'Standard GrapesJS Editor', 'Stripe Connect Payouts'],
    },
    growth: {
      name: 'Madrasah Growth Plan',
      badge: '⭐ Madrasah Growth',
      color: 'bg-amber-100 text-amber-900 border-amber-300',
      quota: '128 / 350 Active Students',
      features: ['10 Teacher Seats', 'Custom Domain Enabled', 'Template Bank (3 Layouts)', 'Audio Homework Recorder', 'Moyasar (Mada/Apple Pay)'],
    },
    enterprise: {
      name: 'Global Network Enterprise',
      badge: '👑 Global Enterprise',
      color: 'bg-purple-100 text-purple-900 border-purple-300',
      quota: 'Unlimited Students',
      features: ['Unlimited Teachers & Campuses', 'Multi-Branch Sub-Accounts', 'Custom Sanad Ijazah Builder', 'Dedicated SLA & VIP Support'],
    },
  };

  const currentPlan = planDetails[plan];

  const handleSelectPlan = (newPlan: 'qari' | 'growth' | 'enterprise') => {
    updateTenantConfig({
      subscriptionPlan: newPlan,
      studentCapacity: newPlan === 'qari' ? 50 : newPlan === 'growth' ? 350 : 99999,
    });
    setIsPlanModalOpen(false);
    onAddToast({
      type: 'success',
      title: 'Plan Tier Updated',
      message: `Account updated to ${planDetails[newPlan].name}.`,
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans text-slate-900" dir={direction}>
      {/* Sidebar with Mobile Drawer support */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onViewLiveSite={onViewLiveSite}
        isOpenOnMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
        {/* Clean Header */}
        <header className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Trigger */}
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
                {activeTab.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsOnboardingWizardOpen(true)}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Setup Wizard
            </button>

            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Settings
            </button>

            <button
              onClick={onViewLiveSite}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Site</span>
            </button>
          </div>
        </header>

        {/* Tab Content Container */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {isOnboardingWizardOpen ? (
            <OnboardingWizard
              onAddToast={onAddToast}
              onComplete={() => setIsOnboardingWizardOpen(false)}
            />
          ) : (
            <>
              {activeTab === 'overview' && (
                <div className="space-y-6 max-w-7xl mx-auto">
                  {/* Setup Banner */}
                  <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Academy Configuration</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Configure branding, curriculum tracks, payment providers, and live classroom settings.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsOnboardingWizardOpen(true)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Open Setup Wizard
                    </button>
                  </div>

                  {/* Clean KPI Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
                      <span className="text-xs font-medium text-slate-500">Inquiries</span>
                      <p className="text-2xl font-bold font-mono text-slate-900 mt-1">128</p>
                      <span className="text-[11px] text-emerald-600 font-medium mt-1 block">+14% this week</span>
                    </div>

                    <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
                      <span className="text-xs font-medium text-slate-500">Active Students</span>
                      <p className="text-2xl font-bold font-mono text-slate-900 mt-1">42</p>
                      <span className="text-[11px] text-slate-500 font-medium mt-1 block">Enrolled in courses</span>
                    </div>

                    <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
                      <span className="text-xs font-medium text-slate-500">Live Sessions</span>
                      <p className="text-2xl font-bold font-mono text-slate-900 mt-1">3 Active</p>
                      <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Real-time classroom</span>
                    </div>

                    <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
                      <span className="text-xs font-medium text-slate-500">Monthly Volume</span>
                      <p className="text-2xl font-bold font-mono text-slate-900 mt-1">$4,850.00</p>
                      <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Active tuition billing</span>
                    </div>
                  </div>

                  {/* Clean Navigation Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div
                      onClick={() => setActiveTab('classroom')}
                      className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer"
                    >
                      <h4 className="font-bold text-sm text-slate-900">Live Classroom & Whiteboard</h4>
                      <p className="text-xs text-slate-500 mt-1">Join active sessions, use interactive whiteboard tools, and share screens with students.</p>
                    </div>

                    <div
                      onClick={() => setActiveTab('page_builder')}
                      className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer"
                    >
                      <h4 className="font-bold text-sm text-slate-900">Visual Page Builder</h4>
                      <p className="text-xs text-slate-500 mt-1">Edit landing page content, choose layout templates, and customize form sections.</p>
                    </div>

                    <div
                      onClick={() => setActiveTab('settings')}
                      className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer"
                    >
                      <h4 className="font-bold text-sm text-slate-900">Settings & Security</h4>
                      <p className="text-xs text-slate-500 mt-1">Manage brand colors, company information, custom domain, and two-step verification.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'classroom' && (
                <div className="max-w-7xl mx-auto">
                  <VideoClassroomRoom
                    roomTitle="Instructor Live Masterclass & Whiteboard Room"
                    courseTitle="Live Teaching & Interactive Review"
                    userRole="teacher"
                    currentUserName="Ustadh Ahmad (Instructor)"
                    niche={tenant.niche || 'quran'}
                    onLeaveRoom={() => setActiveTab('overview')}
                  />
                </div>
              )}

              {activeTab === 'page_builder' && (
                <div className="bg-white rounded-md border border-slate-200 shadow-md overflow-hidden min-h-[700px]">
                  <RealGrapesBuilder onAddToast={onAddToast} />
                </div>
              )}

              {activeTab === 'form_builder' && <VisualFormBuilder onAddToast={onAddToast} />}
              {activeTab === 'curriculum' && <CourseBuilder onAddToast={onAddToast} />}
              {activeTab === 'pricing' && <TenantPricingEditor onAddToast={onAddToast} />}
              {activeTab === 'payment_gateways' && <PaymentGatewaySetup onAddToast={onAddToast} />}
              {activeTab === 'crm' && <LeadsCRM onAddToast={onAddToast} />}
              {activeTab === 'analytics' && <AnalyticsDashboard />}
              {activeTab === 'settings' && <ModernAcademySettings onAddToast={onAddToast} />}
            </>
          )}
        </main>
      </div>

      {/* Plan Subscription Tier Selection Modal */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-md p-6 sm:p-8 max-w-3xl w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <div>
                <h3 className="font-bold font-display text-lg text-slate-900">
                  Madrasah Platform Plan & Capacity
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select your subscription tier to unlock student seats and premium academy tools.
                </p>
              </div>
              <button
                onClick={() => setIsPlanModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {(['qari', 'growth', 'enterprise'] as const).map((tierKey) => {
                const tier = planDetails[tierKey];
                const isSelected = plan === tierKey;

                return (
                  <div
                    key={tierKey}
                    onClick={() => handleSelectPlan(tierKey)}
                    className={`p-5 rounded-md border text-start cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500 shadow-md'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${tier.color}`}>
                        {tier.badge}
                      </span>
                      <p className="text-sm font-bold text-slate-900 mt-3 font-display">{tier.name}</p>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">{tier.quota}</p>

                      <ul className="mt-4 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                        {tier.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      className={`mt-6 w-full py-2 rounded-md text-xs font-bold font-display transition-colors ${
                        isSelected
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected ? 'Active Tier' : 'Select Tier'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Profile & Settings Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onAddToast={onAddToast}
      />
    </div>
  );
};
