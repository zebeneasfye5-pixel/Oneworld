import React, { useState, useEffect, useRef } from 'react';
import { 
  Room, 
  RoomOccupant, 
  LanguageCode, 
  LiveSpeechMessage, 
  VirtualGift 
} from '../types';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Volume2, 
  Send, 
  Gift, 
  Plus, 
  Radio, 
  Globe2, 
  Sparkles, 
  Hand, 
  UserCheck, 
  Award,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Activity,
  Camera,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { translateTextWithGemini } from '../services/geminiService';
import { 
  startSpeechRecognition, 
  stopSpeechRecognition, 
  speakText 
} from '../services/speechService';
import { GiftModal } from './GiftModal';
import { PersonalRoomModal } from './PersonalRoomModal';
import { TRANSLATIONS, AppLanguage } from '../i18n/translations';

interface RoomStageProps {
  rooms: Room[];
  currentRoom: Room;
  onSelectRoom: (room: Room) => void;
  userLang: LanguageCode;
  userBalanceETB: number;
  occupants: RoomOccupant[];
  messages: LiveSpeechMessage[];
  onSendMessage: (msg: LiveSpeechMessage) => void;
  onSendGift: (gift: VirtualGift, recipient: RoomOccupant) => void;
  onCreatePersonalRoom: (room: Room) => void;
  onClaimSeat: (seatNumber: number) => void;
  onLeaveSeat: () => void;
  userSeatedNumber: number | null;
  onAddRoyalty: (amount: number, reason: string) => void;
}

