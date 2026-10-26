import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Home, 
  Users, 
  ShieldAlert, 
  HeartHandshake, 
  Sparkles, 
  Flame, 
  Store, 
  GraduationCap, 
  Briefcase, 
  Brain, 
  Compass, 
  Scale, 
  Receipt, 
  Lock, 
  BookOpen, 
  Smartphone, 
  WifiOff, 
  CheckCircle2, 
  Globe2,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { AppLanguage, TRANSLATIONS, APP_LANGUAGES } from '../i18n/translations';
import { UserProfile } from './AuthModal';
import { OneWorldLogo } from './OneWorldLogo';

export type HouseId = 
  | 'h1'  // የሁሉም የጋራ ቤት
  | 'h2'  // የስጋ ዘመድ ቤት
  | 'h3'  // የባለስልጣን ቤት
  | 'h4'  // የሚስጥር ቤት
  | 'h5'  // የሰርግ ቤት
  | 'h6'  // የእምነት ቤት
  | 'h7'  // የደህንነት አስጠባቂ ቤት
  | 'h8'  // የታለንት ሾው ቤት
  | 'h9'  // የማስታወቂያና የገበያ ቤት
  | 'h10' // የትምህርት ቤት
  | 'h11' // ተቋማዊ ስልጠና መስጫ አዳራሽ
  | 'h12' // የምክርና ሳይኮሎጂ ትሪትመንት ቤት
  | 'h13' // የድለላና ፈላጊ/ተፈላጊ ቤት
  | 'h14' // የአቤቱታና የዳኝነት ቤት
  | 'h15'; // የአገልግሎት ክፍያ ቤት

interface MasterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeHouse: HouseId;
  onSelectHouse: (id: HouseId) => void;
  currentLang: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
  onOpenBuilderVault: () => void;
  onOpenCharter: () => void;
  onInstallPwa: () => void;
  isInstallable: boolean;
}

