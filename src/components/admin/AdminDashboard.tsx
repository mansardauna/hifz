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
import { UserProfileModal } from '../profile/UserProfileModal';
import { VideoClassroomRoom } from '../../collaboration/VideoClassroomRoom';
import { useTenant } from '../../context/TenantContext';
import { ToastMessage } from '../ui/Toast';
import { ExternalLink, Sparkles, ShieldCheck, Layers, CheckCircle2, Menu, User, Settings } from 'lucide-react';

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
      <div className="flex-1 flex flex-col min-w-0 bg-slate-100">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 py-4 px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-3 text-sm">
            {/* Mobile Hamburger Trigger */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100 focus:outline-none cursor-pointer"
              aria-label="Open Sidebar Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <span className="text-slate-500 font-semibold hidden sm:inline">{tenant.name}</span>
            <span className="text-slate-300 hidden sm:inline">/</span>
            <span className="font-bold text-slate-900 capitalize font-display text-base sm:text-lg">
              {activeTab.replace('_', ' ')}
            </span>

            {/* Tenant Subscription Plan Tag */}
            <button
              onClick={() => setIsPlanModalOpen(true)}
              className={`px-3 py-1 rounded-md border text-xs font-bold font-display cursor-pointer hover:opacity-90 transition-opacity ${currentPlan.color}`}
              title="Click to manage account subscription tier"
            >
              {currentPlan.badge}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-block text-xs text-slate-500 font-medium">
              Capacity: <strong>{currentPlan.quota}</strong>
            </span>

            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold font-display rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Manage Profile & Settings"
            >
              <User className="w-4 h-4 text-emerald-700" />
              <span className="hidden sm:inline">Profile & Settings</span>
            </button>

            <button
              onClick={onViewLiveSite}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold font-display rounded-md shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">View Live Academy</span>
            </button>
          </div>
        </header>

        {/* Tab Content Container with Generous Spacing */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Clean Summary KPI Grid */}
              <AnalyticsDashboard />

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div
                  onClick={() => setActiveTab('page_builder')}
                  className="p-6 bg-white rounded-md border border-slate-200 shadow-md hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="p-3 bg-emerald-50 text-emerald-700 rounded-md group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Sparkles className="w-6 h-6" />
                    </span>
                    <span className="text-xs font-bold text-emerald-700">Open Builder →</span>
                  </div>
                  <h4 className="font-bold text-base text-slate-900 font-display">GrapesJS Landing Page Canvas</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">Customize hero calligraphy, course lists, and pricing blocks visually with live sync.</p>
                </div>

                <div
                  onClick={() => setActiveTab('form_builder')}
                  className="p-6 bg-white rounded-md border border-slate-200 shadow-md hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="p-3 bg-purple-50 text-purple-700 rounded-md group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <Layers className="w-6 h-6" />
                    </span>
                    <span className="text-xs font-bold text-purple-700">Manage Forms →</span>
                  </div>
                  <h4 className="font-bold text-base text-slate-900 font-display">Admissions & Questionnaires</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">Create multiple intake forms with drag-and-drop flex layouts and question banks.</p>
                </div>

                <div
                  onClick={() => setActiveTab('crm')}
                  className="p-6 bg-white rounded-md border border-slate-200 shadow-md hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="p-3 bg-amber-50 text-amber-700 rounded-md group-hover:bg-amber-600 group-hover:text-white transition-colors">
                      <ShieldCheck className="w-6 h-6" />
                    </span>
                    <span className="text-xs font-bold text-amber-700">Open CRM Pipeline →</span>
                  </div>
                  <h4 className="font-bold text-base text-slate-900 font-display">Student Admissions & Inquiries</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">Review incoming student inquiries, schedule evaluations, and manage tuition billing.</p>
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
          {activeTab === 'settings' && <SiteBuilder onAddToast={onAddToast} />}
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
