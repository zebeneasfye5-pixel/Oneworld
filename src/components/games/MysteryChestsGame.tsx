import React, { useState } from 'react';
import { Gift, Sparkles, Coins, Trophy, RefreshCw, Key } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MysteryChestsGameProps {
  onEarnPrize: (amount: number, gameTitle: string) => void;
  userBalanceETB: number;
}

interface ChestReward {
  label: string;
  amount: number;
  icon: string;
  isJackpot?: boolean;
}

export const MysteryChestsGame: React.FC<MysteryChestsGameProps> = ({
  onEarnPrize,
  userBalanceETB
}) => {
  const [openedChestIndex, setOpenedChestIndex] = useState<number | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [lastWon, setLastWon] = useState<ChestReward | null>(null);

  const possibleRewards: ChestReward[] = [
    { label: '500 ብር የወርቅ ካዝና', amount: 500, icon: '👑', isJackpot: true },
    { label: '200 ብር የአልማዝ ሽልማት', amount: 200, icon: '💎' },
    { label: '100 ብር የብር ሳንቲም', amount: 100, icon: '🪙' },
    { label: '50 ብር የነፃ እድል', amount: 50, icon: '✨' },
    { label: '25 ብር ጉርሻ', amount: 25, icon: '🎁' },
  ];

  const handleOpenChest = (index: number) => {
    if (openedChestIndex !== null || isOpening) return;

    setIsOpening(true);
    setOpenedChestIndex(index);

    setTimeout(() => {
      // Pick random reward
      const chosen = possibleRewards[Math.floor(Math.random() * possibleRewards.length)];
      setLastWon(chosen);
      setIsOpening(false);

      if (chosen.amount > 0) {
        confetti({
          particleCount: chosen.isJackpot ? 120 : 60,
          spread: chosen.isJackpot ? 100 : 70,
          origin: { y: 0.6 }
        });
        onEarnPrize(chosen.amount, `የወርቅ ሚስጥር ሳጥን ድል (${chosen.label})`);
      }
    }, 1200);
  };

  const handleReset = () => {
    setOpenedChestIndex(null);
    setLastWon(null);
  };

  return (
    <div className="bg-[#101626] border border-slate-800 rounded-3xl p-5 md:p-7 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-amber-400" />
            የጥንታዊ ወርቅ ሚስጥር ሳጥኖች (Ancient Mystery Treasure Chests)
          </h3>
          <p className="text-xs text-slate-400">
            ከ5ቱ ሚስጥራዊ የወርቅ ሳጥኖች አንዱን ይምረጡ፤ እስከ 500 ብር ጃክፖት ያሸንፉ!
          </p>
        </div>

        {openedChestIndex !== null && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>አዲስ ሳጥን ምረጥ</span>
          </button>
        )}
      </div>

      {/* 5 Mystery Chests Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-4xl mx-auto py-4">
        {[0, 1, 2, 3, 4].map((idx) => {
          const isThisOpened = openedChestIndex === idx;

          return (
            <div
              key={idx}
              onClick={() => handleOpenChest(idx)}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center space-y-3 cursor-pointer ${
                isThisOpened
                  ? 'bg-gradient-to-b from-amber-500/20 to-slate-900 border-amber-400 shadow-xl shadow-amber-500/20 scale-105'
                  : openedChestIndex !== null
                  ? 'bg-slate-950/60 border-slate-800 opacity-50 cursor-not-allowed'
                  : 'bg-gradient-to-b from-slate-900 to-slate-950 border-amber-500/30 hover:border-amber-400 hover:scale-105 shadow-lg active:scale-95'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-center text-3xl shadow-inner">
                {isThisOpened ? (
                  isOpening ? (
                    <span className="animate-spin text-2xl">⏳</span>
                  ) : (
                    <span>{lastWon?.icon || '🎁'}</span>
                  )
                ) : (
                  <span className="group-hover:scale-110 transition-transform">🔒</span>
                )}
              </div>

              <span className="text-xs font-bold text-amber-300">
                ሳጥን #{idx + 1}
              </span>

              {isThisOpened && lastWon && (
                <div className="text-center animate-fadeIn">
                  <span className="text-xs font-black text-emerald-400 block">
                    +{lastWon.amount} ብር
                  </span>
                  <span className="text-[10px] text-slate-400">{lastWon.label}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {lastWon && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-amber-950/40 to-slate-900 border border-emerald-500/40 text-center space-y-1 animate-fadeIn">
          <span className="text-xs font-bold text-emerald-400">
            🎉 እንኳን ደስ አለዎት! {lastWon.label} አግኝተዋል!
          </span>
          <p className="text-[11px] text-slate-300">
            የ{lastWon.amount} ብር ሽልማት በቀጥታ ወደ ዋና ሂሳብዎ ተጨምሯል።
          </p>
        </div>
      )}
    </div>
  );
};
