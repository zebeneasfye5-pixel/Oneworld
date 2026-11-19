import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Sparkles,
  FileText,
  Edit3,
  CheckCircle2,
  Stamp,
  Printer,
  PenTool,
  RotateCcw,
  Trash2,
  Scale,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

type MarriageType = 'civil' | 'traditional' | 'religious';
type PropertyRegime = 'standard_community' | 'full_community' | 'separate_contract';

interface SpouseInfo {
  fullName: string;
  age: string;
  nationality: string;
  idNumber: string;
  phone: string;
  address: string;
  priorMaritalStatus: string;
}

interface WitnessInfo {
  name: string;
  side: 'የሙሽራው ወገን' | 'የሙሽሪት ወገን';
  idOrPhone: string;
}

interface MarriageContractData {
  contractNumber: string;
  marriageType: MarriageType;
  ceremonyDate: string;
  ceremonyLocation: string;
  officiantName: string;
  groom: SpouseInfo;
  bride: SpouseInfo;
  propertyRegime: PropertyRegime;
  dowryDetails: string;
  separatePropertyNote: string;
  groomRepresentative: string;
  groomRepPhone: string;
  brideRepresentative: string;
  brideRepPhone: string;
  bestMen: string;
  bridesmaids: string;
  witnesses: [WitnessInfo, WitnessInfo, WitnessInfo, WitnessInfo];
}

const STORAGE_KEY = 'oneworld_wedding_contract_draft_v1';

const createDefaultContract = (): MarriageContractData => {
  const year = new Date().getFullYear();
  const suffix = String(Math.floor(10000 + Math.random() * 89999));
  return {
    contractNumber: `OW-ETH-MAR-${year}-${suffix}`,
    marriageType: 'traditional',
    ceremonyDate: new Date().toLocaleDateString('am-ET', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    ceremonyLocation: '',
    officiantName: '',
    groom: {
      fullName: '',
      age: '',
      nationality: 'ኢትዮጵያዊ',
      idNumber: '',
      phone: '',
      address: '',
      priorMaritalStatus: 'ያላገባ'
    },
    bride: {
      fullName: '',
      age: '',
      nationality: 'ኢትዮጵያዊት',
      idNumber: '',
      phone: '',
      address: '',
      priorMaritalStatus: 'ያላገባች'
    },
    propertyRegime: 'standard_community',
    dowryDetails: '',
    separatePropertyNote: '',
    groomRepresentative: '',
    groomRepPhone: '',
    brideRepresentative: '',
    brideRepPhone: '',
    bestMen: '',
    bridesmaids: '',
    witnesses: [
      { name: '', side: 'የሙሽራው ወገን', idOrPhone: '' },
      { name: '', side: 'የሙሽራው ወገን', idOrPhone: '' },
      { name: '', side: 'የሙሽሪት ወገን', idOrPhone: '' },
      { name: '', side: 'የሙሽሪት ወገን', idOrPhone: '' }
    ]
  };
};

interface SignaturePadProps {
  label: string;
  onSave: (dataUrl: string) => void;
  savedSignature?: string;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ label, onSave, savedSignature }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(!!savedSignature);

  useEffect(() => {
    setHasDrawn(!!savedSignature);
    if (!savedSignature && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, [savedSignature]);

  const getCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const scaleX = rect.width ? canvas.width / rect.width : 1;
    const scaleY = rect.height ? canvas.height / rect.height : 1;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoords(e);
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0f172a';
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
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    onSave('');
  };

  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-1.5 gap-2">
        <span className="text-xs font-bold text-slate-200">{label}</span>
        {hasDrawn && (
          <button
            type="button"
            onClick={clearCanvas}
            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>አጥፋ</span>
          </button>
        )}
      </div>

      <div className="relative border-2 border-dashed border-amber-500/50 rounded-lg overflow-hidden bg-white touch-none h-24">
        <canvas
          ref={canvasRef}
          width={280}
          height={96}
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
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs text-slate-700 gap-1.5">
            <PenTool className="w-3.5 h-3.5 text-amber-600" />
            <span>እዚህ ላይ ይፈርሙ</span>
          </div>
        )}
      </div>
    </div>
  );
};

const MARRIAGE_TYPE_LABELS: Record<MarriageType, string> = {
  civil: 'ሲቪል / የመንግስት ጋብቻ (Civil Marriage)',
  traditional: 'ባህላዊ / የሰማኒያ ጋብቻ (Traditional Semaneya)',
  religious: 'ሃይማኖታዊ ጋብቻ (Religious Matrimony)'
};

const PROPERTY_REGIME_LABELS: Record<PropertyRegime, string> = {
  standard_community:
    'መደበኛ የቤተሰብ ሕግ፦ ከጋብቻ በፊት የነበረ ንብረት በየግል ይቆያል፤ ከጋብቻ በኋላ የሚፈራ ንብረት በእኩል የጋራ ይሆናል።',
  full_community:
    'ሙሉ የጋራ ንብረት፦ ከጋብቻ በፊትም ሆነ በኋላ የሚገኝ ንብረት በሙሉ በሁለቱ ተጋቢዎች እኩል ይተዳደራል።',
  separate_contract:
    'ልዩ የንብረት ውል፦ ተጋቢዎች የየራሳቸውን ንብረት በግል የማስተዳደር እና የጋራ ወጪዎችን በስምምነት የመሸፈን ውል።'
};

