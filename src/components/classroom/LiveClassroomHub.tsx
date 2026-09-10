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
  Volume2,
  UserCheck,
  Clock,
  ShieldCheck,
  Layers,
  GraduationCap,
  Award,
  Filter,
  Check,
  Star,
  ChevronRight,
  TrendingUp,
  Sliders,
  Play,
  RotateCcw,
  Compass,
  FileCheck
} from 'lucide-react';
import { InteractiveWhiteboard } from '../../collaboration/InteractiveWhiteboard';
import { ClassroomParticipant, TenantNiche } from '../../types';
import { Room, RoomEvent, RemoteTrack, RemoteParticipant, Track } from 'livekit-client';
import { Button, Card, Badge } from '../ui';

export type StudentLevelTier = 'beginner' | 'intermediate' | 'advanced';

export interface StudentLevelConfig {
  id: StudentLevelTier;
  label: string;
  sublabel: string;
  badgeColor: string;
  borderColor: string;
  bgLight: string;
  icon: any;
  targetTopics: string[];
}

interface LiveClassroomHubProps {
  roomTitle?: string;
  courseTitle?: string;
  userRole?: 'teacher' | 'student';
  currentUserName?: string;
  niche?: TenantNiche;
  studentLevel?: StudentLevelTier;
  onLeaveRoom?: () => void;
  renderWorkspacePlugin?: React.ReactNode;
}

