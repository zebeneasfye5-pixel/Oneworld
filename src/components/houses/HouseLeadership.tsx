import React, { useState } from 'react';
import { ShieldAlert, Award, FileText, CheckCircle2, Users, Send, Lock } from 'lucide-react';

interface PolicyBrief {
  id: string;
  title: string;
  category: string;
  proposer: string;
  status: 'በውይይት ላይ' | 'የፀደቀ' | 'በጥናት ላይ';
  summary: string;
  votesSupport: number;
}

export const HouseLeadership: React.FC = () => {
  const [briefs, setBriefs] = useState<PolicyBrief[]>([
    {
      id: 'p-1',
      title: 'የአፍሪካ ቀንድ የዲጂታል ሉዓላዊነትና የሳይበር ደህንነት ስምምነት',
      category: 'የሀገር ደህንነትና ዲፕሎማሲ',
      proposer: 'ክቡር የደህንነት ሚኒስትር',
      status: 'የፀደቀ',
      summary: 'የመንግስታት የመረጃ ሉዓላዊነትን የሚያረጋግጥና የድንበር ተሻጋሪ ዲጂታል ወረራዎችን የሚከላከል ህጋዊ መመሪያ።',
      votesSupport: 89
    },
    {
      id: 'p-2',
      title: 'የአረንጓዴ አሻራና የፈጣን የኃይል ማመንጫዎች ቀጣናዊ ትስስር',
      category: 'የሀገር ሁለንተናዊ ልማት',
      proposer: 'የውሃና ኢነርጂ ሚኒስቴር',
      status: 'በውይይት ላይ',
      summary: 'ከህዳሴው ግድብ የሚመነጨውን ኃይል ለቀጠናዊ የኢኮኖሚ ውህደትና ለገጠር ማህበረሰብ ማዳረስ።',
      votesSupport: 114
    }
  ]);

  const [activeTab, setActiveTab] = useState<'roundtable' | 'briefs'>('roundtable');
  const [commentInput, setCommentInput] = useState('');

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold text-lg">
            3
          </div>
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              የባለስልጣን ቤት (Statesmanship & Sovereign Leadership Hall)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              መሪዎችና ባለስልጣናት ተሰባስበው ስለ ሀገር ልማት፣ የዜጎች ደህንነትና አለም አቀፍ ስትራቴጂካዊ ግንኙነት የሚመካከሩበት ከፍተኛ አዳራሽ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-amber-400 font-bold">
          <Lock className="w-4 h-4 text-amber-400" />
          <span>የተጠበቀ የመሪዎች ምክክር (Classified High Council)</span>
        </div>
      </div>

      {/* Strategic Roundtables & Policy Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#101524] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              የሀገር ልማትና የደህንነት ስትራቴጂዎች (Strategic Policies)
            </h3>

            <div className="space-y-3">
              {briefs.map((b) => (
                <div key={b.id} className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
                      {b.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      b.status === 'የፀደቀ' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                    }`}>
                      {b.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white">{b.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{b.summary}</p>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                    <span>አቅራቢ፡ <strong className="text-slate-200">{b.proposer}</strong></span>
                    <span>ድጋፍ የሰጡ መሪዎች፡ <strong className="text-emerald-400">{b.votesSupport}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Ministerial Discussion */}
        <div className="bg-[#101524] border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <Users className="w-4 h-4 text-indigo-400" />
              የመሪዎች ሚስጥራዊ ምክክር (Live Ministerial Session)
            </h3>

            <div className="space-y-3 mt-3 text-xs">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                <span className="font-bold text-indigo-400">ዶ/ር ዘበነ አስፋው (የምክክሩ ሰብሳቢ):</span>
                <p className="text-slate-300">"የቴክኖሎጂ እውቀትና የህዝብ አንድነት ለሀገራችን ዘላቂ ልማት መሰረት ናቸው።"</p>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                <span className="font-bold text-amber-400">ኢንጂነር አብርሃም ገብረ:</span>
                <p className="text-slate-300">"በሁሉም ክልሎችና ወረዳዎች የዲጂታል መሰረተ ልማት ዝርጋታው ተጠናክሮ ቀጥሏል።"</p>
              </div>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!commentInput.trim()) return;
              setCommentInput('');
              alert('የቀረበው የመሪነት አስተያየት በሰነድ ተመዝግቧል!');
            }}
            className="flex items-center gap-2 pt-2 border-t border-slate-800"
          >
            <input
              type="text"
              placeholder="የፖሊሲ ሀሳብ ያቅርቡ..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
