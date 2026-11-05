import React from 'react';
import { 
  Building2, 
  Coins, 
  Gamepad2, 
  Landmark, 
  BookOpen, 
  Scale, 
  ChevronDown
} from 'lucide-react';
import { HouseId } from './MasterDrawer';
import { AppLanguage, TRANSLATIONS } from '../i18n/translations';

export type MainNavigationTarget = 
  | HouseId 
  | 'equb' 
  | 'games' 
  | 'bank';

interface NavigationProps {
  activeTarget: MainNavigationTarget;
  onSelectTarget: (target: MainNavigationTarget) => void;
  currentLang: AppLanguage;
  onOpenHouseHub: () => void;
  onOpenCharter: () => void;
  onOpenRevenueFormula: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTarget,
  onSelectTarget,
  currentLang,
  onOpenHouseHub,
  onOpenCharter,
  onOpenRevenueFormula
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.am;

  // Active house label helper
  const isHouseActive = activeTarget.startsWith('h');
  const activeHouseLabel = isHouseActive 
    ? (t.houses as any)[activeTarget]?.title || `ቤት ${activeTarget.toUpperCase()}`
    : t.houses.h1.title;

  return (
    <nav className="w-full bg-[#0c0f17] border-b border-slate-800/80 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 py-2 overflow-x-auto no-scrollbar">
        {/* Left: Collapsed 16 Houses Hub Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenHouseHub}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-sm sm:text-base font-black transition-all cursor-pointer shadow-md whitespace-nowrap ${
              isHouseActive
                ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400 shadow-amber-500/20'
                : 'bg-slate-900 text-amber-300 hover:bg-slate-800 border border-amber-500/50'
            }`}
            title="16ቱን ሉዓላዊ ቤቶች በአንድ ላይ ይምረጡ"
          >
            <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-current" />
            <span className="truncate max-w-[220px]">{isHouseActive ? activeHouseLabel : '🏛️ 16ቱ ቤቶች (Houses Hub)'}</span>
            <ChevronDown className="w-4 h-4 opacity-90" />
          </button>
        </div>

        {/* Center & Right: Platform Governance, Rules, Revenue Formula, Games, Equb, Bank */}
        <div className="flex items-center gap-2 flex-nowrap">
          {/* Charter, Bylaws & Rules Modal Trigger */}
          <button
            onClick={onOpenCharter}
            className="h-11 flex items-center gap-2 px-4 bg-slate-900/90 hover:bg-slate-800 text-slate-100 hover:text-white border border-slate-700/80 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap shadow-sm"
            title="የመድረኩ ሉዓላዊ ቻርተር፣ ህግና ደንብ መመሪያ"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>መመሪያና ህግ (Rules)</span>
          </button>

          {/* Revenue Formula 80/10/10 Modal Trigger */}
          <button
            onClick={onOpenRevenueFormula}
            className="h-11 flex items-center gap-2 px-4 bg-slate-900/90 hover:bg-slate-800 text-slate-100 hover:text-white border border-slate-700/80 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap shadow-sm"
            title="የገቢ ክፍፍል ቀመር (80% አባል · 10% ባንክ · 10% ገንቢ ዘበነ አስፍዬ)"
          >
            <Scale className="w-4 h-4 text-amber-400" />
            <span>የገቢ ቀመር (80/10/10)</span>
          </button>

          {/* Grand Games & Contests */}
          <button
            onClick={() => onSelectTarget('games')}
            className={`h-11 flex items-center gap-2 px-4 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
              activeTarget === 'games'
                ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400 shadow-md'
                : 'bg-slate-900/90 text-slate-200 hover:text-white hover:bg-slate-800 border border-slate-700/80'
            }`}
          >
            <Gamepad2 className={`w-4 h-4 ${activeTarget === 'games' ? 'text-slate-950' : 'text-amber-400'}`} />
            <span>ውድድሮች (Games)</span>
          </button>

          {/* Digital Equb & Lottery */}
          <button
            onClick={() => onSelectTarget('equb')}
            className={`h-11 flex items-center gap-2 px-4 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
              activeTarget === 'equb'
                ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400 shadow-md'
                : 'bg-slate-900/90 text-slate-200 hover:text-white hover:bg-slate-800 border border-slate-700/80'
            }`}
          >
            <Coins className={`w-4 h-4 ${activeTarget === 'equb' ? 'text-slate-950' : 'text-amber-400'}`} />
            <span>እቁብና ሎተሪ</span>
          </button>

          {/* Bank & Royalties */}
          <button
            onClick={() => onSelectTarget('bank')}
            className={`h-11 flex items-center gap-2 px-4 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
              activeTarget === 'bank'
                ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400 shadow-md'
                : 'bg-slate-900/90 text-slate-200 hover:text-white hover:bg-slate-800 border border-slate-700/80'
            }`}
          >
            <Landmark className={`w-4 h-4 ${activeTarget === 'bank' ? 'text-slate-950' : 'text-amber-400'}`} />
            <span>ባንክና ቦርሳ</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
