import React, { useState } from 'react';
import { EqubPool, LotteryDraw } from '../types';
import { INITIAL_EQUB_POOLS, INITIAL_LOTTERY } from '../data/initialData';
import confetti from 'canvas-confetti';
import { 
  Coins, 
  Ticket, 
  Sparkles, 
  ShieldCheck, 
  Trophy, 
  Users, 
  Calendar, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Percent
} from 'lucide-react';

interface EqubAndLotteryProps {
  userBalanceETB: number;
  onDeductBalance: (amount: number, reason: string) => boolean;
  onCreditBalance: (amount: number, reason: string) => void;
}

export const EqubAndLottery: React.FC<EqubAndLotteryProps> = ({
  userBalanceETB,
  onDeductBalance,
  onCreditBalance
}) => {
  const [equbPools, setEqubPools] = useState<EqubPool[]>(INITIAL_EQUB_POOLS);
  const [selectedPoolId, setSelectedPoolId] = useState<string>(INITIAL_EQUB_POOLS[0].id);
  const [lottery, setLottery] = useState<LotteryDraw>(INITIAL_LOTTERY);
  const [isDrawingEqub, setIsDrawingEqub] = useState(false);
  const [equbWinnerAlert, setEqubWinnerAlert] = useState<{ name: string; amount: number } | null>(null);
  const [lotteryAlert, setLotteryAlert] = useState<string | null>(null);

  const activePool = equbPools.find((p) => p.id === selectedPoolId) || equbPools[0];

  // Join / Contribute to Equb
  const handleContributeEqub = () => {
    if (userBalanceETB < activePool.amountPerMember) {
      alert(`ይቅርታ፣ በቂ ሂሳብ የለዎትም። የሚያስፈልገው፡ ${activePool.amountPerMember} ብር ነው።`);
      return;
    }

    const deducted = onDeductBalance(
      activePool.amountPerMember,
      `የእቁብ መዋጮ ክፍያ (${activePool.titleAm})`
    );
    if (!deducted) return;

    // Check if user is already a member
    const isAlreadyMember = activePool.members.some((m) => m.id === 'user-self');
    if (!isAlreadyMember) {
      const updated = equbPools.map((pool) => {
        if (pool.id === activePool.id) {
          return {
            ...pool,
            members: [
              ...pool.members,
              {
                id: 'user-self',
                name: 'እርስዎ (You)',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
                country: 'ኢትዮጵያ',
                joinedAt: 'ዛሬ',
                hasWon: false
              }
            ]
          };
        }
        return pool;
      });
      setEqubPools(updated);
    }

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    alert(`የእቁብ መዋጮዎ ${activePool.amountPerMember} ብር በተሳካ ሁኔታ ገቢ ተደርጓል!`);
  };

  // Automated Equb Draw
  const handleDrawEqub = () => {
    if (isDrawingEqub) return;
    setIsDrawingEqub(true);
    setEqubWinnerAlert(null);

    // Eligible non-winners
    const eligibleMembers = activePool.members.filter((m) => !m.hasWon);
    const chosenWinner = eligibleMembers.length > 0 
      ? eligibleMembers[Math.floor(Math.random() * eligibleMembers.length)]
      : activePool.members[0];

    setTimeout(() => {
      setIsDrawingEqub(false);
      const totalCollected = activePool.amountPerMember * activePool.members.length;
      const bankCut = Math.round(totalCollected * 0.10);
      const devCut = Math.round(totalCollected * 0.05);
      const winnerNet = totalCollected - bankCut - devCut;

      setEqubWinnerAlert({
        name: chosenWinner.name,
        amount: winnerNet
      });

      confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });

      // If user won
      if (chosenWinner.id === 'user-self') {
        onCreditBalance(winnerNet, `የእቁብ እጣ አሸናፊ ሽልማት (${activePool.titleAm})`);
      }

      // Update pool record
      setEqubPools((prev) =>
        prev.map((p) => {
          if (p.id === activePool.id) {
            return {
              ...p,
              currentRound: Math.min(p.currentRound + 1, p.totalRounds),
              members: p.members.map((m) =>
                m.id === chosenWinner.id ? { ...m, hasWon: true, wonCycleRound: p.currentRound } : m
              ),
              pastWinners: [
                {
                  round: p.currentRound,
                  winnerName: chosenWinner.name,
                  amount: winnerNet,
                  date: 'ዛሬ'
                },
                ...p.pastWinners
              ]
            };
          }
          return p;
        })
      );
    }, 2500);
  };

  // Buy Lottery Ticket
  const handleBuyLotteryTicket = () => {
    if (userBalanceETB < lottery.ticketPrice) {
      alert(`ይቅርታ፣ በቂ ሂሳብ የለዎትም። የቲኬት ዋጋ፡ ${lottery.ticketPrice} ብር`);
      return;
    }

    const deducted = onDeductBalance(lottery.ticketPrice, 'የታላቁ የበጎ አድራጎት ሎተሪ ቲኬት ግዢ');
    if (!deducted) return;

    const newTicketCode = `ALEM-${Math.floor(100000 + Math.random() * 900000)}`;
    setLottery((prev) => ({
      ...prev,
      participantsCount: prev.participantsCount + 1,
      jackpotAmount: prev.jackpotAmount + prev.ticketPrice,
      userTickets: [newTicketCode, ...prev.userTickets]
    }));

    confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    setLotteryAlert(`ቲኬት ቁጥር ${newTicketCode} በተሳካ ሁኔታ ተገዝቷል! መልካም እድል!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-amber-950/40 via-emerald-950/30 to-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-black text-white">
              አለም አቀፍ የዲጂታል እቁብ እና ዘመናዊ ሎተሪ ማዕከል
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            የኢትዮጵያን ባህላዊ የቁጠባ እሴት (እቁብ) በዲጂታል ቴክኖሎጂ በማዘመን ሉዓላዊ የፋይናንስ አንድነትን መገንባት
          </p>
        </div>

        {/* Transparent Formula Badge */}
        <div className="p-2.5 bg-amber-950/30 border border-amber-600/40 rounded-xl text-[11px] text-amber-200">
          <div className="flex items-center gap-1 font-bold text-amber-400 mb-0.5">
            <Percent className="w-3.5 h-3.5" />
            የገቢና የዋስትና ቀመር (85% / 10% / 5%)
          </div>
          <p className="text-[10px] text-slate-400">
            85% ለአሸናፊው · 10% ለባንኮች ዋስትና · 5% የገንቢው ተቆጣቢ ፈንድ
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Equb Pools & Live Interactive Draw */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pool Selection Tabs */}
          <div className="flex items-center gap-2">
            {equbPools.map((pool) => (
              <button
                key={pool.id}
                onClick={() => setSelectedPoolId(pool.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedPoolId === pool.id
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {pool.titleAm}
              </button>
            ))}
          </div>

          {/* Active Pool Overview Card */}
          <div className="bg-[#101626] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400">
                  {activePool.cycleType}
                </span>
                <h3 className="text-base font-extrabold text-white">
                  {activePool.titleAm}
                </h3>
                <p className="text-xs text-slate-400">
                  ቀጣይ እጣ ማውጫ፡ <strong className="text-amber-300">{activePool.nextDrawDate}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleContributeEqub}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-950 cursor-pointer"
                >
                  እቁብ ጣል ({activePool.amountPerMember.toLocaleString()} ብር)
                </button>
                <button
                  disabled={isDrawingEqub}
                  onClick={handleDrawEqub}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 rounded-xl text-xs font-black transition-all shadow-md shadow-amber-950 cursor-pointer"
                >
                  {isDrawingEqub ? 'እጣ እየወጣ ነው...' : 'እጣ አውጣ (Draw Winner)'}
                </button>
              </div>
            </div>

            {/* Winner Announcement Notification */}
            {equbWinnerAlert && (
              <div className="p-4 bg-emerald-950/40 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs flex items-center justify-between animate-fadeIn">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <div>
                    <span className="font-bold">የዙሩ አሸናፊ፡ {equbWinnerAlert.name}!</span>
                    <p className="text-[11px] text-emerald-300">
                      የተከፈለ የተጣራ ድምር፡ <strong>{equbWinnerAlert.amount.toLocaleString()} ብር</strong>
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400">85% ተከፍሏል</span>
              </div>
            )}

            {/* Financial Split Breakdown Visual */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-emerald-400 font-bold">ለአሸናፊው የሚከፈል (85%)</span>
                <div className="text-base font-black text-white mt-1">
                  {activePool.netWinnerPayout85Percent.toLocaleString()} {activePool.currency}
                </div>
                <p className="text-[10px] text-slate-400">ሙሉ የተጣራ ገቢ</p>
              </div>

              <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-amber-400 font-bold">ለባንኮች ዋስትና (10%)</span>
                <div className="text-base font-black text-white mt-1">
                  {activePool.reserveBank10Percent.toLocaleString()} {activePool.currency}
                </div>
                <p className="text-[10px] text-slate-400">የብሄራዊ ባንክ ተቆጣቢ</p>
              </div>

              <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-indigo-400 font-bold">የገንቢው ተቆጣቢ (5%)</span>
                <div className="text-base font-black text-white mt-1">
                  {activePool.reserveBuilder5Percent.toLocaleString()} {activePool.currency}
                </div>
                <p className="text-[10px] text-slate-400">የስርአት ልማት ፈንድ</p>
              </div>
            </div>

            {/* Members in active pool */}
            <div>
              <div className="flex items-center justify-between mb-2 text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-slate-400" />
                  የእቁብ አባላት ({activePool.members.length} / {activePool.maxMembers})
                </span>
                <span className="text-[11px] text-slate-400">
                  ዙር፡ <strong>{activePool.currentRound}</strong> / {activePool.totalRounds}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {activePool.members.map((member) => (
                  <div
                    key={member.id}
                    className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-bold text-white text-[11px] truncate max-w-[90px]">
                          {member.name}
                        </div>
                        <span className="text-[9px] text-slate-500">{member.country}</span>
                      </div>
                    </div>
                    {member.hasWon ? (
                      <span className="text-[9px] font-bold text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded">
                        ዙር {member.wonCycleRound} አሸንፏል
                      </span>
                    ) : (
                      <span className="text-[9px] text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded">
                        በተራ ላይ
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Past Winners list */}
            {activePool.pastWinners.length > 0 && (
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-xs font-bold text-slate-300 mb-2 block">
                  የቀደሙ ዙር አሸናፊዎች (Past Winners History)
                </span>
                <div className="space-y-1.5">
                  {activePool.pastWinners.map((w, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-slate-950/40 border border-slate-800 flex items-center justify-between text-xs text-slate-400"
                    >
                      <span>ዙር {w.round}፡ <strong className="text-white">{w.winnerName}</strong></span>
                      <span className="text-emerald-400 font-bold">{w.amount.toLocaleString()} ብር</span>
                      <span className="text-[10px] text-slate-500">{w.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Grand Fortune Charity Lottery */}
        <div className="bg-[#101626] border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Ticket className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-sm font-extrabold text-white">
                  የአለም አንድ የበጎ አድራጎት ሎተሪ
                </h3>
                <p className="text-[11px] text-slate-400">
                  {lottery.drawDate}
                </p>
              </div>
            </div>

            {/* Jackpot Banner */}
            <div className="my-4 p-4 rounded-xl bg-gradient-to-br from-amber-950/60 via-slate-900 to-amber-950/30 border border-amber-500/40 text-center space-y-1">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                የታላቁ ጃክፖት ሽልማት (Grand Jackpot)
              </span>
              <div className="text-2xl font-black text-amber-300">
                {lottery.jackpotAmount.toLocaleString()} {lottery.currency}
              </div>
              <p className="text-[10px] text-slate-400">
                የተሳታፊዎች ብዛት፡ {lottery.participantsCount.toLocaleString()}
              </p>
            </div>

            {/* Alert */}
            {lotteryAlert && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs mb-3">
                {lotteryAlert}
              </div>
            )}

            {/* Buy Ticket Button */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">የ1 ቲኬት ዋጋ፡</span>
                <span className="font-bold text-white">{lottery.ticketPrice} ብር</span>
              </div>

              <button
                onClick={handleBuyLotteryTicket}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs transition-all shadow-lg shadow-amber-950 cursor-pointer"
              >
                የእድል ቲኬት ቁረጥ (Buy Ticket)
              </button>
            </div>

            {/* My Active Tickets */}
            <div className="mt-5 pt-4 border-t border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-300 block">
                የእርስዎ የገዟቸው ቲኬቶች ({lottery.userTickets.length})
              </span>
              <div className="space-y-1 max-h-36 overflow-y-auto no-scrollbar">
                {lottery.userTickets.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-2 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between text-xs"
                  >
                    <span className="font-mono text-amber-300 font-bold">{t}</span>
                    <span className="text-[10px] text-slate-400">በእጣ ውስጥ</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent winners */}
          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            <span className="font-semibold text-slate-300 block mb-1">የቅርብ አሸናፊዎች፡</span>
            {lottery.recentWinners.map((w, idx) => (
              <div key={idx} className="flex justify-between py-0.5">
                <span>{w.winnerName} ({w.ticket})</span>
                <span className="text-emerald-400 font-bold">{w.prize.toLocaleString()} ብር</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
