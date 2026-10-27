import React, { useState } from 'react';
import { Trophy, RefreshCw, Sparkles, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

type Piece = 'red' | 'black' | 'red-king' | 'black-king' | null;

interface Position {
  row: number;
  col: number;
}

interface DamaTacticsGameProps {
  onEarnPrize: (amount: number, gameTitle: string) => void;
}

export const DamaTacticsGame: React.FC<DamaTacticsGameProps> = ({ onEarnPrize }) => {
  // Initialize standard 8x8 checkers board
  const initializeBoard = (): Piece[][] => {
    const board: Piece[][] = Array(8).fill(null).map(() => Array(8).fill(null));
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 8; c++) {
        if ((r + c) % 2 === 1) board[r][c] = 'black';
      }
    }
    for (let r = 5; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if ((r + c) % 2 === 1) board[r][c] = 'red';
      }
    }
    return board;
  };

  const [board, setBoard] = useState<Piece[][]>(initializeBoard);
  const [selectedPos, setSelectedPos] = useState<Position | null>(null);
  const [turn, setTurn] = useState<'red' | 'black'>('red');
  const [redCaptured, setRedCaptured] = useState(0);
  const [blackCaptured, setBlackCaptured] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('ተራዎ ነው፤ ቀይ ጠጠሮችን ያንቀሳቅሱ');

  const restartGame = () => {
    setBoard(initializeBoard());
    setSelectedPos(null);
    setTurn('red');
    setRedCaptured(0);
    setBlackCaptured(0);
    setWinner(null);
    setStatusMessage('ተራዎ ነው፤ ቀይ ጠጠሮችን ያንቀሳቅሱ');
  };

  const handleCellClick = (r: number, c: number) => {
    if (winner) return;

    const piece = board[r][c];

    // If clicking own piece
    if (piece && (piece === 'red' || piece === 'red-king') && turn === 'red') {
      setSelectedPos({ row: r, col: c });
      setStatusMessage(`ጠጠር ተመርጧል (ተራ ${r + 1}, ረድፍ ${c + 1}) - የሚሄዱበትን ጥቁር ሳጥን ይጫኑ`);
      return;
    }

    // If destination clicked
    if (selectedPos && (r + c) % 2 === 1 && !piece) {
      const fromR = selectedPos.row;
      const fromC = selectedPos.col;
      const movingPiece = board[fromR][fromC];
      const rowDiff = r - fromR;
      const colDiff = Math.abs(c - fromC);

      // Simple forward move (Red moves up: rowDiff === -1, or king moves either way)
      const isKing = movingPiece === 'red-king';
      const isNormalMove = (isKing ? Math.abs(rowDiff) === 1 : rowDiff === -1) && colDiff === 1;

      // Jump over black piece
      const isJump = (isKing ? Math.abs(rowDiff) === 2 : rowDiff === -2) && colDiff === 2;
      const jumpedR = fromR + rowDiff / 2;
      const jumpedC = fromC + (c - fromC) / 2;
      const jumpedPiece = isJump ? board[jumpedR][jumpedC] : null;
      const isValidJump = isJump && jumpedPiece && (jumpedPiece === 'black' || jumpedPiece === 'black-king');

      if (isNormalMove || isValidJump) {
        const newBoard = board.map(row => [...row]);
        newBoard[fromR][fromC] = null;

        // Check if becomes king
        const becomesKing = isKing || r === 0;
        newBoard[r][c] = becomesKing ? 'red-king' : 'red';

        if (isValidJump) {
          newBoard[jumpedR][jumpedC] = null;
          setBlackCaptured(prev => {
            const next = prev + 1;
            if (next >= 6) {
              setWinner('እርስዎ (ቀይ)');
              confetti({ particleCount: 70, spread: 70 });
              onEarnPrize(150, 'የዳማ ቻሌንጅ ታክቲክ ድል');
            }
            return next;
          });
        }

        setBoard(newBoard);
        setSelectedPos(null);

        // Switch to AI black move
        setTurn('black');
        setStatusMessage('የስርአቱ አስተውሎት (Black AI) በማሰብ ላይ ነው...');

        setTimeout(() => {
          makeAIMove(newBoard);
        }, 600);
      }
    }
  };

  const makeAIMove = (currentBoard: Piece[][]) => {
    // Find black pieces
    const blackPieces: Position[] = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = currentBoard[r][c];
        if (p === 'black' || p === 'black-king') {
          blackPieces.push({ row: r, col: c });
        }
      }
    }

    if (blackPieces.length === 0) {
      setWinner('እርስዎ (ቀይ)');
      confetti({ particleCount: 70, spread: 70 });
      onEarnPrize(200, 'የዳማ ቻሌንጅ ፍፁም ድል');
      return;
    }

    // Try finding jump first
    let moveMade = false;
    const newBoard = currentBoard.map(row => [...row]);

    for (const p of blackPieces) {
      const dirs = [[2, 2], [2, -2], [-2, 2], [-2, -2]];
      for (const [dr, dc] of dirs) {
        const targetR = p.row + dr;
        const targetC = p.col + dc;
        const midR = p.row + dr / 2;
        const midC = p.col + dc / 2;

        if (
          targetR >= 0 && targetR < 8 &&
          targetC >= 0 && targetC < 8 &&
          newBoard[targetR][targetC] === null
        ) {
          const midP = newBoard[midR][midC];
          if (midP && (midP === 'red' || midP === 'red-king')) {
            // Jump!
            newBoard[p.row][p.col] = null;
            newBoard[midR][midC] = null;
            newBoard[targetR][targetC] = targetR === 7 ? 'black-king' : p.row === 7 ? 'black-king' : 'black';
            setRedCaptured(c => c + 1);
            moveMade = true;
            break;
          }
        }
      }
      if (moveMade) break;
    }

    // Otherwise simple move forward
    if (!moveMade) {
      for (const p of blackPieces) {
        const dirs = [[1, 1], [1, -1]];
        for (const [dr, dc] of dirs) {
          const targetR = p.row + dr;
          const targetC = p.col + dc;
          if (
            targetR >= 0 && targetR < 8 &&
            targetC >= 0 && targetC < 8 &&
            newBoard[targetR][targetC] === null
          ) {
            newBoard[p.row][p.col] = null;
            newBoard[targetR][targetC] = targetR === 7 ? 'black-king' : 'black';
            moveMade = true;
            break;
          }
        }
        if (moveMade) break;
      }
    }

    setBoard(newBoard);
    setTurn('red');
    setStatusMessage('ተራዎ ነው፤ የሚፈልጉትን ቀይ ጠጠር መርጠው ያንቀሳቅሱ');
  };

  return (
    <div className="bg-[#101626] border border-slate-800 rounded-3xl p-5 md:p-7 shadow-2xl space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            የአለም አቀፍ ዳማና ታክቲክ ቻሌንጅ (Dama & Draughts Grandmaster)
          </h3>
          <p className="text-xs text-slate-400">
            ጥቁር ሳጥኖችን በመጠቀም የባላጋራዎን ጠጠሮች ዘለው ይብሉ፤ ንጉስ በማስመረቅ 150 ብር ያሸንፉ!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-red-400 font-bold">ቀይ (እርስዎ)፡ {blackCaptured}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 font-bold">ጥቁር (AI)፡ {redCaptured}</span>
          </div>

          <button
            onClick={restartGame}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title="አዲስ ጨዋታ ጀምር"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-semibold text-center text-amber-300">
        {winner ? `🎉 ጨዋታው ተጠናቋል! አሸናፊ፡ ${winner}` : statusMessage}
      </div>

      {/* Checkers Board */}
      <div className="max-w-[420px] mx-auto bg-amber-950/40 p-3 rounded-2xl border-4 border-amber-900/60 shadow-2xl">
        <div className="grid grid-cols-8 gap-0.5 rounded-xl overflow-hidden border border-amber-950">
          {board.map((row, r) =>
            row.map((piece, c) => {
              const isDark = (r + c) % 2 === 1;
              const isSelected = selectedPos?.row === r && selectedPos?.col === c;

              return (
                <div
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  className={`aspect-square flex items-center justify-center relative cursor-pointer select-none transition-colors ${
                    isDark ? 'bg-[#181310] hover:bg-[#251e18]' : 'bg-[#e5d5be]'
                  } ${isSelected ? 'ring-4 ring-amber-400 ring-inset z-10' : ''}`}
                >
                  {piece && (
                    <div
                      className={`w-[78%] h-[78%] rounded-full shadow-lg flex items-center justify-center font-bold text-xs transition-transform active:scale-90 ${
                        piece.startsWith('red')
                          ? 'bg-gradient-to-br from-red-500 to-rose-700 border-2 border-red-300 shadow-red-500/40 text-white'
                          : 'bg-gradient-to-br from-slate-700 to-slate-950 border-2 border-slate-500 shadow-black text-amber-400'
                      }`}
                    >
                      {piece.includes('king') ? '👑' : ''}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
