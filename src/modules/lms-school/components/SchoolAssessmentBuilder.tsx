import React, { useState } from 'react';
import { SchoolAssessment, QuizQuestion, RubricCriterion } from '../types';
import {
  Plus,
  Edit3,
  Trash2,
  FileCheck2,
  Award,
  HelpCircle,
  Save,
  CheckCircle2,
  Clock,
  Hammer,
} from 'lucide-react';
import { Button, Input, Modal, Badge } from '../../../components/ui';
import { useToast } from '../../../context/ToastContext';

interface SchoolAssessmentBuilderProps {
  assessments: SchoolAssessment[];
  onSaveAssessments: (updated: SchoolAssessment[]) => void;
  onPreviewAssessment?: (assessment: SchoolAssessment) => void;
}

export const SchoolAssessmentBuilder: React.FC<SchoolAssessmentBuilderProps> = ({
  assessments,
  onSaveAssessments,
  onPreviewAssessment,
}) => {
  const { success, error } = useToast();
  const [assessmentList, setAssessmentList] = useState<SchoolAssessment[]>(assessments);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingAssessment, setEditingAssessment] = useState<Partial<SchoolAssessment>>({});
  const [isNew, setIsNew] = useState<boolean>(false);

  const handleOpenAdd = (type: 'quiz' | 'practical_project') => {
    if (type === 'quiz') {
      setEditingAssessment({
        id: `assess-quiz-${Date.now()}`,
        title: 'New Knowledge Quiz',
        type: 'quiz',
        description: 'Auto-graded assessment on module concepts.',
        timeLimitMinutes: 15,
        passingScorePercent: 75,
        questions: [
          {
            id: `q-1`,
            question: 'Sample question text...',
            type: 'multiple_choice',
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswerIndex: 0,
            explanation: 'Why Option A is correct.',
            points: 25,
          },
        ],
      });
    } else {
      setEditingAssessment({
        id: `assess-prac-${Date.now()}`,
        title: 'New Practical Workshop Project',
        type: 'practical_project',
        description: 'Practical assignment submission with photos or video proof.',
        passingScorePercent: 80,
        practicalPrompt: '### Task Requirements:\n1. Execute step 1\n2. Document results and upload photos.',
        acceptedFileTypes: ['image/*', 'video/*', 'application/pdf'],
        rubric: [
          { id: 'r-1', name: 'Workmanship Quality', description: 'Execution accuracy', maxScore: 50, weightPercent: 50 },
          { id: 'r-2', name: 'Safety & Compliance', description: 'Adherence to standards', maxScore: 50, weightPercent: 50 },
        ],
      });
    }
    setIsNew(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (assessment: SchoolAssessment) => {
    setEditingAssessment(JSON.parse(JSON.stringify(assessment)));
    setIsNew(false);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!editingAssessment.title) {
      error('Validation Error', 'Title is required.');
      return;
    }

    let updated: SchoolAssessment[];
    if (isNew) {
      updated = [...assessmentList, editingAssessment as SchoolAssessment];
    } else {
      updated = assessmentList.map((a) => (a.id === editingAssessment.id ? (editingAssessment as SchoolAssessment) : a));
    }

    setAssessmentList(updated);
    onSaveAssessments(updated);
    setIsModalOpen(false);
    success('Assessment Saved', `Updated "${editingAssessment.title}".`);
  };

  const handleDelete = (id: string) => {
    const updated = assessmentList.filter((a) => a.id !== id);
    setAssessmentList(updated);
    onSaveAssessments(updated);
    success('Assessment Deleted', 'Removed from course.');
  };

  const handleAddQuestion = () => {
    const qList = editingAssessment.questions || [];
    setEditingAssessment({
      ...editingAssessment,
      questions: [
        ...qList,
        {
          id: `q-${Date.now()}`,
          question: 'New question',
          type: 'multiple_choice',
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswerIndex: 0,
          explanation: '',
          points: 25,
        },
      ],
    });
  };

  const handleAddRubric = () => {
    const rList = editingAssessment.rubric || [];
    setEditingAssessment({
      ...editingAssessment,
      rubric: [
        ...rList,
        {
          id: `r-${Date.now()}`,
          name: 'New Criterion',
          description: 'Criterion details',
          maxScore: 25,
          weightPercent: 25,
        },
      ],
    });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📝</span>
            <h2 className="text-xl font-black text-slate-900">Assessment & Exam Studio</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Create automated knowledge quizzes or practical vocational project submissions with rubrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => handleOpenAdd('quiz')}
            className="text-blue-700 border-blue-200 hover:bg-blue-50 font-bold"
          >
            <Plus className="w-4 h-4 mr-1.5" /> New Quiz Exam
          </Button>
          <Button
            variant="primary"
            onClick={() => handleOpenAdd('practical_project')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
          >
            <Plus className="w-4 h-4 mr-1.5" /> New Practical Project
          </Button>
        </div>
      </div>

      {/* Assessments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assessmentList.map((assessment) => (
          <div
            key={assessment.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Badge variant={assessment.type === 'quiz' ? 'info' : 'success'} size="sm">
                  {assessment.type === 'quiz' ? 'Auto-Graded Quiz' : 'Practical Project'}
                </Badge>
                <span className="text-xs font-bold text-slate-500">Passing: {assessment.passingScorePercent}%</span>
              </div>

              <h3 className="font-extrabold text-base text-slate-900">{assessment.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-2">{assessment.description}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500">
                {assessment.type === 'quiz'
                  ? `${assessment.questions?.length || 0} Questions (${assessment.timeLimitMinutes || 15}m)`
                  : `${assessment.rubric?.length || 0} Rubric Criteria`}
              </span>

              <div className="flex items-center gap-2">
                {onPreviewAssessment && (
                  <Button variant="outline" size="sm" onClick={() => onPreviewAssessment(assessment)} className="text-xs">
                    Preview
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => handleOpenEdit(assessment)} className="text-xs text-blue-600">
                  <Edit3 className="w-3.5 h-3.5 mr-1" /> Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(assessment.id)} className="text-xs text-rose-600">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Assessment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isNew ? 'Create New Assessment' : 'Edit Assessment'}
        size="lg"
      >
        <div className="space-y-4 max-h-[75vh] overflow-y-auto p-1 font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">Assessment Title</label>
              <Input
                value={editingAssessment.title || ''}
                onChange={(e) => setEditingAssessment({ ...editingAssessment, title: e.target.value })}
                placeholder="e.g. Electrical Safety Quiz"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Passing Score (%)</label>
              <Input
                type="number"
                value={editingAssessment.passingScorePercent || 75}
                onChange={(e) => setEditingAssessment({ ...editingAssessment, passingScorePercent: Number(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Description / Brief</label>
            <textarea
              rows={2}
              value={editingAssessment.description || ''}
              onChange={(e) => setEditingAssessment({ ...editingAssessment, description: e.target.value })}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none"
            />
          </div>

          {/* Quiz Questions Section */}
          {editingAssessment.type === 'quiz' && (
            <div className="border-t border-slate-200 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-blue-600" />
                  <span>Quiz Questions ({editingAssessment.questions?.length || 0})</span>
                </label>
                <Button variant="outline" size="sm" onClick={handleAddQuestion} className="text-xs">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Question
                </Button>
              </div>

              <div className="space-y-3">
                {editingAssessment.questions?.map((q, qIdx) => (
                  <div key={q.id || qIdx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-blue-700">Q{qIdx + 1}</span>
                      <Input
                        value={q.question}
                        onChange={(e) => {
                          const updated = [...(editingAssessment.questions || [])];
                          updated[qIdx].question = e.target.value;
                          setEditingAssessment({ ...editingAssessment, questions: updated });
                        }}
                        placeholder="Question text..."
                        className="text-xs flex-1"
                      />
                    </div>

                    <div className="space-y-1.5 pl-6">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-${q.id}`}
                            checked={q.correctAnswerIndex === oIdx}
                            onChange={() => {
                              const updated = [...(editingAssessment.questions || [])];
                              updated[qIdx].correctAnswerIndex = oIdx;
                              setEditingAssessment({ ...editingAssessment, questions: updated });
                            }}
                          />
                          <Input
                            value={opt}
                            onChange={(e) => {
                              const updated = [...(editingAssessment.questions || [])];
                              updated[qIdx].options[oIdx] = e.target.value;
                              setEditingAssessment({ ...editingAssessment, questions: updated });
                            }}
                            className="text-xs flex-1"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Practical Rubric Section */}
          {editingAssessment.type === 'practical_project' && (
            <div className="border-t border-slate-200 pt-4 space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Practical Prompt / Workshop Instructions</label>
                <textarea
                  rows={4}
                  value={editingAssessment.practicalPrompt || ''}
                  onChange={(e) => setEditingAssessment({ ...editingAssessment, practicalPrompt: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-mono"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>Evaluation Rubric Criteria</span>
                </label>
                <Button variant="outline" size="sm" onClick={handleAddRubric} className="text-xs">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Rubric Criterion
                </Button>
              </div>

              <div className="space-y-2">
                {editingAssessment.rubric?.map((r, rIdx) => (
                  <div key={r.id || rIdx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-3 gap-2">
                    <Input
                      value={r.name}
                      onChange={(e) => {
                        const updated = [...(editingAssessment.rubric || [])];
                        updated[rIdx].name = e.target.value;
                        setEditingAssessment({ ...editingAssessment, rubric: updated });
                      }}
                      placeholder="Criterion e.g. Precision"
                      className="text-xs col-span-2"
                    />
                    <Input
                      type="number"
                      value={r.weightPercent}
                      onChange={(e) => {
                        const updated = [...(editingAssessment.rubric || [])];
                        updated[rIdx].weightPercent = Number(e.target.value);
                        setEditingAssessment({ ...editingAssessment, rubric: updated });
                      }}
                      placeholder="Weight %"
                      className="text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-200">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
              <Save className="w-4 h-4 mr-1.5" /> Save Assessment
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
