import React, { useState } from 'react';
import { Receipt, Zap, Droplets, Bus, Smartphone, Building2, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface UtilityService {
  id: string;
  name: string;
  category: 'መብራት' | 'ውሃ' | 'ትራንስፖርት' | 'ቴሌኮም' | 'ታክስ';
  icon: any;
  provider: string;
  sampleCustomerNumber: string;
  standardAmountETB: number;
}

interface HouseUtilityPaymentsProps {
  userBalanceETB: number;
  onPayBill: (amount: number, billName: string) => boolean;
}

export const HouseUtilityPayments: React.FC<HouseUtilityPaymentsProps> = ({
  userBalanceETB,
  onPayBill
}) => {
  const [services] = useState<UtilityService[]>([
    {
      id: 'ut-1',
      name: 'የመብራት አገልግሎት ክፍያ (Electric Utility)',
      category: 'መብራት',
      icon: Zap,
      provider: 'የኢትዮጵያ ኤሌክትሪክ አገልግሎት (EEU)',
      sampleCustomerNumber: 'EEU-982144',
      standardAmountETB: 450
    },
    {
      id: 'ut-2',
      name: 'የንፁህ መጠጥ ውሃ ክፍያ (Water & Sewerage)',
      category: 'ውሃ',
      icon: Droplets,
      provider: 'የውሃና ፍሳሽ ባለስልጣን (AAWSA)',
      sampleCustomerNumber: 'WTR-772910',
      standardAmountETB: 280
    },
    {
      id: 'ut-3',
      name: 'የትራንስፖርትና ነዳጅ ክፍያ (Transport & Fuel)',
      category: 'ትራንስፖርት',
      icon: Bus,
      provider: 'የከተማ ፈጣን አውቶቡስና ምድር ባቡር (Anbessa / Sheger)',
      sampleCustomerNumber: 'TRN-554109',
      standardAmountETB: 350
    },
    {
      id: 'ut-4',
      name: 'የኢትዮ ቴሌኮም ድምፅና ኢንተርኔት (Ethio Telecom Postpaid)',
      category: 'ቴሌኮም',
      icon: Smartphone,
      provider: 'ኢትዮ ቴሌኮም (Ethio Telecom)',
      sampleCustomerNumber: '0911234567',
      standardAmountETB: 650
    }
  ]);

  const [selectedService, setSelectedService] = useState<UtilityService>(services[0]);
  const [customerNumber, setCustomerNumber] = useState(services[0].sampleCustomerNumber);
  const [billAmount, setBillAmount] = useState<number>(services[0].standardAmountETB);
  const [selectedPaymentGateway, setSelectedPaymentGateway] = useState<'CBE' | 'TELEBIRR' | 'AWASH'>('CBE');
  const [lastReceipt, setLastReceipt] = useState<{ txId: string; amount: number; service: string } | null>(null);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (billAmount <= 0) return;

    if (userBalanceETB < billAmount) {
      alert(`ይቅርታ፣ በቂ ሂሳብ የለዎትም። የሚያስፈልገው፡ ${billAmount.toLocaleString()} ብር`);
      return;
    }

    const success = onPayBill(billAmount, `የአገልግሎት ክፍያ (${selectedService.name})`);
    if (!success) return;

    const receipt = {
      txId: `NBE-BILL-${Date.now().toString().slice(-8)}`,
      amount: billAmount,
      service: selectedService.name
    };

    setLastReceipt(receipt);
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-lg">
            15
          </div>
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              የአገልግሎት ክፍያ ቤት (Utility Bills & Global Financial Gateway)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              የመብራት፣ የውሃ፣ የትራንስፖርትና የቴሌኮም አገልግሎቶችን በማንኛውም አለም አቀፍ የባንክና ቴሌብር ሲስተም ያለምንም እንከን በቀጥታ የሚከፍሉበት ማዕከል
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-600/40 px-3.5 py-1.5 rounded-xl text-xs text-emerald-300 font-bold">
          <Building2 className="w-4 h-4 text-emerald-400" />
          <span>ከኢትዮጵያ ንግድ ባንክ (CBE) እና ቴሌብር ጋር በቀጥታ የተሳሰረ</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Service Selector */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
            የአገልግሎት ዘርፍ ይምረጡ
          </h3>

          <div className="space-y-2">
            {services.map((svc) => {
              const Icon = svc.icon;
              const isSelected = selectedService.id === svc.id;

              return (
                <div
                  key={svc.id}
                  onClick={() => {
                    setSelectedService(svc);
                    setCustomerNumber(svc.sampleCustomerNumber);
                    setBillAmount(svc.standardAmountETB);
                    setLastReceipt(null);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-950/40 border-emerald-500/60 shadow-md ring-1 ring-emerald-500/40'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{svc.name}</h4>
                      <span className="text-[10px] text-slate-400">{svc.provider}</span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-emerald-400">
                    {svc.standardAmountETB} ብር
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bill Payment Form & Receipt */}
        <div className="lg:col-span-2 bg-[#101524] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-extrabold text-white">
                የ{selectedService.name} ክፍያ ማረጋገጫ
              </h3>
              <p className="text-xs text-slate-400">{selectedService.provider}</p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">የእርስዎ የሂሳብ ቀሪ፡</span>
              <strong className="text-emerald-400 font-bold text-xs">{userBalanceETB.toLocaleString()} ብር</strong>
            </div>
          </div>

          <form onSubmit={handlePay} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  የደንበኛ / የቆጣሪ ቁጥር (Customer Number) *
                </label>
                <input
                  type="text"
                  required
                  value={customerNumber}
                  onChange={(e) => setCustomerNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  የክፍያ መጠን (በብር) *
                </label>
                <input
                  type="number"
                  required
                  min={10}
                  value={billAmount}
                  onChange={(e) => setBillAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>
            </div>

            {/* Payment Gateway */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                የክፍያ አገናኝ ባንክ / ቴሌብር
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPaymentGateway('CBE')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                    selectedPaymentGateway === 'CBE'
                      ? 'bg-purple-950/70 border-purple-500 text-purple-200'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  የኢትዮጵያ ንግድ ባንክ (CBE)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPaymentGateway('TELEBIRR')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                    selectedPaymentGateway === 'TELEBIRR'
                      ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  ቴሌብር (Telebirr)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPaymentGateway('AWASH')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                    selectedPaymentGateway === 'AWASH'
                      ? 'bg-blue-950/70 border-blue-500 text-blue-200'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  አዋሽ ባንክ (Awash)
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 text-white font-black rounded-xl text-xs shadow-lg shadow-emerald-950 cursor-pointer transition-all"
            >
              ክፍያውን አረጋግጥና ፈፅም (Pay {billAmount.toLocaleString()} ETB)
            </button>
          </form>

          {/* Success Receipt */}
          {lastReceipt && (
            <div className="p-4 bg-emerald-950/40 border-2 border-emerald-500/60 rounded-2xl space-y-2 text-xs animate-fadeIn">
              <div className="flex items-center justify-between text-emerald-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  ክፍያው በስኬት ተጠናቋል!
                </span>
                <span className="font-mono">{lastReceipt.txId}</span>
              </div>
              <p className="text-slate-300">
                የ{lastReceipt.amount.toLocaleString()} ብር ክፍያ ለ{lastReceipt.service} በ{selectedPaymentGateway} በኩል ተከናውኗል።
              </p>
              <div className="text-[10px] text-slate-400 pt-1">
                የኤሌክትሮኒክ ደረሰኝ ቁጥር፡ <strong>{lastReceipt.txId}</strong> · በብሄራዊ ባንክ መመሪያ የተረጋገጠ
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
