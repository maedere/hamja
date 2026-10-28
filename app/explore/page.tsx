'use client';

import React, { useState, useMemo, Suspense } from 'react';
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
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MemberCard from '@/components/members/MemberCard';
import IranMap from '@/components/explore/IranMap';
import { MOCK_PROFILES } from '@/lib/mock-data';

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialCity = searchParams.get('city') || '';

  const [searchTerm, setSearchTerm] = useState(initialCity);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [hostingType, setHostingType] = useState<'all' | 'mutual' | 'host'>('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState<string>('all');

  const interestsList = ['عکاسی', 'کتاب', 'طبیعت‌گردی', 'کوهنوردی', 'موسیقی', 'آشپزی', 'هنر'];

  // Filter members based on criteria
  const filteredMembers = useMemo(() => {
    return MOCK_PROFILES.filter((member) => {
      // City or name search
      const matchesSearch =
        !searchTerm ||
        member.city.includes(searchTerm) ||
        member.full_name.includes(searchTerm) ||
        (member.about_me?.includes(searchTerm) ?? false);

      // Selected city from Map or filter
      const matchesCity = !selectedCity || member.city === selectedCity;

      // Verified only
      const matchesVerified = !verifiedOnly || member.is_identity_verified;

      // Hosting type
      const matchesType =
        hostingType === 'all' ||
        (hostingType === 'mutual' && member.role === 'both') ||
        (hostingType === 'host' && (member.role === 'host' || member.role === 'both'));

      // Interest
      const matchesInterest =
        selectedInterest === 'all' ||
        (member.interests?.some((tag) => tag.includes(selectedInterest)) ?? false);

      return matchesSearch && matchesCity && matchesVerified && matchesType && matchesInterest;
    });
  }, [searchTerm, selectedCity, verifiedOnly, hostingType, selectedInterest]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F8F6]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title & Intro matching Page 4 */}
        <div className="text-right mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBF4F0] text-[#C25E38] text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>آدم‌ها، بهترین بخش سفرند</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1F2937]">
            دوست بعدی‌ات را اینجا پیدا کن
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            با آدم‌های هم‌علاقه آشنا شو؛ شاید مقصد بعدی‌ات، خانه یک دوست باشد.
          </p>
        </div>

        {/* Filter & Search Bar matching Page 4 */}
        <div className="bg-white rounded-3xl p-5 border border-[#EADFD5] shadow-sm mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="جستجوی شهر یا نام میزبان..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pr-10 bg-[#F9F8F6] border border-gray-200 rounded-2xl text-sm outline-none focus:border-[#C25E38] transition-colors"
              />
              <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Hosting Type Tabs */}
            <div className="flex items-center gap-1 bg-[#F9F8F6] p-1.5 rounded-2xl border border-gray-200 shrink-0 w-full lg:w-auto justify-center">
              <span className="text-xs font-medium text-gray-500 ml-2">نوع میزبانی:</span>
              <button
                onClick={() => setHostingType('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  hostingType === 'all'
                    ? 'bg-white text-[#C25E38] shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                همه
              </button>
              <button
                onClick={() => setHostingType('mutual')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  hostingType === 'mutual'
                    ? 'bg-white text-[#C25E38] shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                متقابل
              </button>
              <button
                onClick={() => setHostingType('host')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  hostingType === 'host'
                    ? 'bg-white text-[#C25E38] shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                فقط میزبان
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
                className="text-xs font-medium text-gray-700 cursor-pointer select-none"
              >
                فقط کاربران دارای تأیید هویت
              </label>
            </div>
          </div>

          {/* Quick Interests Tags Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-gray-100">
            <span className="text-xs text-gray-500 font-medium shrink-0 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#C25E38]" />
              علایق مشترک:
            </span>
            <button
              onClick={() => setSelectedInterest('all')}
              className={`px-2.5 py-1 text-xs rounded-lg transition-colors shrink-0 ${
                selectedInterest === 'all'
                  ? 'bg-[#C25E38] text-white font-bold'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              همه
            </button>
            {interestsList.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedInterest(selectedInterest === tag ? 'all' : tag)}
                className={`px-2.5 py-1 text-xs rounded-lg transition-colors shrink-0 ${
                  selectedInterest === tag
                    ? 'bg-[#C25E38] text-white font-bold'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Layout matching Page 4 (Grid & Iran Map) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Map Column (Left visually in RTL, 4 cols) */}
          <div className="lg:col-span-4 order-2 lg:order-1">
            <div className="sticky top-28">
              <IranMap
                selectedCity={selectedCity}
                onSelectCity={(city) => setSelectedCity(city)}
              />
            </div>
          </div>

          {/* Members List Column (8 cols) */}
          <div className="lg:col-span-8 order-1 lg:order-2 space-y-4">
            {/* Results Header */}
            <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-[#EADFD5]">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-gray-800">میزبان‌های همجا</h3>
                <span className="text-xs text-gray-500 font-medium">
                  ({filteredMembers.length} عضو فعال)
                </span>
                {selectedCity && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#C25E38]/10 text-[#C25E38] text-xs font-bold">
                    {selectedCity}
                    <button
                      onClick={() => setSelectedCity('')}
                      className="hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>

              <span className="text-xs text-gray-500 font-medium">
                مرتب‌سازی: پیشنهادی
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
              <div className="bg-white rounded-3xl p-12 text-center border border-[#EADFD5] space-y-3">
                <MapPin className="w-10 h-10 text-gray-400 mx-auto" />
                <h4 className="text-base font-bold text-gray-700">میزبانی با این مشخصات یافت نشد</h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  می‌توانید فیلترها را حذف کرده یا نام شهر دیگری را جستجو نمایید.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCity('');
                    setVerifiedOnly(false);
                    setSelectedInterest('all');
                  }}
                  className="px-4 py-2 bg-[#C25E38] text-white text-xs font-bold rounded-xl shadow mt-2"
                >
                  نمایش همه اعضا
                </button>
              </div>
            )}

            {/* Bottom Safety Banner matching Page 4 */}
            <div className="p-4 bg-[#EBF5F1] rounded-2xl border border-[#1E5647]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-right">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#1E5647] shrink-0" />
                <div className="text-xs text-gray-700 leading-relaxed">
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
    <Suspense fallback={<div className="p-8 text-center">در حال بارگذاری اعضا...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
