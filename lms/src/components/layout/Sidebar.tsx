import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../modules/i18n';
import {
  LayoutDashboard,
  Palette,
  Layers,
  Users,
  Settings,
  BookOpen,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  CreditCard,
  DollarSign,
  X,
  User,
  Video,
  Sparkles,
  FileText,
  MessageSquare,
  ShieldCheck,
  ExternalLink,
  Award,
  Mail,
  Lock,
  UserCheck,
  TrendingUp,
  Key,
} from 'lucide-react';
import { Badge } from '../ui';
import { TenantSubscriptionPlan } from '../../types';
import { useConfirm } from '../../context/ConfirmModalContext';

export type AdminTab =
  | 'overview'
  | 'classroom'
  | 'curriculum'
  | 'forum'
  | 'certificate_studio'
  | 'notifications_hub'
  | 'users_staff'
  | 'page_builder'
  | 'form_builder'
  | 'form_responses'
  | 'crm'
  | 'revenue'
  | 'pricing'
  | 'payment_gateways'
  | 'integrations'
  | 'staff_roles'
  | 'white_labeling'
  | 'settings'
  | 'profile';

interface MenuItem {
  id: AdminTab;
  label: string;
  icon: any;
  requiredPlan?: TenantSubscriptionPlan;
  planLabel?: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface SidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onViewLiveSite: () => void;
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
  onOpenProfile?: () => void;
  onOpenUpgrade?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onViewLiveSite,
  isOpenOnMobile = false,
  onCloseMobile,
  onOpenProfile,
  onOpenUpgrade,
}) => {
  const { tenant } = useTenant();
  const { user, logout } = useAuth();
  const { t, isRtl } = useTranslation();
  const confirm = useConfirm();
  const [collapsed, setCollapsed] = useState(false);

  const plan: TenantSubscriptionPlan = tenant.subscriptionPlan || 'free';

  // Helper to check plan hierarchy
  const isPlanUnlocked = (required?: TenantSubscriptionPlan): boolean => {
    if (!required) return true;
    const tierWeights: Record<TenantSubscriptionPlan, number> = {
      free: 1,
      qari: 2,
      growth: 3,
      enterprise: 4,
    };
    return (tierWeights[plan] || 1) >= (tierWeights[required] || 1);
  };

  // Structured navigation sections
  const menuSections: MenuSection[] = [
    {
      title: isRtl ? 'الأكاديمية' : 'Academics',
      items: [
        { id: 'overview', label: t('nav.overview'), icon: LayoutDashboard },
        { id: 'classroom', label: t('nav.classroom'), icon: Video, requiredPlan: 'growth', planLabel: 'Growth' },
        { id: 'curriculum', label: t('nav.curriculum'), icon: BookOpen },
        { id: 'users_staff', label: isRtl ? 'الهيئة والطلاب' : 'Faculty & Students', icon: UserCheck },
        { id: 'forum', label: t('nav.forum'), icon: MessageSquare, requiredPlan: 'qari', planLabel: 'Qari' },
      ],
    },
    {
      title: isRtl ? 'الأسانيد والإشعارات' : 'Certificates & Comms',
      items: [
        { id: 'certificate_studio', label: t('nav.certificates'), icon: Award, requiredPlan: 'enterprise', planLabel: 'Enterprise' },
        { id: 'notifications_hub', label: t('nav.notifications'), icon: Mail, requiredPlan: 'growth', planLabel: 'Growth' },
      ],
    },
    {
      title: isRtl ? 'القبول والتسجيل' : 'Admissions',
      items: [
        { id: 'page_builder', label: t('nav.pageBuilder'), icon: Layers },
        { id: 'form_builder', label: t('nav.formBuilder'), icon: FileCheck },
        { id: 'form_responses', label: t('nav.formResponses'), icon: FileText },
        { id: 'crm', label: t('nav.crm'), icon: Users },
      ],
    },
    {
      title: isRtl ? 'المالية والإعدادات' : 'Finance & Settings',
      items: [
        { id: 'revenue', label: isRtl ? 'الإيرادات والمالية' : 'Revenue & Finance', icon: TrendingUp },
        { id: 'pricing', label: t('nav.pricing'), icon: DollarSign },
        { id: 'payment_gateways', label: t('nav.gateways'), icon: CreditCard },
        { id: 'integrations', label: isRtl ? 'الربط والمفاتيح البرمجية' : 'Integrations & API Keys', icon: Key },
        { id: 'staff_roles', label: isRtl ? 'الهيئة والصلاحيات' : 'Staff & Roles', icon: ShieldCheck },
        { id: 'white_labeling', label: isRtl ? 'الهوية والعلامة التجارية' : 'Branding & White-label', icon: Palette },
        { id: 'settings', label: t('nav.settings'), icon: Settings },
      ],
    },
  ];

  // Dynamic module determination by SuperAdmin & Admin: hide modules if disabled
  const isModuleEnabled = (modId: AdminTab): boolean => {
    if (['overview', 'settings', 'staff_roles', 'white_labeling', 'profile'].includes(modId)) return true;
    const modulesList = tenant.enabledModules || tenant.settings?.enabledModules || tenant.settings?.modules;
    if (Array.isArray(modulesList)) {
      return modulesList.includes(modId);
    } else if (modulesList && typeof modulesList === 'object') {
      return modulesList[modId] !== false;
    }
    return true;
  };

  const filteredMenuSections: MenuSection[] = menuSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => isModuleEnabled(item.id)),
    }))
    .filter((section) => section.items.length > 0);

  const handleSignOut = async () => {
    const ok = await confirm({
      title: 'Sign Out of Academy',
      message: 'Are you sure you want to end your administrative session?',
      confirmText: 'Sign Out',
      cancelText: 'Stay Signed In',
      variant: 'danger',
    });
    if (ok) {
      logout();
    }
  };

  const handleItemClick = (item: MenuItem) => {
    onTabChange(item.id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenOnMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container: Flex-Aligned on Desktop, Slide-over Drawer on Mobile */}
      <aside
        style={{ backgroundColor: tenant?.brandColor || tenant?.theme?.primaryColor || 'var(--sidebar-bg, #047857)' }}
        className={`fixed inset-y-0 left-0 z-50 lg:static lg:inset-auto flex flex-col border-r border-white/15 text-white transition-all duration-300 ease-in-out shrink-0 h-full shadow-xl overflow-hidden ${
          collapsed && !isOpenOnMobile ? 'w-20' : 'w-64 xl:w-72 max-w-[85vw]'
        } ${
          isOpenOnMobile
            ? 'translate-x-0 shadow-2xl'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header Logo */}
        <div className="h-16 px-3.5 sm:px-4 border-b border-white/15 flex items-center justify-between shrink-0 bg-black/15">
          {(!collapsed || isOpenOnMobile) ? (
            <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
              {tenant.logoUrl ? (
                <img
                  src={tenant.logoUrl}
                  alt={tenant.name}
                  className="w-8 h-8 rounded-xl object-contain bg-white/10 p-0.5 border border-white/20 shrink-0 shadow-xs"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-white/20 border border-white/20 flex items-center justify-center font-bold text-white shadow-xs shrink-0">
                  {tenant.name.charAt(0)}
                </div>
              )}
              <div className="min-w-0">
                <h2 className="font-bold text-sm text-white truncate">{tenant.name}</h2>
                <p className="text-[10px] text-white/70 truncate">{tenant.customDomain || `${tenant.subdomain}.edu`}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center w-8 h-8">
              {tenant.logoUrl ? (
                <img
                  src={tenant.logoUrl}
                  alt={tenant.name}
                  className="w-8 h-8 rounded-xl object-contain bg-white/10 p-0.5 border border-white/20 shrink-0 shadow-xs"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-white/20 border border-white/20 flex items-center justify-center font-bold text-white shadow-xs shrink-0">
                  {tenant.name.charAt(0)}
                </div>
              )}
            </div>
          )}

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer outline-none shrink-0"
            aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4 text-white" /> : <ChevronLeft className="w-4 h-4 text-white" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer outline-none"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
          {/* Direct Live Site Link */}
          <div>
            {(!collapsed || isOpenOnMobile) ? (
              <button
                onClick={onViewLiveSite}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-colors cursor-pointer group outline-none"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                  <span className="text-white">View Public Academy</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-white/80 group-hover:text-white" />
              </button>
            ) : (
              <button
                onClick={onViewLiveSite}
                className="w-full flex justify-center py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer outline-none"
                title="View Live Site"
              >
                <ExternalLink className="w-4 h-4 text-white" />
              </button>
            )}
          </div>

          {/* Categorized Navigation Sections (Dynamic by SuperAdmin & Admin) */}
          {filteredMenuSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {(!collapsed || isOpenOnMobile) && (
                <div className="px-3 pt-2.5 pb-1 text-xs font-semibold capitalize tracking-wider text-white/70">
                  {section.title}
                </div>
              )}

              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  const unlocked = isPlanUnlocked(item.requiredPlan);

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer select-none outline-none ${
                        isActive
                          ? 'bg-white/20 text-white shadow-xs font-semibold backdrop-blur-xs'
                          : 'text-white/85 hover:text-white hover:bg-white/10'
                      }`}
                      title={collapsed ? item.label : undefined}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon className="w-5 h-5 shrink-0 text-white" />
                        {(!collapsed || isOpenOnMobile) && (
                          <span className="truncate text-sm font-semibold text-white">{item.label}</span>
                        )}
                      </div>

                      {/* Locked Badge if on lower plan */}
                      {(!collapsed || isOpenOnMobile) && !unlocked && (
                        <span className="px-2 py-0.5 rounded-md bg-white/20 text-white text-xs font-semibold tracking-tight shrink-0 flex items-center gap-1 border border-white/25">
                          <Lock className="w-3 h-3 text-white" />
                          <span className="text-white">{item.planLabel}</span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Tier Indicator & User Info */}
        <div className="p-3.5 border-t border-white/15 space-y-2.5 shrink-0 bg-black/15">
          {(!collapsed || isOpenOnMobile) && (
            <div className="p-3 bg-white/10 rounded-xl border border-white/15 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs capitalize font-semibold text-white/80">Plan Tier</span>
                <span className="text-xs font-semibold text-white capitalize tracking-wide">{plan}</span>
              </div>
              <p className="text-xs text-white/70">
                {plan === 'free'
                  ? 'Up to 15 Students'
                  : plan === 'qari'
                  ? 'Up to 50 Students'
                  : plan === 'growth'
                  ? 'Up to 350 Students'
                  : 'Unlimited Students'}
              </p>
              {plan !== 'enterprise' && onOpenUpgrade && (
                <button
                  onClick={onOpenUpgrade}
                  className="w-full mt-1.5 py-2 px-3 bg-white hover:bg-white/90 text-slate-900 text-xs font-semibold rounded-lg inline-flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs outline-none"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-slate-900">Upgrade Plan</span>
                </button>
              )}
            </div>
          )}

          {(!collapsed || isOpenOnMobile) && (
            <div
              onClick={onOpenProfile}
              className="px-3 py-2 bg-white/10 border border-white/10 rounded-xl flex items-center justify-between cursor-pointer hover:bg-white/15 transition-colors"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-7 h-7 rounded-full bg-white/20 text-white flex items-center justify-center font-semibold text-xs shrink-0">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{user?.name || 'Administrator'}</p>
                  <p className="text-[10px] text-white/70 truncate capitalize">{user?.role || 'admin'}</p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleSignOut}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-white/90 hover:text-white hover:bg-white/15 rounded-xl transition-colors cursor-pointer outline-none ${
              collapsed && !isOpenOnMobile ? 'justify-center' : ''
            }`}
            title={collapsed ? 'Sign Out' : undefined}
          >
            <LogOut className="w-4 h-4 shrink-0 text-white" />
            {(!collapsed || isOpenOnMobile) && <span className="text-white">Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
