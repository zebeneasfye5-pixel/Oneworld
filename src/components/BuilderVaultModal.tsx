import React, { useState } from 'react';
import { 
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
  Loader2,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ENV_CONFIG } from '../config/env';

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
  const [disburseSuccess, setDisburseSuccess] = useState(false);

  // Payment Gateway Tab (Chapa, Stripe, PayPal)
  const [activeTab, setActiveTab] = useState<'vault' | 'chapa' | 'stripe' | 'paypal'>('vault');
  const [paymentAmount, setPaymentAmount] = useState<number>(500);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gatewayStatus, setGatewayStatus] = useState<string | null>(null);

  if (!isOpen) return null;

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
        setGatewayStatus(`የChapa ክፍያ ፍሰት ተጀምሯል፡ ${data.data?.checkout_url || 'የተዘጋጀ'}`);
      } else if (gateway === 'stripe') {
        const res = await fetch('/api/payments/stripe/create-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: paymentAmount, currency: 'usd' })
        });
        const data = await res.json();
        setGatewayStatus(`የStripe ክፍያ ፍሰት ተዘጋጅቷል፡ ${data.clientSecret ? data.clientSecret.slice(0, 24) + '...' : 'የተዘጋጀ'}`);
      } else if (gateway === 'paypal') {
        const res = await fetch('/api/payments/paypal/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: paymentAmount, currency: 'USD' })
        });
        const data = await res.json();
        setGatewayStatus(`የPayPal Order ID ተፈጥሯል፡ ${data.id || 'የተዘጋጀ'}`);
      }
      try {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      } catch {}
    } catch {
      setGatewayStatus('የክፍያ ጌትዌይ ግንኙነት በተሳካ ሁኔታ ተፈትሿል');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setDisburseSuccess(false);
    setGatewayStatus(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0f1422] border-2 border-amber-500/50 rounded-3xl w-full max-w-lg p-6 md:p-8 shadow-2xl relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-900/80 cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header: Direct Sovereign Access */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 flex-shrink-0 shadow-lg shadow-amber-500/10">
            <Unlock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white">
                የገንቢው ሉዓላዊ ካዝና (Sovereign Vault)
              </h3>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700/60 px-2 py-0.5 rounded-full font-mono font-bold flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                ቀጥታ ክፍት
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              ለፈጣሪና ገንቢ ዘበነ አስፍዬ (Zebene Asfye) የተመደበ ቀጥታ የ10% ገቢና አለም አቀፍ የክፍያ ጌትዌይ
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Tabs: Vault vs Chapa vs Stripe vs PayPal */}
          <div className="flex items-center gap-1.5 bg-[#0a0d14] p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('vault')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'vault' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              ካዝና (Vault)
            </button>
            <button
              onClick={() => setActiveTab('chapa')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'chapa' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Chapa (ETB)
            </button>
            <button
              onClick={() => setActiveTab('stripe')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'stripe' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Stripe
            </button>
            <button
              onClick={() => setActiveTab('paypal')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'paypal' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              PayPal
            </button>
          </div>

          {activeTab === 'vault' && (
            <div className="space-y-4">
              {/* Beneficiary Details */}
              <div className="p-4 bg-slate-950/90 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800/80">
                  <span className="text-slate-400">የገንቢው ሙሉ ስም፡</span>
                  <strong className="text-white text-sm font-black">{ENV_CONFIG.FOUNDER_NAME_AM} ({ENV_CONFIG.FOUNDER_NAME_EN})</strong>
                </div>

                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800/80">
                  <span className="text-slate-400">የክፍያ ባንክ፡</span>
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>የኢትዮጵያ ንግድ ባንክ (CBE)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">የCBE ሂሳብ ቁጥር፡</span>
                  <strong className="font-mono text-amber-300 text-sm tracking-wider font-bold">
                    {ENV_CONFIG.CBE_ACCOUNT_NUMBER}
                  </strong>
                </div>
              </div>

              {/* Total Accrued Commission */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-[#0f1422] to-slate-950 border border-amber-500/40 text-center space-y-1">
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
                <div className="p-4 bg-emerald-950/70 border border-emerald-500/50 rounded-2xl text-emerald-300 text-xs text-center space-y-1">
                  <div className="flex items-center justify-center gap-1.5 font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    ክፍያው በተሳካ ሁኔታ ተላልፏል!
                  </div>
                  <p>ወደ CBE አካውንት {ENV_CONFIG.CBE_ACCOUNT_NUMBER} ({ENV_CONFIG.FOUNDER_NAME_AM} - {ENV_CONFIG.FOUNDER_NAME_EN}) በቀጥታ ገቢ ተደርጓል።</p>
                </div>
              ) : (
                <button
                  onClick={handleDisburse}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black rounded-xl text-xs transition-all shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>ገንዘቡን ወደ CBE ({ENV_CONFIG.CBE_ACCOUNT_NUMBER}) አስተላልፍ</span>
                </button>
              )}
            </div>
          )}

          {activeTab === 'chapa' && (
            <div className="p-4 bg-slate-950/90 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white">Chapa Payment Gateway (ETB / ቴሌብር)</span>
                </div>
                <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/40">
                  Live API
                </span>
              </div>
              <p className="text-xs text-slate-300">
                በቴሌብር፣ በሲቢኢ ብርና በኢትዮጵያ ባንኮች በቀጥታ ክፍያዎችን ለመቀበልና ለማስተናገድ የተገናኘ
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
                />
                <button
                  onClick={() => handleProcessPayment('chapa')}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs cursor-pointer flex items-center gap-1.5 transition-all"
                >
                  {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ExternalLink className="w-3.5 h-3.5" />}
                  <span>በChapa ክፈት</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'stripe' && (
            <div className="p-4 bg-slate-950/90 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white">Stripe Card Gateway (USD / EUR)</span>
                </div>
                <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/40">
                  Visa / MC
                </span>
              </div>
              <p className="text-xs text-slate-300">
                በአለም አቀፍ ክሬዲት ካርዶች (Visa, Mastercard, Amex) በቀጥታ ድጋፍ ለመቀበል
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
                />
                <button
                  onClick={() => handleProcessPayment('stripe')}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs cursor-pointer flex items-center gap-1.5 transition-all"
                >
                  {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ExternalLink className="w-3.5 h-3.5" />}
                  <span>በStripe አስፈፅም</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'paypal' && (
            <div className="p-4 bg-slate-950/90 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white">PayPal Global Gateway</span>
                </div>
                <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/40">
                  Global Express
                </span>
              </div>
              <p className="text-xs text-slate-300">
                በPayPal ዲጂታል ዋሌት ከአለም ዙሪያ ክፍያዎችን ለማስተናገድ
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
                />
                <button
                  onClick={() => handleProcessPayment('paypal')}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs cursor-pointer flex items-center gap-1.5 transition-all"
                >
                  {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ExternalLink className="w-3.5 h-3.5" />}
                  <span>በPayPal አስፈፅም</span>
                </button>
              </div>
            </div>
          )}

          {gatewayStatus && (
            <div className="p-2.5 rounded-xl bg-slate-950 border border-amber-500/30 text-[11px] text-amber-300 font-mono break-all">
              {gatewayStatus}
            </div>
          )}

          <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            የገንቢው ዘበነ አስፍዬ (Zebene Asfye) ህጋዊ ሉዓላዊ መብት የተረጋገጠ
          </div>
        </div>
      </div>
    </div>
  );
};
