import { TenantConfig, Course, Lead, Surah, RecitationSubmission } from '../types';

export const MOCK_TENANTS: Record<string, TenantConfig> = {
  'al-furqan': {
    id: 'tenant-1',
    name: 'Al-Furqan Quran Academy',
    nameAr: 'أكاديمية الفرقان للقرآن الكريم',
    tagline: 'Preserving Sacred Quranic Knowledge through Authentic Memorization & Tajweed',
    taglineAr: 'حفظ كتاب الله بالسند المتصل وتعلّم أحكام التجويد الميسرة',
    subdomain: 'al-furqan',
    logoUrl: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=150&q=80',
    faviconUrl: '📖',
    theme: {
      primaryColor: '#0d9488',
      primaryHover: '#0f766e',
      secondaryColor: '#d97706',
      accentColor: '#0284c7',
      backgroundColor: '#f8fafc',
      surfaceColor: '#ffffff',
      textColor: '#0f172a',
      borderRadius: '0.125rem',
      fontFamily: 'Poppins',
    },
    defaultDirection: 'rtl',
    heroBadgeText: 'Spring 2026 Admissions Open for Hifz & Tajweed Program',
    heroBadgeTextAr: 'باب التسجيل مفتوح لبرنامج الحفظ والتجويد لعام ٢٠٢٦',
    aboutText: 'Al-Furqan Quran Academy is dedicated to providing high-quality Quranic education to students of all ages across the globe with certified Sanad teachers.',
    aboutTextAr: 'تسعى أكاديمية الفرقان لتقديم تعليم قرآني متميز على يد نخبة من المعلمين والمعلمات المجازين بالسند المتصل إلى رسول الله صلى الله عليه وسلم.',
    contactEmail: 'admissions@alfurqan-academy.com',
    contactPhone: '+966 50 123 4567',
    admissionsOpen: true,
    pageBlocks: [
      {
        id: 'blk-1',
        type: 'hero',
        title: 'Preserving Sacred Quranic Knowledge',
        titleAr: 'حفظ كتاب الله بالسند المتصل وتعلّم أحكام التجويد',
        content: 'Join certified Qaris for individual oral recitation, Tajweed correction, and complete Quran memorization.',
        contentAr: 'انضم إلى نخبة المعلمين المجازين في جلسات فردية لتصحيح التلاوة وتطبيق أحكام التجويد وحفظ القرآن الكريم.',
        style: { backgroundColor: '#ffffff', textColor: '#0f172a', paddingY: 'py-16' }
      },
      {
        id: 'blk-2',
        type: 'calligraphy',
        title: 'Verily, We Have Sent Down The Quran & We Will Guard It',
        titleAr: 'إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ',
        content: 'Surah Al-Hijr [15:9]',
        contentAr: 'سورة الحجر - آية ٩',
        style: { backgroundColor: '#f8fafc', textColor: '#0f172a', paddingY: 'py-12' }
      },
      {
        id: 'blk-3',
        type: 'courses',
        title: 'Featured Quranic Curriculums',
        titleAr: 'المناهج والدورات القرآنية المتاحة',
        content: 'Select from beginner foundational tracks to 10 Qira\'at specialization.',
        contentAr: 'اختر المنهج المناسب لمستواك من التأسيس وحتى الاتقان.',
        style: { backgroundColor: '#ffffff', textColor: '#0f172a', paddingY: 'py-16' }
      },
      {
        id: 'blk-4',
        type: 'pricing',
        title: 'Tuition & Subscription Plans',
        titleAr: 'الخطط الدراسية ورسوم الاشتراك',
        content: 'Flexible monthly or annual plans with certified 1-on-1 tutoring.',
        contentAr: 'خطط اشتراك مرنة وميسرة تشمل حصص التسميع والمتابعة الفردية.',
        style: { backgroundColor: '#f8fafc', textColor: '#0f172a', paddingY: 'py-16' }
      },
      {
        id: 'blk-5',
        type: 'form',
        title: 'Direct Admissions Application',
        titleAr: 'نموذج الالتحاق المباشر',
        content: 'Fill out your student details below for immediate review by our admissions committee.',
        contentAr: 'قم بتعبئة البيانات أدناه وسيتواصل معك فريق القبول لترتيب اختبار التحديد.',
        style: { backgroundColor: '#ffffff', textColor: '#0f172a', paddingY: 'py-16' }
      }
    ],
    customFormFields: [
      { id: 'parentName', label: 'Parent / Guardian Name', labelAr: 'اسم ولي الأمر', type: 'text', required: false, placeholder: 'e.g. Ahmad Al-Mansoor', width: 'half', order: 1 },
      { id: 'memorizedJuz', label: 'Current Juz Memorized (0-30)', labelAr: 'عدد الأجزاء المحفوظة', type: 'select', required: true, options: ['0 (Beginner)', '1 - 5 Juz', '6 - 15 Juz', '16 - 29 Juz', 'Complete Quran (30 Juz)'], width: 'half', order: 2 },
      { id: 'preferredTime', label: 'Preferred Class Timing', labelAr: 'الوقت المفضل للحصص', type: 'select', required: true, options: ['Morning (Fajr-Zuhr)', 'Afternoon (Asr-Maghrib)', 'Evening (Isha-Night)'], width: 'full', order: 3 }
    ],
    formTitle: 'Direct Admissions & Evaluation Inquiry',
    formDescription: 'Fill out your prospective student details below for immediate review by our admissions committee.',
    forms: [
      {
        id: 'form-admissions',
        title: 'Direct Admissions & Evaluation Inquiry',
        titleAr: 'نموذج القبول وتقييم المستوى',
        description: 'Fill out your prospective student details below for immediate review by our admissions committee.',
        isDefault: true,
        status: 'active',
        submissionsCount: 48,
        createdAt: '2026-08-01',
        fields: [
          { id: 'parentName', label: 'Parent / Guardian Name', labelAr: 'اسم ولي الأمر', type: 'text', required: false, placeholder: 'e.g. Ahmad Al-Mansoor', width: 'half', order: 1 },
          { id: 'memorizedJuz', label: 'Current Juz Memorized (0-30)', labelAr: 'عدد الأجزاء المحفوظة', type: 'select', required: true, options: ['0 (Beginner)', '1 - 5 Juz', '6 - 15 Juz', '16 - 29 Juz', 'Complete Quran (30 Juz)'], width: 'half', order: 2 },
          { id: 'preferredTime', label: 'Preferred Class Timing', labelAr: 'الوقت المفضل للحصص', type: 'select', required: true, options: ['Morning (Fajr-Zuhr)', 'Afternoon (Asr-Maghrib)', 'Evening (Isha-Night)'], width: 'full', order: 3 }
        ]
      },
      {
        id: 'form-ijazah',
        title: 'Sanad Ijazah & Khatmah Application',
        titleAr: 'طلب الالتحاق بمسار الإسناد والإجازة',
        description: 'Application for students seeking unbroken Sanad chains and complete oral recitation verification.',
        isDefault: false,
        status: 'active',
        submissionsCount: 14,
        createdAt: '2026-08-10',
        fields: [
          { id: 'priorCertification', label: 'Prior Tajweed Certifications (e.g. Tuhfat al-Atfal, Jazariyyah)', labelAr: 'المتون المحفوظة (تحفة الأطفال، الجزرية)', type: 'text', required: true, placeholder: 'List certified texts...', width: 'full', order: 1 },
          { id: 'qiraahPreference', label: 'Target Qira\'ah Track', labelAr: 'الرواية المطلوبة', type: 'select', required: true, options: ['Hafs \'an \'Asim (حفص عن عاصم)', 'Warsh \'an Nafi\' (ورش عن نافع)', 'Qalun \'an Nafi\' (قالون عن نافع)', 'Shu\'bah \'an \'Asim (شعبة عن عاصم)'], width: 'half', order: 2 },
          { id: 'weeklyAvailability', label: 'Hours Dedicated Weekly for Muraja\'ah', labelAr: 'ساعات المراجعة الأسبوعية', type: 'select', required: true, options: ['5 - 10 hours', '10 - 20 hours', '20+ hours (Intensive)'], width: 'half', order: 3 }
        ]
      },
      {
        id: 'form-summer-camp',
        title: 'Summer Intensive Hifz Camp Registration',
        titleAr: 'التسجيل في المخيم الصيفي المكثف',
        description: '6-week accelerated Quran memorization and Arabic immersion camp for youth and children.',
        isDefault: false,
        status: 'active',
        submissionsCount: 32,
        createdAt: '2026-08-15',
        fields: [
          { id: 'childAge', label: 'Student Age (6 - 17 years)', labelAr: 'عمر الطالب', type: 'select', required: true, options: ['6 - 9 Years', '10 - 13 Years', '14 - 17 Years'], width: 'half', order: 1 },
          { id: 'targetJuzCount', label: 'Summer Memorization Goal', labelAr: 'الهدف الصيفي', type: 'select', required: true, options: ['1 New Juz + Revision', '2 New Juz', '3 New Juz (Accelerated Track)'], width: 'half', order: 2 },
          { id: 'emergencyContact', label: 'Emergency Phone Number', labelAr: 'رقم هاتف الطوارئ', type: 'phone', required: true, placeholder: '+966 55 000 0000', width: 'full', order: 3 }
        ]
      }
    ],
    subscriptionPlan: 'growth',
    studentCapacity: 350,
    pricingPlans: [
      {
        id: 'plan-tajweed',
        name: 'Foundational Tajweed Track',
        nameAr: 'مسار التجويد والتأسيس',
        description: '2 sessions per week of oral recitation correction & Makharij rules',
        descriptionAr: 'حصتان أسبوعياً لتصحيح المخارج وأحكام التجويد النظرية والعملية',
        priceMonthly: 65,
        priceYearly: 650,
        currency: 'USD',
        features: [
          '2 Live 1-on-1 Sessions Weekly',
          'Daily Recitation Homework Grading',
          'Tuhfat al-Atfal Certificate',
          'Student Quran Viewer Access'
        ]
      },
      {
        id: 'plan-hifz',
        name: 'Intensive Hifz Program',
        nameAr: 'برنامج الحفظ المكثف',
        description: '4 sessions per week with dedicated Sanad Qari for systematic memorization',
        descriptionAr: 'أربع حصص أسبوعياً للحفظ المنهجي والمراجعة وضبط المتشابهات',
        priceMonthly: 140,
        priceYearly: 1400,
        currency: 'USD',
        popular: true,
        features: [
          '4 Live 1-on-1 Sessions Weekly',
          'Personalized Muraja\'ah Checklist',
          'Unlimited Audio Homework Feedback',
          'Official Academy Ijazah Preparation',
          'Parent Progress Dashboard'
        ]
      },
      {
        id: 'plan-ijazah',
        name: 'Qira\'at & Ijazah Specialization',
        nameAr: 'دبلوم الإجازة والقراءات العشر',
        description: 'Daily recitation directly connected to chain of transmission (Sanad)',
        descriptionAr: 'ختمة كاملة غيباً بالإسناد المتصل إلى رسول الله صلى الله عليه وسلم',
        priceMonthly: 240,
        priceYearly: 2400,
        currency: 'USD',
        features: [
          'Daily 1-on-1 Sanad Sessions',
          'Complete Quran Khatmah Review',
          'Written & Oral Ijazah Verification',
          'Priority 24/7 Teacher Support'
        ]
      }
    ],
    paymentGateways: [
      {
        provider: 'stripe',
        enabled: true,
        publishableKey: 'pk_live_51M4xxxAlFurqanKey',
        liveMode: true
      },
      {
        provider: 'moyasar',
        enabled: true,
        publishableKey: 'pk_live_moyasar_alfurqan',
        liveMode: true
      },
      {
        provider: 'bank_transfer',
        enabled: true,
        bankDetails: {
          bankName: 'Al Rajhi Bank (مصرف الراجحي)',
          accountName: 'Al-Furqan Quran Academy LLC',
          iban: 'SA4480000123456789012345',
          swiftCode: 'RJHISARI'
        },
        liveMode: true
      }
    ]
  },
  'bayyinah-arabic': {
    id: 'tenant-2',
    name: 'Bayyinah Classical Arabic Institute',
    nameAr: 'معهد البينة للغة العربية والعلوم الشرعية',
    tagline: 'Unlock the Beauty of the Quranic Language from Classical Grammar to Eloquence',
    taglineAr: 'فهم لغة القرآن الكريم من البلاغة إلى النحو والصرف',
    subdomain: 'bayyinah-arabic',
    logoUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=150&q=80',
    faviconUrl: '✒️',
    theme: {
      primaryColor: '#059669',
      primaryHover: '#047857',
      secondaryColor: '#ca8a04',
      accentColor: '#4f46e5',
      backgroundColor: '#f8fafc',
      surfaceColor: '#ffffff',
      textColor: '#064e3b',
      borderRadius: '0.125rem',
      fontFamily: 'Poppins',
    },
    defaultDirection: 'ltr',
    heroBadgeText: 'Classical Arabic Grammar & Quranic Vocabulary Certification',
    heroBadgeTextAr: 'دبلوم النحو العربي ولغة القرآن الكريم',
    aboutText: 'Bayyinah Institute empowers students worldwide to understand the Quran directly in its original Arabic syntax and eloquence without reliance on translation.',
    aboutTextAr: 'يهدف معهد البينة إلى تمكين الطلاب من فهم القرآن الكريم بلغته الأصلية وتذوق بلاغته وإعجازه.',
    contactEmail: 'info@bayyinah-institute.edu',
    contactPhone: '+1 (800) 555-0199',
    admissionsOpen: true,
    pageBlocks: [],
    customFormFields: [
      { id: 'priorArabic', label: 'Prior Arabic Background', labelAr: 'المستوى السابق في اللغة العربية', type: 'select', required: true, options: ['No prior knowledge', 'Can read script', 'Studied Al-Ajrumiyyah', 'Advanced Classical'] }
    ],
    pricingPlans: [
      {
        id: 'plan-arabic-core',
        name: 'Classical Grammar Track',
        nameAr: 'مسار النحو التطبيقي',
        description: 'Syntax & morphology applied directly to short surahs',
        descriptionAr: 'شرح وتطبيق قواعد الآجرومية في إعراب سور القرآن الكريم',
        priceMonthly: 85,
        priceYearly: 850,
        currency: 'USD',
        features: ['Weekly Recorded & Live Classes', 'Grammar Exercise Worksheets', 'Live TA Office Hours']
      }
    ],
    paymentGateways: [
      {
        provider: 'stripe',
        enabled: true,
        publishableKey: 'pk_live_bayyinah_stripe',
        liveMode: true
      }
    ]
  }
};

