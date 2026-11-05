'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  Filter,
  ShieldCheck,
  MapPin,
  Sparkles,
  ArrowLeft,
  X,
  SlidersHorizontal,
  Compass,
  HeartHandshake,
  Users,
  Map as MapIcon,
  RotateCcw,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MemberCard from '@/components/members/MemberCard';
import IranMap from '@/components/explore/IranMap';
import { useAuth } from '@/lib/auth-context';
import { toPersianDigits } from '@/lib/persian-utils';

function ExploreContent() {
  const { usersList, refreshUsers } = useAuth();
  const searchParams = useSearchParams();
  const initialCity = searchParams.get('city') || '';
  const initialType = searchParams.get('type') as 'all' | 'mutual' | 'host' | 'traveler' || 'all';

  useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

  const [searchTerm, setSearchTerm] = useState(initialCity);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [hostingType, setHostingType] = useState<'all' | 'mutual' | 'host' | 'traveler'>(initialType);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState<string>('all');
  const [mobileTab, setMobileTab] = useState<'list' | 'map'>('list');

  const interestsList = ['عکاسی', 'کتاب', 'طبیعت‌گردی', 'کوهنوردی', 'موسیقی', 'آشپزی', 'هنر', 'معماری'];

  // Counts for tabs
  const typeCounts = useMemo(() => {
    let mutual = 0;
    let hosts = 0;
    let travelers = 0;
    let verified = 0;

    usersList.forEach((u) => {
      const isTraveler = u.can_host === false || u.role === 'traveler';
      if (isTraveler) {
        travelers++;
      } else {
        if (u.role === 'both') mutual++;
        hosts++;
      }
      if (u.is_identity_verified) verified++;
    });

    return {
      all: usersList.length,
      mutual,
      hosts,
      travelers,
      verified,
    };
  }, [usersList]);

  // Filter members based on criteria
  const filteredMembers = useMemo(() => {
    return usersList.filter((member) => {
      // City or name or target destination search
      const matchesSearch =
        !searchTerm ||
        member.city?.includes(searchTerm) ||
        member.full_name?.includes(searchTerm) ||
        (member.target_destination?.includes(searchTerm) ?? false) ||
        (member.about_me?.includes(searchTerm) ?? false);

      // Selected city from Map or filter (matches origin or traveler destination)
      const matchesCity =
        !selectedCity ||
        member.city === selectedCity ||
        member.target_destination === selectedCity;

      // Verified only
      const matchesVerified = !verifiedOnly || member.is_identity_verified;

      // Hosting type
      const isTravelerMember = member.can_host === false || member.role === 'traveler';
      const matchesType =
        hostingType === 'all' ||
        (hostingType === 'mutual' && member.role === 'both' && !isTravelerMember) ||
        (hostingType === 'host' && (member.role === 'host' || member.role === 'both') && !isTravelerMember) ||
        (hostingType === 'traveler' && isTravelerMember);

      // Interest
      const matchesInterest =
        selectedInterest === 'all' ||
        (member.interests?.some((tag) => tag.includes(selectedInterest)) ?? false);

      return matchesSearch && matchesCity && matchesVerified && matchesType && matchesInterest;
    });
  }, [usersList, searchTerm, selectedCity, verifiedOnly, hostingType, selectedInterest]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCity('');
    setHostingType('all');
    setVerifiedOnly(false);
    setSelectedInterest('all');
  };

  const hasActiveFilters =
    Boolean(searchTerm) ||
    Boolean(selectedCity) ||
    hostingType !== 'all' ||
    verifiedOnly ||
    selectedInterest !== 'all';

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F8F6]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Page Title & Intro matching Page 4 */}
        <div className="text-right mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBF4F0] text-[#C25E38] text-xs font-bold mb-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>جامعه میزبانان و مسافران همجا</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1F2937]">
            دوست بعدی‌ات را در شهر مقصد پیدا کن
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl font-normal">
            با آدم‌های هم‌علاقه و معتبر آشنا شو؛ موقعیت آن‌ها را روی نقشه ببین و پیش از سفر برای میزبانی متقابل هماهنگ کن.
          </p>
        </div>

        {/* Mobile View Toggle (List vs Map) */}
        <div className="lg:hidden flex items-center justify-center p-1 bg-white rounded-2xl border border-[#EADFD5] shadow-xs mb-6">
          <button
            onClick={() => setMobileTab('list')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mobileTab === 'list'
                ? 'bg-[#C25E38] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>لیست اعضا ({toPersianDigits(filteredMembers.length)})</span>
          </button>
          <button
            onClick={() => setMobileTab('map')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mobileTab === 'map'
                ? 'bg-[#C25E38] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            <span>نقشه تعاملی ایران</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EADFD5] shadow-xs mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="جستجوی شهر یا نام میزبان/مسافر..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pr-10 pl-10 bg-[#F9F8F6] border border-gray-200 rounded-2xl text-sm font-semibold outline-none focus:border-[#C25E38] focus:bg-white transition-all shadow-xs"
              />
              <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Hosting Type Tabs with Badge Counts */}
            <div className="flex items-center gap-1 bg-[#F9F8F6] p-1.5 rounded-2xl border border-gray-200 overflow-x-auto shrink-0 justify-start sm:justify-center">
              <button
                onClick={() => setHostingType('all')}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1 ${
                  hostingType === 'all'
                    ? 'bg-white text-[#C25E38] shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>همه</span>
                <span className="text-[10px] opacity-75 font-normal">({toPersianDigits(typeCounts.all)})</span>
              </button>
              <button
                onClick={() => setHostingType('mutual')}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1 ${
                  hostingType === 'mutual'
                    ? 'bg-white text-[#C25E38] shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>متقابل</span>
                <span className="text-[10px] opacity-75 font-normal">({toPersianDigits(typeCounts.mutual)})</span>
              </button>
              <button
                onClick={() => setHostingType('host')}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1 ${
                  hostingType === 'host'
                    ? 'bg-white text-[#C25E38] shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>فقط میزبان</span>
                <span className="text-[10px] opacity-75 font-normal">({toPersianDigits(typeCounts.hosts)})</span>
              </button>
              <button
                onClick={() => setHostingType('traveler')}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1 ${
                  hostingType === 'traveler'
                    ? 'bg-white text-sky-700 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>مسافران</span>
                <span className="text-[10px] opacity-75 font-normal">({toPersianDigits(typeCounts.travelers)})</span>
              </button>
            </div>

            {/* Verified Only Toggle */}
            <div className="flex items-center gap-2 bg-[#F9F8F6] px-3.5 py-2.5 rounded-2xl border border-gray-200 shrink-0">
              <button
                type="button"
                onClick={() => setVerifiedOnly(!verifiedOnly)}
                className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                  verifiedOnly ? 'bg-[#1E5647]' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    verifiedOnly ? '-translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
              <label
                onClick={() => setVerifiedOnly(!verifiedOnly)}
                className="text-xs font-bold text-gray-700 cursor-pointer select-none"
              >
                فقط هویت تأییدشده
              </label>
            </div>
          </div>

          {/* Quick Interests Tags Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-500 font-bold shrink-0 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#C25E38]" />
              علاقه مشترک:
            </span>
            <button
              onClick={() => setSelectedInterest('all')}
              className={`px-3 py-1 text-xs rounded-xl transition-colors shrink-0 font-semibold ${
                selectedInterest === 'all'
                  ? 'bg-[#C25E38] text-white shadow-xs font-bold'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              همه علایق
            </button>
            {interestsList.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedInterest(selectedInterest === tag ? 'all' : tag)}
                className={`px-3 py-1 text-xs rounded-xl transition-colors shrink-0 font-medium ${
                  selectedInterest === tag
                    ? 'bg-[#C25E38] text-white shadow-xs font-bold'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                #{tag}
              </button>
            ))}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="mr-auto px-3 py-1 text-xs rounded-xl text-rose-600 hover:bg-rose-50 font-bold transition-colors shrink-0 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>حذف همه فیلترها</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Content Layout (Grid & Iran Map) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Map Column (4 cols) */}
          <div className={`lg:col-span-4 order-2 lg:order-1 ${mobileTab === 'map' ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-28">
              <IranMap
                selectedCity={selectedCity}
                onSelectCity={(city) => setSelectedCity(city)}
                users={usersList}
              />
            </div>
          </div>

          {/* Members List Column (8 cols) */}
          <div className={`lg:col-span-8 order-1 lg:order-2 space-y-4 ${mobileTab === 'list' ? 'block' : 'hidden lg:block'}`}>
            {/* Results Header */}
            <div className="flex items-center justify-between bg-white px-5 py-3.5 rounded-2xl border border-[#EADFD5] shadow-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-black text-gray-800">اعضای فعال همجا</h3>
                <span className="text-xs text-gray-500 font-bold">
                  ({toPersianDigits(filteredMembers.length)} عضو)
                </span>
                {selectedCity && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#C25E38]/10 text-[#C25E38] text-xs font-bold">
                    شهر: {selectedCity}
                    <button
                      onClick={() => setSelectedCity('')}
                      className="hover:text-red-700 p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>

              <span className="text-xs text-gray-400 font-medium">
                مرتب‌سازی: فعال‌ترین
              </span>
            </div>

            {/* Members Grid */}
            {filteredMembers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {filteredMembers.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#EADFD5] space-y-4 shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-[#C25E38]/10 text-[#C25E38] flex items-center justify-center mx-auto">
                  <MapPin className="w-7 h-7" />
                </div>
                {usersList.length === 0 ? (
                  <>
                    <div className="space-y-1">
                      <h4 className="text-base font-black text-gray-800">هنوز عضوی در همجا ثبت‌نام نکرده است</h4>
                      <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                        با ثبت‌نام در همجا، اولین میزبان یا مسافر این جمع باشید.
                      </p>
                    </div>
                    <div>
                      <Link
                        href="/register"
                        className="inline-flex items-center gap-1.5 px-6 py-3 bg-[#C25E38] hover:bg-[#A84E2D] text-white text-xs font-bold rounded-2xl shadow transition-colors"
                      >
                        ثبت‌نام اولین عضو همجا
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <h4 className="text-base font-black text-gray-800">هیچ عضوی با این فیلترها یافت نشد</h4>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed font-medium">
                      می‌توانید فیلترهای انتخابی را پاک کنید یا نام شهر دیگری را در کادر جستجو بنویسید.
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="px-5 py-2.5 bg-[#C25E38] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-[#A84E2D] transition-colors mt-2"
                    >
                      نمایش تمام اعضا
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Bottom Safety Banner matching Page 4 */}
            <div className="p-4 sm:p-5 bg-[#EBF5F1] rounded-3xl border border-[#1E5647]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-right shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#1E5647]/10 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-[#1E5647]" />
                </div>
                <div className="text-xs text-gray-700 leading-relaxed font-medium">
                  <span className="font-bold text-[#1E5647]">اعتماد، پیش از اولین سلام: </span>
                  پروفایل و نظرهای دیگران را بخوان و پیش از سفر، درباره زمان و شرایط میزبانی گفتگو کن.
                </div>
              </div>
              <Link
                href="/#trust"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#1E5647] hover:underline shrink-0"
              >
                <span>راهنمای سفر امن</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-bold text-gray-500">در حال بارگذاری اعضا...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
