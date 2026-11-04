import React, { useState } from 'react';
import { Ticket, Sparkles, RefreshCw, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LuckyNumberLotteryGameProps {
  onEarnPrize: (amount: number, gameTitle: string) => void;
}

export const LuckyNumberLotteryGame: React.FC<LuckyNumberLotteryGameProps> = ({ onEarnPrize }) => {
  const [userDigits, setUserDigits] = useState<[number, number, number]>([7, 3, 9]);
  const [drawnDigits, setDrawnDigits] = useState<[number, number, number] | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastWinMessage, setLastWinMessage] = useState<string | null>(null);
  const [totalWon, setTotalWon] = useState(0);

  const handleQuickPick = () => {
    setUserDigits([
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10)
    ]);
  };

  const handleDraw = () => {
    if (isDrawing) return;
    setIsDrawing(true);
    setLastWinMessage(null);

    // Simulate animated draw
    setTimeout(() => {
      const drawn: [number, number, number] = [
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10)
      ];
      setDrawnDigits(drawn);
      setIsDrawing(false);

      // Check matches
      let matchCount = 0;
      if (userDigits[0] === drawn[0]) matchCount++;
      if (userDigits[1] === drawn[1]) matchCount++;
      if (userDigits[2] === drawn[2]) matchCount++;

      let prize = 0;
      let msg = '';

      if (matchCount === 3) {
        prize = 1500;
        msg = '🎉 ጃክፖት! 3ቱም ቁጥሮች በትክክል ተገጥመዋል! (1,500 ብር አሸነፉ)!';
        try {
          confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
        } catch {}
      } else if (matchCount === 2) {
        prize = 350;
        msg = '✨ ድንቅ ውጤት! 2 ቁጥሮች ተገጥመዋል (350 ብር አሸነፉ)!';
        try {
          confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
        } catch {}
      } else if (matchCount === 1) {
        prize = 60;
        msg = '👍 1 ቁጥር ተገጥሟል (60 ብር አሸነፉ)!';
      } else {
        msg = 'ምንም አልተገጠመም፤ ቁጥሮቹን ቀይረው እንደገና ይሞክሩ!';
      }

      setLastWinMessage(msg);
      if (prize > 0) {
        setTotalWon((prev) => prev + prize);
        onEarnPrize(prize, `የዕድል ቁጥር ሎተሪ (${prize} ብር)`);
      }
    }, 1100);
  };

  return (
    <div className="bg-[#0f1422] border-2 border-amber-500/40 rounded-3xl p-5 md:p-6 shadow-2xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 text-2xl shadow-lg">
            🎟️
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-black text-amber-400">
              የዕድል 3 ቁጥር ሎተሪ (Lucky 3-Digit Draw)
            </h3>
            <p className="text-xs text-white">
              3 ቁጥሮችን ይምረጡ፤ 3ቱም ሲገጣጠሙ የ1,500 ብር ጃክፖት ያሸንፋሉ!
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-white font-medium">የተጠራቀመ ድል</span>
          <p className="text-base font-black text-amber-400">{totalWon.toLocaleString()} ብር</p>
        </div>
      </div>

      {/* User Chosen Numbers */}
      <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center">
        <p className="text-xs text-white font-bold mb-3">የመረጧቸው የዕድል ቁጥሮች፦</p>
        <div className="flex items-center justify-center gap-4">
          {userDigits.map((digit, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <button
                onClick={() => {
                  const copy = [...userDigits] as [number, number, number];
                  copy[idx] = (copy[idx] + 1) % 10;
                  setUserDigits(copy);
                }}
                disabled={isDrawing}
                className="w-16 h-20 rounded-2xl bg-gradient-to-b from-amber-500/20 to-amber-950/60 border-2 border-amber-500 text-amber-400 font-mono font-black text-3xl flex items-center justify-center cursor-pointer hover:border-amber-400 transition"
                title="ቁጥሩን ለመቀየር ጠቅ ያድርጉ"
              >
                {digit}
              </button>
              <span className="text-[10px] text-white">ቀይር ▲</span>
            </div>
          ))}
        </div>

        <button
          onClick={handleQuickPick}
          disabled={isDrawing}
          className="mt-3 text-xs text-amber-400 hover:text-amber-300 font-bold inline-flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>በራስ-ሰር ምረጥ (Quick Pick)</span>
        </button>
      </div>

      {/* Live Draw Board */}
      <div className="h-32 bg-slate-950 rounded-2xl border-2 border-slate-800 flex flex-col items-center justify-center shadow-inner">
        <p className="text-xs text-white font-bold mb-2">የወጡት አሸናፊ ቁጥሮች፦</p>
        <div className="flex items-center gap-3">
          {isDrawing ? (
            <div className="flex items-center gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-12 h-14 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-white font-mono font-black text-2xl animate-pulse">
                  ?
                </div>
              ))}
            </div>
          ) : drawnDigits ? (
            <div className="flex items-center gap-3">
              {drawnDigits.map((num, i) => {
                const matched = userDigits[i] === num;
                return (
                  <div
                    key={i}
                    className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center font-mono font-black text-2xl shadow-lg ${
                      matched
                        ? 'bg-emerald-600/30 border-emerald-400 text-emerald-300 ring-2 ring-emerald-400'
                        : 'bg-slate-900 border-slate-700 text-white'
                    }`}
                  >
                    {num}
                  </div>
                );
              })}
            </div>
          ) : (
            <span className="text-xs text-white">ለመጀመር ከታች ያለውን ቁልፍ ይጫኑ</span>
          )}
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleDraw}
        disabled={isDrawing}
        className="w-full py-4 bg-gradient-to-r from-amber-500 via-emerald-600 to-indigo-600 hover:opacity-95 text-slate-950 font-black rounded-2xl text-base shadow-xl cursor-pointer flex items-center justify-center gap-2"
      >
        <Ticket className="w-5 h-5" />
        <span>{isDrawing ? 'እጣው እየወጣ ነው...' : '🎟️ የዕድል እጣ አውጣ (Draw Winning Numbers)'}</span>
      </button>

      {/* Message */}
      {lastWinMessage && (
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-center text-xs font-black text-white">
          {lastWinMessage}
        </div>
      )}
    </div>
  );
};
