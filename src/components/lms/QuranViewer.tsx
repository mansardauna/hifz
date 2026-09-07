import React, { useState, useEffect, useRef } from 'react';
import { Ayah } from '../../types';
import { MOCK_SURAHS } from '../../services/mockData';
import { fetchLiveSurah, fetchAllSurahsList, LiveSurah, RECITERS } from '../../services/quranApi';
import { useTenant } from '../../context/TenantContext';
import { api } from '../../services/api';
import { ToastMessage } from '../ui/Toast';
import {
  Play,
  Pause,
  BookOpen,
  Eye,
  EyeOff,
  Volume2,
  Loader2,
  Repeat,
  Mic,
  Square,
  UploadCloud,
  Sliders,
  ChevronRight,
  ChevronLeft,
  Trash2,
  PanelRightClose,
  PanelRightOpen,
  Activity,
  Layers
} from 'lucide-react';

interface QuranViewerProps {
  activeAyahNumber?: number | null;
  onSelectAyah?: (ayah: Ayah) => void;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  onAddToast?: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const QuranViewer: React.FC<QuranViewerProps> = ({
  activeAyahNumber,
  onSelectAyah,
  isPlaying: externalIsPlaying,
  onTogglePlay: externalTogglePlay,
  onAddToast,
}) => {
  const { language } = useTenant();
  const [surahList, setSurahList] = useState<{ number: number; name: string; englishName: string; numberOfAyahs: number }[]>([]);
  const [activeSurahNumber, setActiveSurahNumber] = useState<number>(67); // Default to Surah Al-Mulk (67)
  const [currentSurahData, setCurrentSurahData] = useState<LiveSurah | null>(null);
  const [selectedReciter, setSelectedReciter] = useState<string>('ar.alafasy');
  const [isLoadingSurah, setIsLoadingSurah] = useState<boolean>(false);
  const [showTranslation, setShowTranslation] = useState<boolean>(true);
  const [fontSizePx, setFontSizePx] = useState<number>(26);
  const [isAudioDockOpen, setIsAudioDockOpen] = useState<boolean>(true);

  // Audio Playback & Looping State
  const [playingAyahIndex, setPlayingAyahIndex] = useState<number | null>(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [loopCount, setLoopCount] = useState<number>(1);
  const [currentLoopIteration, setCurrentLoopIteration] = useState<number>(1);
  const [continuousPlay, setContinuousPlay] = useState<boolean>(true);

  // Student Mic Recording State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState<boolean>(false);
  const [isSubmittingHomework, setIsSubmittingHomework] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recordedAudioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  const isAr = language === 'ar';

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
          setPlayingAyahIndex(0);
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

  // Sync playback speed to audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  const activeAyah = currentSurahData?.ayahs[playingAyahIndex ?? 0] || null;

  // Handle Playback for a specific Ayah index
  const handlePlayAyahAudio = (index: number, audioUrl?: string) => {
    if (!audioUrl) return;

    if (playingAyahIndex === index && isAudioPlaying) {
      audioRef.current?.pause();
      setIsAudioPlaying(false);
      return;
    }

    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.play().catch((err) => console.warn('Audio play prevented:', err));
      setPlayingAyahIndex(index);
      setIsAudioPlaying(true);
      setCurrentLoopIteration(1);

      if (currentSurahData && onSelectAyah) {
        const item = currentSurahData.ayahs[index];
        onSelectAyah({
          number: item.number,
          numberInSurah: item.numberInSurah,
          text: item.text,
          audioUrl: item.audioUrl || '',
          translationEn: item.translation || '',
        });
      }
    }
  };

  const handleToggleCurrentAudio = () => {
    if (!activeAyah) return;
    if (isAudioPlaying) {
      audioRef.current?.pause();
      setIsAudioPlaying(false);
    } else {
      if (activeAyah.audioUrl) {
        handlePlayAyahAudio(playingAyahIndex ?? 0, activeAyah.audioUrl);
      }
    }
  };

  const handleNextAyah = () => {
    if (!currentSurahData || playingAyahIndex === null) return;
    if (playingAyahIndex + 1 < currentSurahData.ayahs.length) {
      const nextIdx = playingAyahIndex + 1;
      const nextItem = currentSurahData.ayahs[nextIdx];
      if (nextItem.audioUrl) {
        handlePlayAyahAudio(nextIdx, nextItem.audioUrl);
      }
    }
  };

  const handlePreviousAyah = () => {
    if (!currentSurahData || playingAyahIndex === null) return;
    if (playingAyahIndex > 0) {
      const prevIdx = playingAyahIndex - 1;
      const prevItem = currentSurahData.ayahs[prevIdx];
      if (prevItem.audioUrl) {
        handlePlayAyahAudio(prevIdx, prevItem.audioUrl);
      }
    }
  };

  // Handle Loop & Continuous Auto-play on verse end
  const handleAudioEnded = () => {
    // 1. Check if we should repeat current verse (Ayah looper)
    if (currentLoopIteration < loopCount) {
      setCurrentLoopIteration((prev) => prev + 1);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((e) => console.warn(e));
      }
      return;
    }

    // 2. Reset iteration count for next verse
    setCurrentLoopIteration(1);

    // 3. If continuous play is on, advance to next verse
    if (continuousPlay && currentSurahData && playingAyahIndex !== null && playingAyahIndex + 1 < currentSurahData.ayahs.length) {
      const nextIndex = playingAyahIndex + 1;
      const nextAyah = currentSurahData.ayahs[nextIndex];
      if (nextAyah.audioUrl) {
        handlePlayAyahAudio(nextIndex, nextAyah.audioUrl);
      }
    } else {
      setIsAudioPlaying(false);
    }
  };

