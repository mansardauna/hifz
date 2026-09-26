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
    displayName: 'School & Academic K-12/Higher Ed LMS',
    displayNameAr: 'المنظومة الأكاديمية والمدرسية الشاملة',
    tagline: 'Curriculum Syllabus, Homework, Timetable & Gradebook',
    defaultTab: 'courses',
    primaryNicheColor: '#2563eb', // Royal Blue
    tabs: [
      // Domain Peculiar
      { id: 'courses', label: 'Courses & Syllabus', labelAr: 'المقررات الدراسية', iconName: 'GraduationCap', isCommon: false },
      { id: 'assignments', label: 'Assignments & Tasks', labelAr: 'الواجبات والتكليفات', iconName: 'FileCheck2', isCommon: false },
      { id: 'grades', label: 'Report Cards & GPA', labelAr: 'كشف الدرجات', iconName: 'Award', isCommon: false },
      { id: 'schedule', label: 'Class Timetable', labelAr: 'الجدول الدراسي', iconName: 'Calendar', isCommon: false },
      // Common Universal
      { id: 'classroom', label: 'Live Virtual Lecture', labelAr: 'المحاضرة المباشرة', iconName: 'Radio', isCommon: true },
      { id: 'forum', label: 'Campus Forum', labelAr: 'منتدى الطلاب', iconName: 'MessageSquare', isCommon: true },
      { id: 'tuition', label: 'Tuition & Fees', labelAr: 'المصروفات المدرسية', iconName: 'CreditCard', isCommon: true },
      { id: 'profile', label: 'Profile & Settings', labelAr: 'الملف الشخصي', iconName: 'User', isCommon: true }
    ]
  },
  coding: {
    engineType: 'coding',
    displayName: 'Coding & Tech Academy LMS',
    displayNameAr: 'أكاديمية البرمجة والتقنيات السحابية',
    tagline: 'Interactive Monaco Editor, Live Runner & Algorithmic Challenges',
    defaultTab: 'coding',
    primaryNicheColor: '#10b981', // Mint/Emerald
    tabs: [
      // Domain Peculiar
      { id: 'coding', label: 'Cloud IDE Sandbox', labelAr: 'بيئة التطوير السحابية', iconName: 'Code2', isCommon: false },
      // Common Universal
      { id: 'classroom', label: 'Live Pair Programming', labelAr: 'غرفة البرمجة المباشرة', iconName: 'Radio', isCommon: true },
      { id: 'forum', label: 'Developer Forum', labelAr: 'منتدى المطورين', iconName: 'MessageSquare', isCommon: true },
      { id: 'tuition', label: 'Bootcamp Tuition', labelAr: 'رسوم المعسكر', iconName: 'CreditCard', isCommon: true },
      { id: 'profile', label: 'Profile & Settings', labelAr: 'الملف الشخصي', iconName: 'User', isCommon: true }
    ]
  }
};
