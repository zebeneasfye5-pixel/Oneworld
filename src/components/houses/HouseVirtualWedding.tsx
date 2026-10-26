import React, { useState } from 'react';
import { 
  Sparkles, 
  Heart, 
  Award, 
  FileCheck, 
  Users, 
  Download, 
  CheckCircle2, 
  Video, 
  Gift, 
  Music,
  Stamp
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const HouseVirtualWedding: React.FC = () => {
  const [groomName, setGroomName] = useState('ዳዊት ገብረመድህን (Dawit Gebre)');
  const [brideName, setBrideName] = useState('ሄለን ተስፋዬ (Helen Tesfaye)');
  const [elderName, setElderName] = useState('አጋቢ ሽማግሌ አባ ገብረኪዳን');
  const [witness1, setWitness1] = useState('አቶ ዮሴፍ በቀለ (ምስክር ፩)');
  const [witness2, setWitness2] = useState('ወ/ሮ አስቴር ደሳለኝ (ምስክር ፪)');
  const [civilCodeNumber, setCivilCodeNumber] = useState('ETH-CIV-MARRIAGE-2026-88421');
  
  const [ceremonyStep, setCeremonyStep] = useState<number>(3); // Vows & Signing ready
  const [isContractSigned, setIsContractSigned] = useState(false);
  const [contractSignedDate, setContractSignedDate] = useState<string>('');

  const handleSignMarriageContract = () => {
    setIsContractSigned(true);
    setContractSignedDate(new Date().toLocaleDateString('am-ET', { year: 'numeric', month: 'long', day: 'numeric' }));
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
  };

  const handleDownloadCertificate = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Wedding House Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-amber-950/50 via-rose-950/40 to-slate-900 border border-amber-500/30 p-6 rounded-3xl shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-lg">
            5
          </div>
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              የሰርግ ቤት (Virtual Wedding & Legal Matrimony Hall)
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              በአለም ላይ የመጀመሪያው የኦንላይን ህጋዊ የሰርግ ስነ-ስርአት፤ ሚዜዎች፣ አጋቢ ሽማግሌዎች፣ ምስክሮች፣ የባህል ጥሎሽና አለም አቀፍ ህጋዊ የፍታብሄር ጋብቻ ውል
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-rose-950/70 border border-rose-500/50 px-3.5 py-1.5 rounded-xl text-xs text-rose-200 font-bold">
          <Heart className="w-4 h-4 fill-current text-rose-400" />
          <span>የቀጥታ የሰርግ ስነ-ስርአት በሂደት ላይ (Live Wedding)</span>
        </div>
      </div>

      {/* Main Virtual Wedding Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Video Stage & Ceremony */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#101524] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  የሙሽሮቹ የክብር መድረክ (Sacred Matrimony Stage)
                </h3>
                <p className="text-xs text-amber-300 font-semibold mt-0.5">
                  ሙሽራው፡ {groomName} · ሙሽሪት፡ {brideName}
                </p>
              </div>

              <div className="flex items-center gap-1.5 bg-black/60 px-3 py-1 rounded-xl text-xs text-slate-300 border border-slate-800">
                <Video className="w-3.5 h-3.5 text-emerald-400" />
                <span>4K Live Zoom-Meeting</span>
              </div>
            </div>

            {/* Visual Stage Representation */}
            <div className="relative w-full aspect-video rounded-2xl bg-gradient-to-br from-amber-900/60 via-purple-950/70 to-slate-950 border-2 border-amber-500/50 overflow-hidden p-6 flex flex-col justify-between shadow-2xl">
              <div className="flex items-center justify-between z-10">
                <span className="bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-amber-300 border border-amber-500/40">
                  የጋብቻ ቃለ-መሀላና የስምምነት ማዕከል
                </span>
                <span className="bg-black/70 px-2.5 py-1 rounded-lg text-xs text-rose-300 font-semibold flex items-center gap-1">
                  💍 የዘላቂ ፍቅር ቃል ኪዳን
                </span>
              </div>

              {/* Bride & Groom Avatars */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-auto z-10">
                {/* Groom */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full border-4 border-amber-400 shadow-xl overflow-hidden mb-2">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
                      alt="Groom"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs font-black text-white">{groomName}</span>
                  <span className="text-[10px] text-amber-300 font-semibold">ሙሽራው (Groom)</span>
                </div>

                {/* Rings Center Icon */}
                <div className="w-14 h-14 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-2xl shadow-2xl">
                  💍
                </div>

                {/* Bride */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full border-4 border-rose-400 shadow-xl overflow-hidden mb-2">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                      alt="Bride"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs font-black text-white">{brideName}</span>
                  <span className="text-[10px] text-rose-300 font-semibold">ሙሽሪት (Bride)</span>
                </div>
              </div>

              {/* Elders & Witnesses bar */}
              <div className="bg-black/80 backdrop-blur-md p-3 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-2 z-10 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">አጋቢ ሽማግሌ፡</span>
                  <strong className="text-white text-xs">{elderName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">ምስክሮች፡</span>
                  <span className="text-slate-300 text-[11px]">{witness1} · {witness2}</span>
                </div>
                <button
                  onClick={() => confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } })}
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs cursor-pointer"
                >
                  🎉 እንኳን ደስ አላችሁ (Celebrate!)
                </button>
              </div>
            </div>

            {/* Traditional Dowry Showcase (የባህል ጥሎሽ) */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
              <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Gift className="w-4 h-4 text-amber-400" />
                የተሟላ የባህል ጥሎሽና ስጦታዎች (Traditional Dowry & Gifts)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-center">
                  <span className="text-lg block">👑</span>
                  <span className="font-bold text-white block">የወርቅ ጌጣጌጥ</span>
                  <span className="text-[10px] text-slate-400">የአንገትና የእጅ ሃብል</span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-center">
                  <span className="text-lg block">👗</span>
                  <span className="font-bold text-white block">የባህል ጥልፍ ልብስ</span>
                  <span className="text-[10px] text-slate-400">የሀበሻ ቀሚስና ጋቢ</span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-center">
                  <span className="text-lg block">🐂</span>
                  <span className="font-bold text-white block">የእርድ ስጦታ</span>
                  <span className="text-[10px] text-slate-400">ለቤተሰብ ድግስ የተዘጋጀ</span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-center">
                  <span className="text-lg block">💼</span>
                  <span className="font-bold text-white block">የሙሽሪት ሻንጣ</span>
                  <span className="text-[10px] text-slate-400">የተሟሉ አልባሳት</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Legally Binding Marriage Contract */}
        <div className="bg-[#101524] border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <FileCheck className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-sm font-extrabold text-white">
                  ህጋዊ የጋብቻ ውል ሰነድ (Legal Contract)
                </h3>
                <p className="text-[10px] text-slate-400 font-mono">
                  {civilCodeNumber}
                </p>
              </div>
            </div>

            {/* Official Certificate Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/60 text-center space-y-3 relative shadow-inner">
              <div className="w-10 h-10 mx-auto rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-400 font-black text-sm">
                ዓ
              </div>

              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-widest text-amber-400 font-bold block">
                  የጋብቻ ህጋዊ ማረጋገጫ ሰነድ
                </span>
                <h4 className="text-xs font-black text-white">
                  በኢትዮጵያ የፍትሐብሔር ህግ ቁጥር 577-624 እና አለም አቀፍ የጋብቻ ስምምነት መሰረት
                </h4>
              </div>

              <div className="py-2 px-3 bg-slate-900/80 rounded-xl border border-slate-800 text-left text-[11px] space-y-1 text-slate-300">
                <div>ተጋቢ ፩ (ሙሽራው)፡ <strong>{groomName}</strong></div>
                <div>ተጋቢ ፪ (ሙሽሪት)፡ <strong>{brideName}</strong></div>
                <div>አጋቢ ሽማግሌ፡ <strong>{elderName}</strong></div>
                <div>ምስክሮች፡ <strong>{witness1}</strong>፣ <strong>{witness2}</strong></div>
                <div>የተመዘገበበት ቀን፡ <strong>{contractSignedDate || 'ጥቅምት 2026 እ.ኤ.አ'}</strong></div>
              </div>

              {isContractSigned ? (
                <div className="p-2.5 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs flex items-center justify-center gap-2 font-bold">
                  <Stamp className="w-4 h-4 text-emerald-400" />
                  <span>ውሉ በህግ ፀድቋል (Signed & Sealed)</span>
                </div>
              ) : (
                <button
                  onClick={handleSignMarriageContract}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black rounded-xl text-xs transition-all shadow-md shadow-amber-950 cursor-pointer"
                >
                  ውሉን በዲጂታል ፈርም (Sign & Seal Marriage)
                </button>
              )}
            </div>

            <p className="text-[10px] text-slate-400 text-center leading-relaxed">
              * ይህ የጋብቻ ሰነድ በየትኛውም አለም ሀገረ መንግስት ህግና ፍርድ ቤት ተቀባይነት ያለው ህጋዊ ዲጂታል ፊርማና ቁጥር ይዟል።
            </p>
          </div>

          {/* Download certificate */}
          <button
            onClick={handleDownloadCertificate}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>የጋብቻ የምስክር ወረቀቱን አትም (Print Deed)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
