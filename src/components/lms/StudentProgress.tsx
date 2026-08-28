import React, { useState } from 'react';
import { Course, RecitationSubmission } from '../../types';
import { MOCK_COURSES, MOCK_RECITATIONS } from '../../services/mockData';
import { useTenant } from '../../context/TenantContext';
import { ToastMessage } from '../ui/Toast';
import { BookOpen, CheckCircle2, Award, Sparkles, MessageSquare, Clock, BarChart2, Star } from 'lucide-react';

interface StudentProgressProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const StudentProgress: React.FC<StudentProgressProps> = ({ onAddToast }) => {
  const { tenant, language, direction } = useTenant();
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [recitations, setRecitations] = useState<RecitationSubmission[]>(MOCK_RECITATIONS);

  const activeCourse = courses[0];
  const isAr = language === 'ar';

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
                title: nextState ? (isAr ? 'تم إكمال الدرس!' : 'Lesson Completed!') : 'Lesson Marked Incomplete',
                message: isAr ? 'تم تحديث نسبة تقدمك في المنهج تلقائياً' : 'Your granular course progress has been recalculated.',
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
    <div className="space-y-6" dir={direction}>
      {/* Student Progress Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overall Course Progress */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Course Progress</span>
            <BookOpen className="w-5 h-5 text-teal-600" />
          </div>

          <h3 className="text-3xl font-extrabold text-slate-900">{courseProgressPercent}%</h3>
          <p className="text-xs text-slate-500 mt-1">{completedLessons} of {totalLessons} lessons completed</p>

          {/* Animated Progress Bar */}
          <div className="w-full bg-slate-100 h-3 rounded-full mt-4 overflow-hidden border border-slate-200">
            <div
              className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${courseProgressPercent}%` }}
            />
          </div>
        </div>

        {/* Surah Memorization Checklist */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
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

        {/* Audio Recitation Submissions Feedback */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
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

      {/* Modules & Granular Lesson Checklist */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-xl font-bold text-slate-900 ${isAr ? 'font-arabic text-2xl' : ''}`}>
              {isAr ? 'خطة الدراسة والدروس التفصيلية' : 'Interactive Curriculum Checklist'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {isAr ? 'قم بالتأشير على الدروس المكتملة للتحديث التفاعلي لنسبة الإنجاز' : 'Mark completed lessons to dynamically update your progress across the Quran LMS.'}
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
                      {isAr ? module.titleAr : module.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">{module.lessons.length} {isAr ? 'دروس تفاعلية' : 'interactive lessons'}</p>
                  </div>

                  <span className="text-xs font-extrabold text-teal-700 bg-teal-100 px-3 py-1 rounded-full shrink-0">
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
                          ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2
                          className={`w-5 h-5 shrink-0 ${
                            lesson.completed ? 'text-emerald-600 fill-emerald-100' : 'text-slate-300'
                          }`}
                        />
                        <div>
                          <p className={`font-bold text-xs ${isAr ? 'font-arabic text-base' : ''}`}>
                            {isAr ? lesson.titleAr : lesson.title}
                          </p>
                          {lesson.tajweedRule && (
                            <p className="text-[11px] text-amber-700 font-semibold mt-0.5">
                              {lesson.tajweedRule}
                            </p>
                          )}
                        </div>
                      </div>

                      <span className="text-[11px] text-slate-400 font-mono">
                        {lesson.durationMinutes} mins
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recitation Homework Feedback Feed */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className={`text-xl font-bold text-slate-900 ${isAr ? 'font-arabic text-2xl' : ''}`}>
          {isAr ? 'سجل التقييم والملاحظات الصوتية من المعلم' : 'Recitation Homework & Teacher Feedback'}
        </h3>

        <div className="space-y-3">
          {recitations.map((rec) => (
            <div key={rec.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">{rec.surahName}</span>
                  <span className="text-xs text-slate-500">({rec.ayahRange})</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      rec.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {rec.status}
                  </span>
                </div>
                {rec.teacherFeedback && (
                  <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200 mt-2 font-medium">
                    <strong className="text-teal-700 me-1">Teacher Feedback:</strong>{' '}
                    {typeof rec.teacherFeedback === 'string'
                      ? rec.teacherFeedback
                      : rec.teacherFeedback.comments || rec.teacherFeedback.grade || 'Feedback recorded'}
                  </p>
                )}
              </div>

              <audio src={rec.audioUrl} controls className="h-8 max-w-xs" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
