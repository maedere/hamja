'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  ShieldCheck,
  UserCheck,
  HeartHandshake,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Sparkles,
  MapPin,
  Calendar,
  Compass,
  Users,
  Map,
  X,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MemberCard from '@/components/members/MemberCard';
import VerificationModal from '@/components/modals/VerificationModal';
import LatestHostingsStories from '@/components/home/LatestHostingsStories';
import { useAuth } from '@/lib/auth-context';
import { toPersianDigits } from '@/lib/persian-utils';

export default function HomePage() {
  const router = useRouter();
  const { usersList, refreshUsers } = useAuth();
  const [searchCity, setSearchCity] = useState('');
  const [hostingFilter, setHostingFilter] = useState<'all' | 'mutual' | 'host' | 'traveler'>('all');
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const queryParams = new URLSearchParams();
    if (searchCity.trim()) queryParams.set('city', searchCity.trim());
    if (hostingFilter !== 'all') queryParams.set('type', hostingFilter);
    const queryString = queryParams.toString();
    router.push(`/explore${queryString ? `?${queryString}` : ''}`);
  };

  const handleQuickCitySelect = (city: string) => {
    setSearchCity(city);
    router.push(`/explore?city=${encodeURIComponent(city)}`);
  };

  const quickCities = ['تهران', 'اصفهان', 'شیراز', 'یزد', 'رشت', 'مشهد', 'تبریز', 'بوشهر'];

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F8F6]">
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero Section matching Page 3 of PDF */}
        <section className="relative pt-10 pb-16 lg:pt-16 lg:pb-24 overflow-hidden">
          {/* Subtle warm ambient background glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C25E38]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#1E5647]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Text content */}
              <div className="lg:col-span-7 space-y-6 text-right">
                {/* Pill Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FBF4F0] border border-[#C25E38]/20 text-[#C25E38] text-xs font-bold shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>غریبه نیستیم؛ هنوز آشنا نشده‌ایم.</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1F2937] leading-[1.3] tracking-tight">
                  سفر به شهرها، ماندن در جمع دوستان؛{' '}
                  <span className="text-[#C25E38] underline decoration-[#C25E38]/30 underline-offset-8">
                    میزبانی دوطرفه
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed max-w-xl font-normal">
                  جامعه‌ای امن از میزبانان و مسافران محلی. در همجا، مهمان دوستانت می‌شوی و روزی درِ خانه‌ات را به روی آن‌ها باز می‌کنی؛ بدون تبادل مالی و بر پایه اعتماد و مهمان‌نوازی اصیل ایرانی.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={() => setShowVerifyModal(true)}
                    className="px-6 py-3.5 bg-[#C25E38] hover:bg-[#A84E2D] text-white font-bold rounded-2xl shadow-md transition-all hover:shadow-xl hover:scale-102 active:scale-98 flex items-center gap-2 text-sm sm:text-base"
                  >
                    <span>عضویت رایگان در همجا</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <Link
                    href="/explore"
                    className="px-6 py-3.5 bg-white hover:bg-gray-50 text-[#1F2937] font-bold rounded-2xl border border-[#EADFD5] shadow-xs transition-all hover:shadow text-sm sm:text-base flex items-center gap-2"
                  >
                    <Compass className="w-4 h-4 text-[#C25E38]" />
                    <span>کاوش اعضا و میزبانان</span>
                  </Link>
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-3 text-xs text-[#6B7280]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#1E5647]" />
                    عضویت کاملاً رایگان
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#1E5647]" />
                    احراز هویت سلفی و کدملی
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#1E5647]" />
                    میزبانی با اعتماد دوطرفه
                  </span>
                </div>
              </div>

              {/* Hero Image Card */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] sm:aspect-[4/5] max-w-md mx-auto group">
                  <img
                    src="/images/hero-hosting.jpg"
                    alt="یک خانه، شروع یک دوستی ماندگار"
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex items-end p-6">
                    <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl text-right w-full border border-white/50 shadow-xl">
                      <p className="text-xs font-black text-[#1F2937] flex items-center gap-1.5">
                        <HeartHandshake className="w-4 h-4 text-[#C25E38]" />
                        یک خانه امن، شروع یک دوستی ماندگار
                      </p>
                      <p className="text-[11px] text-[#6B7280] mt-1 font-medium">
                        میزبانی صمیمانه، چای دورهمی و آشنایی با دوستان جدید در سراسر ایران
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Search Card matching modern community UX */}
            <div className="mt-12 bg-white rounded-3xl p-5 sm:p-6 shadow-xl border border-[#EADFD5] max-w-4xl mx-auto space-y-4">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-3">
                {/* Search Input */}
                <div className="flex-1 w-full flex items-center gap-3 px-4 py-3.5 bg-[#F9F8F6] rounded-2xl border border-gray-200 focus-within:border-[#C25E38] focus-within:bg-white transition-all shadow-xs">
                  <MapPin className="w-5 h-5 text-[#C25E38] shrink-0" />
                  <div className="flex-1 text-right">
                    <label className="block text-[10px] text-gray-400 font-bold">دوست داری کجا مهمان باشی یا میزبان شوی؟</label>
                    <input
                      type="text"
                      placeholder="نام شهر (مثال: اصفهان، شیراز، تبریز، رشت...)"
                      value={searchCity}
                      onChange={(e) => setSearchCity(e.target.value)}
                      className="w-full bg-transparent text-sm font-bold text-gray-800 placeholder-gray-400 outline-none mt-0.5"
                    />
                  </div>
                  {searchCity && (
                    <button
                      type="button"
                      onClick={() => setSearchCity('')}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1 bg-[#F9F8F6] p-1.5 rounded-2xl border border-gray-200 shrink-0 w-full md:w-auto justify-center">
                  <button
                    type="button"
                    onClick={() => setHostingFilter('all')}
                    className={`px-3 py-2 text-xs font-bold rounded-xl transition-all ${
                      hostingFilter === 'all'
                        ? 'bg-white text-[#C25E38] shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    همه
                  </button>
                  <button
                    type="button"
                    onClick={() => setHostingFilter('mutual')}
                    className={`px-3 py-2 text-xs font-bold rounded-xl transition-all ${
                      hostingFilter === 'mutual'
                        ? 'bg-white text-[#C25E38] shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    میزبانی متقابل
                  </button>
                  <button
                    type="button"
                    onClick={() => setHostingFilter('host')}
                    className={`px-3 py-2 text-xs font-bold rounded-xl transition-all ${
                      hostingFilter === 'host'
                        ? 'bg-white text-[#C25E38] shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    فقط میزبان
                  </button>
                  <button
                    type="button"
                    onClick={() => setHostingFilter('traveler')}
                    className={`px-3 py-2 text-xs font-bold rounded-xl transition-all ${
                      hostingFilter === 'traveler'
                        ? 'bg-white text-sky-700 shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    مسافران
                  </button>
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="w-full md:w-auto px-7 py-3.5 bg-[#C25E38] hover:bg-[#A84E2D] text-white font-bold rounded-2xl shadow transition-all hover:shadow-md flex items-center justify-center gap-2 shrink-0 text-sm active:scale-98"
                >
                  <Search className="w-4 h-4" />
                  <span>جستجو</span>
                </button>
              </form>

              {/* Quick City Suggestions Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-gray-100 pb-1 text-xs text-gray-500">
                <span className="shrink-0 font-bold flex items-center gap-1 text-gray-600">
                  <MapPin className="w-3.5 h-3.5 text-[#C25E38]" />
                  شهرهای پرطرفدار:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {quickCities.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => handleQuickCitySelect(city)}
                      className="px-3 py-1 rounded-xl bg-gray-50 hover:bg-[#FBF4F0] hover:text-[#C25E38] text-gray-700 font-semibold border border-gray-200 transition-colors shrink-0"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Three Steps Section matching Page 3 */}
        <section id="mutual" className="py-20 bg-white border-y border-[#EADFD5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBF4F0] text-[#C25E38] text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ساده، انسانی، دوطرفه</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1F2937] mb-4">
              سه قدم تا یک آشنایی تازه
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto mb-14">
              در همجا همه چیز بر پایه شفافیت، احترام و مهمان‌نوازی استوار است.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-[#F9F8F6] rounded-3xl p-7 border border-[#EADFD5] text-right space-y-3 relative group hover:border-[#C25E38]/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-[#C25E38]/10 text-[#C25E38] flex items-center justify-center font-black text-xl shadow-xs group-hover:bg-[#C25E38] group-hover:text-white transition-colors">
                  ۱
                </div>
                <h3 className="text-lg font-black text-[#1F2937]">
                  ثبت‌نام و احراز هویت با سلفی و کدملی
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                  یک پروفایل واقعی بسازید؛ اعتماد در همین‌جا شروع می‌شود تا با خیالی آسوده و اطمینان کامل میزبان یا مهمان شوید.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-[#F9F8F6] rounded-3xl p-7 border border-[#EADFD5] text-right space-y-3 relative group hover:border-[#1E5647]/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-[#1E5647]/10 text-[#1E5647] flex items-center justify-center font-black text-xl shadow-xs group-hover:bg-[#1E5647] group-hover:text-white transition-colors">
                  ۲
                </div>
                <h3 className="text-lg font-black text-[#1F2937]">
                  تعیین وضعیت (میزبان، مسافر یا متقابل)
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                  مشخص کنید چطور می‌خواهید در این جمع همراه ما باشید. شرایط خانه‌تان یا برنامه‌های سفر و مقاصد پیش‌رو را بنویسید.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-[#F9F8F6] rounded-3xl p-7 border border-[#EADFD5] text-right space-y-3 relative group hover:border-[#C25E38]/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-[#C25E38]/10 text-[#C25E38] flex items-center justify-center font-black text-xl shadow-xs group-hover:bg-[#C25E38] group-hover:text-white transition-colors">
                  ۳
                </div>
                <h3 className="text-lg font-black text-[#1F2937]">
                  پیوند دوطرفه و میزبانی رایگان
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                  آشنا شوید، هماهنگ کنید و درِ خانه را به روی یک دوست باز کنید و در سفر بعدی در شهر او مهمانش شوید.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Featured Members Section matching Page 3 */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
              <div className="text-right">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBF4F0] text-[#C25E38] text-xs font-bold mb-2">
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span>آدم‌ها، بهترین بخش سفرند</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#1F2937]">
                  شاید دوست بعدی‌ات همین‌جاست
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  با میزبانان و مسافران محلی آشنا شو؛ برای دیدن پروفایل کامل و پیام‌رسانی، عضو همجا شو.
                </p>
              </div>
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-[#EADFD5] rounded-2xl text-xs font-bold text-[#C25E38] hover:bg-[#FBF4F0] transition-colors shadow-xs"
              >
                <span>مشاهده همه اعضا</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>

            {/* Grid of 4 Members or empty state */}
            {usersList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {usersList.slice(0, 4).map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            ) : (
              <div className="p-8 sm:p-14 text-center bg-white rounded-3xl border border-[#EADFD5] space-y-4 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-[#C25E38]/10 text-[#C25E38] flex items-center justify-center mx-auto">
                  <UserCheck className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-black text-gray-800">
                    هنوز کاربری ثبت‌نام نکرده است
                  </h3>
                  <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                    با عضویت در همجا، اولین میزبان یا مسافر باشید و پروفایل خود را ثبت کنید تا جامعه همجا گسترش یابد.
                  </p>
                </div>
                <div>
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#C25E38] hover:bg-[#A84E2D] text-white text-xs font-bold rounded-2xl shadow transition-colors"
                  >
                    عضویت و ثبت اولین پروفایل
                  </Link>
                </div>
              </div>
            )}

            {/* Privacy Note banner matching Page 3 */}
            <div className="mt-8 p-4 rounded-2xl bg-[#F0EDE8] border border-[#EADFD5] text-center text-xs text-gray-600 flex items-center justify-center gap-2 font-medium">
              <Lock className="w-4 h-4 text-gray-500 shrink-0" />
              <span>
                برای حفظ حریم خصوصی اعضا، پروفایل کامل، نشانی خانه و پیام‌رسان پس از عضویت در همجا در دسترس قرار می‌گیرد.
              </span>
            </div>
          </div>
        </section>

        {/* 4. Interactive Map Preview Banner */}
        <section className="py-14 bg-gradient-to-r from-[#1E5647] via-[#164236] to-[#1E5647] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3 text-right">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold border border-white/20">
                  <Map className="w-3.5 h-3.5 text-amber-300" />
                  <span>نقشه زنده میزبانان ایران</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black">
                  در کدام شهرها میزبان داریم؟
                </h3>
                <p className="text-xs sm:text-sm text-white/80 max-w-xl leading-relaxed">
                  از تبریز و رشت تا یزد، اصفهان، شیراز و بوشهر؛ با نقشه تعاملی همجا موقعیت میزبانان را جستجو کنید و مقصد سفر بعدیتان را بیابید.
                </p>
              </div>

              <Link
                href="/explore"
                className="px-6 py-3.5 bg-white text-[#1E5647] hover:bg-gray-100 font-extrabold rounded-2xl shadow-lg transition-all hover:scale-102 flex items-center gap-2 shrink-0 text-sm"
              >
                <span>مشاهده نقشه ایران</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 5. Trust & Safety Section matching Page 3 */}
        <section id="trust" className="py-20 bg-white border-y border-[#EADFD5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF5F1] text-[#1E5647] text-xs font-bold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>اعتماد، پیش از اولین سلام</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1F2937] mb-4">
              با خیال راحت درِ خانه را باز کن
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto mb-14">
              امنیت اولویت نخست ماست. مکانیزم‌های چندلایه همجا برای تضمین آسودگی خاطر شما طراحی شده‌اند.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
              <div className="bg-[#F9F8F6] p-7 rounded-3xl border border-[#EADFD5] space-y-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-[#1E5647]/10 text-[#1E5647] flex items-center justify-center shadow-xs">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-[#1F2937]">ثبت کد ملی و مدارک شناسایی</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                  کد ملی و تصویر مدارک هویتی اعضا در سامانه ثبت و جهت امنیت جامعه و پیگیری‌های لازم نزد همجا محفوظ می‌ماند.
                </p>
              </div>

              <div className="bg-[#F9F8F6] p-7 rounded-3xl border border-[#EADFD5] space-y-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-[#C25E38]/10 text-[#C25E38] flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-[#1F2937]">احراز هویت سلفی زنده ضد جعل</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                  یک سلفی زنده برای اطمینان از حضور فرد واقعی پشت هر پروفایل و تطبیق با تصویر کارت ملی.
                </p>
              </div>

              <div className="bg-[#F9F8F6] p-7 rounded-3xl border border-[#EADFD5] space-y-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-[#1E5647]/10 text-[#1E5647] flex items-center justify-center shadow-xs">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-[#1F2937]">امتیاز و بازخورد دوطرفه</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                  بعد از هر میزبانی، تجربه‌تان را برای هم و برای جامعه بنویسید تا زنجیره اعتماد روز به روز محکم‌تر شود.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Real Stories & Latest 5 Hostings Showcase */}
        <LatestHostingsStories />

        {/* 7. Call to Action Banner matching Page 3 */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#C25E38] via-[#B8532F] to-[#A84E2D] rounded-3xl p-8 sm:p-14 text-white text-center sm:text-right flex flex-col sm:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
            <div className="space-y-3 relative z-10">
              <h3 className="text-2xl sm:text-3xl font-black">
                خانه تو، مقصد بعدی یک دوست؛ آماده‌ای؟
              </h3>
              <p className="text-xs sm:text-sm text-white/90 max-w-lg leading-relaxed font-medium">
                به جمعی بپیوند که در آن، سفر با آشنایی شروع می‌شود و با دوستی ادامه پیدا می‌کند.
              </p>
            </div>
            <button
              onClick={() => setShowVerifyModal(true)}
              className="px-8 py-4 bg-white text-[#C25E38] hover:bg-gray-50 font-black rounded-2xl shadow-xl transition-all shrink-0 text-sm sm:text-base hover:scale-102 active:scale-98 relative z-10"
            >
              شروع عضویت رایگان ←
            </button>
          </div>
        </section>
      </main>

      <Footer />

      {/* Identity Verification Modal */}
      <VerificationModal
        isOpen={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
      />
    </div>
  );
}
