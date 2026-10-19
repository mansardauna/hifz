import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { useConfirm } from '../../context/ConfirmModalContext';
import { ToastMessage } from '../ui/Toast';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Input,
  PageHeader,
  StatCard,
  TableControls,
  TableSortHeader,
  TablePagination,
} from '../ui';
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
  Mic,
  MicOff,
  Square,
  Trash2,
  Volume2,
  Phone,
  Mail,
  Send,
  Sparkles,
  Filter,
  ShieldAlert,
  AlertCircle,
  Copy,
  PhoneOff
} from 'lucide-react';
import { LiveClassroomHub, StudentLevelTier } from '../classroom/LiveClassroomHub';
import { LMSCommunityForum } from '../forum/LMSCommunityForum';
import { QuranLMSWorkspace } from '../../plugins/quran/QuranLMSWorkspace';
import { CodingSandboxWorkspace } from '../../plugins/coding/CodingSandboxWorkspace';
import { SchoolLMSWorkspace } from '../../plugins/school/SchoolLMSWorkspace';
import { classroomSessionService, LiveClassSession } from '../../services/classroomSessionService';
import { api } from '../../services/api';
import { detectTenantNicheType, getClassroomConfig } from '../../services/classroomCustomizationService';

import { DemoRoleSwitcher } from '../common/DemoRoleSwitcher';


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
  enrollmentStatus?: 'active' | 'leave' | 'graduated' | 'pending';
  attendanceAttentionReason?: 'missed_latest' | 'missed_yesterday' | 'left_early' | 'none';
  consecutiveAbsences?: number;
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
  teacherAudioFeedbackUrl?: string;
  teacherAudioFeedbackDuration?: number;
  mistakeTags?: string[];
}

interface TeacherDashboardProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onAddToast }) => {
  const { tenant, direction, courses } = useTenant();
  const { user, logout } = useAuth();
  const confirm = useConfirm();

