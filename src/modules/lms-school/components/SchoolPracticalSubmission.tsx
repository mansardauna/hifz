import React, { useState } from 'react';
import { SchoolAssessment, RubricCriterion } from '../types';
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Film,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  AlertCircle,
  X,
  Volume2,
} from 'lucide-react';
import { Button, Badge, Card, Input } from '../../../components/ui';
import { useToast } from '../../../context/ToastContext';

interface SchoolPracticalSubmissionProps {
  assessment: SchoolAssessment;
  onSubmitSuccess?: () => void;
}

export const SchoolPracticalSubmission: React.FC<SchoolPracticalSubmissionProps> = ({
  assessment,
  onSubmitSuccess,
}) => {
  const { success, error, info } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; url: string; type: string }[]>([]);
  const [studentNotes, setStudentNotes] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [submissionStatus, setSubmissionStatus] = useState<'pending' | 'submitted' | 'graded'>('pending');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newFiles: { name: string; url: string; type: string }[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'assignments');
      formData.append('tenantId', 'school-vocational');

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.url) {
          newFiles.push({
            name: file.name,
            url: data.url,
            type: file.type,
          });
        }
      } catch {
        // Fallback local blob URL
        newFiles.push({
          name: file.name,
          url: URL.createObjectURL(file),
          type: file.type,
        });
      }
    }

    setUploadedFiles((prev) => [...prev, ...newFiles]);
    setIsUploading(false);
    success('Files Attached', `${newFiles.length} file(s) attached to submission.`);
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitAssignment = () => {
    if (uploadedFiles.length === 0 && !studentNotes.trim()) {
      error('Submission Error', 'Please attach files or enter your project description.');
      return;
    }

    setSubmissionStatus('submitted');
    success('Project Submitted! 🚀', 'Your vocational assignment has been sent to your instructor for grading.');
    if (onSubmitSuccess) onSubmitSuccess();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden font-sans space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 border border-emerald-500/30">
              Practical Vocational Project
            </span>
            <span className="text-xs text-slate-500">Passing Grade: {assessment.passingScorePercent}%</span>
          </div>
          <h2 className="text-lg font-black text-slate-900 mt-1">{assessment.title}</h2>
        </div>

        <div>
          {submissionStatus === 'pending' && (
            <Badge variant="warning" size="md">
              <Clock className="w-3.5 h-3.5 mr-1" /> Not Submitted Yet
            </Badge>
          )}
          {submissionStatus === 'submitted' && (
            <Badge variant="info" size="md">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Awaiting Teacher Review
            </Badge>
          )}
        </div>
      </div>

      {/* Practical Prompt & Guidelines */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
        <h3 className="font-black text-slate-900 text-sm">Assignment Instructions & Workshop Requirements</h3>
        <div
          className="whitespace-pre-wrap leading-relaxed prose prose-sm"
          dangerouslySetInnerHTML={{
            __html: (assessment.practicalPrompt || assessment.description)
              .replace(/### (.*)/g, '<h4 class="font-extrabold text-slate-900 mt-2 mb-1">$1</h4>')
              .replace(/1\. (.*)/g, '<li class="ml-4 list-decimal text-slate-700">$1</li>'),
          }}
        />
      </div>

      {/* Grading Rubric Breakdown */}
      {assessment.rubric && assessment.rubric.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Evaluation Rubric (Teacher Criteria)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {assessment.rubric.map((item) => (
              <div key={item.id} className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <span>{item.name}</span>
                  <span className="text-emerald-700">{item.weightPercent}% weight</span>
                </div>
                <p className="text-[11px] text-slate-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Zone & Submission Form */}
      {submissionStatus === 'pending' ? (
        <div className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Student Project Notes / Summary
            </label>
            <textarea
              rows={3}
              value={studentNotes}
              onChange={(e) => setStudentNotes(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-emerald-500"
              placeholder="Describe your execution, components used, and any challenges resolved..."
            />
          </div>

          {/* File Upload Dropzone */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">
              Attach Proof of Work (Photos, Video Demo, PDF Report)
            </label>

            <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-50/50 hover:bg-emerald-50/30 transition-all">
              <UploadCloud className="w-8 h-8 text-slate-400" />
              <div className="text-center">
                <span className="text-xs font-bold text-emerald-700 hover:underline">
                  Click to select files
                </span>
                <span className="text-xs text-slate-500"> or drag and drop</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Images (JPG/PNG), Videos (MP4), or PDF documents up to 50MB
                </p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*,video/*,application/pdf"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isUploading}
              />
            </label>
          </div>

          {/* Attached Files List */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700">Attached Files ({uploadedFiles.length}):</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {uploadedFiles.map((file, idx) => (
                  <div key={idx} className="p-3 bg-slate-100 rounded-xl flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      {file.type.includes('image') ? (
                        <ImageIcon className="w-4 h-4 text-blue-600 shrink-0" />
                      ) : file.type.includes('video') ? (
                        <Film className="w-4 h-4 text-purple-600 shrink-0" />
                      ) : (
                        <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      <span className="font-semibold text-slate-800 truncate">{file.name}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveFile(idx)}
                      className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <Button
              variant="primary"
              size="md"
              onClick={handleSubmitAssignment}
              disabled={isUploading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30"
            >
              Submit Practical Project For Grading
            </Button>
          </div>
        </div>
      ) : (
        /* Submitted Confirmation */
        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="text-base font-extrabold text-emerald-950">
            Project Successfully Submitted!
          </h3>
          <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
            Your teacher will review your craftsmanship and evaluate your submission against the rubric. You will receive an instant notification when your grade is released.
          </p>
        </div>
      )}
    </div>
  );
};