interface DocumentPagesProps {
  data: MarriageContractData;
  signatures: Record<string, string>;
  isContractSigned: boolean;
}

const blank = (val: string, fallback = '________________________') =>
  val && val.trim() ? val.trim() : fallback;

const MarriageContractTwoPageDocument: React.FC<DocumentPagesProps> = ({
  data,
  signatures,
  isContractSigned
}) => {
  return (
    <div className="marriage-paper space-y-6 print:space-y-0 text-slate-900">
      {/* ==================== PAGE 1 OF 2 ==================== */}
      <section className="marriage-page marriage-page-1 bg-white text-slate-900 border-4 border-double border-amber-700/80 rounded-2xl p-5 sm:p-8 shadow-2xl flex flex-col justify-between">
        <div className="space-y-3">
          {/* Official Header */}
          <div className="text-center border-b-2 border-amber-700 pb-3 space-y-1">
            <div className="flex items-center justify-center gap-2 text-amber-800">
              <Scale className="w-5 h-5" />
              <span className="text-xs font-extrabold tracking-widest uppercase">
                Oneworld የሰርግ ቤት · ሕጋዊ የጋብቻ መዝገብ
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              የጋብቻ ውል እና የሰማኒያ ምዝገባ ሰነድ
            </h2>
            <p className="text-xs text-slate-700">
              በኢትዮጵያ የተሻሻለው የቤተሰብ ሕግ (አዋጅ ቁጥር 213/2000) እና በዓለም አቀፍ የጋብቻ ስምምነት መርሆዎች መሰረት የተዘጋጀ
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-left text-xs bg-amber-50/80 border border-amber-300 rounded-lg p-2">
              <div>
                <span className="text-slate-700 block text-[11px]">የውል ቁጥር (Reg. No):</span>
                <strong className="font-mono text-slate-900">{data.contractNumber}</strong>
              </div>
              <div>
                <span className="text-slate-700 block text-[11px]">የተፈፀመበት ቀን:</span>
                <strong className="text-slate-900">{blank(data.ceremonyDate)}</strong>
              </div>
              <div>
                <span className="text-slate-700 block text-[11px]">የጋብቻ አይነት:</span>
                <strong className="text-slate-900">{MARRIAGE_TYPE_LABELS[data.marriageType].split(' (')[0]}</strong>
              </div>
              <div>
                <span className="text-slate-700 block text-[11px]">ቦታ (ክልል/ከተማ/ወረዳ):</span>
                <strong className="text-slate-900">{blank(data.ceremonyLocation, '__________________')}</strong>
              </div>
            </div>
          </div>

          {/* Part I: Full Identity of Both Spouses */}
          <div className="space-y-1.5">
            <h3 className="font-black text-slate-900 border-b border-slate-300 pb-0.5">
              ክፍል ፩፡ የተጋቢዎች ሙሉ ማንነት (Particulars of the Spouses)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Groom Box */}
              <div className="border border-slate-300 rounded-lg p-2.5 bg-slate-50/80 space-y-1">
                <div className="font-black text-amber-900 border-b border-amber-200 pb-0.5">
                  ፩.፩ የሙሽራው (ባል) ሙሉ መረጃ
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-700">ሙሉ ስም:</span>
                  <strong className="text-slate-900 text-right">{blank(data.groom.fullName)}</strong>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-700">ዕድሜ / የትውልድ ዘመን:</span>
                  <strong className="text-slate-900 text-right">{blank(data.groom.age, '______ ዓመት')}</strong>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-700">ዜግነት እና የቀድሞ ሁኔታ:</span>
                  <strong className="text-slate-900 text-right">
                    {blank(data.groom.nationality, '____')} · {blank(data.groom.priorMaritalStatus, '____')}
                  </strong>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-700">መታወቂያ / ስልክ ቁጥር:</span>
                  <strong className="text-slate-900 text-right">
                    {blank(data.groom.idNumber, '________')} / {blank(data.groom.phone, '________')}
                  </strong>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-700">የመኖሪያ አድራሻ:</span>
                  <strong className="text-slate-900 text-right">{blank(data.groom.address, '__________________')}</strong>
                </div>
              </div>

              {/* Bride Box */}
              <div className="border border-slate-300 rounded-lg p-2.5 bg-rose-50/40 space-y-1">
                <div className="font-black text-rose-900 border-b border-rose-200 pb-0.5">
                  ፩.፪ የሙሽሪት (ሚስት) ሙሉ መረጃ
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-700">ሙሉ ስም:</span>
                  <strong className="text-slate-900 text-right">{blank(data.bride.fullName)}</strong>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-700">ዕድሜ / የትውልድ ዘመን:</span>
                  <strong className="text-slate-900 text-right">{blank(data.bride.age, '______ ዓመት')}</strong>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-700">ዜግነት እና የቀድሞ ሁኔታ:</span>
                  <strong className="text-slate-900 text-right">
                    {blank(data.bride.nationality, '____')} · {blank(data.bride.priorMaritalStatus, '____')}
                  </strong>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-700">መታወቂያ / ስልክ ቁጥር:</span>
                  <strong className="text-slate-900 text-right">
                    {blank(data.bride.idNumber, '________')} / {blank(data.bride.phone, '________')}
                  </strong>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-700">የመኖሪያ አድራሻ:</span>
                  <strong className="text-slate-900 text-right">{blank(data.bride.address, '__________________')}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Part II: Property Regime & Dowry Agreement */}
          <div className="space-y-1.5">
            <h3 className="font-black text-slate-900 border-b border-slate-300 pb-0.5">
              ክፍል ፪፡ የነፃ ፈቃድ እና የንብረት አስተዳደር ስምምነት (Consent & Property Regime)
            </h3>
            <div className="border border-slate-300 rounded-lg p-2.5 bg-slate-50/70 text-xs space-y-1">
              <p className="text-slate-800">
                <strong>የተመረጠው የንብረት አስተዳደር ሥርዓት፡</strong> {PROPERTY_REGIME_LABELS[data.propertyRegime]}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
                <div>
                  <span className="text-slate-700">የጥሎሽ / የሰማኒያ ስጦታ ስምምነት፡ </span>
                  <strong className="text-slate-900">{blank(data.dowryDetails, 'በተጋቢዎችና በሽማግሌዎች ስምምነት የተፈፀመ / የለም')}</strong>
                </div>
                <div>
                  <span className="text-slate-700">ከጋብቻ በፊት የነበረ ልዩ ንብረት፡ </span>
                  <strong className="text-slate-900">{blank(data.separatePropertyNote, 'አልተመዘገበም / በመዝገብ የለም')}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Part III: 6 Core Legal Marriage Contract Articles */}
          <div className="space-y-1.5">
            <h3 className="font-black text-slate-900 border-b border-slate-300 pb-0.5">
              ክፍል ፫፡ የጋብቻ ውሉ ዋና ዋና ሕጋዊ አንቀጾች (Binding Articles of Marriage)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-800">
              <div className="border border-slate-200 rounded-lg p-2 bg-white">
                <p>
                  <strong>አንቀፅ ፩ — ነፃ ፈቃድና የሕግ ብቃት (አንቀፅ 6–14)፡</strong> ሁለቱም ተጋቢዎች ዕድሜያቸው 18 ዓመትና ከዚያ በላይ መሆኑን፣ የቅርብ ዝምድናና ሌላ ፀንቶ ያለ ጋብቻ እንደሌለባቸው እንዲሁም በሙሉ ነፃ ፈቃዳቸው መጋባታቸውን ያረጋግጣሉ።
                </p>
              </div>
              <div className="border border-slate-200 rounded-lg p-2 bg-white">
                <p>
                  <strong>አንቀፅ ፪ — እኩልነትና የቤተሰብ አመራር (አንቀፅ 49–50)፡</strong> ባልና ሚስት በቤተሰብ አመራር፣ በመኖሪያ ቤት ምርጫና በሁሉም የጋራ ጉዳዮች ላይ እኩል መብት፣ ክብርና ኃላፊነት አላቸው።
                </p>
              </div>
              <div className="border border-slate-200 rounded-lg p-2 bg-white">
                <p>
                  <strong>አንቀፅ ፫ — መከባበር፣ ታማኝነትና ድጋፍ (አንቀፅ 53–56)፡</strong> በደስታም ሆነ በችግር ጊዜ በፍቅር፣ በታማኝነት፣ በመከባበርና አንዱ ሌላውን በመደገፍ ዘላቂ ትዳር ለመመስረት ቃል ገብተዋል።
                </p>
              </div>
              <div className="border border-slate-200 rounded-lg p-2 bg-white">
                <p>
                  <strong>አንቀፅ ፬ — የጋራ ንብረት አስተዳደር (አንቀፅ 62–68)፡</strong> በክፍል ፪ በተገለፀው ስምምነት መሰረት የጋራ ንብረት ያለሁለቱም ተጋቢዎች የጋራ ፈቃድና ፊርማ አይሸጥም፣ አይሰጥም፣ በዋስትናም አይያዝም።
                </p>
              </div>
              <div className="border border-slate-200 rounded-lg p-2 bg-white">
                <p>
                  <strong>አንቀፅ ፭ — የልጆች መብትና እንክብካቤ፡</strong> ከጋብቻው የሚወለዱ ልጆችን በጤና፣ በትምህርትና በመልካም ሥነ-ምግባር በእኩል የወላጅነት ኃላፊነት ለማሳደግ ተስማምተዋል።
                </p>
              </div>
              <div className="border border-slate-200 rounded-lg p-2 bg-white">
                <p>
                  <strong>አንቀፅ ፮ — አለመግባባትን በሰላም መፍታት፡</strong> በትዳር ውስጥ አለመግባባት ቢያጋጥም በቅድሚያ በውይይትና በቤተሰብ ሽማግሌዎች፣ ካልተቻለም ሥልጣን ባለው ፍርድ ቤት በሕግ ይፈታል።
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Page 1 Footer */}
        <div className="pt-3 mt-3 border-t border-slate-300 flex items-center justify-between text-[11px] text-slate-700 font-bold">
          <span>ውል ቁጥር፡ {data.contractNumber}</span>
          <span>ገፅ ፩ ከ ፪ — ምስክሮች፣ ቃለ-መሐላ እና ፊርማዎች በገፅ ፪ ላይ ይቀጥላሉ</span>
        </div>
      </section>

      {/* ==================== PAGE 2 OF 2 ==================== */}
      <section className="marriage-page marriage-page-2 bg-white text-slate-900 border-4 border-double border-amber-700/80 rounded-2xl p-5 sm:p-8 shadow-2xl flex flex-col justify-between">
        <div className="space-y-3.5">
          {/* Page 2 Reference Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-amber-700 pb-2 text-xs">
            <div className="font-black text-slate-900">
              የጋብቻ ውል ሰነድ · ተጋቢዎች፡ {blank(data.groom.fullName, '______________')} እና {blank(data.bride.fullName, '______________')}
            </div>
            <div className="font-mono font-bold text-amber-900">
              {data.contractNumber} · ገፅ ፪ ከ ፪
            </div>
          </div>

          {/* Part IV: Representative Parents / Elders, Bridal Party & Officiant */}
          <div className="space-y-1.5">
            <h3 className="font-black text-slate-900 border-b border-slate-300 pb-0.5">
              ክፍል ፬፡ የተጋቢዎች ተጠሪ ወላጆች፣ ሚዜዎች እና የሥነ-ሥርዓቱ መሪ (Council & Officiant)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="border border-slate-300 rounded-lg p-2.5 bg-slate-50 space-y-1">
                <div>
                  <span className="text-slate-700">የሙሽራው ተጠሪ ወላጅ / አባት፡ </span>
                  <strong className="text-slate-900">{blank(data.groomRepresentative)}</strong>
                  {data.groomRepPhone && <span className="text-slate-700"> ({data.groomRepPhone})</span>}
                </div>
                <div>
                  <span className="text-slate-700">የወንድ ሚዜዎች (Best Men)፡ </span>
                  <strong className="text-slate-900">{blank(data.bestMen)}</strong>
                </div>
              </div>
              <div className="border border-slate-300 rounded-lg p-2.5 bg-slate-50 space-y-1">
                <div>
                  <span className="text-slate-700">የሙሽሪት ተጠሪ ወላጅ / አባት፡ </span>
                  <strong className="text-slate-900">{blank(data.brideRepresentative)}</strong>
                  {data.brideRepPhone && <span className="text-slate-700"> ({data.brideRepPhone})</span>}
                </div>
                <div>
                  <span className="text-slate-700">የሴት ሚዜዎች (Bridesmaids)፡ </span>
                  <strong className="text-slate-900">{blank(data.bridesmaids)}</strong>
                </div>
              </div>
            </div>
            <div className="border border-slate-300 rounded-lg px-3 py-1.5 bg-amber-50/50 text-xs flex flex-wrap justify-between gap-2">
              <span>
                <span className="text-slate-700">ሥነ-ሥርዓቱን የመራው አጋቢ / የክብር መዝገብ ሹም፡ </span>
                <strong className="text-slate-900">{blank(data.officiantName, '________________________')}</strong>
              </span>
              <span className="text-slate-700">የጋብቻ አይነት፡ <strong className="text-slate-900">{MARRIAGE_TYPE_LABELS[data.marriageType].split(' (')[0]}</strong></span>
            </div>
          </div>

          {/* Part V: 4 Official Witnesses Table */}
          <div className="space-y-1.5">
            <h3 className="font-black text-slate-900 border-b border-slate-300 pb-0.5">
              ክፍል ፭፡ የጋብቻው ፬ (4) ሕጋዊ ምስክሮች ማረጋገጫ (Legal Marriage Witnesses)
            </h3>
            <p className="text-xs text-slate-700">
              እኛ ከዚህ በታች ስማችን የተመዘገበው ምስክሮች ጋብቻው በሁለቱም ተጋቢዎች ሙሉ ነፃ ፈቃድ በፊታችን መፈጸሙን በሕግ ፊት እናረጋግጣለን፦
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-300 text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-900">
                    <th className="border border-slate-300 px-2 py-1 text-left w-10">ተ.ቁ</th>
                    <th className="border border-slate-300 px-2 py-1 text-left">የምስክር ሙሉ ስም</th>
                    <th className="border border-slate-300 px-2 py-1 text-left">ወገን</th>
                    <th className="border border-slate-300 px-2 py-1 text-left">መታወቂያ / ስልክ ቁጥር</th>
                    <th className="border border-slate-300 px-2 py-1 text-center w-24">ፊርማ</th>
                  </tr>
                </thead>
                <tbody>
                  {data.witnesses.map((w, idx) => (
                    <tr key={idx} className="bg-white">
                      <td className="border border-slate-300 px-2 py-1.5 font-mono font-bold text-slate-800">
                        {idx + 1}
                      </td>
                      <td className="border border-slate-300 px-2 py-1.5 font-bold text-slate-900">
                        {blank(w.name, '________________________')}
                      </td>
                      <td className="border border-slate-300 px-2 py-1.5 text-slate-800">{w.side}</td>
                      <td className="border border-slate-300 px-2 py-1.5 font-mono text-slate-800">
                        {blank(w.idOrPhone, '__________________')}
                      </td>
                      <td className="border border-slate-300 px-2 py-1.5 text-center text-slate-700">
                        {signatures['witness'] ? '✓ ተፈርሟል' : '__________'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Part VI: Solemn Matrimonial Oath */}
          <div className="border border-amber-400 bg-amber-50/60 rounded-xl p-3 text-xs space-y-1">
            <h4 className="font-black text-amber-950">ክፍል ፮፡ የተጋቢዎች የጋብቻ ቃለ-መሐላ (Solemn Matrimonial Oath)</h4>
            <p className="text-slate-900 leading-relaxed">
              "እኛ ሙሽራው <strong>{blank(data.groom.fullName, '________________')}</strong> እና ሙሽሪት{' '}
              <strong>{blank(data.bride.fullName, '________________')}</strong> በዛሬው ዕለት ({blank(data.ceremonyDate)}) በ{blank(data.ceremonyLocation, '________________')}፣
              በተጠሪ ወላጆቻችንና ከላይ በተዘረዘሩት ሕጋዊ ምስክሮች ፊት ያለምንም ተፅዕኖ በሙሉ ነፃ ፈቃዳችን ሕጋዊ ጋብቻ ፈፅመናል፤ በዚህ ውል የተካተቱትን አንቀጾች ሁሉ በታማኝነት ለማክበር በፊርማችን አረጋግጠናል።"
            </p>
          </div>

          {/* Part VII: Signatures & Official Registry Seal */}
          <div className="space-y-1.5">
            <h3 className="font-black text-slate-900 border-b border-slate-300 pb-0.5">
              ክፍል ፯፡ የተጋቢዎች፣ የተጠሪዎች፣ የምስክሮች ፊርማ እና ማህተም (Signatures & Seal)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-center text-xs">
              <div className="border border-slate-300 rounded-lg p-2 bg-slate-50/70 flex flex-col justify-between min-h-[82px]">
                <span className="font-bold text-slate-800">የሙሽራው ፊርማ</span>
                {signatures['groom'] ? (
                  <img src={signatures['groom']} alt="Groom signature" className="h-10 mx-auto object-contain" />
                ) : (
                  <div className="h-9 flex items-end justify-center text-slate-600">____________________</div>
                )}
                <span className="text-[10px] text-slate-700 truncate">{blank(data.groom.fullName, 'ሙሽራው')}</span>
              </div>

              <div className="border border-slate-300 rounded-lg p-2 bg-slate-50/70 flex flex-col justify-between min-h-[82px]">
                <span className="font-bold text-slate-800">የሙሽሪት ፊርማ</span>
                {signatures['bride'] ? (
                  <img src={signatures['bride']} alt="Bride signature" className="h-10 mx-auto object-contain" />
                ) : (
                  <div className="h-9 flex items-end justify-center text-slate-600">____________________</div>
                )}
                <span className="text-[10px] text-slate-700 truncate">{blank(data.bride.fullName, 'ሙሽሪት')}</span>
              </div>

              <div className="border border-slate-300 rounded-lg p-2 bg-slate-50/70 flex flex-col justify-between min-h-[82px]">
                <span className="font-bold text-slate-800">የሙሽራው ተጠሪ/ወላጅ</span>
                {signatures['groomRep'] ? (
                  <img src={signatures['groomRep']} alt="Groom Rep signature" className="h-10 mx-auto object-contain" />
                ) : (
                  <div className="h-9 flex items-end justify-center text-slate-600">____________________</div>
                )}
                <span className="text-[10px] text-slate-700 truncate">{blank(data.groomRepresentative, 'ተጠሪ')}</span>
              </div>

              <div className="border border-slate-300 rounded-lg p-2 bg-slate-50/70 flex flex-col justify-between min-h-[82px]">
                <span className="font-bold text-slate-800">የሙሽሪት ተጠሪ/ወላጅ</span>
                {signatures['brideRep'] ? (
                  <img src={signatures['brideRep']} alt="Bride Rep signature" className="h-10 mx-auto object-contain" />
                ) : (
                  <div className="h-9 flex items-end justify-center text-slate-600">____________________</div>
                )}
                <span className="text-[10px] text-slate-700 truncate">{blank(data.brideRepresentative, 'ተጠሪ')}</span>
              </div>

              <div className="border border-slate-300 rounded-lg p-2 bg-slate-50/70 flex flex-col justify-between min-h-[82px]">
                <span className="font-bold text-slate-800">የምስክሮች ፊርማ</span>
                {signatures['witness'] ? (
                  <img src={signatures['witness']} alt="Witness signature" className="h-10 mx-auto object-contain" />
                ) : (
                  <div className="h-9 flex items-end justify-center text-slate-600">____________________</div>
                )}
                <span className="text-[10px] text-slate-700">፬ቱ ሕጋዊ ምስክሮች</span>
              </div>

              <div
                className={`border-2 rounded-lg p-2 flex flex-col items-center justify-center min-h-[82px] ${
                  isContractSigned
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                    : 'border-dashed border-amber-600 bg-amber-50/50 text-amber-900'
                }`}
              >
                <Stamp className="w-5 h-5 mb-0.5" />
                <span className="font-black text-[11px]">
                  {isContractSigned ? 'በሕግ የፀደቀ ማህተም ✓' : 'የሰርግ ቤት ሕጋዊ ማህተም'}
                </span>
                <span className="text-[10px] font-mono">{data.contractNumber}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page 2 Footer */}
        <div className="pt-3 mt-3 border-t border-slate-300 flex items-center justify-between text-[11px] text-slate-700 font-bold">
          <span>Oneworld ዓለም አቀፍ የሰርግ ቤት · የጋብቻ ውል ሰነድ</span>
          <span>ገፅ ፪ ከ ፪ — የሰነዱ መጨረሻ (Page 2 of 2)</span>
        </div>
      </section>
    </div>
  );
};

