import React, { useState, useMemo } from 'react';
import { Course, Module, Lesson } from '../../types';
import { MOCK_COURSES } from '../../services/mockData';
import { api } from '../../services/api';
import { useTenant } from '../../context/TenantContext';
import { ToastMessage } from '../ui/Toast';
import {
  Plus,
  GripVertical,
  BookOpen,
  Layers,
  FileText,
  Music,
  FileSpreadsheet,
  Trash2,
  Edit3,
  Save,
  CheckCircle2,
  Code2,
  Terminal,
  Cpu
} from 'lucide-react';

interface CourseBuilderProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const CourseBuilder: React.FC<CourseBuilderProps> = ({ onAddToast }) => {
  const { tenant, language, direction } = useTenant();

  const isCodingNiche = tenant.niche === 'coding' || tenant.subdomain.includes('code');
  const isAr = language === 'ar';

  const tenantCourses = useMemo(() => {
    return MOCK_COURSES.filter((c) =>
      isCodingNiche ? c.tenantId === 'tenant-code' : c.tenantId !== 'tenant-code'
    );
  }, [isCodingNiche]);

  const [courses, setCourses] = useState<Course[]>(tenantCourses);
  const [activeCourseId, setActiveCourseId] = useState<string>(tenantCourses[0]?.id || MOCK_COURSES[0].id);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const activeCourse = courses.find((c) => c.id === activeCourseId) || courses[0] || tenantCourses[0];

  const handleSaveCourse = async () => {
    setIsSaving(true);
    try {
      await api.saveCourseHierarchy(activeCourse);
      onAddToast({
        type: 'success',
        title: isAr ? 'تم حفظ المنهج بنجاح' : 'Curriculum Saved Successfully',
        message: isAr ? 'تم تحديث التسلسل الهرمي للموديولات والدروس' : 'Course modules and lesson hierarchy updated.',
      });
    } catch (err) {
      onAddToast({
        type: 'error',
        title: 'Save Failed',
        message: 'Could not save curriculum changes.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddModule = () => {
    const newModule: Module = isCodingNiche
      ? {
          id: `mod-${Date.now()}`,
          title: `Module ${activeCourse.modules.length + 1}: Backend Architecture & APIs`,
          titleAr: `الوحدة ${activeCourse.modules.length + 1}: هندسة الخدمات الخلفية والواجهات البرمجية`,
          lessons: []
        }
      : {
          id: `mod-${Date.now()}`,
          title: `Module ${activeCourse.modules.length + 1}: Advanced Recitation`,
          titleAr: `الوحدة ${activeCourse.modules.length + 1}: إتقان التلاوة`,
          lessons: []
        };

    const updated = {
      ...activeCourse,
      modules: [...activeCourse.modules, newModule]
    };
    setCourses((prev) => prev.map((c) => (c.id === activeCourse.id ? updated : c)));
  };

  const handleAddLesson = (modId: string) => {
    const newLesson: Lesson = isCodingNiche
      ? {
          id: `les-${Date.now()}`,
          title: 'New Lesson: Asynchronous State & Error Boundaries',
          titleAr: 'درس جديد: معالجة الحالة غير المتزامنة وحدود الأخطاء',
          durationMinutes: 60,
          completed: false
        }
      : {
          id: `les-${Date.now()}`,
          title: 'New Lesson: Tajweed Practice',
          titleAr: 'درس جديد: تطبيق قواعد التجويد',
          durationMinutes: 30,
          tajweedRule: 'Ghunnah (غُنَّة) - 2 Harakat Elongation',
          audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3',
          completed: false
        };

    const updatedModules = activeCourse.modules.map((m) => {
      if (m.id === modId) {
        return { ...m, lessons: [...m.lessons, newLesson] };
      }
      return m;
    });

    const updated = { ...activeCourse, modules: updatedModules };
    setCourses((prev) => prev.map((c) => (c.id === activeCourse.id ? updated : c)));
  };

  return (
    <div className="space-y-6 font-sans" dir={direction}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className={`text-2xl font-bold text-slate-900 ${isAr ? 'font-arabic text-3xl' : ''}`}>
            {isCodingNiche
              ? (isAr ? 'منشئ المناهج التقنية والمسارات البرمجية' : 'Software Curriculum & Track Builder')
              : (isAr ? 'منشئ المناهج والدورات التدريبية' : 'Course & Curriculum Builder')}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isCodingNiche
              ? (isAr ? 'تنظيم الهيكل التدريبي للمسار البرمجي (مسار -> وحدات -> دروس ومشاريع برمجية)' : 'Manage curriculum hierarchy (Course -> Modules -> Lessons) with coding sandbox challenges and test specs.')
              : (isAr ? 'تنظيم الهيكل الهرمي للدورة (دورة -> وحدات -> دروس) وإضافة قواعد التجويد والنصوص القرآنية' : 'Manage drag-and-drop hierarchy (Course -> Modules -> Lessons) with Arabic Tajweed markup and audio tools.')}
          </p>
        </div>

        <button
          onClick={handleSaveCourse}
          disabled={isSaving}
          className={`px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 ${
            isCodingNiche ? 'bg-blue-600 hover:bg-blue-700' : 'bg-teal-600 hover:bg-teal-700'
          }`}
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ التعديلات' : 'Save Hierarchy')}</span>
        </button>
      </div>

      {/* Course Selection Tabs */}
      {courses.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => setActiveCourseId(course.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeCourse.id === course.id
                  ? isCodingNiche ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {isAr ? course.titleAr || course.title : course.title}
            </button>
          ))}
        </div>
      )}

      {/* Curriculum Hierarchy Modules */}
      <div className="space-y-4">
        {activeCourse?.modules?.map((module, modIdx) => (
          <div key={module.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs text-white ${
                  isCodingNiche ? 'bg-blue-600' : 'bg-teal-600'
                }`}>
                  {modIdx + 1}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    {isAr ? module.titleAr || module.title : module.title}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {module.lessons.length} {isCodingNiche ? 'coding lessons' : 'lessons'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleAddLesson(module.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                  isCodingNiche
                    ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                    : 'bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Lesson</span>
              </button>
            </div>

            {/* Lesson List */}
            <div className="space-y-2 pl-4 sm:pl-11">
              {module.lessons.map((lesson, lesIdx) => (
                <div
                  key={lesson.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-slate-400 font-mono font-bold text-[11px]">{modIdx + 1}.{lesIdx + 1}</span>
                    <span className="font-bold text-slate-900 truncate">
                      {isAr ? lesson.titleAr || lesson.title : lesson.title}
                    </span>
                    {lesson.tajweedRule && !isCodingNiche && (
                      <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-bold shrink-0">
                        {lesson.tajweedRule}
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono shrink-0">
                    {lesson.durationMinutes} mins
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Add Module CTA */}
        <button
          onClick={handleAddModule}
          className={`w-full py-4 border-2 border-dashed rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            isCodingNiche
              ? 'border-blue-300 text-blue-600 hover:bg-blue-50/50'
              : 'border-teal-300 text-teal-600 hover:bg-teal-50/50'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Add New Curriculum Module</span>
        </button>
      </div>
    </div>
  );
};
