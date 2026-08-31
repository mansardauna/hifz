import React, { useState, useMemo } from 'react';
import { Course, RecitationSubmission } from '../../types';
import { MOCK_COURSES, MOCK_RECITATIONS } from '../../services/mockData';
import { useTenant } from '../../context/TenantContext';
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
  Flame
} from 'lucide-react';

interface StudentProgressProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const StudentProgress: React.FC<StudentProgressProps> = ({ onAddToast }) => {
  const { tenant, language, direction } = useTenant();

  const isCodingNiche = tenant.niche === 'coding' || tenant.subdomain.includes('code');
  const isAr = language === 'ar';

  // Filter courses strictly by tenant niche
  const tenantCourses = useMemo(() => {
    return MOCK_COURSES.filter((c) =>
      isCodingNiche ? c.tenantId === 'tenant-code' : c.tenantId !== 'tenant-code'
    );
  }, [isCodingNiche]);

  const [courses, setCourses] = useState<Course[]>(tenantCourses);
  const [recitations, setRecitations] = useState<RecitationSubmission[]>(MOCK_RECITATIONS);

  const activeCourse = courses[0] || tenantCourses[0] || MOCK_COURSES[0];

  // Calculate Granular Progress Metrics
  const totalLessons = activeCourse.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessons = activeCourse.modules.reduce(
    (acc, m) => acc + m.lessons.filter((l) => l.completed).length,
    0
  );
  const courseProgressPercent = Math.round((completedLessons / Math.max(totalLessons, 1)) * 100);

  const handleToggleLessonComplete = (modId: string, lesId: string) => {
    const updatedModules = activeCourse.modules.map((m) => {
      if (m.id === modId) {
        return {
          ...m,
          lessons: m.lessons.map((l) => {
            if (l.id === lesId) {
              const nextState = !l.completed;
              onAddToast({
                type: 'success',
                title: nextState
                  ? (isAr ? 'تم إكمال الدرس البرمجي!' : 'Lesson Completed!')
                  : (isAr ? 'تم إلغاء تحديد الدرس' : 'Lesson Marked Incomplete'),
                message: isAr
                  ? 'تم تحديث نسبة تقدمك في المنهج تلقائياً'
                  : 'Your granular course progress has been recalculated.',
              });
              return { ...l, completed: nextState };
            }
            return l;
          }),
        };
      }
      return m;
    });

    const updatedCourse = { ...activeCourse, modules: updatedModules };
    setCourses((prev) => prev.map((c) => (c.id === activeCourse.id ? updatedCourse : c)));
  };

