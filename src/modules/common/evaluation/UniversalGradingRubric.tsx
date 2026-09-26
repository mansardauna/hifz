import React from 'react';
import { RubricScoreItem } from './types';
import { Award, Star } from 'lucide-react';

interface UniversalGradingRubricProps {
  rubric: RubricScoreItem[];
  onChangeRubric: (rubric: RubricScoreItem[]) => void;
  disabled?: boolean;
}

export const UniversalGradingRubric: React.FC<UniversalGradingRubricProps> = ({
  rubric,
  onChangeRubric,
  disabled = false
}) => {
  const handleScoreChange = (id: string, newScore: number) => {
    const updated = rubric.map((item) =>
      item.id === id ? { ...item, score: newScore } : item
    );
    onChangeRubric(updated);
  };

  // Compute weighted total score (out of 100)
  const totalScorePercent = Math.round(
    rubric.reduce((acc, item) => {
      const itemRatio = item.score / 10;
      return acc + itemRatio * (item.weight || 100 / (rubric.length || 1));
    }, 0)
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-200">Rubric Criteria & Scoring</h5>
            <p className="text-[11px] text-slate-400">Score each academic rubric dimension (1 - 10)</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-xs font-mono font-bold text-white">
            {totalScorePercent}%
          </span>
          <span className="text-[10px] text-slate-400">Total</span>
        </div>
      </div>

      <div className="space-y-3">
        {rubric.map((item) => (
          <div
            key={item.id}
            className="p-3 bg-slate-800/60 border border-slate-700/50 rounded-xl space-y-2"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">{item.label}</span>
              <div className="flex items-center gap-1">
                <span className="font-mono font-bold text-emerald-400">{item.score}</span>
                <span className="text-slate-400">/ 10</span>
                <span className="text-[10px] text-slate-500 ml-1">({item.weight}% weight)</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                disabled={disabled}
                value={item.score}
                onChange={(e) => handleScoreChange(item.id, Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 disabled:opacity-50"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
