export type Direction = 'ltr' | 'rtl';

export interface TenantTheme {
  primaryColor: string;
  primaryHover: string;
  secondaryColor: string;
  accentColor: string;
  sidebarBgColor?: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  borderRadius: string;
  fontFamily: string;
}

export type FieldType = 'text' | 'email' | 'phone' | 'select' | 'textarea' | 'date' | 'file';
export type FieldWidth = 'full' | 'half' | 'third';

export interface FormFieldConfig {
  id: string;
  label: string;
  labelAr: string;
  placeholder?: string;
  type: FieldType;
  required: boolean;
  options?: string[];
  width?: FieldWidth;
  order?: number;
}

export interface FormConfig {
  id: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  fields: FormFieldConfig[];
  isDefault?: boolean;
  submissionsCount?: number;
  createdAt?: string;
  status?: 'active' | 'draft';
}

export interface PageBlock {
  id: string;
  type: 'hero' | 'calligraphy' | 'features' | 'courses' | 'pricing' | 'form' | 'faq';
  title: string;
  titleAr: string;
  content: string;
  contentAr: string;
  style: {
    backgroundColor?: string;
    textColor?: string;
    paddingY?: string;
  };
}

export interface PricingPlan {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  priceMonthly: number;
  priceYearly: number;
  currency: string;
  features: string[];
  popular?: boolean;
}

export interface PaymentGatewayConfig {
  provider: 'stripe' | 'moyasar' | 'flutterwave' | 'paystack' | 'paypal' | 'bank_transfer';
  enabled: boolean;
  publishableKey?: string;
  secretKey?: string;
  webhookSecret?: string;
  merchantId?: string;
  bankDetails?: {
    bankName: string;
    accountName: string;
    iban: string;
    swiftCode: string;
  };
  liveMode: boolean;
}

export type TenantSubscriptionPlan = 'free' | 'qari' | 'growth' | 'enterprise';
export type TenantNiche = 'madrasat' | 'code_academy' | 'school' | 'quran' | 'coding' | 'general' | 'language';

export interface ClassroomParticipant {
  id: string;
  name: string;
  role: 'teacher' | 'student';
  avatar?: string;
  audioEnabled: boolean;
  videoEnabled: boolean;
  screenSharing: boolean;
  handRaised?: boolean;
}

export interface AuthPageCustomization {
  layout: 'split' | 'centered_glass' | 'minimal_card' | 'heritage_frame' | 'card' | 'minimal' | 'banner';
  welcomeHeading?: string;
  welcomeSubtitle?: string;
  backgroundImageUrl?: string;
  showCalligraphyQuote?: boolean;
  calligraphyText?: string;
  calligraphyTranslation?: string;
  customAuthFields?: FormFieldConfig[];
}

export interface TenantConfig {
  id: string;
  name: string;
  nameAr: string;
  tagline: string;
  taglineAr: string;
  subdomain: string;
  customDomain?: string;
  niche?: TenantNiche;
  logoUrl: string;
  faviconUrl: string;
  theme: TenantTheme;
  defaultDirection: Direction;
  heroBadgeText: string;
  heroBadgeTextAr: string;
  aboutText: string;
  aboutTextAr: string;
  contactEmail: string;
  contactPhone: string;
  admissionsOpen: boolean;
  pageBlocks: PageBlock[];
  customFormFields: FormFieldConfig[];
  formTitle?: string;
  formDescription?: string;
  forms?: FormConfig[];
  pricingPlans: PricingPlan[];
  paymentGateways: PaymentGatewayConfig[];
  customHtml?: string;
  customCss?: string;
  landingPageSchema?: any;
  subscriptionPlan?: TenantSubscriptionPlan;
  studentCapacity?: number;
  authCustomization?: AuthPageCustomization;
}

export interface Lesson {
  id: string;
  title: string;
  titleAr: string;
  durationMinutes: number;
  isCompleted?: boolean;
  completed?: boolean;
  audioUrl?: string;
  tajweedRule?: string;
}

export interface Module {
  id: string;
  title: string;
  titleAr: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  tenantId: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Ijazah Track';
  instructorName: string;
  instructorNameAr: string;
  durationWeeks: number;
  sessionsPerWeek: number;
  price: number;
  enrolledStudentsCount: number;
  imageUrl: string;
  modules?: Module[];
}

export type LeadStatus = 'New' | 'Under Review' | 'Interview' | 'Admitted' | 'Rejected';
export type PaymentStatus = 'Paid' | 'Pending' | 'Past Due' | 'Exempt';

export interface StudentInvoice {
  id: string;
  invoiceNumber?: string;
  planName: string;
  amount: number;
  currency: string;
  status: 'Paid' | 'Pending' | 'Past Due';
  dueDate?: string;
  issuedAt?: string;
  paidAt?: string;
  paymentDate?: string;
  gateway: 'stripe' | 'moyasar' | 'bank_transfer';
  transactionId?: string;
  receiptUrl?: string;
}

export interface Lead {
  id: string;
  tenantId?: string;
  name?: string;
  studentName: string;
  email: string;
  phone: string;
  country: string;
  courseInterest: string;
  preferredSchedule: string;
  priorHifzLevel?: string;
  arabicLevel?: string;
  status: LeadStatus;
  paymentStatus: PaymentStatus;
  assignedTeacherId?: string;
  assessmentScore?: number;
  selectedPlanId?: string;
  selectedPlanName?: string;
  planName?: string;
  planPrice?: number;
  billingCycle?: 'mo' | 'yr';
  tuitionAmount?: number;
  paymentGateway?: 'stripe' | 'moyasar' | 'bank_transfer';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  timeline?: {
    date: string;
    action: string;
    actor: string;
  }[];
  invoices?: StudentInvoice[];
}

export interface TajweedToken {
  text: string;
  rule?: 'ghunnah' | 'qalqalah' | 'madd' | 'ikhfa' | 'idgham' | 'normal';
}

export interface Ayah {
  number: number;
  numberInSurah?: number;
  surahNumber?: number;
  surahName?: string;
  text?: string;
  textUthmani?: string;
  translationEn: string;
  audioUrl: string;
  juz?: number;
  page?: number;
  tajweedTokens?: TajweedToken[];
}

export interface Surah {
  number: number;
  name?: string;
  nameAr: string;
  nameEn?: string;
  englishTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
  ayahs: Ayah[];
}

export interface RecitationSubmission {
  id: string;
  studentId?: string;
  studentName?: string;
  surahNumber?: number;
  surahName: string;
  ayahStart?: number;
  ayahEnd?: number;
  ayahRange?: string;
  audioUrl: string;
  durationSeconds?: number;
  submittedAt?: string;
  recordedAt?: string;
  status: 'Approved' | 'Pending' | 'Graded' | 'Needs Revision' | string;
  teacherFeedback?: string | {
    teacherName?: string;
    grade?: string;
    score?: number;
    tajweedMistakes?: string[];
    audioFeedbackUrl?: string;
    comments?: string;
    gradedAt?: string;
  };
}
