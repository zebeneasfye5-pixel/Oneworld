import React, { useState } from 'react';
import { Trophy, RotateCcw, Swords, Shield, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SenterejChessGameProps {
  onEarnPrize: (amount: number, gameTitle: string) => void;
}

interface ChessPuzzle {
  id: number;
  titleAm: string;
  scenarioAm: string;
  opponentAm: string;
  stakeETB: number;
  prizeETB: number;
  fenHint: string;
  options: {
    moveNotation: string;
    descriptionAm: string;
    isCorrect: boolean;
    explanationAm: string;
  }[];
}

const SENTEREJ_PUZZLES: ChessPuzzle[] = [
  {
    id: 1,
    titleAm: 'የሰንጠረዥ የንጉስ ማፈን ዘዴ (Checkmate in 2)',
    scenarioAm: 'የጠላት ንጉስ በወታደሮቹ መካከል ታጥሯል። ፈረሰኛዎን (ፈረስ) ወይም ድርጅዎን (ንግስት) በመጠቀም በሁለት እርምጃ ንጉሱን ማፈን አለብዎት።',
    opponentAm: 'ሊቀ-ሊቃውንት ተክሌ (Master Tekle)',
    stakeETB: 100,
    prizeETB: 350,
    fenHint: '8/5k2/8/4N3/8/2Q5/8/4K3',
    options: [
      {
        moveNotation: '1. Nf7+ Kg8 2. Qh8#',
        descriptionAm: 'ፈረሱን ወደ f7 በመውሰድ ቼክ ማድረግና በመቀጠል ንግስትን ወደ h8 መጣል',
        isCorrect: true,
        explanationAm: 'ድንቅ ስልት! ንጉሱ ማምለጫ አጥቶ በሰንጠረዥ ታክቲክ ተማርኳል።'
      },
      {
        moveNotation: '1. Nd7 Kh8 2. Qf6',
        descriptionAm: 'ፈረሱን ወደ d7 ማፈግፈግ',
        isCorrect: false,
        explanationAm: 'ጠላት ወደ ደህና ስፍራ እንዲሸሽ እድል ሰጥተዋል።'
      },
      {
        moveNotation: '1. Qe5+ Kf8 2. Nd7+',
        descriptionAm: 'ንግስትን ወደ e5 ማንቀሳቀስ',
        isCorrect: false,
        explanationAm: 'ጠላት በመከላከሉ ስልቱን አክሽፎታል።'
      }
    ]
  },
  {
    id: 2,
    titleAm: 'የወረራ ጥቃት (Grand Werera Phase Tactical Strike)',
    scenarioAm: 'በጥንታዊው የኢትዮጵያ ሰንጠረዥ ሁለቱም ወገኖች በአንድ ጊዜ ፈጣን ወረራ ያካሂዳሉ። የመሀል ሜዳውን ለመቆጣጠር የትኛውን ሰራዊት ታሰልፋላችሁ?',
    opponentAm: 'ግራዝማች ደስታ (Grandmaster Desta)',
    stakeETB: 150,
    prizeETB: 500,
    fenHint: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R',
    options: [
      {
        moveNotation: 'Bxf7+ Kxf7 2. Ng5+ Ke8',
        descriptionAm: 'የንጉሱን ምሽግ በጳጳስ (ጳጳስ) መስበርና ፈረሰኛውን በወረራ ማስገባት',
        isCorrect: true,
        explanationAm: 'ፈጣን ድል! የጠላት ምሽግ ተሰባብሮ ንጉሱ ወደ መሀል ወጥቷል።'
      },
      {
        moveNotation: 'h3 h6 2. a3 a6',
        descriptionAm: 'ተጠባባቂ የመከላከያ እርምጃ መውሰድ',
        isCorrect: false,
        explanationAm: 'ወረራ ላይ ስንፍና አይፈቀድም፤ ጠላት ቀድሞዎታል።'
      },
      {
        moveNotation: 'Nbd2 d5',
        descriptionAm: 'ፈረሰኛውን ወደ ጎን መምራት',
        isCorrect: false,
        explanationAm: 'የመሀል ሜዳውን ለጠላት አሳልፈው ሰጥተዋል።'
      }
    ]
  },
  {
    id: 3,
    titleAm: 'የአለም አቀፍ ግራንድ ማስተር ፈተና (The Queen Sacrifice)',
    scenarioAm: 'የአለም አቀፍ ቼስ ፈተና፡ ድል ለመቀዳጀት ንግስትን (ድርጅ) መስዋዕት አድርገው የማት ጥቃት መፈጸም አለብዎት።',
    opponentAm: 'ግራንድ ማስተር ቪክቶር (GM Viktor)',
    stakeETB: 200,
    prizeETB: 800,
    fenHint: 'r1b2rk1/pp3ppp/2n5/1B1p4/3N4/2Q5/PPP2PPP/R3K2R',
    options: [
      {
        moveNotation: '1. Qxg7+ Kxg7 2. Nf5+ Kg8 3. Nh6#',
        descriptionAm: 'ንግስትን በg7 መስዋዕት አድርጎ በድርብ ፈረስ ጥቃት ንጉሱን ማፈን',
        isCorrect: true,
        explanationAm: 'አስደናቂ የግራንድ ማስተር ጥበብ! ንግስት ተሰጥቶ ንጉሱ በ3 እርምጃ ማት ሆኗል።'
      },
      {
        moveNotation: '1. O-O-O d4',
        descriptionAm: 'ወደኋላ ማፈግፈግና ረጅም ካስሊንግ ማድረግ',
        isCorrect: false,
        explanationAm: 'ወሳኙን የመስዋዕትነት ድል አምልጦዎታል።'
      },
      {
        moveNotation: '1. Bxc6 bxc6',
        descriptionAm: 'ጳጳሱን በፈረስ መለዋወጥ',
        isCorrect: false,
        explanationAm: 'ተራ ልውውጥ ነው፤ አሸናፊነት አያጎናፅፍም።'
      }
    ]
  }
];

export const SenterejChessGame: React.FC<SenterejChessGameProps> = ({ onEarnPrize }) => {
  const [currentPuzzleIdx, setCurrentPuzzleIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [resultStatus, setResultStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const [totalWon, setTotalWon] = useState(0);

  const puzzle = SENTEREJ_PUZZLES[currentPuzzleIdx];

  const handleSelectOption = (idx: number) => {
    if (resultStatus !== 'idle') return;
    setSelectedOptionIdx(idx);
    const chosen = puzzle.options[idx];

    if (chosen.isCorrect) {
      setResultStatus('success');
      setTotalWon((prev) => prev + puzzle.prizeETB);
      try {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      } catch {}
      onEarnPrize(puzzle.prizeETB, `የሰንጠረዥና የቼስ ግራንድ ማስተር ድል (${puzzle.titleAm})`);
    } else {
      setResultStatus('failed');
    }
  };

  const handleNextPuzzle = () => {
    setSelectedOptionIdx(null);
    setResultStatus('idle');
    setCurrentPuzzleIdx((prev) => (prev + 1) % SENTEREJ_PUZZLES.length);
  };

  const handleRetry = () => {
    setSelectedOptionIdx(null);
    setResultStatus('idle');
  };

  return (
    <div className="bg-[#0f1422] border-2 border-amber-500/40 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-2xl shadow-lg">
            ♟️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base md:text-lg font-black text-white">
                የኢትዮጵያ ሰንጠረዥና አለም አቀፍ ቼስ ውድድር
              </h3>
              <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full">
                ፈታኝ ታክቲክ
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              የአእምሮ ስልት፣ የወረራ ጥቃትና ትክክለኛውን እርምጃ በመምረጥ ከፍተኛ የገንዘብ ሽልማት ያሸንፉ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-amber-500/40">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-white">ያሸነፉት፡</span>
          <span className="text-xs font-black text-amber-400">{totalWon.toLocaleString()} ብር</span>
        </div>
      </div>

      {/* Main Chessboard Tactical Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Chess Arena & Puzzle Scenario */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-2xl bg-[#0a0d14] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                ፈተና {puzzle.id} ከ {SENTEREJ_PUZZLES.length}
              </span>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">ተጋጣሚ፡</span>
                <strong className="text-white">{puzzle.opponentAm}</strong>
              </div>
            </div>

            <h4 className="text-base font-black text-white">
              {puzzle.titleAm}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {puzzle.scenarioAm}
            </p>

            {/* Tactical 8x8 Visual Mini-Board Display */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-amber-500/30 flex flex-col items-center justify-center">
              <div className="text-[11px] font-bold text-amber-400 mb-2 font-mono flex items-center gap-1.5">
                <Swords className="w-3.5 h-3.5 text-amber-400" />
                የሰንጠረዥ ሜዳ አቀማመጥ (FEN Position)
              </div>
              <div className="grid grid-cols-8 gap-0.5 border-2 border-amber-500/60 rounded-xl overflow-hidden p-1 bg-amber-950/40 shadow-xl max-w-[280px] w-full aspect-square">
                {Array.from({ length: 64 }).map((_, idx) => {
                  const row = Math.floor(idx / 8);
                  const col = idx % 8;
                  const isBlack = (row + col) % 2 === 1;
                  // Pieces mock positions
                  let piece = '';
                  if (idx === 4) piece = '♚';
                  if (idx === 19) piece = '♘';
                  if (idx === 42) piece = '♛';
                  if (idx === 60) piece = '♔';
                  if (idx === 12 || idx === 13) piece = '♟';

                  return (
                    <div
                      key={idx}
                      className={`flex items-center justify-center text-lg select-none ${
                        isBlack ? 'bg-amber-900/60 text-amber-200' : 'bg-amber-100/20 text-white'
                      }`}
                    >
                      {piece}
                    </div>
                  );
                })}
              </div>
              <span className="text-[10px] text-slate-400 mt-2">
                ነጭ ይጀምራል · አሸናፊውን እርምጃ ይምረጡ
              </span>
            </div>
          </div>

          {/* Move Choices */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-300 block">
              የትኛውን ጥቃት ይመርጣሉ?
            </span>
            {puzzle.options.map((opt, optIdx) => {
              const isSelected = selectedOptionIdx === optIdx;
              let btnStyle = 'bg-slate-900/80 border-slate-800 text-slate-200 hover:border-amber-500/60 hover:bg-slate-900';
              if (isSelected && resultStatus === 'success') {
                btnStyle = 'bg-emerald-950 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/50';
              } else if (isSelected && resultStatus === 'failed') {
                btnStyle = 'bg-red-950 border-red-500 text-red-200 ring-2 ring-red-500/50';
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={resultStatus !== 'idle'}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${btnStyle}`}
                >
                  <div className="space-y-0.5">
                    <span className="font-mono font-black text-amber-400 text-xs block">
                      {opt.moveNotation}
                    </span>
                    <p className="text-xs font-medium text-slate-300">
                      {opt.descriptionAm}
                    </p>
                  </div>
                  {isSelected && resultStatus === 'success' && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Result Alert Box */}
          {resultStatus === 'success' && (
            <div className="p-4 bg-emerald-950/80 border border-emerald-500 rounded-2xl space-y-2 animate-fadeIn text-xs text-emerald-200">
              <div className="flex items-center gap-2 font-black text-emerald-400 text-sm">
                <Sparkles className="w-4 h-4" />
                አስደናቂ ድል! +{puzzle.prizeETB} ብር ተሸልመዋል!
              </div>
              <p>{puzzle.options[selectedOptionIdx!].explanationAm}</p>
              <button
                onClick={handleNextPuzzle}
                className="mt-2 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition cursor-pointer"
              >
                ቀጣይ ፈታኝ ውድድር (Next Challenge) →
              </button>
            </div>
          )}

          {resultStatus === 'failed' && (
            <div className="p-4 bg-red-950/80 border border-red-500 rounded-2xl space-y-2 animate-fadeIn text-xs text-red-200">
              <div className="font-black text-red-400 text-sm">
                የተሳሳተ እርምጃ! ንጉሱ አልተማረከም።
              </div>
              <p>{puzzle.options[selectedOptionIdx!].explanationAm}</p>
              <button
                onClick={handleRetry}
                className="mt-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>በድጋሚ ይሞክሩ</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Col: Stakes, Prize Card, and Rules */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 to-slate-950 border border-amber-500/50 text-center space-y-2">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
              የውድድሩ የገንዘብ ሽልማት
            </span>
            <div className="text-3xl font-black text-white">
              {puzzle.prizeETB.toLocaleString()}{' '}
              <span className="text-base text-amber-400 font-bold">ብር</span>
            </div>
            <p className="text-[11px] text-slate-300">
              ትክክለኛውን እርምጃ በመምረጥ ሽልማቱን ወዲያውኑ ወደ ባንክዎ ወይም ቴሌብር ያውጡ!
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#0a0d14] border border-slate-800 space-y-2.5 text-xs text-slate-300">
            <h5 className="font-bold text-white flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              የሰንጠረዥ ውድድር ህግና ደንብ
            </h5>
            <ul className="space-y-1.5 list-disc list-inside text-[11px] text-slate-400">
              <li>እያንዳንዱ ተወዳዳሪ በሰንጠረዥ ባህላዊ ወረራ እና በአለም አቀፍ ቼስ ህግ ይወዳደራል።</li>
              <li>ያሸነፉት ገንዘብ ያለምንም ተቀናሽ ቀጥታ በቴሌብር ወይም በባንክ ይከፈላል።</li>
              <li>በቀን ውስጥ እስከ 20 ፈታኝ ዙሮችን መጫወት ይቻላል።</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
