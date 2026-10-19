import { TenantConfig } from '../types';

export interface BreakoutPodConfig {
  id: string; // 'beginner' | 'intermediate' | 'advanced' | string
  tier: 'beginner' | 'intermediate' | 'advanced' | string;
  label: string;
  sublabel: string;
  badgeColor?: string;
  borderColor?: string;
  bgLight?: string;
  targetTopics: string[];
}

export interface AgendaMilestoneConfig {
  id: string;
  tier: 'beginner' | 'intermediate' | 'advanced' | string;
  title: string;
  targetMinutes: number;
  done: boolean;
}

export interface RubricCriteriaConfig {
  id: string;
  name: string;
  desc: string;
  maxScore: number;
}

export interface ForumChannelConfig {
  id: string;
  label: string;
  labelAr?: string;
  description?: string;
  icon?: string;
}

export interface ClassroomCustomizationConfig {
  breakoutPodsTitle: string;
  breakoutPodsSubtitle: string;
  pods: BreakoutPodConfig[];
  agendaTitle: string;
  agendaSubtitle: string;
  milestones: AgendaMilestoneConfig[];
  rubricTitle: string;
  rubricCriteria: RubricCriteriaConfig[];
  forumChannels: ForumChannelConfig[];
}

export function detectTenantNicheType(tenant?: Partial<TenantConfig>): 'quran' | 'coding' | 'school' | 'general' {
  if (!tenant) return 'general';
  const niche = tenant.niche;
  const sub = (tenant.subdomain || '').toLowerCase();
  
  if (niche === 'coding' || niche === 'code_academy' || sub.includes('code') || sub.includes('dev')) {
    return 'coding';
  }
  if (niche === 'school' || sub.includes('school') || sub.includes('horizon') || sub.includes('k12')) {
    return 'school';
  }
  if (niche === 'madrasat' || niche === 'quran' || sub.includes('hifz') || sub.includes('quran') || sub.includes('madrasa')) {
    return 'quran';
  }
  return 'general';
}

