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
  isGuest?: boolean;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onSaveProfile: (profile: UserProfile) => void;
  onLogout?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveProfile,
  onLogout
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(currentUser?.isGuest ? 'signup' : 'signin');
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phoneNumber || '');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(currentUser?.isGuest ? '' : (currentUser?.fullName || ''));
  const [gender, setGender] = useState(currentUser?.gender || 'ወንድ (Male)');
  const [age, setAge] = useState(currentUser?.age || 28);
  const [nationality, setNationality] = useState(currentUser?.nationality || 'ኢትዮጵያዊ (Ethiopian)');
  const [address, setAddress] = useState(currentUser?.address || 'አዲስ አበባ፣ ኢትዮጵያ');
  const [idNumber, setIdNumber] = useState(currentUser?.idNumber || '');
  const [roleTitle, setRoleTitle] = useState(currentUser?.roleTitle || 'የማህበረሰብ አባል (Community Member)');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80');

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;

    const uniqueId = idNumber.trim() || `USER-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const chosenName = fullName.trim() || `አባል_${phoneNumber.slice(-4) || '2026'}`;

    const profile: UserProfile = {
      phoneNumber: phoneNumber.trim(),
      fullName: chosenName,
      gender,
      age: Number(age) || 28,
      nationality,
      address: address.trim() || 'ኢትዮጵያ',
      idNumber: uniqueId,
      roleTitle: roleTitle.trim() || 'የማህበረሰብ አባል',
      avatarUrl: avatarUrl,
      verifiedAt: new Date().toISOString().split('T')[0],
      isGuest: false
    };

    onSaveProfile(profile);
    onClose();
  };

  const handleGuestContinue = () => {
    const salt = Math.random().toString(36).substring(2, 6);
    const guestProfile: UserProfile = {
      phoneNumber: '',
      fullName: `እንግዳ_${salt.toUpperCase()}`,
      gender: 'ያልተገለጸ',
      age: 25,
      nationality: 'ኢትዮጵያዊ (Ethiopian)',
      address: '',
      idNumber: `GUEST-${Date.now().toString(36)}-${salt}`,
      roleTitle: 'የማህበረሰብ እንግዳ (Guest)',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
      verifiedAt: new Date().toISOString().split('T')[0],
      isGuest: true
    };
    onSaveProfile(guestProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-[#101524] border border-slate-700 rounded-3xl w-full max-w-xl p-6 md:p-8 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-800/80 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-white">
              {authMode === 'signin' ? 'ወደ መለያዎ ይግቡ (Sign In)' : 'አዲስ መለያ ይፍጠሩ (Register Account)'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              በዚህ ስልክ የራስዎን መለያ በመጠቀም ወደ 16ቱ ቤቶች ይግቡ
            </p>
          </div>
        </div>

        {/* Auth Mode Toggle Tabs */}
        <div className="flex items-center gap-2 p-1 bg-slate-900/90 border border-slate-800 rounded-2xl mb-5">
          <button
            type="button"
            onClick={() => setAuthMode('signin')}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
              authMode === 'signin'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            መግቢያ (Sign In)
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('signup')}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
              authMode === 'signup'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            አዲስ ምዝገባ (Sign Up)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'signup' && (
            /* Profile Photo Upload */
            <div className="flex items-center gap-4 p-3 bg-slate-900/60 border border-slate-800 rounded-2xl">
              <div className="relative">
                <img
                  src={avatarUrl}
                  alt="Profile Preview"
                  className="w-16 h-16 rounded-full object-cover border-2 border-amber-500 shadow-md shadow-amber-500/20"
                />
                <div className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full p-1 text-slate-950 border border-slate-900 shadow">
                  <Camera className="w-3 h-3" />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  የፕሮፋይል ፎቶ (Profile Photo)
                </label>
                <p className="text-[11px] text-slate-400 mb-2">
                  የራስዎን ፎቶ ከስልክዎ ይጫኑ ወይም ነባሪውን ይጠቀሙ
                </p>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-black cursor-pointer transition shadow">
                  <Camera className="w-3.5 h-3.5" />
                  <span>ፎቶ ምረጥ</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

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
                  placeholder="09... / 07..."
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
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
                  placeholder="የይለፍ ቃል ያስገቡ..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {authMode === 'signup' && (
            <>
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
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    ፆታ
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
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
                    min={14}
                    max={120}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
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
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Address & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    አድራሻ (ከተማ / ሀገር)
                  </label>
                  <input
                    type="text"
                    placeholder="አዲስ አበባ..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    የስራ ዘርፍ / ሀላፊነት
                  </label>
                  <input
                    type="text"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </>
          )}

          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-[11px] text-slate-400 flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>
              እያንዳንዱ ስልክ የራሱ የተለየ መለያ አለው። ወደ ሌላ ስልክ ሲገቡ በራስዎ ቁጥር ይግቡ።
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
            {/* Sign Out Button (if logged in) */}
            {currentUser && !currentUser.isGuest && onLogout ? (
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="px-4 py-2 bg-red-950/60 hover:bg-red-900 border border-red-700/60 text-red-300 rounded-xl text-xs font-bold cursor-pointer transition"
              >
                ውጣ (Sign Out)
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGuestContinue}
                className="text-xs text-slate-400 hover:text-amber-400 underline cursor-pointer"
              >
                እንደ እንግዳ ቀጥል (Guest)
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
              >
                ተመለስ
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-amber-950/40 cursor-pointer transition"
              >
                {authMode === 'signin' ? 'ግባ (Sign In)' : 'ተመዝገብና ግባ (Register)'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
