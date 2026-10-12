'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { TenantConfig, Direction, Course, FormFieldConfig } from '../types';
import { MOCK_TENANTS, MOCK_COURSES } from '../services/mockData';
import { api } from '../services/api';
import { DEMO_SUBDOMAINS, isDemoTenant } from '../lib/tenants';

export { DEMO_SUBDOMAINS, isDemoTenant };

export type AppRole = 'saas_home' | 'landing' | 'admin' | 'student' | 'signin' | 'signup' | 'create_academy' | 'forgot-password';
export type AppLanguage = 'en' | 'ar';

export const createCleanTenantConfig = (subdomain: string): TenantConfig => {
  const isCoding = subdomain.includes('code');
  const isSchool = subdomain.includes('school') || subdomain.includes('horizon');
  const primaryColor = isCoding ? '#2563eb' : isSchool ? '#7c3aed' : '#059669';
  const name = subdomain
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');

  return {
    id: `tenant-${subdomain}`,
    name,
    nameAr: subdomain,
    tagline: 'Autonomous Educational Institution',
    taglineAr: 'منصة تعليمية ذكية',
    subdomain,
    customDomain: `${subdomain}.edu`,
    niche: isCoding ? 'coding' : isSchool ? 'school' : 'madrasat',
    logoUrl: '',
    faviconUrl: '',
    theme: {
      primaryColor,
      primaryHover: isCoding ? '#1d4ed8' : isSchool ? '#6d28d9' : '#047857',
      secondaryColor: '#0f172a',
      accentColor: '#10b981',
      backgroundColor: '#ffffff',
      surfaceColor: '#f8fafc',
      textColor: '#0f172a',
      borderRadius: 'rounded-xl',
      fontFamily: 'Inter',
    },
    heroBadgeText: 'Admissions Open',
    heroBadgeTextAr: 'التسجيل متاح',
    aboutText: `Welcome to ${name}.`,
    aboutTextAr: `مرحباً بكم في ${name}.`,
    admissionsOpen: true,
    pageBlocks: [],
    pricingPlans: [],
    paymentGateways: [],
    forms: [],
    customFormFields: [],
    subscriptionPlan: 'free',
    contactEmail: `admin@${subdomain}.edu`,
    contactPhone: '',
    defaultDirection: 'ltr',
  };
};

