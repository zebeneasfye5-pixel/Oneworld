import React from 'react';
import { BookOpen, ShieldCheck, Award, FileText, CheckCircle2, X } from 'lucide-react';

interface FoundingCharterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FoundingCharterModal: React.FC<FoundingCharterModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-[#101524] border border-amber-500/40 rounded-3xl w-full max-w-2xl p-6 md:p-8 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-white">
              የ«OneWorld (ዓለም አንድ)» መድረክ አመሰራረት፣ ህግና ደንብ መመሪያ (Official Charter)
            </h3>
            <p className="text-xs text-amber-400 font-semibold mt-0.5">
              መስራች፡ ዘበነ አስፍዬ (Zebene Asfaye) · ጥቅምት 2026 እ.ኤ.አ
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
          {/* Section 1 */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
            <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              ክፍል ፩፡ የአመሰራረት አዋጅ እና ራዕይ
            </h4>
            <p>
              ይህ «OneWorld (ዓለም አንድ)» የተሰኘው ታላቅ የሰው ልጆች የጋራ 15ቱ ቤቶች ማህበራዊ መድረክና የዕውቀት ማዕከል በኢትዮጵያዊው ራዕይ መሪ <strong>ዘበነ አስፍዬ (Zebene Asfaye)</strong> በ2026 እ.ኤ.አ የተመሰረተ ሉዓላዊ መድረክ ነው።
            </p>
            <p>
              ዋና አላማው የአለማችንን ህዝቦች በሁለንተናዊ መልካም አስተሳሰብ፣ በቴክኖሎጂ እውቀት፣ በፓለቲካዊና ኢኮኖሚያዊ እሳቤ፣ በበጎ አድራጎት ስራ እና በስልጣኔ አውድ ወደ ተቀራረበ ደረጃ ለማምጣት በአንድ ቤት ተሰባስበው እንዲመካከሩ፣ እውቀት እንዲለዋወጡ፣ ፍቅርና አንድነትን እንዲገነቡ ማድረግ ነው።
            </p>
          </div>

          {/* Section 2 */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
            <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              ክፍል ፪፡ የ15ቱ ዋና ዋና ቤቶች የመረጃ ጥበቃና መለያየት (Data Isolation)
            </h4>
            <p>
              1. <strong>የመረጃ ሚስጥራዊነት፡</strong> አንዱ ቤት የሌላኛውን ቤት ምንም አይነት መረጃ ማግኘት አይችልም። በእያንዳንዱ ቤት የሚደረጉ ውይይቶችና ሰነዶች በዚያው ቤት ብቻ የተመጠኑ ናቸው።
            </p>
            <p>
              2. <strong>ሚስጥራዊ የጋብቻና የዳኝነት ውሎች፡</strong> በሰርግ ቤትና በዳኝነት ቤት የሚደረጉ ውሎች በአለም አቀፍ የፍትሐብሔር ህግ ቁጥሮች ተመዝግበው ህጋዊ ማህተም የሚሰጣቸው ናቸው።
            </p>
          </div>

          {/* Section 3 */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
            <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              ክፍል ፫፡ የገቢ፣ የባንክና የገንቢው የኮሚሽን ስርአት (85% / 10% / 5%)
            </h4>
            <p>
              1. <strong>ለተሳታፊዎች የተጣራ ገቢ (85%)፡</strong> ተጠቃሚዎች በላይክ፣ በሼር፣ በጨዋታ፣ በእቁብና በንግድ ለሚያደርጉት ተሳትፎ 85% የተጣራ ገቢ ያገኛሉ።
            </p>
            <p>
              2. <strong>የባንኮች የዋስትና መደብ (10%)፡</strong> በኢትዮጵያ ንግድ ባንክና በብሄራዊ ባንክ መመሪያ መሰረት የፈሳሽነትና የግብይት ዋስትና እንዲሆን 10% ይቀመጣል።
            </p>
            <p>
              3. <strong>የገንቢው 5% ቋሚ ተቆጣቢ (ሚስጥራዊ 2026 ኮድ)፡</strong> ለድህረገፁ ፈጣሪ ዘበነ አስፍዬ በኢትዮጵያ ንግድ ባንክ (CBE) አካውንት <strong>1000167413618</strong> በቀጥታ እንዲተላለፍ በ2026 ኮድ የተጠበቀ ቋሚ ገቢ ተደንግጓል።
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            መመሪያውን ተረድቻለሁ
          </button>
        </div>
      </div>
    </div>
  );
};
