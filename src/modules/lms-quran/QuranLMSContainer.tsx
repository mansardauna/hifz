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
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Active Tab View */}
      {activeSubTab === 'quran' && (
        <div className="space-y-6">
          {/* Quick Surah Switcher Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-white">Current Recitation Surah</h4>
                <p className="text-[11px] text-slate-400 font-arabic">
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
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
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

      {activeSubTab === 'audio' && (
        <div className="space-y-6 max-w-5xl mx-auto">
          <AudioRecitationPlayer
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            currentAyah={selectedAyah}
            onAddToast={onAddToast}
          />
        </div>
      )}

      {activeSubTab === 'progress' && (
        <div className="space-y-6 max-w-5xl mx-auto">
          <StudentProgress onAddToast={onAddToast} />
        </div>
      )}
    </div>
  );
};