export const LiveClassroomHub: React.FC<LiveClassroomHubProps> = ({
  roomTitle = 'Live Interactive Session',
  courseTitle = 'Curriculum & Live Coaching',
  userRole = 'student',
  currentUserName = 'Alex Mercer',
  niche = 'coding',
  studentLevel = 'intermediate',
  onLeaveRoom,
  renderWorkspacePlugin
}) => {
  const isCoding = niche === 'coding' || niche === 'code_academy';
  const isSchool = niche === 'school';
  const isQuran = !isCoding && !isSchool;

  // Vertical-Specific Level Tiers Definitions
  const levelConfigs: Record<StudentLevelTier, StudentLevelConfig> = {
    beginner: {
      id: 'beginner',
      label: isQuran
        ? 'Level 1: Noorani Qaidah & Makharij'
        : isCoding
        ? 'Tier 1: Core Fundamentals & JS'
        : 'Grade 9: Foundation & Core Syllabi',
      sublabel: isQuran
        ? 'Phonetics, letter exits (Makharij), short & long vowels'
        : isCoding
        ? 'Variables, loops, DOM, functions, Git basics'
        : 'Algebra I, Biology foundations, Intro Essay Composition',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      borderColor: 'border-emerald-200',
      bgLight: 'bg-emerald-50/60',
      icon: isQuran ? BookOpen : isCoding ? Code : GraduationCap,
      targetTopics: isQuran
        ? ['Arabic Alphabet Makharij (ح، خ، ع)', 'Harakat (Fatha, Kasra, Damma)', 'Basic Madd Rules (2 Harakah)']
        : isCoding
        ? ['JavaScript ES6+ Syntax', 'Array & Object Methods', 'DOM Manipulation & Events']
        : ['Polynomial Equations', 'Cellular Respiration', 'Thesis Statement Structure']
    },
    intermediate: {
      id: 'intermediate',
      label: isQuran
        ? 'Level 2: Juz Amma & Tajweed Application'
        : isCoding
        ? 'Tier 2: Full-Stack React & APIs'
        : 'Grade 11: Honors & AP Coursework',
      sublabel: isQuran
        ? 'Ahkam Al-Nun & Al-Meem, Mudood, fluent Juz 30 recitation'
        : isCoding
        ? 'React 19 Server Components, TypeScript, Next.js, REST/GraphQL'
        : 'AP Calculus AB, Organic Chemistry, Analytical Literature',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      borderColor: 'border-blue-200',
      bgLight: 'bg-blue-50/60',
      icon: isQuran ? Award : isCoding ? Layers : Award,
      targetTopics: isQuran
        ? ['Idgham, Ikhfa, Iqlab, Izhar', 'Madd Lazim & Munfasil', 'Juz 30 Continuous Fluency']
        : isCoding
        ? ['React 19 Server Actions & Hooks', 'TypeScript Strict Typing', 'Optimistic UI & Cache Revalidation']
        : ['Taylor & Maclaurin Series', 'Chemical Reaction Kinetics', 'Rhetorical Analysis & Synthesis']
    },
    advanced: {
      id: 'advanced',
      label: isQuran
        ? 'Level 3: Hifz Revision & Sanad Ijazah'
        : isCoding
        ? 'Tier 3: Distributed Systems & Cloud'
        : 'Grade 12: Senior Capstone & Honors',
      sublabel: isQuran
        ? 'Multi-Juz memorization, Waqf & Ibtida\', Sanad precision'
        : isCoding
        ? 'System Design, Microservices, CI/CD, Redis caching, high load'
        : 'Multivariable Calculus, Advanced Physics, Capstone Thesis',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
      borderColor: 'border-purple-200',
      bgLight: 'bg-purple-50/60',
      icon: isQuran ? Star : isCoding ? Sparkles : Star,
      targetTopics: isQuran
        ? ['Waqf & Ibtida\' Precision Rules', 'Mutashabihat Al-Quran Mastery', 'Sanad Chain Oral Audit']
        : isCoding
        ? ['High-Concurrency Architecture', 'Microservices & Message Queues', 'Distributed Database Sharding']
        : ['Stokes & Green\'s Theorems', 'Quantum Mechanics Intro', 'Peer-Reviewed Capstone Defense']
    }
  };

  // Active level filter for the live room view
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<'all' | StudentLevelTier>('all');
  const [activeUserLevel, setActiveUserLevel] = useState<StudentLevelTier>(studentLevel);
  const [activeBreakoutPod, setActiveBreakoutPod] = useState<string>('main');
  const [showAssessmentModal, setShowAssessmentModal] = useState<boolean>(false);
  const [assessmentStudent, setAssessmentStudent] = useState<any>(null);

  // Classroom Tabs
  const [activeTab, setActiveTab] = useState<'forum' | 'video' | 'agenda' | 'whiteboard' | 'workspace' | 'pods' | 'attendance'>('video');

  // Automated Live Attendance Tracking State with Level Classification
  const [liveAttendees, setLiveAttendees] = useState<{
    id: string;
    name: string;
    role: 'teacher' | 'student';
    level: StudentLevelTier;
    joinedAt: string;
    secondsPresent: number;
    completionStatus: 'Attended (Active)' | 'Completed Full Class' | 'Left Early (Incomplete)';
    avatar: string;
    currentScore?: number;
    notes?: string;
  }[]>([
    {
      id: 'att-1',
      name: currentUserName,
      role: userRole,
      level: activeUserLevel,
      joinedAt: '10:00 AM',
      secondsPresent: 240,
      completionStatus: 'Attended (Active)',
      avatar: currentUserName.slice(0, 2).toUpperCase(),
      currentScore: 94
    },
    {
      id: 'att-2',
      name: isSchool ? 'Fatima Al-Zahra' : isCoding ? 'David Miller' : 'Zaid Al-Mansoor',
      role: 'student',
      level: 'intermediate',
      joinedAt: '10:01 AM',
      secondsPresent: 235,
      completionStatus: 'Attended (Active)',
      avatar: 'FZ',
      currentScore: 88,
      notes: isQuran ? 'Fluent in Juz 30, practicing Ikhfa' : isCoding ? 'Built Next.js CRUD API' : 'Completed Problem Set 4'
    },
    {
      id: 'att-3',
      name: isSchool ? 'Tariq Ibn Ziyad' : isCoding ? 'Omar Farooq' : 'Aisha Siddiqa',
      role: 'student',
      level: 'beginner',
      joinedAt: '10:03 AM',
      secondsPresent: 210,
      completionStatus: 'Attended (Active)',
      avatar: 'TZ',
      currentScore: 92,
      notes: isQuran ? 'Mastering throat letters (Makharij)' : isCoding ? 'Working on async/await loops' : 'Studying Polynomial Derivations'
    },
    {
      id: 'att-4',
      name: isSchool ? 'Hamza Al-Khatib' : isCoding ? 'Elena Rostova' : 'Bilal Ibn Rabah',
      role: 'student',
      level: 'advanced',
      joinedAt: '09:58 AM',
      secondsPresent: 260,
      completionStatus: 'Completed Full Class',
      avatar: 'HR',
      currentScore: 98,
      notes: isQuran ? '10 Juz Hifz Murajaah in progress' : isCoding ? 'Architecting Redis pub/sub' : 'Preparing Honors Capstone'
    }
  ]);

  // Call & Media State
  const [isInCall, setIsInCall] = useState<boolean>(false);
  const [micEnabled, setMicEnabled] = useState<boolean>(true);
  const [videoEnabled, setVideoEnabled] = useState<boolean>(true);
  const [screenSharing, setScreenSharing] = useState<boolean>(false);
  const [handRaised, setHandRaised] = useState<boolean>(false);
  const [sessionSeconds, setSessionSeconds] = useState<number>(0);
  const [audioLevel, setAudioLevel] = useState<number>(0);

  // LiveKit WebRTC Peer Connection State
  const [isConnectedToSFU, setIsConnectedToSFU] = useState<boolean>(false);
  const [remoteParticipantName, setRemoteParticipantName] = useState<string | null>(null);
  const [hasRemoteVideo, setHasRemoteVideo] = useState<boolean>(false);

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

  // Messages Stream (Strictly Decoupled for School vs Coding vs Quran)
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
      sender: isSchool ? 'Dr. Eleanor Vance' : isCoding ? 'Sarah Jenkins' : 'Shaykh Dr. Abdul Rahman',
      role: 'teacher',
      text: isSchool
        ? 'Welcome to the live academic lecture! Today we cover Unit 5 Taylor series derivations, radius of convergence, and problem set 5.'
        : isCoding
        ? 'Welcome to the Live Coding Session! Today we cover React 19 Server Actions, optimistic mutations, and custom hook architectures.'
        : 'Assalamu Alaikum. Welcome everyone to today\'s live halaqah! We will practice Tajweed rules and oral recitations.',
      time: '10:00 AM',
      pinned: true,
      attachment: isSchool
        ? { name: 'Unit5_Taylor_Series_Slides.pdf', size: '3.4 MB' }
        : isCoding
        ? { name: 'React19_Server_Actions.md', size: '42 KB' }
        : { name: 'Tajweed_Rules_Guide.pdf', size: '1.2 MB' }
    },
    {
      id: 'm-2',
      sender: isSchool ? 'Alex Mercer' : isCoding ? 'David Miller' : 'Fatima Zahra',
      role: 'student',
      text: isSchool
        ? 'Good morning Professor, ready with the textbook proofs and derivation notes.'
        : isCoding
        ? 'Ready with my local sandbox repository and unit test suite.'
        : 'Wa Alaikum Assalam Ustadh, completed the recitation homework.',
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

  // WebRTC & Camera Initialization (Dual Engine: LiveKit Cloud SFU + Real Browser WebRTC Mesh)
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

      const roomName = `room-${roomTitle.toLowerCase().replace(/\s+/g, '-')}`;

      // 1. Direct WebRTC Peer Connection with BroadcastChannel Cross-Tab Signaling
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const bc = new BroadcastChannel(`hifz_webrtc_${roomName}`);
        broadcastChannelRef.current = bc;

        const pc = new RTCPeerConnection({
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' }
          ]
        });
        peerConnectionRef.current = pc;

        // Add local tracks to WebRTC peer connection
        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });

        pc.onicecandidate = (event) => {
          if (event.candidate && bc) {
            bc.postMessage({
              type: 'ice_candidate',
              candidate: event.candidate,
              sender: currentUserName
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
            try {
              const offer = await pc.createOffer();
              await pc.setLocalDescription(offer);
              bc.postMessage({
                type: 'peer_offer',
                sdp: offer,
                sender: currentUserName
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
                sender: currentUserName
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
            setForumMessages((prev) => [...prev, data.message]);
          } else if (data.type === 'peer_leave') {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = null;
            }
            setHasRemoteVideo(false);
            setRemoteParticipantName(null);
          }
        };

        // Announce presence to other peers in room
        bc.postMessage({
          type: 'peer_join',
          sender: currentUserName,
          role: userRole
        });
      }

      // 2. Connect to LiveKit Cloud WebRTC SFU (if configured)
      const tokenRes = await fetch(
        `/api/livekit/token?room=${encodeURIComponent(roomName)}&username=${encodeURIComponent(currentUserName)}`
      );
      if (tokenRes.ok) {
        const { token, wsUrl, isFallback } = await tokenRes.json();
        if (token && wsUrl && !isFallback) {
          try {
            const room = new Room({
              adaptiveStream: true,
              dynacast: true,
            });
            livekitRoomRef.current = room;

            // Wire remote participant track events
            room.on(RoomEvent.Connected, () => {
              setIsConnectedToSFU(true);
              room.remoteParticipants.forEach((participant) => {
                setRemoteParticipantName(participant.name || participant.identity);
                participant.trackPublications.forEach((pub) => {
                  if (pub.isSubscribed && pub.track) {
                    if (pub.track.kind === Track.Kind.Video && remoteVideoRef.current) {
                      pub.track.attach(remoteVideoRef.current);
                      setHasRemoteVideo(true);
                    }
                    if (pub.track.kind === Track.Kind.Audio && remoteAudioRef.current) {
                      pub.track.attach(remoteAudioRef.current);
                    }
                  }
                });
              });
            });

            room.on(RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => {
              setRemoteParticipantName(participant.name || participant.identity);
            });

            room.on(RoomEvent.ParticipantDisconnected, () => {
              if (room.remoteParticipants.size === 0) {
                setRemoteParticipantName(null);
                setHasRemoteVideo(false);
              }
            });

            room.on(RoomEvent.TrackSubscribed, (track: RemoteTrack, pub, participant: RemoteParticipant) => {
              setRemoteParticipantName(participant.name || participant.identity);
              if (track.kind === Track.Kind.Video && remoteVideoRef.current) {
                track.attach(remoteVideoRef.current);
                setHasRemoteVideo(true);
              } else if (track.kind === Track.Kind.Audio && remoteAudioRef.current) {
                track.attach(remoteAudioRef.current);
              }
            });

            room.on(RoomEvent.TrackUnsubscribed, (track: RemoteTrack) => {
              track.detach();
              if (track.kind === Track.Kind.Video) {
                setHasRemoteVideo(false);
              }
            });

            await room.connect(wsUrl, token);
            await room.localParticipant.enableCameraAndMicrophone();
          } catch (e) {
            console.warn('LiveKit cloud connection notice (using P2P mesh):', e);
          }
        }
      }
    } catch (err) {
      console.warn('Camera & WebRTC connection error:', err);
    }
  };

  const handleLeaveCall = () => {
    setIsInCall(false);
    setIsConnectedToSFU(false);
    setRemoteParticipantName(null);
    setHasRemoteVideo(false);

    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'peer_leave',
        sender: currentUserName
      });
      broadcastChannelRef.current.close();
      broadcastChannelRef.current = null;
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
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

  const toggleMic = async () => {
    const nextState = !micEnabled;
    setMicEnabled(nextState);

    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = nextState;
      }
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
      if (videoTrack) {
        videoTrack.enabled = nextState;
      }
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
    setForumMessages((prev) => [...prev, newMsg]);
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'chat_message',
        message: newMsg,
        sender: currentUserName
      });
    }
    setMessageInput('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* 1. CLEAN MODERN TOP HEADER (Light Mode & Highly Responsive) */}
      <header className="bg-white border-b border-slate-200 px-3 sm:px-6 py-2.5 sm:py-3 flex flex-col md:flex-row md:items-center justify-between gap-2.5 shrink-0 shadow-xs">
        {/* Title & Status */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-white flex items-center justify-center font-bold shrink-0 ${
              isCoding ? 'bg-blue-600' : 'bg-emerald-600'
            }`}>
              {isCoding ? <Code className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> : <BookOpen className="w-4 h-4 sm:w-4.5 sm:h-4.5" />}
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
            onClick={() => setActiveTab('video')}
            className={`px-3 py-1.5 sm:py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap select-none ${
              activeTab === 'video' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            <VideoIcon className={`w-3.5 h-3.5 shrink-0 ${isCoding ? 'text-blue-600' : isSchool ? 'text-purple-600' : 'text-emerald-600'}`} />
            <span>Live Class ({liveAttendees.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pods')}
            className={`px-3 py-1.5 sm:py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap select-none ${
              activeTab === 'pods' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>Level Pods (3)</span>
          </button>

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
            onClick={() => setActiveTab('agenda')}
            className={`px-3 py-1.5 sm:py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap select-none ${
              activeTab === 'agenda' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            <ListTodo className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Curriculum Agenda</span>
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
            <Sparkles className={`w-3.5 h-3.5 shrink-0 ${isCoding ? 'text-blue-600' : isSchool ? 'text-purple-600' : 'text-emerald-600'}`} />
            <span>{isCoding ? 'Code Sandbox' : isSchool ? 'Academic SIS Lab' : 'Mushaf Reader'}</span>
          </button>

          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-3 py-1.5 sm:py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap select-none ${
              activeTab === 'attendance' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Attendance & Levels</span>
          </button>
        </div>

        {/* Desktop Call Actions */}
        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAssessmentModal(true)}
            leftIcon={<Award className="w-3.5 h-3.5 text-amber-500" />}
            className="font-bold text-xs"
          >
            Level Rubric
          </Button>

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

      {/* 2. DYNAMIC LEVEL CLASSIFIER & POD FILTER SUB-BAR */}
      <div className="bg-white border-b border-slate-200 px-3 sm:px-6 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shrink-0 shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[11px] shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filter by Level:</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setSelectedLevelFilter('all')}
              className={`px-2.5 py-1 rounded-md font-bold text-[11px] transition-all cursor-pointer select-none ${
                selectedLevelFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Levels ({liveAttendees.length})
            </button>
            {(['beginner', 'intermediate', 'advanced'] as StudentLevelTier[]).map((lvl) => {
              const cfg = levelConfigs[lvl];
              const count = liveAttendees.filter((a) => a.level === lvl).length;
              const isSelected = selectedLevelFilter === lvl;
              return (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevelFilter(lvl)}
                  className={`px-2.5 py-1 rounded-md font-bold text-[11px] transition-all cursor-pointer select-none flex items-center gap-1 ${
                    isSelected
                      ? `${cfg.badgeColor} shadow-2xs font-extrabold`
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{lvl === 'beginner' ? 'Level 1' : lvl === 'intermediate' ? 'Level 2' : 'Level 3'}</span>
                  <span className="font-mono text-[10px] opacity-75">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Active User Level Badge & Pod Indicator */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <span className="text-[11px] text-slate-500 font-medium">Your Track:</span>
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${levelConfigs[activeUserLevel].badgeColor} flex items-center gap-1`}>
            {React.createElement(levelConfigs[activeUserLevel].icon, { className: 'w-3 h-3' })}
            {levelConfigs[activeUserLevel].label}
          </span>
          {activeBreakoutPod !== 'main' && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
              Pod: {activeBreakoutPod}
            </span>
          )}
        </div>
      </div>

      {/* 3. BODY CONTENT */}
      <div className="flex-1 flex overflow-hidden p-2.5 sm:p-4 min-w-0">
        {/* Tab 1: Live Video Call */}
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
                    <div className={`w-16 h-16 rounded-full text-white flex items-center justify-center font-bold text-xl shadow-lg ${
                      isCoding ? 'bg-blue-600' : isSchool ? 'bg-purple-600' : 'bg-emerald-600'
                    }`}>
                      {currentUserName.charAt(0)}
                    </div>
                    <span className="text-xs text-slate-400 font-semibold">{currentUserName} (Camera Off)</span>
                  </div>
                )}

                {/* Floating Indicators */}
                <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-md px-3 py-1 rounded-xl text-white text-xs font-bold flex items-center gap-2 border border-slate-700/60">
                  <span>{currentUserName} (You)</span>
                  <span className={`text-[10px] px-2 py-0.2 rounded-md font-bold ${levelConfigs[activeUserLevel].badgeColor}`}>
                    {activeUserLevel === 'beginner' ? 'Lvl 1' : activeUserLevel === 'intermediate' ? 'Lvl 2' : 'Lvl 3'}
                  </span>
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

              {/* Remote Participant / Real WebRTC Stream Card */}
              <div className="relative aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center shadow-lg w-full max-h-[380px] mx-auto">
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
                      <div className="flex flex-col items-center text-center p-4 gap-2.5">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl shadow-lg ${
                          remoteParticipantName
                            ? 'bg-blue-600 text-white ring-2 ring-blue-400/40'
                            : 'bg-slate-800 text-slate-400 ring-2 ring-slate-700/50'
                        }`}>
                          {remoteParticipantName ? remoteParticipantName.slice(0, 2).toUpperCase() : <Users className="w-7 h-7 text-slate-400" />}
                        </div>
                        
                        <div className="space-y-1 max-w-xs">
                          <span className="text-xs font-bold text-white block">
                            {remoteParticipantName || (userRole === 'teacher' ? 'Waiting for student to connect...' : 'Instructor / Peer Session')}
                          </span>
                          <span className="text-[11px] text-slate-400 leading-tight block">
                            {remoteParticipantName
                              ? 'Connected via Real WebRTC P2P Mesh'
                              : 'Open this classroom in a second browser window or student tab to experience 2-way live video, audio & whiteboard syncing!'}
                          </span>
                        </div>

                        {isConnectedToSFU && (
                          <span className="text-[10px] text-emerald-400 flex items-center gap-1.5 font-mono bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Live Mesh Connected
                          </span>
                        )}
                      </div>
                    )}
                  </>
                )}

                <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-md px-3 py-1 rounded-xl text-white text-xs font-bold flex items-center gap-2 border border-slate-700/60">
                  <span>{remoteParticipantName || (isSchool ? 'Faculty: Dr. Eleanor Vance' : isCoding ? 'Mentor: Sarah Jenkins' : 'Ustaz: Shaykh Abdul Rahman')}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Lead Faculty
                  </span>
                  {remoteParticipantName && <Volume2 className="w-3 h-3 text-emerald-400" />}
                </div>
              </div>
            </div>

            {/* Bottom Floating Media Controls */}
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
                  screenSharing ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
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

        {/* Tab 2: Level Breakout Pods */}
        {activeTab === 'pods' && (
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 overflow-y-auto space-y-6 max-w-5xl mx-auto w-full shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-600" />
                  {isQuran ? 'Level-Based Halaqah Breakout Pods' : isCoding ? 'Level-Based Engineering Pairing Pods' : 'Academic Grade Study Pods'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Students collaborate in focused pods tailored to their level tier, allowing tailored pacing without overwhelming beginners or slowing down advanced learners.
                </p>
              </div>

              <Badge variant="info" className="font-bold text-xs shrink-0">
                Main Room + 3 Active Pods
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(['beginner', 'intermediate', 'advanced'] as StudentLevelTier[]).map((tier) => {
                const cfg = levelConfigs[tier];
                const podStudents = liveAttendees.filter((a) => a.level === tier);
                const isMyPod = activeUserLevel === tier;
                const isJoined = activeBreakoutPod === tier;

                return (
                  <div
                    key={tier}
                    className={`rounded-2xl border p-4.5 flex flex-col justify-between transition-all ${
                      isJoined
                        ? 'border-indigo-500 ring-2 ring-indigo-300 bg-indigo-50/40'
                        : `${cfg.borderColor} bg-white hover:border-slate-400 hover:shadow-xs`
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${cfg.badgeColor}`}>
                          {tier.toUpperCase()}
                        </span>
                        {isMyPod && (
                          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                            Your Assigned Pod
                          </span>
                        )}
                      </div>

                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 leading-snug">{cfg.label}</h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{cfg.sublabel}</p>
                      </div>

                      {/* Target Learning Objectives */}
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">Pod Focus Topics:</span>
                        <ul className="space-y-1 text-xs text-slate-700">
                          {cfg.targetTopics.map((topic, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-[11px]">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                              <span className="leading-tight">{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Current Attendees in Pod */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                          Active Learners ({podStudents.length}):
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {podStudents.map((st) => (
                            <div
                              key={st.id}
                              className="px-2 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-semibold flex items-center gap-1"
                            >
                              <div className="w-4 h-4 rounded-full bg-slate-900 text-white text-[9px] flex items-center justify-center font-bold">
                                {st.avatar}
                              </div>
                              <span>{st.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 mt-4">
                      {isJoined ? (
                        <button
                          onClick={() => setActiveBreakoutPod('main')}
                          className="w-full py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition-all cursor-pointer"
                        >
                          Return to Main Stage
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setActiveBreakoutPod(tier);
                            setActiveTab('video');
                          }}
                          className="w-full py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>Join {tier === 'beginner' ? 'Level 1' : tier === 'intermediate' ? 'Level 2' : 'Level 3'} Pod</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Discussion Forum */}
        {activeTab === 'forum' && (
          <div className="flex-1 flex flex-col justify-between bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden max-w-5xl mx-auto w-full">
            <div className="p-3.5 sm:p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className={`w-4 h-4 animate-pulse ${isCoding ? 'text-blue-600' : isSchool ? 'text-purple-600' : 'text-emerald-600'}`} />
                <span className="text-xs sm:text-sm font-bold text-slate-900">
                  {isCoding ? 'Engineering Discussion Thread & Code Snippets' : isSchool ? 'Academic Lecture Thread & Lecture Slides' : 'Halaqah Thread & Tajweed Inquiries'}
                </span>
              </div>
              {!isInCall && (
                <button
                  onClick={handleStartCall}
                  className={`text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer ${
                    isCoding ? 'text-blue-700' : isSchool ? 'text-purple-700' : 'text-emerald-700'
                  }`}
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
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          isCoding ? 'bg-blue-100 text-blue-800' : isSchool ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {isCoding ? 'Lead Mentor' : isSchool ? 'Professor' : 'Ustadh'}
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
                      <div className="inline-flex items-center gap-2 p-2 rounded-lg bg-slate-100 text-xs text-blue-700 border border-slate-200">
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

        {/* Tab 4: Level-Tailored Curriculum Agenda */}
        {activeTab === 'agenda' && (
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 overflow-y-auto space-y-6 max-w-4xl mx-auto w-full shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                  <ListTodo className="w-4.5 h-4.5 text-amber-600" />
                  {isCoding ? 'Full-Stack Curriculum Milestones' : isSchool ? 'Academic Syllabi & Lecture Agenda' : 'Hifz & Tajweed Progression Agenda'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Milestones are organized by level tier to give each cohort clear learning objectives.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowAssessmentModal(true)}
                  leftIcon={<Award className="w-3.5 h-3.5 text-amber-500" />}
                  className="font-bold text-xs"
                >
                  Grade Rubric
                </Button>
              </div>
            </div>

            {/* Level Tier Agendas */}
            <div className="space-y-5">
              {(['beginner', 'intermediate', 'advanced'] as StudentLevelTier[])
                .filter((lvl) => selectedLevelFilter === 'all' || selectedLevelFilter === lvl)
                .map((lvl) => {
                  const cfg = levelConfigs[lvl];
                  const milestones = isSchool
                    ? lvl === 'beginner'
                      ? [
                          { title: 'Algebra I: Solving Linear Inequalities & Graphing', done: true },
                          { title: 'Biology: Cell Membrane Transport & Osmosis', done: false }
                        ]
                      : lvl === 'intermediate'
                      ? [
                          { title: 'AP Calculus AB: Taylor & Maclaurin Polynomial Proofs', done: true },
                          { title: 'Organic Chemistry: Nucleophilic Substitution Mechanisms', done: false }
                        ]
                      : [
                          { title: 'Multivariable Calculus: Stokes\' Theorem on Surfaces', done: true },
                          { title: 'Senior Honors Capstone: Peer Literature Defense', done: false }
                        ]
                    : isCoding
                    ? lvl === 'beginner'
                      ? [
                          { title: 'JavaScript ES6: Arrow Functions, Map, Filter & Reduce', done: true },
                          { title: 'DOM Events & Asynchronous Fetch API Requests', done: false }
                        ]
                      : lvl === 'intermediate'
                      ? [
                          { title: 'React 19: Server Actions & Optimistic State Mutations', done: true },
                          { title: 'Building Strongly-Typed Next.js REST & GraphQL APIs', done: false }
                        ]
                      : [
                          { title: 'Distributed Systems: Microservices & Event Streams', done: true },
                          { title: 'Redis Cache Layer Invalidation & High-Throughput Load Testing', done: false }
                        ]
                    : lvl === 'beginner'
                    ? [
                        { title: 'Noorani Qaidah: Throat & Tongue Makharij Verification (ح، خ، ع)', done: true },
                        { title: 'Harakat Precision: Distinguishing Fatha vs Short Alif', done: false }
                      ]
                    : lvl === 'intermediate'
                    ? [
                        { title: 'Surah Al-Mulk: Precision Tajweed & Ahkam Al-Nun (Ayahs 1-10)', done: true },
                        { title: 'Oral Recitation Audits with Floating Audio Looper', done: false }
                      ]
                    : [
                        { title: '10 Juz Muraja\'ah: Mutashabihat Cross-Surah Retention Audit', done: true },
                        { title: 'Sanad Chain Recitation Verification & Waqf Mastery', done: false }
                      ];

                  return (
                    <div key={lvl} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/60 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${cfg.badgeColor}`}>
                            {cfg.label}
                          </span>
                          <span className="text-xs text-slate-500 font-medium hidden sm:inline">{cfg.sublabel}</span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-slate-500">
                          {milestones.filter((m) => m.done).length}/{milestones.length} Done
                        </span>
                      </div>

                      <div className="space-y-2">
                        {milestones.map((item, idx) => (
                          <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-white flex items-start gap-3">
                            <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                              item.done
                                ? isSchool ? 'bg-purple-600 text-white' : isCoding ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
                                : 'border border-slate-300 bg-white'
                            }`}>
                              {item.done && <CheckCircle2 className="w-3.5 h-3.5" />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={`text-xs sm:text-sm font-bold ${item.done ? 'text-slate-700 line-through' : 'text-slate-900'}`}>{item.title}</p>
                              <span className="text-[10px] text-slate-400">Target Time: 20 mins</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Tab 5: Whiteboard */}
        {activeTab === 'whiteboard' && (
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col">
            <InteractiveWhiteboard
              roomName={`whiteboard-${roomTitle.toLowerCase().replace(/\s+/g, '-')}`}
              teacherName={userRole === 'teacher' ? currentUserName : undefined}
              isTeacher={userRole === 'teacher'}
            />
          </div>
        )}

        {/* Tab 6: Interactive Workspace Plugin */}
        {activeTab === 'workspace' && (
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-3 sm:p-6 overflow-y-auto shadow-xs">
            {renderWorkspacePlugin || (
              <div className="p-8 text-center text-slate-400 space-y-3">
                <Sparkles className="w-8 h-8 mx-auto text-blue-500" />
                <p className="text-xs sm:text-sm font-semibold">Interactive Workspace Plugin Enabled for this Session.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 7: Automated Live Attendance & Level Classification Roster */}
        {activeTab === 'attendance' && (
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 overflow-y-auto space-y-6 max-w-4xl mx-auto w-full shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-4.5 h-4.5 text-emerald-600" />
                  Live Classroom Roster & Level Classification
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time attendance tracking with automated completion tagging and student level classification.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => setShowAssessmentModal(true)}
                  leftIcon={<Award className="w-3.5 h-3.5" />}
                  className="font-bold text-xs"
                >
                  Evaluate Level
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">Total Active</span>
                <span className="text-lg font-black text-emerald-950">{liveAttendees.length} Students</span>
                <p className="text-[11px] text-emerald-700 mt-0.5">Automated WebRTC presence</p>
              </div>

              <div className="p-3.5 bg-purple-50 rounded-xl border border-purple-200">
                <span className="text-[10px] uppercase font-bold text-purple-800 tracking-wider block">Session Duration</span>
                <span className="text-lg font-black text-purple-950 font-mono">{formatTimer(sessionSeconds)}</span>
                <p className="text-[11px] text-purple-700 mt-0.5">Target: 45 Minutes</p>
              </div>

              <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200">
                <span className="text-[10px] uppercase font-bold text-blue-800 tracking-wider block">Level Distribution</span>
                <span className="text-sm font-black text-blue-950 flex items-center gap-1.5 mt-1">
                  <span className="text-emerald-700">L1: {liveAttendees.filter((a) => a.level === 'beginner').length}</span> • 
                  <span className="text-blue-700">L2: {liveAttendees.filter((a) => a.level === 'intermediate').length}</span> • 
                  <span className="text-purple-700">L3: {liveAttendees.filter((a) => a.level === 'advanced').length}</span>
                </span>
                <p className="text-[11px] text-blue-700 mt-0.5">Classified into 3 Tiers</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Participant Roster {selectedLevelFilter !== 'all' ? `(Filtered by ${selectedLevelFilter})` : ''}
                </h4>
                <span className="text-xs text-slate-500 font-medium">Click "Evaluate" to assess live performance</span>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                {liveAttendees
                  .filter((att) => selectedLevelFilter === 'all' || att.level === selectedLevelFilter)
                  .map((att) => {
                    const isCompleted = sessionSeconds > 30 || att.completionStatus === 'Completed Full Class';
                    const cfg = levelConfigs[att.level];
                    return (
                      <div key={att.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {att.avatar}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-xs font-bold text-slate-900 truncate">{att.name}</p>
                              <span className={`px-2 py-0.2 rounded-full text-[10px] font-extrabold border ${cfg.badgeColor}`}>
                                {cfg.label.split(':')[0]}
                              </span>
                              {att.currentScore && (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                                  Score: {att.currentScore}%
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              Joined {att.joinedAt} • {att.notes || cfg.sublabel}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                          {isCompleted ? (
                            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Completed
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 animate-spin text-amber-700" />
                              Attending
                            </span>
                          )}

                          <button
                            onClick={() => {
                              setAssessmentStudent(att);
                              setShowAssessmentModal(true);
                            }}
                            className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
                          >
                            Rubric
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. LIVE LEVEL ASSESSMENT & RUBRIC EVALUATION MODAL */}
      {showAssessmentModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-5 sm:p-6 space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-white font-bold ${
                  isCoding ? 'bg-blue-600' : isSchool ? 'bg-purple-600' : 'bg-emerald-600'
                }`}>
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900">
                    {isQuran ? 'Tajweed & Hifz Oral Level Rubric' : isCoding ? 'Software Engineering Competency Rubric' : 'Academic Mastery & Proof Rubric'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Evaluating: <strong className="text-slate-800">{assessmentStudent?.name || currentUserName}</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAssessmentModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Rubric Evaluation Criteria */}
            <div className="space-y-3.5">
              {(isQuran
                ? [
                    { name: 'Makharij (Letter Exits & Throat Articulation)', desc: 'Precision of ح، خ، ع، غ articulation without distortion' },
                    { name: 'Ahkam Al-Nun & Meem (Idgham, Ikhfa, Iqlab)', desc: 'Applying Ghunnah 2 counts and clear Izhar' },
                    { name: 'Mudood (Madd Lazim, Munfasil, Muttasil)', desc: 'Rhythmic timing of elongated vowels (2, 4, 6 Harakat)' },
                    { name: 'Waqf & Ibtida\' (Stopping and Starting)', desc: 'Stopping on complete semantic meanings without breaking context' }
                  ]
                : isCoding
                ? [
                    { name: 'Algorithmic Efficiency & Big-O Time Complexity', desc: 'Optimal loop structures, hash maps vs nested arrays' },
                    { name: 'React 19 & Clean Architecture Patterns', desc: 'Proper hook abstraction, optimistic state, server actions' },
                    { name: 'TypeScript Strictness & Type Safety', desc: 'No any types, robust interfaces, generics where appropriate' },
                    { name: 'Error Handling & Edge Cases', desc: 'Try/catch boundaries, loading skeletons, fallback UI handling' }
                  ]
                : [
                    { name: 'Mathematical Proof & Theoretical Rigor', desc: 'Step-by-step logic, correct theorem citations and assumptions' },
                    { name: 'Computational Accuracy & Derivation Steps', desc: 'Precision in calculus steps, algebraic simplification' },
                    { name: 'Critical Reasoning & Problem Synthesis', desc: 'Applying foundational principles to novel problem sets' },
                    { name: 'Clarity of Solution Presentation', desc: 'Neat documentation, clean diagrams, clear final deductions' }
                  ]
              ).map((crit, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{crit.name}</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Grade: 5 / 5
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{crit.desc}</p>
                  <div className="flex items-center gap-1.5 pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="p-1 rounded hover:bg-slate-200 text-amber-500 cursor-pointer"
                      >
                        <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Target Level Reclassification Selector */}
            <div className="p-3.5 bg-indigo-50/70 rounded-2xl border border-indigo-200 space-y-2">
              <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                Assign Level Promotion / Track:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(['beginner', 'intermediate', 'advanced'] as StudentLevelTier[]).map((lvl) => {
                  const cfg = levelConfigs[lvl];
                  const isCur = activeUserLevel === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => {
                        setActiveUserLevel(lvl);
                        if (assessmentStudent) {
                          setLiveAttendees((prev) =>
                            prev.map((a) => (a.id === assessmentStudent.id ? { ...a, level: lvl } : a))
                          );
                        }
                      }}
                      className={`p-2 rounded-xl text-center border font-bold text-xs transition-all cursor-pointer ${
                        isCur
                          ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <span>{lvl === 'beginner' ? 'Level 1' : lvl === 'intermediate' ? 'Level 2' : 'Level 3'}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAssessmentModal(false)}
                className="font-bold text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setShowAssessmentModal(false);
                }}
                leftIcon={<Check className="w-3.5 h-3.5" />}
                className="font-bold text-xs"
              >
                Save Evaluation & Update Level
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveClassroomHub;

