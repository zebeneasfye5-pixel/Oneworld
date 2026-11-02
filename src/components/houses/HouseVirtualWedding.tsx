import React, { useState, useRef } from 'react';
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
  Stamp,
  Printer,
  PenTool,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SignaturePadProps {
  label: string;
  onSave: (dataUrl: string) => void;
  savedSignature?: string;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ label, onSave, savedSignature }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(!!savedSignature);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    if (isDrawing && canvasRef.current) {
      setIsDrawing(false);
      onSave(canvasRef.current.toDataURL());
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    onSave('');
  };

  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-bold text-slate-300">{label}</span>
        {hasDrawn && (
          <button
            type="button"
            onClick={clearCanvas}
            className="text-[10px] text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>አጥፋ (Clear)</span>
          </button>
        )}
      </div>

      <div className="relative border border-dashed border-amber-500/40 rounded-lg overflow-hidden bg-slate-900/60 touch-none h-20">
        <canvas
          ref={canvasRef}
          width={240}
          height={80}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full cursor-crosshair"
        />
        {!hasDrawn && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-[10px] text-slate-500 gap-1">
            <PenTool className="w-3 h-3 text-amber-500/60" />
            <span>እዚህ ላይ በጣት ወይም በማውስ ይፈርሙ</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const HouseVirtualWedding: React.FC = () => {
  // Matrimonial Parties
  const [groomName, setGroomName] = useState('ዳዊት ገብረመድህን (Dawit Gebre)');
  const [brideName, setBrideName] = useState('ሄለን ተስፋዬ (Helen Tesfaye)');
  
  // Best Men (የወንዱ ሚዜዎች)
  const [bestMan1, setBestMan1] = useState('ዮሐንስ በቀለ (የወንድ ሚዜ ፩)');
  const [bestMan2, setBestMan2] = useState('ኤርሚያስ ታደሰ (የወንድ ሚዜ ፪)');

  // Bridesmaids (የሴቷ ሚዜዎች)
  const [bridesmaid1, setBridesmaid1] = useState('ሰላማዊት አሰፋ (የሴት ሚዜ ፩)');
  const [bridesmaid2, setBridesmaid2] = useState('ሜሮን ካሳሁን (የሴት ሚዜ ፪)');

  // Representative Fathers (የተጋቢዎች ተጠሪ አባቶች)
  const [groomFather, setGroomFather] = useState('አቶ ገብረመድህን ወልደማርያም (የሙሽራው አባት)');
  const [brideFather, setBrideFather] = useState('አቶ ተስፋዬ ገብረእግዚአብሔር (የሙሽሪት አባት)');

  // 3 Official Witnesses (3 ህጋዊ ምስክሮች)
  const [witness1, setWitness1] = useState('ዶ/ር ቴዎድሮስ ሀይሌ (ምስክር ፩)');
  const [witness2, setWitness2] = useState('ወ/ሮ ብርቱካን ደሳለኝ (ምስክር ፪)');
  const [witness3, setWitness3] = useState('ኢንጂነር አማኑኤል ግርማ (ምስክር ፫)');

  const [weddingLocation, setWeddingLocation] = useState('አዲስ አበባ፣ ኢትዮጵያ (Addis Ababa, Ethiopia)');
  const [civilCodeNumber] = useState('ETH-CIV-MARRIAGE-2026-88421');
  const [isContractSigned, setIsContractSigned] = useState(false);
  const [contractSignedDate, setContractSignedDate] = useState<string>('');

  // Signatures Data URLs
  const [signatures, setSignatures] = useState<Record<string, string>>({});

  const updateSignature = (partyKey: string, dataUrl: string) => {
    setSignatures((prev) => ({ ...prev, [partyKey]: dataUrl }));
  };

  const handleSignMarriageContract = () => {
    setIsContractSigned(true);
    setContractSignedDate(
      new Date().toLocaleDateString('am-ET', { year: 'numeric', month: 'long', day: 'numeric' })
    );
    try {
      confetti({ particleCount: 160, spread: 100, origin: { y: 0.5 } });
    } catch {}
  };

  const handleDownloadCertificate = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Wedding House Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-amber-950/60 via-rose-950/40 to-slate-900 border border-amber-500/30 p-6 rounded-3xl shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-lg">
            5
          </div>
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              የሰርግ ቤት (Virtual Wedding & Legal Matrimony Hall)
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              የሙሽሮች፣ የወንድና የሴት ሚዜዎች፣ የተጋቢዎች ተጠሪ አባቶችና የ3ቱ ምስክሮች ዲጂታል የሰማኒያ ህጋዊ የጋብቻ ውል ስነ-ስርአት
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-rose-950/80 border border-rose-500/50 px-3.5 py-1.5 rounded-xl text-xs text-rose-200 font-bold">
          <Heart className="w-4 h-4 fill-current text-rose-400" />
          <span>የቀጥታ የሰርግ ስነ-ስርአት በሂደት ላይ (Live Wedding)</span>
        </div>
      </div>

      {/* Main Grid: Live Ceremony Stage & Matrimonial Parties */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stage Col (2 spans) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Visual Stage */}
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

            {/* Visual Stage */}
            <div className="relative w-full aspect-video rounded-2xl bg-gradient-to-br from-amber-900/60 via-purple-950/70 to-slate-950 border-2 border-amber-500/50 overflow-hidden p-6 flex flex-col justify-between shadow-2xl">
              <div className="flex items-center justify-between z-10">
                <span className="bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-amber-300 border border-amber-500/40">
                  የጋብቻ ቃለ-መሀላና የስምምነት ማዕከል
                </span>
                <span className="bg-black/70 px-2.5 py-1 rounded-lg text-xs text-rose-300 font-semibold flex items-center gap-1">
                  💍 የዘላቂ ፍቅር ቃል ኪዳን
                </span>
              </div>

              {/* Bride & Groom Stage Avatars */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-auto z-10">
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

                <div className="w-14 h-14 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-2xl shadow-2xl">
                  💍
                </div>

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

              {/* Stage Footer */}
              <div className="flex items-center justify-between text-xs text-slate-300 z-10 pt-2 border-t border-white/10">
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  የድምፅና ምስል ቀጥታ ግንኙነት ክፍት ነው
                </span>
                <span className="text-[11px] font-mono text-amber-300">
                  {weddingLocation}
                </span>
              </div>
            </div>
          </div>

          {/* Bridal Party & Witnesses Grid */}
          <div className="bg-[#101524] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>የተጋቢዎች ተጠሪዎች፣ ሚዜዎችና ምስክሮች (Matrimonial Council)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Representative Fathers */}
              <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2">
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                  የተጋቢዎች ተጠሪ አባቶች (Representative Fathers)
                </span>
                <div className="space-y-1.5 text-xs">
                  <div className="p-2 bg-slate-950 rounded-xl flex items-center justify-between">
                    <span className="text-slate-300 font-medium">{groomFather}</span>
                    <span className="text-[10px] text-emerald-400 font-bold">የተረጋገጠ</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded-xl flex items-center justify-between">
                    <span className="text-slate-300 font-medium">{brideFather}</span>
                    <span className="text-[10px] text-emerald-400 font-bold">የተረጋገጠ</span>
                  </div>
                </div>
              </div>

              {/* Best Men & Bridesmaids */}
              <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2">
                <span className="text-[10px] font-black uppercase text-rose-400 tracking-wider">
                  የወንዱና የሴቷ ሚዜዎች (Best Men & Bridesmaids)
                </span>
                <div className="space-y-1.5 text-xs">
                  <div className="p-2 bg-slate-950 rounded-xl flex items-center justify-between">
                    <span className="text-slate-300 font-medium">{bestMan1} & {bestMan2}</span>
                    <span className="text-[10px] text-amber-400 font-bold">ወንድ ሚዜዎች</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded-xl flex items-center justify-between">
                    <span className="text-slate-300 font-medium">{bridesmaid1} & {bridesmaid2}</span>
                    <span className="text-[10px] text-rose-400 font-bold">ሴት ሚዜዎች</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3 Witnesses */}
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2">
              <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">
                3ቱ ህጋዊ ምስክሮች (The 3 Solemn Witnesses)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2 bg-slate-950 rounded-xl text-center">
                  <span className="font-bold text-white block">{witness1}</span>
                  <span className="text-[10px] text-indigo-400 font-semibold">ምስክር ፩</span>
                </div>
                <div className="p-2 bg-slate-950 rounded-xl text-center">
                  <span className="font-bold text-white block">{witness2}</span>
                  <span className="text-[10px] text-indigo-400 font-semibold">ምስክር ፪</span>
                </div>
                <div className="p-2 bg-slate-950 rounded-xl text-center">
                  <span className="font-bold text-white block">{witness3}</span>
                  <span className="text-[10px] text-indigo-400 font-semibold">ምስክር ፫</span>
                </div>
              </div>
            </div>

            {/* Interactive Digital Signature Pads */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white flex items-center gap-1.5">
                  <PenTool className="w-3.5 h-3.5 text-amber-400" />
                  <span>እውነተኛ ዲጂታል ፊርማ (Live Digital Signature Pads)</span>
                </span>
                <span className="text-[10px] text-slate-400">በንክኪ ወይም በማውስ ይፈርሙ</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <SignaturePad
                  label="የሙሽራው ፊርማ (Groom)"
                  onSave={(d) => updateSignature('groom', d)}
                  savedSignature={signatures['groom']}
                />
                <SignaturePad
                  label="የሙሽሪት ፊርማ (Bride)"
                  onSave={(d) => updateSignature('bride', d)}
                  savedSignature={signatures['bride']}
                />
                <SignaturePad
                  label="የሙሽራው አባት (Father)"
                  onSave={(d) => updateSignature('father', d)}
                  savedSignature={signatures['father']}
                />
                <SignaturePad
                  label="የምስክሮች ፊርማ (Witnesses)"
                  onSave={(d) => updateSignature('witness', d)}
                  savedSignature={signatures['witness']}
                />
              </div>

              {!isContractSigned ? (
                <button
                  onClick={handleSignMarriageContract}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:opacity-95 text-slate-950 font-black rounded-2xl text-sm shadow-xl shadow-amber-500/20 cursor-pointer transition flex items-center justify-center gap-2"
                >
                  <Stamp className="w-5 h-5 text-slate-950" />
                  <span>የሰማኒያ የጋብቻ ውል ሰነዱን በህግ አንቀጾች አጽድቅና ፈርም</span>
                </button>
              ) : (
                <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl flex items-center justify-between text-xs text-emerald-200">
                  <span className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    የሰማኒያ ውል ሰነዱ በሙሽሮቹ፣ በአባቶችና በ3ቱ ምስክሮች ፊርማ በህግ ፀድቋል!
                  </span>
                  <button
                    onClick={handleDownloadCertificate}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl cursor-pointer flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>አትም / አውርድ</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Official Printable Marriage Certificate */}
        <div className="space-y-6">
          <div className="bg-[#0f1320] border-2 border-amber-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden print:m-0 print:border-black">
            <div className="text-center space-y-2 border-b-2 border-amber-500/40 pb-4">
              <div className="text-3xl">📜</div>
              <h4 className="text-xs font-black uppercase tracking-widest text-amber-400">
                Oneworld ዓለም አቀፍ የሰማኒያ ጋብቻ ውል ሰነድ
              </h4>
              <p className="text-[10px] text-slate-400">
                የኢትዮጵያ የፍትሐብሔር ሕግ እና የተባበሩት መንግስታት አለም አቀፍ የቤተሰብ ድንጋጌ
              </p>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-[9px] font-mono text-amber-300">
                {civilCodeNumber}
              </div>
            </div>

            <div className="py-4 space-y-3 text-[11px] text-slate-300 leading-relaxed">
              <p className="italic bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                "እኛ ሙሽራው <strong className="text-amber-300">{groomName}</strong> እና ሙሽሪት <strong className="text-rose-300">{brideName}</strong> በሙሉ ነፃ ፈቃዳችን፣ በተጠሪ አባቶቻችን ፈቃድና በ3ቱ ህጋዊ ምስክሮች ፊት ዘላቂ የጋብቻ ህብረት ፈፅመናል።"
              </p>

              <div className="space-y-1 text-[10px] text-slate-400">
                <p>• <strong>አንቀጽ ፩፡</strong> እኩልነት፣ መከባበርና የጋራ ሀብት አስተዳደር።</p>
                <p>• <strong>አንቀጽ ፪፡</strong> በታማኝነትና በሰላም አብሮ የመኖር ቃል ኪዳን።</p>
                <p>• <strong>አንቀጽ ፫፡</strong> አለም አቀፍ ህጋዊ ተፈጻሚነትና የፍርድ ቤት እውቅና።</p>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[10px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">ቦታ / Location:</span>
                  <span className="font-bold text-white">{weddingLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ቀን / Date:</span>
                  <span className="font-bold text-amber-400">{contractSignedDate || 'ጥቅምት 2026'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">የምስክሮች ቁጥር:</span>
                  <span className="font-bold text-emerald-400">3 ህጋዊ ምስክሮች</span>
                </div>
              </div>

              {/* Render Signatures Preview */}
              <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-center text-[9px]">
                <div className="p-1.5 bg-slate-950 rounded-lg">
                  <span className="text-slate-400 block mb-1">የሙሽራው ፊርማ</span>
                  {signatures['groom'] ? (
                    <img src={signatures['groom']} alt="Groom sign" className="h-7 mx-auto" />
                  ) : (
                    <span className="text-slate-600 italic">ፊርማ በመጠባበቅ ላይ</span>
                  )}
                </div>
                <div className="p-1.5 bg-slate-950 rounded-lg">
                  <span className="text-slate-400 block mb-1">የሙሽሪት ፊርማ</span>
                  {signatures['bride'] ? (
                    <img src={signatures['bride']} alt="Bride sign" className="h-7 mx-auto" />
                  ) : (
                    <span className="text-slate-600 italic">ፊርማ በመጠባበቅ ላይ</span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-xs">
                  ⚖️
                </div>
                <span className="text-[10px] font-bold text-amber-400">ህጋዊ ማህተም</span>
              </div>

              <button
                onClick={handleDownloadCertificate}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl cursor-pointer shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ሰርተፊኬቱን አውርድ</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
