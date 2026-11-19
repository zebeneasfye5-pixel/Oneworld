import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Armchair
} from 'lucide-react';
import { UserProfile } from './AuthModal';
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
import { RemotePeerData } from '../services/realtimeMesh';
import { EdgeToEdgeVideo } from './EdgeToEdgeVideo';
import { RemoteAudioPlayer } from './RemoteAudioPlayer';

interface RoomStageProps {
  rooms: Room[];
  currentRoom: Room;
  onSelectRoom: (room: Room) => void;
  userLang: LanguageCode;
  userBalanceETB: number;
  currentUser: UserProfile | null;
  occupants: RoomOccupant[];
  messages: LiveSpeechMessage[];
  remotePeers?: Map<string, RemotePeerData>;
  localStream?: MediaStream | null;
  isMicMuted?: boolean;
  isVideoOff?: boolean;
  isSpeaking?: boolean;
  cameraFacing?: 'user' | 'environment';
  cameraError?: string | null;
  onToggleMic?: () => void;
  onToggleVideo?: () => void;
  onFlipCamera?: () => void;
  onRetryCamera?: () => void;
  onTranslationComplete?: (messageId: string, translations: Record<string, string>) => void;
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
  currentUser,
  occupants,
  messages,
  remotePeers,
  localStream = null,
  isMicMuted = true,
  isVideoOff = false,
  isSpeaking = false,
  cameraFacing = 'user',
  cameraError = null,
  onToggleMic,
  onToggleVideo,
  onFlipCamera,
  onRetryCamera,
  onTranslationComplete,
  onSendMessage,
  onSendGift,
  onCreatePersonalRoom,
  onClaimSeat,
  onLeaveSeat,
  userSeatedNumber,
  onAddRoyalty
}) => {
  const t = TRANSLATIONS[userLang as AppLanguage] || TRANSLATIONS.am;
  const isMicOn = !isMicMuted;
  const isVideoOn = !isVideoOff;
  const cameraActive = !!(localStream && localStream.getVideoTracks().some((tr) => tr.readyState === 'live'));
  const remotePeersList = remotePeers ? Array.from(remotePeers.values()) : [];

  const [isUsingRealWebcam, setIsUsingRealWebcam] = useState(true);
  const [inputText, setInputText] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState<RoomOccupant | null>(null);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);
  const [activeTabCategory, setActiveTabCategory] = useState<string>('all');
  const [handRaised, setHandRaised] = useState(false);

  const [zoomScale, setZoomScale] = useState<number>(1);
  const [isFullBodyMode, setIsFullBodyMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenZoom, setFullscreenZoom] = useState<number>(0.85);
  const [fullscreenTargetId, setFullscreenTargetId] = useState<'local' | string | null>(null);
  const [showStageDetails, setShowStageDetails] = useState(false);
  const [isSubRoomsOpen, setIsSubRoomsOpen] = useState(false);
  const [floatingReactions, setFloatingReactions] = useState<Array<{ id: number; emoji: string; left: number }>>([]);

  // Single primary speaker for main frame & fullscreen; second stream only renders in bottom-right PiP during fullscreen
  const primaryTargetId: 'local' | string =
    fullscreenTargetId === 'local'
      ? 'local'
      : fullscreenTargetId && remotePeersList.some((p) => p.id === fullscreenTargetId)
      ? fullscreenTargetId
      : remotePeersList[0]?.id || 'local';
  const primaryRemotePeer =
    primaryTargetId !== 'local'
      ? remotePeersList.find((p) => p.id === primaryTargetId)
      : undefined;
  const secondaryPipTargetId: 'local' | string | null = primaryRemotePeer
    ? 'local'
    : remotePeersList.length > 0
    ? remotePeersList[0].id
    : null;
  const secondaryRemotePeer =
    secondaryPipTargetId && secondaryPipTargetId !== 'local'
      ? remotePeersList.find((p) => p.id === secondaryPipTargetId)
      : undefined;

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

  useEffect(() => {
    if (!isFullscreen) return;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [isFullscreen]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Attach unified WebRTC localStream to video element cleanly
  useEffect(() => {
    if (videoRef.current && localStream && isVideoOn && isUsingRealWebcam) {
      if (videoRef.current.srcObject !== localStream) {
        videoRef.current.srcObject = localStream;
      }
      videoRef.current.muted = true;
      videoRef.current.playsInline = true;
      videoRef.current.play().catch(() => {});
    }
  }, [localStream, isVideoOn, isUsingRealWebcam, isFullscreen]);

  // Listen to voice/touch camera commands + cleanup speech recognition on unmount
  useEffect(() => {
    const unsubCmd = cameraManager.onCommand((cmd) => {
      if (cmd === 'fullscreen') setIsFullscreen(true);
      else if (cmd === 'exit_fullscreen') setIsFullscreen(false);
      else if (cmd === 'fullbody') setIsFullBodyMode((prev) => !prev);
      else if (cmd === 'standard') {
        setIsFullscreen(false);
        setIsFullBodyMode(false);
        setZoomScale(1);
      } else if (cmd === 'start_camera') {
        onRetryCamera?.();
      } else if (cmd === 'flip_camera') {
        onFlipCamera?.();
      }
    });

    return () => {
      unsubCmd();
      stopSpeechRecognition();
    };
  }, [onFlipCamera, onRetryCamera]);

  const toggleVideo = () => {
    onToggleVideo?.();
  };

  const handleFlipCamera = () => {
    onFlipCamera?.();
  };

  // Unified Microphone + Live Speech Recognition Toggle
  const toggleMicrophone = () => {
    const nextMicOn = !isMicOn;
    onToggleMic?.();

    if (nextMicOn) {
      startSpeechRecognition(
        userLang,
        (text) => {
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
      stopSpeechRecognition();
    }
  };

  // INSTANT SPEECH DELIVERY (0ms Latency Arrival + Real Gemini Background Translation Sync)
  const handleBroadcastVoiceSpeech = (spokenText: string) => {
    if (!spokenText.trim()) return;

    const msgId = `voice-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const initialTranslations: Record<string, string> = {
      [userLang]: spokenText
    };

    const newMsg: LiveSpeechMessage = {
      id: msgId,
      speakerName: currentUser?.fullName || 'ተጠቃሚ',
      speakerAvatar: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
      sourceLang: userLang,
      originalText: spokenText,
      translations: initialTranslations,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      seatNumber: userSeatedNumber || 1
    };

    onSendMessage(newMsg);
    onAddRoyalty(25, 'የቀጥታ ድምፅ ንግግር ተሳትፎ');

    (async () => {
      try {
        const targetLangs: LanguageCode[] = (['am', 'en', 'ar', 'fr', 'om', 'ti', 'es', 'zh', 'de'] as LanguageCode[])
          .filter((l) => l !== userLang);

        const translationPromises = targetLangs.map((lang) =>
          translateTextWithGemini(spokenText, userLang, lang)
        );

        const results = await Promise.allSettled(translationPromises);
        const resolvedTranslations: Record<string, string> = { ...initialTranslations };
        let hasUpdates = false;

        results.forEach((res, index) => {
          if (res.status === 'fulfilled' && res.value) {
            resolvedTranslations[targetLangs[index]] = res.value;
            hasUpdates = true;
          }
        });

        if (hasUpdates) {
          onTranslationComplete?.(msgId, resolvedTranslations);
        }
      } catch {
        // Keep original text if offline
      }
    })();
  };

  // INSTANT TEXT MESSAGE DELIVERY (0ms Latency Arrival + Real Gemini Background Translation Sync)
  const handleSendTextMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const textToSend = inputText.trim();
    setInputText('');

    const msgId = `text-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const initialTranslations: Record<string, string> = {
      [userLang]: textToSend
    };

    const newMsg: LiveSpeechMessage = {
      id: msgId,
      speakerName: currentUser?.fullName || 'ተጠቃሚ',
      speakerAvatar: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
      sourceLang: userLang,
      originalText: textToSend,
      translations: initialTranslations,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      seatNumber: userSeatedNumber || 1
    };

    onSendMessage(newMsg);

    (async () => {
      try {
        const targetLangs: LanguageCode[] = (['am', 'en', 'ar', 'fr', 'om', 'ti', 'es', 'zh', 'de'] as LanguageCode[])
          .filter((l) => l !== userLang);

        const translationPromises = targetLangs.map((lang) =>
          translateTextWithGemini(textToSend, userLang, lang)
        );

        const results = await Promise.allSettled(translationPromises);
        const resolvedTranslations: Record<string, string> = { ...initialTranslations };
        let hasUpdates = false;

        results.forEach((res, index) => {
          if (res.status === 'fulfilled' && res.value) {
            resolvedTranslations[targetLangs[index]] = res.value;
            hasUpdates = true;
          }
        });

        if (hasUpdates) {
          onTranslationComplete?.(msgId, resolvedTranslations);
        }
      } catch {
        // Keep original text if offline
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

  // Generate 24 numbered seats with explicit collision-free occupant resolution
  const totalChairs = 24;
  const chairs = Array.from({ length: totalChairs }, (_, i) => {
    const seatNum = i + 1;
    const remoteOccupant = occupants.find(
      (o) => o.seatNumber === seatNum && o.id !== currentUser?.idNumber && o.id !== 'user-self'
    );
    const isUserSeat = !remoteOccupant && userSeatedNumber === seatNum;
    const selfOccupant = occupants.find(
      (o) => o.seatNumber === seatNum && (o.id === currentUser?.idNumber || o.id === 'user-self')
    );
    const occupant = remoteOccupant || (isUserSeat ? selfOccupant : occupants.find((o) => o.seatNumber === seatNum));
    return {
      seatNum,
      occupant,
      isOccupied: !!occupant,
      isOccupiedByOther: !!remoteOccupant,
      isUserSeat
    };
  });
  const firstOpenSeatNum = chairs.find((c) => !c.isOccupied && !c.isUserSeat)?.seatNum || 1;

  // Zoom handlers (Inner <video> only: 40% to 250%)
  const handleZoomIn = () => setZoomScale((prev) => Math.min(2.5, +(prev + 0.15).toFixed(2)));
  const handleZoomOut = () => setZoomScale((prev) => Math.max(0.4, +(prev - 0.15).toFixed(2)));
  const handleResetZoom = () => setZoomScale(1);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 sm:py-6 space-y-6">
      {/* 1. Main Virtual Hall Stage & Large Fixed Video Screen (width: 90%, maxWidth: 1200px, height: 650px) */}
      <div className="bg-[#0f1422] border-2 border-amber-500/40 rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
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
                  {currentRoom.isMemberOwned && currentRoom.hostName && (
                    <p className="text-sm text-white font-medium mt-1">
                      {t.chairs.hostLabel} <strong className="text-white font-black">{currentRoom.hostName}</strong>
                    </p>
                  )}
                </div>

                {/* Stage Controls: Iconic Minimalist Bar (Zero Text Clutter) */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Dedicated Full Screen Button (Icon Only) */}
                  <button
                    onClick={() => toggleFullscreen()}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 border border-amber-400 shadow-md cursor-pointer transition transform hover:scale-105"
                    title={isFullscreen ? 'ከሙሉ ስክሪን ውጣ' : 'በሙሉ ስክሪን ክፈት (100% Edge-to-Edge Fullscreen)'}
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4 text-slate-950" /> : <Maximize2 className="w-4 h-4 text-slate-950" />}
                  </button>

                  {/* Inner Video Zoom Controls (- / +) */}
                  <div className="flex items-center bg-slate-950 border border-slate-700 rounded-xl p-1 gap-1 shadow-inner">
                    <button
                      onClick={handleZoomOut}
                      title="ዙም ቀንስ (Zoom Out -)"
                      className="px-2 py-1 hover:bg-slate-800 text-white rounded-lg cursor-pointer flex items-center gap-0.5 font-black text-xs"
                    >
                      <ZoomOut className="w-4 h-4 text-amber-400" />
                      <span>-</span>
                    </button>
                    <span className="text-xs font-mono font-black text-amber-400 px-1.5">
                      {Math.round(zoomScale * 100)}%
                    </span>
                    <button
                      onClick={handleZoomIn}
                      title="ዙም ጨምር (Zoom In +)"
                      className="px-2 py-1 hover:bg-slate-800 text-white rounded-lg cursor-pointer flex items-center gap-0.5 font-black text-xs"
                    >
                      <ZoomIn className="w-4 h-4 text-amber-400" />
                      <span>+</span>
                    </button>
                    <button
                      onClick={handleResetZoom}
                      title="መደበኛ መጠን (Reset)"
                      className="text-[11px] font-black text-white hover:text-amber-400 px-1 cursor-pointer"
                    >
                      100%
                    </button>
                  </div>

                  {/* Full-Body Mode Toggle (Icon Only) */}
                  <button
                    onClick={() => setIsFullBodyMode(!isFullBodyMode)}
                    className={`p-2.5 rounded-xl transition-all cursor-pointer border shadow-md ${
                      isFullBodyMode
                        ? 'bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-400'
                        : 'bg-slate-900 text-white border-slate-700 hover:bg-slate-800'
                    }`}
                    title={isFullBodyMode ? 'መደበኛ ስክሪን (Standard View)' : 'ሙሉ አካልና ቁመት (Full Body Mode)'}
                  >
                    <Layers className="w-4 h-4" />
                  </button>

                  {/* Hand Raise (Icon Only) */}
                  <button
                    onClick={() => setHandRaised(!handRaised)}
                    className={`p-2.5 rounded-xl transition-colors cursor-pointer shadow-md ${
                      handRaised
                        ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400'
                        : 'bg-slate-900 text-white hover:text-white border border-slate-700 hover:bg-slate-800'
                    }`}
                    title={handRaised ? 'እጅ አውርድ (Lower Hand)' : 'እጅ አንሳ (Raise Hand)'}
                  >
                    <Hand className="w-4 h-4" />
                  </button>

                  {/* Collapsible Read More Toggle */}
                  <button
                    onClick={() => setShowStageDetails(!showStageDetails)}
                    className="p-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 cursor-pointer transition shadow-md"
                    title={showStageDetails ? 'ዝርዝር ደብቅ (Hide Details)' : 'ተጨማሪ መረጃ (Read More)'}
                  >
                    {showStageDetails ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4 text-amber-400" />}
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

            {/* Always-active remote peer audio playback regardless of spotlight view */}
            {remotePeersList.map((peer) => (
              <RemoteAudioPlayer key={`audio-${peer.id}`} stream={peer.stream} />
            ))}

            {/* Large Primary Single-Image Fixed Video Player Frame */}
            <div
              className="mx-auto mb-5 rounded-3xl border-2 border-amber-500/60 bg-black shadow-2xl relative w-full sm:w-[92%] h-[340px] sm:h-[460px] md:h-[520px]"
              style={{
                maxWidth: '960px',
                overflow: 'hidden'
              }}
            >
              <div className="relative w-full h-full min-h-0 min-w-0 overflow-hidden bg-black">
                {primaryRemotePeer ? (
                  <>
                    {primaryRemotePeer.stream && (primaryRemotePeer.isVideoOn || primaryRemotePeer.stream.getVideoTracks().length > 0) ? (
                      <EdgeToEdgeVideo
                        stream={primaryRemotePeer.stream}
                        muted={true}
                        mirror={false}
                        zoom={zoomScale}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 p-3">
                        <div className="relative mb-2">
                          <img
                            src={primaryRemotePeer.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'}
                            alt={primaryRemotePeer.name}
                            className={`w-24 h-24 rounded-full object-cover border-4 transition-all duration-300 shadow-2xl ${
                              primaryRemotePeer.isSpeaking
                                ? 'border-emerald-400 ring-8 ring-emerald-400/40 scale-105'
                                : 'border-slate-700'
                            }`}
                          />
                          {primaryRemotePeer.isSpeaking && (
                            <span className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping pointer-events-none" />
                          )}
                        </div>
                        <span className="text-white font-bold text-xs">{primaryRemotePeer.name}</span>
                      </div>
                    )}
                    <span className="absolute bottom-2 left-2 z-10 px-2 py-0.5 rounded-lg bg-black/75 border border-emerald-500/60 text-[11px] font-black text-emerald-300 pointer-events-none">
                      {primaryRemotePeer.seatNumber ? `${primaryRemotePeer.seatNumber} · ` : ''}{primaryRemotePeer.name}
                    </span>
                  </>
                ) : (
                  <>
                    {isVideoOn && isUsingRealWebcam && cameraActive && localStream ? (
                      <EdgeToEdgeVideo
                        stream={localStream}
                        muted={true}
                        mirror={cameraFacing === 'user'}
                        zoom={zoomScale}
                      />
                    ) : isVideoOn && isUsingRealWebcam && !cameraActive ? (
                      <div className="w-full h-full bg-[#0a0d14] flex flex-col items-center justify-center p-4 gap-2 text-center">
                        {cameraError && (
                          <p className="text-xs text-amber-300 max-w-xs leading-relaxed">{cameraError}</p>
                        )}
                        <button
                          onClick={() => onRetryCamera?.()}
                          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-lg cursor-pointer transition"
                        >
                          📹 ካሜራዬን አብራ
                        </button>
                      </div>
                    ) : !isVideoOn ? (
                      <div className="w-full h-full bg-[#0a0d14] flex flex-col items-center justify-center p-3">
                        <div className="relative mb-2">
                          <img
                            src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'}
                            alt={currentUser?.fullName || 'እርስዎ'}
                            className={`w-24 h-24 rounded-full object-cover border-4 transition-all duration-300 shadow-2xl ${
                              isMicOn && isSpeaking
                                ? 'border-amber-400 ring-8 ring-amber-400/40 scale-105'
                                : 'border-slate-700'
                            }`}
                          />
                          {isMicOn && isSpeaking && (
                            <span className="absolute inset-0 rounded-full border-2 border-amber-400 animate-ping pointer-events-none" />
                          )}
                        </div>
                        <button
                          onClick={() => toggleVideo()}
                          className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs cursor-pointer shadow-md transition"
                        >
                          ካሜራ አብራ
                        </button>
                      </div>
                    ) : (
                      <div
                        className="w-full h-full bg-cover bg-center transition-transform duration-200"
                        style={{
                          backgroundImage: `url('${currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=800&q=80'}')`,
                          transform: `scale(${zoomScale})`
                        }}
                      />
                    )}
                    {remotePeersList.length > 0 && (
                      <span className="absolute bottom-2 left-2 z-10 px-2 py-0.5 rounded-lg bg-black/75 border border-amber-500/50 text-[11px] font-black text-amber-300 pointer-events-none">
                        {userSeatedNumber ? `${userSeatedNumber} · ` : ''}{currentUser?.fullName?.split(' ')[0] || 'እርስዎ'}
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Speaker Info & Camera Flip Strip OUTSIDE Fixed Video Frame */}
            <div className="mx-auto mb-5 w-full sm:w-[92%] flex flex-wrap items-center justify-between gap-3 bg-slate-950/90 border border-slate-800 rounded-2xl px-3.5 sm:px-4 py-3" style={{ maxWidth: '960px' }}>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="bg-amber-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1">
                  <Armchair className="w-3.5 h-3.5" />
                  {userSeatedNumber ? `${t.chairs.youOnSeat} ${userSeatedNumber}` : t.chairs.youParticipant}
                </span>
                <div>
                  <h4 className="text-white font-black text-sm sm:text-base">{currentUser?.fullName || t.chairs.you}</h4>
                  <p className="text-xs text-slate-300 font-medium">{currentUser?.roleTitle || t.chairs.activeMember}</p>
                </div>
                {isMicOn ? (
                  <div className="flex items-center gap-1.5 bg-amber-950/90 border border-amber-500/70 text-white text-xs px-2.5 py-1 rounded-xl font-black">
                    <Mic className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <span>{t.chairs.micLive}</span>
                  </div>
                ) : (
                  <span className="flex items-center gap-1 bg-red-950/90 border border-red-500/60 text-white text-xs px-2.5 py-1 rounded-xl font-bold">
                    <MicOff className="w-3.5 h-3.5 text-red-400" />
                    <span>{t.chairs.micMuted}</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {cameraActive && (
                  <button
                    onClick={handleFlipCamera}
                    className="bg-slate-900 hover:bg-slate-800 text-xs text-white font-bold px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5 cursor-pointer transition shadow-md"
                    title="የፊት እና የኋላ ካሜራ ቀይር"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                    <span>{cameraFacing === 'user' ? 'የፊት' : 'የኋላ'}</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    if (!cameraActive) {
                      onRetryCamera?.();
                    } else {
                      setIsUsingRealWebcam(!isUsingRealWebcam);
                    }
                  }}
                  className="bg-slate-900 hover:bg-slate-800 text-xs text-white font-bold px-3 py-1.5 rounded-xl border border-slate-700 cursor-pointer transition shadow-md"
                >
                  {cameraActive && isUsingRealWebcam ? '📸 ካሜራ' : '👤 ፎቶ'}
                </button>
                <button
                  onClick={() => {
                    setIsFullscreen(true);
                  }}
                  title="በሙሉ ስክሪን ክፈት"
                  className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer transition shadow"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                {remotePeersList.map((peer) => (
                  <button
                    key={`fs-${peer.id}`}
                    onClick={() => {
                      setFullscreenTargetId(peer.id);
                      setIsFullscreen(true);
                    }}
                    className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 text-xs font-black px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition"
                    title="በሙሉ ስክሪን ክፈት"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>{peer.seatNumber || 2} {peer.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Reactions Bar */}
            <div className="mx-auto mb-5 relative w-full sm:w-[92%]" style={{ maxWidth: '960px' }}>
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

              {/* Live Interactive Reaction Bar — wraps cleanly on small phones so every reaction stays visible */}
              <div className="mt-3 py-2 px-3 bg-[#0a0d14]/90 border border-amber-500/30 rounded-2xl flex flex-wrap items-center justify-between gap-2 shadow-lg">
                <span className="text-xs font-black text-amber-400 pl-1">
                  ⚡ የቀጥታ ስሜት (Reactions)፦
                </span>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
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

            {/* 100% FULL-SCREEN SINGLE-SPEAKER CINEMA THEATER (Second image appears ONLY here as a small bottom-right PiP) */}
            {isFullscreen && typeof document !== 'undefined' && createPortal((() => {
              const showingRemote = !!primaryRemotePeer;

              return (
                <div
                  className="bg-black overflow-hidden select-none"
                  style={{
                    position: 'fixed',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    minHeight: '100dvh',
                    zIndex: 9999
                  }}
                >
                  {/* Exit Fullscreen Button (Top Right, Icon Only) */}
                  <button
                    onClick={() => setIsFullscreen(false)}
                    title="ከሙሉ ስክሪን ውጣ (Exit Full Screen)"
                    className="absolute top-4 right-4 z-50 p-3 rounded-full bg-black/70 hover:bg-red-600 text-white backdrop-blur-md border border-white/25 transition-all cursor-pointer shadow-2xl group flex items-center justify-center"
                  >
                    <Minimize2 className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                  </button>

                  {/* Back Arrow Button (Top Left) */}
                  <div className="absolute top-4 left-4 z-50 flex items-center gap-2">
                    <button
                      onClick={() => setIsFullscreen(false)}
                      title="ተመለስ (Go Back)"
                      className="p-3 rounded-full bg-black/70 hover:bg-slate-800 text-white backdrop-blur-md border border-white/25 transition-all cursor-pointer shadow-2xl flex items-center justify-center group"
                    >
                      <ArrowLeft className="w-5 h-5 text-amber-400 group-hover:-translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* 100% Single Speaker Full Edge-to-Edge Stream (Adjustable Zoom 30% - 250%) */}
                  <div className="w-full h-full relative overflow-hidden bg-black">
                    {showingRemote && primaryRemotePeer ? (
                      primaryRemotePeer.stream && (primaryRemotePeer.isVideoOn || primaryRemotePeer.stream.getVideoTracks().length > 0) ? (
                        <EdgeToEdgeVideo
                          stream={primaryRemotePeer.stream}
                          muted={true}
                          mirror={false}
                          zoom={fullscreenZoom}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 p-6">
                          <img
                            src={primaryRemotePeer.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'}
                            alt={primaryRemotePeer.name}
                            className={`w-44 h-44 rounded-full object-cover border-4 shadow-2xl ${
                              primaryRemotePeer.isSpeaking ? 'border-emerald-400 ring-8 ring-emerald-400/40' : 'border-slate-700'
                            }`}
                          />
                        </div>
                      )
                    ) : isVideoOn && isUsingRealWebcam && cameraActive && localStream ? (
                      <EdgeToEdgeVideo
                        stream={localStream}
                        muted={true}
                        mirror={cameraFacing === 'user'}
                        zoom={fullscreenZoom}
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center p-4 gap-4">
                        <img
                          src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'}
                          alt={currentUser?.fullName || 'እርስዎ'}
                          className={`w-40 h-40 rounded-full object-cover border-4 shadow-2xl ${
                            isMicOn && isSpeaking ? 'border-amber-400 ring-8 ring-amber-400/40' : 'border-slate-700'
                          }`}
                        />
                        {isVideoOn && !cameraActive && (
                          <button
                            onClick={() => onRetryCamera?.()}
                            className="p-4 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl shadow-2xl cursor-pointer transition"
                            title="ካሜራዎን ያብሩ"
                          >
                            <Video className="w-7 h-7" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Secondary Video PiP — rendered ONLY in Fullscreen at bottom-right corner; click to swap */}
                  {secondaryPipTargetId && (
                    <button
                      type="button"
                      onClick={() => setFullscreenTargetId(secondaryPipTargetId)}
                      title="ምስሉን ቀይር (Swap)"
                      className="absolute bottom-36 right-3 sm:bottom-6 sm:right-6 z-50 w-24 h-32 sm:w-32 sm:h-44 rounded-2xl overflow-hidden border-2 border-amber-400/80 bg-slate-950 shadow-2xl cursor-pointer hover:scale-105 transition-transform"
                    >
                      {secondaryPipTargetId === 'local' ? (
                        isVideoOn && isUsingRealWebcam && cameraActive && localStream ? (
                          <EdgeToEdgeVideo
                            stream={localStream}
                            muted={true}
                            mirror={cameraFacing === 'user'}
                            zoom={1}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-950">
                            <img
                              src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                              alt={currentUser?.fullName || 'እርስዎ'}
                              className="w-14 h-14 rounded-full object-cover border-2 border-amber-400"
                            />
                          </div>
                        )
                      ) : secondaryRemotePeer ? (
                        secondaryRemotePeer.stream && (secondaryRemotePeer.isVideoOn || secondaryRemotePeer.stream.getVideoTracks().length > 0) ? (
                          <EdgeToEdgeVideo
                            stream={secondaryRemotePeer.stream}
                            muted={true}
                            mirror={false}
                            zoom={1}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-950">
                            <img
                              src={secondaryRemotePeer.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                              alt={secondaryRemotePeer.name}
                              className="w-14 h-14 rounded-full object-cover border-2 border-emerald-400"
                            />
                          </div>
                        )
                      ) : null}
                      <span className="absolute bottom-1 left-1 right-1 truncate px-1.5 py-0.5 rounded bg-black/75 text-[10px] font-black text-amber-300 text-center pointer-events-none">
                        {secondaryPipTargetId === 'local'
                          ? (currentUser?.fullName?.split(' ')[0] || 'እርስዎ')
                          : (secondaryRemotePeer?.name?.split(' ')[0] || '')}
                      </span>
                    </button>
                  )}

                  {/* Fullscreen Zoom Control Bar (30% Small <-> 250% Large) */}
                  <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 bg-black/80 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/20 shadow-2xl flex items-center gap-2 max-w-[92vw]">
                    <button
                      onClick={() => setFullscreenZoom((prev) => Math.max(0.3, +(prev - 0.15).toFixed(2)))}
                      title="ዙም ቀንስ"
                      className="p-1.5 rounded-full bg-white/10 hover:bg-white/25 text-white cursor-pointer transition"
                    >
                      <ZoomOut className="w-4 h-4 text-amber-400" />
                    </button>

                    <input
                      type="range"
                      min={0.3}
                      max={2.5}
                      step={0.05}
                      value={fullscreenZoom}
                      onChange={(e) => setFullscreenZoom(parseFloat(e.target.value))}
                      aria-label="Zoom"
                      className="w-24 sm:w-36 accent-amber-400 cursor-pointer h-1.5"
                    />

                    <button
                      onClick={() => setFullscreenZoom(1)}
                      title="100%"
                      className="text-xs font-mono font-black text-amber-300 hover:text-white px-1.5 py-0.5 rounded-full bg-white/10 min-w-[44px] text-center cursor-pointer transition"
                    >
                      {Math.round(fullscreenZoom * 100)}%
                    </button>

                    <button
                      onClick={() => setFullscreenZoom((prev) => Math.min(2.5, +(prev + 0.15).toFixed(2)))}
                      title="ዙም ጨምር"
                      className="p-1.5 rounded-full bg-white/10 hover:bg-white/25 text-white cursor-pointer transition"
                    >
                      <ZoomIn className="w-4 h-4 text-amber-400" />
                    </button>
                  </div>

                  {/* Floating Minimal Glass Controller (Icon Only - Always Inside 100dvh Bottom) */}
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-50 bg-black/80 hover:bg-black/95 backdrop-blur-xl px-5 py-3 rounded-full border border-white/25 shadow-2xl flex items-center gap-3 transition-all">
                    <button
                      onClick={toggleMicrophone}
                      title={isMicOn ? 'ድምፅ አጥፋ' : 'ድምፅ አብራ'}
                      className={`p-3.5 rounded-full transition-all cursor-pointer ${
                        isMicOn
                          ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30'
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5 text-red-400" />}
                    </button>

                    <button
                      onClick={toggleVideo}
                      title={isVideoOn ? 'ካሜራ አጥፋ' : 'ካሜራ አብራ'}
                      className={`p-3.5 rounded-full transition-all cursor-pointer ${
                        isVideoOn
                          ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30'
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5 text-red-400" />}
                    </button>

                    <button
                      onClick={handleFlipCamera}
                      title="ካሜራ አዙር (የፊት / የኋላ)"
                      className="p-3.5 rounded-full bg-white/10 hover:bg-white/20 text-amber-400 transition-all cursor-pointer"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>

                    {secondaryPipTargetId && (
                      <button
                        onClick={() => setFullscreenTargetId(secondaryPipTargetId)}
                        title="ተናጋሪ ቀይር"
                        className="p-3.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-all cursor-pointer"
                      >
                        <Maximize2 className="w-5 h-5" />
                      </button>
                    )}

                    <div className="h-6 w-px bg-white/20 mx-1" />

                    <button
                      onClick={() => setIsFullscreen(false)}
                      title="ከሙሉ ስክሪን ውጣ"
                      className="p-3.5 bg-red-600/90 hover:bg-red-600 text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-transform hover:scale-105"
                    >
                      <Minimize2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })(), document.body)}

            {/* Primary Controls Bar: Sleek Icon Buttons with Zero Text Clutter */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0a0d14] p-3.5 rounded-2xl border border-slate-800 shadow-xl">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMicrophone}
                  className={`p-3.5 rounded-2xl transition-all cursor-pointer shadow-md ${
                    isMicOn
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 ring-2 ring-amber-400 shadow-amber-500/20'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700'
                  }`}
                  title={isMicOn ? 'ድምፅ አጥፋ (Mute Mic)' : 'ድምፅ አብራ (Unmute Mic)'}
                >
                  {isMicOn ? <Mic className="w-5 h-5 text-slate-950" /> : <MicOff className="w-5 h-5 text-red-400" />}
                </button>

                <button
                  onClick={toggleVideo}
                  className={`p-3.5 rounded-2xl transition-all cursor-pointer shadow-md ${
                    isVideoOn && cameraActive
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 ring-2 ring-amber-400 shadow-amber-500/20'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700'
                  }`}
                  title={isVideoOn && cameraActive ? 'ካሜራ አጥፋ (Turn Off Camera)' : 'ካሜራ አብራ (Turn On Camera)'}
                >
                  {isVideoOn && cameraActive ? <Video className="w-5 h-5 text-slate-950" /> : <VideoOff className="w-5 h-5 text-red-400" />}
                </button>

                {cameraActive && (
                  <button
                    onClick={handleFlipCamera}
                    className="p-3.5 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-2xl border border-slate-700 transition cursor-pointer shadow-md"
                    title="ካሜራ አዙር (የፊት / የኋላ)"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Seating controls & Gift */}
              <div className="flex items-center gap-2 flex-wrap">
                {userSeatedNumber ? (
                  <button
                    onClick={onLeaveSeat}
                    className="flex items-center gap-2 px-4 py-3 bg-slate-900 hover:bg-red-950/70 hover:text-red-200 text-slate-200 border border-slate-700 rounded-2xl text-sm font-black transition-colors cursor-pointer shadow-md"
                  >
                    <Armchair className="w-4 h-4 text-amber-400" />
                    <span>{userSeatedNumber} {t.roomStage.leaveTheSeat}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onClaimSeat(firstOpenSeatNum)}
                    className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black rounded-2xl text-sm transition-all shadow-md shadow-amber-950 cursor-pointer"
                  >
                    <Armchair className="w-4 h-4" />
                    <span>{t.roomStage.takeASeat} ({firstOpenSeatNum})</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    const otherOccupant = occupants.find(
                      (o) => o.id !== 'user-self' && o.id !== currentUser?.idNumber
                    ) || occupants[0] || null;
                    setSelectedRecipient(otherOccupant);
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

      {/* 2. Chairs (2 cols) + Live Speech Translator Feed (1 col) below the wide fixed stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Numbered Chairs Section — EVERY Chair displays an Armchair icon */}
          <div className="bg-[#0f1422] border border-slate-800 rounded-3xl p-5 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 min-w-0">
                <Armchair className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <h3 className="text-base font-black text-white break-words">
                  {t.roomStage.numberedChairs}
                </h3>
              </div>
              <span className="text-xs sm:text-sm font-extrabold text-slate-200 flex-shrink-0">
                {t.chairs.occupiedChairs} <strong className="text-amber-400 font-black">{occupants.length}</strong> / 24
              </span>
            </div>

            {/* Chairs Grid — All 24 chairs enlarged with live video feeds directly inside each chair */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-3.5">
              {chairs.map(({ seatNum, occupant, isOccupied, isOccupiedByOther, isUserSeat }) => {
                const remotePeer = isOccupiedByOther && occupant
                  ? remotePeersList.find((p) => p.id === occupant.id || p.seatNumber === seatNum)
                  : undefined;
                const chairStream = isUserSeat
                  ? (isVideoOn && isUsingRealWebcam && cameraActive ? localStream : null)
                  : (remotePeer?.stream && (remotePeer.isVideoOn || remotePeer.stream.getVideoTracks().length > 0) ? remotePeer.stream : null);

                return (
                  <div
                    key={seatNum}
                    onClick={() => {
                      if (!isOccupied && !isUserSeat) {
                        onClaimSeat(seatNum);
                      } else if (isUserSeat) {
                        setFullscreenTargetId('local');
                      } else if (isOccupiedByOther && occupant) {
                        setFullscreenTargetId(occupant.id);
                      }
                    }}
                    title={
                      isOccupied && occupant
                        ? `${seatNum} · ${occupant.name}`
                        : `${seatNum}`
                    }
                    className={`relative p-2.5 sm:p-3 rounded-2xl border flex flex-col items-center justify-between text-center transition-all cursor-pointer min-h-[148px] sm:min-h-[168px] ${
                      isUserSeat
                        ? 'bg-amber-950/40 border-amber-500 shadow-lg shadow-amber-950/40 ring-2 ring-amber-500/60'
                        : isOccupied
                        ? 'bg-emerald-950/35 border-emerald-500/80 hover:border-emerald-400 shadow-md'
                        : 'bg-[#0a0d14] border-dashed border-slate-800 hover:border-amber-500/50 hover:bg-slate-900/50'
                    }`}
                  >
                    {/* Clean Seat Number & Gift Action for Peers */}
                    <div className="w-full flex items-center justify-between px-1 mb-1.5">
                      <span className={`text-xs sm:text-sm font-black font-mono ${
                        isUserSeat ? 'text-amber-300' : isOccupied ? 'text-emerald-300' : 'text-amber-400'
                      }`}>
                        {seatNum}
                      </span>
                      {isOccupiedByOther && occupant && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRecipient(occupant);
                            setIsGiftModalOpen(true);
                          }}
                          title={t.roomStage.sendGift}
                          className="p-0.5 rounded text-amber-400 hover:text-amber-300 cursor-pointer"
                        >
                          <Gift className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {isOccupied && occupant ? (
                      <>
                        {chairStream ? (
                          <div className={`relative w-full h-28 sm:h-32 rounded-xl overflow-hidden bg-black border-2 mb-1.5 ${
                            (isUserSeat && isMicOn && isSpeaking) || occupant.isSpeaking
                              ? 'border-amber-400 ring-2 ring-amber-400/60'
                              : isUserSeat
                              ? 'border-amber-500/70'
                              : 'border-emerald-500/70'
                          }`}>
                            <EdgeToEdgeVideo
                              stream={chairStream}
                              muted={true}
                              mirror={isUserSeat && cameraFacing === 'user'}
                              zoom={1}
                            />
                            {((isUserSeat && isMicOn && isSpeaking) || occupant.isSpeaking) && (
                              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping pointer-events-none" />
                            )}
                          </div>
                        ) : (
                          <div className="relative my-2">
                            <img
                              src={isUserSeat ? (currentUser?.avatarUrl || occupant.avatar) : occupant.avatar}
                              alt={isUserSeat ? (currentUser?.fullName || occupant.name) : occupant.name}
                              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 shadow-md transition-transform duration-200 ${
                                isUserSeat && isMicOn && isSpeaking
                                  ? 'border-amber-400 ring-4 ring-amber-400/50 scale-110'
                                  : occupant.isSpeaking
                                  ? 'border-emerald-400 ring-4 ring-emerald-400/50 scale-105'
                                  : isUserSeat
                                  ? 'border-amber-500/70'
                                  : 'border-emerald-500/70'
                              }`}
                            />
                            <span className="absolute -bottom-1 -right-1 text-sm">
                              {occupant.countryFlag}
                            </span>
                            {((isUserSeat && isMicOn && isSpeaking) || occupant.isSpeaking) && (
                              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 animate-ping" />
                            )}
                          </div>
                        )}
                        <span className="text-xs font-black text-white truncate w-full">
                          {isUserSeat ? (currentUser?.fullName || occupant.name) : occupant.name}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1">
                          {(isUserSeat ? isMicOn : !occupant.isMuted) ? (
                            <Mic className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                          ) : (
                            <MicOff className="w-3.5 h-3.5 text-red-400" />
                          )}
                          {(isUserSeat ? isVideoOn : occupant.isVideoOn) ? (
                            <Video className="w-3.5 h-3.5 text-amber-400" />
                          ) : (
                            <VideoOff className="w-3.5 h-3.5 text-slate-500" />
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center py-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-dashed border-slate-700 hover:border-amber-400 flex items-center justify-center text-amber-400 transition">
                          <Armchair className="w-6 h-6 text-amber-400" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Instant Multilingual Speech Translation Stream & Chat */}
        <div className="bg-[#0f1422] border-2 border-amber-500/30 rounded-3xl flex flex-col h-[460px] sm:h-[620px] lg:h-[760px] shadow-2xl">
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
                      <span className="text-xs font-black text-amber-400 font-mono">{msg.seatNumber}</span>
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
                  disabled={!inputText.trim()}
                  className="p-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 rounded-xl font-black transition-all shadow-md shadow-amber-950 cursor-pointer"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-1 text-xs font-bold text-amber-300 px-1">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span>በGemini AI የላቀ አውቶማቲክ ትርጉም የሚሰራ</span>
                </span>
                <span className="text-slate-300">ወደ 8 የአለም ቋንቋዎች በቀጥታ ይሰራጫል</span>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* 2. Sub-Halls Collapsible Section (Placed cleanly beneath stage to protect viewport) */}
      <div className="bg-[#0f1422] border-2 border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-xl flex-shrink-0">
              🏛️
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-black text-amber-400 break-words">
                ተጓዳኝ ንዑስ አዳራሾች ({filteredRooms.length})
              </h3>
              <p className="text-xs text-slate-300 font-medium break-words">
                የተለያዩ ርዕሰ-ጉዳይ ያላቸው የቀጥታ ውይይት ክፍሎች
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
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
            {/* Category Filter — wraps cleanly on small phones */}
            <div className="flex flex-wrap items-center gap-2 pb-1">
              {(['all', 'philosophy', 'tech', 'politics', 'charity', 'community'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTabCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-colors cursor-pointer ${
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
