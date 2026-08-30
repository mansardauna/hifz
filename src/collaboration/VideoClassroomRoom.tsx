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
  Settings,
  Sparkles,
  Layout,
  Maximize2,
  PenTool,
  Volume2,
  Code,
  BookOpen,
  Send,
  Radio,
  Camera,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Phone,
  PhoneCall,
  Calendar,
  Paperclip,
  Smile,
  FileText,
  Pin,
  Clock,
  ChevronRight,
  MoreVertical,
  Plus
} from 'lucide-react';
import { InteractiveWhiteboard } from './InteractiveWhiteboard';
import { ClassroomParticipant } from '../types';
import { Room, RoomEvent, Track, createLocalTracks, LocalVideoTrack, LocalAudioTrack } from 'livekit-client';
import { Button, Card, Badge } from '../components/ui';

interface VideoClassroomRoomProps {
  roomTitle?: string;
  courseTitle?: string;
  userRole?: 'teacher' | 'student';
  currentUserName?: string;
  niche?: 'quran' | 'coding' | 'general' | 'language';
  onLeaveRoom?: () => void;
  renderWorkspacePlugin?: React.ReactNode;
}

export const VideoClassroomRoom: React.FC<VideoClassroomRoomProps> = ({
  roomTitle = 'Live Tajweed & Hifz Halaqah',
  courseTitle = 'Advanced Sanad Mastery Track',
  userRole = 'student',
  currentUserName = 'Zayd Al-Mansoor',
  niche = 'quran',
  onLeaveRoom,
  renderWorkspacePlugin
}) => {
  // Call State (Teams-style on-demand call)
  const [isInCall, setIsInCall] = useState<boolean>(false);
  const [forumTab, setForumTab] = useState<'chat' | 'whiteboard' | 'workspace' | 'files'>('chat');

  // Media Hardware State
  const [micEnabled, setMicEnabled] = useState<boolean>(true);
  const [videoEnabled, setVideoEnabled] = useState<boolean>(true);
  const [screenSharing, setScreenSharing] = useState<boolean>(false);
  const [handRaised, setHandRaised] = useState<boolean>(false);
  const [activeCallTab, setActiveCallTab] = useState<'video-grid' | 'whiteboard' | 'workspace'>('video-grid');
  const [showInCallChat, setShowInCallChat] = useState<boolean>(false);
  const [sessionSeconds, setSessionSeconds] = useState<number>(0);

  // WebRTC & Audio
  const [livekitConnected, setLivekitConnected] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error' | 'local_only'>('connecting');
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);

  // Video Element Refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const screenShareVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const livekitRoomRef = useRef<Room | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Forum Chat Messages Stream
  const [forumMessages, setForumMessages] = useState<{
    id: string;
    sender: string;
    role: 'teacher' | 'student';
    avatar?: string;
    text: string;
    time: string;
    pinned?: boolean;
    attachment?: { name: string; size: string };
  }[]>([
    {
      id: 'm-1',
      sender: 'Shaykh Dr. Abdul Rahman',
      role: 'teacher',
      text: 'Assalamu Alaikum wa Rahmatullah. Welcome everyone to the weekly Halaqah channel! Today we will review Surah Al-Fatihah and practice Tajweed rules for Nun Sakinah.',
      time: '09:45 AM',
      pinned: true,
      attachment: { name: 'Tajweed_Nun_Sakinah_Rules.pdf', size: '1.2 MB' }
    },
    {
      id: 'm-2',
      sender: 'Fatima Zahra',
      role: 'student',
      text: 'Wa Alaikum Assalam Ustadh! I completed the looper recitation homework for Ayahs 1 to 7.',
      time: '09:50 AM'
    },
    {
      id: 'm-3',
      sender: 'Zayd Al-Mansoor',
      role: 'student',
      text: 'Ready for today’s oral correction session.',
      time: '09:55 AM'
    }
  ]);
  const [messageInput, setMessageInput] = useState<string>('');

  // Participants list
  const [remoteParticipants, setRemoteParticipants] = useState<ClassroomParticipant[]>([
    {
      id: 'p-instructor',
      name: 'Shaykh Dr. Abdul Rahman',
      role: 'teacher',
      audioEnabled: true,
      videoEnabled: true,
      screenSharing: false,
    },
    {
      id: 'p-peer-1',
      name: 'Fatima Zahra',
      role: 'student',
      audioEnabled: false,
      videoEnabled: true,
      screenSharing: false,
    },
    {
      id: 'p-peer-2',
      name: 'Umar Khalid',
      role: 'student',
      audioEnabled: false,
      videoEnabled: false,
      screenSharing: false,
    }
  ]);

  // Session timer for active call
  useEffect(() => {
    let interval: any = null;
    if (isInCall) {
      interval = setInterval(() => {
        setSessionSeconds((prev) => prev + 1);
      }, 1000);
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
    setMediaError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Audio volume analyzer
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

      // Connect LiveKit Cloud
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
            setLivekitConnected(true);
            setConnectionStatus('connected');
          }
        }
      } catch (lkErr) {
        console.warn('LiveKit cloud fallback:', lkErr);
        setConnectionStatus('local_only');
      }
    } catch (err: any) {
      console.warn('Hardware media error:', err);
      setMediaError(err.message || 'Camera / mic access not granted');
      setConnectionStatus('local_only');
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
        stream.getVideoTracks()[0].onended = () => {
          setScreenSharing(false);
        };
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
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: currentUserName,
      role: userRole,
      text: messageInput.trim(),
      time: now,
    };
    setForumMessages([...forumMessages, newMsg]);
    setMessageInput('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 font-sans overflow-hidden">
      {/* 1. TOP HEADER NAVIGATION (Teams-Style) */}
      <header className="h-14 bg-slate-950 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
            {niche === 'coding' ? <Code className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-extrabold text-white leading-none">{roomTitle}</h2>
              {isInCall ? (
                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  Live Call ({formatTimer(sessionSeconds)})
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  Discussion Hub
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 font-medium">{courseTitle}</p>
          </div>
        </div>

        {/* Center / Navigation Tabs (When not in call) */}
        {!isInCall && (
          <div className="hidden md:flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-bold text-slate-400">
            <button
              onClick={() => setForumTab('chat')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                forumTab === 'chat' ? 'bg-slate-800 text-white shadow-xs' : 'hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Channel Forum</span>
            </button>

            <button
              onClick={() => setForumTab('whiteboard')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                forumTab === 'whiteboard' ? 'bg-slate-800 text-white shadow-xs' : 'hover:text-slate-200'
              }`}
            >
              <PenTool className="w-3.5 h-3.5 text-indigo-400" />
              <span>Whiteboard</span>
            </button>

            <button
              onClick={() => setForumTab('workspace')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                forumTab === 'workspace' ? 'bg-slate-800 text-white shadow-xs' : 'hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Class Workspace</span>
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {!isInCall ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleStartCall}
              leftIcon={<VideoIcon className="w-3.5 h-3.5" />}
              className="bg-emerald-600 hover:bg-emerald-500 shadow-md font-bold text-xs"
            >
              Start Class Call
            </Button>
          ) : (
            <Button
              variant="danger"
              size="sm"
              onClick={handleLeaveCall}
              leftIcon={<PhoneOff className="w-3.5 h-3.5" />}
              className="bg-red-600 hover:bg-red-500 font-bold text-xs"
            >
              Leave Call
            </Button>
          )}

          {onLeaveRoom && (
            <button
              onClick={onLeaveRoom}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 transition-colors"
            >
              Exit
            </button>
          )}
        </div>
      </header>

      {/* 2. BODY CONTENT: TEAMS-STYLE FORUM (When not in call) */}
      {!isInCall && (
        <div className="flex-1 flex overflow-hidden">
          {/* Main Forum Chat Stream or Workspace */}
          <div className="flex-1 flex flex-col justify-between bg-slate-900 border-r border-slate-800 overflow-hidden">
            {forumTab === 'chat' && (
              <>
                {/* Messages Stream */}
                <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
                  <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                        <Radio className="w-4 h-4 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-white">Live Classroom Meeting Room</h3>
                        <p className="text-[11px] text-slate-400">
                          {remoteParticipants.length + 1} members enrolled • Ready for live interactive video huddle.
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={handleStartCall}
                      leftIcon={<PhoneCall className="w-3.5 h-3.5" />}
                      className="bg-emerald-600 hover:bg-emerald-500 font-bold text-xs"
                    >
                      Join Meeting
                    </Button>
                  </div>

                  {/* Messages Feed */}
                  {forumMessages.map((msg) => (
                    <div key={msg.id} className="flex items-start gap-3 group">
                      <div className="w-8 h-8 rounded-full bg-slate-700 text-slate-200 flex items-center justify-center font-bold text-xs shrink-0 ring-1 ring-slate-600">
                        {msg.sender.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-white">{msg.sender}</span>
                          {msg.role === 'teacher' && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-900/60 text-emerald-400 border border-emerald-700/60 uppercase">
                              Instructor
                            </span>
                          )}
                          <span className="text-[10px] text-slate-500">{msg.time}</span>
                          {msg.pinned && (
                            <span className="text-[10px] text-amber-400 flex items-center gap-0.5">
                              <Pin className="w-2.5 h-2.5" /> Pinned
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/40 p-3 rounded-xl border border-slate-800/80">
                          {msg.text}
                        </p>
                        {msg.attachment && (
                          <div className="inline-flex items-center gap-2 p-2 rounded-lg bg-slate-800 text-xs text-emerald-400 border border-slate-700">
                            <FileText className="w-3.5 h-3.5" />
                            <span className="font-semibold text-slate-200">{msg.attachment.name}</span>
                            <span className="text-[10px] text-slate-400">({msg.attachment.size})</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input Bar */}
                <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder={`Message ${roomTitle}...`}
                    className="flex-1 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}

            {forumTab === 'whiteboard' && (
              <div className="flex-1 p-2 bg-slate-950 overflow-hidden">
                <InteractiveWhiteboard />
              </div>
            )}

            {forumTab === 'workspace' && (
              <div className="flex-1 p-4 bg-slate-950 overflow-y-auto">
                {renderWorkspacePlugin || (
                  <div className="text-center py-12 text-slate-500 text-xs">
                    No active specialty plugin loaded.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar: Class Agenda & Attendees */}
          <div className="hidden lg:flex flex-col w-72 bg-slate-950 p-4 space-y-6 overflow-y-auto">
            {/* Attendees */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                  Attendees ({remoteParticipants.length + 1})
                </h3>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Online
                </span>
              </div>

              <div className="space-y-2">
                {/* Local user */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                      {currentUserName.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="font-bold text-white">{currentUserName} (You)</span>
                  </div>
                  <Badge variant="default" className="text-[9px]">{userRole}</Badge>
                </div>

                {/* Peers */}
                {remoteParticipants.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-900 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-[10px]">
                        {p.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span>{p.name}</span>
                    </div>
                    {p.role === 'teacher' && (
                      <span className="text-[9px] font-bold text-emerald-400">Ustadh</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Class Agenda */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                Session Agenda
              </h3>
              <div className="space-y-2 text-xs text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-slate-700 text-emerald-600" />
                  <span className="line-through text-slate-500">Recitation Warm-up (Al-Fatihah)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-slate-700 text-emerald-600" />
                  <span>Nun Sakinah & Tanween Rules</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-700 text-emerald-600" />
                  <span>Individual Student Correction</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-700 text-emerald-600" />
                  <span>Weekly Muraja&apos;ah Assignment</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. ACTIVE CALL MODE: HD WebRTC Studio */}
      {isInCall && (
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          {/* Main Stage Grid */}
          <div className="flex-1 flex flex-col justify-between bg-slate-950 p-4 overflow-hidden relative">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 items-center justify-center p-2">
              {/* Local User Camera Card */}
              <div className="relative rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden aspect-video flex items-center justify-center shadow-xl">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${!videoEnabled ? 'hidden' : ''}`}
                />
                {!videoEnabled && (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center font-bold text-lg ring-2 ring-emerald-500/40">
                      {currentUserName.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-slate-300">{currentUserName}</span>
                  </div>
                )}
                {/* Audio Level Visualizer Ring */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-800">
                  <div
                    className="w-2 h-2 rounded-full bg-emerald-500 transition-transform"
                    style={{ transform: `scale(${1 + Math.min(audioLevel / 20, 1.5)})` }}
                  />
                  <span className="text-[11px] font-bold text-white">{currentUserName} (You)</span>
                  {!micEnabled && <MicOff className="w-3 h-3 text-red-400 ml-1" />}
                </div>
              </div>

              {/* Instructor Remote Video Card */}
              <div className="relative rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden aspect-video flex items-center justify-center shadow-xl">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-lg ring-2 ring-emerald-500/40">
                    AR
                  </div>
                  <span className="text-xs font-bold text-slate-200">Shaykh Dr. Abdul Rahman</span>
                  <span className="text-[10px] text-emerald-400">Speaking...</span>
                </div>
                <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[11px] font-bold text-white">Shaykh Dr. Abdul Rahman</span>
                </div>
              </div>

              {/* Peer 1 Remote Video Card */}
              <div className="relative rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden aspect-video flex items-center justify-center shadow-xl">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-lg">
                    FZ
                  </div>
                  <span className="text-xs font-bold text-slate-300">Fatima Zahra</span>
                </div>
                <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-800">
                  <span className="text-[11px] font-bold text-white">Fatima Zahra</span>
                </div>
              </div>

              {/* Screen Share or Whiteboard View */}
              {screenSharing && (
                <div className="relative rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden aspect-video flex items-center justify-center shadow-xl">
                  <video ref={screenShareVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] font-bold text-emerald-400">
                    Live Screen Share
                  </div>
                </div>
              )}
            </div>

            {/* In-Call Floating Controls Bar */}
            <div className="h-16 flex items-center justify-center gap-3 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 p-2 max-w-xl mx-auto w-full">
              <button
                onClick={toggleMic}
                className={`p-3 rounded-xl transition-all cursor-pointer ${
                  micEnabled ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-600 text-white'
                }`}
                title={micEnabled ? 'Mute Mic' : 'Unmute Mic'}
              >
                {micEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>

              <button
                onClick={toggleVideo}
                className={`p-3 rounded-xl transition-all cursor-pointer ${
                  videoEnabled ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-600 text-white'
                }`}
                title={videoEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
              >
                {videoEnabled ? <VideoIcon className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </button>

              <button
                onClick={toggleScreenShare}
                className={`p-3 rounded-xl transition-all cursor-pointer ${
                  screenSharing ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-white hover:bg-slate-700'
                }`}
                title="Share Screen"
              >
                <MonitorUp className="w-4 h-4" />
              </button>

              <button
                onClick={() => setHandRaised(!handRaised)}
                className={`p-3 rounded-xl transition-all cursor-pointer ${
                  handRaised ? 'bg-amber-500 text-white animate-bounce' : 'bg-slate-800 text-white hover:bg-slate-700'
                }`}
                title="Raise Hand"
              >
                <Hand className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowInCallChat(!showInCallChat)}
                className={`p-3 rounded-xl transition-all cursor-pointer ${
                  showInCallChat ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-white hover:bg-slate-700'
                }`}
                title="Toggle In-Call Chat"
              >
                <MessageSquare className="w-4 h-4" />
              </button>

              <div className="h-6 w-px bg-slate-700" />

              <button
                onClick={handleLeaveCall}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg"
              >
                <PhoneOff className="w-3.5 h-3.5" />
                <span>Leave</span>
              </button>
            </div>
          </div>

          {/* In-Call Side Chat Drawer */}
          {showInCallChat && (
            <div className="w-80 bg-slate-950 border-l border-slate-800 flex flex-col justify-between p-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-xs font-extrabold text-white">In-Meeting Chat</h3>
                <button onClick={() => setShowInCallChat(false)} className="text-slate-400 hover:text-white text-xs">
                  Close
                </button>
              </div>

              <div className="flex-1 py-4 overflow-y-auto space-y-3 text-xs">
                {forumMessages.map((m) => (
                  <div key={m.id} className="space-y-0.5">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-bold text-white">{m.sender}</span>
                      <span>{m.time}</span>
                    </div>
                    <p className="p-2 rounded-lg bg-slate-900 text-slate-300 leading-relaxed">
                      {m.text}
                    </p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type chat..."
                  className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                />
                <button type="submit" className="p-1.5 bg-emerald-600 text-white rounded-lg">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
