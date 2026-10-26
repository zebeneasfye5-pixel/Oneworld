import React from 'react';
import { LEGAL_TREATIES } from '../data/initialData';
import { Scale, ShieldCheck, Globe2, FileText, CheckCircle2, Lock } from 'lucide-react';

export const LegalGovernance: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-black text-white">
              የአለም ሀገረ-መንግስታት ህግ፣ ሉዓላዊ ስምምነቶችና የትስስር መመሪያዎች
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            መድረኩ ከተባበሩት መንግስታት፣ ከአፍሪካ ህብረት እና ከኢትዮጵያ ህጎችና የባንክ መመሪያዎች ጋር ሙሉ ትስስርና ህጋዊ ማረጋገጫ ያለው ነው
          </p>
        </div>

        <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-xs text-indigo-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>100% በህግ የተረጋገጠ አለም አቀፍ ተገዥነት</span>
        </div>
      </div>

      {/* Treaties Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {LEGAL_TREATIES.map((treaty, idx) => (
          <div
            key={idx}
            className="p-5 bg-[#101626] border border-slate-800 rounded-2xl shadow-xl space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  {treaty.status}
                </span>
                <Lock className="w-3.5 h-3.5 text-slate-500" />
              </div>

              <h3 className="text-sm font-extrabold text-white leading-snug">
                {treaty.titleAm}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 italic">
                {treaty.titleEn}
              </p>
            </div>

            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300">
              <span className="font-semibold text-indigo-300 block mb-0.5">የህግ ማዕቀፉና ጥበቃው፡</span>
              {treaty.scope}
            </div>
          </div>
        ))}
      </div>

      {/* Sovereign Framework Explanation */}
      <div className="p-6 bg-[#101626] border border-slate-800 rounded-2xl shadow-2xl space-y-3">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-amber-400" />
          የመድረኩ ሉዓላዊ መርሆዎች እና የህግ ዋስትናዎች
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          1. <strong>የቋንቋ እኩልነት መብት፡</strong> ማንኛውም የአለም ዜጋ በራሱ አፍ መፍቻ ቋንቋ ሀሳቡን የመግለፅና የሌሎችን ንግግር ወዲያውኑ በራሱ ቋንቋ የመስማት አለም አቀፍ የዲጂታል ሰብአዊ መብት ዋስትና አለው።
        </p>
        <p className="text-xs text-slate-300 leading-relaxed">
          2. <strong>የፋይናንስ ግልፅነትና የ10% የባንክ ዋስትና፡</strong> በእያንዳንዱ የገንዘብ እንቅስቃሴ ላይ 10% ለባንኮች የዋስትና ፈንድ እና 5% ለገንቢው የልማት ፈንድ እንዲመደብ መደረጉ የገንዘብ ብክነትንና የዋጋ ግሽበትን ለመከላከል በኢትዮጵያ ብሄራዊ ባንክ መመሪያ መሰረት የተተገበረ ነው።
        </p>
        <p className="text-xs text-slate-300 leading-relaxed">
          3. <strong>የአባላት ራስን የማስተዳደር ነፃነት፡</strong> እያንዳንዱ አባል የራሱን የግል አዳራሽ (Sub-Hall) ከፍቶ በስሩ ተጠቃሚዎችን በነፃነት የማስተማርና የማወያየት ሙሉ ስልጣን ተሰጥቶታል።
        </p>
      </div>
    </div>
  );
};
