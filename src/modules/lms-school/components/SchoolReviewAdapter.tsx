import React from 'react';
import { ReviewAdapterProps } from '../../common/evaluation/types';
import { FileText, Download, CheckCircle2, GraduationCap, Clock } from 'lucide-react';
import { Badge, Button } from '../../../components/ui';

export const SchoolReviewAdapter: React.FC<ReviewAdapterProps> = ({ submission }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Academic Submission & Coursework Document</h4>
            <p className="text-[11px] text-slate-400">
              {submission.courseTitle || 'AP Physics / Calculus'} • {submission.assignmentTitle || submission.title}
            </p>
          </div>
        </div>

        <Badge variant="outline">
          Term Assessment
        </Badge>
      </div>

      {/* Document Preview Card */}
      <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <FileText className="w-4 h-4 text-blue-400" />
            <span>Student Attached File / Written Response</span>
          </div>
          <Button size="sm" variant="outline" className="gap-1.5 text-xs py-1">
            <Download className="w-3.5 h-3.5" /> Download PDF / Doc
          </Button>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 font-sans leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
          {submission.textContent ||
            `Student Response Submission:
The fundamental theorem of calculus establishes the formal relationship between differentiation and integration. In this problem set, we evaluated both definite integrals using Riemann sums and verified the antiderivative boundaries.`}
        </div>
      </div>
    </div>
  );
};