export const MOCK_COURSES: Course[] = [
  {
    id: 'course-1',
    tenantId: 'tenant-1',
    title: 'Foundations of Tajweed & Recitation (Tuhfat al-Atfal)',
    titleAr: 'تيسير التجويد شرح تحفة الأطفال',
    description: 'Learn fundamental Tajweed rules including Nun Sakinah, Tanween, Meem Sakinah, and Madd elongation with live oral correction.',
    descriptionAr: 'دورة متكاملة لدراسة أحكام أحكام النون الساكنة والتنوين والميم الساكنة والمدود مع التدريب العملي.',
    level: 'Beginner',
    instructorName: 'Shaykh Ahmad Al-Mansoor',
    instructorNameAr: 'الشيخ أحمد المنصور',
    durationWeeks: 12,
    sessionsPerWeek: 3,
    price: 49,
    enrolledStudentsCount: 342,
    imageUrl: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=600&q=80',
    modules: [
      {
        id: 'mod-1',
        title: 'Module 1: Makharij & Sifat (Articulations of Letters)',
        titleAr: 'الوحدة الأولى: مخارج الحروف وصفاتها',
        lessons: [
          {
            id: 'les-1',
            title: 'Lesson 1.1: Introduction to Tajweed & Makharij Overview',
            titleAr: 'الدرس ١,١: مقدمة في علم التجويد وخريطة مخارج الحروف',
            durationMinutes: 45,
            tajweedRule: 'Ghunnah (غُنَّة) - Nasalization duration of 2 Harakat on Noon and Meem Mushaddadah.',
            audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3',
            completed: true,
          }
        ]
      }
    ]
  }
];

