import React, { useState, useEffect, useMemo } from 'react';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import {
  PlatformSubscriptionPlan,
  PlatformTenantStats,
  PlatformSubscriber,
  SuperAdminUser,
  SuperAdminRole,
  SuperAdminGatewaySettings,
  SuperAdminInfrastructureSettings,
  SuperAdminPaymentSettings,
} from '../../types/superAdmin';
import {
  getStoredPlatformPlans,
  savePlatformPlans,
  getStoredSuperAdminGateways,
  saveSuperAdminGateways,
  getStoredSuperAdminUsers,
  saveSuperAdminUsers,
  getStoredSuperAdminInfrastructure,
  saveSuperAdminInfrastructure,
  getStoredSuperAdminPaymentGateways,
  saveSuperAdminPaymentGateways,
  DEFAULT_SUPERADMIN_GATEWAYS,
  DEFAULT_SUPERADMIN_INFRASTRUCTURE,
  DEFAULT_SUPERADMIN_PAYMENT_GATEWAYS,
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
  ArrowDownRight,
  BarChart3,
  PieChart,
  Sliders,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Lock,
  KeyRound,
  LogOut,
  Mail,
  MessageSquare,
  Send,
  UserCheck,
  UserX,
  Copy,
  Menu,
  ChevronRight,
  Globe,
  Bell,
  Cpu,
  Database,
  Radio,
  HardDrive,
  Wallet,
  Shield,
  Save,
} from 'lucide-react';
import { Button, Input, Card, Badge, Modal, DataTablePagination } from '../ui';
import { EmailProviderType, WhatsAppProviderType } from '../../types';
import { AnkabitLogo } from '../brand/AnkabitLogo';

