import React, { useState } from 'react';
import { Course, Module, Lesson } from '../../types';
import { MOCK_COURSES } from '../../services/mockData';
import { api } from '../../services/api';
import { useTenant } from '../../context/TenantContext';
import { ToastMessage } from '../ui/Toast';
import { Plus, GripVertical, BookOpen, Layers, FileText, Music, FileSpreadsheet, Trash2, Edit3, Save, CheckCircle2 } from 'lucide-react';

interface CourseBuilderProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const CourseBuilder: React.FC<CourseBuilderProps> = ({ onAddToast }) => {
  const { tenant, language, direction } = useTenant();
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [activeCourseId, setActiveCourseId] = useState<string>(MOCK_COURSES[0].id);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const isAr = language === 'ar';
  const activeCourse = courses.find((c) => c.id === activeCourseId) || courses[0];

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
    const newModule: Module = {
      id: `mod-${Date.now()}`,
      title: 'New Module: Advanced Recitation',
      titleAr: 'وحدة جديدة: إتقان التلاوة',
      lessons: []
    };

    const updated = {
      ...activeCourse,
      modules: [...activeCourse.modules, newModule]
    };
    setCourses((prev) => prev.map((c) => (c.id === activeCourse.id ? updated : c)));
  };

  const handleAddLesson = (modId: string) => {
    const newLesson: Lesson = {
      id: `les-${Date.now()}`,
      title: 'New Lesson: Tajweed Practice',
      titleAr: 'درس جديد: تطبيق قواعد التجويد',
      durationMinutes: 30,
      tajweedRule: 'Ghunnah (غُنَّة) - 2 Harakat Elongation',
      audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3'
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
    <div className="space-y-6" dir={direction}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className={`text-2xl font-bold text-slate-900 ${isAr ? 'font-arabic text-3xl' : ''}`}>
            {isAr ? 'منشئ المناهج والدورات التدريبية' : 'Course & Curriculum Builder'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isAr ? 'تنظيم الهيكل الهرمي للدورة (دورة -> وحدات -> دروس) وإضافة قواعد التجويد والنصوص القرآنية' : 'Manage drag-and-drop hierarchy (Course -> Modules -> Lessons) with rich Arabic Tajweed markup and audio tools.'}
          </p>
        </div>

        <button
          onClick={handleSaveCourse}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-md hover:bg-teal-700 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ التعديلات' : 'Save Hierarchy')}</span>
        </button>
      </div>

      {/* Main Builder Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left / Navigation Panel */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {isAr ? 'الدورات المتاحة للمعهد' : 'Academy Courses'}
          </h3>

          <div className="space-y-2">
            {courses.map((course) => (
              <button
                key={course.id}
                onClick={() => setActiveCourseId(course.id)}
                className={`w-full p-3.5 rounded-xl text-start transition-all border ${
                  activeCourseId === course.id
                    ? 'bg-teal-50 border-teal-500 text-teal-900 shadow-sm'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <p className={`font-bold text-sm ${isAr ? 'font-arabic text-lg' : ''}`}>
                  {isAr ? course.titleAr : course.title}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {course.modules.length} Modules • {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} Lessons
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Right / Modules & Lessons Tree Hierarchy */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-sm text-slate-800">
              {isAr ? activeCourse.titleAr : activeCourse.title}
            </h3>
            <button
              onClick={handleAddModule}
              className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAr ? 'إضافة وحدة جديدة' : 'Add Module'}</span>
            </button>
          </div>

          {/* Modules List */}
          <div className="space-y-4">
            {activeCourse.modules.map((module, modIdx) => (
              <div key={module.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Module Bar */}
                <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-slate-400 cursor-grab" />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-100 px-2 py-0.5 rounded">
                        Module {modIdx + 1}
                      </span>
                      <h4 className={`font-bold text-slate-900 text-sm mt-0.5 ${isAr ? 'font-arabic text-base' : ''}`}>
                        {isAr ? module.titleAr : module.title}
                      </h4>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddLesson(module.id)}
                    className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 font-bold text-xs hover:bg-teal-100 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{isAr ? 'إضافة درس' : 'Add Lesson'}</span>
                  </button>
                </div>

                {/* Lessons List inside Module */}
                <div className="p-4 space-y-2.5">
                  {module.lessons.length === 0 ? (
                    <p className="text-xs text-slate-400 italic text-center py-4">
                      {isAr ? 'لا توجد دروس في هذه الوحدة حتى الآن. انقر على إضافة درس.' : 'No lessons in this module. Click "Add Lesson" above.'}
                    </p>
                  ) : (
                    module.lessons.map((lesson, lesIdx) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
                          <div className="min-w-0">
                            <p className="font-bold text-xs text-slate-900 truncate">
                              {lesIdx + 1}. {isAr ? lesson.titleAr : lesson.title}
                            </p>
                            {lesson.tajweedRule && (
                              <p className="text-[11px] text-amber-700 font-semibold truncate mt-0.5">
                                Tajweed: {lesson.tajweedRule}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => setEditingLesson(lesson)}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
                            title="Edit Lesson Content"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lesson Editor Modal */}
      {editingLesson && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                {isAr ? 'تعديل بيانات الدرس والتجويد' : 'Edit Lesson & Tajweed Rule Content'}
              </h3>
              <button
                onClick={() => setEditingLesson(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Lesson Title (English)</label>
                <input
                  type="text"
                  value={editingLesson.title}
                  onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">عنوان الدرس (بالعربية)</label>
                <input
                  type="text"
                  value={editingLesson.titleAr}
                  onChange={(e) => setEditingLesson({ ...editingLesson, titleAr: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-arabic text-base"
                  dir="rtl"
                />
              </div>



              <div>
                <label className="block font-bold text-slate-700 mb-1">Tajweed Rule Highlight & Description</label>
                <input
                  type="text"
                  value={editingLesson.tajweedRule || ''}
                  onChange={(e) => setEditingLesson({ ...editingLesson, tajweedRule: e.target.value })}
                  placeholder="e.g. Ghunnah (غُنَّة) - 2 Harakat Elongation"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    onAddToast({ type: 'success', title: 'Lesson Updated', message: 'Lesson content saved in draft.' });
                    setEditingLesson(null);
                  }}
                  className="w-full py-3 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 shadow-md"
                >
                  Save Lesson Modifications
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
