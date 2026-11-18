import React from 'react';
import { AppLanguage, APP_LANGUAGES, TRANSLATIONS } from '../i18n/translations';
import { Globe, Wallet, ShieldCheck, Sparkles, Users, Menu, Lock, User, Smartphone } from 'lucide-react';
import { UserProfile } from './AuthModal';
import { OneWorldLogo } from './OneWorldLogo';

interface HeaderProps {
  currentLang: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  balanceETB: number;
  balanceUSD: number;
  royaltyPoints: number;
  onlineCount?: number;
  onOpenWallet: () => void;
  onOpenDrawer: () => void;
  onOpenBuilderVault: () => void;
  onOpenAuth: () => void;
  user: UserProfile | null;
  onInstallPwa?: () => void;
  isInstallable?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  balanceETB,
  balanceUSD,
  royaltyPoints,
  onlineCount = 1,
  onOpenWallet,
  onOpenDrawer,
  onOpenBuilderVault,
  onOpenAuth,
  user,
  onInstallPwa,
  isInstallable
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.am;

  return (
    <header className="sticky top-0 z-40 bg-[#0c0f17]/95 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-4 lg:px-8 py-2.5 sm:py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 sm:gap-3">
        {/* Brand, Hamburger 3-bar Menu & Live Counter */}
        <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto justify-between md:justify-start min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            {/* Left 3-bar Hamburger Button */}
            <button
              onClick={onOpenDrawer}
              aria-label={t.header.openDashboard}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-amber-400 hover:text-white transition-all shadow-md cursor-pointer flex items-center justify-center group flex-shrink-0"
            >
              <Menu className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>

            {/* OneWorld Radiant Logo Component */}
            <OneWorldLogo size="md" showText={true} />
          </div>

          {/* Live Global Presence (Visible on ALL screen sizes including small phones) */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-300 flex-shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Users className="w-3.5 h-3.5 text-slate-300 hidden xs:inline" />
            <span className="font-extrabold text-white">{Math.max(1, onlineCount).toLocaleString()}</span>
            <span className="text-[11px] text-emerald-400 font-black">{t.header.live}</span>
          </div>
        </div>

        {/* Global Financial Reserve Split Notice */}
        <div className="hidden xl:flex items-center gap-2 px-3.5 py-2 bg-amber-950/30 border border-amber-800/40 rounded-xl text-xs font-bold text-amber-300">
          <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>{t.reserveRule}</span>
        </div>

        {/* Right side controls: Wrap gracefully on narrow phone screens so nothing clips */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between sm:justify-end">
          {/* PWA Install Button */}
          <button
            onClick={onInstallPwa}
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 border border-amber-500/60 text-amber-300 rounded-xl text-xs font-black transition-all cursor-pointer shadow-sm group"
            title="Oneworld አፕሊኬሽን ወደ ስልክዎ ስክሪን ይጫኑ"
          >
            <Smartphone className="w-4 h-4 text-amber-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
            <span>{t.header.installApp}</span>
          </button>

          {/* Quick Profile / Edit Profile / Auth */}
          <button
            onClick={onOpenAuth}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-sm min-w-0 ${
              user?.isGuest || !user
                ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/60'
                : 'bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200'
            }`}
            title={user && !user.isGuest ? 'ፕሮፋይልዎን ለማየት ወይም ለማስተካከል ይጫኑ' : 'ይግቡ ወይም ይመዝገቡ'}
          >
            <User className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="max-w-[130px] truncate">
              {user && !user.isGuest ? user.fullName.split(' ')[0] : 'ግባ / ተመዝገብ'}
            </span>
          </button>

          {/* Wallet Trigger */}
          <button
            onClick={onOpenWallet}
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 rounded-xl font-black text-xs shadow-md shadow-amber-950/30 transition-all cursor-pointer flex-shrink-0"
            title="የኪስ ቦርሳዎን ይክፈቱ (Open Wallet)"
          >
            <Wallet className="w-4 h-4 text-slate-950 flex-shrink-0" />
            <span className="font-black text-xs">{balanceETB.toLocaleString()} ብር</span>
          </button>
        </div>
      </div>
    </header>
  );
};
