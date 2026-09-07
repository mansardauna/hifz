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
  Activity,
  Layers,
  Sparkles,
  CheckCircle2,
  X
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
  const [fontSizePx, setFontSizePx] = useState<number>(28);

  // Audio Playback & Looping State
  const [playingAyahIndex, setPlayingAyahIndex] = useState<number | null>(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [loopCount, setLoopCount] = useState<number>(1);
  const [currentLoopIteration, setCurrentLoopIteration] = useState<number>(1);
  const [continuousPlay, setContinuousPlay] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  // Modals
  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState<boolean>(false);
  const [isTajweedModalOpen, setIsTajweedModalOpen] = useState<boolean>(false);

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
      setIsRecordingModalOpen(false);
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
    <div className="bg-amber-50/30 rounded-3xl border border-amber-900/15 shadow-xl overflow-hidden font-sans relative pb-28">
      {/* Hidden Audio Elements */}
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        onPause={() => setIsAudioPlaying(false)}
        onPlay={() => setIsAudioPlaying(true)}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            setDuration(audioRef.current.duration || 0);
          }
        }}
      />
      <audio
        ref={recordedAudioPlayerRef}
        onEnded={() => setIsPlayingRecorded(false)}
      />

      {/* Top Header Bar */}
      <div className="bg-white/95 backdrop-blur-md px-4 py-3 sm:px-6 sm:py-4 border-b border-amber-900/10 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20 shadow-xs">
        {/* Surah Selector & Metadata */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-600/10 text-amber-900 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <select
              value={activeSurahNumber}
              onChange={(e) => {
                setActiveSurahNumber(Number(e.target.value));
                setPlayingAyahIndex(0);
                setIsAudioPlaying(false);
              }}
              className="bg-amber-50/80 text-amber-950 font-bold text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-amber-900/20 focus:outline-none focus:ring-2 focus:ring-amber-600/30 cursor-pointer"
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

          <span className="text-xs text-amber-900/70 hidden md:inline font-medium">
            {currentSurahData?.numberOfAyahs || 0} Verses • {currentSurahData?.englishNameTranslation || ''} • {currentSurahData?.revelationType || 'Meccan'}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Translation Toggle */}
          <button
            type="button"
            onClick={() => setShowTranslation(!showTranslation)}
            className="px-3 py-1.5 rounded-xl bg-white text-amber-900 border border-amber-900/20 text-xs font-bold hover:bg-amber-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            {showTranslation ? <Eye className="w-3.5 h-3.5 text-amber-700" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
            <span className="hidden sm:inline">{showTranslation ? 'Translation On' : 'Translation Off'}</span>
          </button>

          {/* Font Resizer */}
          <div className="flex items-center bg-white border border-amber-900/20 rounded-xl overflow-hidden text-xs shadow-2xs">
            <button
              type="button"
              onClick={() => setFontSizePx((prev) => Math.max(20, prev - 2))}
              className="px-2.5 py-1.5 hover:bg-amber-50 text-amber-900 font-bold border-r border-amber-900/10 cursor-pointer"
              title="Decrease Arabic font size"
            >
              A-
            </button>
            <span className="px-2.5 text-amber-950 font-mono text-[11px] font-bold">{fontSizePx}px</span>
            <button
              type="button"
              onClick={() => setFontSizePx((prev) => Math.min(50, prev + 2))}
              className="px-2.5 py-1.5 hover:bg-amber-50 text-amber-900 font-bold cursor-pointer"
              title="Increase Arabic font size"
            >
              A+
            </button>
          </div>

          {/* Tajweed Guide Button */}
          <button
            type="button"
            onClick={() => setIsTajweedModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-white text-amber-900 border border-amber-900/20 text-xs font-bold hover:bg-amber-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Layers className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline">Tajweed Rules</span>
          </button>

          {/* Record Homework Recitation Button */}
          <button
            type="button"
            onClick={() => setIsRecordingModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Record Oral Homework</span>
          </button>
        </div>
      </div>

      {/* Main Reading Flow (Full-Width Medina Mushaf Canvas) */}
      <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-6">
        {/* Medina Surah Header Medallion */}
        <div className="p-8 text-center bg-gradient-to-b from-amber-100/70 via-amber-50/40 to-transparent rounded-3xl border border-amber-900/15 shadow-sm relative overflow-hidden">
          <div className="absolute top-2 left-2 text-[10px] font-mono text-amber-800/60 font-bold uppercase tracking-wider">
            Surah No. {activeSurahNumber}
          </div>
          <div className="absolute top-2 right-2 text-[10px] font-mono text-amber-800/60 font-bold uppercase tracking-wider">
            {currentSurahData?.numberOfAyahs || 0} Verses
          </div>

          <h2 className="text-4xl sm:text-5xl font-black font-serif text-amber-950 tracking-wide mt-2">
            {currentSurahData?.name || 'سورة'}
          </h2>
          <p className="text-xs text-amber-800 font-sans mt-2 font-semibold">
            {currentSurahData?.englishName} • {currentSurahData?.englishNameTranslation}
          </p>

          {activeSurahNumber !== 9 && (
            <div className="mt-5 text-2xl sm:text-3xl font-serif text-amber-950/90 select-none tracking-widest">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
            </div>
          )}
        </div>

        {/* Verses Stream */}
        <div className="space-y-4">
          {isLoadingSurah ? (
            <div className="p-20 text-center text-amber-900 flex flex-col items-center justify-center gap-3 bg-white/70 rounded-3xl border border-amber-900/10">
              <Loader2 className="w-9 h-9 animate-spin text-amber-700" />
              <p className="text-sm font-bold text-amber-950">Streaming authenticated Uthmani verses and audio...</p>
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
                  className={`p-5 sm:p-6 rounded-3xl border transition-all cursor-pointer ${
                    isPlayingThis
                      ? 'bg-amber-100/90 border-amber-500 shadow-lg ring-2 ring-amber-500/40'
                      : isSelected
                      ? 'bg-white border-amber-300 shadow-sm'
                      : 'bg-white/85 border-amber-900/10 hover:border-amber-900/25 hover:bg-white shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-3 border-b border-amber-900/5 pb-2.5">
                    {/* Verse Number Indicator */}
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-amber-950 text-amber-50 font-mono text-xs font-black flex items-center justify-center shadow-xs">
                        {ayah.numberInSurah}
                      </span>
                      {isPlayingThis && (
                        <span className="flex items-center gap-1.5 text-[11px] font-bold text-amber-800 bg-amber-200/80 px-2.5 py-0.5 rounded-full animate-pulse">
                          <Activity className="w-3 h-3 text-amber-700 animate-spin" />
                          Reciting Verse {ayah.numberInSurah}
                        </span>
                      )}
                    </div>

                    {/* Verse Audio Trigger */}
                    {ayah.audioUrl && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayAyahAudio(index, ayah.audioUrl);
                        }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
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
                    className="text-right text-slate-900 font-serif leading-[2.4] tracking-wide select-text py-1"
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

      {/* Floating Bottom Audio Player (Sleek, Anchored, Never Squishes Text) */}
      <div className="fixed bottom-3 inset-x-3 sm:inset-x-6 max-w-5xl mx-auto bg-slate-950/95 backdrop-blur-xl text-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-slate-800 shadow-2xl z-30 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Active Verse Info & Track Scrubber */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">
            <Volume2 className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-black text-white truncate">
                {currentSurahData?.name} • Ayah {activeAyah?.numberInSurah || 1}
              </h4>
              {loopCount > 1 && (
                <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/90 px-2 py-0.2 rounded border border-emerald-800 shrink-0">
                  Pass {currentLoopIteration}/{loopCount}
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              {currentSurahData?.englishName} • {RECITERS.find((r) => r.id === selectedReciter)?.name || 'Sheikh Alafasy'}
            </div>
          </div>
        </div>

        {/* Center: Transport Playback Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handlePreviousAyah}
            disabled={!playingAyahIndex || playingAyahIndex <= 0}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 disabled:opacity-30 flex items-center justify-center transition-colors cursor-pointer text-slate-200"
            title="Previous Ayah"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleToggleCurrentAudio}
            className="w-11 h-11 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center transition-all shadow-lg shadow-emerald-500/30 cursor-pointer font-bold"
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
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 disabled:opacity-30 flex items-center justify-center transition-colors cursor-pointer text-slate-200"
            title="Next Ayah"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Reciter, Looper Chips & Speed */}
        <div className="flex flex-wrap items-center gap-2 justify-end w-full md:w-auto">
          {/* Reciter Selector */}
          <select
            value={selectedReciter}
            onChange={(e) => setSelectedReciter(e.target.value)}
            className="bg-slate-800 text-slate-200 text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            {RECITERS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          {/* Ayah Looper Selector */}
          <div className="flex items-center bg-slate-800/80 p-0.5 rounded-xl border border-slate-700">
            <span className="text-[10px] text-slate-400 px-1.5 font-bold">Loop:</span>
            {[1, 3, 5, 10].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => {
                  setLoopCount(count);
                  setCurrentLoopIteration(1);
                }}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer ${
                  loopCount === count
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {count === 1 ? '1x' : `${count}x`}
              </button>
            ))}
          </div>

          {/* Speed Selector */}
          <div className="flex items-center bg-slate-800/80 p-0.5 rounded-xl border border-slate-700">
            {[0.75, 1.0, 1.25].map((speed) => (
              <button
                key={speed}
                type="button"
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer ${
                  playbackSpeed === speed
                    ? 'bg-emerald-500 text-slate-950 font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Oral Homework Recording Modal */}
      {isRecordingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600/10 text-emerald-700 flex items-center justify-center font-bold">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Record Oral Recitation Homework</h3>
                  <p className="text-xs text-slate-500">Record your Tajweed recitation for {currentSurahData?.name || 'Surah'} to submit to your Sheikh.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRecordingModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Recorder Body */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  Target Verse: <strong className="text-emerald-700">{currentSurahData?.name} (Ayah {activeAyah?.numberInSurah || 1})</strong>
                </span>
                {recordedAudioUrl && (
                  <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-md">
                    {recordingSeconds}s recorded
                  </span>
                )}
              </div>

              {isRecording ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-rose-600 font-bold bg-rose-50 border border-rose-200 p-3 rounded-xl animate-pulse">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                      <span className="text-xs">Recording Live Recitation...</span>
                    </div>
                    <span className="font-mono text-sm">{recordingSeconds}s</span>
                  </div>

                  <button
                    type="button"
                    onClick={stopRecording}
                    className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                  >
                    <Square className="w-4 h-4 fill-current" />
                    Stop Recording
                  </button>
                </div>
              ) : recordedAudioUrl ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                    <button
                      type="button"
                      onClick={togglePlayRecordedAudio}
                      className="flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                    >
                      {isPlayingRecorded ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                      <span>{isPlayingRecorded ? 'Pause Recitation' : 'Preview Oral Recording'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={deleteRecordedAudio}
                      className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer flex items-center gap-1 text-xs font-bold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Re-record</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmitHomework}
                    disabled={isSubmittingHomework}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                  >
                    {isSubmittingHomework ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <UploadCloud className="w-4 h-4" />
                    )}
                    <span>Publish & Submit to Sheikh for Correction</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={startRecording}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                >
                  <Mic className="w-4 h-4" />
                  <span>Start Microphone Recording</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tajweed Rules Reference Modal */}
      {isTajweedModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-600/10 text-amber-900 flex items-center justify-center font-bold">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black text-slate-900">Tajweed Color Guide</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTajweedModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-emerald-900 block font-bold">Ghunnah (غنة) - 2 Harakat</strong>
                  <p className="text-[11px] text-emerald-800 mt-0.5">Nasal sound held for 2 beats on Noon/Meem with Shaddah.</p>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 flex items-start gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-blue-500 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-blue-900 block font-bold">Qalqalah (قلقلة) - Echoing Echo</strong>
                  <p className="text-[11px] text-blue-800 mt-0.5">Vibrant bouncing sound on letters: ق، ط، ب، ج، د when with Sukoon.</p>
                </div>
              </div>

              <div className="p-3 bg-orange-50 rounded-xl border border-orange-200 flex items-start gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-orange-500 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-orange-900 block font-bold">Ikhfaa (إخفاء) - Concealment</strong>
                  <p className="text-[11px] text-orange-800 mt-0.5">Hiding the Noon Sakinah/Tanween before the 15 Ikhfaa letters.</p>
                </div>
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 flex items-start gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-purple-500 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-purple-900 block font-bold">Madd (مد) - Elongation (4-6 Harakat)</strong>
                  <p className="text-[11px] text-purple-800 mt-0.5">Madd Munfasil / Muttasil / Lazim elongated for 4, 5, or 6 counts.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