export const RoomStage: React.FC<RoomStageProps> = ({
  rooms,
  currentRoom,
  onSelectRoom,
  userLang,
  userBalanceETB,
  occupants,
  messages,
  onSendMessage,
  onSendGift,
  onCreatePersonalRoom,
  onClaimSeat,
  onLeaveSeat,
  userSeatedNumber,
  onAddRoyalty
}) => {
  const t = TRANSLATIONS[userLang as AppLanguage] || TRANSLATIONS.am;
  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isUsingRealWebcam, setIsUsingRealWebcam] = useState(true);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<RoomOccupant | null>(null);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);
  const [activeTabCategory, setActiveTabCategory] = useState<string>('all');
  const [handRaised, setHandRaised] = useState(false);

  // Zoom & Full-Body View Controls
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [isFullBodyMode, setIsFullBodyMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioVolumeLevel, setAudioVolumeLevel] = useState<number>(0);

  // Real media stream & audio analyser refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Attach active stream to video element whenever element is mounted
  const attachStreamToVideo = (stream: MediaStream) => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.muted = true;
      videoRef.current.playsInline = true;
      videoRef.current.play().catch((err) => {
        console.warn('Video element play notice:', err);
      });
    }
  };

  // Ultra-Fast Zero-Latency Camera Controller with Warm Track Support
  const startCamera = async (facing: 'user' | 'environment' = cameraFacing) => {
    setCameraLoading(true);
    setCameraError(null);

    // Warm-track instant activation (0ms): If video track already exists, just enable it!
    if (mediaStreamRef.current && mediaStreamRef.current.getVideoTracks().length > 0 && cameraFacing === facing) {
      mediaStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = true;
      });
      setCameraActive(true);
      setIsVideoOn(true);
      setIsUsingRealWebcam(true);
      setCameraLoading(false);
      attachStreamToVideo(mediaStreamRef.current);
      return;
    }

    // If changing facingMode, stop old tracks
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getVideoTracks().forEach((track) => track.stop());
    }

    let stream: MediaStream | null = null;

    // Fast-capture Tier 1: Facing mode with zero resolution-probing delay
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing },
        audio: false // Kept decoupled for instant video startup
      });
    } catch (err1) {
      console.warn('Fast Tier 1 camera notice, trying universal:', err1);
      // Fast-capture Tier 2: Universal constraint fallback
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
      } catch (err2: any) {
        console.warn('All camera attempts failed:', err2);
        setCameraLoading(false);
        const isDenied = err2?.name === 'NotAllowedError' || err2?.name === 'PermissionDeniedError';
        setCameraError(
          isDenied
            ? 'የካሜራ ፍቃድ አልተሰጠም። እባክዎ ከላይ በብራውዘርዎ የካሜራ ፍቃድ (Allow) ይስጡና እዚህ እንደገና ይጫኑ።'
            : 'ካሜራ ማግኘት አልተቻለም። እባክዎ "ካሜራውን እንደገና ሞክር" የሚለውን ይጫኑ።'
        );
        setCameraActive(false);
        return;
      }
    }

    if (stream) {
      mediaStreamRef.current = stream;
      setCameraFacing(facing);
      setCameraActive(true);
      setIsVideoOn(true);
      setIsUsingRealWebcam(true);
      setCameraLoading(false);
      setCameraError(null);
      attachStreamToVideo(stream);
    }
  };

  // Instant 0ms Camera Off (Soft-disable video track while keeping driver warm)
  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = false;
      });
    }
    setCameraActive(false);
    setIsVideoOn(false);
  };

  const toggleVideo = () => {
    if (cameraActive && isVideoOn) {
      stopCamera();
    } else {
      startCamera(cameraFacing);
    }
  };

  const handleFlipCamera = () => {
    const nextFacing = cameraFacing === 'user' ? 'environment' : 'user';
    setCameraFacing(nextFacing);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getVideoTracks().forEach((track) => track.stop());
    }
    startCamera(nextFacing);
  };

  // Attempt initial fast camera start on mount
  useEffect(() => {
    startCamera('user').catch(() => {});

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Ultra-Fast Zero-Latency Decoupled Microphone Handling
  const startMicAudio = async () => {
    // Warm-track instant unmute (0ms): If mic track exists, simply enable it!
    if (micStreamRef.current && micStreamRef.current.getAudioTracks().length > 0) {
      micStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = true;
      });
      return;
    }

    try {
      const micStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      });
      micStreamRef.current = micStream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;
        const source = ctx.createMediaStreamSource(micStream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        analyserRef.current = analyser;

        const checkVolume = () => {
          if (analyserRef.current && isMicOn) {
            const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
            analyserRef.current.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / dataArray.length;
            setAudioVolumeLevel(Math.min(100, Math.round((avg / 128) * 100)));
          } else {
            setAudioVolumeLevel(0);
          }
          animFrameRef.current = requestAnimationFrame(checkVolume);
        };
        checkVolume();
      }
    } catch (err) {
      console.warn('Microphone stream error:', err);
    }
  };

  // Instant 0ms Mic Mute (Soft-disable track while keeping audio context warm)
  const stopMicAudio = () => {
    if (micStreamRef.current) {
      micStreamRef.current.getAudioTracks().forEach((trk) => {
        trk.enabled = false;
      });
    }
    setAudioVolumeLevel(0);
  };

  // Instant Speech Recognition and Microphone Unrestricted Toggle
  const toggleMicrophone = () => {
    const nextState = !isMicOn;
    setIsMicOn(nextState);

    if (nextState) {
      startMicAudio();
      startSpeechRecognition(
        userLang,
        (text, isFinal) => {
          if (text.trim()) {
            handleBroadcastVoiceSpeech(text);
          }
        },
        (err) => {
          console.warn('Speech recognition notice:', err);
        },
        () => {}
      );
    } else {
      stopMicAudio();
      stopSpeechRecognition();
    }
  };

  // INSTANT SPEECH DELIVERY (0ms Latency Arrival + Parallel Background Translation)
  const handleBroadcastVoiceSpeech = (spokenText: string) => {
    if (!spokenText.trim()) return;

    // 1. INSTANT ARRIVAL: Immediately broadcast to the room without any network delays!
    const msgId = `voice-${Date.now()}`;
    const newMsg: LiveSpeechMessage = {
      id: msgId,
      speakerName: 'እርስዎ (You - User)',
      speakerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
      sourceLang: userLang,
      originalText: spokenText,
      translations: {
        am: spokenText,
        en: spokenText,
        om: spokenText,
        ti: spokenText,
        ar: spokenText,
        fr: spokenText,
        es: spokenText,
        zh: spokenText,
        de: spokenText
      },
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      seatNumber: userSeatedNumber || 1
    };

    // Emit immediately so user and audience see speech arrive with ZERO latency!
    onSendMessage(newMsg);
    onAddRoyalty(25, 'የቀጥታ ድምፅ ንግግር ተሳትፎ (Voice Activity)');

    // 2. Parallel Background Translation: Concurrently translate using Promise.allSettled
    (async () => {
      try {
        const targetLangs: LanguageCode[] = (['am', 'en', 'ar', 'fr', 'om', 'ti', 'es', 'zh', 'de'] as LanguageCode[])
          .filter((l) => l !== userLang);

        const translationPromises = targetLangs.map((lang) =>
          translateTextWithGemini(spokenText, userLang, lang)
        );

        const results = await Promise.allSettled(translationPromises);
        results.forEach((res, index) => {
          if (res.status === 'fulfilled' && res.value) {
            newMsg.translations[targetLangs[index]] = res.value;
          }
        });
      } catch {
        // Fallback to original text safely
      }
    })();
  };

  // INSTANT TEXT MESSAGE DELIVERY (0ms Latency Arrival + Parallel Background Translation)
  const handleSendTextMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const textToSend = inputText;
    setInputText('');

    // 1. INSTANT ARRIVAL: Dispatched immediately with 0ms delay
    const newMsg: LiveSpeechMessage = {
      id: `text-${Date.now()}`,
      speakerName: 'እርስዎ (You - User)',
      speakerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
      sourceLang: userLang,
      originalText: textToSend,
      translations: {
        am: textToSend,
        en: textToSend,
        om: textToSend,
        ti: textToSend,
        ar: textToSend,
        fr: textToSend,
        es: textToSend,
        zh: textToSend,
        de: textToSend
      },
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      seatNumber: userSeatedNumber || 1
    };

    onSendMessage(newMsg);

    // 2. Parallel Background Translation
    (async () => {
      try {
        const targetLangs: LanguageCode[] = (['am', 'en', 'ar', 'fr', 'om', 'ti', 'es', 'zh', 'de'] as LanguageCode[])
          .filter((l) => l !== userLang);

        const translationPromises = targetLangs.map((lang) =>
          translateTextWithGemini(textToSend, userLang, lang)
        );

        const results = await Promise.allSettled(translationPromises);
        results.forEach((res, index) => {
          if (res.status === 'fulfilled' && res.value) {
            newMsg.translations[targetLangs[index]] = res.value;
          }
        });
      } catch {
        // Fallback safely
      }
    })();
  };

  const getRoomTitle = (room: Room) => {
    return userLang === 'am' ? room.titleAm : (room.titleEn || room.titleAm);
  };

  const getRoomDesc = (room: Room) => {
    return userLang === 'am' ? room.descriptionAm : (room.descriptionEn || room.descriptionAm);
  };

  const langFlags: Record<string, string> = {
    am: '🇪🇹 አማርኛ',
    en: '🇬🇧 English',
    om: '🇪🇹 Oromoo',
    ti: '🇪🇹 ትግርኛ',
    ar: '🇸🇦 العربية',
    fr: '🇫🇷 Français',
    es: '🇪🇸 Español',
    zh: '🇨🇳 中文',
    de: '🇩🇪 Deutsch'
  };

  const filteredRooms = activeTabCategory === 'all'
    ? rooms
    : rooms.filter((r) => r.category === activeTabCategory);

  // Generate 24 numbered seats
  const totalChairs = 24;
  const chairs = Array.from({ length: totalChairs }, (_, i) => {
    const seatNum = i + 1;
    const occupant = occupants.find((o) => o.seatNumber === seatNum);
    return {
      seatNum,
      occupant,
      isOccupied: !!occupant,
      isUserSeat: userSeatedNumber === seatNum
    };
  });

  // Zoom handlers
  const handleZoomIn = () => setZoomScale((prev) => Math.min(1.8, +(prev + 0.15).toFixed(2)));
  const handleZoomOut = () => setZoomScale((prev) => Math.max(0.7, +(prev - 0.15).toFixed(2)));
  const handleResetZoom = () => setZoomScale(1);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* Top Hall Selector Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#0f1422] border-2 border-slate-800 p-4 rounded-2xl shadow-xl">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
          <button
            onClick={() => setActiveTabCategory('all')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-colors cursor-pointer shadow-md ${
              activeTabCategory === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-amber-500/30 ring-2 ring-amber-400'
                : 'text-white hover:text-amber-300 bg-slate-900 border border-slate-700'
            }`}
          >
            {t.roomStage.allHalls}
          </button>
          <button
            onClick={() => setActiveTabCategory('philosophy')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-colors cursor-pointer shadow-md ${
              activeTabCategory === 'philosophy'
                ? 'bg-amber-500 text-slate-950 shadow-amber-500/30 ring-2 ring-amber-400'
                : 'text-white hover:text-amber-300 bg-slate-900 border border-slate-700'
            }`}
          >
            {t.roomStage.philosophy}
          </button>
          <button
            onClick={() => setActiveTabCategory('tech')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-colors cursor-pointer shadow-md ${
              activeTabCategory === 'tech'
                ? 'bg-amber-500 text-slate-950 shadow-amber-500/30 ring-2 ring-amber-400'
                : 'text-white hover:text-amber-300 bg-slate-900 border border-slate-700'
            }`}
          >
            {t.roomStage.tech}
          </button>
          <button
            onClick={() => setActiveTabCategory('politics')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-colors cursor-pointer shadow-md ${
              activeTabCategory === 'politics'
                ? 'bg-amber-500 text-slate-950 shadow-amber-500/30 ring-2 ring-amber-400'
                : 'text-white hover:text-amber-300 bg-slate-900 border border-slate-700'
            }`}
          >
            {t.roomStage.politics}
          </button>
          <button
            onClick={() => setActiveTabCategory('charity')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-colors cursor-pointer shadow-md ${
              activeTabCategory === 'charity'
                ? 'bg-amber-500 text-slate-950 shadow-amber-500/30 ring-2 ring-amber-400'
                : 'text-white hover:text-amber-300 bg-slate-900 border border-slate-700'
            }`}
          >
            {t.roomStage.charity}
          </button>
          <button
            onClick={() => setActiveTabCategory('community')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-colors cursor-pointer shadow-md ${
              activeTabCategory === 'community'
                ? 'bg-amber-500 text-slate-950 shadow-amber-500/30 ring-2 ring-amber-400'
                : 'text-white hover:text-amber-300 bg-slate-900 border border-slate-700'
            }`}
          >
            {t.roomStage.community}
          </button>
        </div>

        {/* Create Member Hall Button */}
        <button
          onClick={() => setIsCreateRoomModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs sm:text-sm font-black transition-all shadow-md shadow-amber-950 cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>{t.roomStage.openSubHall}</span>
        </button>
      </div>

      {/* Room Tabs Horizontal List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {filteredRooms.map((room) => {
          const isSelected = room.id === currentRoom.id;
          return (
            <div
              key={room.id}
              onClick={() => onSelectRoom(room)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-br from-amber-950/50 to-slate-900 border-amber-500 shadow-xl shadow-amber-950/30 ring-2 ring-amber-400/50'
                  : 'bg-slate-900/80 border-slate-800 hover:border-amber-500/60 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                  {room.categoryLabelAm}
                </span>
                {room.isLive && (
                  <span className="flex items-center gap-1.5 text-xs text-amber-300 font-black bg-amber-950/80 border border-amber-700/60 px-2.5 py-1 rounded-full">
                    <Radio className="w-3 h-3 animate-pulse text-amber-400" />
                    {t.chairs.liveBadge}
                  </span>
                )}
              </div>
              <h4 className="text-sm sm:text-base font-black text-white line-clamp-1 mb-1.5">
                {getRoomTitle(room)}
              </h4>
              <p className="text-xs sm:text-sm text-slate-200 font-medium line-clamp-2 mb-2.5 leading-relaxed">
                {getRoomDesc(room)}
              </p>
              <div className="flex items-center justify-between text-xs sm:text-sm font-extrabold text-slate-300 pt-2.5 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <img
                    src={room.hostAvatar}
                    alt={room.hostName}
                    className="w-5 h-5 rounded-full object-cover border border-amber-500/50"
                  />
                  <span className="truncate max-w-[130px] text-white font-black">{room.hostName}</span>
                </div>
                <span className="text-amber-400 font-black">{room.totalAudience.toLocaleString()} {t.chairs.audienceCount}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Virtual Hall Stage & Live Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Video Stage + Numbered Chairs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Visual Stage Podium */}
          <div className="bg-[#0f1422] border-2 border-amber-500/40 rounded-3xl p-5 md:p-6 shadow-2xl relative overflow-hidden">
            {/* Top Stage Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 pb-4 mb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping"></span>
                  <h2 className="text-lg sm:text-xl font-black text-white drop-shadow-sm">
                    {getRoomTitle(currentRoom)}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 font-bold mt-1">
                  {t.chairs.hostLabel} <strong className="text-amber-400 font-black text-sm sm:text-base">ዶ/ር ዘበነ አስፍዬ (Dr. Zebene Asfye - መድረክ መሪ)</strong> · {currentRoom.topics.join(' · ')}
                </p>
              </div>

              {/* Stage Controls: Zoom In, Zoom Out, Full-Body Mode, Hand Raise */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Zoom In & Zoom Out */}
                <div className="flex items-center bg-slate-950 border border-slate-700 rounded-xl p-1 gap-1 shadow-inner">
                  <button
                    onClick={handleZoomOut}
                    title="ዙም ቀንስ (Zoom Out)"
                    className="p-1.5 hover:bg-slate-800 text-slate-200 hover:text-white rounded-lg cursor-pointer"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-xs sm:text-sm font-mono font-black text-amber-400 px-2">
                    {Math.round(zoomScale * 100)}%
                  </span>
                  <button
                    onClick={handleZoomIn}
                    title="ዙም ጨምር (Zoom In)"
                    className="p-1.5 hover:bg-slate-800 text-slate-200 hover:text-white rounded-lg cursor-pointer"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleResetZoom}
                    title="መደበኛ መጠን (Reset)"
                    className="text-xs font-black text-slate-300 hover:text-white px-1.5 cursor-pointer"
                  >
                    100%
                  </button>
                </div>

                {/* Full-Body / Fullscreen Mode Toggle */}
                <button
                  onClick={() => setIsFullBodyMode(!isFullBodyMode)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer border shadow-md ${
                    isFullBodyMode
                      ? 'bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-400'
                      : 'bg-slate-900 text-slate-100 border-slate-700 hover:text-white hover:bg-slate-800'
                  }`}
                  title="ሙሉ አካልና ቁመት ማሳያ (Full Body Mode)"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>{isFullBodyMode ? 'መደበኛ ስክሪን' : 'ሙሉ አካል (Full-Body)'}</span>
                </button>

                {/* Hand Raise */}
                <button
                  onClick={() => setHandRaised(!handRaised)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-colors cursor-pointer shadow-md ${
                    handRaised
                      ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400'
                      : 'bg-slate-900 text-slate-100 hover:text-white border border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <Hand className="w-4 h-4" />
                  <span>{handRaised ? t.chairs.lowerHand : t.chairs.raiseHand}</span>
                </button>
              </div>
            </div>

            {/* Scalable Large Stage Video Grid: Enlarge height and width with zoom and full-body toggle */}
            <div 
              className="transition-transform duration-200 origin-top mb-5"
              style={{ transform: `scale(${zoomScale})` }}
            >
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isFullBodyMode ? 'min-h-[580px]' : 'min-h-[380px] sm:min-h-[440px]'}`}>
                {/* Speaker 1: Dr. Zebene Asfye (Host) - Substantially Enlarged */}
                <div className={`relative bg-slate-950 rounded-3xl overflow-hidden border-2 border-amber-500/50 flex flex-col justify-between p-4 group shadow-2xl ${
                  isFullBodyMode ? 'h-[580px] sm:h-[640px]' : 'h-[380px] sm:h-[440px]'
                }`}>
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105" 
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-black/40" />

                  {/* Top overlay badges */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="flex items-center gap-1 bg-amber-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded-xl shadow-md">
                      <Award className="w-3.5 h-3.5" />
                      መድረክ መሪ · ዶ/ር ዘበነ አስፍዬ
                    </span>
                    <span className="bg-black/75 backdrop-blur-md text-amber-400 text-xs px-2.5 py-1 rounded-xl font-bold border border-amber-500/30">
                      {langFlags[userLang] || 'Oneworld'}
                    </span>
                  </div>

                  {/* Soundwave active speaking animation */}
                  <div className="relative z-10 flex items-end justify-between bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-slate-800">
                    <div>
                      <h4 className="text-white font-black text-sm">ዶ/ር ዘበነ አስፍዬ (Dr. Zebene Asfye)</h4>
                      <p className="text-xs text-amber-300 font-bold">የሰው ልጆች አንድነትና የ16ቱ ቤቶች መድረክ መሪ</p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-black/80 px-2.5 py-1.5 rounded-xl border border-amber-500/40">
                      <div className="w-1.5 h-4 bg-amber-400 animate-pulse rounded-full" />
                      <div className="w-1.5 h-6 bg-amber-400 animate-pulse rounded-full" />
                      <div className="w-1.5 h-3 bg-amber-400 animate-pulse rounded-full" />
                      <span className="text-[11px] text-amber-400 font-black ml-1">{t.chairs.speakingNow}</span>
                    </div>
                  </div>
                </div>

                {/* Speaker 2: Current User or Active Participant (Enlarged with Real Video Stream) */}
                <div className={`relative bg-slate-950 rounded-3xl overflow-hidden border-2 border-amber-500/60 flex flex-col justify-between p-4 group shadow-2xl ${
                  isFullBodyMode ? 'h-[580px] sm:h-[640px]' : 'h-[380px] sm:h-[440px]'
                }`}>
                  {/* Webcam or Avatar Background */}
                  {isVideoOn && isUsingRealWebcam && cameraActive ? (
                    <video
                      ref={(el) => {
                        videoRef.current = el;
                        if (el && mediaStreamRef.current) {
                          if (el.srcObject !== mediaStreamRef.current) {
                            el.srcObject = mediaStreamRef.current;
                          }
                          el.muted = true;
                          el.playsInline = true;
                          el.play().catch(() => {});
                        }
                      }}
                      autoPlay
                      playsInline
                      muted
                      className={`absolute inset-0 w-full h-full ${
                        cameraFacing === 'user' ? 'transform -scale-x-100' : ''
                      } ${isFullBodyMode ? 'object-contain bg-black' : 'object-cover'}`}
                    />
                  ) : isVideoOn && isUsingRealWebcam && cameraLoading ? (
                    <div className="absolute inset-0 bg-[#0a0d14] flex flex-col items-center justify-center p-6 text-center z-10">
                      <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mb-4" />
                      <h4 className="text-base font-extrabold text-white mb-1">ካሜራ በመክፈት ላይ ነው...</h4>
                      <p className="text-sm text-slate-300">እባክዎ ትንሽ ይጠብቁ ወይም ብራውዘርዎ ፍቃድ ከጠየቀዎት 'Allow' ይጫኑ</p>
                    </div>
                  ) : isVideoOn && isUsingRealWebcam && !cameraActive ? (
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-[#0e1424] to-[#0a0d14] flex flex-col items-center justify-center p-6 text-center z-10">
                      {cameraError ? (
                        <div className="max-w-md bg-red-950/70 border border-red-500/60 p-4 rounded-2xl mb-4 text-center">
                          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                          <p className="text-sm font-bold text-red-200 mb-2">{cameraError}</p>
                          <button
                            onClick={() => startCamera(cameraFacing)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-sm font-black rounded-xl hover:from-amber-400 cursor-pointer shadow-lg"
                          >
                            <RefreshCw className="w-4 h-4" />
                            <span>ፍቃድ ሰጥቻለሁ - ካሜራውን አብራ (Retry Camera)</span>
                          </button>
                        </div>
                      ) : (
                        <div className="max-w-md flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center text-amber-400 mb-3 shadow-lg shadow-amber-500/20">
                            <Camera className="w-8 h-8 text-amber-400 animate-pulse" />
                          </div>
                          <h4 className="text-lg font-black text-white mb-2">የቪዲዮ ካሜራዎ አልበራም</h4>
                          <p className="text-sm font-medium text-slate-300 mb-4 leading-relaxed">
                            በቀጥታ ፊት ለፊት በቪዲዮ ለመታደም ከዚህ በታች ያለውን ቁልፍ ይጫኑ
                          </p>
                          <button
                            onClick={() => startCamera('user')}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black rounded-2xl text-sm transition-all shadow-xl shadow-amber-950/50 cursor-pointer transform hover:scale-105"
                          >
                            <Camera className="w-5 h-5 text-slate-950" />
                            <span>📹 የቪዲዮ ካሜራዬን አብራ (Start My Camera)</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : !isVideoOn ? (
                    <div className="absolute inset-0 bg-[#0a0d14] flex flex-col items-center justify-center text-slate-300 p-6 text-center">
                      <VideoOff className="w-14 h-14 mb-3 text-red-400" />
                      <span className="text-base font-extrabold text-white mb-2">{t.chairs.camOff}</span>
                      <button
                        onClick={() => startCamera(cameraFacing)}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-slate-950 font-black rounded-xl text-sm cursor-pointer shadow-md"
                      >
                        <Video className="w-4 h-4" />
                        <span>ካሜራውን አብራ (Turn On)</span>
                      </button>
                    </div>
                  ) : (
                    <div 
                      className="absolute inset-0 bg-cover bg-center" 
                      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80')` }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/15 to-black/40 pointer-events-none" />

                  {/* Top overlay */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="bg-amber-500 text-slate-950 font-black text-xs sm:text-sm px-3 py-1.5 rounded-xl shadow-md">
                      {userSeatedNumber ? `${t.chairs.youOnSeat} #${userSeatedNumber}` : t.chairs.youParticipant}
                    </span>
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      {/* Flip Camera Button */}
                      {cameraActive && (
                        <button
                          onClick={handleFlipCamera}
                          className="bg-black/80 hover:bg-black text-xs sm:text-sm text-white font-extrabold px-3 py-1.5 rounded-xl border border-slate-700 cursor-pointer transition-all flex items-center gap-1 shadow-md"
                          title="የፊት እና የኋላ ካሜራ ቀይር (Flip Camera)"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                          <span>ቀይር ({cameraFacing === 'user' ? 'የፊት' : 'የኋላ'})</span>
                        </button>
                      )}

                      {/* Webcam toggle */}
                      <button
                        onClick={() => {
                          if (!cameraActive) {
                            startCamera(cameraFacing);
                          } else {
                            setIsUsingRealWebcam(!isUsingRealWebcam);
                          }
                        }}
                        className="bg-black/80 hover:bg-black text-xs sm:text-sm text-amber-300 font-extrabold px-3 py-1.5 rounded-xl border border-amber-500/40 cursor-pointer transition-all shadow-md"
                        title={t.chairs.toggleWebcam}
                      >
                        {cameraActive && isUsingRealWebcam ? '📸 ካሜራ ነቅቷል' : '👤 አቫታር'}
                      </button>

                      <span className="bg-black/85 text-amber-400 text-xs sm:text-sm px-2.5 py-1.5 rounded-xl font-bold border border-slate-800">
                        {langFlags[userLang] || 'Oneworld'}
                      </span>
                    </div>
                  </div>

                  {/* Bottom live voice level meter and participant identity */}
                  <div className="relative z-10 flex items-end justify-between bg-black/75 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800">
                    <div>
                      <h4 className="text-white font-black text-sm sm:text-base">{t.chairs.you}</h4>
                      <p className="text-xs sm:text-sm text-amber-300 font-bold">{t.chairs.activeMember}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {isMicOn ? (
                        <div className="flex items-center gap-2 bg-amber-950/90 border border-amber-500/70 text-amber-300 text-xs sm:text-sm px-3.5 py-1.5 rounded-xl font-black">
                          <Mic className="w-4 h-4 text-amber-400 animate-pulse" />
                          <span>{t.chairs.micLive}</span>
                          {/* Live volume dB meter bar */}
                          <div className="w-14 h-2.5 bg-slate-800 rounded-full overflow-hidden ml-1">
                            <div 
                              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-75"
                              style={{ width: `${Math.max(20, audioVolumeLevel)}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="flex items-center gap-1.5 bg-red-950/90 border border-red-500/60 text-red-300 text-xs sm:text-sm px-3 py-1.5 rounded-xl font-bold">
                          <MicOff className="w-4 h-4 text-red-400" />
                          <span>{t.chairs.micMuted}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Primary Controls Bar for Mic, Video, Seating & Gifts */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0a0d14] p-3.5 rounded-2xl border border-slate-800 shadow-xl">
              <div className="flex items-center gap-2">
                {/* Unrestricted Mic Button */}
                <button
                  onClick={toggleMicrophone}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm sm:text-base font-black transition-all cursor-pointer shadow-md ${
                    isMicOn
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 ring-2 ring-amber-400'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700'
                  }`}
                  title="ማይክሮፎኑ ያለገደብ ድምፅ እንዲያስተላልፍ ያድርጉ"
                >
                  {isMicOn ? <Mic className="w-4 h-4 text-slate-950" /> : <MicOff className="w-4 h-4 text-red-400" />}
                  <span>{isMicOn ? t.roomStage.micMute : t.roomStage.micUnmute}</span>
                </button>

                {/* Unrestricted Camera Button */}
                <button
                  onClick={toggleVideo}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm sm:text-base font-black transition-all cursor-pointer shadow-md ${
                    isVideoOn && cameraActive
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 ring-2 ring-amber-400'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700'
                  }`}
                  title="የቪዲዮ ካሜራውን በሙሉ ጥራት ያብሩ"
                >
                  {isVideoOn && cameraActive ? <Video className="w-4 h-4 text-slate-950" /> : <VideoOff className="w-4 h-4 text-red-400" />}
                  <span>{isVideoOn && cameraActive ? t.roomStage.camClose : t.roomStage.camOpen}</span>
                </button>
              </div>

              {/* Seating controls & Gift */}
              <div className="flex items-center gap-2 flex-wrap">
                {userSeatedNumber ? (
                  <button
                    onClick={onLeaveSeat}
                    className="flex items-center gap-2 px-4 py-3 bg-slate-900 hover:bg-red-950/70 hover:text-red-200 text-slate-200 border border-slate-700 rounded-2xl text-sm font-black transition-colors cursor-pointer shadow-md"
                  >
                    <UserCheck className="w-4 h-4 text-amber-400" />
                    <span>#{userSeatedNumber} {t.roomStage.leaveTheSeat}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onClaimSeat(1)}
                    className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black rounded-2xl text-sm transition-all shadow-md shadow-amber-950 cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>{t.roomStage.takeASeat}</span>
                  </button>
                )}

                {/* Send Gift to Host */}
                <button
                  onClick={() => {
                    const hostOccupant = occupants.find((o) => o.isHost) || occupants[1];
                    setSelectedRecipient(hostOccupant);
                    setIsGiftModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-3 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/50 rounded-2xl text-sm font-black transition-colors cursor-pointer shadow-md"
                >
                  <Gift className="w-4 h-4 text-amber-400" />
                  <span>{t.roomStage.sendGift}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Numbered Chairs Section */}
          <div className="bg-[#0f1422] border border-slate-800 rounded-3xl p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black text-white">
                  {t.roomStage.numberedChairs}
                </h3>
              </div>
              <span className="text-xs sm:text-sm font-extrabold text-slate-200">
                {t.chairs.occupiedChairs} <strong className="text-amber-400 font-black">{occupants.length}</strong> / 24
              </span>
            </div>

            {/* Chairs Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {chairs.map(({ seatNum, occupant, isOccupied, isUserSeat }) => (
                <div
                  key={seatNum}
                  onClick={() => {
                    if (!isOccupied) {
                      onClaimSeat(seatNum);
                    } else if (occupant && occupant.id !== 'user-self') {
                      setSelectedRecipient(occupant);
                      setIsGiftModalOpen(true);
                    }
                  }}
                  className={`relative p-3 rounded-2xl border flex flex-col items-center text-center transition-all cursor-pointer ${
                    isUserSeat
                      ? 'bg-amber-950/40 border-amber-500 shadow-lg shadow-amber-950/40 ring-2 ring-amber-500/60'
                      : isOccupied
                      ? 'bg-slate-900/90 border-slate-700 hover:border-amber-500/60'
                      : 'bg-[#0a0d14] border-dashed border-slate-800 hover:border-amber-500/50 hover:bg-slate-900/50'
                  }`}
                >
                  {/* Seat number tag */}
                  <div className="absolute top-1 left-2 text-xs font-black text-amber-400 font-mono">
                    #{seatNum}
                  </div>

                  {isOccupied && occupant ? (
                    <>
                      <div className="relative mt-2 mb-1.5">
                        <img
                          src={occupant.avatar}
                          alt={occupant.name}
                          className="w-11 h-11 rounded-full object-cover border-2 border-amber-500/50 shadow-md"
                        />
                        <span className="absolute -bottom-1 -right-1 text-sm">
                          {occupant.countryFlag}
                        </span>
                        {occupant.isSpeaking && (
                          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 animate-ping" />
                        )}
                      </div>
                      <span className="text-xs sm:text-sm font-black text-white truncate w-full">
                        {occupant.name}
                      </span>
                      <div className="flex items-center gap-1.5 mt-1">
                        {occupant.isMuted ? (
                          <MicOff className="w-3.5 h-3.5 text-red-400" />
                        ) : (
                          <Mic className="w-3.5 h-3.5 text-amber-400" />
                        )}
                        {occupant.isVideoOn ? (
                          <Video className="w-3.5 h-3.5 text-amber-400" />
                        ) : (
                          <VideoOff className="w-3.5 h-3.5 text-slate-500" />
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="py-2.5 flex flex-col items-center">
                      <div className="w-9 h-9 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center text-amber-400 mb-1 text-base font-black">
                        +
                      </div>
                      <span className="text-xs font-extrabold text-slate-300">{t.chairs.openSeat}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Instant Multilingual Speech Translation Stream & Chat */}
        <div className="bg-[#0f1422] border-2 border-amber-500/30 rounded-3xl flex flex-col h-[760px] shadow-2xl">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 bg-[#0a0d14] rounded-t-3xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-sm sm:text-base font-black text-white">
                  {t.announcements.liveTranslatorTitle}
                </h3>
                <p className="text-xs font-bold text-slate-300">
                  {t.announcements.liveTranslatorSubtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
            {messages.map((msg) => {
              const translatedDisplay = msg.translations[userLang] || msg.originalText;

              return (
                <div
                  key={msg.id}
                  className="p-3.5 rounded-2xl bg-slate-900/95 border border-slate-800 space-y-2 transition-all hover:border-amber-500/40"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={msg.speakerAvatar}
                        alt={msg.speakerName}
                        className="w-7 h-7 rounded-full object-cover border border-amber-500/40"
                      />
                      <span className="font-black text-white text-xs sm:text-sm">{msg.speakerName}</span>
                      <span className="text-xs font-black text-amber-400 font-mono">#{msg.seatNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">{msg.timestamp}</span>
                      <button
                        onClick={() => speakText(translatedDisplay, userLang)}
                        className="p-1.5 text-slate-300 hover:text-amber-400 hover:bg-slate-800 rounded-lg cursor-pointer"
                        title={t.announcements.speakTranslation}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Translated text prominently */}
                  <div className="p-3 rounded-xl bg-amber-950/25 border border-amber-500/35 text-amber-100 font-semibold text-sm sm:text-base leading-relaxed">
                    <div className="text-xs uppercase tracking-wider text-amber-400 font-black mb-1">
                      {t.announcements.liveTranslationTo}
                    </div>
                    "{translatedDisplay}"
                  </div>

                  {/* Original text */}
                  {msg.sourceLang !== userLang && (
                    <div className="text-xs font-medium text-slate-300 italic">
                      {t.announcements.originalSpeech} ({msg.sourceLang.toUpperCase()}): "{msg.originalText}"
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input & Instant Translation Dispatch */}
          <div className="p-3.5 border-t border-slate-800 bg-[#0a0d14] rounded-b-3xl">
            <form onSubmit={handleSendTextMessage} className="space-y-2.5">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={t.roomStage.inputPlaceholder}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-inner"
                />
                <button
                  type="button"
                  onClick={toggleMicrophone}
                  className={`p-3 rounded-xl border transition-colors cursor-pointer shadow-md ${
                    isMicOn
                      ? 'bg-amber-500 border-amber-400 text-slate-950 animate-pulse ring-2 ring-amber-400'
                      : 'bg-slate-900 border-slate-700 text-slate-200 hover:text-white'
                  }`}
                  title="በድምፅ ይናገሩ (Voice Speech Input)"
                >
                  <Mic className="w-5 h-5" />
                </button>
                <button
                  type="submit"
                  disabled={!inputText.trim() || isTranslating}
                  className="p-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 rounded-xl font-black transition-all shadow-md shadow-amber-950 cursor-pointer"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-amber-300 px-1">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  በGemini AI የላቀ አውቶማቲክ ትርጉም የሚሰራ
                </span>
                <span className="text-slate-300">ወደ 8 የአለም ቋንቋዎች በቀጥታ ይሰራጫል</span>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Gift Modal */}
      <GiftModal
        isOpen={isGiftModalOpen}
        onClose={() => setIsGiftModalOpen(false)}
        recipient={selectedRecipient}
        userBalanceETB={userBalanceETB}
        userLang={userLang}
        onSendGift={(gift, recipient) => {
          onSendGift(gift, recipient);
          setIsGiftModalOpen(false);
        }}
      />

      {/* Personal Sub-hall Creation Modal */}
      <PersonalRoomModal
        isOpen={isCreateRoomModalOpen}
        onClose={() => setIsCreateRoomModalOpen(false)}
        onCreateRoom={onCreatePersonalRoom}
      />
    </div>
  );
};
