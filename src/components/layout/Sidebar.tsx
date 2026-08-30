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
} from 'lucide-react';
import { Badge } from '../ui';

export type AdminTab =
  | 'overview'
  | 'classroom'
  | 'page_builder'
  | 'form_builder'
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
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const plan = tenant.subscriptionPlan || 'free';

  const menuItems = [
    { id: 'overview' as AdminTab, label: 'Overview & Analytics', icon: LayoutDashboard },
    { id: 'classroom' as AdminTab, label: 'Live Classroom', icon: Video },
    { id: 'page_builder' as AdminTab, label: 'Page Builder', icon: Palette },
    { id: 'form_builder' as AdminTab, label: 'Form Builder', icon: FileCheck },
    { id: 'curriculum' as AdminTab, label: 'Curriculum & Courses', icon: Layers },
    { id: 'pricing' as AdminTab, label: 'Tuition & Pricing', icon: DollarSign },
    { id: 'payment_gateways' as AdminTab, label: 'Payment Gateways', icon: CreditCard },
    { id: 'crm' as AdminTab, label: 'Admissions CRM', icon: Users },
    { id: 'settings' as AdminTab, label: 'Academy Settings', icon: Settings },
    { id: 'integrations' as AdminTab, label: 'API Keys & Services', icon: Sparkles },
    { id: 'profile' as AdminTab, label: 'User Profile & Security', icon: User },
  ];

  const handleItemClick = (tabId: AdminTab) => {
    onTabChange(tabId);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenOnMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs z-40 lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col justify-between transition-all duration-200 z-50 font-sans ${
          collapsed ? 'lg:w-20' : 'lg:w-64'
        } ${
          isOpenOnMobile
            ? 'fixed inset-y-0 left-0 w-64 shadow-2xl flex'
            : 'hidden lg:flex lg:sticky lg:top-0 lg:h-screen'
        }`}
      >
        {/* Top Branding & Header */}
        <div>
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center font-bold text-xs shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              {(!collapsed || isOpenOnMobile) && (
                <div className="min-w-0">
                  <h2 className="font-bold text-xs text-white truncate">{tenant.name}</h2>
                  <p className="text-[10px] text-slate-400 font-mono truncate">{tenant.subdomain}.hifz.app</p>
                </div>
              )}
            </div>

            {isOpenOnMobile ? (
              <button
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="hidden lg:block p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Toggle Sidebar"
              >
                {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white/10 text-white shadow-2xs font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {(!collapsed || isOpenOnMobile) && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Tier Indicator & User Info */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          {(!collapsed || isOpenOnMobile) && (
            <div className="p-2.5 bg-slate-800/70 rounded-lg border border-slate-700/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400">Plan Tier</span>
                <span className="text-[10px] font-bold text-amber-300 capitalize">{plan}</span>
              </div>
              <p className="text-[10px] text-slate-400">
                {plan === 'free' ? '15 Students max' : plan === 'qari' ? '50 Students max' : plan === 'growth' ? '350 Students max' : 'Unlimited Students'}
              </p>
              {plan !== 'enterprise' && onOpenUpgrade && (
                <button
                  onClick={onOpenUpgrade}
                  className="w-full mt-1 py-1 px-2 bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold rounded flex items-center justify-center transition-colors cursor-pointer"
                >
                  <span>Upgrade Plan</span>
                </button>
              )}
            </div>
          )}

          {(!collapsed || isOpenOnMobile) && (
            <div
              onClick={() => handleItemClick('profile')}
              className="px-3 py-2 bg-slate-800/50 rounded-lg flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-xs">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{user?.name || 'Administrator'}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user?.role?.toUpperCase() || 'ADMIN'}</p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {(!collapsed || isOpenOnMobile) && <span>Log Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
