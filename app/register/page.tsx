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
  ArrowRight,
  Sparkles,
  Lock,
  Upload,
  AlertCircle,
  LogIn,
  HeartHandshake,
  Check,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth-context';
import { GuestPreference, SleepingArrangement, UserRole } from '@/types/database';
import { parsePersianNumber, toEnglishDigits, toPersianDigits } from '@/lib/persian-utils';

export default function RegisterPage() {
  const router = useRouter();
  const { register, login, isUsernameTaken } = useAuth();

  const [activeTab, setActiveTab] = useState<'register' | 'login'>('register');

  // Wizard Step State (1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Avatar Upload
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Step 1: Credentials & Phone (Mandatory)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [usernameError, setUsernameError] = useState<string | null>(null);

  // Step 2: Personal Profile
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('');
  const [age, setAge] = useState('');
  const [jobEducation, setJobEducation] = useState('');
  const [instagram, setInstagram] = useState('');

  // Step 3: Role & Hosting / Travel Details
  const [selectedRole, setSelectedRole] = useState<UserRole>('both');
  const canHost = selectedRole === 'both' || selectedRole === 'host';
  const [maxGuests, setMaxGuests] = useState('2');
  const [guestPreference, setGuestPreference] = useState<GuestPreference>('any');
  const [sleepingArrangement, setSleepingArrangement] = useState<SleepingArrangement>('private_with_bed');
  const [rulePet, setRulePet] = useState(false);
  const [ruleSmoking, setRuleSmoking] = useState(false);
  const [ruleCurfew, setRuleCurfew] = useState(false);
  const [customRule, setCustomRule] = useState('');
  const [targetDestination, setTargetDestination] = useState('');
  const [targetDates, setTargetDates] = useState('');
  const [targetGuests, setTargetGuests] = useState('1');

  // Step 4: Bio, Interests & Languages
  const [bioSnippet, setBioSnippet] = useState('');
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

  // Step 5: Agreements
  const [agreeId, setAgreeId] = useState(false);
  const [agreeEthic, setAgreeEthic] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Avatar handler
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

  // Real-time auto conversion for inputs
  const handleUsernameChange = (val: string) => {
    const clean = toEnglishDigits(val).toLowerCase().replace(/[^a-z0-9_.]/g, '');
    setUsername(clean);
    if (!clean.trim()) {
      setUsernameError('نام کاربری نمی‌تواند خالی باشد');
    } else if (clean.length < 3) {
      setUsernameError('نام کاربری باید حداقل ۳ کاراکتر باشد.');
    } else if (isUsernameTaken(clean)) {
      setUsernameError('این نام کاربری قبلاً توسط کاربر دیگری انتخاب شده است.');
    } else {
      setUsernameError(null);
    }
  };

  const handlePasswordChange = (val: string) => {
    const clean = toEnglishDigits(val);
    setPassword(clean);
  };

  const handlePhoneChange = (val: string) => {
    const clean = toEnglishDigits(val).replace(/[^0-9]/g, '');
    setPhone(clean);
  };

  const handleAgeChange = (val: string) => {
    const clean = toEnglishDigits(val).replace(/[^0-9]/g, '');
    setAge(clean);
  };

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

  // Step Validation & Navigation
  const goToNextStep = () => {
    // Step 1 Validation: Username, Password, Phone (Mandatory)
    if (currentStep === 1) {
      if (!username.trim()) {
        alert('لطفاً نام کاربری خود را وارد فرمایید.');
        return;
      }
      if (username.length < 3) {
        alert('نام کاربری باید حداقل ۳ کاراکتر انگلیسی باشد.');
        return;
      }
      if (usernameError || isUsernameTaken(username)) {
        alert('نام کاربری وارد شده تکراری است. لطفاً نام کاربری دیگری انتخاب فرمایید.');
        return;
      }
      if (!password.trim() || password.length < 4) {
        alert('رمز عبور باید حداقل ۴ کاراکتر باشد.');
        return;
      }
      if (!phone.trim() || phone.length < 10) {
        alert('شماره همراه الزامی است (حداقل ۱۰ رقم مانند 09123456789).');
        return;
      }
    }

    // Step 2 Validation: Full Name, City, Age
    if (currentStep === 2) {
      if (!fullName.trim()) {
        alert('لطفاً نام و نام خانوادگی خود را وارد فرمایید.');
        return;
      }
      if (!city.trim()) {
        alert('لطفاً شهر محل سکونت خود را وارد فرمایید.');
        return;
      }
      const parsed = parsePersianNumber(age);
      if (!parsed || parsed < 16 || parsed > 99) {
        alert('لطفاً سن معتبر خود را وارد فرمایید (حداقل ۱۶ سال).');
        return;
      }
    }

    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  // Final Registration Submission
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

    const res = await register({
      full_name: fullName.trim(),
      username: username.trim().toLowerCase(),
      password: password.trim(),
      phone: phone.trim(),
      instagram: instagram.trim() || undefined,
      city: city.trim(),
      age: parsedAge,
      job_education: jobEducation.trim() || undefined,
      avatar_url: avatarPreview || '/images/default-avatar.svg',
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
      agreed_to_provide_id: agreeId,
      agreed_to_respect_house_rules: agreeEthic,
      agreed_to_hamja_terms: agreeTerms,
    });

    setIsSubmitting(false);

    if (!res.success) {
      alert(res.error || 'خطا در ثبت‌نام. لطفاً دوباره تلاش فرمایید.');
      return;
    }

    setSuccessMessage(`خوش آمدید، ${fullName}! حساب کاربری شما با موفقیت ایجاد شد.`);

    setTimeout(() => {
      router.push('/profile');
    }, 1200);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmitting(true);

    const cleanId = toEnglishDigits(loginIdentifier).trim();
    const cleanPass = toEnglishDigits(loginPassword).trim();

    const res = await login(cleanId, cleanPass);
    setIsSubmitting(false);

    if (!res.success) {
      setLoginError(res.error || 'اطلاعات ورود نادرست است.');
    } else {
      setSuccessMessage('با موفقیت وارد شدید! در حال انتقال...');
      setTimeout(() => {
        router.push('/profile');
      }, 1000);
    }
  };

  const stepMeta = [
    { num: 1, title: 'قدم اول: ایجاد حساب کاربری', sub: 'نام کاربری، رمز عبور و شماره همراه' },
    { num: 2, title: 'قدم دوم: مشخصات فردی', sub: 'نام، سن، شهر و عکس پروفایل' },
    { num: 3, title: 'قدم سوم: نقش شما در همجا', sub: 'میزبان، مسافر یا میزبانی متقابل' },
    { num: 4, title: 'قدم چهارم: روحیات و علایق', sub: 'برای پیدا کردن دوستان هم‌سلیقه' },
    { num: 5, title: 'قدم پنجم: پیمان اعتماد و امنیت', sub: 'اصول و خط قرمز جامعه همجا' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F8F6]">
      <Navbar />

      <main className="flex-1 max-w-xl w-full mx-auto px-4 sm:px-6 py-8 text-right">
        {/* Toggle between Register and Login */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="bg-white p-1 rounded-2xl border border-[#EADFD5] shadow-xs flex items-center">
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'register'
                  ? 'bg-[#C25E38] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              ثبت‌نام گام‌به‌گام
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'login'
                  ? 'bg-[#C25E38] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              ورود به حساب
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: LOGIN FORM                                              */}
        {/* ============================================================== */}
        {activeTab === 'login' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADFD5] shadow-sm space-y-6 animate-fade-in">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 rounded-2xl bg-[#C25E38]/10 text-[#C25E38] flex items-center justify-center mx-auto">
                <LogIn className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-black text-gray-800">ورود به حساب کاربری همجا</h2>
              <p className="text-xs text-gray-500">
                نام کاربری یا شماره موبایل و رمز عبور خود را وارد کنید.
              </p>
            </div>

            {loginError && (
              <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  نام کاربری یا شماره موبایل
                </label>
                <input
                  type="text"
                  required
                  dir="ltr"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(toEnglishDigits(e.target.value))}
                  placeholder="sara_m یا 09123456789"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F4] border border-[#EADFD5] rounded-xl outline-none focus:border-[#C25E38] font-mono text-gray-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  رمز عبور
                </label>
                <input
                  type="password"
                  required
                  dir="ltr"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(toEnglishDigits(e.target.value))}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F4] border border-[#EADFD5] rounded-xl outline-none focus:border-[#C25E38] font-mono text-gray-800"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#C25E38] hover:bg-[#A84E2D] text-white font-bold rounded-2xl shadow transition-all text-xs"
              >
                {isSubmitting ? 'در حال بررسی...' : 'ورود به حساب کاربری'}
              </button>
            </form>

            <div className="pt-3 border-t border-gray-100 text-center text-xs text-gray-500">
              هنوز حساب کاربری ندارید؟{' '}
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className="text-[#C25E38] font-bold hover:underline"
              >
                همین الان ثبت‌نام کنید
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: STEP-BY-STEP REGISTRATION WIZARD                        */}
        {/* ============================================================== */}
        {activeTab === 'register' && (
          <div className="bg-white rounded-3xl border border-[#EADFD5] shadow-sm overflow-hidden animate-fade-in flex flex-col">
            
            {/* Header with Segmented Progress Bar */}
            <div className="bg-gradient-to-b from-[#FAF7F4] to-white p-5 border-b border-[#EADFD5]/60">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#C25E38] text-white flex items-center justify-center font-black text-xs shadow-xs">
                    هم
                  </div>
                  <div>
                    <h2 className="text-xs font-black text-gray-900">عضویت در جامعه همجا</h2>
                    <p className="text-[11px] text-gray-500">میزبانی صمیمانه و سفر دوستانه</p>
                  </div>
                </div>

                <div className="text-xs font-bold text-[#1E5647] bg-[#E8F3EE] px-2.5 py-0.5 rounded-full border border-[#1E5647]/15">
                  گام {toPersianDigits(currentStep)} از ۵
                </div>
              </div>

              {/* 5-Segment Progress Bar */}
              <div className="grid grid-cols-5 gap-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div
                    key={s}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      s <= currentStep ? 'bg-[#C25E38]' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>

              <div className="mt-2.5 flex items-center justify-between">
                <span className="text-xs font-black text-gray-800">
                  {stepMeta[currentStep - 1].title}
                </span>
                <span className="text-[11px] text-gray-500 font-medium">
                  {stepMeta[currentStep - 1].sub}
                </span>
              </div>
            </div>

            {/* Wizard Body Form */}
            <form onSubmit={handleRegisterSubmit} className="p-5 sm:p-6 space-y-5">
              
              {successMessage && (
                <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* -------------------------------------------------------- */}
              {/* STEP 1: CREDENTIALS & MANDATORY PHONE                    */}
              {/* -------------------------------------------------------- */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="p-3 bg-[#FAF7F4] rounded-2xl border border-[#EADFD5] text-right space-y-1">
                    <span className="text-xs font-black text-[#C25E38] block flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#C25E38]" />
                      <span>حساب کاربری خود را بسازید</span>
                    </span>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      با این نام کاربری و رمز عبور می‌توانید در هر زمان از هر مرورگر یا تلفن همراه وارد حساب خود شوید.
                    </p>
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1 flex items-center justify-between">
                      <span>نام کاربری (آیدی یکتا) <span className="text-red-500">*</span></span>
                      <span className="text-[10px] text-emerald-600 font-medium">اعداد خودکار انگلیسی می‌شوند</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        dir="ltr"
                        value={username}
                        onChange={(e) => handleUsernameChange(e.target.value)}
                        placeholder="sara_1405"
                        className={`w-full pl-3 pr-7 py-2.5 bg-[#FAF7F4] border rounded-xl text-xs font-mono font-bold text-gray-800 outline-none transition-all ${
                          usernameError
                            ? 'border-red-300 focus:border-red-500 bg-red-50/30'
                            : 'border-[#EADFD5] focus:border-[#C25E38] focus:bg-white'
                        }`}
                      />
                      <span className="absolute right-2.5 top-2.5 text-xs text-gray-400 font-bold">@</span>
                    </div>
                    {usernameError ? (
                      <span className="text-[10px] text-red-500 mt-1 block font-semibold">{usernameError}</span>
                    ) : (
                      <span className="text-[10px] text-gray-400 mt-1 block">فقط حروف انگلیسی، اعداد و خط تیره (_)</span>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1 flex items-center justify-between">
                      <span>رمز عبور <span className="text-red-500">*</span></span>
                      <span className="text-[10px] text-gray-400">حداقل ۴ کاراکتر</span>
                    </label>
                    <input
                      type="password"
                      required
                      dir="ltr"
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F4] border border-[#EADFD5] rounded-xl text-xs font-mono font-bold text-gray-800 outline-none focus:border-[#C25E38] focus:bg-white transition-all"
                    />
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      با کیبورد فارسی هم تایپ کنید، اعداد خودکار انگلیسی ذخیره می‌شوند.
                    </span>
                  </div>

                  {/* Mandatory Phone */}
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1 flex items-center justify-between">
                      <span>شماره همراه <span className="text-red-500">* (اجباری)</span></span>
                      <span className="text-[10px] text-[#C25E38] font-bold">جهت هماهنگی و احراز هویت</span>
                    </label>
                    <input
                      type="text"
                      required
                      dir="ltr"
                      value={phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="09123456789"
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F4] border border-[#EADFD5] rounded-xl text-xs font-mono font-bold text-gray-800 outline-none focus:border-[#C25E38] focus:bg-white transition-all"
                    />
                    <span className="text-[10px] text-gray-500 mt-1 block">
                      شماره تماس شما فقط پس از تأیید دوطرفه میزبانی، با میزبان/مهمان به اشتراک گذاشته می‌شود.
                    </span>
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------- */}
              {/* STEP 2: PERSONAL PROFILE                                 */}
              {/* -------------------------------------------------------- */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-fade-in">
                  
                  {/* Avatar Picker */}
                  <div className="flex items-center gap-4 bg-[#FBF4F0]/60 p-3 rounded-2xl border border-[#C25E38]/15">
                    <input
                      type="file"
                      ref={avatarInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />

                    <div
                      onClick={() => avatarInputRef.current?.click()}
                      className="relative w-14 h-14 rounded-2xl bg-[#FAF7F4] border-2 border-dashed border-[#C25E38]/40 flex items-center justify-center shadow-xs cursor-pointer hover:border-[#C25E38] transition-all overflow-hidden shrink-0 group"
                      title="انتخاب عکس پروفایل"
                    >
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="عکس پروفایل" className="w-full h-full object-cover" />
                      ) : (
                        <div className="relative w-full h-full flex items-center justify-center">
                          <img src="/images/default-avatar.svg" alt="آیکون پیش‌فرض پروفایل" className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="w-4 h-4 text-white drop-shadow" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-gray-800 block">عکس چهره شما (اختیاری)</span>
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        داشتن عکس واقعی اعتماد اعضای جامعه همجا را چند برابر می‌کند.
                      </p>
                    </div>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      نام و نام خانوادگی <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="مثال: سارا محمدی، علی رضایی..."
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F4] border border-[#EADFD5] rounded-xl text-xs font-medium text-gray-800 outline-none focus:border-[#C25E38] focus:bg-white transition-all"
                    />
                  </div>

                  {/* City & Age */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1">
                        شهر محل سکونت <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="مثال: شیراز، تهران..."
                        className="w-full px-3.5 py-2.5 bg-[#FAF7F4] border border-[#EADFD5] rounded-xl text-xs font-medium text-gray-800 outline-none focus:border-[#C25E38] focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1 flex items-center justify-between">
                        <span>سن <span className="text-red-500">*</span></span>
                        <span className="text-[10px] text-emerald-600">انگلیسی خودکار</span>
                      </label>
                      <input
                        type="text"
                        required
                        dir="ltr"
                        value={age}
                        onChange={(e) => handleAgeChange(e.target.value)}
                        placeholder="مثال: 28"
                        className="w-full px-3.5 py-2.5 bg-[#FAF7F4] border border-[#EADFD5] rounded-xl text-xs font-mono font-bold text-gray-800 outline-none focus:border-[#C25E38] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Job & Instagram */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1">
                        شغل یا تحصیلات
                      </label>
                      <input
                        type="text"
                        value={jobEducation}
                        onChange={(e) => setJobEducation(e.target.value)}
                        placeholder="مثال: معمار، دانشجو..."
                        className="w-full px-3.5 py-2.5 bg-[#FAF7F4] border border-[#EADFD5] rounded-xl text-xs text-gray-800 outline-none focus:border-[#C25E38] focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1">
                        آیدی اینستاگرام (اختیاری)
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        placeholder="sara_art"
                        className="w-full px-3.5 py-2.5 bg-[#FAF7F4] border border-[#EADFD5] rounded-xl text-xs font-mono text-gray-800 outline-none focus:border-[#C25E38] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                </div>
              )}

              {/* -------------------------------------------------------- */}
              {/* STEP 3: ROLE & HOSTING/TRAVEL PREFERENCES                */}
              {/* -------------------------------------------------------- */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    دوست دارید چطور در جامعه همجا مشارکت کنید؟ (همیشه بعداً می‌توانید این وضعیت را تغییر دهید):
                  </p>

                  {/* 3 Role Choice Cards */}
                  <div className="grid grid-cols-1 gap-2.5">
                    {/* Role 1: Both */}
                    <div
                      onClick={() => setSelectedRole('both')}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        selectedRole === 'both'
                          ? 'border-[#C25E38] bg-[#FBF4F0]'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#C25E38]/10 text-[#C25E38] flex items-center justify-center font-bold text-lg shrink-0">
                          <HeartHandshake className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-gray-900">میزبانی متقابل (پیشنهادی)</span>
                            <span className="text-[10px] font-bold text-white bg-[#C25E38] px-1.5 py-0.5 rounded-md">محبوب</span>
                          </div>
                          <span className="text-[11px] text-gray-600 block mt-0.5">هم در شهرم میزبان می‌شوم، هم در سفرهایم مهمان دوستان</span>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-white text-[10px] ${
                          selectedRole === 'both' ? 'border-[#C25E38] bg-[#C25E38]' : 'border-gray-300'
                        }`}
                      >
                        {selectedRole === 'both' && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>

                    {/* Role 2: Host Only */}
                    <div
                      onClick={() => setSelectedRole('host')}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        selectedRole === 'host'
                          ? 'border-[#1E5647] bg-[#E8F3EE]'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#1E5647]/10 text-[#1E5647] flex items-center justify-center font-bold text-lg shrink-0">
                          <Home className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-black text-gray-900 block">فقط میزبان هستم</span>
                          <span className="text-[11px] text-gray-600 block mt-0.5">خانه‌ام را به روی مسافران باز می‌کنم، فعلاً قصد سفر ندارم</span>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-white text-[10px] ${
                          selectedRole === 'host' ? 'border-[#1E5647] bg-[#1E5647]' : 'border-gray-300'
                        }`}
                      >
                        {selectedRole === 'host' && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>

                    {/* Role 3: Traveler Only */}
                    <div
                      onClick={() => setSelectedRole('traveler')}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        selectedRole === 'traveler'
                          ? 'border-amber-500 bg-amber-50/50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-lg shrink-0">
                          <Compass className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-black text-gray-900 block">فقط مسافر / مهمان هستم</span>
                          <span className="text-[11px] text-gray-600 block mt-0.5">امکان میزبانی ندارم، اما مشتاقم در سفرها مهمان شوم</span>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-white text-[10px] ${
                          selectedRole === 'traveler' ? 'border-amber-500 bg-amber-500' : 'border-gray-300'
                        }`}
                      >
                        {selectedRole === 'traveler' && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  </div>

                  {/* Host specific details */}
                  {canHost && (
                    <div className="bg-[#FAF7F4] p-4 rounded-2xl border border-[#EADFD5] space-y-3">
                      <span className="text-xs font-black text-gray-800 block border-b border-[#EADFD5] pb-2">
                        شرایط پذیرش در خانه شما:
                      </span>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">ظرفیت مهمان</label>
                          <select
                            value={maxGuests}
                            onChange={(e) => setMaxGuests(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-[#EADFD5] rounded-xl text-xs font-medium text-gray-800 outline-none"
                          >
                            <option value="1">۱ نفر</option>
                            <option value="2">۲ نفر</option>
                            <option value="3">۳ نفر</option>
                            <option value="4">۴ نفر یا بیشتر</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">نحوه استقرار</label>
                          <select
                            value={sleepingArrangement}
                            onChange={(e) => setSleepingArrangement(e.target.value as SleepingArrangement)}
                            className="w-full px-3 py-2 bg-white border border-[#EADFD5] rounded-xl text-xs font-medium text-gray-800 outline-none"
                          >
                            <option value="private_with_bed">اتاق اختصاصی با تخت</option>
                            <option value="private_without_bed">اتاق اختصاصی بدون تخت (سنتی)</option>
                            <option value="shared_space">فضای مشترک (سالن / کاناپه)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1.5">اولویت پذیرش مهمان</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: 'any', label: 'هرکسی' },
                            { id: 'females_only', label: 'فقط خانم‌ها' },
                            { id: 'couples_families', label: 'خانواده / زوج' },
                          ].map((pref) => (
                            <button
                              key={pref.id}
                              type="button"
                              onClick={() => setGuestPreference(pref.id as GuestPreference)}
                              className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all ${
                                guestPreference === pref.id
                                  ? 'bg-[#C25E38] text-white shadow-xs'
                                  : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
                              }`}
                            >
                              {pref.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* House Rules Checkboxes */}
                      <div className="pt-2 border-t border-[#EADFD5] space-y-2">
                        <span className="block text-[11px] font-bold text-gray-800">قوانین خاص خانه شما:</span>
                        <div className="space-y-1.5">
                          <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={rulePet}
                              onChange={(e) => setRulePet(e.target.checked)}
                              className="w-3.5 h-3.5 rounded text-[#C25E38] accent-[#C25E38]"
                            />
                            <span>ورود حیوان خانگی ممنوع است</span>
                          </label>
                          <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={ruleSmoking}
                              onChange={(e) => setRuleSmoking(e.target.checked)}
                              className="w-3.5 h-3.5 rounded text-[#C25E38] accent-[#C25E38]"
                            />
                            <span>استعمال دخانیات داخل خانه ممنوع است</span>
                          </label>
                          <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={ruleCurfew}
                              onChange={(e) => setRuleCurfew(e.target.checked)}
                              className="w-3.5 h-3.5 rounded text-[#C25E38] accent-[#C25E38]"
                            />
                            <span>محدوده ساعت رفت‌وآمد (ورود قبل از ۱۱ شب)</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Traveler specific details */}
                  {!canHost && (
                    <div className="bg-[#FAF7F4] p-4 rounded-2xl border border-[#EADFD5] space-y-3">
                      <span className="text-xs font-black text-gray-800 block border-b border-[#EADFD5] pb-2">
                        برنامه و مقصد سفر شما:
                      </span>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                          مقصد بعدی که قصد سفر دارید
                        </label>
                        <input
                          type="text"
                          value={targetDestination}
                          onChange={(e) => setTargetDestination(e.target.value)}
                          placeholder="مثال: یزد، قشم، رشت، چابهار..."
                          className="w-full px-3 py-2 bg-white border border-[#EADFD5] rounded-xl text-xs font-medium text-gray-800 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                          زمان احتمالی سفر
                        </label>
                        <input
                          type="text"
                          value={targetDates}
                          onChange={(e) => setTargetDates(e.target.value)}
                          placeholder="مثال: نوروز ۱۴۰۵ یا اواسط اردیبهشت"
                          className="w-full px-3 py-2 bg-white border border-[#EADFD5] rounded-xl text-xs font-medium text-gray-800 outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* -------------------------------------------------------- */}
              {/* STEP 4: BIO, INTERESTS & LANGUAGES                       */}
              {/* -------------------------------------------------------- */}
              {currentStep === 4 && (
                <div className="space-y-4 animate-fade-in">
                  
                  {/* Bio */}
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      درباره خودت یک جمله بنویس (Bio)
                    </label>
                    <textarea
                      rows={2}
                      value={bioSnippet}
                      onChange={(e) => setBioSnippet(e.target.value)}
                      placeholder="چند خط از علایق، کار یا حال و هوای خودت بنویس..."
                      className="w-full p-3 bg-[#FAF7F4] border border-[#EADFD5] rounded-xl text-xs text-gray-800 outline-none focus:border-[#C25E38] focus:bg-white transition-all leading-relaxed"
                    />
                  </div>

                  {/* Interests Pill Tags */}
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1.5 flex items-center justify-between">
                      <span>علاقه‌مندی‌ها (انتخاب سریع):</span>
                      <span className="text-[10px] text-gray-400">روی تگ‌ها کلیک کنید</span>
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_INTERESTS.map((tag) => {
                        const isSelected = selectedInterests.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => toggleInterest(tag)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              isSelected
                                ? 'bg-[#C25E38] text-white border border-[#C25E38] shadow-xs'
                                : 'bg-[#FAF7F4] text-gray-700 border border-[#EADFD5] hover:border-gray-300'
                            }`}
                          >
                            #{tag} {isSelected && '✓'}
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* Add Custom Interest */}
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="text"
                        value={customInterest}
                        onChange={(e) => setCustomInterest(e.target.value)}
                        placeholder="افزودن علاقه دیگر..."
                        className="flex-1 px-3 py-1.5 text-xs bg-[#FAF7F4] border border-[#EADFD5] rounded-xl outline-none"
                      />
                      <button
                        type="button"
                        onClick={addCustomInterest}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl"
                      >
                        افزودن
                      </button>
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1.5">
                      زبان‌های مسلط:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_LANGUAGES.map((lang) => {
                        const isSelected = selectedLanguages.includes(lang);
                        return (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => toggleLanguage(lang)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              isSelected
                                ? 'bg-[#1E5647] text-white border border-[#1E5647] shadow-xs'
                                : 'bg-[#FAF7F4] text-gray-700 border border-[#EADFD5] hover:border-gray-300'
                            }`}
                          >
                            {lang} {isSelected && '✓'}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}

              {/* -------------------------------------------------------- */}
              {/* STEP 5: TRUST & COMMUNITY COMMITMENTS                    */}
              {/* -------------------------------------------------------- */}
              {currentStep === 5 && (
                <div className="space-y-4 animate-fade-in">
                  
                  <div className="p-3.5 bg-[#E8F3EE] rounded-2xl border border-[#1E5647]/20 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1E5647] text-white flex items-center justify-center font-bold text-lg shrink-0">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-[#1E5647]">پیمان اعتماد جامعه همجا</h4>
                      <p className="text-[11px] text-[#1E5647]/80 leading-relaxed">
                        امنیت، شفافیت و مهمان‌نوازی اصیل ایرانی خط قرمز همجاست.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {/* Agreement 1 */}
                    <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-[#EADFD5] bg-[#FAF7F4] cursor-pointer hover:bg-white transition-all">
                      <input
                        type="checkbox"
                        checked={agreeId}
                        onChange={(e) => setAgreeId(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded text-[#C25E38] accent-[#C25E38]"
                      />
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-gray-900 block">احراز هویت واقعی</span>
                        <p className="text-[11px] text-gray-500 leading-relaxed">
                          متعهدم جهت ارسال درخواست و پذیرش مهمان، تصویر کارت ملی معتبر خود را در بخش احراز هویت بارگذاری کنم.
                        </p>
                      </div>
                    </label>

                    {/* Agreement 2 */}
                    <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-[#EADFD5] bg-[#FAF7F4] cursor-pointer hover:bg-white transition-all">
                      <input
                        type="checkbox"
                        checked={agreeEthic}
                        onChange={(e) => setAgreeEthic(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded text-[#C25E38] accent-[#C25E38]"
                      />
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-gray-900 block">احترام به قوانین خانه میزبان</span>
                        <p className="text-[11px] text-gray-500 leading-relaxed">
                          به حریم شخصی، ساعات رفت‌وآمد و مقررات خانه میزبان احترام کامل می‌گذارم.
                        </p>
                      </div>
                    </label>

                    {/* Agreement 3 */}
                    <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-[#EADFD5] bg-[#FAF7F4] cursor-pointer hover:bg-white transition-all">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded text-[#C25E38] accent-[#C25E38]"
                      />
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-gray-900 block">میزبانی دوستانه و بدون تبادل مالی</span>
                        <p className="text-[11px] text-gray-500 leading-relaxed">
                          همجا یک بستر مالی یا هتل نیست؛ هدف ما گسترش دوستی، اعتماد و میزبانی اصیل در سراسر ایران است.
                        </p>
                      </div>
                    </label>
                  </div>

                  {!agreeId || !agreeEthic || !agreeTerms ? (
                    <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-center">
                      <span className="text-[11px] text-amber-800 font-bold block">
                        جهت تکمیل عضویت، لطفاً هر ۳ گزینه بالا را تأیید فرمایید.
                      </span>
                    </div>
                  ) : null}

                </div>
              )}

              {/* Wizard Bottom Actions */}
              <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={goToPrevStep}
                    className="py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-2xl transition-all flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>مرحله قبلی</span>
                  </button>
                )}

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="flex-1 py-3 px-5 bg-[#C25E38] hover:bg-[#A84E2D] text-white text-xs font-bold rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <span>
                      {currentStep === 1
                        ? 'مرحله بعد: مشخصات فردی'
                        : currentStep === 2
                        ? 'مرحله بعد: نقش در همجا'
                        : currentStep === 3
                        ? 'مرحله بعد: علایق و روحیات'
                        : 'مرحله بعد: قوانین و امنیت'}
                    </span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || !agreeId || !agreeEthic || !agreeTerms}
                    className={`flex-1 py-3 px-5 font-bold rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 text-xs text-white ${
                      isSubmitting || !agreeId || !agreeEthic || !agreeTerms
                        ? 'bg-gray-400 cursor-not-allowed opacity-60'
                        : 'bg-[#1E5647] hover:bg-[#164337]'
                    }`}
                  >
                    {isSubmitting ? (
                      <span>در حال ذخیره و ایجاد حساب...</span>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>تکمیل عضویت در همجا 🎉</span>
                      </>
                    )}
                  </button>
                )}
              </div>

            </form>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
