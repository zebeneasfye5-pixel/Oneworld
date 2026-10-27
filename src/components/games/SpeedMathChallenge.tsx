import React, { useState, useEffect } from 'react';
import { Zap, Timer, Flame, Trophy, Play, CheckCircle2, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SpeedMathChallengeProps {
  onEarnPrize: (amount: number, gameTitle: string) => void;
}

interface Question {
  text: string;
  answer: number;
  options: number[];
}

export const SpeedMathChallenge: React.FC<SpeedMathChallengeProps> = ({ onEarnPrize }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [gameOver, setGameOver] = useState(false);

  const generateQuestion = (): Question => {
    const ops = ['+', '-', '×'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a = 0;
    let b = 0;
    let ans = 0;

    if (op === '+') {
      a = Math.floor(Math.random() * 80) + 12;
      b = Math.floor(Math.random() * 80) + 12;
      ans = a + b;
    } else if (op === '-') {
      a = Math.floor(Math.random() * 90) + 30;
      b = Math.floor(Math.random() * 30) + 5;
      ans = a - b;
    } else {
      a = Math.floor(Math.random() * 12) + 3;
      b = Math.floor(Math.random() * 12) + 3;
      ans = a * b;
    }

    const correct = ans;
    const offsets = [-10, -5, -2, -1, 1, 2, 5, 10];
    const shuffledOffsets = offsets.sort(() => 0.5 - Math.random()).slice(0, 3);
    const options = [correct, ...shuffledOffsets.map(o => correct + o)].sort(() => 0.5 - Math.random());

    return {
      text: `${a} ${op} ${b} = ?`,
      answer: correct,
      options
    };
  };

  const startGame = () => {
    setIsPlaying(true);
    setTimeLeft(45);
    setScore(0);
    setStreak(0);
    setGameOver(false);
    setCurrentQuestion(generateQuestion());
  };

  useEffect(() => {
    let timer: any = null;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (isPlaying && timeLeft === 0) {
      setIsPlaying(false);
      setGameOver(true);
      if (score >= 5) {
        const prizeETB = score * 10;
        confetti({ particleCount: 80, spread: 80 });
        onEarnPrize(prizeETB, `የአዕምሮ ፍጥነት ሂሳብ ቻሌንጅ (${score} ነጥብ)`);
      }
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, score]);

  const handleSelectOption = (chosen: number) => {
    if (!currentQuestion || !isPlaying) return;

    if (chosen === currentQuestion.answer) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setScore(s => s + (nextStreak >= 3 ? 2 : 1));
      setCurrentQuestion(generateQuestion());
    } else {
      setStreak(0);
      setCurrentQuestion(generateQuestion());
    }
  };

  return (
    <div className="bg-[#101626] border border-slate-800 rounded-3xl p-5 md:p-7 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            የአዕምሮ ፍጥነትና ፈጣን ሂሳብ ቻሌንጅ (Speed Math Reflex)
          </h3>
          <p className="text-xs text-slate-400">
            በ45 ሰከንድ ውስጥ በተከታታይ ትክክለኛውን መልስ በመምታት የገንዘብ ሽልማትና ሮያሊቲ ይሰብስቡ!
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-emerald-400">
            <Timer className="w-4 h-4 text-emerald-400" />
            <span>{timeLeft} ሰከንድ</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs font-bold text-amber-300">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>{score} ነጥብ</span>
          </div>
        </div>
      </div>

      {!isPlaying && !gameOver ? (
        <div className="p-8 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-3xl mx-auto">
            ⚡
          </div>
          <h4 className="text-lg font-black text-white">የአዕምሮ ዝግጁነት ፈተና</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            ቀላልና ፈጣን የሆኑ የሂሳብ ቀመሮችን በቅጽበት ይፍቱ። ተከታታይ ድል (Combo Streak) ተጨማሪ ነጥቦችንና የገንዘብ ሽልማት ያስገኛል።
          </p>
          <button
            onClick={startGame}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition cursor-pointer"
          >
            ቻሌንጁን ጀምር (Start Sprint)
          </button>
        </div>
      ) : isPlaying && currentQuestion ? (
        <div className="space-y-6 max-w-lg mx-auto py-4 text-center">
          {streak >= 3 && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black animate-pulse">
              <Flame className="w-3.5 h-3.5" />
              <span>{streak}x ኮምቦ ጉርሻ ነቅቷል!</span>
            </div>
          )}

          <div className="p-6 bg-slate-950/80 border-2 border-indigo-500/40 rounded-2xl shadow-xl">
            <span className="text-3xl sm:text-4xl font-black text-white tracking-widest font-mono">
              {currentQuestion.text}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {currentQuestion.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelectOption(opt)}
                className="py-4 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500 hover:bg-slate-800 text-xl font-black text-white transition active:scale-95 cursor-pointer shadow-md"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center space-y-4 max-w-md mx-auto">
          <Trophy className="w-16 h-16 text-amber-400 mx-auto animate-bounce" />
          <h4 className="text-xl font-black text-white">ሰአት አልቋል!</h4>
          <p className="text-sm text-emerald-300 font-bold">
            ያስመዘገቡት ነጥብ፡ {score} {score >= 5 ? `(+${score * 10} ብር ተሸልመዋል)` : ''}
          </p>
          <button
            onClick={startGame}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer"
          >
            እንደገና ሞክር (Try Again)
          </button>
        </div>
      )}
    </div>
  );
};
