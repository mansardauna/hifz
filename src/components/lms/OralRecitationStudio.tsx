import React, { useState, useRef, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { ToastMessage } from '../ui/Toast';
import { Button, Card, Badge, Input, Select } from '../ui';
import {
  Mic,
  Square,
  Play,
  Pause,
  RotateCcw,
  UploadCloud,
  CheckCircle2,
  Volume2,
  Sparkles,
  BookOpen,
  Radio,
  Clock,
  AlertCircle
} from 'lucide-react';
import { api } from '../../services/api';
import { RecitationSubmission } from '../../types';

interface OralRecitationStudioProps {
  onSubmissionSuccess: (submission: RecitationSubmission) => void;
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
  isQuran?: boolean;
  isCoding?: boolean;
}

export const OralRecitationStudio: React.FC<OralRecitationStudioProps> = ({
  onSubmissionSuccess,
  onAddToast,
  isQuran = true,
  isCoding = false,
}) => {
  const { tenant } = useTenant();
  const { user } = useAuth();

  // Surah / Topic Selection
  const [selectedSurah, setSelectedSurah] = useState('Surah Al-Mulk (The Sovereignty)');
  const [ayahRange, setAyahRange] = useState('Ayahs 1 - 10');
  const [studentNotes, setStudentNotes] = useState('');

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  // Format MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
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
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setRecordedAudioUrl(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      setRecordedAudioUrl(null);
      setAudioBlob(null);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

      onAddToast({
        type: 'info',
        title: 'Microphone Active',
        message: 'Recitation recording in progress. Recite clearly with tajweed.',
      });
    } catch {
      onAddToast({
        type: 'error',
        title: 'Microphone Access Denied',
        message: 'Please allow microphone access in your browser to record oral recitation homework.',
      });
    }
  };

  // Stop Mic Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };

  // Discard Recording
  const handleDiscard = () => {
    setRecordedAudioUrl(null);
    setAudioBlob(null);
    setRecordingSeconds(0);
    setIsPlayingPreview(false);
  };

  // Toggle Preview Playback
  const handleTogglePreviewPlay = () => {
    if (!audioPreviewRef.current) return;
    if (isPlayingPreview) {
      audioPreviewRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      audioPreviewRef.current.play();
      setIsPlayingPreview(true);
    }
  };

  // Submit to Teacher
  const handleSubmitHomework = async () => {
    if (!recordedAudioUrl) {
      onAddToast({
        type: 'error',
        title: 'No Recording',
        message: 'Please record your recitation audio before submitting.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const submissionPayload = {
        userId: user?.id || 'std-active-live',
        studentId: user?.id || 'std-active-live',
        studentName: user?.name || 'Enrolled Student',
        surahNumber: isQuran ? (selectedSurah.includes('Mulk') ? 67 : selectedSurah.includes('Baqarah') ? 2 : 1) : 1,
        surahName: selectedSurah,
        ayahRange: ayahRange,
        audioUrl: recordedAudioUrl,
        durationSeconds: recordingSeconds,
        tenantId: tenant.id || tenant.subdomain,
        notes: studentNotes,
      };

      const result = await api.uploadRecitationAudio(submissionPayload as any);

      onAddToast({
        type: 'success',
        title: 'Recitation Submitted!',
        message: `Your recitation of ${selectedSurah} (${ayahRange}) was successfully submitted to your instructor for evaluation.`,
      });

      onSubmissionSuccess(result);
      handleDiscard();
      setStudentNotes('');
    } catch {
      onAddToast({
        type: 'error',
        title: 'Submission Failed',
        message: 'Could not upload audio recording. Please check connection and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 sm:p-7 space-y-6 bg-white border-slate-200 shadow-sm font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2 font-display">
            <Mic className="w-5 h-5 text-emerald-600" />
            {isQuran ? 'Oral Recitation & Homework Recording Studio' : 'Oral Assessment & Audio Lab Recorder'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {isQuran
              ? 'Record and review your assigned Surah recitation. Your assigned Ustadhah evaluates Makharij, Sifat, and Fluency.'
              : 'Record your oral presentation and concept explanation for faculty evaluation.'}
          </p>
        </div>
        <Badge variant="success" className="gap-1.5 self-start sm:self-auto py-1 px-3 text-xs font-bold">
          <Sparkles className="w-4 h-4" /> Ready to Record
        </Badge>
      </div>

      {/* Track & Ayah Range Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            {isQuran ? 'Assigned Surah / Chapter' : 'Module / Assignment Topic'}
          </label>
          <select
            value={selectedSurah}
            onChange={(e) => setSelectedSurah(e.target.value)}
            disabled={isRecording}
            className="w-full h-11 px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
          >
            {isQuran ? (
              <>
                <option value="Surah Al-Fatihah (The Opening)">Surah Al-Fatihah (The Opening)</option>
                <option value="Surah Al-Baqarah (The Cow)">Surah Al-Baqarah (The Cow)</option>
                <option value="Surah Ali 'Imran (Family of Imran)">Surah Ali 'Imran (Family of Imran)</option>
                <option value="Surah An-Nur (The Light)">Surah An-Nur (The Light)</option>
                <option value="Surah Yasin (Heart of the Quran)">Surah Yasin (Heart of the Quran)</option>
                <option value="Surah Al-Mulk (The Sovereignty)">Surah Al-Mulk (The Sovereignty)</option>
                <option value="Surah An-Naba' (The Tidings)">Surah An-Naba' (The Tidings)</option>
                <option value="Tuhfat Al-Atfal Tajweed Text">Tuhfat Al-Atfal Tajweed Text</option>
              </>
            ) : (
              <>
                <option value="Module 1: Foundations & Architecture">Module 1: Foundations & Architecture</option>
                <option value="Module 2: Applied Practicum Case Study">Module 2: Applied Practicum Case Study</option>
                <option value="Module 3: Oral Defense & Architecture Review">Module 3: Oral Defense & Architecture Review</option>
              </>
            )}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            {isQuran ? 'Ayah Range / Section' : 'Deliverable Range / Section'}
          </label>
          <input
            type="text"
            value={ayahRange}
            onChange={(e) => setAyahRange(e.target.value)}
            disabled={isRecording}
            placeholder={isQuran ? "e.g. Ayahs 1 - 10" : "e.g. Part 1 & 2"}
            className="w-full h-11 px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      {/* Recording Studio Center Stage */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-5 border border-slate-800 shadow-md">
        {/* State Animation Badge */}
        <div className="flex items-center gap-2">
          {isRecording ? (
            <span className="inline-flex items-center gap-2 bg-rose-500/20 text-rose-400 border border-rose-500/30 px-3 py-1 rounded-full text-xs font-bold font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              RECORDING LIVE • {formatTime(recordingSeconds)}
            </span>
          ) : recordedAudioUrl ? (
            <span className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> RECORDING READY ({formatTime(recordingSeconds)})
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 bg-slate-800 text-slate-400 px-3 py-1 rounded-full text-xs font-bold">
              READY TO RECORD
            </span>
          )}
        </div>

        {/* Live Audio Visualizer Waveform Simulation */}
        <div className="h-14 flex items-center justify-center gap-1.5 px-4 w-full max-w-md">
          {Array.from({ length: 28 }).map((_, i) => (
            <div
              key={i}
              className={`w-1.5 rounded-full transition-all duration-150 ${
                isRecording
                  ? 'bg-emerald-400 animate-pulse'
                  : recordedAudioUrl
                  ? 'bg-teal-500'
                  : 'bg-slate-800'
              }`}
              style={{
                height: isRecording
                  ? `${Math.max(12, Math.sin(i * 0.5 + recordingSeconds) * 45 + 15)}px`
                  : recordedAudioUrl
                  ? `${Math.max(10, ((i % 5) + 2) * 8)}px`
                  : '8px',
              }}
            />
          ))}
        </div>

        {/* Main Mic / Stop Control Buttons */}
        <div className="flex items-center gap-4">
          {!isRecording && !recordedAudioUrl && (
            <button
              type="button"
              onClick={startRecording}
              className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer ring-4 ring-emerald-500/30"
              title="Start Microphone Recording"
            >
              <Mic className="w-8 h-8" />
            </button>
          )}

          {isRecording && (
            <button
              type="button"
              onClick={stopRecording}
              className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer ring-4 ring-rose-500/30 animate-pulse"
              title="Stop Recording"
            >
              <Square className="w-7 h-7 fill-current" />
            </button>
          )}

          {recordedAudioUrl && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleTogglePreviewPlay}
                className="w-12 h-12 rounded-full bg-white text-slate-900 hover:bg-slate-100 flex items-center justify-center shadow-md transition-transform active:scale-95 cursor-pointer"
                title={isPlayingPreview ? "Pause Preview" : "Play Preview"}
              >
                {isPlayingPreview ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={handleDiscard}
                className="h-11 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Discard & Re-record"
              >
                <RotateCcw className="w-4 h-4" /> Re-record
              </button>
            </div>
          )}
        </div>

        {/* Hidden HTML5 Audio Element for playback preview */}
        {recordedAudioUrl && (
          <audio
            ref={audioPreviewRef}
            src={recordedAudioUrl}
            onEnded={() => setIsPlayingPreview(false)}
            className="hidden"
          />
        )}
      </div>

      {/* Optional Note to Ustadhah */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Notes or Questions for Instructor (Optional)
        </label>
        <textarea
          value={studentNotes}
          onChange={(e) => setStudentNotes(e.target.value)}
          rows={2}
          placeholder="e.g. Please listen closely to my Madd Lazim in Ayah 3..."
          className="w-full px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          onClick={handleSubmitHomework}
          disabled={!recordedAudioUrl || isSubmitting}
          isLoading={isSubmitting}
          variant="primary"
          className="h-11 px-6 rounded-xl text-sm font-bold gap-2"
        >
          <UploadCloud className="w-4 h-4" />
          {isQuran ? 'Submit Recitation to Ustadhah' : 'Submit Oral Recording to Faculty'}
        </Button>
      </div>
    </Card>
  );
};
