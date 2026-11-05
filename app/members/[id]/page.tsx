'use client';

import React, { useState, useEffect } from 'react';
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
  Compass,
  Users,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HostingRequestModal from '@/components/modals/HostingRequestModal';
import VerificationModal from '@/components/modals/VerificationModal';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { UserProfile } from '@/types/database';
import {
  MOCK_PROFILES,
  MOCK_LISTINGS,
  MOCK_REVIEWS,
  MOCK_PAST_HOSTINGS,
} from '@/lib/mock-data';
import { Suspense } from 'react';
import { getAvatarUrl } from '@/lib/persian-utils';

function MemberProfileContent() {
  const router = useRouter();
  const { usersList, currentUser, isLoggedIn, isVerified } = useAuth();
  const params = useParams();
  const id = params?.id as string;

  const [activeTab, setActiveTab] = useState<'about' | 'home' | 'reviews'>('about');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyReason, setVerifyReason] = useState('');

  const [fetchedMember, setFetchedMember] = useState<UserProfile | null>(null);
  const [isLoadingMember, setIsLoadingMember] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const inList = usersList.find((p) => p.id === id);
    if (inList) {
      setFetchedMember(inList);
      setIsLoadingMember(false);
      return;
    }

    const loadFromApi = async () => {
      try {
        const res = await fetch(`/api/users/${id}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user && isMounted) {
            setFetchedMember(data.user);
          }
        }
      } catch (e) {
        // ignore
      } finally {
        if (isMounted) setIsLoadingMember(false);
      }
    };

    loadFromApi();
    return () => {
      isMounted = false;
    };
  }, [id, usersList]);

  // Find member in usersList or directly fetched
  const member = fetchedMember || usersList.find((p) => p.id === id);
  const isOwnProfile = !!(currentUser && member && currentUser.id === member.id);

  const handleOpenRequest = () => {
    if (!isLoggedIn) {
      router.push('/register');
      return;
    }
    if (isOwnProfile) {
      alert('شما نمی‌توانید به حساب کاربری خودتان درخواست یا پیام ارسال کنید.');
      return;
    }
    if (currentUser?.verification_status !== 'approved') {
      if (currentUser?.verification_status === 'pending') {
        alert('مدارک هویتی شما قبلاً ارسال شده و در حال بررسی است. به محض تأیید توسط تیم همجا، امکان ارسال درخواست برای شما فعال خواهد شد.');
      } else {
        setVerifyReason('برای ارسال درخواست میزبانی و حفظ امنیت جامعه همجا، لطفاً ابتدا مدارک هویتی (تصویر کارت ملی و سلفی) خود را ارسال فرمایید تا پس از تأیید فعال شود.');
        setShowVerifyModal(true);
      }
      return;
    }
    setShowRequestModal(true);
  };

  if (isLoadingMember && !member) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F9F8F6]">
        <Navbar />
        <main className="flex-1 max-w-md w-full mx-auto px-4 py-24 text-center space-y-4">
          <div className="bg-white rounded-3xl p-8 border border-[#EADFD5] shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#C25E38]/10 text-[#C25E38] flex items-center justify-center mx-auto animate-pulse">
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-gray-700">در حال دریافت مشخصات کاربر از دیتابیس...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F9F8F6]">
        <Navbar />
        <main className="flex-1 max-w-md w-full mx-auto px-4 py-16 text-center space-y-4">
          <div className="bg-white rounded-3xl p-8 border border-[#EADFD5] shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
              <User className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">عضوی با این مشخصات یافت نشد</h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              ممکن است این کاربر حذف شده باشد یا شناسه وارد شده در آدرس صحیح نباشد.
            </p>
            <Link
              href="/explore"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#C25E38] hover:bg-[#A84E2D] text-white text-xs font-bold rounded-xl shadow transition-colors"
            >
              بازگشت به کاوش اعضا
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const fallbackListing = {
    id: `listing-${member.id}`,
    host_id: member.id,
    title: `میزبانی در ${member.city} با ${member.full_name}`,
    neighborhood_name: `شهر ${member.city}`,
    room_type: 'private_room' as const,
    room_type_label:
      member.sleeping_arrangement === 'private_with_bed'
        ? 'اتاق اختصاصی با تخت'
        : member.sleeping_arrangement === 'private_without_bed'
        ? 'اتاق اختصاصی سنتی (تشک)'
        : 'فضای مشترک در پذیرایی',
    capacity: member.max_guests || 2,
    photos: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['اینترنت وای‌فای', 'آشپزخانه برای پخت‌وپز', 'حمام و سرویس بهداشتی', 'امکان کار با لپ‌تاپ'],
    house_rules: member.house_rules && member.house_rules.length > 0 ? member.house_rules : ['رعایت سکوت در ساعات پایانی شب', 'احترام متقابل و حفظ نظم خانه'],
  };

  const listing = (member.id && MOCK_LISTINGS[member.id]) || fallbackListing;
  const reviews = (member.id && MOCK_REVIEWS[member.id]) || [];
  const pastHostings = (member.id && MOCK_PAST_HOSTINGS[member.id]) || [];
  const isTraveler = member.can_host === false || member.role === 'traveler';

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
                src={getAvatarUrl(member.avatar_url)}
                alt={member.full_name}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-[#EADFD5] shadow-md bg-[#F4EFEA]"
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
                {isTraveler ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-semibold border border-sky-200">
                    <Compass className="w-3.5 h-3.5 text-sky-600" />
                    {member.target_destination
                      ? `قصد سفر به ${member.target_destination} (مشتاق میزبان)`
                      : 'مسافر · در جستجوی میزبان'}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF5F1] text-[#1E5647] text-xs font-semibold border border-[#1E5647]/20">
                    <HeartHandshake className="w-3.5 h-3.5" />
                    آماده میزبانی متقابل
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#C25E38]" />
                  {isTraveler ? `ساکن ${member.city}` : member.city}
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

              {(member.age || member.job_education) && (
                <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-gray-600 font-medium">
                  {member.age && <span>{member.age} ساله</span>}
                  {member.age && member.job_education && <span>•</span>}
                  {member.job_education && <span>{member.job_education}</span>}
                </div>
              )}

              <p className="text-sm text-gray-600 leading-relaxed font-medium italic">
                &ldquo;{member.bio_headline}&rdquo;
              </p>

              {isTraveler && (member.target_destination || member.target_travel_dates) && (
                <div className="inline-flex flex-wrap items-center gap-3 p-3 bg-sky-50/80 rounded-2xl border border-sky-100 text-xs text-sky-900 mt-2">
                  {member.target_destination && (
                    <span className="flex items-center gap-1 font-semibold">
                      <Compass className="w-3.5 h-3.5 text-sky-600" />
                      مقصد سفر: {member.target_destination}
                    </span>
                  )}
                  {member.target_travel_dates && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-sky-600" />
                      تاریخ سفر: {member.target_travel_dates}
                    </span>
                  )}
                  {member.target_guests_count && (
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-sky-600" />
                      همراهان: {member.target_guests_count} نفر
                    </span>
                  )}
                </div>
              )}

              <div className="pt-2 flex items-center justify-center sm:justify-start gap-4 text-xs text-gray-500">
                <span>عضو از {member.member_since_year}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span>{isTraveler ? 'علاقه‌مند به سفر و میزبانی شدن' : `${member.hosting_count} تجربه میزبانی`}</span>
              </div>
            </div>
          </div>

          {/* Action Sidebar Card matching Page 2 (Left visually in RTL, 4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#EADFD5] shadow-sm flex flex-col justify-between text-right space-y-4">
            <div>
              <div className={`inline-flex items-center gap-1.5 text-xs font-bold mb-1 ${isOwnProfile ? 'text-amber-800' : isTraveler ? 'text-sky-700' : 'text-[#C25E38]'}`}>
                {isOwnProfile ? <User className="w-3.5 h-3.5 text-amber-700" /> : isTraveler ? <Compass className="w-3.5 h-3.5 text-sky-600" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>{isOwnProfile ? 'پروفایل کاربری شما' : isTraveler ? 'پیشنهاد میزبانی به مسافر' : 'یک سلام، شروع یک دوستی'}</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                {isOwnProfile
                  ? 'این صفحه عمومی حساب کاربری شماست که سایر اعضای همجا آن را مشاهده می‌کنند.'
                  : isTraveler
                  ? `${member.full_name.split(' ')[0]} قصد سفر به ${member.target_destination || 'شهرهای مختلف'} دارد. می‌توانید او را به خانه خود دعوت کنید!`
                  : `از سفرت بگو و برای میزبانی متقابل با ${member.full_name.split(' ')[0]} هماهنگ کن.`}
              </p>
            </div>

            {isOwnProfile ? (
              <div className="space-y-2">
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] text-amber-900 leading-relaxed font-medium">
                  شما نمی‌توانید به حساب کاربری خودتان درخواست ارسال فرمایید.
                </div>
                <Link
                  href="/profile"
                  className="w-full py-3.5 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <User className="w-4 h-4" />
                  <span>مدیریت و ویرایش پروفایل من</span>
                </Link>
              </div>
            ) : (
              <button
                onClick={handleOpenRequest}
                className={`w-full py-3.5 text-white font-bold rounded-2xl shadow-md transition-all hover:shadow-lg flex items-center justify-center gap-2 text-sm ${
                  isTraveler
                    ? 'bg-[#1E5647] hover:bg-[#164236]'
                    : 'bg-[#C25E38] hover:bg-[#A84E2D]'
                }`}
              >
                {isTraveler ? (
                  <>
                    <HeartHandshake className="w-4 h-4" />
                    <span>پیشنهاد میزبانی به {member.full_name.split(' ')[0]} (دعوت به خانه)</span>
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4" />
                    <span>درخواست میزبانی / پیام</span>
                  </>
                )}
              </button>
            )}

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
            {isTraveler ? (
              <>
                <Compass className="w-4 h-4" />
                <span>برنامه سفر و نیازها</span>
              </>
            ) : (
              <>
                <Home className="w-4 h-4" />
                <span>خانه و امکانات</span>
              </>
            )}
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
                  {member.interests && member.interests.length > 0 ? (
                    member.interests.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-xl text-xs font-semibold text-[#C25E38] bg-[#FBF4F0] border border-[#C25E38]/20"
                      >
                        #{tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">علاقه‌مندی خاصی ثبت نشده است</span>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar Details (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-3xl p-6 border border-[#EADFD5] shadow-sm space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-gray-500 mb-1.5">زبان‌ها</h4>
                  <p className="text-xs sm:text-sm font-semibold text-gray-800">
                    {member.languages && member.languages.length > 0
                      ? member.languages.join(' · ')
                      : 'فارسی (زبان مادری)'}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-500 mb-1.5">مقصدهای محبوب من</h4>
                  <p className="text-xs sm:text-sm font-semibold text-gray-800 leading-relaxed">
                    {member.favorite_destinations && member.favorite_destinations.length > 0
                      ? member.favorite_destinations.join(' · ')
                      : 'هنوز مقصدی ثبت نشده است'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: خانه و امکانات (Home & Amenities) یا برنامه سفر مسافر */}
        {activeTab === 'home' && (
          isTraveler ? (
            <div className="space-y-6 text-right">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADFD5] shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-50 text-sky-700 text-xs font-bold mb-2">
                      <Compass className="w-3.5 h-3.5" />
                      برنامه و مشخصات سفر مسافر
                    </span>
                    <h3 className="text-xl font-black text-[#1F2937]">
                      سفر {member.full_name} به مقصد {member.target_destination || 'مشخص نشده'}
                    </h3>
                  </div>
                  {!isOwnProfile ? (
                    <button
                      onClick={handleOpenRequest}
                      className="px-4 py-2 bg-[#1E5647] hover:bg-[#164236] text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center gap-1.5"
                    >
                      <HeartHandshake className="w-4 h-4" />
                      <span>دعوت به خانه و میزبانی</span>
                    </button>
                  ) : (
                    <Link
                      href="/profile"
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      <User className="w-4 h-4" />
                      <span>ویرایش مشخصات</span>
                    </Link>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-[#F9F8F6] border border-[#EADFD5]">
                    <span className="text-xs text-gray-500 block mb-1">شهر مقصد سفر</span>
                    <p className="text-base font-bold text-gray-900 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#C25E38]" />
                      {member.target_destination || member.city || 'هنوز مشخص نشده'}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#F9F8F6] border border-[#EADFD5]">
                    <span className="text-xs text-gray-500 block mb-1">بازه زمانی مدنظر</span>
                    <p className="text-base font-bold text-gray-900 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#1E5647]" />
                      {member.target_travel_dates || 'توافقی و منعطف'}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#F9F8F6] border border-[#EADFD5]">
                    <span className="text-xs text-gray-500 block mb-1">تعداد همراهان</span>
                    <p className="text-base font-bold text-gray-900 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-sky-600" />
                      {member.target_guests_count ? `${member.target_guests_count} نفر` : '۱ نفر (تنها سفر می‌کند)'}
                    </p>
                  </div>
                </div>

                {/* Traveler Expectations / Rules */}
                <div className="pt-2">
                  <h4 className="text-sm font-bold text-gray-800 mb-2">انتظارات و توضیحات مسافر</h4>
                  <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100 text-xs text-gray-700 leading-relaxed space-y-2">
                    {member.house_rules && member.house_rules.length > 0 ? (
                      <ul className="space-y-1.5 list-disc list-inside">
                        {member.house_rules.map((rule, idx) => (
                          <li key={idx}>{rule}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>
                        این مسافر علاقه‌مند به آشنایی با افراد محلی و تبادل تجربیات فرهنگی است و ترجیح می‌دهد با هماهنگی و رعایت نظم و احترام متقابل در خانه میزبان اقامت داشته باشد.
                      </p>
                    )}
                  </div>
                </div>

                {/* Friendly host invitation note */}
                <div className="p-4 rounded-2xl bg-[#EBF5F1] border border-[#1E5647]/20 text-xs text-[#1E5647] flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 shrink-0" />
                  <span>
                    اگر در این شهر ساکن هستید و امکان پذیرایی دارید، پیشنهاد میزبانی بفرستید و میزبان {member.full_name.split(' ')[0]} باشید!
                  </span>
                </div>
              </div>
            </div>
          ) : (
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
          )
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
        mode={isTraveler ? 'offer_hosting' : 'request_stay'}
      />

      {/* Verification Modal for Unverified Users */}
      <VerificationModal
        isOpen={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        reason={verifyReason}
        onComplete={() => {
          setShowVerifyModal(false);
          alert('مدارک شما با موفقیت ثبت شد و در صف بررسی قرار گرفت. پس از تأیید هویت توسط مدیر، امکان ارسال درخواست فعال خواهد شد.');
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

