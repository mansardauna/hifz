import React, { useState, useEffect, useRef } from 'react';
import { Ayah } from '../../types';
import { MOCK_SURAHS } from '../../services/mockData';
import { fetchLiveSurah, fetchAllSurahsList, LiveSurah, RECITERS } from '../../services/quranApi';
import { useTenant } from '../../context/TenantContext';
import { Play, Pause, BookOpen, Eye, EyeOff, Volume2, Sparkles, Loader2, Music } from 'lucide-react';

interface QuranViewerProps {
  activeAyahNumber: number | null;
  onSelectAyah: (ayah: Ayah) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const QuranViewer: React.FC<QuranViewerProps> = ({
  activeAyahNumber,
  onSelectAyah,
}) => {
  const { language } = useTenant();
  const [surahList, setSurahList] = useState<{ number: number; name: string; englishName: string; numberOfAyahs: number }[]>([]);
  const [activeSurahNumber, setActiveSurahNumber] = useState<number>(67); // Default to Surah Al-Mulk (67)
  const [currentSurahData, setCurrentSurahData] = useState<LiveSurah | null>(null);
  const [selectedReciter, setSelectedReciter] = useState<string>('ar.alafasy');
  const [isLoadingSurah, setIsLoadingSurah] = useState<boolean>(false);
  const [showTranslation, setShowTranslation] = useState<boolean>(true);
  const [fontSizePx, setFontSizePx] = useState<number>(26);

  // Audio player state
  const [playingAyahIndex, setPlayingAyahIndex] = useState<number | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 1. Fetch Surah List on Mount
  useEffect(() => {
    async function loadList() {
      const list = await fetchAllSurahsList();
      if (list.length > 0) {
        setSurahList(list);
      } else {
        setSurahList(
          MOCK_SURAHS.map((s) => ({
            number: s.number,
            name: s.nameAr,
            englishName: s.englishTranslation,
            numberOfAyahs: s.numberOfAyahs,
          }))
        );
      }
    }
    loadList();
  }, []);

  // 2. Fetch Active Surah Data with reciter audio
  useEffect(() => {
    let isMounted = true;
    async function loadSurah() {
      setIsLoadingSurah(true);
      const data = await fetchLiveSurah(activeSurahNumber, selectedReciter);
      if (isMounted) {
        if (data) {
          setCurrentSurahData(data);
        }
        setIsLoadingSurah(false);
      }
    }
    loadSurah();

    return () => {
      isMounted = false;
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [activeSurahNumber, selectedReciter]);

  const handlePlayAyahAudio = (index: number, audioUrl?: string) => {
    if (!audioUrl) return;

    if (playingAyahIndex === index && isAudioPlaying) {
      audioRef.current?.pause();
      setIsAudioPlaying(false);
      return;
    }

    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      setPlayingAyahIndex(index);
      setIsAudioPlaying(true);
    }
  };

  const handleAudioEnded = () => {
    if (currentSurahData && playingAyahIndex !== null && playingAyahIndex + 1 < currentSurahData.ayahs.length) {
      const nextIndex = playingAyahIndex + 1;
      const nextAyah = currentSurahData.ayahs[nextIndex];
      if (nextAyah.audioUrl) {
        handlePlayAyahAudio(nextIndex, nextAyah.audioUrl);
      }
    } else {
      setIsAudioPlaying(false);
      setPlayingAyahIndex(null);
    }
  };

  return (
    <div className="bg-amber-50/40 rounded-xl border border-amber-900/10 shadow-md overflow-hidden font-sans" dir="rtl">
      {/* Hidden Global Audio Element */}
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        onPause={() => setIsAudioPlaying(false)}
        onPlay={() => setIsAudioPlaying(true)}
      />

      {/* Quran Reader Top Control Bar */}
      <div className="bg-white/95 backdrop-blur-md p-3 sm:p-4 border-b border-amber-900/10 flex flex-wrap items-center justify-between gap-3">
        {/* Surah Selector */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <select
            value={activeSurahNumber}
            onChange={(e) => {
              setActiveSurahNumber(Number(e.target.value));
              setPlayingAyahIndex(null);
              setIsAudioPlaying(false);
            }}
            className="bg-amber-50 text-amber-950 font-bold text-xs sm:text-sm px-3 py-1.5 rounded-lg border border-amber-900/20 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            {surahList.length > 0
              ? surahList.map((s) => (
                  <option key={s.number} value={s.number}>
                    {s.number}. {s.name} ({s.englishName})
                  </option>
                ))
              : MOCK_SURAHS.map((s) => (
                  <option key={s.number} value={s.number}>
                    {s.number}. سورة {s.nameAr}
                  </option>
                ))}
          </select>

          {/* Reciter Selector */}
          <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-900/20 text-xs">
            <Volume2 className="w-3.5 h-3.5 text-amber-800" />
            <select
              value={selectedReciter}
              onChange={(e) => setSelectedReciter(e.target.value)}
              className="bg-transparent text-amber-950 text-xs font-semibold focus:outline-none cursor-pointer"
            >
              {RECITERS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.sub} ({r.name})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Display Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Translation Toggle */}
          <button
            type="button"
            onClick={() => setShowTranslation(!showTranslation)}
            className="px-2.5 py-1.5 rounded-lg bg-white text-amber-900 border border-amber-900/20 text-xs font-semibold hover:bg-amber-50 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {showTranslation ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
            <span>{showTranslation ? 'English Translation' : 'Hide Translation'}</span>
          </button>

          {/* Font Resizer */}
          <div className="flex items-center bg-white border border-amber-900/20 rounded-lg overflow-hidden text-xs">
            <button
              type="button"
              onClick={() => setFontSizePx((prev) => Math.max(18, prev - 2))}
              className="px-2 py-1 hover:bg-amber-50 text-amber-900 font-bold border-l border-amber-900/10 cursor-pointer"
            >
              A-
            </button>
            <span className="px-2 text-amber-900 font-mono text-[11px]">{fontSizePx}px</span>
            <button
              type="button"
              onClick={() => setFontSizePx((prev) => Math.min(40, prev + 2))}
              className="px-2 py-1 hover:bg-amber-50 text-amber-900 font-bold cursor-pointer"
            >
              A+
            </button>
          </div>
        </div>
      </div>

      {/* Surah Header Banner */}
      <div className="p-6 text-center bg-gradient-to-b from-amber-100/50 to-transparent border-b border-amber-900/5">
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-amber-950">
          {currentSurahData?.name || 'سورة'}
        </h2>
        <p className="text-xs text-amber-800 font-sans mt-1">
          {currentSurahData?.englishName} ({currentSurahData?.englishNameTranslation}) • {currentSurahData?.numberOfAyahs} Verses
        </p>

        {activeSurahNumber !== 9 && (
          <div className="mt-4 text-xl sm:text-2xl font-serif text-amber-900/90 select-none">
            بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
          </div>
        )}
      </div>

      {/* Verses Stream */}
      <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
        {isLoadingSurah ? (
          <div className="p-12 text-center text-amber-900 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-amber-700" />
            <p className="text-xs font-semibold">Streaming authentic Uthmani verses & audio...</p>
          </div>
        ) : (
          currentSurahData?.ayahs.map((ayah, index) => {
            const isPlayingThis = playingAyahIndex === index && isAudioPlaying;

            return (
              <div
                key={ayah.number}
                className={`p-4 sm:p-5 rounded-xl border transition-all ${
                  isPlayingThis
                    ? 'bg-amber-100/80 border-amber-500 shadow-md ring-2 ring-amber-500/30'
                    : 'bg-white/80 border-amber-900/10 hover:border-amber-900/30 hover:bg-white shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  {/* Verse Number Pill */}
                  <span className="w-7 h-7 rounded-full bg-amber-900/10 text-amber-950 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    {ayah.numberInSurah}
                  </span>

                  {/* Audio Play Trigger */}
                  {ayah.audioUrl && (
                    <button
                      type="button"
                      onClick={() => handlePlayAyahAudio(index, ayah.audioUrl)}
                      className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isPlayingThis
                          ? 'bg-amber-900 text-white shadow-xs'
                          : 'bg-amber-100 text-amber-950 hover:bg-amber-200'
                      }`}
                      title="Play verse recitation"
                    >
                      {isPlayingThis ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span className="text-[11px] font-sans">{isPlayingThis ? 'Playing' : 'Listen'}</span>
                    </button>
                  )}
                </div>

                {/* Arabic Text */}
                <p
                  className="text-right text-slate-900 font-serif leading-[2.2] tracking-wide"
                  style={{ fontSize: `${fontSizePx}px` }}
                >
                  {ayah.text}
                </p>

                {/* English Sahih Translation */}
                {showTranslation && ayah.translation && (
                  <p className="text-left text-xs sm:text-sm text-slate-600 font-sans mt-3 pt-3 border-t border-amber-900/10 leading-relaxed" dir="ltr">
                    <span className="font-semibold text-amber-950 mr-1">[{ayah.numberInSurah}]</span>
                    {ayah.translation}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
