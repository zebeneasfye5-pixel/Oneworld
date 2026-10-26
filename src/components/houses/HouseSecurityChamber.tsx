import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Radio, AlertTriangle, Eye, CheckCircle2, Lock } from 'lucide-react';

interface SecurityAlert {
  id: string;
  sourceHouse: string;
  threatType: 'የሚረብሽ ንግግር' | 'የማጭበርበር ሙከራ' | 'የህግ ጥሰት' | 'የሳይበር ደህንነት';
  severity: 'ዝቅተኛ' | 'መካከለኛ' | 'ከፍተኛ';
  reportedAt: string;
  status: 'ክትትል እየተደረገበት' | 'የተፈታ' | 'የታገደ';
  description: string;
}

export const HouseSecurityChamber: React.FC = () => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([
    {
      id: 'sec-101',
      sourceHouse: 'ቤት 1 (የጋራ ቤት)',
      threatType: 'የሚረብሽ ንግግር',
      severity: 'ዝቅተኛ',
      reportedAt: 'ከ12 ደቂቃ በፊት',
      status: 'የተፈታ',
      description: 'አንድ ተጠቃሚ አላስፈላጊ ቃላት ተጠቅሞ ማይክሮፎኑ በደህንነት ሲስተሙ በራስ-ሰር ተዘግቷል።'
    },
    {
      id: 'sec-102',
      sourceHouse: 'ቤት 9 (የገበያ ቤት)',
      threatType: 'የማጭበርበር ሙከራ',
      severity: 'መካከለኛ',
      reportedAt: 'ከ45 ደቂቃ በፊት',
      status: 'ክትትል እየተደረገበት',
      description: 'ያልተረጋገጠ የውሸት የባንክ ደረሰኝ በማቅረብ የተደረገ ሙከራ በስርአቱ ተይዟል።'
    }
  ]);

  const [officerNote, setOfficerNote] = useState('');

  const handleResolveAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'የተፈታ' } : a))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-red-950/40 to-slate-900 border border-red-500/30 p-6 rounded-3xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 font-bold text-lg">
            7
          </div>
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              የደህንነት አስጠባቂ ቤት (Security & Cyber Peace Chamber)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              የደህንነት ፖሊሶችና የፀጥታ አካላት በድህረገፁ ውስጥ የሚረብሹ ንግግሮችንና እንቅስቃሴዎችን የሚከታተሉበትና በሚስጥር የሚወያዩበት መድረክ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-red-950/70 border border-red-500/50 px-3.5 py-1.5 rounded-xl text-xs text-red-300 font-bold">
          <Radio className="w-3.5 h-3.5 animate-pulse text-red-400" />
          <span>የቀጥታ 24/7 የደህንነት ክትትል (Live Cyber Radar)</span>
        </div>
      </div>

      {/* Security Monitor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#101524] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                የቅርብ የደህንነት ሪፖርቶችና ክትትሎች (Incident Logs)
              </h3>
              <span className="text-xs text-slate-400">
                ንቁ ክስተቶች፡ <strong className="text-red-400">{alerts.filter(a => a.status !== 'የተፈታ').length}</strong>
              </span>
            </div>

            <div className="space-y-3">
              {alerts.map((al) => (
                <div key={al.id} className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-400"></span>
                      {al.sourceHouse} — {al.threatType}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      al.status === 'የተፈታ' ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
                    }`}>
                      {al.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">{al.description}</p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                    <span>ሪፖርት የተደረገው፡ {al.reportedAt}</span>
                    {al.status !== 'የተፈታ' && (
                      <button
                        onClick={() => handleResolveAlert(al.id)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[10px] cursor-pointer"
                      >
                        ችግሩ ተፈቷል (Mark Resolved)
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security Officers Private Roundtable */}
        <div className="bg-[#101524] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Lock className="w-4 h-4 text-red-400" />
            <h3 className="text-sm font-extrabold text-white">
              የፀጥታ አካላት ሚስጥራዊ ምክክር (Officer Council)
            </h3>
          </div>

          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-2">
            <span className="text-[10px] font-bold text-red-400 block uppercase">
              ጥብቅ መመሪያ ለተረኛ ፖሊሶች፡
            </span>
            <p>1. የትኛውም ተጠቃሚ የጥላቻ ንግግር፣ ብጥብጥ ወይም ማጭበርበር እንዳያደርግ የድምፅና ፅሁፍ ማጣሪያው በንቃት ይስራ።</p>
            <p>2. የዜጎች የግል ሚስጥርና ነፃነት ሳይጣስ የጋራ ሰላም እንዲጠበቅ ይደረጋል።</p>
          </div>

          <div className="pt-2">
            <textarea
              rows={3}
              placeholder="የደህንነት ማስታወሻ ወይም መመሪያ ይፃፉ..."
              value={officerNote}
              onChange={(e) => setOfficerNote(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500"
            />
            <button
              onClick={() => {
                if (!officerNote.trim()) return;
                setOfficerNote('');
                alert('የደህንነት መመሪያው ለሁሉም የቁጥጥር ጣቢያዎች ተላልፏል!');
              }}
              className="w-full mt-2 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs cursor-pointer"
            >
              መመሪያውን አስተላልፍ (Dispatch Alert)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