interface TenantContextType {
  tenant: TenantConfig;
  courses: Course[];
  activeRole: AppRole;
  direction: Direction;
  language: AppLanguage;
  isLoading: boolean;
  setTenantBySubdomain: (subdomain: string) => void;
  setActiveRole: (role: AppRole) => void;
  setDirection: (dir: Direction) => void;
  setLanguage: (lang: AppLanguage) => void;
  toggleLanguage: () => void;
  updateTenantConfig: (updates: Partial<TenantConfig>) => void;
  updateCourses: (newCourses: Course[]) => void;
  updateCustomFormFields: (fields: FormFieldConfig[]) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

const resolveInitialSubdomain = (): string => {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname;
    const segments = path.split('/').filter(Boolean);
    const rootRoutes = ['login', 'register', 'create-academy', 'super-admin', 'verify', 'api'];
    if (segments.length > 0 && !rootRoutes.includes(segments[0])) {
      return segments[0];
    }
    const host = window.location.hostname;
    const parts = host.split('.');
    if (parts.length > 2 && parts[0] !== 'www' && !host.endsWith('.vercel.app')) {
      return parts[0];
    }
  }
  return 'demo';
};

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSubdomain, setCurrentSubdomain] = useState<string>(() => resolveInitialSubdomain());
  const [tenant, setTenant] = useState<TenantConfig>(() => {
    const sub = resolveInitialSubdomain();
    return isDemoTenant(sub)
      ? (MOCK_TENANTS[sub] || createCleanTenantConfig(sub))
      : createCleanTenantConfig(sub);
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeRole, setActiveRole] = useState<AppRole>('saas_home');
  const [direction, setDirection] = useState<Direction>('ltr');
  const [language, setLanguage] = useState<AppLanguage>('en');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Auto-detect subdomain from window.location pathname or hostname in real multi-tenant deployment
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const detected = resolveInitialSubdomain();
    if (detected && detected !== currentSubdomain) {
      setCurrentSubdomain(detected);
    }
  }, []);

  // Fetch tenant config, merge persistent localStorage overrides, and inject dynamic CSS variables
  useEffect(() => {
    if (!currentSubdomain) return;
    setIsLoading(true);
    let isCancelled = false;

    // Immediately apply cached or clean skeleton config for responsive rendering
    const isDemo = isDemoTenant(currentSubdomain);
    const base = isDemo ? (MOCK_TENANTS[currentSubdomain] || MOCK_TENANTS['demo'] || createCleanTenantConfig(currentSubdomain)) : createCleanTenantConfig(currentSubdomain);
    let mergedLocal = { ...base };
    if (typeof window !== 'undefined') {
      try {
        const cachedJson = localStorage.getItem(`tenant_config_${currentSubdomain}`);
        const cachedHtml = localStorage.getItem(`tenant_customHtml_${currentSubdomain}`);
        const cachedCss = localStorage.getItem(`tenant_customCss_${currentSubdomain}`);
        const cachedSchema = localStorage.getItem(`tenant_schema_${currentSubdomain}`);

        if (cachedJson) mergedLocal = { ...mergedLocal, ...JSON.parse(cachedJson) };
        if (cachedHtml) mergedLocal.customHtml = cachedHtml;
        if (cachedCss) mergedLocal.customCss = cachedCss;
        if (cachedSchema) {
          try {
            mergedLocal.landingPageSchema = JSON.parse(cachedSchema);
          } catch (e) {}
        }
      } catch (e) {
        console.warn('localStorage tenant load error:', e);
      }
    }

    setTenant(mergedLocal);
    injectCssVariables(mergedLocal);

    api.getTenantConfig(currentSubdomain).then((serverConfig) => {
      if (isCancelled) return;
      const finalConfig = { ...mergedLocal, ...serverConfig };
      setTenant(finalConfig);
      if (activeRole === 'landing') {
        setDirection(finalConfig.defaultDirection);
        setLanguage(finalConfig.defaultDirection === 'rtl' ? 'ar' : 'en');
      }
      injectCssVariables(finalConfig);

      // Load tenant-specific courses
      api.getCourses(finalConfig.id || currentSubdomain).then((loadedCourses) => {
        if (isCancelled) return;
        setCourses(loadedCourses);
        setIsLoading(false);
      }).catch(() => {
        if (!isCancelled) setIsLoading(false);
      });
    }).catch(() => {
      if (!isCancelled) setIsLoading(false);
    });

    return () => {
      isCancelled = true;
    };
  }, [currentSubdomain]);

  const hexToRgb = (hex: string): string => {
    let clean = hex.replace('#', '');
    if (clean.length === 3) {
      clean = clean.split('').map((c) => c + c).join('');
    }
    const num = parseInt(clean, 16);
    if (isNaN(num)) return '13, 148, 136'; // fallback to teal
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `${r}, ${g}, ${b}`;
  };

  const injectCssVariables = (config: TenantConfig) => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const primaryHex = config.theme?.primaryColor || (config as any).brandColor || '#047857';
    const primaryHoverHex = config.theme?.primaryHover || '#065f46';
    const primaryRgb = hexToRgb(primaryHex);

    root.style.setProperty('--color-primary', primaryHex);
    root.style.setProperty('--color-primary-hover', primaryHoverHex);
    root.style.setProperty('--color-primary-rgb', primaryRgb);
    root.style.setProperty('--color-primary-50', `rgba(${primaryRgb}, 0.05)`);
    root.style.setProperty('--color-primary-100', `rgba(${primaryRgb}, 0.12)`);
    root.style.setProperty('--color-primary-500', primaryHex);
    root.style.setProperty('--color-primary-600', primaryHex);
    root.style.setProperty('--color-primary-700', primaryHoverHex);

    root.style.setProperty('--color-secondary', config.theme?.secondaryColor || '#d97706');
    root.style.setProperty('--color-accent', config.theme?.accentColor || '#0284c7');
    root.style.setProperty('--sidebar-bg', config.theme?.sidebarBgColor || (config as any).sidebarBgColor || '#0f172a');
    root.style.setProperty('--color-bg', config.theme?.backgroundColor || '#f8fafc');
    root.style.setProperty('--color-surface', config.theme?.surfaceColor || '#ffffff');
    root.style.setProperty('--color-text', config.theme?.textColor || '#0f172a');
    root.style.setProperty('--tenant-radius', config.theme?.borderRadius || '0.75rem');

    const isPlatformHost = !config.subdomain || config.subdomain === 'platform' || config.subdomain === 'demo';
    document.title = isPlatformHost ? `${config.name} • Ankabit LMS` : `${config.name} | Academy Portal`;

    // Dynamically inject tenant unique favicon in browser tab
    const faviconUrl = config.faviconUrl || config.logoUrl || '/icons/icon.svg';
    let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = faviconUrl;
  };

  const setTenantBySubdomain = useCallback((subdomain: string) => {
    if (!subdomain) return;
    const clean = subdomain.trim();
    setCurrentSubdomain((prev) => {
      if (prev === clean) return prev;
      return clean;
    });
  }, []);

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'ar' : 'en';
    const nextDir = nextLang === 'ar' ? 'rtl' : 'ltr';
    setLanguage(nextLang);
    setDirection(nextDir);
  };

  const updateTenantConfig = (updates: Partial<TenantConfig>) => {
    setTenant((prev) => {
      const updated = { ...prev, ...updates };
      injectCssVariables(updated);

      if (updated.subdomain && updated.subdomain !== prev.subdomain) {
        setCurrentSubdomain(updated.subdomain);
      }

      // Persist to localStorage immediately
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(`tenant_config_${updated.subdomain}`, JSON.stringify(updated));
          if (prev.subdomain && prev.subdomain !== updated.subdomain) {
            localStorage.setItem(`tenant_config_${prev.subdomain}`, JSON.stringify(updated));
          }
          if (updates.customHtml) {
            localStorage.setItem(`tenant_customHtml_${updated.subdomain}`, updates.customHtml);
          }
          if (updates.customCss) {
            localStorage.setItem(`tenant_customCss_${updated.subdomain}`, updates.customCss);
          }
          if (updates.landingPageSchema) {
            localStorage.setItem(`tenant_schema_${updated.subdomain}`, JSON.stringify(updates.landingPageSchema));
          }
        } catch (e) {
          console.warn('localStorage tenant save error:', e);
        }

        // Persist to MySQL in the background
        try {
          const token = localStorage.getItem('ankabit_auth_token');
          fetch('/api/tenant', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              id: updated.id,
              currentSubdomain: prev.subdomain,
              subdomain: updated.subdomain,
              name: updated.name,
              tagline: updated.tagline,
              brandColor: updated.theme?.primaryColor || (updated as any).brandColor,
              settings: updated.settings || {},
              pricingPlans: updated.pricingPlans || [],
              paymentGateways: updated.paymentGateways || [],
            }),
          }).catch((err) => {
            console.warn('Background tenant DB sync warning:', err);
          });
        } catch (e) {}
      }

      return updated;
    });
  };

  const updateCourses = (newCourses: Course[]) => {
    setCourses(newCourses);
  };

  const updateCustomFormFields = (fields: FormFieldConfig[]) => {
    updateTenantConfig({ customFormFields: fields });
  };

  return (
    <TenantContext.Provider
      value={{
        tenant,
        courses,
        activeRole,
        direction,
        language,
        isLoading,
        setTenantBySubdomain,
        setActiveRole,
        setDirection,
        setLanguage,
        toggleLanguage,
        updateTenantConfig,
        updateCourses,
        updateCustomFormFields,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = (): TenantContextType => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
