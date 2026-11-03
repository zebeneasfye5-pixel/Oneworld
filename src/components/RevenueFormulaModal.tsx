import React from 'react';
import { Scale, Users, Building2, ShieldCheck, HeartHandshake, X } from 'lucide-react';
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
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-900 cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 flex-shrink-0 shadow-lg shadow-amber-500/10">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-white">
              የOneworld ሉዓላዊ የገቢ ክፍፍል ቀመር
            </h3>
            <p className="text-xs text-amber-400 font-bold mt-0.5">
              60% አባል · 10% ባንክ · 10% ገንቢ (ዘበነ አስፍዬ) · 20% ማህበረሰብ
            </p>
          </div>
        </div>

        {/* 4 Pillars of Revenue Distribution */}
        <div className="space-y-3.5 text-xs text-slate-300">
          {/* 60% Members */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0 font-black text-sm">
              60%
            </div>
            <div>
              <h4 className="font-black text-white text-sm flex items-center gap-1.5">
                <Users className="w-4 h-4 text-amber-400" />
                ቀጥታ ለአባላትና ለተሳታፊዎች (Direct to Members)
              </h4>
              <p className="mt-1 text-slate-300 leading-relaxed text-[11px]">
                አባላት በ16ቱ ቤቶች በሚያደርጉት ንቁ ተሳትፎ፣ በውይይት፣ አዳዲስ አባላትን በመመዝገብ፣ በገበያ ሽያጭና በታለንት ውድድሮች ለሚያገኙት ገቢ 60% ያለምንም መሸራረፍ ቀጥታ ለራሳቸው ይከፈላቸዋል።
              </p>
            </div>
          </div>

          {/* 10% Bank Reserve */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-200 flex-shrink-0 font-black text-sm">
              10%
            </div>
            <div>
              <h4 className="font-black text-white text-sm flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-amber-400" />
                የባንኮች ፈሳሽነትና ግብይት ዋስትና (Banking Reserve)
              </h4>
              <p className="mt-1 text-slate-300 leading-relaxed text-[11px]">
                በኢትዮጵያ ንግድ ባንክና በብሄራዊ ባንክ መመሪያ መሰረት የፈሳሽነትና የግብይት ዋስትና እንዲሆን 10% በመጠባበቂያነት ይቀመጣል።
              </p>
            </div>
          </div>

          {/* 10% Developer / Founder */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/40 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 flex-shrink-0 font-black text-sm">
              10%
            </div>
            <div>
              <h4 className="font-black text-white text-sm flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                ለገንቢውና ለመድረኩ መስራች (ዘበነ አስፍዬ - Zebene Asfye)
              </h4>
              <p className="mt-1 text-slate-300 leading-relaxed text-[11px]">
                የመድረኩ ፈጣሪና ገንቢ ዘበነ አስፍዬ (Zebene Asfye) የፈጠራ መብትና ቀጣይነት ያለው የስርዓት ጥገና ዋስትና እንዲሆን 10% ቋሚ ገቢ በቀጥታ ወደ CBE ሂሳብ 1000167413618 ይተላለፋል።
              </p>
            </div>
          </div>

          {/* 20% Community */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-200 flex-shrink-0 font-black text-sm">
              20%
            </div>
            <div>
              <h4 className="font-black text-white text-sm flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-amber-400" />
                ለማህበረሰብ እቁብ፣ ሎተሪና በጎ አድራጎት (Community Solidarity)
              </h4>
              <p className="mt-1 text-slate-300 leading-relaxed text-[11px]">
                ለማህበረሰብ የጋራ ፈንድ፣ ለድሃ ድሆች፣ ለወላጅ አልባ ህፃናት እና ለዲጂታል እቁብና ሎተሪ ማጠናከሪያ 20% ሙሉ በሙሉ ይውላል።
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black rounded-xl text-xs transition cursor-pointer shadow-md shadow-amber-950/40"
          >
            ተረድቻለሁ (Understood)
          </button>
        </div>
      </div>
    </div>
  );
};
