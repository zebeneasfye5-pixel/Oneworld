import React, { useState } from 'react';
import { Brain, Heart, Video, Mic, ShieldCheck, Clock, UserCheck, CheckCircle2 } from 'lucide-react';

interface Counselor {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  avatar: string;
  availableSlot: string;
  rating: number;
  consultationFeeETB: number;
}

export const HousePsychologyCounseling: React.FC = () => {
  const [counselors] = useState<Counselor[]>([
    {
      id: 'c-1',
      name: 'ዶ/ር አለማየሁ ደጀኔ (Dr. Alemayehu)',
      specialty: 'የጭንቀት፣ የድብርትና የህይወት ሚዛን ህክምና',
      experience: '16 አመታት በአእምሮ ጤናና ስነ-ልቦና',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
      availableSlot: 'ዛሬ 11:00 ሰዓት',
      rating: 4.9,
      consultationFeeETB: 400
    },
    {
      id: 'c-2',
      name: 'ወ/ሮ ትዕግስት ወርቁ (Tigist Worku)',
      specialty: 'የትዳር፣ የቤተሰብና የወጣቶች የምክር አገልግሎት',
      experience: '12 አመታት የማህበረሰብ ሳይኮቴራፒ',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80',
      availableSlot: 'ነገ 04:00 ሰዓት',
      rating: 4.8,
      consultationFeeETB: 350
    }
  ]);

  const [activeSessionCounselor, setActiveSessionCounselor] = useState<Counselor | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-teal-950/40 via-cyan-950/30 to-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 font-bold text-lg">
            12
          </div>
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              የምክር አገልግሎትና የስነ-ልቦና ህክምና ቤት (Psychology & Therapy Sanctuary)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              የስነ-ልቦና ህክምና ባለሙያዎችና ምክር ፈላጊዎች በቪዲዮና በድምፅ ተገናኝተው ህክምናና የአእምሮ እፎይታ የሚያገኙበት ሚስጥራዊ ክሊኒክ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-teal-950/60 border border-teal-600/40 px-3.5 py-1.5 rounded-xl text-xs text-teal-300 font-bold">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          <span>100% ሚስጥራዊ የህክምና ስነ-ስርአት</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {counselors.map((c) => (
          <div
            key={c.id}
            className="bg-[#101524] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 flex flex-col justify-between"
          >
            <div className="flex items-center gap-3">
              <img
                src={c.avatar}
                alt={c.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-500/50"
              />
              <div>
                <h3 className="text-sm font-extrabold text-white">{c.name}</h3>
                <span className="text-xs text-teal-300 font-semibold">{c.specialty}</span>
                <p className="text-[11px] text-slate-400 mt-0.5">{c.experience}</p>
              </div>
            </div>

            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl text-xs space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>የምክክር ዋጋ፡</span>
                <strong className="text-emerald-400">{c.consultationFeeETB} ብር</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>ቀጣይ ክፍት ሰዓት፡</span>
                <strong className="text-amber-400">{c.availableSlot}</strong>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveSessionCounselor(c);
                alert(`ከ${c.name} ጋር የቀጥታ የቪዲዮ/ድምፅ የምክክር ክፍለ-ጊዜ ተጀምሯል!`);
              }}
              className="w-full py-2.5 bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Video className="w-4 h-4" />
              <span>የቀጥታ የምክክር ክፍለ-ጊዜ ጀምር (Start Session)</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
