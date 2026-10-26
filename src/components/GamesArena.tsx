import React, { useState } from 'react';
import { GebetaGame } from './GebetaGame';
import { TriviaQuestion } from '../types';
import { INITIAL_TRIVIA_QUESTIONS } from '../data/initialData';
import confetti from 'canvas-confetti';
import { 
  Gamepad2, 
  HelpCircle, 
  Disc, 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Coins 
} from 'lucide-react';

interface GamesArenaProps {
  onEarnPrize: (amount: number, gameTitle: string) => void;
}

export const GamesArena: React.FC<GamesArenaProps> = ({ onEarnPrize }) => {
  const [activeGameTab, setActiveGameTab] = useState<'gebeta' | 'trivia' | 'wheel'>('gebeta');

  // Trivia state
  const [currentTriviaIndex, setCurrentTriviaIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [triviaScore, setTriviaScore] = useState(0);
  const currentTrivia = INITIAL_TRIVIA_QUESTIONS[currentTriviaIndex];

  // Wheel state
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [wheelPrizeWon, setWheelPrizeWon] = useState<string | null>(null);

  const wheelSegments = [
    { label: '50 ብር', amount: 50, color: 'bg-emerald-600' },
    { label: '20 ነጥብ', amount: 20, color: 'bg-amber-600' },
    { label: '100 ብር', amount: 100, color: 'bg-indigo-600' },
    { label: 'ነፃ ዙር', amount: 0, color: 'bg-purple-600' },
    { label: '250 ብር', amount: 250, color: 'bg-teal-600' },
    { label: 'ጃክፖት 500 ብር', amount: 500, color: 'bg-rose-600' },
  ];

  const handleTriviaAnswer = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === currentTrivia.correctIndex) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      setTriviaScore((prev) => prev + currentTrivia.rewardETB);
      onEarnPrize(currentTrivia.rewardETB, `የጥያቄና መልስ ድል (${currentTrivia.category})`);
    }
  };

  const nextTriviaQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setCurrentTriviaIndex((prev) => (prev + 1) % INITIAL_TRIVIA_QUESTIONS.length);
  };

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
        confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
        onEarnPrize(won.amount, `የዕድል መንኰራኵር ሽልማት (${won.label})`);
      }
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-amber-950/40 via-indigo-950/30 to-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-black text-white">
              የአለም አቀፍ እውቀት ተኮርና ገቢ ማስገኛ ጨዋታዎች ማዕከል
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            የአእምሮ ብቃትን፣ ስልጣኔንና ባህልን ከዘመናዊ ገቢ ማስገኛ ስርአት ጋር ያጣመሩ ፈታኝና አዝናኝ ጨዋታዎች
          </p>
        </div>

        {/* Game tab switch */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-1.5 rounded-xl">
          <button
            onClick={() => setActiveGameTab('gebeta')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeGameTab === 'gebeta'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ባህላዊ ገበጣ (Gebeta)
          </button>
          <button
            onClick={() => setActiveGameTab('trivia')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeGameTab === 'trivia'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            የጥያቄና መልስ ውድድር (Trivia)
          </button>
          <button
            onClick={() => setActiveGameTab('wheel')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeGameTab === 'wheel'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            የዕድል መንኰራኵር (Wheel)
          </button>
        </div>
      </div>

      {/* Tab 1: Gebeta Game */}
      {activeGameTab === 'gebeta' && (
        <GebetaGame onGameWin={(prize) => onEarnPrize(prize, 'የገበጣ ጨዋታ ድል')} />
      )}

      {/* Tab 2: Trivia Battle */}
      {activeGameTab === 'trivia' && (
        <div className="bg-[#101626] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-extrabold text-white">
                  የአለም አቀፍ እውቀት መፈተኛ ውድድር (Global Knowledge Quiz)
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                ዘርፍ፡ <strong className="text-indigo-400">{currentTrivia.category}</strong> · ሽልማት፡ <strong className="text-emerald-400">{currentTrivia.rewardETB} ብር</strong>
              </p>
            </div>
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-slate-400">የተገኘ አጠቃላይ ድል፡</span>
              <strong className="text-emerald-400 font-bold">{triviaScore} ብር</strong>
            </div>
          </div>

          {/* Question Box */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h4 className="text-sm md:text-base font-bold text-white leading-relaxed">
              {currentTrivia.questionAm}
            </h4>
            <p className="text-xs text-slate-400 italic">
              {currentTrivia.questionEn}
            </p>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {currentTrivia.optionsAm.map((opt, i) => {
                const isSelected = selectedOption === i;
                const isCorrect = i === currentTrivia.correctIndex;

                let btnStyle = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200';
                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-950/50 border-emerald-500 text-emerald-300 font-bold ring-1 ring-emerald-500';
                  } else if (isSelected) {
                    btnStyle = 'bg-red-950/50 border-red-500 text-red-300 font-bold';
                  } else {
                    btnStyle = 'bg-slate-950/50 border-slate-800 text-slate-600 opacity-60';
                  }
                }

                return (
                  <button
                    key={i}
                    disabled={isAnswered}
                    onClick={() => handleTriviaAnswer(i)}
                    className={`p-3.5 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    {isAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-400" />}
                  </button>
                );
              })}
            </div>

            {/* Answer explanation */}
            {isAnswered && (
              <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-900/50 text-xs text-indigo-200 space-y-1">
                <div className="font-bold text-indigo-300">ትክክለኛ ማብራሪያ፡</div>
                <p>{currentTrivia.explanationAm}</p>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={nextTriviaQuestion}
                    className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    ቀጣይ ጥያቄ (Next Question)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Spin Wheel of Fortune */}
      {activeGameTab === 'wheel' && (
        <div className="bg-[#101626] border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center space-y-6">
          <div>
            <div className="flex items-center justify-center gap-2">
              <Disc className="w-6 h-6 text-amber-400" />
              <h3 className="text-base font-extrabold text-white">
                የዕድል መንኰራኵር (Wheel of Destiny & Fortune)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              መንኰራኵሩን ያሽከርክሩ፤ እስከ <strong>500 ብር</strong> ድረስ ወዲያውኑ ይሸለሙ
            </p>
          </div>

          {/* Interactive Wheel Graphic */}
          <div className="relative w-64 h-64 md:w-72 md:h-72 my-4 flex items-center justify-center">
            {/* Top Indicator Arrow */}
            <div className="absolute -top-3 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[22px] border-t-amber-400 filter drop-shadow-lg"></div>

            {/* Rotating Disc */}
            <div
              className="w-full h-full rounded-full border-4 border-amber-500 shadow-2xl overflow-hidden relative"
              style={{
                transition: 'transform 4s cubic-bezier(0.15, 0.9, 0.2, 1)',
                transform: `rotate(${wheelRotation}deg)`,
                background: 'conic-gradient(#059669 0deg 60deg, #d97706 60deg 120deg, #4f46e5 120deg 180deg, #9333ea 180deg 240deg, #0d9488 240deg 300deg, #e11d48 300deg 360deg)'
              }}
            >
              {wheelSegments.map((seg, idx) => {
                const rotation = idx * 60 + 30;
                return (
                  <div
                    key={idx}
                    className="absolute w-full h-full flex justify-center items-start pt-6 text-[11px] font-black text-white text-shadow select-none pointer-events-none"
                    style={{
                      transform: `rotate(${rotation}deg)`
                    }}
                  >
                    <span>{seg.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Center Peg */}
            <div className="absolute z-10 w-14 h-14 rounded-full bg-slate-950 border-2 border-amber-400 flex items-center justify-center text-amber-400 font-extrabold text-xs shadow-xl">
              ዓለም
            </div>
          </div>

          {/* Prize announcement */}
          {wheelPrizeWon && (
            <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-bold animate-bounce">
              🎉 እንኳን ደስ አለዎት! <strong>{wheelPrizeWon}</strong> አሸንፈዋል!
            </div>
          )}

          {/* Spin Button */}
          <button
            disabled={isSpinning}
            onClick={handleSpinWheel}
            className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-black text-sm rounded-xl shadow-xl shadow-amber-950 cursor-pointer transition-all transform hover:scale-105"
          >
            {isSpinning ? 'እየተሽከረከረ ነው...' : 'መንኰራኵሩን አሽከርክር (Spin Now)'}
          </button>
        </div>
      )}
    </div>
  );
};
