import React, { useState } from 'react';
import { 
  HeartPulse, 
  Brain, 
  Activity, 
  ShieldCheck, 
  Clock, 
  Video, 
  PhoneCall, 
  UserCheck, 
  Stethoscope, 
  Sparkles,
  CalendarCheck,
  CheckCircle2,
  X
} from 'lucide-react';

interface HealthcarePractitioner {
  id: string;
  name: string;
  titleAm: string;
  specialty: string;
  category: 'psychology' | 'telemedicine' | 'mental_health';
  experience: string;
  avatar: string;
  availableSlot: string;
  rating: number;
  consultationFeeETB: number;
}

export const HousePsychologyCounseling: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'psychology' | 'telemedicine' | 'mental_health'>('all');
  const [activeSession, setActiveSession] = useState<HealthcarePractitioner | null>(null);
  const [bookingConfirmedNotice, setBookingConfirmedNotice] = useState<string | null>(null);

  const practitioners: HealthcarePractitioner[] = [
    {
      id: 'hp-1',
      name: 'ዶ/ር አለማየሁ ደጀኔ (Dr. Alemayehu)',
      titleAm: 'ክሊኒካል ሳይኮሎጂስት እና የጭንቀት ስፔሻሊስት',
      specialty: 'የጭንቀት፣ የድብርትና የህይወት ሚዛን ህክምና',
      category: 'psychology',
      experience: '16 አመታት በአእምሮ ጤናና ስነ-ልቦና',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80',
      availableSlot: 'ዛሬ 11:00 ሰዓት',
      rating: 4.9,
      consultationFeeETB: 400
    },
    {
      id: 'hp-2',
      name: 'ዶ/ር ሰላማዊት አበራ (Dr. Selamawit Abera)',
      titleAm: 'አጠቃላይ የጤና ባለሙያ (General Practitioner)',
      specialty: 'የቴሌሜዲስን ቀጥታ የጤና ምርመራና ማዘዣ',
      category: 'telemedicine',
      experience: '11 አመታት በሆስፒታልና በኦንላይን ጤና አገልግሎት',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80',
      availableSlot: 'አሁን ክፍት ነው (Live)',
      rating: 4.9,
      consultationFeeETB: 350
    },
    {
      id: 'hp-3',
      name: 'ወ/ሮ ትዕግስት ወርቁ (Tigist Worku)',
      titleAm: 'የትዳርና የወጣቶች ስነ-ልቦና አማካሪ',
      specialty: 'የትዳር፣ የቤተሰብና የወጣቶች ሳይኮቴራፒ',
      category: 'mental_health',
      experience: '12 አመታት በማህበረሰብ የምክር አገልግሎት',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      availableSlot: 'ነገ 04:00 ሰዓት',
      rating: 4.8,
      consultationFeeETB: 300
    },
    {
      id: 'hp-4',
      name: 'ዶ/ር ሚካኤል ተስፋዬ (Dr. Michael Tesfaye)',
      titleAm: 'የውስጥ ደዌና የመከላከያ ህክምና ስፔሻሊስት',
      specialty: 'የደም ግፊት፣ ስኳርና የልብ ጤና ክትትል',
      category: 'telemedicine',
      experience: '14 አመታት በአለም አቀፍ የጤና ማዕከላት',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80',
      availableSlot: 'ዛሬ 08:30 ሰዓት',
      rating: 4.9,
      consultationFeeETB: 450
    }
  ];

  const filteredPractitioners = selectedCategory === 'all'
    ? practitioners
    : practitioners.filter(p => p.category === selectedCategory);

  const handleStartConsultation = (p: HealthcarePractitioner) => {
    setActiveSession(p);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-teal-950/60 via-emerald-950/40 to-slate-900 border border-teal-500/30 p-6 rounded-3xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg">
            12
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">
                የሳይኮሎጂ እና የጤና አገልግሎት ቤት
              </h2>
              <span className="hidden sm:inline-block bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                Psychology & Healthcare Services House
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              የስነ-ልቦና ህክምና ባለሙያዎች፣ የቴሌሜዲስን ሀኪሞችና ምክር ፈላጊዎች በቪዲዮና በድምፅ ተገናኝተው ህክምና፣ ምክክርና የአእምሮ እፎይታ የሚያገኙበት ሉዓላዊ ክሊኒክ።
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 bg-teal-950/80 border border-teal-600/40 px-3.5 py-2 rounded-xl text-xs text-teal-300 font-bold shadow-sm">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>100% ሚስጥራዊ የጤና ስነ-ምግባር</span>
          </div>
        </div>
      </div>

      {/* Quick Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-teal-500 text-slate-950 shadow-md'
              : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          ሁሉም የጤናና ሳይኮሎጂ ባለሙያዎች
        </button>
        <button
          onClick={() => setSelectedCategory('psychology')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
            selectedCategory === 'psychology'
              ? 'bg-teal-500 text-slate-950 shadow-md'
              : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Brain className="w-3.5 h-3.5" />
          <span>የስነ-ልቦናና ጭንቀት ህክምና</span>
        </button>
        <button
          onClick={() => setSelectedCategory('telemedicine')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
            selectedCategory === 'telemedicine'
              ? 'bg-teal-500 text-slate-950 shadow-md'
              : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Stethoscope className="w-3.5 h-3.5" />
          <span>የቴሌሜዲስን ቀጥታ ሀኪሞች</span>
        </button>
        <button
          onClick={() => setSelectedCategory('mental_health')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
            selectedCategory === 'mental_health'
              ? 'bg-teal-500 text-slate-950 shadow-md'
              : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <HeartPulse className="w-3.5 h-3.5" />
          <span>የትዳርና ቤተሰብ ምክክር</span>
        </button>
      </div>

      {/* Notice Message if any */}
      {bookingConfirmedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 flex items-center justify-between animate-fadeIn text-xs text-emerald-200 font-bold">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{bookingConfirmedNotice}</span>
          </div>
          <button 
            onClick={() => setBookingConfirmedNotice(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Practitioners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPractitioners.map((p) => (
          <div
            key={p.id}
            className="bg-[#101524] border border-slate-800 hover:border-teal-500/50 rounded-3xl p-6 shadow-2xl space-y-4 flex flex-col justify-between transition-all"
          >
            <div className="flex items-start gap-4">
              <img
                src={p.avatar}
                alt={p.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500/40 shadow-md flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm sm:text-base font-extrabold text-white truncate">{p.name}</h3>
                  <span className="text-xs text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/30">
                    ★ {p.rating}
                  </span>
                </div>
                <p className="text-xs text-teal-300 font-semibold mt-0.5">{p.titleAm}</p>
                <p className="text-[11px] text-slate-400 mt-1">{p.experience}</p>
                <p className="text-xs text-slate-300 mt-2 bg-slate-900/60 p-2 rounded-xl border border-slate-800/80">
                  ዘርፍ፡ <strong className="text-teal-400">{p.specialty}</strong>
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-2xl text-xs space-y-2">
              <div className="flex justify-between items-center text-slate-300">
                <span>የምክክርና የህክምና ዋጋ፡</span>
                <strong className="text-emerald-400 font-mono text-sm">{p.consultationFeeETB} ETB</strong>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>የቀጠሮ ሰዓት፡</span>
                <strong className="text-amber-400 font-medium">{p.availableSlot}</strong>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => handleStartConsultation(p)}
                className="py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-transform hover:scale-[1.02]"
              >
                <Video className="w-3.5 h-3.5" />
                <span>የቀጥታ ቪዲዮ ጀምር</span>
              </button>

              <button
                onClick={() => {
                  setBookingConfirmedNotice(`ከ${p.name} ጋር ለ${p.availableSlot} የጤና ቀጠሮዎ በኢትዮጵያ ንግድ ባንክ/ቴሌብር ክፍያ ተይዟል!`);
                }}
                className="py-2.5 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>ቀጠሮ ያዝ</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Live Video Consultation Active Modal */}
      {activeSession && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0f1422] border-2 border-teal-500/60 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
                  <Activity className="w-5 h-5 animate-pulse" />
                </span>
                <div>
                  <h3 className="text-white font-extrabold text-sm sm:text-base">
                    የቀጥታ የጤናና ስነ-ልቦና ክፍለ-ጊዜ
                  </h3>
                  <p className="text-xs text-teal-400">{activeSession.name}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveSession(null)}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-slate-800">
              <img
                src={activeSession.avatar}
                alt={activeSession.name}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                <span className="bg-red-600 text-white font-black px-2.5 py-0.5 rounded-full text-[10px] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  ቀጥታ መስመር ላይ (LIVE)
                </span>
                <span className="bg-black/60 px-2 py-1 rounded-lg backdrop-blur-sm">
                  ደህንነቱ የተጠበቀ ምስጢራዊ ውይይት
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              ከ{activeSession.name} ጋር በቀጥታ ተገናኝተዋል። ማንኛውንም የስነ-ልቦና ወይም የጤና ጥያቄዎችዎን ያለ ስጋት መወያየት ይችላሉ።
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setActiveSession(null);
                  setBookingConfirmedNotice(`ከ${activeSession.name} ጋር የተደረገው ክፍለ-ጊዜ በሰላም ተጠናቋል።`);
                }}
                className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl text-xs cursor-pointer shadow-lg"
              >
                ውይይቱን ጨርስ (End Session)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
