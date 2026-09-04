import React, { useState } from 'react';
import {
  FileCheck2,
  Upload,
  Calendar,
  Clock,
  Award,
  AlertCircle,
  CheckCircle2,
  FileText,
  Send,
  X,
  Sparkles,
  Filter,
  Check
} from 'lucide-react';
import { Button, Card, Badge, Input } from '../../components/ui';
import { ToastMessage } from '../../components/ui/Toast';

export interface SchoolAssignment {
  id: string;
  courseCode: string;
  courseTitle: string;
  title: string;
  description: string;
  dueDate: string;
  dueCountdown: string;
  pointsPossible: number;
  status: 'pending' | 'submitted' | 'graded' | 'late';
  submissionType: 'PDF Upload' | 'Essay Text' | 'Problem Set' | 'Lab Report';
  submittedAt?: string;
  score?: number;
  letterGrade?: string;
  teacherFeedback?: string;
  rubricBreakdown?: {
    criteria: string;
    points: number;
    maxPoints: number;
  }[];
}

const INITIAL_ASSIGNMENTS: SchoolAssignment[] = [
  {
    id: 'asg-1',
    courseCode: 'MATH-401',
    courseTitle: 'AP Calculus BC',
    title: 'Problem Set 5: Taylor Series & Radius of Convergence',
    description: 'Solve problems 1-14 from Chapter 9.4. Show all work for interval of convergence and ratio tests. Submit a single clear PDF scan.',
    dueDate: 'Oct 20, 2026 • 11:59 PM',
    dueCountdown: 'Due in 2 days',
    pointsPossible: 50,
    status: 'pending',
    submissionType: 'PDF Upload',
  },
  {
    id: 'asg-2',
    courseCode: 'PHYS-302',
    courseTitle: 'AP Physics C',
    title: 'Lab Report 4: Rotational Inertia & Flywheel Kinetic Energy',
    description: 'Complete the laboratory data analysis report with error propagation calculations, plot torque vs angular acceleration in Excel/Python.',
    dueDate: 'Oct 22, 2026 • 5:00 PM',
    dueCountdown: 'Due in 4 days',
    pointsPossible: 100,
    status: 'pending',
    submissionType: 'Lab Report',
  },
  {
    id: 'asg-3',
    courseCode: 'ENGL-301',
    courseTitle: 'World Literature',
    title: 'Comparative Essay: Existential Themes in Modernist Fiction',
    description: 'Write a 1,500-word critical analytical essay comparing Kafka\'s The Metamorphosis and Camus\' The Stranger. Include 4 scholarly citations in MLA format.',
    dueDate: 'Oct 14, 2026 • 11:59 PM',
    dueCountdown: 'Completed',
    pointsPossible: 100,
    status: 'graded',
    submissionType: 'Essay Text',
    submittedAt: 'Oct 14, 2026 at 09:42 PM',
    score: 96,
    letterGrade: 'A',
    teacherFeedback: 'Outstanding analytical rigor, Alex. Your synthesis of alienation motifs and clear thesis progression demonstrated advanced critical rhetoric.',
    rubricBreakdown: [
      { criteria: 'Thesis & Analytical Insight', points: 30, maxPoints: 30 },
      { criteria: 'Textual Evidence & Quotation Integration', points: 28, maxPoints: 30 },
      { criteria: 'Structure, Transitions & Style', points: 20, maxPoints: 20 },
      { criteria: 'MLA Mechanics & Citation Integrity', points: 18, maxPoints: 20 },
    ]
  },
  {
    id: 'asg-4',
    courseCode: 'CHEM-205',
    courseTitle: 'Honors Chemistry',
    title: 'Calorimetry & Hess\'s Law Problem Sheet',
    description: 'Calculate standard enthalpy of formation using Hess\'s Law cycles and calorimetry temperature change equations.',
    dueDate: 'Oct 12, 2026 • 11:59 PM',
    dueCountdown: 'Submitted',
    pointsPossible: 40,
    status: 'submitted',
    submissionType: 'Problem Set',
    submittedAt: 'Oct 12, 2026 at 04:15 PM',
  },
  {
    id: 'asg-5',
    courseCode: 'HIST-210',
    courseTitle: 'AP World History',
    title: 'Document-Based Question (DBQ): Industrialization & Global Labor',
    description: 'Evaluate the extent to which technological transformations altered labor dynamics and social hierarchies between 1750 and 1900.',
    dueDate: 'Oct 05, 2026 • 11:59 PM',
    dueCountdown: 'Completed',
    pointsPossible: 100,
    status: 'graded',
    submissionType: 'Essay Text',
    submittedAt: 'Oct 05, 2026 at 10:18 PM',
    score: 98,
    letterGrade: 'A+',
    teacherFeedback: 'Exemplary DBQ execution! Nuanced historical contextualization and flawless sourcing analysis of documents 3 and 6.',
    rubricBreakdown: [
      { criteria: 'Contextualization & Complex Thesis', points: 20, maxPoints: 20 },
      { criteria: 'Document Sourcing (HIPP Analysis)', points: 40, maxPoints: 40 },
      { criteria: 'Outside Historical Evidence', points: 20, maxPoints: 20 },
      { criteria: 'Historical Complexity & Synthesis', points: 18, maxPoints: 20 },
    ]
  }
];

