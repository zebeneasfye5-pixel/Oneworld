import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Users,
  Radio,
  UserPlus,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Camera,
  Upload,
  Lock,
  RefreshCw,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Armchair
} from 'lucide-react';
import { UserProfile } from './AuthModal';
import { AppLanguage, TRANSLATIONS } from '../i18n/translations';
import { RemotePeerData } from '../services/realtimeMesh';
import { EdgeToEdgeVideo } from './EdgeToEdgeVideo';

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

interface HouseStageMediaProps {
  houseId: string;
  houseTitle: string;
  houseDescription: string;
  houseRoleOptions: string[];
  currentUser: UserProfile | null;
  currentLang: AppLanguage;
  houseMemberships: Record<string, HouseMemberRecord>;
  onRegisterHouseMember: (record: HouseMemberRecord) => void;
  onShowToast: (msg: string) => void;
  onGoBack?: () => void;
  // Real WebRTC & WebSocket controls wired from App.tsx useRealtimeRoom
  localStream?: MediaStream | null;
  remotePeers?: Map<string, RemotePeerData>;
  isMicMuted?: boolean;
  isVideoOff?: boolean;
  isSpeaking?: boolean;
  cameraFacing?: 'user' | 'environment';
  cameraError?: string | null;
  onToggleMic?: () => void;
  onToggleVideo?: () => void;
  onFlipCamera?: () => void;
  onRetryCamera?: () => void;
  userSeat?: number | null;
  onClaimSeat?: (seatNumber: number) => void;
  onLeaveSeat?: () => void;
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
  onShowToast,
  onGoBack,
  localStream,
  remotePeers,
  isMicMuted = true,
  isVideoOff = false,
  isSpeaking = false,
  cameraFacing = 'user',
  cameraError = null,
  onToggleMic,
  onToggleVideo,
  onFlipCamera,
  onRetryCamera,
  userSeat = 1,
  onClaimSeat,
  onLeaveSeat
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.am;
  const membership: HouseMemberRecord | null = houseMemberships[houseId] || null;
  const [showDetails, setShowDetails] = useState(false);

