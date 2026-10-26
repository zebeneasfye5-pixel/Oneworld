import React, { useState } from 'react';
import { Scale, FileText, CheckCircle2, Video, AlertCircle, Stamp, Download } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CaseFiling {
  id: string;
  caseNumber: string;
  claimant: string;
  respondent: string;
  category: 'የውል ጥሰት' | 'የንግድ አለመግባባት' | 'የይገባኛል ጥያቄ' | 'የማህበራዊ በደል';
  judgeName: string;
  status: 'ችሎት በሂደት ላይ' | 'ፍርድ የተሰጠበት' | 'ምስክርነት እየተሰማ';
  hearingDate: string;
  claimSummary: string;
  verdictText?: string;
}

export const HouseJudicialTribunal: React.FC = () => {
  const [cases, setCases] = useState<CaseFiling[]>([
    {
      id: 'case-1',
      caseNumber: 'TRIB-ETH-2026-9041',
      claimant: 'አቶ ዘውዱ ታደሰ (አቤቱታ አቅራቢ)',
      respondent: 'የግንባታ ስራ ተቋራጭ',
      category: 'የውል ጥሰት',
      judgeName: 'ዳኛ ክብረት ሀይሉ (ከፍተኛ የህግ ባለሙያ)',
      status: 'ፍርድ የተሰጠበት',
      hearingDate: 'ዛሬ 09:30',
      claimSummary: 'በውሉ መሰረት የግንባታ ስራውን በጊዜ ባለማጠናቀቅ የደረሰ ጉዳት ማካካሻ ጥያቄ።',
      verdictText: 'ፍርድ ቤቱ የሁለቱንም ወገኖች ሰነድና የባንክ ደረሰኝ መርምሮ ተከሳሹ 350,000 ብር የካሳ ክፍያ ለከሳሽ እንዲከፍል በሙሉ ድምፅ ወስኗል።'
    }
  ]);

  const [selectedCase, setSelectedCase] = useState<CaseFiling>(cases[0]);
  const [isFilingModalOpen, setIsFilingModalOpen] = useState(false);

  // New Case filing state
  const [claimant, setClaimant] = useState('');
  const [respondent, setRespondent] = useState('');
  const [category, setCategory] = useState<any>('የውል ጥሰት');
  const [summary, setSummary] = useState('');

  const handleFileCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimant.trim() || !summary.trim()) return;

    const newCase: CaseFiling = {
      id: `case-${Date.now()}`,
      caseNumber: `TRIB-ETH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      claimant: claimant.trim(),
      respondent: respondent.trim() || 'ተከሳሽ ወገን',
      category,
      judgeName: 'ዋና የዳኝነት ቦርድ ሰብሳቢ',
      status: 'ችሎት በሂደት ላይ',
      hearingDate: 'ቀጠሮ ተይዟል',
      claimSummary: summary.trim(),
      verdictText: 'ችሎቱ ማስረጃዎችን በመመርመር ላይ ነው።'
    };

    setCases([newCase, ...cases]);
    setSelectedCase(newCase);
    setIsFilingModalOpen(false);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold text-lg">
            14
          </div>
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              የአቤቱታና የዳኝነት ቤት (Judicial Redress & Arbitration Tribunal)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              ዳኞችና በደል የደረሰባቸው አቤቱታ አቅራቢዎች በቪዲዮ ዙም-ችሎት ተገናኝተው ትክክለኛ የመፍትሄ ፍርድ የሚያገኙበትና ውሳኔ በድምፅና በሰነድ የሚሰጥበት ፍርድ ቤት
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsFilingModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-950 cursor-pointer"
        >
          <Scale className="w-4 h-4" />
          <span>አቤቱታ አስገባ (File Case)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cases List */}
        <div className="space-y-4">
          <div className="bg-[#101524] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-3">
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider pb-2 border-b border-slate-800">
              የፍርድ ቤት መዛግብት (Active Dockets)
            </h3>

            <div className="space-y-2.5">
              {cases.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCase(c)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    selectedCase.id === c.id
                      ? 'bg-indigo-950/40 border-indigo-500/60 shadow-md ring-1 ring-indigo-500/40'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                    <span>{c.caseNumber}</span>
                    <span className="text-emerald-400 font-bold">{c.status}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white truncate">{c.claimant}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{c.claimSummary}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Case Chamber & Verdict */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#101524] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                  {selectedCase.caseNumber}
                </span>
                <h3 className="text-base font-extrabold text-white">
                  የችሎት ዳኝነት ዝርዝር (Hearing Record)
                </h3>
              </div>

              <div className="flex items-center gap-1.5 bg-indigo-950/60 border border-indigo-800/40 px-3 py-1 rounded-xl text-xs text-indigo-300 font-semibold">
                <Video className="w-3.5 h-3.5 text-indigo-400" />
                <span>ቀጥታ የዙም-ችሎት</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block">አቤቱታ አቅራቢ (Claimant)፡</span>
                <strong className="text-white text-xs">{selectedCase.claimant}</strong>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block">ተከሳሽ ወገን (Respondent)፡</span>
                <strong className="text-white text-xs">{selectedCase.respondent}</strong>
              </div>
            </div>

            <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-indigo-300 block">የቀረበው አቤቱታ ፍሬ ነገር፡</span>
              <p className="text-slate-200 leading-relaxed">{selectedCase.claimSummary}</p>
            </div>

            {/* Official Verdict Document */}
            {selectedCase.verdictText && (
              <div className="p-5 bg-gradient-to-br from-indigo-950/30 to-slate-950 rounded-2xl border-2 border-indigo-500/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <Stamp className="w-4 h-4 text-amber-400" />
                    የዳኝነት የመጨረሻ ውሳኔ (Binding Verdict Order)
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">የተረጋገጠ ማህተም</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  "{selectedCase.verdictText}"
                </p>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>ውሳኔውን በሰነድ አትም (Print Verdict)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filing Modal */}
      {isFilingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#101524] border border-slate-700 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">አዲስ አቤቱታ ማስገቢያ</h3>
            <form onSubmit={handleFileCase} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">አቤቱታ አቅራቢ ሙሉ ስም *</label>
                <input
                  type="text"
                  required
                  placeholder="ሙሉ ስምዎ..."
                  value={claimant}
                  onChange={(e) => setClaimant(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">ተከሳሽ ግለሰብ / ተቋም</label>
                <input
                  type="text"
                  placeholder="የተከሳሹ ስም..."
                  value={respondent}
                  onChange={(e) => setRespondent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">የበደሉ ወይም የአቤቱታው ዝርዝር *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="የደረሰቦትን ጉዳትና የሚጠይቁትን ፍትህ በግልጽ ይግለጹ..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFilingModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  ተመለስ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs"
                >
                  አቤቱታውን አስገባ (Submit Petition)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
