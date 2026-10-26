import React, { useState } from 'react';
import { Users, GitFork, Heart, Plus, Search, ShieldCheck, Calendar, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FamilyMember {
  id: string;
  name: string;
  generation: string;
  relation: string;
  origin: string;
  yearBorn?: number;
  phone?: string;
  notes: string;
}

export const HouseFamilyKinship: React.FC = () => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    {
      id: 'fam-1',
      name: 'አያት አስፍዬ ተሰማ (Patriarch Asfaye Tessema)',
      generation: 'ቅድመ-አያት (1ኛ ትውልድ)',
      relation: 'የቤተሰብ መስራች አያት',
      origin: 'ሸዋ / መንዝ',
      yearBorn: 1918,
      notes: 'የዘመናችን የዘር ሃረግ መነሻና የቤተሰብ መሪ'
    },
    {
      id: 'fam-2',
      name: 'አቶ ዘበነ አስፍዬ (Zebene Asfaye)',
      generation: '2ኛ ትውልድ (አባት / መሪ)',
      relation: 'የቤተሰብ አስተባባሪና ገንቢ',
      origin: 'አዲስ አበባ',
      yearBorn: 1968,
      notes: 'የዲጂታል አንድነት መድረክ መስራች'
    },
    {
      id: 'fam-3',
      name: 'ሳራ ዘበነ አስፍዬ (Sara Zebene)',
      generation: '3ኛ ትውልድ (ልጅ)',
      relation: 'የቴክኖሎጂ ተመራማሪ',
      origin: 'አዲስ አበባ',
      yearBorn: 1996,
      notes: 'የስጋ ዝምድና ሃረግ አጠናቃሪ'
    },
    {
      id: 'fam-4',
      name: 'ዮናስ ዘበነ አስፍዬ (Yonas Zebene)',
      generation: '3ኛ ትውልድ (ልጅ)',
      relation: 'የኢኮኖሚክስ ባለሙያ',
      origin: 'አዲስ አበባ / ዲያስፖራ',
      yearBorn: 2000,
      notes: 'የአለም አቀፍ ትስስር አስተባባሪ'
    }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newGeneration, setNewGeneration] = useState('3ኛ ትውልድ');
  const [newRelation, setNewRelation] = useState('');
  const [newOrigin, setNewOrigin] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newMem: FamilyMember = {
      id: `fam-${Date.now()}`,
      name: newName.trim(),
      generation: newGeneration,
      relation: newRelation.trim() || 'የስጋ ዘመድ',
      origin: newOrigin.trim() || 'ኢትዮጵያ',
      notes: newNotes.trim() || 'በስጋ ዘመድ መዝገብ የተመዘገበ'
    };

    setFamilyMembers([...familyMembers, newMem]);
    setIsAddModalOpen(false);
    setNewName('');
    setNewRelation('');
    setNewNotes('');
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* House Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-red-950/40 via-amber-950/30 to-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 font-bold text-lg">
            2
          </div>
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              የስጋ ዘመድ ቤት (Bloodline & Lineage Kinship Hall)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              የስጋ ዝምድና ያላቸው ሰዎች ተሰባስበው ስለ ውልድናቸው የሚወያዩበት፣ የትውልድ ሃረጋቸውን የሚያጠኑበትና አንድነታቸውን የሚያፀኑበት
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-rose-950 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>አዲስ የስጋ ዘመድ መዝግብ</span>
        </button>
      </div>

      {/* Lineage Tree Hierarchy */}
      <div className="bg-[#101524] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <GitFork className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-extrabold text-white">
              የዘር ሃረግና የውልድና ሰንጠረዥ (Genealogy & Ancestry Tree)
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            የተመዘገቡ የስጋ ዘመዶች፡ <strong className="text-rose-400">{familyMembers.length}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {familyMembers.map((member, idx) => (
            <div
              key={member.id}
              className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2 relative overflow-hidden group hover:border-rose-500/50 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/40">
                  {member.generation}
                </span>
                <span className="text-xs text-slate-500 font-mono">#{idx + 1}</span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  {member.name}
                </h4>
                <div className="text-xs text-slate-400 mt-0.5">
                  ዝምድና፡ <strong className="text-slate-200">{member.relation}</strong> · የትውልድ ስፍራ፡ {member.origin}
                </div>
              </div>

              <p className="text-xs text-slate-400 italic bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                "{member.notes}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#101524] border border-slate-700 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">አዲስ የስጋ ዘመድ መመዝገቢያ</h3>
            <form onSubmit={handleAddMember} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">ሙሉ ስም *</label>
                <input
                  type="text"
                  required
                  placeholder="የዘመድዎ ስም..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">የትውልድ ደረጃ</label>
                <select
                  value={newGeneration}
                  onChange={(e) => setNewGeneration(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="ቅድመ-አያት (1ኛ ትውልድ)">ቅድመ-አያት (1ኛ ትውልድ)</option>
                  <option value="አባት / እናት (2ኛ ትውልድ)">አባት / እናት (2ኛ ትውልድ)</option>
                  <option value="3ኛ ትውልድ (ልጅ)">3ኛ ትውልድ (ልጅ)</option>
                  <option value="4ኛ ትውልድ (የልጅ ልጅ)">4ኛ ትውልድ (የልጅ ልጅ)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">የዝምድና አይነት</label>
                <input
                  type="text"
                  placeholder="ለምሳሌ፡ የአጎት ልጅ፣ የእህት ልጅ..."
                  value={newRelation}
                  onChange={(e) => setNewRelation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">የትውልድ ቦታ / አድራሻ</label>
                <input
                  type="text"
                  placeholder="ከተማ / አካባቢ..."
                  value={newOrigin}
                  onChange={(e) => setNewOrigin(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">ተጨማሪ ማስታወሻ</label>
                <textarea
                  rows={2}
                  placeholder="ስለዚህ የቤተሰብ አባል ጠቃሚ መረጃ..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  ተመለስ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition-colors"
                >
                  መዝግብ (Save Member)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
