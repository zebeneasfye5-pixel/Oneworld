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
    <header className="sticky top-0 z-40 bg-[#0c0f17]/95 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand, Hamburger 3-bar Menu & Mission */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            {/* Left 3-bar Hamburger Button */}
            <button
              onClick={onOpenDrawer}
              aria-label={t.header.openDashboard}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-amber-400 hover:text-white transition-all shadow-md cursor-pointer flex items-center justify-center group"
            >
              <Menu className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>

            {/* OneWorld Radiant Logo Component */}
            <OneWorldLogo size="md" showText={true} />
          </div>

          {/* Live Global Presence */}
          {/* Live Global Presence */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-300">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <Users className="w-4 h-4 text-slate-300" />
            <span className="font-extrabold text-white">184,920</span>
            <span className="text-xs text-emerald-400 font-black">{t.header.live}</span>
          </div>
        </div>

        {/* Global Financial Reserve Split Notice */}
        <div className="hidden xl:flex items-center gap-2 px-3.5 py-2 bg-amber-950/30 border border-amber-800/40 rounded-xl text-xs font-bold text-amber-300">
          <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>{t.reserveRule}</span>
        </div>

        {/* Right side controls: PWA Install, 8-Languages, Vault, Profile, Wallet */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap sm:flex-nowrap">
          {/* PWA Install Button placed prominently and elegantly on top right */}
          <button
            onClick={onInstallPwa}
            className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-500/25 to-amber-600/25 hover:from-amber-500/35 hover:to-amber-600/35 border border-amber-500/60 text-amber-300 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer shadow-sm group"
            title="Oneworld አፕሊኬሽን ወደ ስልክዎ ስክሪን ይጫኑ"
          >
            <Smartphone className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>{t.header.installApp}</span>
          </button>

          {/* Builder Sovereign Vault Trigger */}
          <button
            onClick={onOpenBuilderVault}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-amber-500/50 rounded-xl text-xs sm:text-sm text-amber-300 font-black transition-all cursor-pointer"
            title={t.builderVaultTitle}
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">{t.header.vault}</span>
          </button>

          {/* 8-Language Selector */}
          <div className="relative flex items-center bg-slate-900/95 border border-slate-700 rounded-xl px-2.5 py-2 text-xs sm:text-sm">
            <Globe className="w-4 h-4 text-amber-400 mr-1.5" />
            <select
              aria-label={t.header.selectLanguage}
              value={currentLang}
              onChange={(e) => onLanguageChange(e.target.value as AppLanguage)}
              className="bg-transparent text-white focus:outline-none cursor-pointer pr-1 font-bold text-xs sm:text-sm"
            >
              {APP_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-white font-bold">
                  {lang.flag} {lang.nativeName}
                </option>
              ))}
            </select>
          </div>

          {/* Profile / Auth Button */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm font-extrabold text-slate-200 transition-colors cursor-pointer"
            title={t.header.profile}
          >
            <User className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline max-w-[90px] truncate">{user?.fullName.split(' ')[0] || t.header.profile}</span>
          </button>

          {/* Wallet & Royalty Activity Button */}
          <button
            onClick={onOpenWallet}
            className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 rounded-xl font-black text-xs sm:text-sm shadow-md shadow-amber-950/30 transition-all cursor-pointer"
          >
            <Wallet className="w-4 h-4 text-slate-950" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-slate-950 font-extrabold leading-none">{t.balance}</span>
              <span className="font-black text-xs sm:text-sm">{balanceETB.toLocaleString()} ብር</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 pl-1.5 border-l border-slate-900/40 text-xs text-slate-950 font-black">
              <Sparkles className="w-3.5 h-3.5" />
              <span>+{royaltyPoints}</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
