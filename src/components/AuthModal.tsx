import React, { useState } from 'react';
import { User, Phone, Lock, FileText, CheckCircle2, X, Camera, Shield } from 'lucide-react';

export interface UserProfile {
  phoneNumber: string;
  fullName: string;
  gender: string;
  age: number;
  nationality: string;
  address: string;
  idNumber: string;
  roleTitle: string;
  avatarUrl: string;
  verifiedAt: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onSaveProfile: (profile: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveProfile
}) => {
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phoneNumber || '0911234567');
  const [password, setPassword] = useState('••••••••');
  const [fullName, setFullName] = useState(currentUser?.fullName || 'ዘበነ አስፍዬ');
  const [gender, setGender] = useState(currentUser?.gender || 'ወንድ (Male)');
  const [age, setAge] = useState(currentUser?.age || 32);
  const [nationality, setNationality] = useState(currentUser?.nationality || 'ኢትዮጵያዊ (Ethiopian)');
  const [address, setAddress] = useState(currentUser?.address || 'አዲስ አበባ፣ ኢትዮጵያ');
  const [idNumber, setIdNumber] = useState(currentUser?.idNumber || 'ETH-ID-2026-9814');
  const [roleTitle, setRoleTitle] = useState(currentUser?.roleTitle || 'የሰላምና የዕውቀት አምባሳደር');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim() || !fullName.trim()) return;

    const profile: UserProfile = {
      phoneNumber: phoneNumber.trim(),
      fullName: fullName.trim(),
      gender,
      age: Number(age),
      nationality,
      address: address.trim(),
      idNumber: idNumber.trim(),
      roleTitle: roleTitle.trim(),
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
      verifiedAt: '2026-10-26'
    };

    onSaveProfile(profile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-[#101524] border border-slate-700 rounded-3xl w-full max-w-xl p-6 md:p-8 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-white">
              የአባላት ምዝገባና የማንነት ማረጋገጫ (Official Registration)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              በስልክ ቁጥርና የይለፍ ቃል ወደ 15ቱ ቤቶች መግቢያ ህጋዊ ሰነድ
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Phone & Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                የስልክ ቁጥር *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  required
                  placeholder="0911234567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                የይለፍ ቃል (Password) *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Full Name & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                ሙሉ ስም (Full Name) *
              </label>
              <input
                type="text"
                required
                placeholder="ሙሉ ስምዎ..."
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                ፆታ
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="ወንድ (Male)">ወንድ (Male)</option>
                <option value="ሴት (Female)">ሴት (Female)</option>
              </select>
            </div>
          </div>

          {/* Age & Nationality */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                እድሜ
              </label>
              <input
                type="number"
                min={16}
                max={120}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                ዜግነት (Nationality)
              </label>
              <input
                type="text"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Address & ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                አድራሻ (ከተማ / ሀገር)
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                መታወቂያ ቁጥር / ፓስፖርት
              </label>
              <input
                type="text"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          {/* Role / Responsibility */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              የስልጣን ማዕረግ / ሀላፊነት
            </label>
            <input
              type="text"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="p-3 bg-indigo-950/40 border border-indigo-800/40 rounded-xl text-[11px] text-indigo-300 flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <span>
              የአንዱ ቤት መረጃ ወደ ሌላኛው ቤት እንዳይተላለፍ በጥብቅ የክፍል መለያየት (Isolation) የተጠበቀ ነው።
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              ተመለስ
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-950 cursor-pointer"
            >
              መረጃዬን አረጋግጥና አስቀምጥ (Save Profile)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
