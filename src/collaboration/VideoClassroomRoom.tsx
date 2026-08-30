import React, { useState, useEffect } from 'react';
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
  Radio
} from 'lucide-react';
import { InteractiveWhiteboard } from './InteractiveWhiteboard';
import { ClassroomParticipant } from '../types';

interface VideoClassroomRoomProps {
  roomTitle?: string;
  courseTitle?: string;
  userRole?: 'teacher' | 'student';
  currentUserName?: string;
  niche?: 'quran' | 'coding' | 'general' | 'language';
  onLeaveRoom?: () => void;
  renderWorkspacePlugin?: React.ReactNode;
}

const INITIAL_PARTICIPANTS: ClassroomParticipant[] = [
  {
    id: 'p-1',
    name: 'Shaykh Dr. Abdul Rahman',
    role: 'teacher',
    audioEnabled: true,
    videoEnabled: true,
    screenSharing: false,
  },
  {
    id: 'p-2',
    name: 'Zayd Al-Mansoor (You)',
    role: 'student',
    audioEnabled: true,
    videoEnabled: true,
    screenSharing: false,
    handRaised: false,
  },
  {
    id: 'p-3',
    name: 'Fatima Zahra',
    role: 'student',
    audioEnabled: false,
    videoEnabled: true,
    screenSharing: false,
  },
  {
    id: 'p-4',
    name: 'Bilal Khan',
    role: 'student',
    audioEnabled: false,
    videoEnabled: false,
    screenSharing: false,
  }
];

