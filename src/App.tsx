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

export default function App() {
  const [currentLang, setCurrentLang] = useState<AppLanguage>('am');
  const [activeTarget, setActiveTarget] = useState<MainNavigationTarget>('h1');

  // Modals state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isBuilderVaultOpen, setIsBuilderVaultOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCharterOpen, setIsCharterOpen] = useState(false);

  // PWA Install State
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

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
      alert('መተግበሪያውን በቀላሉ ወደ ስክሪንዎ ለመጫን በብራውዘርዎ የ"Add to Home Screen" አማራጭ ይጠቀሙ።');
      return;
    }
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
      setDeferredInstallPrompt(null);
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
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

  // Financial Balances
  const [balanceETB, setBalanceETB] = useState<number>(34850);
  const [balanceUSD, setBalanceUSD] = useState<number>(290);
  const [royaltyPoints, setRoyaltyPoints] = useState<number>(620);
  const [builderReserveETB, setBuilderReserveETB] = useState<number>(18420); // 5% developer sovereign treasury

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
    showToast(`ወንበር #${seatNumber} በተሳካ ሁኔታ ተያዘ!`);
  };

  const handleLeaveSeat = () => {
    setUserSeatedNumber(null);
    setOccupants((prev) => prev.filter((o) => o.id !== 'user-self'));
    showToast('ወንበሩን ለቀዋል፤ በተመልካችነት ላይ ነዎት።');
  };

  const handleSendMessage = (msg: LiveSpeechMessage) => {
    setMessages((prev) => [...prev, msg]);
  };

  const handleSendGift = (gift: VirtualGift, recipient: RoomOccupant) => {
    if (balanceETB < gift.priceETB) {
      alert('ይቅርታ፣ በቂ ሂሳብ የለዎትም።');
      return;
    }
    setBalanceETB((prev) => prev - gift.priceETB);
    const builderCut = Math.round(gift.priceETB * 0.05);
    setBuilderReserveETB((prev) => prev + builderCut);
    showToast(`${gift.icon} ${gift.nameAm} ለ${recipient.name} ተልኳል!`);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  const handleCreatePersonalRoom = (newRoom: Room) => {
    setRooms([newRoom, ...rooms]);
    setCurrentRoom(newRoom);
    setUserSeatedNumber(1);
    showToast(`"${newRoom.titleAm}" አዳራሽ ተከፍቷል!`);
  };

  // General Financial Handlers
  const handleDeposit = (amount: number, bankName: string) => {
    setBalanceETB((prev) => prev + amount);
    const devCut = Math.round(amount * 0.05);
    setBuilderReserveETB((prev) => prev + devCut);
    showToast(`የ${amount.toLocaleString()} ብር ገቢ በ${bankName} ተፈፅሟል!`);
  };

  const handleWithdraw = (amount: number, bankName: string): boolean => {
    if (balanceETB < amount) {
      alert(`ይቅርታ፣ በቂ ሂሳብ የለዎትም። የሂሳብዎ ቀሪ፡ ${balanceETB.toLocaleString()} ብር ነው`);
      return false;
    }
    setBalanceETB((prev) => prev - amount);
    const devCut = Math.round(amount * 0.05);
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
    const devCut = Math.round(amount * 0.05);
    setBuilderReserveETB((prev) => prev + devCut);
    showToast(`${amount.toLocaleString()} ብር ተከፍሏል (${reason})`);
    return true;
  };

  const handleCreditBalance = (amount: number, reason: string) => {
    setBalanceETB((prev) => prev + amount);
    const devCut = Math.round(amount * 0.05);
    setBuilderReserveETB((prev) => prev + devCut);
    showToast(`+${amount.toLocaleString()} ብር ተጨምሯል (${reason})`);
  };

  const handleAddRoyalty = (points: number, reason: string) => {
    setRoyaltyPoints((prev) => prev + points);
    const bonusETB = Math.round(points * 0.5);
    setBalanceETB((prev) => prev + bonusETB);
    const devCut = Math.round(bonusETB * 0.05);
    setBuilderReserveETB((prev) => prev + devCut);
    showToast(`+${points} የእንቅስቃሴ ነጥብና +${bonusETB} ብር ሮያሊቲ አግኝተዋል! (${reason})`);
  };

  const handleConvertRoyalties = (points: number) => {
    if (royaltyPoints < points) return;
    setRoyaltyPoints((prev) => prev - points);
    setBalanceETB((prev) => prev + points);
    showToast(`${points} የሮያሊቲ ነጥብ ወደ ${points} ብር ተቀይሯል!`);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
  };

  const handleDisburseToCBE = (amount: number) => {
    setBuilderReserveETB(0);
    showToast(`የ${amount.toLocaleString()} ብር ክፍያ ወደ CBE አካውንት 1000167413618 (ዘበነ አስፍዬ) ተላልፏል!`);
  };

  const t = TRANSLATIONS[currentLang];

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
        onLanguageChange={setCurrentLang}
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
        onLanguageChange={setCurrentLang}
        user={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenBuilderVault={() => setIsBuilderVaultOpen(true)}
        onOpenCharter={() => setIsCharterOpen(true)}
        onInstallPwa={handleInstallPwa}
        isInstallable={isInstallable}
      />

      {/* Builder Sovereign Vault Modal (PIN 2026, CBE: 1000167413618) */}
      <BuilderVaultModal
        isOpen={isBuilderVaultOpen}
        onClose={() => setIsBuilderVaultOpen(false)}
        builderReserveETB={builderReserveETB}
        onDisburseToCBE={handleDisburseToCBE}
      />

      {/* Auth & Profile Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onSaveProfile={(prof) => {
          setCurrentUser(prof);
          showToast('የአባልነት መገለጫዎ በተሳካ ሁኔታ ተረጋግጧል!');
        }}
      />

      {/* Founding Charter Modal */}
      <FoundingCharterModal
        isOpen={isCharterOpen}
        onClose={() => setIsCharterOpen(false)}
      />

      {/* Main Content Router for the 15 Primary Houses & Aux Features */}
      <main className="flex-1 pb-16">
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

        {/* House 2: የስጋ ዘመድ ቤት */}
        {activeTarget === 'h2' && <HouseFamilyKinship />}

        {/* House 3: የባለስልጣን ቤት */}
        {activeTarget === 'h3' && <HouseLeadership />}

        {/* House 4: የሚስጥር ቤት */}
        {activeTarget === 'h4' && <HouseConfidentialCourtship />}

        {/* House 5: የሰርግ ቤት */}
        {activeTarget === 'h5' && <HouseVirtualWedding />}

        {/* House 6: የእምነት ቤት */}
        {activeTarget === 'h6' && <HouseFaith />}

        {/* House 7: የደህንነት አስጠባቂ ቤት */}
        {activeTarget === 'h7' && <HouseSecurityChamber />}

        {/* House 8: የታለንት ሾው ቤት */}
        {activeTarget === 'h8' && <TalentShow onEarnRoyalty={handleAddRoyalty} />}

        {/* House 9: የማስታወቂያና የገበያ ቤት */}
        {activeTarget === 'h9' && (
          <HouseMarketplaceExpo
            userBalanceETB={balanceETB}
            onPurchase={handleDeductBalance}
          />
        )}

        {/* House 10: የትምህርት ቤት */}
        {activeTarget === 'h10' && (
          <AIAcademy
            userLang={currentLang as any}
            onEarnRoyalty={handleAddRoyalty}
          />
        )}

        {/* House 11: ተቋማዊ ስልጠና መስጫ አዳራሽ */}
        {activeTarget === 'h11' && <HouseInstitutionalTraining />}

        {/* House 12: የምክርና ሳይኮሎጂ ትሪትመንት ቤት */}
        {activeTarget === 'h12' && <HousePsychologyCounseling />}

        {/* House 13: የድለላና ፈላጊ/ተፈላጊ ቤት */}
        {activeTarget === 'h13' && <HouseBrokerageMatching />}

        {/* House 14: የአቤቱታና የዳኝነት ቤት */}
        {activeTarget === 'h14' && <HouseJudicialTribunal />}

        {/* House 15: የአገልግሎት ክፍያ ቤት */}
        {activeTarget === 'h15' && (
          <HouseUtilityPayments
            userBalanceETB={balanceETB}
            onPayBill={handleDeductBalance}
          />
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

      {/* Platform Sovereign Footer */}
      <footer className="bg-[#090c13] border-t border-slate-800/80 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400 font-medium">
            <span>OneWorld (ዓለም አንድ) · መስራች፡ ዘበነ አስፍዬ (Zebene Asfaye)</span>
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
