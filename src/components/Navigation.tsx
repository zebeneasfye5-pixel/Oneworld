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
  Coins,
  Gamepad2,
  Landmark
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
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTarget,
  onSelectTarget,
  currentLang
}) => {
  const t = TRANSLATIONS[currentLang];

  const items: { id: MainNavigationTarget; num?: number; label: string; icon: any }[] = [
    { id: 'h1', num: 1, label: t.nav.h1, icon: Home },
    { id: 'h2', num: 2, label: t.nav.h2, icon: Users },
    { id: 'h3', num: 3, label: t.nav.h3, icon: ShieldAlert },
    { id: 'h4', num: 4, label: t.nav.h4, icon: HeartHandshake },
    { id: 'h5', num: 5, label: t.nav.h5, icon: Sparkles },
    { id: 'h6', num: 6, label: t.nav.h6, icon: BookOpen },
    { id: 'h7', num: 7, label: t.nav.h7, icon: ShieldCheck },
    { id: 'h8', num: 8, label: t.nav.h8, icon: Flame },
    { id: 'h9', num: 9, label: t.nav.h9, icon: Store },
    { id: 'h10', num: 10, label: t.nav.h10, icon: GraduationCap },
    { id: 'h11', num: 11, label: t.nav.h11, icon: Briefcase },
    { id: 'h12', num: 12, label: t.nav.h12, icon: Brain },
    { id: 'h13', num: 13, label: t.nav.h13, icon: Compass },
    { id: 'h14', num: 14, label: t.nav.h14, icon: Scale },
    { id: 'h15', num: 15, label: t.nav.h15, icon: Receipt },
    { id: 'equb', label: t.nav.equb, icon: Coins },
    { id: 'games', label: t.nav.games, icon: Gamepad2 },
    { id: 'bank', label: t.nav.bank, icon: Landmark },
  ];

  return (
    <nav className="w-full bg-[#111624] border-b border-slate-800/80 px-4 overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto flex items-center gap-1.5 py-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTarget === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTarget(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md ring-1 ring-amber-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70 border border-slate-800/80'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
