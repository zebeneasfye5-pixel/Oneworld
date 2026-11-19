import React, { useState, useEffect, lazy, Suspense } from 'react';
import { 
  Room, 
  RoomOccupant, 
  LiveSpeechMessage, 
  VirtualGift 
} from './types';
import { 
  INITIAL_ROOMS 
} from './data/initialData';
import { AppLanguage, TRANSLATIONS } from './i18n/translations';
import { Header } from './components/Header';
import { Navigation, MainNavigationTarget } from './components/Navigation';
import { MasterDrawer, HouseId } from './components/MasterDrawer';
import type { UserProfile } from './components/AuthModal';
import type { HouseMemberRecord } from './components/HouseStageMedia';
import { announceLanguageSwitch } from './services/speechService';
import { ENV_CONFIG, getApiUrl } from './config/env';
import { useScreenWakeLock } from './services/wakeLock';
import {
  loadSyncAuth,
  savePersistentAuth,
  restorePersistentAuthAsync,
  clearPersistentAuth
} from './services/authStorage';

// Lazy-loaded on-demand views & modals for ultra-fast initial page speed
const HouseStageMedia = lazy(() => import('./components/HouseStageMedia').then((m) => ({ default: m.HouseStageMedia })));
const BuilderVaultModal = lazy(() => import('./components/BuilderVaultModal').then((m) => ({ default: m.BuilderVaultModal })));
const AuthModal = lazy(() => import('./components/AuthModal').then((m) => ({ default: m.AuthModal })));
const FoundingCharterModal = lazy(() => import('./components/FoundingCharterModal').then((m) => ({ default: m.FoundingCharterModal })));
const HouseSelectorModal = lazy(() => import('./components/HouseSelectorModal').then((m) => ({ default: m.HouseSelectorModal })));
const RevenueFormulaModal = lazy(() => import('./components/RevenueFormulaModal').then((m) => ({ default: m.RevenueFormulaModal })));
const AdminAuditDashboard = lazy(() => import('./admin/AdminAuditDashboard').then((m) => ({ default: m.AdminAuditDashboard })));

// Primary Foreground Live Social Agora: House 1 (Rendered eagerly)
import { RoomStage } from './components/RoomStage';
import { useRealtimeRoom } from './services/realtimeMesh';

// Performance Architecture: React.lazy() for all 15 hidden specialized houses (h2-h16)
const HouseFamilyKinship = lazy(() => import('./components/houses/HouseFamilyKinship').then((m) => ({ default: m.HouseFamilyKinship })));
const HouseLeadership = lazy(() => import('./components/houses/HouseLeadership').then((m) => ({ default: m.HouseLeadership })));
const HouseConfidentialCourtship = lazy(() => import('./components/houses/HouseConfidentialCourtship').then((m) => ({ default: m.HouseConfidentialCourtship })));
const HouseVirtualWedding = lazy(() => import('./components/houses/HouseVirtualWedding').then((m) => ({ default: m.HouseVirtualWedding })));
const HouseFaith = lazy(() => import('./components/houses/HouseFaith').then((m) => ({ default: m.HouseFaith })));
const HouseSecurityChamber = lazy(() => import('./components/houses/HouseSecurityChamber').then((m) => ({ default: m.HouseSecurityChamber })));
const TalentShow = lazy(() => import('./components/TalentShow').then((m) => ({ default: m.TalentShow })));
const HouseMarketplaceExpo = lazy(() => import('./components/houses/HouseMarketplaceExpo').then((m) => ({ default: m.HouseMarketplaceExpo })));
const AIAcademy = lazy(() => import('./components/AIAcademy').then((m) => ({ default: m.AIAcademy })));
const HouseInstitutionalTraining = lazy(() => import('./components/houses/HouseInstitutionalTraining').then((m) => ({ default: m.HouseInstitutionalTraining })));
const HousePsychologyCounseling = lazy(() => import('./components/houses/HousePsychologyCounseling').then((m) => ({ default: m.HousePsychologyCounseling })));
const HouseBrokerageMatching = lazy(() => import('./components/houses/HouseBrokerageMatching').then((m) => ({ default: m.HouseBrokerageMatching })));
const HouseJudicialTribunal = lazy(() => import('./components/houses/HouseJudicialTribunal').then((m) => ({ default: m.HouseJudicialTribunal })));
const HouseUtilityPayments = lazy(() => import('./components/houses/HouseUtilityPayments').then((m) => ({ default: m.HouseUtilityPayments })));
const HouseTourismHeritage = lazy(() => import('./components/houses/HouseTourismHeritage').then((m) => ({ default: m.HouseTourismHeritage })));

