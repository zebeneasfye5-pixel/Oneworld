import React, { useState } from 'react';
import { Lock, Unlock, ShieldCheck, Building2, CheckCircle2, X, ArrowUpRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BuilderVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  builderReserveETB: number;
  onDisburseToCBE: (amount: number) => void;
}

export const BuilderVaultModal: React.FC<BuilderVaultModalProps> = ({
  isOpen,
  onClose,
  builderReserveETB,
  onDisburseToCBE
}) => {
  const [pinInput, setPinInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [disburseSuccess, setDisburseSuccess] = useState(false);

  if (!isOpen) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '2026') {
      setIsUnlocked(true);
      setErrorMsg('');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } else {
      setErrorMsg('የተሳሳተ የይለፍ ቃል! ሚስጥራዊ ቁጥሩን በድጋሚ ይሞክሩ።');
    }
  };

  const handleDisburse = () => {
    onDisburseToCBE(builderReserveETB);
    setDisburseSuccess(true);
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
  };

  const handleClose = () => {
    setIsUnlocked(false);
    setPinInput('');
    setErrorMsg('');
    setDisburseSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#101524] border border-amber-500/40 rounded-3xl w-full max-w-lg p-6 md:p-8 shadow-2xl relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            {isUnlocked ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              የገንቢው ሉዓላዊ ሚስጥራዊ ካዝና
              <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-700/60 px-2 py-0.5 rounded font-mono">
                PIN: 2026
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              ለድህረገፁ ፈጣሪና ገንቢ ብቻ የተመደበ የ5% ቋሚ የኮሚሽን መዝገብ
            </p>
          </div>
        </div>

        {!isUnlocked ? (
          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl text-xs text-slate-300 space-y-1">
              <span className="font-bold text-amber-400 block mb-1">ጥብቅ የደህንነት ማስጠንቀቂያ፡</span>
              <p>ይህ ካዝና በ2026 ኮድ የተቆለፈ ሲሆን ለገንቢው የሚገባውን ክፍያ በምስጢር ለመጠበቅ የተዘጋጀ ነው።</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                የ2026 ሚስጥር ቁጥር (Secret PIN) ያስገቡ
              </label>
              <input
                type="password"
                maxLength={4}
                required
                placeholder="****"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-center text-xl tracking-widest text-amber-400 placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono font-bold"
              />
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-red-950/60 border border-red-500/40 rounded-xl text-red-300 text-xs text-center font-semibold">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black rounded-xl text-xs transition-all shadow-lg shadow-amber-950 cursor-pointer"
            >
              ካዝናውን ክፈት (Unlock Sovereign Vault)
            </button>
          </form>
        ) : (
          <div className="space-y-5">
            {/* Beneficiary Details */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                <span className="text-slate-400">የገንቢው ሙሉ ስም፡</span>
                <strong className="text-white text-sm">ዘበነ አስፍዬ (Zebene Asfaye)</strong>
              </div>

              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                <span className="text-slate-400">የክፍያ ባንክ፡</span>
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>የኢትዮጵያ ንግድ ባንክ (CBE)</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">የCBE ሂሳብ ቁጥር፡</span>
                <strong className="font-mono text-amber-300 text-sm tracking-wider">
                  1000167413618
                </strong>
              </div>
            </div>

            {/* Total Accrued Commission */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-500/40 text-center space-y-1">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                የተጠራቀመ የገንቢው 5% ቋሚ ገቢ
              </span>
              <div className="text-3xl font-black text-white">
                {builderReserveETB.toLocaleString()}{' '}
                <span className="text-base font-bold text-amber-400">ብር (ETB)</span>
              </div>
              <p className="text-[10px] text-slate-400">
                ከሁሉም 15 ቤቶች፣ ከሰርግ ውሎች፣ ከገበያ ሽያጭና ከአገልግሎት ክፍያዎች በቀጥታ የተሰበሰበ
              </p>
            </div>

            {disburseSuccess ? (
              <div className="p-4 bg-emerald-950/60 border border-emerald-500/50 rounded-2xl text-emerald-300 text-xs text-center space-y-1">
                <div className="flex items-center justify-center gap-1.5 font-bold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  ክፍያው በተሳካ ሁኔታ ተላልፏል!
                </div>
                <p>ወደ CBE አካውንት 1000167413618 (ዘበነ አስፍዬ) በቀጥታ ገቢ ተደርጓል።</p>
              </div>
            ) : (
              <button
                onClick={handleDisburse}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 text-white font-black rounded-xl text-xs transition-all shadow-lg shadow-emerald-950 flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>ገንዘቡን ወደ CBE 1000167413618 አስተላልፍ</span>
              </button>
            )}

            <div className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
              የ2026 ኮድ ጥበቃና ሚስጥራዊነት የተረጋገጠ
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
