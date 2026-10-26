import React, { useState } from 'react';
import { BankAccount, TransactionRecord, PeerCreditItem } from '../types';
import { 
  INITIAL_BANK_ACCOUNTS, 
  INITIAL_TRANSACTIONS 
} from '../data/initialData';
import confetti from 'canvas-confetti';
import { 
  Landmark, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  Building2, 
  CreditCard, 
  Sparkles, 
  Award, 
  Users, 
  Coins, 
  CheckCircle2, 
  X, 
  Plus, 
  Smartphone,
  Percent,
  History
} from 'lucide-react';

interface BankingWalletProps {
  balanceETB: number;
  balanceUSD: number;
  royaltyPoints: number;
  onDeposit: (amount: number, bankName: string) => void;
  onWithdraw: (amount: number, bankName: string) => boolean;
  onConvertRoyalties: (points: number) => void;
}

export const BankingWallet: React.FC<BankingWalletProps> = ({
  balanceETB,
  balanceUSD,
  royaltyPoints,
  onDeposit,
  onWithdraw,
  onConvertRoyalties
}) => {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(INITIAL_BANK_ACCOUNTS);
  const [transactions, setTransactions] = useState<TransactionRecord[]>(INITIAL_TRANSACTIONS);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isAddBankModalOpen, setIsAddBankModalOpen] = useState(false);
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);

  // Form states
  const [amountInput, setAmountInput] = useState<number>(1000);
  const [selectedBankId, setSelectedBankId] = useState<string>(INITIAL_BANK_ACCOUNTS[0].id);

  // New Bank Form
  const [newBankName, setNewBankName] = useState('የኢትዮጵያ ንግድ ባንክ (CBE)');
  const [newBankCode, setNewBankCode] = useState<'CBE' | 'TELEBIRR' | 'AWASH' | 'DASHEN' | 'ABYSSINIA' | 'SWIFT'>('CBE');
  const [newAccNumber, setNewAccNumber] = useState('');
  const [newHolderName, setNewHolderName] = useState('');

  // Loan Request Form
  const [loanAmount, setLoanAmount] = useState<number>(5000);
  const [loanReason, setLoanReason] = useState('');

  // Peer Loans Registry
  const [peerLoans, setPeerLoans] = useState<PeerCreditItem[]>([
    {
      id: 'loan-1',
      borrowerName: 'ዘበነ አስፋው (Zebene)',
      borrowerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
      amount: 10000,
      currency: 'ETB',
      reason: 'የአዳራሽ ማስፋፊያና የቴክኖሎጂ አገልጋይ መሳሪያዎች ግዢ',
      repaymentPeriodDays: 30,
      interestRate: 0,
      status: 'የፀደቀ',
      backersCount: 14
    },
    {
      id: 'loan-2',
      borrowerName: 'ትዕግስት መኮንን',
      borrowerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
      amount: 3000,
      currency: 'ETB',
      reason: 'የጥቃቅን የሽመና ስራ ፈጠራ ማስፋፊያ',
      repaymentPeriodDays: 15,
      interestRate: 0,
      status: 'ጥያቄ የቀረበ',
      backersCount: 5
    }
  ]);

  // Total calculated reserves for audit display
  const bankReserveTotal = Math.round(balanceETB * 0.10);
  const builderReserveTotal = Math.round(balanceETB * 0.05);

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amountInput <= 0) return;

    const bank = bankAccounts.find((b) => b.id === selectedBankId) || bankAccounts[0];
    onDeposit(amountInput, bank.bankName);

    const newTx: TransactionRecord = {
      id: `tx-${Date.now()}`,
      date: 'አሁን (Just now)',
      type: 'DEPOSIT',
      descriptionAm: `ከ${bank.bankName} ገቢ የተደረገ ሂሳብ (Ref: NBE-${Date.now().toString().slice(-6)})`,
      amount: amountInput,
      currency: 'ETB',
      status: 'የተጠናቀቀ (Completed)'
    };

    setTransactions([newTx, ...transactions]);
    setIsDepositModalOpen(false);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    alert(`የ${amountInput.toLocaleString()} ብር ገቢ በ${bank.bankName} በኩል በተሳካ ሁኔታ ተፈፅሟል!`);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amountInput <= 0) return;

    const bank = bankAccounts.find((b) => b.id === selectedBankId) || bankAccounts[0];
    const success = onWithdraw(amountInput, bank.bankName);
    if (!success) return;

    const bankCut = Math.round(amountInput * 0.10);
    const builderCut = Math.round(amountInput * 0.05);
    const netPayout = amountInput - bankCut - builderCut;

    const newTx: TransactionRecord = {
      id: `tx-${Date.now()}`,
      date: 'አሁን',
      type: 'WITHDRAW',
      descriptionAm: `ወደ ${bank.bankName} የተላለፈ ወጪ (አካውንት፡ ${bank.accountNumber})`,
      amount: -amountInput,
      currency: 'ETB',
      status: 'የተጠናቀቀ (Completed)',
      bankCut10: bankCut,
      builderCut5: builderCut,
      netAmount: netPayout
    };

    setTransactions([newTx, ...transactions]);
    setIsWithdrawModalOpen(false);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    alert(
      `የወጪ ጥያቄዎ ፀድቋል!\nየተጣራ የተላከ፡ ${netPayout.toLocaleString()} ብር\nለባንክ ዋስትና (10%): ${bankCut} ብር\nለገንቢው ተቆጣቢ (5%): ${builderCut} ብር\n\nበቴሌብር / በCBE የኤስኤምኤስ ማረጋገጫ ተልኳል።`
    );
  };

  const handleAddBankSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccNumber.trim() || !newHolderName.trim()) return;

    const newAccount: BankAccount = {
      id: `bank-${Date.now()}`,
      bankName: newBankName,
      bankCode: newBankCode,
      accountNumber: newAccNumber.trim(),
      holderName: newHolderName.trim(),
      isPrimary: false,
      verified: true
    };

    setBankAccounts([...bankAccounts, newAccount]);
    setIsAddBankModalOpen(false);
    setNewAccNumber('');
    setNewHolderName('');
    alert(`አዲሱ የባንክ አካውንት (${newBankName}) ከመንግስት የክፍያ ስርአት ጋር ተገናኝቷል!`);
  };

  const handleLoanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loanAmount <= 0 || !loanReason.trim()) return;

    const newLoan: PeerCreditItem = {
      id: `loan-${Date.now()}`,
      borrowerName: 'እርስዎ (You - Applicant)',
      borrowerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
      amount: loanAmount,
      currency: 'ETB',
      reason: loanReason.trim(),
      repaymentPeriodDays: 30,
      interestRate: 0,
      status: 'ጥያቄ የቀረበ',
      backersCount: 1
    };

    setPeerLoans([newLoan, ...peerLoans]);
    setIsLoanModalOpen(false);
    setLoanReason('');
    alert('የወንድማማችነት ከወለድ-ነፃ የብድር ጥያቄዎ ለማህበረሰቡ ቀርቧል!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-950/40 via-amber-950/30 to-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-black text-white">
              የባንክ ትስስር፣ የገቢ/ወጪና የሮያሊቲ ማስተላለፊያ ማዕከል
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            ከኢትዮጵያ ንግድ ባንክ (CBE)፣ ቴሌብር እና አለም አቀፍ የፋይናንስ ተቋማት ጋር ጥብቅ ቁልፍ ትስስር ያለው ህጋዊ ስርአት
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDepositModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-emerald-950 cursor-pointer"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>ገንዘብ አስገባ (Deposit)</span>
          </button>
          <button
            onClick={() => setIsWithdrawModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black rounded-xl text-xs transition-all shadow-md shadow-amber-950 cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>ገንዘብ አውጣ (Withdraw)</span>
          </button>
        </div>
      </div>

      {/* Main Financial Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Main Balance ETB */}
        <div className="p-5 bg-[#101626] border border-slate-800 rounded-2xl shadow-xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              ዋና የሂሳብ ቀሪ (ETB)
            </span>
            <Building2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">
              {balanceETB.toLocaleString()} <span className="text-sm font-semibold text-emerald-400">ብር</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              ≈ ${(balanceETB / 120).toFixed(2)} USD (ኦፊሴላዊ የውጭ ምንዛሪ)
            </p>
          </div>
          <span className="text-[10px] text-emerald-400 font-medium">በCBE እና በቴሌብር ወዲያው የሚወጣ</span>
        </div>

        {/* Royalty Points Earned */}
        <div className="p-5 bg-[#101626] border border-slate-800 rounded-2xl shadow-xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              የእንቅስቃሴ ሮያሊቲ ነጥቦች
            </span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-amber-300">
              {royaltyPoints} <span className="text-sm font-semibold text-slate-400">ነጥብ</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              ላይክ፣ ሼር እና ውይይት ባደረጉ ቁጥር የሚጨመር
            </p>
          </div>
          <button
            onClick={() => onConvertRoyalties(50)}
            disabled={royaltyPoints < 50}
            className="text-[10px] font-bold text-amber-400 hover:text-amber-300 disabled:opacity-50 text-left cursor-pointer"
          >
            50 ነጥብ ወደ 50 ብር ቀይር →
          </button>
        </div>

        {/* 10% Bank Reserve Vault */}
        <div className="p-5 bg-[#101626] border border-slate-800 rounded-2xl shadow-xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
              10% የባንኮች ዋስትና መደብ
            </span>
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-amber-300">
              {bankReserveTotal.toLocaleString()} <span className="text-sm font-semibold text-slate-400">ብር</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              የብሄራዊ ባንክ የፈሳሽነትና የዋስትና ፈንድ
            </p>
          </div>
          <span className="text-[10px] text-slate-500">በህግ የተረጋገጠ መጠባበቂያ</span>
        </div>

        {/* 5% Builder Reserve Vault */}
        <div className="p-5 bg-[#101626] border border-slate-800 rounded-2xl shadow-xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
              5% የገንቢው ተቆጣቢ ፈንድ
            </span>
            <Award className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-indigo-300">
              {builderReserveTotal.toLocaleString()} <span className="text-sm font-semibold text-slate-400">ብር</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              የድህረገፁ ፈጣሪ ሉዓላዊ የልማት ሂሳብ
            </p>
          </div>
          <span className="text-[10px] text-slate-500">ለዘላቂ ስርአት ጥገናና ልማት</span>
        </div>
      </div>

      {/* Linked Bank Accounts */}
      <div className="bg-[#101626] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              የተገናኙ የባንክና የሞባይል ገንዘብ አካውንቶች (Linked Banks & Mobile Money)
            </h3>
            <p className="text-xs text-slate-400">
              ገቢ የሚቀበሉባቸውና ወጪ የሚያደርጉባቸው የተረጋገጡ የባንክ ሂሳቦች
            </p>
          </div>

          <button
            onClick={() => setIsAddBankModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>አዲስ ባንክ አገናኝ</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {bankAccounts.map((acc) => (
            <div
              key={acc.id}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-400 uppercase">
                  {acc.bankCode}
                </span>
                {acc.verified && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    የተረጋገጠ
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold text-white truncate">{acc.bankName}</h4>
                <div className="font-mono text-xs text-emerald-300 font-bold mt-1">
                  {acc.accountNumber}
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">{acc.holderName}</div>
              </div>

              {acc.isPrimary && (
                <span className="text-[9px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-center w-fit">
                  ዋና አካውንት (Primary)
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Peer-to-Peer Solidarity Credit & Loans */}
      <div className="bg-[#101626] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              የወንድማማችነት ከወለድ-ነፃ የብድርና የመረዳጃ ስርአት (Solidarity Peer Credit)
            </h3>
            <p className="text-xs text-slate-400">
              አባላት በችግራቸው ጊዜ የሚረዳዱበት እና ለስራ ፈጠራ ከወለድ ነፃ ብድር የሚያገኙበት
            </p>
          </div>

          <button
            onClick={() => setIsLoanModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>የብድር ጥያቄ አቅርብ</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {peerLoans.map((loan) => (
            <div
              key={loan.id}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={loan.borrowerAvatar}
                    alt={loan.borrowerName}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <div>
                    <span className="font-bold text-white text-xs">{loan.borrowerName}</span>
                    <span className="text-[10px] text-slate-500 block">የመመለሻ ጊዜ፡ {loan.repaymentPeriodDays} ቀናት</span>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  loan.status === 'የፀደቀ'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-amber-950 text-amber-400 border border-amber-800'
                }`}>
                  {loan.status}
                </span>
              </div>

              <p className="text-xs text-slate-300 italic">
                "{loan.reason}"
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                <span className="text-slate-400">የብድር መጠን፡</span>
                <strong className="text-emerald-400 font-bold">{loan.amount.toLocaleString()} ብር (0% ወለድ)</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction Records Audit Ledger */}
      <div className="bg-[#101626] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-extrabold text-white">
              የገቢና ወጪ የኦዲት መዝገብ (Transaction Audit Ledger)
            </h3>
          </div>
          <span className="text-xs text-slate-400">ሙሉ ግልፅነትና ህጋዊ ማህተም</span>
        </div>

        <div className="space-y-2">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    tx.amount > 0 ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
                  }`}>
                    {tx.type}
                  </span>
                  <span className="font-bold text-white">{tx.descriptionAm}</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  መለያ፡ {tx.id} · {tx.date} · {tx.status}
                </div>
              </div>

              <div className="text-right">
                <div className={`text-xs font-black ${tx.amount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {tx.amount > 0 ? `+${tx.amount.toLocaleString()}` : tx.amount.toLocaleString()} {tx.currency}
                </div>
                {tx.bankCut10 && (
                  <span className="text-[9px] text-slate-500 block">
                    10% ባንክ ({tx.bankCut10} ብር) · 5% ገንቢ ({tx.builderCut5} ብር)
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deposit Modal */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#121829] border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setIsDepositModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-extrabold text-white mb-1">
              ገንዘብ ወደ ዋሌትዎ ያስገቡ
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              በኢትዮጵያ ንግድ ባንክ ወይም በቴሌብር በቀጥታ ገቢ ይደረጋል
            </p>

            <form onSubmit={handleDepositSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  የክፍያ ባንክ / ቴሌብር ይምረጡ
                </label>
                <select
                  value={selectedBankId}
                  onChange={(e) => setSelectedBankId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {bankAccounts.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.bankName} ({b.accountNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  የገቢ መጠን (ብር)
                </label>
                <input
                  type="number"
                  min={50}
                  value={amountInput}
                  onChange={(e) => setAmountInput(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDepositModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
                >
                  ተመለስ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 text-white font-bold rounded-lg text-xs shadow-md shadow-emerald-950 cursor-pointer"
                >
                  ገቢውን አፅድቅ (Confirm Deposit)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#121829] border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setIsWithdrawModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-extrabold text-white mb-1">
              ገንዘብ ወደ ባንክዎ ወይም ቴሌብር ያውጡ
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              ቀጥታ ወጪ ማድረጊያ ከ10% የባንክ እና 5% የገንቢው ተቆጣቢ ስሌት ጋር
            </p>

            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  የሚላክበት ባንክ / ቴሌብር
                </label>
                <select
                  value={selectedBankId}
                  onChange={(e) => setSelectedBankId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {bankAccounts.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.bankName} ({b.accountNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  የወጪ መጠን (ብር)
                </label>
                <input
                  type="number"
                  min={50}
                  max={balanceETB}
                  value={amountInput}
                  onChange={(e) => setAmountInput(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
                />
              </div>

              {/* Automatic live breakdown */}
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1 text-xs">
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>የሚደርስዎት የተጣራ (85%):</span>
                  <span>{Math.round(amountInput * 0.85).toLocaleString()} ብር</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>ለባንኮች ዋስትና (10%):</span>
                  <span>{Math.round(amountInput * 0.10).toLocaleString()} ብር</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>የገንቢው ተቆጣቢ ፈንድ (5%):</span>
                  <span>{Math.round(amountInput * 0.05).toLocaleString()} ብር</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
                >
                  ተመለስ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black rounded-lg text-xs shadow-md shadow-amber-950 cursor-pointer"
                >
                  ወጪ አድርግ (Confirm Payout)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Bank Modal */}
      {isAddBankModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#121829] border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAddBankModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-extrabold text-white mb-1">
              አዲስ የባንክ አካውንት ወይም ቴሌብር አገናኝ
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              የኢትዮጵያ ብሄራዊ ባንክ መመሪያን ያሟላ ፈጣን ትስስር
            </p>

            <form onSubmit={handleAddBankSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  የባንክ ተቋም ይምረጡ
                </label>
                <select
                  value={newBankCode}
                  onChange={(e) => {
                    const code = e.target.value as any;
                    setNewBankCode(code);
                    const map: Record<string, string> = {
                      CBE: 'የኢትዮጵያ ንግድ ባንክ (CBE)',
                      TELEBIRR: 'ቴሌብር (Telebirr SuperApp)',
                      AWASH: 'አዋሽ ባንክ (Awash Bank)',
                      DASHEN: 'ዳሽን ባንክ (Dashen Bank / Amole)',
                      ABYSSINIA: 'አቢሲኒያ ባንክ (Bank of Abyssinia)',
                      SWIFT: 'አለም አቀፍ SWIFT / Visa / Mastercard'
                    };
                    setNewBankName(map[code] || 'ባንክ');
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="CBE">የኢትዮጵያ ንግድ ባንክ (CBE)</option>
                  <option value="TELEBIRR">ቴሌብር (Telebirr)</option>
                  <option value="AWASH">አዋሽ ባንክ (Awash Bank)</option>
                  <option value="DASHEN">ዳሽን ባንክ (Dashen Bank)</option>
                  <option value="ABYSSINIA">አቢሲኒያ ባንክ (Abyssinia)</option>
                  <option value="SWIFT">አለም አቀፍ SWIFT / Visa</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  የሂሳብ ቁጥር (Account / Phone Number) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ለምሳሌ፡ 1000192837465 ወይም 0911234567"
                  value={newAccNumber}
                  onChange={(e) => setNewAccNumber(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  የሂሳብ ባለቤት ስም (Account Holder Name) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="በመታወቂያዎ ላይ ያለው ሙሉ ስም..."
                  value={newHolderName}
                  onChange={(e) => setNewHolderName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddBankModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
                >
                  ተመለስ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs transition-all shadow-md shadow-indigo-950 cursor-pointer"
                >
                  አካውንቱን አገናኝ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Loan Request Modal */}
      {isLoanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#121829] border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setIsLoanModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-extrabold text-white mb-1">
              የወንድማማችነት ከወለድ-ነፃ ብድር መጠየቂያ
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              ለስራ ፈጠራ ወይም ለአስቸኳይ ድጋፍ የሚውል
            </p>

            <form onSubmit={handleLoanSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  የሚፈለገው የብድር መጠን (ብር) *
                </label>
                <input
                  type="number"
                  required
                  min={500}
                  max={50000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  የብድሩ አላማና የስራ እቅድ *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="ገንዘቡን ለምን ተግባር እንደሚያውሉትና መቼ እንደሚመልሱ ይግለጹ..."
                  value={loanReason}
                  onChange={(e) => setLoanReason(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLoanModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
                >
                  ተመለስ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs shadow-md shadow-indigo-950 cursor-pointer"
                >
                  ጥያቄውን አቅርብ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
