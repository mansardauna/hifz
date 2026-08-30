import { TenantConfig, Course, Lead, Surah, RecitationSubmission, TenantNiche } from '../types';

export const MOCK_TENANTS: Record<string, TenantConfig> = {
  'hifz-academy': {
    id: 'tenant-hifz',
    name: 'Hifz Quran Academy',
    nameAr: 'أكاديمية حفظ للقرآن الكريم',
    tagline: 'Mastering Sacred Quranic Memorization & Tajweed with Verified Sanad Teachers',
    taglineAr: 'حفظ وتثبيت القرآن الكريم بالسند المتصل وأحكام التجويد المتقنة',
    subdomain: 'hifz-academy',
    logoUrl: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=150&q=80',
    faviconUrl: '📖',
    niche: 'quran',
    theme: {
      primaryColor: '#059669',
      primaryHover: '#047857',
      secondaryColor: '#d97706',
      accentColor: '#0284c7',
      backgroundColor: '#f8fafc',
      surfaceColor: '#ffffff',
      textColor: '#0f172a',
      borderRadius: '0.5rem',
      fontFamily: 'Poppins',
    },
    defaultDirection: 'ltr',
    heroBadgeText: 'Spring 2026 Admissions Open • 114 Surahs Uthmani Reader & Live Audio Looper',
    heroBadgeTextAr: 'فتح باب القبول لعام ٢٠٢٦ • المصحف الشريف المرتل وحلقات التسميع المباشرة',
    aboutText: 'Hifz Quran Academy empowers students worldwide to memorize the Holy Quran with authentic Tajweed rules, Sanad certifications, and interactive recitation grading.',
    aboutTextAr: 'أكاديمية رائدة في تعليم وتحفيظ القرآن الكريم عن بعد وفق أعلى معايير الإتقان بالسند المتصل.',
    contactEmail: 'admissions@hifz-academy.com',
    contactPhone: '+1 (555) 234-5678',
    admissionsOpen: true,
    pageBlocks: [],
    customFormFields: [
      { id: 'parentName', label: 'Parent / Guardian Name', labelAr: 'اسم ولي الأمر', type: 'text', required: false, placeholder: 'e.g. Ahmad Al-Mansoor', width: 'half', order: 1 },
      { id: 'memorizedJuz', label: 'Current Juz Memorized (0-30)', labelAr: 'عدد الأجزاء المحفوظة', type: 'select', required: true, options: ['0 (Beginner)', '1 - 5 Juz', '6 - 15 Juz', '16 - 29 Juz', 'Complete Quran (30 Juz)'], width: 'half', order: 2 }
    ],
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
        features: ['114 Surah Uthmani Reader Access', 'Interactive Tajweed Token Highlights', 'Audio Reciter Looper (Alafasy, Husary, Minshawi)', 'Weekly Oral Recitation Feedback']
      },
      {
        id: 'plan-hifz',
        name: 'Intensive Hifz Program',
        nameAr: 'برنامج التحفيظ المكثف',
        description: 'Daily revision halaqahs (Muraja\'ah) & systematic memorization tracking',
        descriptionAr: 'متابعة يومية للحفظ الجديد والمراجعة الصغرى والكبرى مع المشايخ المجازين',
        priceMonthly: 140,
        priceYearly: 1400,
        currency: 'USD',
        features: ['Daily Live WebRTC Video Halaqahs', 'Individual Surah Check-ins', 'Recitation Audio Recording Submissions', 'Sanad Tracking Dashboard', 'Official Graduation Certificate']
      }
    ],
    paymentGateways: [
      {
        provider: 'stripe',
        enabled: true,
        publishableKey: 'pk_test_51TFgt1RPXkQKup3MmIls7ogQPZTdZfbeRkFaKYNugljgX3svXSgy8wgNaRs8TmUP9UmA1Nh0dHV5xUni1aLBiSA400Gvkz2tZ9',
        liveMode: false
      }
    ]
  },
  'code-academy': {
    id: 'tenant-code',
    name: 'Code Academy Bootcamp',
    nameAr: 'أكاديمية البرمجة والتقنية',
    tagline: 'Become a Professional Software Engineer with Live Interactive Browser Sandboxes',
    taglineAr: 'تعلّم هندسة البرمجيات وتطوير الويب عبر بيئات برمجية سحابية مباشرة',
    subdomain: 'code-academy',
    logoUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=150&q=80',
    faviconUrl: '💻',
    niche: 'coding',
    theme: {
      primaryColor: '#2563eb',
      primaryHover: '#1d4ed8',
      secondaryColor: '#0ea5e9',
      accentColor: '#8b5cf6',
      backgroundColor: '#0f172a',
      surfaceColor: '#1e293b',
      textColor: '#f8fafc',
      borderRadius: '0.5rem',
      fontFamily: 'Inter',
    },
    defaultDirection: 'ltr',
    heroBadgeText: 'Interactive Browser Coding Sandboxes • Live JS & Python Execution',
    heroBadgeTextAr: 'محرر برمجي سحابي تفاعلي • تشغيل فوري للغات البرمجة',
    aboutText: 'Code Academy delivers cohort-based web development and software engineering bootcamps with real-time browser compilers and mentor pair-programming.',
    aboutTextAr: 'أكاديمية متخصصة في تدريب وتأهيل المطورين على أحدث تقنيات الويب والذكاء الاصطناعي.',
    contactEmail: 'admissions@codeacademy.dev',
    contactPhone: '+1 (415) 800-4499',
    admissionsOpen: true,
    pageBlocks: [],
    customFormFields: [
      { id: 'experienceLevel', label: 'Prior Coding Experience', labelAr: 'الخبرة البرمجية السابقة', type: 'select', required: true, options: ['Beginner (Zero experience)', 'Intermediate (Knows JS/Python basics)', 'Advanced'] }
    ],
    pricingPlans: [
      {
        id: 'plan-code-pro',
        name: 'Full-Stack Web Immersion',
        nameAr: 'مسار تطوير الويب الشامل',
        description: 'Comprehensive curriculum covering React, Next.js, Node.js, and Cloud Deployment',
        descriptionAr: 'برنامج مكثف يشمل رياكت ونكست جي إس والبرمجة الخلفية',
        priceMonthly: 129,
        priceYearly: 1290,
        currency: 'USD',
        features: ['Live Code Sandbox Exercises', 'Automated Test Runner Grading', 'Weekly 1-on-1 Mentor Code Review', 'Portfolio Capstone Projects']
      }
    ],
    paymentGateways: [
      {
        provider: 'stripe',
        enabled: true,
        publishableKey: 'pk_live_code_stripe',
        liveMode: true
      }
    ]
  },
  'al-furqan': {
    id: 'tenant-1',
    name: 'Al-Furqan Islamic School',
    nameAr: 'مدرسة الفرقان الإسلامية',
    tagline: 'Comprehensive Islamic Curriculum & Classical Arabic Studies',
    taglineAr: 'منهاج إسلامي متكامل ودراسات في اللغة العربية والعلوم الشرعية',
    subdomain: 'al-furqan',
    logoUrl: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=150&q=80',
    faviconUrl: '📖',
    niche: 'general',
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
    heroBadgeText: 'Spring 2026 Admissions Open for Islamic Studies Program',
    heroBadgeTextAr: 'باب التسجيل مفتوح لبرنامج الدراسات الإسلامية لعام ٢٠٢٦',
    aboutText: 'Al-Furqan Islamic School provides comprehensive Islamic education, ethics, and classical knowledge for youth and adults.',
    aboutTextAr: 'تسعى مدرسة الفرقان لتقديم تعليم إسلامي متميز يشمل الفقه والعقيدة والسيرة النبوية.',
    contactEmail: 'admissions@alfurqan-academy.com',
    contactPhone: '+966 50 123 4567',
    admissionsOpen: true,
    pageBlocks: [],
    customFormFields: [
      { id: 'parentName', label: 'Parent / Guardian Name', labelAr: 'اسم ولي الأمر', type: 'text', required: false, placeholder: 'e.g. Ahmad Al-Mansoor', width: 'half', order: 1 }
    ],
    pricingPlans: [
      {
        id: 'plan-fiqh',
        name: 'Islamic Studies Core Track',
        nameAr: 'مسار الدراسات الإسلامية',
        description: 'Weekly structured lessons in Fiqh, Hadith, and Seerah',
        descriptionAr: 'دروس أسبوعية منتظمة في الفقه والحديث الشريف والسيرة النبوية',
        priceMonthly: 55,
        priceYearly: 550,
        currency: 'USD',
        features: ['Weekly Live Classes', 'Downloadable Course Workbooks', 'Quarterly Assessment Tests']
      }
    ],
    paymentGateways: [
      {
        provider: 'stripe',
        enabled: true,
        publishableKey: 'pk_live_alfurqan_stripe',
        liveMode: true
      }
    ]
  },
  'bayyinah-arabic': {
    id: 'tenant-2',
    name: 'Bayyinah Classical Arabic Institute',
    nameAr: 'معهد البينة للغة العربية والعلوم الشرعية',
    tagline: 'Unlock the Beauty of the Arabic Language from Classical Grammar to Eloquence',
    taglineAr: 'فهم لغة القرآن الكريم من البلاغة إلى النحو والصرف',
    subdomain: 'bayyinah-arabic',
    logoUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=150&q=80',
    faviconUrl: '✒️',
    niche: 'language',
    theme: {
      primaryColor: '#7c3aed',
      primaryHover: '#6d28d9',
      secondaryColor: '#ca8a04',
      accentColor: '#4f46e5',
      backgroundColor: '#f8fafc',
      surfaceColor: '#ffffff',
      textColor: '#064e3b',
      borderRadius: '0.125rem',
      fontFamily: 'Poppins',
    },
    defaultDirection: 'ltr',
    heroBadgeText: 'Classical Arabic Grammar & Syntax Certification',
    heroBadgeTextAr: 'دبلوم النحو العربي وقواعد الإعراب',
    aboutText: 'Bayyinah Institute empowers students worldwide to understand classical Arabic syntax, Nahw, Sarf, and Balaghah.',
    aboutTextAr: 'يهدف معهد البينة إلى تمكين الطلاب من فهم اللغة العربية الفصحى وتذوق بلاغتها وإعرابها.',
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
        description: 'Syntax & morphology applied directly to classical texts',
        descriptionAr: 'شرح وتطبيق قواعد الآجرومية وشذا العرف في فن الصرف',
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

// Aliases
export const MOCK_TENANT = MOCK_TENANTS['hifz-academy'];

export const MOCK_COURSES: Course[] = [
  // 1. Hifz Quran Academy Courses
  {
    id: 'course-hifz-1',
    tenantId: 'tenant-hifz',
    title: 'Foundations of Tajweed & Recitation (Tuhfat al-Atfal)',
    titleAr: 'تيسير التجويد شرح تحفة الأطفال',
    description: 'Learn fundamental Tajweed rules including Nun Sakinah, Tanween, Meem Sakinah, and Madd elongation with live oral correction.',
    descriptionAr: 'دورة متكاملة لدراسة أحكام النون الساكنة والتنوين والميم الساكنة والمدود مع التدريب العملي.',
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
          },
          {
            id: 'les-2',
            title: 'Lesson 1.2: Ahkam Al-Nun Al-Sakinah (Idhhar, Idgham, Iqlab, Ikhfa)',
            titleAr: 'الدرس ١,٢: أحكام النون الساكنة والتنوين',
            durationMinutes: 50,
            tajweedRule: 'Idgham with Ghunnah (إدغام بغنة) for letters (ي, ن, م, و).',
            audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/2.mp3',
            completed: false,
          }
        ]
      }
    ]
  },

  // 2. Code Academy Bootcamp Courses (100% Pure Software Tech)
  {
    id: 'course-code-1',
    tenantId: 'tenant-code',
    title: 'Full-Stack TypeScript & React 19 Mastery',
    titleAr: 'مسار الاحتراف في تايب سكريبت ورياكت ١٩',
    description: 'Master modern frontend architecture, hooks, server components, and Tailwind CSS with real-time sandbox execution.',
    descriptionAr: 'برنامج تدريبي متقدم لتطوير واجهات الويب الحديثة باستخدام تايب سكريبت ونكست جي إس.',
    level: 'Intermediate',
    instructorName: 'Sarah Jenkins (Senior Frontend Architect)',
    instructorNameAr: 'سارة جينكينز (كبير مهندسي الواجهات)',
    durationWeeks: 10,
    sessionsPerWeek: 4,
    price: 129,
    enrolledStudentsCount: 512,
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    modules: [
      {
        id: 'mod-code-1',
        title: 'Module 1: Modern TypeScript Fundamentals & Generics',
        titleAr: 'الوحدة الأولى: أساسيات تايب سكريبت والأنواع العامة',
        lessons: [
          {
            id: 'les-code-1',
            title: 'Lesson 1.1: Strict Type Safety & Custom Utility Types',
            titleAr: 'الدرس ١,١: التحقق الصارم من الأنواع ودوال المساعدة',
            durationMinutes: 60,
            completed: true,
          },
          {
            id: 'les-code-2',
            title: 'Lesson 1.2: React 19 Actions & Server State Management',
            titleAr: 'الدرس ١,٢: إدارة الحالة وإجراءات الخادم في رياكت ١٩',
            durationMinutes: 75,
            completed: false,
          }
        ]
      },
      {
        id: 'mod-code-2',
        title: 'Module 2: REST & GraphQL API Integration with PostgreSQL',
        titleAr: 'الوحدة الثانية: ربط واجهات برمجة التطبيقات وقواعد البيانات',
        lessons: [
          {
            id: 'les-code-3',
            title: 'Lesson 2.1: Prisma ORM Schema Design & Migrations',
            titleAr: 'الدرس ٢,١: تصميم قواعد البيانات باستخدام بريزما',
            durationMinutes: 90,
            completed: false,
          }
        ]
      }
    ]
  },
  {
    id: 'course-code-2',
    tenantId: 'tenant-code',
    title: 'Python Algorithms, Data Structures & System Design',
    titleAr: 'هياكل البيانات والخوارزميات بلغة بايثون',
    description: 'Solve coding interview challenges, binary trees, dynamic programming, and scalable backend services.',
    descriptionAr: 'حل تحديات المقابلات التقنية والبرمجة الديناميكية وتصميم النظم.',
    level: 'Advanced',
    instructorName: 'David Chen (Ex-Google Principal Engineer)',
    instructorNameAr: 'ديفيد تشن (مهندس أول سابق في جوجل)',
    durationWeeks: 8,
    sessionsPerWeek: 3,
    price: 99,
    enrolledStudentsCount: 420,
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    modules: [
      {
        id: 'mod-py-1',
        title: 'Module 1: Asymptotic Complexity & Dynamic Programming',
        titleAr: 'الوحدة الأولى: تحليل تعقيد الخوارزميات والبرمجة الديناميكية',
        lessons: [
          {
            id: 'les-py-1',
            title: 'Lesson 1.1: Big-O Space/Time Analysis & Memoization',
            titleAr: 'الدرس ١,١: تحليل التعقيد الزمني والمكاني',
            durationMinutes: 60,
            completed: true,
          }
        ]
      }
    ]
  },

  // 3. Bayyinah Classical Arabic Courses
  {
    id: 'course-bayyinah-1',
    tenantId: 'tenant-2',
    title: 'Classical Arabic Grammar: Al-Ajrumiyyah Applied',
    titleAr: 'شرح الآجرومية في النحو التطبيقي',
    description: 'Deep dive into Arabic sentence syntax, Marfoo\'at, Mansoobat, and parsing (I\'rab).',
    descriptionAr: 'دراسة شاملة لقواعد الإعراب والمرفوعات والمنصوبات والمجرورات في كلام العرب.',
    level: 'Intermediate',
    instructorName: 'Ustadh Nouman Ali',
    instructorNameAr: 'الأستاذ نعمان علي',
    durationWeeks: 14,
    sessionsPerWeek: 3,
    price: 85,
    enrolledStudentsCount: 290,
    imageUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=600&q=80',
    modules: [
      {
        id: 'mod-arabic-1',
        title: 'Module 1: Kalam Definition & Parts of Speech (Ism, Fi\'l, Harf)',
        titleAr: 'الوحدة الأولى: تعريف الكلام وأقسامه الثلاثة',
        lessons: [
          {
            id: 'les-arabic-1',
            title: 'Lesson 1.1: Signs of Nouns and Verbal Conjugations',
            titleAr: 'الدرس ١,١: علامات الاسم وتصريفات الأفعال',
            durationMinutes: 50,
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
    tenantId: 'tenant-hifz',
    studentName: 'Youssef El-Amrani',
    email: 'youssef.amrani@gmail.com',
    phone: '+1 (555) 234-5678',
    country: 'United States',
    courseInterest: 'Foundations of Tajweed & Recitation (Tuhfat al-Atfal)',
    preferredSchedule: 'Evening',
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
    id: 'lead-code-1',
    tenantId: 'tenant-code',
    studentName: 'Alex Mercer',
    email: 'alex.mercer@techdev.io',
    phone: '+1 (415) 555-0182',
    country: 'United States',
    courseInterest: 'Full-Stack TypeScript & React 19 Mastery',
    preferredSchedule: 'Weekend Intensive',
    status: 'Admitted',
    createdAt: '2026-08-28T10:00:00Z',
    updatedAt: '2026-08-28T10:15:00Z',
    notes: 'Enrolled in full cohort. Sandbox environment provisioned.',
    assessmentScore: 94,
    selectedPlanId: 'plan-code-pro',
    planName: 'Full-Stack Web Immersion',
    planPrice: 129,
    paymentStatus: 'Paid',
    billingCycle: 'mo',
    paymentGateway: 'stripe',
    invoices: [
      {
        id: 'inv-code-1',
        invoiceNumber: 'INV-CODE-001',
        planName: 'Full-Stack Web Immersion',
        amount: 129,
        currency: 'USD',
        status: 'Paid',
        issuedAt: '2026-08-28 10:05',
        paidAt: '2026-08-28 10:06',
        gateway: 'stripe',
      }
    ]
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
    { range: 'Foundations', students: 38 },
    { range: 'Level 1-2', students: 24 },
    { range: 'Level 3-4', students: 16 },
    { range: 'Advanced Capstone', students: 11 }
  ]
};