export const MOCK_LEADS: Lead[] = [
  {
    id: 'lead-101',
    tenantId: 'tenant-1',
    studentName: 'Youssef El-Amrani',
    email: 'youssef.amrani@gmail.com',
    phone: '+1 (555) 234-5678',
    country: 'United States',
    courseInterest: 'Foundations of Tajweed & Recitation (Tuhfat al-Atfal)',
    preferredSchedule: 'Evening (Isha-Night)',
    priorHifzLevel: '6 - 15 Juz',
    arabicLevel: 'Intermediate',
    status: 'New',
    createdAt: '2026-08-26T14:30:00Z',
    updatedAt: '2026-08-26T16:00:00Z',
    notes: 'Student wants to review Surah Al-Baqarah memorization and refine Makharij.',
    assessmentScore: 88,
    selectedPlanId: 'plan-tajweed',
    planName: 'Foundational Tajweed Track',
    planPrice: 65,
    paymentStatus: 'Paid',
    billingCycle: 'mo',
    paymentGateway: 'stripe',
    invoices: [
      {
        id: 'inv-101',
        invoiceNumber: 'INV-2026-089',
        planName: 'Foundational Tajweed Track',
        amount: 65,
        currency: 'USD',
        status: 'Paid',
        issuedAt: '2026-08-26 14:32',
        paidAt: '2026-08-26 14:33',
        gateway: 'stripe',
      }
    ],
  },
  {
    id: 'lead-102',
    tenantId: 'tenant-1',
    studentName: 'Amina Bint Tariq',
    email: 'amina.tariq@yahoo.com',
    phone: '+44 7700 900077',
    country: 'United Kingdom',
    courseInterest: 'Foundations of Tajweed & Recitation (Tuhfat al-Atfal)',
    preferredSchedule: 'Afternoon (Asr-Maghrib)',
    priorHifzLevel: '1 - 5 Juz',
    arabicLevel: 'Beginner',
    status: 'Under Review',
    createdAt: '2026-08-25T11:15:00Z',
    updatedAt: '2026-08-25T15:20:00Z',
    notes: 'Applied for evening classes. Requires parent contact for scheduling.',
    assessmentScore: 72,
    selectedPlanId: 'plan-hifz',
    planName: 'Intensive Hifz Program',
    planPrice: 140,
    paymentStatus: 'Pending',
    billingCycle: 'mo',
    paymentGateway: 'bank_transfer',
  },
  {
    id: 'lead-103',
    tenantId: 'tenant-1',
    studentName: 'Bilal Farooq',
    email: 'bilal.farooq@outlook.com',
    phone: '+971 50 987 6543',
    country: 'United Arab Emirates',
    courseInterest: 'Full Hifz Intensive Track',
    preferredSchedule: 'Morning (Fajr-Zuhr)',
    priorHifzLevel: '16 - 29 Juz',
    arabicLevel: 'Advanced',
    status: 'Interview',
    createdAt: '2026-08-24T09:45:00Z',
    updatedAt: '2026-08-24T14:00:00Z',
    notes: 'Passed initial audio evaluation. Scheduled oral interview for Friday 4 PM.',
    assessmentScore: 95,
    selectedPlanId: 'plan-ijazah',
    planName: 'Qira\'at & Ijazah Specialization',
    planPrice: 240,
    paymentStatus: 'Paid',
    billingCycle: 'mo',
    paymentGateway: 'moyasar',
    invoices: [
      {
        id: 'inv-103',
        invoiceNumber: 'INV-2026-074',
        planName: 'Qira\'at & Ijazah Specialization',
        amount: 240,
        currency: 'USD',
        status: 'Paid',
        issuedAt: '2026-08-24 09:48',
        paidAt: '2026-08-24 09:50',
        gateway: 'moyasar',
      }
    ],
  },
  {
    id: 'lead-104',
    tenantId: 'tenant-1',
    studentName: 'Zeynab Hassan',
    email: 'z.hassan@edu.org',
    phone: '+1 (555) 876-5432',
    country: 'Canada',
    courseInterest: 'Quranic Arabic Grammar',
    preferredSchedule: 'Evening (Isha-Night)',
    priorHifzLevel: 'Complete Quran (30 Juz)',
    arabicLevel: 'Intermediate',
    status: 'Admitted',
    createdAt: '2026-08-22T16:20:00Z',
    updatedAt: '2026-08-23T11:05:00Z',
    notes: 'Admitted into Cohort B. Tuition payment confirmed.',
    assessmentScore: 92,
    selectedPlanId: 'plan-hifz',
    planName: 'Intensive Hifz Program',
    planPrice: 140,
    paymentStatus: 'Paid',
    billingCycle: 'yr',
    paymentGateway: 'stripe',
    invoices: [
      {
        id: 'inv-104',
        invoiceNumber: 'INV-2026-042',
        planName: 'Intensive Hifz Program',
        amount: 1400,
        currency: 'USD',
        status: 'Paid',
        issuedAt: '2026-08-22 16:22',
        paidAt: '2026-08-22 16:25',
        gateway: 'stripe',
      }
    ],
  }
];

