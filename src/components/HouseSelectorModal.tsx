import React from 'react';
import { 
  Home, 
  Users, 
  ShieldAlert, 
  HeartHandshake, 
  Sparkles, 
  BookOpen, 
  ShieldCheck, 
  Flame, 
  Store, 
  GraduationCap, 
  Briefcase, 
  Brain, 
  Compass, 
  Scale, 
  Receipt,
  Globe2,
  X,
  ChevronRight
} from 'lucide-react';
import { HouseId } from './MasterDrawer';
import { AppLanguage, TRANSLATIONS } from '../i18n/translations';

interface HouseSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeHouse: HouseId;
  onSelectHouse: (houseId: HouseId) => void;
  currentLang: AppLanguage;
}

export const HouseSelectorModal: React.FC<HouseSelectorModalProps> = ({
  isOpen,
  onClose,
  activeHouse,
  onSelectHouse,
  currentLang
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.am;

  const houseList: { id: HouseId; num: number; icon: any; title: string; desc: string; tag: string }[] = [
    { id: 'h1', num: 1, icon: Home, title: t.houses.h1.title, desc: t.houses.h1.desc, tag: 'ክፉት አዳራሽ' },
    { id: 'h2', num: 2, icon: Users, title: t.houses.h2.title, desc: t.houses.h2.desc, tag: 'የስጋ ዘመድ' },
    { id: 'h3', num: 3, icon: ShieldAlert, title: t.houses.h3.title, desc: t.houses.h3.desc, tag: 'ባለስልጣን' },
    { id: 'h4', num: 4, icon: HeartHandshake, title: t.houses.h4.title, desc: t.houses.h4.desc, tag: 'የሚስጥር ቤት (2)' },
    { id: 'h5', num: 5, icon: Sparkles, title: t.houses.h5.title, desc: t.houses.h5.desc, tag: 'የሰርግ ቤት' },
    { id: 'h6', num: 6, icon: BookOpen, title: t.houses.h6.title, desc: t.houses.h6.desc, tag: 'የእምነት ቤት' },
    { id: 'h7', num: 7, icon: ShieldCheck, title: t.houses.h7.title, desc: t.houses.h7.desc, tag: 'የደህንነት ቤት' },
    { id: 'h8', num: 8, icon: Flame, title: t.houses.h8.title, desc: t.houses.h8.desc, tag: 'ታለንት ሾው' },
    { id: 'h9', num: 9, icon: Store, title: t.houses.h9.title, desc: t.houses.h9.desc, tag: 'ማስታወቂያና ገበያ' },
    { id: 'h10', num: 10, icon: GraduationCap, title: t.houses.h10.title, desc: t.houses.h10.desc, tag: 'ትምህርት ቤት' },
    { id: 'h11', num: 11, icon: Briefcase, title: t.houses.h11.title, desc: t.houses.h11.desc, tag: 'ተቋማዊ ስልጠና' },
    { id: 'h12', num: 12, icon: Brain, title: t.houses.h12.title, desc: t.houses.h12.desc, tag: 'ሳይኮሎጂና ጤና' },
    { id: 'h13', num: 13, icon: Compass, title: t.houses.h13.title, desc: t.houses.h13.desc, tag: 'ድለላና ፈላጊ' },
    { id: 'h14', num: 14, icon: Scale, title: t.houses.h14.title, desc: t.houses.h14.desc, tag: 'አቤቱታና ዳኝነት' },
    { id: 'h15', num: 15, icon: Receipt, title: t.houses.h15.title, desc: t.houses.h15.desc, tag: 'የአገልግሎት ክፍያ' },
    { id: 'h16', num: 16, icon: Globe2, title: t.houses.h16.title, desc: t.houses.h16.desc, tag: 'ቱሪዝም እና ቅርስ' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0f1422] border-2 border-amber-500/50 rounded-3xl w-full max-w-4xl p-6 md:p-8 shadow-2xl relative flex flex-col max-h-[85vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-900 cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 pb-4 mb-4 border-b border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-2xl flex-shrink-0 shadow-lg shadow-amber-500/10">
            🏛️
          </div>
          <div>
            <h3 className="text-base md:text-lg font-black text-white">
              የOneworld 16ቱ ሉዓላዊ ቤቶች ማዕከል (16 Sovereign Houses Hub)
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              ለመግባት የሚፈልጉትን ቤት ይምረጡ — እያንዳንዱ ቤት ራሱን የቻለ የቪዲዮ መድረክና አባልነት አለው
            </p>
          </div>
        </div>

        {/* 16 Houses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto pr-2 scrollbar-none flex-1">
          {houseList.map((h) => {
            const Icon = h.icon;
            const isSelected = activeHouse === h.id;

            return (
              <div
                key={h.id}
                onClick={() => {
                  onSelectHouse(h.id);
                  onClose();
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400'
                    : 'bg-slate-950/80 border-slate-800 hover:border-amber-500/50 hover:bg-slate-900'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold ${
                  isSelected ? 'bg-slate-950 text-amber-400' : 'bg-slate-900 border border-slate-700 text-amber-400'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className={`text-xs font-mono font-black uppercase tracking-wider ${
                      isSelected ? 'text-slate-950 font-black' : 'text-amber-400 font-bold'
                    }`}>
                      #{h.num} · {h.tag}
                    </span>
                    <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-slate-950 font-black' : 'text-slate-400'}`} />
                  </div>
                  <h4 className={`text-sm sm:text-base font-black truncate ${isSelected ? 'text-slate-950' : 'text-white'}`}>
                    {h.title}
                  </h4>
                  <p className={`text-xs sm:text-sm line-clamp-1 mt-0.5 ${isSelected ? 'text-slate-900 font-bold' : 'text-slate-300 font-medium'}`}>
                    {h.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
