import React, { useState } from 'react';
import { RecitationSubmission } from '../../types';
import { Button, Card, Badge, Avatar } from '../ui';
import {
  Volume2,
  Play,
  Pause,
  Award,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  MessageSquare,
  BookOpen
} from 'lucide-react';

interface EvaluatedSubmissionsViewerProps {
  submissions: RecitationSubmission[];
  onRefresh?: () => void;
  isQuran?: boolean;
}

export const EvaluatedSubmissionsViewer: React.FC<EvaluatedSubmissionsViewerProps> = ({
  submissions,
  onRefresh,
  isQuran = true,
}) => {
  const [filter, setFilter] = useState<'all' | 'graded' | 'pending'>('all');
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [playingVoiceFeedbackId, setPlayingVoiceFeedbackId] = useState<string | null>(null);

  const filteredSubs = submissions.filter((sub) => {
    if (filter === 'graded') return sub.status === 'graded' || sub.status === 'Mastered';
    if (filter === 'pending') return sub.status === 'pending' || sub.status === 'Pending Review';
    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h3 className="text-base font-semibold text-slate-900 font-display flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            {isQuran ? 'Recitation Submissions & Ustadhah Evaluations' : 'Coursework Submissions & Faculty Evaluations'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Listen to your submissions and review detailed feedback, scoring rubrics, and voice notes.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({submissions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('graded')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filter === 'graded' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Graded ({submissions.filter((s) => s.status === 'graded' || s.status === 'Mastered').length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filter === 'pending' ? 'bg-white text-amber-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending ({submissions.filter((s) => s.status === 'pending' || s.status === 'Pending Review').length})
          </button>
        </div>
      </div>

      {/* Submissions List */}
      {filteredSubs.length > 0 ? (
        <div className="space-y-4">
          {filteredSubs.map((sub: any) => {
            const isGraded = sub.status === 'graded' || sub.status === 'Mastered';
            const isRevision = sub.status === 'Needs Revision' || sub.status === 'Revision Needed';
            const hasVoiceNote = Boolean(sub.teacherAudioFeedbackUrl);

            return (
              <div
                key={sub.id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4 hover:border-slate-300 transition-all"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <h4 className="font-semibold text-sm text-slate-900">
                        {sub.surahName || sub.title || (isQuran ? 'Oral Recitation Assignment' : 'Coursework Deliverable')}
                      </h4>
                      <span className="font-mono text-xs font-semibold text-slate-500">
                        {sub.ayahRange || `Ayahs ${sub.startAyah || 1} - ${sub.endAyah || 10}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                      <span>Submitted: {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : 'Recent'}</span>
                      <span>•</span>
                      <span>ID: {sub.id.slice(0, 12)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {isGraded ? (
                      <Badge variant="success" className="px-3 py-1 text-xs font-semibold gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {sub.score ? `Mumtaz (${sub.score}%)` : 'Graded & Approved'}
                      </Badge>
                    ) : isRevision ? (
                      <Badge variant="error" className="px-3 py-1 text-xs font-semibold gap-1.5">
                        <RotateCcw className="w-3.5 h-3.5" /> Revision Requested
                      </Badge>
                    ) : (
                      <Badge variant="warning" className="px-3 py-1 text-xs font-semibold gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> Awaiting Ustadhah Evaluation
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Audio Players & Evaluation Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Student Audio Submission */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
                    <span className="text-xs font-semibold capitalize tracking-wider text-slate-500 block">
                      Your Recitation Audio
                    </span>
                    {sub.audioUrl ? (
                      <div className="flex items-center justify-between gap-3 pt-1">
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => {
                              if (playingAudioId === sub.id) {
                                setPlayingAudioId(null);
                              } else {
                                setPlayingAudioId(sub.id);
                                setPlayingVoiceFeedbackId(null);
                              }
                            }}
                            className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition-all cursor-pointer shadow-2xs shrink-0"
                          >
                            {playingAudioId === sub.id ? (
                              <Pause className="w-4 h-4 fill-current" />
                            ) : (
                              <Play className="w-4 h-4 fill-current ml-0.5" />
                            )}
                          </button>
                          <div>
                            <span className="text-xs font-semibold text-slate-800 block">Play Student Audio</span>
                            <span className="text-xs text-slate-500 font-mono font-medium">
                              {sub.durationSeconds ? `${sub.durationSeconds}s recording` : 'Oral Recording'}
                            </span>
                          </div>
                        </div>

                        {playingAudioId === sub.id && (
                          <audio
                            src={sub.audioUrl}
                            autoPlay
                            onEnded={() => setPlayingAudioId(null)}
                            className="hidden"
                          />
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No audio blob stored</p>
                    )}
                  </div>

                  {/* Teacher Voice Memo / Remarks */}
                  <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold capitalize tracking-wider text-emerald-800">
                        {isQuran ? 'Ustadhah Evaluation' : 'Instructor Evaluation'}
                      </span>
                      {hasVoiceNote && (
                        <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Volume2 className="w-3 h-3" /> Voice Note
                        </span>
                      )}
                    </div>

                    {isGraded || isRevision ? (
                      <div className="space-y-2 pt-1">
                        {sub.teacherRemarks || sub.teacherFeedback ? (
                          <p className="text-xs text-slate-700 font-medium italic leading-relaxed">
                            "{sub.teacherRemarks || sub.teacherFeedback}"
                          </p>
                        ) : (
                          <p className="text-xs text-slate-500 italic">No written remarks entered.</p>
                        )}

                        {/* Teacher Voice Memo Audio Player */}
                        {hasVoiceNote && (
                          <div className="flex items-center justify-between gap-3 pt-2 border-t border-emerald-200/60">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  if (playingVoiceFeedbackId === sub.id) {
                                    setPlayingVoiceFeedbackId(null);
                                  } else {
                                    setPlayingVoiceFeedbackId(sub.id);
                                    setPlayingAudioId(null);
                                  }
                                }}
                                className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center hover:bg-emerald-800 transition-all cursor-pointer shadow-2xs shrink-0"
                              >
                                {playingVoiceFeedbackId === sub.id ? (
                                  <Pause className="w-3.5 h-3.5 fill-current" />
                                ) : (
                                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                                )}
                              </button>
                              <span className="text-xs font-semibold text-emerald-900">
                                Listen to Ustadhah Voice Note
                              </span>
                            </div>

                            {playingVoiceFeedbackId === sub.id && (
                              <audio
                                src={sub.teacherAudioFeedbackUrl}
                                autoPlay
                                onEnded={() => setPlayingVoiceFeedbackId(null)}
                                className="hidden"
                              />
                            )}
                          </div>
                        )}

                        {/* Mistake Tags */}
                        {sub.mistakeTags && sub.mistakeTags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {sub.mistakeTags.map((tag: string, idx: number) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic pt-1">
                        Your recitation is queued in your Ustadhah's grading roster. You will be notified once evaluated.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <BookOpen className="w-7 h-7" />
          </div>
          <h4 className="text-base font-semibold text-slate-900">No Submissions Found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {isQuran
              ? 'You have not submitted any recitation homework yet. Use the Recording Studio above to submit your first oral recitation.'
              : 'You have not submitted any coursework deliverables yet.'}
          </p>
        </div>
      )}
    </div>
  );
};
