import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useToast } from '../../context/ToastContext';
import { SanadCertificate, CertificateTheme } from '../../types/certificate';
import {
  Award,
  Download,
  Printer,
  Share2,
  Sparkles,
  QrCode,
  ShieldCheck,
  Check,
  RefreshCw,
  Eye,
  Sliders,
  Send,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { Button, Input, Card, Badge } from '../ui';

export const SanadCertificateBuilder: React.FC = () => {
  const { tenant } = useTenant();
  const { success, error, info } = useToast();

  const [studentNameEn, setStudentNameEn] = useState('Zayd Ibn Harithah');
  const [studentNameAr, setStudentNameAr] = useState('زيد بن حارثة');
  const [riwayah, setRiwayah] = useState("Hafs 'an 'Asim via Shatibiyyah");
  const [riwayahAr, setRiwayahAr] = useState('برواية حفص عن عاصم من طريق الشاطبية');
  const [trackType, setTrackType] = useState<SanadCertificate['trackType']>('tajweed_ijazah');
  const [grade, setGrade] = useState<SanadCertificate['grade']>('Mumtaz (Distinction)');
  const [sheikhName, setSheikhName] = useState('Sheikh Tariq Al-Mansoor');
  const [sheikhTitle, setSheikhTitle] = useState('Senior Muqri & Ijazah Holder of the Ten Qira’at');
  const [completionDate, setCompletionDate] = useState('September 4, 2026');
  const [hijriDate, setHijriDate] = useState('22 Safar 1448 AH');
  const [theme, setTheme] = useState<CertificateTheme>('royal_gold');
  const [showWaxSeal, setShowWaxSeal] = useState(true);
  const [certificateId] = useState(`IJZ-${Math.floor(100000 + Math.random() * 900000)}`);

  const verificationUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/verify/${certificateId}`
    : `https://${tenant.subdomain}.ankabit.app/verify/${certificateId}`;

  // Theme styling palettes
  const themeStyles = {
    royal_gold: {
      border: 'border-amber-600/70',
      innerBorder: 'border-amber-500/40',
      bgGradient: 'from-amber-50/40 via-white to-amber-50/30',
      textPrimary: 'text-amber-950',
      textAccent: 'text-amber-700',
      sealBg: 'bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900',
      sealRing: 'ring-amber-400',
      sealText: 'text-amber-100',
    },
    emerald_medina: {
      border: 'border-emerald-700/70',
      innerBorder: 'border-emerald-600/40',
      bgGradient: 'from-emerald-50/40 via-white to-emerald-50/30',
      textPrimary: 'text-emerald-950',
      textAccent: 'text-emerald-700',
      sealBg: 'bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900',
      sealRing: 'ring-emerald-400',
      sealText: 'text-emerald-100',
    },
    navy_sanad: {
      border: 'border-blue-900/70',
      innerBorder: 'border-blue-700/40',
      bgGradient: 'from-slate-50 via-white to-blue-50/40',
      textPrimary: 'text-slate-900',
      textAccent: 'text-blue-900',
      sealBg: 'bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950',
      sealRing: 'ring-blue-400',
      sealText: 'text-blue-100',
    },
    obsidian_khatam: {
      border: 'border-slate-800',
      innerBorder: 'border-slate-700/60',
      bgGradient: 'from-slate-900 via-slate-950 to-slate-900',
      textPrimary: 'text-white',
      textAccent: 'text-amber-400',
      sealBg: 'bg-gradient-to-br from-amber-500 to-amber-700',
      sealRing: 'ring-amber-300',
      sealText: 'text-slate-950',
    },
  };

  const currentTheme = themeStyles[theme];

  const handlePrint = () => {
    window.print();
    success('Print Triggered', 'Certificate print dialogue opened.');
  };

  const handleShareEmail = () => {
    success('Certificate Dispatched! ✉️', `Authenticated Ijazah #${certificateId} sent to ${studentNameEn} & parent.`);
  };

  const handleShareWhatsApp = () => {
    success('WhatsApp Notification Dispatched! 📲', `Verification link sent to student via WhatsApp.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Badge variant="success" className="mb-2">
            Sanad & Ijazah Certification Studio
          </Badge>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Visual Sanad & Ijazah Certificate Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Design authenticated graduation certificates with authentic Khatam borders, Sheikh wax seals, and scannable QR verification.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShareEmail}
            leftIcon={<Send className="w-3.5 h-3.5" />}
            className="font-bold text-xs"
          >
            Email to Student
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleShareWhatsApp}
            leftIcon={<Share2 className="w-3.5 h-3.5" />}
            className="font-bold text-xs"
          >
            WhatsApp
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="w-3.5 h-3.5" />}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
          >
            Print / PDF Export
          </Button>
        </div>
      </div>

      {/* Main Grid: Controls on Left, Visual Canvas on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Certificate Configuration Controls (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>Student & Riwayah Details</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Student Name (English)</label>
              <input
                type="text"
                value={studentNameEn}
                onChange={(e) => setStudentNameEn(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Student Name (Arabic)</label>
              <input
                type="text"
                dir="rtl"
                value={studentNameAr}
                onChange={(e) => setStudentNameAr(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-arabic font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Certification Track</label>
              <select
                value={trackType}
                onChange={(e) => setTrackType(e.target.value as any)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold"
              >
                <option value="tajweed_ijazah">Ijazah in Recitation & Tajweed (Connected Sanad)</option>
                <option value="hifz_full">Full Holy Quran Memorization (30 Juz)</option>
                <option value="qirat_asharah">Ten Minor Qira'at (Al-Ashr As-Sughra)</option>
                <option value="nazirah">Nazirah & Foundation Khatam</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Riwayah / Transmission</label>
              <input
                type="text"
                value={riwayah}
                onChange={(e) => setRiwayah(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Grade / Distinction</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value as any)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold"
              >
                <option value="Mumtaz (Distinction)">Mumtaz (Distinction / 95-100%)</option>
                <option value="Jayyid Jiddan (Very Good)">Jayyid Jiddan (Very Good / 85-94%)</option>
                <option value="Jayyid (Good)">Jayyid (Good / 75-84%)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Supervising Sheikh / Muqri</label>
              <input
                type="text"
                value={sheikhName}
                onChange={(e) => setSheikhName(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Gregorian Date</label>
                <input
                  type="text"
                  value={completionDate}
                  onChange={(e) => setCompletionDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hijri Date</label>
                <input
                  type="text"
                  value={hijriDate}
                  onChange={(e) => setHijriDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-arabic"
                />
              </div>
            </div>
          </Card>

          {/* Theme & Decorative Options */}
          <Card className="p-5 space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Styling & Wax Seal Stamp</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Border & Color Palette</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'royal_gold', label: 'Royal Gold', bg: 'bg-amber-600' },
                  { id: 'emerald_medina', label: 'Emerald Medina', bg: 'bg-emerald-700' },
                  { id: 'navy_sanad', label: 'Navy Sanad', bg: 'bg-blue-900' },
                  { id: 'obsidian_khatam', label: 'Obsidian Dark', bg: 'bg-slate-900' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id as CertificateTheme)}
                    className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                      theme === t.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-600/30'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full ${t.bg} shrink-0`} />
                    <span className="text-xs truncate">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Display Sheikh Wax Seal Stamp</span>
              <input
                type="checkbox"
                checked={showWaxSeal}
                onChange={(e) => setShowWaxSeal(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
              />
            </div>
          </Card>
        </div>

        {/* Right Column: Visual Certificate Canvas Preview (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col items-center">
          {/* Certificate Container with Islamic Frame */}
          <div
            id="sanad-certificate-print"
            className={`w-full max-w-[800px] aspect-[1.414/1] rounded-3xl p-6 sm:p-10 border-8 relative overflow-hidden shadow-2xl transition-all duration-300 bg-gradient-to-b ${currentTheme.bgGradient} ${currentTheme.border}`}
          >
            {/* Inner Khatam Filigree Border */}
            <div className={`w-full h-full border-2 rounded-2xl p-6 flex flex-col justify-between relative ${currentTheme.innerBorder}`}>
              {/* Corner Arabesque Khatam Stars */}
              <div className="absolute top-2 left-2 text-xs opacity-60">۞</div>
              <div className="absolute top-2 right-2 text-xs opacity-60">۞</div>
              <div className="absolute bottom-2 left-2 text-xs opacity-60">۞</div>
              <div className="absolute bottom-2 right-2 text-xs opacity-60">۞</div>

              {/* Certificate Top Header */}
              <div className="text-center space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  {tenant.name || 'Hifz Islamic Academy'} • Faculty of Quranic Recitation
                </div>
                {/* Traditional Basmalah */}
                <div className="font-arabic text-lg sm:text-2xl text-slate-800 font-bold py-1">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </div>
                <h2 className={`font-arabic text-xl sm:text-3xl font-black ${currentTheme.textAccent}`}>
                  {trackType === 'hifz_full'
                    ? 'شَهَادَةُ حِفْظِ الْقُرْآنِ الْكَرِيمِ كَامِلاً'
                    : 'إِجَازَةٌ بِالسَّنَدِ الْمُتَّصِلِ فِي تِلَاوَةِ الْقُرْآنِ الْكَرِيمِ'}
                </h2>
                <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                  Official Sanad & Ijazah of Recitation & Memorization
                </div>
              </div>

              {/* Certificate Body Text */}
              <div className="my-auto text-center space-y-3 px-4">
                <p className="font-arabic text-xs sm:text-sm text-slate-700 leading-loose">
                  الْحَمْدُ لِلَّهِ الَّذِي أَنْزَلَ عَلَىٰ عَبْدِهِ الْكِتَابَ وَلَمْ يَجْعَل لَّهُ عِوَجًا، وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِهِ وَصَحْبِهِ أَجْمَعِينَ. أَمَّا بَعْدُ:
                </p>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  This is to certify that the honored reciter / student
                </p>

                {/* Student Name Calligraphy & English */}
                <div className="py-2">
                  <div className={`font-arabic text-2xl sm:text-3xl font-black ${currentTheme.textAccent}`}>
                    {studentNameAr}
                  </div>
                  <div className={`text-lg sm:text-xl font-black tracking-wide ${currentTheme.textPrimary} mt-0.5`}>
                    {studentNameEn}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-xl mx-auto">
                  has completed the recitation of the Holy Quran from Surah Al-Fatihah to Surah An-Nas with precision, Tajweed application, and mastery according to <strong className="font-bold">{riwayah}</strong> with the grade of <strong className={currentTheme.textAccent}>{grade}</strong>.
                </p>

                {/* Sanad Chain Notation */}
                <div className="bg-black/5 rounded-xl p-2.5 max-w-lg mx-auto border border-black/5 text-[11px] font-arabic text-slate-600 leading-relaxed">
                  بِالسَّنَدِ الْمُتَّصِلِ إِلَى رَسُولِ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ عَنْ جِبْرِيلَ عَلَيْهِ السَّلَامُ عَنْ رَبِّ الْعِزَّةِ جَلَّ جَلَالُهُ
                </div>
              </div>

              {/* Certificate Footer (Signatures, Dates & QR Verification) */}
              <div className="pt-4 border-t border-black/10 flex items-end justify-between gap-4 text-left">
                {/* Supervising Sheikh Signature */}
                <div className="space-y-0.5 min-w-[140px]">
                  <div className="h-9 flex items-end pb-1 font-arabic text-sm text-slate-800 font-bold border-b border-slate-400 border-dashed">
                    {sheikhName}
                  </div>
                  <div className="text-[10px] font-bold text-slate-900">{sheikhName}</div>
                  <div className="text-[9px] text-slate-500 leading-tight">{sheikhTitle}</div>
                </div>

                {/* Center: Wax Seal Stamp (if enabled) */}
                {showWaxSeal && (
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full ${currentTheme.sealBg} ring-4 ${currentTheme.sealRing} shadow-xl flex flex-col items-center justify-center ${currentTheme.sealText} select-none transform hover:rotate-6 transition-transform`}
                    >
                      <Award className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow" />
                      <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest mt-0.5">
                        SANAD
                      </span>
                      <span className="text-[7px] font-bold">VERIFIED</span>
                    </div>
                  </div>
                )}

                {/* QR Code & Certificate Hash Verification */}
                <div className="flex items-center gap-2.5 text-right">
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-bold text-slate-900">Certificate #{certificateId}</div>
                    <div className="text-[9px] text-slate-500">{completionDate}</div>
                    <div className="text-[9px] text-slate-500 font-arabic">{hijriDate}</div>
                    <a
                      href={verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[9px] text-emerald-700 font-bold hover:underline block"
                    >
                      Scan to Verify
                    </a>
                  </div>

                  {/* QR Box */}
                  <div className="w-14 h-14 bg-white p-1 rounded-lg border border-slate-300 shadow-xs flex items-center justify-center shrink-0">
                    <QrCode className="w-full h-full text-slate-900" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
