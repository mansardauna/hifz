import React, { useState } from 'react';
import { SchoolCourse, SchoolModule, SchoolLesson, PracticalChecklistStep } from '../types';
import {
  Plus,
  Edit3,
  Trash2,
  BookOpen,
  Layers,
  Save,
  CheckCircle2,
  Video,
  FileText,
  Hammer,
  ClipboardList,
  Sparkles,
} from 'lucide-react';
import { Button, Input, Modal, Badge } from '../../../components/ui';
import { useToast } from '../../../context/ToastContext';

interface SchoolSyllabusManagerProps {
  course: SchoolCourse;
  onSaveCourse: (updated: SchoolCourse) => void;
  onSelectLessonForPreview?: (lesson: SchoolLesson) => void;
}

export const SchoolSyllabusManager: React.FC<SchoolSyllabusManagerProps> = ({
  course,
  onSaveCourse,
  onSelectLessonForPreview,
}) => {
  const { success, error } = useToast();
  const [courseData, setCourseData] = useState<SchoolCourse>(course);
  const [selectedModuleId, setSelectedModuleId] = useState<string>(course.modules[0]?.id || '');

  // Lesson Modal
  const [isLessonModalOpen, setIsLessonModalOpen] = useState<boolean>(false);
  const [editingLesson, setEditingLesson] = useState<Partial<SchoolLesson>>({});
  const [isNewLesson, setIsNewLesson] = useState<boolean>(false);

  const activeModule = courseData.modules.find((m) => m.id === selectedModuleId) || courseData.modules[0];

  const handleOpenAddLesson = () => {
    setEditingLesson({
      id: `les-${Date.now()}`,
      title: 'New Lesson / Workshop Session',
      type: 'practical_workshop',
      durationMinutes: 45,
      content: '### Session Objectives\nDetail the workshop steps and theoretical background here...',
      practicalChecklist: [
        {
          id: `step-1`,
          stepNumber: 1,
          title: 'Initial Preparation & Safety Setup',
          description: 'Ensure workshop area is clear and tools are ready.',
          requiredProof: 'photo',
        },
      ],
    });
    setIsNewLesson(true);
    setIsLessonModalOpen(true);
  };

  const handleOpenEditLesson = (lesson: SchoolLesson) => {
    setEditingLesson(JSON.parse(JSON.stringify(lesson)));
    setIsNewLesson(false);
    setIsLessonModalOpen(true);
  };

  const handleSaveLesson = () => {
    if (!editingLesson.title) {
      error('Validation Error', 'Lesson title is required.');
      return;
    }

    const updatedModules = courseData.modules.map((m) => {
      if (m.id !== activeModule.id) return m;
      let updatedLessons: SchoolLesson[];
      if (isNewLesson) {
        updatedLessons = [...m.lessons, editingLesson as SchoolLesson];
      } else {
        updatedLessons = m.lessons.map((l) => (l.id === editingLesson.id ? (editingLesson as SchoolLesson) : l));
      }
      return { ...m, lessons: updatedLessons };
    });

    const updatedCourse = { ...courseData, modules: updatedModules };
    setCourseData(updatedCourse);
    onSaveCourse(updatedCourse);
    setIsLessonModalOpen(false);
    success('Syllabus Updated', `Saved lesson "${editingLesson.title}".`);
  };

  const handleDeleteLesson = (lessonId: string) => {
    const updatedModules = courseData.modules.map((m) => {
      if (m.id !== activeModule.id) return m;
      return {
        ...m,
        lessons: m.lessons.filter((l) => l.id !== lessonId),
      };
    });

    const updatedCourse = { ...courseData, modules: updatedModules };
    setCourseData(updatedCourse);
    onSaveCourse(updatedCourse);
    success('Lesson Deleted', 'Removed lesson from syllabus.');
  };

  const handleAddChecklistStep = () => {
    const steps = editingLesson.practicalChecklist || [];
    setEditingLesson({
      ...editingLesson,
      practicalChecklist: [
        ...steps,
        {
          id: `step-${Date.now()}`,
          stepNumber: steps.length + 1,
          title: 'New Workshop Step',
          description: 'Step instruction details...',
          requiredProof: 'photo',
        },
      ],
    });
  };

  const handleRemoveChecklistStep = (index: number) => {
    const steps = [...(editingLesson.practicalChecklist || [])];
    steps.splice(index, 1);
    setEditingLesson({ ...editingLesson, practicalChecklist: steps });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏫</span>
            <h2 className="text-xl font-black text-slate-900">Syllabus & Lesson Creator</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Build custom lesson plans, practical workshop steps, and assign assessments for your academy.
          </p>
        </div>

        <Button variant="primary" onClick={handleOpenAddLesson} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
          <Plus className="w-4 h-4 mr-1.5" /> Add Lesson / Workshop
        </Button>
      </div>

      {/* Module Selector */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Select Module</label>
        <select
          value={selectedModuleId}
          onChange={(e) => setSelectedModuleId(e.target.value)}
          className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-emerald-500"
        >
          {courseData.modules.map((m) => (
            <option key={m.id} value={m.id}>
              {m.title}
            </option>
          ))}
        </select>
      </div>

      {/* Lessons List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2 font-bold text-xs text-slate-800 uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>{activeModule?.lessons.length || 0} Lessons in this Module</span>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {activeModule?.lessons.map((lesson, idx) => (
            <div
              key={lesson.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900 truncate">{lesson.title}</h4>
                    <Badge variant={lesson.type === 'practical_workshop' ? 'primary' : 'default'} size="sm">
                      {lesson.type === 'practical_workshop' ? 'Workshop Guide' : 'Lecture'}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {lesson.durationMinutes} mins • {lesson.practicalChecklist?.length || 0} practical steps
                    {lesson.assessmentId && ` • Linked to Assessment`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {onSelectLessonForPreview && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectLessonForPreview(lesson)}
                    className="text-xs font-semibold"
                  >
                    Preview Lesson
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => handleOpenEditLesson(lesson)} className="text-xs">
                  <Edit3 className="w-3.5 h-3.5 mr-1 text-blue-600" /> Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteLesson(lesson.id)}
                  className="text-xs text-rose-600 hover:bg-rose-50 border-rose-200"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}

          {(!activeModule?.lessons || activeModule.lessons.length === 0) && (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <ClipboardList className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs">No lessons added to this module yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Lesson Edit Modal */}
      <Modal
        isOpen={isLessonModalOpen}
        onClose={() => setIsLessonModalOpen(false)}
        title={isNewLesson ? 'Create New Lesson / Practical' : 'Edit Lesson'}
        size="lg"
      >
        <div className="space-y-4 max-h-[75vh] overflow-y-auto p-1 font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">Lesson Title</label>
              <Input
                value={editingLesson.title || ''}
                onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                placeholder="e.g. Workshop: Wiring and Component Mounting"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Lesson Type</label>
              <select
                value={editingLesson.type || 'practical_workshop'}
                onChange={(e) => setEditingLesson({ ...editingLesson, type: e.target.value as any })}
                className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
              >
                <option value="practical_workshop">Practical Workshop</option>
                <option value="lecture">Theory / Lecture</option>
                <option value="reading">Reading & Reference</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Lesson Content & Instructions (Markdown)</label>
            <textarea
              rows={5}
              value={editingLesson.content || ''}
              onChange={(e) => setEditingLesson({ ...editingLesson, content: e.target.value })}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-emerald-500"
              placeholder="Provide theory, diagrams, and workshop steps..."
            />
          </div>

          {/* Practical Workshop Steps Checklist */}
          <div className="border-t border-slate-200 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Hammer className="w-4 h-4 text-emerald-600" />
                <span>Practical Workshop Steps & Proof Requirements</span>
              </label>
              <Button variant="outline" size="sm" onClick={handleAddChecklistStep} className="text-xs">
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Step
              </Button>
            </div>

            <div className="space-y-2">
              {editingLesson.practicalChecklist?.map((step, idx) => (
                <div key={step.id || idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <Input
                      value={step.title}
                      onChange={(e) => {
                        const updated = [...(editingLesson.practicalChecklist || [])];
                        updated[idx].title = e.target.value;
                        setEditingLesson({ ...editingLesson, practicalChecklist: updated });
                      }}
                      placeholder="Step Title e.g. Inspect multimeter calibration"
                      className="text-xs flex-1"
                    />
                    <select
                      value={step.requiredProof || 'photo'}
                      onChange={(e) => {
                        const updated = [...(editingLesson.practicalChecklist || [])];
                        updated[idx].requiredProof = e.target.value as any;
                        setEditingLesson({ ...editingLesson, practicalChecklist: updated });
                      }}
                      className="text-xs font-bold bg-white border border-slate-200 rounded-lg p-1.5"
                    >
                      <option value="photo">Photo Proof</option>
                      <option value="video">Video Proof</option>
                      <option value="text">Text Confirmation</option>
                    </select>
                    <button
                      onClick={() => handleRemoveChecklistStep(idx)}
                      className="p-1.5 text-rose-500 hover:bg-rose-100 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-200">
            <Button variant="outline" onClick={() => setIsLessonModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveLesson} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
              <Save className="w-4 h-4 mr-1.5" /> Save Lesson
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
