import React, { useState } from 'react';
import { BookOpen, Heart, Sparkles, Volume2, ShieldCheck, Users } from 'lucide-react';
import { speakText } from '../../services/speechService';

interface FaithGroup {
  id: string;
  nameAm: string;
  nameEn: string;
  symbol: string;
  membersCount: number;
  currentLesson: string;
  scriptureVerse: string;
  audioNarrationText: string;
  teacher: string;
}

export const HouseFaith: React.FC = () => {
  const [faithGroups] = useState<FaithGroup[]>([
    {
      id: 'fg-1',
      nameAm: 'የኦርቶዶክስ እምነት ትምህርት ቤት',
      nameEn: 'Orthodox Sacred Fellowship & Studies',
      symbol: '☦️',
      membersCount: 4820,
      currentLesson: 'ስለ ፍቅር፣ ስለ ትህትና እና ስለ መልካም ስነምግባር በቅዱሳት መጻሕፍት',
      scriptureVerse: '"ፍቅር ይታገሣል፥ ቸርነትንም ያደርጋል፤ ፍቅር አይቀናም፥ ፍቅር አይመካም፥ አይታበይም።" (፩ኛ ቆሮንቶስ 13:4)',
      audioNarrationText: 'ፍቅር ይታገሳል፣ ቸርነትንም ያደርጋል። የሰው ልጅ እርስ በእርሱ በፍቅርና በሰላም ሲኖር የአምላክ በረከት ይበዛል።',
      teacher: 'መምህር ተስፋዬ ገብረ'
    },
    {
      id: 'fg-2',
      nameAm: 'የእስልምና እውቀትና የሰላም ማዕከል',
      nameEn: 'Islamic Wisdom, Peace & Quranic Studies',
      symbol: '☪️',
      membersCount: 4210,
      currentLesson: 'የሰው ልጆች እኩልነት፣ ሰላም እና ለድሆች አዛኝ መሆን',
      scriptureVerse: '"አላህ ፍትህን፣ መልካም ስራን እና ለዘመዶች መለገስን ያዛል..." (አል-ናሕል: 90)',
      audioNarrationText: 'አላህ ፍትህን፣ መልካም ስራን እና ለዘመዶች መለገስን ያዛል። የሰው ልጆች በሙሉ እኩል ናቸው።',
      teacher: 'ሼክ መሀመድ አል-አሚን'
    },
    {
      id: 'fg-3',
      nameAm: 'የወንጌላውያን አማኞች የህብረት ቤት',
      nameEn: 'Evangelical & Protestant Fellowship of Faith',
      symbol: '✝️',
      membersCount: 3890,
      currentLesson: 'እምነት በተግባር፡ ማህበረሰብን በመልካም ስራ ማገልገል',
      scriptureVerse: '"መልካሙን ስራችሁን አይተው በሰማያት ያለውን አባታችሁን እንዲያከብሩ ብርሃናችሁ በሰው ፊት ይብራ።" (ማቴዎስ 5:16)',
      audioNarrationText: 'መልካሙን ስራችሁን አይተው በሰማያት ያለውን አባታችሁን እንዲያከብሩ ብርሃናችሁ በሰው ፊት ይብራ።',
      teacher: 'ፓስተር ዳንኤል ከበደ'
    },
    {
      id: 'fg-4',
      nameAm: 'የካቶሊክና የሁሉም እምነቶች የጋራ ሰላም አዳራሽ',
      nameEn: 'Catholic & Universal Interfaith Peace Agora',
      symbol: '🕊️',
      membersCount: 2450,
      currentLesson: 'የአለም አቀፍ የሰው ልጆች ወንድማማችነትና የጋራ ሰላም ግንባታ',
      scriptureVerse: '"ሰላምን የሚያደርጉ ብፁዓን ናቸው፥ የእግዚአብሔር ልጆች ይባላሉና።"',
      audioNarrationText: 'ሰላምን የሚያደርጉ ብፁዓን ናቸው፣ የእግዚአብሔር ልጆች ይባላሉና።',
      teacher: 'አባ ዮሴፍ ተክሌ'
    }
  ]);

  const [selectedGroup, setSelectedGroup] = useState<FaithGroup>(faithGroups[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-950/40 via-amber-950/30 to-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-lg">
            6
          </div>
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              የእምነት ቤት (Faith, Interfaith & Sacred Study Hall)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              ሁሉም እምነቶች እንደየእምነታቸው ተመዝግበው በየራሳቸው ግሩፕ የሚማማሩበት፣ ሰላምንና መልካም ስነምግባርን የሚገነቡበት መንፈሳዊ ማዕከል
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-600/40 px-3 py-1.5 rounded-xl text-xs text-emerald-300 font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>የእምነት እኩልነትና የጋራ ሰላም የተጠበቀበት</span>
        </div>
      </div>

      {/* Faith Groups Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {faithGroups.map((fg) => {
          const isSelected = selectedGroup.id === fg.id;
          return (
            <button
              key={fg.id}
              onClick={() => setSelectedGroup(fg)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                isSelected
                  ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg ring-1 ring-emerald-500/40'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{fg.symbol}</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {fg.membersCount.toLocaleString()} አባላት
                </span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">{fg.nameAm}</h4>
                <p className="text-[10px] text-slate-400 line-clamp-1">{fg.nameEn}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Study Chamber for Selected Faith */}
      <div className="bg-[#101524] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedGroup.symbol}</span>
              <h3 className="text-base font-extrabold text-white">
                {selectedGroup.nameAm}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              አስተማሪ፡ <strong className="text-emerald-400">{selectedGroup.teacher}</strong> · {selectedGroup.nameEn}
            </p>
          </div>

          <button
            onClick={() => speakText(selectedGroup.audioNarrationText, 'am')}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>የትምህርቱን ቃል በድምፅ አዳምጡ</span>
          </button>
        </div>

        {/* Current Lesson & Scripture */}
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3">
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            የዛሬው መንፈሳዊ ትምህርት፡ {selectedGroup.currentLesson}
          </div>
          <blockquote className="p-4 rounded-xl bg-slate-950/70 border-l-4 border-emerald-500 text-sm text-slate-200 italic leading-relaxed">
            {selectedGroup.scriptureVerse}
          </blockquote>
          <p className="text-xs text-slate-400 leading-relaxed">
            ይህ ትምህርት የሰው ልጆች በምድር ላይ በፍቅር፣ በእውነትና በመተሳሰብ እንዲኖሩ የሚያስተምር ሲሆን አባላት በነፃነት ጥያቄዎቻቸውን እያቀረቡ የሚወያዩበት ነው።
          </p>
        </div>
      </div>
    </div>
  );
};
