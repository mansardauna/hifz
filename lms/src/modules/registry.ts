import { TenantNiche } from '../types';

export type LmsEngineType = 'quran' | 'school' | 'coding';

export interface LmsNavTabConfig {
  id: string;
  label: string;
  labelAr: string;
  iconName: string;
  isCommon: boolean; // True for Whiteboard, Video Call, Classroom, Forum, Tuition, Profile
}

export interface LmsModuleDescriptor {
  engineType: LmsEngineType;
  displayName: string;
  displayNameAr: string;
  tagline: string;
  defaultTab: string;
  primaryNicheColor: string;
  tabs: LmsNavTabConfig[];
}

export function detectLmsEngineType(niche?: TenantNiche, subdomain: string = ''): LmsEngineType {
  const sub = (subdomain || '').toLowerCase();
  if (niche === 'coding' || niche === 'code_academy' || sub.includes('code') || sub.includes('dev')) {
    return 'coding';
  }
  if (
    niche === 'madrasat' ||
    niche === 'quran' ||
    sub.includes('hifz') ||
    sub.includes('quran') ||
    sub.includes('madrasa')
  ) {
    return 'quran';
  }
  // Default for school, vocational, general, poultry, language, business, etc. is 'school' (Curriculum & Assessments)
  return 'school';
}

export const LMS_MODULE_REGISTRY: Record<LmsEngineType, LmsModuleDescriptor> = {
  quran: {
    engineType: 'quran',
    displayName: 'Quran & Islamic Studies',
    displayNameAr: 'المدرسة القرآنية',
    tagline: 'Quran Recitation, Tajweed & Hifz Tracking',
    defaultTab: 'quran',
    primaryNicheColor: '#059669', // Emerald
    tabs: [
      { id: 'quran', label: 'Quran Reader', labelAr: 'المصحف الشريف', iconName: 'BookOpen', isCommon: false },
      { id: 'audio', label: 'Reciter Looper', labelAr: 'التكرار الصوتي', iconName: 'Volume2', isCommon: false },
      { id: 'progress', label: 'Hifz Tracker', labelAr: 'متابعة الحفظ', iconName: 'Award', isCommon: false },
      { id: 'classroom', label: 'Live Halaqah', labelAr: 'الحلقة المباشرة', iconName: 'Radio', isCommon: true },
      { id: 'forum', label: 'Community Forum', labelAr: 'المنتدى التعليمي', iconName: 'MessageSquare', isCommon: true },
      { id: 'tuition', label: 'Tuition & Invoices', labelAr: 'الرسوم والفواتير', iconName: 'CreditCard', isCommon: true },
      { id: 'profile', label: 'Profile', labelAr: 'الملف الشخصي', iconName: 'User', isCommon: true }
    ]
  },
  school: {
    engineType: 'school',
    displayName: 'School & Vocational Academy',
    displayNameAr: 'المدرسة الأكاديمية والمهنية',
    tagline: 'Curriculum, Workshops & Assessments',
    defaultTab: 'courses',
    primaryNicheColor: '#2563eb', // Royal Blue
    tabs: [
      { id: 'courses', label: 'Curriculum', labelAr: 'المقررات الدراسية', iconName: 'GraduationCap', isCommon: false },
      { id: 'assessments', label: 'Assessments', labelAr: 'الاختبارات والتطبيقات', iconName: 'FileCheck2', isCommon: false },
      { id: 'classroom', label: 'Live Classroom', labelAr: 'الفصل المباشر', iconName: 'Radio', isCommon: true },
      { id: 'forum', label: 'Community Forum', labelAr: 'المنتدى الطلابي', iconName: 'MessageSquare', isCommon: true },
      { id: 'tuition', label: 'Tuition & Fees', labelAr: 'المصروفات والرسوم', iconName: 'CreditCard', isCommon: true },
      { id: 'profile', label: 'Profile', labelAr: 'الملف الشخصي', iconName: 'User', isCommon: true }
    ]
  },
  coding: {
    engineType: 'coding',
    displayName: 'Software & Tech Academy',
    displayNameAr: 'أكاديمية البرمجة والتقنية',
    tagline: 'Interactive Code Challenges & Web IDE',
    defaultTab: 'coding',
    primaryNicheColor: '#10b981', // Mint/Emerald
    tabs: [
      { id: 'coding', label: 'Code Labs', labelAr: 'المختبر البرمجي', iconName: 'Code2', isCommon: false },
      { id: 'classroom', label: 'Live Classroom', labelAr: 'غرفة البرمجة المباشرة', iconName: 'Radio', isCommon: true },
      { id: 'forum', label: 'Developer Forum', labelAr: 'منتدى المطورين', iconName: 'MessageSquare', isCommon: true },
      { id: 'tuition', label: 'Tuition', labelAr: 'رسوم المعسكر', iconName: 'CreditCard', isCommon: true },
      { id: 'profile', label: 'Profile', labelAr: 'الملف الشخصي', iconName: 'User', isCommon: true }
    ]
  }
};
