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
  ListTodo
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
    let interval: any = null;
    if (isInCall) {
      interval = setInterval(() => setSessionSeconds((prev) => prev + 1), 1000);
    } else {
      setSessionSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isInCall]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start Call Handler
  const handleStartCall = async () => {
    setIsInCall(true);
    setActiveTab('video');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Web Audio analyzer
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyser = audioCtx.createAnalyser();
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        analyser.fftSize = 64;
        audioContextRef.current = audioCtx;
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const checkVolume = () => {
          if (analyserRef.current) {
            analyserRef.current.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
            setAudioLevel(sum / dataArray.length);
            requestAnimationFrame(checkVolume);
          }
        };
        checkVolume();
      } catch (err) {
        console.warn('Audio analyzer error:', err);
      }

      // LiveKit Cloud WebRTC
      try {
        const tokenRes = await fetch(
          `/api/livekit/token?room=${encodeURIComponent(roomTitle)}&username=${encodeURIComponent(currentUserName)}&role=${userRole}`
        );
        if (tokenRes.ok) {
          const { token, wsUrl } = await tokenRes.json();
          if (token && wsUrl) {
            const room = new Room({ adaptiveStream: true, dynacast: true });
            await room.connect(wsUrl, token);
            await room.localParticipant.enableCameraAndMicrophone();
            livekitRoomRef.current = room;
          }
        }
      } catch (lkErr) {
        console.warn('LiveKit cloud fallback:', lkErr);
      }
    } catch (err) {
      console.warn('Camera / mic permission fallback:', err);
    }
  };

  // Leave Call Handler
  const handleLeaveCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (livekitRoomRef.current) {
      livekitRoomRef.current.disconnect();
    }
    setIsInCall(false);
    setScreenSharing(false);
    setActiveTab('forum');
  };

  // Hardware Toggles
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
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 font-sans">
      {/* 1. CLEAN MODERN TOP HEADER (Light Mode) */}
      <header className="h-14 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
            {niche === 'coding' ? <Code className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-extrabold text-slate-900 leading-none">{roomTitle}</h2>
              {isInCall ? (
                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  Live Video ({formatTimer(sessionSeconds)})
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  Class Forum
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-500 font-medium">{courseTitle}</p>
          </div>
        </div>

        {/* Center Smart Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveTab('forum')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'forum' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
            <span>Discussion</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('video');
              if (!isInCall) handleStartCall();
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'video' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            <VideoIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span>Live Video</span>
          </button>

          <button
            onClick={() => setActiveTab('agenda')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'agenda' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            <ListTodo className="w-3.5 h-3.5 text-amber-600" />
            <span>Agenda</span>
          </button>

          <button
            onClick={() => setActiveTab('whiteboard')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'whiteboard' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            <PenTool className="w-3.5 h-3.5 text-purple-600" />
            <span>Whiteboard</span>
          </button>

          <button
            onClick={() => setActiveTab('workspace')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'workspace' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Workspace</span>
          </button>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
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
              className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1 transition-colors"
            >
              Exit
            </button>
          )}
        </div>
      </header>

      {/* 2. BODY CONTENT */}
      <div className="flex-1 flex overflow-hidden p-4">
        {/* Tab 1: Discussion Forum */}
        {activeTab === 'forum' && (
          <div className="flex-1 flex flex-col justify-between bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden max-w-5xl mx-auto w-full">
            <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span className="text-xs font-bold text-slate-900">Weekly Class Thread & Resource Hub</span>
              </div>
              {!isInCall && (
                <button
                  onClick={handleStartCall}
                  className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <VideoIcon className="w-3.5 h-3.5" /> Start Live Meeting &rarr;
                </button>
              )}
            </div>

            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
              {forumMessages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {msg.sender.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
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
                    <div className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                      {msg.text}
                    </div>
                    {msg.attachment && (
                      <div className="inline-flex items-center gap-2 p-2 rounded-lg bg-slate-100 text-xs text-emerald-700 border border-slate-200">
                        <FileText className="w-3.5 h-3.5" />
                        <span className="font-semibold text-slate-800">{msg.attachment.name}</span>
                        <span className="text-[10px] text-slate-500">({msg.attachment.size})</span>
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
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Live Video Call */}
        {activeTab === 'video' && (
          <div className="flex-1 flex flex-col justify-between bg-white rounded-2xl border border-slate-200 p-4 shadow-xs max-w-5xl mx-auto w-full overflow-hidden">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center justify-center p-2">
              {/* Local User Camera Card */}
              <div className="relative rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden aspect-video flex items-center justify-center shadow-md">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${!videoEnabled ? 'hidden' : ''}`}
                />
                {!videoEnabled && (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center font-bold text-lg">
                      {currentUserName.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-slate-300">{currentUserName}</span>
                  </div>
                )}
                <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[11px] font-bold">
                  <div
                    className="w-2 h-2 rounded-full bg-emerald-500 transition-transform"
                    style={{ transform: `scale(${1 + Math.min(audioLevel / 20, 1.5)})` }}
                  />
                  <span>{currentUserName} (You)</span>
                  {!micEnabled && <MicOff className="w-3 h-3 text-red-400 ml-1" />}
                </div>
              </div>

              {/* Instructor Remote Video Card */}
              <div className="relative rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden aspect-video flex items-center justify-center shadow-md">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-lg ring-2 ring-emerald-500/40">
                    {niche === 'coding' ? 'SJ' : 'AR'}
                  </div>
                  <span className="text-xs font-bold text-slate-200">
                    {niche === 'coding' ? 'Sarah Jenkins' : 'Shaykh Dr. Abdul Rahman'}
                  </span>
                  <span className="text-[10px] text-emerald-400">Instructor (Speaking...)</span>
                </div>
                <div className="absolute bottom-3 left-3 bg-slate-950/80 px-2.5 py-1 rounded-full text-white text-[11px] font-bold">
                  {niche === 'coding' ? 'Sarah Jenkins' : 'Shaykh Dr. Abdul Rahman'}
                </div>
              </div>

              {/* Screen Share Card */}
              {screenSharing && (
                <div className="relative rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden aspect-video flex items-center justify-center col-span-1 sm:col-span-2">
                  <video ref={screenShareVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] font-bold text-emerald-400">
                    Live Screen Share Active
                  </div>
                </div>
              )}
            </div>

            {/* In-Call Controls Bar */}
            <div className="h-14 flex items-center justify-center gap-2.5 bg-slate-100 rounded-2xl border border-slate-200 p-1.5 max-w-lg mx-auto w-full mt-3">
              <button
                onClick={toggleMic}
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                  micEnabled ? 'bg-white text-slate-900 shadow-xs' : 'bg-red-600 text-white'
                }`}
                title={micEnabled ? 'Mute Mic' : 'Unmute Mic'}
              >
                {micEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>

              <button
                onClick={toggleVideo}
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                  videoEnabled ? 'bg-white text-slate-900 shadow-xs' : 'bg-red-600 text-white'
                }`}
                title={videoEnabled ? 'Turn Off Video' : 'Turn On Video'}
              >
                {videoEnabled ? <VideoIcon className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </button>

              <button
                onClick={toggleScreenShare}
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                  screenSharing ? 'bg-emerald-600 text-white' : 'bg-white text-slate-900 shadow-xs'
                }`}
                title="Share Screen"
              >
                <MonitorUp className="w-4 h-4" />
              </button>

              <button
                onClick={() => setHandRaised(!handRaised)}
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                  handRaised ? 'bg-amber-500 text-white animate-bounce' : 'bg-white text-slate-900 shadow-xs'
                }`}
                title="Raise Hand"
              >
                <Hand className="w-4 h-4" />
              </button>

              <div className="h-5 w-px bg-slate-300" />

              <button
                onClick={handleLeaveCall}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <PhoneOff className="w-3.5 h-3.5" />
                <span>Leave</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Session Agenda & Notes */}
        {activeTab === 'agenda' && (
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-4xl mx-auto w-full space-y-5 overflow-y-auto">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Session Learning Agenda</h3>
              <p className="text-xs text-slate-500">Track and complete daily module objectives during class.</p>
            </div>

            <div className="space-y-3">
              {niche === 'coding' ? (
                <>
                  <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600" />
                    <span className="text-xs font-semibold text-slate-800">Review React 19 Server Actions architecture & mutation lifecycle</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600" />
                    <span className="text-xs font-semibold text-slate-800">Implement optimistic UI updates with useOptimistic hook</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                    <input type="checkbox" className="rounded border-slate-300 text-blue-600" />
                    <span className="text-xs font-semibold text-slate-800">Pair programming: Solve binary tree inversion algorithm challenge</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                    <input type="checkbox" className="rounded border-slate-300 text-blue-600" />
                    <span className="text-xs font-semibold text-slate-800">Deploy sandbox backend service to containerized staging</span>
                  </label>
                </>
              ) : (
                <>
                  <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-emerald-600" />
                    <span className="text-xs font-semibold text-slate-800">Surah Al-Fatihah recitation warm-up & Ayah 1-7 review</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-emerald-600" />
                    <span className="text-xs font-semibold text-slate-800">Ahkam Al-Nun Al-Sakinah (Idhhar & Idgham rules practice)</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                    <input type="checkbox" className="rounded border-slate-300 text-emerald-600" />
                    <span className="text-xs font-semibold text-slate-800">Individual student oral recitation correction with Ustadh</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                    <input type="checkbox" className="rounded border-slate-300 text-emerald-600" />
                    <span className="text-xs font-semibold text-slate-800">Weekly Muraja&apos;ah recording submission</span>
                  </label>
                </>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Whiteboard */}
        {activeTab === 'whiteboard' && (
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-2 shadow-xs max-w-5xl mx-auto w-full overflow-hidden">
            <InteractiveWhiteboard />
          </div>
        )}

        {/* Tab 5: Workspace Plugin */}
        {activeTab === 'workspace' && (
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-4 shadow-xs max-w-5xl mx-auto w-full overflow-y-auto">
            {renderWorkspacePlugin || (
              <div className="text-center py-16 text-slate-400 text-xs">
                No specialty workspace plugin configured for this room.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
