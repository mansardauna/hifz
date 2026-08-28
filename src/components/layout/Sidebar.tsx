import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Palette,
  Layers,
  Users,
  BarChart3,
  Settings,
  BookOpen,
  ExternalLink,
  Globe,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  CreditCard,
  DollarSign,
  X,
  User,
  Shield,
  Sparkles,
} from 'lucide-react';
import { IslamicStarPattern, CrescentVector } from '../ui/IslamicArtDecoration';

export type AdminTab =
  | 'overview'
  | 'page_builder'
  | 'form_builder'
  | 'curriculum'
  | 'pricing'
  | 'payment_gateways'
  | 'crm'
  | 'analytics'
  | 'settings'
  | 'profile'
  | 'user_settings';

interface SidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onViewLiveSite: () => void;
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
  onOpenProfile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onViewLiveSite,
  isOpenOnMobile = false,
  onCloseMobile,
  onOpenProfile,
}) => {
  const { tenant, language, toggleLanguage } = useTenant();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const isAr = language === 'ar';

  const menuItems = [
    { id: 'overview' as AdminTab, label: 'Overview', labelAr: 'الرئيسية', icon: LayoutDashboard },
    { id: 'page_builder' as AdminTab, label: 'GrapesJS Visual Canvas', labelAr: 'محرر الصفحات المرئي', icon: Palette },
    { id: 'form_builder' as AdminTab, label: 'Admissions Form Builder', labelAr: 'منشئ الاستبيان', icon: FileCheck },
    { id: 'curriculum' as AdminTab, label: 'Courses & Curriculum', labelAr: 'المناهج والدورات', icon: Layers },
    { id: 'pricing' as AdminTab, label: 'Tuition & Pricing Plans', labelAr: 'الخطط الدراسية', icon: DollarSign },
    { id: 'payment_gateways' as AdminTab, label: 'Payment Gateways', labelAr: 'بوابات الدفع', icon: CreditCard },
    { id: 'crm' as AdminTab, label: 'Students & CRM', labelAr: 'إدارة الطلاب والطلبات', icon: Users },
    { id: 'analytics' as AdminTab, label: 'Analytics & Growth', labelAr: 'التحليلات', icon: BarChart3 },
    { id: 'settings' as AdminTab, label: 'Branding & Academy', labelAr: 'بيانات المعهد', icon: Settings },
    { id: 'profile' as AdminTab, label: 'Administrator Profile', labelAr: 'الملف الشخصي للمشرف', icon: User },
    { id: 'user_settings' as AdminTab, label: 'Account & Security Settings', labelAr: 'إعدادات الحساب والأمان', icon: Shield },
  ];

  const handleItemClick = (tabId: AdminTab) => {
    if ((tabId === 'profile' || tabId === 'user_settings') && onOpenProfile) {
      onOpenProfile();
    } else {
      onTabChange(tabId);
    }
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
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`bg-emerald-950 text-emerald-100 border-r border-emerald-900 flex flex-col justify-between transition-all duration-200 z-50 font-sans ${
          /* Desktop sidebar sizing */
          collapsed ? 'lg:w-20' : 'lg:w-72'
        } ${
          /* Mobile slide-over drawer */
          isOpenOnMobile
            ? 'fixed inset-y-0 left-0 w-72 shadow-2xl flex'
            : 'hidden lg:flex lg:sticky lg:top-0 lg:h-screen'
        }`}
      >
        {/* Top Branding & Close Button */}
        <div>
          <div className="p-5 border-b border-emerald-900 flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-md bg-emerald-900 border border-emerald-700 text-amber-400 flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
                {tenant.faviconUrl || '📖'}
              </div>
              {(!collapsed || isOpenOnMobile) && (
                <div className="min-w-0">
                  <h2 className="font-bold text-sm text-white truncate font-display">{tenant.name}</h2>
                  <p className="text-[11px] text-emerald-400 font-mono truncate">{tenant.subdomain}.hifz.app</p>
                </div>
              )}
            </div>

            {/* Mobile Close Icon */}
            {isOpenOnMobile ? (
              <button
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 rounded-md text-emerald-300 hover:text-white hover:bg-emerald-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="hidden lg:block p-1.5 rounded-md border border-emerald-800 hover:bg-emerald-900 text-emerald-300 mx-auto transition-colors cursor-pointer"
                title="Toggle Sidebar"
              >
                {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            )}
          </div>

          {/* Menu Items with Larger Font & Generous Spacing */}
          <nav className="p-3.5 space-y-1.5 overflow-y-auto max-h-[calc(100vh-200px)]">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-900 text-white font-bold border-l-4 border-amber-400 shadow-md ring-1 ring-emerald-700/50'
                      : 'text-emerald-200 hover:text-white hover:bg-emerald-900/60'
                  }`}
                  title={item.label}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-amber-400' : 'text-emerald-400'}`} />
                  {(!collapsed || isOpenOnMobile) && (
                    <span className="truncate">{isAr ? item.labelAr : item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User & Live Site Bar */}
        <div className="p-4 border-t border-emerald-900 space-y-3">
          <button
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
              onViewLiveSite();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-emerald-900 hover:bg-emerald-850 text-amber-300 font-bold text-xs border border-emerald-700 transition-colors shadow-xs cursor-pointer"
            title="View Live Academy"
          >
            <ExternalLink className="w-4 h-4" />
            {(!collapsed || isOpenOnMobile) && <span>View Live Academy</span>}
          </button>

          <div className="flex items-center justify-between pt-1">
            {(!collapsed || isOpenOnMobile) && (
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-7 h-7 rounded-full bg-emerald-800 border border-emerald-700 flex items-center justify-center text-xs font-bold text-emerald-200">
                  {user?.name?.[0] || 'A'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{user?.name || 'Academy Admin'}</p>
                  <p className="text-[10px] text-emerald-400 truncate">Administrator</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-1 mx-auto">
              {onOpenProfile && (
                <button
                  onClick={onOpenProfile}
                  className="p-2 rounded-md text-emerald-300 hover:text-white hover:bg-emerald-900 transition-colors cursor-pointer"
                  title="Profile & Settings"
                >
                  <User className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={toggleLanguage}
                className="p-2 rounded-md text-emerald-300 hover:text-white hover:bg-emerald-900 transition-colors cursor-pointer"
                title="Toggle Language"
              >
                <Globe className="w-4 h-4" />
              </button>
              <button
                onClick={logout}
                className="p-2 rounded-md text-emerald-300 hover:text-rose-400 hover:bg-emerald-900 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
