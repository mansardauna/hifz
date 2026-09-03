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

  const injectCssVariables = (config: TenantConfig) => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', config.theme.primaryColor);
    root.style.setProperty('--color-primary-hover', config.theme.primaryHover);
    root.style.setProperty('--color-secondary', config.theme.secondaryColor);
    root.style.setProperty('--color-accent', config.theme.accentColor);
    root.style.setProperty('--color-bg', config.theme.backgroundColor);
    root.style.setProperty('--color-surface', config.theme.surfaceColor);
    root.style.setProperty('--color-text', config.theme.textColor);
    root.style.setProperty('--tenant-radius', config.theme.borderRadius);

    document.title = `${config.name} | Hifz Quranic LMS`;
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