export function getDefaultClassroomConfig(tenant?: Partial<TenantConfig>): ClassroomCustomizationConfig {
  const nicheType = detectTenantNicheType(tenant);

  if (nicheType === 'quran') {
    return {
      breakoutPodsTitle: 'Level-Based Halaqah Breakout Pods',
      breakoutPodsSubtitle: 'Students collaborate in focused pods tailored to their level tier, allowing tailored pacing without overwhelming beginners or slowing down advanced learners.',
      pods: [
        {
          id: 'beginner',
          tier: 'beginner',
          label: 'Level 1: Noorani Qaidah & Makharij',
          sublabel: 'Phonetics, letter exits (Makharij), short & long vowels',
          badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          borderColor: 'border-emerald-200',
          bgLight: 'bg-emerald-50/60',
          targetTopics: [
            'Arabic Alphabet Makharij (ح، خ، ع)',
            'Harakat (Fatha, Kasra, Damma)',
            'Basic Madd Rules (2 Harakah)',
          ],
        },
        {
          id: 'intermediate',
          tier: 'intermediate',
          label: 'Level 2: Juz Amma & Tajweed Application',
          sublabel: 'Ahkam Al-Nun & Al-Meem, Mudood, fluent Juz 30 recitation',
          badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
          borderColor: 'border-blue-200',
          bgLight: 'bg-blue-50/60',
          targetTopics: [
            'Idgham, Ikhfa, Iqlab, Izhar',
            'Madd Lazim & Munfasil',
            'Juz 30 Continuous Fluency',
          ],
        },
        {
          id: 'advanced',
          tier: 'advanced',
          label: 'Level 3: Hifz Revision & Sanad Ijazah',
          sublabel: "Multi-Juz memorization, Waqf & Ibtida', Sanad precision",
          badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
          borderColor: 'border-purple-200',
          bgLight: 'bg-purple-50/60',
          targetTopics: [
            "Waqf & Ibtida' Precision Rules",
            'Mutashabihat Al-Quran Mastery',
            'Sanad Chain Oral Audit',
          ],
        },
      ],
      agendaTitle: 'Hifz & Tajweed Progression Agenda',
      agendaSubtitle: 'Milestones are organized by level tier to give each cohort clear learning objectives.',
      milestones: [
        {
          id: 'ms-q1',
          tier: 'beginner',
          title: 'Noorani Qaidah: Throat & Tongue Makharij Verification (ح، خ، ع)',
          targetMinutes: 20,
          done: true,
        },
        {
          id: 'ms-q2',
          tier: 'beginner',
          title: 'Harakat Precision: Distinguishing Fatha vs Short Alif',
          targetMinutes: 20,
          done: false,
        },
        {
          id: 'ms-q3',
          tier: 'intermediate',
          title: 'Surah Al-Mulk: Precision Tajweed & Ahkam Al-Nun (Ayahs 1-10)',
          targetMinutes: 20,
          done: true,
        },
        {
          id: 'ms-q4',
          tier: 'intermediate',
          title: 'Oral Recitation Audits with Floating Audio Looper',
          targetMinutes: 20,
          done: false,
        },
        {
          id: 'ms-q5',
          tier: 'advanced',
          title: "10 Juz Muraja'ah: Mutashabihat Cross-Surah Retention Audit",
          targetMinutes: 20,
          done: true,
        },
        {
          id: 'ms-q6',
          tier: 'advanced',
          title: "Sanad Chain Recitation Verification & Waqf Mastery",
          targetMinutes: 20,
          done: false,
        },
      ],
      rubricTitle: 'Tajweed & Hifz Oral Level Rubric',
      rubricCriteria: [
        {
          id: 'rc-1',
          name: 'Makharij (Letter Exits & Throat Articulation)',
          desc: 'Precision of ح، خ، ع، غ articulation without distortion',
          maxScore: 5,
        },
        {
          id: 'rc-2',
          name: 'Ahkam Al-Nun & Meem (Idgham, Ikhfa, Iqlab)',
          desc: 'Applying Ghunnah 2 counts and clear Izhar',
          maxScore: 5,
        },
        {
          id: 'rc-3',
          name: 'Mudood (Madd Lazim, Munfasil, Muttasil)',
          desc: 'Rhythmic timing of elongated vowels (2, 4, 6 Harakat)',
          maxScore: 5,
        },
        {
          id: 'rc-4',
          name: "Waqf & Ibtida' (Stopping and Starting)",
          desc: 'Stopping on complete semantic meanings without breaking context',
          maxScore: 5,
        },
      ],
      forumChannels: [
        { id: 'all', label: 'All Halaqahs', labelAr: 'جميع الحلقات', icon: 'BookOpen', description: 'Combined view of all discussion threads' },
        { id: 'general', label: 'General Reflections & Halaqah', labelAr: 'تأملات ونقاش عام', icon: 'Book', description: 'General thoughts and community halaqah announcements' },
        { id: 'tajweed', label: 'Tajweed Rules & Makharij', labelAr: 'أحكام التجويد والمخارج', icon: 'Mic', description: 'Theoretical and practical tajweed inquiries' },
        { id: 'hifz', label: "Hifz & Muraja'ah Techniques", labelAr: 'تقنيات الحفظ والمراجعة', icon: 'Sparkles', description: 'Memorization methods, retention tips, and schedules' },
        { id: 'homework', label: 'Recitation Submissions & Feedback', labelAr: 'واجبات التلاوة وتصحيحها', icon: 'Headphones', description: 'Peer recitation reviews and ustadh grading feedback' },
        { id: 'qiraat', label: "Sanad & Ten Qira'at Studies", labelAr: 'دراسات السند والقراءات', icon: 'Award', description: 'Advanced qiraat comparisons and sanad chains' },
      ],
    };
  }

  if (nicheType === 'coding') {
    return {
      breakoutPodsTitle: 'Level-Based Engineering Pairing Pods',
      breakoutPodsSubtitle: 'Students collaborate in focused pods tailored to their level tier, allowing tailored pacing without overwhelming beginners or slowing down advanced learners.',
      pods: [
        {
          id: 'beginner',
          tier: 'beginner',
          label: 'Tier 1: Core Fundamentals & JS',
          sublabel: 'Variables, loops, DOM, functions, Git basics',
          badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          borderColor: 'border-emerald-200',
          bgLight: 'bg-emerald-50/60',
          targetTopics: [
            'JavaScript ES6+ Syntax & Scope',
            'Array & Object Methods (map, filter, reduce)',
            'DOM Manipulation & Event Handling',
          ],
        },
        {
          id: 'intermediate',
          tier: 'intermediate',
          label: 'Tier 2: Full-Stack React & APIs',
          sublabel: 'React 19 Server Components, TypeScript, Next.js, REST/GraphQL',
          badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
          borderColor: 'border-blue-200',
          bgLight: 'bg-blue-50/60',
          targetTopics: [
            'React 19 Server Actions & Custom Hooks',
            'TypeScript Strict Type Checking & Generics',
            'Optimistic UI & Cache Revalidation',
          ],
        },
        {
          id: 'advanced',
          tier: 'advanced',
          label: 'Tier 3: Distributed Systems & Cloud',
          sublabel: 'System Design, Microservices, CI/CD, Redis caching, high load',
          badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
          borderColor: 'border-purple-200',
          bgLight: 'bg-purple-50/60',
          targetTopics: [
            'High-Concurrency Microservices Architecture',
            'Message Queues & Event Streaming',
            'Database Sharding & Read Replicas',
          ],
        },
      ],
      agendaTitle: 'Full-Stack Curriculum Milestones',
      agendaSubtitle: 'Milestones are organized by level tier to give each cohort clear learning objectives.',
      milestones: [
        {
          id: 'ms-c1',
          tier: 'beginner',
          title: 'JavaScript ES6: Arrow Functions, Map, Filter & Reduce',
          targetMinutes: 20,
          done: true,
        },
        {
          id: 'ms-c2',
          tier: 'beginner',
          title: 'DOM Events & Asynchronous Fetch API Requests',
          targetMinutes: 20,
          done: false,
        },
        {
          id: 'ms-c3',
          tier: 'intermediate',
          title: 'React 19: Server Actions & Optimistic State Mutations',
          targetMinutes: 20,
          done: true,
        },
        {
          id: 'ms-c4',
          tier: 'intermediate',
          title: 'Building Strongly-Typed Next.js REST & GraphQL APIs',
          targetMinutes: 20,
          done: false,
        },
        {
          id: 'ms-c5',
          tier: 'advanced',
          title: 'Distributed Systems: Microservices & Event Streams',
          targetMinutes: 20,
          done: true,
        },
        {
          id: 'ms-c6',
          tier: 'advanced',
          title: 'Redis Cache Layer Invalidation & High-Throughput Load Testing',
          targetMinutes: 20,
          done: false,
        },
      ],
      rubricTitle: 'Software Engineering Competency Rubric',
      rubricCriteria: [
        {
          id: 'rc-c1',
          name: 'Algorithmic Efficiency & Big-O Time Complexity',
          desc: 'Optimal loop structures, hash maps vs nested arrays',
          maxScore: 5,
        },
        {
          id: 'rc-c2',
          name: 'React 19 & Clean Architecture Patterns',
          desc: 'Proper hook abstraction, optimistic state, server actions',
          maxScore: 5,
        },
        {
          id: 'rc-c3',
          name: 'TypeScript Strictness & Type Safety',
          desc: 'No any types, robust interfaces, generics where appropriate',
          maxScore: 5,
        },
        {
          id: 'rc-c4',
          name: 'Error Handling & Edge Cases',
          desc: 'Try/catch boundaries, loading skeletons, fallback UI handling',
          maxScore: 5,
        },
      ],
      forumChannels: [
        { id: 'all', label: 'All Channels', icon: 'Globe', description: 'All academy discussions and threads' },
        { id: 'general', label: 'General Discussion', icon: 'MessageSquare', description: 'General tech discussion and introductions' },
        { id: 'frontend', label: 'Frontend & UI Engineering', icon: 'Code2', description: 'React, Next.js, CSS, and component design' },
        { id: 'backend', label: 'Backend & Cloud DBs', icon: 'Server', description: 'API architecture, databases, and microservices' },
        { id: 'homework', label: 'Code Reviews & PRs', icon: 'Laptop', description: 'Pair programming and peer code review' },
        { id: 'career', label: 'Career & Portfolio', icon: 'Rocket', description: 'Job searches, interview prep, and project showcases' },
      ],
    };
  }

  if (nicheType === 'school') {
    return {
      breakoutPodsTitle: 'Academic Grade Study Pods',
      breakoutPodsSubtitle: 'Students collaborate in focused pods tailored to their level tier, allowing tailored pacing without overwhelming beginners or slowing down advanced learners.',
      pods: [
        {
          id: 'beginner',
          tier: 'beginner',
          label: 'Grade 9: Foundation & Core Syllabi',
          sublabel: 'Algebra I, Biology foundations, Intro Essay Composition',
          badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          borderColor: 'border-emerald-200',
          bgLight: 'bg-emerald-50/60',
          targetTopics: [
            'Polynomial Equations & Graphing',
            'Cellular Respiration & Photosynthesis',
            'Thesis Statement Structure & Argumentation',
          ],
        },
        {
          id: 'intermediate',
          tier: 'intermediate',
          label: 'Grade 11: Honors & AP Coursework',
          sublabel: 'AP Calculus AB, Organic Chemistry, Analytical Literature',
          badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
          borderColor: 'border-blue-200',
          bgLight: 'bg-blue-50/60',
          targetTopics: [
            'Taylor & Maclaurin Series',
            'Chemical Reaction Kinetics & Equilibrium',
            'Rhetorical Analysis & Synthesis',
          ],
        },
        {
          id: 'advanced',
          tier: 'advanced',
          label: 'Grade 12: Senior Capstone & Honors',
          sublabel: 'Multivariable Calculus, Advanced Physics, Capstone Thesis',
          badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
          borderColor: 'border-purple-200',
          bgLight: 'bg-purple-50/60',
          targetTopics: [
            "Stokes' & Green's Theorems on Surfaces",
            'Quantum Mechanics Intro & Wave Equations',
            'Peer-Reviewed Capstone Defense',
          ],
        },
      ],
      agendaTitle: 'Academic Syllabi & Lecture Agenda',
      agendaSubtitle: 'Milestones are organized by level tier to give each cohort clear learning objectives.',
      milestones: [
        {
          id: 'ms-s1',
          tier: 'beginner',
          title: 'Algebra I: Solving Linear Inequalities & Graphing',
          targetMinutes: 20,
          done: true,
        },
        {
          id: 'ms-s2',
          tier: 'beginner',
          title: 'Biology: Cell Membrane Transport & Osmosis',
          targetMinutes: 20,
          done: false,
        },
        {
          id: 'ms-s3',
          tier: 'intermediate',
          title: 'AP Calculus AB: Taylor & Maclaurin Polynomial Proofs',
          targetMinutes: 20,
          done: true,
        },
        {
          id: 'ms-s4',
          tier: 'intermediate',
          title: 'Organic Chemistry: Nucleophilic Substitution Mechanisms',
          targetMinutes: 20,
          done: false,
        },
        {
          id: 'ms-s5',
          tier: 'advanced',
          title: "Multivariable Calculus: Stokes' Theorem on Surfaces",
          targetMinutes: 20,
          done: true,
        },
        {
          id: 'ms-s6',
          tier: 'advanced',
          title: 'Senior Honors Capstone: Peer Literature Defense',
          targetMinutes: 20,
          done: false,
        },
      ],
      rubricTitle: 'Academic Mastery & Proof Rubric',
      rubricCriteria: [
        {
          id: 'rc-s1',
          name: 'Mathematical Proof & Theoretical Rigor',
          desc: 'Step-by-step logic, correct theorem citations and assumptions',
          maxScore: 5,
        },
        {
          id: 'rc-s2',
          name: 'Computational Accuracy & Derivation Steps',
          desc: 'Precision in calculation steps, algebraic simplification',
          maxScore: 5,
        },
        {
          id: 'rc-s3',
          name: 'Critical Reasoning & Problem Synthesis',
          desc: 'Applying foundational principles to novel problem sets',
          maxScore: 5,
        },
        {
          id: 'rc-s4',
          name: 'Clarity of Solution Presentation',
          desc: 'Neat documentation, clean diagrams, clear final deductions',
          maxScore: 5,
        },
      ],
      forumChannels: [
        { id: 'all', label: 'All Channels', icon: 'Globe', description: 'All course and campus discussion channels' },
        { id: 'general', label: 'General School Announcements', icon: 'MessageSquare', description: 'Academic updates, calendar events, and announcements' },
        { id: 'stem', label: 'Mathematics & Science Hall', icon: 'BookOpen', description: 'STEM problem sets, laboratory questions, and derivations' },
        { id: 'humanities', label: 'Humanities & Literature', icon: 'Book', description: 'Essay feedback, history inquiries, and literature discussions' },
        { id: 'homework', label: 'Assignments & Study Groups', icon: 'Laptop', description: 'Weekly assignments, group work, and office hours' },
        { id: 'clubs', label: 'Extracurricular & Student Life', icon: 'Rocket', description: 'Student clubs, competitions, and extracurricular activities' },
      ],
    };
  }

  // DEFAULT / GENERAL (Professional training, poultry management, business, custom academies)
  const academyName = tenant?.name || 'Academy';
  return {
    breakoutPodsTitle: 'Level-Based Cohort Breakout Pods',
    breakoutPodsSubtitle: 'Students collaborate in focused pods tailored to their level tier, allowing tailored pacing without overwhelming beginners or slowing down advanced learners.',
    pods: [
      {
        id: 'beginner',
        tier: 'beginner',
        label: 'Level 1: Core Fundamentals & Principles',
        sublabel: 'Foundational concepts, core workflows, and introductory methods',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        borderColor: 'border-emerald-200',
        bgLight: 'bg-emerald-50/60',
        targetTopics: [
          'Core Terminology & Foundational Concepts',
          'Standard Operating Procedures & Workflows',
          'Introductory Practical Exercises & Safety',
        ],
      },
      {
        id: 'intermediate',
        tier: 'intermediate',
        label: 'Level 2: Applied Skills & Practice',
        sublabel: 'Hands-on execution, real-world case studies, and problem solving',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
        borderColor: 'border-blue-200',
        bgLight: 'bg-blue-50/60',
        targetTopics: [
          'Applied Practical Execution & Problem Solving',
          'Case Studies & Operational Best Practices',
          'Quality Control & Diagnostic Methods',
        ],
      },
      {
        id: 'advanced',
        tier: 'advanced',
        label: 'Level 3: Strategic Mastery & Capstone',
        sublabel: 'Advanced optimization, project management, and final evaluation',
        badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
        borderColor: 'border-purple-200',
        bgLight: 'bg-purple-50/60',
        targetTopics: [
          'Advanced Systems & Performance Optimization',
          'Independent Capstone Implementation',
          'Comprehensive Evaluation & Final Review',
        ],
      },
    ],
    agendaTitle: `${academyName} Curriculum Milestones`,
    agendaSubtitle: 'Milestones are organized by level tier to give each cohort clear learning objectives.',
    milestones: [
      {
        id: 'ms-g1',
        tier: 'beginner',
        title: 'Module 1: Orientation & Core Fundamentals Review',
        targetMinutes: 20,
        done: true,
      },
      {
        id: 'ms-g2',
        tier: 'beginner',
        title: 'Module 2: Practical Exercises & Skill Verification',
        targetMinutes: 25,
        done: false,
      },
      {
        id: 'ms-g3',
        tier: 'intermediate',
        title: 'Module 3: Hands-on Project Implementation',
        targetMinutes: 30,
        done: true,
      },
      {
        id: 'ms-g4',
        tier: 'intermediate',
        title: 'Module 4: In-depth Applied Case Studies & Analysis',
        targetMinutes: 25,
        done: false,
      },
      {
        id: 'ms-g5',
        tier: 'advanced',
        title: 'Module 5: Advanced Capstone Execution',
        targetMinutes: 30,
        done: true,
      },
      {
        id: 'ms-g6',
        tier: 'advanced',
        title: 'Module 6: Final Peer Review & Evaluation Defense',
        targetMinutes: 20,
        done: false,
      },
    ],
    rubricTitle: 'Competency & Performance Rubric',
    rubricCriteria: [
      {
        id: 'rc-g1',
        name: 'Conceptual Understanding & Foundations',
        desc: 'Demonstrates clear grasp of core principles, guidelines, and terminology',
        maxScore: 5,
      },
      {
        id: 'rc-g2',
        name: 'Practical Execution & Methodological Rigor',
        desc: 'Effectively applies knowledge to solve problems and complete exercises accurately',
        maxScore: 5,
      },
      {
        id: 'rc-g3',
        name: 'Quality of Work & Attention to Detail',
        desc: 'Maintains high standards of documentation, accuracy, and thoroughness',
        maxScore: 5,
      },
      {
        id: 'rc-g4',
        name: 'Communication & Problem Solving',
        desc: 'Clearly explains reasoning, methodology, findings, and collaborative deductions',
        maxScore: 5,
      },
    ],
    forumChannels: [
      { id: 'all', label: 'All Channels', icon: 'Globe', description: 'Combined view of all discussion topics' },
      { id: 'general', label: 'General Discussion & News', icon: 'MessageSquare', description: 'General announcements and introductions' },
      { id: 'lessons', label: 'Lessons & Coursework Q&A', icon: 'BookOpen', description: 'Inquiries regarding course lectures and practical modules' },
      { id: 'projects', label: 'Projects & Case Studies', icon: 'Laptop', description: 'Group collaboration, assignments, and case studies' },
      { id: 'study_groups', label: 'Study Groups & Peer Support', icon: 'Users', description: 'Peer study circles and collaborative problem solving' },
      { id: 'office_hours', label: 'Instructor Feedback & Office Hours', icon: 'Award', description: 'Direct consultations and feedback from instructors' },
    ],
  };
}

