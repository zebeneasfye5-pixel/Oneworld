import React from 'react';
import { RoomOccupant, VirtualGift } from '../types';
import { VIRTUAL_GIFTS } from '../data/initialData';
import { X, Gift, Sparkles, CheckCircle2 } from 'lucide-react';

interface GiftModalProps {
  recipient: RoomOccupant | null;
  userBalanceETB: number;
  isOpen: boolean;
  onClose: () => void;
  onSendGift: (gift: VirtualGift, recipient: RoomOccupant) => void;
}

export const GiftModal: React.FC<GiftModalProps> = ({
  recipient,
  userBalanceETB,
  isOpen,
  onClose,
  onSendGift
}) => {
  if (!isOpen || !recipient) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#121829] border border-slate-700/80 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-1.5">
              የክብር ስጦታ መላኪያ
            </h3>
            <p className="text-xs text-slate-400">
              ለተናጋሪው፡ <span className="text-amber-300 font-semibold">{recipient.name}</span> (ወንበር #{recipient.seatNumber})
            </p>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 mb-4 flex items-center justify-between text-xs">
          <span className="text-slate-400">የእርስዎ የሂሳብ ቀሪ፡</span>
          <span className="font-bold text-emerald-400">{userBalanceETB.toLocaleString()} ብር</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          {VIRTUAL_GIFTS.map((gift) => {
            const canAfford = userBalanceETB >= gift.priceETB;
            return (
              <button
                key={gift.id}
                disabled={!canAfford}
                onClick={() => onSendGift(gift, recipient)}
                className={`flex flex-col items-center text-center p-3.5 rounded-xl border transition-all cursor-pointer ${
                  canAfford
                    ? 'bg-slate-800/50 hover:bg-amber-950/20 border-slate-700 hover:border-amber-500/50 hover:scale-[1.02]'
                    : 'bg-slate-900/30 border-slate-800 opacity-50 cursor-not-allowed'
                }`}
              >
                <span className="text-3xl mb-1.5">{gift.icon}</span>
                <span className="text-xs font-bold text-slate-200">{gift.nameAm}</span>
                <span className="text-[10px] text-slate-400">{gift.nameEn}</span>
                <div className="mt-2 text-xs font-semibold text-amber-400">
                  {gift.priceETB} ብር
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-[11px] text-slate-400 text-center">
          * ከስጦታው ዋጋ 85% ለተናጋሪው ገቢ ሲሆን፣ 10% ለባንክ ዋስትና እና 5% ለገንቢው ተቆጣቢ ፈንድ በቀጥታ ይመደባል።
        </p>
      </div>
    </div>
  );
};