  // Registration Form State
  const [selectedRole, setSelectedRole] = useState(houseRoleOptions[0] || 'Member');
  const [profession, setProfession] = useState('');
  const [externalTitle, setExternalTitle] = useState('');
  const [securityBadge, setSecurityBadge] = useState('');
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(currentUser?.avatarUrl || '');
  const [hasAgreedToBylaws, setHasAgreedToBylaws] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Zoom & Display Controls
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenTargetId, setFullscreenTargetId] = useState<'local' | string>('local');
  const [isFullBodyMode, setIsFullBodyMode] = useState(false);
  const stageContainerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Lock body scroll cleanly when fullscreen cinema portal is active
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

  useEffect(() => {
    if (houseRoleOptions && houseRoleOptions.length > 0) {
      setSelectedRole(houseRoleOptions[0]);
    }
  }, [currentLang, houseRoleOptions]);

  useEffect(() => {
    if (currentUser?.avatarUrl && !profilePhotoUrl) {
      setProfilePhotoUrl(currentUser.avatarUrl);
    }
  }, [currentUser?.avatarUrl, profilePhotoUrl]);

  // Attach live localStream to self video element cleanly
  useEffect(() => {
    if (videoRef.current && localStream && !isVideoOff) {
      if (videoRef.current.srcObject !== localStream) {
        videoRef.current.srcObject = localStream;
      }
      videoRef.current.muted = true;
      videoRef.current.playsInline = true;
      videoRef.current.play().catch(() => {});
    }
  }, [localStream, isVideoOff, userSeat, membership]);

  const isHouse4 = houseId === 'h4';
  const liveRemotePeers = remotePeers ? Array.from(remotePeers.values()) : [];

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

  const handleZoomIn = () => setZoomScale((prev) => Math.min(prev + 0.2, 2.0));
  const handleZoomOut = () => setZoomScale((prev) => Math.max(prev - 0.2, 0.8));
  const handleResetZoom = () => setZoomScale(1);

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => {
      const next = !prev;
      try {
        if (next && stageContainerRef.current?.requestFullscreen) {
          stageContainerRef.current.requestFullscreen().catch(() => {});
        } else if (!next && document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      } catch {}
      return next;
    });
  };

  const handleToggleMic = () => {
    if (!membership) {
      onShowToast(t.stageMedia.regRequired);
      return;
    }
    onToggleMic?.();
    onShowToast(isMicMuted ? `🎙️ ${t.stageMedia.micOn}` : `🔇 ${t.stageMedia.micOff}`);
  };

  const handleToggleVideo = () => {
    if (!membership) {
      onShowToast(t.stageMedia.regRequired);
      return;
    }
    onToggleVideo?.();
    onShowToast(isVideoOff ? `📹 ${t.stageMedia.camOn}` : `📹 ${t.stageMedia.camOff}`);
  };

  const handleSeatClick = (seatNo: number) => {
    if (!membership) {
      onShowToast(t.stageMedia.regRequired);
      return;
    }
    if (isHouse4 && seatNo > 2) {
      onShowToast('⚠️ የሚስጥር ቤቱ በአንድ ጊዜ ከ2 ሰው በላይ ማስተናገድ አይችልም (Max 2 Persons Limit)!');
      return;
    }
    const isTakenByMe = userSeat === seatNo;
    const occupant = liveRemotePeers.find((p) => p.seatNumber === seatNo);
    if (isTakenByMe) {
      onLeaveSeat?.();
      onShowToast(t.stageMedia.leaveSeat);
    } else if (!occupant) {
      onClaimSeat?.(seatNo);
      onShowToast(`${t.chairs.seatPrefix}${seatNo}: ${t.stageMedia.takeSeat}`);
    } else {
      onShowToast(`ወንበር #${seatNo}: በ ${occupant.name} ተይዟል`);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasAgreedToBylaws) return;

    if (houseId === 'h3' && !externalTitle.trim()) {
      onShowToast('⚠️ በባለስልጣን ቤት ለመመዝገብ ከቤቱ ውጭ ያለዎትን የስልጣን ማዕረግ መሙላት ግዴታ ነው!');
      return;
    }

    const userName = currentUser?.fullName || 'የተመዘገበ አባል';
    const userAvatar = profilePhotoUrl || currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80';

    const record: HouseMemberRecord = {
      houseId,
      memberId: `OW-${houseId.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: userName,
      avatarUrl: userAvatar,
      roleInHouse: selectedRole,
      profession: profession || 'ባለሙያ',
      externalTitle: externalTitle || currentUser?.roleTitle || 'የማህበረሰብ አባል',
      securityBadge: securityBadge || 'OW-SEC-VALID',
      registeredDate: new Date().toISOString().split('T')[0],
      seatNumber: 1
    };

    onRegisterHouseMember(record);
    onClaimSeat?.(1);
    onShowToast(`🎉 ${houseTitle} · ${t.stageMedia.registerBtn}`);
  };

  // 1. Strict Per-House Registration Gate
  if (!membership) {
    return (
      <div className="bg-gradient-to-br from-[#111625] via-[#0d121f] to-[#0c0f17] border border-amber-500/30 rounded-3xl p-6 md:p-8 shadow-2xl mb-8 relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/10">
              🏛️
            </div>
            <h2 className="text-lg md:text-xl font-black text-white">{houseTitle}</h2>
          </div>

          <form onSubmit={handleRegister} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 text-left space-y-4 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-950/80 border border-slate-800 rounded-2xl">
              <div className="relative group">
                <img
                  src={profilePhotoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'}
                  alt={currentUser?.fullName || 'Profile'}
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
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                ከቤቱ ውጭ ያለዎት ኃላፊነት ወይም የስልጣን ማዕረግ {houseId === 'h3' ? '*(ግዴታ)' : ''}
              </label>
              <input
                type="text"
                required={houseId === 'h3'}
                placeholder={houseId === 'h3' ? 'ምሳሌ፡ ሚኒስትር፣ ዳይሬክተር፣ ከንቲባ፣ አምባሳደር...' : 'ምሳሌ፡ የማህበር ሊቀመንበር፣ ስራ አስኪያጅ...'}
                value={externalTitle}
                onChange={(e) => setExternalTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            {houseId === 'h7' && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  የደህንነት ባጅ መለያ ቁጥር *
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

            <label className="flex items-start gap-2.5 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={hasAgreedToBylaws}
                onChange={(e) => setHasAgreedToBylaws(e.target.checked)}
                className="mt-0.5 rounded border-slate-700 text-amber-500 focus:ring-amber-500"
              />
              <span className="text-[11px] text-slate-300 leading-relaxed">{t.stageMedia.agreeBylaws}</span>
            </label>

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

  const isMicOn = !isMicMuted;
  const isVideoOn = !isVideoOff;

  return (
    <div
      ref={stageContainerRef}
      className="bg-[#0f1422] border border-slate-800 rounded-3xl p-4 md:p-6 shadow-2xl mb-8 space-y-6"
    >
      {/* Top Header Bar with Back Arrow Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          {onGoBack && (
            <button
              onClick={onGoBack}
              title="ወደ ዋናው አዳራሽ ተመለስ"
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/30 hover:border-amber-400 flex items-center gap-1.5 font-black text-xs cursor-pointer transition shadow-md group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>ተመለስ</span>
            </button>
          )}
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl">
            🏛️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base md:text-lg font-black text-white">{houseTitle}</h2>
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

        {/* Toolbar (Icons Only) */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer transition shadow-md flex items-center gap-1"
            title={showDetails ? 'ዝርዝር ደብቅ' : 'ተጨማሪ ዝርዝር'}
          >
            {showDetails ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4 text-amber-400" />}
          </button>

          <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-xl p-1 gap-1">
            <button onClick={handleZoomOut} title="ዙም ቀንስ" className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white cursor-pointer">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono font-bold text-amber-400 px-1">{Math.round(zoomScale * 100)}%</span>
            <button onClick={handleZoomIn} title="ዙም ጨምር" className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white cursor-pointer">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button onClick={handleResetZoom} title="100%" className="p-1 text-[10px] text-slate-400 hover:text-slate-200 cursor-pointer">
              100%
            </button>
          </div>

          <button
            onClick={() => setIsFullBodyMode(!isFullBodyMode)}
            className={`p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              isFullBodyMode
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md ring-2 ring-amber-400/50'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
            }`}
            title={isFullBodyMode ? 'መደበኛ ስክሪን' : 'ሙሉ አካልና ቁመት'}
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'ከሙሉ ስክሪን ውጣ' : 'በሙሉ ስክሪን ክፈት'}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 cursor-pointer transition shadow-md"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-amber-400" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={handleToggleMic}
            title={isMicOn ? 'ድምፅ አጥፋ' : 'ድምፅ አብራ'}
            className={`p-2.5 rounded-xl transition shadow-md cursor-pointer ${
              isMicOn
                ? 'bg-amber-500 text-slate-950 shadow-amber-500/30 ring-2 ring-amber-400/50'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700'
            }`}
          >
            {isMicOn ? <Mic className="w-4 h-4 text-slate-950" /> : <MicOff className="w-4 h-4 text-red-400" />}
          </button>

          <button
            onClick={handleToggleVideo}
            title={isVideoOn ? 'ካሜራ አጥፋ' : 'ካሜራ አብራ'}
            className={`p-2.5 rounded-xl transition shadow-md cursor-pointer ${
              isVideoOn
                ? 'bg-amber-500 text-slate-950 shadow-amber-500/30 ring-2 ring-amber-400/50'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700'
            }`}
          >
            {isVideoOn ? <Video className="w-4 h-4 text-slate-950" /> : <VideoOff className="w-4 h-4 text-red-400" />}
          </button>

          {userSeat !== null && (
            <button
              onClick={() => handleSeatClick(userSeat)}
              title={t.stageMedia.leaveSeat}
              className="p-2.5 rounded-xl text-xs font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 cursor-pointer transition shadow-md"
            >
              🚪
            </button>
          )}
        </div>
      </div>

      {showDetails && (
        <div className="p-4 bg-slate-950/90 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-2 animate-fadeIn">
          <p className="font-bold text-amber-400">ስለ ቤቱ አጭር መግለጫ (House Purpose)፦</p>
          <p className="leading-relaxed">{houseDescription}</p>
        </div>
      )}

      {/* Live WebRTC Multi-Peer Video Grid Stage */}
      <div className="transition-transform duration-200 origin-top overflow-hidden" style={{ transform: `scale(${zoomScale})` }}>
        <div className={`grid gap-4 ${
          isHouse4
            ? 'grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto'
            : liveRemotePeers.length === 0
            ? 'grid-cols-1 max-w-3xl mx-auto'
            : 'grid-cols-1 sm:grid-cols-2'
        }`}>
          {/* User's Own Live Video / Audio Card */}
          {userSeat !== null && (
            <div className="bg-slate-950/80 border-2 border-amber-500 rounded-3xl p-3.5 flex flex-col justify-between shadow-2xl">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className="bg-amber-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1">
                  <Armchair className="w-3.5 h-3.5" />
                  #{userSeat} ({t.stageMedia.yourSeat})
                </span>
                <div className="flex items-center gap-1.5">
                  {localStream && isVideoOn && onFlipCamera && (
                    <button
                      onClick={onFlipCamera}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-2.5 py-1 rounded-xl border border-slate-700 flex items-center gap-1 cursor-pointer transition shadow-md"
                      title="የፊት/የኋላ ካሜራ ቀይር"
                    >
                      <RefreshCw className="w-3 h-3 text-amber-400" />
                      <span>{cameraFacing === 'user' ? 'የፊት' : 'የኋላ'}</span>
                    </button>
                  )}
                </div>
              </div>

              <div className={`relative rounded-2xl overflow-hidden bg-black border border-slate-700 w-full ${
                isFullBodyMode ? 'h-[440px] sm:h-[500px]' : 'h-[300px] sm:h-[350px]'
              }`}>
                {isVideoOn && localStream ? (
                  <EdgeToEdgeVideo
                    stream={localStream}
                    muted={true}
                    mirror={cameraFacing === 'user'}
                  />
                ) : isVideoOn && !localStream ? (
                  <div className="w-full h-full bg-[#0a0d14] flex flex-col items-center justify-center p-4 gap-2 text-center">
                    {cameraError && <p className="text-xs text-amber-300 max-w-xs">{cameraError}</p>}
                    <button
                      onClick={() => onRetryCamera?.()}
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-lg cursor-pointer transition"
                    >
                      📹 ካሜራዬን አብራ
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 p-4">
                    <div className="relative mb-3">
                      <img
                        src={membership.avatarUrl || currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'}
                        alt={currentUser?.fullName || membership.fullName}
                        className={`w-28 h-28 rounded-full object-cover border-4 transition-all duration-300 shadow-2xl ${
                          isMicOn && isSpeaking
                            ? 'border-amber-400 ring-8 ring-amber-400/40 scale-105'
                            : 'border-slate-700'
                        }`}
                      />
                      {isMicOn && isSpeaking && (
                        <span className="absolute inset-0 rounded-full border-2 border-amber-400 animate-ping pointer-events-none" />
                      )}
                    </div>
                    <span className="text-white font-bold text-xs mb-2">ድምፅ ብቻ (Audio Only)</span>
                    <button
                      onClick={handleToggleVideo}
                      className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs cursor-pointer shadow-md transition"
                    >
                      ካሜራ አብራ
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-white font-black text-sm sm:text-base">{currentUser?.fullName || membership.fullName}</h4>
                  <p className="text-xs text-white font-medium">{membership.roleInHouse}</p>
                </div>
                <div>
                  {isMicOn ? (
                    <span className="flex items-center gap-1.5 bg-amber-950/90 border border-amber-500/70 text-white text-xs px-2.5 py-1 rounded-xl font-black">
                      <Mic className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      <span>ድምፅ በርቷል</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 bg-red-950/90 border border-red-500/60 text-white text-xs px-2.5 py-1 rounded-xl font-bold">
                      <MicOff className="w-3.5 h-3.5 text-red-400" />
                      <span>ድምፅ ጠፍቷል</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Real Remote WebRTC Peers in this House */}
          {liveRemotePeers.map((peer) => (
            <div
              key={peer.id}
              className="bg-slate-950/80 border-2 border-emerald-500/60 rounded-3xl p-3.5 flex flex-col justify-between shadow-2xl animate-fadeIn"
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className="flex items-center gap-1.5 bg-emerald-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded-xl shadow-md">
                  <Armchair className="w-3.5 h-3.5" />
                  #{peer.seatNumber || 2} · {peer.name}
                </span>
                <span className="text-sm">{peer.countryFlag || '🌍'}</span>
              </div>

              <div className={`relative rounded-2xl overflow-hidden bg-black border border-slate-700 w-full ${
                isFullBodyMode ? 'h-[440px] sm:h-[500px]' : 'h-[300px] sm:h-[350px]'
              }`}>
                {peer.stream && peer.isVideoOn ? (
                  <EdgeToEdgeVideo
                    stream={peer.stream}
                    muted={false}
                    mirror={false}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 p-4">
                    <div className="relative mb-3">
                      <img
                        src={peer.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'}
                        alt={peer.name}
                        className={`w-28 h-28 rounded-full object-cover border-4 transition-all duration-300 shadow-2xl ${
                          peer.isSpeaking
                            ? 'border-emerald-400 ring-8 ring-emerald-400/40 scale-105'
                            : 'border-slate-700'
                        }`}
                      />
                      {peer.isSpeaking && (
                        <span className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping pointer-events-none" />
                      )}
                    </div>
                    <span className="text-white font-bold text-xs">ድምፅ ብቻ (Audio Only)</span>
                  </div>
                )}

                {peer.stream && (
                  <audio
                    ref={(el) => {
                      if (el && peer.stream && el.srcObject !== peer.stream) {
                        el.srcObject = peer.stream;
                        el.play().catch(() => {});
                      }
                    }}
                    autoPlay
                  />
                )}
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-white font-black text-sm sm:text-base">{peer.name}</h4>
                  <p className="text-xs text-white font-medium">{peer.role || 'ተሳታፊ'}</p>
                </div>
                <div>
                  {!peer.isMuted ? (
                    <span className="flex items-center gap-1.5 bg-emerald-950/90 border border-emerald-500/70 text-white text-xs px-2.5 py-1 rounded-xl font-black">
                      <Mic className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                      <span>ድምፅ</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 bg-slate-900 text-white text-xs px-2.5 py-1 rounded-xl">
                      <MicOff className="w-3.5 h-3.5 text-slate-500" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Numbered Chairs Grid — ALL chairs display a visible Armchair icon */}
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

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2 max-h-40 overflow-y-auto pr-1">
          {Array.from({ length: isHouse4 ? 2 : 24 }).map((_, idx) => {
            const seatNo = idx + 1;
            const isTakenByMe = userSeat === seatNo;
            const occupant = liveRemotePeers.find((p) => p.seatNumber === seatNo);
            const isTakenByOther = !!occupant;
            const avatarUrl = isTakenByMe
              ? (membership.avatarUrl || currentUser?.avatarUrl)
              : occupant?.avatar;
            const isSpeakingNow = isTakenByMe ? (isMicOn && isSpeaking) : occupant?.isSpeaking;

            return (
              <button
                key={seatNo}
                onClick={() => handleSeatClick(seatNo)}
                className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center transition active:scale-95 text-center cursor-pointer ${
                  isTakenByMe
                    ? 'bg-amber-950/40 border-amber-500 text-amber-200 ring-2 ring-amber-500/50 shadow-md'
                    : isTakenByOther
                    ? 'bg-slate-900 border-slate-700 text-slate-300'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-amber-500/50 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1">
                  <Armchair className={`w-3.5 h-3.5 ${isTakenByMe || isTakenByOther ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span className="text-[11px] font-mono font-bold text-amber-400">#{seatNo}</span>
                </div>

                {avatarUrl ? (
                  <div className="relative my-0.5">
                    <img
                      src={avatarUrl}
                      alt={`Seat ${seatNo}`}
                      className={`w-7 h-7 rounded-full object-cover border transition-transform ${
                        isSpeakingNow
                          ? 'border-amber-400 ring-2 ring-amber-400 scale-105'
                          : 'border-slate-700'
                      }`}
                    />
                    {isSpeakingNow && (
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    )}
                  </div>
                ) : (
                  <div className="w-6 h-6 my-0.5 rounded-full border border-dashed border-slate-700 flex items-center justify-center text-slate-400">
                    <Armchair className="w-3.5 h-3.5 text-amber-400/80" />
                  </div>
                )}

                {isTakenByMe ? (
                  <span className="text-[8px] text-amber-300 font-bold truncate max-w-[46px]">
                    {currentUser?.fullName?.split(' ')[0] || 'እርስዎ'}
                  </span>
                ) : isTakenByOther && occupant ? (
                  <span className="text-[8px] text-slate-400 font-bold truncate max-w-[46px]">
                    {occupant.name.split(' ')[0]}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* 100% FULL-SCREEN SINGLE-SPEAKER CINEMA THEATER (Portal + 100dvh + object-cover Edge-to-Edge) */}
      {isFullscreen && typeof document !== 'undefined' && createPortal((() => {
        const activeRemotePeer = fullscreenTargetId !== 'local'
          ? liveRemotePeers.find((p) => p.id === fullscreenTargetId) || liveRemotePeers[0]
          : undefined;
        const showingRemote = !!(fullscreenTargetId !== 'local' && activeRemotePeer);
        const nextSwapId = showingRemote ? 'local' : (liveRemotePeers[0]?.id || 'local');

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
              title="ከሙሉ ስክሪን ውጣ"
              className="absolute top-4 right-4 z-50 p-3 rounded-full bg-black/70 hover:bg-red-600 text-white backdrop-blur-md border border-white/25 transition-all cursor-pointer shadow-2xl group flex items-center justify-center"
            >
              <Minimize2 className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            </button>

            {/* Back Arrow Button (Top Left) */}
            <div className="absolute top-4 left-4 z-50 flex items-center gap-2">
              <button
                onClick={() => setIsFullscreen(false)}
                title="ተመለስ"
                className="p-3 rounded-full bg-black/70 hover:bg-slate-800 text-white backdrop-blur-md border border-white/25 transition-all cursor-pointer shadow-2xl flex items-center justify-center group"
              >
                <ArrowLeft className="w-5 h-5 text-amber-400 group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>

            {/* 100% Single Speaker Full Edge-to-Edge Stream (IMO-style zero black bars) */}
            <div className="w-full h-full relative overflow-hidden bg-black">
              {showingRemote && activeRemotePeer ? (
                activeRemotePeer.stream && activeRemotePeer.isVideoOn ? (
                  <EdgeToEdgeVideo
                    stream={activeRemotePeer.stream}
                    muted={false}
                    mirror={false}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 p-6">
                    <img
                      src={activeRemotePeer.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'}
                      alt={activeRemotePeer.name}
                      className={`w-44 h-44 rounded-full object-cover border-4 shadow-2xl ${
                        activeRemotePeer.isSpeaking ? 'border-emerald-400 ring-8 ring-emerald-400/40' : 'border-slate-700'
                      }`}
                    />
                  </div>
                )
              ) : isVideoOn && localStream ? (
                <EdgeToEdgeVideo
                  stream={localStream}
                  muted={true}
                  mirror={cameraFacing === 'user'}
                />
              ) : (
                <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center p-4 gap-4">
                  <img
                    src={membership.avatarUrl || currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'}
                    alt={currentUser?.fullName || membership.fullName}
                    className={`w-40 h-40 rounded-full object-cover border-4 shadow-2xl ${
                      isMicOn && isSpeaking ? 'border-amber-400 ring-8 ring-amber-400/40' : 'border-slate-700'
                    }`}
                  />
                  {isVideoOn && !localStream && (
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

            {/* Floating Minimal Glass Controller (Icon Only - Always Inside 100dvh Bottom) */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-50 bg-black/80 hover:bg-black/95 backdrop-blur-xl px-5 py-3 rounded-full border border-white/25 shadow-2xl flex items-center gap-3 transition-all">
              <button
                onClick={handleToggleMic}
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
                onClick={handleToggleVideo}
                title={isVideoOn ? 'ካሜራ አጥፋ' : 'ካሜራ አብራ'}
                className={`p-3.5 rounded-full transition-all cursor-pointer ${
                  isVideoOn
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5 text-red-400" />}
              </button>

              {onFlipCamera && (
                <button
                  onClick={onFlipCamera}
                  title="ካሜራ አዙር (የፊት / የኋላ)"
                  className="p-3.5 rounded-full bg-white/10 hover:bg-white/20 text-amber-400 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              )}

              {liveRemotePeers.length > 0 && (
                <button
                  onClick={() => setFullscreenTargetId(nextSwapId)}
                  title="ተናጋሪ ቀይር"
                  className="p-3.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-all cursor-pointer"
                >
                  <Users className="w-5 h-5" />
                </button>
              )}

              <button
                onClick={() => setIsFullscreen(false)}
                title="ከሙሉ ስክሪን ውጣ"
                className="p-3.5 rounded-full bg-red-600/90 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 transition-all cursor-pointer ml-1"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        );
      })(), document.body)}
    </div>
  );
};
