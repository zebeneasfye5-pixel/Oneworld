import React from 'react';
import { Scale, Users, Building2, ShieldCheck, X } from 'lucide-react';
import { AppLanguage, TRANSLATIONS } from '../i18n/translations';

interface RevenueFormulaModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang?: AppLanguage;
}

export const RevenueFormulaModal: React.FC<RevenueFormulaModalProps> = ({
  isOpen,
  onClose,
  currentLang = 'am'
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.am;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0f1422] border-2 border-amber-500/50 rounded-3xl w-full max-w-xl p-6 md:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-300 hover:text-white p-1 rounded-lg bg-slate-900 cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 flex-shrink-0 shadow-lg shadow-amber-500/10">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-amber-400">
              የOneworld ሉዓላዊ የገቢ ክፍፍል ቀመር
            </h3>
            <p className="text-sm text-white font-bold mt-1">
              80% ለባለቤቱ/ለአባሉ · 10% ለባንኩ · 10% ለገንቢው (ዘበነ አስፍዬ)
            </p>
          </div>
        </div>

        {/* 3 Strict Pillars of Revenue Distribution (80 / 10 / 10) */}
        <div className="space-y-4 text-xs text-white">
          {/* 80% Owner / Member */}
          <div className="p-4 rounded-2xl bg-slate-950 border-2 border-emerald-500/60 flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-300 flex-shrink-0 font-black text-lg">
              80%
            </div>
            <div>
              <h4 className="font-black text-emerald-400 text-base flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-400" />
                ቀጥታ ለባለቤቱና ለአባሉ (Direct to Owner / Member)
              </h4>
              <p className="mt-1.5 text-white leading-relaxed text-xs">
                ማንኛውም አባል ወይም ይዘት ፈጣሪ በ16ቱ ቤቶች፣ በንግድ፣ በስልጠና፣ በእቁብና በታለንት ውድድሮች ለሚያገኘው ገቢ ሰማንያ በመቶው (80%) ሙሉ በሙሉ ቀጥታ ወደ ግል ዋሌቱ ይገባል።
              </p>
            </div>
          </div>

          {/* 10% Banking & Payment Processing */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-700 flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-white flex-shrink-0 font-black text-lg">
              10%
            </div>
            <div>
              <h4 className="font-black text-white text-base flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-amber-400" />
                የባንኮች ፈሳሽነትና ግብይት ዋስትና (Banking & Settlement)
              </h4>
              <p className="mt-1.5 text-white leading-relaxed text-xs">
                በአለምአቀፍና በሀገር ውስጥ የክፍያ ስርአቶች (Chapa, PayPal, Stripe እና የባንክ ኔትወርክ) ደህንነቱ የተጠበቀ ፈሳሽነት ዋስትና ሆኖ 10% ይያዛል።
              </p>
            </div>
          </div>

          {/* 10% Developer / Platform Architect: Zebene Asfye */}
          <div className="p-4 rounded-2xl bg-slate-950 border-2 border-amber-500/50 flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 flex-shrink-0 font-black text-lg">
              10%
            </div>
            <div>
              <h4 className="font-black text-amber-400 text-base flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                ለድህረ ገፁ ገንቢ (ዘበነ አስፍዬ - Zebene Asfye)
              </h4>
              <p className="mt-1.5 text-white leading-relaxed text-xs">
                የመድረኩ መስራችና መሀንዲስ ዘበነ አስፍዬ (Zebene Asfye) ሉዓላዊ የቴክኖሎጂ ፈጠራ፣ የአገልጋይ ደመና እና ቀጣይነት ያለው ሲስተም ጥገና 10% በራስ-ሰር ይደለደላል።
              </p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-white font-bold">
            የስሌት ቀመር፡ 80% ባለቤት + 10% ባንክ + 10% ገንቢ = 100%
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black rounded-xl cursor-pointer"
          >
            ተረድቻለሁ
          </button>
        </div>
      </div>
    </div>
  );
};
