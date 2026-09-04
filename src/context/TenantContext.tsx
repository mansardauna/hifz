import React, { createContext, useContext, useState, useEffect } from 'react';
import { TenantConfig, Direction, Course, FormFieldConfig } from '../types';
import { MOCK_TENANTS, MOCK_COURSES } from '../services/mockData';
import { api } from '../services/api';

export type AppRole = 'saas_home' | 'landing' | 'admin' | 'student' | 'signin' | 'signup' | 'create_academy' | 'forgot-password';
export type AppLanguage = 'en' | 'ar';

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

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSubdomain, setCurrentSubdomain] = useState<string>('al-furqan');
  const [tenant, setTenant] = useState<TenantConfig>(MOCK_TENANTS['al-furqan']);
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [activeRole, setActiveRole] = useState<AppRole>('saas_home');
  const [direction, setDirection] = useState<Direction>('ltr');
  const [language, setLanguage] = useState<AppLanguage>('en');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Auto-detect subdomain from window.location in real multi-tenant deployment
  useEffect(() => {
    const host = window.location.hostname;
    const parts = host.split('.');
    if (parts.length > 2 && parts[0] !== 'www' && !host.endsWith('.vercel.app')) {
      const detectedSubdomain = parts[0];
      if (MOCK_TENANTS[detectedSubdomain]) {
        setCurrentSubdomain(detectedSubdomain);
        setActiveRole('landing');
      }
    }
  }, []);

  // Fetch tenant config, merge persistent localStorage overrides, and inject dynamic CSS variables
  useEffect(() => {
    setIsLoading(true);
    api.getTenantConfig(currentSubdomain).then((baseConfig) => {
      let mergedConfig = baseConfig;
      if (typeof window !== 'undefined') {
        try {
          const cachedJson = localStorage.getItem(`tenant_config_${currentSubdomain}`);
          const cachedHtml = localStorage.getItem(`tenant_customHtml_${currentSubdomain}`);
          const cachedCss = localStorage.getItem(`tenant_customCss_${currentSubdomain}`);
          const cachedSchema = localStorage.getItem(`tenant_schema_${currentSubdomain}`);

          if (cachedJson) {
            const parsed = JSON.parse(cachedJson);
            mergedConfig = { ...mergedConfig, ...parsed };
          }
          if (cachedHtml) {
            mergedConfig.customHtml = cachedHtml;
          }
          if (cachedCss) {
            mergedConfig.customCss = cachedCss;
          }
          if (cachedSchema) {
            try {
              mergedConfig.landingPageSchema = JSON.parse(cachedSchema);
            } catch (e) {}
          }
        } catch (e) {
          console.warn('localStorage tenant load error:', e);
        }
      }

      setTenant(mergedConfig);
      if (activeRole === 'landing') {
        setDirection(mergedConfig.defaultDirection);
        setLanguage(mergedConfig.defaultDirection === 'rtl' ? 'ar' : 'en');
      }
      injectCssVariables(mergedConfig);
      setIsLoading(false);
    });
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

    document.title = `${config.name} • Ankabit LMS`;

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

  const setTenantBySubdomain = (subdomain: string) => {
    const base = MOCK_TENANTS[subdomain] || MOCK_TENANTS['al-furqan'];
    let merged = base;
    if (typeof window !== 'undefined') {
      try {
        const cachedJson = localStorage.getItem(`tenant_config_${subdomain}`);
        const cachedHtml = localStorage.getItem(`tenant_customHtml_${subdomain}`);
        if (cachedJson) merged = { ...merged, ...JSON.parse(cachedJson) };
        if (cachedHtml) merged.customHtml = cachedHtml;
      } catch (e) {}
    }
    setCurrentSubdomain(subdomain);
    setTenant(merged);
    injectCssVariables(merged);
    setActiveRole('landing');
  };

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'ar' : 'en';
    const nextDir = nextLang === 'ar' ? 'rtl' : 'ltr';
    setLanguage(nextLang);
    setDirection(nextDir);
  };

  const updateTenantConfig = (updates: Partial<TenantConfig>) => {
    setTenant((prev) => {
      const updated = { ...prev, ...updates };
      if (updates.theme) injectCssVariables(updated);

      // Persist to localStorage immediately
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(`tenant_config_${updated.subdomain}`, JSON.stringify(updated));
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
      }

      // Persist to backend API asynchronously
      fetch('/api/tenant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subdomain: updated.subdomain,
          name: updated.name,
          customHtml: updated.customHtml,
          customCss: updated.customCss,
          settings: {
            landingPageSchema: updated.landingPageSchema,
            forms: updated.forms,
            customFormFields: updated.customFormFields,
            pricingPlans: updated.pricingPlans,
          },
        }),
      }).catch((err) => console.warn('Backend tenant sync notice:', err));

      return updated;
    });
  };

  const updateCourses = (newCourses: Course[]) => {
    setCourses(newCourses);
  };

  const updateCustomFormFields = (fields: FormFieldConfig[]) => {
    setTenant((prev) => ({ ...prev, customFormFields: fields }));
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
