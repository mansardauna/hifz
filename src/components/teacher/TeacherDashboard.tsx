import React, { useState, useMemo } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { ToastMessage } from '../ui/Toast';
import { Button, Card, Badge, Input } from '../ui';
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
  Menu
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
  lastEvaluationStatus: 'Mumtaz' | 'Jayyid Jiddan' | 'Jayyid' | 'Pending Review';
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
  const [evaluationScore, setEvaluationScore] = useState<number>(95);
  const [selectedVerdict, setSelectedVerdict] = useState<'Mumtaz' | 'Jayyid Jiddan' | 'Jayyid' | 'Iadah'>('Mumtaz');
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

  // Mock Assigned Students
  const [assignedStudents, setAssignedStudents] = useState<AssignedStudent[]>([
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
  ]);

  // Mock Submissions to Review & Grade
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([
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
    },
    {
      id: 'sub-4',
      studentId: 'std-2',
      studentName: 'Fatima Al-Zahra',
      surahOrAssignment: 'Surah Maryam (مريم)',
      ayahOrModule: 'Ayahs 20 - 45 (Sanad Track)',
      submittedAt: 'Yesterday at 04:15 PM',
      audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/2270.mp3',
      durationSeconds: 210,
      status: 'Graded',
      currentGrade: 'Mumtaz (A+)',
      currentScore: 99,
      tajweedRating: 5,
      fluencyRating: 5,
      teacherRemarks: 'MashaAllah! Flawless makharij on Harf Dhad and precise ghunnah duration.'
    }
  ]);

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
    setEvaluationScore(sub.currentScore || 95);
    setEvaluationNotes(sub.teacherRemarks || '');
    setSelectedVerdict(sub.currentGrade?.includes('Mumtaz') ? 'Mumtaz' : 'Jayyid Jiddan');
    setSelectedMistakeTags(sub.mistakeTags || []);
  };

  // Submit Grade & Evaluation
  const handleSaveEvaluation = () => {
    if (!selectedSubmission) return;

    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === selectedSubmission.id
          ? {
              ...sub,
              status: selectedVerdict === 'Iadah' ? 'Needs Revision' : 'Graded',
              currentGrade: `${selectedVerdict} (${evaluationScore}%)`,
              currentScore: evaluationScore,
              tajweedRating,
              fluencyRating,
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
              lastEvaluationStatus: selectedVerdict === 'Iadah' ? 'Pending Review' : (selectedVerdict as any),
              recentGrade: `${selectedVerdict} (${evaluationScore}%)`
            }
          : std
      )
    );

    onAddToast({
      type: 'success',
      title: 'Evaluation Published',
      message: `Grade (${selectedVerdict}) recorded for ${selectedSubmission.studentName}. Student portal updated.`
    });

    setSelectedSubmission(null);
    setIsPlayingAudio(false);
  };

  // Toggle Mistake Tag
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

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-slate-100 font-sans text-slate-900" dir={direction}>
      {/* Mobile Drawer Backdrop */}
      {isMobileNavOpen && (
        <div
          onClick={() => setIsMobileNavOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* 1. Fixed Teacher Left Sidebar (Does NOT scroll with page) */}
      <aside
        className={`w-64 xl:w-72 h-full flex flex-col justify-between bg-slate-900 text-slate-200 border-r border-slate-800 shrink-0 select-none z-30 transition-transform duration-300 ${
          isMobileNavOpen
            ? 'fixed inset-y-0 left-0 shadow-2xl translate-x-0'
            : 'hidden lg:flex'
        }`}
      >
        <div className="flex flex-col h-full min-h-0">
          {/* Academy Brand Header (Fixed at top) */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950/40">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md shadow-amber-600/20">
                {isCodingNiche ? <Code2 className="w-4.5 h-4.5" /> : <BookOpen className="w-4.5 h-4.5" />}
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-xs sm:text-sm text-white truncate">{tenant.name}</h2>
                <p className="text-[10px] sm:text-[11px] text-amber-400 font-mono truncate">{tenant.subdomain}.ankabit.app</p>
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

          {/* Teacher Profile Card in Sidebar (Correct Teacher Persona) */}
          <div className="p-3.5 mx-3.5 my-3 bg-slate-800/80 rounded-2xl border border-slate-700/80 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                {user?.name?.charAt(0).toUpperCase() || 'B'}
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-xs sm:text-sm text-white truncate">{user?.name || 'Shaykh Bilal Hashmi'}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">Certified Sheikh</span>
                </div>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
              <span>{assignedStudents.length} Students</span>
              <span className="font-bold text-emerald-400">
                {submissions.filter((s) => s.status === 'Pending').length} To Grade
              </span>
            </div>
          </div>

          {/* Nav Items (Only this inner area scrolls if items exceed height) */}
          <nav className="flex-1 overflow-y-auto px-3.5 space-y-1.5 min-h-0 py-1">
            {[
              { id: 'students' as TeacherTab, label: 'My Assigned Students', icon: Users, badge: assignedStudents.length },
              { id: 'grading' as TeacherTab, label: 'Grading & Rating Studio', icon: Award, badge: submissions.filter((s) => s.status === 'Pending').length, badgeColor: 'bg-amber-500 text-slate-950 font-bold' },
              { id: 'classroom' as TeacherTab, label: 'Live Video Halaqah', icon: Radio, badge: 'Live', badgeColor: 'bg-rose-600 text-white' },
              { id: 'attendance' as TeacherTab, label: 'Daily Roll Call & Roster', icon: Calendar },
              { id: 'forum' as TeacherTab, label: 'Halaqah Group Forum', icon: MessageSquare },
              { id: 'curriculum' as TeacherTab, label: isCodingNiche ? 'Coding Lab Sandbox' : 'Mushaf Reader & Tajweed', icon: isCodingNiche ? Code2 : BookOpen },
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
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer select-none ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-md font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
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
          <div className="p-3.5 border-t border-slate-800 shrink-0 bg-slate-950/40">
            <button
              onClick={() => logout()}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out (Teacher Session)</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Viewport (Scrolls Independently) */}
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
                  Instructor Workspace
                </h1>
                <Badge variant="primary" className="bg-amber-100 text-amber-800 border-amber-200 text-[10px]">
                  Teacher Portal
                </Badge>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Assigned Halaqahs, Homework Evaluations, and Live Recitation Grading
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setActiveTab('classroom')}
              className="bg-emerald-600 hover:bg-emerald-700 font-bold text-xs shadow-xs"
              leftIcon={<Radio className="w-3.5 h-3.5" />}
            >
              Start Live Halaqah
            </Button>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <div className="p-4 sm:p-8 flex-1 space-y-6">
          {/* TAB 1: ASSIGNED STUDENTS */}
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
                    <div className="text-xs text-slate-500 font-semibold">Assigned Students</div>
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
                    <div className="text-xs text-slate-500 font-semibold">Pending Evaluations</div>
                  </div>
                </Card>

                <Card className="p-5 bg-white border border-slate-200 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-slate-900">96.5%</div>
                    <div className="text-xs text-slate-500 font-semibold">Average Attendance</div>
                  </div>
                </Card>

                <Card className="p-5 bg-white border border-slate-200 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-slate-900">92%</div>
                    <div className="text-xs text-slate-500 font-semibold">Memorization Mastery</div>
                  </div>
                </Card>
              </div>

              {/* Filter Bar */}
              <div className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 flex flex-col sm:flex-row items-center gap-3">
                  <div className="w-full sm:w-72">
                    <Input
                      placeholder="Search student or Surah..."
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
                  Showing {filteredStudents.length} of {assignedStudents.length} Students
                </div>
              </div>

              {/* Students Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredStudents.map((std) => (
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
                            std.lastEvaluationStatus === 'Mumtaz'
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

                      {/* Current Surah / Curriculum Target */}
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Target</div>
                        <div className="font-extrabold text-slate-900 text-xs font-serif">{std.currentSurahOrTrack}</div>
                        <div className="text-[11px] text-slate-600">{std.currentAyahOrLesson}</div>
                      </div>

                      {/* Progress Stats */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-100">
                          <div className="text-[10px] text-emerald-800 font-semibold">Mastery</div>
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
                            onAddToast({
                              type: 'info',
                              title: 'Student Evaluation',
                              message: `Opening recitation rating sheet for ${std.name}`
                            });
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
                        className="flex-1 justify-center bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
                      >
                        Rate Recitation
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          onAddToast({
                            type: 'info',
                            title: 'Parent WhatsApp',
                            message: `Opening direct parent communication for ${std.name} (${std.parentPhone})`
                          });
                        }}
                        className="text-slate-700 font-bold text-xs"
                      >
                        Parent Chat
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: GRADING & RATING STUDIO */}
          {activeTab === 'grading' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Recitation & Homework Evaluations</h2>
                  <p className="text-xs text-slate-500">Listen to audio recordings, rate Makharij and Fluency, and publish grades.</p>
                </div>
              </div>

              {/* Submissions Table */}
              <Card className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3.5 px-4">Student</th>
                        <th className="py-3.5 px-4">Surah & Target Ayahs</th>
                        <th className="py-3.5 px-4">Submitted</th>
                        <th className="py-3.5 px-4">Audio Duration</th>
                        <th className="py-3.5 px-4">Evaluation Status</th>
                        <th className="py-3.5 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {submissions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-4 px-4 font-bold text-slate-900">{sub.studentName}</td>
                          <td className="py-4 px-4">
                            <div className="font-serif font-extrabold text-slate-900 text-sm">{sub.surahOrAssignment}</div>
                            <div className="text-[11px] text-slate-500">{sub.ayahOrModule}</div>
                          </td>
                          <td className="py-4 px-4 text-slate-500">{sub.submittedAt}</td>
                          <td className="py-4 px-4 font-mono font-semibold">
                            {sub.durationSeconds ? `${Math.floor(sub.durationSeconds / 60)}m ${sub.durationSeconds % 60}s` : 'Audio File'}
                          </td>
                          <td className="py-4 px-4">
                            {sub.status === 'Graded' ? (
                              <Badge variant="success" className="font-bold text-[10px]">
                                {sub.currentGrade || 'Graded'}
                              </Badge>
                            ) : sub.status === 'Needs Revision' ? (
                              <Badge variant="error" className="font-bold text-[10px]">
                                Needs Revision
                              </Badge>
                            ) : (
                              <Badge variant="warning" className="font-bold text-[10px]">
                                Pending Review
                              </Badge>
                            )}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleOpenGrading(sub)}
                              className="bg-amber-600 hover:bg-amber-700 font-bold text-xs"
                            >
                              {sub.status === 'Graded' ? 'Edit Grade' : 'Evaluate & Rate'}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* TAB 3: DAILY ATTENDANCE & ROSTER */}
          {activeTab === 'attendance' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Daily Halaqah Roll Call</h2>
                  <p className="text-xs text-slate-500">Mark daily attendance for your assigned cohort.</p>
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
                    className="bg-emerald-600 hover:bg-emerald-700 font-bold"
                  >
                    Save Attendance Log
                  </Button>
                </div>
              </div>

              {/* Attendance Table */}
              <Card className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3.5 px-4">Student</th>
                        <th className="py-3.5 px-4">Cohort</th>
                        <th className="py-3.5 px-4">Status Selection</th>
                        <th className="py-3.5 px-4 text-right">Current Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {assignedStudents.map((std) => {
                        const currentStatus = attendanceState[std.id] || 'present';
                        return (
                          <tr key={std.id} className="hover:bg-slate-50/60">
                            <td className="py-4 px-4 font-bold text-slate-900">{std.name}</td>
                            <td className="py-4 px-4 text-slate-500">{std.cohort}</td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-1.5">
                                {[
                                  { id: 'present', label: 'Present', color: 'bg-emerald-600 text-white' },
                                  { id: 'late', label: 'Late', color: 'bg-amber-500 text-white' },
                                  { id: 'absent', label: 'Absent', color: 'bg-rose-600 text-white' },
                                  { id: 'excused', label: 'Excused', color: 'bg-sky-600 text-white' }
                                ].map((opt) => (
                                  <button
                                    key={opt.id}
                                    onClick={() => setAttendance(std.id, opt.id as any)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                      currentStatus === opt.id
                                        ? opt.color + ' shadow-xs ring-2 ring-slate-900/20'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-right font-black text-emerald-700">{std.attendancePercent}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* TAB 4: LIVE VIDEO HALAQAH */}
          {activeTab === 'classroom' && (
            <div className="h-[calc(100vh-140px)] min-h-[600px] rounded-2xl overflow-hidden border border-slate-200 shadow-md">
              <LiveClassroomHub
                roomTitle={`${tenant.name} Teacher Halaqah`}
                courseTitle="Live Oral Recitation & Tajweed Correction"
                userRole="teacher"
                currentUserName={user?.name || 'Shaykh Bilal Hashmi'}
                niche={tenant.niche || 'quran'}
              />
            </div>
          )}

          {/* TAB 5: HALAQAH FORUM */}
          {activeTab === 'forum' && (
            <div className="space-y-4">
              <LMSCommunityForum onAddToast={onAddToast} />
            </div>
          )}

          {/* TAB 6: CURRICULUM & READER */}
          {activeTab === 'curriculum' && (
            isCodingNiche ? (
              <div className="h-[calc(100vh-160px)] min-h-[600px] rounded-2xl overflow-hidden border border-slate-800">
                <CodingSandboxWorkspace tenantName={tenant.name} onAddToast={onAddToast} />
              </div>
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
                <p className="text-xs text-slate-500">Manage your sheikh credentials and halaqah availability.</p>
              </div>

              <div className="space-y-4">
                <Input label="Instructor Full Name" defaultValue={user?.name || 'Shaykh Bilal Hashmi'} />
                <Input label="Email Address" defaultValue={user?.email || 'teacher@hifz-academy.com'} disabled />
                <Input label="Sheikh Qualification / Sanad Lineage" defaultValue="Ijazah in Hafs 'an 'Asim (10 Qira'at Al-Kubra)" />
                <Input label="Halaqah WhatsApp Contact" defaultValue="+1 (555) 234-8910" />
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={() => onAddToast({ type: 'success', title: 'Settings Saved', message: 'Instructor profile updated.' })}
                className="bg-amber-600 hover:bg-amber-700 font-bold"
              >
                Save Changes
              </Button>
            </Card>
          )}
        </div>
      </main>

      {/* 3. Interactive Grading & Rating Drawer / Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden space-y-0 my-8">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Recitation Evaluation</span>
                  <Badge variant="primary" className="bg-amber-950 text-amber-300 border-amber-500/30 text-[10px]">
                    Oral Grading
                  </Badge>
                </div>
                <h2 className="text-lg font-black text-white mt-1">{selectedSubmission.studentName}</h2>
                <p className="text-xs text-slate-400 font-serif">{selectedSubmission.surahOrAssignment} • {selectedSubmission.ayahOrModule}</p>
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
              {/* Audio Recitation Player with Waveform Simulation */}
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

              {/* Star Ratings Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Tajweed Precision Rating */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <label className="text-xs font-bold text-slate-800 block">Tajweed Precision & Makharij</label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setTajweedRating(star)}
                        className="cursor-pointer p-1 text-amber-500 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-6 h-6 ${star <= tajweedRating ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}`} />
                      </button>
                    ))}
                    <span className="ml-2 font-bold text-xs text-slate-700">{tajweedRating} / 5</span>
                  </div>
                </div>

                {/* Memorization Fluency Rating */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <label className="text-xs font-bold text-slate-800 block">Memorization Fluency (Hifz)</label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFluencyRating(star)}
                        className="cursor-pointer p-1 text-amber-500 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-6 h-6 ${star <= fluencyRating ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}`} />
                      </button>
                    ))}
                    <span className="ml-2 font-bold text-xs text-slate-700">{fluencyRating} / 5</span>
                  </div>
                </div>
              </div>

              {/* Evaluation Verdict Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 block">Formal Sheikh Verdict</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'Mumtaz', label: 'Mumtaz (A+)', score: 98, desc: 'Mastered' },
                    { id: 'Jayyid Jiddan', label: 'Jayyid Jiddan (A)', score: 88, desc: 'Very Good' },
                    { id: 'Jayyid', label: 'Jayyid (B)', score: 78, desc: 'Good' },
                    { id: 'Iadah', label: "I'adah (Re-record)", score: 60, desc: 'Needs Revision' }
                  ].map((verdict) => (
                    <button
                      key={verdict.id}
                      type="button"
                      onClick={() => {
                        setSelectedVerdict(verdict.id as any);
                        setEvaluationScore(verdict.score);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedVerdict === verdict.id
                          ? 'border-amber-600 bg-amber-50/80 shadow-xs ring-2 ring-amber-600/30'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-extrabold text-xs text-slate-900">{verdict.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{verdict.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Common Tajweed Mistake Tags */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 block">Specific Tajweed Correction Tags</label>
                <div className="flex flex-wrap gap-2">
                  {['Qalqalah Intensity', 'Ghunnah Duration', 'Madd Munfasil (4 Harakat)', 'Ikhfaa Pronunciation', 'Harf Dhad Makhraj', 'Stop Rules (Waqf)'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleMistakeTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        selectedMistakeTags.includes(tag)
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {tag} {selectedMistakeTags.includes(tag) && '✓'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sheikh Feedback Notes */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 block">Sheikh Remarks & Direct Feedback</label>
                <textarea
                  rows={3}
                  value={evaluationNotes}
                  onChange={(e) => setEvaluationNotes(e.target.value)}
                  placeholder="e.g. Excellent recitation! Pay special attention to the Qalqalah on word 'لِيَبْلُوَكُمْ' in Ayah 2..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans"
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
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md"
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