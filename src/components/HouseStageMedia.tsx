import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Users, 
  Sparkles,
  Radio,
  UserPlus
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

  // Selected Role for Registration
  const [selectedRole, setSelectedRole] = useState(houseRoleOptions[0] || 'Member');
  const [hasAgreedToBylaws, setHasAgreedToBylaws] = useState(true);

  // Update selected role if role options change due to language switch
  useEffect(() => {
    if (houseRoleOptions && houseRoleOptions.length > 0) {
      setSelectedRole(houseRoleOptions[0]);
    }
  }, [currentLang, houseRoleOptions]);

  // Live Media State
  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [userSeat, setUserSeat] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Default Mock Seated Participants for this House
  const [participants] = useState<SeatedParticipant[]>(() => [
    {
      seatNumber: 1,
      name: 'ዶ/ር ተስፋዬ መንግስቱ',
      role: houseRoleOptions[0] || 'Leader',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      isMicOn: false,
      isVideoOn: true,
      isSpeaking: false,
      countryFlag: '🇪🇹'
    },
    {
      seatNumber: 2,
      name: 'ወ/ሮ ራሔል ሰለሞን',
      role: houseRoleOptions[1] || 'Coordinator',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      isMicOn: true,
      isVideoOn: true,
      isSpeaking: true,
      countryFlag: '🇪🇹'
    },
    {
      seatNumber: 3,
      name: 'ኢንጂነር ዳንኤል ከበደ',
      role: houseRoleOptions[2] || 'Advisor',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      isMicOn: false,
      isVideoOn: true,
      isSpeaking: false,
      countryFlag: '🇺🇸'
    }
  ]);

  // Handle Webcam streaming safely
  useEffect(() => {
    let active = true;

    async function setupCamera() {
      if (isVideoOn && userSeat !== null) {
        try {
          if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const stream = await navigator.mediaDevices.getUserMedia({
              video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
              audio: true
            });
            if (active) {
              mediaStreamRef.current = stream;
              if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play().catch(() => {});
              }
            }
          }
        } catch {
          // Fallback to avatar if camera permission is denied or absent
        }
      } else {
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
          mediaStreamRef.current = null;
        }
      }
    }

    setupCamera();

    return () => {
      active = false;
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isVideoOn, userSeat]);

  // Voice toggle
  const toggleMic = () => {
    if (!membership) {
      onShowToast(t.stageMedia.regRequired);
      return;
    }
    const nextMic = !isMicOn;
    setIsMicOn(nextMic);
    onShowToast(nextMic ? `🎙️ ${t.stageMedia.micOn}` : `🔇 ${t.stageMedia.micOff}`);
    if (nextMic) {
      speakText(t.stageMedia.speaking, currentLang as any);
    }
  };

  // Video toggle
  const toggleVideo = () => {
    if (!membership) {
      onShowToast(t.stageMedia.regRequired);
      return;
    }
    setIsVideoOn((prev) => !prev);
    onShowToast(!isVideoOn ? `📹 ${t.stageMedia.camOff}` : t.stageMedia.camOn);
  };

  // Claim Seat
  const handleClaimSeat = (seatNo: number) => {
    if (!membership) {
      onShowToast(t.stageMedia.regRequired);
      return;
    }
    setUserSeat(seatNo);
    setIsVideoOn(true);
    setIsMicOn(true);
    onShowToast(`${t.chairs.seatPrefix}${seatNo}: ${t.stageMedia.takeSeat}`);
  };

  // Leave Seat
  const handleLeaveSeat = () => {
    setUserSeat(null);
    setIsMicOn(false);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((trk) => trk.stop());
      mediaStreamRef.current = null;
    }
    onShowToast(t.stageMedia.leaveSeat);
  };

  // Handle House Registration
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasAgreedToBylaws) return;

    const record: HouseMemberRecord = {
      houseId,
      memberId: `OW-${houseId.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: currentUser.fullName,
      avatarUrl: currentUser.avatarUrl,
      roleInHouse: selectedRole,
      registeredDate: '2026-10-26',
      seatNumber: 1
    };

    onRegisterHouseMember(record);
    setUserSeat(1);
    setIsVideoOn(true);
    setIsMicOn(true);
    onShowToast(`🎉 ${houseTitle} · ${t.stageMedia.registerBtn}`);
  };

  // 1. If user is NOT a member of this specific house, show House Registration Gate
  if (!membership) {
    return (
      <div className="bg-gradient-to-br from-[#111625] to-[#0c0f17] border border-amber-500/30 rounded-3xl p-6 md:p-8 shadow-2xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-xl mx-auto text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/10">
            🏛️
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-amber-400 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
              {t.stageMedia.regRequired}
            </span>
            <h2 className="text-xl md:text-2xl font-black text-white mt-2">
              {t.stageMedia.joinPromptPrefix} {houseTitle} {t.stageMedia.joinPromptSuffix}
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              {houseDescription} · {t.stageMedia.gateDesc}
            </p>
          </div>

          <form onSubmit={handleRegister} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-left space-y-4 shadow-xl">
            {/* User Profile Summary */}
            <div className="flex items-center gap-3 p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.fullName}
                className="w-12 h-12 rounded-full object-cover border-2 border-amber-500"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{currentUser.fullName}</p>
                <p className="text-[11px] text-slate-400 truncate">{currentUser.phoneNumber} · {currentUser.nationality}</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Oneworld
              </span>
            </div>

            {/* Select Role for this House */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {t.stageMedia.selectRole} *
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer font-medium"
              >
                {houseRoleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* House Bylaws Consent */}
            <label className="flex items-start gap-2.5 cursor-pointer">
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!hasAgreedToBylaws}
              className="w-full py-3 bg-gradient-to-r from-amber-500 via-emerald-600 to-indigo-600 hover:opacity-95 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-amber-500/20 cursor-pointer transition flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t.stageMedia.registerBtn}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. User IS a registered member of this house: Render full Zoom Meeting stage and Chairs!
  return (
    <div className="bg-[#0f1422] border border-slate-800 rounded-3xl p-4 md:p-6 shadow-2xl mb-8 space-y-6">
      {/* House Stage Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xl">
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
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              ID: <span className="text-amber-400 font-mono font-bold">{membership.memberId}</span> · {membership.roleInHouse}
            </p>
          </div>
        </div>

        {/* Media Controls Toolbar */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMic}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-md ${
              isMicOn
                ? 'bg-emerald-600 text-white shadow-emerald-600/30 ring-2 ring-emerald-400/50'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4 text-red-400" />}
            <span>{isMicOn ? t.stageMedia.micOn : t.stageMedia.micOff}</span>
          </button>

          <button
            onClick={toggleVideo}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-md ${
              isVideoOn
                ? 'bg-indigo-600 text-white shadow-indigo-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4 text-red-400" />}
            <span>{isVideoOn ? t.stageMedia.camOn : t.stageMedia.camOff}</span>
          </button>

          {userSeat !== null && (
            <button
              onClick={handleLeaveSeat}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30"
            >
              {t.stageMedia.leaveSeat}
            </button>
          )}
        </div>
      </div>

      {/* Zoom-Style Video Grid Stage */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* User's Own Video Tile (If Seated) */}
        {userSeat !== null && (
          <div className="relative rounded-2xl bg-slate-950 border-2 border-emerald-500 overflow-hidden aspect-video flex items-center justify-center shadow-lg group">
            {isVideoOn ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-3 text-center">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.fullName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-emerald-400 mb-2"
                />
                <span className="text-xs font-bold text-white">{currentUser.fullName}</span>
              </div>
            )}

            {/* Video Overlay Tags */}
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] text-white font-mono">
              <span>#{userSeat} ({t.stageMedia.yourSeat})</span>
            </div>

            <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-white max-w-[85%]">
              <span className="truncate">{currentUser.fullName}</span>
              <span className="text-[10px] text-emerald-400">🇪🇹</span>
            </div>

            <div className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/60 backdrop-blur-md">
              {isMicOn ? (
                <Mic className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              ) : (
                <MicOff className="w-3.5 h-3.5 text-rose-400" />
              )}
            </div>
          </div>
        )}

        {/* Other Seated Participants' Video Tiles */}
        {participants.map((p) => (
          <div
            key={p.seatNumber}
            className={`relative rounded-2xl bg-slate-950 border overflow-hidden aspect-video flex items-center justify-center shadow-md transition ${
              p.isSpeaking ? 'border-emerald-500 ring-2 ring-emerald-500/40' : 'border-slate-800'
            }`}
          >
            <img
              src={p.avatar}
              alt={p.name}
              className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition duration-500"
            />
            
            {/* Top Seat Tag */}
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] text-slate-300 font-mono">
              <span>#{p.seatNumber}</span>
            </div>

            {/* Bottom Name & Role */}
            <div className="absolute bottom-2 left-2 flex flex-col bg-black/75 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-semibold text-white max-w-[85%] leading-tight">
              <div className="flex items-center gap-1">
                <span className="truncate">{p.name}</span>
                <span>{p.countryFlag}</span>
              </div>
              <span className="text-[9px] text-slate-400">{p.role}</span>
            </div>

            {/* Mic indicator */}
            <div className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/60 backdrop-blur-md">
              {p.isMicOn ? (
                <Mic className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <MicOff className="w-3.5 h-3.5 text-slate-500" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Unlimited Interactive Chairs Grid */}
      <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white">
              {t.stageMedia.seatsTitle}
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            {t.stageMedia.gateDesc}
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2 max-h-36 overflow-y-auto pr-1">
          {Array.from({ length: 24 }).map((_, idx) => {
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
                className={`py-2 px-1.5 rounded-xl border flex flex-col items-center justify-center transition active:scale-95 text-center cursor-pointer ${
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
