import React, { useState } from 'react';
import { TeacherReviewSubmission, RubricScoreItem } from './types';
import { VoiceFeedbackRecorder } from './VoiceFeedbackRecorder';
import { UniversalGradingRubric } from './UniversalGradingRubric';
import { Button, Card, Badge } from '../../../components/ui';
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  Sparkles,
  BookOpen,
  GraduationCap,
  Code2,
  User,
  Volume2,
  FileText,
  Search,
  Check,
  RotateCcw
} from 'lucide-react';

interface TeacherEvaluationStudioProps {
  submissions: TeacherReviewSubmission[];
  onSaveEvaluation: (submissionId: string, updatedData: Partial<TeacherReviewSubmission>) => void;
  renderSubmissionAdapter?: (submission: TeacherReviewSubmission) => React.ReactNode;
}

export const TeacherEvaluationStudio: React.FC<TeacherEvaluationStudioProps> = ({
  submissions,
  onSaveEvaluation,
  renderSubmissionAdapter
}) => {
  const [selectedId, setSelectedId] = useState<string>(submissions[0]?.id || '');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'graded'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const selectedSubmission = submissions.find((s) => s.id === selectedId) || submissions[0];

  const [currentRubric, setCurrentRubric] = useState<RubricScoreItem[]>(
    selectedSubmission?.rubricScores || [
      { id: '1', label: 'Core Proficiency & Mastery', weight: 40, score: 9 },
      { id: '2', label: 'Technical Accuracy & Fluency', weight: 30, score: 8 },
      { id: '3', label: 'Structure, Format & Consistency', weight: 30, score: 9 }
    ]
  );

  const [teacherRemarks, setTeacherRemarks] = useState<string>(
    selectedSubmission?.teacherRemarks || ''
  );
  const [voiceAudioUrl, setVoiceAudioUrl] = useState<string | undefined>(
    selectedSubmission?.voiceFeedbackUrl
  );
  const [voiceDuration, setVoiceDuration] = useState<number | undefined>(
    selectedSubmission?.voiceFeedbackDurationSec
  );

  const handleSelectSubmission = (sub: TeacherReviewSubmission) => {
    setSelectedId(sub.id);
    setCurrentRubric(
      sub.rubricScores || [
        { id: '1', label: 'Core Proficiency & Mastery', weight: 40, score: 9 },
        { id: '2', label: 'Technical Accuracy & Fluency', weight: 30, score: 8 },
        { id: '3', label: 'Structure, Format & Consistency', weight: 30, score: 9 }
      ]
    );
    setTeacherRemarks(sub.teacherRemarks || '');
    setVoiceAudioUrl(sub.voiceFeedbackUrl);
    setVoiceDuration(sub.voiceFeedbackDurationSec);
  };

  const handleSave = (status: 'Graded' | 'Needs Revision') => {
    if (!selectedSubmission) return;
    const computedTotal = Math.round(
      currentRubric.reduce((acc, item) => acc + (item.score / 10) * item.weight, 0)
    );

    let calculatedGrade = 'Jayyid';
    if (computedTotal >= 95) calculatedGrade = 'Mumtaz (A+)';
    else if (computedTotal >= 85) calculatedGrade = 'Jayyid Jiddan (A)';
    else if (computedTotal >= 75) calculatedGrade = 'Jayyid (B)';
    else calculatedGrade = 'Maqbool (C)';

    onSaveEvaluation(selectedSubmission.id, {
      status,
      overallScore: computedTotal,
      overallGrade: calculatedGrade,
      rubricScores: currentRubric,
      teacherRemarks,
      voiceFeedbackUrl: voiceAudioUrl,
      voiceFeedbackDurationSec: voiceDuration,
      reviewedAt: new Date().toISOString()
    });
  };

  const filteredSubmissions = submissions.filter((s) => {
    if (filterStatus === 'pending' && s.status !== 'Pending') return false;
    if (filterStatus === 'graded' && s.status !== 'Graded') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.studentName.toLowerCase().includes(q) ||
        s.title.toLowerCase().includes(q) ||
        s.subtitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column: Submissions Queue */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" /> Evaluation Queue
            </h4>
            <Badge variant="default">
              {filteredSubmissions.length} Submissions
            </Badge>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search student or lesson..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 pt-1">
            {(['all', 'pending', 'graded'] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setFilterStatus(filter)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                  filterStatus === filter
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* List of submissions */}
        <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
          {filteredSubmissions.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/50 border border-slate-800/80 rounded-2xl text-slate-400 text-xs">
              No submissions found for this filter.
            </div>
          ) : (
            filteredSubmissions.map((sub) => {
              const isSelected = sub.id === selectedSubmission?.id;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => handleSelectSubmission(sub)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-emerald-950/30 border-emerald-500/50 ring-1 ring-emerald-500/30'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-slate-200">
                        {sub.studentName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white line-clamp-1">
                          {sub.studentName}
                        </h5>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{sub.title}</p>
                      </div>
                    </div>

                    <Badge
                      variant={
                        sub.status === 'Graded'
                          ? 'success'
                          : sub.status === 'Needs Revision'
                          ? 'warning'
                          : 'default'
                      }
                    >
                      {sub.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800/60 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {sub.submittedAt}
                    </span>
                    {sub.overallScore && (
                      <span className="font-mono font-bold text-emerald-400">
                        {sub.overallScore}% ({sub.overallGrade})
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right Column: Active Submission Evaluation Workspace */}
      <div className="lg:col-span-8 space-y-5">
        {selectedSubmission ? (
          <>
            {/* Header Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
                  {selectedSubmission.studentName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-white">
                      {selectedSubmission.studentName}
                    </h3>
                    <Badge variant="outline">
                      {selectedSubmission.type.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-300 font-medium mt-0.5">
                    {selectedSubmission.title} • {selectedSubmission.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSave('Needs Revision')}
                  className="text-xs border-amber-500/40 text-amber-300 hover:bg-amber-500/10 gap-1.5"
                >
                  <AlertCircle className="w-3.5 h-3.5" /> Request Revision
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleSave('Graded')}
                  className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white gap-1.5 shadow-md shadow-emerald-950/40"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Submit Grade
                </Button>
              </div>
            </div>

            {/* Render Domain-Specific Submission Adapter (Quran audio, Code diff, or School doc) */}
            {renderSubmissionAdapter ? (
              renderSubmissionAdapter(selectedSubmission)
            ) : selectedSubmission.audioUrl ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-slate-200">Student Voice Submission</span>
                </div>
                <audio controls src={selectedSubmission.audioUrl} className="w-full" />
              </div>
            ) : selectedSubmission.codeSnippet ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-emerald-300 bg-black/40 overflow-x-auto">
                <pre>{selectedSubmission.codeSnippet}</pre>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs text-slate-300">
                <p>{selectedSubmission.textContent || 'No additional attachment provided.'}</p>
              </div>
            )}

            {/* Rubric Evaluation */}
            <UniversalGradingRubric
              rubric={currentRubric}
              onChangeRubric={setCurrentRubric}
            />

            {/* Voice Feedback Recorder */}
            <VoiceFeedbackRecorder
              initialAudioUrl={voiceAudioUrl}
              onAudioRecorded={(url, dur) => {
                setVoiceAudioUrl(url);
                setVoiceDuration(dur);
              }}
              onDiscardAudio={() => {
                setVoiceAudioUrl(undefined);
                setVoiceDuration(undefined);
              }}
            />

            {/* Written Remarks */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
              <label className="block text-xs font-bold text-slate-200">
                Instructor Written Remarks & Pedagogical Notes
              </label>
              <textarea
                rows={3}
                value={teacherRemarks}
                onChange={(e) => setTeacherRemarks(e.target.value)}
                placeholder="Write actionable, encouraging feedback for the student..."
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </>
        ) : (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400">
            Select a student submission from the queue to start evaluating.
          </div>
        )}
      </div>
    </div>
  );
};
