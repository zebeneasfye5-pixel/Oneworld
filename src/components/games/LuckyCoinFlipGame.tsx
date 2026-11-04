import React, { useState } from 'react';
import { Coins, Sparkles, Trophy, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LuckyCoinFlipGameProps {
  onEarnPrize: (amount: number, gameTitle: string) => void;
}

export const LuckyCoinFlipGame: React.FC<LuckyCoinFlipGameProps> = ({ onEarnPrize }) => {
  const [selectedSide, setSelectedSide] = useState<'heads' | 'tails'>('heads');
  const [betAmount, setBetAmount] = useState<number>(50);
  const [isFlipping, setIsFlipping] = useState(false);
  const [resultSide, setResultSide] = useState<'heads' | 'tails' | null>(null);
  const [winningStreak, setWinningStreak] = useState(0);
  const [lastWonAmount, setLastWonAmount] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('ይምረጡ እና ይወርውሩ!');

  const handleFlip = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setResultSide(null);
    setLastWonAmount(null);
    setStatusMessage('ሳንቲሟ በአየር ላይ እየተሽከረከረች ነው...');

    setTimeout(() => {
      setIsFlipping(false);
      const isHeads = Math.random() >= 0.48; // Fair odds
      const landedSide: 'heads' | 'tails' = isHeads ? 'heads' : 'tails';
      setResultSide(landedSide);

      if (landedSide === selectedSide) {
        const nextStreak = winningStreak + 1;
        setWinningStreak(nextStreak);
        const multiplier = nextStreak === 1 ? 1.8 : nextStreak === 2 ? 2.5 : nextStreak === 3 ? 4.0 : 8.0;
        const prize = Math.round(betAmount * multiplier);
        setLastWonAmount(prize);
        setStatusMessage(`🎉 እንኳን ደስ አለዎት! ${landedSide === 'heads' ? 'ራስ (Heads)' : 'ጎፈር (Tails)'} ወጥቷል! (${prize} ብር አሸነፉ)`);
        try {
          confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
        } catch {}
        onEarnPrize(prize, `የዕድል ሳንቲም ወርወራ (${landedSide === 'heads' ? 'ራስ' : 'ጎፈር'} - ${nextStreak} ተከታታይ ድል)`);
      } else {
        setWinningStreak(0);
        setStatusMessage(`የወጣው ${landedSide === 'heads' ? 'ራስ' : 'ጎፈር'} ነው፤ የእርስዎ ምርጫ ${selectedSide === 'heads' ? 'ራስ' : 'ጎፈር'} ነበር። እንደገና ይሞክሩ!`);
      }
    }, 1200);
  };

  return (
    <div className="bg-[#0f1422] border-2 border-amber-500/40 rounded-3xl p-5 md:p-6 shadow-2xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 text-2xl shadow-lg">
            🪙
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-black text-amber-400">
              የዕድል ሳንቲም ወርወራ (Lucky Coin Flip - ራስ ወይስ ጎፈር)
            </h3>
            <p className="text-xs text-white">
              ራስ ወይስ ጎፈር ይምረጡ፤ ተከታታይ ድል ሲያገኙ ሽልማቱ እስከ 8 እጥፍ ያድጋል!
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-950/40 border border-amber-500/40 px-3 py-1.5 rounded-xl">
          <Flame className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-black text-amber-400">ተከታታይ ድል፡ {winningStreak}x</span>
        </div>
      </div>

      {/* 3D Animated Coin Display */}
      <div className="h-48 bg-slate-950 rounded-2xl border-2 border-slate-800 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
        <div className={`w-28 h-28 rounded-full border-4 border-amber-400 bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-black text-xl shadow-2xl transition-all duration-700 ${
          isFlipping ? 'animate-spin scale-110' : ''
        }`}>
          {resultSide === 'heads' ? (
            <div className="text-center">
              <span className="text-2xl">🦁</span>
              <p className="text-[11px] font-black tracking-tight text-slate-950">ራስ (HEADS)</p>
            </div>
          ) : resultSide === 'tails' ? (
            <div className="text-center">
              <span className="text-2xl">👑</span>
              <p className="text-[11px] font-black tracking-tight text-slate-950">ጎፈር (TAILS)</p>
            </div>
          ) : (
            <div className="text-center">
              <Coins className="w-8 h-8 text-slate-950 mx-auto mb-0.5" />
              <p className="text-[11px] font-black text-slate-950">ONEWORLD</p>
            </div>
          )}
        </div>

        <p className="mt-3 text-xs font-black text-white px-4 text-center">
          {statusMessage}
        </p>
      </div>

      {/* Side Selector */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setSelectedSide('heads')}
          className={`py-3.5 px-4 rounded-2xl border-2 font-black text-sm flex items-center justify-center gap-2 cursor-pointer transition ${
            selectedSide === 'heads'
              ? 'bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-400/50 shadow-lg'
              : 'bg-slate-950 text-white border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-lg">🦁</span>
          <span>ራስ (Heads)</span>
        </button>

        <button
          onClick={() => setSelectedSide('tails')}
          className={`py-3.5 px-4 rounded-2xl border-2 font-black text-sm flex items-center justify-center gap-2 cursor-pointer transition ${
            selectedSide === 'tails'
              ? 'bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-400/50 shadow-lg'
              : 'bg-slate-950 text-white border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-lg">👑</span>
          <span>ጎፈር (Tails)</span>
        </button>
      </div>

      {/* Amount Selector */}
      <div className="flex items-center justify-between gap-2 p-3 bg-slate-950 rounded-2xl border border-slate-800">
        <span className="text-xs text-white font-bold ml-2">የውርርድ መጠን፦</span>
        <div className="flex items-center gap-1.5">
          {[25, 50, 100, 250].map((amt) => (
            <button
              key={amt}
              onClick={() => setBetAmount(amt)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition ${
                betAmount === amt
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              {amt} ብር
            </button>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleFlip}
        disabled={isFlipping}
        className="w-full py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 text-slate-950 font-black rounded-2xl text-base shadow-xl shadow-amber-950/40 cursor-pointer flex items-center justify-center gap-2 transition transform hover:scale-[1.02]"
      >
        <Sparkles className="w-5 h-5 text-slate-950" />
        <span>{isFlipping ? 'ሳንቲሟ እየተወረወረች ነው...' : `🪙 ሳንቲሟን ወርውር (${betAmount} ብር)`}</span>
      </button>
    </div>
  );
};
