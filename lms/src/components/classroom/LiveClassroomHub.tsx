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
  PenTool,
  Send,
  Volume2,
  AlertTriangle,
  Check,
  X,
  VolumeX,
  Sparkles,
} from 'lucide-react';
import { InteractiveWhiteboard } from '../../collaboration/InteractiveWhiteboard';
import { TenantNiche } from '../../types';
import { Room, RoomEvent, RemoteTrack, RemoteParticipant, Track } from 'livekit-client';
import { Button } from '../ui';
import { useTenant } from '../../context/TenantContext';

export type StudentLevelTier = 'beginner' | 'intermediate' | 'advanced';

export interface LiveClassroomHubProps {
  roomTitle?: string;
  courseTitle?: string;
  userRole?: 'teacher' | 'student' | 'admin';
  currentUserName?: string;
  niche?: TenantNiche;
  studentLevel?: StudentLevelTier;
  onLeaveRoom?: () => void;
  renderWorkspacePlugin?: React.ReactNode;
}

export const LiveClassroomHub: React.FC<LiveClassroomHubProps> = ({
  roomTitle = 'Live Classroom Session',
  courseTitle = 'Academy Curriculum',
  userRole = 'student',
  currentUserName = 'Student',
  onLeaveRoom,
  renderWorkspacePlugin,
}) => {
  const { tenant } = useTenant();

  // Classroom Mode: Video Stage vs Whiteboard vs Workspace
  const [activeStage, setActiveStage] = useState<'video' | 'whiteboard' | 'workspace'>('video');
  const [sidePanel, setSidePanel] = useState<null | 'chat' | 'participants'>(null);

  // Call & Media State
  const [isInCall, setIsInCall] = useState<boolean>(true);
  const [micEnabled, setMicEnabled] = useState<boolean>(true);
  const [videoEnabled, setVideoEnabled] = useState<boolean>(true);
  const [screenSharing, setScreenSharing] = useState<boolean>(false);
  const [handRaised, setHandRaised] = useState<boolean>(false);
  const [sessionSeconds, setSessionSeconds] = useState<number>(0);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [unreadChatCount, setUnreadChatCount] = useState<number>(0);

  // LiveKit & WebRTC Peer Connection State
  const [isConnectedToSFU, setIsConnectedToSFU] = useState<boolean>(false);
  const [remoteParticipantName, setRemoteParticipantName] = useState<string | null>(null);
  const [hasRemoteVideo, setHasRemoteVideo] = useState<boolean>(false);
  const [livekitNotice, setLivekitNotice] = useState<string | null>(null);

  // Video Element Refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const screenShareVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const livekitRoomRef = useRef<Room | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // In-call Chat Messages
  const [messages, setMessages] = useState<{
    id: string;
    sender: string;
    role: 'teacher' | 'student' | 'admin';
    text: string;
    time: string;
  }[]>([]);
  const [messageInput, setMessageInput] = useState<string>('');
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  // Attendees List
  const [liveAttendees, setLiveAttendees] = useState<{
    id: string;
    name: string;
    role: 'teacher' | 'student' | 'admin';
    isMuted?: boolean;
    handRaised?: boolean;
  }[]>([
    {
      id: 'self',
      name: currentUserName,
      role: userRole,
      isMuted: false,
      handRaised: false,
    },
  ]);

  // Session Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isInCall) {
      interval = setInterval(() => {
        setSessionSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isInCall]);

  // Scroll to bottom of chat when new message arrives
  useEffect(() => {
    if (sidePanel === 'chat') {
      chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, sidePanel]);

  // Initialize WebRTC & Media Stream on mount
  useEffect(() => {
    startMedia();
    return () => {
      cleanupMedia();
    };
  }, []);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const startMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Audio analyser for real-time mic visualizer
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

      const roomChannelName = `webrtc_room_${(roomTitle || 'live').toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

      // BroadcastChannel signaling for browser-to-browser WebRTC
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const bc = new BroadcastChannel(roomChannelName);
        broadcastChannelRef.current = bc;

        const pc = new RTCPeerConnection({
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
          ],
        });
        peerConnectionRef.current = pc;

        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        pc.onicecandidate = (event) => {
          if (event.candidate && bc) {
            bc.postMessage({
              type: 'ice_candidate',
              candidate: event.candidate,
              sender: currentUserName,
            });
          }
        };

        pc.ontrack = (event) => {
          if (remoteVideoRef.current && event.streams[0]) {
            remoteVideoRef.current.srcObject = event.streams[0];
            setHasRemoteVideo(true);
            setIsConnectedToSFU(true);
          }
        };

        bc.onmessage = async (e) => {
          const data = e.data;
          if (!data || data.sender === currentUserName) return;

          if (data.type === 'peer_join') {
            setRemoteParticipantName(data.sender);
            setLiveAttendees((prev) => {
              if (prev.some((a) => a.name === data.sender)) return prev;
              return [
                ...prev,
                { id: `peer-${Date.now()}`, name: data.sender, role: data.role || 'student' },
              ];
            });
            try {
              const offer = await pc.createOffer();
              await pc.setLocalDescription(offer);
              bc.postMessage({
                type: 'peer_offer',
                sdp: offer,
                sender: currentUserName,
              });
            } catch (err) {
              console.warn('WebRTC offer error:', err);
            }
          } else if (data.type === 'peer_offer') {
            setRemoteParticipantName(data.sender);
            try {
              await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              bc.postMessage({
                type: 'peer_answer',
                sdp: answer,
                sender: currentUserName,
              });
            } catch (err) {
              console.warn('WebRTC answer error:', err);
            }
          } else if (data.type === 'peer_answer') {
            setRemoteParticipantName(data.sender);
            try {
              await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
            } catch (err) {
              console.warn('WebRTC set remote description error:', err);
            }
          } else if (data.type === 'ice_candidate') {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
            } catch (err) {
              console.warn('WebRTC candidate error:', err);
            }
          } else if (data.type === 'chat_message') {
            setMessages((prev) => [...prev, data.message]);
            if (sidePanel !== 'chat') {
              setUnreadChatCount((prev) => prev + 1);
            }
          } else if (data.type === 'mute_all') {
            if (userRole === 'student') {
              setMicEnabled(false);
              if (localStreamRef.current) {
                const track = localStreamRef.current.getAudioTracks()[0];
                if (track) track.enabled = false;
              }
            }
          } else if (data.type === 'peer_leave') {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = null;
            }
            setHasRemoteVideo(false);
            setRemoteParticipantName(null);
            setLiveAttendees((prev) => prev.filter((a) => a.name !== data.sender));
          }
        };

        bc.postMessage({
          type: 'peer_join',
          sender: currentUserName,
          role: userRole,
        });
      }

      // LiveKit Cloud SFU fallback (if credentials configured)
      const tokenRes = await fetch(
        `/api/livekit/token?room=${encodeURIComponent(roomChannelName)}&username=${encodeURIComponent(currentUserName)}`
      ).catch(() => null);

      if (tokenRes && tokenRes.ok) {
        const { token, wsUrl, isFallback } = await tokenRes.json();
        if (isFallback) {
          setLivekitNotice(null);
        } else if (token && wsUrl) {
          try {
            const room = new Room({ adaptiveStream: true, dynacast: true });
            livekitRoomRef.current = room;

            room.on(RoomEvent.Connected, () => {
              setIsConnectedToSFU(true);
              room.remoteParticipants.forEach((p) => {
                setRemoteParticipantName(p.name || p.identity);
              });
            });

            room.on(RoomEvent.ParticipantConnected, (p: RemoteParticipant) => {
              setRemoteParticipantName(p.name || p.identity);
              setLiveAttendees((prev) => {
                if (prev.some((a) => a.name === (p.name || p.identity))) return prev;
                return [...prev, { id: p.sid, name: p.name || p.identity, role: 'student' }];
              });
            });

            room.on(RoomEvent.ParticipantDisconnected, () => {
              if (room.remoteParticipants.size === 0) {
                setRemoteParticipantName(null);
                setHasRemoteVideo(false);
              }
            });

            room.on(RoomEvent.TrackSubscribed, (track: RemoteTrack) => {
              if (track.kind === Track.Kind.Video && remoteVideoRef.current) {
                track.attach(remoteVideoRef.current);
                setHasRemoteVideo(true);
              } else if (track.kind === Track.Kind.Audio && remoteAudioRef.current) {
                track.attach(remoteAudioRef.current);
              }
            });

            await room.connect(wsUrl, token);
            await room.localParticipant.enableCameraAndMicrophone();
          } catch (e) {
            console.warn('LiveKit cloud notice:', e);
          }
        }
      }
    } catch (err) {
      console.warn('Media initialization notice:', err);
    }
  };

  const cleanupMedia = () => {
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'peer_leave',
        sender: currentUserName,
      });
      broadcastChannelRef.current.close();
      broadcastChannelRef.current = null;
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((t) => t.stop());
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

  const handleLeaveCall = () => {
    cleanupMedia();
    setIsInCall(false);
    if (onLeaveRoom) {
      onLeaveRoom();
    }
  };

  const toggleMic = async () => {
    const nextState = !micEnabled;
    setMicEnabled(nextState);
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) audioTrack.enabled = nextState;
    }
    if (livekitRoomRef.current?.localParticipant) {
      await livekitRoomRef.current.localParticipant.setMicrophoneEnabled(nextState);
    }
  };

  const toggleVideo = async () => {
    const nextState = !videoEnabled;
    setVideoEnabled(nextState);
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) videoTrack.enabled = nextState;
    }
    if (livekitRoomRef.current?.localParticipant) {
      await livekitRoomRef.current.localParticipant.setCameraEnabled(nextState);
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
        screenStreamRef.current.getTracks().forEach((t) => t.stop());
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
    setMessages((prev) => [...prev, newMsg]);
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'chat_message',
        message: newMsg,
        sender: currentUserName,
      });
    }
    setMessageInput('');
  };

  const handleTeacherMuteAll = () => {
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'mute_all',
        sender: currentUserName,
      });
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-100 font-sans overflow-hidden select-none">
      {/* 1. TOP HEADER - Clean, Streamlined & Dynamic */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0 z-20">
        {/* Class Details & Live Indicator */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-semibold text-white shadow-xs shrink-0">
            {tenant?.name ? tenant.name.charAt(0) : 'A'}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xs sm:text-sm font-semibold text-white truncate leading-none">
                {courseTitle}
              </h2>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/30 text-[10px] font-semibold font-mono shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                Live {formatTimer(sessionSeconds)}
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 truncate mt-0.5">
              {roomTitle}
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {userRole === 'teacher' && (
            <button
              onClick={handleTeacherMuteAll}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              title="Mute all student microphones"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>Mute All</span>
            </button>
          )}

          {renderWorkspacePlugin && (
            <button
              onClick={() => setActiveStage(activeStage === 'workspace' ? 'video' : 'workspace')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                activeStage === 'workspace'
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Workspace</span>
            </button>
          )}

          <Button
            variant="danger"
            size="sm"
            onClick={handleLeaveCall}
            leftIcon={<PhoneOff className="w-3.5 h-3.5" />}
            className="text-xs font-semibold px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-xs"
          >
            Leave Class
          </Button>
        </div>
      </header>

      {/* 2. MAIN STAGE & COLLAPSIBLE SIDE PANELS */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Stage Content */}
        <div className="flex-1 flex flex-col justify-between p-3 sm:p-5 overflow-hidden relative bg-slate-950 min-w-0">
          {activeStage === 'video' && (
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 overflow-y-auto items-center justify-center p-1">
              {/* Local Video Tile */}
              <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center shadow-lg w-full max-h-[420px] mx-auto">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${!videoEnabled ? 'hidden' : ''}`}
                />
                {!videoEnabled && (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-full bg-slate-800 text-white flex items-center justify-center font-semibold text-xl border border-slate-700 shadow-md">
                      {currentUserName.charAt(0)}
                    </div>
                    <span className="text-xs text-slate-400 font-semibold">{currentUserName} (Camera Off)</span>
                  </div>
                )}

                {/* Local Info Tag */}
                <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-xl text-white text-xs font-semibold flex items-center gap-2 border border-slate-800">
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
                  <div className="absolute top-3 right-3 bg-amber-500 text-slate-950 px-2.5 py-1 rounded-xl text-xs font-semibold shadow-md flex items-center gap-1">
                    <Hand className="w-3.5 h-3.5" /> Hand Raised
                  </div>
                )}
              </div>

              {/* Remote Participant / Screen Share Tile */}
              <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center shadow-lg w-full max-h-[420px] mx-auto">
                <audio ref={remoteAudioRef} autoPlay />

                {screenSharing ? (
                  <video
                    ref={screenShareVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain bg-black"
                  />
                ) : (
                  <>
                    <video
                      ref={remoteVideoRef}
                      autoPlay
                      playsInline
                      className={`w-full h-full object-cover ${!hasRemoteVideo ? 'hidden' : ''}`}
                    />

                    {!hasRemoteVideo && (
                      <div className="flex flex-col items-center text-center p-6 gap-3">
                        <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-semibold text-xl border border-slate-700 shadow-md">
                          <Users className="w-7 h-7" />
                        </div>
                        <div className="space-y-1 max-w-xs">
                          <span className="text-xs font-semibold text-white block">
                            {remoteParticipantName || (userRole === 'teacher' ? 'Waiting for students to join...' : 'Waiting for instructor to connect...')}
                          </span>
                          <span className="text-[11px] text-slate-400 leading-tight block">
                            {remoteParticipantName
                              ? 'Live video stream connecting...'
                              : 'Real-time WebRTC audio, video & whiteboard mesh active for this class.'}
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Remote Info Tag */}
                <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-xl text-white text-xs font-semibold flex items-center gap-2 border border-slate-800">
                  <span>{remoteParticipantName || (userRole === 'teacher' ? 'Student Stream' : 'Instructor Stream')}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {remoteParticipantName ? 'Connected' : 'Room Ready'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeStage === 'whiteboard' && (
            <div className="flex-1 bg-white rounded-2xl overflow-hidden shadow-xl flex flex-col min-h-0">
              <InteractiveWhiteboard
                roomName={`wb_${(roomTitle || 'class').toLowerCase().replace(/[^a-z0-9]/g, '_')}`}
                teacherName={userRole === 'teacher' ? currentUserName : undefined}
                isTeacher={userRole === 'teacher'}
              />
            </div>
          )}

          {activeStage === 'workspace' && renderWorkspacePlugin && (
            <div className="flex-1 bg-white rounded-2xl overflow-hidden shadow-xl p-4 min-h-0">
              {renderWorkspacePlugin}
            </div>
          )}

          {/* 3. BOTTOM FLOATING MEDIA CONTROLS DOCK */}
          <div className="mt-3 flex items-center justify-center gap-2.5 sm:gap-4 shrink-0">
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 px-4 py-2.5 rounded-2xl flex items-center gap-2 sm:gap-3 shadow-2xl">
              {/* Mic Toggle */}
              <button
                onClick={toggleMic}
                className={`p-3 rounded-xl font-semibold transition-all cursor-pointer select-none active:scale-95 ${
                  micEnabled
                    ? 'bg-slate-800 hover:bg-slate-700 text-white'
                    : 'bg-red-600 text-white hover:bg-red-700 ring-2 ring-red-400/40'
                }`}
                title={micEnabled ? 'Mute Microphone' : 'Unmute Microphone'}
              >
                {micEnabled ? <Mic className="w-4 h-4 sm:w-5 sm:h-5" /> : <MicOff className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>

              {/* Video Toggle */}
              <button
                onClick={toggleVideo}
                className={`p-3 rounded-xl font-semibold transition-all cursor-pointer select-none active:scale-95 ${
                  videoEnabled
                    ? 'bg-slate-800 hover:bg-slate-700 text-white'
                    : 'bg-red-600 text-white hover:bg-red-700 ring-2 ring-red-400/40'
                }`}
                title={videoEnabled ? 'Turn Camera Off' : 'Turn Camera On'}
              >
                {videoEnabled ? <VideoIcon className="w-4 h-4 sm:w-5 sm:h-5" /> : <VideoOff className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>

              {/* Screen Share */}
              <button
                onClick={toggleScreenShare}
                className={`p-3 rounded-xl font-semibold transition-all cursor-pointer select-none active:scale-95 ${
                  screenSharing ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
                title={screenSharing ? 'Stop Screen Share' : 'Share Screen'}
              >
                <MonitorUp className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Hand Raise */}
              <button
                onClick={() => setHandRaised(!handRaised)}
                className={`p-3 rounded-xl font-semibold transition-all cursor-pointer select-none active:scale-95 ${
                  handRaised ? 'bg-amber-500 text-slate-950 font-semibold' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
                title={handRaised ? 'Lower Hand' : 'Raise Hand'}
              >
                <Hand className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div className="h-6 w-px bg-slate-800 mx-1" />

              {/* Whiteboard Mode Toggle */}
              <button
                onClick={() => setActiveStage(activeStage === 'whiteboard' ? 'video' : 'whiteboard')}
                className={`p-3 rounded-xl font-semibold transition-all cursor-pointer select-none active:scale-95 ${
                  activeStage === 'whiteboard' ? 'bg-purple-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
                title="Toggle Whiteboard"
              >
                <PenTool className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Chat Panel Toggle */}
              <button
                onClick={() => {
                  setSidePanel(sidePanel === 'chat' ? null : 'chat');
                  setUnreadChatCount(0);
                }}
                className={`p-3 rounded-xl font-semibold transition-all cursor-pointer select-none active:scale-95 relative ${
                  sidePanel === 'chat' ? 'bg-emerald-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
                title="Toggle Classroom Chat"
              >
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                {unreadChatCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {unreadChatCount}
                  </span>
                )}
              </button>

              {/* Participants Roster Toggle */}
              <button
                onClick={() => setSidePanel(sidePanel === 'participants' ? null : 'participants')}
                className={`p-3 rounded-xl font-semibold transition-all cursor-pointer select-none active:scale-95 ${
                  sidePanel === 'participants' ? 'bg-emerald-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
                title="Toggle Participants"
              >
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* 4. DOCKED SLIDE-IN SIDE PANEL (CHAT & PARTICIPANTS) */}
        {sidePanel === 'chat' && (
          <aside className="w-80 sm:w-96 bg-slate-900 border-l border-slate-800 flex flex-col justify-between shrink-0 shadow-2xl z-30">
            <div className="h-12 px-4 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                Classroom Chat
              </span>
              <button
                onClick={() => setSidePanel(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4 text-slate-500 space-y-2">
                  <MessageSquare className="w-8 h-8 text-slate-700" />
                  <p className="text-xs font-semibold">No messages yet</p>
                  <p className="text-[11px] text-slate-500">Send a message to everyone in this class.</p>
                </div>
              ) : (
                messages.map((m) => {
                  const isMe = m.sender === currentUserName;
                  return (
                    <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 px-1">
                        <span className="font-semibold text-slate-300">{m.sender}</span>
                        {m.role === 'teacher' && (
                          <span className="px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-semibold">Teacher</span>
                        )}
                        <span>{m.time}</span>
                      </div>
                      <div
                        className={`px-3.5 py-2 rounded-2xl text-xs max-w-[85%] break-words leading-relaxed ${
                          isMe ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatMessagesEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={!messageInput.trim()}
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white transition-colors cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </aside>
        )}

        {sidePanel === 'participants' && (
          <aside className="w-80 sm:w-96 bg-slate-900 border-l border-slate-800 flex flex-col justify-between shrink-0 shadow-2xl z-30">
            <div className="h-12 px-4 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                Participants ({liveAttendees.length})
              </span>
              <button
                onClick={() => setSidePanel(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-2">
              {liveAttendees.map((att) => (
                <div
                  key={att.id}
                  className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-slate-700 text-white text-xs font-semibold flex items-center justify-center shrink-0">
                      {att.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{att.name}</p>
                      <span className="text-[10px] text-slate-400 capitalize">{att.role}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {att.handRaised && <Hand className="w-3.5 h-3.5 text-amber-400" />}
                    {att.isMuted ? <MicOff className="w-3.5 h-3.5 text-red-400" /> : <Mic className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                </div>
              ))}
            </div>

            {userRole === 'teacher' && (
              <div className="p-3 border-t border-slate-800">
                <button
                  onClick={handleTeacherMuteAll}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <VolumeX className="w-4 h-4" /> Mute All
                </button>
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  );
};
