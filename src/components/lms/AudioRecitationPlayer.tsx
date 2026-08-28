import React, { useState, useRef, useEffect } from 'react';
import { Ayah, RecitationSubmission } from '../../types';
import { api } from '../../services/api';
import { useTenant } from '../../context/TenantContext';
import { ToastMessage } from '../ui/Toast';
import { Play, Pause, RotateCcw, Repeat, Volume2, Mic, Square, UploadCloud, CheckCircle2, Sliders, Radio, Activity } from 'lucide-react';

interface AudioRecitationPlayerProps {
  currentAyah: Ayah | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const AudioRecitationPlayer: React.FC<AudioRecitationPlayerProps> = ({
  currentAyah,
  isPlaying,
  onTogglePlay,
  onAddToast,
}) => {
  const { tenant, language } = useTenant();
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [loopCount, setLoopCount] = useState<number>(1);
  const [currentLoopIteration, setCurrentLoopIteration] = useState<number>(1);
  const [reciter, setReciter] = useState<string>('ar.alafasy');

  // Audio Recorder State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  const isAr = language === 'ar';

  // Handle Playback Speed change on HTML5 Audio Element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Handle Audio End & Looping Logic
  const handleAudioEnded = () => {
    if (currentLoopIteration < loopCount) {
      setCurrentLoopIteration((prev) => prev + 1);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      setCurrentLoopIteration(1);
      onTogglePlay();
    }
  };

  // Start Mic Recording
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
      onAddToast({
        type: 'error',
        title: isAr ? 'خطأ في الميكروفون' : 'Microphone Access Denied',
        message: isAr ? 'الرجاء السماح بصلاحية استخدام الميكروفون' : 'Please allow microphone permissions to record recitation.',
      });
    }
  };

  // Stop Mic Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
      setIsRecording(false);
      clearInterval(timerIntervalRef.current);
    }
  };

  // Submit Homework Recitation Audio
  const handleUploadHomework = async () => {
    if (!recordedAudioUrl) return;

    setIsUploading(true);
    try {
      await api.uploadRecitationAudio({
        studentId: 'std-current',
        studentName: 'Active Student',
        surahName: currentAyah ? `Surah (Verse ${currentAyah.numberInSurah})` : 'Surah Al-Mulk',
        ayahRange: currentAyah ? `Ayah ${currentAyah.numberInSurah}` : 'Ayah 1-5',
        audioUrl: recordedAudioUrl,
        durationSeconds: recordingSeconds,
      });

      onAddToast({
        type: 'success',
        title: isAr ? 'تم تسليم الواجب الصوتي!' : 'Recitation Homework Uploaded!',
        message: isAr ? 'تم إرسال تلاوتك إلى معلّم المادة للتقييم والتصحيح' : 'Your recitation has been sent to your teacher for audio feedback.',
      });
      setRecordedAudioUrl(null);
      setRecordingSeconds(0);
    } catch (err) {
      onAddToast({
        type: 'error',
        title: 'Upload Error',
        message: 'Could not upload audio recitation blob.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-800 space-y-6 max-w-full overflow-hidden">
      {/* Hidden Audio Player Element */}
      {currentAyah && (
        <audio
          ref={audioRef}
          src={currentAyah.audioUrl}
          onEnded={handleAudioEnded}
          autoPlay={isPlaying}
        />
      )}

      {/* Recitation Control Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-500/10 text-teal-400 rounded-2xl border border-teal-500/20 shrink-0">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-base text-slate-100 truncate">
              {isAr ? 'مشغّل التلاوة والتكرار المنهجي' : 'Verse Recitation & Looping Engine'}
            </h3>
            <p className="text-xs text-slate-400 truncate">
              {currentAyah
                ? `Currently Playing: Ayah ${currentAyah.numberInSurah} (Loop ${currentLoopIteration}/${loopCount})`
                : 'Select an Ayah in the Quran Viewer to play audio recitation'}
            </p>
          </div>
        </div>

        {/* Speed & Looping Toggles */}
        <div className="flex flex-wrap items-center gap-2.5 max-w-full">
          {/* Looping Selector */}
          <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700 text-xs shrink-0">
            <span className="text-[10px] font-bold text-slate-400 ms-2 flex items-center gap-1">
              <Repeat className="w-3 h-3 text-teal-400" />
              <span>{isAr ? 'التكرار:' : 'Loop:'}</span>
            </span>
            {[1, 3, 5, 10].map((num) => (
              <button
                key={num}
                onClick={() => setLoopCount(num)}
                className={`px-2 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  loopCount === num ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {num}x
              </button>
            ))}
          </div>

          {/* Playback Speed Selector */}
          <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700 text-xs shrink-0">
            <span className="text-[10px] font-bold text-slate-400 ms-2 flex items-center gap-1">
              <Sliders className="w-3 h-3 text-amber-400" />
              <span>{isAr ? 'السرعة:' : 'Speed:'}</span>
            </span>
            {[0.75, 1.0, 1.25, 1.5].map((speed) => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-2 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  playbackSpeed === speed ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Recitation Controls */}
      <div className="flex items-center justify-center gap-6 py-2">
        <button
          onClick={onTogglePlay}
          disabled={!currentAyah}
          className="w-16 h-16 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold flex items-center justify-center shadow-lg transition-transform transform hover:scale-105 disabled:opacity-40 cursor-pointer"
        >
          {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ms-1" />}
        </button>
      </div>

      {/* Recitation Homework Mic Recording Section */}
      <div className="pt-6 border-t border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <Mic className="w-4 h-4 text-rose-400" />
              <span>{isAr ? 'تسجيل واجب التلاوة والتسميع' : 'Recitation Homework Audio Recorder'}</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              {isAr ? 'سجّل بصوتك تلاوة الآية الحالية وأرسلها لمدرّس المادة' : 'Record your live voice reciting this verse and upload directly for teacher feedback.'}
            </p>
          </div>

          {isRecording && (
            <div className="flex items-center gap-2 text-rose-400 font-mono font-bold text-xs bg-rose-950/60 px-3 py-1.5 rounded-full border border-rose-800/60 animate-pulse">
              <Activity className="w-4 h-4" />
              <span>REC {Math.floor(recordingSeconds / 60)}:{(recordingSeconds % 60).toString().padStart(2, '0')}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Mic className="w-4 h-4" />
              <span>{isAr ? 'بدء التسجيل الصوتي' : 'Start Mic Recording'}</span>
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-white text-slate-900 font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Square className="w-4 h-4 fill-slate-900" />
              <span>{isAr ? 'إيقاف التسجيل' : 'Stop Recording'}</span>
            </button>
          )}

          {/* Recorded Audio Preview & Upload */}
          {recordedAudioUrl && !isRecording && (
            <div className="flex items-center gap-3 bg-slate-800 p-2.5 rounded-2xl border border-slate-700 flex-1">
              <audio src={recordedAudioUrl} controls className="h-8 max-w-xs flex-1" />
              <button
                onClick={handleUploadHomework}
                disabled={isUploading}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <UploadCloud className="w-4 h-4" />
                <span>{isUploading ? (isAr ? 'جاري الإرسال...' : 'Uploading...') : (isAr ? 'تسليم التلاوة للمعلّم' : 'Submit Homework')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
