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
  if (niche === 'coding' || niche === 'code_academy' || subdomain.includes('code')) {
    return 'coding';
  }
  if (
    niche === 'school' ||
    subdomain.includes('school') ||
    subdomain.includes('oxford') ||
    subdomain.includes('horizon')
  ) {
    return 'school';
  }
  return 'quran';
}

export const LMS_MODULE_REGISTRY: Record<LmsEngineType, LmsModuleDescriptor> = {
  quran: {
    engineType: 'quran',
    displayName: 'Quran & Islamic Madrasat LMS',
    displayNameAr: 'منظومة المدرسة القرآنية وحفظ المتون',
    tagline: 'Uthmani Recitation, Tajweed Rules & Hifz Progress Mastery',
    defaultTab: 'quran',
    primaryNicheColor: '#059669', // Emerald
    tabs: [
      // Domain Peculiar
      { id: 'quran', label: 'Quran Reader', labelAr: 'المصحف الشريف', iconName: 'BookOpen', isCommon: false },
      { id: 'audio', label: 'Reciter Looper', labelAr: 'التكرار الصوتي', iconName: 'Volume2', isCommon: false },
      { id: 'progress', label: 'Hifz Tracker', labelAr: 'متابعة الحفظ', iconName: 'Award', isCommon: false },
      // Common Universal
      { id: 'classroom', label: 'Live Virtual Halaqah', labelAr: 'الحلقة المباشرة', iconName: 'Radio', isCommon: true },
      { id: 'forum', label: 'Discussion Forum', labelAr: 'المنتدى التعليمي', iconName: 'MessageSquare', isCommon: true },
      { id: 'tuition', label: 'Tuition & Invoices', labelAr: 'الرسوم والفواتير', iconName: 'CreditCard', isCommon: true },
      { id: 'profile', label: 'Profile & Settings', labelAr: 'الملف الشخصي', iconName: 'User', isCommon: true }
    ]
  },
  school: {
    engineType: 'school',
    displayName: 'School & Vocational Training LMS',
    displayNameAr: 'منظومة المدارس والمعاهد المهنية الشاملة',
    tagline: 'Practical Syllabus, Workshop Guides, Quizzes & Vocational Assessments',
    defaultTab: 'courses',
    primaryNicheColor: '#2563eb', // Royal Blue
    tabs: [
      // Domain Peculiar
      { id: 'courses', label: 'Syllabus & Workshop Guides', labelAr: 'المقررات والورش العملية', iconName: 'GraduationCap', isCommon: false },
      { id: 'assessments', label: 'Exams & Practical Submissions', labelAr: 'الاختبارات والمشاريع التطبيقية', iconName: 'FileCheck2', isCommon: false },
      // Common Universal
      { id: 'classroom', label: 'Live Virtual Workshop', labelAr: 'الورشة والصف المباشر', iconName: 'Radio', isCommon: true },
      { id: 'forum', label: 'Student & Craft Forum', labelAr: 'منتدى الطلاب والمهن', iconName: 'MessageSquare', isCommon: true },
      { id: 'tuition', label: 'Tuition & Fees', labelAr: 'المصروفات والرسوم', iconName: 'CreditCard', isCommon: true },
      { id: 'profile', label: 'Profile & Settings', labelAr: 'الملف الشخصي', iconName: 'User', isCommon: true }
    ]
  },
  coding: {
    engineType: 'coding',
    displayName: 'Coding & Tech Academy LMS',
    displayNameAr: 'أكاديمية البرمجة والتقنيات التفاعلية',
    tagline: 'FreeCodeCamp Style Challenges, Automated Test Suites & Live IDE',
    defaultTab: 'coding',
    primaryNicheColor: '#10b981', // Mint/Emerald
    tabs: [
      // Domain Peculiar
      { id: 'coding', label: 'Interactive Challenges (FCC Style)', labelAr: 'التحديات البرمجية والاختبارات', iconName: 'Code2', isCommon: false },
      // Common Universal
      { id: 'classroom', label: 'Live Pair Programming', labelAr: 'غرفة البرمجة المباشرة', iconName: 'Radio', isCommon: true },
      { id: 'forum', label: 'Developer Forum', labelAr: 'منتدى المطورين', iconName: 'MessageSquare', isCommon: true },
      { id: 'tuition', label: 'Bootcamp Tuition', labelAr: 'رسوم المعسكر', iconName: 'CreditCard', isCommon: true },
      { id: 'profile', label: 'Profile & Settings', labelAr: 'الملف الشخصي', iconName: 'User', isCommon: true }
    ]
  }
};
