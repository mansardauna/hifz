import React, { useState } from 'react';
import { Surah, Ayah, TajweedToken } from '../../types';
import { MOCK_SURAHS } from '../../services/mockData';
import { useTenant } from '../../context/TenantContext';
import { Play, Pause, Repeat, BookOpen, Eye, EyeOff, Volume2, Sparkles, CheckCircle } from 'lucide-react';

interface QuranViewerProps {
  activeAyahNumber: number | null;
  onSelectAyah: (ayah: Ayah) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const QuranViewer: React.FC<QuranViewerProps> = ({
  activeAyahNumber,
  onSelectAyah,
  isPlaying,
  onTogglePlay,
}) => {
  const { tenant, language } = useTenant();
  const [activeSurahIndex, setActiveSurahIndex] = useState<number>(0);
  const [showTranslation, setShowTranslation] = useState<boolean>(true);
  const [enableTajweedColors, setEnableTajweedColors] = useState<boolean>(true);
  const [fontSizePx, setFontSizePx] = useState<number>(28);

  const currentSurah = MOCK_SURAHS[activeSurahIndex] || MOCK_SURAHS[0];
  const isAr = language === 'ar';

  const renderTajweedText = (tokens?: TajweedToken[]) => {
    if (!tokens || tokens.length === 0) return null;

    if (!enableTajweedColors) {
      return tokens.map((t) => t.text).join('');
    }

    return tokens.map((t, idx) => {
      let colorClass = 'text-slate-900';
      if (t.rule === 'ghunnah') colorClass = 'text-emerald-700 font-bold';
      else if (t.rule === 'qalqalah') colorClass = 'text-amber-700 font-bold';
      else if (t.rule === 'madd') colorClass = 'text-purple-700 font-bold';
      else if (t.rule === 'ikhfa') colorClass = 'text-teal-700 font-bold';

      return (
        <span key={idx} className={colorClass}>
          {t.text}
        </span>
      );
    });
  };

  return (
    <div className="bg-amber-50/40 rounded-md border border-amber-900/10 shadow-md overflow-hidden" dir="rtl">
      {/* Quran Reader Control Bar */}
      <div className="bg-white/90 backdrop-blur-md p-3 sm:p-4 border-b border-amber-900/10 flex flex-wrap items-center justify-between gap-3">
        {/* Surah Selector */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <select
            value={activeSurahIndex}
            onChange={(e) => setActiveSurahIndex(Number(e.target.value))}
            className="bg-amber-50 text-amber-950 font-arabic font-bold text-sm sm:text-base px-3 py-1.5 rounded-md border border-amber-900/20 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
          >
            {MOCK_SURAHS.map((s, idx) => (
              <option key={s.number} value={idx}>
                {s.number}. سورة {s.nameAr} ({s.englishTranslation})
              </option>
            ))}
          </select>

          <span className="text-[11px] text-amber-800 font-semibold bg-amber-100/80 px-2 py-1 rounded-md">
            {currentSurah.revelationType === 'Meccan' ? 'مَكِّيَّة' : 'مَدَنِيَّة'} • {currentSurah.numberOfAyahs} آيات
          </span>
        </div>

        {/* Display Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Tajweed Toggle */}
          <button
            onClick={() => setEnableTajweedColors(!enableTajweedColors)}
            className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              enableTajweedColors
                ? 'bg-amber-800 text-amber-50 shadow-xs'
                : 'bg-white text-amber-900 border border-amber-900/20'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{enableTajweedColors ? 'أحكام التجويد (مُفعّل)' : 'تلوين التجويد'}</span>
            <span className="sm:hidden">التجويد</span>
          </button>

          {/* Translation Toggle */}
          <button
            onClick={() => setShowTranslation(!showTranslation)}
            className="px-2.5 sm:px-3 py-1.5 rounded-md bg-white text-amber-900 border border-amber-900/20 text-xs font-bold hover:bg-amber-50 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {showTranslation ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{showTranslation ? 'الترجمة الإنجليزية' : 'إخفاء الترجمة'}</span>
            <span className="sm:hidden">الترجمة</span>
          </button>

          {/* Font Size Adjusters */}
          <div className="flex items-center bg-white rounded-md border border-amber-900/20 p-0.5 text-xs font-bold text-amber-950">
            <button
              onClick={() => setFontSizePx((prev) => Math.max(prev - 3, 18))}
              className="px-2 py-0.5 hover:bg-amber-100 rounded-sm cursor-pointer"
              title="Decrease Font Size"
            >
              A-
            </button>
            <span className="px-1.5 text-[10px] font-mono text-slate-400">{fontSizePx}px</span>
            <button
              onClick={() => setFontSizePx((prev) => Math.min(prev + 3, 44))}
              className="px-2 py-0.5 hover:bg-amber-100 rounded-sm cursor-pointer"
              title="Increase Font Size"
            >
              A+
            </button>
          </div>
        </div>
      </div>

      {/* Tajweed Color Legend */}
      {enableTajweedColors && (
        <div className="bg-amber-100/50 px-4 py-2 border-b border-amber-900/10 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[10px] sm:text-[11px] font-semibold text-slate-700">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-700"></span> غُنَّة (Ghunnah)</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-700"></span> قَلْقَلَة (Qalqalah)</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-700"></span> مَدّ (Madd)</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-700"></span> إخْفَاء (Ikhfa)</span>
        </div>
      )}

      {/* Distraction-Free Quran Content Reader Area */}
      <div className="p-4 sm:p-10 max-w-4xl mx-auto space-y-6">
        {/* Bismillah Header (if not Surah At-Tawbah) */}
        {currentSurah.number !== 9 && (
          <div className="text-center py-3">
            <p className="font-arabic text-2xl sm:text-4xl text-amber-950 tracking-wide font-bold">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </p>
          </div>
        )}

        {/* Verse by Verse List */}
        <div className="space-y-4 sm:space-y-5">
          {currentSurah.ayahs.map((ayah) => {
            const isSelected = activeAyahNumber === ayah.number;

            return (
              <div
                key={ayah.number}
                onClick={() => onSelectAyah(ayah)}
                className={`p-4 sm:p-6 rounded-md transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-amber-100/90 border-amber-500 shadow-md ring-2 ring-amber-400/50'
                    : 'bg-white/90 border-amber-900/10 hover:bg-white hover:border-amber-400/40 shadow-xs'
                }`}
              >
                {/* Verse Arabic Text */}
                <div className="flex items-start justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-arabic font-bold text-amber-950 leading-[2.2] tracking-wide text-end"
                      style={{ fontSize: `${fontSizePx}px` }}
                    >
                      {ayah.tajweedTokens ? renderTajweedText(ayah.tajweedTokens) : (ayah.textUthmani || ayah.text)}
                      <span className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-200/80 text-amber-900 text-[10px] sm:text-xs font-mono font-bold ms-2.5 border border-amber-400/60 shadow-inner shrink-0">
                        ۝{ayah.numberInSurah || ayah.number}
                      </span>
                    </p>

                    {/* Translation Overlay */}
                    {showTranslation && (
                      <p className="text-xs text-slate-600 font-sans mt-2.5 text-start leading-relaxed pt-2.5 border-t border-amber-900/5" dir="ltr">
                        <strong className="text-amber-800 me-2">[{currentSurah.number}:{ayah.numberInSurah || ayah.number}]</strong>
                        {ayah.translationEn}
                      </p>
                    )}
                  </div>

                  {/* Play Audio Button for Verse */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectAyah(ayah);
                      onTogglePlay();
                    }}
                    className={`p-2.5 sm:p-3 rounded-full shrink-0 transition-transform hover:scale-105 cursor-pointer ${
                      isSelected && isPlaying
                        ? 'bg-amber-600 text-white shadow-md'
                        : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                    }`}
                    title="Recite Verse Audio"
                  >
                    {isSelected && isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