// Auxiliary views lazy-loaded on demand
const GamesArena = lazy(() => import('./components/GamesArena').then((m) => ({ default: m.GamesArena })));
const EqubAndLottery = lazy(() => import('./components/EqubAndLottery').then((m) => ({ default: m.EqubAndLottery })));
const BankingWallet = lazy(() => import('./components/BankingWallet').then((m) => ({ default: m.BankingWallet })));

const safeConfetti = (opts?: any) => {
  import('canvas-confetti')
    .then((m) => m.default?.(opts))
    .catch(() => {
      // safe fallback on constrained mobile devices
    });
};

const getHouseMeta = (houseKey: string, lang: AppLanguage) => {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.am;
  const house = (dict.houses as any)[houseKey];
  if (house) {
    return {
      title: house.title,
      desc: house.desc,
      roles: house.roles || ['Member', 'Leader']
    };
  }
  return {
    title: `House ${houseKey}`,
    desc: '',
    roles: ['Member']
  };
};

export default function App() {
  const [currentLang, setCurrentLang] = useState<AppLanguage>('am');
  const [activeTarget, setActiveTarget] = useState<MainNavigationTarget>('h1');
  const houseMeta = (id: string) => getHouseMeta(id, currentLang);

  // Modals state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isBuilderVaultOpen, setIsBuilderVaultOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCharterOpen, setIsCharterOpen] = useState(false);
  const [isHouseHubOpen, setIsHouseHubOpen] = useState(false);
  const [isRevenueFormulaOpen, setIsRevenueFormulaOpen] = useState(false);
  const [isAdminAuditOpen, setIsAdminAuditOpen] = useState(false);

  // PWA Install State
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(true);

  // House Memberships Registry (Ensures each house requires distinct registration)
  const [houseMemberships, setHouseMemberships] = useState<Record<string, HouseMemberRecord>>(() => {
    try {
      const saved = localStorage.getItem('oneworld_house_memberships');
      if (saved) return JSON.parse(saved);
    } catch {
      // safe fallback
    }
    return {};
  });

  const handleRegisterHouseMember = (record: HouseMemberRecord) => {
    setHouseMemberships((prev) => {
      const updated = { ...prev, [record.houseId]: record };
      try {
        localStorage.setItem('oneworld_house_memberships', JSON.stringify(updated));
      } catch {
        // safe fallback
      }
      return updated;
    });
    fetch(getApiUrl(`/api/houses/${encodeURIComponent(record.houseId)}/register`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    }).catch(() => {});
  };

  // Listen for beforeinstallprompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // 100% Offline Autonomy & Network State Synchronization
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast('🟢 ኢንተርኔት ተመልሷል - መስመር ላይ ነዎት (Online)');
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast('⚡ ኢንተርኔት የለም - ሙሉ በሙሉ ከመስመር ውጭ (100% Offline Mode) በመስራት ላይ ነዎት');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallPwa = async () => {
    if (!deferredInstallPrompt) {
      showToast('መተግበሪያውን ወደ ስልክዎ ለመጫን በብራውዘርዎ የ"Add to Home Screen" አማራጭ ይጠቀሙ።');
      return;
    }
    try {
      deferredInstallPrompt.prompt();
      const { outcome } = await deferredInstallPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstallable(false);
        setDeferredInstallPrompt(null);
        safeConfetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
        showToast('Oneworld በስልክዎ ላይ በተሳካ ሁኔታ ተጭኗል!');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // Prevent mobile phone screen from dimming or sleeping while Oneworld is open
  useScreenWakeLock(true);

  // Persistent Authenticated Session: never re-asks password unless user explicitly logs out
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => loadSyncAuth());
  const [isRestoringSession, setIsRestoringSession] = useState<boolean>(() => !loadSyncAuth());

  useEffect(() => {
    if (currentUser) {
      setIsRestoringSession(false);
      return;
    }
    let cancelled = false;
    restorePersistentAuthAsync()
      .then((restored) => {
        if (!cancelled && restored) {
          setCurrentUser(restored);
        }
      })
      .finally(() => {
        if (!cancelled) setIsRestoringSession(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Financial Balances with 100% Offline LocalStorage Persistence (Zero fake pre-loaded numbers)
  const [balanceETB, setBalanceETB] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('oneworld_balance_etb');
      return saved ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });
  const [balanceUSD, setBalanceUSD] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('oneworld_balance_usd');
      return saved ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });
  const [royaltyPoints, setRoyaltyPoints] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('oneworld_royalty_points');
      return saved ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });
  const [builderReserveETB, setBuilderReserveETB] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('oneworld_builder_reserve');
      return saved ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });

  // Save balances automatically to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('oneworld_balance_etb', balanceETB.toString());
      localStorage.setItem('oneworld_balance_usd', balanceUSD.toString());
      localStorage.setItem('oneworld_royalty_points', royaltyPoints.toString());
      localStorage.setItem('oneworld_builder_reserve', builderReserveETB.toString());
    } catch {}
  }, [balanceETB, balanceUSD, royaltyPoints, builderReserveETB]);

  // Virtual Rooms & Live Messages State (Zero fake messages)
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [currentRoom, setCurrentRoom] = useState<Room>(INITIAL_ROOMS[0]);
  const [messages, setMessages] = useState<LiveSpeechMessage[]>([]);

  // Fetch server-persisted custom rooms on startup
  useEffect(() => {
    fetch(getApiUrl('/api/rooms'))
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.rooms && Array.isArray(data.rooms) && data.rooms.length > 0) {
          setRooms((prev) => {
            const seen = new Set(prev.map((r) => r.id));
            const newRooms = data.rooms.filter((r: Room) => r?.id && !seen.has(r.id));
            return newRooms.length > 0 ? [...newRooms, ...prev] : prev;
          });
        }
      })
      .catch(() => {});
  }, []);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const recordAuditTransaction = (source: string, grossETB: number, gateway = 'Oneworld Ledger') => {
    if (!grossETB || grossETB <= 0) return;
    fetch(getApiUrl('/api/audit/transaction'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source, gateway, grossETB })
    }).catch(() => {});
  };

  const activeRealtimeRoomId =
    activeTarget === 'h1'
      ? currentRoom?.id && currentRoom.id !== 'room-1'
        ? currentRoom.id
        : 'h1'
      : activeTarget.startsWith('h')
      ? activeTarget
      : 'h1';

  // Live Multi-User WebRTC & WebSocket Mesh Connection
  const realtime = useRealtimeRoom({
    roomId: activeRealtimeRoomId,
    enabled: !!currentUser,
    currentUser: {
      id: currentUser?.idNumber || 'pending-auth',
      fullName: currentUser?.fullName || 'ተጠቃሚ',
      avatarUrl: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
      roleTitle: currentUser?.roleTitle || 'የማህበረሰብ አባል',
      nationality: currentUser?.nationality || 'ኢትዮጵያ'
    },
    onMessageReceived: (msg) => {
      setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
    },
    onMessageUpdated: (messageId, translations) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, translations: { ...m.translations, ...translations } }
            : m
        )
      );
    },
    onRoomHistory: (_rid, historyMsgs) => {
      setMessages(historyMsgs || []);
    },
    onRoomCreated: (newRoom) => {
      setRooms((prev) => (prev.some((r) => r.id === newRoom.id) ? prev : [newRoom, ...prev]));
    },
    onGiftReceived: (gift, senderName) => {
      showToast(`🎁 ${gift.nameAm} ከ ${senderName} ተልኮልዎታል!`);
      safeConfetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    },
    onSeatDenied: (takenSeat, occupiedBy) => {
      showToast(`⚠️ ወንበር ${takenSeat} በ ${occupiedBy} ተይዟል! እባክዎ ሌላ ክፍት ወንበር ይምረጡ።`);
    }
  });

  // Synchronized Language Change (Switches both UI text and Voice Audio)
  const handleLanguageChange = (lang: AppLanguage) => {
    setCurrentLang(lang);
    announceLanguageSwitch(lang);
    const langNames: Record<AppLanguage, string> = {
      am: 'አማርኛ (Amharic)',
      om: 'Afaan Oromoo',
      ti: 'ትግርኛ (Tigrinya)',
      en: 'English',
      fr: 'Français (French)',
      zh: '中文 (Chinese)',
      ar: 'العربية (Arabic)',
      de: 'Deutsch (German)'
    };
    showToast(`🌐 ቋንቋ / Language: ${langNames[lang] || lang}`);

    // Synchronize HTML dir attribute for RTL support (Arabic)
    if (typeof document !== 'undefined') {
      if (lang === 'ar') {
        document.documentElement.setAttribute('dir', 'rtl');
        document.documentElement.setAttribute('lang', 'ar');
      } else {
        document.documentElement.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('lang', lang);
      }
    }
  };

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.am;

  // House 1 & Unified Seat Actions
  const handleClaimSeat = (seatNumber: number) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      showToast('እባክዎ ወንበር ከመያዝዎ በፊት መጀመሪያ ወደ መለያዎ ይግቡ ወይም ይመዝገቡ!');
      return;
    }
    const claimed = realtime.claimSeatRealtime(seatNumber);
    if (claimed) {
      showToast(`${t.chairs.seatPrefix}${seatNumber}: ${t.announcements.seatClaimed}`);
    }
  };

  const handleLeaveSeat = () => {
    realtime.leaveSeatRealtime();
    showToast(t.announcements.seatLeft);
  };

  const handleSendMessage = (msg: LiveSpeechMessage) => {
    setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
    realtime.sendRealtimeMessage(msg);
  };

  const handleTranslationComplete = (messageId: string, translations: Record<string, string>) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId
          ? { ...m, translations: { ...m.translations, ...translations } }
          : m
      )
    );
    realtime.broadcastTranslationUpdate(messageId, translations);
  };

  const handleSendGift = (gift: VirtualGift, recipient: RoomOccupant) => {
    if (balanceETB < gift.priceETB) {
      showToast(`⚠️ ${t.announcements.insufficientFunds}`);
      return;
    }
    setBalanceETB((prev) => prev - gift.priceETB);
    const builderCut = Math.round(gift.priceETB * 0.10);
    setBuilderReserveETB((prev) => prev + builderCut);
    realtime.sendGiftRealtime(gift, recipient.id);
    recordAuditTransaction(`Virtual Gift -> ${recipient.name}`, gift.priceETB, 'Oneworld Gifts');
    showToast(`${gift.icon} ${gift.nameAm} -> ${recipient.name} (${t.announcements.giftSent})`);
    safeConfetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  const handleCreatePersonalRoom = (newRoom: Room) => {
    setRooms((prev) => (prev.some((r) => r.id === newRoom.id) ? prev : [newRoom, ...prev]));
    setCurrentRoom(newRoom);
    realtime.claimSeatRealtime(1);
    fetch(getApiUrl('/api/rooms'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRoom)
    }).catch(() => {});
    showToast(`"${newRoom.titleAm}" አዳራሽ ተከፍቷል!`);
  };

  // General Financial Handlers (Formula: 80% Member, 10% Bank, 10% Founder ዘበነ አስፍዬ)
  const handleDeposit = (amount: number, bankName: string) => {
    setBalanceETB((prev) => prev + amount);
    const devCut = Math.round(amount * 0.10);
    setBuilderReserveETB((prev) => prev + devCut);
    recordAuditTransaction(`Deposit via ${bankName}`, amount, bankName);
    showToast(`የ${amount.toLocaleString()} ብር ገቢ በ${bankName} ተፈፅሟል!`);
  };

  const handleWithdraw = (amount: number, bankName: string): boolean => {
    if (balanceETB < amount) {
      showToast(`⚠️ ይቅርታ፣ በቂ ሂሳብ የለዎትም። የሂሳብዎ ቀሪ፡ ${balanceETB.toLocaleString()} ብር ነው`);
      return false;
    }
    setBalanceETB((prev) => prev - amount);
    const devCut = Math.round(amount * 0.10);
    setBuilderReserveETB((prev) => prev + devCut);
    recordAuditTransaction(`Withdraw to ${bankName}`, amount, bankName);
    showToast(`የ${amount.toLocaleString()} ብር ወጪ ወደ ${bankName} ተላልፏል!`);
    return true;
  };

  const handleDeductBalance = (amount: number, reason: string): boolean => {
    if (balanceETB < amount) {
      showToast('⚠️ ይቅርታ፣ በቂ ሂሳብ የለዎትም።');
      return false;
    }
    setBalanceETB((prev) => prev - amount);
    const devCut = Math.round(amount * 0.10);
    setBuilderReserveETB((prev) => prev + devCut);
    recordAuditTransaction(reason, amount, 'Oneworld Wallet');
    showToast(`${amount.toLocaleString()} ብር ተከፍሏል (${reason})`);
    return true;
  };

  const handleSaveProfile = (profile: UserProfile, sessionToken?: string) => {
    const wasEditing = !!(currentUser && !currentUser.isGuest && currentUser.idNumber === profile.idNumber);
    const updated = { ...profile, isGuest: false };
    setCurrentUser(updated);
    savePersistentAuth(updated, sessionToken);
    showToast(
      wasEditing
        ? `✅ ፕሮፋይልዎ (${profile.fullName}) በተሳካ ሁኔታ ተስተካክሏል!`
        : `🎉 እንኳን ደህና መጡ ${profile.fullName}! መለያዎ ጸድቋል`
    );
  };

  const handleLogout = () => {
    clearPersistentAuth();
    setCurrentUser(null);
    setHouseMemberships({});
    setIsAuthOpen(true);
    showToast('ከመለያዎ በተሳካ ሁኔታ ወጥተዋል (Logged Out)። በድጋሚ ለመግባት ፓስዋርድዎን ያስገቡ።');
  };

  const handleCreditBalance = (amount: number, reason: string) => {
    const memberShare = Math.round(amount * 0.80); // 80% to member
    const devCut = Math.round(amount * 0.10);      // 10% to builder ዘበነ አስፍዬ
    setBalanceETB((prev) => prev + memberShare);
    setBuilderReserveETB((prev) => prev + devCut);
    showToast(`+${memberShare.toLocaleString()} ብር ገቢ ተደርጓል (የ80% አባል ድርሻ - ${reason})`);
  };

  const handleAddRoyalty = (points: number, reason: string) => {
    setRoyaltyPoints((prev) => prev + points);
    const bonusETB = Math.round(points * 0.80); // 80% to member
    setBalanceETB((prev) => prev + bonusETB);
    const devCut = Math.round(bonusETB * 0.10); // 10% to builder ዘበነ አስፍዬ
    setBuilderReserveETB((prev) => prev + devCut);
    showToast(`+${points} የእንቅስቃሴ ነጥብና +${bonusETB} ብር ሮያሊቲ አግኝተዋል! (${reason})`);
  };

  const handleConvertRoyalties = (points: number) => {
    if (royaltyPoints < points) return;
    setRoyaltyPoints((prev) => prev - points);
    setBalanceETB((prev) => prev + points);
    showToast(`${points} የሮያሊቲ ነጥብ ወደ ${points} ብር ተቀይሯል!`);
    safeConfetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
  };

  const handleDisburseToCBE = (amount: number) => {
    setBuilderReserveETB(0);
    showToast(`የ${amount.toLocaleString()} ብር ክፍያ ወደ CBE አካውንት ${ENV_CONFIG.CBE_ACCOUNT_NUMBER} (${ENV_CONFIG.FOUNDER_NAME_AM}) ተላልፏል!`);
  };

  return (
    <div className="min-h-screen bg-[#0c0f17] text-white flex flex-col font-sans font-extrabold selection:bg-amber-500 selection:text-slate-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 p-3.5 sm:p-4 bg-emerald-950/95 border border-emerald-500/60 text-emerald-200 text-xs font-bold rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-2 animate-bounce">
          <span className="flex-shrink-0">✨</span>
          <span className="break-words">{toastMessage}</span>
        </div>
      )}

      {/* Offline Mode Active Banner */}
      {!isOnline && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 font-black text-xs py-2 px-4 text-center flex items-center justify-center gap-2 shadow-lg z-50">
          <span>⚡</span>
          <span>ኢንተርኔት የለም — መተግበሪያው ሙሉ በሙሉ ከመስመር ውጭ (100% Offline Mode) ያለገደብ በመስራት ላይ ነው</span>
        </div>
      )}

      {/* Global Top Header with 3-bar hamburger & 8 languages */}
      <Header
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        balanceETB={balanceETB}
        balanceUSD={balanceUSD}
        royaltyPoints={royaltyPoints}
        onlineCount={realtime.onlineCount}
        onOpenWallet={() => setActiveTarget('bank')}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenBuilderVault={() => setIsBuilderVaultOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        user={currentUser}
        onInstallPwa={handleInstallPwa}
        isInstallable={isInstallable}
      />

      {/* Quick Navigation Ribbon */}
      <Navigation
        activeTarget={activeTarget}
        onSelectTarget={setActiveTarget}
        currentLang={currentLang}
        onOpenHouseHub={() => setIsHouseHubOpen(true)}
        onOpenCharter={() => setIsCharterOpen(true)}
        onOpenRevenueFormula={() => setIsRevenueFormulaOpen(true)}
      />

      {/* Master Left-Side 3-Bar Drawer */}
      <MasterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeHouse={activeTarget.startsWith('h') ? (activeTarget as HouseId) : 'h1'}
        onSelectHouse={(hId) => setActiveTarget(hId)}
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        user={currentUser}
        balanceETB={balanceETB}
        balanceUSD={balanceUSD}
        royaltyPoints={royaltyPoints}
        onOpenWallet={() => {
          setIsDrawerOpen(false);
          setActiveTarget('bank');
        }}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenBuilderVault={() => setIsBuilderVaultOpen(true)}
        onOpenCharter={() => setIsCharterOpen(true)}
        onOpenAdminAudit={() => setIsAdminAuditOpen(true)}
        onInstallPwa={handleInstallPwa}
        isInstallable={isInstallable}
        onLogout={handleLogout}
      />

      {/* Lazy-Loaded Auxiliary Modals (Loaded only when opened for zero initial overhead) */}
      <Suspense fallback={null}>
        {/* 16 Houses Hub Modal (Collapsed selector for all 16 houses) */}
        {isHouseHubOpen && (
          <HouseSelectorModal
            isOpen={isHouseHubOpen}
            onClose={() => setIsHouseHubOpen(false)}
            activeHouse={activeTarget.startsWith('h') ? (activeTarget as HouseId) : 'h1'}
            onSelectHouse={(hId) => setActiveTarget(hId)}
            currentLang={currentLang}
          />
        )}

        {/* Revenue Formula Modal (80% Member · 10% Bank · 10% Founder Zebene Asfye) */}
        {isRevenueFormulaOpen && (
          <RevenueFormulaModal
            isOpen={isRevenueFormulaOpen}
            onClose={() => setIsRevenueFormulaOpen(false)}
            currentLang={currentLang}
          />
        )}

        {/* Builder Sovereign Vault Modal (Direct Access, Founder: ዘበነ አስፍዬ - Zebene Asfye) */}
        {isBuilderVaultOpen && (
          <BuilderVaultModal
            isOpen={isBuilderVaultOpen}
            onClose={() => setIsBuilderVaultOpen(false)}
            builderReserveETB={builderReserveETB}
            onDisburseToCBE={handleDisburseToCBE}
          />
        )}

        {/* Persistent Authentication Gate: only prompts if unauthenticated and restoration check completed */}
        {((!currentUser && !isRestoringSession) || isAuthOpen) && (
          <AuthModal
            isOpen={(!currentUser && !isRestoringSession) || isAuthOpen}
            onClose={() => {
              if (currentUser) setIsAuthOpen(false);
            }}
            currentUser={currentUser}
            onSaveProfile={handleSaveProfile}
            onLogout={handleLogout}
            canDismiss={!!currentUser}
          />
        )}

        {/* Founding Charter Modal */}
        {isCharterOpen && (
          <FoundingCharterModal
            isOpen={isCharterOpen}
            onClose={() => setIsCharterOpen(false)}
            currentLang={currentLang}
          />
        )}

        {/* Admin Audit & Operations Dashboard */}
        {isAdminAuditOpen && (
          <AdminAuditDashboard
            isOpen={isAdminAuditOpen}
            onClose={() => setIsAdminAuditOpen(false)}
          />
        )}
      </Suspense>

      {/* Main Content Dashboard */}
      <main className="flex-1 pb-16 pt-2">
        <Suspense fallback={
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin shadow-lg" />
            <p className="text-sm font-bold text-amber-400">የሉዓላዊ ቤቱ ይዘት በመጫን ላይ (Loading House View)...</p>
          </div>
        }>
        {/* House 1: የሁሉም የጋራ ቤት */}
        {activeTarget === 'h1' && (
          <RoomStage
            rooms={rooms}
            currentRoom={currentRoom}
            onSelectRoom={setCurrentRoom}
            userLang={currentLang as any}
            userBalanceETB={balanceETB}
            currentUser={currentUser}
            occupants={realtime.combinedOccupants}
            messages={messages}
            remotePeers={realtime.remotePeers}
            localStream={realtime.localStream}
            isMicMuted={realtime.isMicMuted}
            isVideoOff={realtime.isVideoOff}
            isSpeaking={realtime.isSpeaking}
            cameraFacing={realtime.cameraFacing}
            cameraError={realtime.cameraError}
            onToggleMic={realtime.toggleMic}
            onToggleVideo={realtime.toggleVideo}
            onFlipCamera={realtime.flipCamera}
            onRetryCamera={() => realtime.acquireMedia(realtime.cameraFacing)}
            onTranslationComplete={handleTranslationComplete}
            onSendMessage={handleSendMessage}
            onSendGift={handleSendGift}
            onCreatePersonalRoom={handleCreatePersonalRoom}
            onClaimSeat={handleClaimSeat}
            onLeaveSeat={handleLeaveSeat}
            userSeatedNumber={realtime.seatNumber}
            onAddRoyalty={handleAddRoyalty}
          />
        )}

        {/* Houses 2 to 16: Live WebRTC Media Stage, Membership Gate & Specialized Content */}
        {(['h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8', 'h9', 'h10', 'h11', 'h12', 'h13', 'h14', 'h15', 'h16'] as const).includes(activeTarget as any) && (
          <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-6">
            <HouseStageMedia
              houseId={activeTarget}
              houseTitle={houseMeta(activeTarget).title}
              houseDescription={houseMeta(activeTarget).desc}
              houseRoleOptions={houseMeta(activeTarget).roles}
              currentUser={currentUser}
              currentLang={currentLang}
              houseMemberships={houseMemberships}
              onRegisterHouseMember={handleRegisterHouseMember}
              onShowToast={showToast}
              onGoBack={() => setActiveTarget('h1')}
              localStream={realtime.localStream}
              remotePeers={realtime.remotePeers}
              isMicMuted={realtime.isMicMuted}
              isVideoOff={realtime.isVideoOff}
              isSpeaking={realtime.isSpeaking}
              cameraFacing={realtime.cameraFacing}
              cameraError={realtime.cameraError}
              onToggleMic={realtime.toggleMic}
              onToggleVideo={realtime.toggleVideo}
              onFlipCamera={realtime.flipCamera}
              onRetryCamera={() => realtime.acquireMedia(realtime.cameraFacing)}
              userSeat={realtime.seatNumber}
              onClaimSeat={handleClaimSeat}
              onLeaveSeat={handleLeaveSeat}
            />
            {houseMemberships[activeTarget] && (
              <>
                {activeTarget === 'h2' && <HouseFamilyKinship />}
                {activeTarget === 'h3' && <HouseLeadership />}
                {activeTarget === 'h4' && <HouseConfidentialCourtship />}
                {activeTarget === 'h5' && <HouseVirtualWedding />}
                {activeTarget === 'h6' && <HouseFaith />}
                {activeTarget === 'h7' && <HouseSecurityChamber />}
                {activeTarget === 'h8' && <TalentShow onEarnRoyalty={handleAddRoyalty} />}
                {activeTarget === 'h9' && (
                  <HouseMarketplaceExpo userBalanceETB={balanceETB} onPurchase={handleDeductBalance} />
                )}
                {activeTarget === 'h10' && (
                  <AIAcademy userLang={currentLang as any} onEarnRoyalty={handleAddRoyalty} />
                )}
                {activeTarget === 'h11' && <HouseInstitutionalTraining />}
                {activeTarget === 'h12' && <HousePsychologyCounseling />}
                {activeTarget === 'h13' && <HouseBrokerageMatching />}
                {activeTarget === 'h14' && <HouseJudicialTribunal />}
                {activeTarget === 'h15' && (
                  <HouseUtilityPayments userBalanceETB={balanceETB} onPayBill={handleDeductBalance} />
                )}
                {activeTarget === 'h16' && <HouseTourismHeritage currentLang={currentLang} />}
              </>
            )}
          </div>
        )}

        {/* Aux Modules */}
        {activeTarget === 'equb' && (
          <EqubAndLottery
            userBalanceETB={balanceETB}
            onDeductBalance={handleDeductBalance}
            onCreditBalance={handleCreditBalance}
          />
        )}

        {activeTarget === 'games' && (
          <GamesArena
            currentLang={currentLang}
            onEarnPrize={(prize, gameTitle) => handleCreditBalance(prize, gameTitle)}
          />
        )}

        {activeTarget === 'bank' && (
          <BankingWallet
            balanceETB={balanceETB}
            balanceUSD={balanceUSD}
            royaltyPoints={royaltyPoints}
            onDeposit={handleDeposit}
            onWithdraw={handleWithdraw}
            onConvertRoyalties={handleConvertRoyalties}
          />
        )}
        </Suspense>
      </main>

      {/* Platform Sovereign Footer strictly branded Oneworld */}
      <footer className="bg-[#090c13] border-t border-slate-800/80 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400 font-medium">
            <span>Oneworld · መስራች፡ ዘበነ አስፍዬ (Zebene Asfye)</span>
            <span>·</span>
            <span>16ቱ ዋና ዋና ቤቶች (16 Sovereign Houses)</span>
            <span>·</span>
            <span>ሉዓላዊ ካዝና እና አለም አቀፍ የክፍያ ጥበቃ</span>
          </div>
          <p className="text-[11px] text-slate-600">
            የአለማችን ህዝቦች በሁለንተናዊ መልካም አስተሳሰብ፣ በቴክኖሎጂ እውቀት፣ በስጋ ዝምድና፣ በሰርግ ውል፣ በፍትህና በጋራ ልማት ተሳስረው የሚኖሩበት አለም አቀፍ ሉዓላዊ አጎራ።
          </p>
        </div>
      </footer>
    </div>
  );
}
