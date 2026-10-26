import React from 'react';
import { AppLanguage, APP_LANGUAGES, TRANSLATIONS } from '../i18n/translations';
import { Globe, Wallet, ShieldCheck, Sparkles, Users, Menu, Lock, User, Download, Smartphone } from 'lucide-react';
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
  const t = TRANSLATIONS[currentLang];

  return (
    <header className="sticky top-0 z-40 bg-[#0c0f17]/95 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand, Hamburger 3-bar Menu & Mission */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            {/* Left 3-bar Hamburger Button */}
            <button
              onClick={onOpenDrawer}
              aria-label="ዳሽቦርድ ክፈት (Open Dashboard)"
              className="p-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-amber-400 hover:text-white transition-all shadow-md cursor-pointer flex items-center justify-center group"
            >
              <Menu className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>

            {/* OneWorld Radiant Logo Component */}
            <OneWorldLogo size="md" showText={true} />
          </div>

          {/* Live Global Presence */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-900/80 border border-slate-800 rounded-lg text-xs text-slate-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium text-slate-200">184,920</span>
            <span className="text-[10px] text-slate-400">በቀጥታ (Live)</span>
          </div>
        </div>

        {/* Global Financial Reserve Split Notice */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-amber-950/20 border border-amber-800/30 rounded-lg text-[11px] text-amber-300">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <span>{t.reserveRule}</span>
        </div>

        {/* Right side controls: PWA, 8-Languages, Vault, Profile, Wallet */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {/* PWA Install Button if available */}
          {isInstallable && (
            <button
              onClick={onInstallPwa}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/40 rounded-lg text-xs font-bold transition-all cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>ወደ ስልክ ጫን</span>
            </button>
          )}

          {/* Builder Sovereign Vault Trigger (PIN 2026) */}
          <button
            onClick={onOpenBuilderVault}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-950/40 hover:bg-amber-950/80 border border-amber-600/50 rounded-lg text-xs text-amber-300 font-bold transition-all cursor-pointer"
            title="የገንቢው ካዝና (ኮድ 2026)"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">ካዝና (2026)</span>
          </button>

          {/* 8-Language Selector */}
          <div className="relative flex items-center bg-slate-900/90 border border-slate-700/70 rounded-lg px-2 py-1.5 text-xs">
            <Globe className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
            <select
              aria-label="ቋንቋ ይምረጡ (Select Language)"
              value={currentLang}
              onChange={(e) => onLanguageChange(e.target.value as AppLanguage)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer pr-1 font-medium text-xs"
            >
              {APP_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                  {lang.flag} {lang.nativeName}
                </option>
              ))}
            </select>
          </div>

          {/* Profile / Auth Button */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-300 transition-colors cursor-pointer"
            title="መገለጫ (User Profile)"
          >
            <User className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline max-w-[80px] truncate">{user?.fullName.split(' ')[0] || 'መገለጫ'}</span>
          </button>

          {/* Wallet & Royalty Activity Button */}
          <button
            onClick={onOpenWallet}
            className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-lg font-medium text-xs shadow-md shadow-emerald-950 transition-all cursor-pointer"
          >
            <Wallet className="w-3.5 h-3.5" />
            <div className="flex flex-col text-left">
              <span className="text-[9px] text-emerald-200 leading-none">ሒሳብ</span>
              <span className="font-bold text-xs">{balanceETB.toLocaleString()} ብር</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 pl-1.5 border-l border-emerald-400/30 text-[10px] text-amber-300 font-semibold">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>+{royaltyPoints}</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

