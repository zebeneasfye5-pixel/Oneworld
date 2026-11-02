import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Lock, 
  EyeOff, 
  ShieldCheck, 
  Send, 
  Sparkles, 
  UserCheck, 
  Users2, 
  Briefcase, 
  FileKey,
  Video,
  Mic,
  AlertCircle
} from 'lucide-react';

export type SanctuaryMode = 'courtship' | 'legal_consultation' | 'private_business' | 'confidential_treaty';

interface SanctuaryProfile {
  id: string;
  pseudonym: string;
  category: SanctuaryMode;
  categoryLabel: string;
  profession: string;
  intent: string;
  securityRating: string;
}

export const HouseConfidentialCourtship: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<SanctuaryMode>('courtship');
  const [occupantsCount, setOccupantsCount] = useState<number>(2); // Strictly 2 persons max
  const [isMaskedMode, setIsMaskedMode] = useState(true);

  const [candidates] = useState<SanctuaryProfile[]>([
    {
      id: 'c-1',
      pseudonym: 'ጥበበኛ ሰላም (Secret Companion)',
      category: 'courtship',
      categoryLabel: 'የትዳርና የፍቅር ሚስጥር',
      profession: 'የሶፍትዌር መሃንዲስ',
      intent: 'ዘላቂ ጋብቻና ትዳር',
      securityRating: 'E2EE Level-5'
    },
    {
      id: 'c-2',
      pseudonym: 'አማካሪ ዳኝነት (Legal Counselor)',
      category: 'legal_consultation',
      categoryLabel: 'የህግና የንብረት ጉዳይ',
      profession: 'ከፍተኛ የህግ አማካሪ',
      intent: 'ሚስጥራዊ የህግና የውል ምክክር',
      securityRating: 'E2EE Level-5'
    },
    {
      id: 'c-3',
      pseudonym: 'አለም አቀፍ ባለሀብት (Private Investor)',
      category: 'private_business',
      categoryLabel: 'የንግድና ኢንቨስትመንት ሚስጥር',
      profession: 'የካፒታል ፈንድ መሪ',
      intent: 'ስልታዊ የንግድ ውህደትና ስምምነት',
      securityRating: 'E2EE Level-5'
    }
  ]);

  const [selectedProfile, setSelectedProfile] = useState<SanctuaryProfile>(candidates[0]);
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string; time: string }[]>([
    {
      sender: 'ስርአት (System)',
      text: 'ሚስጥር ቤቱ በሙሉ ምስጢራዊነት የተቆለፈ ነው። በአንድ ጊዜ ከ2 ሰው በላይ መግባት በጥብቅ የተከለከለ ነው (Max 2 Persons Only)።',
      time: '10:00'
    },
    {
      sender: 'እርስዎ (You)',
      text: 'ሰላም፣ ጉዳያችንን በሙሉ ሚስጥራዊነት መወያየት እንችላለን።',
      time: '10:02'
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages((prev) => [
      ...prev,
      { sender: 'እርስዎ (You)', text: chatInput.trim(), time }
    ]);
    const userText = chatInput.trim();
    setChatInput('');

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: selectedProfile.pseudonym,
          text: `መልእክትዎ በሚስጥር ደርሶኛል። በዚህ ርዕሰ ጉዳይ ላይ በዝርዝር እንወያይ።`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/40 p-6 rounded-3xl shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold text-lg">
            4
          </div>
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              የሚስጥር ቤት (Confidential Sanctuary & Zero-Leakage Chamber)
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              ለትዳር ፈላጊዎች፣ ለግል ባለጉዳዮች፣ ለህግ አማካሪዎችና ለከፍተኛ የንግድ ድርድሮች የተዘጋጀ ፤ በአንድ ጊዜ ለ2 ሰዎች ብቻ የተፈቀደ የተከበረ ጓዳ
            </p>
          </div>
        </div>

        {/* Max 2 Cap Badge & Mask Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-rose-950/80 border border-rose-500/60 px-3 py-1.5 rounded-xl text-xs text-rose-200 font-bold">
            <Lock className="w-3.5 h-3.5 text-rose-400" />
            <span>ገደብ፡ 2 ሰዎች ብቻ (Strictly 2 Max)</span>
          </div>

          <button
            onClick={() => setIsMaskedMode(!isMaskedMode)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
              isMaskedMode
                ? 'bg-purple-950/60 border-purple-500/50 text-purple-300'
                : 'bg-slate-900 border-slate-700 text-slate-300'
            }`}
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>{isMaskedMode ? 'ማንነት ተሸፍኗል (Masked)' : 'ማንነት ክፍት ነው'}</span>
          </button>
        </div>
      </div>

      {/* Category Tabs: Courtship, Legal, Business */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'courtship', label: 'የትዳርና የፍቅር ሚስጥር', icon: HeartHandshake },
          { id: 'legal_consultation', label: 'የህግና የግል ክርክር ሚስጥር', icon: ShieldCheck },
          { id: 'private_business', label: 'የንግድና ኢንቨስትመንት ድርድር', icon: Briefcase },
          { id: 'confidential_treaty', label: 'የስምምነትና የአደራ ጓዳ', icon: FileKey },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: 1-on-1 Sanctuary Room */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: The 2 Persons in the Room */}
        <div className="space-y-4">
          <div className="bg-[#101524] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-black text-white flex items-center gap-1.5">
                <Users2 className="w-4 h-4 text-purple-400" />
                <span>በጓዳው ውስጥ ያሉ 2 ሰዎች (Current Occupants: 2/2)</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                የተቆለፈ (Room Full)
              </span>
            </div>

            {/* Person 1: You */}
            <div className="p-3 bg-slate-950/80 border border-purple-500/30 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-600/30 border border-purple-500 flex items-center justify-center font-bold text-xs text-purple-300">
                {isMaskedMode ? '🎭' : 'እርስዎ'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  {isMaskedMode ? 'ሚስጥራዊ ተሳታፊ ፩ (You)' : 'እርስዎ (Verified Member)'}
                </p>
                <p className="text-[10px] text-purple-400">ባለጉዳይ / ተወያይ</p>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">መስመር ላይ</span>
            </div>

            {/* Person 2: Selected Peer */}
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600/30 border border-indigo-500 flex items-center justify-center font-bold text-xs text-indigo-300">
                {isMaskedMode ? '🎭' : 'አጋር'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  {selectedProfile.pseudonym}
                </p>
                <p className="text-[10px] text-indigo-400">{selectedProfile.categoryLabel}</p>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">መስመር ላይ</span>
            </div>

            {/* Security Guarantee Notice */}
            <div className="p-3 bg-purple-950/30 border border-purple-500/20 rounded-2xl text-[11px] text-purple-200/90 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-purple-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>የምስጢራዊነት ዋስትና (Zero-Leakage):</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                ንግግሮች በሶስተኛ ወገን አይቀዱም፤ የቪዲዮና ድምፅ ግንኙነቱ በቀጥታ ከእርስዎ ስልክ ወደ ሌላኛው ሰው (Peer-to-Peer E2EE) ብቻ ይፈሳል።
              </p>
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Confidential 1-on-1 Chat & Video Channel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#101524] border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col h-[520px]">
            {/* Stage Video Preview Bar */}
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-white">
                  የተቆለፈ የ2 ሰዎች የቀጥታ ቻነል ({selectedProfile.pseudonym})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-purple-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                  {selectedProfile.securityRating}
                </span>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 no-scrollbar">
              {chatMessages.map((msg, idx) => {
                const isMe = msg.sender.includes('እርስዎ') || msg.sender.includes('You');
                const isSys = msg.sender.includes('ስርአት');

                if (isSys) {
                  return (
                    <div key={idx} className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/20 text-center text-[11px] text-purple-300">
                      {msg.text}
                    </div>
                  );
                }

                return (
                  <div
                    key={idx}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] text-slate-400 font-bold">{msg.sender}</span>
                      <span className="text-[9px] text-slate-600">{msg.time}</span>
                    </div>
                    <div
                      className={`p-3 rounded-2xl max-w-md text-xs leading-relaxed ${
                        isMe
                          ? 'bg-purple-600 text-white rounded-tr-none shadow-md'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Send Input */}
            <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                placeholder="ሚስጥራዊ መልእክት እዚህ ይጻፉ..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>ላክ</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
