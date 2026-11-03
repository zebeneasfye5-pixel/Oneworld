import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Users, 
  Sparkles,
  Radio,
  UserPlus,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Camera,
  Upload,
  Shield,
  Briefcase,
  Lock,
  Volume2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { UserProfile } from './AuthModal';
import { AppLanguage, TRANSLATIONS } from '../i18n/translations';
import { speakText } from '../services/speechService';

export interface HouseMemberRecord {
  houseId: string;
  memberId: string;
  fullName: string;
  avatarUrl: string;
  roleInHouse: string;
  profession?: string;
  externalTitle?: string;
  securityBadge?: string;
  registeredDate: string;
  seatNumber: number | null;
}

export interface SeatedParticipant {
  seatNumber: number;
  name: string;
  role: string;
  avatar: string;
  isMicOn: boolean;
  isVideoOn: boolean;
  isSpeaking: boolean;
  countryFlag: string;
  isSelf?: boolean;
}

interface HouseStageMediaProps {
  houseId: string;
  houseTitle: string;
  houseDescription: string;
  houseRoleOptions: string[];
  currentUser: UserProfile;
  currentLang: AppLanguage;
  houseMemberships: Record<string, HouseMemberRecord>;
  onRegisterHouseMember: (record: HouseMemberRecord) => void;
  onShowToast: (msg: string) => void;
}