export const MOCK_SURAHS: Surah[] = [
  {
    number: 1,
    nameAr: 'الفاتحة',
    nameEn: 'Al-Fatiha',
    englishTranslation: 'The Opening',
    numberOfAyahs: 7,
    revelationType: 'Meccan',
    ayahs: [
      {
        number: 1,
        numberInSurah: 1,
        surahNumber: 1,
        textUthmani: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
        translationEn: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3',
        tajweedTokens: [
          { text: 'بِسْمِ ' },
          { text: 'ٱللَّهِ ' },
          { text: 'ٱلرَّحْمَٰنِ ' },
          { text: 'ٱلرَّحِيمِ', rule: 'madd' }
        ]
      },
      {
        number: 2,
        numberInSurah: 2,
        surahNumber: 1,
        textUthmani: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ',
        translationEn: '[All] praise is [due] to Allah, Lord of the worlds -',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/2.mp3',
        tajweedTokens: [
          { text: 'ٱلْحَمْدُ ' },
          { text: 'لِلَّهِ ' },
          { text: 'رَبِّ ' },
          { text: 'ٱلْعَٰلَمِينَ', rule: 'madd' }
        ]
      }
    ]
  }
];

export const MOCK_RECITATIONS: RecitationSubmission[] = [
  {
    id: 'rec-1',
    studentId: 'std-201',
    studentName: 'Tariq Al-Sabah',
    surahName: 'Surah Al-Mulk (الملك)',
    ayahRange: 'Ayah 1 - 5',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/5242.mp3',
    durationSeconds: 114,
    submittedAt: '2026-08-26T18:45:00Z',
    status: 'Approved',
    teacherFeedback: 'Excellent Ghunnah timing on Noon Mushaddadah! Pay slight attention to Qalqalah intensity on word (لِيَبْلُوَكُمْ).'
  }
];

export const MOCK_ANALYTICS = {
  totalLeads: 124,
  enrolledStudents: 89,
  recitationSubmissions: 342,
  completionRatePercent: 78,
  monthlyEnrollment: [
    { month: 'Jan', leads: 24, enrolled: 18 },
    { month: 'Feb', leads: 32, enrolled: 22 },
    { month: 'Mar', leads: 28, enrolled: 20 },
    { month: 'Apr', leads: 45, enrolled: 31 },
    { month: 'May', leads: 50, enrolled: 38 },
    { month: 'Jun', leads: 62, enrolled: 44 },
    { month: 'Jul', leads: 85, enrolled: 61 },
    { month: 'Aug', leads: 124, enrolled: 89 }
  ],
  juzDistribution: [
    { range: 'Juz 1 - 5', students: 35 },
    { range: 'Juz 6 - 15', students: 28 },
    { range: 'Juz 16 - 29', students: 16 },
    { range: 'Juz 30 (Complete)', students: 10 }
  ]
};