export const HouseVirtualWedding: React.FC = () => {
  const [contract, setContract] = useState<MarriageContractData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...createDefaultContract(), ...JSON.parse(saved) };
      }
    } catch {}
    return createDefaultContract();
  });

  const [signatures, setSignatures] = useState<Record<string, string>>({});
  const [isContractSigned, setIsContractSigned] = useState(false);
  const [activeMode, setActiveMode] = useState<'document' | 'edit'>('document');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contract));
    } catch {}
  }, [contract]);

  useEffect(() => {
    document.body.classList.add('has-marriage-contract');
    return () => {
      document.body.classList.remove('has-marriage-contract');
    };
  }, []);

  const updateSignature = (partyKey: string, dataUrl: string) => {
    setSignatures((prev) => ({ ...prev, [partyKey]: dataUrl }));
  };

  const updateWitness = (idx: number, field: keyof WitnessInfo, value: string) => {
    setContract((prev) => {
      const next = [...prev.witnesses] as [WitnessInfo, WitnessInfo, WitnessInfo, WitnessInfo];
      next[idx] = { ...next[idx], [field]: value };
      return { ...prev, witnesses: next };
    });
  };

  const handleCertifyContract = (e: React.FormEvent) => {
    e.preventDefault();
    setIsContractSigned(true);
    setActiveMode('document');
    try {
      confetti({ particleCount: 140, spread: 90, origin: { y: 0.55 } });
    } catch {}
  };

  const handlePrintContract = () => {
    window.print();
  };

  const handleResetDraft = () => {
    setContract(createDefaultContract());
    setSignatures({});
    setIsContractSigned(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Compact Ceremony & Contract Control Header */}
      <div className="bg-gradient-to-r from-amber-950/60 via-rose-950/40 to-slate-900 border border-amber-500/35 p-5 sm:p-6 rounded-3xl shadow-2xl space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black text-xl flex-shrink-0">
              💍
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex flex-wrap items-center gap-2">
                <span>የሰርግ ቤት — የጋብቻ ውል እና የሰማኒያ ሰነድ</span>
                {isContractSigned && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    ፀድቋል
                  </span>
                )}
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 mt-1">
                ትክክለኛ ሕጋዊ የጋብቻ ውልን የጠበቀ፣ የተጋቢዎችን ሙሉ ማንነት፣ የንብረት ስምምነት፣ የ4ቱን ምስክሮችና ፊርማዎችን የያዘ ባለ 2 ገፅ ወጥ ሰነድ
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setActiveMode('document')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 cursor-pointer transition shadow-md ${
                activeMode === 'document'
                  ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300'
                  : 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>የጋብቻ ውል ሰነድ (2 ገፅ)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('edit')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 cursor-pointer transition shadow-md ${
                activeMode === 'edit'
                  ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300'
                  : 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-700'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>መረጃ ሙላ እና ፈርም</span>
            </button>

            <button
              type="button"
              onClick={handlePrintContract}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 cursor-pointer transition shadow-lg"
            >
              <Printer className="w-4 h-4" />
              <span>አትም / PDF (2 ገፅ)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mode 1: Clean 2-Page Unified Legal Marriage Contract Document */}
      {activeMode === 'document' && (
        <div className="max-w-4xl mx-auto">
          <MarriageContractTwoPageDocument
            data={contract}
            signatures={signatures}
            isContractSigned={isContractSigned}
          />
        </div>
      )}

      {/* Mode 2: Contract Entry & Digital Signatures Form */}
      {activeMode === 'edit' && (
        <form
          onSubmit={handleCertifyContract}
          className="bg-[#101524] border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <h3 className="text-base sm:text-lg font-black text-amber-400 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <span>የጋብቻ ውል መረጃዎች መሙያና ፊርማ</span>
            </h3>
            <button
              type="button"
              onClick={handleResetDraft}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-950/60 text-rose-300 border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>አዲስ ቅፅ አፅዳ</span>
            </button>
          </div>

          {/* General Ceremony Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">የጋብቻው አይነት</label>
              <select
                value={contract.marriageType}
                onChange={(e) => setContract({ ...contract, marriageType: e.target.value as MarriageType })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:border-amber-500 outline-none"
              >
                <option value="traditional">{MARRIAGE_TYPE_LABELS.traditional}</option>
                <option value="civil">{MARRIAGE_TYPE_LABELS.civil}</option>
                <option value="religious">{MARRIAGE_TYPE_LABELS.religious}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">የተፈፀመበት ቀን</label>
              <input
                type="text"
                value={contract.ceremonyDate}
                onChange={(e) => setContract({ ...contract, ceremonyDate: e.target.value })}
                placeholder="ምሳሌ፡ ህዳር 10 ቀን 2019 ዓ.ም"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:border-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">የጋብቻ ቦታ (ከተማ / ክፍለ ከተማ / ወረዳ)</label>
              <input
                type="text"
                value={contract.ceremonyLocation}
                onChange={(e) => setContract({ ...contract, ceremonyLocation: e.target.value })}
                placeholder="ምሳሌ፡ አዲስ አበባ፣ ቦሌ ክ/ከተማ"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:border-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">ሥነ-ሥርዓቱን የመራው አጋቢ / መዝገብ ሹም</label>
              <input
                type="text"
                value={contract.officiantName}
                onChange={(e) => setContract({ ...contract, officiantName: e.target.value })}
                placeholder="ሙሉ ስም"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:border-amber-500 outline-none"
              />
            </div>
          </div>

          {/* Groom & Bride Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Groom */}
            <div className="bg-slate-950/70 border border-amber-500/30 rounded-2xl p-4 space-y-3">
              <h4 className="text-sm font-black text-amber-400">፩. የሙሽራው (ባል) መረጃ</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="ሙሉ ስም ከነአያት *"
                  value={contract.groom.fullName}
                  onChange={(e) => setContract({ ...contract, groom: { ...contract.groom, fullName: e.target.value } })}
                  className="sm:col-span-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="ዕድሜ (18+ ዓመት)"
                  value={contract.groom.age}
                  onChange={(e) => setContract({ ...contract, groom: { ...contract.groom, age: e.target.value } })}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="ዜግነት"
                  value={contract.groom.nationality}
                  onChange={(e) => setContract({ ...contract, groom: { ...contract.groom, nationality: e.target.value } })}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="የመታወቂያ / ፓስፖርት ቁጥር"
                  value={contract.groom.idNumber}
                  onChange={(e) => setContract({ ...contract, groom: { ...contract.groom, idNumber: e.target.value } })}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="ስልክ ቁጥር"
                  value={contract.groom.phone}
                  onChange={(e) => setContract({ ...contract, groom: { ...contract.groom, phone: e.target.value } })}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="የመኖሪያ አድራሻ"
                  value={contract.groom.address}
                  onChange={(e) => setContract({ ...contract, groom: { ...contract.groom, address: e.target.value } })}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none"
                />
                <select
                  value={contract.groom.priorMaritalStatus}
                  onChange={(e) => setContract({ ...contract, groom: { ...contract.groom, priorMaritalStatus: e.target.value } })}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none"
                >
                  <option value="ያላገባ">ያላገባ (Single)</option>
                  <option value="የፈታ">የፈታ (Divorced)</option>
                  <option value="ሚስቱ የሞተችበት">ሚስቱ የሞተችበት (Widowed)</option>
                </select>
              </div>
            </div>

            {/* Bride */}
            <div className="bg-slate-950/70 border border-rose-500/30 rounded-2xl p-4 space-y-3">
              <h4 className="text-sm font-black text-rose-400">፪. የሙሽሪት (ሚስት) መረጃ</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="ሙሉ ስም ከነአያት *"
                  value={contract.bride.fullName}
                  onChange={(e) => setContract({ ...contract, bride: { ...contract.bride, fullName: e.target.value } })}
                  className="sm:col-span-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="ዕድሜ (18+ ዓመት)"
                  value={contract.bride.age}
                  onChange={(e) => setContract({ ...contract, bride: { ...contract.bride, age: e.target.value } })}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="ዜግነት"
                  value={contract.bride.nationality}
                  onChange={(e) => setContract({ ...contract, bride: { ...contract.bride, nationality: e.target.value } })}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="የመታወቂያ / ፓስፖርት ቁጥር"
                  value={contract.bride.idNumber}
                  onChange={(e) => setContract({ ...contract, bride: { ...contract.bride, idNumber: e.target.value } })}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="ስልክ ቁጥር"
                  value={contract.bride.phone}
                  onChange={(e) => setContract({ ...contract, bride: { ...contract.bride, phone: e.target.value } })}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="የመኖሪያ አድራሻ"
                  value={contract.bride.address}
                  onChange={(e) => setContract({ ...contract, bride: { ...contract.bride, address: e.target.value } })}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none"
                />
                <select
                  value={contract.bride.priorMaritalStatus}
                  onChange={(e) => setContract({ ...contract, bride: { ...contract.bride, priorMaritalStatus: e.target.value } })}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none"
                >
                  <option value="ያላገባች">ያላገባች (Single)</option>
                  <option value="የፈታች">የፈታች (Divorced)</option>
                  <option value="ባሏ የሞተባት">ባሏ የሞተባት (Widowed)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Property Regime & Dowry */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h4 className="text-sm font-black text-amber-400">፫. የንብረት አስተዳደር ውል እና ጥሎሽ</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-slate-200 mb-1">የንብረት ሥርዓት ምርጫ</label>
                <select
                  value={contract.propertyRegime}
                  onChange={(e) => setContract({ ...contract, propertyRegime: e.target.value as PropertyRegime })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:border-amber-500 outline-none"
                >
                  <option value="standard_community">{PROPERTY_REGIME_LABELS.standard_community}</option>
                  <option value="full_community">{PROPERTY_REGIME_LABELS.full_community}</option>
                  <option value="separate_contract">{PROPERTY_REGIME_LABELS.separate_contract}</option>
                </select>
              </div>
              <input
                type="text"
                placeholder="የጥሎሽ / የሰማኒያ ስጦታ ዝርዝር (ካለ)"
                value={contract.dowryDetails}
                onChange={(e) => setContract({ ...contract, dowryDetails: e.target.value })}
                className="md:col-span-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none"
              />
              <input
                type="text"
                placeholder="ከጋብቻ በፊት የነበረ የግል ንብረት ማስታወሻ (ካለ)"
                value={contract.separatePropertyNote}
                onChange={(e) => setContract({ ...contract, separatePropertyNote: e.target.value })}
                className="md:col-span-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none"
              />
            </div>
          </div>

          {/* Representatives, Bridal Party & 4 Witnesses */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-4">
            <h4 className="text-sm font-black text-amber-400">፬. ተጠሪ ወላጆች፣ ሚዜዎች እና ፬ቱ ሕጋዊ ምስክሮች</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="የሙሽራው ተጠሪ ወላጅ / አባት"
                value={contract.groomRepresentative}
                onChange={(e) => setContract({ ...contract, groomRepresentative: e.target.value })}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none"
              />
              <input
                type="text"
                placeholder="የሙሽራው ተጠሪ ስልክ"
                value={contract.groomRepPhone}
                onChange={(e) => setContract({ ...contract, groomRepPhone: e.target.value })}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none"
              />
              <input
                type="text"
                placeholder="የወንድ ሚዜዎች (Best Men)"
                value={contract.bestMen}
                onChange={(e) => setContract({ ...contract, bestMen: e.target.value })}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none"
              />
              <input
                type="text"
                placeholder="የሙሽሪት ተጠሪ ወላጅ / አባት"
                value={contract.brideRepresentative}
                onChange={(e) => setContract({ ...contract, brideRepresentative: e.target.value })}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none"
              />
              <input
                type="text"
                placeholder="የሙሽሪት ተጠሪ ስልክ"
                value={contract.brideRepPhone}
                onChange={(e) => setContract({ ...contract, brideRepPhone: e.target.value })}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none"
              />
              <input
                type="text"
                placeholder="የሴት ሚዜዎች (Bridesmaids)"
                value={contract.bridesmaids}
                onChange={(e) => setContract({ ...contract, bridesmaids: e.target.value })}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {contract.witnesses.map((w, idx) => (
                <div key={idx} className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-indigo-300">
                    <span>ምስክር {idx + 1}</span>
                    <span>{w.side}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="የምስክር ሙሉ ስም"
                      value={w.name}
                      onChange={(e) => updateWitness(idx, 'name', e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white focus:border-amber-500 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="መታወቂያ / ስልክ"
                      value={w.idOrPhone}
                      onChange={(e) => updateWitness(idx, 'idOrPhone', e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Digital Signature Pads */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-amber-400 flex items-center gap-2">
              <PenTool className="w-4 h-4" />
              <span>፭. የፊርማ ማረጋገጫዎች (Digital Signatures)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <SignaturePad
                label="የሙሽራው ፊርማ"
                onSave={(d) => updateSignature('groom', d)}
                savedSignature={signatures['groom']}
              />
              <SignaturePad
                label="የሙሽሪት ፊርማ"
                onSave={(d) => updateSignature('bride', d)}
                savedSignature={signatures['bride']}
              />
              <SignaturePad
                label="የሙሽራው ተጠሪ"
                onSave={(d) => updateSignature('groomRep', d)}
                savedSignature={signatures['groomRep']}
              />
              <SignaturePad
                label="የሙሽሪት ተጠሪ"
                onSave={(d) => updateSignature('brideRep', d)}
                savedSignature={signatures['brideRep']}
              />
              <SignaturePad
                label="የምስክሮች ፊርማ"
                onSave={(d) => updateSignature('witness', d)}
                savedSignature={signatures['witness']}
              />
            </div>
          </div>

          {/* Certify & View 2-Page Document */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setActiveMode('document')}
              className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 rounded-2xl text-xs sm:text-sm font-black cursor-pointer"
            >
              ሰነዱን ተመልከት (2 ገፅ)
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:opacity-95 text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-xl cursor-pointer flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>የጋብቻ ውሉን አጽድቅና በ2 ገፅ አሳይ</span>
            </button>
          </div>
        </form>
      )}

      {/* Dedicated Print Portal — prints ONLY the single unified 2-page document cleanly */}
      {typeof document !== 'undefined' &&
        createPortal(
          <div id="wedding-print-portal" className="hidden print:block bg-white text-slate-900">
            <MarriageContractTwoPageDocument
              data={contract}
              signatures={signatures}
              isContractSigned={isContractSigned}
            />
          </div>,
          document.body
        )}
    </div>
  );
};
