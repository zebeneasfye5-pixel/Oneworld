import React, { useState } from 'react';
import { Room, RoomCategory } from '../types';
import { X, Home, Sparkles, Users, Lock, Unlock } from 'lucide-react';

interface PersonalRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRoom: (newRoom: Room) => void;
}

export const PersonalRoomModal: React.FC<PersonalRoomModalProps> = ({
  isOpen,
  onClose,
  onCreateRoom
}) => {
  const [titleAm, setTitleAm] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [category, setCategory] = useState<RoomCategory>('community');
  const [descriptionAm, setDescriptionAm] = useState('');
  const [chairLimit, setChairLimit] = useState(25);
  const [isPrivate, setIsPrivate] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleAm.trim()) return;

    const newRoom: Room = {
      id: `personal-room-${Date.now()}`,
      titleAm: titleAm.trim(),
      titleEn: titleEn.trim() || titleAm.trim(),
      category: category,
      categoryLabelAm: 'የአባላት የጋራ ቤት',
      descriptionAm: descriptionAm.trim() || 'በአባል አስተናጋጅነት የሚመራ ነፃ የውይይትና የስልጠና አዳራሽ።',
      descriptionEn: 'Member-hosted interactive seminar and coaching hall.',
      hostName: 'እርስዎ (You - Host)',
      hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
      activeSpeakers: 1,
      totalAudience: 1,
      isMemberOwned: true,
      isLive: true,
      topics: ['የግል ስልጠና', 'የቡድን ምክክር', 'እውቀት መለዋወጥ']
    };

    onCreateRoom(newRoom);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#121829] border border-slate-700/80 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Home className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-1.5">
              የራስዎ የግል አዳራሽ / የውይይት ማዕከል ይፍጠሩ
            </h3>
            <p className="text-xs text-slate-400">
              በስርዎ አባላትን ሰብስበው የሚያወያዩበትና የሚያሰለጥኑበት ቋሚ አዳራሽ
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              የአዳራሹ ስም (በአማርኛ) *
            </label>
            <input
              type="text"
              required
              placeholder="ለምሳሌ፡ የዘበነ የቴክኖሎጂና ስራ ፈጠራ ማሰልጠኛ ቤት"
              value={titleAm}
              onChange={(e) => setTitleAm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              የአዳራሹ ስም (በእንግሊዝኛ)
            </label>
            <input
              type="text"
              placeholder="e.g., Tech & Leadership Community Hub"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              የውይይቱ ዋና አላማና መግለጫ
            </label>
            <textarea
              rows={2}
              placeholder="በዚህ አዳራሽ የሚከናወኑ ተግባራትንና የስልጠና አጀንዳዎችን ይጥቀሱ..."
              value={descriptionAm}
              onChange={(e) => setDescriptionAm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                የወንበሮች ብዛት
              </label>
              <select
                value={chairLimit}
                onChange={(e) => setChairLimit(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value={20}>20 ወንበሮች</option>
                <option value={50}>50 ወንበሮች</option>
                <option value={100}>100 ወንበሮች</option>
                <option value={9999}>ያልተገደበ (Unlimited)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                የመግቢያ ፈቃድ
              </label>
              <button
                type="button"
                onClick={() => setIsPrivate(!isPrivate)}
                className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                  isPrivate
                    ? 'bg-amber-950/30 border-amber-600/50 text-amber-300'
                    : 'bg-emerald-950/30 border-emerald-600/50 text-emerald-300'
                }`}
              >
                {isPrivate ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                {isPrivate ? 'በግብዣ ብቻ (Private)' : 'ክፍት ለሁሉም (Open Public)'}
              </button>
            </div>
          </div>

          <div className="p-3 bg-indigo-950/30 border border-indigo-900/50 rounded-xl text-[11px] text-indigo-300 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
            <span>
              አዳራሹ ሲፈጠር እርስዎ አስተናጋጅ (Host) ሆነው ተናጋሪዎችን ማስተዳደር፣ ማይክሮፎን መቆጣጠር እና የስልጠና ክፍለ-ጊዜዎችን በቀጥታ መምራት ይችላሉ።
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              ተመለስ
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-900/40 cursor-pointer"
            >
              አዳራሹን ክፈት (Launch Hall)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
