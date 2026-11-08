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
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { translateTextWithGemini } from '../services/geminiService';
import { 
  startSpeechRecognition, 
  stopSpeechRecognition, 
  speakText 
} from '../services/speechService';
import { cameraManager } from '../services/cameraManager';
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

  const [zoomScale, setZoomScale] = useState<number>(1);
  const [isFullBodyMode, setIsFullBodyMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioVolumeLevel, setAudioVolumeLevel] = useState<number>(0);
  const [showStageDetails, setShowStageDetails] = useState(false);
  const [isSubRoomsOpen, setIsSubRoomsOpen] = useState(false);
  const [floatingReactions, setFloatingReactions] = useState<Array<{ id: number; emoji: string; left: number }>>([]);

  const triggerReaction = (emoji: string) => {
    const id = Date.now() + Math.random();
    const left = Math.floor(15 + Math.random() * 70);
    setFloatingReactions((prev) => [...prev, { id, emoji, left }]);
    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== id));
    }, 2400);
  };

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

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

  // Attempt initial fast camera start on mount & listen to voice/touch commands
  useEffect(() => {
    startCamera('user').catch(() => {});

    const unsubCmd = cameraManager.onCommand((cmd) => {
      if (cmd === 'fullscreen') setIsFullscreen(true);
      else if (cmd === 'exit_fullscreen') setIsFullscreen(false);
      else if (cmd === 'fullbody') setIsFullBodyMode((prev) => !prev);
      else if (cmd === 'standard') {
        setIsFullscreen(false);
        setIsFullBodyMode(false);
        setZoomScale(1);
      } else if (cmd === 'start_camera') {
        startCamera('user');
      } else if (cmd === 'flip_camera') {
        handleFlipCamera();
      }
    });

    return () => {
      unsubCmd();
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
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 sm:py-6 space-y-6">
      {/* 1. Main Virtual Hall Stage & Live Screen - IMMEDIATELY AT THE VERY TOP */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Video Stage + Numbered Chairs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Visual Stage Podium */}
          <div className="bg-[#0f1422] border-2 border-amber-500/40 rounded-3xl p-5 md:p-6 shadow-2xl relative overflow-hidden">
            {/* Top Stage Bar with Clean Typography & Expandable Details */}
            <div className="pb-4 mb-4 border-b border-slate-800">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping"></span>
                    <h2 className="text-xl sm:text-2xl font-black text-amber-400 drop-shadow-sm">
                      {getRoomTitle(currentRoom)}
                    </h2>
                  </div>
                  <p className="text-sm text-white font-medium mt-1">
                    {t.chairs.hostLabel} <strong className="text-white font-black">ዶ/ር ዘበነ አስፍዬ (Dr. Zebene Asfye - መድረክ መሪ)</strong>
                  </p>
                </div>

                {/* Stage Controls: Dedicated Full Screen, Zoom In/Out, Full-Body Mode, Hand Raise */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Dedicated Full Screen on Command Button */}
                  <button
                    onClick={toggleFullscreen}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 border border-amber-400 shadow-md cursor-pointer transition transform hover:scale-105"
                    title="በራስ ትእዛዝ በሙሉ ስክሪን ክፈት (Open Full Screen)"
                  >
                    <Maximize2 className="w-4 h-4 text-slate-950" />
                    <span>🖥️ በሙሉ ስክሪን ክፈት</span>
                  </button>

                  {/* Zoom Controls */}
                  <div className="flex items-center bg-slate-950 border border-slate-700 rounded-xl p-1 gap-1 shadow-inner">
                    <button
                      onClick={handleZoomOut}
                      title="ዙም ቀንስ (Zoom Out)"
                      className="p-1.5 hover:bg-slate-800 text-white rounded-lg cursor-pointer"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-xs sm:text-sm font-mono font-black text-white px-2">
                      {Math.round(zoomScale * 100)}%
                    </span>
                    <button
                      onClick={handleZoomIn}
                      title="ዙም ጨምር (Zoom In)"
                      className="p-1.5 hover:bg-slate-800 text-white rounded-lg cursor-pointer"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleResetZoom}
                      title="መደበኛ መጠን (Reset)"
                      className="text-xs font-black text-white hover:text-amber-400 px-1.5 cursor-pointer"
                    >
                      100%
                    </button>
                  </div>

                  {/* Full-Body Mode Toggle */}
                  <button
                    onClick={() => setIsFullBodyMode(!isFullBodyMode)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer border shadow-md ${
                      isFullBodyMode
                        ? 'bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-400'
                        : 'bg-slate-900 text-white border-slate-700 hover:bg-slate-800'
                    }`}
                    title="ሙሉ አካልና ቁመት ማሳያ (Full Body Mode)"
                  >
                    <Maximize2 className="w-4 h-4" />
                    <span>{isFullBodyMode ? 'መደበኛ ስክሪን' : 'ሙሉ አካል'}</span>
                  </button>

                  {/* Hand Raise */}
                  <button
                    onClick={() => setHandRaised(!handRaised)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-colors cursor-pointer shadow-md ${
                      handRaised
                        ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400'
                        : 'bg-slate-900 text-white hover:text-white border border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    <Hand className="w-4 h-4" />
                    <span>{handRaised ? t.chairs.lowerHand : t.chairs.raiseHand}</span>
                  </button>

                  {/* Collapsible Read More Toggle */}
                  <button
                    onClick={() => setShowStageDetails(!showStageDetails)}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 cursor-pointer"
                  >
                    <span>{showStageDetails ? 'ዝርዝር ደብቅ' : 'ተጨማሪ አንብብ (Read More)'}</span>
                    {showStageDetails ? <ChevronUp className="w-3.5 h-3.5 text-amber-400" /> : <ChevronDown className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                </div>
              </div>

              {/* Collapsible Details Drawer */}
              {showStageDetails && (
                <div className="mt-3 p-4 bg-slate-950/90 rounded-2xl border border-slate-800 text-xs text-white space-y-2 animate-fadeIn">
                  <p className="font-bold text-amber-400">የውይይት ዋና ዋና አርእስቶች፦</p>
                  <p className="text-white leading-relaxed">{currentRoom.topics.join(' · ')}</p>
                  <p className="font-bold text-amber-400 mt-2">የመድረኩ መተዳደሪያ ህግጋት፦</p>
                  <p className="text-white leading-relaxed">
                    በዚህ መድረክ የሚደረግ ማንኛውም ንግግር በራስ-ሰር ወደ 9 አለምአቀፍ ቋንቋዎች ይተረጎማል። እያንዳንዱ ተናጋሪ ሃሳቡን በነፃነትና በመከባበር የመግለጽ ሙሉ መብት አለው።
                  </p>
                </div>
              )}
            </div>

            {/* Scalable Large Stage Video Grid: ZERO text inside the video frames! */}
            <div 
              className="transition-transform duration-200 origin-top mb-5"
              style={{ transform: `scale(${zoomScale})` }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Speaker 1: Dr. Zebene Asfye (Host) - All Text Strictly OUTSIDE Video Frame */}
                <div className="bg-slate-950/80 border-2 border-amber-500/50 rounded-3xl p-3.5 flex flex-col justify-between shadow-2xl">
                  {/* Top Bar OUTSIDE Video Frame */}
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                    <span className="flex items-center gap-1 bg-amber-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded-xl shadow-md">
                      <Award className="w-3.5 h-3.5" />
                      መድረክ መሪ · ዶ/ር ዘበነ አስፍዬ
                    </span>
                    <span className="bg-slate-900 text-white text-xs px-2.5 py-1 rounded-xl font-bold border border-slate-700">
                      🇪🇹 {langFlags[userLang] || 'Oneworld'}
                    </span>
                  </div>

                  {/* PURE VIDEO FRAME - ZERO TEXT OVERLAY INSIDE */}
                  <div className={`relative rounded-2xl overflow-hidden bg-black border border-slate-700 w-full ${
                    isFullBodyMode ? 'h-[440px] sm:h-[500px]' : 'h-[300px] sm:h-[350px]'
                  }`}>
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-300 hover:scale-105" 
                      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80')` }}
                    />
                  </div>

                  {/* Bottom Info Card OUTSIDE Video Frame */}
                  <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-black text-sm sm:text-base">ዶ/ር ዘበነ አስፍዬ (Dr. Zebene Asfye)</h4>
                      <p className="text-xs text-white font-medium">የሰው ልጆች አንድነትና የ16ቱ ቤቶች መድረክ መሪ</p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-black/80 px-2.5 py-1.5 rounded-xl border border-amber-500/40">
                      <div className="w-1.5 h-4 bg-amber-400 animate-pulse rounded-full" />
                      <div className="w-1.5 h-6 bg-amber-400 animate-pulse rounded-full" />
                      <div className="w-1.5 h-3 bg-amber-400 animate-pulse rounded-full" />
                      <span className="text-xs text-white font-bold ml-1">{t.chairs.speakingNow}</span>
                    </div>
                  </div>
                </div>

                {/* Speaker 2: Current User - All Text Strictly OUTSIDE Video Frame */}
                <div className="bg-slate-950/80 border-2 border-amber-500/60 rounded-3xl p-3.5 flex flex-col justify-between shadow-2xl">
                  {/* Top Bar OUTSIDE Video Frame */}
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                    <span className="bg-amber-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded-xl shadow-md">
                      {userSeatedNumber ? `${t.chairs.youOnSeat} #${userSeatedNumber}` : t.chairs.youParticipant}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {cameraActive && (
                        <button
                          onClick={handleFlipCamera}
                          className="bg-slate-900 hover:bg-slate-800 text-xs text-white font-bold px-2.5 py-1 rounded-xl border border-slate-700 flex items-center gap-1 cursor-pointer transition shadow-md"
                          title="የፊት እና የኋላ ካሜራ ቀይር"
                        >
                          <RefreshCw className="w-3 h-3 text-amber-400" />
                          <span>{cameraFacing === 'user' ? 'የፊት' : 'የኋላ'}</span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (!cameraActive) {
                            startCamera(cameraFacing);
                          } else {
                            setIsUsingRealWebcam(!isUsingRealWebcam);
                          }
                        }}
                        className="bg-slate-900 hover:bg-slate-800 text-xs text-white font-bold px-2.5 py-1 rounded-xl border border-slate-700 cursor-pointer transition shadow-md"
                      >
                        {cameraActive && isUsingRealWebcam ? '📸 ካሜራ ነቅቷል' : '👤 አቫታር'}
                      </button>
                    </div>
                  </div>

                  {/* PURE VIDEO / CAMERA BOX - ZERO TEXT OVERLAY INSIDE */}
                  <div className={`relative rounded-2xl overflow-hidden bg-black border border-slate-700 w-full ${
                    isFullBodyMode ? 'h-[440px] sm:h-[500px]' : 'h-[300px] sm:h-[350px]'
                  }`}>
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
                        className={`w-full h-full ${
                          cameraFacing === 'user' ? 'transform -scale-x-100' : ''
                        } ${isFullBodyMode ? 'object-contain bg-black' : 'object-cover'}`}
                      />
                    ) : isVideoOn && isUsingRealWebcam && cameraLoading ? (
                      <div className="w-full h-full bg-[#0a0d14] flex flex-col items-center justify-center p-4">
                        <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mb-2" />
                        <span className="text-xs text-white font-bold">ካሜራ በመክፈት ላይ...</span>
                      </div>
                    ) : isVideoOn && isUsingRealWebcam && !cameraActive ? (
                      <div className="w-full h-full bg-[#0a0d14] flex flex-col items-center justify-center p-4">
                        <button
                          onClick={() => startCamera('user')}
                          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-lg cursor-pointer transition"
                        >
                          📹 ካሜራዬን አብራ (Start Camera)
                        </button>
                      </div>
                    ) : !isVideoOn ? (
                      <div className="w-full h-full bg-[#0a0d14] flex flex-col items-center justify-center p-4">
                        <VideoOff className="w-10 h-10 text-red-400 mb-2" />
                        <button
                          onClick={() => startCamera(cameraFacing)}
                          className="px-4 py-2 bg-amber-500 text-slate-950 font-black rounded-xl text-xs cursor-pointer"
                        >
                          ካሜራውን አብራ
                        </button>
                      </div>
                    ) : (
                      <div 
                        className="w-full h-full bg-cover bg-center" 
                        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80')` }}
                      />
                    )}
                  </div>

                  {/* Bottom Info Card OUTSIDE Video Frame */}
                  <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-black text-sm sm:text-base">{t.chairs.you}</h4>
                      <p className="text-xs text-white font-medium">{t.chairs.activeMember}</p>
                    </div>
                    <div>
                      {isMicOn ? (
                        <div className="flex items-center gap-1.5 bg-amber-950/90 border border-amber-500/70 text-white text-xs px-2.5 py-1 rounded-xl font-black">
                          <Mic className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                          <span>{t.chairs.micLive}</span>
                          <div className="w-12 h-2 bg-slate-800 rounded-full overflow-hidden ml-1">
                            <div 
                              className="h-full bg-amber-400"
                              style={{ width: `${Math.max(20, audioVolumeLevel)}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="flex items-center gap-1 bg-red-950/90 border border-red-500/60 text-white text-xs px-2.5 py-1 rounded-xl font-bold">
                          <MicOff className="w-3.5 h-3.5 text-red-400" />
                          <span>{t.chairs.micMuted}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Real-Time Live Reaction Emojis Animation Layer */}
              <div className="relative w-full h-0 pointer-events-none overflow-visible">
                {floatingReactions.map((r) => (
                  <span
                    key={r.id}
                    className="absolute bottom-2 text-3xl sm:text-4xl animate-bounce filter drop-shadow-lg pointer-events-none transition-all duration-1000 select-none z-30"
                    style={{ left: `${r.left}%`, animation: 'floatUp 2.2s cubic-bezier(0.25, 1, 0.5, 1) forwards' }}
                  >
                    {r.emoji}
                  </span>
                ))}
              </div>

              {/* Live Interactive Reaction Bar (World-Class Social Media Innovation) */}
              <div className="mt-3 py-2 px-3 bg-[#0a0d14]/90 border border-amber-500/30 rounded-2xl flex items-center justify-between gap-2 overflow-x-auto no-scrollbar shadow-lg">
                <span className="text-[11px] sm:text-xs font-black text-amber-400 whitespace-nowrap pl-1">
                  ⚡ የቀጥታ ስሜት መግለጫ (Live Reactions)፦
                </span>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {[
                    { emoji: '❤️', label: 'ፍቅር' },
                    { emoji: '🔥', label: 'እሳት' },
                    { emoji: '👏', label: 'ጭብጨባ' },
                    { emoji: '👑', label: 'ክብር' },
                    { emoji: '💎', label: 'አልማዝ' },
                    { emoji: '🕊️', label: 'ሰላም' },
                    { emoji: '🇪🇹', label: 'አንድነት' }
                  ].map((btn) => (
                    <button
                      key={btn.emoji}
                      onClick={() => triggerReaction(btn.emoji)}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 active:scale-125 border border-slate-700 hover:border-amber-400 rounded-xl text-base sm:text-lg transition-transform cursor-pointer shadow-sm flex items-center gap-1"
                      title={btn.label}
                    >
                      <span>{btn.emoji}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* FULL SCREEN THEATER OVERLAY - Pure Edge-to-Edge Stream with Zero Text Obstruction */}
            {isFullscreen && (
              <div className="fixed inset-0 z-50 bg-black overflow-hidden flex flex-col md:flex-row animate-fadeIn">
                {/* Floating Minimal Exit Button (Top Right) */}
                <button
                  onClick={() => setIsFullscreen(false)}
                  title="ከሙሉ ስክሪን ውጣ (Exit Full Screen)"
                  className="absolute top-4 right-4 z-40 p-3 rounded-full bg-black/60 hover:bg-red-600/90 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-2xl group flex items-center gap-2"
                >
                  <Minimize2 className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold hidden sm:inline">ከሙሉ ስክሪን ውጣ</span>
                </button>

                {/* Speaker 1 Video - 100% pure video frame, zero text overlay */}
                <div className="flex-1 relative bg-black w-full h-1/2 md:h-full overflow-hidden border-b md:border-b-0 md:border-r border-white/10">
                  <div 
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1600&q=85')` }}
                  />
                  {/* Subtle translucent corner badge */}
                  <div className="absolute top-4 left-4 z-20 pointer-events-none">
                    <span className="bg-black/50 backdrop-blur-md text-amber-400 border border-amber-400/30 text-[11px] font-black px-3 py-1 rounded-full">
                      ዶ/ር ዘበነ አስፍዬ · መድረክ መሪ
                    </span>
                  </div>
                </div>

                {/* Speaker 2 Video (User stream) - 100% pure video frame */}
                <div className="flex-1 relative bg-black w-full h-1/2 md:h-full overflow-hidden">
                  {isVideoOn && isUsingRealWebcam && cameraActive ? (
                    <video
                      ref={(el) => {
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
                      className={`w-full h-full object-cover ${
                        cameraFacing === 'user' ? 'transform -scale-x-100' : ''
                      }`}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-950 via-[#0a0d18] to-slate-900 flex flex-col items-center justify-center p-4">
                      <button
                        onClick={() => startCamera('user')}
                        className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-xl flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
                      >
                        <Video className="w-4 h-4" />
                        <span>📹 ካሜራዎን ያብሩ</span>
                      </button>
                    </div>
                  )}
                  {/* Subtle translucent corner badge */}
                  <div className="absolute top-4 left-4 md:left-4 z-20 pointer-events-none">
                    <span className="bg-black/50 backdrop-blur-md text-slate-200 border border-white/20 text-[11px] font-black px-3 py-1 rounded-full">
                      እርስዎ (ወንበር #{userSeatedNumber || 1})
                    </span>
                  </div>
                </div>

                {/* Floating Minimal Glass Controller (Centered at Bottom) */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 bg-black/75 hover:bg-black/90 backdrop-blur-xl px-4 py-2.5 rounded-full border border-white/20 shadow-2xl flex items-center gap-2.5 transition-all">
                  <button
                    onClick={toggleMicrophone}
                    title={isMicOn ? 'ድምፅ አጥፋ' : 'ድምፅ አብራ'}
                    className={`p-3 rounded-full transition-all cursor-pointer ${
                      isMicOn
                        ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4 text-red-400" />}
                  </button>

                  <button
                    onClick={toggleVideo}
                    title={isVideoOn ? 'ካሜራ አጥፋ' : 'ካሜራ አብራ'}
                    className={`p-3 rounded-full transition-all cursor-pointer ${
                      isVideoOn
                        ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4 text-red-400" />}
                  </button>

                  <button
                    onClick={handleFlipCamera}
                    title="ካሜራ አዙር (የፊት / የኋላ)"
                    className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4 text-amber-400" />
                  </button>

                  <div className="h-6 w-px bg-white/20 mx-1" />

                  <button
                    onClick={() => setIsFullscreen(false)}
                    title="ከሙሉ ስክሪን ውጣ"
                    className="px-4 py-2 bg-red-600/90 hover:bg-red-600 text-white text-xs font-black rounded-full flex items-center gap-1.5 cursor-pointer shadow-lg transition-transform hover:scale-105"
                  >
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span>ውጣ</span>
                  </button>
                </div>
              </div>
            )}

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

      {/* 2. Sub-Halls Collapsible Section (Placed cleanly beneath stage to protect viewport) */}
      <div className="bg-[#0f1422] border-2 border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-xl">
              🏛️
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-amber-400">
                ተጓዳኝ ንዑስ አዳራሾች ({filteredRooms.length})
              </h3>
              <p className="text-xs text-slate-300 font-medium">
                የተለያዩ ርዕሰ-ጉዳይ ያላቸው የቀጥታ ውይይት ክፍሎች
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreateRoomModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black shadow cursor-pointer transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.roomStage.openSubHall}</span>
            </button>
            <button
              onClick={() => setIsSubRoomsOpen(!isSubRoomsOpen)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 rounded-xl text-xs font-bold cursor-pointer transition"
            >
              <span>{isSubRoomsOpen ? 'አዳራሾችን ደብቅ' : 'አዳራሾችን አሳይ'}</span>
              {isSubRoomsOpen ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4 text-amber-400" />}
            </button>
          </div>
        </div>

        {/* Collapsible Sub-Rooms Drawer */}
        {isSubRoomsOpen && (
          <div className="mt-4 pt-4 border-t border-slate-800 space-y-4 animate-fadeIn">
            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {(['all', 'philosophy', 'tech', 'politics', 'charity', 'community'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTabCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-colors cursor-pointer ${
                    activeTabCategory === cat
                      ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400'
                      : 'text-white hover:text-amber-300 bg-slate-900 border border-slate-700'
                  }`}
                >
                  {cat === 'all' && t.roomStage.allHalls}
                  {cat === 'philosophy' && t.roomStage.philosophy}
                  {cat === 'tech' && t.roomStage.tech}
                  {cat === 'politics' && t.roomStage.politics}
                  {cat === 'charity' && t.roomStage.charity}
                  {cat === 'community' && t.roomStage.community}
                </button>
              ))}
            </div>

            {/* Room Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {filteredRooms.map((room) => {
                const isSelected = room.id === currentRoom.id;
                return (
                  <div
                    key={room.id}
                    onClick={() => {
                      onSelectRoom(room);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-br from-amber-950/50 to-slate-900 border-amber-500 shadow-xl ring-2 ring-amber-400/50'
                        : 'bg-slate-900/80 border-slate-800 hover:border-amber-500/60 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider">
                        {room.categoryLabelAm}
                      </span>
                      {room.isLive && (
                        <span className="flex items-center gap-1 text-[10px] text-amber-300 font-black bg-amber-950/80 border border-amber-700/60 px-2 py-0.5 rounded-full">
                          <Radio className="w-2.5 h-2.5 animate-pulse text-amber-400" />
                          {t.chairs.liveBadge}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-black text-white line-clamp-1 mb-1">
                      {getRoomTitle(room)}
                    </h4>
                    <p className="text-xs text-slate-300 line-clamp-1 mb-2">
                      {getRoomDesc(room)}
                    </p>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-300 pt-2 border-t border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <img
                          src={room.hostAvatar}
                          alt={room.hostName}
                          className="w-4 h-4 rounded-full object-cover border border-amber-500/50"
                        />
                        <span className="truncate max-w-[110px] text-white font-bold">{room.hostName}</span>
                      </div>
                      <span className="text-amber-400 font-mono font-black">{room.totalAudience.toLocaleString()} {t.chairs.audienceCount}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
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
