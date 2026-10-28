'use client';

import React, { useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  MapPin,
  HeartHandshake,
  MessageSquare,
  Home,
  User,
  Star,
  CheckCircle2,
  Clock,
  Sparkles,
  Wifi,
  UtensilsCrossed,
  Bath,
  Lock,
  ChevronLeft,
  Calendar,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HostingRequestModal from '@/components/modals/HostingRequestModal';
import VerificationModal from '@/components/modals/VerificationModal';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import {
  MOCK_PROFILES,
  MOCK_LISTINGS,
  MOCK_REVIEWS,
  MOCK_PAST_HOSTINGS,
} from '@/lib/mock-data';
import { Suspense } from 'react';

function MemberProfileContent() {
  const router = useRouter();
  const { isLoggedIn, isVerified } = useAuth();
  const params = useParams();
  const id = params?.id as string;

  const [activeTab, setActiveTab] = useState<'about' | 'home' | 'reviews'>('about');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyReason, setVerifyReason] = useState('');

  const handleOpenRequest = () => {
    if (!isLoggedIn) {
      router.push('/register');
      return;
    }
    if (!isVerified) {
      setVerifyReason('برای ارسال درخواست میزبانی و حفظ امنیت جامعه همجا، لطفاً ابتدا مدارک هویتی (تصویر کارت ملی و سلفی) خود را ارسال فرمایید.');
      setShowVerifyModal(true);
      return;
    }
    setShowRequestModal(true);
  };

  // Find member or default to Sara Rahimi
  const member =
    MOCK_PROFILES.find((p) => p.id === id) ||
    MOCK_PROFILES[0]; // fallback to Sara

  const listing = MOCK_LISTINGS[member.id] || MOCK_LISTINGS['sara-rahimi'];
  const reviews = MOCK_REVIEWS[member.id] || MOCK_REVIEWS['sara-rahimi'] || [];
  const pastHostings = MOCK_PAST_HOSTINGS[member.id] || MOCK_PAST_HOSTINGS['sara-rahimi'] || [];

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F8F6]">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb matching Page 2 */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6 font-medium">
          <Link href="/explore" className="hover:text-[#C25E38] transition-colors">
            کاوش اعضا
          </Link>
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="text-gray-800 font-bold">{member.full_name}</span>
        </div>

        {/* Profile Header & Action Card matching Page 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Main Info Card (Right visually in RTL, 8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-[#EADFD5] shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-right">
            <div className="relative shrink-0">
              <img
                src={member.avatar_url}
                alt={member.full_name}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-[#EADFD5] shadow-md"
              />
              {member.is_identity_verified && (
                <span
                  className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#1E5647] text-white rounded-full flex items-center justify-center text-xs shadow-lg"
                  title="هویت تأییدشده"
                >
                  ✓
                </span>
              )}
            </div>

            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF5F1] text-[#1E5647] text-xs font-semibold border border-[#1E5647]/20">
                  <HeartHandshake className="w-3.5 h-3.5" />
                  آماده میزبانی متقابل
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#C25E38]" />
                  {member.city}
                </span>
                {member.is_identity_verified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EBF5F1] text-[#1E5647] text-xs font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    هویت تأییدشده
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-[#1F2937]">
                {member.full_name}
              </h1>

              <p className="text-sm text-gray-600 leading-relaxed font-medium italic">
                &ldquo;{member.bio_headline}&rdquo;
              </p>

              <div className="pt-2 flex items-center justify-center sm:justify-start gap-4 text-xs text-gray-500">
                <span>عضو از {member.member_since_year}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span>{member.hosting_count} تجربه میزبانی</span>
              </div>
            </div>
          </div>

          {/* Action Sidebar Card matching Page 2 (Left visually in RTL, 4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#EADFD5] shadow-sm flex flex-col justify-between text-right space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C25E38] mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>یک سلام، شروع یک دوستی</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                از سفرت بگو و برای میزبانی متقابل با {member.full_name.split(' ')[0]} هماهنگ کن.
              </p>
            </div>

            <button
              onClick={handleOpenRequest}
              className="w-full py-3.5 bg-[#C25E38] hover:bg-[#A84E2D] text-white font-bold rounded-2xl shadow-md transition-all hover:shadow-lg flex items-center justify-center gap-2 text-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>درخواست میزبانی / پیام</span>
            </button>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1E5647]" />
                پاسخ‌دهی: {member.response_rate_percent}٪
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                آخرین فعالیت: {member.last_active || 'امروز'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs matching Page 2 */}
        <div className="flex items-center gap-2 border-b border-[#EADFD5] mb-8 pb-1">
          <button
            onClick={() => setActiveTab('about')}
            className={`px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'about'
                ? 'border-[#C25E38] text-[#C25E38]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>درباره من</span>
          </button>

          <button
            onClick={() => setActiveTab('home')}
            className={`px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'home'
                ? 'border-[#C25E38] text-[#C25E38]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>خانه و امکانات</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'reviews'
                ? 'border-[#C25E38] text-[#C25E38]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>نظرات اعضا ({reviews.length})</span>
          </button>
        </div>

        {/* TAB 1: درباره من (About Me) matching Page 2 */}
        {activeTab === 'about' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-right">
            {/* Bio content (8 cols) */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-[#EADFD5] shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold text-[#1F2937] mb-3">
                  سلام، من {member.full_name.split(' ')[0]}ام!
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {member.about_me}
                </p>
              </div>

              {/* Tags */}
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-500 mb-2">علاقه‌مندی‌ها</h4>
                <div className="flex flex-wrap gap-2">
                  {member.interests?.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-xl text-xs font-semibold text-[#C25E38] bg-[#FBF4F0] border border-[#C25E38]/20"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Details (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-3xl p-6 border border-[#EADFD5] shadow-sm space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-gray-500 mb-1.5">زبان‌ها</h4>
                  <p className="text-xs sm:text-sm font-semibold text-gray-800">
                    {member.languages?.join(' · ') || 'فارسی (زبان مادری)'}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-500 mb-1.5">مقصدهای محبوب من</h4>
                  <p className="text-xs sm:text-sm font-semibold text-gray-800 leading-relaxed">
                    {member.favorite_destinations?.join(' · ') || 'شهرهای مختلف ایران'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: خانه و امکانات (Home & Amenities) matching Page 2 */}
        {activeTab === 'home' && (
          <div className="space-y-8 text-right">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADFD5] shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-[#1F2937]">{listing.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{listing.neighborhood_name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-xl bg-[#FBF4F0] text-[#C25E38] text-xs font-bold">
                    نوع فضا: {listing.room_type_label}
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold">
                    ظرفیت: {listing.capacity} نفر
                  </span>
                </div>
              </div>

              {/* Photos Gallery */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl overflow-hidden">
                {listing.photos.map((photo, idx) => (
                  <div key={idx} className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-sm">
                    <img
                      src={photo}
                      alt={listing.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2.5 py-1 rounded-lg backdrop-blur-sm">
                      اتاقی برای یک دوست
                    </div>
                  </div>
                ))}
              </div>

              {/* Amenities */}
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-sm font-bold text-gray-800 mb-3">امکانات اقامتگاه</h4>
                <div className="flex flex-wrap gap-2.5">
                  {listing.amenities.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F9F8F6] text-gray-700 text-xs font-medium border border-gray-200"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1E5647]" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* House Rules matching Page 2 */}
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-sm font-bold text-gray-800 mb-2">قوانین خانه</h4>
                <ul className="space-y-1.5 text-xs text-gray-600 list-disc list-inside leading-relaxed">
                  {listing.house_rules.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                </ul>
              </div>

              {/* Exact Address Privacy Note matching Page 2 */}
              <div className="p-4 rounded-2xl bg-[#F9F8F6] border border-[#EADFD5] text-xs text-gray-600 flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#C25E38] shrink-0" />
                <span>
                  نشانی دقیق خانه پس از توافق دوطرفه به اشتراک گذاشته می‌شود.
                </span>
              </div>
            </div>

            {/* Past Hostings Widget matching Page 2 */}
            {pastHostings.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADFD5] shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-800">
                    میزبانی‌های گذشته
                  </h4>
                  <span className="text-xs text-[#C25E38] font-semibold">
                    یک میزبانی، شروع یک آشنایی
                  </span>
                </div>

                <div className="space-y-3">
                  {pastHostings.map((past) => (
                    <div
                      key={past.id}
                      className="p-4 rounded-2xl bg-[#FBF4F0] border border-[#C25E38]/20 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        {past.guest_avatar && (
                          <img
                            src={past.guest_avatar}
                            alt={past.guest_name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow"
                          />
                        )}
                        <div>
                          <p className="text-xs font-bold text-gray-800">
                            میزبان {past.guest_name}
                          </p>
                          <p className="text-[11px] text-gray-600 mt-0.5 line-clamp-1">
                            {past.story_snippet}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-[#C25E38] bg-white px-2.5 py-1 rounded-lg shrink-0 shadow-sm">
                        {past.stay_date} · {past.nights_count} شب اقامت
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: نظرات اعضا (Reviews) matching Page 2 */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADFD5] shadow-sm space-y-6 text-right">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-[#1F2937]">نظرات اعضا از نگاه دوستان سارا</h3>
                <p className="text-xs text-gray-500 mt-0.5">۵ از ۵ بر اساس ۲ نظر</p>
              </div>
              <div className="flex items-center gap-1 text-amber-500 text-sm">
                <span>★★★★★</span>
                <span className="text-xs font-bold text-gray-800 mr-1">۵٫۰</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl bg-[#F9F8F6] border border-[#EADFD5] space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.reviewer_avatar}
                          alt={rev.reviewer_name}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-gray-300"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-gray-800">{rev.reviewer_name}</h4>
                          <span className="text-[10px] text-gray-500">{rev.reviewer_city}</span>
                        </div>
                      </div>
                      <div className="text-amber-500 text-xs">★★★★★</div>
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed italic">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  </div>

                  <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between text-[10px] text-gray-500">
                    <span>{rev.stay_date_label}</span>
                    {rev.is_verified_experience && (
                      <span className="inline-flex items-center gap-1 text-[#1E5647] font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        تجربه تأییدشده
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Hosting Request Modal */}
      <HostingRequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        host={member}
      />

      {/* Verification Modal for Unverified Users */}
      <VerificationModal
        isOpen={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        reason={verifyReason}
        onComplete={() => {
          setShowVerifyModal(false);
          setShowRequestModal(true);
        }}
      />
    </div>
  );
}

export default function MemberProfilePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-gray-500 font-medium">در حال بارگذاری پروفایل میزبان...</div>}>
      <MemberProfileContent />
    </Suspense>
  );
}

