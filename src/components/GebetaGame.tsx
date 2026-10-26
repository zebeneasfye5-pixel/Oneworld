import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Trophy, Brain, Award, Sparkles } from 'lucide-react';

interface GebetaGameProps {
  onGameWin: (prizeETB: number) => void;
}

export const GebetaGame: React.FC<GebetaGameProps> = ({ onGameWin }) => {
  // Pits: 0-5 Player, 6-11 AI
  // Stores: playerStore, aiStore
  const [board, setBoard] = useState<number[]>([4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]);
  const [playerStore, setPlayerStore] = useState<number>(0);
  const [aiStore, setAiStore] = useState<number>(0);
  const [turn, setTurn] = useState<'player' | 'ai'>('player');
  const [statusMessage, setStatusMessage] = useState<string>('የእርስዎ ተራ ነው፡ ማንኛውንም በጠጠር የተሞላ ጉድጓድ ይምረጡ');
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [winner, setWinner] = useState<string | null>(null);

  const resetGame = () => {
    setBoard([4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]);
    setPlayerStore(0);
    setAiStore(0);
    setTurn('player');
    setStatusMessage('አዲስ የገበጣ ጨዋታ ተጀምሯል። የእርስዎ ተራ ነው!');
    setIsGameOver(false);
    setWinner(null);
  };

  const handlePlayerPitClick = (index: number) => {
    if (turn !== 'player' || isGameOver) return;
    if (index < 0 || index > 5) return;
    if (board[index] === 0) return;

    playTurn(index, 'player');
  };

  const playTurn = (startIndex: number, currentTurn: 'player' | 'ai') => {
    const newBoard = [...board];
    let seeds = newBoard[startIndex];
    newBoard[startIndex] = 0;

    let currentIndex = startIndex;
    let localPlayerStore = playerStore;
    let localAiStore = aiStore;

    while (seeds > 0) {
      currentIndex = (currentIndex + 1) % 12;

      // Sow into pits
      newBoard[currentIndex] += 1;
      seeds -= 1;
    }

    // Capture logic:
    // If the last seed lands on an empty pit on player's side (0-5)
    if (currentTurn === 'player' && currentIndex >= 0 && currentIndex <= 5 && newBoard[currentIndex] === 1) {
      const oppositeIndex = 11 - currentIndex;
      if (newBoard[oppositeIndex] > 0) {
        const captured = newBoard[oppositeIndex] + 1;
        newBoard[currentIndex] = 0;
        newBoard[oppositeIndex] = 0;
        localPlayerStore += captured;
        setStatusMessage(`ድንቅ ብልሃት! ${captured} ጠጠሮችን ማረኩ!`);
      }
    } else if (currentTurn === 'ai' && currentIndex >= 6 && currentIndex <= 11 && newBoard[currentIndex] === 1) {
      const oppositeIndex = 11 - currentIndex;
      if (newBoard[oppositeIndex] > 0) {
        const captured = newBoard[oppositeIndex] + 1;
        newBoard[currentIndex] = 0;
        newBoard[oppositeIndex] = 0;
        localAiStore += captured;
      }
    }

    setBoard(newBoard);
    setPlayerStore(localPlayerStore);
    setAiStore(localAiStore);

    // Check game over (either side empty)
    const playerSideEmpty = newBoard.slice(0, 6).every((s) => s === 0);
    const aiSideEmpty = newBoard.slice(6, 12).every((s) => s === 0);

    if (playerSideEmpty || aiSideEmpty) {
      // Collect remaining seeds
      const remainingPlayer = newBoard.slice(0, 6).reduce((a, b) => a + b, 0);
      const remainingAi = newBoard.slice(6, 12).reduce((a, b) => a + b, 0);
      const finalPlayer = localPlayerStore + remainingPlayer;
      const finalAi = localAiStore + remainingAi;

      setPlayerStore(finalPlayer);
      setAiStore(finalAi);
      setBoard([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      setIsGameOver(true);

      if (finalPlayer > finalAi) {
        setWinner('player');
        setStatusMessage(`እንኳን ደስ አለዎት! በ${finalPlayer} - ${finalAi} አሸንፈዋል!`);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        onGameWin(150); // win 150 ETB
      } else if (finalPlayer < finalAi) {
        setWinner('ai');
        setStatusMessage(`ተጋጣሚው በ${finalAi} - ${finalPlayer} አሸነፈ። እንደገና ይሞክሩ!`);
      } else {
        setWinner('draw');
        setStatusMessage('አቻ ተጠናቋል!');
      }
      return;
    }

    // Switch turns
    if (currentTurn === 'player') {
      setTurn('ai');
      setStatusMessage('ተጋጣሚው (AI) እያሰበ ነው...');
      setTimeout(() => {
        executeAiMove(newBoard, localPlayerStore, localAiStore);
      }, 1000);
    } else {
      setTurn('player');
      setStatusMessage('የእርስዎ ተራ ነው!');
    }
  };

  const executeAiMove = (
    currentBoard: number[],
    currentPStore: number,
    currentAStore: number
  ) => {
    // Pick first non-empty pit from AI side (6 to 11)
    const availablePits = [6, 7, 8, 9, 10, 11].filter((idx) => currentBoard[idx] > 0);
    if (availablePits.length === 0) return;

    // Smart heuristic: choose pit with capture or most seeds
    const chosenPit = availablePits[Math.floor(Math.random() * availablePits.length)];

    const newBoard = [...currentBoard];
    let seeds = newBoard[chosenPit];
    newBoard[chosenPit] = 0;

    let currentIndex = chosenPit;
    let localAiStore = currentAStore;
    let localPlayerStore = currentPStore;

    while (seeds > 0) {
      currentIndex = (currentIndex + 1) % 12;
      newBoard[currentIndex] += 1;
      seeds -= 1;
    }

    if (currentIndex >= 6 && currentIndex <= 11 && newBoard[currentIndex] === 1) {
      const oppositeIndex = 11 - currentIndex;
      if (newBoard[oppositeIndex] > 0) {
        const captured = newBoard[oppositeIndex] + 1;
        newBoard[currentIndex] = 0;
        newBoard[oppositeIndex] = 0;
        localAiStore += captured;
      }
    }

    setBoard(newBoard);
    setAiStore(localAiStore);
    setPlayerStore(localPlayerStore);

    const playerSideEmpty = newBoard.slice(0, 6).every((s) => s === 0);
    const aiSideEmpty = newBoard.slice(6, 12).every((s) => s === 0);

    if (playerSideEmpty || aiSideEmpty) {
      const remainingPlayer = newBoard.slice(0, 6).reduce((a, b) => a + b, 0);
      const remainingAi = newBoard.slice(6, 12).reduce((a, b) => a + b, 0);
      const finalPlayer = localPlayerStore + remainingPlayer;
      const finalAi = localAiStore + remainingAi;

      setPlayerStore(finalPlayer);
      setAiStore(finalAi);
      setBoard([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      setIsGameOver(true);

      if (finalPlayer > finalAi) {
        setWinner('player');
        setStatusMessage(`እንኳን ደስ አለዎት! አሸንፈዋል!`);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        onGameWin(150);
      } else if (finalPlayer < finalAi) {
        setWinner('ai');
        setStatusMessage(`ተጋጣሚው አሸነፈ።`);
      } else {
        setWinner('draw');
        setStatusMessage('አቻ ተጠናቋል!');
      }
      return;
    }

    setTurn('player');
    setStatusMessage('የእርስዎ ተራ ነው፡ ማንኛውንም ጉድጓድ ይምረጡ');
  };

  return (
    <div className="bg-[#101626] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🪨</span>
            <h3 className="text-base font-extrabold text-white">
              ባህላዊ የኢትዮጵያ ገበጣ (Authentic Gebeta / Mancala)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            ጥንታዊ የስትራቴጂ እና የሂሳብ እውቀት መፈተኛ · በማሸነፍ <strong>150 ብር</strong> ይሸለሙ
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetGame}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ጨዋታ አድስ (Reset)</span>
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 p-3 rounded-xl text-xs">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-amber-400" />
          <span className="font-semibold text-slate-200">{statusMessage}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-[11px]">
            ተጋጣሚ (AI): <strong className="text-indigo-400">{aiStore} ጠጠር</strong>
          </span>
          <span className="text-slate-400 text-[11px]">
            እርስዎ: <strong className="text-emerald-400">{playerStore} ጠጠር</strong>
          </span>
        </div>
      </div>

      {/* Authentic Wooden Board Representation */}
      <div className="bg-gradient-to-b from-[#3a2211] to-[#25150a] border-4 border-[#523318] rounded-3xl p-6 shadow-2xl relative">
        <div className="flex items-center justify-between gap-4">
          {/* AI Store (Left) */}
          <div className="w-20 h-48 rounded-2xl bg-[#1d1007]/90 border-2 border-[#523318] flex flex-col items-center justify-center p-2 text-center shadow-inner">
            <span className="text-[10px] text-amber-200/70 font-bold mb-2">የተጋጣሚ መጋዘን</span>
            <div className="text-2xl font-black text-amber-400">{aiStore}</div>
            <span className="text-[9px] text-slate-400">ጠጠሮች</span>
          </div>

          {/* 12 Pits Center */}
          <div className="flex-1 space-y-4">
            {/* Top Row: AI Pits (Pits 11 to 6) */}
            <div className="text-[10px] text-amber-300/80 font-bold text-center tracking-wider">
              የተጋጣሚ ወገን (AI Side)
            </div>
            <div className="grid grid-cols-6 gap-2.5">
              {[11, 10, 9, 8, 7, 6].map((pitIndex) => {
                const count = board[pitIndex];
                return (
                  <div
                    key={pitIndex}
                    className="aspect-square rounded-2xl bg-[#1a0e06] border border-[#5a371a] flex flex-col items-center justify-center p-1 relative shadow-inner cursor-not-allowed"
                  >
                    <span className="text-xs font-black text-amber-300">{count}</span>
                    <div className="flex flex-wrap items-center justify-center gap-0.5 max-w-[28px] mt-0.5">
                      {Array.from({ length: Math.min(count, 8) }).map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-sm" />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Row: Player Pits (Pits 0 to 5) */}
            <div className="grid grid-cols-6 gap-2.5">
              {[0, 1, 2, 3, 4, 5].map((pitIndex) => {
                const count = board[pitIndex];
                const canClick = turn === 'player' && count > 0 && !isGameOver;

                return (
                  <button
                    key={pitIndex}
                    disabled={!canClick}
                    onClick={() => handlePlayerPitClick(pitIndex)}
                    className={`aspect-square rounded-2xl border flex flex-col items-center justify-center p-1 relative shadow-inner transition-all ${
                      canClick
                        ? 'bg-[#29170c] hover:bg-[#3d2313] border-amber-500/70 hover:scale-105 cursor-pointer shadow-amber-950/40'
                        : 'bg-[#1a0e06] border-[#5a371a] opacity-80 cursor-not-allowed'
                    }`}
                  >
                    <span className="text-xs font-black text-emerald-300">{count}</span>
                    <div className="flex flex-wrap items-center justify-center gap-0.5 max-w-[28px] mt-0.5">
                      {Array.from({ length: Math.min(count, 8) }).map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm" />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="text-[10px] text-emerald-300/80 font-bold text-center tracking-wider">
              የእርስዎ ወገን (Your Side - ጠቅ ያድርጉ)
            </div>
          </div>

          {/* Player Store (Right) */}
          <div className="w-20 h-48 rounded-2xl bg-[#1d1007]/90 border-2 border-emerald-600/60 flex flex-col items-center justify-center p-2 text-center shadow-inner">
            <span className="text-[10px] text-emerald-300 font-bold mb-2">የእርስዎ መጋዘን</span>
            <div className="text-2xl font-black text-emerald-400">{playerStore}</div>
            <span className="text-[9px] text-slate-400">ጠጠሮች</span>
          </div>
        </div>
      </div>

      {/* Game Rules & Income Notice */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-white">የገበጣ ህጎችና የገቢ ማስገኛ ስርአት፡</h4>
          <p>
            1. በእያንዳንዱ ጉድጓድ 4 ጠጠሮች ይገኛሉ። ከተራዎ ጉድጓድ አንስተው በተከታታይ ጉድጓዶች ያከፋፍሉ።
          </p>
          <p>
            2. የመጨረሻው ጠጠር በባዶ ጉድጓድዎ ላይ ካረፈ፣ የተጋጣሚዎን ተቃራኒ ጠጠሮች በሙሉ ማርከው ወደ መጋዘንዎ ያስገባሉ!
          </p>
          <p>
            3. አሸናፊ ሲሆኑ ወዲያውኑ 150 ብር ወደ ዋሌትዎ ገቢ ይሆናል። (85% ለእርስዎ፣ 10% ለባንክ፣ 5% ለገንቢው)
          </p>
        </div>
      </div>
    </div>
  );
};