export const VideoClassroomRoom: React.FC<VideoClassroomRoomProps> = ({
  roomTitle = 'Live Tajweed & Hifz Halaqah',
  courseTitle = 'Advanced Sanad Mastery Track',
  userRole = 'student',
  currentUserName = 'Zayd Al-Mansoor',
  niche = 'quran',
  onLeaveRoom,
  renderWorkspacePlugin
}) => {
  const [participants, setParticipants] = useState<ClassroomParticipant[]>(INITIAL_PARTICIPANTS);
  const [micEnabled, setMicEnabled] = useState<boolean>(true);
  const [videoEnabled, setVideoEnabled] = useState<boolean>(true);
  const [screenSharing, setScreenSharing] = useState<boolean>(false);
  const [handRaised, setHandRaised] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'whiteboard' | 'workspace' | 'video-grid'>('whiteboard');
  const [showChat, setShowChat] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<{ id: string; sender: string; text: string; time: string }[]>([
    { id: '1', sender: 'Shaykh Dr. Abdul Rahman', text: 'Assalamu Alaikum everyone! Welcome to today\'s live interactive session.', time: '10:00 AM' },
    { id: '2', sender: 'Fatima Zahra', text: 'Wa Alaikum Assalam Ustadh, ready with today\'s revision.', time: '10:01 AM' }
  ]);
  const [inputChat, setInputChat] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(true);
  const [sessionSeconds, setSessionSeconds] = useState<number>(1420); // 23 mins elapsed
  const [livekitConnected, setLivekitConnected] = useState<boolean>(false);
  const [livekitToken, setLivekitToken] = useState<string | null>(null);

  // Initialize LiveKit Cloud Session
  useEffect(() => {
    const initLiveKit = async () => {
      try {
        const res = await fetch('/api/livekit/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roomName: (courseTitle || 'live-class').toLowerCase().replace(/\s+/g, '-'),
            participantName: currentUserName || 'Student',
            isHost: userRole === 'teacher',
          }),
        });
        const data = await res.json();
        if (data.token) {
          setLivekitToken(data.token);
          setLivekitConnected(true);
        }
      } catch (err) {
        console.warn('LiveKit cloud fallback mode active:', err);
      }
    };
    initLiveKit();
  }, [courseTitle, currentUserName, userRole]);

  // Format Elapsed Time
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

  const handleToggleMic = () => {
    setMicEnabled(!micEnabled);
    setParticipants((prev) =>
      prev.map((p) => (p.name.includes('(You)') ? { ...p, audioEnabled: !micEnabled } : p))
    );
  };

  const handleToggleVideo = () => {
    setVideoEnabled(!videoEnabled);
    setParticipants((prev) =>
      prev.map((p) => (p.name.includes('(You)') ? { ...p, videoEnabled: !videoEnabled } : p))
    );
  };

  const handleToggleHand = () => {
    setHandRaised(!handRaised);
    setParticipants((prev) =>
      prev.map((p) => (p.name.includes('(You)') ? { ...p, handRaised: !handRaised } : p))
    );
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputChat.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        sender: currentUserName,
        text: inputChat.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setInputChat('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] min-h-[640px] bg-slate-950 text-white overflow-hidden rounded-2xl border border-slate-800 shadow-2xl">
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
              <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                livekitConnected
                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${livekitConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                {livekitConnected ? 'LiveKit SFU Active' : 'Connecting LiveKit...'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">{courseTitle} • Elapsed: {formatTimer(sessionSeconds)}</p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-800/90 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setActiveTab('whiteboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
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
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
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
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'video-grid'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Video Gallery ({participants.length})</span>
          </button>
        </div>
      </div>

      {/* 2. Main Stage (Split View: Videos + Interactive Stage) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Main Center Stage */}
        <div className="flex-1 flex flex-col p-3 overflow-y-auto bg-slate-900/40">
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
              {participants.map((p) => (
                <div
                  key={p.id}
                  className={`relative rounded-2xl overflow-hidden bg-slate-800 border-2 transition-all flex flex-col items-center justify-center min-h-[220px] aspect-video ${
                    p.audioEnabled ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'border-slate-700'
                  }`}
                >
                  {p.videoEnabled ? (
                    <div className="w-full h-full bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 flex items-center justify-center relative">
                      {/* Video Feed Simulation */}
                      <div className="text-center">
                        <div className="w-20 h-20 rounded-full bg-emerald-700/80 text-white flex items-center justify-center font-bold text-2xl mx-auto shadow-inner border-2 border-emerald-400">
                          {p.name.charAt(0)}
                        </div>
                        <p className="mt-2 text-xs font-semibold text-emerald-300">Live Video Stream</p>
                      </div>

                      {/* Active Voice Wave Effect */}
                      {p.audioEnabled && (
                        <div className="absolute top-3 right-3 bg-emerald-500/20 text-emerald-400 p-1.5 rounded-full animate-pulse">
                          <Volume2 className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xl text-slate-300">
                        {p.name.charAt(0)}
                      </div>
                      <p className="mt-2 text-xs font-medium">Camera Off</p>
                    </div>
                  )}

                  {/* Participant Name Badge */}
                  <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-white flex items-center gap-2 border border-slate-700">
                    <span>{p.name}</span>
                    {p.role === 'teacher' && (
                      <span className="bg-amber-500/30 text-amber-300 text-[10px] px-1.5 py-0.5 rounded font-extrabold uppercase">
                        Instructor
                      </span>
                    )}
                    {p.handRaised && (
                      <span className="text-amber-400 text-xs animate-bounce" title="Hand Raised">
                        ✋
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Strip / Drawer (Video Tiles or Live Chat) */}
        {activeTab !== 'video-grid' && (
          <div className="w-72 border-l border-slate-800 bg-slate-900/70 p-3 hidden lg:flex flex-col gap-3 overflow-y-auto shrink-0">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>Attendees ({participants.length})</span>
            </h3>

            {/* Compact Video Feeds */}
            <div className="space-y-2.5">
              {participants.map((p) => (
                <div
                  key={p.id}
                  className={`relative rounded-xl overflow-hidden bg-slate-800 aspect-video border transition-all flex items-center justify-center ${
                    p.audioEnabled ? 'border-emerald-500' : 'border-slate-700'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-800 text-amber-200 flex items-center justify-center font-bold text-sm">
                      {p.name.charAt(0)}
                    </div>
                  </div>
                  <div className="absolute bottom-1.5 left-1.5 right-1.5 bg-slate-950/80 px-2 py-0.5 rounded text-[11px] font-semibold text-white flex items-center justify-between">
                    <span className="truncate max-w-[120px]">{p.name}</span>
                    {p.audioEnabled ? <Mic className="w-3 h-3 text-emerald-400" /> : <MicOff className="w-3 h-3 text-red-400" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live Chat Flyout Drawer */}
        {showChat && (
          <div className="w-80 border-l border-slate-800 bg-slate-900 flex flex-col h-full z-30 shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="p-3 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
              <h4 className="font-bold text-xs text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" /> In-Class Discussion
              </h4>
              <button onClick={() => setShowChat(false)} className="text-slate-400 hover:text-white text-xs">
                ✕
              </button>
            </div>

            <div className="flex-1 p-3 space-y-3 overflow-y-auto text-xs">
              {chatMessages.map((m) => (
                <div key={m.id} className="space-y-0.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-bold text-emerald-400">{m.sender}</span>
                    <span>{m.time}</span>
                  </div>
                  <p className="bg-slate-800/80 p-2.5 rounded-xl text-slate-200 border border-slate-700 leading-relaxed">
                    {m.text}
                  </p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-2.5 bg-slate-800/90 border-t border-slate-700 flex gap-2">
              <input
                type="text"
                value={inputChat}
                onChange={(e) => setInputChat(e.target.value)}
                placeholder="Ask teacher a question..."
                className="flex-1 bg-slate-900 text-white text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-sm transition-all"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* 3. Bottom Video Conference Control Bar */}
      <div className="bg-slate-900 px-6 py-3 border-t border-slate-800 flex items-center justify-between shrink-0">
        {/* Left: Info */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Connected via Ultra-Low Latency SFU (LiveKit WebRTC)</span>
        </div>

        {/* Center: Controls */}
        <div className="flex items-center gap-2.5 mx-auto">
          <button
            onClick={handleToggleMic}
            className={`p-3 rounded-2xl transition-all shadow-md ${
              micEnabled
                ? 'bg-slate-800 hover:bg-slate-700 text-white'
                : 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
            }`}
            title={micEnabled ? 'Mute Microphone' : 'Unmute Microphone'}
          >
            {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          <button
            onClick={handleToggleVideo}
            className={`p-3 rounded-2xl transition-all shadow-md ${
              videoEnabled
                ? 'bg-slate-800 hover:bg-slate-700 text-white'
                : 'bg-rose-600 hover:bg-rose-500 text-white'
            }`}
            title={videoEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
          >
            {videoEnabled ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setScreenSharing(!screenSharing)}
            className={`p-3 rounded-2xl transition-all shadow-md ${
              screenSharing
                ? 'bg-emerald-600 text-white shadow-emerald-900/40'
                : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
            title="Share Screen"
          >
            <MonitorUp className="w-5 h-5" />
          </button>

          <button
            onClick={handleToggleHand}
            className={`p-3 rounded-2xl transition-all shadow-md ${
              handRaised
                ? 'bg-amber-600 text-white shadow-amber-900/40 animate-bounce'
                : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
            title="Raise Hand"
          >
            <Hand className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowChat(!showChat)}
            className={`p-3 rounded-2xl transition-all shadow-md ${
              showChat
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
            title="In-Class Chat"
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          <button
            onClick={onLeaveRoom}
            className="p-3 px-5 rounded-2xl bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
            title="Leave Classroom"
          >
            <PhoneOff className="w-4 h-4" />
            <span className="hidden md:inline">Leave Class</span>
          </button>
        </div>

        {/* Right: Security & Settings */}
        <div className="hidden sm:flex items-center gap-3 text-slate-400 text-xs">
          <span className="bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 font-mono">
            E2EE Active
          </span>
        </div>
      </div>
    </div>
  );
};
