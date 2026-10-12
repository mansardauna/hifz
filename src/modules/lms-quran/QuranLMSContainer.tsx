import React, { useState } from 'react';
import { QuranViewer } from '../../components/lms/QuranViewer';
import { AudioRecitationPlayer } from '../../components/lms/AudioRecitationPlayer';
import { StudentProgress } from '../../components/lms/StudentProgress';
import { Ayah, Surah } from '../../types';
import { MOCK_SURAHS } from '../../services/mockData';
import { ToastMessage } from '../../components/ui/Toast';
import { BookOpen, Volume2, Sparkles, Award } from 'lucide-react';
import { Card, Badge } from '../../components/ui';

interface QuranLMSContainerProps {
  activeSubTab?: 'quran' | 'audio' | 'progress';
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const QuranLMSContainer: React.FC<QuranLMSContainerProps> = ({
  activeSubTab = 'quran',
  onAddToast
}) => {
  const [subTab, setSubTab] = useState<'quran' | 'audio' | 'progress'>(activeSubTab);
  const [selectedSurah, setSelectedSurah] = useState<Surah>(MOCK_SURAHS[0]);
  const [selectedAyah, setSelectedAyah] = useState<Ayah | null>(MOCK_SURAHS[0]?.ayahs?.[0] || null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handleSelectAyah = (ayah: Ayah) => {
    setSelectedAyah(ayah);
  };

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      {/* Top Navigation Subtab Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">Quranic Curriculum & Mushaf Studio</h3>
            <p className="text-xs text-slate-400">Interactive Medina Mushaf with verse recitation, audio looping, and milestones.</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setSubTab('quran')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'quran'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Mushaf & Reading
          </button>
          <button
            type="button"
            onClick={() => setSubTab('audio')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'audio'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            Audio Recitation & Looping
          </button>
          <button
            type="button"
            onClick={() => setSubTab('progress')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'progress'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Milestones
          </button>
        </div>
      </div>

      {/* Active SubTab 1: Quran Mushaf Viewer */}
      {subTab === 'quran' && (
        <div className="space-y-6">
          {/* Quick Surah Switcher Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <h4 className="font-extrabold text-xs text-white">Current Recitation Surah</h4>
                <p className="text-xs text-slate-400 font-arabic">
                  {selectedSurah.nameAr} • {selectedSurah.englishTranslation} ({selectedSurah.numberOfAyahs} Ayahs)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {MOCK_SURAHS.map((s) => (
                <button
                  key={s.number}
                  type="button"
                  onClick={() => {
                    setSelectedSurah(s);
                    setSelectedAyah(s.ayahs[0] || null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedSurah.number === s.number
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {s.nameAr}
                </button>
              ))}
            </div>
          </div>

          <QuranViewer
            activeAyahNumber={selectedAyah?.number || null}
            onSelectAyah={handleSelectAyah}
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
          />
        </div>
      )}

      {/* Active SubTab 2: Audio Looping & Recitation Player */}
      {subTab === 'audio' && (
        <div className="space-y-6 max-w-5xl mx-auto">
          <AudioRecitationPlayer
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            currentAyah={selectedAyah}
            onAddToast={onAddToast}
          />
        </div>
      )}

      {/* Active SubTab 3: Student Progress Milestones */}
      {subTab === 'progress' && (
        <div className="space-y-6 max-w-5xl mx-auto">
          <StudentProgress onAddToast={onAddToast} />
        </div>
      )}
    </div>
  );
};