  return (
    <div className="space-y-6 font-sans" dir={direction}>
      {/* 1. Niche-Specific Student Progress Overview Cards */}
      {isCodingNiche ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Coding Track Progress */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Bootcamp Completion</span>
              <Code2 className="w-5 h-5 text-blue-600" />
            </div>

            <h3 className="text-3xl font-extrabold text-slate-900">{courseProgressPercent}%</h3>
            <p className="text-xs text-slate-500 mt-1">{completedLessons} of {totalLessons} coding modules completed</p>

            <div className="w-full bg-slate-100 h-3 rounded-full mt-4 overflow-hidden border border-slate-200">
              <div
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-700"
                style={{ width: `${courseProgressPercent}%` }}
              />
            </div>
          </div>

          {/* Algorithm & Coding Challenges */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Algorithms & Sandbox</span>
              <Flame className="w-5 h-5 text-amber-500" />
            </div>

            <h3 className="text-3xl font-extrabold text-slate-900">42 / 50 Solved</h3>
            <p className="text-xs text-slate-500 mt-1">Data structures & LeetCode interview challenges</p>

            <div className="w-full bg-slate-100 h-3 rounded-full mt-4 overflow-hidden border border-slate-200">
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 h-full rounded-full w-[84%]" />
            </div>
          </div>

          {/* Pull Requests & Mentor Reviews */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Code Reviews & PRs</span>
              <GitPullRequest className="w-5 h-5 text-emerald-600" />
            </div>

            <h3 className="text-3xl font-extrabold text-slate-900">5 Merged PRs</h3>
            <p className="text-xs text-slate-500 mt-1">Reviewed by Lead Architect Sarah Jenkins</p>

            <div className="mt-3">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 inline-block">
                All CI/CD Build Tests Passed
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Quran Course Progress */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Course Progress</span>
              <BookOpen className="w-5 h-5 text-teal-600" />
            </div>

            <h3 className="text-3xl font-extrabold text-slate-900">{courseProgressPercent}%</h3>
            <p className="text-xs text-slate-500 mt-1">{completedLessons} of {totalLessons} lessons completed</p>

            <div className="w-full bg-slate-100 h-3 rounded-full mt-4 overflow-hidden border border-slate-200">
              <div
                className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${courseProgressPercent}%` }}
              />
            </div>
          </div>

          {/* Surah Memorization */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Surah Memorization</span>
              <Award className="w-5 h-5 text-amber-600" />
            </div>

            <h3 className="text-3xl font-extrabold text-slate-900">Juz' 30 Complete</h3>
            <p className="text-xs text-slate-500 mt-1">37 of 37 Surahs memorized with Tajweed</p>

            <div className="w-full bg-slate-100 h-3 rounded-full mt-4 overflow-hidden border border-slate-200">
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 h-full rounded-full w-full" />
            </div>
          </div>

          {/* Audio Recitation Feedback */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Audio Submissions</span>
              <Sparkles className="w-5 h-5 text-sky-600" />
            </div>

            <h3 className="text-3xl font-extrabold text-slate-900">{recitations.length} Homework Submissions</h3>
            <p className="text-xs text-slate-500 mt-1">Latest feedback from Qari Shaykh Ahmad</p>

            <div className="mt-3">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 inline-block">
                Latest: Approved with Tajweed Notes
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modules & Granular Lesson Checklist */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-xl font-bold text-slate-900 ${isAr ? 'font-arabic text-2xl' : ''}`}>
              {isCodingNiche
                ? (isAr ? 'منهاج التدريب العملي وهندسة البرمجيات' : 'Developer Curriculum & Interactive Labs')
                : (isAr ? 'خطة الدراسة والدروس التفصيلية' : 'Interactive Curriculum Checklist')}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {isCodingNiche
                ? (isAr ? 'قم بالتأشير على الدروس البرمجية والتحديات المكتملة لتحديث نسبة التقدم' : 'Mark completed coding modules and sandbox challenges to update your graduation progress.')
                : (isAr ? 'قم بالتأشير على الدروس المكتملة للتحديث التفاعلي لنسبة الإنجاز' : 'Mark completed lessons to dynamically update your progress across the Quran LMS.')}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {activeCourse.modules.map((module) => {
            const modCompleted = module.lessons.filter((l) => l.completed).length;
            const modPercent = Math.round((modCompleted / Math.max(module.lessons.length, 1)) * 100);

            return (
              <div key={module.id} className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h4 className={`font-bold text-base text-slate-900 ${isAr ? 'font-arabic text-xl' : ''}`}>
                      {isAr ? module.titleAr || module.title : module.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {module.lessons.length} {isCodingNiche ? 'coding lessons' : (isAr ? 'دروس تفاعلية' : 'interactive lessons')}
                    </p>
                  </div>

                  <span className={`text-xs font-extrabold px-3 py-1 rounded-full shrink-0 ${
                    isCodingNiche ? 'text-blue-700 bg-blue-100' : 'text-teal-700 bg-teal-100'
                  }`}>
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
                          ? isCodingNiche
                            ? 'bg-blue-50/80 border-blue-300 text-blue-950'
                            : 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                            lesson.completed
                              ? isCodingNiche
                                ? 'bg-blue-600 text-white'
                                : 'bg-emerald-600 text-white'
                              : 'border border-slate-300 bg-white'
                          }`}
                        >
                          {lesson.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>

                        <div className="min-w-0">
                          <p className={`text-xs sm:text-sm font-semibold truncate ${lesson.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                            {isAr ? lesson.titleAr || lesson.title : lesson.title}
                          </p>
                          {lesson.tajweedRule && !isCodingNiche && (
                            <p className="text-[11px] text-teal-700 font-medium truncate mt-0.5">
                              {lesson.tajweedRule}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
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
