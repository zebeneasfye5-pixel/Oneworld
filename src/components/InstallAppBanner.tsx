import React from 'react';
import { Download, Smartphone } from 'lucide-react';
import { AppLanguage, TRANSLATIONS } from '../i18n/translations';

interface InstallAppBannerProps {
  onInstall: () => void;
  isInstallable: boolean;
  currentLang?: AppLanguage;
}

export const InstallAppBanner: React.FC<InstallAppBannerProps> = ({
  onInstall,
  isInstallable,
  currentLang = 'am'
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.am;

  return (
    <div className="bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-indigo-500/15 border border-emerald-500/30 rounded-2xl p-3 md:p-4 shadow-xl backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-emerald-500 flex items-center justify-center text-slate-950 font-black shadow-md flex-shrink-0">
          <Smartphone className="w-5 h-5 text-slate-950" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-white">
              {t.banner.title}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {t.banner.badge}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {t.banner.subtitle}
          </p>
        </div>
      </div>

      <button
        onClick={onInstall}
        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition cursor-pointer flex items-center justify-center gap-2 flex-shrink-0"
      >
        <Download className="w-4 h-4" />
        <span>{t.banner.button}</span>
      </button>
    </div>
  );
};
