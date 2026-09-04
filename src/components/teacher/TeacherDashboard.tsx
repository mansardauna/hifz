import React, { useState, useMemo, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { ToastMessage } from '../ui/Toast';
import { Button, Card, Badge, Input, DataTablePagination } from '../ui';
import {
  Users,
  Award,
  CheckCircle2,
  Clock,
  Play,
  Pause,
  Star,
  BookOpen,
  Calendar,
  MessageSquare,
  Radio,
  Search,
  X,
  UserCheck,
  Code2,
  Settings,
  LogOut,
  Menu,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Terminal,
  FileCode2,
  GraduationCap,
  FileCheck2,
  GitPullRequest,
  Check,
  AlertTriangle,
  FolderGit2,
} from 'lucide-react';
import { LiveClassroomHub } from '../classroom/LiveClassroomHub';
import { LMSCommunityForum } from '../forum/LMSCommunityForum';
import { QuranLMSWorkspace } from '../../plugins/quran/QuranLMSWorkspace';
import { CodingSandboxWorkspace } from '../../plugins/coding/CodingSandboxWorkspace';

export type TeacherTab = 'students' | 'grading' | 'attendance' | 'classroom' | 'forum' | 'curriculum' | 'settings';

interface AssignedStudent {
  id: string;
  name: string;
  avatar: string;
  email: string;
  cohort: string;
  currentSurahOrTrack: string;
  currentAyahOrLesson: string;
  masteryPercent: number;
  attendancePercent: number;
  lastRecitationDate: string;
  lastEvaluationStatus: 'Mumtaz' | 'Jayyid Jiddan' | 'Jayyid' | 'Pending Review' | 'Approved PR' | 'Grade A+';
  recentGrade: string;
  parentPhone: string;
}

interface StudentSubmission {
  id: string;
  studentId: string;
  studentName: string;
  surahOrAssignment: string;
  ayahOrModule: string;
  submittedAt: string;
  audioUrl?: string;
  durationSeconds?: number;
  codeSnippet?: string;
  status: 'Pending' | 'Graded' | 'Needs Revision';
  currentGrade?: string;
  currentScore?: number;
  tajweedRating?: number;
  fluencyRating?: number;
  codeArchitectureRating?: number;
  timeComplexityRating?: number;
  conceptMasteryRating?: number;
  analyticalRating?: number;
  teacherRemarks?: string;
  mistakeTags?: string[];
}

interface TeacherDashboardProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onAddToast }) => {
  const { tenant, direction } = useTenant();
  const { user, logout } = useAuth();

  const isCodingNiche = tenant.niche === 'coding' || tenant.subdomain.includes('code');
  const isSchoolNiche = tenant.niche === 'school' || tenant.subdomain.includes('school') || tenant.subdomain.includes('horizon');
  const isMadrasatNiche = !isCodingNiche && !isSchoolNiche;

