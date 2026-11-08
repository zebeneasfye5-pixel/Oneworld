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
  ShieldCheck,
  Wallet,
  Globe
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
  | 'h12' // የሳይኮሎጂ እና የጤና አገልግሎት ቤት
  | 'h13' // የድለላና ፈላጊ/ተፈላጊ ቤት
  | 'h14' // የአቤቱታና የዳኝነት ቤት
  | 'h15' // የአገልግሎት ክፍያ ቤት
  | 'h16'; // የቱሪዝም እና የቅርስ ቤት (Global Tourism & Heritage Expo)

interface MasterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeHouse: HouseId;
  onSelectHouse: (id: HouseId) => void;
  currentLang: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  user: UserProfile | null;
  balanceETB?: number;
  balanceUSD?: number;
  royaltyPoints?: number;
  onOpenWallet?: () => void;
  onOpenAuth: () => void;
  onOpenBuilderVault: () => void;
  onOpenCharter: () => void;
  onOpenAdminAudit?: () => void;
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
  balanceETB = 0,
  balanceUSD = 0,
  royaltyPoints = 0,
  onOpenWallet,
  onOpenAuth,
  onOpenBuilderVault,
  onOpenCharter,
  onOpenAdminAudit,
  onInstallPwa,
  isInstallable
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const t = TRANSLATIONS[currentLang];

  if (!isOpen) return null;

  const housesList: { id: HouseId; num: number; icon: any; title: string; desc: string; tag: string }[] = [
    { id: 'h1', num: 1, icon: Home, title: t.houses.h1.title, desc: t.houses.h1.desc, tag: t.drawer.tags.h1 || '1' },
    { id: 'h2', num: 2, icon: Users, title: t.houses.h2.title, desc: t.houses.h2.desc, tag: t.drawer.tags.h2 || '2' },
    { id: 'h3', num: 3, icon: ShieldAlert, title: t.houses.h3.title, desc: t.houses.h3.desc, tag: t.drawer.tags.h3 || '3' },
    { id: 'h4', num: 4, icon: HeartHandshake, title: t.houses.h4.title, desc: t.houses.h4.desc, tag: t.drawer.tags.h4 || '4' },
    { id: 'h5', num: 5, icon: Sparkles, title: t.houses.h5.title, desc: t.houses.h5.desc, tag: t.drawer.tags.h5 || '5' },
    { id: 'h6', num: 6, icon: BookOpen, title: t.houses.h6.title, desc: t.houses.h6.desc, tag: t.drawer.tags.h6 || '6' },
    { id: 'h7', num: 7, icon: ShieldCheck, title: t.houses.h7.title, desc: t.houses.h7.desc, tag: t.drawer.tags.h7 || '7' },
    { id: 'h8', num: 8, icon: Flame, title: t.houses.h8.title, desc: t.houses.h8.desc, tag: t.drawer.tags.h8 || '8' },
    { id: 'h9', num: 9, icon: Store, title: t.houses.h9.title, desc: t.houses.h9.desc, tag: t.drawer.tags.h9 || '9' },
    { id: 'h10', num: 10, icon: GraduationCap, title: t.houses.h10.title, desc: t.houses.h10.desc, tag: t.drawer.tags.h10 || '10' },
    { id: 'h11', num: 11, icon: Briefcase, title: t.houses.h11.title, desc: t.houses.h11.desc, tag: t.drawer.tags.h11 || '11' },
    { id: 'h12', num: 12, icon: Brain, title: t.houses.h12.title, desc: t.houses.h12.desc, tag: t.drawer.tags.h12 || '12' },
    { id: 'h13', num: 13, icon: Compass, title: t.houses.h13.title, desc: t.houses.h13.desc, tag: t.drawer.tags.h13 || '13' },
    { id: 'h14', num: 14, icon: Scale, title: t.houses.h14.title, desc: t.houses.h14.desc, tag: t.drawer.tags.h14 || '14' },
    { id: 'h15', num: 15, icon: Receipt, title: t.houses.h15.title, desc: t.houses.h15.desc, tag: t.drawer.tags.h15 || '15' },
    { id: 'h16', num: 16, icon: Globe2, title: t.houses.h16.title, desc: t.houses.h16.desc, tag: t.drawer.tags.h16 || '16' },
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
            {t.header.profile}
          </button>
        </div>

        {/* Master Drawer De-cluttered Hub: Financial Balances & 8-Languages Selection */}
        <div className="p-3.5 bg-slate-950/80 border-b border-slate-800 space-y-3">
          {/* Wallet Balance & Royalty Points Card */}
          <div 
            onClick={() => {
              onClose();
              if (onOpenWallet) onOpenWallet();
            }}
            className="p-3 bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/40 rounded-2xl flex items-center justify-between cursor-pointer hover:border-amber-400 transition-all shadow-md group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-md">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                  {t.balance} (Wallet Balance)
                </span>
                <span className="text-sm font-black text-white group-hover:text-amber-300 transition-colors">
                  {balanceETB.toLocaleString()} ብር
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700 px-2 py-1 rounded-xl text-xs text-amber-300 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>+{royaltyPoints}</span>
            </div>
          </div>

          {/* 8-Language Selector moved elegantly into Drawer */}
          <div className="flex items-center justify-between p-2.5 bg-slate-900/90 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-slate-300">{t.header.selectLanguage}</span>
            </div>
            <select
              aria-label={t.header.selectLanguage}
              value={currentLang}
              onChange={(e) => onLanguageChange(e.target.value as AppLanguage)}
              className="bg-slate-950 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs font-bold focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              {APP_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-white font-bold">
                  {lang.flag} {lang.nativeName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Bar for 15 Houses */}
        <div className="p-3 border-b border-slate-800 bg-[#0d111d]">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={t.drawer.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* 15 Houses List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {t.drawer.housesHeading}
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
        <div className="p-3.5 border-t border-slate-800 bg-[#0f1422] space-y-2.5">
          {/* Builder Sovereign Vault (Direct Sovereign Access - Founder Zebene Asfye) */}
          <button
            onClick={() => {
              onClose();
              onOpenBuilderVault();
            }}
            className="w-full flex items-center justify-between p-3 bg-amber-950/40 hover:bg-amber-950/60 border border-amber-600/50 rounded-2xl text-xs sm:text-sm font-black text-amber-300 cursor-pointer transition-colors shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>{t.announcements.vaultBtn}</span>
            </div>
            <span className="text-xs font-mono font-bold bg-amber-900/60 text-amber-300 px-2 py-0.5 rounded-lg border border-amber-500/30">
              ቀጥታ መግቢያ
            </span>
          </button>

          {/* Founding Charter */}
          <button
            onClick={() => {
              onClose();
              onOpenCharter();
            }}
            className="w-full flex items-center gap-2 p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl text-xs sm:text-sm font-extrabold text-slate-200 cursor-pointer transition-colors"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>{t.announcements.charterBtn}</span>
          </button>

          {/* Admin Audit Dashboard */}
          {onOpenAdminAudit && (
            <button
              onClick={() => {
                onClose();
                onOpenAdminAudit();
              }}
              className="w-full flex items-center justify-between p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl text-xs sm:text-sm font-extrabold text-slate-200 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>የኦዲትና አስተዳደር ማዕከል (Audit)</span>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-lg border border-slate-700">
                80/10/10
              </span>
            </button>
          )}

          {/* Install PWA Button */}
          {isInstallable && (
            <button
              onClick={onInstallPwa}
              className="w-full flex items-center justify-center gap-2 p-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 text-white font-black rounded-2xl text-xs sm:text-sm shadow-md cursor-pointer transition-colors"
            >
              <Smartphone className="w-4 h-4" />
              <span>{t.installApp}</span>
            </button>
          )}

          {/* Offline Ready Indicator */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 pt-1">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {t.announcements.offlineReadyNotice}
            </span>
            <span className="text-amber-400">ዘበነ አስፍዬ (Zebene Asfye)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
