import React, { useState } from 'react';
import { HeartHandshake, Lock, EyeOff, ShieldCheck, Send, Sparkles, UserCheck } from 'lucide-react';

interface MatchCandidate {
  id: string;
  pseudonym: string;
  age: number;
  profession: string;
  location: string;
  intent: string;
  values: string[];
}

export const HouseConfidentialCourtship: React.FC = () => {
  const [candidates] = useState<MatchCandidate[]>([
    {
      id: 'c-1',
      pseudonym: 'ጥበበኛ ሰላም (Peaceful Seeker)',
      age: 28,
      profession: 'የሶፍትዌር መሃንዲስ',
      location: 'አዲስ አበባ / ዲያስፖራ',
      intent: 'ቅዱስ ጋብቻና ዘላቂ ትዳር',
      values: ['ፈሪሀ-እግዚአብሔር', 'እውነት', 'የቤተሰብ ፍቅር', 'ትጋት']
    },
    {
      id: 'c-2',
      pseudonym: 'ብርሃናዊት (Birehan)',
      age: 26,
      profession: 'የጤና ባለሙያ (ሐኪም)',
      location: 'አዲስ አበባ',
      intent: 'የህይወት አጋር መፈለግ',
      values: ['ደግነት', 'ትህትና', 'መልካም ስነምግባር', 'ትምህርት']
    }
  ]);

  const [activeChatCandidate, setActiveChatCandidate] = useState<MatchCandidate | null>(null);
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string }[]>([
    { sender: 'ስርአት', text: 'እንኳን ወደ የሚስጥር ቤት በደህና መጡ። ማንነትዎና ንግግርዎ በምስጢር የተጠበቀ ነው።' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isMaskedMode, setIsMaskedMode] = useState(true);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setChatMessages([...chatMessages, { sender: 'እርስዎ (You)', text: chatInput.trim() }]);
    setChatInput('');

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: activeChatCandidate?.pseudonym || 'ሚስጥራዊ አማካሪ',
          text: 'መልእክትዎ በሚስጥር ደርሶኛል። በትዳርና በህይወት አላማችን ዙሪያ በዝርዝር እንወያይ።'
        }
      ]);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-purple-950/40 via-pink-950/30 to-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold text-lg">
            4
          </div>
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              የሚስጥር ቤት (Confidential Courtship Sanctuary)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              በትዳር የሚፈላለጉ ጥንዶች እና ሚስጥረኞች ማንነታቸውና ሚስጥራቸው ሳይባክን የሚመካከሩበትና የሚተዋወቁበት የተከበረ ጓዳ
            </p>
          </div>
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
          <span>{isMaskedMode ? 'ማንነት ተሸፍኗል (Masked Mode ON)' : 'ማንነት ክፍት ነው'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Candidates List */}
        <div className="space-y-4">
          <div className="bg-[#101524] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-3">
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-800">
              <Sparkles className="w-4 h-4 text-pink-400" />
              የትዳር ፈላጊዎች (Verified Courtship Profiles)
            </h3>

            <div className="space-y-2.5">
              {candidates.map((cand) => (
                <div
                  key={cand.id}
                  onClick={() => setActiveChatCandidate(cand)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    activeChatCandidate?.id === cand.id
                      ? 'bg-purple-950/40 border-purple-500/60 shadow-md ring-1 ring-purple-500/40'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{cand.pseudonym}</span>
                    <span className="text-[10px] text-purple-400 font-semibold">{cand.age} አመት</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mb-2">
                    {cand.profession} · {cand.location}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {cand.values.map((v, i) => (
                      <span key={i} className="text-[9px] bg-slate-950 text-slate-300 px-1.5 py-0.5 rounded border border-slate-800">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Private Confidential Chat Room */}
        <div className="lg:col-span-2 bg-[#101524] border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-between h-[550px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-purple-600/40 border border-purple-500/50 flex items-center justify-center text-purple-300 font-bold text-xs">
                  {activeChatCandidate?.pseudonym.charAt(0) || 'ሚ'}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {activeChatCandidate?.pseudonym || 'ሚስጥራዊ የውይይት ጓዳ (Private Consultation)'}
                  </h4>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <ShieldCheck className="w-3 h-3" />
                    ምንም አይነት መረጃ ወደ ውጭ አይወጣም
                  </span>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="py-4 space-y-3 overflow-y-auto max-h-[380px] text-xs">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-2xl max-w-md ${
                    msg.sender.includes('You') || msg.sender.includes('እርስዎ')
                      ? 'ml-auto bg-purple-900/60 border border-purple-700/60 text-purple-100'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="text-[10px] font-bold text-slate-400 mb-0.5">{msg.sender}</div>
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-2 border-t border-slate-800">
            <input
              type="text"
              placeholder="ሚስጥራዊ ሀሳብዎን ወይም የትዳር ጥያቄዎን እዚህ ይፃፉ..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              className="p-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