export const HouseStageMedia: React.FC<HouseStageMediaProps> = ({
  houseId,
  houseTitle,
  houseDescription,
  houseRoleOptions,
  currentUser,
  currentLang,
  houseMemberships,
  onRegisterHouseMember,
  onShowToast
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.am;
  const membership = houseMemberships[houseId];

  // Registration Form State
  const [selectedRole, setSelectedRole] = useState(houseRoleOptions[0] || 'Member');
  const [profession, setProfession] = useState('');
  const [externalTitle, setExternalTitle] = useState('');
  const [securityBadge, setSecurityBadge] = useState('');
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(currentUser.avatarUrl || '');
  const [hasAgreedToBylaws, setHasAgreedToBylaws] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Zoom & Display Controls
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFullBodyMode, setIsFullBodyMode] = useState(false);
  const stageContainerRef = useRef<HTMLDivElement | null>(null);

  // Live Media State
  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [userSeat, setUserSeat] = useState<number | null>(1); // Default to seat #1 when member enters
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Update selected role when language/options shift
  useEffect(() => {
    if (houseRoleOptions && houseRoleOptions.length > 0) {
      setSelectedRole(houseRoleOptions[0]);
    }
  }, [currentLang, houseRoleOptions]);

  // Seated Participants
  const isHouse4 = houseId === 'h4'; // Max 2 seats strictly for House 4
  const [participants] = useState<SeatedParticipant[]>(() => {
    if (isHouse4) {
      return [
        {
          seatNumber: 2,
          name: 'ሚስጥራዊ አማካሪ (Sanctuary Peer)',
          role: houseRoleOptions[0] || 'Confidential Peer',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
          isMicOn: false,
          isVideoOn: true,
          isSpeaking: false,
          countryFlag: '🇪🇹'
        }
      ];
    }
    return [
      {
        seatNumber: 2,
        name: 'ዶ/ር ተስፋዬ መንግስቱ',
        role: houseRoleOptions[0] || 'Leader',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        isMicOn: false,
        isVideoOn: true,
        isSpeaking: false,
        countryFlag: '🇪🇹'
      },
      {
        seatNumber: 3,
        name: 'ወ/ሮ ራሔል ሰለሞን',
        role: houseRoleOptions[1] || 'Coordinator',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
        isMicOn: true,
        isVideoOn: true,
        isSpeaking: true,
        countryFlag: '🇪🇹'
      },
      {
        seatNumber: 4,
        name: 'ኢንጂነር ዳንኤል ከበደ',
        role: houseRoleOptions[2] || 'Advisor',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
        isMicOn: false,
        isVideoOn: true,
        isSpeaking: false,
        countryFlag: '🇺🇸'
      }
    ];
  });

  // Ultra-Fast Zero-Latency Camera Initializer with Warm Track Support
  const startCamera = async (facing: 'user' | 'environment' = cameraFacing) => {
    setCameraLoading(true);
    setCameraError(null);

    // Warm-track instant activation (0ms): If video track exists, just enable it!
    if (mediaStreamRef.current && mediaStreamRef.current.getVideoTracks().length > 0 && cameraFacing === facing) {
      mediaStreamRef.current.getVideoTracks().forEach((trk) => {
        trk.enabled = true;
      });
      setCameraActive(true);
      setIsVideoOn(true);
      setCameraLoading(false);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStreamRef.current;
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        videoRef.current.play().catch(() => {});
      }
      return;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getVideoTracks().forEach((trk) => trk.stop());
    }

    let stream: MediaStream | null = null;

    // Fast-capture Tier 1: Zero resolution-probing delay with warm audio track
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing },
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      });
      // Synchronize audio track enabled state with current mic state
      stream.getAudioTracks().forEach((track) => {
        track.enabled = isMicOn;
      });
    } catch (e1) {
      console.warn('House Tier 1 failed, trying Tier 2 (video-only):', e1);
      // Fast-capture Tier 2: Universal constraint without audio if microphone blocked
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
      } catch (e2: any) {
        console.warn('All camera attempts failed in house:', e2);
        setCameraLoading(false);
        setCameraActive(false);
        setCameraError(
          e2?.name === 'NotAllowedError' || e2?.name === 'PermissionDeniedError'
            ? 'የካሜራ ፍቃድ አልተሰጠም። እባክዎ ከላይ በብራውዘርዎ የካሜራ ፍቃድ (Allow) ይስጡና እንደገና ይሞክሩ።'
            : 'ካሜራ ማግኘት አልተቻለም። እባክዎ እንደገና ይሞክሩ።'
        );
        return;
      }
    }

    if (stream) {
      mediaStreamRef.current = stream;
      setCameraFacing(facing);
      setCameraActive(true);
      setIsVideoOn(true);
      setCameraLoading(false);
      setCameraError(null);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        videoRef.current.play().catch(() => {});
      }
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

  const handleFlipCamera = () => {
    const nextFacing = cameraFacing === 'user' ? 'environment' : 'user';
    setCameraFacing(nextFacing);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getVideoTracks().forEach((trk) => trk.stop());
    }
    startCamera(nextFacing);
  };

  // Auto start camera if member exists
  useEffect(() => {
    if (membership && isVideoOn) {
      startCamera(cameraFacing).catch(() => {});
    }

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((trk) => trk.stop());
      }
    };
  }, [membership]);

  // Photo Upload Handler
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setProfilePhotoUrl(reader.result);
          onShowToast('የፕሮፋይል ፎቶ በተሳካ ሁኔታ ተጭኗል!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Zoom Controls
  const handleZoomIn = () => setZoomScale((prev) => Math.min(prev + 0.2, 2.0));
  const handleZoomOut = () => setZoomScale((prev) => Math.max(prev - 0.2, 0.8));
  const handleResetZoom = () => setZoomScale(1);

  const toggleFullscreen = () => {
    if (!stageContainerRef.current) return;
    if (!document.fullscreenElement) {
      stageContainerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const toggleMic = async () => {
    if (!membership) {
      onShowToast(t.stageMedia.regRequired);
      return;
    }
    const nextMic = !isMicOn;
    setIsMicOn(nextMic);

    const audioTracks = mediaStreamRef.current?.getAudioTracks() || [];
    if (audioTracks.length > 0) {
      audioTracks.forEach((trk) => {
        trk.enabled = nextMic;
      });
    } else if (nextMic) {
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
        });
        const newTrack = audioStream.getAudioTracks()[0];
        if (newTrack && mediaStreamRef.current) {
          mediaStreamRef.current.addTrack(newTrack);
        }
      } catch (err) {
        console.warn('Microphone activation notice:', err);
      }
    }

    onShowToast(nextMic ? `🎙️ ${t.stageMedia.micOn}` : `🔇 ${t.stageMedia.micOff}`);
    if (nextMic) {
      speakText(t.stageMedia.speaking, currentLang as any);
    }
  };

  const toggleVideo = () => {
    if (!membership) {
      onShowToast(t.stageMedia.regRequired);
      return;
    }
    if (isVideoOn && cameraActive) {
      stopCamera();
      onShowToast(`📹 ${t.stageMedia.camOff}`);
    } else {
      startCamera(cameraFacing);
      onShowToast(`📹 ${t.stageMedia.camOn}`);
    }
  };

  const handleClaimSeat = (seatNo: number) => {
    if (!membership) {
      onShowToast(t.stageMedia.regRequired);
      return;
    }

    // Strict 2-person limit check for House 4 (ሚስጥር ቤት)
    if (isHouse4 && seatNo > 2) {
      alert('የሚስጥር ቤቱ በአንድ ጊዜ ከ2 ሰው በላይ ማስተናገድ አይችልም (Max 2 Persons Limit)!');
      return;
    }

    setUserSeat(seatNo);
    setIsVideoOn(true);
    startCamera(cameraFacing);
    onShowToast(`${t.chairs.seatPrefix}${seatNo}: ${t.stageMedia.takeSeat}`);
  };

  const handleLeaveSeat = () => {
    setUserSeat(null);
    setIsMicOn(false);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((trk) => trk.stop());
      mediaStreamRef.current = null;
    }
    onShowToast(t.stageMedia.leaveSeat);
  };

  // Submit Registration
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasAgreedToBylaws) return;

    // Compulsory external title check for House 3 (ባለስልጣን ቤት)
    if (houseId === 'h3' && !externalTitle.trim()) {
      alert('በባለስልጣን ቤት ለመመዝገብ ከቤቱ ውጭ ያለዎትን የመንግስት/የተቋም የስልጣን ማዕረግ መሙላት ግዴታ ነው!');
      return;
    }

    const record: HouseMemberRecord = {
      houseId,
      memberId: `OW-${houseId.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: currentUser.fullName,
      avatarUrl: profilePhotoUrl || currentUser.avatarUrl,
      roleInHouse: selectedRole,
      profession: profession || 'ባለሙያ',
      externalTitle: externalTitle || currentUser.roleTitle,
      securityBadge: securityBadge || 'OW-SEC-VALID',
      registeredDate: '2026-10-26',
      seatNumber: 1
    };

    onRegisterHouseMember(record);
    setUserSeat(1);
    setIsVideoOn(true);
    setIsMicOn(true);
    onShowToast(`🎉 ${houseTitle} · ${t.stageMedia.registerBtn}`);
  };

  // 1. If user is NOT a member of this specific house, show comprehensive Registration Form
  if (!membership) {
    return (
      <div className="bg-gradient-to-br from-[#111625] via-[#0d121f] to-[#0c0f17] border border-amber-500/30 rounded-3xl p-6 md:p-8 shadow-2xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/10">
              🏛️
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest text-amber-400 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full inline-block">
              {t.stageMedia.regRequired}
            </span>
            <h2 className="text-xl md:text-2xl font-black text-white">
              {t.stageMedia.joinPromptPrefix} {houseTitle} {t.stageMedia.joinPromptSuffix}
            </h2>
            <p className="text-xs text-slate-300 max-w-lg mx-auto">
              {houseDescription} · መድረኩን ለመጠቀምና በውይይቱ ለመሳተፍ አስገዳጅ የምዝገባ ቅጽ ይሙሉ
            </p>
          </div>

          <form onSubmit={handleRegister} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 text-left space-y-4 shadow-2xl">
            {/* Profile Photo Upload */}
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-950/80 border border-slate-800 rounded-2xl">
              <div className="relative group">
                <img
                  src={profilePhotoUrl}
                  alt={currentUser.fullName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500 shadow-md"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer text-white"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <p className="text-xs font-bold text-white">የፊት ፕሮፋይል ፎቶ (Profile Picture) *</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  በቤቱ ውስጥ እርስዎ በቪዲዮና በወንበር ላይ የሚታዩበት እውነተኛ ፎቶ
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-xs font-semibold border border-slate-700 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>ፎቶ ቀይር / ስቀል</span>
                </button>
              </div>
            </div>

            {/* Profession & Current Field */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                አሁን ላይ ያለዎት የሞያ መስክ (Current Field of Profession) *
              </label>
              <input
                type="text"
                required
                placeholder="ምሳሌ፡ የኢኮኖሚክስ ተመራማሪ፣ የህግ ጠበቃ፣ የህክምና ዶክተር፣ ሶፍትዌር ኢንጂነር..."
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            {/* Role inside the house */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                በቤቱ ውስጥ የሚኖሩዎት ሚና (Role Inside this House) *
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer font-medium"
              >
                {houseRoleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* External Title / Rank (Especially for House 3) */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                ከቤቱ ውጭ ያለዎት ኃላፊነት ወይም የስልጣን ማዕረግ (External Title / Official Rank) {houseId === 'h3' ? '*(ግዴታ)' : ''}
              </label>
              <input
                type="text"
                required={houseId === 'h3'}
                placeholder={
                  houseId === 'h3'
                    ? 'ምሳሌ፡ ሚኒስትር፣ ዳይሬክተር፣ ከንቲባ፣ የህዝብ ተወካይ፣ አምባሳደር...'
                    : 'ምሳሌ፡ የማህበር ሊቀመንበር፣ ስራ አስኪያጅ፣ አማካሪ...'
                }
                value={externalTitle}
                onChange={(e) => setExternalTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            {/* House 7 Specific: Security Badge Credentials */}
            {houseId === 'h7' && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  የደህንነት ባጅ መለያ ቁጥር (Cyber Security & Peacekeeping Badge ID) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ምሳሌ፡ INTER-SEC-2026-90412"
                  value={securityBadge}
                  onChange={(e) => setSecurityBadge(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-medium font-mono"
                />
              </div>
            )}

            {/* Bylaws Consent */}
            <label className="flex items-start gap-2.5 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={hasAgreedToBylaws}
                onChange={(e) => setHasAgreedToBylaws(e.target.checked)}
                className="mt-0.5 rounded border-slate-700 text-amber-500 focus:ring-amber-500"
              />
              <span className="text-[11px] text-slate-300 leading-relaxed">
                {t.stageMedia.agreeBylaws}
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={!hasAgreedToBylaws}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-emerald-600 to-indigo-600 hover:opacity-95 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-amber-500/20 cursor-pointer transition flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t.stageMedia.registerBtn}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. Member IS Registered: Render Large Zoom Meeting Stage with Scale Zoom Controls!
  return (
    <div 
      ref={stageContainerRef}
      className={`bg-[#0f1422] border border-slate-800 rounded-3xl p-4 md:p-6 shadow-2xl mb-8 space-y-6 ${
        isFullscreen ? 'p-8 bg-[#0a0d14] fixed inset-0 z-50 overflow-y-auto' : ''
      }`}
    >
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl">
            🏛️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base md:text-lg font-black text-white">
                {houseTitle}
              </h2>
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                {t.stageMedia.active}
              </span>
              {isHouse4 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  2 ሰዎች ብቻ
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              ID: <span className="text-amber-400 font-mono font-bold">{membership.memberId}</span> · {membership.roleInHouse} · {membership.profession || 'ባለሙያ'}
            </p>
          </div>
        </div>

        {/* Toolbar: Mic, Cam, Zoom Controls, Fullscreen */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Zoom In / Zoom Out Buttons */}
          <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-xl p-1 gap-1">
            <button
              onClick={handleZoomOut}
              title="ዙም ቀንስ (Zoom Out)"
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono font-bold text-amber-400 px-1">
              {Math.round(zoomScale * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              title="ዙም ጨምር (Zoom In)"
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              title="መደበኛ መጠን (Reset)"
              className="p-1 text-[10px] text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              100%
            </button>
          </div>

          {/* Full-Body / Fullscreen Mode Toggle */}
          <button
            onClick={() => setIsFullBodyMode(!isFullBodyMode)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              isFullBodyMode
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
            }`}
            title="ሙሉ አካልና ቁመት ማሳያ (Full Body Mode)"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>{isFullBodyMode ? 'መደበኛ ስክሪን' : 'ሙሉ አካል (Full-Body)'}</span>
          </button>

          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'ውጣ' : 'ሙሉ ስክሪን (Fullscreen)'}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleMic}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-md cursor-pointer ${
              isMicOn
                ? 'bg-amber-500 text-slate-950 shadow-amber-500/30 ring-2 ring-amber-400/50'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700'
            }`}
          >
            {isMicOn ? <Mic className="w-4 h-4 text-slate-950" /> : <MicOff className="w-4 h-4 text-red-400" />}
            <span>{isMicOn ? t.stageMedia.micOn : t.stageMedia.micOff}</span>
          </button>

          <button
            onClick={toggleVideo}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-md cursor-pointer ${
              isVideoOn
                ? 'bg-amber-500 text-slate-950 shadow-amber-500/30 ring-2 ring-amber-400/50'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700'
            }`}
          >
            {isVideoOn ? <Video className="w-4 h-4 text-slate-950" /> : <VideoOff className="w-4 h-4 text-red-400" />}
            <span>{isVideoOn ? t.stageMedia.camOn : t.stageMedia.camOff}</span>
          </button>

          {userSeat !== null && (
            <button
              onClick={handleLeaveSeat}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 cursor-pointer"
            >
              {t.stageMedia.leaveSeat}
            </button>
          )}
        </div>
      </div>

      {/* Scalable Substantially Enlarged Video Grid Stage (Zoom & Full-Body Controlled) */}
      <div 
        className="transition-transform duration-200 origin-top overflow-hidden"
        style={{ transform: `scale(${zoomScale})` }}
      >
        <div className={`grid gap-4 ${
          isHouse4 
            ? 'grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto' 
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2'
        }`}>
          {/* User's Own Video Tile */}
          {userSeat !== null && (
            <div className={`relative rounded-3xl bg-slate-950 border-2 border-amber-500 overflow-hidden flex items-center justify-center shadow-2xl group transition-all ${
              isFullBodyMode ? 'h-[580px] sm:h-[640px]' : 'h-[380px] sm:h-[440px]'
            }`}>
              {isVideoOn && cameraActive ? (
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
              ) : isVideoOn && !cameraActive ? (
                <div className="flex flex-col items-center justify-center p-6 text-center max-w-sm">
                  {cameraError ? (
                    <div className="bg-red-950/80 border border-red-500/60 p-3 rounded-2xl mb-3">
                      <AlertCircle className="w-7 h-7 text-red-400 mx-auto mb-1" />
                      <p className="text-xs font-bold text-red-200 mb-2">{cameraError}</p>
                      <button
                        onClick={() => startCamera(cameraFacing)}
                        className="px-3.5 py-1.5 bg-amber-500 text-slate-950 rounded-xl text-xs font-black cursor-pointer shadow-md"
                      >
                        እንደገና ሞክር (Retry)
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="w-14 h-14 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center text-amber-400 mb-3 shadow-lg">
                        <Camera className="w-7 h-7 text-amber-400 animate-pulse" />
                      </div>
                      <h4 className="text-base font-black text-white mb-1">ካሜራዎ አልበራም</h4>
                      <p className="text-xs text-slate-300 mb-3">በዚህ ቤት ፊት ለፊት በቀጥታ ለመሳተፍ ካሜራዎን ያብሩ</p>
                      <button
                        onClick={() => startCamera('user')}
                        className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-lg cursor-pointer transition transform hover:scale-105"
                      >
                        📹 ካሜራዬን አብራ (Start Camera)
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-4 text-center">
                  <img
                    src={profilePhotoUrl || currentUser.avatarUrl}
                    alt={currentUser.fullName}
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-amber-400 mb-2 shadow-lg"
                  />
                  <span className="text-base font-black text-white">{currentUser.fullName}</span>
                  <span className="text-xs text-amber-300 font-bold">{membership.roleInHouse}</span>
                </div>
              )}

              {/* Seat Tag & Flip */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <div className="flex items-center gap-1 bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs sm:text-sm text-amber-400 font-mono font-black border border-amber-500/40 shadow-md">
                  <span>#{userSeat} ({t.stageMedia.yourSeat})</span>
                </div>
                {cameraActive && (
                  <button
                    onClick={handleFlipCamera}
                    className="bg-black/85 hover:bg-black text-white text-xs font-bold px-2.5 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1 cursor-pointer shadow-md"
                    title="የፊት/የኋላ ካሜራ ቀይር"
                  >
                    <RefreshCw className="w-3 h-3 text-amber-400" />
                    <span>ቀይር</span>
                  </button>
                )}
              </div>

              {/* Name & Title Overlay */}
              <div className="absolute bottom-3 left-3 flex flex-col bg-black/85 backdrop-blur-md px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-white max-w-[85%] border border-slate-800 shadow-md">
                <span className="truncate text-sm sm:text-base font-black">{currentUser.fullName}</span>
                <span className="text-xs text-amber-300 font-bold">{membership.roleInHouse}</span>
              </div>

              {/* Mic Icon */}
              <div className="absolute bottom-3 right-3 p-3 rounded-2xl bg-black/85 backdrop-blur-md border border-slate-800 shadow-md">
                {isMicOn ? (
                  <Mic className="w-4 h-4 text-amber-400 animate-pulse" />
                ) : (
                  <MicOff className="w-4 h-4 text-rose-400" />
                )}
              </div>
            </div>
          )}

          {/* Other Seated Participants */}
          {participants.map((p) => (
            <div
              key={p.seatNumber}
              className={`relative rounded-3xl bg-slate-950 border-2 overflow-hidden flex items-center justify-center shadow-2xl transition-all group ${
                p.isSpeaking ? 'border-amber-400 ring-2 ring-amber-400/40' : 'border-slate-800'
              } ${isFullBodyMode ? 'h-[580px] sm:h-[640px]' : 'h-[380px] sm:h-[440px]'}`}
            >
              <img
                src={p.avatar}
                alt={p.name}
                className={`w-full h-full transition duration-500 ${isFullBodyMode ? 'object-contain bg-black' : 'object-cover'} group-hover:scale-105`}
              />

              {/* Top Seat Tag */}
              <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/80 backdrop-blur-md px-3 py-1 rounded-xl text-xs text-amber-400 font-mono font-bold border border-amber-500/40">
                <span>#{p.seatNumber}</span>
              </div>

              {/* Name & Role */}
              <div className="absolute bottom-3 left-3 flex flex-col bg-black/85 backdrop-blur-md px-3.5 py-2 rounded-2xl text-xs font-semibold text-white max-w-[85%] leading-tight border border-slate-800">
                <div className="flex items-center gap-1 font-black text-sm">
                  <span className="truncate">{p.name}</span>
                  <span>{p.countryFlag}</span>
                </div>
                <span className="text-[11px] text-amber-300 font-bold">{p.role}</span>
              </div>

              {/* Mic */}
              <div className="absolute bottom-3 right-3 p-2.5 rounded-2xl bg-black/80 backdrop-blur-md border border-slate-800">
                {p.isMicOn ? (
                  <Mic className="w-4 h-4 text-amber-400 animate-pulse" />
                ) : (
                  <MicOff className="w-4 h-4 text-slate-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Numbered Chairs Grid */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white">
              {t.stageMedia.seatsTitle} {isHouse4 ? '(የሚስጥር ቤት፡ 2 ወንበሮች ብቻ)' : ''}
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            {isHouse4 ? 'ከ2 ሰው በላይ መግባት አይቻልም' : t.stageMedia.gateDesc}
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2 max-h-36 overflow-y-auto pr-1">
          {Array.from({ length: isHouse4 ? 2 : 24 }).map((_, idx) => {
            const seatNo = idx + 1;
            const isTakenByMe = userSeat === seatNo;
            const isTakenByOther = participants.some((p) => p.seatNumber === seatNo);

            return (
              <button
                key={seatNo}
                onClick={() => {
                  if (isTakenByMe) {
                    handleLeaveSeat();
                  } else if (!isTakenByOther) {
                    handleClaimSeat(seatNo);
                  } else {
                    onShowToast(`${t.chairs.seatPrefix}${seatNo}: ${t.stageMedia.occupied}`);
                  }
                }}
                className={`py-2.5 px-2 rounded-xl border flex flex-col items-center justify-center transition active:scale-95 text-center cursor-pointer ${
                  isTakenByMe
                    ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/50'
                    : isTakenByOther
                    ? 'bg-slate-900 border-slate-800 text-slate-500 opacity-70'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-amber-500/50 text-slate-300 hover:text-white'
                }`}
              >
                <span className="text-[10px] font-mono font-bold">#{seatNo}</span>
                <span className="text-[9px] mt-0.5 truncate max-w-full">
                  {isTakenByMe ? t.stageMedia.yourSeat : isTakenByOther ? t.stageMedia.occupied : t.stageMedia.takeSeat}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
