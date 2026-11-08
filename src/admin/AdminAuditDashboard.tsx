import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Server, 
  Database, 
  DollarSign, 
  Users, 
  Lock, 
  Radio, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle,
  ArrowUpRight,
  RefreshCw,
  Search,
  Filter,
  BarChart3
} from 'lucide-react';

interface AuditTransaction {
  id: string;
  timestamp: string;
  source: string;
  gateway: 'Telebirr' | 'CBE' | 'Chapa' | 'Stripe' | 'PayPal';
  grossETB: number;
  memberShareETB: number; // 80%
  bankReserveETB: number;  // 10%
  developerShareETB: number; // 10% (Zebene Asfye)
  status: 'SETTLED' | 'PROCESSING';
}

interface HouseMetric {
  houseNumber: number;
  nameAm: string;
  activeUsers: number;
  streamsActive: number;
  dataIsolationStatus: 'SECURE_ISOLATED';
}

export const AdminAuditDashboard: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'transactions' | 'houses' | 'servers'>('transactions');
  const [searchFilter, setSearchFilter] = useState('');

  const transactions: AuditTransaction[] = [
    {
      id: 'TX-90412',
      timestamp: '2026-11-08 10:14:22',
      source: 'የሰርግ ቤት (House 5) - የጋብቻ ውል ሰነድ ማህተም',
      gateway: 'Telebirr',
      grossETB: 5000,
      memberShareETB: 4000,
      bankReserveETB: 500,
      developerShareETB: 500,
      status: 'SETTLED'
    },
    {
      id: 'TX-90411',
      timestamp: '2026-11-08 10:12:05',
      source: 'የሳይኮሎጂ እና የጤና አገልግሎት ቤት (House 12) - ቴሌሜዲስን ቀጠሮ',
      gateway: 'CBE',
      grossETB: 400,
      memberShareETB: 320,
      bankReserveETB: 40,
      developerShareETB: 40,
      status: 'SETTLED'
    },
    {
      id: 'TX-90410',
      timestamp: '2026-11-08 10:08:44',
      source: 'የማስታወቂያና ገበያ ቤት (House 9) - ዓለም አቀፍ ግብይት',
      gateway: 'Chapa',
      grossETB: 12500,
      memberShareETB: 10000,
      bankReserveETB: 1250,
      developerShareETB: 1250,
      status: 'SETTLED'
    },
    {
      id: 'TX-90409',
      timestamp: '2026-11-08 09:55:18',
      source: 'የአገልግሎት ክፍያ ቤት (House 15) - የውሃና መብራት ክፍያ',
      gateway: 'Telebirr',
      grossETB: 1200,
      memberShareETB: 960,
      bankReserveETB: 120,
      developerShareETB: 120,
      status: 'SETTLED'
    },
    {
      id: 'TX-90408',
      timestamp: '2026-11-08 09:41:02',
      source: 'የቱሪዝም እና የቅርስ ቤት (House 16) - አለም አቀፍ የጉብኝት ትኬት',
      gateway: 'Stripe',
      grossETB: 8000,
      memberShareETB: 6400,
      bankReserveETB: 800,
      developerShareETB: 800,
      status: 'SETTLED'
    }
  ];

  const houseMetrics: HouseMetric[] = [
    { houseNumber: 1, nameAm: 'የሁሉም የጋራ ቤት', activeUsers: 48920, streamsActive: 12, dataIsolationStatus: 'SECURE_ISOLATED' },
    { houseNumber: 2, nameAm: 'የስጋ ዘመድ ቤት', activeUsers: 14200, streamsActive: 4, dataIsolationStatus: 'SECURE_ISOLATED' },
    { houseNumber: 3, nameAm: 'የባለስልጣን ቤት', activeUsers: 6400, streamsActive: 2, dataIsolationStatus: 'SECURE_ISOLATED' },
    { houseNumber: 4, nameAm: 'የሚስጥር ቤት', activeUsers: 19800, streamsActive: 0, dataIsolationStatus: 'SECURE_ISOLATED' },
    { houseNumber: 5, nameAm: 'የሰርግ ቤት', activeUsers: 28400, streamsActive: 6, dataIsolationStatus: 'SECURE_ISOLATED' },
    { houseNumber: 6, nameAm: 'የእምነት ቤት (4 ሉዓላዊ አዳራሾች)', activeUsers: 98300, streamsActive: 16, dataIsolationStatus: 'SECURE_ISOLATED' },
    { houseNumber: 7, nameAm: 'የደህንነት አስጠባቂ ቤት', activeUsers: 8100, streamsActive: 2, dataIsolationStatus: 'SECURE_ISOLATED' },
    { houseNumber: 8, nameAm: 'የታለንት ሾው ቤት', activeUsers: 54100, streamsActive: 8, dataIsolationStatus: 'SECURE_ISOLATED' },
    { houseNumber: 9, nameAm: 'የማስታወቂያና የገበያ ቤት', activeUsers: 62000, streamsActive: 14, dataIsolationStatus: 'SECURE_ISOLATED' },
    { houseNumber: 10, nameAm: 'የትምህርት ቤት', activeUsers: 41200, streamsActive: 9, dataIsolationStatus: 'SECURE_ISOLATED' },
    { houseNumber: 11, nameAm: 'ተቋማዊ ስልጠና መስጫ አዳራሽ', activeUsers: 18400, streamsActive: 3, dataIsolationStatus: 'SECURE_ISOLATED' },
    { houseNumber: 12, nameAm: 'የሳይኮሎጂ እና የጤና አገልግሎት ቤት', activeUsers: 23100, streamsActive: 5, dataIsolationStatus: 'SECURE_ISOLATED' },
    { houseNumber: 13, nameAm: 'የድለላና ፈላጊ/ተፈላጊ ቤት', activeUsers: 34500, streamsActive: 7, dataIsolationStatus: 'SECURE_ISOLATED' },
    { houseNumber: 14, nameAm: 'የአቤቱታና የዳኝነት ቤት', activeUsers: 15200, streamsActive: 2, dataIsolationStatus: 'SECURE_ISOLATED' },
    { houseNumber: 15, nameAm: 'የአገልግሎት ክፍያ ቤት', activeUsers: 72100, streamsActive: 0, dataIsolationStatus: 'SECURE_ISOLATED' },
    { houseNumber: 16, nameAm: 'የቱሪዝም እና የቅርስ ቤት', activeUsers: 38900, streamsActive: 6, dataIsolationStatus: 'SECURE_ISOLATED' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-[#0b0e17] border-2 border-amber-500/50 rounded-3xl max-w-5xl w-full h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-[#101524] to-amber-950/40 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                የኦዲትና የስርአት አስተዳደር ማዕከል (Oneworld Audit & Systems Hub)
              </h2>
              <p className="text-xs text-amber-400 font-medium">
                መስራችና መሪ ገንቢ፡ <strong>ዘበነ አስፍዬ (Zebene Asfye)</strong> · CBE የባንክ ዋስትና
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-black rounded-xl border border-slate-700 cursor-pointer transition-colors"
          >
            ዝጋ (Close)
          </button>
        </div>

        {/* Sovereign Split Rule Banner */}
        <div className="bg-amber-950/40 border-b border-amber-500/30 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-300 font-bold">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>ህጋዊ የገቢ ክፍፍል ድንጋጌ፡</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300 font-mono">
            <span className="bg-emerald-950/80 px-3 py-1 rounded-lg border border-emerald-500/40 text-emerald-300 font-bold">
              80% ለአባላት/ተሳታፊዎች
            </span>
            <span className="bg-blue-950/80 px-3 py-1 rounded-lg border border-blue-500/40 text-blue-300 font-bold">
              10% CBE የባንክ መጠባበቂያ
            </span>
            <span className="bg-amber-950/80 px-3 py-1 rounded-lg border border-amber-500/40 text-amber-300 font-bold">
              10% ለገንቢው (ዘበነ አስፍዬ)
            </span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-800 bg-slate-950/40">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2.5 text-xs font-black rounded-t-xl border-t border-x cursor-pointer transition-all ${
              activeTab === 'transactions'
                ? 'bg-[#0b0e17] border-slate-700 text-amber-400 border-b-2 border-b-[#0b0e17]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            የግብይት ኦዲት መዝገብ (Financial Audit)
          </button>
          <button
            onClick={() => setActiveTab('houses')}
            className={`px-4 py-2.5 text-xs font-black rounded-t-xl border-t border-x cursor-pointer transition-all ${
              activeTab === 'houses'
                ? 'bg-[#0b0e17] border-slate-700 text-amber-400 border-b-2 border-b-[#0b0e17]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            የ16ቱ ቤቶች የአጠቃቀም ሁኔታ (16 Houses Live)
          </button>
          <button
            onClick={() => setActiveTab('servers')}
            className={`px-4 py-2.5 text-xs font-black rounded-t-xl border-t border-x cursor-pointer transition-all ${
              activeTab === 'servers'
                ? 'bg-[#0b0e17] border-slate-700 text-amber-400 border-b-2 border-b-[#0b0e17]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            የሰርቨርና WebSocket ጤና (Global Infrastructure)
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'transactions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  የቅርብ ጊዜ የተመዘገቡ ግብይቶችና ህጋዊ ክፍፍላቸው
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  ሁኔታ፡ 100% አውቶማቲክ ስፕሊት (Automated Settlement)
                </span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/90 text-slate-400 font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-3">መለያ ቁጥር</th>
                      <th className="p-3">ሰዓት</th>
                      <th className="p-3">አገልግሎት / ቤት</th>
                      <th className="p-3">መንገድ</th>
                      <th className="p-3 text-right">ጠቅላላ ዋጋ</th>
                      <th className="p-3 text-right text-emerald-400">80% አባል</th>
                      <th className="p-3 text-right text-blue-400">10% ባንክ</th>
                      <th className="p-3 text-right text-amber-400">10% ዘበነ አስፍዬ</th>
                      <th className="p-3 text-center">ሁኔታ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 font-mono">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-900/40">
                        <td className="p-3 text-white font-bold">{tx.id}</td>
                        <td className="p-3 text-slate-400">{tx.timestamp}</td>
                        <td className="p-3 text-slate-200 font-sans">{tx.source}</td>
                        <td className="p-3">
                          <span className="bg-slate-800 px-2 py-0.5 rounded text-[11px] text-amber-300 font-sans font-bold">
                            {tx.gateway}
                          </span>
                        </td>
                        <td className="p-3 text-right text-white font-bold">{tx.grossETB.toLocaleString()} ETB</td>
                        <td className="p-3 text-right text-emerald-400 font-bold">{tx.memberShareETB.toLocaleString()} ETB</td>
                        <td className="p-3 text-right text-blue-400 font-bold">{tx.bankReserveETB.toLocaleString()} ETB</td>
                        <td className="p-3 text-right text-amber-400 font-bold">{tx.developerShareETB.toLocaleString()} ETB</td>
                        <td className="p-3 text-center">
                          <span className="inline-flex items-center gap-1 bg-emerald-950 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" />
                            ተፈፅሟል
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'houses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  የ16ቱ ቤቶች የቀጥታ ተጠቃሚዎችና የመረጃ መለያየት (Data Isolation)
                </h3>
                <span className="text-xs text-emerald-400 font-bold">
                  ✓ ሁሉም ቤቶች 100% ራሳቸውን የቻሉ ናቸው
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {houseMetrics.map((hm) => (
                  <div key={hm.houseNumber} className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 font-black text-xs flex items-center justify-center">
                        {hm.houseNumber}
                      </span>
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-mono">
                        {hm.dataIsolationStatus}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white leading-tight">
                      {hm.nameAm}
                    </h4>

                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/80 text-slate-400">
                      <span>ተጠቃሚዎች፡ <strong className="text-white font-mono">{hm.activeUsers.toLocaleString()}</strong></span>
                      <span className="text-emerald-400 font-bold">{hm.streamsActive} ቪዲዮ</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'servers' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>WebRTC / WebSocket Mesh</span>
                    <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                  </div>
                  <div className="text-xl font-black text-white">ኦንላይን (HEALTHY)</div>
                  <p className="text-[11px] text-slate-400">ግንኙነት፡ ዝቅተኛ ቆይታ (&lt; 42ms)</p>
                </div>

                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>CBE & Telebirr Webhooks</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xl font-black text-white">ተገናኝቷል (ACTIVE)</div>
                  <p className="text-[11px] text-slate-400">የአካውንት ባለቤት፡ ዘበነ አስፍዬ</p>
                </div>

                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>የተጠቃሚዎች የማስተናገድ አቅም</span>
                    <Server className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-xl font-black text-white">100M+ Concurrency Ready</div>
                  <p className="text-[11px] text-slate-400">አውቶ-ስኬሊንግና ሻርዲንግ ንቁ ነው</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