export function getClassroomConfig(tenant?: Partial<TenantConfig>): ClassroomCustomizationConfig {
  const defaults = getDefaultClassroomConfig(tenant);
  const sub = tenant?.subdomain || 'default';

  // Check tenant settings stored in tenant object
  const tenantClassroom = tenant?.settings?.classroom as Partial<ClassroomCustomizationConfig> | undefined;

  // Also check local storage for instant live overrides
  let localOverride: Partial<ClassroomCustomizationConfig> | null = null;
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(`classroom_config_${sub}`);
      if (saved) {
        localOverride = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse cached classroom config:', e);
    }
  }

  const merged: ClassroomCustomizationConfig = {
    breakoutPodsTitle: localOverride?.breakoutPodsTitle || tenantClassroom?.breakoutPodsTitle || defaults.breakoutPodsTitle,
    breakoutPodsSubtitle: localOverride?.breakoutPodsSubtitle || tenantClassroom?.breakoutPodsSubtitle || defaults.breakoutPodsSubtitle,
    pods: localOverride?.pods || tenantClassroom?.pods || defaults.pods,
    agendaTitle: localOverride?.agendaTitle || tenantClassroom?.agendaTitle || defaults.agendaTitle,
    agendaSubtitle: localOverride?.agendaSubtitle || tenantClassroom?.agendaSubtitle || defaults.agendaSubtitle,
    milestones: localOverride?.milestones || tenantClassroom?.milestones || defaults.milestones,
    rubricTitle: localOverride?.rubricTitle || tenantClassroom?.rubricTitle || defaults.rubricTitle,
    rubricCriteria: localOverride?.rubricCriteria || tenantClassroom?.rubricCriteria || defaults.rubricCriteria,
    forumChannels: localOverride?.forumChannels || tenantClassroom?.forumChannels || defaults.forumChannels,
  };

  return merged;
}

export function saveClassroomConfig(
  tenant: TenantConfig,
  updates: Partial<ClassroomCustomizationConfig>,
  updateTenantConfig: (updates: Partial<TenantConfig>) => void
): ClassroomCustomizationConfig {
  const current = getClassroomConfig(tenant);
  const merged: ClassroomCustomizationConfig = {
    ...current,
    ...updates,
  };

  // Persist locally
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`classroom_config_${tenant.subdomain}`, JSON.stringify(merged));
    } catch (e) {
      console.warn('Failed to store classroom config in localStorage:', e);
    }
  }

  // Update tenant settings and persist
  const updatedSettings = {
    ...(tenant.settings || {}),
    classroom: merged,
  };

  updateTenantConfig({
    settings: updatedSettings,
  });

  return merged;
}