export const MasterDrawer: React.FC<MasterDrawerProps> = ({
  isOpen,
  onClose,
  activeHouse,
  onSelectHouse,
  currentLang,
  onLanguageChange,
  user,
  onOpenAuth,
  onOpenBuilderVault,
  onOpenCharter,
  onInstallPwa,
  isInstallable
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const t = TRANSLATIONS[currentLang];

  if (!isOpen) return null;

  const housesList: { id: HouseId; num: number; icon: any; title: string; desc: string; tag: string }[] = [
    { id: 'h1', num: 1, icon: Home, title: t.houses.h1.title, desc: t.houses.h1.desc, tag: 'ክፍት' },
    { id: 'h2', num: 2, icon: Users, title: t.houses.h2.title, desc: t.houses.h2.desc, tag: 'ውልድና' },
    { id: 'h3', num: 3, icon: ShieldAlert, title: t.houses.h3.title, desc: t.houses.h3.desc, tag: 'መሪነት' },
    { id: 'h4', num: 4, icon: HeartHandshake, title: t.houses.h4.title, desc: t.houses.h4.desc, tag: 'ሚስጥር' },
    { id: 'h5', num: 5, icon: Sparkles, title: t.houses.h5.title, desc: t.houses.h5.desc, tag: 'ሰርግ' },
    { id: 'h6', num: 6, icon: BookOpen, title: t.houses.h6.title, desc: t.houses.h6.desc, tag: 'እምነት' },
    { id: 'h7', num: 7, icon: ShieldCheck, title: t.houses.h7.title, desc: t.houses.h7.desc, tag: 'ደህንነት' },
    { id: 'h8', num: 8, icon: Flame, title: t.houses.h8.title, desc: t.houses.h8.desc, tag: 'ታለንት' },
    { id: 'h9', num: 9, icon: Store, title: t.houses.h9.title, desc: t.houses.h9.desc, tag: 'ገበያ' },
    { id: 'h10', num: 10, icon: GraduationCap, title: t.houses.h10.title, desc: t.houses.h10.desc, tag: 'ትምህርት' },
    { id: 'h11', num: 11, icon: Briefcase, title: t.houses.h11.title, desc: t.houses.h11.desc, tag: 'ስልጠና' },
    { id: 'h12', num: 12, icon: Brain, title: t.houses.h12.title, desc: t.houses.h12.desc, tag: 'ሳይኮሎጂ' },
    { id: 'h13', num: 13, icon: Compass, title: t.houses.h13.title, desc: t.houses.h13.desc, tag: 'ድለላ' },
    { id: 'h14', num: 14, icon: Scale, title: t.houses.h14.title, desc: t.houses.h14.desc, tag: 'ዳኝነት' },
    { id: 'h15', num: 15, icon: Receipt, title: t.houses.h15.title, desc: t.houses.h15.desc, tag: 'ክፍያ' },
  ];

  const filteredHouses = housesList.filter(
    (h) =>
      h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(h.num).includes(searchQuery)
  );

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      {/* Left Drawer Panel */}
      <div className="relative w-full max-w-sm sm:max-w-md bg-[#0d111d] border-r border-slate-800 h-full flex flex-col z-10 shadow-2xl overflow-hidden animate-slideRight">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#0f1422] flex items-center justify-between">
          <OneWorldLogo size="sm" showText={true} />

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card & Auth */}
        <div className="p-4 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-emerald-600 flex items-center justify-center text-slate-950 font-bold text-xs shadow-md">
              {user?.fullName.charAt(0) || 'ዘ'}
            </div>
            <div>
              <div className="text-xs font-bold text-white truncate max-w-[150px]">
                {user?.fullName || 'ዘበነ አስፍዬ'}
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold block">
                {user?.roleTitle || 'የመድረኩ መስራች'}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenAuth();
            }}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold rounded-lg border border-slate-700 cursor-pointer"
          >
            መገለጫ (Profile)
          </button>
        </div>

        {/* Search Bar for 15 Houses */}
        <div className="p-3 border-b border-slate-800 bg-[#0d111d]">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="ቤቶችን በስም ወይም በቁጥር ፈልግ (1-15)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* 15 Houses List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            15ቱ ዋና ዋና ቤቶች በቅደም ተከተል (Houses 1-15)
          </div>

          {filteredHouses.map((house) => {
            const Icon = house.icon;
            const isSelected = activeHouse === house.id;

            return (
              <button
                key={house.id}
                onClick={() => {
                  onSelectHouse(house.id);
                  onClose();
                }}
                className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500/60 shadow-md ring-1 ring-amber-500/30'
                    : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {house.num}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white truncate max-w-[200px]">
                      {house.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 line-clamp-1 max-w-[210px]">
                      {house.desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-bold text-slate-500 bg-slate-950/70 px-1.5 py-0.5 rounded border border-slate-800">
                    {house.tag}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Drawer Actions */}
        <div className="p-3 border-t border-slate-800 bg-[#0f1422] space-y-2">
          {/* Builder Secret Vault (PIN 2026) */}
          <button
            onClick={() => {
              onClose();
              onOpenBuilderVault();
            }}
            className="w-full flex items-center justify-between p-2.5 bg-amber-950/30 hover:bg-amber-950/50 border border-amber-600/40 rounded-xl text-xs font-bold text-amber-300 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>የገንቢው ሚስጥራዊ ካዝና (PIN 2026)</span>
            </div>
            <span className="text-[10px] font-mono bg-amber-900/60 px-1.5 py-0.5 rounded">
              CBE 1000167413618
            </span>
          </button>

          {/* Founding Charter */}
          <button
            onClick={() => {
              onClose();
              onOpenCharter();
            }}
            className="w-full flex items-center gap-2 p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 cursor-pointer transition-colors"
          >
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>የመድረኩ ህግ፣ ደንብና አመሰራረት (Charter)</span>
          </button>

          {/* Install PWA Button */}
          {isInstallable && (
            <button
              onClick={onInstallPwa}
              className="w-full flex items-center justify-center gap-2 p-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer transition-colors"
            >
              <Smartphone className="w-4 h-4" />
              <span>መተግበሪያውን ወደ ስልክ ጫን (Install PWA)</span>
            </button>
          )}

          {/* Offline Ready Indicator */}
          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3 h-3" />
              ከኢንተርኔት ውጭ ይሰራል (Offline Ready)
            </span>
            <span>መስራች፡ ዘበነ አስፍዬ (2026)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
