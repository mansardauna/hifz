import React, { useState } from 'react';
import { TeacherReviewSubmission, ReviewAdapterProps } from '../../common/evaluation/types';
import { Volume2, BookOpen, AlertTriangle, Check, ShieldCheck } from 'lucide-react';
import { Badge, Button } from '../../../components/ui';

const TAJWEED_RULES = [
  { id: 'ghunnah', label: 'Ghunnah (Nasalization)', color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' },
  { id: 'qalqalah', label: 'Qalqalah (Echoing)', color: 'border-blue-500/40 text-blue-400 bg-blue-500/10' },
  { id: 'madd', label: 'Madd (Elongation)', color: 'border-purple-500/40 text-purple-400 bg-purple-500/10' },
  { id: 'ikhfa', label: 'Ikhfa (Concealment)', color: 'border-amber-500/40 text-amber-400 bg-amber-500/10' },
  { id: 'idgham', label: 'Idgham (Assimilation)', color: 'border-rose-500/40 text-rose-400 bg-rose-500/10' },
  { id: 'makhraj', label: 'Makhraj (Articulation)', color: 'border-teal-500/40 text-teal-400 bg-teal-500/10' }
];

export const QuranReviewAdapter: React.FC<ReviewAdapterProps> = ({
  submission,
  onUpdateMistakes
}) => {
  const [selectedMistakes, setSelectedMistakes] = useState<string[]>(
    submission.tajweedMistakes || []
  );

  const handleToggleMistake = (ruleId: string) => {
    const updated = selectedMistakes.includes(ruleId)
      ? selectedMistakes.filter((r) => r !== ruleId)
      : [...selectedMistakes, ruleId];
    setSelectedMistakes(updated);
    if (onUpdateMistakes) {
      onUpdateMistakes(updated);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Recitation Audio & Tajweed Inspection</h4>
            <p className="text-[11px] text-slate-400">
              Surah {submission.surahName || 'Al-Fatihah'} • Ayah {submission.ayahStart || 1} to {submission.ayahEnd || 7}
            </p>
          </div>
        </div>

        <Badge variant="default" className="font-mono">
          {submission.audioUrl ? 'High-Bitrate Opus Audio' : 'Audio Pending'}
        </Badge>
      </div>

      {/* Audio Player */}
      <div className="bg-slate-800/80 border border-slate-700/60 p-3.5 rounded-xl space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
          <Volume2 className="w-4 h-4 text-emerald-400" />
          <span>Student Recitation Audio</span>
        </div>
        <audio
          controls
          src={submission.audioUrl || 'https://everyayah.com/data/Alafasy_128kbps/001001.mp3'}
          className="w-full h-10 accent-emerald-500"
        />
      </div>

      {/* Tajweed Mistake & Focus Tags */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Tajweed Focus Areas & Noted Mistakes
        </label>
        <p className="text-[11px] text-slate-400">
          Click any Tajweed rule to flag specific areas requiring student practice and correction:
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {TAJWEED_RULES.map((rule) => {
            const isFlagged = selectedMistakes.includes(rule.id);
            return (
              <button
                key={rule.id}
                type="button"
                onClick={() => handleToggleMistake(rule.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                  isFlagged
                    ? `${rule.color} ring-1 ring-emerald-500/50`
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {isFlagged ? <Check className="w-3 h-3 text-emerald-400" /> : <div className="w-2 h-2 rounded-full bg-slate-600" />}
                {rule.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
