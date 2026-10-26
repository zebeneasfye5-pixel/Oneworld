import React, { useState } from 'react';
import { Compass, Search, Phone, Plus, MapPin, CheckCircle2, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BrokerListing {
  id: string;
  category: 'መኖሪያ ቤት / ሪልእስቴት' | 'ተሽከርካሪ (መኪና)' | 'ስራና የሰው ሀይል' | 'ንግድና ማሽነሪ';
  title: string;
  location: string;
  price: string;
  brokerOrOwner: string;
  contactPhone: string;
  isDirectDeal: boolean; // Direct owner vs broker
  description: string;
}

export const HouseBrokerageMatching: React.FC = () => {
  const [listings, setListings] = useState<BrokerListing[]>([
    {
      id: 'br-1',
      category: 'መኖሪያ ቤት / ሪልእስቴት',
      title: 'ዘመናዊ ባለ 3 መኝታ ቪላ ቤት (አዲስ አበባ ቦሌ)',
      location: 'ቦሌ ሚካኤል፣ አዲስ አበባ',
      price: '18,500,000 ብር',
      brokerOrOwner: 'አቶ ዘበነ (ቀጥታ ባለቤት - No Broker Fee)',
      contactPhone: '0911234567',
      isDirectDeal: true,
      description: 'ካርታ ያለው፣ የውሃ ቦቴና የሶላር ኃይል የተገጠመለት አዲስ ቪላ ቤት።'
    },
    {
      id: 'br-2',
      category: 'ተሽከርካሪ (መኪና)',
      title: 'ቶዮታ ራቭ 4 ሞዴል 2024 (Toyota RAV4 Hybrid)',
      location: 'ሳርቤት፣ አዲስ አበባ',
      price: '8,200,000 ብር',
      brokerOrOwner: 'ታማኝ ደላላ ካሌብ',
      contactPhone: '0922345678',
      isDirectDeal: false,
      description: 'ከጉምሩክ ቀረጥ ነፃ የወጣ ኤሌክትሪክ/ሃይብሪድ መኪና፤ ምንም እንከን የሌለው።'
    }
  ]);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isPostListingOpen, setIsPostListingOpen] = useState(false);

  // New listing
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<any>('መኖሪያ ቤት / ሪልእስቴት');
  const [newLocation, setNewLocation] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [isDirect, setIsDirect] = useState(true);

  const handlePostListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newL: BrokerListing = {
      id: `br-${Date.now()}`,
      category: newCategory,
      title: newTitle.trim(),
      location: newLocation.trim() || 'አዲስ አበባ',
      price: newPrice.trim() || 'በስምምነት',
      brokerOrOwner: isDirect ? 'እርስዎ (ቀጥታ ባለቤት)' : 'እርስዎ (ደላላ)',
      contactPhone: newPhone.trim() || '0911234567',
      isDirectDeal: isDirect,
      description: 'በድለላና ፈላጊ/ተፈላጊ ቤት የተለጠፈ ማስታወቂያ'
    };

    setListings([newL, ...listings]);
    setIsPostListingOpen(false);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-amber-950/40 via-yellow-950/30 to-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-lg">
            13
          </div>
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              የድለላና የፈላጊ/ተፈላጊ ቤት (Brokerage & Matching Exchange)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              ደላሎችና ተገልጋዮች እንዲሁም በቀጥታ ፈላጊና ተፈላጊ ተገናኝተው ሪልእስቴት፣ መኪና፣ ስራና ንግድ የሚፈፅሙበት ክፍት ገበያ
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsPostListingOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-md shadow-amber-950 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>ማስታወቂያ ለጥፍ (Post Deal)</span>
        </button>
      </div>

      {/* Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {listings.map((l) => (
          <div
            key={l.id}
            className="bg-[#101524] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                  {l.category}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  l.isDirectDeal ? 'bg-emerald-950 text-emerald-400' : 'bg-indigo-950 text-indigo-400'
                }`}>
                  {l.isDirectDeal ? 'ቀጥታ ከባለቤቱ (Direct)' : 'በደላላ (Via Broker)'}
                </span>
              </div>

              <h3 className="text-sm font-extrabold text-white leading-snug">
                {l.title}
              </h3>

              <div className="flex items-center gap-1 text-xs text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{l.location}</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
                {l.description}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block">የሚጠየቀው ዋጋ፡</span>
                <strong className="text-sm font-black text-emerald-400">{l.price}</strong>
              </div>

              <button
                onClick={() => alert(`ከ${l.brokerOrOwner} ጋር ለመገናኘት ስልክ፡ ${l.contactPhone} ይደውሉ!`)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer border border-slate-700"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>ቀጥታ ተገናኝ ({l.contactPhone})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Listing Modal */}
      {isPostListingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#101524] border border-slate-700 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">አዲስ የድለላ ወይም የሽያጭ ማስታወቂያ</h3>
            <form onSubmit={handlePostListing} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">የንብረቱ/የጉዳዩ ርዕስ *</label>
                <input
                  type="text"
                  required
                  placeholder="ለምሳሌ፡ ቪላ ቤት፣ መኪና፣ የንግድ ሱቅ..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">የስምምነት አይነት</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsDirect(true)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                      isDirect ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    ቀጥታ ባለቤት ነኝ
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDirect(false)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                      !isDirect ? 'bg-amber-600 text-white border-amber-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    ደላላ / ወኪል ነኝ
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">ዋጋ</label>
                <input
                  type="text"
                  placeholder="ለምሳሌ፡ 5,000,000 ብር..."
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">የስልክ ቁጥር</label>
                <input
                  type="text"
                  placeholder="0911234567"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPostListingOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  ተመለስ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs"
                >
                  ለጥፍ (Post Deal)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
