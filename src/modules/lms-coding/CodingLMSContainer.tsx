import React, { useState } from 'react';
import { DEFAULT_CODING_TRACKS } from './mockCodingData';
import { CodingTrack, CodingChallenge } from './types';
import { CodingChallengeRunner } from './components/CodingChallengeRunner';
import { CodingSyllabusManager } from './components/CodingSyllabusManager';
import { Code2, Settings, Terminal, Sparkles, BookOpen, Layers } from 'lucide-react';
import { ToastMessage } from '../../components/ui/Toast';

interface CodingLMSContainerProps {
  activeSubTab?: 'coding' | 'challenges' | 'projects' | 'syllabus';
  onAddToast?: (toast: Omit<ToastMessage, 'id'>) => void;
  userRole?: 'student' | 'teacher' | 'admin' | 'superadmin';
}

export const CodingLMSContainer: React.FC<CodingLMSContainerProps> = ({
  userRole = 'student',
}) => {
  const [tracks, setTracks] = useState<CodingTrack[]>(DEFAULT_CODING_TRACKS);
  const [viewMode, setViewMode] = useState<'learn' | 'manage'>('learn');

  // Active Challenge Selection
  const [activeChallengeIndex, setActiveChallengeIndex] = useState<number>(0);
  const allChallenges = tracks[0]?.modules[0]?.challenges || [];
  const currentChallenge = allChallenges[activeChallengeIndex] || allChallenges[0];

  const handleNextChallenge = () => {
    if (activeChallengeIndex < allChallenges.length - 1) {
      setActiveChallengeIndex(activeChallengeIndex + 1);
    }
  };

  const handlePreviousChallenge = () => {
    if (activeChallengeIndex > 0) {
      setActiveChallengeIndex(activeChallengeIndex - 1);
    }
  };

  const handlePreviewFromManager = (challenge: CodingChallenge) => {
    const foundIdx = allChallenges.findIndex((c) => c.id === challenge.id);
    if (foundIdx !== -1) {
      setActiveChallengeIndex(foundIdx);
    }
    setViewMode('learn');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* View Switcher Toolbar */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('learn')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              viewMode === 'learn'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Interactive Coding IDE (FreeCodeCamp Style)</span>
          </button>

          <button
            onClick={() => setViewMode('manage')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              viewMode === 'manage'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Teacher Syllabus & Test Suite Creator</span>
          </button>
        </div>

        <div className="text-xs font-bold text-slate-500 hidden sm:block">
          Track: <strong className="text-slate-900">{tracks[0]?.title}</strong>
        </div>
      </div>

      {/* Main Mode Rendering */}
      {viewMode === 'learn' && currentChallenge ? (
        <div className="h-[750px]">
          <CodingChallengeRunner
            challenge={currentChallenge}
            onNext={handleNextChallenge}
            onPrevious={handlePreviousChallenge}
            hasNext={activeChallengeIndex < allChallenges.length - 1}
            hasPrevious={activeChallengeIndex > 0}
          />
        </div>
      ) : (
        <CodingSyllabusManager
          tracks={tracks}
          onSaveTracks={(updated) => setTracks(updated)}
          onPreviewChallenge={handlePreviewFromManager}
        />
      )}
    </div>
  );
};
