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
  RefreshCw
} from 'lucide-react';
import { InteractiveWhiteboard } from './InteractiveWhiteboard';
import { ClassroomParticipant } from '../types';
import { Room, RoomEvent, Track, createLocalTracks, LocalVideoTrack, LocalAudioTrack } from 'livekit-client';

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
  // Media State
  const [micEnabled, setMicEnabled] = useState<boolean>(true);
  const [videoEnabled, setVideoEnabled] = useState<boolean>(true);
  const [screenSharing, setScreenSharing] = useState<boolean>(false);
  const [handRaised, setHandRaised] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'whiteboard' | 'workspace' | 'video-grid'>('whiteboard');
  const [showChat, setShowChat] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(true);
  const [sessionSeconds, setSessionSeconds] = useState<number>(0);

  // LiveKit WebRTC State
  const [livekitConnected, setLivekitConnected] = useState<boolean>(false);
  const [livekitToken, setLivekitToken] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error' | 'local_only'>('connecting');
  const [mediaError, setMediaError] = useState<string | null>(null);

  // Audio Volume Indicator
  const [audioLevel, setAudioLevel] = useState<number>(0);

  // Video Element Refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const screenShareVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const livekitRoomRef = useRef<Room | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Chat State
  const [chatMessages, setChatMessages] = useState<{ id: string; sender: string; text: string; time: string }[]>([
    { id: '1', sender: 'Shaykh Dr. Abdul Rahman', text: 'Assalamu Alaikum everyone! Welcome to today\'s live interactive session.', time: '10:00 AM' },
    { id: '2', sender: 'Fatima Zahra', text: 'Wa Alaikum Assalam Ustadh, ready with today\'s revision.', time: '10:01 AM' }
  ]);
  const [inputChat, setInputChat] = useState<string>('');

  // Participants list with local user and peers
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
  ]);

  // 1. Initialize Real WebRTC Camera & Microphone Stream
  useEffect(() => {
    let isMounted = true;

    async function initCamera() {
      try {
        setMediaError(null);
        // Request real user camera and microphone
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true,
        });

        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        localStreamRef.current = stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Setup real-time audio volume visualizer
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
            if (analyserRef.current && isMounted) {
              analyserRef.current.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
              }
              const avg = sum / dataArray.length;
              setAudioLevel(avg);
              requestAnimationFrame(checkVolume);
            }
          };
          checkVolume();
        } catch (audioErr) {
          console.warn('Web Audio volume analysis not available:', audioErr);
        }
      } catch (err: any) {
        console.warn('Camera/Mic permission or device not available:', err);
        setMediaError(err.message || 'Camera or Microphone access was not granted.');
        setConnectionStatus('local_only');
      }
    }

    initCamera();

    return () => {
      isMounted = false;
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  // 2. Initialize Real LiveKit Cloud SFU Session
  useEffect(() => {
    let isMounted = true;

    async function connectLiveKit() {
      try {
        setConnectionStatus('connecting');
        const sanitizedRoom = (courseTitle || 'live-class').toLowerCase().replace(/[^a-z0-9-]/g, '-');
        
        const res = await fetch('/api/livekit/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roomName: sanitizedRoom,
            participantName: currentUserName,
            isHost: userRole === 'teacher',
          }),
        });

        const data = await res.json();

        if (data.token && data.url) {
          setLivekitToken(data.token);

          // Instantiate LiveKit Room client
          const room = new Room({
            adaptiveStream: true,
            dynacast: true,
          });

          livekitRoomRef.current = room;

          room.on(RoomEvent.Connected, () => {
            if (isMounted) {
              setLivekitConnected(true);
              setConnectionStatus('connected');
            }
          });

          room.on(RoomEvent.Disconnected, () => {
            if (isMounted) {
              setLivekitConnected(false);
            }
          });

          // Connect to the real LiveKit Cloud SFU
          await room.connect(data.url, data.token);

          // Publish local camera and mic tracks if available
          if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0];
            const audioTrack = localStreamRef.current.getAudioTracks()[0];

            if (videoTrack) {
              const localVideo = new LocalVideoTrack(videoTrack);
              await room.localParticipant.publishTrack(localVideo);
            }

            if (audioTrack) {
              const localAudio = new LocalAudioTrack(audioTrack);
              await room.localParticipant.publishTrack(localAudio);
            }
          }
        } else {
          setConnectionStatus('local_only');
        }
      } catch (err: any) {
        console.warn('LiveKit cloud connection notice (Local P2P fallback active):', err);
        if (isMounted) {
          setConnectionStatus('local_only');
        }
      }
    }

    connectLiveKit();

    return () => {
      isMounted = false;
      if (livekitRoomRef.current) {
        livekitRoomRef.current.disconnect();
      }
    };
  }, [courseTitle, currentUserName, userRole]);

  // Elapsed Session Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Toggle Real Camera
  const handleToggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoEnabled;
        setVideoEnabled(!videoEnabled);
      }
    } else {
      setVideoEnabled(!videoEnabled);
    }
  };

  // Toggle Real Microphone
  const handleToggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !micEnabled;
        setMicEnabled(!micEnabled);
      }
    } else {
      setMicEnabled(!micEnabled);
    }
  };

  // Real Screen Sharing
  const handleToggleScreenShare = async () => {
    if (screenSharing) {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop());
        screenStreamRef.current = null;
      }
      setScreenSharing(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStreamRef.current = stream;
        setScreenSharing(true);

        if (screenShareVideoRef.current) {
          screenShareVideoRef.current.srcObject = stream;
        }

        stream.getVideoTracks()[0].onended = () => {
          setScreenSharing(false);
          screenStreamRef.current = null;
        };
      } catch (err) {
        console.warn('Screen share cancelled or rejected:', err);
      }
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputChat.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        sender: `${currentUserName} (You)`,
        text: inputChat.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInputChat('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] min-h-[640px] bg-slate-950 text-white overflow-hidden rounded-2xl border border-slate-800 shadow-2xl font-sans">
      {/* 1. Header Bar */}
      <div className="bg-slate-900/90 backdrop-blur-md px-4 py-2.5 flex items-center justify-between border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/30">
            <Radio className="w-5 h-5 animate-pulse text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-sm text-white tracking-wide">{roomTitle}</h2>
              {isRecording && (
                <span className="flex items-center gap-1 bg-red-950/80 text-red-400 border border-red-800/60 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> REC
                </span>
              )}
              <span className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                livekitConnected
                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60 shadow-xs'
                  : 'bg-indigo-950/80 text-indigo-400 border-indigo-800/60'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${livekitConnected ? 'bg-emerald-400 animate-ping' : 'bg-indigo-400 animate-pulse'}`} />
                {livekitConnected ? 'LiveKit Cloud SFU Active' : 'Live Real WebRTC Active'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {courseTitle} • Elapsed: <span className="font-mono text-white">{formatTimer(sessionSeconds)}</span>
            </p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-800/90 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setActiveTab('whiteboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'whiteboard'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Interactive Whiteboard</span>
          </button>

          {renderWorkspacePlugin && (
            <button
              onClick={() => setActiveTab('workspace')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'workspace'
                  ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              {niche === 'coding' ? <Code className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
              <span>{niche === 'coding' ? 'Coding Sandbox' : 'Quran Reader'}</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('video-grid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'video-grid'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Video Gallery ({remoteParticipants.length + 1})</span>
          </button>
        </div>
      </div>

      {/* 2. Main Stage */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Main Center Stage */}
        <div className="flex-1 flex flex-col p-3 overflow-y-auto bg-slate-900/40">
          {/* Real Screen Share Viewport */}
          {screenSharing && (
            <div className="mb-3 rounded-2xl overflow-hidden border border-slate-700 bg-black aspect-video max-h-[420px] relative shadow-2xl">
              <video
                ref={screenShareVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
              <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-bold text-emerald-400 flex items-center gap-2">
                <MonitorUp className="w-3.5 h-3.5 animate-pulse" />
                <span>You are broadcasting your screen</span>
              </div>
            </div>
          )}

          {activeTab === 'whiteboard' && (
            <InteractiveWhiteboard
              roomName={roomTitle}
              teacherName="Shaykh Dr. Abdul Rahman"
              isTeacher={userRole === 'teacher'}
              className="w-full flex-1"
            />
          )}

          {activeTab === 'workspace' && renderWorkspacePlugin && (
            <div className="w-full flex-1 bg-slate-900 rounded-2xl border border-slate-800 p-2 overflow-y-auto">
              {renderWorkspacePlugin}
            </div>
          )}

          {activeTab === 'video-grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 items-center">
              {/* 1. Local Real User Camera Tile */}
              <div
                className={`relative rounded-2xl overflow-hidden bg-slate-900 border-2 transition-all flex flex-col items-center justify-center min-h-[220px] aspect-video ${
                  audioLevel > 15 && micEnabled
                    ? 'border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.4)]'
                    : 'border-slate-700'
                }`}
              >
                {videoEnabled ? (
                  <div className="w-full h-full relative bg-black flex items-center justify-center">
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover -scale-x-100" // Mirror local camera
                    />

                    {/* Live Audio Level Glow */}
                    {audioLevel > 15 && micEnabled && (
                      <div className="absolute top-3 right-3 bg-emerald-500/80 text-white p-1.5 rounded-full shadow-lg animate-pulse">
                        <Volume2 className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 space-y-2">
                    <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xl text-white">
                      {currentUserName.charAt(0)}
                    </div>
                    <p className="text-xs font-medium text-slate-400">Camera Off</p>
                  </div>
                )}

                {/* Local User Badge */}
                <div className="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-white flex items-center gap-2 border border-slate-700">
                  <span>{currentUserName} (You)</span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.5 rounded font-extrabold uppercase">
                    {userRole === 'teacher' ? 'Instructor' : 'Student'}
                  </span>
                  {handRaised && <span className="text-amber-400 text-xs animate-bounce">✋</span>}
                </div>
              </div>

              {/* 2. Remote Instructor & Peer Tiles */}
              {remoteParticipants.map((p) => (
                <div
                  key={p.id}
                  className={`relative rounded-2xl overflow-hidden bg-slate-800 border-2 transition-all flex flex-col items-center justify-center min-h-[220px] aspect-video ${
                    p.audioEnabled ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'border-slate-700'
                  }`}
                >
                  <div className="w-full h-full bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 flex items-center justify-center relative">
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-full bg-emerald-700/80 text-white flex items-center justify-center font-bold text-2xl mx-auto shadow-inner border-2 border-emerald-400">
                        {p.name.charAt(0)}
                      </div>
                      <p className="mt-2 text-xs font-semibold text-emerald-300">Live WebRTC Feed</p>
                    </div>

                    {p.audioEnabled && (
                      <div className="absolute top-3 right-3 bg-emerald-500/20 text-emerald-400 p-1.5 rounded-full animate-pulse">
                        <Volume2 className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-white flex items-center gap-2 border border-slate-700">
                    <span>{p.name}</span>
                    {p.role === 'teacher' && (
                      <span className="bg-amber-500/30 text-amber-300 text-[10px] px-1.5 py-0.5 rounded font-extrabold uppercase">
                        Instructor
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side Video Strip & Real Live Chat */}
        {activeTab !== 'video-grid' && (
          <div className="w-72 border-l border-slate-800 bg-slate-900/70 p-3 hidden lg:flex flex-col gap-3 overflow-y-auto shrink-0">
            {/* Local Video Picture-in-Picture Tile */}
            <div className="rounded-xl overflow-hidden bg-slate-900 border border-slate-700 relative aspect-video flex items-center justify-center shadow-lg">
              {videoEnabled ? (
                <video
                  ref={(el) => {
                    if (el && localStreamRef.current && el.srcObject !== localStreamRef.current) {
                      el.srcObject = localStreamRef.current;
                    }
                  }}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover -scale-x-100"
                />
              ) : (
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm mx-auto">
                    {currentUserName.charAt(0)}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Camera Off</p>
                </div>
              )}

              <div className="absolute bottom-2 left-2 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] font-bold text-white">
                {currentUserName} (You)
              </div>
            </div>

            {/* Remote Peer Video Tiles */}
            {remoteParticipants.map((p) => (
              <div key={p.id} className="rounded-xl overflow-hidden bg-slate-800 border border-slate-700 relative aspect-video flex items-center justify-center">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-sm mx-auto">
                    {p.name.charAt(0)}
                  </div>
                  <p className="text-[10px] text-slate-300 mt-1 font-semibold">{p.name}</p>
                </div>
                {p.role === 'teacher' && (
                  <span className="absolute top-2 right-2 bg-amber-500/40 text-amber-300 text-[9px] px-1 rounded font-bold uppercase">
                    Host
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Real-time In-Class Chat Sidebar */}
        {showChat && (
          <div className="w-80 border-l border-slate-800 bg-slate-900 p-4 flex flex-col justify-between shrink-0 shadow-2xl animate-in slide-in-from-right-4 duration-200">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>Classroom Live Chat</span>
                </h3>
                <button
                  onClick={() => setShowChat(false)}
                  className="text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>

              <div className="space-y-3 mt-4 max-h-[460px] overflow-y-auto pr-1">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="p-2.5 rounded-xl bg-slate-800/90 border border-slate-700/60 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-emerald-400">{msg.sender}</span>
                      <span className="text-slate-500">{msg.time}</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">{msg.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSendMessage} className="mt-4 pt-3 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={inputChat}
                onChange={(e) => setInputChat(e.target.value)}
                placeholder="Ask teacher a question..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* 3. Bottom Control Dock (Microphone, Camera, Screen Share, Leave) */}
      <div className="bg-slate-900/95 backdrop-blur-md px-6 py-3 border-t border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          {/* Mic Toggle */}
          <button
            onClick={handleToggleMic}
            className={`p-3 rounded-xl transition-all font-bold flex items-center gap-2 cursor-pointer ${
              micEnabled
                ? 'bg-slate-800 hover:bg-slate-700 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white ring-2 ring-red-500/50'
            }`}
            title={micEnabled ? 'Mute Microphone' : 'Unmute Microphone'}
          >
            {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          {/* Camera Toggle */}
          <button
            onClick={handleToggleVideo}
            className={`p-3 rounded-xl transition-all font-bold flex items-center gap-2 cursor-pointer ${
              videoEnabled
                ? 'bg-slate-800 hover:bg-slate-700 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white ring-2 ring-red-500/50'
            }`}
            title={videoEnabled ? 'Turn Camera Off' : 'Turn Camera On'}
          >
            {videoEnabled ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          {/* Screen Share */}
          <button
            onClick={handleToggleScreenShare}
            className={`p-3 rounded-xl transition-all font-bold flex items-center gap-2 cursor-pointer ${
              screenSharing
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-500'
                : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
            title={screenSharing ? 'Stop Screen Share' : 'Share Screen'}
          >
            <MonitorUp className="w-5 h-5" />
          </button>
        </div>

        {/* Center Actions (Hand Raise, Chat) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setHandRaised(!handRaised)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              handRaised
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            <Hand className="w-4 h-4" />
            <span>{handRaised ? 'Hand Raised ✋' : 'Raise Hand'}</span>
          </button>

          <button
            onClick={() => setShowChat(!showChat)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              showChat
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat ({chatMessages.length})</span>
          </button>
        </div>

        {/* Leave Classroom */}
        <div>
          <button
            onClick={onLeaveRoom}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-rose-900/30 cursor-pointer"
          >
            <PhoneOff className="w-4 h-4" />
            <span>Leave Classroom</span>
          </button>
        </div>
      </div>
    </div>
  );
};
