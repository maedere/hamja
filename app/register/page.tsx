'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  Phone,
  Camera,
  MapPin,
  Briefcase,
  Home,
  ShieldCheck,
  CheckCircle2,
  Users,
  Compass,
  ArrowLeft,
  Sparkles,
  Lock,
  Upload,
  AlertCircle,
  KeyRound,
  LogIn,
  Plus,
  Globe,
  Heart,
  Tag,
  HeartHandshake,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth-context';
import { GuestPreference, SleepingArrangement, UserRole } from '@/types/database';
import { parsePersianNumber } from '@/lib/persian-utils';

export default function RegisterPage() {
  const router = useRouter();
  const { register, login, isUsernameTaken } = useAuth();

  const [activeTab, setActiveTab] = useState<'register' | 'login'>('register');

  // Avatar Upload
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register Form State matching Google Form
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState<string | null>(null);

  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [instagram, setInstagram] = useState('');
  const [phone, setPhone] = useState('');
  const [jobEducation, setJobEducation] = useState('');

  // Page 2: Role & Hosting capability
  const [selectedRole, setSelectedRole] = useState<UserRole>('both');
  const canHost = selectedRole === 'both' || selectedRole === 'host';
  const [maxGuests, setMaxGuests] = useState('2');
  const [guestPreference, setGuestPreference] = useState<GuestPreference>('any');
  const [sleepingArrangement, setSleepingArrangement] = useState<SleepingArrangement>('private_with_bed');

  // Page 3: House rules & Travel
  const [rulePet, setRulePet] = useState(false);
  const [ruleSmoking, setRuleSmoking] = useState(false);
  const [ruleCurfew, setRuleCurfew] = useState(false);
  const [customRule, setCustomRule] = useState('');

  const [targetDestination, setTargetDestination] = useState('');
  const [targetDates, setTargetDates] = useState('');
  const [targetGuests, setTargetGuests] = useState('1');
  const [bioSnippet, setBioSnippet] = useState('');

  // Interests, Languages, and Destinations
  const PRESET_INTERESTS = [
    'سفر و ماجراجویی',
    'عکاسی',
    'طبیعت‌گردی',
    'کوهنوردی',
    'کتاب و ادبیات',
    'موسیقی',
    'کافه‌گردی',
    'آشپزی و خوراک',
    'تاریخ و معماری',
    'کمپینگ',
    'هنر و سینما',
    'زبان‌آموزی',
    'دوچرخه‌سواری',
  ];
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['سفر و ماجراجویی', 'عکاسی']);
  const [customInterest, setCustomInterest] = useState('');

  const PRESET_LANGUAGES = [
    'فارسی (مادری)',
    'انگلیسی',
    'ترکی',
    'کردی',
    'عربی',
    'فرانسوی',
    'آلمانی',
  ];
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['فارسی (مادری)']);
  const [customLanguage, setCustomLanguage] = useState('');

  const PRESET_DESTINATIONS = [
    'گیلان و مازندران',
    'شیراز',
    'اصفهان',
    'جزیره هرمز و قشم',
    'یزد',
    'کردستان و اورامان',
    'کویر مصر و لوت',
    'تبریز و جلفا',
    'بوشهر و چابهار',
  ];
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [customDestination, setCustomDestination] = useState('');

  const toggleInterest = (tag: string) => {
    setSelectedInterests((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const addCustomInterest = () => {
    const val = customInterest.trim();
    if (val && !selectedInterests.includes(val)) {
      setSelectedInterests((prev) => [...prev, val]);
      setCustomInterest('');
    }
  };

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const addCustomLanguage = () => {
    const val = customLanguage.trim();
    if (val && !selectedLanguages.includes(val)) {
      setSelectedLanguages((prev) => [...prev, val]);
      setCustomLanguage('');
    }
  };

  const toggleDestination = (dest: string) => {
    setSelectedDestinations((prev) =>
      prev.includes(dest) ? prev.filter((d) => d !== dest) : [...prev, dest]
    );
  };

  const addCustomDestination = () => {
    const val = customDestination.trim();
    if (val && !selectedDestinations.includes(val)) {
      setSelectedDestinations((prev) => [...prev, val]);
      setCustomDestination('');
    }
  };

  // Page 4: Agreements
  const [agreeId, setAgreeId] = useState(false);
  const [agreeEthic, setAgreeEthic] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle Avatar Change
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate Username Uniqueness
  const handleUsernameChange = (val: string) => {
    setUsername(val);
    if (!val.trim()) {
      setUsernameError('نام کاربری نمی‌تواند خالی باشد');
    } else if (isUsernameTaken(val)) {
      setUsernameError('این نام کاربری قبلاً توسط کاربر دیگری انتخاب شده است.');
    } else {
      setUsernameError(null);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (usernameError || isUsernameTaken(username)) {
      alert('لطفاً یک نام کاربری یکتا انتخاب فرمایید.');
      return;
    }

    if (!agreeId || !agreeEthic || !agreeTerms) {
      alert('لطفاً تمامی تاییده‌ها و شرایط امنیتی همجا را تایید فرمایید.');
      return;
    }

    setIsSubmitting(true);

    const houseRules: string[] = [];
    if (rulePet) houseRules.push('ورود حیوان خانگی ممنوع است');
    if (ruleSmoking) houseRules.push('استعمال دخانیات داخل خانه ممنوع است');
    if (ruleCurfew) houseRules.push('محدوده ساعت رفت‌وآمد (ورود قبل از ۱۱ شب)');
    if (customRule.trim()) houseRules.push(customRule.trim());

    const parsedAge = parsePersianNumber(age);
    const parsedMaxGuests = parsePersianNumber(maxGuests);
    const parsedTargetGuests = parsePersianNumber(targetGuests);

    const isHostCapable = selectedRole === 'both' || selectedRole === 'host';

    setTimeout(() => {
      register({
        full_name: fullName,
        username,
        password,
        phone,
        instagram,
        city,
        age: parsedAge,
        job_education: jobEducation,
        avatar_url: avatarPreview || undefined,
        can_host: isHostCapable,
        role: selectedRole,
        hosting_status: isHostCapable ? 'ready_for_hosting' : 'not_hosting',
        max_guests: isHostCapable ? parsedMaxGuests || 2 : undefined,
        guest_preference: isHostCapable ? guestPreference : undefined,
        sleeping_arrangement: isHostCapable ? sleepingArrangement : undefined,
        house_rules: isHostCapable ? houseRules : [],
        target_destination: targetDestination.trim() || undefined,
        target_travel_dates: targetDates.trim() || undefined,
        target_guests_count: parsedTargetGuests || 1,
        bio_headline: bioSnippet
          ? bioSnippet.slice(0, 70)
          : selectedRole === 'traveler' && targetDestination
          ? `مشتاق سفر به ${targetDestination} و آشنایی با میزبانان محلی`
          : isHostCapable
          ? `مشتاق میزبانی صمیمانه در ${city || 'شهر من'}`
          : 'علاقه‌مند به سفر و آشنایی با فرهنگ و مردم شهرهای مختلف',
        about_me: bioSnippet || (targetDestination ? `قصد دارم به ${targetDestination} سفر کنم و خوشحال می‌شوم با میزبانان محلی آشنا شوم.` : ''),
        interests: selectedInterests.length > 0 ? selectedInterests : ['سفر و ماجراجویی', 'عکاسی'],
        languages: selectedLanguages.length > 0 ? selectedLanguages : ['فارسی (مادری)'],
        favorite_destinations: selectedDestinations.length > 0 ? selectedDestinations : undefined,
        agreed_to_provide_id: agreeId,
        agreed_to_respect_house_rules: agreeEthic,
        agreed_to_hamja_terms: agreeTerms,
      });

      setIsSubmitting(false);
      setSuccessMessage(`خوش آمدید، ${fullName}! حساب کاربری شما با موفقیت ایجاد شد.`);

      setTimeout(() => {
        router.push('/profile');
      }, 1400);
    }, 700);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const res = login(loginIdentifier, loginPassword);
    if (!res.success) {
      setLoginError(res.error || 'اطلاعات ورود نادرست است.');
    } else {
      setSuccessMessage('با موفقیت وارد شدید! در حال انتقال...');
      setTimeout(() => {
        router.push('/profile');
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F8F6]">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-10 text-right">
        {/* Toggle between Register and Login */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="bg-white p-1.5 rounded-2xl border border-[#EADFD5] shadow-sm flex items-center">
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'register'
                  ? 'bg-[#C25E38] text-white shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              ثبت‌نام عضو جدید
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'login'
                  ? 'bg-[#C25E38] text-white shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              ورود به حساب موجود
            </button>
          </div>
        </div>

        {/* LOGIN FORM TAB */}
        {activeTab === 'login' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EADFD5] shadow-sm max-w-md mx-auto space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#C25E38]/10 text-[#C25E38] flex items-center justify-center mx-auto">
                <LogIn className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">ورود به حساب کاربری همجا</h2>
              <p className="text-xs text-gray-500">
                نام کاربری یا شماره موبایل و رمز عبور خود را وارد کنید.
              </p>
            </div>

            {loginError && (
              <div className="p-3.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  نام کاربری، شماره موبایل یا آیدی اینستاگرام
                </label>
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="مثال: arash یا 09355363846"
                  className="w-full px-4 py-3 text-sm bg-[#F9F8F6] border border-gray-200 rounded-xl outline-none focus:border-[#C25E38]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  رمز عبور
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="رمز عبور شما"
                  className="w-full px-4 py-3 text-sm bg-[#F9F8F6] border border-gray-200 rounded-xl outline-none focus:border-[#C25E38]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#C25E38] hover:bg-[#A84E2D] text-white font-bold rounded-2xl shadow transition-all text-sm mt-2"
              >
                ورود به حساب کاربری
              </button>
            </form>

            <div className="pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
              هنوز حساب ندارید؟{' '}
              <button
                onClick={() => setActiveTab('register')}
                className="text-[#C25E38] font-bold hover:underline"
              >
                همین الان ثبت‌نام کنید
              </button>
            </div>
          </div>
        )}

        {/* REGISTER FORM TAB */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-8 animate-fade-in">
            {/* Header matching Google Form */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADFD5] shadow-sm space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBF4F0] text-[#C25E38] text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>عضویت ساده و سریع</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1F2937]">
                فرم ثبت‌نام اولیه همجا
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                به همجا (پلتفرم میزبانی و سفر) خوش آمدید. اطلاعات شما نزد ما محفوظ است و صرفاً جهت هماهنگی و ارتباط امن اعضا استفاده می‌شود. در این مرحله نیازی به ارسال کارت ملی نیست.
              </p>
            </div>

            {/* Profile Avatar Selection */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADFD5] shadow-sm flex flex-col sm:flex-row items-center gap-6">
              <input
                type="file"
                ref={avatarInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />

              <div
                onClick={() => avatarInputRef.current?.click()}
                className="relative w-24 h-24 rounded-full border-2 border-dashed border-[#C25E38] bg-[#FBF4F0] cursor-pointer group flex items-center justify-center overflow-hidden shrink-0 shadow-sm"
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="عکس کاربر"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-[#C25E38]">
                    <Camera className="w-7 h-7 mb-1" />
                    <span className="text-[10px] font-bold">عکس شما</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-medium transition-opacity">
                  تغییر عکس
                </div>
              </div>

              <div className="space-y-1 text-center sm:text-right">
                <h3 className="text-sm font-bold text-gray-800">عکس چهره / پروفایل کاربر</h3>
                <p className="text-xs text-gray-500 leading-relaxed max-w-md">
                  داشتن عکس واقعی اعتماد اعضا را چند برابر می‌کند. می‌توانید عکس چهره خود را از گالری انتخاب کنید.
                </p>
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors mt-2"
                >
                  {avatarPreview ? 'تغییر تصویر انتخابی' : 'انتخاب تصویر چهره'}
                </button>
              </div>
            </div>

            {/* Username and Password (Account Credentials) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADFD5] shadow-sm space-y-5">
              <h2 className="text-base font-bold text-gray-800 pb-2 border-b border-gray-100 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#C25E38]" />
                <span>اطلاعات ورود به حساب (نام کاربری و رمز عبور)</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center justify-between">
                    <span>نام کاربری یکتا <span className="text-red-500">*</span></span>
                    <span className="text-[10px] text-gray-400">حروف و اعداد انگلیسی</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    placeholder="مثال: arash_travel"
                    dir="ltr"
                    className={`w-full px-4 py-2.5 text-sm bg-[#F9F8F6] border rounded-xl outline-none font-mono text-left ${
                      usernameError ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-200 focus:border-[#C25E38]'
                    }`}
                  />
                  {usernameError && (
                    <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3" />
                      {usernameError}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    رمز عبور <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="حداقل ۶ کاراکتر"
                    dir="ltr"
                    className="w-full px-4 py-2.5 text-sm bg-[#F9F8F6] border border-gray-200 rounded-xl focus:border-[#C25E38] outline-none text-left"
                  />
                </div>
              </div>
            </div>

            {/* بخش ۱: مشخصات فردی و ارتباطی */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADFD5] shadow-sm space-y-5">
              <h2 className="text-base font-bold text-gray-800 pb-2 border-b border-gray-100 flex items-center gap-2">
                <User className="w-4 h-4 text-[#C25E38]" />
                <span>بخش ۱: اطلاعات فردی و ارتباطی</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    نام و نام‌خانوادگی کامل <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="مثال: سارا محمدی، علی رضایی..."
                    className="w-full px-4 py-2.5 text-sm bg-[#F9F8F6] border border-gray-200 rounded-xl focus:border-[#C25E38] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    سن
                  </label>
                  <input
                    type="text"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="مثال: ۲۸"
                    className="w-full px-4 py-2.5 text-sm bg-[#F9F8F6] border border-gray-200 rounded-xl focus:border-[#C25E38] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    شهر محل سکونت فعلی <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="مثال: رشت، اصفهان، شیراز..."
                    className="w-full px-4 py-2.5 text-sm bg-[#F9F8F6] border border-gray-200 rounded-xl focus:border-[#C25E38] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    شماره موبایل (ترجیحاً به نام خود فرد) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
                    className="w-full px-4 py-2.5 text-sm bg-[#F9F8F6] border border-gray-200 rounded-xl focus:border-[#C25E38] outline-none text-left font-mono"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    آیدی اینستاگرام (جهت بررسی اولیه و ارتباط) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="مثال: Arashghadimi701"
                    className="w-full px-4 py-2.5 text-sm bg-[#F9F8F6] border border-gray-200 rounded-xl focus:border-[#C25E38] outline-none text-left font-mono"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    شغل / وضعیت تحصیلی
                  </label>
                  <input
                    type="text"
                    value={jobEducation}
                    onChange={(e) => setJobEducation(e.target.value)}
                    placeholder="مثال: کاردانی، مهندس، آزاد..."
                    className="w-full px-4 py-2.5 text-sm bg-[#F9F8F6] border border-gray-200 rounded-xl focus:border-[#C25E38] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* بخش ۲: شرایط و امکانات میزبانی (Google Form Page 2) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADFD5] shadow-sm space-y-5">
              <h2 className="text-base font-bold text-gray-800 pb-2 border-b border-gray-100 flex items-center gap-2">
                <Home className="w-4 h-4 text-[#C25E38]" />
                <span>بخش ۲: شرایط و امکانات میزبانی</span>
              </h2>

              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-3">
                  نحوه فعالیت شما در شبکه همجا چگونه خواهد بود؟ <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Option 1: Mutual Hosting */}
                  <button
                    type="button"
                    onClick={() => setSelectedRole('both')}
                    className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between gap-2.5 ${
                      selectedRole === 'both'
                        ? 'border-[#C25E38] bg-[#FBF4F0] ring-2 ring-[#C25E38]/20 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 bg-[#F9F8F6]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="w-8 h-8 rounded-xl bg-[#C25E38]/10 text-[#C25E38] flex items-center justify-center">
                        <HeartHandshake className="w-4 h-4" />
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedRole === 'both' ? 'border-[#C25E38] bg-[#C25E38] text-white' : 'border-gray-300'}`}>
                        {selectedRole === 'both' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-900 block mb-0.5">میزبانی متقابل</span>
                      <span className="text-[11px] text-gray-500 leading-relaxed block">
                        هم میزبان می‌شوم، هم در سفرهایم مهمان
                      </span>
                    </div>
                  </button>

                  {/* Option 2: Host Only */}
                  <button
                    type="button"
                    onClick={() => setSelectedRole('host')}
                    className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between gap-2.5 ${
                      selectedRole === 'host'
                        ? 'border-[#1E5647] bg-[#EBF5F1] ring-2 ring-[#1E5647]/20 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 bg-[#F9F8F6]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="w-8 h-8 rounded-xl bg-[#1E5647]/10 text-[#1E5647] flex items-center justify-center">
                        <Home className="w-4 h-4" />
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedRole === 'host' ? 'border-[#1E5647] bg-[#1E5647] text-white' : 'border-gray-300'}`}>
                        {selectedRole === 'host' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-900 block mb-0.5">فقط میزبان</span>
                      <span className="text-[11px] text-gray-500 leading-relaxed block">
                        آمادگی پذیرش مسافران در خانه خود
                      </span>
                    </div>
                  </button>

                  {/* Option 3: Traveler Only */}
                  <button
                    type="button"
                    onClick={() => setSelectedRole('traveler')}
                    className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between gap-2.5 ${
                      selectedRole === 'traveler'
                        ? 'border-sky-600 bg-sky-50 ring-2 ring-sky-600/20 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 bg-[#F9F8F6]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                        <Compass className="w-4 h-4" />
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedRole === 'traveler' ? 'border-sky-600 bg-sky-600 text-white' : 'border-gray-300'}`}>
                        {selectedRole === 'traveler' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-900 block mb-0.5">فقط مهمان / مسافر</span>
                      <span className="text-[11px] text-gray-500 leading-relaxed block">
                        فعلاً امکان میزبانی ندارم و فقط مسافرم
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {(selectedRole === 'both' || selectedRole === 'host') && (
                <div className="space-y-4 pt-4 border-t border-gray-100 animate-fade-in">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      حداکثر تعداد مهمانی که می‌توانید بپذیرید
                    </label>
                    <input
                      type="text"
                      value={maxGuests}
                      onChange={(e) => setMaxGuests(e.target.value)}
                      placeholder="مثال: ۱، ۲، ۳..."
                      className="w-full sm:w-48 px-4 py-2 text-sm bg-[#F9F8F6] border border-gray-200 rounded-xl focus:border-[#C25E38] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      ترجیح شما برای پذیرش مهمان چیست؟
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'any', label: 'تفاوتی ندارد' },
                        { id: 'females_only', label: 'فقط خانم‌ها' },
                        { id: 'males_only', label: 'فقط آقایان' },
                        { id: 'couples_families', label: 'زوج‌ها / خانواده‌ها' },
                      ].map((pref) => (
                        <button
                          key={pref.id}
                          type="button"
                          onClick={() => setGuestPreference(pref.id as GuestPreference)}
                          className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                            guestPreference === pref.id
                              ? 'border-[#C25E38] bg-[#FBF4F0] text-[#C25E38]'
                              : 'border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          {pref.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      امکانات خواب برای مهمان
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        { id: 'private_with_bed', label: 'اتاق خواب مجزا با تخت' },
                        { id: 'private_without_bed', label: 'اتاق مجزا بدون تخت (رختخواب)' },
                        { id: 'shared_space', label: 'فضای مشترک (پذیرایی / کاناپه)' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSleepingArrangement(item.id as SleepingArrangement)}
                          className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                            sleepingArrangement === item.id
                              ? 'border-[#C25E38] bg-[#FBF4F0] text-[#C25E38]'
                              : 'border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* If user is only a traveler (guest), capture where they want to go */}
              {selectedRole === 'traveler' && (
                <div className="space-y-4 pt-4 border-t border-gray-100 animate-fade-in">
                  <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 flex items-start gap-3">
                    <Compass className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-sky-900">مشخصات برنامه سفر شما به عنوان مسافر و مهمان</h4>
                      <p className="text-[11px] text-sky-700 leading-relaxed">
                        با ثبت مقاصد و زمان سفرتان، میزبانان محلی در آن شهرها می‌توانند پروفایل شما را ببینند و به شما پیشنهاد میزبانی بدهند.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      شهر یا مقاصدی که قصد سفر داری <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={targetDestination}
                      onChange={(e) => setTargetDestination(e.target.value)}
                      placeholder="مثال: شیراز، رشت، یزد، قشم، کاشان..."
                      className="w-full px-4 py-2.5 text-sm bg-[#F9F8F6] border border-gray-200 rounded-xl focus:border-[#C25E38] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        زمان یا تاریخ تقریبی سفر
                      </label>
                      <input
                        type="text"
                        value={targetDates}
                        onChange={(e) => setTargetDates(e.target.value)}
                        placeholder="مثال: آبان ماه، آخر این هفته، تعطیلات نوروز..."
                        className="w-full px-4 py-2.5 text-sm bg-[#F9F8F6] border border-gray-200 rounded-xl focus:border-[#C25E38] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        تعداد مسافران
                      </label>
                      <input
                        type="text"
                        value={targetGuests}
                        onChange={(e) => setTargetGuests(e.target.value)}
                        placeholder="مثال: ۱ نفر (تنها)، ۲ نفر..."
                        className="w-full px-4 py-2.5 text-sm bg-[#F9F8F6] border border-gray-200 rounded-xl focus:border-[#C25E38] outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* بخش ۳: قوانین خانه یا معرفی سفر */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADFD5] shadow-sm space-y-5">
              <h2 className="text-base font-bold text-gray-800 pb-2 border-b border-gray-100 flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#C25E38]" />
                <span>{canHost ? 'بخش ۳: قوانین خانه و معرفی' : 'بخش ۳: معرفی و انتظارات از سفر'}</span>
              </h2>

              {canHost && (
                <div>
                  <label className="block text-xs font-semibold text-gray-800 mb-2">
                    قوانین خاص خانه شما (House Rules)
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rulePet}
                        onChange={(e) => setRulePet(e.target.checked)}
                        className="w-4 h-4 text-[#C25E38] rounded accent-[#C25E38]"
                      />
                      <span>ورود حیوان خانگی ممنوع است</span>
                    </label>
                    <label className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={ruleSmoking}
                        onChange={(e) => setRuleSmoking(e.target.checked)}
                        className="w-4 h-4 text-[#C25E38] rounded accent-[#C25E38]"
                      />
                      <span>استعمال دخانیات داخل خانه ممنوع است</span>
                    </label>
                    <label className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={ruleCurfew}
                        onChange={(e) => setRuleCurfew(e.target.checked)}
                        className="w-4 h-4 text-[#C25E38] rounded accent-[#C25E38]"
                      />
                      <span>محدوده ساعت رفت‌وآمد (ورود قبل از ۱۱ شب)</span>
                    </label>
                    <input
                      type="text"
                      value={customRule}
                      onChange={(e) => setCustomRule(e.target.value)}
                      placeholder="قانون خاص دیگر اگر دارید بنویسید..."
                      className="w-full px-3.5 py-2 text-xs bg-[#F9F8F6] border border-gray-200 rounded-xl outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2">
                <label className="block text-xs font-semibold text-gray-800 mb-2">
                  {canHost
                    ? 'معرفی کوتاه از خودتان و شرایط میزبانی / سفر'
                    : 'معرفی کوتاه، دلیل این سفر و انتظارات شما از میزبانی'}
                </label>
                <textarea
                  rows={3}
                  value={bioSnippet}
                  onChange={(e) => setBioSnippet(e.target.value)}
                  placeholder={
                    canHost
                      ? 'چند خط درباره خودتان، علایق، شغل و شرایط میزبانی بگویید...'
                      : 'چند خط درباره خودتان، برنامه و هدف‌تان از این سفر بنویسید...'
                  }
                  className="w-full p-3.5 text-xs sm:text-sm bg-[#F9F8F6] border border-gray-200 rounded-2xl outline-none focus:border-[#C25E38] leading-relaxed"
                />
              </div>

              {/* علاقه‌مندی‌ها (Interests) */}
              <div className="pt-3 border-t border-gray-100 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-[#C25E38]" />
                    <span>علاقه‌مندی‌ها و سبک زندگی (انتخاب چندتایی یا افزودن دلخواه)</span>
                  </label>
                  <span className="text-[11px] text-gray-400">
                    {selectedInterests.length} مورد انتخاب شده
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {PRESET_INTERESTS.map((tag) => {
                    const isSelected = selectedInterests.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => toggleInterest(tag)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-[#C25E38] text-white shadow-sm ring-2 ring-[#C25E38]/20'
                            : 'bg-[#F9F8F6] text-gray-700 border border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {tag}
                      </button>
                    );
                  })}
                  {selectedInterests
                    .filter((t) => !PRESET_INTERESTS.includes(t))
                    .map((tag) => (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => toggleInterest(tag)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#C25E38] text-white shadow-sm ring-2 ring-[#C25E38]/20 flex items-center gap-1"
                      >
                        <span>✓ {tag}</span>
                        <span className="text-[10px] opacity-75">×</span>
                      </button>
                    ))}
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={customInterest}
                    onChange={(e) => setCustomInterest(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomInterest();
                      }
                    }}
                    placeholder="افزودن علاقه‌مندی دلخواه دیگر (مثلاً: نجوم، بازی رومیزی)..."
                    className="flex-1 px-3.5 py-2 text-xs bg-[#F9F8F6] border border-gray-200 rounded-xl outline-none focus:border-[#C25E38]"
                  />
                  <button
                    type="button"
                    onClick={addCustomInterest}
                    className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>افزودن</span>
                  </button>
                </div>
              </div>

              {/* زبان‌ها (Languages) */}
              <div className="pt-3 border-t border-gray-100 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#1E5647]" />
                    <span>زبان‌هایی که به آن‌ها مسلط هستید</span>
                  </label>
                  <span className="text-[11px] text-gray-400">
                    {selectedLanguages.length} زبان
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {PRESET_LANGUAGES.map((lang) => {
                    const isSelected = selectedLanguages.includes(lang);
                    return (
                      <button
                        type="button"
                        key={lang}
                        onClick={() => toggleLanguage(lang)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-[#1E5647] text-white shadow-sm ring-2 ring-[#1E5647]/20'
                            : 'bg-[#F9F8F6] text-gray-700 border border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {lang}
                      </button>
                    );
                  })}
                  {selectedLanguages
                    .filter((l) => !PRESET_LANGUAGES.includes(l))
                    .map((lang) => (
                      <button
                        type="button"
                        key={lang}
                        onClick={() => toggleLanguage(lang)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#1E5647] text-white shadow-sm ring-2 ring-[#1E5647]/20 flex items-center gap-1"
                      >
                        <span>✓ {lang}</span>
                        <span className="text-[10px] opacity-75">×</span>
                      </button>
                    ))}
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={customLanguage}
                    onChange={(e) => setCustomLanguage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomLanguage();
                      }
                    }}
                    placeholder="افزودن زبان دیگر (مثلاً: اسپانیایی، ایتالیایی)..."
                    className="flex-1 px-3.5 py-2 text-xs bg-[#F9F8F6] border border-gray-200 rounded-xl outline-none focus:border-[#1E5647]"
                  />
                  <button
                    type="button"
                    onClick={addCustomLanguage}
                    className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>افزودن</span>
                  </button>
                </div>
              </div>

              {/* مقصدهای محبوب برای سفر */}
              <div className="pt-3 border-t border-gray-100 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-[#C25E38]" />
                    <span>مقصدهای محبوب شما برای سفر و اقامت</span>
                  </label>
                  <span className="text-[11px] text-gray-400">
                    {selectedDestinations.length} مقصد
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {PRESET_DESTINATIONS.map((dest) => {
                    const isSelected = selectedDestinations.includes(dest);
                    return (
                      <button
                        type="button"
                        key={dest}
                        onClick={() => toggleDestination(dest)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-[#C25E38] text-white shadow-sm ring-2 ring-[#C25E38]/20'
                            : 'bg-[#F9F8F6] text-gray-700 border border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {dest}
                      </button>
                    );
                  })}
                  {selectedDestinations
                    .filter((d) => !PRESET_DESTINATIONS.includes(d))
                    .map((dest) => (
                      <button
                        type="button"
                        key={dest}
                        onClick={() => toggleDestination(dest)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#C25E38] text-white shadow-sm ring-2 ring-[#C25E38]/20 flex items-center gap-1"
                      >
                        <span>✓ {dest}</span>
                        <span className="text-[10px] opacity-75">×</span>
                      </button>
                    ))}
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={customDestination}
                    onChange={(e) => setCustomDestination(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomDestination();
                      }
                    }}
                    placeholder="افزودن مقصد محبوب دیگر (مثلاً: هورامان، لارک، دزفول)..."
                    className="flex-1 px-3.5 py-2 text-xs bg-[#F9F8F6] border border-gray-200 rounded-xl outline-none focus:border-[#C25E38]"
                  />
                  <button
                    type="button"
                    onClick={addCustomDestination}
                    className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>افزودن</span>
                  </button>
                </div>
              </div>
            </div>

            {/* بخش ۴: تایید قوانین و تعهدات امنیتی (Google Form Page 4) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADFD5] shadow-sm space-y-4">
              <h2 className="text-base font-bold text-gray-800 pb-2 border-b border-gray-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#1E5647]" />
                <span>بخش ۴: تأیید قوانین و تعهدات امنیتی</span>
              </h2>

              <div className="space-y-3">
                <label className="flex items-start gap-3 p-3 rounded-2xl bg-[#F9F8F6] border border-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={agreeId}
                    onChange={(e) => setAgreeId(e.target.checked)}
                    className="w-4 h-4 text-[#1E5647] rounded accent-[#1E5647] mt-0.5 shrink-0"
                  />
                  <span className="text-xs text-gray-700 leading-relaxed">
                    <strong className="text-gray-900 block mb-0.5">تأییدیه مدارک شناسایی:</strong>
                    تایید می‌کنم که در صورت پیدا شدن میزبان/مهمان مناسب و هنگام ارسال یا پذیرش درخواست، تصویر کارت ملی و سلفی خود را جهت احراز هویت ارائه دهم.
                  </span>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-2xl bg-[#F9F8F6] border border-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={agreeEthic}
                    onChange={(e) => setAgreeEthic(e.target.checked)}
                    className="w-4 h-4 text-[#1E5647] rounded accent-[#1E5647] mt-0.5 shrink-0"
                  />
                  <span className="text-xs text-gray-700 leading-relaxed">
                    <strong className="text-gray-900 block mb-0.5">تأیید قوانین اخلاقی و حفظ امنیت:</strong>
                    متعهد می‌شوم به قوانین خانه میزبان احترام گذاشته و در حفظ امنیت و نظافت کوشا باشم.
                  </span>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-2xl bg-[#F9F8F6] border border-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 text-[#1E5647] rounded accent-[#1E5647] mt-0.5 shrink-0"
                  />
                  <span className="text-xs text-gray-700 leading-relaxed">
                    <strong className="text-gray-900 block mb-0.5">تأیید شرایط و توافق‌نامه همجا:</strong>
                    &ldquo;همجا&rdquo; صرفاً بستر ارتباطی و معرفی کاربران اهل سفر به یکدیگر است. مسئولیت حفظ اموال شخصی و رعایت قوانین کشور بر عهده مهمان و میزبان است و ارسال این فرم به منزله پذیرش مسئولیت شخصی در ارتباط با سایر کاربران است.
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="space-y-3">
              {(!agreeId || !agreeEthic || !agreeTerms) && (
                <p className="text-[11px] text-amber-800 text-center font-bold bg-amber-50 py-2.5 px-3 rounded-2xl border border-amber-200">
                  برای فعال‌سازی ثبت‌نام، لطفاً تیک هر ۳ بند تعهدات امنیتی و توافق‌نامه در بخش ۴ را بزنید.
                </p>
              )}
              <button
                type="submit"
                disabled={isSubmitting || !!usernameError || !agreeId || !agreeEthic || !agreeTerms}
                className="w-full py-4 bg-[#C25E38] hover:bg-[#A84E2D] text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-base disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span>در حال ایجاد حساب کاربری...</span>
                ) : (
                  <>
                    <span>ثبت‌نام و عضویت در همجا</span>
                    <ArrowLeft className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {successMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl border border-[#EADFD5]">
              <div className="w-16 h-16 rounded-full bg-[#1E5647] text-white flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">عملیات با موفقیت انجام شد</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{successMessage}</p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
