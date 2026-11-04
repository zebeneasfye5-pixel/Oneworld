import React, { useState } from 'react';
import { GebetaGame } from './GebetaGame';
import { DamaTacticsGame } from './games/DamaTacticsGame';
import { SpeedMathChallenge } from './games/SpeedMathChallenge';
import { MysteryChestsGame } from './games/MysteryChestsGame';
import { GlobalUniversalTrivia } from './GlobalUniversalTrivia';
import { SenterejChessGame } from './games/SenterejChessGame';
import { QirshCoinGame } from './games/QirshCoinGame';
import { LuckyCoinFlipGame } from './games/LuckyCoinFlipGame';
import { LuckyNumberLotteryGame } from './games/LuckyNumberLotteryGame';
import confetti from 'canvas-confetti';
import { 
  Gamepad2, 
  Disc, 
  Trophy, 
  ArrowUpRight,
  Smartphone,
  Building2,
  X,
  CheckCircle2
} from 'lucide-react';

import { AppLanguage } from '../i18n/translations';

interface GamesArenaProps {
  onEarnPrize: (amount: number, gameTitle: string) => void;
  currentLang?: AppLanguage;
}

export type GameTabType = 'trivia' | 'qirsh' | 'coinflip' | 'lottery' | 'senterej' | 'gebeta' | 'dama' | 'speedmath' | 'chests' | 'wheel';

