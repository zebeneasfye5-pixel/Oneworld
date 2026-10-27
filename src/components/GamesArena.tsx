import React, { useState } from 'react';
import { GebetaGame } from './GebetaGame';
import { DamaTacticsGame } from './games/DamaTacticsGame';
import { SpeedMathChallenge } from './games/SpeedMathChallenge';
import { MysteryChestsGame } from './games/MysteryChestsGame';
import { GlobalUniversalTrivia } from './GlobalUniversalTrivia';
import confetti from 'canvas-confetti';
import { 
  Gamepad2, 
  HelpCircle, 
  Disc, 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Coins,
  Zap,
  Key,
  Flame,
  Award
} from 'lucide-react';

import { AppLanguage, TRANSLATIONS } from '../i18n/translations';

interface GamesArenaProps {
  onEarnPrize: (amount: number, gameTitle: string) => void;
  currentLang?: AppLanguage;
}

export type GameTabType = 'trivia' | 'gebeta' | 'dama' | 'speedmath' | 'chests' | 'wheel';

export const GamesArena: React.FC<GamesArenaProps> = ({ onEarnPrize, currentLang = 'am' }) => {
  const [activeGameTab, setActiveGameTab] = useState<GameTabType>('trivia');

  // Wheel state
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [wheelPrizeWon, setWheelPrizeWon] = useState<string | null>(null);

  const wheelSegments = [
    { label: '50 ብር', amount: 50, color: 'from-emerald-600 to-teal-800' },
    { label: '20 ነጥብ', amount: 20, color: 'from-amber-600 to-yellow-800' },
    { label: '100 ብር', amount: 100, color: 'from-indigo-600 to-blue-800' },
    { label: 'ነፃ ዙር', amount: 0, color: 'from-purple-600 to-indigo-900' },
    { label: '250 ብር', amount: 250, color: 'from-teal-600 to-emerald-900' },
    { label: 'ጃክፖት 1,000 ብር', amount: 1000, color: 'from-rose-600 to-red-900' },
  ];

  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWheelPrizeWon(null);

    // Pick random target segment
    const chosenIndex = Math.floor(Math.random() * wheelSegments.length);
    const segmentAngle = 360 / wheelSegments.length;
    // Extra full turns (5 to 8 turns)
    const extraTurns = (5 + Math.floor(Math.random() * 3)) * 360;
    const targetAngle = extraTurns + (chosenIndex * segmentAngle) + segmentAngle / 2;

    setWheelRotation(targetAngle);

    setTimeout(() => {
      setIsSpinning(false);
      const won = wheelSegments[chosenIndex];
      setWheelPrizeWon(won.label);
      if (won.amount > 0) {
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
        onEarnPrize(won.amount, `የዕድል መንኰራኵር ሽልማት (${won.label})`);
      }
    }, 4000);
  };

  const tabs: { id: GameTabType; label: string; icon: string; badge?: string }[] = [
    { id: 'trivia', label: 'ገደብ የለሽ እውቀት (Q&A)', icon: '🧠', badge: 'ዘርፈብዙ' },
    { id: 'gebeta', label: 'ባህላዊ ገበጣ (Gebeta)', icon: '🏺' },
    { id: 'dama', label: 'የታክቲክ ዳማ (Dama)', icon: '♟️', badge: 'ታክቲክ' },
    { id: 'speedmath', label: 'ፈጣን ሂሳብ (Speed Math)', icon: '⚡', badge: 'ፈታኝ' },
    { id: 'chests', label: 'የወርቅ ሳጥኖች (Chests)', icon: '👑', badge: 'እድል' },
    { id: 'wheel', label: 'የዕድል መንኰራኵር (Wheel)', icon: '🎡' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-amber-950/40 via-indigo-950/30 to-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-black text-white">
              የአለም አቀፍ እውቀት ተኮርና ገቢ ማስገኛ ቻሌንጆች ማዕከል
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            የአእምሮ ብቃትን፣ ስልጣኔን፣ ስትራቴጂንና እድልን ከገቢ ማስገኛ ስርአት ጋር ያጣመሩ ፈታኝና እጅግ ተወዳጅ አማራጮች
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/40 px-3.5 py-1.5 rounded-xl text-xs font-bold text-emerald-300">
          <Trophy className="w-4 h-4 text-emerald-400" />
          <span>እያንዳንዱ ድል ቀጥታ ወደ ሂሳብዎ ይገባል</span>
        </div>
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
                  ? 'bg-gradient-to-r from-amber-500 to-emerald-600 text-slate-950 shadow-amber-500/20 scale-105'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
            >
              <span className="text-sm">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono ${
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

      {/* Tab 2: Gebeta Game */}
      {activeGameTab === 'gebeta' && (
        <GebetaGame onGameWin={(prize) => onEarnPrize(prize, 'የገበጣ ጨዋታ ድል')} />
      )}

      {/* Tab 3: Tactical Dama Game */}
      {activeGameTab === 'dama' && (
        <DamaTacticsGame onEarnPrize={onEarnPrize} />
      )}

      {/* Tab 4: Speed Math Challenge */}
      {activeGameTab === 'speedmath' && (
        <SpeedMathChallenge onEarnPrize={onEarnPrize} />
      )}

      {/* Tab 5: Mystery Gold Chests */}
      {activeGameTab === 'chests' && (
        <MysteryChestsGame onEarnPrize={onEarnPrize} userBalanceETB={1000} />
      )}

      {/* Tab 6: Lucky Fortune Wheel */}
      {activeGameTab === 'wheel' && (
        <div className="bg-[#101626] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Disc className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-extrabold text-white">
                  የአንድነት ዕድል መንኰራኵር (Mega Fortune Wheel of Unity)
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
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
              className="mt-8 px-8 py-3 bg-gradient-to-r from-amber-500 via-emerald-600 to-indigo-600 hover:from-amber-400 text-slate-950 font-black rounded-2xl text-sm shadow-xl shadow-amber-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSpinning ? 'መንኰራኵሩ እየተሽከረከረ ነው...' : 'ዕድልዎን አሽከርክሩ (Spin Now)'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
