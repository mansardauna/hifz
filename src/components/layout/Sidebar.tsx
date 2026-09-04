import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
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
} from 'lucide-react';
import { Badge } from '../ui';
import { TenantSubscriptionPlan } from '../../types';

export type AdminTab =
  | 'overview'
  | 'classroom'
  | 'curriculum'
  | 'forum'
  | 'certificate_studio'
  | 'notifications_hub'
  | 'page_builder'
  | 'form_builder'
  | 'form_responses'
  | 'crm'
  | 'pricing'
  | 'payment_gateways'
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

  // Structured, non-redundant navigation sections
  const menuSections: MenuSection[] = [
    {
      title: 'Academy Hubs',
      items: [
        { id: 'overview', label: 'Overview & Metrics', icon: LayoutDashboard },
        { id: 'classroom', label: 'Live Virtual Classroom', icon: Video, requiredPlan: 'growth', planLabel: 'Growth' },
        { id: 'curriculum', label: 'Curriculum & Tracks', icon: BookOpen },
        { id: 'forum', label: 'Community & Forum', icon: MessageSquare, requiredPlan: 'qari', planLabel: 'Qari' },
      ],
    },
    {
      title: 'Certificates & Comms',
      items: [
        { id: 'certificate_studio', label: 'Sanad & Ijazah Studio', icon: Award, requiredPlan: 'enterprise', planLabel: 'Enterprise' },
        { id: 'notifications_hub', label: 'Email & WhatsApp Alerts', icon: Mail, requiredPlan: 'growth', planLabel: 'Growth' },
      ],
    },
    {
      title: 'Admissions & Funnels',
      items: [
        { id: 'page_builder', label: 'Visual Page Builder', icon: Layers },
        { id: 'form_builder', label: 'Admissions Form Builder', icon: FileCheck },
        { id: 'form_responses', label: 'Form Submissions', icon: FileText },
        { id: 'crm', label: 'Student Leads CRM', icon: Users },
      ],
    },
    {
      title: 'Finance & Settings',
      items: [
        { id: 'pricing', label: 'Tuition Packages', icon: DollarSign },
        { id: 'payment_gateways', label: 'Merchant Gateways', icon: CreditCard },
        { id: 'settings', label: 'Academy Settings & Roles', icon: Settings },
      ],
    },
  ];

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
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 z-50 flex flex-col bg-slate-900 border-r border-slate-800 text-slate-300 transition-all duration-300 ease-in-out shrink-0 ${
          collapsed && !isOpenOnMobile ? 'w-20' : 'w-72'
        } ${
          isOpenOnMobile
            ? 'translate-x-0 shadow-2xl'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header Logo */}
        <div className="h-16 px-4 sm:px-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950/50">
          {(!collapsed || isOpenOnMobile) && (
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-700 flex items-center justify-center font-bold text-white shadow-md shadow-emerald-700/20 shrink-0">
                {tenant.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <h2 className="font-extrabold text-sm text-white truncate">{tenant.name}</h2>
                <p className="text-[10px] text-slate-400 truncate">{tenant.subdomain}.ankabit.app</p>
              </div>
            </div>
          )}

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {/* Direct Live Site Link */}
          <div>
            {(!collapsed || isOpenOnMobile) ? (
              <button
                onClick={onViewLiveSite}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700/60 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>View Public Academy</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
              </button>
            ) : (
              <button
                onClick={onViewLiveSite}
                className="w-full flex justify-center py-2.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors cursor-pointer"
                title="View Live Site"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Categorized Navigation Sections */}
          {menuSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {(!collapsed || isOpenOnMobile) && (
                <div className="px-3 pt-2 pb-1 text-[10px] font-black uppercase tracking-wider text-slate-500">
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
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer select-none ${
                        isActive
                          ? 'bg-white/10 text-white shadow-xs font-bold ring-1 ring-white/10'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                      title={collapsed ? item.label : undefined}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        {(!collapsed || isOpenOnMobile) && (
                          <span className="truncate text-xs font-medium">{item.label}</span>
                        )}
                      </div>

                      {/* Locked Badge if on lower plan */}
                      {(!collapsed || isOpenOnMobile) && !unlocked && (
                        <span className="px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[9px] font-bold tracking-tight shrink-0 flex items-center gap-1 border border-amber-500/30">
                          <Lock className="w-2.5 h-2.5" />
                          <span>{item.planLabel}</span>
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
        <div className="p-3.5 border-t border-slate-800 space-y-2.5 shrink-0 bg-slate-950/60">
          {(!collapsed || isOpenOnMobile) && (
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400">Plan Tier</span>
                <span className="text-[11px] font-black text-emerald-400 uppercase tracking-wide">{plan}</span>
              </div>
              <p className="text-[10px] text-slate-400">
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
                  className="w-full mt-1 py-1.5 px-3 bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Upgrade Plan</span>
                </button>
              )}
            </div>
          )}

          {/* Direct Super Admin link for platform owners */}
          {(!collapsed || isOpenOnMobile) && (
            <a
              href="/super-admin"
              className="flex items-center justify-between px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-emerald-400 transition-colors"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Super Admin Suite</span>
              </div>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          )}

          {(!collapsed || isOpenOnMobile) && (
            <div
              onClick={onOpenProfile}
              className="px-3 py-2 bg-slate-800/40 rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user?.role?.toUpperCase() || 'ADMIN'}</p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={logout}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer ${
              collapsed && !isOpenOnMobile ? 'justify-center' : ''
            }`}
            title={collapsed ? 'Sign Out' : undefined}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {(!collapsed || isOpenOnMobile) && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
