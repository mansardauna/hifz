import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Play, Pause, Trash2, CheckCircle2, RotateCcw, Volume2 } from 'lucide-react';
import { Button, Badge } from '../../../components/ui';

interface VoiceFeedbackRecorderProps {
  onAudioRecorded: (audioUrl: string, durationSec: number) => void;
  onDiscardAudio: () => void;
  initialAudioUrl?: string;
}

export const VoiceFeedbackRecorder: React.FC<VoiceFeedbackRecorderProps> = ({
  onAudioRecorded,
  onDiscardAudio,
  initialAudioUrl
}) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(initialAudioUrl || null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (initialAudioUrl) {
      setAudioUrl(initialAudioUrl);
    }
  }, [initialAudioUrl]);

  useEffect(() => {
    if (isRecording) {
      setRecordingDuration(0);
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const handleStartRecording = () => {
    setIsRecording(true);
    setAudioUrl(null);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // In browser/mock environment, generate high-fidelity simulated voice audio note
    const simulatedAudioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
    setAudioUrl(simulatedAudioUrl);
    onAudioRecorded(simulatedAudioUrl, Math.max(recordingDuration, 1));
  };

  const handleTogglePlay = () => {
    if (!audioPlayerRef.current) return;
    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleDiscard = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    setAudioUrl(null);
    setIsPlaying(false);
    setRecordingDuration(0);
    onDiscardAudio();
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-200">Instructor Voice Feedback</h5>
            <p className="text-[11px] text-slate-400">Record a personalized voice critique for the student</p>
          </div>
        </div>

        {audioUrl && (
          <Badge variant="success" className="gap-1">
            <CheckCircle2 className="w-3 h-3" /> Voice Note Ready
          </Badge>
        )}
      </div>

      {!audioUrl && !isRecording && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleStartRecording}
          className="w-full gap-2 border-dashed border-slate-700 hover:border-emerald-500 hover:bg-emerald-500/10 text-slate-300 hover:text-emerald-300"
        >
          <Mic className="w-4 h-4 text-emerald-400" /> Start Recording Voice Note
        </Button>
      )}

      {isRecording && (
        <div className="flex items-center justify-between bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
            <span className="text-xs font-mono font-bold text-rose-300">
              Recording... {formatTime(recordingDuration)}
            </span>
          </div>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={handleStopRecording}
            className="gap-1.5 text-xs py-1"
          >
            <MicOff className="w-3.5 h-3.5" /> Stop & Attach
          </Button>
        </div>
      )}

      {audioUrl && !isRecording && (
        <div className="flex items-center justify-between bg-slate-800/80 border border-slate-700/60 p-2.5 rounded-xl">
          <audio
            ref={audioPlayerRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleTogglePlay}
              className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow transition-transform active:scale-95"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <span className="text-xs font-mono text-slate-300">
              {formatTime(recordingDuration || 32)} Voice Note
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleStartRecording}
              className="p-1.5 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-700/50 transition-colors"
              title="Re-record"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleDiscard}
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-700/50 transition-colors"
              title="Discard audio"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
