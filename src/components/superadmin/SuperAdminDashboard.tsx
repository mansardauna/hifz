import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import {
  PlatformSubscriptionPlan,
  PlatformTenantStats,
  PlatformSubscriber,
} from '../../types/superAdmin';
import {
  getStoredPlatformPlans,
  savePlatformPlans,
  MOCK_PLATFORM_TENANTS,
  MOCK_PLATFORM_SUBSCRIBERS,
} from '../../services/platformPlans';
import {
  ShieldCheck,
  Building2,
  Users,
  CreditCard,
  DollarSign,
  TrendingUp,
  Settings,
  Plus,
  Edit3,
  Trash2,
  Check,
  X,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Server,
  Activity,
  Layers,
  Sparkles,
  Zap,
  ArrowUpRight,
  RefreshCw,
  Eye,
  Sliders,
} from 'lucide-react';
import { Button, Input, Card, Badge, Modal } from '../ui';

export const SuperAdminDashboard: React.FC = () => {
  const { success, error, info, warning } = useToast();

  const [activeTab, setActiveTab] = useState<'plans' | 'academies' | 'subscribers' | 'system'>('plans');
  const [plans, setPlans] = useState<PlatformSubscriptionPlan[]>([]);
  const [tenants, setTenants] = useState<PlatformTenantStats[]>(MOCK_PLATFORM_TENANTS);
  const [subscribers, setSubscribers] = useState<PlatformSubscriber[]>(MOCK_PLATFORM_SUBSCRIBERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('all');

  // Plan Edit Modal State
  const [editingPlan, setEditingPlan] = useState<PlatformSubscriptionPlan | null>(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [newFeatureText, setNewFeatureText] = useState('');

  // System Settings State
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [globalAnnouncement, setGlobalAnnouncement] = useState('');
  const [isSavingAnnouncement, setIsSavingAnnouncement] = useState(false);

  useEffect(() => {
    const loadedPlans = getStoredPlatformPlans();
    setPlans(loadedPlans);
  }, []);

  // Calculate high-level financial & tenant statistics
  const totalAcademies = tenants.length;
  const activeSubsCount = subscribers.filter((s) => s.status === 'active').length;
  const totalStudents = tenants.reduce((acc, t) => acc + t.studentsCount, 0);
  const mrr = subscribers
    .filter((s) => s.status === 'active')
    .reduce((acc, s) => {
      const monthlyAmount = s.billingCycle === 'yearly' ? s.amount / 12 : s.amount;
      return acc + monthlyAmount;
    }, 0);
  const arr = mrr * 12;

  // Plan editing handlers
  const handleOpenEditPlan = (plan: PlatformSubscriptionPlan) => {
    setEditingPlan(JSON.parse(JSON.stringify(plan))); // Deep clone
    setIsPlanModalOpen(true);
  };

  const handleOpenNewPlan = () => {
    const newPlan: PlatformSubscriptionPlan = {
      id: `custom-plan-${Date.now()}`,
      name: 'New Custom Tier',
      slug: `tier-${Date.now()}`,
      priceMonthly: 49,
      priceYearly: 490,
      currency: 'USD',
      period: '/ month',
      description: 'Customized institutional tier tailored for specific academy requirements.',
      badge: 'Custom Tier',
      studentCapacity: 100,
      teacherSeats: 5,
      features: [
        'Up to 100 Active Students',
        '5 Teacher Seats',
        'Custom Domain Support',
        'Live WebRTC Classroom',
      ],
      featureFlags: {
        customDomain: true,
        liveWebRTC: true,
        whiteboard: true,
        aiPageBuilder: true,
        multiBranch: false,
        customIjazahCertificate: false,
        admissionsCRM: true,
        forumCommunity: true,
        formBuilderResponses: true,
        automationsWorkflows: true,
      },
    };
    setEditingPlan(newPlan);
    setIsPlanModalOpen(true);
  };

  const handleSavePlan = () => {
    if (!editingPlan) return;
    if (!editingPlan.name.trim()) {
      error('Validation Error', 'Plan name cannot be empty.');
      return;
    }

    let updatedList: PlatformSubscriptionPlan[];
    const exists = plans.some((p) => p.id === editingPlan.id);
    if (exists) {
      updatedList = plans.map((p) => (p.id === editingPlan.id ? editingPlan : p));
    } else {
      updatedList = [...plans, editingPlan];
    }

    setPlans(updatedList);
    savePlatformPlans(updatedList);
    setIsPlanModalOpen(false);
    success('Plan Updated Successfully', `${editingPlan.name} is now saved and broadcast to all tenant upgrade flows.`);
  };

  const handleDeletePlan = (planId: string) => {
    if (plans.length <= 1) {
      error('Cannot Delete', 'At least one active plan must remain on the platform.');
      return;
    }
    const updatedList = plans.filter((p) => p.id !== planId);
    setPlans(updatedList);
    savePlatformPlans(updatedList);
    success('Plan Deleted', 'The subscription plan has been removed.');
  };

  const handleAddFeatureToEditingPlan = () => {
    if (!editingPlan || !newFeatureText.trim()) return;
    setEditingPlan({
      ...editingPlan,
      features: [...editingPlan.features, newFeatureText.trim()],
    });
    setNewFeatureText('');
  };

  const handleRemoveFeatureFromEditingPlan = (index: number) => {
    if (!editingPlan) return;
    const updatedFeatures = editingPlan.features.filter((_, i) => i !== index);
    setEditingPlan({
      ...editingPlan,
      features: updatedFeatures,
    });
  };

  // Tenant management actions
  const handleToggleTenantStatus = (tenantId: string) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id === tenantId) {
          const nextStatus = t.status === 'active' ? 'suspended' : 'active';
          info('Academy Status Changed', `${t.name} is now ${nextStatus}.`);
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const handleChangeTenantPlan = (tenantId: string, newPlanId: string) => {
    const selectedPlan = plans.find((p) => p.id === newPlanId);
    if (!selectedPlan) return;

    setTenants((prev) =>
      prev.map((t) => {
        if (t.id === tenantId) {
          success('Subscription Tier Updated', `${t.name} has been upgraded to ${selectedPlan.name}.`);
          return { ...t, planId: newPlanId, planName: selectedPlan.name };
        }
        return t;
      })
    );
  };

  // Filtered tenants list
  const filteredTenants = tenants.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subdomain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = planFilter === 'all' || t.planId === planFilter;
    return matchesSearch && matchesPlan;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Super Admin Top Header */}
      <header className="bg-white border-b border-slate-200/90 px-4 sm:px-8 py-3.5 sticky top-0 z-30 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-700/20 text-white">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                Ankabit LMS <span className="text-emerald-700 font-extrabold text-xs uppercase tracking-widest ml-1">SuperAdmin</span>
              </h1>
              <Badge variant="success" className="bg-emerald-50 border-emerald-200 text-emerald-800 text-[10px]">
                Platform Control
              </Badge>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">Global Multi-Tenant LMS & Subscription Infrastructure</p>
          </div>
        </div>

        {/* Status Indicators & Navigation */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>PostgreSQL: <strong className="text-emerald-700">Connected</strong></span>
            <span className="text-slate-300">|</span>
            <span>LiveKit SFU: <strong className="text-emerald-700">Online</strong></span>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg transition-colors border border-slate-200 shadow-xs"
          >
            <span>Public Home</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>
      </header>

      {/* Hero Financial & Platform Metrics Bar */}
      <section className="bg-white border-b border-slate-200/90 px-4 sm:px-8 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 max-w-7xl mx-auto">
          {/* MRR */}
          <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Monthly MRR</span>
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              ${mrr.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>+24.5% MoM Growth</span>
            </div>
          </div>

          {/* ARR */}
          <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Projected ARR</span>
              <div className="p-2 rounded-lg bg-teal-100 text-teal-700">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              ${arr.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-medium">Annual Run Rate</div>
          </div>

          {/* Total Academies */}
          <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Academies</span>
              <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{totalAcademies}</div>
            <div className="text-[11px] text-emerald-700 font-medium mt-1">4 Active, 1 Trial</div>
          </div>

          {/* Paying Subscribers */}
          <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Subscribers</span>
              <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{activeSubsCount}</div>
            <div className="text-[11px] text-purple-700 font-medium mt-1">80% Paid Conversion</div>
          </div>

          {/* Total Students */}
          <div className="col-span-2 lg:col-span-1 bg-slate-50/80 border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Students</span>
              <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {totalStudents.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-medium">Enrolled Globally</div>
          </div>
        </div>
      </section>

      {/* Main Workspace Navigation */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 flex-1 flex flex-col">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-4 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('plans')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'plans'
                ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Subscription Plans & Features Studio</span>
            <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px] font-black">{plans.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('academies')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'academies'
                ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Academies & Tenants Directory</span>
            <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px] font-black">{tenants.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('subscribers')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'subscribers'
                ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Subscribers & Billing Ledger</span>
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'system'
                ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Platform Controls & Broadcast</span>
          </button>
        </div>

        {/* TAB 1: SUBSCRIPTION PLANS STUDIO */}
        {activeTab === 'plans' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span>Subscription Plans & Feature Gate Matrix</span>
                  <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                    Live Broadcast Active
                  </Badge>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Edit pricing, modify limits, toggle feature flags, or add/delete custom plan perks. Changes instantly update all checkout pages.
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={handleOpenNewPlan}
                leftIcon={<Plus className="w-4 h-4" />}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-xs"
              >
                Create New Plan
              </Button>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`rounded-2xl border p-6 flex flex-col justify-between transition-all duration-200 ${
                    plan.isPopular
                      ? 'bg-white border-emerald-500 shadow-md ring-1 ring-emerald-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div>
                    {/* Header with Badge & Edit */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {plan.badge || plan.name}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditPlan(plan)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                          title="Edit Plan"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {plan.id !== 'free' && (
                          <button
                            onClick={() => handleDeletePlan(plan.id)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Delete Plan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <h3 className="text-lg font-black text-slate-900">{plan.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 min-h-[32px] leading-relaxed">{plan.description}</p>

                    {/* Price display */}
                    <div className="my-4 py-3 px-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl sm:text-3xl font-black text-slate-900">${plan.priceMonthly}</span>
                        <span className="text-xs text-slate-500 font-semibold">{plan.period}</span>
                      </div>
                      <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                        ${plan.priceYearly}/yr when billed annually
                      </div>
                    </div>

                    {/* Quota Highlights */}
                    <div className="grid grid-cols-2 gap-2 mb-4 text-xs font-semibold">
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
                        <span className="block text-[10px] text-slate-400 uppercase">Max Students</span>
                        <span className="text-slate-900 font-bold">
                          {plan.studentCapacity >= 99999 ? 'Unlimited' : plan.studentCapacity}
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
                        <span className="block text-[10px] text-slate-400 uppercase">Teacher Seats</span>
                        <span className="text-slate-900 font-bold">{plan.teacherSeats}</span>
                      </div>
                    </div>

                    {/* Feature Bullets List */}
                    <div className="space-y-2 mt-3 pt-3 border-t border-slate-200">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                        Included Features ({plan.features.length})
                      </span>
                      {plan.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-snug">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Edit CTA button */}
                  <div className="mt-6 pt-4 border-t border-slate-200">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEditPlan(plan)}
                      className="w-full border-slate-300 hover:bg-slate-50 text-slate-700 font-bold"
                    >
                      Configure Plan & Features
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: ACADEMIES DIRECTORY */}
        {activeTab === 'academies' && (
          <div className="space-y-6">
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by academy name, subdomain, or director email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:border-emerald-600 cursor-pointer"
                >
                  <option value="all">All Plan Tiers</option>
                  <option value="free">Free Starter</option>
                  <option value="qari">Independent Qari</option>
                  <option value="growth">Madrasah Growth</option>
                  <option value="enterprise">Global Enterprise</option>
                </select>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setPlanFilter('all');
                  }}
                  leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                >
                  Reset
                </Button>
              </div>
            </div>

            {/* Academies Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">Academy & Subdomain</th>
                      <th className="py-3.5 px-4">Director / Email</th>
                      <th className="py-3.5 px-4">Students & Courses</th>
                      <th className="py-3.5 px-4">Subscription Tier</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    {filteredTenants.map((tenant) => (
                      <tr key={tenant.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Academy Name */}
                        <td className="py-4 px-4">
                          <div className="font-extrabold text-slate-900 text-sm">{tenant.name}</div>
                          <div className="flex items-center gap-2 mt-0.5 text-slate-500">
                            <span className="text-emerald-700 font-mono text-[11px] font-semibold">{tenant.subdomain}.ankabit.app</span>
                            {tenant.customDomain && (
                              <>
                                <span>•</span>
                                <span className="text-purple-700 text-[11px] font-semibold">{tenant.customDomain}</span>
                              </>
                            )}
                          </div>
                        </td>

                        {/* Director */}
                        <td className="py-4 px-4">
                          <div className="font-bold text-slate-900">{tenant.ownerName}</div>
                          <div className="text-slate-500 text-[11px]">{tenant.ownerEmail}</div>
                        </td>

                        {/* Students & Courses */}
                        <td className="py-4 px-4">
                          <div className="font-extrabold text-slate-900">{tenant.studentsCount} Students</div>
                          <div className="text-slate-500 text-[11px]">{tenant.coursesCount} Active Courses</div>
                        </td>

                        {/* Plan selector */}
                        <td className="py-4 px-4">
                          <select
                            value={tenant.planId}
                            onChange={(e) => handleChangeTenantPlan(tenant.id, e.target.value)}
                            className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-emerald-800 focus:outline-none focus:border-emerald-600 cursor-pointer"
                          >
                            {plans.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              tenant.status === 'active'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : tenant.status === 'trial'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-rose-50 text-rose-800 border border-rose-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                tenant.status === 'active'
                                  ? 'bg-emerald-500'
                                  : tenant.status === 'trial'
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                            />
                            <span className="capitalize">{tenant.status}</span>
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Live Site */}
                            <a
                              href={`/${tenant.subdomain}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                              title="View Academy Public Landing"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>

                            {/* Direct Admin Access */}
                            <a
                              href={`/${tenant.subdomain}/admin`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                              title="Impersonate & Open Admin Dashboard"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </a>

                            {/* Suspend / Activate Toggle */}
                            <button
                              onClick={() => handleToggleTenantStatus(tenant.id)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                                tenant.status === 'active'
                                  ? 'bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700'
                                  : 'bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700'
                              }`}
                            >
                              {tenant.status === 'active' ? 'Suspend' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SUBSCRIBERS & BILLING LEDGER */}
        {activeTab === 'subscribers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Platform Billing & Subscriber Ledger</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Track recurring subscription payments processed via Stripe and Moyasar.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => success('Exporting CSV', 'Subscriber transactions CSV generated and downloading.')}
                className="border-slate-300 text-slate-700 hover:bg-slate-50 font-bold"
              >
                Export CSV Report
              </Button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">Academy / Tenant</th>
                      <th className="py-3.5 px-4">Plan Tier</th>
                      <th className="py-3.5 px-4">Amount & Cycle</th>
                      <th className="py-3.5 px-4">Payment Gateway</th>
                      <th className="py-3.5 px-4">Next Renewal</th>
                      <th className="py-3.5 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    {subscribers.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-extrabold text-slate-900">{sub.academyName}</div>
                          <div className="text-slate-500 font-mono text-[11px]">{sub.subdomain}.ankabit.app</div>
                        </td>
                        <td className="py-4 px-4 font-bold text-slate-900">{sub.planName}</td>
                        <td className="py-4 px-4">
                          <div className="font-black text-emerald-700 text-sm">
                            ${sub.amount} <span className="text-xs text-slate-500 font-normal">/ {sub.billingCycle}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 font-mono text-[11px] uppercase font-bold text-slate-700">
                            {sub.paymentGateway}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-600">{sub.currentPeriodEnd}</td>
                        <td className="py-4 px-4">
                          <Badge variant="success" className="bg-emerald-50 text-emerald-800 border-emerald-200 font-bold">
                            {sub.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SYSTEM CONTROLS & BROADCAST */}
        {activeTab === 'system' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Global Broadcast Announcement */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-emerald-700">
                <Zap className="w-5 h-5" />
                <h3 className="text-base font-extrabold text-slate-900">Global Platform Announcement Banner</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Broadcast an urgent alert, planned maintenance notice, or feature release banner across all tenant admin dashboards.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Announcement Content</label>
                <textarea
                  rows={3}
                  value={globalAnnouncement}
                  onChange={(e) => setGlobalAnnouncement(e.target.value)}
                  placeholder="e.g. Scheduled database maintenance this Sunday at 02:00 AM UTC. Live classes will not be interrupted."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setGlobalAnnouncement('')}
                  className="border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Clear
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setIsSavingAnnouncement(true);
                    setTimeout(() => {
                      setIsSavingAnnouncement(false);
                      success('Broadcast Sent', 'Announcement published across all academy dashboards.');
                    }, 500);
                  }}
                  isLoading={isSavingAnnouncement}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                >
                  Publish Broadcast
                </Button>
              </div>
            </div>

            {/* Platform Health & Maintenance */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-sky-700">
                <Server className="w-5 h-5" />
                <h3 className="text-base font-extrabold text-slate-900">Infrastructure Status & Maintenance</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Live status monitors for the Supabase PostgreSQL connection pooler and LiveKit WebRTC video clusters.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    <span>PostgreSQL London Pooler (Port 6543)</span>
                  </div>
                  <Badge variant="success" className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px]">
                    24ms Latency
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <Zap className="w-4 h-4 text-emerald-600" />
                    <span>LiveKit Global SFU Video Node</span>
                  </div>
                  <Badge variant="success" className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px]">
                    99.99% Uptime
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <div className="text-xs font-bold text-slate-800">Maintenance Mode</div>
                    <div className="text-[11px] text-slate-500">Temporarily pause new academy registrations</div>
                  </div>
                  <button
                    onClick={() => {
                      const next = !maintenanceMode;
                      setMaintenanceMode(next);
                      if (next) warning('Maintenance Mode Active', 'Platform registration is now locked for maintenance.');
                      else success('Maintenance Mode Disabled', 'Platform registration is open.');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      maintenanceMode
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {maintenanceMode ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PLAN EDIT / CREATE MODAL */}
      {editingPlan && (
        <Modal
          isOpen={isPlanModalOpen}
          onClose={() => setIsPlanModalOpen(false)}
          title={`Configure Plan: ${editingPlan.name}`}
          size="lg"
        >
          <div className="space-y-5 text-slate-800 max-h-[75vh] overflow-y-auto pr-1">
            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Plan Name</label>
                <input
                  type="text"
                  value={editingPlan.name}
                  onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Badge / Highlight Tag</label>
                <input
                  type="text"
                  value={editingPlan.badge}
                  onChange={(e) => setEditingPlan({ ...editingPlan, badge: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Price ($ USD)</label>
                <input
                  type="number"
                  value={editingPlan.priceMonthly}
                  onChange={(e) => setEditingPlan({ ...editingPlan, priceMonthly: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Yearly Price ($ USD)</label>
                <input
                  type="number"
                  value={editingPlan.priceYearly}
                  onChange={(e) => setEditingPlan({ ...editingPlan, priceYearly: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Max Student Capacity</label>
                <input
                  type="number"
                  value={editingPlan.studentCapacity}
                  onChange={(e) => setEditingPlan({ ...editingPlan, studentCapacity: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Teacher Seats Limit</label>
                <input
                  type="number"
                  value={editingPlan.teacherSeats}
                  onChange={(e) => setEditingPlan({ ...editingPlan, teacherSeats: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Plan Description</label>
              <textarea
                rows={2}
                value={editingPlan.description}
                onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            {/* Feature Flags Switches */}
            <div className="pt-3 border-t border-slate-200">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-3">
                Feature Capability Toggles
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {Object.entries(editingPlan.featureFlags).map(([key, val]) => (
                  <label
                    key={key}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs"
                  >
                    <span className="font-semibold text-slate-800 capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <input
                      type="checkbox"
                      checked={val}
                      onChange={(e) =>
                        setEditingPlan({
                          ...editingPlan,
                          featureFlags: {
                            ...editingPlan.featureFlags,
                            [key]: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Custom Feature Bullets */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
                Display Feature Bullets ({editingPlan.features.length})
              </h4>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {editingPlan.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                    <span className="text-slate-800 font-medium">{feat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeatureFromEditingPlan(idx)}
                      className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                      title="Remove feature"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Feature Bullet */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="e.g. WhatsApp SMS Automation Alerts"
                  value={newFeatureText}
                  onChange={(e) => setNewFeatureText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddFeatureToEditingPlan()}
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-emerald-600"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleAddFeatureToEditingPlan}
                  className="font-bold text-xs"
                >
                  Add
                </Button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPlanModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSavePlan}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              >
                Save & Broadcast Plan
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
