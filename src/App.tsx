import React, { useState, useEffect } from 'react';
import { 
  Room, 
  RoomOccupant, 
  LiveSpeechMessage, 
  VirtualGift 
} from './types';
import { 
  INITIAL_ROOMS, 
  INITIAL_OCCUPANTS, 
  INITIAL_SPEECH_MESSAGES 
} from './data/initialData';
import { AppLanguage, TRANSLATIONS } from './i18n/translations';
import { Header } from './components/Header';
import { Navigation, MainNavigationTarget } from './components/Navigation';
import { MasterDrawer, HouseId } from './components/MasterDrawer';
import { BuilderVaultModal } from './components/BuilderVaultModal';
import { AuthModal, UserProfile } from './components/AuthModal';
import { FoundingCharterModal } from './components/FoundingCharterModal';
import { InstallAppBanner } from './components/InstallAppBanner';
import { HouseStageMedia, HouseMemberRecord } from './components/HouseStageMedia';
import { announceLanguageSwitch } from './services/speechService';

// House Views
import { RoomStage } from './components/RoomStage';
import { HouseFamilyKinship } from './components/houses/HouseFamilyKinship';
import { HouseLeadership } from './components/houses/HouseLeadership';
import { HouseConfidentialCourtship } from './components/houses/HouseConfidentialCourtship';
import { HouseVirtualWedding } from './components/houses/HouseVirtualWedding';
import { HouseFaith } from './components/houses/HouseFaith';
import { HouseSecurityChamber } from './components/houses/HouseSecurityChamber';
import { TalentShow } from './components/TalentShow';
import { HouseMarketplaceExpo } from './components/houses/HouseMarketplaceExpo';
import { AIAcademy } from './components/AIAcademy';
import { HouseInstitutionalTraining } from './components/houses/HouseInstitutionalTraining';
import { HousePsychologyCounseling } from './components/houses/HousePsychologyCounseling';
import { HouseBrokerageMatching } from './components/houses/HouseBrokerageMatching';
import { HouseJudicialTribunal } from './components/houses/HouseJudicialTribunal';
import { HouseUtilityPayments } from './components/houses/HouseUtilityPayments';

// Auxiliary views
import { GamesArena } from './components/GamesArena';
import { EqubAndLottery } from './components/EqubAndLottery';
import { BankingWallet } from './components/BankingWallet';
import confetti from 'canvas-confetti';

