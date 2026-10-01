import type { Data } from '@measured/puck';
import { ComponentProps, PuckRootProps } from './puckConfig';

export interface PuckTemplateMeta {
  id: string;
  name: string;
  niche: string;
  icon: string;
  description: string;
  data: Data<ComponentProps, PuckRootProps>;
}

export const PUCK_TEMPLATES: Record<string, PuckTemplateMeta> = {
  quran_madrasah: {
    id: 'quran_madrasah',
    name: 'Quran & Islamic Madrasah',
    niche: 'madrasat',
    icon: '📖',
    description: 'Sacred recitation, verified Sanad chains, Tuhfat al-Atfal Tajweed theory, and live halaqat.',
    data: {
      root: { props: { title: 'Quran & Islamic Madrasah' } },
      content: [
        {
          type: 'HeroBlock',
          props: {
            id: 'hero-quran-1',
            badgeText: 'Verified Sanad & Ijazah Chains',
            headline: 'Master Quranic Recitation & Tajweed with Certified Scholars',
            subheadline: 'Live 1-on-1 and group halaqat with verified Sanad chains connected directly to the Prophet Muhammad ﷺ.',
            ctaText: 'Enroll in Free Assessment',
            ctaLink: '#pricing',
            secondaryCtaText: 'Admissions Inquiry',
            secondaryCtaLink: '#form',
            bgGradient: 'emerald',
            imageUrl: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&auto=format&fit=crop&q=80',
            align: 'center',
          },
        },
        {
          type: 'IslamicCalligraphyQuote',
          props: {
            id: 'quote-quran-1',
            arabicText: 'إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ',
            translation: 'Indeed, it is We who sent down the Quran and indeed, We will be its guardian.',
            reference: 'Surah Al-Hijr [15:9]',
          },
        },
        {
          type: 'FeaturesBento',
          props: {
            id: 'features-quran-1',
            heading: 'Why Study at Our Sacred Halaqah',
            subheading: 'Combining classical Islamic authenticity with modern audio-first educational technology.',
            feature1Title: 'Authentic Sanad Chains',
            feature1Desc: 'Direct unbroken recitation chains in Hafs, Warsh, and Qaloon.',
            feature1Icon: 'Award',
            feature2Title: 'Live Interactive WebRTC',
            feature2Desc: 'Crystal-clear audio-first virtual halaqah with looper audio repetition.',
            feature2Icon: 'Radio',
            feature3Title: 'Flexible Global Cohorts',
            feature3Desc: 'Morning and evening cohorts tailored to your local timezone.',
            feature3Icon: 'Clock',
          },
        },
        {
          type: 'DynamicCurriculum',
          props: {
            id: 'curriculum-quran-1',
            heading: 'Structured Hifz & Tajweed Tracks',
            subheading: 'From foundational Arabic phonetics to complete 30-Juz memorization and Sanad mastery.',
            badgeText: 'Hifz Tracks',
            showEnrollBtn: true,
          },
        },
        {
          type: 'LivePricingTable',
          props: {
            id: 'pricing-quran-1',
            heading: 'Tuition & Subscription Plans',
            subheading: 'Affordable monthly tuition packages with certified mentor guidance and live halaqah access.',
            highlightBadge: 'Transparent Pricing',
          },
        },
        {
          type: 'CustomFormEmbed',
          props: {
            id: 'form-quran-1',
            heading: 'Direct Admissions & Placement Evaluation',
            subheading: 'Submit your details for immediate review and voice assessment scheduling by our admissions scholars.',
            formId: 'form-admissions',
            buttonText: 'Submit Application',
          },
        },
        {
          type: 'Testimonials',
          props: {
            id: 'testimonials-quran-1',
            heading: 'Words from Our Graduating Huffadh',
            subheading: 'Alhamdulillah, hundreds of students have completed their memorization through our structured curriculum.',
            quote1: 'The daily revision system and looper audio playback helped me retain 30 Juz while managing university studies.',
            author1: 'Zaid Al-Harithi',
            role1: 'Hafs Sanad Graduate',
            quote2: 'The teachers are patient and precise with Tajweed Makharij. I received my Ijazah within 14 months.',
            author2: 'Amina Khatun',
            role2: 'Qira\'at Student',
          },
        },
        {
          type: 'FAQAccordion',
          props: {
            id: 'faq-quran-1',
            heading: 'Frequently Asked Questions',
            subheading: 'Everything you need to know about our instructors, schedules, and oral testing.',
            q1: 'What qualifications do your instructors hold?',
            a1: 'All our instructors possess verified Ijazahs with unbroken chains (Sanad) to the Prophet ﷺ from Al-Azhar, Madinah, and leading Islamic institutions.',
            q2: 'Can young children enroll in foundational classes?',
            a2: 'Yes! We have specialized youth cohorts for ages 6+ starting with Noorani Qaidah and fundamental phonetics.',
            q3: 'Are live halaqat sessions recorded?',
            a3: 'Yes, all live halaqah recordings are accessible in your student portal for continuous revision.',
          },
        },
        {
          type: 'CTABanner',
          props: {
            id: 'cta-quran-1',
            headline: 'Begin Your Quranic Journey Today',
            subheadline: 'Join hundreds of dedicated students under the mentorship of certified Sanad scholars.',
            ctaText: 'Enroll in Academy',
            ctaLink: '#pricing',
            badgeText: 'New Cohorts Enrolling',
          },
        },
      ],
    },
  },

  coding_bootcamp: {
    id: 'coding_bootcamp',
    name: 'Coding & Tech Bootcamp',
    niche: 'coding',
    icon: '💻',
    description: 'Full-stack software engineering with interactive browser IDE, automated test runners, and career mentorship.',
    data: {
      root: { props: { title: 'Software Engineering Bootcamp' } },
      content: [
        {
          type: 'HeroBlock',
          props: {
            id: 'hero-code-1',
            badgeText: 'Next-Gen Developer Training',
            headline: 'Learn Full-Stack Software Engineering with Live Code Challenges',
            subheadline: 'Build real-world production web applications, master algorithmic data structures, and pass automated unit test suites.',
            ctaText: 'Start Free Coding Challenge',
            ctaLink: '#curriculum',
            secondaryCtaText: 'View Bootcamp Tuition',
            secondaryCtaLink: '#pricing',
            bgGradient: 'cyber_dark',
            imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
            align: 'center',
          },
        },
        {
          type: 'FeaturesBento',
          props: {
            id: 'features-code-1',
            heading: 'Hands-On Coding Pedagogy',
            subheading: 'Zero local setup required — write, test, and deploy code directly in your browser with automated CI validation.',
            feature1Title: 'Interactive Unit Test Suites',
            feature1Desc: 'FreeCodeCamp-style unit assertions with instant pass/fail validation.',
            feature1Icon: 'Code2',
            feature2Title: 'Modern Tech Stack',
            feature2Desc: 'React 19, TypeScript, Next.js 15, Node.js, Python, and SQL databases.',
            feature2Icon: 'Layers',
            feature3Title: 'Live Pair Programming',
            feature3Desc: 'Collaborate in real-time rooms with senior tech mentors.',
            feature3Icon: 'Users',
          },
        },
        {
          type: 'DynamicCurriculum',
          props: {
            id: 'curriculum-code-1',
            heading: 'Software Engineering Career Tracks',
            subheading: 'Progressive tracks from algorithmic fundamentals to cloud microservices and portfolio builds.',
            badgeText: 'Tech Tracks',
            showEnrollBtn: true,
          },
        },
        {
          type: 'LivePricingTable',
          props: {
            id: 'pricing-code-1',
            heading: 'Bootcamp Tuition & Apprenticeships',
            subheading: 'Transparent tuition with dedicated senior mentor code reviews, project audits, and certification.',
            highlightBadge: 'Career Ready',
          },
        },
        {
          type: 'CustomFormEmbed',
          props: {
            id: 'form-code-1',
            heading: 'Bootcamp Entrance Assessment Application',
            subheading: 'Submit your coding background and career goals to begin your entrance assessment.',
            formId: 'form-admissions',
            buttonText: 'Submit Application',
          },
        },
      ],
    },
  },

  vocational_trade: {
    id: 'vocational_trade',
    name: 'Vocational & Trade Academy',
    niche: 'school',
    icon: '🛠️',
    description: 'Hands-on practical training with step-by-step workshop checklists, photo proof submissions, and trade rubrics.',
    data: {
      root: { props: { title: 'Vocational & Trade Academy' } },
      content: [
        {
          type: 'HeroBlock',
          props: {
            id: 'hero-voc-1',
            badgeText: 'Accredited Vocational Diplomas',
            headline: 'Master Practical Craftsmanship & Technical Trades',
            subheadline: 'Hands-on practical training with step-by-step workshop checklists, certified master tradesmen, and project rubrics.',
            ctaText: 'Apply for Next Cohort',
            ctaLink: '#pricing',
            secondaryCtaText: 'Workshop Inquiries',
            secondaryCtaLink: '#form',
            bgGradient: 'slate_amber',
            imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80',
            align: 'center',
          },
        },
        {
          type: 'FeaturesBento',
          props: {
            id: 'features-voc-1',
            heading: 'Practical Vocational Excellence',
            subheading: 'Industry-standard trade curriculum with proof of craftsmanship submissions and rubric grading.',
            feature1Title: 'Workshop Action Checklists',
            feature1Desc: 'Step-by-step practical guides with photo and video proof uploads.',
            feature1Icon: 'Hammer',
            feature2Title: 'Master Craft Review',
            feature2Desc: 'Personalized rubric feedback from experienced master craftsmen.',
            feature2Icon: 'Award',
            feature3Title: 'Certified Trade Diplomas',
            feature3Desc: 'Shareable verified certificates upon passing practical assessments.',
            feature3Icon: 'CheckCircle2',
          },
        },
        {
          type: 'LivePricingTable',
          props: {
            id: 'pricing-voc-1',
            heading: 'Workshop Tuition & Tooling Packages',
            subheading: 'All-inclusive enrollment covering hands-on materials, safety gear, and master evaluation.',
            highlightBadge: 'Trade Certifications',
          },
        },
        {
          type: 'CustomFormEmbed',
          props: {
            id: 'form-voc-1',
            heading: 'Trade Apprenticeship Application',
            subheading: 'Apply for the upcoming practical workshop cohort at our accredited facility.',
            formId: 'form-admissions',
            buttonText: 'Submit Application',
          },
        },
      ],
    },
  },

  stem_school: {
    id: 'stem_school',
    name: 'K-12 STEM & Integrated Islamic School',
    niche: 'school',
    icon: '🏫',
    description: 'Holistic K-12 schooling fusing academic STEM excellence, robotics, and noble Islamic character.',
    data: {
      root: { props: { title: 'K-12 Integrated School' } },
      content: [
        {
          type: 'HeroBlock',
          props: {
            id: 'hero-stem-1',
            badgeText: 'Now Enrolling Fall 2026',
            headline: 'Empowering Future Leaders with STEM Excellence & Islamic Values',
            subheadline: 'A holistic learning environment blending modern science, robotics, language arts, and noble Akhlaq.',
            ctaText: 'Apply for Admission',
            ctaLink: '#form',
            secondaryCtaText: 'View Tuition Plans',
            secondaryCtaLink: '#pricing',
            bgGradient: 'sky_navy',
            imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80',
            align: 'center',
          },
        },
        {
          type: 'FeaturesBento',
          props: {
            id: 'features-stem-1',
            heading: 'Holistic Education for Mind & Spirit',
            subheading: 'Modern pedagogical standards with small class cohorts and dedicated student advisory.',
            feature1Title: 'STEM & Robotics Labs',
            feature1Desc: 'Hands-on experimentation with coding, electronics, and applied mathematics.',
            feature1Icon: 'Zap',
            feature2Title: 'Arabic & Islamic Character',
            feature2Desc: 'Integrated Quranic morals, daily adab, and fluent Arabic fluency.',
            feature2Icon: 'BookOpen',
            feature3Title: 'Parent Portal & Live Timetables',
            feature3Desc: 'Real-time grade reports, attendance tracking, and parent-teacher communication.',
            feature3Icon: 'Users',
          },
        },
        {
          type: 'LivePricingTable',
          props: {
            id: 'pricing-stem-1',
            heading: 'Annual & Term School Tuition',
            subheading: 'Flexible quarterly and annual tuition schedules with sibling discounts.',
            highlightBadge: 'Tuition Packages',
          },
        },
        {
          type: 'CustomFormEmbed',
          props: {
            id: 'form-stem-1',
            heading: 'New Student Admission & Assessment Registration',
            subheading: 'Begin the enrollment process for your child for the upcoming academic year.',
            formId: 'form-admissions',
            buttonText: 'Submit Application',
          },
        },
      ],
    },
  },
};