export const GamesArena: React.FC<GamesArenaProps> = ({ onEarnPrize, currentLang = 'am' }) => {
  const [activeGameTab, setActiveGameTab] = useState<GameTabType>('trivia');

  // Direct Payout Modal
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutMethod, setPayoutMethod] = useState<'telebirr' | 'cbe' | 'awash' | 'dashen'>('telebirr');
  const [payoutAccount, setPayoutAccount] = useState('');
  const [payoutAmount, setPayoutAmount] = useState(500);
  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState<string | null>(null);

  // Wheel state
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [wheelPrizeWon, setWheelPrizeWon] = useState<string | null>(null);

  const wheelSegments = [
    { label: '50 ብር', amount: 50, color: 'from-amber-600 to-amber-800' },
    { label: '20 ነጥብ', amount: 20, color: 'from-amber-500 to-amber-700' },
    { label: '100 ብር', amount: 100, color: 'from-amber-700 to-yellow-900' },
    { label: 'ነፃ ዙር', amount: 0, color: 'from-slate-800 to-slate-900' },
    { label: '250 ብር', amount: 250, color: 'from-amber-600 to-yellow-700' },
    { label: 'ጃክፖት 1,000 ብር', amount: 1000, color: 'from-amber-400 to-amber-600' },
  ];

  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWheelPrizeWon(null);

    const chosenIndex = Math.floor(Math.random() * wheelSegments.length);
    const segmentAngle = 360 / wheelSegments.length;
    const extraTurns = (5 + Math.floor(Math.random() * 3)) * 360;
    const targetAngle = extraTurns + (chosenIndex * segmentAngle) + segmentAngle / 2;

    setWheelRotation(targetAngle);

    setTimeout(() => {
      setIsSpinning(false);
      const won = wheelSegments[chosenIndex];
      setWheelPrizeWon(won.label);
      if (won.amount > 0) {
        try {
          confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
        } catch {}
        onEarnPrize(won.amount, `የዕድል መንኰራኵር ሽልማት (${won.label})`);
      }
    }, 4000);
  };

  const handleProcessPayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payoutAccount.trim()) return;

    setPayoutSuccessMsg(`የ${payoutAmount.toLocaleString()} ብር ሽልማት ወደ ${payoutMethod.toUpperCase()} (${payoutAccount}) በተሳካ ሁኔታ ተላልፏል!`);
    try {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    } catch {}
  };

  const tabs: { id: GameTabType; label: string; icon: string; badge?: string }[] = [
    { id: 'trivia', label: 'ገደብ የለሽ እውቀት (Q&A)', icon: '🧠', badge: 'ኦሊምፒያድ' },
    { id: 'qirsh', label: 'ባህላዊ ቅርሽ (Qirsh)', icon: '🪙', badge: 'ባህላዊ' },
    { id: 'coinflip', label: 'የዕድል ሳንቲም (Coin Flip)', icon: '🦁', badge: 'እድል' },
    { id: 'lottery', label: 'የዕድል ቁጥር ሎተሪ (Lottery)', icon: '🎟️', badge: 'ጃክፖት' },
    { id: 'senterej', label: 'ሰንጠረዥና ቼስ (Senterej)', icon: '♟️', badge: 'ታክቲክ' },
    { id: 'gebeta', label: 'ባህላዊ ገበጣ (Gebeta)', icon: '🏺', badge: 'ባህላዊ' },
    { id: 'dama', label: 'የታክቲክ ዳማ (Dama)', icon: '🎯' },
    { id: 'speedmath', label: 'ፈጣን ሂሳብ (Speed Math)', icon: '⚡', badge: 'ፈታኝ' },
    { id: 'chests', label: 'የወርቅ ሳጥኖች (Chests)', icon: '👑', badge: 'እድል' },
    { id: 'wheel', label: 'የዕድል መንኰራኵር (Wheel)', icon: '🎡' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* Top Banner with Direct Prize Withdrawal Trigger */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#0f1422] border-2 border-amber-500/30 p-5 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-amber-400" />
            <h2 className="text-base md:text-lg font-black text-white">
              የአለም አቀፍ ተወዳዳሪ ጨዋታዎችና የሽልማት ማዕከል
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            እውቀት ተኮር ኦሊምፒያድ፣ ባህላዊ ሰንጠረዥ፣ ገበጣ፣ ዳማና እድል ፈታኝ ጨዋታዎች — ያሸነፉትን ገንዘብ ወዲያውኑ ወደ ባንክ/ቴሌብር ያውጡ!
          </p>
        </div>

        {/* Instant Prize Payout Button */}
        <button
          onClick={() => {
            setPayoutSuccessMsg(null);
            setIsPayoutModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black rounded-xl text-xs transition-all shadow-lg shadow-amber-950/40 cursor-pointer"
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>የተሸለሙትን ገንዘብ አውጣ (Withdraw Prize)</span>
        </button>
      </div>

      {/* Game Tabs Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeGameTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveGameTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shadow-md ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-amber-500/20 scale-105 ring-2 ring-amber-400 font-black'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-amber-500/40'
              }`}
            >
              <span className="text-sm">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono font-bold ${
                  isActive ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Boundless Universal Q&A */}
      {activeGameTab === 'trivia' && (
        <GlobalUniversalTrivia onEarnPrize={onEarnPrize} userLang={currentLang} />
      )}

      {/* Tab: Traditional Qirsh Precision Toss */}
      {activeGameTab === 'qirsh' && (
        <QirshCoinGame onEarnPrize={onEarnPrize} />
      )}

      {/* Tab: Lucky Coin Flip (Heads or Tails) */}
      {activeGameTab === 'coinflip' && (
        <LuckyCoinFlipGame onEarnPrize={onEarnPrize} />
      )}

      {/* Tab: Lucky 3-Digit Lottery Draw */}
      {activeGameTab === 'lottery' && (
        <LuckyNumberLotteryGame onEarnPrize={onEarnPrize} />
      )}

      {/* Tab 2: Ethiopian Senterej & Grandmaster Chess */}
      {activeGameTab === 'senterej' && (
        <SenterejChessGame onEarnPrize={onEarnPrize} />
      )}

      {/* Tab 3: Gebeta Game */}
      {activeGameTab === 'gebeta' && (
        <GebetaGame onGameWin={(prize) => onEarnPrize(prize, 'የገበጣ ጨዋታ ድል')} />
      )}

      {/* Tab 4: Tactical Dama Game */}
      {activeGameTab === 'dama' && (
        <DamaTacticsGame onEarnPrize={onEarnPrize} />
      )}

      {/* Tab 5: Speed Math Challenge */}
      {activeGameTab === 'speedmath' && (
        <SpeedMathChallenge onEarnPrize={onEarnPrize} />
      )}

      {/* Tab 6: Mystery Gold Chests */}
      {activeGameTab === 'chests' && (
        <MysteryChestsGame onEarnPrize={onEarnPrize} userBalanceETB={1000} />
      )}

      {/* Tab 7: Lucky Fortune Wheel */}
      {activeGameTab === 'wheel' && (
        <div className="bg-[#0f1422] border-2 border-amber-500/30 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Disc className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-extrabold text-white">
                  የአንድነት ዕድል መንኰራኵር (Mega Fortune Wheel of Unity)
                </h3>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                መንኰራኵሩን በማሽከርከር እስከ 1,000 ብር ጃክፖትና የሮያሊቲ ነጥቦችን ያሸንፉ!
              </p>
            </div>
            {wheelPrizeWon && (
              <span className="text-xs font-bold text-amber-400 animate-pulse">
                ያሸነፉት፡ {wheelPrizeWon}
              </span>
            )}
          </div>

          <div className="flex flex-col items-center justify-center py-8 relative">
            {/* Pointer Pin */}
            <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[24px] border-t-amber-400 z-20 -mb-3 filter drop-shadow"></div>

            {/* Wheel Canvas / SVG */}
            <div
              className="w-72 h-72 rounded-full border-4 border-amber-400 shadow-2xl relative overflow-hidden transition-transform ease-out"
              style={{
                transform: `rotate(${wheelRotation}deg)`,
                transitionDuration: isSpinning ? '4s' : '0s'
              }}
            >
              {wheelSegments.map((seg, i) => {
                const angle = 360 / wheelSegments.length;
                const rotateDeg = i * angle;
                return (
                  <div
                    key={i}
                    className={`absolute inset-0 bg-gradient-to-br ${seg.color} flex items-center justify-center text-center`}
                    style={{
                      clipPath: 'polygon(50% 50%, 0 0, 100% 0)',
                      transform: `rotate(${rotateDeg}deg)`,
                      transformOrigin: '50% 50%'
                    }}
                  >
                    <span className="text-xs font-black text-white -mt-20 transform -rotate-90">
                      {seg.label}
                    </span>
                  </div>
                );
              })}

              {/* Center Hub */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-slate-950 border-2 border-amber-400 flex items-center justify-center text-lg z-10 shadow-lg">
                👑
              </div>
            </div>

            <button
              onClick={handleSpinWheel}
              disabled={isSpinning}
              className="mt-8 px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black rounded-2xl text-sm shadow-xl shadow-amber-950/40 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSpinning ? 'መንኰራኵሩ እየተሽከረከረ ነው...' : 'ዕድልዎን አሽከርክሩ (Spin Now)'}
            </button>
          </div>
        </div>
      )}

      {/* Direct Prize Payout Modal */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0f1422] border-2 border-amber-500/40 rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setIsPayoutModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">
                  የተሸለሙትን ገንዘብ ማውጫ
                </h3>
                <p className="text-xs text-slate-300">
                  ቀጥታ ወደ ቴሌብር ወይም የኢትዮጵያ ባንኮች ወጪ ያድርጉ
                </p>
              </div>
            </div>

            {payoutSuccessMsg ? (
              <div className="p-4 bg-emerald-950/80 border border-emerald-500/60 rounded-2xl text-emerald-200 text-xs space-y-3 text-center">
                <div className="flex items-center justify-center gap-1.5 font-bold text-emerald-400 text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  ክፍያው በተሳካ ሁኔታ ተላልፏል!
                </div>
                <p>{payoutSuccessMsg}</p>
                <button
                  onClick={() => setIsPayoutModalOpen(false)}
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs cursor-pointer"
                >
                  ጨርስ
                </button>
              </div>
            ) : (
              <form onSubmit={handleProcessPayout} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    የማውጫ አማራጭ ይምረጡ
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPayoutMethod('telebirr')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition ${
                        payoutMethod === 'telebirr'
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>ቴሌብር (Telebirr)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayoutMethod('cbe')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition ${
                        payoutMethod === 'cbe'
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>ንግድ ባንክ (CBE)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayoutMethod('awash')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition ${
                        payoutMethod === 'awash'
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>አዋሽ ባንክ (Awash)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayoutMethod('dashen')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition ${
                        payoutMethod === 'dashen'
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>ዳሽን ባንክ (Dashen)</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    የአካውንት ወይም የስልክ ቁጥር
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ለምሳሌ፡ 0911234567 ወይም 1000192837465"
                    value={payoutAccount}
                    onChange={(e) => setPayoutAccount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    የወጪ መጠን (ብር)
                  </label>
                  <input
                    type="number"
                    min={50}
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black rounded-xl text-xs transition-all shadow-lg shadow-amber-950/40 cursor-pointer"
                >
                  ወጪ አድርግ (Confirm Payout Transfer)
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
