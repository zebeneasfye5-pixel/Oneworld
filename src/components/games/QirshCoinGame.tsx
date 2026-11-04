import React, { useState } from 'react';
import { Target, Trophy, RotateCcw, Sparkles, Coins } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QirshCoinGameProps {
  onEarnPrize: (amount: number, gameTitle: string) => void;
}

export const QirshCoinGame: React.FC<QirshCoinGameProps> = ({ onEarnPrize }) => {
  const [tossPower, setTossPower] = useState(50);
  const [aimAngle, setAimAngle] = useState(0);
  const [isTossing, setIsTossing] = useState(false);
  const [lastResult, setLastResult] = useState<{ score: number; reward: number; message: string } | null>(null);
  const [totalWon, setTotalWon] = useState(0);
  const [tossHistory, setTossHistory] = useState<string[]>([]);

  const handleToss = () => {
    if (isTossing) return;
    setIsTossing(true);
    setLastResult(null);

    // Calculate score based on power (ideal is 60-70) and aim (ideal is -5 to +5)
    setTimeout(() => {
      setIsTossing(false);
      const powerDiff = Math.abs(tossPower - 65);
      const aimDiff = Math.abs(aimAngle);
      const totalDeviation = powerDiff + aimDiff * 1.5;

      let score = 0;
      let reward = 0;
      let message = '';

      if (totalDeviation < 10) {
        score = 100;
        reward = 300;
        message = '🎯 ድንቅ ኢላማ! ሳንቲሟ በትክክል ማዕከሉ ላይ አረፈች (Jackpot 300 ብር)!';
        try {
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        } catch {}
      } else if (totalDeviation < 25) {
        score = 75;
        reward = 120;
        message = '✨ በጣም ጥሩ ውርወራ! ወደ ማዕከሉ እጅግ ተጠግተዋል (120 ብር አሸነፉ)!';
        try {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        } catch {}
      } else if (totalDeviation < 45) {
        score = 50;
        reward = 40;
        message = '👍 ጥሩ ሙከራ! ሳንቲሟ በውጪው ክብ ውስጥ አረፈች (40 ብር)!';
      } else {
        score = 20;
        reward = 0;
        message = '💨 ሳንቲሟ ከክቡ ውጭ ወጥታለች። ሃይልዎንና አቅጣጫዎን አስተካክለው እንደገና ይሞክሩ!';
      }

      setLastResult({ score, reward, message });
      if (reward > 0) {
        setTotalWon((prev) => prev + reward);
        onEarnPrize(reward, `የባህላዊ ቅርሽ ጨዋታ (${reward} ብር)`);
      }
      setTossHistory((prev) => [message, ...prev.slice(0, 4)]);
    }, 900);
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
              ባህላዊ የቅርሽ / የሳንቲም ኢላማ ጨዋታ (Qirsh Precision Toss)
            </h3>
            <p className="text-xs text-white">
              የጥንት ኢትዮጵያውያን የትኩረትና የሳንቲም ማረፊያ ጨዋታ — ሃይልና አቅጣጫ መርጠው ይወርውሩ!
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-white font-medium">የተጠራቀመ ድል</span>
          <p className="text-base font-black text-amber-400">{totalWon.toLocaleString()} ብር</p>
        </div>
      </div>

      {/* Target Canvas Board */}
      <div className="relative h-64 bg-slate-950 rounded-2xl border-2 border-slate-800 flex items-center justify-center overflow-hidden shadow-inner">
        {/* Concentric target rings */}
        <div className="absolute w-52 h-52 rounded-full border border-slate-700/60 bg-slate-900/40 flex items-center justify-center">
          <div className="w-36 h-36 rounded-full border border-amber-500/30 bg-amber-950/20 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border-2 border-amber-500/70 bg-amber-500/30 flex items-center justify-center">
              <div className="w-7 h-7 rounded-full bg-amber-400 animate-pulse flex items-center justify-center text-[10px] font-black text-slate-950">
                ★
              </div>
            </div>
          </div>
        </div>

        {/* Tossed coin indicator */}
        {isTossing && (
          <div className="absolute z-20 w-8 h-8 rounded-full bg-amber-400 border-2 border-white shadow-lg animate-bounce flex items-center justify-center text-slate-950 font-black text-xs">
            🪙
          </div>
        )}

        {/* Labels */}
        <span className="absolute top-3 left-3 text-[11px] text-white font-bold bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
          ማዕከል፡ 300 ብር · መካከለኛ፡ 120 ብር · ውጪ፡ 40 ብር
        </span>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
          <label className="flex items-center justify-between text-xs font-bold text-white mb-2">
            <span>የውርወራ ሃይል (Toss Power):</span>
            <span className="text-amber-400 font-mono font-black">{tossPower}%</span>
          </label>
          <input
            type="range"
            min="20"
            max="100"
            value={tossPower}
            disabled={isTossing}
            onChange={(e) => setTossPower(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
          <label className="flex items-center justify-between text-xs font-bold text-white mb-2">
            <span>የኢላማ አቅጣጫ (Aim Angle):</span>
            <span className="text-amber-400 font-mono font-black">{aimAngle}°</span>
          </label>
          <input
            type="range"
            min="-30"
            max="30"
            value={aimAngle}
            disabled={isTossing}
            onChange={(e) => setAimAngle(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Toss Button */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={handleToss}
          disabled={isTossing}
          className="flex-1 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black rounded-2xl text-sm transition-all shadow-xl shadow-amber-950/40 cursor-pointer flex items-center justify-center gap-2"
        >
          <Target className="w-5 h-5" />
          <span>{isTossing ? 'ሳንቲሟ እየተወረወረች ነው...' : '🪙 ሳንቲሟን በኢላማው ላይ ወርውር (Toss Coin)'}</span>
        </button>

        <button
          onClick={() => {
            setTossPower(65);
            setAimAngle(0);
          }}
          className="p-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl border border-slate-700 cursor-pointer"
          title="አስተካክል"
        >
          <RotateCcw className="w-5 h-5 text-amber-400" />
        </button>
      </div>

      {/* Result Card */}
      {lastResult && (
        <div className={`p-4 rounded-2xl border text-center animate-fadeIn ${
          lastResult.reward > 0
            ? 'bg-amber-950/40 border-amber-500/60 text-white'
            : 'bg-slate-950 border-slate-800 text-white'
        }`}>
          <p className="text-sm font-black mb-1">{lastResult.message}</p>
          <p className="text-xs text-white">የማረፊያ ነጥብ፡ {lastResult.score}/100</p>
        </div>
      )}

      {/* History */}
      {tossHistory.length > 0 && (
        <div className="pt-3 border-t border-slate-800 space-y-1.5">
          <span className="text-xs text-white font-bold">የቅርብ ውርወራዎች፦</span>
          {tossHistory.map((hist, idx) => (
            <p key={idx} className="text-xs text-white truncate">
              • {hist}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};