  const tenantNiche = detectTenantNicheType(tenant);
  const isCodingNiche = tenantNiche === 'coding';
  const isSchoolNiche = tenantNiche === 'school';
  const isMadrasatNiche = tenantNiche === 'quran';
  const isGeneralNiche = !isCodingNiche && !isSchoolNiche && !isMadrasatNiche;
  const classroomConfig = getClassroomConfig(tenant);

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
    isCodingNiche ? 'Approved PR' : isSchoolNiche ? 'Grade A+' : isMadrasatNiche ? 'Mumtaz' : 'Grade A+'
  );
  const [evaluationNotes, setEvaluationNotes] = useState('');
  const [selectedMistakeTags, setSelectedMistakeTags] = useState<string[]>([]);

  // Teacher Voice Feedback Recording State
  const [isRecordingVoiceFeedback, setIsRecordingVoiceFeedback] = useState(false);
  const [voiceFeedbackUrl, setVoiceFeedbackUrl] = useState<string | null>(null);
  const [voiceFeedbackDuration, setVoiceFeedbackDuration] = useState<number>(0);
  const [isPlayingVoiceFeedback, setIsPlayingVoiceFeedback] = useState<boolean>(false);
  const voiceMediaRecorderRef = useRef<MediaRecorder | null>(null);
  const voiceChunksRef = useRef<Blob[]>([]);
  const voiceTimerRef = useRef<any>(null);
  const voiceAudioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Attendance Sheet & Smart Filter State
  const [attendanceDate, setAttendanceDate] = useState('2026-09-07');
  const [attendanceEnrollmentFilter, setAttendanceEnrollmentFilter] = useState<'active' | 'all' | 'leave' | 'graduated'>('active');
  const [attendanceCohortFilter, setAttendanceCohortFilter] = useState<string>('all');
  const [attendanceSearch, setAttendanceSearch] = useState<string>('');
  const [attendanceSubTab, setAttendanceSubTab] = useState<'roster' | 'attention'>('roster');
  const [attendanceState, setAttendanceState] = useState<Record<string, 'present' | 'late' | 'absent' | 'excused'>>({
    'std-1': 'present',
    'std-2': 'present',
    'std-3': 'late',
    'std-4': 'present',
    'std-5': 'excused',
    'std-6': 'absent'
  });


  // Dynamic Assigned Students & Submissions loaded live from MySQL / Server API
  const [assignedStudents, setAssignedStudents] = useState<AssignedStudent[]>([]);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [isLoadingRoster, setIsLoadingRoster] = useState<boolean>(true);

  // Populate dynamic student roster & submissions for all academies from MySQL DB
  useEffect(() => {
    let isMounted = true;
    setIsLoadingRoster(true);
    const targetKey = tenant.id || tenant.subdomain;
    const token = typeof window !== 'undefined' ? (localStorage.getItem('auth_token') || localStorage.getItem('ankabit_auth_token')) : null;
    const authHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    Promise.all([
      fetch(`/api/tenant/members?tenantId=${encodeURIComponent(targetKey)}`, { headers: authHeaders })
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null),
      api.getLeads(targetKey).catch(() => []),
      api.getSubmissions(targetKey).catch(() => []),
    ])
      .then(([membersData, leads, realSubmissions]) => {
        if (!isMounted) return;

        const studentMap = new Map<string, AssignedStudent>();

        // 1. Add students created by Admin / registered in MySQL DB
        if (membersData?.students && Array.isArray(membersData.students)) {
          membersData.students.forEach((std: any) => {
            const key = std.id || std.email;
            studentMap.set(key, {
              id: std.id || `std-${Date.now()}`,
              name: std.name || 'Student',
              avatar: (std.name || 'S').slice(0, 2).toUpperCase(),
              email: std.email || '',
              cohort: std.enrolledCourse || 'Curriculum Cohort',
              currentSurahOrTrack: std.enrolledCourse || 'Core Curriculum',
              currentAyahOrLesson: 'Lesson 1',
              masteryPercent: 95,
              attendancePercent: 100,
              lastRecitationDate: 'Active',
              lastEvaluationStatus: 'Pending Review',
              recentGrade: 'Enrolled',
              parentPhone: std.phone || '',
              enrollmentStatus: 'active',
              attendanceAttentionReason: 'none',
              consecutiveAbsences: 0,
            });
          });
        }

        // 2. Add enrolled/admitted leads if not already present
        if (leads && Array.isArray(leads)) {
          leads.forEach((lead: any) => {
            const key = lead.id || lead.email;
            if (!studentMap.has(key) && !studentMap.has(lead.email)) {
              studentMap.set(key, {
                id: lead.id,
                name: lead.studentName || lead.name || 'Student',
                avatar: (lead.studentName || lead.name || 'S').slice(0, 2).toUpperCase(),
                email: lead.email || '',
                cohort: lead.courseInterest || 'Curriculum Track',
                currentSurahOrTrack: lead.courseInterest || 'Core Syllabus',
                currentAyahOrLesson: 'Lesson 1',
                masteryPercent: 96,
                attendancePercent: 100,
                lastRecitationDate: 'Enrolled',
                lastEvaluationStatus: 'Pending Review',
                recentGrade: 'Admitted',
                parentPhone: lead.phone || '',
                enrollmentStatus: 'active',
                attendanceAttentionReason: 'none',
                consecutiveAbsences: 0,
              });
            }
          });
        }

        setAssignedStudents(Array.from(studentMap.values()));

        // 3. Real Submissions from DB
        if (realSubmissions && Array.isArray(realSubmissions) && realSubmissions.length > 0) {
          const mappedSubs: StudentSubmission[] = realSubmissions.map((sub: any) => ({
            id: sub.id,
            studentId: sub.studentId || sub.userId,
            studentName: sub.user?.name || sub.studentName || 'Student',
            surahOrAssignment: sub.surahName || sub.title || 'Recitation Assignment',
            ayahOrModule: sub.ayahRange || sub.module || 'Oral Recitation',
            submittedAt: sub.submittedAt ? new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
            audioUrl: sub.audioUrl,
            durationSeconds: sub.durationSeconds,
            status: (sub.status === 'graded' ? 'Graded' : 'Pending') as 'Graded' | 'Pending',
            currentScore: sub.evaluationScore,
            currentGrade: sub.verdict,
            teacherRemarks: sub.teacherRemarks,
            mistakeTags: sub.mistakes || [],
          }));
          setSubmissions(mappedSubs);
        } else {
          setSubmissions([]);
        }
      })
      .catch((err) => {
        console.warn('TeacherDashboard live data fetch warning:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingRoster(false);
      });

    return () => {
      isMounted = false;
    };
  }, [tenant.id, tenant.subdomain]);

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

  // Filtered attendance roster (defaults to active in session to prevent overwhelm)
  const filteredAttendanceStudents = useMemo(() => {
    return assignedStudents.filter((s) => {
      // 1. Enrollment status filter
      if (attendanceEnrollmentFilter === 'active' && s.enrollmentStatus && s.enrollmentStatus !== 'active') {
        return false;
      }
      if (attendanceEnrollmentFilter === 'leave' && s.enrollmentStatus !== 'leave') {
        return false;
      }
      if (attendanceEnrollmentFilter === 'graduated' && s.enrollmentStatus !== 'graduated') {
        return false;
      }

      // 2. Cohort filter
      if (attendanceCohortFilter !== 'all' && s.cohort !== attendanceCohortFilter) {
        return false;
      }

      // 3. Search query
      if (attendanceSearch.trim()) {
        const q = attendanceSearch.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.cohort.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [assignedStudents, attendanceEnrollmentFilter, attendanceCohortFilter, attendanceSearch]);

  // Students requiring attendance intervention
  const attentionStudents = useMemo(() => {
    return assignedStudents.filter(
      (s) =>
        s.attendanceAttentionReason ||
        (s.consecutiveAbsences && s.consecutiveAbsences >= 2) ||
        (s.attendancePercent && s.attendancePercent < 75)
    );
  }, [assignedStudents]);

  // Handle Voice Feedback Recording
  const startVoiceFeedbackRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      voiceMediaRecorderRef.current = mediaRecorder;
      voiceChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          voiceChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(voiceChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setVoiceFeedbackUrl(url);
      };

      mediaRecorder.start();
      setIsRecordingVoiceFeedback(true);
      setVoiceFeedbackDuration(0);

      voiceTimerRef.current = setInterval(() => {
        setVoiceFeedbackDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      onAddToast({
        type: 'error',
        title: 'Microphone Permission Required',
        message: 'Please allow microphone permissions to record spoken feedback.',
      });
    }
  };

  const stopVoiceFeedbackRecording = () => {
    if (voiceMediaRecorderRef.current && isRecordingVoiceFeedback) {
      voiceMediaRecorderRef.current.stop();
      voiceMediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecordingVoiceFeedback(false);
      if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
    }
  };

  const deleteVoiceFeedback = () => {
    if (voiceAudioPlayerRef.current) {
      voiceAudioPlayerRef.current.pause();
    }
    setVoiceFeedbackUrl(null);
    setVoiceFeedbackDuration(0);
    setIsPlayingVoiceFeedback(false);
  };

  const togglePlayVoiceFeedbackPreview = () => {
    if (!voiceFeedbackUrl) return;
    if (isPlayingVoiceFeedback) {
      voiceAudioPlayerRef.current?.pause();
      setIsPlayingVoiceFeedback(false);
    } else {
      if (voiceAudioPlayerRef.current) {
        voiceAudioPlayerRef.current.src = voiceFeedbackUrl;
        voiceAudioPlayerRef.current.play();
        setIsPlayingVoiceFeedback(true);
      }
    }
  };

  // Handle Parent WhatsApp & Email Alerts
  const handleSendParentWhatsApp = (std: AssignedStudent) => {
    const reasonText =
      std.attendanceAttentionReason === 'missed_latest'
        ? `missed today's mandatory class session.`
        : std.attendanceAttentionReason === 'missed_yesterday'
        ? `has missed 2 consecutive class sessions.`
        : `was unable to complete today's class (departed early).`;

    const text = `Assalamu Alaikum / Dear Parent of ${std.name},\nThis is an automated attendance notice from ${tenant.name}. Please be advised that ${std.name} ${reasonText}\nPlease connect with faculty if an excused leave is required.`;
    const cleanPhone = std.parentPhone.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    onAddToast({
      type: 'success',
      title: 'WhatsApp Alert Opened',
      message: `Direct message generated for ${std.name}'s parent / guardian.`,
    });
  };

  const handleSendParentEmail = (std: AssignedStudent) => {
    const subject = `Attendance Alert: ${std.name} - ${tenant.name}`;
    const body = `Dear Parent/Guardian,\n\nWe noticed that ${std.name} has missed recent class sessions at ${tenant.name}.\n\nCurrent Attendance: ${std.attendancePercent}%\n\nPlease contact us if this absence is excused.\n\nBest regards,\n${user?.name || teacherPersona.defaultName}\n${teacherPersona.title}`;
    window.location.href = `mailto:${std.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

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
    setVoiceFeedbackUrl(sub.teacherAudioFeedbackUrl || null);
    setVoiceFeedbackDuration(sub.teacherAudioFeedbackDuration || 0);
    setIsPlayingVoiceFeedback(false);
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
              teacherAudioFeedbackUrl: voiceFeedbackUrl || undefined,
              teacherAudioFeedbackDuration: voiceFeedbackDuration || undefined,
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

    // Persist evaluation, score, notes, and voice note to MySQL database
    const feedbackPayload = JSON.stringify({
      notes: evaluationNotes,
      verdict: selectedVerdict,
      voiceFeedbackUrl: voiceFeedbackUrl || undefined,
      voiceFeedbackDuration: voiceFeedbackDuration || undefined,
      mistakeTags: selectedMistakeTags,
      tajweedRating,
      fluencyRating,
      analyticalRating,
      conceptMasteryRating,
      codeArchitectureRating,
    });

    api.gradeSubmission(selectedSubmission.id, {
      score: evaluationScore,
      feedback: feedbackPayload,
      status: isRevision ? 'Needs Revision' : 'Graded',
      teacherAudioFeedbackUrl: voiceFeedbackUrl || undefined,
      teacherAudioFeedbackDuration: voiceFeedbackDuration || undefined,
    }).catch((err) => console.warn('Failed to persist grade to API:', err));

    onAddToast({
      type: 'success',
      title: 'Evaluation Published',
      message: `Grade (${selectedVerdict}) ${voiceFeedbackUrl ? 'with voice memo ' : ''}published for ${selectedSubmission.studentName}. Student portal updated.`
    });

    setSelectedSubmission(null);
    setIsPlayingAudio(false);
    setIsRecordingVoiceFeedback(false);
    setVoiceFeedbackUrl(null);
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
        evaluateAction: 'Review',
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
        evaluateAction: 'Grade',
        studentsMetric: 'Enrolled Students',
        pendingMetric: 'Pending Submissions',
        masteryMetric: 'Average Class GPA',
        masteryValue: '3.86 / 4.0',
      };
    }
    if (isMadrasatNiche) {
      return {
        defaultName: 'Ustadhah Zainab Al-Fayez',
        title: 'Senior Qariyah & Sanad Holder',
        badge: 'Certified Ustadhah',
        classroomName: classroomConfig.breakoutPodsTitle || 'Live Video Halaqah',
        forumName: 'Halaqah Group Forum',
        curriculumName: 'Mushaf Reader & Tajweed',
        evaluateAction: 'Grade',
        studentsMetric: 'Enrolled Qariyahs',
        pendingMetric: 'Pending Recitations',
        masteryMetric: 'Tajweed Mastery Rate',
        masteryValue: '96.8%',
      };
    }
    return {
      defaultName: 'Senior Instructor',
      title: 'Senior Faculty Instructor',
      badge: 'Certified Faculty',
      classroomName: classroomConfig.breakoutPodsTitle || 'Live Interactive Classroom',
      forumName: 'Academy Community Forum',
      curriculumName: 'Curriculum & Coursework',
      evaluateAction: 'Grade',
      studentsMetric: 'Enrolled Students',
      pendingMetric: 'Pending Submissions',
      masteryMetric: 'Average Student Mastery',
      masteryValue: '95.4%',
    };
  }, [isCodingNiche, isSchoolNiche, isMadrasatNiche, classroomConfig.breakoutPodsTitle]);

  // Live Classroom Host State & Lifecycle
  const [activeTeacherSession, setActiveTeacherSession] = useState<LiveClassSession | null>(null);
  const [sessionTitleInput, setSessionTitleInput] = useState<string>('');
  const [selectedCourseTitle, setSelectedCourseTitle] = useState<string>('');
  const [targetStudentIds, setTargetStudentIds] = useState<string[]>([]);
  const [isCopiedInvite, setIsCopiedInvite] = useState<boolean>(false);

  useEffect(() => {
    if (!selectedCourseTitle && courses.length > 0) {
      setSelectedCourseTitle(courses[0].title);
    }
  }, [courses, selectedCourseTitle]);

  // Sync existing sessions on mount
  useEffect(() => {
    const existingSessions = classroomSessionService.getSessions(tenant.subdomain);
    const myActive = existingSessions.find((s) => s.status === 'live');
    if (myActive) {
      setActiveTeacherSession(myActive);
    }
  }, [tenant.subdomain]);

  const handleLaunchSession = () => {
    const effectiveCourseTitle = selectedCourseTitle.trim() || courses[0]?.title || tenant.name || 'Core Curriculum';
    const effectiveTopic = sessionTitleInput.trim() || `${effectiveCourseTitle} Live Session`;

    const newSession: LiveClassSession = {
      id: `room-${tenant.subdomain}-${Date.now().toString().slice(-6)}`,
      title: effectiveTopic,
      courseTitle: effectiveCourseTitle,
      teacherId: user?.id || 'teacher-host',
      teacherName: user?.name || teacherPersona.defaultName,
      targetLevel: 'all',
      targetCohort: effectiveCourseTitle,
      allowedStudentIds: targetStudentIds,
      startedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'live',
      subdomain: tenant.subdomain,
      niche: tenant.niche,
    };
    classroomSessionService.startSession(newSession);
    setActiveTeacherSession(newSession);
    onAddToast({
      type: 'success',
      title: 'Classroom Broadcasted',
      message: `Live class for "${effectiveCourseTitle}" is now active. Enrolled students can now join.`
    });
  };

  const handleEndSession = () => {
    if (activeTeacherSession) {
      classroomSessionService.endSession(tenant.subdomain, activeTeacherSession.id);
      setActiveTeacherSession(null);
      onAddToast({
        type: 'info',
        title: 'Session Concluded',
        message: 'Live class session ended and broadcasted to all connected students.'
      });
    }
  };

  const handleCopyInviteLink = () => {
    if (!activeTeacherSession) return;
    const link = classroomSessionService.generateInviteLink(tenant.subdomain, activeTeacherSession.id);
    navigator.clipboard.writeText(link);
    setIsCopiedInvite(true);
    setTimeout(() => setIsCopiedInvite(false), 2500);
    onAddToast({
      type: 'success',
      title: 'Direct Student Link Copied!',
      message: 'Invite link copied to clipboard. Share with your student(s).'
    });
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-slate-100 font-sans text-slate-900" dir={direction}>
      {/* Mobile Drawer Backdrop */}
      {isMobileNavOpen && (
        <div
          onClick={() => setIsMobileNavOpen(false)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* 1. Fixed Teacher Left Sidebar (Dynamic Background & White Label) */}
      <aside
        style={{ backgroundColor: tenant?.brandColor || tenant?.theme?.primaryColor || 'var(--sidebar-bg, #047857)' }}
        className={`w-64 sm:w-72 max-w-[85vw] h-[100dvh] lg:h-full flex flex-col justify-between text-white border-r border-white/15 shrink-0 select-none z-50 transition-transform duration-300 ${
          isMobileNavOpen
            ? 'fixed inset-y-0 left-0 shadow-2xl translate-x-0'
            : 'hidden lg:flex'
        }`}
      >
        <div className="flex flex-col h-full min-h-0">
          {/* Academy Brand Header */}
          <div className="h-16 px-4 sm:px-5 border-b border-white/15 flex items-center justify-between shrink-0 bg-black/15">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-8 h-8 rounded-xl bg-white/20 border border-white/20 text-white flex items-center justify-center font-semibold text-xs shrink-0 shadow-xs"
              >
                {isCodingNiche ? <Code2 className="w-4 h-4 text-white" /> : isSchoolNiche ? <GraduationCap className="w-4 h-4 text-white" /> : <BookOpen className="w-4 h-4 text-white" />}
              </div>
              <div className="min-w-0">
                <h2 className="font-semibold text-xs sm:text-sm text-white truncate">{tenant.name}</h2>
                <p className="text-[10px] sm:text-[11px] text-white/70 font-mono truncate">{tenant.customDomain || `${tenant.subdomain}.edu`}</p>
              </div>
            </div>

            {isMobileNavOpen && (
              <button
                onClick={() => setIsMobileNavOpen(false)}
                className="lg:hidden p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer outline-none"
                aria-label="Close navigation"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            )}
          </div>

          {/* Teacher Profile Snapshot in Sidebar */}
          <div className="p-3.5 mx-3.5 my-3 bg-white/10 rounded-2xl border border-white/15 shrink-0 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-white/25 shrink-0 shadow-xs">
                <img
                  src={user?.avatarUrl || '/images/muslim_teacher_woman.jpg'}
                  alt={user?.name || teacherPersona.defaultName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-xs sm:text-sm text-white truncate">{user?.name || teacherPersona.defaultName}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span className="text-[10px] font-semibold text-white/90 capitalize tracking-wider">{teacherPersona.badge}</span>
                </div>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-white/15 flex items-center justify-between text-[11px] text-white/80">
              <span>{assignedStudents.length} {isCodingNiche ? 'Mentees' : 'Students'}</span>
              <span className="font-semibold text-white">
                {submissions.filter((s) => s.status === 'Pending').length} To Review
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 overflow-y-auto px-3.5 space-y-1.5 min-h-0 py-1">
            <div className="px-3 pt-2 pb-1 text-xs font-semibold capitalize tracking-wider text-white/70">
              Instructor Navigation
            </div>
            {[
              { id: 'students' as TeacherTab, label: isCodingNiche ? 'My Mentees & Repos' : 'Assigned Students', icon: Users, badge: assignedStudents.length },
              { id: 'grading' as TeacherTab, label: isCodingNiche ? 'PR Review Studio' : isSchoolNiche ? 'Gradebook Studio' : 'Grading & Rating Studio', icon: isCodingNiche ? GitPullRequest : Award, badge: submissions.filter((s) => s.status === 'Pending').length, badgeColor: 'bg-white/20 text-white font-semibold' },
              { id: 'classroom' as TeacherTab, label: teacherPersona.classroomName, icon: Radio, badge: 'Live', badgeColor: 'bg-white text-slate-900' },
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
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer select-none outline-none ${
                    isActive
                      ? 'bg-white/20 text-white shadow-xs font-semibold backdrop-blur-xs'
                      : 'text-white/85 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className="w-4.5 h-4.5 shrink-0 text-white" />
                    <span className="truncate text-white">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 border border-white/20 ${item.badgeColor || 'bg-white/15 text-white'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom Fixed Logout Bar */}
          <div className="p-3.5 border-t border-white/15 shrink-0 bg-black/15">
            <button
              onClick={async () => {
                const ok = await confirm({
                  title: 'Sign Out (Faculty Session)',
                  message: 'Are you sure you want to end your instructor session?',
                  confirmText: 'Sign Out',
                  cancelText: 'Stay Signed In',
                  variant: 'danger',
                });
                if (ok) logout();
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-white/90 hover:text-white hover:bg-white/15 transition-colors cursor-pointer outline-none"
            >
              <LogOut className="w-4 h-4 text-white" />
              <span className="text-white">Sign Out (Faculty Session)</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Viewport */}
      <main className="flex-1 h-full overflow-y-auto flex flex-col min-w-0 bg-slate-50">
        {/* Mobile Header Bar */}
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
              aria-label="Open navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-semibold text-sm text-slate-900">{tenant.name}</span>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setActiveTab('classroom')}
            className="font-semibold text-xs"
            leftIcon={<Radio className="w-3.5 h-3.5" />}
          >
            Live
          </Button>
        </div>

        {/* Dynamic Tab Body */}
        <div className="p-4 md:p-8 flex-1">
          <div className="w-11/12 mx-auto space-y-6">
            <PageHeader
              title={teacherPersona.title}
              description={
                isCodingNiche
                  ? 'Git Pull Requests, Code Architecture Reviews, and Live Pairing Rooms'
                  : isSchoolNiche
                  ? 'Standardized Exam Scoring, Gradebook Records, and Faculty Advisory'
                  : isMadrasatNiche
                  ? 'Assigned Halaqahs, Homework Evaluations, and Live Recitation Grading'
                  : 'Assigned Cohorts, Coursework Evaluations, and Live Interactive Sessions'
              }
              badge={{ text: tenant.name, variant: 'primary' }}
              action={
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setActiveTab('classroom')}
                  className="font-semibold text-xs"
                  leftIcon={<Radio className="w-3.5 h-3.5" />}
                >
                  Start Class
                </Button>
              }
            />

            {/* Demo Role Switcher (Shown ONLY in Demo Sandbox) */}
            <DemoRoleSwitcher />

            {/* TAB 1: ASSIGNED STUDENTS / MENTEES */}
            {activeTab === 'students' && (
              <div className="space-y-6">
                {/* Metric Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard
                    title={teacherPersona.studentsMetric}
                    value={assignedStudents.length}
                    icon={Users}
                    subtext="Enrolled students"
                  />
                  <StatCard
                    title={teacherPersona.pendingMetric}
                    value={submissions.filter((s) => s.status === 'Pending').length}
                    icon={Clock}
                    subtext="Requires review"
                  />
                  <StatCard
                    title="Average Attendance"
                    value="97.8%"
                    icon={UserCheck}
                    subtext="Attendance record"
                  />
                  <StatCard
                    title={teacherPersona.masteryMetric}
                    value={teacherPersona.masteryValue}
                    icon={Award}
                    subtext="Cohort average"
                  />
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
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
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
              {assignedStudents.length === 0 ? (
                <div className="py-12 px-4 text-center rounded-2xl bg-white border border-dashed border-slate-300 space-y-3">
                  <Users className="w-10 h-10 text-slate-300 mx-auto" />
                  <h3 className="text-sm font-semibold text-slate-900">No Students Enrolled Yet</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    When students enroll or are assigned to your class by academy administrators, they will appear here.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {paginatedStudents.map((std) => (
                      <Card
                        key={std.id}
                        className="p-6 bg-white border border-slate-200/90 rounded-2xl hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-semibold text-sm shadow-sm">
                                {std.avatar}
                              </div>
                              <div>
                                <h3 className="font-semibold text-slate-900 text-sm">{std.name}</h3>
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
                              className="text-[10px] font-semibold"
                            >
                              {std.lastEvaluationStatus}
                            </Badge>
                          </div>

                          {/* Current Curriculum Target / Repo */}
                          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                            <div className="text-[10px] font-semibold text-slate-400 capitalize tracking-wider">
                              {isCodingNiche ? 'Assigned Track / Branch' : isSchoolNiche ? 'Subject / Current Unit' : 'Current Target'}
                            </div>
                            <div className="font-semibold text-slate-900 text-xs truncate">{std.currentSurahOrTrack}</div>
                            <div className="text-[11px] text-slate-600 truncate">{std.currentAyahOrLesson}</div>
                          </div>

                          {/* Progress Stats */}
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <div className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-100">
                              <div className="text-[10px] text-emerald-800 font-semibold">
                                {isCodingNiche ? 'Tests Passing' : isSchoolNiche ? 'Academic Score' : 'Mastery'}
                              </div>
                              <div className="text-sm font-semibold text-emerald-700">{std.masteryPercent}%</div>
                            </div>
                            <div className="p-2 rounded-lg bg-blue-50/60 border border-blue-100">
                              <div className="text-[10px] text-blue-800 font-semibold">Attendance</div>
                              <div className="text-sm font-semibold text-blue-700">{std.attendancePercent}%</div>
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
                            className="flex-1 justify-center font-semibold text-xs"
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
                            className="text-slate-700 font-semibold text-xs"
                          >
                            Message
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Students Pagination */}
                  <TablePagination
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
                </>
              )}
            </div>
          )}

          {/* TAB 2: GRADING & RATING STUDIO */}
          {activeTab === 'grading' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
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
              {submissions.length === 0 ? (
                <div className="py-12 px-4 text-center rounded-2xl bg-white border border-dashed border-slate-300 space-y-3">
                  <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                  <h3 className="text-sm font-semibold text-slate-900">No Submissions Pending Review</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Student recitation assignments, code repositories, and homework will appear here once submitted.
                  </p>
                </div>
              ) : (
                <Card className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-sans">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold capitalize tracking-wider text-[10px]">
                        <tr>
                          <TableSortHeader
                            field="studentName"
                            currentSortField={submissionSortField}
                            currentSortDir={submissionSortDir}
                            onSort={(field) => {
                              if (submissionSortField === field) {
                                setSubmissionSortDir((p) => (p === 'asc' ? 'desc' : 'asc'));
                              } else {
                                setSubmissionSortField(field as any);
                                setSubmissionSortDir('asc');
                              }
                            }}
                          >
                            Student / Mentee
                          </TableSortHeader>
                          <th className="py-3.5 px-4">
                            {isCodingNiche ? 'Repository & PR Branch' : isSchoolNiche ? 'Course & Assignment Unit' : 'Surah & Target Ayahs'}
                          </th>
                          <TableSortHeader
                            field="submittedAt"
                            currentSortField={submissionSortField}
                            currentSortDir={submissionSortDir}
                            onSort={(field) => {
                              if (submissionSortField === field) {
                                setSubmissionSortDir((p) => (p === 'asc' ? 'desc' : 'asc'));
                              } else {
                                setSubmissionSortField(field as any);
                                setSubmissionSortDir('asc');
                              }
                            }}
                          >
                            Submitted
                          </TableSortHeader>
                          <th className="py-3.5 px-4">Evaluation Verdict</th>
                          <th className="py-3.5 px-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {paginatedSubmissions.map((sub) => (
                          <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3.5 px-4 font-semibold text-slate-900">
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
                              <div className="flex flex-col gap-1 items-start">
                                <Badge
                                  variant={
                                    sub.status === 'Graded'
                                      ? 'success'
                                      : 'warning'
                                  }
                                >
                                  {sub.currentGrade || sub.status}
                                </Badge>
                                {sub.teacherAudioFeedbackUrl && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded-md">
                                    <Volume2 className="w-2.5 h-2.5" />
                                    Voice Note ({sub.teacherAudioFeedbackDuration || 15}s)
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenGrading(sub)}
                                className="font-semibold text-xs"
                              >
                                {sub.status === 'Graded' ? 'Review' : 'Grade'}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-3 border-t border-slate-200">
                    <TablePagination
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
              )}
            </div>
          )}

          {/* TAB 3: LIVE CLASSROOM / HOST STUDIO */}
          {activeTab === 'classroom' && (
            <div className="space-y-4">
              {!activeTeacherSession ? (
                /* Live Session Creator & Launcher Console */
                <Card className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-4xl mx-auto space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center font-semibold shadow-md shrink-0">
                        <Radio className="w-6 h-6 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 tracking-tight">
                          Start Live Classroom Session
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Select an academy course defined by your administrator, set your topic, and start live streaming.
                        </p>
                      </div>
                    </div>

                    <Badge variant="primary" className="font-semibold text-xs shrink-0">
                      Host: {user?.name || teacherPersona.defaultName}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Academy Course Selector */}
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-semibold text-slate-800">Select Academy Course</label>
                      <select
                        value={selectedCourseTitle}
                        onChange={(e) => setSelectedCourseTitle(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      >
                        {courses.length > 0 ? (
                          courses.map((c) => (
                            <option key={c.id} value={c.title}>
                              {c.title}
                            </option>
                          ))
                        ) : (
                          <option value={tenant.name || 'Core Curriculum'}>
                            {tenant.name || 'Core Curriculum'} (General Course)
                          </option>
                        )}
                      </select>
                    </div>

                    {/* Session Title */}
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-semibold text-slate-800">Live Session Title / Topic</label>
                      <input
                        type="text"
                        value={sessionTitleInput}
                        onChange={(e) => setSessionTitleInput(e.target.value)}
                        placeholder="e.g. Chapter 4 Review, Midterm Prep, Q&A Session..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  {/* Specific Student Selection Option */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-800">
                        Assign Specific Students (Optional, leave empty for all in cohort):
                      </label>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {targetStudentIds.length === 0 ? 'All Enrolled' : `${targetStudentIds.length} Selected`}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
                      {assignedStudents.map((std) => {
                        const isChecked = targetStudentIds.includes(std.id);
                        return (
                          <label
                            key={std.id}
                            className={`p-2 rounded-lg border text-xs flex items-center gap-2 cursor-pointer transition-all ${
                              isChecked
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setTargetStudentIds((prev) => [...prev, std.id]);
                                } else {
                                  setTargetStudentIds((prev) => prev.filter((id) => id !== std.id));
                                }
                              }}
                              className="rounded text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="truncate">{std.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Launch Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-500">
                      When started, active students will see a real-time auto-join banner and can access via shareable URL.
                    </p>

                    <Button
                      variant="primary"
                      onClick={handleLaunchSession}
                      leftIcon={<Play className="w-4 h-4" />}
                      className="px-6 py-3 font-semibold text-xs shadow-md"
                    >
                      Start
                    </Button>
                  </div>
                </Card>
              ) : (
                /* Active Session Host Deck & Live Class Hub */
                <div className="space-y-3">
                  {/* Floating Persistent Host Control Bar */}
                  <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-white text-sm truncate">{activeTeacherSession.title}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Live Host Active
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          Target: <strong className="text-slate-300">{activeTeacherSession.targetCohort}</strong> • Level: <strong className="text-slate-300">{activeTeacherSession.targetLevel.toUpperCase()}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCopyInviteLink}
                        leftIcon={isCopiedInvite ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700 font-semibold text-xs"
                      >
                        {isCopiedInvite ? 'Copied' : 'Copy'}
                      </Button>

                      <Button
                        size="sm"
                        variant="danger"
                        onClick={handleEndSession}
                        leftIcon={<PhoneOff className="w-3.5 h-3.5" />}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs"
                      >
                        End
                      </Button>
                    </div>
                  </div>

                  <div className="h-[750px] rounded-3xl overflow-hidden shadow-xl border border-slate-800">
                    <LiveClassroomHub
                      userRole="teacher"
                      currentUserName={user?.name || teacherPersona.defaultName}
                      niche={tenant.niche}
                      roomTitle={activeTeacherSession.title}
                      courseTitle={activeTeacherSession.courseTitle || `${tenant.name} Live Studio`}
                      studentLevel="intermediate"
                      onLeaveRoom={handleEndSession}
                      renderWorkspacePlugin={
                        isSchoolNiche ? (
                          <SchoolLMSWorkspace onAddToast={onAddToast} />
                        ) : isCodingNiche ? (
                          <CodingSandboxWorkspace />
                        ) : isMadrasatNiche ? (
                          <QuranLMSWorkspace />
                        ) : (
                          <SchoolLMSWorkspace onAddToast={onAddToast} />
                        )
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ATTENDANCE SHEET */}
          {activeTab === 'attendance' && (
            <div className="space-y-6">
              {/* Header & Subtabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Daily Roll Call & Attendance Control</h2>
                  <p className="text-xs text-slate-500">
                    Showing active students in session by default to avoid clutter. Filter by halaqah, bulk-mark status, or review students needing attention.
                  </p>
                </div>

                <div className="flex items-center gap-6 border-b border-slate-200">
                  <button
                    onClick={() => setAttendanceSubTab('roster')}
                    className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                      attendanceSubTab === 'roster'
                        ? 'border-emerald-600 text-emerald-700'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <span>Roll Call Roster</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                      {filteredAttendanceStudents.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setAttendanceSubTab('attention')}
                    className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                      attendanceSubTab === 'attention'
                        ? 'border-rose-600 text-rose-700'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                    <span>Needing Attention</span>
                    {attentionStudents.length > 0 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-semibold">
                        {attentionStudents.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Smart Filter & Control Bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  {/* Left Filters */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Enrollment Status Filter */}
                    <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs">
                      <Filter className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-semibold text-slate-600 text-[11px]">Enrollment:</span>
                      <select
                        value={attendanceEnrollmentFilter}
                        onChange={(e) => setAttendanceEnrollmentFilter(e.target.value as any)}
                        className="bg-transparent text-slate-900 font-semibold text-xs focus:outline-none cursor-pointer"
                      >
                        <option value="active">Active (In-Session Only)</option>
                        <option value="all">All Enrolled</option>
                        <option value="leave">On Leave / Paused</option>
                        <option value="graduated">Graduated / Alumni</option>
                      </select>
                    </div>

                    {/* Class / Halaqah Filter */}
                    <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs">
                      <span className="font-semibold text-slate-600 text-[11px]">Halaqah / Class:</span>
                      <select
                        value={attendanceCohortFilter}
                        onChange={(e) => setAttendanceCohortFilter(e.target.value)}
                        className="bg-transparent text-slate-900 font-semibold text-xs focus:outline-none cursor-pointer max-w-[180px] truncate"
                      >
                        {cohorts.map((c) => (
                          <option key={c} value={c}>
                            {c === 'all' ? 'All Cohorts & Circles' : c}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Search */}
                    <div className="w-44 sm:w-56">
                      <Input
                        placeholder="Search student..."
                        value={attendanceSearch}
                        onChange={(e) => setAttendanceSearch(e.target.value)}
                        leftIcon={<Search className="w-3.5 h-3.5 text-slate-400" />}
                        className="py-1 text-xs"
                      />
                    </div>
                  </div>

                  {/* Right Actions & Date */}
                  <div className="flex items-center gap-2">
                    <Input
                      type="date"
                      value={attendanceDate}
                      onChange={(e) => setAttendanceDate(e.target.value)}
                      className="w-36 text-xs"
                    />

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSaveAttendance}
                      leftIcon={<CheckCircle2 className="w-4 h-4" />}
                      className="font-semibold text-xs shadow-xs"
                    >
                      Save
                    </Button>
                  </div>
                </div>

                {/* Bulk Actions Bar */}
                {attendanceSubTab === 'roster' && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>
                      Displaying <strong className="text-slate-900">{filteredAttendanceStudents.length}</strong> active students in current filter
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const updates: Record<string, 'present' | 'late' | 'absent' | 'excused'> = {};
                          filteredAttendanceStudents.forEach((std) => {
                            updates[std.id] = 'present';
                          });
                          setAttendanceState((prev) => ({ ...prev, ...updates }));
                          onAddToast({
                            type: 'success',
                            title: 'Marked All Present',
                            message: `Marked all ${filteredAttendanceStudents.length} students in filter as Present.`,
                          });
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer text-[11px]"
                      >
                        Mark All Present
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const updates: Record<string, 'present' | 'late' | 'absent' | 'excused'> = {};
                          filteredAttendanceStudents.forEach((std) => {
                            updates[std.id] = 'excused';
                          });
                          setAttendanceState((prev) => ({ ...prev, ...updates }));
                          onAddToast({
                            type: 'info',
                            title: 'Marked All Excused',
                            message: `Marked all ${filteredAttendanceStudents.length} students in filter as Excused.`,
                          });
                        }}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 font-semibold border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer text-[11px]"
                      >
                        Mark Excused
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Sub-view 1: Standard Roll Call Roster */}
              {attendanceSubTab === 'roster' && (
                <Card className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold capitalize tracking-wider text-[10px]">
                        <tr>
                          <th className="py-3 px-4">Student</th>
                          <th className="py-3 px-4">Cohort / Halaqah</th>
                          <th className="py-3 px-4 text-center">Enrollment</th>
                          <th className="py-3 px-4 text-center">Term Attendance %</th>
                          <th className="py-3 px-4 text-center">Daily Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredAttendanceStudents.map((std) => (
                          <tr key={std.id} className="hover:bg-slate-50">
                            <td className="py-3.5 px-4 font-semibold text-slate-900">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center font-semibold text-xs shrink-0">
                                  {std.avatar}
                                </div>
                                <div>
                                  <span>{std.name}</span>
                                  <span className="text-[10px] text-slate-400 font-mono block">{std.email}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-slate-600 font-medium">{std.cohort}</td>
                            <td className="py-3.5 px-4 text-center">
                              <Badge
                                variant={
                                  std.enrollmentStatus === 'active' || !std.enrollmentStatus
                                    ? 'success'
                                    : std.enrollmentStatus === 'leave'
                                    ? 'warning'
                                    : 'default'
                                }
                                className="capitalize text-[10px]"
                              >
                                {std.enrollmentStatus || 'Active'}
                              </Badge>
                            </td>
                            <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-800">
                              {std.attendancePercent}%
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center justify-center gap-1.5">
                                {(['present', 'late', 'excused', 'absent'] as const).map((status) => (
                                  <button
                                    key={status}
                                    onClick={() => setAttendance(std.id, status)}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                                      attendanceState[std.id] === status
                                        ? status === 'present'
                                          ? 'bg-emerald-600 text-white shadow-xs'
                                          : status === 'late'
                                          ? 'bg-amber-500 text-slate-950 font-semibold'
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
                  </div>
                </Card>
              )}

              {/* Sub-view 2: Students Needing Attention */}
              {attendanceSubTab === 'attention' && (
                <div className="space-y-4">
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-xs sm:text-sm font-semibold text-rose-950">
                        Attendance Disruption & At-Risk Students Requiring Faculty Intervention
                      </h4>
                      <p className="text-xs text-rose-800 leading-relaxed">
                        These students missed the latest concluded live class, missed yesterday's session, or departed early before completion. Use the quick buttons below to notify parents directly via WhatsApp or Email.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {attentionStudents.map((std) => {
                      const isMissedLatest = std.attendanceAttentionReason === 'missed_latest';
                      const isMissedYesterday = std.attendanceAttentionReason === 'missed_yesterday';
                      const isLeftEarly = std.attendanceAttentionReason === 'left_early';

                      return (
                        <Card key={std.id} className="p-5 bg-white border border-rose-200 shadow-xs space-y-4 flex flex-col justify-between">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-full bg-rose-600 text-white font-semibold text-xs flex items-center justify-center shrink-0">
                                  {std.avatar}
                                </div>
                                <div className="min-w-0">
                                  <h4 className="font-semibold text-xs sm:text-sm text-slate-900 truncate">{std.name}</h4>
                                  <p className="text-[11px] text-slate-500 truncate">{std.cohort}</p>
                                </div>
                              </div>

                              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                                {std.attendancePercent}%
                              </span>
                            </div>

                            {/* Attention Reason Pill */}
                            <div className="p-2.5 rounded-xl text-xs font-semibold space-y-1 border bg-slate-50">
                              {isMissedLatest && (
                                <div className="text-rose-800 flex items-center gap-1.5 font-semibold">
                                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                                  Missed Latest Concluded Class
                                </div>
                              )}
                              {isMissedYesterday && (
                                <div className="text-amber-800 flex items-center gap-1.5 font-semibold">
                                  <span className="w-2 h-2 rounded-full bg-amber-600" />
                                  Missed Yesterday ({std.consecutiveAbsences || 2} Consecutive Missed)
                                </div>
                              )}
                              {isLeftEarly && (
                                <div className="text-purple-800 flex items-center gap-1.5 font-semibold">
                                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                                  Incomplete Class (Left 20m Early)
                                </div>
                              )}
                              <p className="text-[10px] text-slate-500 font-normal">
                                Parent Phone: <span className="font-mono font-semibold">{std.parentPhone}</span>
                              </p>
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleSendParentWhatsApp(std)}
                              className="flex-1 py-2.5 px-3 bg-[var(--color-primary,#047857)] hover:brightness-95 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer outline-none"
                              title="Send WhatsApp Parent Alert"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleSendParentEmail(std)}
                              className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200"
                              title="Send Email Notice"
                            >
                              <Mail className="w-3.5 h-3.5 text-slate-600" />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setAttendance(std.id, 'excused');
                                onAddToast({
                                  type: 'info',
                                  title: 'Marked Excused',
                                  message: `${std.name} absence recorded as Excused.`,
                                });
                              }}
                              className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer border border-slate-200"
                              title="Excuse Absence"
                            >
                              Excuse
                            </button>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
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
                <h3 className="font-semibold text-base text-slate-900">Academic Curriculum & Syllabus Studio</h3>
                <p className="text-xs text-slate-500">Manage lesson plans, course syllabi, problem sets, and reading lists.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="font-semibold text-xs text-slate-900">AP Calculus AB</div>
                    <div className="text-[11px] text-slate-500">8 Units • 34 Lecture Notes • 12 Problem Sets</div>
                    <Badge variant="success">Active Syllabus</Badge>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="font-semibold text-xs text-slate-900">AP Chemistry</div>
                    <div className="text-[11px] text-slate-500">10 Units • 20 Lab Experiments</div>
                    <Badge variant="success">Active Syllabus</Badge>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="font-semibold text-xs text-slate-900">World History Honors</div>
                    <div className="text-[11px] text-slate-500">6 Units • 18 Primary Source Readings</div>
                    <Badge variant="success">Active Syllabus</Badge>
                  </div>
                </div>
              </Card>
            ) : isMadrasatNiche ? (
              <div className="rounded-2xl overflow-hidden">
                <QuranLMSWorkspace />
              </div>
            ) : (
              <Card className="p-6 bg-white border border-slate-200 rounded-2xl space-y-4">
                <h3 className="font-semibold text-base text-slate-900">Curriculum & Coursework Studio</h3>
                <p className="text-xs text-slate-500">Manage lesson plans, course syllabi, assignments, and practical workshops.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="font-semibold text-xs text-slate-900">Applied Operations & Practicum</div>
                    <div className="text-[11px] text-slate-500">8 Modules • 24 Case Studies • 6 Projects</div>
                    <Badge variant="success">Active Syllabus</Badge>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="font-semibold text-xs text-slate-900">Professional Leadership</div>
                    <div className="text-[11px] text-slate-500">6 Units • 12 Field Exercises</div>
                    <Badge variant="success">Active Syllabus</Badge>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="font-semibold text-xs text-slate-900">Quantitative Benchmarks</div>
                    <div className="text-[11px] text-slate-500">10 Modules • 15 Analysis Reports</div>
                    <Badge variant="success">Active Syllabus</Badge>
                  </div>
                </div>
              </Card>
            )
          )}

          {/* TAB 7: SETTINGS */}
          {activeTab === 'settings' && (
            <Card className="p-6 bg-white border border-slate-200 rounded-2xl max-w-2xl space-y-6">
              <div className="space-y-1">
                <h3 className="font-semibold text-base text-slate-900">Instructor Profile Settings</h3>
                <p className="text-xs text-slate-500">Manage your faculty credentials and availability schedule.</p>
              </div>

              <div className="space-y-4">
                <Input label="Instructor Full Name" defaultValue={user?.name || teacherPersona.defaultName} />
                <Input label="Email Address" defaultValue={user?.email || `faculty@${tenant.customDomain || `${tenant.subdomain}.edu`}`} disabled />
                <Input label="Academic Qualification / Lineage" defaultValue={teacherPersona.title} />
                <Input label="Direct Contact WhatsApp" defaultValue="+1 (555) 234-8910" />
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={() => onAddToast({ type: 'success', title: 'Settings Saved', message: 'Instructor profile updated.' })}
                className="font-semibold"
              >
                Save
              </Button>
            </Card>
          )}
          </div>
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
                  <span className="text-xs font-semibold text-amber-400 capitalize tracking-wider">
                    {isCodingNiche ? 'Pull Request Review' : isSchoolNiche ? 'Academic Evaluation' : 'Recitation Evaluation'}
                  </span>
                  <Badge variant="primary" className="bg-amber-950 text-amber-300 border-amber-500/30 text-[10px]">
                    {selectedSubmission.status}
                  </Badge>
                </div>
                <h2 className="text-lg font-semibold text-white mt-1">{selectedSubmission.studentName}</h2>
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
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Terminal className="w-4 h-4 text-blue-600" />
                      Submitted Code Patch
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
                      12/12 Unit Tests Passed (0.08s)
                    </span>
                  </div>
                  <pre className="p-4 bg-slate-950 text-emerald-400 font-mono text-xs rounded-2xl overflow-x-auto border border-slate-800">
                    {selectedSubmission.codeSnippet || '// Code submitted via GitHub Pull Request'}
                  </pre>
                </div>
              ) : isMadrasatNiche ? (
                /* Quran Recitation Audio Player */
                <div className="p-5 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between text-xs text-emerald-900 font-semibold">
                    <span>Student Recitation Audio</span>
                    <span className="font-mono text-[11px]">02:05 / 02:05</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="w-12 h-12 rounded-2xl bg-[var(--color-primary,#047857)] hover:brightness-95 text-white flex items-center justify-center shadow-md cursor-pointer transition-all shrink-0 outline-none"
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
                  <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
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
                  <label className="text-xs font-semibold text-slate-800 block">
                    {classroomConfig.rubricCriteria[0]?.name || (isCodingNiche ? 'Architecture & Clean Code' : isSchoolNiche ? 'Concept Mastery & Depth' : isMadrasatNiche ? 'Tajweed Precision & Makharij' : 'Core Evaluation Criteria')}
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
                    <span className="ml-2 font-semibold text-xs text-slate-700">
                      {(isCodingNiche ? codeArchitectureRating : isSchoolNiche ? conceptMasteryRating : tajweedRating)} / 5
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <label className="text-xs font-semibold text-slate-800 block">
                    {classroomConfig.rubricCriteria[1]?.name || (isCodingNiche ? 'Algorithmic Efficiency' : isSchoolNiche ? 'Analytical Reasoning' : isMadrasatNiche ? 'Memorization Fluency (Hifz)' : 'Execution & Fluency')}
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
                    <span className="ml-2 font-semibold text-xs text-slate-700">
                      {(isCodingNiche ? timeComplexityRating : isSchoolNiche ? analyticalRating : fluencyRating)} / 5
                    </span>
                  </div>
                </div>
              </div>

              {/* Evaluation Verdict Selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-800 block">
                  {isCodingNiche ? 'Pull Request Verdict' : isSchoolNiche ? 'Letter Grade Assessment' : isMadrasatNiche ? 'Formal Sheikh Verdict' : 'Faculty Grade Assessment'}
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
                    : isMadrasatNiche
                    ? [
                        { id: 'Mumtaz', label: 'Mumtaz (A+)', score: 98, desc: 'Mastered' },
                        { id: 'Jayyid Jiddan', label: 'Jayyid Jiddan (A)', score: 88, desc: 'Very Good' },
                        { id: 'Jayyid', label: 'Jayyid (B)', score: 78, desc: 'Good' },
                        { id: 'Iadah', label: "I'adah (Re-record)", score: 60, desc: 'Needs Revision' },
                      ]
                    : [
                        { id: 'Grade A+', label: 'Grade A+ (98%)', score: 98, desc: 'Exemplary Work' },
                        { id: 'Grade A', label: 'Grade A (92%)', score: 92, desc: 'Strong Concept' },
                        { id: 'Grade B', label: 'Grade B (84%)', score: 84, desc: 'Satisfactory' },
                        { id: 'Needs Revision', label: 'Resubmit Work', score: 60, desc: 'Needs Revision' },
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
                      <div className="font-semibold text-xs text-slate-900">{verdict.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{verdict.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Specific Tags */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-800 block">
                  {isCodingNiche ? 'Code Quality & Architecture Tags' : isSchoolNiche ? 'Rubric Criteria Tags' : isMadrasatNiche ? 'Specific Tajweed Correction Tags' : 'Rubric Evaluation Tags'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {(isCodingNiche
                    ? ['Clean Architecture', 'Time Complexity O(n)', 'O(1) Space', 'Async Safety', 'TypeScript Strict', 'Edge Case Coverage']
                    : isSchoolNiche
                    ? ['Flawless Thesis', 'Strong Supporting Citations', 'Calculations Accurate', 'Concept Depth', 'Formatting Checked']
                    : isMadrasatNiche
                    ? ['Qalqalah Intensity', 'Ghunnah Duration', 'Madd Munfasil (4 Harakat)', 'Ikhfaa Pronunciation', 'Harf Dhad Makhraj', 'Stop Rules (Waqf)']
                    : ['Execution Rigor', 'Data Consistency', 'Analytical Depth', 'SOP Compliance', 'Complete Documentation', 'Meets Objectives']
                  ).map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleMistakeTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        selectedMistakeTags.includes(tag)
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {tag} {selectedMistakeTags.includes(tag) && ' (Selected)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Notes (Written) */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-800 block">
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

              {/* Ustaz Spoken Voice Feedback / Audio Correction Note */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-600/10 text-emerald-700 flex items-center justify-center">
                      <Mic className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900">
                        {isCodingNiche ? 'Mentor Voice Note' : isSchoolNiche ? 'Instructor Audio Remark' : 'Sheikh Spoken Voice Remark (Audio Note)'}
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        Attach high-resolution spoken Tajweed or rubric guidance alongside your written evaluation.
                      </p>
                    </div>
                  </div>

                  {voiceFeedbackUrl && (
                    <span className="text-[11px] font-mono font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200">
                      {voiceFeedbackDuration}s recorded
                    </span>
                  )}
                </div>

                {/* Recorder Actions & Preview */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  {/* Hidden Audio Player for Preview */}
                  <audio
                    ref={voiceAudioPlayerRef}
                    onEnded={() => setIsPlayingVoiceFeedback(false)}
                  />

                  {/* 1. Live Recording State */}
                  {isRecordingVoiceFeedback ? (
                    <div className="flex items-center gap-3 w-full bg-rose-50 border border-rose-200 p-2.5 rounded-xl">
                      <div className="flex items-center gap-2 text-rose-600 text-xs font-semibold animate-pulse">
                        <span className="w-3 h-3 rounded-full bg-rose-500 inline-block animate-ping" />
                        <span>Recording Ustaz Audio Note...</span>
                        <span className="font-mono bg-rose-200/80 px-2 py-0.5 rounded text-rose-900 font-semibold">
                          {String(Math.floor(voiceFeedbackDuration / 60)).padStart(2, '0')}:
                          {String(voiceFeedbackDuration % 60).padStart(2, '0')}
                        </span>
                      </div>

                      <div className="flex-1 flex items-center gap-0.5 justify-center h-4">
                        {[40, 70, 30, 90, 60, 100, 45, 80, 50, 95, 35, 75].map((h, i) => (
                          <div
                            key={i}
                            className="w-1 bg-rose-400 rounded-full animate-pulse"
                            style={{
                              height: `${h}%`,
                              animationDelay: `${i * 70}ms`,
                            }}
                          />
                        ))}
                      </div>

                      <Button
                        variant="danger"
                        size="sm"
                        onClick={stopVoiceFeedbackRecording}
                        leftIcon={<Square className="w-3.5 h-3.5 fill-current" />}
                        className="text-xs font-semibold"
                      >
                        Stop Recording
                      </Button>
                    </div>
                  ) : voiceFeedbackUrl ? (
                    /* 2. Recorded Preview State */
                    <div className="flex items-center justify-between w-full bg-white border border-emerald-200 p-2.5 rounded-xl shadow-xs">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={togglePlayVoiceFeedbackPreview}
                          className="w-8 h-8 rounded-full bg-[var(--color-primary,#047857)] text-white flex items-center justify-center hover:brightness-95 transition-colors shadow-xs cursor-pointer outline-none"
                        >
                          {isPlayingVoiceFeedback ? (
                            <Square className="w-3.5 h-3.5 fill-current" />
                          ) : (
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          )}
                        </button>
                        <div>
                          <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                            <span>Voice Remark Attached</span>
                            <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded font-mono font-semibold">
                              Ready
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-mono">
                            Click play to preview oral correction before publishing.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={deleteVoiceFeedback}
                          leftIcon={<Trash2 className="w-3.5 h-3.5 text-rose-500" />}
                          className="text-xs text-rose-600 hover:bg-rose-50"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* 3. Idle / Start Recording State */
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={startVoiceFeedbackRecording}
                        leftIcon={<Mic className="w-3.5 h-3.5 text-emerald-600" />}
                        className="font-semibold text-xs bg-white hover:bg-emerald-50 hover:border-emerald-300 text-slate-800"
                      >
                        Record
                      </Button>
                      <span className="text-[11px] text-slate-400">
                        Microphone will capture oral articulation & tajweed corrections.
                      </span>
                    </div>
                  )}
                </div>
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
                className="text-slate-600 font-semibold"
              >
                Cancel
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={handleSaveEvaluation}
                className="font-semibold shadow-md"
                rightIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Grade
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};