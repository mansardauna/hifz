import React, { useState } from 'react';
import { DEFAULT_SCHOOL_COURSES } from './mockSchoolData';
import { SchoolCourse, SchoolLesson, SchoolAssessment } from './types';
import { SchoolQuizRunner } from './components/SchoolQuizRunner';
import { SchoolPracticalSubmission } from './components/SchoolPracticalSubmission';
import { SchoolSyllabusManager } from './components/SchoolSyllabusManager';
import { SchoolAssessmentBuilder } from './components/SchoolAssessmentBuilder';
import {
  BookOpen,
  CheckCircle2,
  FileText,
  Clock,
  Settings,
  Hammer,
  Award,
  ChevronRight,
  Sparkles,
  Layers,
  FileCheck2,
} from 'lucide-react';
import { Button, Badge, Card } from '../../components/ui';
import { ToastMessage } from '../../components/ui/Toast';

interface SchoolLMSContainerProps {
  activeSubTab?: 'school' | 'syllabus' | 'assignments' | 'assessments';
  onAddToast?: (toast: Omit<ToastMessage, 'id'>) => void;
  userRole?: 'student' | 'teacher' | 'admin' | 'superadmin';
}

export const SchoolLMSContainer: React.FC<SchoolLMSContainerProps> = ({
  userRole = 'student',
}) => {
  const [courses, setCourses] = useState<SchoolCourse[]>(DEFAULT_SCHOOL_COURSES);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(DEFAULT_SCHOOL_COURSES[0]?.id || '');
  const [viewMode, setViewMode] = useState<'student_learn' | 'teacher_syllabus' | 'teacher_assessments'>('student_learn');

  const currentCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];
  const [activeLesson, setActiveLesson] = useState<SchoolLesson>(
    currentCourse?.modules[0]?.lessons[0] || ({} as SchoolLesson)
  );

  // Active Assessment for Student taking Quiz/Practical
  const [activeAssessment, setActiveAssessment] = useState<SchoolAssessment | null>(null);

  const handleSelectLesson = (lesson: SchoolLesson) => {
    setActiveLesson(lesson);
    if (lesson.assessmentId) {
      const found = currentCourse.assessments.find((a) => a.id === lesson.assessmentId);
      setActiveAssessment(found || null);
    } else {
      setActiveAssessment(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Action & Mode Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              setViewMode('student_learn');
              setActiveAssessment(null);
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              viewMode === 'student_learn'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Student Learning & Workshop Portal</span>
          </button>

          <button
            onClick={() => setViewMode('teacher_syllabus')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              viewMode === 'teacher_syllabus'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Syllabus & Lesson Creator</span>
          </button>

          <button
            onClick={() => setViewMode('teacher_assessments')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              viewMode === 'teacher_assessments'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Assessment & Rubric Studio</span>
          </button>
        </div>

        <div className="text-xs font-bold text-slate-500">
          Instructor: <strong className="text-slate-900">{currentCourse?.instructorName}</strong>
        </div>
      </div>

      {/* STUDENT VIEW MODE */}
      {viewMode === 'student_learn' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Syllabus Navigation (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm h-fit">
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                {currentCourse?.category.replace('_', ' ')}
              </span>
              <h3 className="font-extrabold text-sm text-slate-900 pt-1">{currentCourse?.title}</h3>
            </div>

            <div className="space-y-3 pt-2">
              {currentCourse?.modules.map((module) => (
                <div key={module.id} className="space-y-2">
                  <div className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    {module.title}
                  </div>
                  <div className="space-y-1.5 pl-1">
                    {module.lessons.map((lesson) => {
                      const isActive = activeLesson?.id === lesson.id;
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => handleSelectLesson(lesson)}
                          className={`w-full text-left p-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                            isActive
                              ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 font-bold'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {lesson.type === 'practical_workshop' ? (
                              <Hammer className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-emerald-600'}`} />
                            ) : (
                              <FileText className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                            )}
                            <span className="truncate">{lesson.title}</span>
                          </div>
                          <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Main Lesson / Assessment Content Area (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {activeAssessment ? (
              activeAssessment.type === 'quiz' ? (
                <SchoolQuizRunner
                  assessment={activeAssessment}
                  onClose={() => setActiveAssessment(null)}
                />
              ) : (
                <SchoolPracticalSubmission
                  assessment={activeAssessment}
                  onSubmitSuccess={() => console.log('Practical submission success')}
                />
              )
            ) : (
              /* Lesson Guide View */
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
                <div className="space-y-2 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Badge variant={activeLesson.type === 'practical_workshop' ? 'primary' : 'default'} size="sm">
                      {activeLesson.type === 'practical_workshop' ? 'Practical Workshop Session' : 'Theory Lecture'}
                    </Badge>
                    <span className="text-xs text-slate-400">Duration: {activeLesson.durationMinutes} mins</span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900">{activeLesson.title}</h2>
                </div>

                {/* Lesson Theory & Text Content */}
                <div className="prose prose-sm text-slate-700 text-xs leading-relaxed space-y-3 font-sans">
                  <div
                    className="whitespace-pre-wrap leading-relaxed space-y-2"
                    dangerouslySetInnerHTML={{
                      __html: (activeLesson.content || '')
                        .replace(/### (.*)/g, '<h3 class="text-sm font-black text-slate-900 mt-2 mb-1">$1</h3>')
                        .replace(/1\. (.*)/g, '<li class="ml-4 list-decimal text-slate-700 font-medium">$1</li>'),
                    }}
                  />
                </div>

                {/* Practical Workshop Step Checklist */}
                {activeLesson.practicalChecklist && activeLesson.practicalChecklist.length > 0 && (
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Hammer className="w-4 h-4 text-emerald-600" />
                      <span>Workshop Practical Steps ({activeLesson.practicalChecklist.length})</span>
                    </h4>

                    <div className="space-y-2">
                      {activeLesson.practicalChecklist.map((step) => (
                        <div key={step.id} className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-3 text-xs">
                          <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                            {step.stepNumber}
                          </span>
                          <div className="min-w-0">
                            <h5 className="font-bold text-slate-900">{step.title}</h5>
                            <p className="text-[11px] text-slate-500 mt-0.5">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Attached Assessment Callout */}
                {activeLesson.assessmentId && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between shadow-md">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">Module Assessment Ready</span>
                      <h4 className="font-extrabold text-sm">Take Assessment to Complete Lesson</h4>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const found = currentCourse.assessments.find((a) => a.id === activeLesson.assessmentId);
                        if (found) setActiveAssessment(found);
                      }}
                      className="bg-white text-blue-900 hover:bg-slate-100 font-bold border-0 text-xs"
                    >
                      Start Assessment →
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TEACHER SYLLABUS MANAGER MODE */}
      {viewMode === 'teacher_syllabus' && (
        <SchoolSyllabusManager
          course={currentCourse}
          onSaveCourse={(updated) => {
            setCourses(courses.map((c) => (c.id === updated.id ? updated : c)));
          }}
          onSelectLessonForPreview={(lesson) => {
            setActiveLesson(lesson);
            setViewMode('student_learn');
          }}
        />
      )}

      {/* TEACHER ASSESSMENT BUILDER MODE */}
      {viewMode === 'teacher_assessments' && (
        <SchoolAssessmentBuilder
          assessments={currentCourse.assessments}
          onSaveAssessments={(updated) => {
            const updatedCourse = { ...currentCourse, assessments: updated };
            setCourses(courses.map((c) => (c.id === updatedCourse.id ? updatedCourse : c)));
          }}
          onPreviewAssessment={(assessment) => {
            setActiveAssessment(assessment);
            setViewMode('student_learn');
          }}
        />
      )}
    </div>
  );
};