  const [activeTab, setActiveTab] = useState<TeacherTab>('students');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Student Search & Cohort Filter
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedCohort, setSelectedCohort] = useState('all');

  // Grading Modal & Evaluation State
  const [selectedSubmission, setSelectedSubmission] = useState<StudentSubmission | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [tajweedRating, setTajweedRating] = useState<number>(5);
  const [fluencyRating, setFluencyRating] = useState<number>(5);
  const [codeArchitectureRating, setCodeArchitectureRating] = useState<number>(5);
  const [timeComplexityRating, setTimeComplexityRating] = useState<number>(5);
  const [conceptMasteryRating, setConceptMasteryRating] = useState<number>(5);
  const [analyticalRating, setAnalyticalRating] = useState<number>(5);
  const [evaluationScore, setEvaluationScore] = useState<number>(95);
  const [selectedVerdict, setSelectedVerdict] = useState<string>(
    isCodingNiche ? 'Approved PR' : isSchoolNiche ? 'Grade A+' : 'Mumtaz'
  );
  const [evaluationNotes, setEvaluationNotes] = useState('');
  const [selectedMistakeTags, setSelectedMistakeTags] = useState<string[]>([]);

  // Attendance Sheet State
  const [attendanceDate, setAttendanceDate] = useState('2026-09-04');
  const [attendanceState, setAttendanceState] = useState<Record<string, 'present' | 'late' | 'absent' | 'excused'>>({
    'std-1': 'present',
    'std-2': 'present',
    'std-3': 'late',
    'std-4': 'present',
    'std-5': 'excused',
    'std-6': 'present'
  });

  // Mock Assigned Students tailored per Academy Niche
  const [assignedStudents, setAssignedStudents] = useState<AssignedStudent[]>(() => {
    if (isCodingNiche) {
      return [
        {
          id: 'std-1',
          name: 'Zaid Al-Mansoor',
          avatar: 'ZM',
          email: 'zaid.dev@example.com',
          cohort: 'Full-Stack Next.js Bootcamp',
          currentSurahOrTrack: 'Full-Stack Next.js 14 App Router & SQL',
          currentAyahOrLesson: 'PR #42: Async Server Actions & Stripe Webhooks',
          masteryPercent: 96,
          attendancePercent: 98,
          lastRecitationDate: 'Today, 09:30 AM',
          lastEvaluationStatus: 'Pending Review',
          recentGrade: 'Approved PR (100%)',
          parentPhone: '+1 (555) 304-9912'
        },
        {
          id: 'std-2',
          name: 'Fatima Al-Zahra',
          avatar: 'FZ',
          email: 'fatima.codes@example.com',
          cohort: 'Full-Stack Next.js Bootcamp',
          currentSurahOrTrack: 'TypeScript Microservices & Event Architecture',
          currentAyahOrLesson: 'PR #48: Kafka Message Stream Producer',
          masteryPercent: 99,
          attendancePercent: 100,
          lastRecitationDate: 'Yesterday, 04:15 PM',
          lastEvaluationStatus: 'Approved PR',
          recentGrade: 'Approved PR (98%)',
          parentPhone: '+1 (555) 819-2044'
        },
        {
          id: 'std-3',
          name: 'Tariq Ibn Ziyad',
          avatar: 'TZ',
          email: 'tariq.py@example.com',
          cohort: 'Algorithms & LeetCode Pro',
          currentSurahOrTrack: 'Python DSA & Dynamic Programming',
          currentAyahOrLesson: 'PR #15: Dijkstra Shortest Path AST',
          masteryPercent: 88,
          attendancePercent: 92,
          lastRecitationDate: 'Sep 2, 2026',
          lastEvaluationStatus: 'Pending Review',
          recentGrade: 'Refactor Required (84%)',
          parentPhone: '+1 (555) 902-1845'
        },
        {
          id: 'std-4',
          name: 'Omar Farooq',
          avatar: 'OF',
          email: 'omar.go@example.com',
          cohort: 'Full-Stack Next.js Bootcamp',
          currentSurahOrTrack: 'FastAPI Backend & Async SQLAlchemy',
          currentAyahOrLesson: 'PR #29: Token Auth JWT & Rate Limiting',
          masteryPercent: 91,
          attendancePercent: 96,
          lastRecitationDate: 'Today, 10:15 AM',
          lastEvaluationStatus: 'Pending Review',
          recentGrade: 'Approved PR (92%)',
          parentPhone: '+1 (555) 441-9923'
        },
        {
          id: 'std-5',
          name: 'Aisha Siddiqa',
          avatar: 'AS',
          email: 'aisha.ml@example.com',
          cohort: 'Algorithms & LeetCode Pro',
          currentSurahOrTrack: 'PyTorch Neural Networks & Deep Learning',
          currentAyahOrLesson: 'PR #09: CNN Image Classification Pipeline',
          masteryPercent: 97,
          attendancePercent: 95,
          lastRecitationDate: 'Sep 1, 2026',
          lastEvaluationStatus: 'Approved PR',
          recentGrade: 'Approved PR (100%)',
          parentPhone: '+1 (555) 773-1029'
        },
        {
          id: 'std-6',
          name: 'Hamza Al-Qasim',
          avatar: 'HQ',
          email: 'hamza.rust@example.com',
          cohort: 'Systems Engineering in Rust',
          currentSurahOrTrack: 'Rust Memory Safety & Concurrency',
          currentAyahOrLesson: 'PR #04: Multi-threaded Threadpool Scheduler',
          masteryPercent: 85,
          attendancePercent: 88,
          lastRecitationDate: 'Aug 30, 2026',
          lastEvaluationStatus: 'Pending Review',
          recentGrade: 'Pending Review',
          parentPhone: '+1 (555) 662-8819'
        }
      ];
    }

    if (isSchoolNiche) {
      return [
        {
          id: 'std-1',
          name: 'Zaid Al-Mansoor',
          avatar: 'ZM',
          email: 'zaid.stu@horizon.edu',
          cohort: 'Grade 11 - STEM Honors',
          currentSurahOrTrack: 'AP Calculus AB & Advanced Physics',
          currentAyahOrLesson: 'Unit 4: Definite Integrals & Fundamental Theorem',
          masteryPercent: 95,
          attendancePercent: 98,
          lastRecitationDate: 'Today, 09:30 AM',
          lastEvaluationStatus: 'Pending Review',
          recentGrade: 'Grade A+ (98%)',
          parentPhone: '+1 (555) 304-9912'
        },
        {
          id: 'std-2',
          name: 'Fatima Al-Zahra',
          avatar: 'FZ',
          email: 'fatima.stu@horizon.edu',
          cohort: 'Grade 11 - STEM Honors',
          currentSurahOrTrack: 'AP Chemistry & Organic Molecular Synthesis',
          currentAyahOrLesson: 'Unit 5: Chemical Kinetics & Reaction Mechanisms',
          masteryPercent: 98,
          attendancePercent: 100,
          lastRecitationDate: 'Yesterday, 04:15 PM',
          lastEvaluationStatus: 'Grade A+',
          recentGrade: 'Grade A+ (99%)',
          parentPhone: '+1 (555) 819-2044'
        },
        {
          id: 'std-3',
          name: 'Tariq Ibn Ziyad',
          avatar: 'TZ',
          email: 'tariq.stu@horizon.edu',
          cohort: 'Grade 10 - Global Honors',
          currentSurahOrTrack: 'World History & Macroeconomics',
          currentAyahOrLesson: 'Unit 3: Industrial Revolution & Global Trade',
          masteryPercent: 88,
          attendancePercent: 92,
          lastRecitationDate: 'Sep 2, 2026',
          lastEvaluationStatus: 'Grade A+',
          recentGrade: 'Grade A- (89%)',
          parentPhone: '+1 (555) 902-1845'
        },
        {
          id: 'std-4',
          name: 'Omar Farooq',
          avatar: 'OF',
          email: 'omar.stu@horizon.edu',
          cohort: 'Grade 11 - STEM Honors',
          currentSurahOrTrack: 'English Literature & Rhetorical Analysis',
          currentAyahOrLesson: 'Unit 2: Critical Argumentative Essay on Hamlet',
          masteryPercent: 91,
          attendancePercent: 96,
          lastRecitationDate: 'Today, 10:15 AM',
          lastEvaluationStatus: 'Pending Review',
          recentGrade: 'Grade B+ (88%)',
          parentPhone: '+1 (555) 441-9923'
        },
        {
          id: 'std-5',
          name: 'Aisha Siddiqa',
          avatar: 'AS',
          email: 'aisha.stu@horizon.edu',
          cohort: 'Grade 11 - STEM Honors',
          currentSurahOrTrack: 'AP Biology & Genetics Lab',
          currentAyahOrLesson: 'Unit 6: CRISPR Gene Editing & PCR Replication',
          masteryPercent: 96,
          attendancePercent: 95,
          lastRecitationDate: 'Sep 1, 2026',
          lastEvaluationStatus: 'Grade A+',
          recentGrade: 'Grade A+ (97%)',
          parentPhone: '+1 (555) 773-1029'
        },
        {
          id: 'std-6',
          name: 'Hamza Al-Qasim',
          avatar: 'HQ',
          email: 'hamza.stu@horizon.edu',
          cohort: 'Grade 10 - Global Honors',
          currentSurahOrTrack: 'Algebra II & Trigonometry',
          currentAyahOrLesson: 'Unit 4: Polynomial Functions & Complex Roots',
          masteryPercent: 84,
          attendancePercent: 88,
          lastRecitationDate: 'Aug 30, 2026',
          lastEvaluationStatus: 'Pending Review',
          recentGrade: 'Grade B (82%)',
          parentPhone: '+1 (555) 662-8819'
        }
      ];
    }

    // Default: Madrasat Quran & Tajweed
    return [
      {
        id: 'std-1',
        name: 'Zaid Al-Mansoor',
        avatar: 'ZM',
        email: 'zaid@example.com',
        cohort: 'Morning Hifz Cohort A',
        currentSurahOrTrack: 'Surah Al-Mulk (الملك)',
        currentAyahOrLesson: 'Ayahs 1 - 15',
        masteryPercent: 94,
        attendancePercent: 98,
        lastRecitationDate: 'Today, 09:30 AM',
        lastEvaluationStatus: 'Pending Review',
        recentGrade: 'Mumtaz (A+)',
        parentPhone: '+1 (555) 304-9912'
      },
      {
        id: 'std-2',
        name: 'Fatima Al-Zahra',
        avatar: 'FZ',
        email: 'fatima@example.com',
        cohort: 'Morning Hifz Cohort A',
        currentSurahOrTrack: 'Surah Maryam (مريم)',
        currentAyahOrLesson: 'Ayahs 20 - 45',
        masteryPercent: 98,
        attendancePercent: 100,
        lastRecitationDate: 'Yesterday, 04:15 PM',
        lastEvaluationStatus: 'Mumtaz',
        recentGrade: 'Mumtaz (A+)',
        parentPhone: '+1 (555) 819-2044'
      },
      {
        id: 'std-3',
        name: 'Tariq Ibn Ziyad',
        avatar: 'TZ',
        email: 'tariq@example.com',
        cohort: 'Advanced Tajweed Circle',
        currentSurahOrTrack: 'Surah Al-Kahf (الكهف)',
        currentAyahOrLesson: 'Ayahs 1 - 10',
        masteryPercent: 88,
        attendancePercent: 92,
        lastRecitationDate: 'Sep 2, 2026',
        lastEvaluationStatus: 'Jayyid Jiddan',
        recentGrade: 'Jayyid Jiddan (A)',
        parentPhone: '+1 (555) 902-1845'
      },
      {
        id: 'std-4',
        name: 'Omar Farooq',
        avatar: 'OF',
        email: 'omar@example.com',
        cohort: 'Morning Hifz Cohort A',
        currentSurahOrTrack: 'Surah Yasin (يس)',
        currentAyahOrLesson: 'Ayahs 1 - 25',
        masteryPercent: 91,
        attendancePercent: 96,
        lastRecitationDate: 'Today, 10:15 AM',
        lastEvaluationStatus: 'Pending Review',
        recentGrade: 'Jayyid (B)',
        parentPhone: '+1 (555) 441-9923'
      },
      {
        id: 'std-5',
        name: 'Aisha Siddiqa',
        avatar: 'AS',
        email: 'aisha@example.com',
        cohort: 'Advanced Tajweed Circle',
        currentSurahOrTrack: 'Surah Ar-Rahman (الرحمن)',
        currentAyahOrLesson: 'Ayahs 1 - 30',
        masteryPercent: 96,
        attendancePercent: 95,
        lastRecitationDate: 'Sep 1, 2026',
        lastEvaluationStatus: 'Mumtaz',
        recentGrade: 'Mumtaz (A+)',
        parentPhone: '+1 (555) 773-1029'
      },
      {
        id: 'std-6',
        name: 'Hamza Al-Qasim',
        avatar: 'HQ',
        email: 'hamza@example.com',
        cohort: 'Evening Revision Circle',
        currentSurahOrTrack: 'Surah Al-Waqi&apos;ah (الواقعة)',
        currentAyahOrLesson: 'Ayahs 1 - 20',
        masteryPercent: 84,
        attendancePercent: 88,
        lastRecitationDate: 'Aug 30, 2026',
        lastEvaluationStatus: 'Pending Review',
        recentGrade: 'Jayyid (B)',
        parentPhone: '+1 (555) 662-8819'
      }
    ];
  });

  // Mock Submissions tailored per Academy Niche
  const [submissions, setSubmissions] = useState<StudentSubmission[]>(() => {
    if (isCodingNiche) {
      return [
        {
          id: 'sub-1',
          studentId: 'std-1',
          studentName: 'Zaid Al-Mansoor',
          surahOrAssignment: 'Repo: nextjs-ecommerce-storefront',
          ayahOrModule: 'PR #42: Async Server Actions & Stripe Checkout Webhooks',
          submittedAt: 'Today at 09:30 AM',
          codeSnippet: `// Server Action: Handle secure checkout session
export async function createCheckoutSession(cartItems: CartItem[]) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: cartItems.map(item => ({
      price_data: { currency: 'usd', product_data: { name: item.name }, unit_amount: item.price * 100 },
      quantity: item.quantity,
    })),
    mode: 'payment',
    success_url: \`\${process.env.APP_URL}/success?session_id={CHECKOUT_SESSION_ID}\`,
  });
  return { sessionId: session.id, url: session.url };
}`,
          status: 'Pending',
          mistakeTags: ['Clean Architecture', 'Unit Tests Passed', 'TypeScript Strict']
        },
        {
          id: 'sub-2',
          studentId: 'std-4',
          studentName: 'Omar Farooq',
          surahOrAssignment: 'Repo: fastapi-distributed-queue',
          ayahOrModule: 'PR #29: JWT Auth Middleware with Redis Token Revocation',
          submittedAt: 'Today at 10:15 AM',
          codeSnippet: `@app.middleware("http")
async def verify_jwt_token(request: Request, call_next):
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if await redis_client.get(f"revoked:{token}"):
        raise HTTPException(status_code=401, detail="Token revoked")
    return await call_next(request)`,
          status: 'Pending',
          mistakeTags: ['Time Complexity O(1)', 'Edge Case Coverage']
        },
        {
          id: 'sub-3',
          studentId: 'std-6',
          studentName: 'Hamza Al-Qasim',
          surahOrAssignment: 'Repo: rust-threadpool-core',
          ayahOrModule: 'PR #04: Mutex Channel Worker Scheduler Implementation',
          submittedAt: 'Yesterday at 07:45 PM',
          codeSnippet: `pub struct ThreadPool {
    workers: Vec<Worker>,
    sender: Option<mpsc::Sender<Job>>,
}

impl ThreadPool {
    pub fn execute<F>(&self, f: F) where F: FnOnce() + Send + 'static {
        let job = Box::new(f);
        self.sender.as_ref().unwrap().send(job).unwrap();
    }
}`,
          status: 'Pending',
          mistakeTags: ['Async Safety']
        }
      ];
    }

    if (isSchoolNiche) {
      return [
        {
          id: 'sub-1',
          studentId: 'std-1',
          studentName: 'Zaid Al-Mansoor',
          surahOrAssignment: 'AP Calculus AB',
          ayahOrModule: 'Problem Set 4: Integration by Parts & Riemann Limits',
          submittedAt: 'Today at 09:30 AM',
          status: 'Pending',
          mistakeTags: ['Analytical Rigor', 'Correct Formulas', 'Clear Steps']
        },
        {
          id: 'sub-2',
          studentId: 'std-4',
          studentName: 'Omar Farooq',
          surahOrAssignment: 'English Literature Honors',
          ayahOrModule: 'Essay: Existential Soliloquy Analysis in Act III of Hamlet',
          submittedAt: 'Today at 10:15 AM',
          status: 'Pending',
          mistakeTags: ['Strong Thesis Statement', 'MLA Citations Verified']
        },
        {
          id: 'sub-3',
          studentId: 'std-6',
          studentName: 'Hamza Al-Qasim',
          surahOrAssignment: 'Algebra II & Trigonometry',
          ayahOrModule: 'Midterm Exam: Complex Polynomial Roots & Factoring',
          submittedAt: 'Yesterday at 07:45 PM',
          status: 'Pending',
          mistakeTags: ['Calculation Precision']
        }
      ];
    }

    // Default: Madrasat Quran
    return [
      {
        id: 'sub-1',
        studentId: 'std-1',
        studentName: 'Zaid Al-Mansoor',
        surahOrAssignment: 'Surah Al-Mulk (الملك)',
        ayahOrModule: 'Ayahs 1 - 10 (Memorization Homework)',
        submittedAt: 'Today at 09:30 AM',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/5242.mp3',
        durationSeconds: 125,
        status: 'Pending',
        mistakeTags: ['Qalqalah Kubra', 'Noon Sakinah']
      },
      {
        id: 'sub-2',
        studentId: 'std-4',
        studentName: 'Omar Farooq',
        surahOrAssignment: 'Surah Yasin (يس)',
        ayahOrModule: 'Ayahs 1 - 25 (Halaqah Muraja&apos;ah)',
        submittedAt: 'Today at 10:15 AM',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/3706.mp3',
        durationSeconds: 180,
        status: 'Pending',
        mistakeTags: ['Madd Munfasil']
      },
      {
        id: 'sub-3',
        studentId: 'std-6',
        studentName: 'Hamza Al-Qasim',
        surahOrAssignment: 'Surah Al-Waqi&apos;ah (الواقعة)',
        ayahOrModule: 'Ayahs 1 - 20 (Oral Test Recitation)',
        submittedAt: 'Yesterday at 07:45 PM',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/4946.mp3',
        durationSeconds: 145,
        status: 'Pending',
        mistakeTags: ['Ikhfaa Timing']
      }
    ];
  });

  // Pagination for Students
  const [studentPage, setStudentPage] = useState<number>(1);
  const [studentPageSize, setStudentPageSize] = useState<number>(6);

  // Submissions sorting & pagination
  const [submissionSortField, setSubmissionSortField] = useState<'studentName' | 'submittedAt' | 'status'>('submittedAt');
  const [submissionSortDir, setSubmissionSortDir] = useState<'asc' | 'desc'>('desc');
  const [submissionPage, setSubmissionPage] = useState<number>(1);
  const [submissionPageSize, setSubmissionPageSize] = useState<number>(10);

  useEffect(() => {
    setStudentPage(1);
  }, [studentSearch, selectedCohort, studentPageSize]);

  // Filtered students
  const filteredStudents = useMemo(() => {
    return assignedStudents.filter((std) => {
      const matchesSearch =
        std.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        std.currentSurahOrTrack.toLowerCase().includes(studentSearch.toLowerCase());
      const matchesCohort = selectedCohort === 'all' || std.cohort === selectedCohort;
      return matchesSearch && matchesCohort;
    });
  }, [assignedStudents, studentSearch, selectedCohort]);

  const paginatedStudents = useMemo(() => {
    const start = (studentPage - 1) * studentPageSize;
    return filteredStudents.slice(start, start + studentPageSize);
  }, [filteredStudents, studentPage, studentPageSize]);

  // Filtered & Sorted Submissions
  const filteredAndSortedSubmissions = useMemo(() => {
    const result = [...submissions];
    result.sort((a, b) => {
      let valA: any = a[submissionSortField] || '';
      let valB: any = b[submissionSortField] || '';
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return submissionSortDir === 'asc' ? -1 : 1;
      if (valA > valB) return submissionSortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [submissions, submissionSortField, submissionSortDir]);

  const paginatedSubmissions = useMemo(() => {
    const start = (submissionPage - 1) * submissionPageSize;
    return filteredAndSortedSubmissions.slice(start, start + submissionPageSize);
  }, [filteredAndSortedSubmissions, submissionPage, submissionPageSize]);

  // Cohort list
  const cohorts = useMemo(() => {
    const set = new Set(assignedStudents.map((s) => s.cohort));
    return ['all', ...Array.from(set)];
  }, [assignedStudents]);

  // Handle open grading modal
  const handleOpenGrading = (sub: StudentSubmission) => {
    setSelectedSubmission(sub);
    setTajweedRating(sub.tajweedRating || 5);
    setFluencyRating(sub.fluencyRating || 5);
    setCodeArchitectureRating(sub.codeArchitectureRating || 5);
    setTimeComplexityRating(sub.timeComplexityRating || 5);
    setConceptMasteryRating(sub.conceptMasteryRating || 5);
    setAnalyticalRating(sub.analyticalRating || 5);
    setEvaluationScore(sub.currentScore || 95);
    setEvaluationNotes(sub.teacherRemarks || '');
    setSelectedVerdict(
      isCodingNiche ? 'Approved PR' : isSchoolNiche ? 'Grade A+' : 'Mumtaz'
    );
    setSelectedMistakeTags(sub.mistakeTags || []);
  };

  // Submit Grade & Evaluation
  const handleSaveEvaluation = () => {
    if (!selectedSubmission) return;

    const isRevision = selectedVerdict === 'Iadah' || selectedVerdict === 'Needs Refactor' || selectedVerdict === 'Needs Revision';

    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === selectedSubmission.id
          ? {
              ...sub,
              status: isRevision ? 'Needs Revision' : 'Graded',
              currentGrade: `${selectedVerdict} (${evaluationScore}%)`,
              currentScore: evaluationScore,
              tajweedRating,
              fluencyRating,
              codeArchitectureRating,
              timeComplexityRating,
              conceptMasteryRating,
              analyticalRating,
              teacherRemarks: evaluationNotes,
              mistakeTags: selectedMistakeTags
            }
          : sub
      )
    );

    // Update student's evaluation status in list
    setAssignedStudents((prev) =>
      prev.map((std) =>
        std.id === selectedSubmission.studentId
          ? {
              ...std,
              lastEvaluationStatus: isRevision ? 'Pending Review' : (selectedVerdict as any),
              recentGrade: `${selectedVerdict} (${evaluationScore}%)`
            }
          : std
      )
    );

    onAddToast({
      type: 'success',
      title: 'Evaluation Published',
      message: `Grade (${selectedVerdict}) published for ${selectedSubmission.studentName}. Student portal updated.`
    });

    setSelectedSubmission(null);
    setIsPlayingAudio(false);
  };

  // Toggle Mistake / Rubric Tag
  const toggleMistakeTag = (tag: string) => {
    if (selectedMistakeTags.includes(tag)) {
      setSelectedMistakeTags(selectedMistakeTags.filter((t) => t !== tag));
    } else {
      setSelectedMistakeTags([...selectedMistakeTags, tag]);
    }
  };

  // Set Attendance for a student
  const setAttendance = (studentId: string, status: 'present' | 'late' | 'absent' | 'excused') => {
    setAttendanceState((prev) => ({ ...prev, [studentId]: status }));
  };

  // Save Attendance Sheet
  const handleSaveAttendance = () => {
    onAddToast({
      type: 'success',
      title: 'Roll Call Recorded',
      message: `Attendance log for ${assignedStudents.length} students saved for ${attendanceDate}.`
    });
  };

  // Persona titles based on niche
  const teacherPersona = useMemo(() => {
    if (isCodingNiche) {
      return {
        defaultName: 'Alex Chen (Staff Architect)',
        title: 'Senior Engineering Mentor',
        badge: 'Staff Reviewer',
        classroomName: 'Live Code Huddle / Pair Room',
        forumName: 'Developer Community Forum',
        curriculumName: 'Interactive Coding Sandbox',
        evaluateAction: 'Review PR & Code',
        studentsMetric: 'Active Mentees',
        pendingMetric: 'Pending Pull Requests',
        masteryMetric: 'Test Suite Pass Rate',
        masteryValue: '97.4%',
      };
    }
    if (isSchoolNiche) {
      return {
        defaultName: 'Dr. Eleanor Vance',
        title: 'Department Chair & Faculty',
        badge: 'Certified Faculty',
        classroomName: 'Live Virtual Classroom',
        forumName: 'Academic Subject Forum',
        curriculumName: 'Academic Syllabus & Gradebook',
        evaluateAction: 'Grade Exam / Paper',
        studentsMetric: 'Enrolled Students',
        pendingMetric: 'Pending Submissions',
        masteryMetric: 'Average Class GPA',
        masteryValue: '3.86 / 4.0',
      };
    }
    return {
      defaultName: 'Shaykh Bilal Hashmi',
      title: 'Certified Sheikh & Murabbi',
      badge: 'Certified Sheikh',
      classroomName: 'Live Video Halaqah',
      forumName: 'Halaqah Group Forum',
      curriculumName: 'Mushaf Reader & Tajweed',
      evaluateAction: 'Rate Recitation',
      studentsMetric: 'Assigned Students',
      pendingMetric: 'Pending Recitations',
      masteryMetric: 'Memorization Mastery',
      masteryValue: '92%',
    };
  }, [isCodingNiche, isSchoolNiche]);

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-slate-100 font-sans text-slate-900" dir={direction}>
      {/* Mobile Drawer Backdrop */}
      {isMobileNavOpen && (
        <div
          onClick={() => setIsMobileNavOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* 1. Fixed Teacher Left Sidebar (Dynamic Background & White Label) */}
      <aside
        style={{ backgroundColor: 'var(--sidebar-bg, #0f172a)' }}
        className={`w-64 xl:w-72 h-full flex flex-col justify-between text-slate-200 border-r border-slate-800 shrink-0 select-none z-30 transition-transform duration-300 ${
          isMobileNavOpen
            ? 'fixed inset-y-0 left-0 shadow-2xl translate-x-0'
            : 'hidden lg:flex'
        }`}
      >
        <div className="flex flex-col h-full min-h-0">
          {/* Academy Brand Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-black/20">
            <div className="flex items-center gap-3 min-w-0">
              <div
                style={{ backgroundColor: 'var(--color-primary, #047857)' }}
                className="w-9 h-9 rounded-xl text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md"
              >
                {isCodingNiche ? <Code2 className="w-4.5 h-4.5" /> : isSchoolNiche ? <GraduationCap className="w-4.5 h-4.5" /> : <BookOpen className="w-4.5 h-4.5" />}
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-xs sm:text-sm text-white truncate">{tenant.name}</h2>
                <p className="text-[10px] sm:text-[11px] text-white/60 font-mono truncate">{tenant.subdomain}.ankabit.app</p>
              </div>
            </div>

            {isMobileNavOpen && (
              <button
                onClick={() => setIsMobileNavOpen(false)}
                className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                aria-label="Close navigation"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Teacher Profile Snapshot in Sidebar */}
          <div className="p-3.5 mx-3.5 my-3 bg-white/5 rounded-2xl border border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                {(user?.name || teacherPersona.defaultName).charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-xs sm:text-sm text-white truncate">{user?.name || teacherPersona.defaultName}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">{teacherPersona.badge}</span>
                </div>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <span>{assignedStudents.length} {isCodingNiche ? 'Mentees' : 'Students'}</span>
              <span className="font-bold text-emerald-400">
                {submissions.filter((s) => s.status === 'Pending').length} To Review
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 overflow-y-auto px-3.5 space-y-1.5 min-h-0 py-1">
            {[
              { id: 'students' as TeacherTab, label: isCodingNiche ? 'My Mentees & Repos' : 'Assigned Students', icon: Users, badge: assignedStudents.length },
              { id: 'grading' as TeacherTab, label: isCodingNiche ? 'PR Review Studio' : isSchoolNiche ? 'Gradebook Studio' : 'Grading & Rating Studio', icon: isCodingNiche ? GitPullRequest : Award, badge: submissions.filter((s) => s.status === 'Pending').length, badgeColor: 'bg-amber-500 text-slate-950 font-bold' },
              { id: 'classroom' as TeacherTab, label: teacherPersona.classroomName, icon: Radio, badge: 'Live', badgeColor: 'bg-rose-600 text-white' },
              { id: 'attendance' as TeacherTab, label: 'Daily Roll Call & Roster', icon: Calendar },
              { id: 'forum' as TeacherTab, label: teacherPersona.forumName, icon: MessageSquare },
              { id: 'curriculum' as TeacherTab, label: teacherPersona.curriculumName, icon: isCodingNiche ? Code2 : BookOpen },
              { id: 'settings' as TeacherTab, label: 'Instructor Settings', icon: Settings }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileNavOpen(false);
                  }}
                  style={isActive ? { backgroundColor: 'var(--color-primary, #047857)' } : {}}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer select-none ${
                    isActive
                      ? 'text-white shadow-md font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom Fixed Logout Bar */}
          <div className="p-3.5 border-t border-slate-800 shrink-0 bg-black/20">
            <button
              onClick={() => logout()}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out (Faculty Session)</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Viewport */}
      <main className="flex-1 h-full overflow-y-auto flex flex-col min-w-0 bg-slate-100">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 sticky top-0 z-20 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
              aria-label="Open navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                  {teacherPersona.title}
                </h1>
                <Badge variant="primary" className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px]">
                  {tenant.name}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                {isCodingNiche
                  ? 'Git Pull Requests, Code Architecture Reviews, and Live Pairing Rooms'
                  : isSchoolNiche
                  ? 'Standardized Exam Scoring, Gradebook Records, and Faculty Advisory'
                  : 'Assigned Halaqahs, Homework Evaluations, and Live Recitation Grading'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setActiveTab('classroom')}
              className="font-bold text-xs shadow-xs"
              leftIcon={<Radio className="w-3.5 h-3.5" />}
            >
              {isCodingNiche ? 'Start Pair Room' : isSchoolNiche ? 'Launch Classroom' : 'Start Live Halaqah'}
            </Button>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <div className="p-4 sm:p-8 flex-1 space-y-6">
          {/* TAB 1: ASSIGNED STUDENTS / MENTEES */}
          {activeTab === 'students' && (
            <div className="space-y-6">
              {/* Metric Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-5 bg-white border border-slate-200 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-bold">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-slate-900">{assignedStudents.length}</div>
                    <div className="text-xs text-slate-500 font-semibold">{teacherPersona.studentsMetric}</div>
                  </div>
                </Card>

                <Card className="p-5 bg-white border border-slate-200 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center font-bold">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-slate-900">
                      {submissions.filter((s) => s.status === 'Pending').length}
                    </div>
                    <div className="text-xs text-slate-500 font-semibold">{teacherPersona.pendingMetric}</div>
                  </div>
                </Card>

                <Card className="p-5 bg-white border border-slate-200 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-slate-900">97.8%</div>
                    <div className="text-xs text-slate-500 font-semibold">Average Attendance</div>
                  </div>
                </Card>

                <Card className="p-5 bg-white border border-slate-200 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-slate-900">{teacherPersona.masteryValue}</div>
                    <div className="text-xs text-slate-500 font-semibold">{teacherPersona.masteryMetric}</div>
                  </div>
                </Card>
              </div>

              {/* Filter Bar */}
              <div className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 flex flex-col sm:flex-row items-center gap-3">
                  <div className="w-full sm:w-72">
                    <Input
                      placeholder={isCodingNiche ? "Search mentee or repo..." : "Search student..."}
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      leftIcon={<Search className="w-4 h-4" />}
                    />
                  </div>

                  <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
                    {cohorts.map((cohort) => (
                      <button
                        key={cohort}
                        onClick={() => setSelectedCohort(cohort)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                          selectedCohort === cohort
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cohort === 'all' ? 'All Cohorts' : cohort}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-slate-500 font-semibold">
                  Showing {filteredStudents.length} of {assignedStudents.length}
                </div>
              </div>

              {/* Students Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedStudents.map((std) => (
                  <Card
                    key={std.id}
                    className="p-6 bg-white border border-slate-200/90 rounded-2xl hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                            {std.avatar}
                          </div>
                          <div>
                            <h3 className="font-extrabold text-slate-900 text-sm">{std.name}</h3>
                            <p className="text-[11px] text-slate-500">{std.cohort}</p>
                          </div>
                        </div>

                        <Badge
                          variant={
                            std.lastEvaluationStatus === 'Mumtaz' || std.lastEvaluationStatus === 'Approved PR' || std.lastEvaluationStatus === 'Grade A+'
                              ? 'success'
                              : std.lastEvaluationStatus === 'Pending Review'
                              ? 'warning'
                              : 'primary'
                          }
                          className="text-[10px] font-bold"
                        >
                          {std.lastEvaluationStatus}
                        </Badge>
                      </div>

                      {/* Current Curriculum Target / Repo */}
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {isCodingNiche ? 'Assigned Track / Branch' : isSchoolNiche ? 'Subject / Current Unit' : 'Current Target'}
                        </div>
                        <div className="font-extrabold text-slate-900 text-xs truncate">{std.currentSurahOrTrack}</div>
                        <div className="text-[11px] text-slate-600 truncate">{std.currentAyahOrLesson}</div>
                      </div>

                      {/* Progress Stats */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-100">
                          <div className="text-[10px] text-emerald-800 font-semibold">
                            {isCodingNiche ? 'Tests Passing' : isSchoolNiche ? 'Academic Score' : 'Mastery'}
                          </div>
                          <div className="text-sm font-black text-emerald-700">{std.masteryPercent}%</div>
                        </div>
                        <div className="p-2 rounded-lg bg-blue-50/60 border border-blue-100">
                          <div className="text-[10px] text-blue-800 font-semibold">Attendance</div>
                          <div className="text-sm font-black text-blue-700">{std.attendancePercent}%</div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          const sub = submissions.find((s) => s.studentId === std.id);
                          if (sub) handleOpenGrading(sub);
                          else {
                            handleOpenGrading({
                              id: `sub-new-${Date.now()}`,
                              studentId: std.id,
                              studentName: std.name,
                              surahOrAssignment: std.currentSurahOrTrack,
                              ayahOrModule: std.currentAyahOrLesson,
                              submittedAt: 'Today',
                              status: 'Pending'
                            });
                          }
                        }}
                        className="flex-1 justify-center font-bold text-xs"
                      >
                        {teacherPersona.evaluateAction}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          onAddToast({
                            type: 'info',
                            title: 'Direct Chat',
                            message: `Opening direct communication thread for ${std.name} (${std.parentPhone})`
                          });
                        }}
                        className="text-slate-700 font-bold text-xs"
                      >
                        Message
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Students Pagination */}
              <DataTablePagination
                currentPage={studentPage}
                pageSize={studentPageSize}
                totalItems={filteredStudents.length}
                onPageChange={setStudentPage}
                onPageSizeChange={(newSize) => {
                  setStudentPageSize(newSize);
                  setStudentPage(1);
                }}
                pageSizeOptions={[6, 12, 24, 48]}
              />
            </div>
          )}

          {/* TAB 2: GRADING & RATING STUDIO */}
          {activeTab === 'grading' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    {isCodingNiche ? 'Pull Request & Code Review Studio' : isSchoolNiche ? 'Standardized Exam & Assignment Gradebook' : 'Recitation & Homework Evaluations'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {isCodingNiche
                      ? 'Review Git commits, run automated AST test suites, and publish feedback on code quality.'
                      : isSchoolNiche
                      ? 'Score essay rubrics, enter exam grades, and write cumulative report card assessments.'
                      : 'Listen to audio recordings, rate Makharij and Fluency, and publish grades.'}
                  </p>
                </div>
              </div>

              {/* Submissions Table */}
              <Card className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th
                          onClick={() => {
                            if (submissionSortField === 'studentName') {
                              setSubmissionSortDir((p) => (p === 'asc' ? 'desc' : 'asc'));
                            } else {
                              setSubmissionSortField('studentName');
                              setSubmissionSortDir('asc');
                            }
                          }}
                          className="py-3.5 px-4 cursor-pointer select-none hover:text-slate-900"
                        >
                          <div className="flex items-center gap-1.5">
                            <span>Student / Mentee</span>
                            {submissionSortField === 'studentName' ? (
                              submissionSortDir === 'asc' ? <ArrowUp className="w-3 h-3 text-emerald-600" /> : <ArrowDown className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <ArrowUpDown className="w-3 h-3 text-slate-300" />
                            )}
                          </div>
                        </th>
                        <th className="py-3.5 px-4">
                          {isCodingNiche ? 'Repository & PR Branch' : isSchoolNiche ? 'Course & Assignment Unit' : 'Surah & Target Ayahs'}
                        </th>
                        <th
                          onClick={() => {
                            if (submissionSortField === 'submittedAt') {
                              setSubmissionSortDir((p) => (p === 'asc' ? 'desc' : 'asc'));
                            } else {
                              setSubmissionSortField('submittedAt');
                              setSubmissionSortDir('asc');
                            }
                          }}
                          className="py-3.5 px-4 cursor-pointer select-none hover:text-slate-900"
                        >
                          <div className="flex items-center gap-1.5">
                            <span>Submitted</span>
                            {submissionSortField === 'submittedAt' ? (
                              submissionSortDir === 'asc' ? <ArrowUp className="w-3 h-3 text-emerald-600" /> : <ArrowDown className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <ArrowUpDown className="w-3 h-3 text-slate-300" />
                            )}
                          </div>
                        </th>
                        <th className="py-3.5 px-4">Evaluation Verdict</th>
                        <th className="py-3.5 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {paginatedSubmissions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-4 font-extrabold text-slate-900">
                            {sub.studentName}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-800">{sub.surahOrAssignment}</div>
                            <div className="text-[11px] text-slate-500">{sub.ayahOrModule}</div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                            {sub.submittedAt}
                          </td>
                          <td className="py-3.5 px-4">
                            <Badge
                              variant={
                                sub.status === 'Graded'
                                  ? 'success'
                                  : 'warning'
                              }
                            >
                              {sub.currentGrade || sub.status}
                            </Badge>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenGrading(sub)}
                              className="font-bold text-xs"
                            >
                              {sub.status === 'Graded' ? 'Review Grade' : 'Grade Submission'}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-3 border-t border-slate-200">
                  <DataTablePagination
                    currentPage={submissionPage}
                    pageSize={submissionPageSize}
                    totalItems={filteredAndSortedSubmissions.length}
                    onPageChange={setSubmissionPage}
                    onPageSizeChange={(newSize) => {
                      setSubmissionPageSize(newSize);
                      setSubmissionPage(1);
                    }}
                    pageSizeOptions={[5, 10, 20]}
                  />
                </div>
              </Card>
            </div>
          )}

          {/* TAB 3: LIVE CLASSROOM / PAIR ROOM */}
          {activeTab === 'classroom' && (
            <div className="space-y-4">
              <LiveClassroomHub
                userRole="teacher"
                currentUserName={user?.name || teacherPersona.defaultName}
                niche={tenant.niche}
                roomTitle={isCodingNiche ? 'Live Mentor Pairing & Code Review' : isSchoolNiche ? 'Live Virtual Lecture Room' : 'Live Quran Halaqah'}
                courseTitle={isCodingNiche ? 'Full-Stack Software Engineering' : isSchoolNiche ? 'Academic Faculty Hall' : 'Tajweed & Sanad Mastery'}
              />
            </div>
          )}

          {/* TAB 4: ATTENDANCE SHEET */}
          {activeTab === 'attendance' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Daily Roll Call & Attendance Log</h2>
                  <p className="text-xs text-slate-500">Record punctuality, track attendance percentages, and notify parents.</p>
                </div>

                <div className="flex items-center gap-3">
                  <Input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="w-40"
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSaveAttendance}
                    leftIcon={<CheckCircle2 className="w-4 h-4" />}
                    className="font-bold text-xs"
                  >
                    Save Roll Call
                  </Button>
                </div>
              </div>

              <Card className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Cohort</th>
                      <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {assignedStudents.map((std) => (
                      <tr key={std.id} className="hover:bg-slate-50">
                        <td className="py-3.5 px-4 font-bold text-slate-900">{std.name}</td>
                        <td className="py-3.5 px-4 text-slate-500">{std.cohort}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center justify-center gap-2">
                            {(['present', 'late', 'excused', 'absent'] as const).map((status) => (
                              <button
                                key={status}
                                onClick={() => setAttendance(std.id, status)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                                  attendanceState[std.id] === status
                                    ? status === 'present'
                                      ? 'bg-emerald-600 text-white shadow-xs'
                                      : status === 'late'
                                      ? 'bg-amber-500 text-slate-950 font-bold'
                                      : status === 'excused'
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-rose-600 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {/* TAB 5: FORUM */}
          {activeTab === 'forum' && (
            <div className="space-y-4">
              <LMSCommunityForum onAddToast={onAddToast} />
            </div>
          )}

          {/* TAB 6: CURRICULUM WORKSPACE */}
          {activeTab === 'curriculum' && (
            isCodingNiche ? (
              <div className="h-[calc(100vh-160px)] min-h-[600px] rounded-2xl overflow-hidden border border-slate-800">
                <CodingSandboxWorkspace tenantName={tenant.name} onAddToast={onAddToast} />
              </div>
            ) : isSchoolNiche ? (
              <Card className="p-6 bg-white border border-slate-200 rounded-2xl space-y-4">
                <h3 className="font-extrabold text-base text-slate-900">Academic Curriculum & Syllabus Studio</h3>
                <p className="text-xs text-slate-500">Manage lesson plans, course syllabi, problem sets, and reading lists.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="font-bold text-xs text-slate-900">AP Calculus AB</div>
                    <div className="text-[11px] text-slate-500">8 Units • 34 Lecture Notes • 12 Problem Sets</div>
                    <Badge variant="success">Active Syllabus</Badge>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="font-bold text-xs text-slate-900">AP Chemistry</div>
                    <div className="text-[11px] text-slate-500">10 Units • 20 Lab Experiments</div>
                    <Badge variant="success">Active Syllabus</Badge>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="font-bold text-xs text-slate-900">World History Honors</div>
                    <div className="text-[11px] text-slate-500">6 Units • 18 Primary Source Readings</div>
                    <Badge variant="success">Active Syllabus</Badge>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="rounded-2xl overflow-hidden">
                <QuranLMSWorkspace />
              </div>
            )
          )}

          {/* TAB 7: SETTINGS */}
          {activeTab === 'settings' && (
            <Card className="p-6 bg-white border border-slate-200 rounded-2xl max-w-2xl space-y-6">
              <div className="space-y-1">
                <h3 className="font-extrabold text-base text-slate-900">Instructor Profile Settings</h3>
                <p className="text-xs text-slate-500">Manage your faculty credentials and availability schedule.</p>
              </div>

              <div className="space-y-4">
                <Input label="Instructor Full Name" defaultValue={user?.name || teacherPersona.defaultName} />
                <Input label="Email Address" defaultValue={user?.email || 'faculty@academy.ankabit.app'} disabled />
                <Input label="Academic Qualification / Lineage" defaultValue={teacherPersona.title} />
                <Input label="Direct Contact WhatsApp" defaultValue="+1 (555) 234-8910" />
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={() => onAddToast({ type: 'success', title: 'Settings Saved', message: 'Instructor profile updated.' })}
                className="font-bold"
              >
                Save Changes
              </Button>
            </Card>
          )}
        </div>
      </main>

      {/* 3. Interactive Grading Drawer / Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden space-y-0 my-8">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    {isCodingNiche ? 'Pull Request Review' : isSchoolNiche ? 'Academic Evaluation' : 'Recitation Evaluation'}
                  </span>
                  <Badge variant="primary" className="bg-amber-950 text-amber-300 border-amber-500/30 text-[10px]">
                    {selectedSubmission.status}
                  </Badge>
                </div>
                <h2 className="text-lg font-black text-white mt-1">{selectedSubmission.studentName}</h2>
                <p className="text-xs text-slate-400 font-mono">{selectedSubmission.surahOrAssignment} • {selectedSubmission.ayahOrModule}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedSubmission(null);
                  setIsPlayingAudio(false);
                }}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* NICHE SPECIFIC MEDIA / PREVIEW */}
              {isCodingNiche ? (
                /* Code Snippet & AST Review Player */
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Terminal className="w-4 h-4 text-blue-600" />
                      Submitted Code Patch
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
                      ✓ 12/12 Unit Tests Passed (0.08s)
                    </span>
                  </div>
                  <pre className="p-4 bg-slate-950 text-emerald-400 font-mono text-xs rounded-2xl overflow-x-auto border border-slate-800">
                    {selectedSubmission.codeSnippet || '// Code submitted via GitHub Pull Request'}
                  </pre>
                </div>
              ) : isMadrasatNiche ? (
                /* Quran Recitation Audio Player */
                <div className="p-5 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between text-xs text-emerald-900 font-bold">
                    <span>Student Recitation Audio</span>
                    <span className="font-mono text-[11px]">02:05 / 02:05</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="w-12 h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-md cursor-pointer transition-all shrink-0"
                    >
                      {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 translate-x-0.5" />}
                    </button>

                    <div className="flex-1 h-8 bg-emerald-100 rounded-lg flex items-center justify-between px-3 gap-1 overflow-hidden">
                      {Array.from({ length: 32 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 rounded-full transition-all duration-300 ${
                            isPlayingAudio ? 'bg-emerald-600 animate-pulse' : 'bg-emerald-400/60'
                          }`}
                          style={{ height: `${Math.max(20, (Math.sin(i * 0.5) * 50 + 50))}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* School Essay / Problem Set Summary */
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <FileCheck2 className="w-4 h-4 text-purple-600" />
                    Assignment Submission Document
                  </div>
                  <div className="text-xs text-slate-600">
                    Student submitted full written response with supporting bibliography and problem step calculations.
                  </div>
                </div>
              )}

              {/* Star Ratings Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <label className="text-xs font-bold text-slate-800 block">
                    {isCodingNiche ? 'Architecture & Clean Code' : isSchoolNiche ? 'Concept Mastery & Depth' : 'Tajweed Precision & Makharij'}
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => {
                          if (isCodingNiche) setCodeArchitectureRating(star);
                          else if (isSchoolNiche) setConceptMasteryRating(star);
                          else setTajweedRating(star);
                        }}
                        className="cursor-pointer p-1 text-amber-500 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-6 h-6 ${(isCodingNiche ? codeArchitectureRating : isSchoolNiche ? conceptMasteryRating : tajweedRating) >= star ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}`} />
                      </button>
                    ))}
                    <span className="ml-2 font-bold text-xs text-slate-700">
                      {(isCodingNiche ? codeArchitectureRating : isSchoolNiche ? conceptMasteryRating : tajweedRating)} / 5
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <label className="text-xs font-bold text-slate-800 block">
                    {isCodingNiche ? 'Algorithmic Efficiency' : isSchoolNiche ? 'Analytical Reasoning' : 'Memorization Fluency (Hifz)'}
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => {
                          if (isCodingNiche) setTimeComplexityRating(star);
                          else if (isSchoolNiche) setAnalyticalRating(star);
                          else setFluencyRating(star);
                        }}
                        className="cursor-pointer p-1 text-amber-500 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-6 h-6 ${(isCodingNiche ? timeComplexityRating : isSchoolNiche ? analyticalRating : fluencyRating) >= star ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}`} />
                      </button>
                    ))}
                    <span className="ml-2 font-bold text-xs text-slate-700">
                      {(isCodingNiche ? timeComplexityRating : isSchoolNiche ? analyticalRating : fluencyRating)} / 5
                    </span>
                  </div>
                </div>
              </div>

              {/* Evaluation Verdict Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 block">
                  {isCodingNiche ? 'Pull Request Verdict' : isSchoolNiche ? 'Letter Grade Assessment' : 'Formal Sheikh Verdict'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(isCodingNiche
                    ? [
                        { id: 'Approved PR', label: 'Approved (100%)', score: 100, desc: 'Ready to Merge' },
                        { id: 'Minor Polish', label: 'Approved (90%)', score: 90, desc: 'Minor Nitpicks' },
                        { id: 'Needs Refactor', label: 'Changes Requested', score: 70, desc: 'Refactor Needed' },
                        { id: 'Failing Tests', label: 'Tests Failing', score: 50, desc: 'Fix Broken Tests' },
                      ]
                    : isSchoolNiche
                    ? [
                        { id: 'Grade A+', label: 'Grade A+ (98%)', score: 98, desc: 'Exemplary Work' },
                        { id: 'Grade A', label: 'Grade A (92%)', score: 92, desc: 'Strong Concept' },
                        { id: 'Grade B', label: 'Grade B (84%)', score: 84, desc: 'Satisfactory' },
                        { id: 'Needs Revision', label: 'Resubmit Essay', score: 60, desc: 'Needs Revision' },
                      ]
                    : [
                        { id: 'Mumtaz', label: 'Mumtaz (A+)', score: 98, desc: 'Mastered' },
                        { id: 'Jayyid Jiddan', label: 'Jayyid Jiddan (A)', score: 88, desc: 'Very Good' },
                        { id: 'Jayyid', label: 'Jayyid (B)', score: 78, desc: 'Good' },
                        { id: 'Iadah', label: "I'adah (Re-record)", score: 60, desc: 'Needs Revision' },
                      ]
                  ).map((verdict) => (
                    <button
                      key={verdict.id}
                      type="button"
                      onClick={() => {
                        setSelectedVerdict(verdict.id);
                        setEvaluationScore(verdict.score);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedVerdict === verdict.id
                          ? 'border-emerald-600 bg-emerald-50 shadow-xs ring-2 ring-emerald-600/30'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-extrabold text-xs text-slate-900">{verdict.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{verdict.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Specific Tags */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 block">
                  {isCodingNiche ? 'Code Quality & Architecture Tags' : isSchoolNiche ? 'Rubric Criteria Tags' : 'Specific Tajweed Correction Tags'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {(isCodingNiche
                    ? ['Clean Architecture', 'Time Complexity O(n)', 'O(1) Space', 'Async Safety', 'TypeScript Strict', 'Edge Case Coverage']
                    : isSchoolNiche
                    ? ['Flawless Thesis', 'Strong Supporting Citations', 'Calculations Accurate', 'Concept Depth', 'Formatting Checked']
                    : ['Qalqalah Intensity', 'Ghunnah Duration', 'Madd Munfasil (4 Harakat)', 'Ikhfaa Pronunciation', 'Harf Dhad Makhraj', 'Stop Rules (Waqf)']
                  ).map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleMistakeTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        selectedMistakeTags.includes(tag)
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {tag} {selectedMistakeTags.includes(tag) && '✓'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Notes */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 block">
                  {isCodingNiche ? 'Senior Mentor Code Review Comments' : isSchoolNiche ? 'Faculty Feedback & Rubric Notes' : 'Sheikh Remarks & Direct Feedback'}
                </label>
                <textarea
                  rows={3}
                  value={evaluationNotes}
                  onChange={(e) => setEvaluationNotes(e.target.value)}
                  placeholder={
                    isCodingNiche
                      ? 'e.g. Great use of async Server Actions! Consider wrapping the stripe webhook payload in a try/catch block for error resilience...'
                      : isSchoolNiche
                      ? 'e.g. Exemplary analysis of integration by parts. Ensure you state boundary limits clearly on step 3...'
                      : "e.g. Excellent recitation! Pay special attention to the Qalqalah on word 'لِيَبْلُوَكُمْ' in Ayah 2..."
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <Button
                variant="ghost"
                size="md"
                onClick={() => {
                  setSelectedSubmission(null);
                  setIsPlayingAudio(false);
                }}
                className="text-slate-600 font-bold"
              >
                Cancel
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={handleSaveEvaluation}
                className="font-bold shadow-md"
                rightIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Publish Grade & Notify Student
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};