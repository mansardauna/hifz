import React, { useState } from 'react';
import { QuranViewer } from '../../components/lms/QuranViewer';
import { AudioRecitationPlayer } from '../../components/lms/AudioRecitationPlayer';
import { MOCK_SURAHS } from '../../services/mockData';
import { Surah, Ayah } from '../../types';
import { BookOpen } from 'lucide-react';

export const QuranLMSWorkspace: React.FC = () => {
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
    <div className="space-y-6">
      {/* Surah Switcher */}
      <div className="flex items-center justify-between bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-white">Active Recitation Surah</h4>
            <p className="text-[11px] text-slate-400">{selectedSurah.nameAr} • {selectedSurah.englishTranslation}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {MOCK_SURAHS.map((s) => (
            <button
              key={s.number}
              onClick={() => {
                setSelectedSurah(s);
                setSelectedAyah(s.ayahs[0] || null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
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

      {/* Main Quran Viewer */}
      <QuranViewer
        activeAyahNumber={selectedAyah?.number || null}
        onSelectAyah={handleSelectAyah}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
      />

      {/* Audio Recitation Player & Looper */}
      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <AudioRecitationPlayer
          currentAyah={selectedAyah}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          onAddToast={(toast) => console.log('Audio Player Toast:', toast)}
        />
      </div>
    </div>
  );
};