const safeConfetti = (opts?: any) => {
  try {
    confetti(opts);
  } catch {
    // safe fallback on constrained mobile devices
  }
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
    // Default membership in House 1 for the founder
    return {
      h1: {
        houseId: 'h1',
        memberId: 'OW-H1-0001',
        fullName: 'ዘበነ አስፍዬ (Zebene Asfaye)',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
        roleInHouse: 'የመድረኩ መስራችና የጋራ ቤት መሪ',
        registeredDate: '2026-10-26',
        seatNumber: 1
      }
    };
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

  const handleInstallPwa = async () => {
    if (!deferredInstallPrompt) {
      alert('መተግበሪያውን በቀላሉ ወደ ስልክዎ ስክሪን ለመጫን በብራውዘርዎ የ"Add to Home Screen" አማራጭ ይጠቀሙ።');
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

  // User Profile
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    phoneNumber: '0911234567',
    fullName: 'ዘበነ አስፍዬ (Zebene Asfaye)',
    gender: 'ወንድ (Male)',
    age: 32,
    nationality: 'ኢትዮጵያዊ (Ethiopian)',
    address: 'አዲስ አበባ፣ ኢትዮጵያ',
    idNumber: 'ETH-ID-2026-9814',
    roleTitle: 'የመድረኩ መስራችና የሰላም አምባሳደር',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    verifiedAt: '2026-10-26'
  });

  // Financial Balances (Revenue Sharing Formula: 60% Member, 10% Bank, 10% Founder/Developer ዘበነ አስፍዬ, 20% Community)
  const [balanceETB, setBalanceETB] = useState<number>(34850);
  const [balanceUSD, setBalanceUSD] = useState<number>(290);
  const [royaltyPoints, setRoyaltyPoints] = useState<number>(620);
  const [builderReserveETB, setBuilderReserveETB] = useState<number>(18420); // 10% developer sovereign treasury (ዘበነ አስፍዬ)

  // Virtual Rooms State (House 1)
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [currentRoom, setCurrentRoom] = useState<Room>(INITIAL_ROOMS[0]);
  const [occupants, setOccupants] = useState<RoomOccupant[]>(INITIAL_OCCUPANTS);
  const [messages, setMessages] = useState<LiveSpeechMessage[]>(INITIAL_SPEECH_MESSAGES);
  const [userSeatedNumber, setUserSeatedNumber] = useState<number | null>(1);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

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

  // House 1 actions
  const handleClaimSeat = (seatNumber: number) => {
    setUserSeatedNumber(seatNumber);
    setOccupants((prev) => {
      const updated = prev.filter((o) => o.id !== 'user-self');
      const userOccupant: RoomOccupant = {
        id: 'user-self',
        name: currentUser.fullName,
        avatar: currentUser.avatarUrl,
        country: 'ኢትዮጵያ',
        countryFlag: '🇪🇹',
        preferredLang: currentLang as any,
        isSpeaking: false,
        isMuted: true,
        isVideoOn: true,
        seatNumber: seatNumber,
        royaltyPointsEarned: 280,
        titleBadge: currentUser.roleTitle
      };
      return [...updated, userOccupant];
    });
    showToast(`${t.chairs.seatPrefix}${seatNumber}: ${t.announcements.seatClaimed}`);
  };

  const handleLeaveSeat = () => {
    setUserSeatedNumber(null);
    setOccupants((prev) => prev.filter((o) => o.id !== 'user-self'));
    showToast(t.announcements.seatLeft);
  };

  const handleSendMessage = (msg: LiveSpeechMessage) => {
    setMessages((prev) => [...prev, msg]);
  };

  const handleSendGift = (gift: VirtualGift, recipient: RoomOccupant) => {
    if (balanceETB < gift.priceETB) {
      alert(t.announcements.insufficientFunds);
      return;
    }
    setBalanceETB((prev) => prev - gift.priceETB);
    const builderCut = Math.round(gift.priceETB * 0.10); // 10% to Developer
    setBuilderReserveETB((prev) => prev + builderCut);
    showToast(`${gift.icon} ${gift.nameAm} -> ${recipient.name} (${t.announcements.giftSent})`);
    safeConfetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  const handleCreatePersonalRoom = (newRoom: Room) => {
    setRooms([newRoom, ...rooms]);
    setCurrentRoom(newRoom);
    setUserSeatedNumber(1);
    showToast(`"${newRoom.titleAm}" አዳራሽ ተከፍቷል!`);
  };

  // General Financial Handlers (Formula: 60% Member, 10% Bank, 10% Founder ዘበነ አስፍዬ, 20% Community)
  const handleDeposit = (amount: number, bankName: string) => {
    setBalanceETB((prev) => prev + amount);
    const devCut = Math.round(amount * 0.10);
    setBuilderReserveETB((prev) => prev + devCut);
    showToast(`የ${amount.toLocaleString()} ብር ገቢ በ${bankName} ተፈፅሟል!`);
  };

  const handleWithdraw = (amount: number, bankName: string): boolean => {
    if (balanceETB < amount) {
      alert(`ይቅርታ፣ በቂ ሂሳብ የለዎትም። የሂሳብዎ ቀሪ፡ ${balanceETB.toLocaleString()} ብር ነው`);
      return false;
    }
    setBalanceETB((prev) => prev - amount);
    const devCut = Math.round(amount * 0.10);
    setBuilderReserveETB((prev) => prev + devCut);
    showToast(`የ${amount.toLocaleString()} ብር ወጪ ወደ ${bankName} ተላልፏል!`);
    return true;
  };

  const handleDeductBalance = (amount: number, reason: string): boolean => {
    if (balanceETB < amount) {
      alert('ይቅርታ፣ በቂ ሂሳብ የለዎትም።');
      return false;
    }
    setBalanceETB((prev) => prev - amount);
    const devCut = Math.round(amount * 0.10);
    setBuilderReserveETB((prev) => prev + devCut);
    showToast(`${amount.toLocaleString()} ብር ተከፍሏል (${reason})`);
    return true;
  };

  const handleCreditBalance = (amount: number, reason: string) => {
    const memberShare = Math.round(amount * 0.60); // 60% to member
    const devCut = Math.round(amount * 0.10);      // 10% to builder
    setBalanceETB((prev) => prev + memberShare);
    setBuilderReserveETB((prev) => prev + devCut);
    showToast(`+${memberShare.toLocaleString()} ብር ገቢ ተደርጓል (የ60% አባል ድርሻ - ${reason})`);
  };

  const handleAddRoyalty = (points: number, reason: string) => {
    setRoyaltyPoints((prev) => prev + points);
    const bonusETB = Math.round(points * 0.60); // 60%
    setBalanceETB((prev) => prev + bonusETB);
    const devCut = Math.round(bonusETB * 0.10);
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
    showToast(`የ${amount.toLocaleString()} ብር ክፍያ ወደ CBE አካውንት 1000167413618 (ዘበነ አስፍዬ) ተላልፏል!`);
  };

  return (
    <div className="min-h-screen bg-[#0c0f17] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-950/95 border border-emerald-500/60 text-emerald-200 text-xs font-bold rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-2 animate-bounce">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Top Header with 3-bar hamburger & 8 languages */}
      <Header
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        balanceETB={balanceETB}
        balanceUSD={balanceUSD}
        royaltyPoints={royaltyPoints}
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
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenBuilderVault={() => setIsBuilderVaultOpen(true)}
        onOpenCharter={() => setIsCharterOpen(true)}
        onInstallPwa={handleInstallPwa}
        isInstallable={isInstallable}
      />

      {/* Builder Sovereign Vault Modal (PIN 2026, CBE: 1000167413618, Founder: ዘበነ አስፍዬ) */}
      <BuilderVaultModal
        isOpen={isBuilderVaultOpen}
        onClose={() => setIsBuilderVaultOpen(false)}
        builderReserveETB={builderReserveETB}
        onDisburseToCBE={handleDisburseToCBE}
      />

      {/* Auth & Profile Modal with Real Photo Upload */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onSaveProfile={(prof) => {
          setCurrentUser(prof);
          showToast(t.announcements.profileSaved);
        }}
      />

      {/* Founding Charter Modal */}
      <FoundingCharterModal
        isOpen={isCharterOpen}
        onClose={() => setIsCharterOpen(false)}
        currentLang={currentLang}
      />

      {/* Main Content Dashboard */}
      <main className="flex-1 pb-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-4">
          {/* Prominent Install App Banner at top of Dashboard */}
          <InstallAppBanner
            onInstall={handleInstallPwa}
            isInstallable={isInstallable}
            currentLang={currentLang}
          />
        </div>

        {/* House 1: የሁሉም የጋራ ቤት */}
        {activeTarget === 'h1' && (
          <RoomStage
            rooms={rooms}
            currentRoom={currentRoom}
            onSelectRoom={setCurrentRoom}
            userLang={currentLang as any}
            userBalanceETB={balanceETB}
            occupants={occupants}
            messages={messages}
            onSendMessage={handleSendMessage}
            onSendGift={handleSendGift}
            onCreatePersonalRoom={handleCreatePersonalRoom}
            onClaimSeat={handleClaimSeat}
            onLeaveSeat={handleLeaveSeat}
            userSeatedNumber={userSeatedNumber}
            onAddRoyalty={handleAddRoyalty}
          />
        )}

        {/* Houses 2 to 15: Every house has its own dedicated membership gate, Zoom stage, mic, and numbered chairs */}
        {activeTarget === 'h2' && (
          <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-6">
            <HouseStageMedia
              houseId="h2"
              houseTitle={houseMeta('h2').title}
              houseDescription={houseMeta('h2').desc}
              houseRoleOptions={houseMeta('h2').roles}
              currentUser={currentUser}
              currentLang={currentLang}
              houseMemberships={houseMemberships}
              onRegisterHouseMember={handleRegisterHouseMember}
              onShowToast={showToast}
            />
            {houseMemberships['h2'] && <HouseFamilyKinship />}
          </div>
        )}

        {activeTarget === 'h3' && (
          <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-6">
            <HouseStageMedia
              houseId="h3"
              houseTitle={houseMeta('h3').title}
              houseDescription={houseMeta('h3').desc}
              houseRoleOptions={houseMeta('h3').roles}
              currentUser={currentUser}
              currentLang={currentLang}
              houseMemberships={houseMemberships}
              onRegisterHouseMember={handleRegisterHouseMember}
              onShowToast={showToast}
            />
            {houseMemberships['h3'] && <HouseLeadership />}
          </div>
        )}

        {activeTarget === 'h4' && (
          <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-6">
            <HouseStageMedia
              houseId="h4"
              houseTitle={houseMeta('h4').title}
              houseDescription={houseMeta('h4').desc}
              houseRoleOptions={houseMeta('h4').roles}
              currentUser={currentUser}
              currentLang={currentLang}
              houseMemberships={houseMemberships}
              onRegisterHouseMember={handleRegisterHouseMember}
              onShowToast={showToast}
            />
            {houseMemberships['h4'] && <HouseConfidentialCourtship />}
          </div>
        )}

        {activeTarget === 'h5' && (
          <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-6">
            <HouseStageMedia
              houseId="h5"
              houseTitle={houseMeta('h5').title}
              houseDescription={houseMeta('h5').desc}
              houseRoleOptions={houseMeta('h5').roles}
              currentUser={currentUser}
              currentLang={currentLang}
              houseMemberships={houseMemberships}
              onRegisterHouseMember={handleRegisterHouseMember}
              onShowToast={showToast}
            />
            {houseMemberships['h5'] && <HouseVirtualWedding />}
          </div>
        )}

        {activeTarget === 'h6' && (
          <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-6">
            <HouseStageMedia
              houseId="h6"
              houseTitle={houseMeta('h6').title}
              houseDescription={houseMeta('h6').desc}
              houseRoleOptions={houseMeta('h6').roles}
              currentUser={currentUser}
              currentLang={currentLang}
              houseMemberships={houseMemberships}
              onRegisterHouseMember={handleRegisterHouseMember}
              onShowToast={showToast}
            />
            {houseMemberships['h6'] && <HouseFaith />}
          </div>
        )}

        {activeTarget === 'h7' && (
          <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-6">
            <HouseStageMedia
              houseId="h7"
              houseTitle={houseMeta('h7').title}
              houseDescription={houseMeta('h7').desc}
              houseRoleOptions={houseMeta('h7').roles}
              currentUser={currentUser}
              currentLang={currentLang}
              houseMemberships={houseMemberships}
              onRegisterHouseMember={handleRegisterHouseMember}
              onShowToast={showToast}
            />
            {houseMemberships['h7'] && <HouseSecurityChamber />}
          </div>
        )}

        {activeTarget === 'h8' && (
          <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-6">
            <HouseStageMedia
              houseId="h8"
              houseTitle={houseMeta('h8').title}
              houseDescription={houseMeta('h8').desc}
              houseRoleOptions={houseMeta('h8').roles}
              currentUser={currentUser}
              currentLang={currentLang}
              houseMemberships={houseMemberships}
              onRegisterHouseMember={handleRegisterHouseMember}
              onShowToast={showToast}
            />
            {houseMemberships['h8'] && <TalentShow onEarnRoyalty={handleAddRoyalty} />}
          </div>
        )}

        {activeTarget === 'h9' && (
          <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-6">
            <HouseStageMedia
              houseId="h9"
              houseTitle={houseMeta('h9').title}
              houseDescription={houseMeta('h9').desc}
              houseRoleOptions={houseMeta('h9').roles}
              currentUser={currentUser}
              currentLang={currentLang}
              houseMemberships={houseMemberships}
              onRegisterHouseMember={handleRegisterHouseMember}
              onShowToast={showToast}
            />
            {houseMemberships['h9'] && (
              <HouseMarketplaceExpo
                userBalanceETB={balanceETB}
                onPurchase={handleDeductBalance}
              />
            )}
          </div>
        )}

        {activeTarget === 'h10' && (
          <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-6">
            <HouseStageMedia
              houseId="h10"
              houseTitle={houseMeta('h10').title}
              houseDescription={houseMeta('h10').desc}
              houseRoleOptions={houseMeta('h10').roles}
              currentUser={currentUser}
              currentLang={currentLang}
              houseMemberships={houseMemberships}
              onRegisterHouseMember={handleRegisterHouseMember}
              onShowToast={showToast}
            />
            {houseMemberships['h10'] && (
              <AIAcademy
                userLang={currentLang as any}
                onEarnRoyalty={handleAddRoyalty}
              />
            )}
          </div>
        )}

        {activeTarget === 'h11' && (
          <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-6">
            <HouseStageMedia
              houseId="h11"
              houseTitle={houseMeta('h11').title}
              houseDescription={houseMeta('h11').desc}
              houseRoleOptions={houseMeta('h11').roles}
              currentUser={currentUser}
              currentLang={currentLang}
              houseMemberships={houseMemberships}
              onRegisterHouseMember={handleRegisterHouseMember}
              onShowToast={showToast}
            />
            {houseMemberships['h11'] && <HouseInstitutionalTraining />}
          </div>
        )}

        {activeTarget === 'h12' && (
          <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-6">
            <HouseStageMedia
              houseId="h12"
              houseTitle={houseMeta('h12').title}
              houseDescription={houseMeta('h12').desc}
              houseRoleOptions={houseMeta('h12').roles}
              currentUser={currentUser}
              currentLang={currentLang}
              houseMemberships={houseMemberships}
              onRegisterHouseMember={handleRegisterHouseMember}
              onShowToast={showToast}
            />
            {houseMemberships['h12'] && <HousePsychologyCounseling />}
          </div>
        )}

        {activeTarget === 'h13' && (
          <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-6">
            <HouseStageMedia
              houseId="h13"
              houseTitle={houseMeta('h13').title}
              houseDescription={houseMeta('h13').desc}
              houseRoleOptions={houseMeta('h13').roles}
              currentUser={currentUser}
              currentLang={currentLang}
              houseMemberships={houseMemberships}
              onRegisterHouseMember={handleRegisterHouseMember}
              onShowToast={showToast}
            />
            {houseMemberships['h13'] && <HouseBrokerageMatching />}
          </div>
        )}

        {activeTarget === 'h14' && (
          <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-6">
            <HouseStageMedia
              houseId="h14"
              houseTitle={houseMeta('h14').title}
              houseDescription={houseMeta('h14').desc}
              houseRoleOptions={houseMeta('h14').roles}
              currentUser={currentUser}
              currentLang={currentLang}
              houseMemberships={houseMemberships}
              onRegisterHouseMember={handleRegisterHouseMember}
              onShowToast={showToast}
            />
            {houseMemberships['h14'] && <HouseJudicialTribunal />}
          </div>
        )}

        {activeTarget === 'h15' && (
          <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-6">
            <HouseStageMedia
              houseId="h15"
              houseTitle={houseMeta('h15').title}
              houseDescription={houseMeta('h15').desc}
              houseRoleOptions={houseMeta('h15').roles}
              currentUser={currentUser}
              currentLang={currentLang}
              houseMemberships={houseMemberships}
              onRegisterHouseMember={handleRegisterHouseMember}
              onShowToast={showToast}
            />
            {houseMemberships['h15'] && (
              <HouseUtilityPayments
                userBalanceETB={balanceETB}
                onPayBill={handleDeductBalance}
              />
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
      </main>

      {/* Platform Sovereign Footer strictly branded Oneworld */}
      <footer className="bg-[#090c13] border-t border-slate-800/80 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400 font-medium">
            <span>Oneworld · መስራች፡ ዘበነ አስፍዬ (Zebene Asfaye)</span>
            <span>·</span>
            <span>የኢትዮጵያ ንግድ ባንክ (CBE 1000167413618)</span>
            <span>·</span>
            <span>የ2026 ሚስጥራዊ ካዝና ጥበቃ</span>
            <span>·</span>
            <span>15ቱ ዋና ዋና ቤቶች</span>
          </div>
          <p className="text-[11px] text-slate-600">
            የአለማችን ህዝቦች በሁለንተናዊ መልካም አስተሳሰብ፣ በቴክኖሎጂ እውቀት፣ በስጋ ዝምድና፣ በሰርግ ውል፣ በፍትህና በጋራ ልማት ተሳስረው የሚኖሩበት አለም አቀፍ ሉዓላዊ አጎራ።
          </p>
        </div>
      </footer>
    </div>
  );
}
