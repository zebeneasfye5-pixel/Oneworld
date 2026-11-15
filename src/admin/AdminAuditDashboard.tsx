import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Activity,
  Server,
  DollarSign,
  Radio,
  CheckCircle2,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { getApiUrl } from '../config/env';

interface AuditTransaction {
  id: string;
  timestamp: string;
  source: string;
  gateway: string;
  grossETB: number;
  memberShareETB: number;
  bankReserveETB: number;
  developerShareETB: number;
  status: 'SETTLED' | 'PROCESSING';
}

const HOUSE_NAMES = [
  'የሁሉም የጋራ ቤት',
  'የስጋ ዘመድ ቤት',
  'የባለስልጣን ቤት',
  'የሚስጥር ቤት',
  'የሰርግ ቤት',
  'የእምነት ቤት (4 ሉዓላዊ አዳራሾች)',
  'የደህንነት አስጠባቂ ቤት',
  'የታለንት ሾው ቤት',
  'የማስታወቂያና የገበያ ቤት',
  'የትምህርት ቤት',
  'ተቋማዊ ስልጠና መስጫ አዳራሽ',
  'የሳይኮሎጂ እና የጤና አገልግሎት ቤት',
  'የድለላና ፈላጊ/ተፈላጊ ቤት',
  'የአቤቱታና የዳኝነት ቤት',
  'የአገልግሎት ክፍያ ቤት',
  'የቱሪዝም እና የቅርስ ቤት'
];

export const AdminAuditDashboard: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'transactions' | 'houses' | 'servers'>('transactions');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<{
    connectedUsers: number;
    activeRooms: number;
    registeredAccounts: number;
    houseBreakdown: Record<string, { activeUsers: number; streamsActive: number }>;
    transactions: AuditTransaction[];
    turnConfigured: boolean;
    aiConfigured: boolean;
  }>({
    connectedUsers: 0,
    activeRooms: 0,
    registeredAccounts: 0,
    houseBreakdown: {},
    transactions: [],
    turnConfigured: false,
    aiConfigured: false
  });

  const loadSummary = async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/audit/summary'));
      if (res.ok) {
        const data = await res.json();
        setSummary(data);
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadSummary();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-[#0b0e17] border-2 border-amber-500/50 rounded-3xl max-w-5xl w-full h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="p-5 bg-gradient-to-r from-slate-900 via-[#101524] to-amber-950/40 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                የኦዲትና የስርአት አስተዳደር ማዕከል (Oneworld Live Audit)
              </h2>
              <p className="text-xs text-amber-400 font-medium">
                መስራች፡ <strong>ዘበነ አስፍዬ (Zebene Asfye)</strong> · CBE 1000167413618
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadSummary}
              disabled={loading}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-xl border border-slate-700 cursor-pointer"
              title="አድስ (Refresh)"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-black rounded-xl border border-slate-700 cursor-pointer transition-colors"
            >
              ዝጋ
            </button>
          </div>
        </div>

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

        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-800 bg-slate-950/40">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2.5 text-xs font-black rounded-t-xl border-t border-x cursor-pointer transition-all ${
              activeTab === 'transactions'
                ? 'bg-[#0b0e17] border-slate-700 text-amber-400 border-b-2 border-b-[#0b0e17]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            የግብይት ኦዲት መዝገብ ({summary.transactions.length})
          </button>
          <button
            onClick={() => setActiveTab('houses')}
            className={`px-4 py-2.5 text-xs font-black rounded-t-xl border-t border-x cursor-pointer transition-all ${
              activeTab === 'houses'
                ? 'bg-[#0b0e17] border-slate-700 text-amber-400 border-b-2 border-b-[#0b0e17]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            የ16ቱ ቤቶች የቀጥታ ሁኔታ
          </button>
          <button
            onClick={() => setActiveTab('servers')}
            className={`px-4 py-2.5 text-xs font-black rounded-t-xl border-t border-x cursor-pointer transition-all ${
              activeTab === 'servers'
                ? 'bg-[#0b0e17] border-slate-700 text-amber-400 border-b-2 border-b-[#0b0e17]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            የሰርቨርና WebRTC ጤና
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'transactions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  እውነተኛ የተመዘገቡ ግብይቶች
                </h3>
              </div>

              {summary.transactions.length === 0 ? (
                <div className="p-8 rounded-2xl border border-slate-800 bg-slate-950/60 text-center text-xs text-slate-400">
                  እስካሁን የተመዘገበ የክፍያ ግብይት የለም። ክፍያ ሲፈጸም በቀጥታ እዚህ ይመዘገባል።
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/90 text-slate-400 font-bold border-b border-slate-800">
                      <tr>
                        <th className="p-3">መለያ</th>
                        <th className="p-3">ሰዓት</th>
                        <th className="p-3">አገልግሎት</th>
                        <th className="p-3">መንገድ</th>
                        <th className="p-3 text-right">ጠቅላላ</th>
                        <th className="p-3 text-right text-emerald-400">80% አባል</th>
                        <th className="p-3 text-right text-blue-400">10% ባንክ</th>
                        <th className="p-3 text-right text-amber-400">10% ዘበነ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 font-mono">
                      {summary.transactions.map((tx) => (
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'houses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  የ16ቱ ቤቶች የቀጥታ ተጠቃሚዎች
                </h3>
                <span className="text-xs text-emerald-400 font-bold">
                  ጠቅላላ መስመር ላይ፡ {summary.connectedUsers}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {HOUSE_NAMES.map((nameAm, idx) => {
                  const hNum = idx + 1;
                  const metric = summary.houseBreakdown[`h${hNum}`] || { activeUsers: 0, streamsActive: 0 };
                  return (
                    <div key={hNum} className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 font-black text-xs flex items-center justify-center">
                          {hNum}
                        </span>
                        <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-mono">
                          ISOLATED
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-white leading-tight">
                        {nameAm}
                      </h4>

                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/80 text-slate-400">
                        <span>ቀጥታ ተጠቃሚ፡ <strong className="text-white font-mono">{metric.activeUsers}</strong></span>
                        <span className="text-emerald-400 font-bold">{metric.streamsActive} ስርጭት</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'servers' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>WebSocket Signaling</span>
                  <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                </div>
                <div className="text-xl font-black text-white">{summary.connectedUsers} ተጠቃሚዎች</div>
                <p className="text-[11px] text-slate-400">ንቁ ክፍሎች፡ {summary.activeRooms} · የተመዘገቡ አካውንቶች፡ {summary.registeredAccounts}</p>
              </div>

              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>TURN Media Relay & AI</span>
                  <CheckCircle2 className={`w-4 h-4 ${summary.turnConfigured && summary.aiConfigured ? 'text-emerald-400' : 'text-amber-400'}`} />
                </div>
                <div className="text-sm font-black text-white">
                  TURN Relay: {summary.turnConfigured ? 'ACTIVE' : 'STUN Only (Set TURN_URL)'}
                </div>
                <p className="text-[11px] text-slate-400">
                  Gemini Translate AI: {summary.aiConfigured ? 'ACTIVE' : 'Set GEMINI_API_KEY'}
                </p>
              </div>

              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Founder Sovereign Reserve</span>
                  <Server className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-base font-black text-white">CBE 1000167413618</div>
                <p className="text-[11px] text-slate-400">ባለቤት፡ ዘበነ አስፍዬ (Zebene Asfye)</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
