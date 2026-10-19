import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppLanguage, TextDirection, SUPPORTED_LANGUAGES, LanguageOption } from './types';
import { en, TranslationDictionary } from './locales/en';
import { ar } from './locales/ar';
import { fr } from './locales/fr';
import { ur } from './locales/ur';

const DICTIONARIES: Record<AppLanguage, TranslationDictionary> = {
  en,
  ar,
  fr,
  ur,
};

interface I18nContextType {
  language: AppLanguage;
  direction: TextDirection;
  isRtl: boolean;
  setLanguage: (lang: AppLanguage) => void;
  toggleLanguage: () => void;
  t: (keyPath: string, params?: Record<string, string | number>) => string;
  supportedLanguages: LanguageOption[];
  currentLanguageOption: LanguageOption;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const STORAGE_KEY = 'ankabit_app_language';

export const I18nProvider: React.FC<{ children: React.ReactNode; initialLanguage?: AppLanguage }> = ({
  children,
  initialLanguage = 'en',
}) => {
  const [language, setLanguageState] = useState<AppLanguage>(initialLanguage);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as AppLanguage | null;
      if (saved && (saved === 'en' || saved === 'ar' || saved === 'fr' || saved === 'ur')) {
        setLanguageState(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const currentOption = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];
  const direction: TextDirection = currentOption.direction;
  const isRtl = direction === 'rtl';

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = direction;
      document.documentElement.lang = language;
      if (isRtl) {
        document.documentElement.classList.add('rtl-layout');
      } else {
        document.documentElement.classList.remove('rtl-layout');
      }
    }
  }, [language, direction, isRtl]);

  const setLanguage = useCallback((lang: AppLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    const nextLang: AppLanguage = language === 'en' ? 'ar' : 'en';
    setLanguage(nextLang);
  }, [language, setLanguage]);

  const t = useCallback(
    (keyPath: string, params?: Record<string, string | number>): string => {
      const keys = keyPath.split('.');
      const dict = DICTIONARIES[language] || en;
      
      let val: any = dict;
      for (const k of keys) {
        if (val && typeof val === 'object' && k in val) {
          val = val[k];
        } else {
          val = undefined;
          break;
        }
      }

      // Fallback to English if key is missing in active locale
      if (val === undefined || typeof val !== 'string') {
        let fallbackVal: any = en;
        for (const k of keys) {
          if (fallbackVal && typeof fallbackVal === 'object' && k in fallbackVal) {
            fallbackVal = fallbackVal[k];
          } else {
            fallbackVal = undefined;
            break;
          }
        }
        val = typeof fallbackVal === 'string' ? fallbackVal : keyPath;
      }

      if (params && typeof val === 'string') {
        return Object.entries(params).reduce((str, [paramKey, paramVal]) => {
          return str.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramVal));
        }, val);
      }

      return val;
    },
    [language]
  );

  return (
    <I18nContext.Provider
      value={{
        language,
        direction,
        isRtl,
        setLanguage,
        toggleLanguage,
        t,
        supportedLanguages: SUPPORTED_LANGUAGES,
        currentLanguageOption: currentOption,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    // Graceful fallback for non-wrapped components
    return {
      language: 'en',
      direction: 'ltr',
      isRtl: false,
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: (k: string) => k,
      supportedLanguages: SUPPORTED_LANGUAGES,
      currentLanguageOption: SUPPORTED_LANGUAGES[0],
    };
  }
  return context;
};
