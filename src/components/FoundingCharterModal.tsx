import React from 'react';
import { BookOpen, ShieldCheck, Award, FileText, X } from 'lucide-react';
import { AppLanguage, TRANSLATIONS } from '../i18n/translations';

interface FoundingCharterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang?: AppLanguage;
}

export const FoundingCharterModal: React.FC<FoundingCharterModalProps> = ({
  isOpen,
  onClose,
  currentLang = 'am'
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.am;
  const c = t.charterModal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-[#101524] border border-amber-500/40 rounded-3xl w-full max-w-2xl p-6 md:p-8 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-white leading-snug">
              {c.title}
            </h3>
            <p className="text-xs text-amber-400 font-semibold mt-0.5">
              {c.founderLabel}
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
          {/* Section 1 */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
            <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400 flex-shrink-0" />
              {c.section1Title}
            </h4>
            <p>{c.section1Text1}</p>
            <p>{c.section1Text2}</p>
          </div>

          {/* Section 2 */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
            <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              {c.section2Title}
            </h4>
            <p>1. {c.section2Rule1}</p>
            <p>2. {c.section2Rule2}</p>
          </div>

          {/* Section 3 */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
            <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              {c.section3Title}
            </h4>
            <p>1. {c.section3Rule1}</p>
            <p>2. {c.section3Rule2}</p>
            <p>3. {c.section3Rule3}</p>
            <p>4. {c.section3Rule4}</p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            {c.understoodBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
