import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  MonitorUp,
  Hand,
  MessageSquare,
  Users,
  PhoneOff,
  Sparkles,
  PenTool,
  Code,
  BookOpen,
  Send,
  Radio,
  FileText,
  Pin,
  PhoneCall,
  CheckCircle2,
  ListTodo,
  Volume2
} from 'lucide-react';
import { InteractiveWhiteboard } from '../../collaboration/InteractiveWhiteboard';
import { ClassroomParticipant } from '../../types';
import { Room } from 'livekit-client';
import { Button, Card, Badge } from '../ui';

interface LiveClassroomHubProps {
  roomTitle?: string;
  courseTitle?: string;
  userRole?: 'teacher' | 'student';
  currentUserName?: string;
  niche?: 'quran' | 'coding' | 'general' | 'language';
  onLeaveRoom?: () => void;
  renderWorkspacePlugin?: React.ReactNode;
}

export const LiveClassroomHub: React.FC<LiveClassroomHubProps> = ({
  roomTitle = 'Live Interactive Session',
  courseTitle = 'Advanced Curriculum Track',
  userRole = 'student',
  currentUserName = 'Zayd Al-Mansoor',
  niche = 'quran',
  onLeaveRoom,
  renderWorkspacePlugin
}) => {
  // Classroom Tabs
  const [activeTab, setActiveTab] = useState<'forum' | 'video' | 'agenda' | 'whiteboard' | 'workspace'>('forum');

  // Call & Media State
  const [isInCall, setIsInCall] = useState<boolean>(false);
  const [micEnabled, setMicEnabled] = useState<boolean>(true);
  const [videoEnabled, setVideoEnabled] = useState<boolean>(true);
  const [screenSharing, setScreenSharing] = useState<boolean>(false);
  const [handRaised, setHandRaised] = useState<boolean>(false);
  const [sessionSeconds, setSessionSeconds] = useState<number>(0);
  const [audioLevel, setAudioLevel] = useState<number>(0);

  // Video Element Refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const screenShareVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const livekitRoomRef = useRef<Room | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Messages Stream
  const [forumMessages, setForumMessages] = useState<{
    id: string;
    sender: string;
    role: 'teacher' | 'student';
    text: string;
    time: string;
    pinned?: boolean;
    attachment?: { name: string; size: string };
  }[]>([
    {
      id: 'm-1',
      sender: niche === 'coding' ? 'Sarah Jenkins' : 'Shaykh Dr. Abdul Rahman',
      role: 'teacher',
      text: niche === 'coding' 
        ? 'Welcome to the Live Coding Session! Today we cover React 19 Server Actions and async data mutations.' 
        : 'Assalamu Alaikum. Welcome everyone to today\'s live halaqah! We will practice Tajweed rules and oral recitations.',
      time: '10:00 AM',
      pinned: true,
      attachment: niche === 'coding' ? { name: 'React19_Server_Actions.md', size: '42 KB' } : { name: 'Tajweed_Rules_Guide.pdf', size: '1.2 MB' }
    },
    {
      id: 'm-2',
      sender: 'Fatima Zahra',
      role: 'student',
      text: niche === 'coding' ? 'Ready with my local sandbox repository.' : 'Wa Alaikum Assalam Ustadh, completed the recitation homework.',
      time: '10:02 AM'
    }
  ]);
  const [messageInput, setMessageInput] = useState<string>('');

  // Call timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isInCall) {
      interval = setInterval(() => {
        setSessionSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setSessionSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isInCall]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // WebRTC & Camera Initialization
  const handleStartCall = async () => {
    setIsInCall(true);
    setActiveTab('video');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Audio analyser
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        analyserRef.current = analyser;

        const buffer = new Uint8Array(analyser.frequencyBinCount);
        const checkLevel = () => {
          if (!audioContextRef.current) return;
          analyser.getByteFrequencyData(buffer);
          let sum = 0;
          for (let i = 0; i < buffer.length; i++) sum += buffer[i];
          const avg = sum / buffer.length;
          setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
          requestAnimationFrame(checkLevel);
        };
        requestAnimationFrame(checkLevel);
      }

      // Connect to LiveKit Cloud WebRTC SFU
      const roomName = `room-${roomTitle.toLowerCase().replace(/\s+/g, '-')}`;
      const tokenRes = await fetch(
        `/api/livekit/token?room=${encodeURIComponent(roomName)}&username=${encodeURIComponent(currentUserName)}`
      );
      if (tokenRes.ok) {
        const { token, wsUrl } = await tokenRes.json();
        if (token && wsUrl) {
          const room = new Room();
          livekitRoomRef.current = room;
          await room.connect(wsUrl, token);
          await room.localParticipant.enableCameraAndMicrophone();
        }
      }
    } catch (err) {
      console.warn('Camera/Audio fallback enabled:', err);
    }
  };

  const handleLeaveCall = () => {
    setIsInCall(false);
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (livekitRoomRef.current) {
      livekitRoomRef.current.disconnect();
      livekitRoomRef.current = null;
    }
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setMicEnabled(audioTrack.enabled);
      }
    } else {
      setMicEnabled(!micEnabled);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);
      }
    } else {
      setVideoEnabled(!videoEnabled);
    }
  };

  const toggleScreenShare = async () => {
    if (!screenSharing) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStreamRef.current = stream;
        if (screenShareVideoRef.current) {
          screenShareVideoRef.current.srcObject = stream;
        }
        setScreenSharing(true);
        stream.getVideoTracks()[0].onended = () => setScreenSharing(false);
      } catch (err) {
        console.warn('Screen share canceled:', err);
      }
    } else {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      setScreenSharing(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setForumMessages([
      ...forumMessages,
      {
        id: `msg-${Date.now()}`,
        sender: currentUserName,
        role: userRole,
        text: messageInput.trim(),
        time: now,
      }
    ]);
    setMessageInput('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* 1. CLEAN MODERN TOP HEADER (Light Mode & Highly Responsive) */}
      <header className="bg-white border-b border-slate-200 px-3 sm:px-6 py-2.5 sm:py-3 flex flex-col md:flex-row md:items-center justify-between gap-2.5 shrink-0 shadow-xs">
        {/* Title & Status */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
              {niche === 'coding' ? <Code className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> : <BookOpen className="w-4 h-4 sm:w-4.5 sm:h-4.5" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate leading-none">{roomTitle}</h2>
                {isInCall ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    Live ({formatTimer(sessionSeconds)})
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                    Forum
                  </span>
                )}
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate">{courseTitle}</p>
            </div>
          </div>

          {/* Quick Call Action on Mobile */}
          <div className="flex md:hidden items-center gap-1.5">
            {!isInCall ? (
              <Button
                variant="primary"
                size="sm"
                onClick={handleStartCall}
                leftIcon={<PhoneCall className="w-3.5 h-3.5" />}
                className="font-bold text-xs px-3"
              >
                Call
              </Button>
            ) : (
              <Button
                variant="danger"
                size="sm"
                onClick={handleLeaveCall}
                leftIcon={<PhoneOff className="w-3.5 h-3.5" />}
                className="font-bold text-xs px-3"
              >
                Leave
              </Button>
            )}
          </div>
        </div>

        {/* Center Smart Tab Pills — Horizontally Scrollable on Mobile */}
        <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 overflow-x-auto no-scrollbar max-w-full">
          <button
            onClick={() => setActiveTab('forum')}
            className={`px-3 py-1.5 sm:py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap select-none ${
              activeTab === 'forum' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>Discussion</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('video');
              if (!isInCall) handleStartCall();
            }}
            className={`px-3 py-1.5 sm:py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap select-none ${
              activeTab === 'video' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            <VideoIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Live Video</span>
          </button>

          <button
            onClick={() => setActiveTab('agenda')}
            className={`px-3 py-1.5 sm:py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap select-none ${
              activeTab === 'agenda' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            <ListTodo className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Agenda</span>
          </button>

          <button
            onClick={() => setActiveTab('whiteboard')}
            className={`px-3 py-1.5 sm:py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap select-none ${
              activeTab === 'whiteboard' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            <PenTool className="w-3.5 h-3.5 text-purple-600 shrink-0" />
            <span>Whiteboard</span>
          </button>

          <button
            onClick={() => setActiveTab('workspace')}
            className={`px-3 py-1.5 sm:py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap select-none ${
              activeTab === 'workspace' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Workspace</span>
          </button>
        </div>

        {/* Desktop Call Actions */}
        <div className="hidden md:flex items-center gap-2">
          {!isInCall ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleStartCall}
              leftIcon={<PhoneCall className="w-3.5 h-3.5" />}
              className="font-bold text-xs"
            >
              Start Class Call
            </Button>
          ) : (
            <Button
              variant="danger"
              size="sm"
              onClick={handleLeaveCall}
              leftIcon={<PhoneOff className="w-3.5 h-3.5" />}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
            >
              Leave Call
            </Button>
          )}

          {onLeaveRoom && (
            <button
              onClick={onLeaveRoom}
              className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1 transition-colors cursor-pointer"
            >
              Exit
            </button>
          )}
        </div>
      </header>

      {/* 2. BODY CONTENT */}
      <div className="flex-1 flex overflow-hidden p-2.5 sm:p-4 min-w-0">
        {/* Tab 1: Discussion Forum */}
        {activeTab === 'forum' && (
          <div className="flex-1 flex flex-col justify-between bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden max-w-5xl mx-auto w-full">
            <div className="p-3.5 sm:p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span className="text-xs sm:text-sm font-bold text-slate-900">Class Thread & Resources</span>
              </div>
              {!isInCall && (
                <button
                  onClick={handleStartCall}
                  className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <VideoIcon className="w-3.5 h-3.5" /> Start Video &rarr;
                </button>
              )}
            </div>

            <div className="flex-1 p-3.5 sm:p-6 overflow-y-auto space-y-4">
              {forumMessages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-2.5 sm:gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {msg.sender.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs text-slate-900">{msg.sender}</span>
                      {msg.role === 'teacher' && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                          Instructor
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400">{msg.time}</span>
                      {msg.pinned && (
                        <span className="text-[10px] text-amber-600 font-bold flex items-center gap-0.5">
                          <Pin className="w-2.5 h-2.5" /> Pinned
                        </span>
                      )}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 sm:p-3.5 rounded-xl border border-slate-200/80 break-words">
                      {msg.text}
                    </div>
                    {msg.attachment && (
                      <div className="inline-flex items-center gap-2 p-2 rounded-lg bg-slate-100 text-xs text-emerald-700 border border-slate-200">
                        <FileText className="w-3.5 h-3.5 shrink-0" />
                        <span className="font-semibold text-slate-800 truncate">{msg.attachment.name}</span>
                        <span className="text-[10px] text-slate-500 shrink-0">({msg.attachment.size})</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={`Post update to ${roomTitle}...`}
                className="flex-1 px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
              />
              <button
                type="submit"
                className="p-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Live Video Call */}
        {activeTab === 'video' && (
          <div className="flex-1 flex flex-col justify-between bg-slate-900 rounded-2xl overflow-hidden relative shadow-xl">
            {/* Video Streams Grid */}
            <div className="flex-1 p-3 sm:p-4 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 overflow-y-auto items-center justify-center">
              {/* Local Participant Card */}
              <div className="relative aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center shadow-lg w-full max-h-[380px] mx-auto">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${!videoEnabled ? 'hidden' : ''}`}
                />
                {!videoEnabled && (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-lg">
                      {currentUserName.charAt(0)}
                    </div>
                    <span className="text-xs text-slate-400 font-semibold">{currentUserName} (Camera Off)</span>
                  </div>
                )}

                {/* Floating Indicators */}
                <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-xl text-white text-xs font-bold flex items-center gap-2 border border-slate-700/60">
                  <span>{currentUserName} (You)</span>
                  {micEnabled ? (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                      <Volume2 className="w-3 h-3" />
                      {audioLevel}%
                    </span>
                  ) : (
                    <MicOff className="w-3 h-3 text-red-400" />
                  )}
                </div>

                {handRaised && (
                  <div className="absolute top-3 right-3 bg-amber-500 text-slate-950 p-2 rounded-xl font-bold shadow-lg animate-bounce">
                    <Hand className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Remote Participant / Teacher Stream Card */}
              <div className="relative aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center shadow-lg w-full max-h-[380px] mx-auto">
                {screenSharing ? (
                  <video
                    ref={screenShareVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain bg-black"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2.5">
                    <div className="w-16 h-16 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center font-bold text-xl ring-2 ring-emerald-500/30">
                      {niche === 'coding' ? 'SJ' : 'AR'}
                    </div>
                    <span className="text-xs font-bold text-white">
                      {niche === 'coding' ? 'Sarah Jenkins (Lead Mentor)' : 'Shaykh Dr. Abdul Rahman (Lead Qari)'}
                    </span>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Livekit SFU Stream Active
                    </span>
                  </div>
                )}

                <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-xl text-white text-xs font-bold flex items-center gap-2 border border-slate-700/60">
                  <span>{niche === 'coding' ? 'Sarah Jenkins (Instructor)' : 'Shaykh Abdul Rahman'}</span>
                  <Volume2 className="w-3 h-3 text-emerald-400" />
                </div>
              </div>
            </div>

            {/* Bottom Touch-Friendly Floating Media Controls Bar */}
            <div className="p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md border-t border-slate-800/80 flex items-center justify-center gap-2.5 sm:gap-4 shrink-0">
              <button
                onClick={toggleMic}
                className={`p-3 sm:p-3.5 rounded-2xl font-bold transition-all cursor-pointer select-none active:scale-95 ${
                  micEnabled
                    ? 'bg-slate-800 hover:bg-slate-700 text-white'
                    : 'bg-red-600 text-white hover:bg-red-700 ring-2 ring-red-400/40'
                }`}
                title={micEnabled ? 'Mute Mic' : 'Unmute Mic'}
              >
                {micEnabled ? <Mic className="w-4.5 h-4.5 sm:w-5 sm:h-5" /> : <MicOff className="w-4.5 h-4.5 sm:w-5 sm:h-5" />}
              </button>

              <button
                onClick={toggleVideo}
                className={`p-3 sm:p-3.5 rounded-2xl font-bold transition-all cursor-pointer select-none active:scale-95 ${
                  videoEnabled
                    ? 'bg-slate-800 hover:bg-slate-700 text-white'
                    : 'bg-red-600 text-white hover:bg-red-700 ring-2 ring-red-400/40'
                }`}
                title={videoEnabled ? 'Turn Camera Off' : 'Turn Camera On'}
              >
                {videoEnabled ? <VideoIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5" /> : <VideoOff className="w-4.5 h-4.5 sm:w-5 sm:h-5" />}
              </button>

              <button
                onClick={toggleScreenShare}
                className={`p-3 sm:p-3.5 rounded-2xl font-bold transition-all cursor-pointer select-none active:scale-95 ${
                  screenSharing ? 'bg-emerald-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
                title="Share Screen"
              >
                <MonitorUp className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </button>

              <button
                onClick={() => setHandRaised(!handRaised)}
                className={`p-3 sm:p-3.5 rounded-2xl font-bold transition-all cursor-pointer select-none active:scale-95 ${
                  handRaised ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
                title="Raise Hand"
              >
                <Hand className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </button>

              <button
                onClick={handleLeaveCall}
                className="px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-2 shadow-lg transition-all cursor-pointer select-none active:scale-95"
                title="End Call"
              >
                <PhoneOff className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline text-xs sm:text-sm">End Call</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Agenda & Notes */}
        {activeTab === 'agenda' && (
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 overflow-y-auto space-y-6 max-w-4xl mx-auto w-full shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Session Learning Agenda & Milestones</h3>
                <p className="text-xs text-slate-500 mt-0.5">Key topics and oral/coding evaluation milestones for today's cohort.</p>
              </div>
              <Badge variant="success">In Progress</Badge>
            </div>

            <div className="space-y-3">
              {[
                { title: niche === 'coding' ? 'Deep Dive into React 19 useActionState & form hooks' : 'Surah Al-Mulk: Precision Tajweed Review (Ayahs 1-10)', done: true },
                { title: niche === 'coding' ? 'Building optimistic UI updates with Server Actions' : 'Makharij Drills: Throat letters (ح، خ، ع، غ)', done: true },
                { title: niche === 'coding' ? 'Interactive Student Code Submissions Evaluation' : 'Individual 1-on-1 Recitation Audits & Grading', done: false },
                { title: niche === 'coding' ? 'Q&A, Homework Assignment Briefing & Pull Request reviews' : 'Oral homework assignment and recorded Looper submission', done: false }
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-slate-50/80 flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${item.done ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'}`}>
                    {item.done && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <p className={`text-xs sm:text-sm font-bold ${item.done ? 'text-slate-800 line-through' : 'text-slate-900'}`}>{item.title}</p>
                    <span className="text-[10px] text-slate-500">Scheduled: 15 mins</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Whiteboard */}
        {activeTab === 'whiteboard' && (
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col">
            <InteractiveWhiteboard
              roomName={`whiteboard-${roomTitle.toLowerCase().replace(/\s+/g, '-')}`}
              teacherName={userRole === 'teacher' ? currentUserName : undefined}
              isTeacher={userRole === 'teacher'}
            />
          </div>
        )}

        {/* Tab 5: Interactive Workspace Plugin */}
        {activeTab === 'workspace' && (
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-3 sm:p-6 overflow-y-auto shadow-xs">
            {renderWorkspacePlugin || (
              <div className="p-8 text-center text-slate-400 space-y-3">
                <Sparkles className="w-8 h-8 mx-auto text-emerald-500" />
                <p className="text-xs sm:text-sm font-semibold">Interactive Workspace Plugin Enabled for this Session.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveClassroomHub;