interface SchoolAssignmentsPortalProps {
  onAddToast?: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const SchoolAssignmentsPortal: React.FC<SchoolAssignmentsPortalProps> = ({ onAddToast }) => {
  const [assignments, setAssignments] = useState<SchoolAssignment[]>(INITIAL_ASSIGNMENTS);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');
  const [selectedAssignment, setSelectedAssignment] = useState<SchoolAssignment | null>(null);
  const [submissionText, setSubmissionText] = useState<string>('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const filteredAssignments = assignments.filter((asg) => {
    if (activeFilter === 'all') return true;
    return asg.status === activeFilter;
  });

  const handleOpenSubmitModal = (asg: SchoolAssignment) => {
    setSelectedAssignment(asg);
    setSubmissionText('');
    setUploadedFileName(null);
  };

  const handleSubmitAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setAssignments((prev) =>
        prev.map((item) =>
          item.id === selectedAssignment.id
            ? {
                ...item,
                status: 'submitted',
                submittedAt: `Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                dueCountdown: 'Submitted on Time',
              }
            : item
        )
      );

      setIsSubmitting(false);
      setSelectedAssignment(null);

      if (onAddToast) {
        onAddToast({
          type: 'success',
          title: 'Assignment Submitted!',
          message: `Successfully turned in "${selectedAssignment.title}" for ${selectedAssignment.courseCode}.`,
        });
      }
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="primary">Academic Drop-box</Badge>
            <span className="text-xs text-slate-500 font-mono">Term 1 • 2025–2026</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Homework & Assignment Submissions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Submit your problem sets, lab write-ups, and essay drafts with instant verification and rubric feedback.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl shrink-0 overflow-x-auto">
          {(['all', 'pending', 'submitted', 'graded'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                activeFilter === filter
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {filter === 'all' ? 'All (5)' : filter === 'pending' ? 'To Do (2)' : filter === 'submitted' ? 'In Review (1)' : 'Graded (2)'}
            </button>
          ))}
        </div>
      </div>

      {/* Assignments Grid */}
      <div className="space-y-4">
        {filteredAssignments.map((asg) => {
          const isGraded = asg.status === 'graded';
          const isPending = asg.status === 'pending';
          const isSubmitted = asg.status === 'submitted';

          return (
            <Card
              key={asg.id}
              className={`p-5 sm:p-6 transition-all border ${
                isPending
                  ? 'border-slate-200 bg-white hover:border-purple-300 hover:shadow-xs'
                  : isGraded
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : 'border-blue-200 bg-blue-50/20'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">
                      {asg.courseCode}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{asg.courseTitle}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500 font-mono">{asg.submissionType}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {asg.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
                    {asg.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 flex-wrap">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Due: {asg.dueDate}</span>
                    </div>

                    <div className="flex items-center gap-1.5 font-medium">
                      <Award className="w-3.5 h-3.5 text-slate-400" />
                      <span>{asg.pointsPossible} Points Possible</span>
                    </div>

                    {asg.submittedAt && (
                      <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Submitted on {asg.submittedAt}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Action / Grade Indicator */}
                <div className="flex flex-col sm:flex-row md:flex-col items-end justify-between gap-3 shrink-0">
                  {isGraded ? (
                    <div className="bg-emerald-100/80 border border-emerald-300 p-3 rounded-2xl text-center min-w-[120px]">
                      <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">Score</span>
                      <span className="text-2xl font-black text-emerald-950 font-mono">
                        {asg.score} <span className="text-xs text-emerald-700">/ {asg.pointsPossible}</span>
                      </span>
                      <Badge variant="success" className="mt-1 font-bold">Grade: {asg.letterGrade}</Badge>
                    </div>
                  ) : isSubmitted ? (
                    <div className="bg-blue-50 border border-blue-200 p-3 rounded-2xl text-center min-w-[120px]">
                      <span className="text-[10px] uppercase font-bold text-blue-800 tracking-wider block">Status</span>
                      <span className="text-sm font-bold text-blue-900 flex items-center justify-center gap-1 mt-1">
                        <Clock className="w-4 h-4 text-blue-600" /> In Review
                      </span>
                      <span className="text-[10px] text-blue-600 block mt-1">Pending Grading</span>
                    </div>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleOpenSubmitModal(asg)}
                      leftIcon={<Upload className="w-3.5 h-3.5" />}
                      className="bg-purple-700 hover:bg-purple-800 text-white font-bold"
                    >
                      Turn In Assignment
                    </Button>
                  )}
                </div>
              </div>

              {/* Rubric Feedback for Graded Assignments */}
              {isGraded && asg.rubricBreakdown && (
                <div className="mt-4 pt-4 border-t border-emerald-100 space-y-3">
                  <div className="p-3.5 bg-white rounded-xl border border-emerald-200/80 text-xs">
                    <span className="font-bold text-slate-800 block mb-1">Instructor Feedback:</span>
                    <p className="text-slate-700 italic">"{asg.teacherFeedback}"</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                    {asg.rubricBreakdown.map((rubric, rIdx) => (
                      <div key={rIdx} className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs">
                        <span className="text-[10px] text-slate-500 font-medium block truncate">{rubric.criteria}</span>
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-bold text-slate-900 font-mono">{rubric.points} / {rubric.maxPoints} pts</span>
                          <span className="text-[10px] text-emerald-700 font-bold">
                            {Math.round((rubric.points / rubric.maxPoints) * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Interactive Turn-in Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">
                  {selectedAssignment.courseCode}
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  Turn In: {selectedAssignment.title}
                </h3>
                <p className="text-xs text-slate-500">Max Score: {selectedAssignment.pointsPossible} Points</p>
              </div>

              <button
                onClick={() => setSelectedAssignment(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitAssignment} className="space-y-4">
              {/* File Upload Zone */}
              <div
                onClick={() => setUploadedFileName(`${selectedAssignment.courseCode}_Submission_Alex.pdf`)}
                className="p-6 border-2 border-dashed border-purple-300 hover:border-purple-500 bg-purple-50/40 rounded-2xl text-center cursor-pointer transition-colors"
              >
                <Upload className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                {uploadedFileName ? (
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> {uploadedFileName}
                    </span>
                    <span className="text-[10px] text-slate-500">Ready to submit (Click to re-upload)</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-purple-900 block">Click to upload document or scan</span>
                    <span className="text-[10px] text-slate-500">Supports PDF, DOCX, ZIP up to 50MB</span>
                  </div>
                )}
              </div>

              {/* Text submission notes */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Submission Notes or Online Text (Optional)
                </label>
                <textarea
                  rows={4}
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  placeholder="Add any clarification notes, derivation links, or typed answers for the instructor..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setSelectedAssignment(null)}
                >
                  Cancel
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-purple-700 hover:bg-purple-800 text-white font-bold"
                  leftIcon={<Send className="w-3.5 h-3.5" />}
                >
                  {isSubmitting ? 'Submitting...' : 'Confirm Submission'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
