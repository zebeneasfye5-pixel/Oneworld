import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Radio, 
  Search, 
  FileCheck2, 
  Globe2, 
  Lock, 
  AlertTriangle, 
  Fingerprint, 
  Cpu, 
  Stamp, 
  Send, 
  FileText, 
  CheckCircle2, 
  Eye, 
  Download, 
  Sparkles,
  UserX,
  Flag,
  Share2,
  X,
  Scale
} from 'lucide-react';

interface GlobalCrimeNotice {
  id: string;
  noticeType: 'RED_NOTICE' | 'CYBER_TERROR' | 'TRAFFICKING' | 'HERITAGE_THEFT';
  noticeColor: string;
  wantedName: string;
  alias: string;
  issuingNation: string;
  issuingFlag: string;
  jurisdiction: string;
  crimeSummary: string;
  estimatedDamageUSD: number;
  lastKnownLocation: string;
  biometricMatchPct: number;
  extraditionStatus: 'ጥያቄ ተልኳል (Dispatched)' | 'በማጣራት ላይ (Under Review)' | 'ክትትል ላይ (Active Radar)';
  extraditionTreatyArticle: string;
  evidenceItems: string[];
}

export const HouseSecurityChamber: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'radar' | 'forensics' | 'extradition' | 'whistleblower'>('radar');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [selectedNotice, setSelectedNotice] = useState<GlobalCrimeNotice | null>(null);

  // Forensics simulation state
  const [isScanningForensics, setIsScanningForensics] = useState(false);
  const [forensicResult, setForensicResult] = useState<string | null>(null);

  // Whistleblower state
  const [whistleCategory, setWhistleCategory] = useState('የፋይናንስና የባንክ ማጭበርበር');
  const [whistleTarget, setWhistleTarget] = useState('');
  const [whistleDetails, setWhistleDetails] = useState('');
  const [whistleEvidenceToken, setWhistleEvidenceToken] = useState<string | null>(null);

  // Red Notice Records Database
  const crimeNotices: GlobalCrimeNotice[] = [
    {
      id: 'INT-RED-2026-8819',
      noticeType: 'RED_NOTICE',
      noticeColor: 'bg-red-600 text-white',
      wantedName: 'ካርተር ቪክቶር (Carter Victor)',
      alias: '«ዘ ኔቡላ (The Nebula)»',
      issuingNation: 'ኢንተርፖል / ኢትዮጵያ እና የተባበሩት አረብ ኤምሬትስ',
      issuingFlag: '🇪🇹🇦🇪',
      jurisdiction: 'አለም አቀፍ የድንበር ዘለል ፋይናንስ ወንጀል መምሪያ',
      crimeSummary: 'በሀሰተኛ የባንክ ስዊፍትና ክሪፕቶ ከ20 በላይ ሀገራት 42 ሚሊዮን ዶላር የህዝብና የንግድ ተቋማት ገንዘብ ማጭበርበር እና ገንዘብ ማሸሽ።',
      estimatedDamageUSD: 42000000,
      lastKnownLocation: 'ዱባይ / ናይሮቢ የመተላለፊያ ቀጠና',
      biometricMatchPct: 99.4,
      extraditionStatus: 'ጥያቄ ተልኳል (Dispatched)',
      extraditionTreatyArticle: 'የተባበሩት መንግስታት የድንበር ዘለል የተደራጀ ወንጀል ስምምነት አንቀጽ 16 (UNODC Art. 16)',
      evidenceItems: ['የተጠለፉ የባንክ አይፒ አድራሻዎች', 'የፊት ባዮሜትሪክስ ካሜራ ምስል', 'የሀሰተኛ ፓስፖርት ዲጂታል አሻራ']
    },
    {
      id: 'INT-CYB-2026-4402',
      noticeType: 'CYBER_TERROR',
      noticeColor: 'bg-purple-600 text-white',
      wantedName: 'አሌክሲ ኢቫኖቭ (Alexei Ivanov)',
      alias: '«Ghost_Root»',
      issuingNation: 'የአውሮፓ ህብረት ሳይበር ደህንነት እና አፍሪካ ፖል',
      issuingFlag: '🇪🇺🌍',
      jurisdiction: 'የአለም አቀፍ የዲጂታል መሰረተ-ልማት ጥበቃ ቢሮ',
      crimeSummary: 'የሆስፒታሎችንና የመብራት ሃይል ማከፋፈያዎችን ሲስተም በRansomware መዝጋትና የክፍያ ጥያቄ ማቅረብ።',
      estimatedDamageUSD: 18500000,
      lastKnownLocation: 'ምስራቅ አውሮፓ / እስያ የኔትወርክ ሰርቨሮች',
      biometricMatchPct: 98.7,
      extraditionStatus: 'በማጣራት ላይ (Under Review)',
      extraditionTreatyArticle: 'የቡዳፔስት የአለም አቀፍ የሳይበር ወንጀል ስምምነት (Budapest Convention Art. 24)',
      evidenceItems: ['የRansomware ኮድ ፊርማ', 'የክሪፕቶ ቦርሳ የገንዘብ ፍሰት ካርታ', 'የሰርቨር ሎግ ፋይሎች']
    },
    {
      id: 'INT-TRAF-2026-9931',
      noticeType: 'TRAFFICKING',
      noticeColor: 'bg-amber-600 text-white',
      wantedName: 'ተክሌ ገብረመድህን (Tekle G.)',
      alias: '«አቡ ሳሊም»',
      issuingNation: 'ኢትዮጵያ / ኬንያ / ጅቡቲ የጋራ ደህንነት ግብረ-ኃይል',
      issuingFlag: '🇪🇹🇰🇪🇩🇯',
      jurisdiction: 'የቀይ ባህርና ምስራቅ አፍሪካ የህገ-ወጥ የሰዎች ዝውውር መቆጣጠሪያ',
      crimeSummary: 'በህገወጥ ደላላነት ወጣቶችንና ሴቶችን በበረሃና በባህር አስገድዶ ማሰደድ፣ ማሰቃየትና ቤተሰቦችን በስልክ አስፈራርቶ ገንዘብ መዝረፍ።',
      estimatedDamageUSD: 9200000,
      lastKnownLocation: 'የቦሳሶ እና የመን የባህር ዳርቻዎች',
      biometricMatchPct: 99.8,
      extraditionStatus: 'ክትትል ላይ (Active Radar)',
      extraditionTreatyArticle: 'የፓሌርሞ ፕሮቶኮል የሰዎች ዝውውር መከላከያ ድንጋጌ (Palermo Protocol Art. 8)',
      evidenceItems: ['የድምፅ ቅጂዎችና የዛቻ ስልኮች', 'የገንዘብ ተቀባዮች የባንክ አካውንቶች', 'የተጎጂዎች ህጋዊ ቃለ-መሃላ']
    },
    {
      id: 'INT-HER-2026-1104',
      noticeType: 'HERITAGE_THEFT',
      noticeColor: 'bg-emerald-600 text-white',
      wantedName: 'ሄንሪች ክላይን (Heinrich Klein)',
      alias: '«Art_Collector_X»',
      issuingNation: 'ኢትዮጵያ ቅርስ ባለስልጣን / ዩኔስኮ (UNESCO)',
      issuingFlag: '🇪🇹🇺🇳',
      jurisdiction: 'የአለም አቀፍ ቅርሶችና የታሪክ ሀብቶች አስመላሽ ፍርድ ቤት',
      crimeSummary: 'የጥንታዊ ብራና መጻሕፍትን፣ የወርቅ መስቀሎችንና የድንጋይ ላይ ጽሁፎችን ከገዳማትና ሙዚየሞች ሰርቆ ወደ ውጭ ሀገር ጨረታ ማዘዋወር።',
      estimatedDamageUSD: 31000000,
      lastKnownLocation: 'ጄኔቫ እና ለንደን የግል ጨረታ ማዕከላት',
      biometricMatchPct: 99.1,
      extraditionStatus: 'ጥያቄ ተልኳል (Dispatched)',
      extraditionTreatyArticle: 'የዩኔስኮ 1970 የባህል ቅርሶች ህገ-ወጥ ዝውውር መከላከያ አለም አቀፍ ውል',
      evidenceItems: ['የብራናው የራዲዮካርበን ምርመራ ውጤት', 'የጉምሩክ ሀሰተኛ ፈቃድ', 'የገዥና ሻጭ ሚስጥራዊ የውል ደብዳቤ']
    }
  ];

  const filteredNotices = filterType === 'ALL'
    ? crimeNotices
    : crimeNotices.filter(n => n.noticeType === filterType);

  const handleRunForensicScan = () => {
    setIsScanningForensics(true);
    setForensicResult(null);

    setTimeout(() => {
      setIsScanningForensics(false);
      setForensicResult(
        '✓ የፎረንሲክስ ምርመራ ተጠናቋል፡ 99.6% ባዮሜትሪክስና ሳተላይት ማረጋገጫ ተገኝቷል። የተጠርጣሪው አይፒና አካላዊ መገኛ በኢንተርፖልና በሀገሪቱ የፍትህ ሚኒስቴር የሰነድ ቋት ውስጥ በማህተም ተመዝግቧል!'
      );
    }, 2000);
  };

  const handleWhistleblowerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whistleDetails.trim()) return;

    const token = `WHISTLE-ZERO-KNOWLEDGE-${Math.floor(100000 + Math.random() * 900000)}`;
    setWhistleEvidenceToken(token);
    setWhistleDetails('');
    setWhistleTarget('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Sovereign Master Banner: Global Crime Investigation & Extradition Chamber */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-red-950/60 via-slate-900 to-amber-950/40 border-2 border-red-500/40 p-6 rounded-3xl shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 flex items-center justify-center text-white font-black text-2xl shadow-xl">
            7
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-white">
                የደህንነት አስጠባቂ ቤት (Global Security & Crime Investigation Hub)
              </h2>
              <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                <Radio className="w-3 h-3" />
                ኢንተርፖል ደረጃ (INTERPOL-GRADE)
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              በአለማችን በማንኛውም ሀገር የሚፈፀሙ የትኛውም አይነት ድንበር ዘለል ወንጀሎች፣ የሳይበር ጥቃቶች፣ የፋይናንስ ማጭበርበሮችና የቅርሶች ዝርፊያ በዘመናዊ ፎረንሲክስ የሚመረመሩበት፣ የተጠርጣሪዎች ሰነድ የሚለዋወጥበት እና ለህግ ተጠያቂ የሚደረጉበት ሉዓላዊ አዳራሽ።
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-slate-900/90 border border-red-500/50 px-4 py-2 rounded-2xl text-xs text-red-300 font-bold flex items-center gap-2 shadow-lg">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span>24/7 የአለም አቀፍ ወንጀል ክትትል ራዳር</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-[#0d111d] p-1.5 rounded-2xl border border-slate-800">
        <button
          onClick={() => setActiveTab('radar')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'radar'
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Globe2 className="w-4 h-4" />
          <span>የአለም አቀፍ ወንጀል ራዳርና ተፈላጊዎች (Wanted Radar)</span>
        </button>

        <button
          onClick={() => setActiveTab('forensics')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'forensics'
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Fingerprint className="w-4 h-4" />
          <span>የዲጂታል ፎረንሲክስና ባዮሜትሪክስ ላብራቶሪ (AI Forensics)</span>
        </button>

        <button
          onClick={() => setActiveTab('extradition')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'extradition'
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>የሀገራት ሰነድ ልውውጥና አሳልፎ የመስጠት ውል (Extradition MLAT)</span>
        </button>

        <button
          onClick={() => setActiveTab('whistleblower')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'whistleblower'
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>100% ሚስጥራዊ የህዝብ ጥቆማ ጓዳ (Whistleblower Vault)</span>
        </button>
      </div>

      {/* TAB 1: Global Crime Radar & Wanted Bulletins */}
      {activeTab === 'radar' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-bold">የወንጀል አይነት ማጣሪያ፡</span>
              <button
                onClick={() => setFilterType('ALL')}
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                  filterType === 'ALL' ? 'bg-red-600 text-white' : 'bg-slate-950 text-slate-300'
                }`}
              >
                ሁሉም (All)
              </button>
              <button
                onClick={() => setFilterType('RED_NOTICE')}
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                  filterType === 'RED_NOTICE' ? 'bg-red-600 text-white' : 'bg-slate-950 text-slate-300'
                }`}
              >
                🚨 ቀይ ማስታወቂያ (Red Notice)
              </button>
              <button
                onClick={() => setFilterType('CYBER_TERROR')}
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                  filterType === 'CYBER_TERROR' ? 'bg-purple-600 text-white' : 'bg-slate-950 text-slate-300'
                }`}
              >
                💻 የሳይበር ሽብርና ማጭበርበር
              </button>
              <button
                onClick={() => setFilterType('TRAFFICKING')}
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                  filterType === 'TRAFFICKING' ? 'bg-amber-600 text-white' : 'bg-slate-950 text-slate-300'
                }`}
              >
                🌐 የሰዎች ዝውውር
              </button>
              <button
                onClick={() => setFilterType('HERITAGE_THEFT')}
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                  filterType === 'HERITAGE_THEFT' ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-300'
                }`}
              >
                🏛️ የቅርስና የታሪክ ዝርፊያ
              </button>
            </div>

            <div className="text-xs text-slate-400 font-mono">
              የተመዘገቡ ንቁ አለም አቀፍ ፋይሎች፡ <strong className="text-white">{filteredNotices.length}</strong>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNotices.map((notice) => (
              <div
                key={notice.id}
                className="bg-[#101524] border border-slate-800 hover:border-red-500/50 rounded-3xl p-5 shadow-xl space-y-4 flex flex-col justify-between transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                    <span className="text-xs font-mono font-bold text-red-400 bg-red-950/80 px-2.5 py-1 rounded-lg border border-red-500/30">
                      {notice.id}
                    </span>
                    <span className="text-xs text-slate-300 font-bold flex items-center gap-1.5">
                      <span>{notice.issuingFlag}</span>
                      <span>{notice.issuingNation}</span>
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-black text-white flex items-center gap-2">
                        <span>{notice.wantedName}</span>
                        <span className="text-xs text-amber-400 font-medium font-mono">({notice.alias})</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">{notice.jurisdiction}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded-lg border border-emerald-500/30">
                      {notice.biometricMatchPct}% ማረጋገጫ
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                    {notice.crimeSummary}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                    <div className="p-2 bg-slate-900 rounded-lg">
                      <span className="text-slate-500 block">የጉዳት መጠን፡</span>
                      <strong className="text-amber-400 font-mono">${notice.estimatedDamageUSD.toLocaleString()} USD</strong>
                    </div>
                    <div className="p-2 bg-slate-900 rounded-lg">
                      <span className="text-slate-500 block">የመጨረሻ መገኛ፡</span>
                      <strong className="text-slate-200">{notice.lastKnownLocation}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <span className="text-amber-300 font-bold">{notice.extraditionStatus}</span>
                  </div>

                  <button
                    onClick={() => setSelectedNotice(notice)}
                    className="px-3 py-1.5 bg-red-600/90 hover:bg-red-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>የተሟላ የወንጀል ሰነድ መርምር</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: AI Forensics & Biometric Lab */}
      {activeTab === 'forensics' && (
        <div className="bg-[#101524] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-red-400" />
                የአለም አቀፍ የዲጂታል ፎረንሲክስ፣ ሳተላይትና ባዮሜትሪክስ ላብራቶሪ
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                የተጠርጣሪዎችን ዲጂታል ዱካ፣ የባንክ ፍሰት፣ የፊት ባዮሜትሪክስና አይፒ አድራሻ በቅጽበት የማጣራት ስርዓት
              </p>
            </div>

            <button
              onClick={handleRunForensicScan}
              disabled={isScanningForensics}
              className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 text-white font-black rounded-xl text-xs flex items-center gap-2 shadow-lg cursor-pointer disabled:opacity-60 transition-transform hover:scale-105"
            >
              <Cpu className={`w-4 h-4 ${isScanningForensics ? 'animate-spin' : ''}`} />
              <span>{isScanningForensics ? 'ምርመራ በሂደት ላይ ነው...' : 'የፎረንሲክስ ምርመራ አስጀምር (Run Scan)'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2">
              <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider block">
                ፩. የፊት ባዮሜትሪክስና አሻራ
              </span>
              <p className="text-xs text-slate-300">
                በአየር ማረፊያዎችና በድንበር ኬላዎች ከሚገኙ የCCTV ካሜራዎች ጋር በማገናኘት የ99.4% የፊት መመሳሰልን በቅጽበት ያጣራል
              </p>
              <div className="pt-2 text-xs font-mono text-emerald-400 font-bold">✓ 3D Facial Vectoring ንቁ ነው</div>
            </div>

            <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2">
              <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider block">
                ፪. የሳተላይትና አይፒ መገኛ
              </span>
              <p className="text-xs text-slate-300">
                የተጠርጣሪዎች መሳሪያዎች የሚልኳቸውን የሲግናል ሞገዶች በመመርመር የት ሀገርና የት ከተማ እንዳሉ በካርታ ያሳያል
              </p>
              <div className="pt-2 text-xs font-mono text-emerald-400 font-bold">✓ Satellite Geofencing ንቁ ነው</div>
            </div>

            <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2">
              <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider block">
                ፫. የባንክና የክሪፕቶ ፍሰት ክትትል
              </span>
              <p className="text-xs text-slate-300">
                የተዘረፉ ወይም በህገ-ወጥ መንገድ የተላለፉ ገንዘቦች በየትኞቹ አለም አቀፍ ባንኮች በኩል እንደዞሩ 100% ዱካቸውን ያገኛል
              </p>
              <div className="pt-2 text-xs font-mono text-emerald-400 font-bold">✓ Blockchain Ledger Watcher ንቁ ነው</div>
            </div>
          </div>

          {/* Forensic Output Notification */}
          {forensicResult && (
            <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-xs text-emerald-200 font-bold flex items-center gap-3 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>{forensicResult}</span>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Extradition & Mutual Legal Assistance (MLAT) */}
      {activeTab === 'extradition' && (
        <div className="bg-[#101524] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-400" />
              የሀገራት የሰነድ ልውውጥና አሳልፎ የመስጠት ህጋዊ ውል (Sovereign Extradition Protocol)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              በአለም አቀፍ የፍትህ ስምምነቶች መሰረት ተጠርጣሪዎችን ወንጀል ወደ ፈጸሙበት ሀገር አሳልፎ ለመስጠት የሚደረግ ዲፕሎማሲያዊና ህጋዊ የሰነድ ልውውጥ ማዕከል
            </p>
          </div>

          <div className="p-5 bg-slate-950/80 border border-amber-500/30 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-2">
                <Stamp className="w-4 h-4 text-amber-400" />
                የአለም አቀፍ አሳልፎ የመስጠት ይፋዊ ማህተም ያለው የሰነድ ቅጽ
              </span>
              <span className="text-xs font-mono text-slate-400">
                ማረጋገጫ፡ SHA-256 DIGITAL DIPLOMATIC SEAL
              </span>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-xs text-slate-200 font-mono">
              <p>«በዚህ ድህረገጽ የደህንነት ቤት (House 7) የተረጋገጡ የወንጀል ማስረጃዎች፣ የባዮሜትሪክስ አሻራዎች እና የባንክ ዝርፊያ ሰነዶች በአለም አቀፍ የኢንተርፖል ድንጋጌ መሰረት ለሚመለከተው ሀገር የፍትህ ሚኒስቴር በቀጥታ እንዲደርሱና ተጠርጣሪው በአስቸኳይ በቁጥጥር ስር ውሎ አሳልፎ እንዲሰጥ ህጋዊ ትዕዛዝ ተሰጥቷል።»</p>
              <div className="pt-2 text-[11px] text-amber-400 font-bold">
                ህጋዊ ተጠያቂነት፡ የተባበሩት መንግስታት የፍትህ ካውንስል እና የአባል ሀገራት የፖሊስ ዋና መምሪያዎች
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  const blob = new Blob([
                    "ONEWORLD SOVEREIGN DIPLOMATIC EXTRADITION DOSSIER\n" +
                    "Issued by: Oneworld House 7 (Global Security & Justice Hub)\n" +
                    "Founder: Zebene Asfye\n" +
                    "Cryptographic Seal: SHA256-ETH-INTERPOL-2026-SOVEREIGN\n" +
                    "Mandate: Cross-Border Criminal Apprehension & Document Authentication\n"
                  ], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'Oneworld_Extradition_Dossier_Official.txt';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>ህጋዊ የአሳልፎ መስጠት ሰነድ አውርድ (Export Legal Dossier)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Whistleblower Safe-Vault */}
      {activeTab === 'whistleblower' && (
        <div className="bg-[#101524] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-red-400" />
              100% ሚስጥራዊ የህዝብ ጥቆማና የምስክሮች ጥበቃ ጓዳ (Whistleblower Vault)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              ማንኛውም ዜጋ በየትኛውም የአለማችን ክፍል የሚፈፀሙ ወንጀሎችን፣ ሙስናን ወይም የሀገር ሀብት ዝርፊያን ያለ ስጋት ማንነቱ ሳይታወቅ በምስጢር የሚጠቁምበት ስርዓት
            </p>
          </div>

          <form onSubmit={handleWhistleblowerSubmit} className="space-y-4 max-w-2xl">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">የወንጀሉ ዘርፍ፡</label>
              <select
                value={whistleCategory}
                onChange={(e) => setWhistleCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500"
              >
                <option value="የፋይናንስና የባንክ ማጭበርበር">የፋይናንስና የባንክ ማጭበርበር</option>
                <option value="የሳይበር ጥቃትና የኮምፒውተር ጠለፋ">የሳይበር ጥቃትና የኮምፒውተር ጠለፋ</option>
                <option value="የህገ-ወጥ የሰዎች ዝውውር">የህገ-ወጥ የሰዎች ዝውውር</option>
                <option value="የቅርሶችና ታሪካዊ ሀብቶች ዝርፊያ">የቅርሶችና ታሪካዊ ሀብቶች ዝርፊያ</option>
                <option value="ከፍተኛ የሙስናና የኮንትሮባንድ ንግድ">ከፍተኛ የሙስናና የኮንትሮባንድ ንግድ</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">የተጠርጣሪው ግለሰብ ወይም ተቋም ስም (ከተቻለ)፡</label>
              <input
                type="text"
                value={whistleTarget}
                onChange={(e) => setWhistleTarget(e.target.value)}
                placeholder="ለምሳሌ፡ ድርጅት፣ አየር ማረፊያ፣ የቴሌግራም ግሩፕ፣ የባንክ አካውንት..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">የጥቆማው ዝርዝር ማስረጃና መረጃ፡</label>
              <textarea
                rows={4}
                value={whistleDetails}
                onChange={(e) => setWhistleDetails(e.target.value)}
                placeholder="ስለ ወንጀሉ የሚያውቁትን ማንኛውንም ማስረጃ፣ ሰዓት፣ ቦታ ወይም የገንዘብ መጠን እዚህ ይፃፉ... (ስልክዎ ወይም ማንነትዎ በፍጹም አይመዘገብም)"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-lg transition-transform hover:scale-105"
            >
              <Send className="w-4 h-4" />
              <span>ሚስጥራዊ ጥቆማውን በደህንነት ኔትወርኩ ላክ</span>
            </button>
          </form>

          {whistleEvidenceToken && (
            <div className="p-4 rounded-2xl bg-slate-900 border-2 border-emerald-500/50 space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>ጥቆማዎ በዜሮ-እውቀት (Zero-Knowledge Encryption) ሚስጥራዊነት ተመዝግቧል!</span>
              </div>
              <p className="text-xs text-slate-300 font-mono">
                የክትትል ምስጢራዊ መለያ ኮድዎ፡ <strong className="text-amber-400">{whistleEvidenceToken}</strong>
              </p>
              <p className="text-[11px] text-slate-400">
                ይህንን ኮድ በመያዝ ጉዳዩ ተጣርቶ እርምጃ ሲወሰድ የሚሰጠውን የማበረታቻ ሽልማት በኢትዮጵያ ንግድ ባንክ ወይም በቴሌብር መቀበል ይችላሉ።
              </p>
            </div>
          )}
        </div>
      )}

      {/* Detail Modal for Selected Crime Notice */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e121e] border-2 border-red-500/60 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-red-600/20 text-red-400 font-mono font-bold text-xs">
                  {selectedNotice.id}
                </span>
                <div>
                  <h3 className="text-base font-black text-white">{selectedNotice.wantedName}</h3>
                  <span className="text-xs text-amber-400 font-mono">ቅጽል ስም፡ {selectedNotice.alias}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedNotice(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-900 rounded-xl space-y-1">
                <span className="text-slate-400 block font-bold">የተከሰሰበት አለም አቀፍ ወንጀል፡</span>
                <p className="text-slate-200">{selectedNotice.crimeSummary}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-slate-900 rounded-xl">
                  <span className="text-slate-400 text-[11px] block">ጠያቂው ሀገር/ህብረት፡</span>
                  <strong className="text-white">{selectedNotice.issuingNation}</strong>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-xl">
                  <span className="text-slate-400 text-[11px] block">የህግ ማዕቀፍ (Treaty Article)፡</span>
                  <strong className="text-amber-400">{selectedNotice.extraditionTreatyArticle}</strong>
                </div>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl space-y-1.5">
                <span className="text-slate-400 block font-bold">የተያዙ ዲጂታልና አካላዊ ማስረጃዎች፡</span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                  {selectedNotice.evidenceItems.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedNotice(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                ዝጋ (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
