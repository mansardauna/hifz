import React from 'react';
import { ReviewAdapterProps } from '../../common/evaluation/types';
import { Code2, Terminal, CheckCircle2, AlertCircle, Copy } from 'lucide-react';
import { Badge, Button } from '../../../components/ui';

export const CodeReviewAdapter: React.FC<ReviewAdapterProps> = ({ submission }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Source Code Submission & AST Inspection</h4>
            <p className="text-[11px] text-slate-400">
              {submission.language || 'TypeScript / React'} • Branch: <span className="font-mono text-emerald-400">main</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" className="font-mono">
            {submission.testPassedCount || 8}/{submission.totalTestCount || 8} Unit Tests Passed
          </Badge>
        </div>
      </div>

      {/* Code Editor Preview Window */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden font-mono text-xs">
        <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/60 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/60 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/60 inline-block" />
            <span className="text-[11px] text-slate-400 ml-2 font-sans font-medium">
              solution.tsx
            </span>
          </div>

          <Button size="sm" variant="outline" className="text-[11px] py-0.5 px-2 h-7 gap-1">
            <Copy className="w-3 h-3" /> Copy Snippet
          </Button>
        </div>

        <div className="p-4 text-emerald-400 overflow-x-auto max-h-64 leading-relaxed whitespace-pre-wrap">
          {submission.codeSnippet ||
            `export function optimizeCache<T>(keys: string[], fetcher: (k: string) => Promise<T>): Promise<Map<string, T>> {
  const cache = new Map<string, T>();
  return Promise.all(
    keys.map(async (key) => {
      const value = await fetcher(key);
      cache.set(key, value);
    })
  ).then(() => cache);
}`}
        </div>
      </div>

      {/* Automated CI/CD Test Results */}
      <div className="bg-slate-800/60 border border-slate-700/50 p-3.5 rounded-xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300 font-medium">Automated Runner: Jest & ESLint Validations</span>
        </div>
        <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> 0 Errors • 0 Lints
        </span>
      </div>
    </div>
  );
};
