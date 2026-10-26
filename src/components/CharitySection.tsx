import React, { useState } from 'react';
import { CharityProject } from '../types';
import { INITIAL_CHARITY_PROJECTS } from '../data/initialData';
import confetti from 'canvas-confetti';
import { 
  HeartHandshake, 
  Heart, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  Sun, 
  Droplet 
} from 'lucide-react';

interface CharitySectionProps {
  userBalanceETB: number;
  onDonate: (amount: number, campaignTitle: string) => boolean;
}

export const CharitySection: React.FC<CharitySectionProps> = ({
  userBalanceETB,
  onDonate
}) => {
  const [projects, setProjects] = useState<CharityProject[]>(INITIAL_CHARITY_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<CharityProject | null>(null);
  const [donateAmount, setDonateAmount] = useState<number>(500);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [lastDonationInfo, setLastDonationInfo] = useState<{ amount: number; project: string } | null>(null);

  const handleOpenDonateModal = (project: CharityProject) => {
    setSelectedProject(project);
    setDonateAmount(500);
  };

  const handleConfirmDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || donateAmount <= 0) return;

    if (userBalanceETB < donateAmount) {
      alert(`ይቅርታ፣ በቂ ሂሳብ የለዎትም። የዋሌትዎ ሂሳብ፡ ${userBalanceETB.toLocaleString()} ብር ነው`);
      return;
    }

    const success = onDonate(donateAmount, `የበጎ አድራጎት ልገሳ (${selectedProject.titleAm})`);
    if (!success) return;

    // Update project state
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === selectedProject.id) {
          return {
            ...p,
            raisedAmount: p.raisedAmount + donateAmount,
            donorCount: p.donorCount + 1,
            donations: [
              {
                donorName: 'እርስዎ (You - Benefactor)',
                amount: donateAmount,
                currency: 'ETB',
                timestamp: 'አሁን (Just now)',
                country: '🇪🇹'
              },
              ...p.donations
            ]
          };
        }
        return p;
      })
    );

    setLastDonationInfo({
      amount: donateAmount,
      project: selectedProject.titleAm
    });
    setSelectedProject(null);
    setIsSuccessModalOpen(true);
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-black text-white">
              የአለም አቀፍ የበጎ አድራጎትና የሰብአዊ ድጋፍ መረብ (Humanitarian Aid Fund)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            የድሀድሀ ማህበረሰብን፣ ወላጅ አልባ ህፃናትን፣ አዛውንቶችንና የገጠር መሰረተ ልማትን በቀጥታ የመደገፊያ ክፍት መድረክ
          </p>
        </div>

        <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>100% ግልፅነትና ተጠያቂነት ያለው የድጋፍ ስርአት</span>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => {
          const progressPercent = Math.min(100, Math.round((project.raisedAmount / project.targetAmount) * 100));

          return (
            <div
              key={project.id}
              className="bg-[#101626] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between group hover:border-slate-700 transition-all"
            >
              <div>
                {/* Hero Image */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={project.imageUrl}
                    alt={project.titleAm}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101626] via-[#101626]/40 to-transparent"></div>
                  <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-slate-700 text-amber-300 font-bold text-[10px] px-2.5 py-1 rounded-md">
                    {project.categoryLabelAm}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <h3 className="text-base font-extrabold text-white leading-snug">
                    {project.titleAm}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {project.descriptionAm}
                  </p>

                  {/* Impact Metric */}
                  <div className="p-2.5 bg-slate-900/80 border border-slate-800/90 rounded-xl text-xs text-emerald-300 font-semibold flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>ተጨባጭ ተፅዕኖ፡ {project.impactMetrics}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-400">የተሰበሰበ፡ <strong className="text-emerald-400">{project.raisedAmount.toLocaleString()} ብር</strong></span>
                      <span className="text-slate-400">ግብ፡ {project.targetAmount.toLocaleString()} ብር</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{progressPercent}% ተሳክቷል</span>
                      <span>{project.donorCount} ደጋፊዎች</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-800/80 mt-2">
                <span className="text-xs text-slate-400 font-medium">
                  ተጠቃሚዎች፡ <strong className="text-white">{project.beneficiariesCount.toLocaleString()}</strong> ሰዎች
                </span>
                <button
                  onClick={() => handleOpenDonateModal(project)}
                  className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-emerald-950 cursor-pointer flex items-center gap-1.5"
                >
                  <Heart className="w-3.5 h-3.5 fill-current text-rose-300" />
                  <span>ይደግፉ (Donate)</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Donation Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#121829] border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white">
                  የበጎ አድራጎት ድጋፍ ማድረጊያ
                </h3>
                <p className="text-xs text-slate-400 truncate max-w-[260px]">
                  {selectedProject.titleAm}
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmDonation} className="space-y-4">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                <span className="text-slate-400">የእርስዎ የሂሳብ ቀሪ፡</span>
                <strong className="text-emerald-400 font-bold">{userBalanceETB.toLocaleString()} ብር</strong>
              </div>

              {/* Amount presets */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  የድጋፍ መጠን ይምረጡ (ብር)
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[100, 500, 1000, 5000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDonateAmount(amt)}
                      className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                        donateAmount === amt
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-emerald-500/50'
                      }`}
                    >
                      {amt} ብር
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min={10}
                  value={donateAmount}
                  onChange={(e) => setDonateAmount(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
                />
              </div>

              <div className="p-3 bg-emerald-950/30 border border-emerald-900/50 rounded-xl text-[11px] text-emerald-200">
                ልገሳዎ በቀጥታ ለተረጂዎች የሚደርስ ሲሆን ዲጂታል የምስክር ወረቀትና የክብር ሜዳሊያ ይሸለማሉ።
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
                >
                  ተመለስ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold rounded-lg text-xs transition-all shadow-lg shadow-emerald-950 cursor-pointer"
                >
                  ድጋፉን አፅድቅ (Confirm Donation)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Receipt Modal */}
      {isSuccessModalOpen && lastDonationInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#121829] border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                ከልብ እናመሰግናለን!
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                የ{lastDonationInfo.amount.toLocaleString()} ብር ድጋፍዎ ለ"{lastDonationInfo.project}" በተሳካ ሁኔታ ተላልፏል።
              </p>
            </div>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300">
              የዲጂታል ደረሰኝ ቁጥር፡ <strong>ALEM-CHARITY-{Date.now().toString().slice(-6)}</strong>
            </div>
            <button
              onClick={() => setIsSuccessModalOpen(false)}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs cursor-pointer"
            >
              እሺ፣ ተቀበልኩ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
