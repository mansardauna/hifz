import React, { useState, useMemo } from 'react';
import { Course, RecitationSubmission } from '../../types';
import { MOCK_COURSES, MOCK_RECITATIONS, MOCK_TENANTS } from '../../services/mockData';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { ToastMessage } from '../ui/Toast';
import {
  BookOpen,
  CheckCircle2,
  Award,
  Sparkles,
  MessageSquare,
  Clock,
  BarChart2,
  Star,
  Code2,
  GitPullRequest,
  Terminal,
  Cpu,
  Flame,
  Volume2
} from 'lucide-react';

import { isDemoTenant as checkIsDemoTenant } from '../../lib/tenants';

interface StudentProgressProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
  submissions?: RecitationSubmission[];
}

export const StudentProgress: React.FC<StudentProgressProps> = ({ onAddToast, submissions = [] }) => {
  const { tenant, language, direction, courses: contextCourses } = useTenant();
  const { user } = useAuth();

  const isCodingNiche = tenant.niche === 'coding' || tenant.subdomain.includes('code');
  const isSchoolNiche = tenant.niche === 'school' || tenant.subdomain.includes('school');
  const isAr = language === 'ar';

  const isDemoTenant = checkIsDemoTenant(tenant.subdomain);

  // Default baseline syllabus - lessons start unchecked (completed: false) for real student accounts
  const defaultQuranModules = [
    {
      id: 'mod-1',
      title: "Juz 30 (Amma) & Tajweed Foundations",
      titleAr: "جزء عم وأساسيات التجويد",
      lessons: [
        { id: 'les-1', title: "Surah An-Naba' (The Tidings) - Makharij Check", completed: isDemoTenant, durationMinutes: 20, tajweedRule: "Makharij & Tafkheem" },
        { id: 'les-2', title: "Surah An-Nazi'at - Madd Natural & Ja'iz", completed: isDemoTenant, durationMinutes: 25, tajweedRule: "Ahkam Al-Madd" },
        { id: 'les-3', title: "Surah Abasa - Ghunnah in Noon & Meem", completed: isDemoTenant, durationMinutes: 20, tajweedRule: "Noon Mushaddadah" },
        { id: 'les-4', title: "Surah At-Takwir & Al-Infitar - Stopping Rules", completed: false, durationMinutes: 30, tajweedRule: "Waqf & Ibtida" },
        { id: 'les-5', title: "Surah Al-Mutaffifin - Qalqalah letters", completed: false, durationMinutes: 25, tajweedRule: "Ahkam Al-Qalqalah" },
      ]
    },
    {
      id: 'mod-2',
      title: "Juz 29 (Tabarak) Memorization & Muraja'ah",
      titleAr: "جزء تبارك والمراجعة التثبيتية",
      lessons: [
        { id: 'les-6', title: "Surah Al-Mulk - Full Oral Recitation", completed: false, durationMinutes: 30, tajweedRule: "Ahkam Nun Sakinah" },
        { id: 'les-7', title: "Surah Al-Qalam - Phonetic Precision", completed: false, durationMinutes: 25, tajweedRule: "Idgham with Ghunnah" },
        { id: 'les-8', title: "Surah Al-Haaqqah - Oral Verification", completed: false, durationMinutes: 30, tajweedRule: "Ikhfa Haqiqi" },
      ]
    },
    {
      id: 'mod-3',
      title: "Surah Al-Baqarah & Ali 'Imran Halaqah",
      titleAr: "سورة البقرة وآل عمران",
      lessons: [
        { id: 'les-9', title: "Al-Baqarah (Ayah 1 - 25) - Foundation Hifz", completed: false, durationMinutes: 45, tajweedRule: "Madd Lazim Kalimi" },
        { id: 'les-10', title: "Al-Baqarah (Ayah 255 - Ayat Al-Kursi)", completed: false, durationMinutes: 35, tajweedRule: "Advanced Tajweed" },
      ]
    }
  ];

  // Resolve active course or baseline course
  const activeCourse = useMemo(() => {
    if (contextCourses && contextCourses.length > 0) {
      return contextCourses[0];
    }
    if (isDemoTenant) {
      const demoMatch = MOCK_COURSES.find((c) =>
        isCodingNiche ? c.tenantId === 'tenant-code' : c.tenantId !== 'tenant-code'
      );
      if (demoMatch) return demoMatch;
    }
    // Fallback baseline course with genuine track
    return {
      id: 'course-primary',
      tenantId: tenant.id,
      title: isCodingNiche
        ? 'Full-Stack Software Architecture Bootcamp'
        : isSchoolNiche
        ? 'Secondary Academic Curriculum & Practicum'
        : 'Quran Hifz, Tajweed & Sanad Mastery Track',
      instructorName: isDemoTenant
        ? (isCodingNiche ? 'Lead Architect' : isSchoolNiche ? 'Department Faculty' : 'Ustadhah Zainab')
        : (contextCourses && contextCourses[0]?.instructorName ? contextCourses[0].instructorName : 'Academy Mentor'),
      level: 'All Levels',
      category: isCodingNiche ? 'Technology' : isSchoolNiche ? 'Academics' : 'Quranic Sciences',
      modules: defaultQuranModules,
      enrolledCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as unknown as Course;
  }, [contextCourses, isDemoTenant, isCodingNiche, isSchoolNiche, tenant.id]);

  const [modules, setModules] = useState(activeCourse?.modules || defaultQuranModules);

  // Calculate Granular Progress Metrics
  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessons = modules.reduce(
    (acc, m) => acc + m.lessons.filter((l) => l.completed).length,
    0
  );
  const courseProgressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const handleToggleLessonComplete = (modId: string, lesId: string) => {
    setModules((prev) =>
      prev.map((m) => {
        if (m.id === modId) {
          return {
            ...m,
            lessons: m.lessons.map((l) => {
              if (l.id === lesId) {
                const nextState = !l.completed;
                onAddToast({
                  type: 'success',
                  title: nextState
                    ? (isAr ? 'تم إكمال الدرس!' : 'Lesson Milestone Completed!')
                    : (isAr ? 'تم إلغاء تحديد الدرس' : 'Lesson Marked Incomplete'),
                  message: isAr
                    ? 'تم تحديث نسبة تقدمك في المنهج تلقائياً'
                    : 'Your syllabus completion percentage has been recalculated.',
                });
                return { ...l, completed: nextState };
              }
              return l;
            }),
          };
        }
        return m;
      })
    );
  };

  const gradedSubmissionsCount = submissions.filter((s) => s.status === 'graded' || s.status === 'Mastered').length;

  return (
    <div className="space-y-6 font-sans" dir={direction}>
      {/* 1. Progress Metric Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Course Completion Metric */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              {isCodingNiche ? 'Bootcamp Mastery' : isSchoolNiche ? 'Term Progress' : 'Curriculum Completion'}
            </span>
            <BookOpen className="w-5 h-5 text-emerald-600" />
          </div>

          <h3 className="text-3xl font-black text-slate-900 font-display">{courseProgressPercent}%</h3>
          <p className="text-xs text-slate-500 font-medium">
            {completedLessons} of {totalLessons} syllabus milestones verified
          </p>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${courseProgressPercent}%` }}
            />
          </div>
        </div>

        {/* Oral Submissions & Graded Tests */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
              {isCodingNiche ? 'Code Reviews & PRs' : 'Oral Submissions & Tests'}
            </span>
            <Award className="w-5 h-5 text-teal-600" />
          </div>

          <h3 className="text-3xl font-black text-slate-900 font-display">
            {submissions.length > 0 ? `${submissions.length} Submissions` : '4 Evaluated'}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            {gradedSubmissionsCount > 0 ? `${gradedSubmissionsCount} Graded by Ustadhah` : 'Verified by faculty mentors'}
          </p>

          <div className="pt-1">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 inline-block">
              100% On-Track for Sanad
            </span>
          </div>
        </div>

        {/* Attendance & Halaqah Consistency */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Halaqah Attendance Rate
            </span>
            <Sparkles className="w-5 h-5 text-blue-600" />
          </div>

          <h3 className="text-3xl font-black text-slate-900 font-display">98.5% Attended</h3>
          <p className="text-xs text-slate-500 font-medium">
            24 of 24 Live WebRTC halaqat attended this term
          </p>

          <div className="pt-1">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 inline-block">
              Mumtaz Attendance Standing
            </span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Granular Syllabus Checklist */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-900 font-display flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              {isCodingNiche
                ? 'Developer Curriculum & Interactive Labs'
                : 'Syllabus & Milestone Checkpoints'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Check off completed lessons or oral exam checkpoints. Progress updates in real-time across your student portal.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900 text-white shrink-0 self-start sm:self-auto font-mono">
            {completedLessons} / {totalLessons} COMPLETED
          </span>
        </div>

        <div className="space-y-5">
          {modules.map((module) => {
            const modCompleted = module.lessons.filter((l) => l.completed).length;
            const modPercent = Math.round((modCompleted / Math.max(module.lessons.length, 1)) * 100);

            return (
              <div key={module.id} className="border border-slate-200 rounded-2xl p-5 bg-slate-50/60 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      {isAr ? module.titleAr || module.title : module.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {module.lessons.length} {isCodingNiche ? 'coding modules' : 'interactive halaqah lessons'}
                    </p>
                  </div>

                  <span className="text-xs font-bold px-3 py-1 rounded-full shrink-0 self-start sm:self-auto bg-emerald-100 text-emerald-800 font-mono">
                    {modPercent}% Completed
                  </span>
                </div>

                <div className="space-y-2">
                  {module.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      onClick={() => handleToggleLessonComplete(module.id, lesson.id)}
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 cursor-pointer transition-all ${
                        lesson.completed
                          ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                          : 'bg-white border-slate-200/90 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                            lesson.completed
                              ? 'bg-emerald-600 text-white shadow-2xs'
                              : 'border border-slate-300 bg-white'
                          }`}
                        >
                          {lesson.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>

                        <div className="min-w-0">
                          <p className={`text-xs font-bold truncate ${lesson.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                            {lesson.title}
                          </p>
                          {lesson.tajweedRule && (
                            <p className="text-xs text-teal-700 font-semibold truncate mt-0.5">
                              Focus Rule: {lesson.tajweedRule}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-slate-400 font-mono flex items-center gap-1 font-semibold">
                          <Clock className="w-3 h-3" />
                          {lesson.durationMinutes}m
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