  // Student Microphone Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      if (onAddToast) {
        onAddToast({
          type: 'error',
          title: isAr ? 'تعذر فتح الميكروفون' : 'Microphone Access Denied',
          message: isAr ? 'الرجاء السماح بالوصول للميكروفون لتسجيل التلاوة' : 'Please allow microphone permissions in your browser.',
        });
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
      setIsRecording(false);
      clearInterval(timerIntervalRef.current);
    }
  };

  const deleteRecordedAudio = () => {
    if (recordedAudioPlayerRef.current) {
      recordedAudioPlayerRef.current.pause();
    }
    setRecordedAudioUrl(null);
    setRecordingSeconds(0);
    setIsPlayingRecorded(false);
  };

  const togglePlayRecordedAudio = () => {
    if (!recordedAudioUrl || !recordedAudioPlayerRef.current) return;
    if (isPlayingRecorded) {
      recordedAudioPlayerRef.current.pause();
      setIsPlayingRecorded(false);
    } else {
      recordedAudioPlayerRef.current.src = recordedAudioUrl;
      recordedAudioPlayerRef.current.play();
      setIsPlayingRecorded(true);
    }
  };

  const handleSubmitHomework = async () => {
    if (!recordedAudioUrl) return;
    setIsSubmittingHomework(true);
    try {
      await api.uploadRecitationAudio({
        studentId: 'std-current',
        studentName: 'Active Student',
        surahName: currentSurahData?.name || `Surah ${activeSurahNumber}`,
        ayahRange: activeAyah ? `Ayah ${activeAyah.numberInSurah}` : 'Ayah 1-5',
        audioUrl: recordedAudioUrl,
        durationSeconds: recordingSeconds,
      });

      if (onAddToast) {
        onAddToast({
          type: 'success',
          title: isAr ? 'تم تسليم التلاوة بنجاح!' : 'Recitation Submitted!',
          message: isAr ? 'تم إرسال تسجيلك الصوتي للشيخ للتقييم والتصحيح' : 'Your recitation was sent to your Ustaz for oral evaluation.',
        });
      }
      deleteRecordedAudio();
    } catch (e) {
      if (onAddToast) {
        onAddToast({
          type: 'error',
          title: 'Submission Error',
          message: 'Could not upload recitation file. Please try again.',
        });
      }
    } finally {
      setIsSubmittingHomework(false);
    }
  };

  return (
    <div className="bg-amber-50/40 rounded-3xl border border-amber-900/10 shadow-xl overflow-hidden font-sans">
      {/* Hidden Audio Elements */}
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        onPause={() => setIsAudioPlaying(false)}
        onPlay={() => setIsAudioPlaying(true)}
      />
      <audio
        ref={recordedAudioPlayerRef}
        onEnded={() => setIsPlayingRecorded(false)}
      />

      {/* Top Header Bar */}
      <div className="bg-white/95 backdrop-blur-md px-4 py-3 sm:px-6 sm:py-3.5 border-b border-amber-900/10 flex flex-wrap items-center justify-between gap-3">
        {/* Surah Selector & Metadata */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-600/10 text-amber-900 flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <select
              value={activeSurahNumber}
              onChange={(e) => {
                setActiveSurahNumber(Number(e.target.value));
                setPlayingAyahIndex(0);
                setIsAudioPlaying(false);
              }}
              className="bg-amber-50/80 text-amber-950 font-bold text-xs sm:text-sm px-3 py-1.5 rounded-xl border border-amber-900/20 focus:outline-none focus:ring-2 focus:ring-amber-600/30 cursor-pointer"
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
          </div>

          <span className="text-xs text-amber-800/70 hidden md:inline font-medium">
            {currentSurahData?.numberOfAyahs || 0} Verses • {currentSurahData?.englishNameTranslation || ''}
          </span>
        </div>

        {/* View Controls & Right-Dock Audio Toggle */}
        <div className="flex items-center gap-2">
          {/* Translation Toggle */}
          <button
            type="button"
            onClick={() => setShowTranslation(!showTranslation)}
            className="px-2.5 py-1.5 rounded-xl bg-white text-amber-900 border border-amber-900/20 text-xs font-bold hover:bg-amber-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            {showTranslation ? <Eye className="w-3.5 h-3.5 text-amber-700" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
            <span className="hidden sm:inline">{showTranslation ? 'Translation On' : 'Translation Off'}</span>
          </button>

          {/* Font Resizer */}
          <div className="flex items-center bg-white border border-amber-900/20 rounded-xl overflow-hidden text-xs shadow-2xs">
            <button
              type="button"
              onClick={() => setFontSizePx((prev) => Math.max(18, prev - 2))}
              className="px-2 py-1 hover:bg-amber-50 text-amber-900 font-bold border-r border-amber-900/10 cursor-pointer"
              title="Decrease Arabic font size"
            >
              A-
            </button>
            <span className="px-2 text-amber-950 font-mono text-[11px] font-bold">{fontSizePx}px</span>
            <button
              type="button"
              onClick={() => setFontSizePx((prev) => Math.min(44, prev + 2))}
              className="px-2 py-1 hover:bg-amber-50 text-amber-900 font-bold cursor-pointer"
              title="Increase Arabic font size"
            >
              A+
            </button>
          </div>

          {/* Audio Tool Widget Toggle Button */}
          <button
            type="button"
            onClick={() => setIsAudioDockOpen(!isAudioDockOpen)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
              isAudioDockOpen
                ? 'bg-amber-900 text-white shadow-amber-950/20'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
            title="Toggle Right-Side Audio & Looper Toolbox"
          >
            {isAudioDockOpen ? <PanelRightClose className="w-3.5 h-3.5" /> : <PanelRightOpen className="w-3.5 h-3.5" />}
            <span>{isAudioDockOpen ? 'Hide Audio Dock' : 'Audio Tools 🎙️'}</span>
          </button>
        </div>
      </div>

      {/* Main Container: Split View (Mushaf Verses Stream on Left/Center, Audio Toolbox Docked on Right) */}
      <div className="flex flex-col lg:flex-row items-start gap-0 lg:gap-6 p-4 sm:p-6">
        {/* Left/Center: Medina Mushaf Stream */}
        <div className="flex-1 min-w-0 w-full space-y-5">
          {/* Surah Name Banner */}
          <div className="p-6 text-center bg-gradient-to-b from-amber-100/60 to-transparent rounded-2xl border border-amber-900/10">
            <h2 className="text-3xl sm:text-4xl font-black font-serif text-amber-950 tracking-wide">
              {currentSurahData?.name || 'سورة'}
            </h2>
            <p className="text-xs text-amber-800 font-sans mt-1.5 font-medium">
              {currentSurahData?.englishName} ({currentSurahData?.englishNameTranslation}) • Revelation: {currentSurahData?.revelationType || 'Meccan'}
            </p>

            {activeSurahNumber !== 9 && (
              <div className="mt-4 text-2xl sm:text-3xl font-serif text-amber-950/90 select-none tracking-wider">
                بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
              </div>
            )}
          </div>

          {/* Verses Stream */}
          <div className="space-y-4">
            {isLoadingSurah ? (
              <div className="p-16 text-center text-amber-900 flex flex-col items-center justify-center gap-3 bg-white/60 rounded-2xl border border-amber-900/10">
                <Loader2 className="w-8 h-8 animate-spin text-amber-700" />
                <p className="text-xs font-bold text-amber-950">Streaming verified Uthmani text and studio reciter audio...</p>
              </div>
            ) : (
              currentSurahData?.ayahs.map((ayah, index) => {
                const isSelected = playingAyahIndex === index;
                const isPlayingThis = isSelected && isAudioPlaying;

                return (
                  <div
                    key={ayah.number}
                    onClick={() => {
                      setPlayingAyahIndex(index);
                      if (onSelectAyah) {
                        onSelectAyah({
                          number: ayah.number,
                          numberInSurah: ayah.numberInSurah,
                          text: ayah.text,
                          audioUrl: ayah.audioUrl || '',
                          translationEn: ayah.translation || '',
                        });
                      }
                    }}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                      isPlayingThis
                        ? 'bg-amber-100/90 border-amber-500 shadow-md ring-2 ring-amber-500/40'
                        : isSelected
                        ? 'bg-white border-amber-300 shadow-sm'
                        : 'bg-white/80 border-amber-900/10 hover:border-amber-900/30 hover:bg-white shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-3 border-b border-amber-900/5 pb-2.5">
                      {/* Verse Number Indicator */}
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-amber-950 text-amber-50 font-mono text-xs font-black flex items-center justify-center shadow-xs">
                          {ayah.numberInSurah}
                        </span>
                        {isPlayingThis && (
                          <span className="flex items-center gap-1.5 text-[11px] font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full animate-pulse">
                            <Activity className="w-3 h-3 text-amber-700 animate-spin" />
                            Reciting Ayah {ayah.numberInSurah}
                          </span>
                        )}
                      </div>

                      {/* Verse Audio Action Button */}
                      {ayah.audioUrl && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayAyahAudio(index, ayah.audioUrl);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                            isPlayingThis
                              ? 'bg-amber-900 text-white'
                              : 'bg-amber-100 text-amber-950 hover:bg-amber-200'
                          }`}
                        >
                          {isPlayingThis ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                          <span className="text-[11px]">{isPlayingThis ? 'Pause' : 'Listen'}</span>
                        </button>
                      )}
                    </div>

                    {/* Arabic Verse Text */}
                    <p
                      dir="rtl"
                      className="text-right text-slate-900 font-serif leading-[2.3] tracking-wide select-text py-1"
                      style={{ fontSize: `${fontSizePx}px` }}
                    >
                      {ayah.text}
                    </p>

                    {/* English Translation */}
                    {showTranslation && ayah.translation && (
                      <p className="text-left text-xs sm:text-sm text-slate-600 font-sans mt-3 pt-3 border-t border-amber-900/10 leading-relaxed font-medium" dir="ltr">
                        <span className="font-bold text-amber-950 mr-1.5">[{ayah.numberInSurah}]</span>
                        {ayah.translation}
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Dock: Audio Looper & Reciter Toolbox (Docked to the right of Mushaf) */}
        {isAudioDockOpen && (
          <aside className="w-full lg:w-84 shrink-0 mt-6 lg:mt-0 space-y-4">
            <div className="sticky top-4 bg-slate-900 text-white rounded-3xl p-5 shadow-2xl border border-slate-800 space-y-5">
              {/* Header Title */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-white tracking-wide">Mushaf Audio Toolbox</h3>
                    <p className="text-[10px] text-slate-400">Docked Recitation & Looper Engine</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAudioDockOpen(false)}
                  className="text-slate-400 hover:text-white lg:hidden p-1"
                  title="Close sidebar dock"
                >
                  ✕
                </button>
              </div>

              {/* 1. Reciter Engine Selection */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300 block">Qari / Reciter Voice</label>
                <div className="relative">
                  <select
                    value={selectedReciter}
                    onChange={(e) => setSelectedReciter(e.target.value)}
                    className="w-full bg-slate-800 text-white text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer appearance-none"
                  >
                    {RECITERS.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.sub})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 2. Active Ayah Controls & Skip */}
              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Selected Verse:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    Ayah {activeAyah?.numberInSurah || 1} / {currentSurahData?.numberOfAyahs || 0}
                  </span>
                </div>

                {/* Primary Transport Controls */}
                <div className="flex items-center justify-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handlePreviousAyah}
                    disabled={!playingAyahIndex || playingAyahIndex <= 0}
                    className="w-9 h-9 rounded-full bg-slate-700 hover:bg-slate-600 disabled:opacity-30 flex items-center justify-center transition-colors cursor-pointer text-slate-200"
                    title="Previous Ayah"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleCurrentAudio}
                    className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center transition-all shadow-lg shadow-emerald-500/30 cursor-pointer font-bold"
                    title={isAudioPlaying ? 'Pause' : 'Play'}
                  >
                    {isAudioPlaying ? (
                      <Pause className="w-5 h-5 fill-current" />
                    ) : (
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleNextAyah}
                    disabled={!currentSurahData || playingAyahIndex === null || playingAyahIndex >= currentSurahData.ayahs.length - 1}
                    className="w-9 h-9 rounded-full bg-slate-700 hover:bg-slate-600 disabled:opacity-30 flex items-center justify-center transition-colors cursor-pointer text-slate-200"
                    title="Next Ayah"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 3. Ayah Looper (Hifz Memorization Repeater) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-bold flex items-center gap-1.5">
                    <Repeat className="w-3.5 h-3.5 text-emerald-400" />
                    Hifz Ayah Looper:
                  </span>
                  {loopCount > 1 && (
                    <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                      Pass {currentLoopIteration} of {loopCount}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-1.5">
                  {[1, 3, 5, 10].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => {
                        setLoopCount(count);
                        setCurrentLoopIteration(1);
                      }}
                      className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        loopCount === count
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {count === 1 ? '1x (Off)' : `${count}x`}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Playback Speed & Autoplay Switches */}
              <div className="space-y-2 pt-1 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-bold flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                    Speed:
                  </span>
                  <div className="flex items-center gap-1">
                    {[0.75, 1.0, 1.25, 1.5].map((speed) => (
                      <button
                        key={speed}
                        type="button"
                        onClick={() => setPlaybackSpeed(speed)}
                        className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-all cursor-pointer ${
                          playbackSpeed === speed
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-300 font-medium">Continuous Autoplay:</span>
                  <button
                    type="button"
                    onClick={() => setContinuousPlay(!continuousPlay)}
                    className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                      continuousPlay ? 'bg-emerald-600' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.75 transition-all ${
                        continuousPlay ? 'left-4.5' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* 5. Student Oral Recitation Homework Mic Recorder */}
              <div className="bg-slate-800/90 p-3.5 rounded-2xl border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-rose-400" />
                    Oral Homework Recorder
                  </span>
                  {recordedAudioUrl && (
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      {recordingSeconds}s
                    </span>
                  )}
                </div>

                {/* Recorder States */}
                {isRecording ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-rose-400 font-bold bg-rose-950/40 p-2 rounded-xl border border-rose-900/50">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                        <span>Recording...</span>
                      </div>
                      <span className="font-mono">{recordingSeconds}s</span>
                    </div>

                    <button
                      type="button"
                      onClick={stopRecording}
                      className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
                      Stop Recording
                    </button>
                  </div>
                ) : recordedAudioUrl ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-slate-900 p-2 rounded-xl border border-slate-700">
                      <button
                        type="button"
                        onClick={togglePlayRecordedAudio}
                        className="flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer"
                      >
                        {isPlayingRecorded ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        <span>{isPlayingRecorded ? 'Pause Recitation' : 'Preview Oral Recording'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={deleteRecordedAudio}
                        className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                        title="Delete recording"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleSubmitHomework}
                      disabled={isSubmittingHomework}
                      className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
                    >
                      {isSubmittingHomework ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <UploadCloud className="w-3.5 h-3.5" />
                      )}
                      <span>Submit to Sheikh for Correction</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={startRecording}
                    className="w-full py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-600"
                  >
                    <Mic className="w-3.5 h-3.5 text-rose-400" />
                    Record Your Recitation
                  </button>
                )}
              </div>

              {/* 6. Tajweed Legend Mini-Card */}
              <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-800 text-[10px] space-y-1.5">
                <span className="font-bold text-slate-300 block flex items-center gap-1">
                  <Layers className="w-3 h-3 text-amber-400" />
                  Tajweed Color Reference:
                </span>
                <div className="grid grid-cols-2 gap-1.5 text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Ghunnah (2H)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>Qalqalah</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-400" />
                    <span>Ikhfaa</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>Madd (4-6H)</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
