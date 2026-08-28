import React, { useState } from 'react';
import { Course } from '../../types';
import { useTenant } from '../../context/TenantContext';
import { ToastMessage } from '../ui/Toast';
import { Plus, Edit3, Trash2, BookOpen, Clock, Users, Save, X } from 'lucide-react';

interface LandingCoursesEditorProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const LandingCoursesEditor: React.FC<LandingCoursesEditorProps> = ({ onAddToast }) => {
  const { courses, updateCourses, language, direction } = useTenant();
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const isAr = language === 'ar';

  const handleCreateCourse = () => {
    const newCourse: Course = {
      id: `course-${Date.now()}`,
      tenantId: 'tenant-1',
      title: 'New Quranic & Arabic Program',
      titleAr: 'دورة قرآنية جديدة',
      description: 'Comprehensive curriculum covering Tajweed, recitation, and vocabulary.',
      descriptionAr: 'منهج شامل يغطي أحكام التجويد والتلاوة والتسميع.',
      level: 'Beginner',
      durationWeeks: 8,
      sessionsPerWeek: 2,
      price: 65,
      instructorName: 'Ustadh Muhammad Al-Hassan',
      instructorNameAr: 'الأستاذ محمد الحسن',
      enrolledStudentsCount: 45,
      imageUrl: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=600&q=80',
      modules: []
    };

    updateCourses([...courses, newCourse]);
    onAddToast({
      type: 'success',
      title: isAr ? 'تمت إضافة دورة جديدة' : 'New Program Added',
      message: isAr ? 'تمت إضافة الدورة بنجاح إلى الصفحة الرئيسية' : 'Program published to landing page.',
    });
  };

  const handleDeleteCourse = (id: string) => {
    updateCourses(courses.filter((c) => c.id !== id));
    onAddToast({
      type: 'info',
      title: isAr ? 'تم حذف الدورة' : 'Program Removed',
      message: isAr ? 'تم إزالة الدورة من العرض' : 'Program deleted from showcase.',
    });
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;

    updateCourses(courses.map((c) => (c.id === editingCourse.id ? editingCourse : c)));
    onAddToast({
      type: 'success',
      title: isAr ? 'تم حفظ تعديلات الدورة' : 'Course Details Saved',
      message: isAr ? 'تم تحديث المنهج مباشرة على الموقع' : 'Program details updated on landing showcase.',
    });
    setEditingCourse(null);
  };

  return (
    <div className="space-y-6" dir={direction}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-md border border-slate-200 shadow-md">
        <div>
          <h2 className={`text-xl sm:text-2xl font-bold font-display text-slate-900 ${isAr ? 'font-arabic text-3xl' : ''}`}>
            {isAr ? 'إدارة دورات ومناهج الصفحة الرئيسية' : 'Landing Page Featured Programs'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isAr ? 'إضافة وتعديل وحذف الدورات المعروضة في واجهة الموقع' : 'Add, edit, or remove the Quranic programs displayed in your public course showcase grid.'}
          </p>
        </div>

        <button
          onClick={handleCreateCourse}
          className="px-5 py-2.5 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white font-bold font-display text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? 'إضافة دورة جديدة' : 'Add New Program'}</span>
        </button>
      </div>

      {/* Courses Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-md border border-slate-200 shadow-md overflow-hidden flex flex-col justify-between">
            <div className="relative h-44 bg-slate-900">
              <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover opacity-80" />
              <span className="absolute top-3 right-3 bg-amber-500 text-slate-950 font-bold text-xs px-2.5 py-1 rounded-md">
                {course.level}
              </span>
            </div>

            <div className="p-5 sm:p-6 flex-1 space-y-3">
              <h3 className={`font-bold text-slate-900 text-base sm:text-lg font-display ${isAr ? 'font-arabic text-xl' : ''}`}>
                {isAr ? course.titleAr : course.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">{isAr ? course.descriptionAr : course.description}</p>

              <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-emerald-600" /> {course.durationWeeks} Weeks</span>
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-emerald-600" /> {course.enrolledStudentsCount} Students</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">{course.instructorName}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingCourse(course)}
                  className="px-3 py-1.5 rounded-md bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDeleteCourse(course.id)}
                  className="p-1.5 rounded-md text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Course Modal */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-md max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-base font-display text-slate-900">
                {isAr ? 'تعديل بيانات الدورة' : 'Edit Program Showcase Details'}
              </h3>
              <button onClick={() => setEditingCourse(null)} className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Title (English)</label>
                  <input
                    type="text"
                    value={editingCourse.title}
                    onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                    className="w-full p-2.5 rounded-md border border-slate-300 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">عنوان الدورة (بالعربية)</label>
                  <input
                    type="text"
                    value={editingCourse.titleAr}
                    onChange={(e) => setEditingCourse({ ...editingCourse, titleAr: e.target.value })}
                    className="w-full p-2.5 rounded-md border border-slate-300 font-arabic text-base focus:ring-1 focus:ring-emerald-600"
                    dir="rtl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description (English)</label>
                <textarea
                  rows={2}
                  value={editingCourse.description}
                  onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                  className="w-full p-2.5 rounded-md border border-slate-300 focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">وصف الدورة (بالعربية)</label>
                <textarea
                  rows={2}
                  value={editingCourse.descriptionAr}
                  onChange={(e) => setEditingCourse({ ...editingCourse, descriptionAr: e.target.value })}
                  className="w-full p-2.5 rounded-md border border-slate-300 font-arabic text-base focus:ring-1 focus:ring-emerald-600"
                  dir="rtl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Instructor Name</label>
                  <input
                    type="text"
                    value={editingCourse.instructorName}
                    onChange={(e) => setEditingCourse({ ...editingCourse, instructorName: e.target.value })}
                    className="w-full p-2.5 rounded-md border border-slate-300 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration (Weeks)</label>
                  <input
                    type="number"
                    value={editingCourse.durationWeeks}
                    onChange={(e) => setEditingCourse({ ...editingCourse, durationWeeks: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-md border border-slate-300 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Thumbnail / Cover Image URL</label>
                <input
                  type="text"
                  value={editingCourse.imageUrl}
                  onChange={(e) => setEditingCourse({ ...editingCourse, imageUrl: e.target.value })}
                  className="w-full p-2.5 rounded-md border border-slate-300 focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-md bg-emerald-700 text-white font-bold font-display hover:bg-emerald-800 shadow-md cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
