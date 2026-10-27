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
  Share2, 
  UserCheck, 
  Award,
  Layers
} from 'lucide-react';
import { translateTextWithGemini } from '../services/geminiService';
import { 
  startSpeechRecognition, 
  stopSpeechRecognition, 
  speakText, 
  isSpeechRecognitionSupported 
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
  const [isUsingRealWebcam, setIsUsingRealWebcam] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<RoomOccupant | null>(null);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);
  const [activeTabCategory, setActiveTabCategory] = useState<string>('all');
  const [handRaised, setHandRaised] = useState(false);
  
  // Real webcam video ref
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const webcamStreamRef = useRef<MediaStream | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle Real Camera Toggle
  useEffect(() => {
    if (isVideoOn && isUsingRealWebcam) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: false })
          .then((stream) => {
            webcamStreamRef.current = stream;
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          })
          .catch((err) => {
            console.warn('Webcam permission not granted, using animated HD avatar:', err);
            setIsUsingRealWebcam(false);
          });
      }
    } else {
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach((track) => track.stop());
        webcamStreamRef.current = null;
      }
    }

    return () => {
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isVideoOn, isUsingRealWebcam]);

  // Handle Speech Recognition toggle
  const toggleMicrophone = () => {
    if (isMicOn) {
      stopSpeechRecognition();
      setIsMicOn(false);
    } else {
      const started = startSpeechRecognition(
        userLang,
        (text, isFinal) => {
          if (isFinal && text.trim()) {
            handleBroadcastVoiceSpeech(text);
          }
        },
        (err) => {
          console.warn('Speech recognition notice:', err);
        },
        () => {
          setIsMicOn(false);
        }
      );
      if (started) {
        setIsMicOn(true);
      } else {
        // Fallback simulate voice activity
        setIsMicOn(true);
      }
    }
  };

  const handleBroadcastVoiceSpeech = async (spokenText: string) => {
    if (!spokenText.trim()) return;
    setIsTranslating(true);

    try {
      const translatedEn = await translateTextWithGemini(spokenText, userLang, 'en');
      const translatedAm = await translateTextWithGemini(spokenText, userLang, 'am');
      const translatedAr = await translateTextWithGemini(spokenText, userLang, 'ar');
      const translatedFr = await translateTextWithGemini(spokenText, userLang, 'fr');
      const translatedOm = await translateTextWithGemini(spokenText, userLang, 'om');
      const translatedTi = await translateTextWithGemini(spokenText, userLang, 'ti');
      const translatedEs = await translateTextWithGemini(spokenText, userLang, 'es');
      const translatedZh = await translateTextWithGemini(spokenText, userLang, 'zh');
      const translatedDe = await translateTextWithGemini(spokenText, userLang, 'de');

      const newMsg: LiveSpeechMessage = {
        id: `voice-${Date.now()}`,
        speakerName: 'እርስዎ (You - User)',
        speakerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
        sourceLang: userLang,
        originalText: spokenText,
        translations: {
          am: translatedAm || spokenText,
          en: translatedEn || spokenText,
          om: translatedOm || spokenText,
          ti: translatedTi || spokenText,
          ar: translatedAr || spokenText,
          fr: translatedFr || spokenText,
          es: translatedEs || spokenText,
          zh: translatedZh || spokenText,
          de: translatedDe || spokenText
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        seatNumber: userSeatedNumber || 1
      };

      onSendMessage(newMsg);
      onAddRoyalty(25, 'የቀጥታ ድምፅ ንግግር ተሳትፎ (Voice Activity)');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSendTextMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isTranslating) return;

    const textToSend = inputText;
    setInputText('');
    setIsTranslating(true);

    try {
      const translatedEn = await translateTextWithGemini(textToSend, userLang, 'en');
      const translatedAm = await translateTextWithGemini(textToSend, userLang, 'am');
      const translatedAr = await translateTextWithGemini(textToSend, userLang, 'ar');
      const translatedFr = await translateTextWithGemini(textToSend, userLang, 'fr');
      const translatedOm = await translateTextWithGemini(textToSend, userLang, 'om');
      const translatedTi = await translateTextWithGemini(textToSend, userLang, 'ti');
      const translatedEs = await translateTextWithGemini(textToSend, userLang, 'es');
      const translatedZh = await translateTextWithGemini(textToSend, userLang, 'zh');
      const translatedDe = await translateTextWithGemini(textToSend, userLang, 'de');

      const newMsg: LiveSpeechMessage = {
        id: `text-${Date.now()}`,
        speakerName: 'እርስዎ (You - User)',
        speakerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
        sourceLang: userLang,
        originalText: textToSend,
        translations: {
          am: translatedAm || textToSend,
          en: translatedEn || textToSend,
          om: translatedOm || textToSend,
          ti: translatedTi || textToSend,
          ar: translatedAr || textToSend,
          fr: translatedFr || textToSend,
          es: translatedEs || textToSend,
          zh: translatedZh || textToSend,
          de: translatedDe || textToSend
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        seatNumber: userSeatedNumber || 1
      };

      onSendMessage(newMsg);
      onAddRoyalty(10, 'የመልእክትና የውይይት ተሳትፎ (Message Activity)');
    } finally {
      setIsTranslating(false);
    }
  };

  const langFlags: Record<string, string> = {
    am: '🇪🇹 አማርኛ',
    om: '🇪🇹 Oromoo',
    ti: '🇪🇹 ትግርኛ',
    en: '🇬🇧 English',
    fr: '🇫🇷 Français',
    zh: '🇨🇳 中文',
    ar: '🇸🇦 العربية',
    de: '🇩🇪 Deutsch'
  };

  const getRoomTitle = (room: Room) => {
    if (userLang === 'en' && room.titleEn) return room.titleEn;
    if (userLang === 'om') {
      if (room.id === 'room-1') return 'Waltajjii Yaada Gaarii fi Nageenya Addunyaa';
      if (room.id === 'room-2') return 'Beekumsa Teeknolojii, AI fi Qaroomina Kalaqaa';
      if (room.id === 'room-3') return 'Yaada Siyaasaa, Diinagdee fi Qoodiinsa Qabeenyaa';
      if (room.id === 'room-4') return 'Hojii Tola Ooltummaa fi Gargaarsa Namoomaa';
    }
    if (userLang === 'ti') {
      if (room.id === 'room-1') return 'ሓፈሻዊ ጽቡቕ ኣተሓሳስባን ዓለምለኸ ሰላምን';
      if (room.id === 'room-2') return 'ቴክኖሎጂ፣ AIን ስልጣነ ፈጠራን';
      if (room.id === 'room-3') return 'ፖለቲካዊን ቁጠባዊን ሓሳብን ፍትሓዊ ምክፍፋል ጸጋታትን';
      if (room.id === 'room-4') return 'መረብ ገበርቲ ሰናይን ሰብኣዊ ሓገዝን';
    }
    if (userLang === 'fr') {
      if (room.id === 'room-1') return 'Agora Mondiale de la Bienveillance et de la Paix';
      if (room.id === 'room-2') return 'Frontière Technologique, IA et Civilisation Innovante';
      if (room.id === 'room-3') return 'Pensée Politique & Économique et Équité Mondiale';
      if (room.id === 'room-4') return 'Réseau Mondial de Solidarité et d\'Aide Humanitaire';
    }
    if (userLang === 'zh') {
      if (room.id === 'room-1') return '全球善念与世界和平议会';
      if (room.id === 'room-2') return '科技前沿、AI与人类创新文明';
      if (room.id === 'room-3') return '政治与经济思潮及全球财富公平';
      if (room.id === 'room-4') return '全人类慈善互助与人道关怀网络';
    }
    if (userLang === 'ar') {
      if (room.id === 'room-1') return 'مجلس الفكر الإيجابي والسلام العالمي المشترك';
      if (room.id === 'room-2') return 'آفاق التكنولوجيا والذكاء الاصطناعي والحضارة الإنسانية';
      if (room.id === 'room-3') return 'الفكر السياسي والاقتصادي والعدالة العالمية';
      if (room.id === 'room-4') return 'شبكة التكافل الإنساني والعمل الخيري العالمي';
    }
    if (userLang === 'de') {
      if (room.id === 'room-1') return 'Weltweite Agora für Wohlwollen und globalen Frieden';
      if (room.id === 'room-2') return 'Technologie-Zukunft, KI & innovative Zivilisation';
      if (room.id === 'room-3') return 'Politisches & ökonomisches Denken für Gerechtigkeit';
      if (room.id === 'room-4') return 'Globales Netzwerk für Philanthropie & humanitäre Hilfe';
    }
    return room.titleEn && userLang !== 'am' ? room.titleEn : room.titleAm;
  };

  const getRoomDesc = (room: Room) => {
    if (userLang === 'en' && room.descriptionEn) return room.descriptionEn;
    if (userLang !== 'am' && room.descriptionEn) return room.descriptionEn;
    return room.descriptionAm;
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

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* Top Hall Selector Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
          <button
            onClick={() => setActiveTabCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTabCategory === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white bg-slate-800/40'
            }`}
          >
            {t.roomStage.allHalls}
          </button>
          <button
            onClick={() => setActiveTabCategory('philosophy')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTabCategory === 'philosophy'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white bg-slate-800/40'
            }`}
          >
            {t.roomStage.philosophy}
          </button>
          <button
            onClick={() => setActiveTabCategory('tech')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTabCategory === 'tech'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white bg-slate-800/40'
            }`}
          >
            {t.roomStage.tech}
          </button>
          <button
            onClick={() => setActiveTabCategory('politics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTabCategory === 'politics'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white bg-slate-800/40'
            }`}
          >
            {t.roomStage.politics}
          </button>
          <button
            onClick={() => setActiveTabCategory('charity')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTabCategory === 'charity'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white bg-slate-800/40'
            }`}
          >
            {t.roomStage.charity}
          </button>
          <button
            onClick={() => setActiveTabCategory('community')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTabCategory === 'community'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white bg-slate-800/40'
            }`}
          >
            {t.roomStage.community}
          </button>
        </div>

        {/* Create Member Hall Button */}
        <button
          onClick={() => setIsCreateRoomModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-indigo-950 cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.roomStage.openSubHall}</span>
        </button>
      </div>

      {/* Room Tabs Horizontal List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {filteredRooms.map((room) => {
          const isSelected = room.id === currentRoom.id;
          return (
            <div
              key={room.id}
              onClick={() => onSelectRoom(room)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-br from-amber-950/30 to-slate-900 border-amber-500/60 shadow-lg shadow-amber-950/20'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">
                  {room.categoryLabelAm}
                </span>
                {room.isLive && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                    <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-400" />
                    {t.chairs.liveBadge}
                  </span>
                )}
              </div>
              <h4 className="text-xs font-bold text-white line-clamp-1 mb-1">
                {getRoomTitle(room)}
              </h4>
              <p className="text-[11px] text-slate-400 line-clamp-2 mb-2">
                {getRoomDesc(room)}
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/60">
                <div className="flex items-center gap-1.5">
                  <img
                    src={room.hostAvatar}
                    alt={room.hostName}
                    className="w-4 h-4 rounded-full object-cover"
                  />
                  <span className="truncate max-w-[110px] text-slate-300">{room.hostName}</span>
                </div>
                <span>{room.totalAudience.toLocaleString()} {t.chairs.audienceCount}</span>
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
          <div className="bg-[#0e1320] border border-slate-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
            {/* Top Stage Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800/80">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                  <h2 className="text-base font-extrabold text-white">
                    {getRoomTitle(currentRoom)}
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {t.chairs.hostLabel} <strong className="text-amber-300">{currentRoom.hostName}</strong> · {currentRoom.topics.join(' · ')}
                </p>
              </div>

              {/* Hand Raise / Share */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setHandRaised(!handRaised)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    handRaised
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <Hand className="w-3.5 h-3.5" />
                  <span>{handRaised ? t.chairs.lowerHand : t.chairs.raiseHand}</span>
                </button>
              </div>
            </div>

            {/* Stage Video Grid: Active Speakers Screen */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              {/* Speaker 1: Dr. Zebene (Host) */}
              <div className="relative bg-slate-950 rounded-xl overflow-hidden border-2 border-amber-500/40 aspect-video flex flex-col justify-between p-3 group shadow-lg">
                <div className="absolute inset-0 bg-cover bg-center opacity-85" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80')` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40"></div>

                {/* Top overlay badges */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="flex items-center gap-1 bg-amber-500/90 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded">
                    <Award className="w-3 h-3" />
                    {t.chairs.host} · #{2}
                  </span>
                  <span className="bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded font-medium flex items-center gap-1">
                    {langFlags[userLang] || 'Oneworld'}
                  </span>
                </div>

                {/* Soundwave active speaking animation */}
                <div className="relative z-10 flex items-end justify-between">
                  <div>
                    <h4 className="text-white font-bold text-xs">{currentRoom.hostName}</h4>
                    <p className="text-[10px] text-amber-300">{t.chairs.leadSpeaker}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-black/60 px-2 py-1 rounded">
                    <div className="w-1 bg-emerald-400 animate-soundwave-1"></div>
                    <div className="w-1 bg-emerald-400 animate-soundwave-2"></div>
                    <div className="w-1 bg-emerald-400 animate-soundwave-3"></div>
                    <div className="w-1 bg-emerald-400 animate-soundwave-4"></div>
                    <span className="text-[10px] text-emerald-400 font-bold ml-1">{t.chairs.speakingNow}</span>
                  </div>
                </div>
              </div>

              {/* Speaker 2: Current User or Active Participant */}
              <div className="relative bg-slate-950 rounded-xl overflow-hidden border-2 border-indigo-500/40 aspect-video flex flex-col justify-between p-3 group shadow-lg">
                {/* Webcam or Avatar Background */}
                {isVideoOn ? (
                  isUsingRealWebcam ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
                    />
                  ) : (
                    <div 
                      className="absolute inset-0 bg-cover bg-center opacity-85" 
                      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80')` }}
                    ></div>
                  )
                ) : (
                  <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center text-slate-500">
                    <VideoOff className="w-8 h-8 mb-2" />
                    <span className="text-xs">{t.chairs.camOff}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/40"></div>

                {/* Top overlay */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="bg-indigo-600/90 text-white font-bold text-[10px] px-2 py-0.5 rounded">
                    {userSeatedNumber ? `${t.chairs.youOnSeat}${userSeatedNumber}` : t.chairs.youParticipant}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setIsUsingRealWebcam(!isUsingRealWebcam)}
                      className="bg-black/70 hover:bg-black text-[10px] text-slate-300 px-2 py-0.5 rounded border border-slate-700 cursor-pointer"
                      title={t.chairs.toggleWebcam}
                    >
                      {isUsingRealWebcam ? t.chairs.avatarMode : t.chairs.toggleWebcam}
                    </button>
                    <span className="bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                      {langFlags[userLang] || 'Oneworld'}
                    </span>
                  </div>
                </div>

                {/* Bottom audio indicator */}
                <div className="relative z-10 flex items-end justify-between">
                  <div>
                    <h4 className="text-white font-bold text-xs">{t.chairs.you}</h4>
                    <p className="text-[10px] text-indigo-300">{t.chairs.activeMember}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {isMicOn ? (
                      <span className="flex items-center gap-1 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-[10px] px-2 py-0.5 rounded">
                        <Mic className="w-3 h-3 text-emerald-400" />
                        {t.chairs.micLive}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 bg-red-950/80 border border-red-500/50 text-red-300 text-[10px] px-2 py-0.5 rounded">
                        <MicOff className="w-3 h-3 text-red-400" />
                        {t.chairs.micMuted}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Primary Controls Bar for Mic, Video, Seating & Gifts */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                {/* Mic Button */}
                <button
                  onClick={toggleMicrophone}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isMicOn
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {isMicOn ? <Mic className="w-4 h-4 text-white animate-pulse" /> : <MicOff className="w-4 h-4 text-red-400" />}
                  <span>{isMicOn ? t.roomStage.micMute : t.roomStage.micUnmute}</span>
                </button>

                {/* Camera Button */}
                <button
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isVideoOn
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-950'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4 text-red-400" />}
                  <span>{isVideoOn ? t.roomStage.camClose : t.roomStage.camOpen}</span>
                </button>
              </div>

              {/* Seating controls */}
              <div className="flex items-center gap-2">
                {userSeatedNumber ? (
                  <button
                    onClick={onLeaveSeat}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-red-950/50 hover:text-red-300 text-slate-300 border border-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>#{userSeatedNumber} {t.roomStage.leaveTheSeat}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onClaimSeat(1)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-lg text-xs font-bold transition-all shadow-md shadow-amber-950 cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
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
                  className="flex items-center gap-1.5 px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  <Gift className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.roomStage.sendGift}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Numbered Chairs Section */}
          <div className="bg-[#0e1320] border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-extrabold text-white">
                  {t.roomStage.numberedChairs}
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">
                {t.chairs.occupiedChairs} <strong className="text-amber-400">{occupants.length}</strong> / 24
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
                  className={`relative p-2.5 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer ${
                    isUserSeat
                      ? 'bg-indigo-950/50 border-indigo-500 shadow-md shadow-indigo-950/40 ring-2 ring-indigo-500/50'
                      : isOccupied
                      ? 'bg-slate-900/70 border-slate-700/80 hover:border-amber-500/60'
                      : 'bg-slate-950/40 border-dashed border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/50'
                  }`}
                >
                  {/* Seat number tag */}
                  <div className="absolute top-1 left-1.5 text-[9px] font-bold text-slate-500">
                    #{seatNum}
                  </div>

                  {isOccupied && occupant ? (
                    <>
                      <div className="relative mt-2 mb-1.5">
                        <img
                          src={occupant.avatar}
                          alt={occupant.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-600"
                        />
                        <span className="absolute -bottom-1 -right-1 text-xs">
                          {occupant.countryFlag}
                        </span>
                        {occupant.isSpeaking && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-white truncate w-full">
                        {occupant.name}
                      </span>
                      <div className="flex items-center gap-1 mt-1">
                        {occupant.isMuted ? (
                          <MicOff className="w-2.5 h-2.5 text-red-400" />
                        ) : (
                          <Mic className="w-2.5 h-2.5 text-emerald-400" />
                        )}
                        {occupant.isVideoOn ? (
                          <Video className="w-2.5 h-2.5 text-indigo-400" />
                        ) : (
                          <VideoOff className="w-2.5 h-2.5 text-slate-500" />
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="py-2.5 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full border border-dashed border-slate-700 flex items-center justify-center text-slate-600 mb-1">
                        +
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">{t.chairs.openSeat}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Instant Multilingual Speech Translation Stream & Chat */}
        <div className="bg-[#0e1320] border border-slate-800 rounded-2xl flex flex-col h-[700px] shadow-2xl">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-900/40 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-emerald-400" />
              <div>
                <h3 className="text-xs font-extrabold text-white">
                  {t.announcements.liveTranslatorTitle}
                </h3>
                <p className="text-[10px] text-slate-400">
                  {t.announcements.liveTranslatorSubtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((msg) => {
              const translatedDisplay = msg.translations[userLang] || msg.originalText;

              return (
                <div
                  key={msg.id}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 transition-all hover:border-slate-700"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={msg.speakerAvatar}
                        alt={msg.speakerName}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="font-bold text-white text-[11px]">{msg.speakerName}</span>
                      <span className="text-[9px] text-slate-500 font-medium">#{msg.seatNumber}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                      <button
                        onClick={() => speakText(translatedDisplay, userLang)}
                        className="p-1 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded cursor-pointer"
                        title={t.announcements.speakTranslation}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Translated text prominently */}
                  <div className="p-2 rounded-lg bg-emerald-950/20 border border-emerald-900/40 text-emerald-200 font-medium leading-relaxed">
                    <div className="text-[9px] uppercase tracking-wider text-emerald-400 font-bold mb-0.5">
                      {t.announcements.liveTranslationTo}
                    </div>
                    "{translatedDisplay}"
                  </div>

                  {/* Original text quiet */}
                  {msg.sourceLang !== userLang && (
                    <div className="text-[10px] text-slate-400 italic">
                      {t.announcements.originalSpeech} ({msg.sourceLang.toUpperCase()}): "{msg.originalText}"
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input & Instant Translation Dispatch */}
          <div className="p-3 border-t border-slate-800 bg-slate-900/50 rounded-b-2xl">
            <form onSubmit={handleSendTextMessage} className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={t.roomStage.inputPlaceholder}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={toggleMicrophone}
                  className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                    isMicOn
                      ? 'bg-red-600 border-red-500 text-white animate-pulse'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                  title="በድምፅ ይናገሩ (Voice Speech Input)"
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  type="submit"
                  disabled={!inputText.trim() || isTranslating}
                  className="p-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 rounded-xl font-bold transition-all shadow-md shadow-amber-950 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  በGemini AI የላቀ አውቶማቲክ ትርጉም የሚሰራ
                </span>
                <span>ወደ 8 የአለም ቋንቋዎች በቀጥታ ይሰራጫል</span>
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
