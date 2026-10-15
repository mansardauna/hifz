import React, { useState, useEffect, useRef } from 'react';
import { Ayah } from '../../types';
import {
  fetchMedinaMushafPage,
  fetchAllSurahsList,
  LiveMushafPage,
  LiveMushafPageAyah,
  RECITERS,
  TOTAL_MUSHAF_PAGES,
  JUZ_START_PAGES,
} from '../../services/quranApi';
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
  ChevronRight,
  ChevronLeft,
  Trash2,
  Activity,
  Layers,
  Sparkles,
  CheckCircle2,
  X,
  Compass,
} from 'lucide-react';

interface QuranViewerProps {
  activeAyahNumber?: number | null;
  initialPage?: number;
  onSelectAyah?: (ayah: Ayah) => void;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  onAddToast?: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const QuranViewer: React.FC<QuranViewerProps> = ({
  activeAyahNumber,
  initialPage = 1,
  onSelectAyah,
  isPlaying: externalIsPlaying,
  onTogglePlay: externalTogglePlay,
  onAddToast,
}) => {
  const { language } = useTenant();

  // 604-Page Medina Mushaf Pagination State
  const [currentPageNumber, setCurrentPageNumber] = useState<number>(initialPage);
  const [pageInputValue, setPageInputValue] = useState<string>(String(initialPage));
  const [mushafPage, setMushafPage] = useState<LiveMushafPage | null>(null);
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(true);

  // Master Surahs list for quick navigation
  const [surahList, setSurahList] = useState<{ number: number; name: string; englishName: string; numberOfAyahs: number }[]>([]);

  // Reader Settings
  const [selectedReciter, setSelectedReciter] = useState<string>('ar.alafasy');
  const [showTranslation, setShowTranslation] = useState<boolean>(true);
  const [fontSizePx, setFontSizePx] = useState<number>(26);

  // Audio Playback & Ayah Selection
  const [selectedAyahIndex, setSelectedAyahIndex] = useState<number>(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [loopCount, setLoopCount] = useState<number>(1);
  const [currentLoopIteration, setCurrentLoopIteration] = useState<number>(1);
  const [continuousPlay, setContinuousPlay] = useState<boolean>(true);

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

  // 1. Fetch Master Surah List on Mount
  useEffect(() => {
    async function loadList() {
      const list = await fetchAllSurahsList();
      if (list && list.length > 0) {
        setSurahList(list);
      }
    }
    loadList();
  }, []);

  // 2. Fetch Medina Mushaf Page when page or reciter changes
  useEffect(() => {
    let isMounted = true;
    async function loadPage() {
      setIsLoadingPage(true);
      const pageData = await fetchMedinaMushafPage(currentPageNumber, selectedReciter);
      if (isMounted) {
        if (pageData) {
          setMushafPage(pageData);
          setSelectedAyahIndex(0);
          setPageInputValue(String(currentPageNumber));
        }
        setIsLoadingPage(false);
      }
    }
    loadPage();

    return () => {
      isMounted = false;
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [currentPageNumber, selectedReciter]);

  // Sync playback speed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  const activeAyah: LiveMushafPageAyah | null = mushafPage?.ayahs[selectedAyahIndex] || null;

  // Jump to specific page with boundary check
  const goToPage = (target: number) => {
    const pageNum = Math.max(1, Math.min(TOTAL_MUSHAF_PAGES, target));
    if (pageNum !== currentPageNumber) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsAudioPlaying(false);
      setCurrentPageNumber(pageNum);
      setPageInputValue(String(pageNum));
    }
  };

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(pageInputValue, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= TOTAL_MUSHAF_PAGES) {
      goToPage(parsed);
    } else {
      setPageInputValue(String(currentPageNumber));
    }
  };

  // Jump to start of a Juz
  const handleSelectJuz = (juzNumber: number) => {
    const targetPage = JUZ_START_PAGES[juzNumber] || 1;
    goToPage(targetPage);
  };

  // Play audio for a specific Ayah on the current page
  const playAyahAudio = (index: number) => {
    if (!mushafPage || !mushafPage.ayahs[index]) return;
    const ayah = mushafPage.ayahs[index];

    if (selectedAyahIndex === index && isAudioPlaying) {
      audioRef.current?.pause();
      setIsAudioPlaying(false);
      return;
    }

    if (audioRef.current && ayah.audioUrl) {
      audioRef.current.src = ayah.audioUrl;
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.play().catch((err) => console.warn('Audio playback error:', err));
      setSelectedAyahIndex(index);
      setIsAudioPlaying(true);
      setCurrentLoopIteration(1);

      if (onSelectAyah) {
        onSelectAyah({
          number: ayah.number,
          numberInSurah: ayah.numberInSurah,
          text: ayah.text,
          audioUrl: ayah.audioUrl,
          translationEn: ayah.translation,
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
      playAyahAudio(selectedAyahIndex);
    }
  };

  const handleNextAyah = () => {
    if (!mushafPage) return;
    if (selectedAyahIndex + 1 < mushafPage.ayahs.length) {
      playAyahAudio(selectedAyahIndex + 1);
    } else if (currentPageNumber < TOTAL_MUSHAF_PAGES) {
      // Advance to next Mushaf page
      goToPage(currentPageNumber + 1);
    }
  };

  const handlePreviousAyah = () => {
    if (!mushafPage) return;
    if (selectedAyahIndex > 0) {
      playAyahAudio(selectedAyahIndex - 1);
    } else if (currentPageNumber > 1) {
      // Go to previous Mushaf page
      goToPage(currentPageNumber - 1);
    }
  };

  // Handle Ayah loop and continuous page auto-play
  const handleAudioEnded = () => {
    // 1. Ayah Looper
    if (currentLoopIteration < loopCount) {
      setCurrentLoopIteration((prev) => prev + 1);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((e) => console.warn(e));
      }
      return;
    }

    setCurrentLoopIteration(1);

    // 2. Next Ayah on page
    if (continuousPlay && mushafPage && selectedAyahIndex + 1 < mushafPage.ayahs.length) {
      playAyahAudio(selectedAyahIndex + 1);
    } else if (continuousPlay && currentPageNumber < TOTAL_MUSHAF_PAGES) {
      // Advance to next Medina Mushaf page and auto-play its first verse
      const nextPage = currentPageNumber + 1;
      goToPage(nextPage);
    } else {
      setIsAudioPlaying(false);
    }
  };

  // Keyboard navigation for turning Medina Mushaf pages
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'SELECT') {
        return;
      }
      if (e.key === 'ArrowRight') {
        // In Arabic Mushaf reading order, ArrowRight moves backward in page number (to previous page)
        goToPage(currentPageNumber - 1);
      } else if (e.key === 'ArrowLeft') {
        // ArrowLeft turns to next page
        goToPage(currentPageNumber + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPageNumber]);

  // Student Recording Handlers
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
        surahName: activeAyah?.surah.name || `Page ${currentPageNumber}`,
        ayahRange: activeAyah ? `Ayah ${activeAyah.numberInSurah}` : `Page ${currentPageNumber}`,
        audioUrl: recordedAudioUrl,
        durationSeconds: recordingSeconds,
      });

      if (onAddToast) {
        onAddToast({
          type: 'success',
          title: isAr ? 'تم تسليم التلاوة بنجاح!' : 'Recitation Submitted!',
          message: isAr ? 'تم إرسال تسجيلك الصوتي للشيخ للتقييم والتصحيح' : 'Your recitation was sent to your Sheikh for oral evaluation.',
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

  const primarySurah = mushafPage?.surahs[0];
  const currentJuz = mushafPage?.juz || 1;

  return (
    <div className="bg-[#FAF6EE] rounded-3xl border border-amber-900/20 shadow-xl overflow-hidden font-sans relative pb-28">
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

      {/* Top Medina Navigation Toolbar */}
      <div className="bg-white/95 backdrop-blur-md px-4 py-3 sm:px-6 sm:py-3.5 border-b border-amber-900/10 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20 shadow-xs">
        {/* Left: Quick Page Jumper & Juz / Surah Selector */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <BookOpen className="w-5 h-5 text-amber-900 shrink-0" />

          {/* Quick Page Flip Controls */}
          <div className="flex items-center gap-1 bg-amber-50/80 px-2 py-1 rounded-xl border border-amber-900/20">
            <button
              type="button"
              onClick={() => goToPage(currentPageNumber - 1)}
              disabled={currentPageNumber <= 1}
              className="p-1 rounded-lg text-amber-900 hover:bg-amber-200/60 disabled:opacity-30 transition-colors cursor-pointer"
              title="Previous Page (Arrow Right)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <form onSubmit={handlePageInputSubmit} className="flex items-center gap-1">
              <span className="text-xs font-semibold text-amber-950">Page</span>
              <input
                type="text"
                value={pageInputValue}
                onChange={(e) => setPageInputValue(e.target.value)}
                onBlur={() => setPageInputValue(String(currentPageNumber))}
                className="w-12 text-center text-xs font-mono font-semibold bg-white border border-amber-900/30 rounded-md py-0.5 text-amber-950 focus:outline-none focus:ring-1 focus:ring-amber-600"
              />
              <span className="text-xs font-semibold text-amber-800/80">/ {TOTAL_MUSHAF_PAGES}</span>
            </form>

            <button
              type="button"
              onClick={() => goToPage(currentPageNumber + 1)}
              disabled={currentPageNumber >= TOTAL_MUSHAF_PAGES}
              className="p-1 rounded-lg text-amber-900 hover:bg-amber-200/60 disabled:opacity-30 transition-colors cursor-pointer"
              title="Next Page (Arrow Left)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Juz Jumper Dropdown */}
          <select
            value={currentJuz}
            onChange={(e) => handleSelectJuz(Number(e.target.value))}
            className="bg-amber-50/80 text-amber-950 font-semibold text-xs px-2.5 py-1.5 rounded-xl border border-amber-900/20 focus:outline-none focus:ring-1 focus:ring-amber-600 cursor-pointer"
          >
            {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => (
              <option key={juz} value={juz}>
                Juz {juz} (الجزء {juz})
              </option>
            ))}
          </select>

          {/* Surah Jumper Dropdown */}
          {surahList.length > 0 && (
            <select
              value={primarySurah?.number || 1}
              onChange={(e) => {
                const sNum = Number(e.target.value);
                // Simple heuristic for Surah start page or default to 1
                if (sNum === 1) goToPage(1);
                else if (sNum === 2) goToPage(2);
                else {
                  // Jump close to surah page
                  const approxPage = Math.min(604, Math.max(1, Math.round((sNum / 114) * 604)));
                  goToPage(approxPage);
                }
              }}
              className="hidden md:inline-block bg-amber-50/80 text-amber-950 font-semibold text-xs px-2.5 py-1.5 rounded-xl border border-amber-900/20 focus:outline-none focus:ring-1 focus:ring-amber-600 cursor-pointer max-w-[160px] truncate"
            >
              {surahList.map((s) => (
                <option key={s.number} value={s.number}>
                  {s.number}. {s.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Right Toolbar Controls */}
        <div className="flex items-center gap-2">
          {/* Translation Toggle */}
          <button
            type="button"
            onClick={() => setShowTranslation(!showTranslation)}
            className="px-2.5 py-1.5 rounded-xl bg-white text-amber-900 border border-amber-900/20 text-xs font-semibold hover:bg-amber-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            {showTranslation ? <Eye className="w-3.5 h-3.5 text-amber-700" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
            <span className="hidden sm:inline">{showTranslation ? 'Translation' : 'Arabic Only'}</span>
          </button>

          {/* Font Resizer */}
          <div className="flex items-center bg-white border border-amber-900/20 rounded-xl overflow-hidden text-xs shadow-2xs">
            <button
              type="button"
              onClick={() => setFontSizePx((prev) => Math.max(18, prev - 2))}
              className="px-2 py-1.5 hover:bg-amber-50 text-amber-900 font-semibold border-r border-amber-900/10 cursor-pointer"
              title="Decrease font size"
            >
              A-
            </button>
            <span className="px-2 text-amber-950 font-mono text-[11px] font-semibold">{fontSizePx}px</span>
            <button
              type="button"
              onClick={() => setFontSizePx((prev) => Math.min(42, prev + 2))}
              className="px-2 py-1.5 hover:bg-amber-50 text-amber-900 font-semibold cursor-pointer"
              title="Increase font size"
            >
              A+
            </button>
          </div>

          {/* Tajweed Rules Modal Trigger */}
          <button
            type="button"
            onClick={() => setIsTajweedModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-white text-amber-900 border border-amber-900/20 text-xs font-semibold hover:bg-amber-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Tajweed Colors"
          >
            <Layers className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline">Tajweed</span>
          </button>

          {/* Record Homework Recitation Button */}
          <button
            type="button"
            onClick={() => setIsRecordingModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Mic className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Record</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* AUTHENTIC 604-PAGE MEDINA MUSHAF SHEET                       */}
      {/* ============================================================ */}
      <div className="max-w-4xl mx-auto p-3 sm:p-8">
        <div className="bg-[#FFFDF9] rounded-3xl border-4 border-amber-900/25 p-5 sm:p-10 shadow-2xl relative min-h-[640px] flex flex-col justify-between">
          
          {/* Top Medina Mushaf Frame Header */}
          <div className="flex items-center justify-between border-b-2 border-amber-900/20 pb-3 mb-6 select-none font-serif text-amber-950">
            {/* Right: Surah Name in Arabic Script */}
            <div className="text-sm sm:text-base font-semibold">
              {mushafPage?.surahs.map((s) => s.name).join(' • ') || 'سورة'}
            </div>

            {/* Center: Juz Indicator */}
            <div className="text-xs sm:text-sm font-semibold text-amber-800 bg-amber-100/60 px-3 py-0.5 rounded-full border border-amber-900/10">
              الجزء {currentJuz}
            </div>

            {/* Left: Revelation Type / Header */}
            <div className="text-xs sm:text-sm text-amber-800 font-medium">
              {primarySurah?.revelationType === 'Medinan' ? 'مدنية' : 'مكية'}
            </div>
          </div>

          {/* Inner Mushaf Page Content */}
          <div className="flex-1 flex flex-col justify-center">
            {isLoadingPage ? (
              <div className="py-32 text-center text-amber-900 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-amber-700" />
                <p className="text-xs font-semibold text-amber-900">Loading Medina Mushaf Page {currentPageNumber}...</p>
              </div>
            ) : mushafPage?.ayahs && mushafPage.ayahs.length > 0 ? (
              <div className="space-y-4">
                {/* Check if any Surah starts on this page: render Medina cartouche */}
                {mushafPage.ayahs.map((ayah, idx) => {
                  const isSelected = selectedAyahIndex === idx;
                  const isAyahPlaying = isSelected && isAudioPlaying;

                  return (
                    <React.Fragment key={ayah.number}>
                      {/* Surah Header Cartouche when an ayah is verse 1 */}
                      {ayah.isFirstInSurah && (
                        <div className="my-6 text-center">
                          <div className="bg-gradient-to-r from-amber-200/90 via-amber-100 to-amber-200/90 border-2 border-amber-800/40 rounded-2xl py-3 px-6 shadow-inner text-amber-950 font-serif font-semibold text-xl sm:text-2xl tracking-wide select-none">
                            {ayah.surah.name} ({ayah.surah.englishName})
                          </div>

                          {ayah.surah.number !== 9 && (
                            <div className="mt-4 mb-2 text-2xl sm:text-3xl font-serif text-amber-950/90 tracking-widest select-none">
                              بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                            </div>
                          )}
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}

                {/* Flowing Medina Mushaf Verses in single authentic page container */}
                <div
                  dir="rtl"
                  className="text-justify font-serif text-amber-950 leading-[2.6] sm:leading-[3.0] tracking-wide select-text py-2"
                  style={{ fontSize: `${fontSizePx}px` }}
                >
                  {mushafPage.ayahs.map((ayah, idx) => {
                    const isSelected = selectedAyahIndex === idx;
                    const isAyahPlaying = isSelected && isAudioPlaying;

                    return (
                      <span
                        key={ayah.number}
                        onClick={() => playAyahAudio(idx)}
                        className={`inline transition-all cursor-pointer rounded-lg px-1 py-0.5 ${
                          isAyahPlaying
                            ? 'bg-amber-300/80 text-amber-950 ring-2 ring-amber-500 shadow-xs'
                            : isSelected
                            ? 'bg-amber-200/60 text-amber-950 ring-1 ring-amber-400'
                            : 'hover:bg-amber-100/70'
                        }`}
                        title={`Ayah ${ayah.numberInSurah} - Click to listen & read`}
                      >
                        {ayah.text}{' '}
                        <span className="text-amber-800 font-semibold px-1 select-none font-serif text-[0.85em]">
                          ﴿{ayah.numberInSurah}﴾
                        </span>{' '}
                      </span>
                    );
                  })}
                </div>

                {/* English Sahih Translation of Selected Verse (if enabled) */}
                {showTranslation && activeAyah && activeAyah.translation && (
                  <div
                    dir="ltr"
                    className="mt-6 p-4 rounded-2xl bg-amber-50/70 border border-amber-900/15 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans shadow-2xs"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-semibold text-amber-950">
                        {activeAyah.surah.englishName} • Verse {activeAyah.numberInSurah}
                      </span>
                      {isAudioPlaying && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.2 rounded-full">
                          <Activity className="w-3 h-3 animate-spin text-emerald-700" />
                          Reciting
                        </span>
                      )}
                    </div>
                    <p className="text-slate-700">{activeAyah.translation}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-20 text-center text-amber-900">
                <p className="text-sm font-semibold">No verses available on this page.</p>
              </div>
            )}
          </div>

          {/* Bottom Medina Mushaf Page Medallion */}
          <div className="mt-8 pt-3 border-t-2 border-amber-900/20 flex items-center justify-between select-none">
            {/* Quick Prev Page */}
            <button
              type="button"
              onClick={() => goToPage(currentPageNumber - 1)}
              disabled={currentPageNumber <= 1}
              className="text-xs font-semibold text-amber-900 hover:text-amber-950 disabled:opacity-30 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Page</span>
            </button>

            {/* Center Medina Page Medallion */}
            <div className="w-10 h-10 rounded-full border-2 border-amber-900/40 bg-amber-100 flex items-center justify-center font-serif font-semibold text-sm text-amber-950 shadow-inner">
              {currentPageNumber}
            </div>

            {/* Quick Next Page */}
            <button
              type="button"
              onClick={() => goToPage(currentPageNumber + 1)}
              disabled={currentPageNumber >= TOTAL_MUSHAF_PAGES}
              className="text-xs font-semibold text-amber-900 hover:text-amber-950 disabled:opacity-30 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Next Page</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* FLOATING AUDIO CONTROLLER (Zero Icon Background Wrappers)    */}
      {/* ============================================================ */}
      <div className="fixed bottom-3 inset-x-3 sm:inset-x-6 max-w-5xl mx-auto bg-slate-950/95 backdrop-blur-xl text-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-slate-800 shadow-2xl z-30 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Active Verse Info */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Volume2 className="w-6 h-6 text-emerald-400 shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-semibold text-white truncate">
                {activeAyah?.surah.name || 'Al-Quran'} • Verse {activeAyah?.numberInSurah || 1}
              </h4>
              {loopCount > 1 && (
                <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/90 px-2 py-0.2 rounded border border-emerald-800 shrink-0">
                  Pass {currentLoopIteration}/{loopCount}
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              Page {currentPageNumber} of 604 • {RECITERS.find((r) => r.id === selectedReciter)?.name || 'Sheikh Alafasy'}
            </div>
          </div>
        </div>

        {/* Center: Playback Transport */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handlePreviousAyah}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer text-slate-200"
            title="Previous Verse"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleToggleCurrentAudio}
            className="w-11 h-11 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center transition-all shadow-lg shadow-emerald-500/30 cursor-pointer font-semibold"
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
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer text-slate-200"
            title="Next Verse"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Reciter, Looper, Speed */}
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
            <span className="text-[10px] text-slate-400 px-1.5 font-semibold">Loop:</span>
            {[1, 3, 5, 10].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => {
                  setLoopCount(count);
                  setCurrentLoopIteration(1);
                }}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-mono font-semibold transition-all cursor-pointer ${
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
                className={`px-2 py-0.5 rounded-lg text-[11px] font-mono font-semibold transition-all cursor-pointer ${
                  playbackSpeed === speed
                    ? 'bg-emerald-500 text-slate-950 font-semibold'
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
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <Mic className="w-6 h-6 text-emerald-700 shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Record Oral Recitation Homework</h3>
                  <p className="text-xs text-slate-500">Record your recitation for Page {currentPageNumber} to submit to your Sheikh.</p>
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
                <span className="text-xs font-semibold text-slate-700">
                  Target Verse: <strong className="text-emerald-700">{activeAyah?.surah.name || 'Current'} (Ayah {activeAyah?.numberInSurah || 1})</strong>
                </span>
                {recordedAudioUrl && (
                  <span className="text-xs font-mono font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-md">
                    {recordingSeconds}s recorded
                  </span>
                )}
              </div>

              {isRecording ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-rose-600 font-semibold bg-rose-50 border border-rose-200 p-3 rounded-xl animate-pulse">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                      <span className="text-xs">Recording Live Recitation...</span>
                    </div>
                    <span className="font-mono text-sm">{recordingSeconds}s</span>
                  </div>

                  <button
                    type="button"
                    onClick={stopRecording}
                    className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
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
                      className="flex items-center gap-2 text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                    >
                      {isPlayingRecorded ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                      <span>{isPlayingRecorded ? 'Pause' : 'Preview'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={deleteRecordedAudio}
                      className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer flex items-center gap-1 text-xs font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Re-record</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmitHomework}
                    disabled={isSubmittingHomework}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                  >
                    {isSubmittingHomework ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <UploadCloud className="w-4 h-4" />
                    )}
                    <span>Submit</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={startRecording}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                >
                  <Mic className="w-4 h-4" />
                  <span>Record</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tajweed Rules Reference Modal */}
      {isTajweedModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-900 shrink-0" />
                <h3 className="text-sm font-semibold text-slate-900">Tajweed Color Guide</h3>
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
                  <strong className="text-emerald-900 block font-semibold">Ghunnah (غنة) - 2 Harakat</strong>
                  <p className="text-[11px] text-emerald-800 mt-0.5">Nasal sound held for 2 beats on Noon/Meem with Shaddah.</p>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 flex items-start gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-blue-500 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-blue-900 block font-semibold">Qalqalah (قلقلة) - Echoing</strong>
                  <p className="text-[11px] text-blue-800 mt-0.5">Vibrant bouncing sound on letters: ق، ط، ب، ج، د when with Sukoon.</p>
                </div>
              </div>

              <div className="p-3 bg-orange-50 rounded-xl border border-orange-200 flex items-start gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-orange-500 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-orange-900 block font-semibold">Ikhfaa (إخفاء) - Concealment</strong>
                  <p className="text-[11px] text-orange-800 mt-0.5">Hiding the Noon Sakinah/Tanween before the 15 Ikhfaa letters.</p>
                </div>
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 flex items-start gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-purple-500 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-purple-900 block font-semibold">Madd (مد) - Elongation (4-6 Harakat)</strong>
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
