import React, { useState } from 'react';
import { TalentContestant } from '../types';
import { INITIAL_TALENT_CONTESTANTS } from '../data/initialData';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  ThumbsUp, 
  Award, 
  Trophy, 
  Plus, 
  Video, 
  Volume2, 
  X, 
  Star,
  Flame,
  CheckCircle2
} from 'lucide-react';

interface TalentShowProps {
  onEarnRoyalty: (amount: number, reason: string) => void;
}

export const TalentShow: React.FC<TalentShowProps> = ({ onEarnRoyalty }) => {
  const [contestants, setContestants] = useState<TalentContestant[]>(INITIAL_TALENT_CONTESTANTS);
  const [activeContestantId, setActiveContestantId] = useState<string>(INITIAL_TALENT_CONTESTANTS[0].id);
  const [isAuditionModalOpen, setIsAuditionModalOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // New Audition Form State
  const [newName, setNewName] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('ግጥምና ጥልቅ ስነፅሁፍ');
  const [newBio, setNewBio] = useState('');

  const activeContestant = contestants.find((c) => c.id === activeContestantId) || contestants[0];

  const handleVoteLike = (contestantId: string) => {
    setContestants((prev) =>
      prev.map((c) => {
        if (c.id === contestantId) {
          const newLikes = c.audienceLikes + 1;
          return {
            ...c,
            audienceLikes: newLikes,
            hasLiked: true,
            earnedRoyaltiesETB: c.earnedRoyaltiesETB + 10
          };
        }
        return c;
      })
    );

    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    onEarnRoyalty(5, `በታለንት ሾው ላይክና ድጋፍ መስጠት (${activeContestant.name})`);
  };

  const handleSubmitAudition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newTitle.trim()) return;

    const newContestant: TalentContestant = {
      id: `talent-${Date.now()}`,
      name: newName.trim(),
      categoryAm: newCategory,
      categoryEn: 'User Audition',
      country: 'ኢትዮጵያ',
      countryFlag: '🇪🇹',
      performanceTitle: `"${newTitle.trim()}"`,
      videoPlaceholderBg: 'from-blue-900 to-indigo-950',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160',
      bio: newBio.trim() || 'በአለም አንድ መድረክ ላይ የቀረበ ድንቅ ተሰጥኦ።',
      judgeScores: { creativity: 9.5, impact: 9.6, skill: 9.4 },
      audienceLikes: 1,
      earnedRoyaltiesETB: 50
    };

    setContestants([newContestant, ...contestants]);
    setActiveContestantId(newContestant.id);
    setIsAuditionModalOpen(false);
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    alert('የተሰጥኦ ስራዎ በተሳካ ሁኔታ ቀርቧል! ዳኞችና ተሳታፊዎች ድምፅ እየሰጡ ነው።');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-black text-white">
              የአለም አቀፍ የታለንት ሾው መወዳደሪያ መድረክ (Global Talent Arena)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            በቪዲዮና በድምፅ የሚቀርቡ ጥበባዊና ቴክኖሎጂያዊ ፈጠራዎች፤ ዳኞችና ተመልካቾች በቀጥታ በላይክ ምልክት ነጥብ የሚሰጡበት
          </p>
        </div>

        <button
          onClick={() => setIsAuditionModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black rounded-xl text-xs transition-all shadow-md shadow-amber-950 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>ተሰጥኦዎን ያቅርቡ (Submit Performance)</span>
        </button>
      </div>

      {/* Main Video Arena Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Performance Screen & Judge Scoring Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#101626] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
            {/* Top Info */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <img
                  src={activeContestant.avatar}
                  alt={activeContestant.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-amber-400"
                />
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    {activeContestant.name} {activeContestant.countryFlag}
                  </h3>
                  <span className="text-xs text-amber-400 font-semibold">
                    {activeContestant.categoryAm}
                  </span>
                </div>
              </div>

              {/* Total likes count */}
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl text-xs">
                <Flame className="w-4 h-4 text-rose-500" />
                <span className="text-slate-300">አጠቃላይ ላይክ፡</span>
                <strong className="text-rose-400 font-bold">{activeContestant.audienceLikes.toLocaleString()}</strong>
              </div>
            </div>

            {/* Video Showcase Frame */}
            <div className={`relative w-full aspect-video rounded-2xl bg-gradient-to-br ${activeContestant.videoPlaceholderBg} border-2 border-slate-700/80 overflow-hidden flex flex-col justify-between p-6 shadow-2xl`}>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md rounded-lg text-xs font-bold text-amber-300 flex items-center gap-1.5 border border-slate-700">
                  <Video className="w-3.5 h-3.5 text-amber-400" />
                  HD ቀጥታ ቪዲዮ ማሳያ
                </span>
                <span className="text-xs text-slate-300 bg-black/60 px-2 py-0.5 rounded">
                  {activeContestant.performanceTitle}
                </span>
              </div>

              {/* Performance Center Graphic */}
              <div className="flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 shadow-xl cursor-pointer hover:scale-110 transition-transform">
                  <Volume2 className="w-8 h-8" />
                </div>
                <div className="text-white font-extrabold text-sm md:text-base drop-shadow">
                  {activeContestant.performanceTitle}
                </div>
                <p className="text-xs text-slate-300 max-w-md drop-shadow">
                  {activeContestant.bio}
                </p>
              </div>

              {/* Bottom Video Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 bg-amber-400 animate-soundwave-1"></div>
                  <div className="w-1.5 bg-amber-400 animate-soundwave-2"></div>
                  <div className="w-1.5 bg-amber-400 animate-soundwave-3"></div>
                  <div className="w-1.5 bg-amber-400 animate-soundwave-4"></div>
                  <span className="text-[11px] text-amber-300 font-bold ml-1.5">የድምፅና የቪዲዮ ጥራት፡ 4K Ultra Audio</span>
                </div>

                {/* Like Button */}
                <button
                  onClick={() => handleVoteLike(activeContestant.id)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl shadow-lg shadow-rose-950 transition-all transform hover:scale-105 cursor-pointer"
                >
                  <ThumbsUp className="w-4 h-4 fill-current" />
                  <span>ላይክ ስጥ ({activeContestant.audienceLikes.toLocaleString()})</span>
                </button>
              </div>
            </div>

            {/* Official Judges Scoring Breakdown */}
            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  የአለም አቀፍ የዳኞች ቦርድ ውጤት (Official Judges Score)
                </span>
                <span className="text-xs font-black text-amber-400">
                  አጠቃላይ፡ {(activeContestant.judgeScores.creativity + activeContestant.judgeScores.impact + activeContestant.judgeScores.skill).toFixed(1)} / 30
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">የፈጠራ ብቃት</span>
                  <strong className="text-xs font-bold text-emerald-400">{activeContestant.judgeScores.creativity} / 10</strong>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">ተፅዕኖና መልእክት</span>
                  <strong className="text-xs font-bold text-amber-400">{activeContestant.judgeScores.impact} / 10</strong>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">የክህሎት ጥራት</span>
                  <strong className="text-xs font-bold text-indigo-400">{activeContestant.judgeScores.skill} / 10</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Contestants Leaderboard */}
        <div className="bg-[#101626] border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Trophy className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-sm font-extrabold text-white">
                  የተወዳዳሪዎች ደረጃ ሰንጠረዥ (Leaderboard)
                </h3>
                <p className="text-[11px] text-slate-400">
                  በዳኞችና በተመልካቾች ላይክ የተመረጡ
                </p>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              {contestants.map((c, idx) => {
                const isCurrent = c.id === activeContestant.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setActiveContestantId(c.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isCurrent
                        ? 'bg-amber-950/30 border-amber-500/60 shadow-md ring-1 ring-amber-500/50'
                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-amber-400 w-4">
                        #{idx + 1}
                      </span>
                      <img
                        src={c.avatar}
                        alt={c.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-600"
                      />
                      <div>
                        <div className="font-bold text-white text-xs truncate max-w-[120px]">
                          {c.name}
                        </div>
                        <span className="text-[10px] text-slate-400 truncate max-w-[120px] block">
                          {c.categoryAm}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-rose-400 block">
                        {c.audienceLikes} ላይክ
                      </span>
                      <span className="text-[10px] text-emerald-400">
                        {c.earnedRoyaltiesETB} ብር ገቢ
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-[11px] text-slate-400">
            * እያንዳንዱ ላይክ ለተወዳዳሪው 10 ብር ያስገኛል፤ 10% ለባንክ እና 5% ለገንቢው ተቆጣቢ ፈንድ ይቀመጣል።
          </div>
        </div>
      </div>

      {/* Audition Modal */}
      {isAuditionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#121829] border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAuditionModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-extrabold text-white mb-1">
              ተሰጥኦዎን ለውድድር ያቅርቡ
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              ስራዎን ለአለም አቀፍ ዳኞችና ተመልካቾች በማቅረብ ገቢና ሽልማት ያግኙ
            </p>

            <form onSubmit={handleSubmitAudition} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  የተወዳዳሪ ስም *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ሙሉ ስምዎ..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  የተሰጥኦ ዘርፍ
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="ግጥምና ጥልቅ ስነፅሁፍ">ግጥምና ጥልቅ ስነፅሁፍ (Spoken Poetry)</option>
                  <option value="ሙዚቃና የድምፅ ውህደት">ሙዚቃና የድምፅ ውህደት (Music / Vocals)</option>
                  <option value="ቴክኖሎጂና ፈጠራ">ቴክኖሎጂና ፈጠራ (Tech & Inventions)</option>
                  <option value="ባህላዊ ውዝዋዜና ስነጥበብ">ባህላዊ ውዝዋዜና ስነጥበብ (Cultural Arts)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  የስራው ርዕስ *
                </label>
                <input
                  type="text"
                  required
                  placeholder="የግጥሙ ወይም የፈጠራው ርዕስ..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  አጭር ማብራሪያ
                </label>
                <textarea
                  rows={2}
                  placeholder="ስለ ስራዎ አጭር መግለጫ..."
                  value={newBio}
                  onChange={(e) => setNewBio(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAuditionModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
                >
                  ተመለስ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-all shadow-md shadow-amber-950 cursor-pointer"
                >
                  አቅርብ (Submit Audition)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
