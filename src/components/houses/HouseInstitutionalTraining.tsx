import React, { useState } from 'react';
import { Briefcase, Video, Users, Award, CheckCircle2, Calendar, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TrainingModule {
  id: string;
  title: string;
  tier: 'አለም አቀፍ (Global)' | 'ሀገራዊ (National)' | 'ክልላዊ (Regional)' | 'የወረዳ/ቀበሌ (Wereda/Kebele)';
  organizer: string;
  enrolledAttendees: number;
  timeSlot: string;
  status: 'በቀጥታ እየተሰጠ ነው' | 'የተጠናቀቀ' | 'የተያዘ';
  trainer: string;
  agenda: string;
}

export const HouseInstitutionalTraining: React.FC = () => {
  const [trainings, setTrainings] = useState<TrainingModule[]>([
    {
      id: 'tr-1',
      title: 'የዲጂታል አስተዳደርና የተቀላጠፈ የህዝብ አገልግሎት አሰጣጥ ስልጠና',
      tier: 'የወረዳ/ቀበሌ (Wereda/Kebele)',
      organizer: 'የፐብሊክ ሰርቪስና የሰው ሀብት ልማት ሚኒስቴር',
      enrolledAttendees: 640,
      timeSlot: 'ዛሬ 08:30 - 11:00 ሰዓት',
      status: 'በቀጥታ እየተሰጠ ነው',
      trainer: 'ዶ/ር አስቴር ሙሉጌታ',
      agenda: 'በቀበሌና በወረዳ ደረጃ የተሟላ የወረቀት አልባ ዲጂታል ፋይል አሰራር ስልጠና'
    },
    {
      id: 'tr-2',
      title: 'ቀጠናዊ የንግድ ስምምነትና የአፍሪካ ነፃ የንግድ ቀጠና (AfCFTA)',
      tier: 'ሀገራዊ (National)',
      organizer: 'የንግድና ቀጣናዊ ትስስር ሚኒስቴር',
      enrolledAttendees: 420,
      timeSlot: 'ነገ 03:00 - 06:00 ሰዓት',
      status: 'የተያዘ',
      trainer: 'አቶ ዘበነ አስፋው (Senior Trade Specialist)',
      agenda: 'የሀገር ውስጥ አምራቾች ወደ አፍሪካ ገበያ በቀረጥ ነፃ የሚገቡበት ስልት'
    }
  ]);

  const [activeTierFilter, setActiveTierFilter] = useState<string>('all');

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-lg">
            11
          </div>
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              ተቋማዊ ስልጠና መስጫ አዳራሽ (Institutional Training Hall)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              በአለም፣ በሀገር፣ በክልል፣ በወረዳና በቀበሌ ደረጃ መንግስታዊና መንግስታዊ ያልሆኑ ተቋማት በቪዲዮ ዙም-ስልጠና የሚሰጡበትና የምስክር ወረቀት የሚያስገኙበት
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-blue-950/60 border border-blue-600/40 px-3 py-1.5 rounded-xl text-xs text-blue-300 font-bold">
          <Video className="w-4 h-4 text-blue-400" />
          <span>Zoom-Meeting HD የቪዲዮ ስልጠናዎች</span>
        </div>
      </div>

      {/* Tier Filter */}
      <div className="flex flex-wrap gap-2">
        {['all', 'የወረዳ/ቀበሌ (Wereda/Kebele)', 'ክልላዊ (Regional)', 'ሀገራዊ (National)', 'አለም አቀፍ (Global)'].map((tier) => (
          <button
            key={tier}
            onClick={() => setActiveTierFilter(tier)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTierFilter === tier
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tier === 'all' ? 'ሁሉም እርከኖች' : tier}
          </button>
        ))}
      </div>

      {/* Trainings List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {trainings
          .filter((t) => activeTierFilter === 'all' || t.tier === activeTierFilter)
          .map((tr) => (
            <div
              key={tr.id}
              className="bg-[#101524] border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
                    {tr.tier}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    tr.status === 'በቀጥታ እየተሰጠ ነው' ? 'bg-red-950 text-red-300 animate-pulse' : 'bg-emerald-950 text-emerald-300'
                  }`}>
                    {tr.status}
                  </span>
                </div>

                <h3 className="text-sm font-extrabold text-white leading-snug">
                  {tr.title}
                </h3>

                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs space-y-1 text-slate-300">
                  <div>አዘጋጅ ተቋም፡ <strong>{tr.organizer}</strong></div>
                  <div>ዋና አሰልጣኝ፡ <strong>{tr.trainer}</strong></div>
                  <div>የሰዓት ሰሌዳ፡ <strong>{tr.timeSlot}</strong></div>
                  <div className="text-slate-400 italic pt-1">"{tr.agenda}"</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  የተመዘገቡ ሰልጣኞች፡ <strong className="text-white">{tr.enrolledAttendees}</strong>
                </span>

                <button
                  onClick={() => {
                    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
                    alert(`ወደ "${tr.title}" የስልጠና ቪዲዮ አዳራሽ ገብተዋል!`);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md"
                >
                  ስልጠናውን ተቀላቀል (Join Session)
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