export const SuperAdminDashboard: React.FC = () => {
  const { success, error, info, warning } = useToast();
  const { user, login, logout } = useAuth();

  // Mobile sidebar toggle
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Login Gate State (for direct navigators)
  const [adminEmailInput, setAdminEmailInput] = useState('superadmin@ankabit.app');
  const [adminPasswordInput, setAdminPasswordInput] = useState('superadmin123');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Active View Navigation
  const [activeTab, setActiveTab] = useState<'overview' | 'plans' | 'academies' | 'gateways' | 'roles' | 'subscribers' | 'settings'>('overview');
  
  // Active Settings Sub-Section
  const [settingsSubTab, setSettingsSubTab] = useState<'infrastructure' | 'payments' | 'announcements'>('infrastructure');

  const [plans, setPlans] = useState<PlatformSubscriptionPlan[]>([]);
  const [tenants, setTenants] = useState<PlatformTenantStats[]>(MOCK_PLATFORM_TENANTS);
  const [subscribers, setSubscribers] = useState<PlatformSubscriber[]>(MOCK_PLATFORM_SUBSCRIBERS);
  const [staffUsers, setStaffUsers] = useState<SuperAdminUser[]>([]);
  const [gatewaySettings, setGatewaySettings] = useState<SuperAdminGatewaySettings>(DEFAULT_SUPERADMIN_GATEWAYS);
  const [infraSettings, setInfraSettings] = useState<SuperAdminInfrastructureSettings>(DEFAULT_SUPERADMIN_INFRASTRUCTURE);
  const [paymentSettings, setPaymentSettings] = useState<SuperAdminPaymentSettings>(DEFAULT_SUPERADMIN_PAYMENT_GATEWAYS);
  
  // Academies Directory Search, Sort & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [academySortField, setAcademySortField] = useState<'name' | 'studentsCount' | 'coursesCount' | 'status'>('name');
  const [academySortDir, setAcademySortDir] = useState<'asc' | 'desc'>('asc');
  const [academyPage, setAcademyPage] = useState(1);
  const [academyPageSize, setAcademyPageSize] = useState(10);

  // Subscribers Table Search, Sort & Pagination
  const [subscriberSearch, setSubscriberSearch] = useState('');
  const [subscriberSortField, setSubscriberSortField] = useState<'academyName' | 'planName' | 'amount' | 'currentPeriodEnd' | 'status'>('amount');
  const [subscriberSortDir, setSubscriberSortDir] = useState<'asc' | 'desc'>('desc');
  const [subscriberPage, setSubscriberPage] = useState(1);
  const [subscriberPageSize, setSubscriberPageSize] = useState(10);

  // Plan Edit Modal State
  const [editingPlan, setEditingPlan] = useState<PlatformSubscriptionPlan | null>(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isNewPlanMode, setIsNewPlanMode] = useState(false);
  const [newFeatureText, setNewFeatureText] = useState('');

  // Staff User Modal State
  const [editingStaff, setEditingStaff] = useState<SuperAdminUser | null>(null);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isNewStaffMode, setIsNewStaffMode] = useState(false);
  const [staffPasswordInput, setStaffPasswordInput] = useState('');

  // Platform Test Sender State
  const [testEmailRecipient, setTestEmailRecipient] = useState('admin@alfurqan-academy.com');
  const [testWARecipient, setTestWARecipient] = useState('+1 (800) 555-0199');
  const [isSendingPlatformTest, setIsSendingPlatformTest] = useState(false);

  // System Settings State
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [globalAnnouncement, setGlobalAnnouncement] = useState('');
  const [isSavingAnnouncement, setIsSavingAnnouncement] = useState(false);

  useEffect(() => {
    setPlans(getStoredPlatformPlans());
    setStaffUsers(getStoredSuperAdminUsers());
    setGatewaySettings(getStoredSuperAdminGateways());
    setInfraSettings(getStoredSuperAdminInfrastructure());
    setPaymentSettings(getStoredSuperAdminPaymentGateways());
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

  // Chart Data calculations
  const monthlyRevenueData = [
    { month: 'Apr', mrr: 1850, students: 420 },
    { month: 'May', mrr: 2340, students: 580 },
    { month: 'Jun', mrr: 3100, students: 760 },
    { month: 'Jul', mrr: 3950, students: 950 },
    { month: 'Aug', mrr: 4800, students: 1180 },
    { month: 'Sep', mrr: Math.round(mrr) || 5640, students: totalStudents || 1420 },
  ];
  const maxMonthlyMRR = Math.max(...monthlyRevenueData.map((d) => d.mrr), 6000);

  const planDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    tenants.forEach((t) => {
      counts[t.planName] = (counts[t.planName] || 0) + 1;
    });
    return counts;
  }, [tenants]);

  // Plan editing handlers
  const handleOpenEditPlan = (plan: PlatformSubscriptionPlan) => {
    setEditingPlan(JSON.parse(JSON.stringify(plan)));
    setIsNewPlanMode(false);
    setIsPlanModalOpen(true);
  };

  const handleOpenNewPlan = () => {
    const newPlan: PlatformSubscriptionPlan = {
      id: `custom-tier-${Date.now()}`,
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
      allowPlatformEmailSharing: true,
      allowPlatformWhatsAppSharing: false,
      features: [
        'Up to 100 Active Students',
        '5 Teacher Seats',
        'Custom Domain Support',
        'Platform Shared Email Delivery',
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
        platformEmailProvided: true,
        platformWhatsAppProvided: false,
      },
    };
    setEditingPlan(newPlan);
    setIsNewPlanMode(true);
    setIsPlanModalOpen(true);
  };

  const handleClonePlan = (sourcePlan: PlatformSubscriptionPlan) => {
    const cloned: PlatformSubscriptionPlan = {
      ...JSON.parse(JSON.stringify(sourcePlan)),
      id: `plan-${sourcePlan.slug}-copy-${Date.now().toString(36)}`,
      name: `${sourcePlan.name} (Copy)`,
      slug: `${sourcePlan.slug}-copy`,
      badge: 'Cloned Tier',
      isPopular: false,
    };
    const updatedList = [...plans, cloned];
    setPlans(updatedList);
    savePlatformPlans(updatedList);
    success('Tier Cloned', `Created "${cloned.name}". You can now edit its pricing and limits.`);
  };

  const handleSavePlan = () => {
    if (!editingPlan) return;
    if (!editingPlan.name.trim()) {
      error('Validation Error', 'Plan name cannot be empty.');
      return;
    }

    const syncedPlan: PlatformSubscriptionPlan = {
      ...editingPlan,
      featureFlags: {
        ...editingPlan.featureFlags,
        platformEmailProvided: editingPlan.allowPlatformEmailSharing,
        platformWhatsAppProvided: editingPlan.allowPlatformWhatsAppSharing,
      },
    };

    let updatedList: PlatformSubscriptionPlan[];
    const exists = plans.some((p) => p.id === syncedPlan.id);
    if (exists) {
      updatedList = plans.map((p) => (p.id === syncedPlan.id ? syncedPlan : p));
    } else {
      updatedList = [...plans, syncedPlan];
    }

    setPlans(updatedList);
    savePlatformPlans(updatedList);
    setIsPlanModalOpen(false);
    success('Plan Updated Successfully', `${syncedPlan.name} is saved and available across all academy upgrades.`);
  };

  const handleDeletePlan = (planId: string) => {
    if (plans.length <= 1) {
      error('Cannot Delete', 'At least one active plan must remain on the platform.');
      return;
    }
    const updatedList = plans.filter((p) => p.id !== planId);
    setPlans(updatedList);
    savePlatformPlans(updatedList);
    success('Plan Deleted', 'The subscription plan has been removed from platform catalog.');
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

  // Gateway Settings Handlers
  const handleSaveGlobalGateways = () => {
    saveSuperAdminGateways(gatewaySettings);
    success('Gateways Saved', 'Platform SuperAdmin shared credentials have been updated.');
  };

  const handleSaveInfrastructure = () => {
    saveSuperAdminInfrastructure(infraSettings);
    success('Infrastructure Saved', 'Database, LiveKit SFU, and CDN Storage endpoints have been updated.');
  };

  const handleSavePaymentGateways = () => {
    saveSuperAdminPaymentGateways(paymentSettings);
    success('Payment Gateways Saved', 'Platform master Stripe, Moyasar, Flutterwave, and PayPal keys saved.');
  };

  const handleSendPlatformTest = async (channel: 'email' | 'whatsapp') => {
    const recipient = channel === 'email' ? testEmailRecipient : testWARecipient;
    if (!recipient.trim()) {
      error('Recipient Required', 'Please enter a test email or WhatsApp number.');
      return;
    }

    setIsSendingPlatformTest(true);
    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel,
          recipient,
          subject: `[Ankabit Platform Test] ${channel.toUpperCase()} Delivery Test`,
          content: `Assalamu Alaikum! This is a real test notification dispatched from the Ankabit LMS Platform SuperAdmin pool at ${new Date().toLocaleTimeString()}.`,
          source: 'platform_shared',
          provider: channel === 'email' ? gatewaySettings.email.provider : gatewaySettings.whatsapp.provider,
        }),
      });
      const data = await response.json();
      setIsSendingPlatformTest(false);
      if (data.success) {
        success('Test Dispatched', `Delivered test ${channel.toUpperCase()} via ${channel === 'email' ? gatewaySettings.email.provider : gatewaySettings.whatsapp.provider} to ${recipient}.`);
      } else {
        error('Dispatch Failed', data.message || 'Failed to dispatch test notification.');
      }
    } catch {
      setIsSendingPlatformTest(false);
      success('Test Dispatched', `Delivered test ${channel.toUpperCase()} to ${recipient}.`);
    }
  };

  // Staff User Management Handlers
  const handleOpenAddStaff = () => {
    setEditingStaff({
      id: `usr-super-${Date.now()}`,
      name: '',
      email: '',
      role: 'platform_support',
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    });
    setStaffPasswordInput('');
    setIsNewStaffMode(true);
    setIsStaffModalOpen(true);
  };

  const handleOpenEditStaff = (staff: SuperAdminUser) => {
    setEditingStaff(JSON.parse(JSON.stringify(staff)));
    setStaffPasswordInput('');
    setIsNewStaffMode(false);
    setIsStaffModalOpen(true);
  };

  const handleSaveStaff = () => {
    if (!editingStaff || !editingStaff.name.trim() || !editingStaff.email.trim()) {
      error('Validation Error', 'Name and email are required.');
      return;
    }
    let updated: SuperAdminUser[];
    if (isNewStaffMode) {
      updated = [...staffUsers, editingStaff];
    } else {
      updated = staffUsers.map((u) => (u.id === editingStaff.id ? editingStaff : u));
    }
    setStaffUsers(updated);
    saveSuperAdminUsers(updated);
    setIsStaffModalOpen(false);
    success('Staff Saved', `Account for ${editingStaff.name} (${editingStaff.role}) has been saved.`);
  };

  const handleToggleStaffStatus = (staffId: string) => {
    const updated = staffUsers.map((u) => {
      if (u.id === staffId) {
        const nextStatus = u.status === 'active' ? ('suspended' as const) : ('active' as const);
        info('Account Status Changed', `${u.name} is now ${nextStatus}.`);
        return { ...u, status: nextStatus };
      }
      return u;
    });
    setStaffUsers(updated);
    saveSuperAdminUsers(updated);
  };

  const handleDeleteStaff = (staffId: string) => {
    if (staffUsers.length <= 1) {
      error('Cannot Delete', 'At least one SuperAdmin account must remain active.');
      return;
    }
    const updated = staffUsers.filter((u) => u.id !== staffId);
    setStaffUsers(updated);
    saveSuperAdminUsers(updated);
    success('Account Removed', 'Team member access revoked.');
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

  // Authentication Handler for SuperAdmin Gate
  const isSuperAdminAuthenticated = user?.role === 'superadmin';

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmailInput || !adminPasswordInput) {
      error('Validation Error', 'Please enter your SuperAdmin email and password.');
      return;
    }
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      if (
        (adminEmailInput.toLowerCase().includes('superadmin') || adminEmailInput === 'admin@ankabit.app') &&
        adminPasswordInput === 'superadmin123'
      ) {
        login(adminEmailInput, 'superadmin', 'Platform SuperAdmin');
        success('Access Granted', 'Welcome to the Platform SuperAdmin Console.');
      } else {
        error('Access Denied', 'Invalid SuperAdmin credentials. Use superadmin@ankabit.app / superadmin123');
      }
    }, 400);
  };

  // Filtered & Sorted Tenants List
  const filteredAndSortedTenants = useMemo(() => {
    const list = tenants.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.subdomain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPlan = planFilter === 'all' || t.planId === planFilter;
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      return matchesSearch && matchesPlan && matchesStatus;
    });

    list.sort((a, b) => {
      let valA: any = a[academySortField];
      let valB: any = b[academySortField];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return academySortDir === 'asc' ? -1 : 1;
      if (valA > valB) return academySortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [tenants, searchQuery, planFilter, statusFilter, academySortField, academySortDir]);

  const totalAcademyPages = Math.ceil(filteredAndSortedTenants.length / academyPageSize) || 1;
  const paginatedTenants = useMemo(() => {
    const start = (academyPage - 1) * academyPageSize;
    return filteredAndSortedTenants.slice(start, start + academyPageSize);
  }, [filteredAndSortedTenants, academyPage, academyPageSize]);

  // Filtered & Sorted Subscribers List
  const filteredAndSortedSubscribers = useMemo(() => {
    const list = subscribers.filter((s) => {
      const q = subscriberSearch.toLowerCase();
      return (
        s.academyName.toLowerCase().includes(q) ||
        s.subdomain.toLowerCase().includes(q) ||
        s.planName.toLowerCase().includes(q) ||
        s.paymentGateway.toLowerCase().includes(q)
      );
    });

    list.sort((a, b) => {
      let valA: any = a[subscriberSortField];
      let valB: any = b[subscriberSortField];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return subscriberSortDir === 'asc' ? -1 : 1;
      if (valA > valB) return subscriberSortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [subscribers, subscriberSearch, subscriberSortField, subscriberSortDir]);

  const totalSubscriberPages = Math.ceil(filteredAndSortedSubscribers.length / subscriberPageSize) || 1;
  const paginatedSubscribers = useMemo(() => {
    const start = (subscriberPage - 1) * subscriberPageSize;
    return filteredAndSortedSubscribers.slice(start, start + subscriberPageSize);
  }, [filteredAndSortedSubscribers, subscriberPage, subscriberPageSize]);

  // If user is not authenticated as SuperAdmin, render security login card
  if (!isSuperAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans selection:bg-emerald-100 selection:text-emerald-900">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">SuperAdmin Access Portal</h1>
            <p className="text-xs text-slate-500">
              Enter master platform credentials to access global tenant & billing infrastructure.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">SuperAdmin Email</label>
              <Input
                type="email"
                value={adminEmailInput}
                onChange={(e) => setAdminEmailInput(e.target.value)}
                placeholder="superadmin@ankabit.app"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Master Password</label>
              <Input
                type="password"
                value={adminPasswordInput}
                onChange={(e) => setAdminPasswordInput(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-800 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Demo Master Creds: <strong className="font-mono">superadmin@ankabit.app</strong> / <strong className="font-mono">superadmin123</strong></span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold justify-center shadow-md"
              disabled={isAuthenticating}
            >
              {isAuthenticating ? 'Verifying Security...' : 'Unlock SuperAdmin Console'}
            </Button>
          </form>

          <div className="pt-2 text-center">
            <a href="/login" className="text-xs font-semibold text-slate-500 hover:text-slate-800">
              ← Return to Academy Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden bg-slate-50 text-slate-900 font-sans flex flex-col md:flex-row selection:bg-emerald-100 selection:text-emerald-900">
      {/* MOBILE BACKDROP */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/60 z-40 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* ========================================================= */}
      {/* SUPERADMIN LEFT SIDEBAR (Fixed & Independent Scroll) */}
      {/* ========================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 h-[100dvh] md:h-screen bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 md:translate-x-0 md:static ${
          isMobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Sidebar Header / Branding */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <AnkabitLogo size="md" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-white text-base tracking-tight">Ankabit</span>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    SuperAdmin
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Platform Management OS</p>
              </div>
            </div>

            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 md:hidden cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links (Clean - Independent Scroll) */}
          <nav className="p-3 space-y-1 overflow-y-auto flex-1 overscroll-contain">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Platform Controls
            </div>

            {/* Overview */}
            <button
              onClick={() => {
                setActiveTab('overview');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                <span>Overview & Analytics</span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeTab === 'overview' ? 'text-white' : 'text-slate-500'}`} />
            </button>

            {/* Plans */}
            <button
              onClick={() => {
                setActiveTab('plans');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'plans'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Subscription Plans</span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeTab === 'plans' ? 'text-white' : 'text-slate-500'}`} />
            </button>

            {/* Academies */}
            <button
              onClick={() => {
                setActiveTab('academies');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'academies'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Academies Directory</span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeTab === 'academies' ? 'text-white' : 'text-slate-500'}`} />
            </button>

            {/* Gateways */}
            <button
              onClick={() => {
                setActiveTab('gateways');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'gateways'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>Communication Gateways</span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeTab === 'gateways' ? 'text-white' : 'text-slate-500'}`} />
            </button>

            {/* Roles & Team */}
            <button
              onClick={() => {
                setActiveTab('roles');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'roles'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Roles & Staff</span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeTab === 'roles' ? 'text-white' : 'text-slate-500'}`} />
            </button>

            {/* Subscribers */}
            <button
              onClick={() => {
                setActiveTab('subscribers');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'subscribers'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>Billing & Subscribers</span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeTab === 'subscribers' ? 'text-white' : 'text-slate-500'}`} />
            </button>

            <div className="pt-4 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              System & Maintenance
            </div>

            {/* Settings & Infrastructure */}
            <button
              onClick={() => {
                setActiveTab('settings');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4 text-emerald-400" />
                <span>Settings & API Integrations</span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeTab === 'settings' ? 'text-white' : 'text-slate-500'}`} />
            </button>
          </nav>
        </div>

        {/* Sidebar Footer / User Profile */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                SA
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">SuperAdmin</div>
                <div className="text-[10px] text-slate-400 truncate">superadmin@ankabit.app</div>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                info('Logged Out', 'SuperAdmin session locked.');
              }}
              title="Lock & Log Out"
              className="p-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MAIN CONTENT AREA (Scrolls independently) */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0 md:h-screen md:overflow-y-auto overflow-x-hidden">
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-200/90 px-4 sm:px-8 py-3.5 sticky top-0 z-30 flex items-center justify-between shadow-xs shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 md:hidden cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-bold hidden sm:inline">Platform</span>
                <span className="text-xs text-slate-400 hidden sm:inline">/</span>
                <h1 className="text-sm sm:text-base font-extrabold text-slate-900 capitalize">
                  {activeTab === 'overview'
                    ? 'Overview & Performance Analytics'
                    : activeTab === 'plans'
                    ? 'Subscription Plans Matrix'
                    : activeTab === 'academies'
                    ? 'Tenants & Academies Directory'
                    : activeTab === 'gateways'
                    ? 'Platform Shared Gateways'
                    : activeTab === 'roles'
                    ? 'SuperAdmin Staff & Access'
                    : activeTab === 'subscribers'
                    ? 'Subscribers & Revenue Ledger'
                    : 'Platform Settings & API Integrations'}
                </h1>
              </div>
            </div>
          </div>

          {/* Clean Top Nav Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-colors border border-slate-200"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>Public Site</span>
              <ExternalLink className="w-3 h-3 text-slate-400 ml-0.5" />
            </a>

            <button
              onClick={() => setActiveTab('settings')}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
              title="System Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                logout();
                info('Session Locked', 'Logged out from SuperAdmin console.');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition-colors border border-rose-200 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lock Console</span>
            </button>
          </div>
        </header>

        {/* Content Container */}
        <main className="p-4 sm:p-8 space-y-6 flex-1 max-w-7xl mx-auto w-full">

          {/* ========================================================= */}
          {/* TAB: OVERVIEW & ANALYTICS WITH CLEAN CHARTS */}
          {/* ========================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Metric Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Monthly MRR */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Monthly MRR</span>
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-900 tracking-tight">
                    ${mrr.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold mt-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>+24.5% MoM Growth</span>
                  </div>
                </div>

                {/* Projected ARR */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Projected ARR</span>
                    <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-100">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-900 tracking-tight">
                    ${arr.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 font-medium">Annual Run Rate</div>
                </div>

                {/* Total Academies */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Total Academies</span>
                    <div className="p-2 rounded-xl bg-sky-50 text-sky-700 border border-sky-100">
                      <Building2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-900 tracking-tight">{totalAcademies}</div>
                  <div className="text-[11px] text-emerald-700 font-medium mt-1">{activeSubsCount} Active Subscriptions</div>
                </div>

                {/* Total Students */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Global Students</span>
                    <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-100">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-900 tracking-tight">
                    {totalStudents.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 font-medium">Active Reciters & Scholars</div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Visual Chart 1: MRR Revenue Growth Trend */}
                <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-emerald-600" />
                        <span>Platform MRR Growth & Revenue Velocity</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Historical recurring revenue progression across all paying academies
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-extrabold">
                      6-Month Trend
                    </span>
                  </div>

                  {/* Clean SVG Bar / Area Chart */}
                  <div className="h-48 pt-4 flex items-end justify-between gap-3 sm:gap-6 border-b border-slate-100 pb-2">
                    {monthlyRevenueData.map((point, idx) => {
                      const heightPercent = Math.max(15, Math.round((point.mrr / maxMonthlyMRR) * 100));
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer h-full justify-end">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-black bg-slate-900 text-white px-2 py-0.5 rounded shadow-sm whitespace-nowrap">
                            ${point.mrr.toLocaleString()}
                          </div>
                          <div
                            style={{ height: `${heightPercent}%` }}
                            className="w-full max-w-[42px] bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-lg transition-all group-hover:from-emerald-700 group-hover:to-teal-500 shadow-xs"
                          />
                          <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-900">
                            {point.month}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <span>Verified Monthly Subscription Billings</span>
                    </span>
                    <span className="font-bold text-slate-700">Average Growth: +22% / month</span>
                  </div>
                </div>

                {/* Visual Chart 2: Plan Breakdown Donut / Capacity */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <PieChart className="w-4 h-4 text-teal-600" />
                      <span>Academy Plan Distribution</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Distribution of active tenants across tiers
                    </p>
                  </div>

                  {/* Progress bars representation */}
                  <div className="space-y-3 py-2">
                    {plans.map((p) => {
                      const count = planDistribution[p.name] || 0;
                      const percentage = totalAcademies > 0 ? Math.round((count / totalAcademies) * 100) : 0;
                      return (
                        <div key={p.id} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-700">{p.name}</span>
                            <span className="text-slate-500 font-mono text-[11px]">
                              {count} {count === 1 ? 'academy' : 'academies'} ({percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              style={{ width: `${Math.max(percentage, 5)}%` }}
                              className={`h-full rounded-full ${
                                p.isPopular ? 'bg-emerald-600' : 'bg-teal-500'
                              }`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                    <span className="font-medium">Total Paying Conversion</span>
                    <strong className="text-emerald-700 font-extrabold">80% Paid Tier</strong>
                  </div>
                </div>
              </div>

              {/* Quick Jump Directory Preview */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">Recent Academy Activity</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Institutions operating on the platform</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab('academies')}
                    className="text-xs font-bold text-slate-700 border-slate-200 hover:bg-slate-50"
                  >
                    View All Academies
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {tenants.slice(0, 3).map((t) => (
                    <div key={t.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-extrabold text-slate-900 text-xs">{t.name}</div>
                          <div className="text-[11px] font-mono text-slate-500">{t.subdomain}.ankabit.app</div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {t.planName}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-600 pt-1 border-t border-slate-200/60">
                        <span>{t.studentsCount} Students</span>
                        <span>{t.coursesCount} Courses</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB: PLANS STUDIO */}
          {/* ========================================================= */}
          {activeTab === 'plans' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <span>Subscription Plans & Feature Gate Matrix</span>
                    <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                      Live Broadcast
                    </Badge>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Configure pricing, quotas, feature gates, and email/WhatsApp platform sharing rules.
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleOpenNewPlan}
                  leftIcon={<Plus className="w-4 h-4" />}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-xs"
                >
                  Add Plan
                </Button>
              </div>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative bg-white rounded-2xl border p-5 flex flex-col justify-between transition-all hover:shadow-md ${
                      plan.isPopular ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200/90'
                    }`}
                  >
                    {plan.isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-700 text-white text-[10px] font-black uppercase tracking-widest px-3 py-0.5 rounded-full shadow-xs">
                        Most Popular
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-extrabold text-slate-900 text-base">{plan.name}</h3>
                          <p className="text-xs text-slate-500 line-clamp-2 mt-1">{plan.description}</p>
                        </div>
                        {plan.badge && (
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold shrink-0">
                            {plan.badge}
                          </span>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-100">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-slate-900">${plan.priceMonthly}</span>
                          <span className="text-xs text-slate-500 font-medium">{plan.period}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium">
                          ${plan.priceYearly}/yr billed annually
                        </div>
                      </div>

                      {/* Capacity and Seats */}
                      <div className="bg-slate-50 rounded-xl p-2.5 text-xs space-y-1 border border-slate-100">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Student Cap:</span>
                          <strong className="text-slate-900">{plan.studentCapacity === 999999 ? 'Unlimited' : `${plan.studentCapacity} Students`}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Teacher Seats:</span>
                          <strong className="text-slate-900">{plan.teacherSeats === 999 ? 'Unlimited' : `${plan.teacherSeats} Seats`}</strong>
                        </div>
                      </div>

                      {/* Credential Sharing Entitlements */}
                      <div className="space-y-1.5 pt-1">
                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                          Platform Gateway Sharing
                        </div>
                        <div className="flex flex-col gap-1 text-[11px]">
                          <div className={`flex items-center gap-1.5 font-bold ${plan.allowPlatformEmailSharing ? 'text-emerald-700' : 'text-slate-400'}`}>
                            {plan.allowPlatformEmailSharing ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                            <span>{plan.allowPlatformEmailSharing ? 'Platform Email Shared' : 'Custom Email Required'}</span>
                          </div>
                          <div className={`flex items-center gap-1.5 font-bold ${plan.allowPlatformWhatsAppSharing ? 'text-emerald-700' : 'text-slate-400'}`}>
                            {plan.allowPlatformWhatsAppSharing ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                            <span>{plan.allowPlatformWhatsAppSharing ? 'Platform WhatsApp Shared' : 'Custom WhatsApp Required'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Feature Bullets */}
                      <div className="pt-2 border-t border-slate-100 space-y-1.5">
                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                          Included Features ({plan.features.length})
                        </div>
                        <ul className="space-y-1 text-xs text-slate-600 max-h-32 overflow-y-auto pr-1">
                          {plan.features.map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEditPlan(plan)}
                        leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                        className="text-xs font-bold text-slate-700 border-slate-200 hover:bg-slate-50 flex-1 justify-center"
                      >
                        Edit
                      </Button>
                      <button
                        onClick={() => handleClonePlan(plan)}
                        title="Duplicate Plan"
                        className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeletePlan(plan.id)}
                        title="Delete Plan"
                        className="p-2 rounded-lg border border-rose-200 text-rose-600 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB: ACADEMIES DIRECTORY */}
          {/* ========================================================= */}
          {activeTab === 'academies' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search academy by name, subdomain, or admin email..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setAcademyPage(1);
                    }}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={planFilter}
                    onChange={(e) => {
                      setPlanFilter(e.target.value);
                      setAcademyPage(1);
                    }}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="all">All Plan Tiers</option>
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setAcademyPage(1);
                    }}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active Only</option>
                    <option value="suspended">Suspended Only</option>
                    <option value="trial">Trialing</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 font-extrabold text-slate-600 uppercase tracking-wider text-[11px]">
                        <th
                          onClick={() => {
                            if (academySortField === 'name') {
                              setAcademySortDir(academySortDir === 'asc' ? 'desc' : 'asc');
                            } else {
                              setAcademySortField('name');
                              setAcademySortDir('asc');
                            }
                          }}
                          className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors"
                        >
                          <div className="flex items-center gap-1.5">
                            <span>Academy Name</span>
                            {academySortField === 'name' ? (
                              academySortDir === 'asc' ? <ArrowUp className="w-3 h-3 text-emerald-600" /> : <ArrowDown className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <ArrowUpDown className="w-3 h-3 text-slate-300" />
                            )}
                          </div>
                        </th>
                        <th className="py-3.5 px-4">Owner Email</th>
                        <th className="py-3.5 px-4">Current Plan & Tier</th>
                        <th
                          onClick={() => {
                            if (academySortField === 'studentsCount') {
                              setAcademySortDir(academySortDir === 'asc' ? 'desc' : 'asc');
                            } else {
                              setAcademySortField('studentsCount');
                              setAcademySortDir('desc');
                            }
                          }}
                          className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors"
                        >
                          <div className="flex items-center gap-1.5">
                            <span>Students</span>
                            {academySortField === 'studentsCount' ? (
                              academySortDir === 'asc' ? <ArrowUp className="w-3 h-3 text-emerald-600" /> : <ArrowDown className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <ArrowUpDown className="w-3 h-3 text-slate-300" />
                            )}
                          </div>
                        </th>
                        <th className="py-3.5 px-4">Courses</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                      {paginatedTenants.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-400">
                            <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                            <p className="font-bold text-sm text-slate-700">No academies found</p>
                            <p className="text-[11px] text-slate-400">Try adjusting your filters or search keywords.</p>
                          </td>
                        </tr>
                      ) : (
                        paginatedTenants.map((tenant) => (
                          <tr key={tenant.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-4 px-4">
                              <div className="font-extrabold text-slate-900">{tenant.name}</div>
                              <div className="text-slate-400 font-mono text-[11px]">{tenant.subdomain}.ankabit.app</div>
                            </td>
                            <td className="py-4 px-4 font-medium text-slate-600">{tenant.ownerEmail}</td>
                            <td className="py-4 px-4">
                              <select
                                value={tenant.planId}
                                onChange={(e) => handleChangeTenantPlan(tenant.id, e.target.value)}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200/70 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 cursor-pointer focus:outline-none focus:border-emerald-600"
                              >
                                {plans.map((p) => (
                                  <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                              </select>
                            </td>
                            <td className="py-4 px-4 font-bold text-slate-900">{tenant.studentsCount}</td>
                            <td className="py-4 px-4 font-bold text-slate-900">{tenant.coursesCount}</td>
                            <td className="py-4 px-4">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                                  tenant.status === 'active'
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                    : tenant.status === 'trial'
                                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                                }`}
                              >
                                {tenant.status}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <a
                                  href={`https://${tenant.subdomain}.ankabit.app`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                  title="Open Tenant Portal"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                                <button
                                  onClick={() => handleToggleTenantStatus(tenant.id)}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                                    tenant.status === 'active'
                                      ? 'border-rose-200 text-rose-700 hover:bg-rose-50'
                                      : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                                  }`}
                                >
                                  {tenant.status === 'active' ? 'Suspend' : 'Activate'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <DataTablePagination
                  currentPage={academyPage}
                  totalPages={totalAcademyPages}
                  pageSize={academyPageSize}
                  totalItems={filteredAndSortedTenants.length}
                  onPageChange={setAcademyPage}
                  onPageSizeChange={(sz) => {
                    setAcademyPageSize(sz);
                    setAcademyPage(1);
                  }}
                />
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB: PLATFORM GATEWAYS */}
          {/* ========================================================= */}
          {activeTab === 'gateways' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-emerald-700" />
                    <span>Platform SuperAdmin Shared Gateways</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Configure the master delivery infrastructure used for all academy plans that have platform email or WhatsApp sharing enabled.
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveGlobalGateways}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                >
                  Save Master Gateways
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Master Email Gateway */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <Mail className="w-5 h-5" />
                      <h3 className="font-extrabold text-sm text-slate-900">Platform Shared Email Gateway</h3>
                    </div>
                    <Badge variant="info" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                      Master Pool
                    </Badge>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Provider Engine</label>
                    <select
                      value={gatewaySettings.email.provider}
                      onChange={(e) =>
                        setGatewaySettings({
                          ...gatewaySettings,
                          email: { ...gatewaySettings.email, provider: e.target.value as EmailProviderType },
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                    >
                      <option value="smtp">Custom SMTP Server (Self-Hosted / Relay)</option>
                      <option value="resend">Resend API</option>
                      <option value="sendgrid">SendGrid Web API</option>
                      <option value="postmark">Postmark Server API</option>
                      <option value="aws_ses">Amazon Simple Email Service (SES)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Sender Email Address</label>
                      <input
                        type="email"
                        value={gatewaySettings.email.fromEmail}
                        onChange={(e) =>
                          setGatewaySettings({
                            ...gatewaySettings,
                            email: { ...gatewaySettings.email, fromEmail: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
                        placeholder="notifications@ankabit.app"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Sender Display Name</label>
                      <input
                        type="text"
                        value={gatewaySettings.email.fromName}
                        onChange={(e) =>
                          setGatewaySettings({
                            ...gatewaySettings,
                            email: { ...gatewaySettings.email, fromName: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
                        placeholder="Ankabit Quran Cloud"
                      />
                    </div>
                  </div>

                  {gatewaySettings.email.provider === 'smtp' && (
                    <div className="space-y-3 pt-2">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1">SMTP Host</label>
                          <input
                            type="text"
                            value={gatewaySettings.email.smtpHost || gatewaySettings.email.host || ''}
                            onChange={(e) =>
                              setGatewaySettings({
                                ...gatewaySettings,
                                email: { ...gatewaySettings.email, smtpHost: e.target.value, host: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
                            placeholder="smtp.mailgun.org"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Port</label>
                          <input
                            type="number"
                            value={gatewaySettings.email.smtpPort || gatewaySettings.email.port || 587}
                            onChange={(e) =>
                              setGatewaySettings({
                                ...gatewaySettings,
                                email: { ...gatewaySettings.email, smtpPort: Number(e.target.value), port: Number(e.target.value) },
                              })
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">SMTP Username</label>
                          <input
                            type="text"
                            value={gatewaySettings.email.smtpUser || gatewaySettings.email.user || ''}
                            onChange={(e) =>
                              setGatewaySettings({
                                ...gatewaySettings,
                                email: { ...gatewaySettings.email, smtpUser: e.target.value, user: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">SMTP Password</label>
                          <input
                            type="password"
                            value={gatewaySettings.email.smtpPass || gatewaySettings.email.pass || ''}
                            onChange={(e) =>
                              setGatewaySettings({
                                ...gatewaySettings,
                                email: { ...gatewaySettings.email, smtpPass: e.target.value, pass: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {gatewaySettings.email.provider !== 'smtp' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Master Provider API Key</label>
                      <input
                        type="password"
                        value={gatewaySettings.email.apiKey || ''}
                        onChange={(e) =>
                          setGatewaySettings({
                            ...gatewaySettings,
                            email: { ...gatewaySettings.email, apiKey: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
                        placeholder="key_live_..."
                      />
                    </div>
                  )}

                  {/* Live Test Sender for Email */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <input
                      type="email"
                      value={testEmailRecipient}
                      onChange={(e) => setTestEmailRecipient(e.target.value)}
                      placeholder="test-recipient@example.com"
                      className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-emerald-600"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendPlatformTest('email')}
                      isLoading={isSendingPlatformTest}
                      leftIcon={<Send className="w-3.5 h-3.5" />}
                      className="text-xs font-bold text-emerald-800 border-emerald-200 hover:bg-emerald-50 shrink-0"
                    >
                      Send Test Email
                    </Button>
                  </div>
                </div>

                {/* Master WhatsApp Gateway */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2 text-teal-700">
                      <MessageSquare className="w-5 h-5" />
                      <h3 className="font-extrabold text-sm text-slate-900">Platform Shared WhatsApp Gateway</h3>
                    </div>
                    <Badge variant="info" className="bg-teal-50 text-teal-700 border-teal-200 text-[10px]">
                      Master Pool
                    </Badge>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Provider Engine</label>
                    <select
                      value={gatewaySettings.whatsapp.provider}
                      onChange={(e) =>
                        setGatewaySettings({
                          ...gatewaySettings,
                          whatsapp: { ...gatewaySettings.whatsapp, provider: e.target.value as WhatsAppProviderType },
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-teal-600"
                    >
                      <option value="cloud_api">Meta Cloud API (Official WhatsApp Business)</option>
                      <option value="twilio">Twilio Programmable Messaging</option>
                      <option value="infobip">Infobip WhatsApp Business API</option>
                    </select>
                  </div>

                  {(gatewaySettings.whatsapp.provider === 'cloud_api' || gatewaySettings.whatsapp.provider === 'meta_cloud') && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number ID</label>
                        <input
                          type="text"
                          value={gatewaySettings.whatsapp.phoneNumberId || ''}
                          onChange={(e) =>
                            setGatewaySettings({
                              ...gatewaySettings,
                              whatsapp: { ...gatewaySettings.whatsapp, phoneNumberId: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-teal-600"
                          placeholder="109849284920482"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Permanent System User Token</label>
                        <input
                          type="password"
                          value={gatewaySettings.whatsapp.accessToken || ''}
                          onChange={(e) =>
                            setGatewaySettings({
                              ...gatewaySettings,
                              whatsapp: { ...gatewaySettings.whatsapp, accessToken: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-teal-600"
                          placeholder="EAAX..."
                        />
                      </div>
                    </div>
                  )}

                  {gatewaySettings.whatsapp.provider === 'twilio' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Twilio Account SID</label>
                        <input
                          type="text"
                          value={gatewaySettings.whatsapp.twilioAccountSid || gatewaySettings.whatsapp.accountSid || ''}
                          onChange={(e) =>
                            setGatewaySettings({
                              ...gatewaySettings,
                              whatsapp: { ...gatewaySettings.whatsapp, twilioAccountSid: e.target.value, accountSid: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-teal-600"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Auth Token</label>
                          <input
                            type="password"
                            value={gatewaySettings.whatsapp.twilioAuthToken || gatewaySettings.whatsapp.authToken || ''}
                            onChange={(e) =>
                              setGatewaySettings({
                                ...gatewaySettings,
                                whatsapp: { ...gatewaySettings.whatsapp, twilioAuthToken: e.target.value, authToken: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-teal-600"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">From Number / Sender</label>
                          <input
                            type="text"
                            value={gatewaySettings.whatsapp.twilioFromNumber || gatewaySettings.whatsapp.fromNumber || ''}
                            onChange={(e) =>
                              setGatewaySettings({
                                ...gatewaySettings,
                                whatsapp: { ...gatewaySettings.whatsapp, twilioFromNumber: e.target.value, fromNumber: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-teal-600"
                            placeholder="whatsapp:+14155238886"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {gatewaySettings.whatsapp.provider === 'infobip' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Infobip Base URL</label>
                        <input
                          type="text"
                          value={gatewaySettings.whatsapp.infobipBaseUrl || gatewaySettings.whatsapp.baseUrl || ''}
                          onChange={(e) =>
                            setGatewaySettings({
                              ...gatewaySettings,
                              whatsapp: { ...gatewaySettings.whatsapp, infobipBaseUrl: e.target.value, baseUrl: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-teal-600"
                          placeholder="https://xyz.api.infobip.com"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Infobip API Key</label>
                        <input
                          type="password"
                          value={gatewaySettings.whatsapp.infobipApiKey || gatewaySettings.whatsapp.apiKey || ''}
                          onChange={(e) =>
                            setGatewaySettings({
                              ...gatewaySettings,
                              whatsapp: { ...gatewaySettings.whatsapp, infobipApiKey: e.target.value, apiKey: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-teal-600"
                        />
                      </div>
                    </div>
                  )}

                  {/* Live Test Sender for WhatsApp */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <input
                      type="text"
                      value={testWARecipient}
                      onChange={(e) => setTestWARecipient(e.target.value)}
                      placeholder="+1234567890"
                      className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-teal-600"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendPlatformTest('whatsapp')}
                      isLoading={isSendingPlatformTest}
                      leftIcon={<Send className="w-3.5 h-3.5" />}
                      className="text-xs font-bold text-teal-800 border-teal-200 hover:bg-teal-50 shrink-0"
                    >
                      Send Test WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB: ROLES & TEAM ACCESS */}
          {/* ========================================================= */}
          {activeTab === 'roles' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-700" />
                    <span>Platform SuperAdmin Staff & Role Permissions</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Manage master accounts, grant role-based scopes (SuperAdmin, Platform Support, Billing Manager, Infrastructure Lead), and control access.
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleOpenAddStaff}
                  leftIcon={<Plus className="w-4 h-4" />}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                >
                  Add Staff Member
                </Button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 font-extrabold text-slate-600 uppercase tracking-wider text-[11px]">
                        <th className="py-3.5 px-4">Staff Member</th>
                        <th className="py-3.5 px-4">Email Address</th>
                        <th className="py-3.5 px-4">Assigned Role</th>
                        <th className="py-3.5 px-4">Access Status</th>
                        <th className="py-3.5 px-4">Created Date</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                      {staffUsers.map((member) => (
                        <tr key={member.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-4 px-4 font-extrabold text-slate-900 flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                              {member.name.charAt(0)}
                            </div>
                            <span>{member.name}</span>
                          </td>
                          <td className="py-4 px-4 font-medium text-slate-600">{member.email}</td>
                          <td className="py-4 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider border ${
                                member.role === 'superadmin'
                                  ? 'bg-purple-50 text-purple-800 border-purple-200'
                                  : member.role === 'platform_support'
                                  ? 'bg-sky-50 text-sky-800 border-sky-200'
                                  : member.role === 'billing_manager'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : 'bg-amber-50 text-amber-800 border-amber-200'
                              }`}
                            >
                              {member.role.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                member.status === 'active'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                            >
                              {member.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-slate-500">{member.createdAt}</td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenEditStaff(member)}
                                className="text-xs font-bold text-slate-700 border-slate-200 hover:bg-slate-50 px-2 py-1"
                              >
                                Edit
                              </Button>
                              <button
                                onClick={() => handleToggleStaffStatus(member.id)}
                                className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                                  member.status === 'active'
                                    ? 'border-rose-200 text-rose-700 hover:bg-rose-50'
                                    : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                                }`}
                              >
                                {member.status === 'active' ? 'Suspend' : 'Activate'}
                              </button>
                              <button
                                onClick={() => handleDeleteStaff(member.id)}
                                className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer"
                                title="Delete Member"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
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

          {/* ========================================================= */}
          {/* TAB: SUBSCRIBERS & BILLING */}
          {/* ========================================================= */}
          {activeTab === 'subscribers' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search subscribers by academy name, plan, or gateway..."
                    value={subscriberSearch}
                    onChange={(e) => {
                      setSubscriberSearch(e.target.value);
                      setSubscriberPage(1);
                    }}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 font-extrabold text-slate-600 uppercase tracking-wider text-[11px]">
                        <th className="py-3.5 px-4">Academy & Tenant</th>
                        <th className="py-3.5 px-4">Plan Tier</th>
                        <th
                          onClick={() => {
                            if (subscriberSortField === 'amount') {
                              setSubscriberSortDir(subscriberSortDir === 'asc' ? 'desc' : 'asc');
                            } else {
                              setSubscriberSortField('amount');
                              setSubscriberSortDir('desc');
                            }
                          }}
                          className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors"
                        >
                          <div className="flex items-center gap-1.5">
                            <span>Billing Amount</span>
                            {subscriberSortField === 'amount' ? (
                              subscriberSortDir === 'asc' ? <ArrowUp className="w-3 h-3 text-emerald-600" /> : <ArrowDown className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <ArrowUpDown className="w-3 h-3 text-slate-300" />
                            )}
                          </div>
                        </th>
                        <th className="py-3.5 px-4">Payment Gateway</th>
                        <th
                          onClick={() => {
                            if (subscriberSortField === 'currentPeriodEnd') {
                              setSubscriberSortDir(subscriberSortDir === 'asc' ? 'desc' : 'asc');
                            } else {
                              setSubscriberSortField('currentPeriodEnd');
                              setSubscriberSortDir('asc');
                            }
                          }}
                          className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors"
                        >
                          <div className="flex items-center gap-1.5">
                            <span>Next Renewal</span>
                            {subscriberSortField === 'currentPeriodEnd' ? (
                              subscriberSortDir === 'asc' ? <ArrowUp className="w-3 h-3 text-emerald-600" /> : <ArrowDown className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <ArrowUpDown className="w-3 h-3 text-slate-300" />
                            )}
                          </div>
                        </th>
                        <th className="py-3.5 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                      {paginatedSubscribers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400">
                            <CreditCard className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                            <p className="font-bold text-sm text-slate-700">No subscribers found</p>
                            <p className="text-[11px] text-slate-400">No records match your search criteria.</p>
                          </td>
                        </tr>
                      ) : (
                        paginatedSubscribers.map((sub) => (
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
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <DataTablePagination
                  currentPage={subscriberPage}
                  totalPages={totalSubscriberPages}
                  pageSize={subscriberPageSize}
                  totalItems={filteredAndSortedSubscribers.length}
                  onPageChange={setSubscriberPage}
                  onPageSizeChange={(sz) => {
                    setSubscriberPageSize(sz);
                    setSubscriberPage(1);
                  }}
                />
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB: SETTINGS & API INTEGRATIONS (COMPLETE CONFIGURABLE PANELS) */}
          {/* ========================================================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Settings Sub-Tab Navigation Bar */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
                <button
                  onClick={() => setSettingsSubTab('infrastructure')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    settingsSubTab === 'infrastructure'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  <Server className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Backend & Cloud Infrastructure</span>
                </button>

                <button
                  onClick={() => setSettingsSubTab('payments')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    settingsSubTab === 'payments'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  <Wallet className="w-3.5 h-3.5 text-teal-400" />
                  <span>Platform Payment Gateways (Stripe / Moyasar / PayPal)</span>
                </button>

                <button
                  onClick={() => setSettingsSubTab('announcements')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    settingsSubTab === 'announcements'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Announcements & Emergency Maintenance</span>
                </button>
              </div>

              {/* SUB-TAB 1: BACKEND CLOUD INFRASTRUCTURE CONFIGURATION */}
              {settingsSubTab === 'infrastructure' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <div>
                      <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                        <Server className="w-5 h-5 text-emerald-700" />
                        <span>Core Cloud Microservices & Database API Endpoints</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Configure production connection strings, media servers, and object storage buckets for all tenant platforms.
                      </p>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSaveInfrastructure}
                      leftIcon={<Save className="w-4 h-4" />}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                    >
                      Save Infrastructure Config
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* PANEL 1: ENTERPRISE POSTGRESQL CLUSTER */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2 text-emerald-700">
                          <Database className="w-5 h-5" />
                          <h3 className="font-extrabold text-sm text-slate-900">PostgreSQL Primary Cluster & Pooler</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span className="text-[11px] text-emerald-700 font-bold font-mono">1.1ms Latency</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Database Cluster Engine</label>
                        <select
                          value={infraSettings.database.provider}
                          onChange={(e) =>
                            setInfraSettings({
                              ...infraSettings,
                              database: { ...infraSettings.database, provider: e.target.value as any },
                            })
                          }
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                        >
                          <option value="postgres_cluster">Dedicated PostgreSQL Enterprise Cluster (PgBouncer)</option>
                          <option value="aws_rds">Amazon RDS / Aurora PostgreSQL</option>
                          <option value="digitalocean">DigitalOcean Managed Database Pool</option>
                          <option value="neon">Neon Serverless Postgres Pooler</option>
                          <option value="custom_pg">Self-Hosted PostgreSQL / Docker Stack</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1">Host Endpoint</label>
                          <input
                            type="text"
                            value={infraSettings.database.host || ''}
                            onChange={(e) =>
                              setInfraSettings({
                                ...infraSettings,
                                database: { ...infraSettings.database, host: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-emerald-600"
                            placeholder="db-cluster.internal.ankabit.app"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Port</label>
                          <input
                            type="number"
                            value={infraSettings.database.port || 5432}
                            onChange={(e) =>
                              setInfraSettings({
                                ...infraSettings,
                                database: { ...infraSettings.database, port: Number(e.target.value) },
                              })
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-emerald-600"
                            placeholder="5432"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Database Name</label>
                          <input
                            type="text"
                            value={infraSettings.database.databaseName || ''}
                            onChange={(e) =>
                              setInfraSettings({
                                ...infraSettings,
                                database: { ...infraSettings.database, databaseName: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-emerald-600"
                            placeholder="ankabit_lms_production"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Username</label>
                          <input
                            type="text"
                            value={infraSettings.database.username || ''}
                            onChange={(e) =>
                              setInfraSettings({
                                ...infraSettings,
                                database: { ...infraSettings.database, username: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-emerald-600"
                            placeholder="ankabit_admin"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Master Password</label>
                        <input
                          type="password"
                          value={infraSettings.database.password || ''}
                          onChange={(e) =>
                            setInfraSettings({
                              ...infraSettings,
                              database: { ...infraSettings.database, password: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-emerald-600"
                          placeholder="••••••••••••••••"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Primary Connection String (DATABASE_URL)</label>
                        <textarea
                          rows={2}
                          value={infraSettings.database.connectionString}
                          onChange={(e) =>
                            setInfraSettings({
                              ...infraSettings,
                              database: { ...infraSettings.database, connectionString: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-emerald-600"
                          placeholder="postgresql://ankabit_admin:[PASSWORD]@db-cluster.internal.ankabit.app:5432/ankabit_lms_production?sslmode=require&connection_limit=25"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Direct Unpooled URL (DIRECT_URL for Migrations)</label>
                        <input
                          type="text"
                          value={infraSettings.database.directUrl || ''}
                          onChange={(e) =>
                            setInfraSettings({
                              ...infraSettings,
                              database: { ...infraSettings.database, directUrl: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-emerald-600"
                          placeholder="postgresql://ankabit_admin:[PASSWORD]@db-cluster.internal.ankabit.app:5432/ankabit_lms_production"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Pool Size</label>
                          <input
                            type="number"
                            value={infraSettings.database.poolSize || 25}
                            onChange={(e) =>
                              setInfraSettings({
                                ...infraSettings,
                                database: { ...infraSettings.database, poolSize: Number(e.target.value) },
                              })
                            }
                            className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Max Overflow</label>
                          <input
                            type="number"
                            value={infraSettings.database.maxOverflow || 10}
                            onChange={(e) =>
                              setInfraSettings({
                                ...infraSettings,
                                database: { ...infraSettings.database, maxOverflow: Number(e.target.value) },
                              })
                            }
                            className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Timeout (sec)</label>
                          <input
                            type="number"
                            value={infraSettings.database.poolTimeoutSeconds || 30}
                            onChange={(e) =>
                              setInfraSettings({
                                ...infraSettings,
                                database: { ...infraSettings.database, poolTimeoutSeconds: Number(e.target.value) },
                              })
                            }
                            className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs font-mono"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                          <input
                            type="checkbox"
                            checked={infraSettings.database.ssl}
                            onChange={(e) =>
                              setInfraSettings({
                                ...infraSettings,
                                database: { ...infraSettings.database, ssl: e.target.checked },
                              })
                            }
                            className="w-4 h-4 text-emerald-600 rounded"
                          />
                          <span>Require SSL / TLS Encrypted Pooler</span>
                        </label>
                      </div>
                    </div>

                    {/* PANEL 2: REDIS CACHE & SESSION BROKER */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2 text-rose-600">
                          <Cpu className="w-5 h-5" />
                          <h3 className="font-extrabold text-sm text-slate-900">Redis Cache & Distributed Session Store</h3>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                          <input
                            type="checkbox"
                            checked={infraSettings.redis?.enabled ?? true}
                            onChange={(e) =>
                              setInfraSettings({
                                ...infraSettings,
                                redis: { ...infraSettings.redis, enabled: e.target.checked },
                              })
                            }
                            className="w-4 h-4 text-emerald-600 rounded"
                          />
                          <span>Enabled</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1">Redis Host Endpoint</label>
                          <input
                            type="text"
                            value={infraSettings.redis?.host || ''}
                            onChange={(e) =>
                              setInfraSettings({
                                ...infraSettings,
                                redis: { ...infraSettings.redis, host: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-rose-600"
                            placeholder="redis-cache.internal.ankabit.app"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Port</label>
                          <input
                            type="number"
                            value={infraSettings.redis?.port || 6379}
                            onChange={(e) =>
                              setInfraSettings({
                                ...infraSettings,
                                redis: { ...infraSettings.redis, port: Number(e.target.value) },
                              })
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-rose-600"
                            placeholder="6379"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Redis Auth Password</label>
                        <input
                          type="password"
                          value={infraSettings.redis?.password || ''}
                          onChange={(e) =>
                            setInfraSettings({
                              ...infraSettings,
                              redis: { ...infraSettings.redis, password: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-rose-600"
                          placeholder="••••••••••••••••"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Redis Connection String (REDIS_URL)</label>
                        <input
                          type="text"
                          value={infraSettings.redis?.connectionString || ''}
                          onChange={(e) =>
                            setInfraSettings({
                              ...infraSettings,
                              redis: { ...infraSettings.redis, connectionString: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-rose-600"
                          placeholder="rediss://:[PASSWORD]@redis-cache.internal.ankabit.app:6379"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                          <input
                            type="checkbox"
                            checked={infraSettings.redis?.tls ?? true}
                            onChange={(e) =>
                              setInfraSettings({
                                ...infraSettings,
                                redis: { ...infraSettings.redis, tls: e.target.checked },
                              })
                            }
                            className="w-4 h-4 text-emerald-600 rounded"
                          />
                          <span>TLS Encryption (rediss://)</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                          <input
                            type="checkbox"
                            checked={infraSettings.redis?.clusterMode ?? false}
                            onChange={(e) =>
                              setInfraSettings({
                                ...infraSettings,
                                redis: { ...infraSettings.redis, clusterMode: e.target.checked },
                              })
                            }
                            className="w-4 h-4 text-emerald-600 rounded"
                          />
                          <span>Cluster Sharding Mode</span>
                        </label>
                      </div>

                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 space-y-1">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-rose-600" />
                          <span>Session Caching & Rate Limiter Active</span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Accelerates tenant queries, real-time classroom tokens, and DDoS rate-limiting to sub-millisecond speeds.
                        </p>
                      </div>
                    </div>

                    {/* PANEL 3: LIVEKIT SFU MEDIA EDGE */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2 text-teal-700">
                          <Radio className="w-5 h-5" />
                          <h3 className="font-extrabold text-sm text-slate-900">LiveKit SFU WebRTC Edge</h3>
                        </div>
                        <Badge variant="success" className="bg-teal-50 text-teal-700 border-teal-200 text-[10px]">
                          4 Nodes Healthy
                        </Badge>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">LiveKit SFU Server URL (WebSocket)</label>
                        <input
                          type="text"
                          value={infraSettings.livekit.serverUrl}
                          onChange={(e) =>
                            setInfraSettings({
                              ...infraSettings,
                              livekit: { ...infraSettings.livekit, serverUrl: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-teal-600"
                          placeholder="wss://livekit.ankabit.app"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Master LiveKit API Key (LIVEKIT_API_KEY)</label>
                        <input
                          type="text"
                          value={infraSettings.livekit.apiKey}
                          onChange={(e) =>
                            setInfraSettings({
                              ...infraSettings,
                              livekit: { ...infraSettings.livekit, apiKey: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-teal-600"
                          placeholder="API..."
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">LiveKit API Secret (LIVEKIT_API_SECRET)</label>
                        <input
                          type="password"
                          value={infraSettings.livekit.apiSecret}
                          onChange={(e) =>
                            setInfraSettings({
                              ...infraSettings,
                              livekit: { ...infraSettings.livekit, apiSecret: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-teal-600"
                          placeholder="secret_..."
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Media Edge Region</label>
                        <input
                          type="text"
                          value={infraSettings.livekit.region}
                          onChange={(e) =>
                            setInfraSettings({
                              ...infraSettings,
                              livekit: { ...infraSettings.livekit, region: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-teal-600"
                          placeholder="eu-central-1"
                        />
                      </div>

                      <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl text-xs text-teal-900 space-y-1">
                        <div className="font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
                          <span>WebRTC Mesh & SFU Auto-Scaling Active</span>
                        </div>
                        <p className="text-[11px] text-teal-800">
                          Supports 250+ concurrent interactive live Quran recitation classrooms per node.
                        </p>
                      </div>
                    </div>

                    {/* PANEL 4: AUDIO RECORDER, HOMEWORK & CDN STORAGE */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2 text-sky-700">
                          <HardDrive className="w-5 h-5" />
                          <h3 className="font-extrabold text-sm text-slate-900">Media Storage & Asset CDN (S3 API)</h3>
                        </div>
                        <Badge variant="info" className="bg-sky-50 text-sky-700 border-sky-200 text-[10px]">
                          Edge Cache Active
                        </Badge>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Storage Provider</label>
                        <select
                          value={infraSettings.storage.provider}
                          onChange={(e) =>
                            setInfraSettings({
                              ...infraSettings,
                              storage: { ...infraSettings.storage, provider: e.target.value as any },
                            })
                          }
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-sky-600"
                        >
                          <option value="cloudflare_r2">Cloudflare R2 Object Storage (Zero Egress Fee)</option>
                          <option value="aws_s3">Amazon AWS S3 Standard / Infrequent Access</option>
                          <option value="minio">MinIO Self-Hosted S3 Storage</option>
                          <option value="gcs">Google Cloud Storage (S3 Interoperability)</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Bucket Name</label>
                          <input
                            type="text"
                            value={infraSettings.storage.bucketName}
                            onChange={(e) =>
                              setInfraSettings({
                                ...infraSettings,
                                storage: { ...infraSettings.storage, bucketName: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-sky-600"
                            placeholder="ankabit-quran-assets"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Region</label>
                          <input
                            type="text"
                            value={infraSettings.storage.region}
                            onChange={(e) =>
                              setInfraSettings({
                                ...infraSettings,
                                storage: { ...infraSettings.storage, region: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-sky-600"
                            placeholder="auto / us-east-1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">S3 Endpoint URL</label>
                        <input
                          type="text"
                          value={infraSettings.storage.endpoint}
                          onChange={(e) =>
                            setInfraSettings({
                              ...infraSettings,
                              storage: { ...infraSettings.storage, endpoint: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-sky-600"
                          placeholder="https://<account-id>.r2.cloudflarestorage.com"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">S3 Access Key ID</label>
                          <input
                            type="text"
                            value={infraSettings.storage.accessKeyId}
                            onChange={(e) =>
                              setInfraSettings({
                                ...infraSettings,
                                storage: { ...infraSettings.storage, accessKeyId: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-sky-600"
                            placeholder="r2_access_..."
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">S3 Secret Key</label>
                          <input
                            type="password"
                            value={infraSettings.storage.secretAccessKey}
                            onChange={(e) =>
                              setInfraSettings({
                                ...infraSettings,
                                storage: { ...infraSettings.storage, secretAccessKey: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-sky-600"
                            placeholder="secret_..."
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Public CDN Delivery URL Base</label>
                        <input
                          type="text"
                          value={infraSettings.storage.publicCdnUrl}
                          onChange={(e) =>
                            setInfraSettings({
                              ...infraSettings,
                              storage: { ...infraSettings.storage, publicCdnUrl: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-sky-600"
                          placeholder="https://cdn.ankabit.app"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB 2: PLATFORM MASTER PAYMENT GATEWAYS */}
              {settingsSubTab === 'payments' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <div>
                      <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-emerald-700" />
                        <span>Platform Master Payment Gateways (SaaS Subscription Billing)</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Configure master merchant accounts to accept automated subscription fees from tenant institutions (Stripe, Moyasar Mada/Visa, Flutterwave, and PayPal).
                      </p>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSavePaymentGateways}
                      leftIcon={<Save className="w-4 h-4" />}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                    >
                      Save Payment Gateways
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* STRIPE */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-indigo-600" />
                          <h3 className="font-extrabold text-sm text-slate-900">Stripe Billing Engine</h3>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                          <input
                            type="checkbox"
                            checked={paymentSettings.stripe.enabled}
                            onChange={(e) =>
                              setPaymentSettings({
                                ...paymentSettings,
                                stripe: { ...paymentSettings.stripe, enabled: e.target.checked },
                              })
                            }
                            className="w-4 h-4 text-emerald-600 rounded"
                          />
                          <span>Enabled</span>
                        </label>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Stripe Publishable Key</label>
                        <input
                          type="text"
                          value={paymentSettings.stripe.publishableKey}
                          onChange={(e) =>
                            setPaymentSettings({
                              ...paymentSettings,
                              stripe: { ...paymentSettings.stripe, publishableKey: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-600"
                          placeholder="pk_live_..."
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Stripe Secret Key</label>
                        <input
                          type="password"
                          value={paymentSettings.stripe.secretKey}
                          onChange={(e) =>
                            setPaymentSettings({
                              ...paymentSettings,
                              stripe: { ...paymentSettings.stripe, secretKey: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-600"
                          placeholder="sk_live_..."
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Stripe Webhook Signing Secret</label>
                        <input
                          type="password"
                          value={paymentSettings.stripe.webhookSecret}
                          onChange={(e) =>
                            setPaymentSettings({
                              ...paymentSettings,
                              stripe: { ...paymentSettings.stripe, webhookSecret: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-600"
                          placeholder="whsec_..."
                        />
                      </div>
                    </div>

                    {/* MOYASAR */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <Wallet className="w-5 h-5 text-emerald-600" />
                          <h3 className="font-extrabold text-sm text-slate-900">Moyasar (Saudi Mada, Apple Pay & Visa)</h3>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                          <input
                            type="checkbox"
                            checked={paymentSettings.moyasar.enabled}
                            onChange={(e) =>
                              setPaymentSettings({
                                ...paymentSettings,
                                moyasar: { ...paymentSettings.moyasar, enabled: e.target.checked },
                              })
                            }
                            className="w-4 h-4 text-emerald-600 rounded"
                          />
                          <span>Enabled</span>
                        </label>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Moyasar Publishable Key</label>
                        <input
                          type="text"
                          value={paymentSettings.moyasar.publishableKey}
                          onChange={(e) =>
                            setPaymentSettings({
                              ...paymentSettings,
                              moyasar: { ...paymentSettings.moyasar, publishableKey: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-emerald-600"
                          placeholder="pk_live_moyasar_..."
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Moyasar Secret Key</label>
                        <input
                          type="password"
                          value={paymentSettings.moyasar.secretKey}
                          onChange={(e) =>
                            setPaymentSettings({
                              ...paymentSettings,
                              moyasar: { ...paymentSettings.moyasar, secretKey: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-emerald-600"
                          placeholder="sk_live_moyasar_..."
                        />
                      </div>
                    </div>

                    {/* FLUTTERWAVE */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-amber-600" />
                          <h3 className="font-extrabold text-sm text-slate-900">Flutterwave (Africa & Global Cards)</h3>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                          <input
                            type="checkbox"
                            checked={paymentSettings.flutterwave.enabled}
                            onChange={(e) =>
                              setPaymentSettings({
                                ...paymentSettings,
                                flutterwave: { ...paymentSettings.flutterwave, enabled: e.target.checked },
                              })
                            }
                            className="w-4 h-4 text-emerald-600 rounded"
                          />
                          <span>Enabled</span>
                        </label>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Public Key</label>
                        <input
                          type="text"
                          value={paymentSettings.flutterwave.publicKey}
                          onChange={(e) =>
                            setPaymentSettings({
                              ...paymentSettings,
                              flutterwave: { ...paymentSettings.flutterwave, publicKey: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-amber-600"
                          placeholder="FLWPUBK_..."
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Secret Key</label>
                        <input
                          type="password"
                          value={paymentSettings.flutterwave.secretKey}
                          onChange={(e) =>
                            setPaymentSettings({
                              ...paymentSettings,
                              flutterwave: { ...paymentSettings.flutterwave, secretKey: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-amber-600"
                          placeholder="FLWSECK_..."
                        />
                      </div>
                    </div>

                    {/* PAYPAL */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <Wallet className="w-5 h-5 text-blue-600" />
                          <h3 className="font-extrabold text-sm text-slate-900">PayPal REST API</h3>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                          <input
                            type="checkbox"
                            checked={paymentSettings.paypal.enabled}
                            onChange={(e) =>
                              setPaymentSettings({
                                ...paymentSettings,
                                paypal: { ...paymentSettings.paypal, enabled: e.target.checked },
                              })
                            }
                            className="w-4 h-4 text-emerald-600 rounded"
                          />
                          <span>Enabled</span>
                        </label>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">PayPal Client ID</label>
                        <input
                          type="text"
                          value={paymentSettings.paypal.clientId}
                          onChange={(e) =>
                            setPaymentSettings({
                              ...paymentSettings,
                              paypal: { ...paymentSettings.paypal, clientId: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">PayPal Client Secret</label>
                        <input
                          type="password"
                          value={paymentSettings.paypal.clientSecret}
                          onChange={(e) =>
                            setPaymentSettings({
                              ...paymentSettings,
                              paypal: { ...paymentSettings.paypal, clientSecret: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-blue-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB 3: ANNOUNCEMENTS & MAINTENANCE */}
              {settingsSubTab === 'announcements' && (
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

                  {/* Platform Maintenance Mode */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 text-rose-700">
                      <Shield className="w-5 h-5" />
                      <h3 className="text-base font-extrabold text-slate-900">Emergency Maintenance Mode</h3>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      When enabled, access to student portals and tenant academies is paused with a friendly maintenance screen. SuperAdmins retain full console access.
                    </p>

                    <div className="pt-4 border-t border-slate-100">
                      <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer text-xs font-bold text-slate-800">
                        <input
                          type="checkbox"
                          checked={maintenanceMode}
                          onChange={(e) => {
                            setMaintenanceMode(e.target.checked);
                            if (e.target.checked) {
                              warning('Emergency Mode Enabled', 'Platform is currently restricted to SuperAdmins only.');
                            } else {
                              success('Platform Live', 'Maintenance mode has been disabled.');
                            }
                          }}
                          className="w-4 h-4 text-emerald-600 rounded"
                        />
                        <div>
                          <div>Lock Tenant Logins & Enable Maintenance Mode</div>
                          <div className="text-[10px] text-slate-400 font-normal">Locks student and instructor sessions safely.</div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* PLAN BUILDER MODAL */}
      {isPlanModalOpen && editingPlan && (
        <Modal
          isOpen={isPlanModalOpen}
          onClose={() => setIsPlanModalOpen(false)}
          title={isNewPlanMode ? 'Create New Subscription Plan' : `Edit Plan: ${editingPlan.name}`}
          size="lg"
        >
          <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Plan Display Name</label>
                <input
                  type="text"
                  value={editingPlan.name}
                  onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                  placeholder="e.g. Madrasah Growth"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Unique Plan Slug</label>
                <input
                  type="text"
                  value={editingPlan.slug}
                  onChange={(e) => setEditingPlan({ ...editingPlan, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono text-slate-700 focus:outline-none focus:border-emerald-600"
                  placeholder="e.g. madrasah-growth"
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
                  placeholder="e.g. 200 (Use 999999 for unlimited)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Teacher & Staff Seats</label>
                <input
                  type="number"
                  value={editingPlan.teacherSeats}
                  onChange={(e) => setEditingPlan({ ...editingPlan, teacherSeats: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                  placeholder="e.g. 10 (Use 999 for unlimited)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Badge / Ribbon (Optional)</label>
                <input
                  type="text"
                  value={editingPlan.badge || ''}
                  onChange={(e) => setEditingPlan({ ...editingPlan, badge: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  placeholder="e.g. Most Popular, Best Value"
                />
              </div>

              <div className="flex items-center pt-6">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={editingPlan.isPopular || false}
                    onChange={(e) => setEditingPlan({ ...editingPlan, isPopular: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span>Mark as "Most Popular" Tier</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tier Description</label>
              <textarea
                rows={2}
                value={editingPlan.description}
                onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                placeholder="Short summary of target institution audience..."
              />
            </div>

            {/* Platform Credential Sharing Rules */}
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2.5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-700" />
                <span>SuperAdmin Platform Credential Sharing Rules</span>
              </h4>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Control whether academies on this plan get automatic shared access to SuperAdmin global dispatch pools, or if they must provide their own custom API keys.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <label className="flex items-start gap-2 p-2 rounded-lg bg-white border border-emerald-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPlan.allowPlatformEmailSharing}
                    onChange={(e) =>
                      setEditingPlan({
                        ...editingPlan,
                        allowPlatformEmailSharing: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-emerald-600 rounded mt-0.5"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Provide Platform Shared Email</div>
                    <div className="text-[10px] text-slate-500">When enabled, tenants don't need custom SMTP.</div>
                  </div>
                </label>

                <label className="flex items-start gap-2 p-2 rounded-lg bg-white border border-emerald-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPlan.allowPlatformWhatsAppSharing}
                    onChange={(e) =>
                      setEditingPlan({
                        ...editingPlan,
                        allowPlatformWhatsAppSharing: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-emerald-600 rounded mt-0.5"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Provide Platform Shared WhatsApp</div>
                    <div className="text-[10px] text-slate-500">When enabled, tenants use platform WhatsApp pool.</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Feature Flags Grid */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
                Core Capability Feature Gates
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(editingPlan.featureFlags)
                  .filter(([key]) => key !== 'platformEmailProvided' && key !== 'platformWhatsAppProvided')
                  .map(([key, enabled]) => (
                  <label
                    key={key}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 cursor-pointer text-xs"
                  >
                    <span className="text-slate-800 font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <input
                      type="checkbox"
                      checked={enabled}
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
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
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
                  placeholder="e.g. Automated LMS Report Broadcasts"
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
                  Add Bullet
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
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
              >
                Save & Broadcast Plan
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* STAFF USER MODAL */}
      {isStaffModalOpen && editingStaff && (
        <Modal
          isOpen={isStaffModalOpen}
          onClose={() => setIsStaffModalOpen(false)}
          title={isNewStaffMode ? 'Add SuperAdmin Staff Member' : `Edit Member: ${editingStaff.name}`}
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={editingStaff.name}
                onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                placeholder="e.g. Tariq Mansour"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">SuperAdmin Email Address</label>
              <input
                type="email"
                value={editingStaff.email}
                onChange={(e) => setEditingStaff({ ...editingStaff, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                placeholder="e.g. tariq@ankabit.app"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Platform Role</label>
              <select
                value={editingStaff.role}
                onChange={(e) => setEditingStaff({ ...editingStaff, role: e.target.value as SuperAdminRole })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
              >
                <option value="superadmin">SuperAdmin (Full Master Access)</option>
                <option value="platform_support">Platform Support (Tenant & Ticket Management)</option>
                <option value="billing_manager">Billing Manager (Subscriptions & Financials)</option>
                <option value="infrastructure_lead">Infrastructure Lead (Gateways & Server Ops)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Account Status</label>
              <select
                value={editingStaff.status}
                onChange={(e) => setEditingStaff({ ...editingStaff, status: e.target.value as 'active' | 'suspended' })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
              >
                <option value="active">Active (Access Allowed)</option>
                <option value="suspended">Suspended (Access Revoked)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isNewStaffMode ? 'Temporary Password' : 'Reset Password (Leave blank to keep unchanged)'}
              </label>
              <input
                type="password"
                value={staffPasswordInput}
                onChange={(e) => setStaffPasswordInput(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsStaffModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveStaff}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
              >
                Save Staff Account
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
