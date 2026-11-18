import React, { useState, useEffect } from 'react';
import {
  User,
  Phone,
  Lock,
  X,
  Camera,
  LogIn,
  UserPlus,
  KeyRound,
  AlertTriangle,
  Loader2,
  Eye,
  EyeOff,
  Edit3,
  CheckCircle2,
  Save
} from 'lucide-react';
import { getApiUrl } from '../config/env';

export interface UserProfile {
  phoneNumber: string; // Phone Number Only
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

interface StoredAccount {
  phoneNumber: string;
  passwordHash: string;
  profile: UserProfile;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onSaveProfile: (profile: UserProfile) => void;
  onLogout?: () => void;
  canDismiss?: boolean;
}

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveProfile,
  onLogout,
  canDismiss = true
}) => {
  const isLoggedInUser = !!(currentUser && !currentUser.isGuest);

  const [authMode, setAuthMode] = useState<'edit' | 'signin' | 'signup'>(
    isLoggedInUser ? 'edit' : 'signup'
  );
  const [identifier, setIdentifier] = useState(currentUser?.phoneNumber || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Profile fields
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [gender, setGender] = useState(currentUser?.gender || 'ወንድ (Male)');
  const [age, setAge] = useState(currentUser?.age || 26);
  const [nationality, setNationality] = useState(currentUser?.nationality || 'ኢትዮጵያዊ (Ethiopian)');
  const [address, setAddress] = useState(currentUser?.address || 'አዲስ አበባ፣ ኢትዮጵያ');
  const [roleTitle, setRoleTitle] = useState(currentUser?.roleTitle || 'የማህበረሰብ አባል (Community Member)');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || DEFAULT_AVATAR);

  // Sync form state whenever modal opens or currentUser updates
  useEffect(() => {
    if (!isOpen) return;
    const hasAccount = !!(currentUser && !currentUser.isGuest);
    setAuthMode(hasAccount ? 'edit' : 'signup');
    setIdentifier(currentUser?.phoneNumber || '');
    setFullName(currentUser?.fullName || '');
    setGender(currentUser?.gender || 'ወንድ (Male)');
    setAge(currentUser?.age || 26);
    setNationality(currentUser?.nationality || 'ኢትዮጵያዊ (Ethiopian)');
    setAddress(currentUser?.address || 'አዲስ አበባ፣ ኢትዮጵያ');
    setRoleTitle(currentUser?.roleTitle || 'የማህበረሰብ አባል (Community Member)');
    setAvatarUrl(currentUser?.avatarUrl || DEFAULT_AVATAR);
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setErrorMessage(null);
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const getStoredAccounts = (): Record<string, StoredAccount> => {
    try {
      const data = localStorage.getItem('oneworld_registered_accounts');
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  };

  const saveStoredAccount = (acc: StoredAccount, previousPhone?: string) => {
    try {
      const accounts = getStoredAccounts();
      if (previousPhone) {
        const prevKey = previousPhone.replace(/[\s\-()]/g, '').toLowerCase();
        const prevLower = previousPhone.trim().toLowerCase();
        const nextKey = acc.phoneNumber.replace(/[\s\-()]/g, '').toLowerCase();
        if (prevKey !== nextKey) delete accounts[prevKey];
        if (prevLower !== nextKey) delete accounts[prevLower];
      }
      const key = acc.phoneNumber.replace(/[\s\-()]/g, '').toLowerCase();
      accounts[key] = acc;
      localStorage.setItem('oneworld_registered_accounts', JSON.stringify(accounts));
    } catch {}
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanPhone = identifier.trim();
    const digitsOnly = cleanPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.includes('@') || digitsOnly.length < 7 || digitsOnly.length > 15) {
      setErrorMessage('እባክዎ ትክክለኛ ስልክ ቁጥር ብቻ ያስገቡ! (ምሳሌ፡ 0911... ወይም +2519...)');
      return;
    }

    const accounts = getStoredAccounts();
    const accountKey = cleanPhone.replace(/[\s\-()]/g, '').toLowerCase();

    // 1. EDIT EXISTING PROFILE MODE
    if (authMode === 'edit' && currentUser) {
      if (!fullName.trim()) {
        setErrorMessage('እባክዎ ሙሉ ስምዎን ያስገቡ!');
        return;
      }

      if (password || confirmPassword) {
        if (password.length < 6) {
          setErrorMessage('አዲሱ የይለፍ ቃል ቢያንስ ከ6 አሀዝ ያላነሰ መሆን አለበት!');
          return;
        }
        if (password !== confirmPassword) {
          setErrorMessage('ያስገቡት የይለፍ ቃልና ማረጋገጫው አይመሳሰልም! እባክዎ የዓይን ምልክቱን ተጭነው ያረጋግጡ።');
          return;
        }
      }

      setIsSubmitting(true);
      const updatedFallback: UserProfile = {
        ...currentUser,
        phoneNumber: cleanPhone,
        fullName: fullName.trim(),
        gender,
        age: Number(age) || currentUser.age || 26,
        nationality: nationality.trim() || currentUser.nationality,
        address: address.trim() || 'ኢትዮጵያ',
        roleTitle: roleTitle.trim() || 'የማህበረሰብ አባል',
        avatarUrl,
        isGuest: false
      };

      try {
        const res = await fetch(getApiUrl('/api/auth/profile'), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentPhoneNumber: currentUser.phoneNumber,
            idNumber: currentUser.idNumber,
            phoneNumber: cleanPhone,
            fullName: fullName.trim(),
            gender,
            age: Number(age) || 26,
            nationality: nationality.trim() || 'ኢትዮጵያዊ (Ethiopian)',
            address: address.trim() || 'ኢትዮጵያ',
            roleTitle: roleTitle.trim() || 'የማህበረሰብ አባል',
            avatarUrl,
            newPassword: password || undefined
          })
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setErrorMessage(data?.error || 'ፕሮፋይሉን ማስተካከል አልተቻለም። እባክዎ እንደገና ይሞክሩ።');
          setIsSubmitting(false);
          return;
        }

        const savedProfile: UserProfile = data.profile || updatedFallback;
        const oldKey = currentUser.phoneNumber.replace(/[\s\-()]/g, '').toLowerCase();
        const existingLocal = accounts[oldKey] || accounts[currentUser.phoneNumber.toLowerCase()];
        saveStoredAccount(
          {
            phoneNumber: cleanPhone,
            passwordHash: password || existingLocal?.passwordHash || '',
            profile: savedProfile
          },
          currentUser.phoneNumber
        );
        onSaveProfile(savedProfile);
        onClose();
      } catch {
        // Offline resilience
        const oldKey = currentUser.phoneNumber.replace(/[\s\-()]/g, '').toLowerCase();
        const existingLocal = accounts[oldKey] || accounts[currentUser.phoneNumber.toLowerCase()];
        saveStoredAccount(
          {
            phoneNumber: cleanPhone,
            passwordHash: password || existingLocal?.passwordHash || '',
            profile: updatedFallback
          },
          currentUser.phoneNumber
        );
        onSaveProfile(updatedFallback);
        onClose();
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // Password check for sign in / sign up
    if (password.length < 6) {
      setErrorMessage('የይለፍ ቃል (Password) ቢያንስ ከ6 አሀዝ ያላነሰ መሆን አለበት!');
      return;
    }

    // 2. SIGN UP MODE
    if (authMode === 'signup') {
      if (password !== confirmPassword) {
        setErrorMessage('ያስገቡት የይለፍ ቃልና ማረጋገጫው አይመሳሰልም! እባክዎ የዓይን ምልክቱን ተጭነው ያረጋግጡ።');
        return;
      }
      if (!fullName.trim()) {
        setErrorMessage('እባክዎ ሙሉ ስምዎን ያስገቡ!');
        return;
      }

      setIsSubmitting(true);
      try {
        const res = await fetch(getApiUrl('/api/auth/register'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phoneNumber: cleanPhone,
            password,
            fullName: fullName.trim(),
            gender,
            age: Number(age) || 26,
            nationality,
            address: address.trim() || 'ኢትዮጵያ',
            roleTitle: roleTitle.trim() || 'የማህበረሰብ አባል',
            avatarUrl
          })
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setErrorMessage(data?.error || 'ምዝገባው አልተሳካም። እባክዎ እንደገና ይሞክሩ።');
          setIsSubmitting(false);
          return;
        }

        const profile: UserProfile = data.profile;
        saveStoredAccount({
          phoneNumber: cleanPhone,
          passwordHash: password,
          profile
        });
        onSaveProfile(profile);
        onClose();
      } catch {
        const uniqueUserId = `USER-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        const fallbackProfile: UserProfile = {
          phoneNumber: cleanPhone,
          fullName: fullName.trim(),
          gender,
          age: Number(age) || 26,
          nationality,
          address: address.trim() || 'ኢትዮጵያ',
          idNumber: uniqueUserId,
          roleTitle: roleTitle.trim() || 'የማህበረሰብ አባል',
          avatarUrl,
          verifiedAt: new Date().toISOString().split('T')[0],
          isGuest: false
        };
        saveStoredAccount({ phoneNumber: cleanPhone, passwordHash: password, profile: fallbackProfile });
        onSaveProfile(fallbackProfile);
        onClose();
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // 3. SIGN IN MODE
    setIsSubmitting(true);
    try {
      const res = await fetch(getApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: cleanPhone, password })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.profile) {
        saveStoredAccount({ phoneNumber: cleanPhone, passwordHash: password, profile: data.profile });
        onSaveProfile({ ...data.profile, isGuest: false });
        onClose();
        setIsSubmitting(false);
        return;
      }
      if (res.status === 401 || res.status === 404) {
        setErrorMessage(data?.error || 'ስልክ ቁጥሩ ወይም የይለፍ ቃሉ የተሳሳተ ነው!');
        setIsSubmitting(false);
        return;
      }
    } catch {
      // Offline fallback check
    } finally {
      setIsSubmitting(false);
    }

    const existing = accounts[accountKey] || accounts[cleanPhone.toLowerCase()];
    if (!existing) {
      setErrorMessage('ይህ ስልክ ቁጥር አልተመዘገበም! እባክዎ መጀመሪያ "አዲስ ምዝገባ (Sign Up)" የሚለውን ይምረጡ።');
      return;
    }

    if (existing.passwordHash !== password) {
      setErrorMessage('የተሳሳተ የይለፍ ቃል ነው! እባክዎ ትክክለኛ የይለፍ ቃል ያስገቡ።');
      return;
    }

    onSaveProfile({ ...existing.profile, isGuest: false });
    onClose();
  };

  const showProfileFields = authMode === 'signup' || authMode === 'edit';
  const passwordMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;
  const passwordMatch =
    password.length >= 6 && confirmPassword.length > 0 && password === confirmPassword;

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-[#101524] border border-slate-700 rounded-3xl w-full max-w-xl p-4 sm:p-6 md:p-8 shadow-2xl relative my-2 sm:my-8">
        {canDismiss && (
          <button
            type="button"
            onClick={onClose}
            aria-label="ዝጋ"
            className="absolute top-3.5 right-3.5 text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-800/80 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-3 mb-4 pr-8">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0">
            {authMode === 'edit' ? <Edit3 className="w-5 h-5 sm:w-6 sm:h-6" /> : <User className="w-5 h-5 sm:w-6 sm:h-6" />}
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-black text-white break-words">
              {authMode === 'edit'
                ? 'ፕሮፋይልዎን ያስተካክሉ (Edit Profile)'
                : authMode === 'signin'
                ? 'ወደ መለያዎ ይግቡ (Sign In)'
                : 'አዲስ መለያ ይፍጠሩ (Register Account)'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 break-words">
              {authMode === 'edit'
                ? 'በምዝገባ ወቅት የነበረ ስህተት ካለ ስም፣ ስልክ፣ ፎቶ ወይም ሌላ መረጃዎን እዚህ ያስተካክሉ'
                : 'የራስዎን የግል መለያ ስልክና ፓስዋርድ ተጠቅመው ይግቡ'}
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-red-950/80 border border-red-500/60 text-red-200 text-xs font-bold flex items-start gap-2 animate-fadeIn">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span className="break-words">{errorMessage}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-2xl mb-5">
          {isLoggedInUser && (
            <button
              type="button"
              onClick={() => {
                setAuthMode('edit');
                setErrorMessage(null);
              }}
              className={`flex-1 min-w-[110px] py-2 px-2 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
                authMode === 'edit'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>ፕሮፋይል አስተካክል</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setAuthMode('signin');
              setErrorMessage(null);
            }}
            className={`flex-1 min-w-[100px] py-2 px-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
              authMode === 'signin'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            መግቢያ (Sign In)
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('signup');
              setErrorMessage(null);
            }}
            className={`flex-1 min-w-[110px] py-2 px-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
              authMode === 'signup'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            አዲስ ምዝገባ (Sign Up)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {showProfileFields && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 p-3 bg-slate-900/60 border border-slate-800 rounded-2xl">
              <div className="relative self-center sm:self-auto flex-shrink-0">
                <img
                  src={avatarUrl}
                  alt="Profile Preview"
                  className="w-16 h-16 rounded-full object-cover border-2 border-amber-500 shadow-md shadow-amber-500/20"
                />
                <div className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full p-1 text-slate-950 border border-slate-900 shadow">
                  <Camera className="w-3 h-3" />
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left min-w-0">
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  የፕሮፋይል ፎቶ (Profile Photo) *
                </label>
                <p className="text-[11px] text-slate-400 mb-2">
                  በቪዲዮና በወንበር ላይ የሚታየውን ትክክለኛ ፎቶዎን ይምረጡ
                </p>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-black cursor-pointer transition shadow">
                  <Camera className="w-3.5 h-3.5" />
                  <span>ፎቶ ቀይር</span>
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

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              ስልክ ቁጥር (Phone Number) *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                placeholder="09... / 07... / +2519..."
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
          </div>

          {showProfileFields && (
            <>
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

          {/* Password & Confirm Password with Visible Eye Toggle */}
          <div className="p-3 bg-slate-900/45 border border-slate-800/90 rounded-2xl space-y-2.5">
            {authMode === 'edit' && (
              <div className="text-[11px] font-bold text-amber-300">
                🔒 የይለፍ ቃል መቀየር ከፈለጉ ብቻ ከታች ያስገቡ (ባይቀይሩት ባዶ ይተዉት)፦
              </div>
            )}
            <div className={`grid gap-3 ${authMode === 'signup' || authMode === 'edit' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {authMode === 'edit' ? 'አዲስ የይለፍ ቃል (አማራጭ)' : 'የይለፍ ቃል (ቢያንስ 6 አሀዝ) *'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required={authMode !== 'edit'}
                    minLength={authMode === 'edit' && !password ? undefined : 6}
                    placeholder="ቢያንስ 6 አሀዝ..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-11 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'የይለፍ ቃል ደብቅ' : 'የይለፍ ቃል አሳይ'}
                    title={showPassword ? 'የይለፍ ቃል ደብቅ' : 'የይለፍ ቃል አሳይ'}
                    className="absolute right-2 top-1.5 p-1.5 rounded-lg text-amber-400 hover:bg-slate-800 cursor-pointer transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {(authMode === 'signup' || authMode === 'edit') && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {authMode === 'edit' ? 'አዲሱን የይለፍ ቃል ያረጋግጡ' : 'የይለፍ ቃል ማረጋገጫ *'}
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required={authMode === 'signup' || password.length > 0}
                      minLength={authMode === 'edit' && !password && !confirmPassword ? undefined : 6}
                      placeholder="የይለፍ ቃሉን ደግመው ይጻፉ..."
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full bg-slate-950 border rounded-xl pl-9 pr-11 py-2 text-xs text-white placeholder-slate-500 focus:outline-none ${
                        passwordMismatch
                          ? 'border-red-500 focus:border-red-400'
                          : passwordMatch
                          ? 'border-emerald-500 focus:border-emerald-400'
                          : 'border-slate-700 focus:border-amber-400'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      aria-label={showConfirmPassword ? 'ማረጋገጫ ደብቅ' : 'ማረጋገጫ አሳይ'}
                      title={showConfirmPassword ? 'ማረጋገጫ ደብቅ' : 'ማረጋገጫ አሳይ'}
                      className="absolute right-2 top-1.5 p-1.5 rounded-lg text-amber-400 hover:bg-slate-800 cursor-pointer transition"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {(authMode === 'signup' || (authMode === 'edit' && (password || confirmPassword))) && (passwordMismatch || passwordMatch) && (
              <div className={`text-[11px] font-bold flex items-center gap-1.5 ${
                passwordMatch ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {passwordMatch ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>የይለፍ ቃሉ በትክክል ተመሳስሏል!</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>ያስገቡት የይለፍ ቃል አይመሳሰልም — የዓይን ምልክቱን (👁) ነክተው ያረጋግጡ</span>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
            {currentUser && onLogout ? (
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
            ) : <div />}

            <div className="flex flex-wrap items-center gap-2 ml-auto">
              {canDismiss && (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                >
                  ተመለስ
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 disabled:opacity-60 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-amber-950/40 cursor-pointer transition flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : authMode === 'edit' ? (
                  <Save className="w-3.5 h-3.5" />
                ) : authMode === 'signin' ? (
                  <LogIn className="w-3.5 h-3.5" />
                ) : (
                  <UserPlus className="w-3.5 h-3.5" />
                )}
                <span>
                  {authMode === 'edit'
                    ? 'ለውጦችን አስቀምጥ (Save Changes)'
                    : authMode === 'signin'
                    ? 'ግባ (Sign In)'
                    : 'ተመዝገብና ግባ (Register)'}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
