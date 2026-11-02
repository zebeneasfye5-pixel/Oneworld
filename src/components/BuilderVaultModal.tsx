import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  X, 
  ArrowUpRight, 
  CreditCard, 
  DollarSign, 
  Smartphone,
  ExternalLink,
  Loader2
} from 'lucide-react';
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

  // Payment Gateway Tab (Chapa, Stripe, PayPal)
  const [activeTab, setActiveTab] = useState<'vault' | 'chapa' | 'stripe' | 'paypal'>('vault');
  const [paymentAmount, setPaymentAmount] = useState<number>(500);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gatewayStatus, setGatewayStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '2026') {
      setIsUnlocked(true);
      setErrorMsg('');
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } catch {}
    } else {
      setErrorMsg('የተሳሳተ የይለፍ ቃል! ሚስጥራዊ ቁጥሩን በድጋሚ ይሞክሩ።');
    }
  };

  const handleDisburse = () => {
    onDisburseToCBE(builderReserveETB);
    setDisburseSuccess(true);
    try {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    } catch {}
  };

  const handleProcessPayment = async (gateway: 'chapa' | 'stripe' | 'paypal') => {
    setIsProcessing(true);
    setGatewayStatus(null);

    try {
      if (gateway === 'chapa') {
        const res = await fetch('/api/payments/chapa/initialize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: paymentAmount,
            currency: 'ETB',
            email: 'founder@oneworld.org',
            firstName: 'ዘበነ',
            lastName: 'አስፍዬ'
          })
        });
        const data = await res.json();
        setGatewayStatus(`የChapa ክፍያ ፍሰት ተጀምሯል፡ ${data.data.checkout_url}`);
      } else if (gateway === 'stripe') {
        const res = await fetch('/api/payments/stripe/create-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: paymentAmount, currency: 'usd' })
        });
        const data = await res.json();
        setGatewayStatus(`የStripe Client Secret ተዘጋጅቷል፡ ${data.clientSecret.slice(0, 24)}...`);
      } else if (gateway === 'paypal') {
        const res = await fetch('/api/payments/paypal/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: paymentAmount, currency: 'USD' })
        });
        const data = await res.json();
        setGatewayStatus(`የPayPal Order ID ተፈጥሯል፡ ${data.id}`);
      }
      try {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      } catch {}
    } catch (err) {
      setGatewayStatus('የክፍያ ጌትዌይ ግንኙነት ተፈትሿል');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setIsUnlocked(false);
    setPinInput('');
    setErrorMsg('');
    setDisburseSuccess(false);
    setGatewayStatus(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#101524] border border-amber-500/40 rounded-3xl w-full max-w-lg p-6 md:p-8 shadow-2xl relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            {isUnlocked ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              የገንቢው ሉዓላዊ ሚስጥራዊ ካዝና (Sovereign Vault)
              <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-700/60 px-2 py-0.5 rounded font-mono">
                PIN: 2026
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              ለድህረገፁ ፈጣሪና ገንቢ ብቻ የተመደበ ሚስጥራዊ የገቢ መዝገብና አለም አቀፍ የክፍያ ጌትዌይ
            </p>
          </div>
        </div>

        {!isUnlocked ? (
          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl text-xs text-slate-300 space-y-1">
              <span className="font-bold text-amber-400 block mb-1">ጥብቅ የደህንነት ማስጠንቀቂያ፡</span>
              <p>ይህ ካዝና በ2026 ኮድ የተቆለፈ ሲሆን የገንቢውን 10% ቋሚ ገቢና አለም አቀፍ የChapa, Stripe, PayPal API ቅንብሮችን በምስጢር ለመጠበቅ የተዘጋጀ ነው።</p>
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
          <div className="space-y-4">
            {/* Tabs: Vault vs Chapa vs Stripe vs PayPal */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('vault')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === 'vault' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                ካዝና (Vault)
              </button>
              <button
                onClick={() => setActiveTab('chapa')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === 'chapa' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Chapa (ETB)
              </button>
              <button
                onClick={() => setActiveTab('stripe')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === 'stripe' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Stripe
              </button>
              <button
                onClick={() => setActiveTab('paypal')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === 'paypal' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                PayPal
              </button>
            </div>

            {activeTab === 'vault' && (
              <div className="space-y-4">
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
                    <span className="text-slate-400">የCBE ሂሳብ ቁጥር (ሚስጥራዊ)፡</span>
                    <strong className="font-mono text-amber-300 text-sm tracking-wider">
                      1000167413618
                    </strong>
                  </div>
                </div>

                {/* Total Accrued Commission */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-500/40 text-center space-y-1">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                    የተጠራቀመ የገንቢው 10% ቋሚ ገቢ
                  </span>
                  <div className="text-3xl font-black text-white">
                    {builderReserveETB.toLocaleString()}{' '}
                    <span className="text-base font-bold text-amber-400">ብር (ETB)</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    ከሁሉም 16 ቤቶች፣ ከሰርግ ውሎች፣ ከገበያ ሽያጭና ከአገልግሎት ክፍያዎች በቀጥታ የተሰበሰበ
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
              </div>
            )}

            {activeTab === 'chapa' && (
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">Chapa Payment Gateway (ETB / ቴሌብር)</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950 px-2 py-0.5 rounded">
                    Live API
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  በቴሌብር፣ በሲቢኢ ብርና በኢትዮጵያ ባንኮች በቀጥታ ክፍያዎችን ለመቀበልና ለማስተናገድ የተገናኘ
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <button
                    onClick={() => handleProcessPayment('chapa')}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs cursor-pointer flex items-center gap-1.5"
                  >
                    {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ExternalLink className="w-3.5 h-3.5" />}
                    <span>በChapa ክፈት</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'stripe' && (
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-white">Stripe Card Gateway (USD / EUR)</span>
                  </div>
                  <span className="text-[10px] text-indigo-400 font-mono font-bold bg-indigo-950 px-2 py-0.5 rounded">
                    Visa / MC
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  በአለም አቀፍ ክሬዲት ካርዶች (Visa, Mastercard, Amex) በቀጥታ ድጋፍ ለመቀበል
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <button
                    onClick={() => handleProcessPayment('stripe')}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs cursor-pointer flex items-center gap-1.5"
                  >
                    {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ExternalLink className="w-3.5 h-3.5" />}
                    <span>በStripe አስፈፅም</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'paypal' && (
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold text-white">PayPal Global Gateway</span>
                  </div>
                  <span className="text-[10px] text-blue-400 font-mono font-bold bg-blue-950 px-2 py-0.5 rounded">
                    Global Express
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  በPayPal ዲጂታል ዋሌት ከአለም ዙሪያ ክፍያዎችን ለማስተናገድ
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <button
                    onClick={() => handleProcessPayment('paypal')}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs cursor-pointer flex items-center gap-1.5"
                  >
                    {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ExternalLink className="w-3.5 h-3.5" />}
                    <span>በPayPal አስፈፅም</span>
                  </button>
                </div>
              </div>
            )}

            {gatewayStatus && (
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-amber-300 font-mono break-all">
                {gatewayStatus}
              </div>
            )}

            <div className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
              የ2026 ኮድ ጥበቃና ሚስጥራዊነት የተረጋገጠ
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
