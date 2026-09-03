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
  SlidersHorizontal,
  FileText,
  Zap,
  MessageSquare,
} from 'lucide-react';
import { Badge } from '../ui';

export type AdminTab =
  | 'overview'
  | 'classroom'
  | 'page_builder'
  | 'form_builder'
  | 'form_responses'
  | 'automations'
  | 'chat_insights'
  | 'curriculum'
  | 'pricing'
  | 'payment_gateways'
  | 'crm'
  | 'analytics'
  | 'settings'
  | 'integrations'
  | 'profile';

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

  const plan = tenant.subscriptionPlan || 'free';

  const menuItems: { id: AdminTab; label: string; icon: any }[] = [
    { id: 'overview', label: 'Overview & Metrics', icon: LayoutDashboard },
    { id: 'classroom', label: 'Live Virtual Classroom', icon: Video },
    { id: 'page_builder', label: 'Page Builder', icon: Layers },
    { id: 'form_builder', label: 'Form Builder', icon: FileCheck },
    { id: 'form_responses', label: 'Form Submissions', icon: FileText },
    { id: 'automations', label: 'Automations & Workflows', icon: Zap },
    { id: 'chat_insights', label: 'Chat Insights & AI', icon: MessageSquare },
    { id: 'curriculum', label: 'Curriculum & Tracks', icon: BookOpen },
    { id: 'crm', label: 'Student Leads CRM', icon: Users },
    { id: 'pricing', label: 'Tuition Plan Packages', icon: DollarSign },
    { id: 'payment_gateways', label: 'Merchant Gateways', icon: CreditCard },
    { id: 'settings', label: 'Branding & Theme Settings', icon: Palette },
  ];

  const handleItemClick = (id: AdminTab) => {
    onTabChange(id);
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

      {/* Main Sidebar Container */}
      <aside
        className={`bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col justify-between z-50 transition-all duration-300 ${
          isOpenOnMobile
            ? 'fixed inset-y-0 left-0 w-72 sm:w-80 shadow-2xl flex'
            : collapsed
            ? 'w-18 hidden lg:flex'
            : 'w-64 xl:w-72 hidden lg:flex'
        }`}
      >
        <div>
          {/* Header Brand Section */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
            {(!collapsed || isOpenOnMobile) && (
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                  {tenant.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h2 className="font-extrabold text-sm text-white truncate">{tenant.name}</h2>
                  <p className="text-[11px] text-slate-400 font-mono truncate">{tenant.subdomain}.techmadrasah.app</p>
                </div>
              </div>
            )}

            {collapsed && !isOpenOnMobile && (
              <div className="mx-auto w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                {tenant.name.charAt(0)}
              </div>
            )}

            {/* Toggle Button */}
            {isOpenOnMobile ? (
              <button
                onClick={onCloseMobile}
                className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close navigation"
              >
                <X className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="hidden lg:block p-2 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Toggle Sidebar"
              >
                {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            )}
          </div>

          {/* Navigation Links with Generous Padding */}
          <nav className="p-3 sm:p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-250px)]">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer select-none ${
                    isActive
                      ? 'bg-white/10 text-white shadow-xs font-bold ring-1 ring-white/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {(!collapsed || isOpenOnMobile) && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Tier Indicator & User Info with Generous Padding */}
        <div className="p-4 border-t border-slate-800 space-y-3 shrink-0">
          {(!collapsed || isOpenOnMobile) && (
            <div className="p-3 bg-slate-800/70 rounded-xl border border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400">Plan Tier</span>
                <span className="text-[11px] font-bold text-amber-300 capitalize">{plan}</span>
              </div>
              <p className="text-[11px] text-slate-400">
                {plan === 'free' ? '15 Students max' : plan === 'qari' ? '50 Students max' : plan === 'growth' ? '350 Students max' : 'Unlimited Students'}
              </p>
              {plan !== 'enterprise' && onOpenUpgrade && (
                <button
                  onClick={onOpenUpgrade}
                  className="w-full mt-1.5 py-2 px-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                >
                  <span>Upgrade Plan</span>
                </button>
              )}
            </div>
          )}

          {(!collapsed || isOpenOnMobile) && (
            <div
              onClick={() => handleItemClick('profile')}
              className="px-3.5 py-2.5 bg-slate-800/50 rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
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
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-950/40 rounded-xl transition-colors cursor-pointer ${
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
