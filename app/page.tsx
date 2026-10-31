'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MemberCard from '@/components/members/MemberCard';
import VerificationModal from '@/components/modals/VerificationModal';
import { useAuth } from '@/lib/auth-context';

export default function HomePage() {
  const router = useRouter();
  const { usersList } = useAuth();
  const [searchCity, setSearchCity] = useState('');
  const [hostingFilter, setHostingFilter] = useState<'all' | 'mutual' | 'host'>('all');
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity.trim()) {
      router.push(`/explore?city=${encodeURIComponent(searchCity.trim())}`);
    } else {
      router.push('/explore');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F8F6]">
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero Section matching Page 3 of PDF */}
        <section className="relative pt-10 pb-16 lg:pt-16 lg:pb-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Text content */}
              <div className="lg:col-span-7 space-y-6 text-right">
                {/* Pill Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FBF4F0] border border-[#C25E38]/20 text-[#C25E38] text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>غریبه نیستیم؛ هنوز آشنا نشده‌ایم.</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1F2937] leading-[1.3] tracking-tight">
                  سفر به شهرها، ماندن در جمع دوستان؛{' '}
                  <span className="text-[#C25E38]">میزبانی دوطرفه</span>
                </h1>

                <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed max-w-xl">
                  جامعه‌ای امن از میزبانان و مسافران محلی. در همجا، مهمان دوستانت می‌شوی و روزی درِ خانه‌ات را به روی آن‌ها باز می‌کنی؛ بدون تبادل مالی و بر پایه اعتماد و مهمان‌نوازی اصیل ایرانی.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={() => setShowVerifyModal(true)}
                    className="px-6 py-3.5 bg-[#C25E38] hover:bg-[#A84E2D] text-white font-bold rounded-2xl shadow-md transition-all hover:shadow-lg flex items-center gap-2 text-sm sm:text-base"
                  >
                    <span>عضویت در همجا</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <Link
                    href="/explore"
                    className="px-6 py-3.5 bg-white hover:bg-gray-50 text-[#1F2937] font-bold rounded-2xl border border-[#EADFD5] shadow-sm transition-all text-sm sm:text-base"
                  >
                    کاوش اعضا و میزبانان
                  </Link>
                </div>

                <div className="flex items-center gap-6 pt-3 text-xs text-[#6B7280]">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#1E5647]" />
                    عضویت رایگان
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#1E5647]" />
                    میزبانی با اعتماد دوطرفه
                  </span>
                </div>
              </div>

              {/* Hero Image Card */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] sm:aspect-[1/1] max-w-md mx-auto">
                  <img
                    src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80"
                    alt="یک خانه، شروع یک دوستی"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6">
                    <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl text-right w-full border border-white/50 shadow-lg">
                      <p className="text-xs font-bold text-[#1F2937] flex items-center gap-1.5">
                        <HeartHandshake className="w-4 h-4 text-[#C25E38]" />
                        یک خانه امن، شروع یک دوستی ماندگار
                      </p>
                      <p className="text-[11px] text-[#6B7280] mt-0.5">میزبانی صمیمانه و اصیل در هر گوشه از ایران</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Search Bar matching Page 3 */}
            <div className="mt-12 bg-white rounded-3xl p-4 sm:p-5 shadow-lg border border-[#EADFD5] max-w-4xl mx-auto">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-4">
                {/* Search Input */}
                <div className="flex-1 w-full flex items-center gap-3 px-4 py-3 bg-[#F9F8F6] rounded-2xl border border-gray-200 focus-within:border-[#C25E38] transition-colors">
                  <MapPin className="w-5 h-5 text-[#C25E38] shrink-0" />
                  <div className="flex-1 text-right">
                    <label className="block text-[10px] text-gray-500 font-medium">دوست داری کجا مهمان باشی؟</label>
                    <input
                      type="text"
                      placeholder="مقصد (مثال: اصفهان، تبریز، رشت، شیراز...)"
                      value={searchCity}
                      onChange={(e) => setSearchCity(e.target.value)}
                      className="w-full bg-transparent text-sm font-semibold text-gray-800 placeholder-gray-400 outline-none"
                    />
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 bg-[#F9F8F6] p-1.5 rounded-2xl border border-gray-200 shrink-0 w-full md:w-auto justify-center">
                  <button
                    type="button"
                    onClick={() => setHostingFilter('all')}
                    className={`px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
                      hostingFilter === 'all'
                        ? 'bg-white text-[#C25E38] shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    همه
                  </button>
                  <button
                    type="button"
                    onClick={() => setHostingFilter('mutual')}
                    className={`px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
                      hostingFilter === 'mutual'
                        ? 'bg-white text-[#C25E38] shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    میزبانی متقابل
                  </button>
                  <button
                    type="button"
                    onClick={() => setHostingFilter('host')}
                    className={`px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
                      hostingFilter === 'host'
                        ? 'bg-white text-[#C25E38] shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    فقط میزبان
                  </button>
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="w-full md:w-auto px-7 py-3.5 bg-[#C25E38] hover:bg-[#A84E2D] text-white font-bold rounded-2xl shadow transition-all flex items-center justify-center gap-2 shrink-0 text-sm"
                >
                  <Search className="w-4 h-4" />
                  <span>جستجو</span>
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* 2. Three Steps Section matching Page 3 */}
        <section className="py-16 bg-white border-y border-[#EADFD5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs text-[#C25E38] font-bold tracking-wider uppercase mb-1">
              ساده، انسانی، دوطرفه
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1F2937] mb-12">
              سه قدم تا یک آشنایی تازه
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-[#F9F8F6] rounded-3xl p-6 sm:p-8 border border-[#EADFD5] text-right space-y-3 relative group hover:border-[#C25E38] transition-all">
                <div className="w-12 h-12 rounded-2xl bg-[#C25E38]/10 text-[#C25E38] flex items-center justify-center font-black text-lg">
                  ۱
                </div>
                <h3 className="text-lg font-bold text-[#1F2937]">
                  ۱: ثبت‌نام و احراز هویت با سلفی و کدملی
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  یک پروفایل واقعی بسازید؛ اعتماد در همین‌جا شروع می‌شود تا با خیالی آسوده میزبان یا مهمان شوید.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-[#F9F8F6] rounded-3xl p-6 sm:p-8 border border-[#EADFD5] text-right space-y-3 relative group hover:border-[#C25E38] transition-all">
                <div className="w-12 h-12 rounded-2xl bg-[#1E5647]/10 text-[#1E5647] flex items-center justify-center font-black text-lg">
                  ۲
                </div>
                <h3 className="text-lg font-bold text-[#1F2937]">
                  ۲: تعیین وضعیت (میزبان، مسافر، متقابل)
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  بگویید چطور می‌خواهید در این جمع همراه ما باشید. شرایط خانه‌تان یا برنامه‌های سفرتان را بنویسید.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-[#F9F8F6] rounded-3xl p-6 sm:p-8 border border-[#EADFD5] text-right space-y-3 relative group hover:border-[#C25E38] transition-all">
                <div className="w-12 h-12 rounded-2xl bg-[#C25E38]/10 text-[#C25E38] flex items-center justify-center font-black text-lg">
                  ۳
                </div>
                <h3 className="text-lg font-bold text-[#1F2937]">
                  ۳: پیوند دوطرفه و میزبانی رایگان
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  آشنا شوید، هماهنگ کنید و درِ خانه را به روی یک دوست باز کنید و در سفر بعدی مهمان او شوید.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Featured Members Section matching Page 3 */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
              <div className="text-right">
                <p className="text-xs text-[#C25E38] font-bold">آدم‌ها، بهترین بخش سفرند</p>
                <h2 className="text-2xl sm:text-3xl font-black text-[#1F2937] mt-1">
                  شاید دوست بعدی‌ات همین‌جاست
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  با میزبانان محلی آشنا شو؛ برای دیدن پروفایل و شروع گفتگو، عضو همجا شو.
                </p>
              </div>
              <Link
                href="/explore"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#C25E38] hover:text-[#A84E2D]"
              >
                <span>همه اعضا</span>
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
              <div className="p-8 sm:p-12 text-center bg-white rounded-3xl border border-[#EADFD5] space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#C25E38]/10 text-[#C25E38] flex items-center justify-center mx-auto">
                  <UserCheck className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-gray-800">
                    هنوز کاربری ثبت‌نام نکرده است
                  </h3>
                  <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                    تمام داده‌های تستی پاک شدند. با عضویت در همجا، اولین میزبان یا مسافر باشید و پروفایل خود را ثبت کنید.
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
            <div className="mt-8 p-4 rounded-2xl bg-[#F0EDE8] border border-[#EADFD5] text-center text-xs text-gray-600 flex items-center justify-center gap-2">
              <Lock className="w-4 h-4 text-gray-500" />
              <span>
                برای حفظ حریم خصوصی اعضا، پروفایل کامل و پیام‌رسان پس از عضویت در دسترس است.
              </span>
            </div>
          </div>
        </section>

        {/* 4. Trust & Safety Section matching Page 3 */}
        <section id="trust" className="py-16 bg-white border-y border-[#EADFD5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs text-[#1E5647] font-bold">اعتماد، پیش از اولین سلام</p>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1F2937] mt-1 mb-12">
              با خیال راحت درِ خانه را باز کن
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
              <div className="bg-[#F9F8F6] p-6 rounded-3xl border border-[#EADFD5] space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#1E5647]/10 text-[#1E5647] flex items-center justify-center">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#1F2937]">استعلام رسمی کد ملی</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  هویت اعضا پیش از آغاز تعاملات بررسی می‌شود تا آشنایی‌ها با خیال آسوده‌تری آغاز شوند.
                </p>
              </div>

              <div className="bg-[#F9F8F6] p-6 rounded-3xl border border-[#EADFD5] space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#C25E38]/10 text-[#C25E38] flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#1F2937]">احراز هویت سلفی زنده ضد جعل</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  یک سلفی زنده برای اطمینان از حضور فرد واقعی پشت هر پروفایل و تطبیق با تصویر شناسایی.
                </p>
              </div>

              <div className="bg-[#F9F8F6] p-6 rounded-3xl border border-[#EADFD5] space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#1E5647]/10 text-[#1E5647] flex items-center justify-center">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#1F2937]">امتیاز و بازخورد دوطرفه</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  بعد از هر میزبانی، تجربه‌تان را برای هم و برای جامعه بنویسید تا زنجیره اعتماد محکم‌تر شود.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Real Story Spotlight matching Page 3 (Ali & Behnam) */}
        <section id="stories" className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#FBF4F0] rounded-3xl p-8 sm:p-10 border border-[#C25E38]/20 flex flex-col md:flex-row items-center gap-8 text-right">
              <div className="w-full md:w-1/2 flex items-center justify-center">
                <div className="relative flex items-center">
                  <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white shadow-lg -rotate-6">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
                      alt="علی از تبریز"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded-full">
                      علی، تبریز
                    </div>
                  </div>
                  <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white shadow-lg rotate-6 -mr-8 z-10">
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
                      alt="بهنام از بوشهر"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded-full">
                      بهنام، بوشهر
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-1/2 space-y-3">
                <p className="text-xs text-[#C25E38] font-bold">یک میزبانی، دو مقصد، یک دوستی</p>
                <h3 className="text-xl sm:text-2xl font-black text-gray-800 leading-snug">
                  علی از تبریز میزبان بهنام از بوشهر شد؛ چند ماه بعد در بوشهر مهمان او بود!
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  &ldquo;وقتی در تبریز بودیم، از موسیقی جنوب گفتیم. شش ماه بعد در بوشهر کنار آتش لب ساحل با هم خیام‌خوانی کردیم. همجا برای ما فراتر از یک سقف بود؛ شروع یک برادری.&rdquo;
                </p>
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C25E38] hover:text-[#A84E2D] pt-2"
                >
                  <span>داستان‌های همجا را بخوان</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Call to Action Banner matching Page 3 */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#C25E38] rounded-3xl p-8 sm:p-12 text-white text-center sm:text-right flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black">
                خانه تو، مقصد بعدی یک دوست؛ آماده‌ای؟
              </h3>
              <p className="text-xs sm:text-sm text-white/90 max-w-lg leading-relaxed">
                به جمعی بپیوند که در آن، سفر با آشنایی شروع می‌شود و با دوستی ادامه پیدا می‌کند.
              </p>
            </div>
            <button
              onClick={() => setShowVerifyModal(true)}
              className="px-6 py-3.5 bg-white text-[#C25E38] hover:bg-gray-50 font-bold rounded-2xl shadow-md transition-all shrink-0 text-sm"
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
