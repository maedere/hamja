'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  Phone,
  Camera,
  MapPin,
  Calendar,
  Home as HomeIcon,
  Users,
  Bed,
  Check,
  RefreshCw,
  LogOut,
  Sparkles,
  ArrowRight,
  Upload,
  Heart,
  Briefcase,
  AlertCircle,
  FileText,
  Pencil,
  Globe,
  Compass,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import VerificationModal from '@/components/modals/VerificationModal';
import EditProfileModal from '@/components/modals/EditProfileModal';
import { toPersianDigits } from '@/lib/persian-utils';

export default function ProfilePage() {
  const { currentUser, isLoggedIn, logout } = useAuth();
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // If user is not logged in
  if (!isLoggedIn || !currentUser) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] text-[#1F2937] py-16 px-4 text-right">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-[#EADFD5] shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#C25E38]/10 text-[#C25E38] flex items-center justify-center mx-auto">
            <User className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-black text-gray-800">ورود به حساب کاربری همجا</h1>
            <p className="text-xs text-gray-500 leading-relaxed">
              برای مشاهده پروفایل کاربری و وضعیت احراز هویت، لطفاً وارد حساب خود شوید یا ثبت‌نام کنید.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-3">
            <Link
              href="/register"
              className="w-full py-3 bg-[#C25E38] hover:bg-[#A84E2D] text-white font-bold rounded-2xl text-sm shadow transition-colors block text-center"
            >
              ورود / ثبت‌نام در همجا
            </Link>
            <Link
              href="/"
              className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl text-xs transition-colors block text-center"
            >
              بازگشت به صفحه اصلی
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const status = currentUser.verification_status;

  const roleLabel =
    currentUser.role === 'both'
      ? 'هم میزبان و هم مسافر'
      : currentUser.role === 'host'
      ? 'فقط میزبان'
      : 'فقط مسافر';

  const sleepingLabel =
    currentUser.sleeping_arrangement === 'private_with_bed'
      ? 'اتاق اختصاصی با تخت'
      : currentUser.sleeping_arrangement === 'private_without_bed'
      ? 'اتاق اختصاصی با تشک/رختخواب سنتی'
      : 'فضای خواب مشترک در پذیرایی';

  const guestPrefLabel =
    currentUser.guest_preference === 'females_only'
      ? 'فقط خانم‌ها'
      : currentUser.guest_preference === 'males_only'
      ? 'فقط آقایان'
      : currentUser.guest_preference === 'couples_families'
      ? 'فقط خانواده یا زوج'
      : 'فرقی نمی‌کند (همه اقشار)';

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#1F2937] py-8 text-right font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link href="/" className="hover:text-[#C25E38]">
              خانه
            </Link>
            <span>/</span>
            <span className="text-gray-800 font-bold">پروفایل کاربری</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/explore"
              className="text-xs text-[#C25E38] hover:underline font-bold flex items-center gap-1"
            >
              <span>جستجو و کاوش اعضا</span>
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            </Link>
          </div>
        </div>

        {/* ============================================================== */}
        {/* PROMINENT VERIFICATION STATUS BANNER                           */}
        {/* ============================================================== */}

        {/* STATUS: REJECTED */}
        {status === 'rejected' && (
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-3xl p-6 sm:p-7 shadow-sm animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <AlertTriangle className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full">
                      عدم تأیید مدرک
                    </span>
                    <h2 className="text-lg sm:text-xl font-black text-red-950">
                      احراز هویت شما رد شده است
                    </h2>
                  </div>

                  {/* Highlighted Rejection Reason Box */}
                  <div className="p-3.5 bg-white/90 rounded-2xl border border-red-200 space-y-1">
                    <div className="text-xs font-bold text-red-800 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>علت رد شدن مدرک توسط ادمین:</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-800 font-semibold leading-relaxed pr-5">
                      «{currentUser.rejection_reason || 'تصویر کارت ملی ناخواناست یا وضوح کافی ندارد.'}»
                    </p>
                  </div>

                  <p className="text-xs text-gray-600">
                    برای اینکه بتوانید با میزبانان گفتگو کنید و درخواست سفر بفرستید، لطفاً تصاویر واضح‌تری از کارت ملی و سلفی با کارت ملی مجدداً ارسال نمایید.
                  </p>
                </div>
              </div>

              {/* Prominent Re-upload Button */}
              <button
                onClick={() => setShowVerifyModal(true)}
                className="w-full sm:w-auto px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white text-sm font-black rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 shrink-0"
              >
                <RefreshCw className="w-4 h-4" />
                <span>بارگذاری مجدد مدارک</span>
              </button>
            </div>
          </div>
        )}

        {/* STATUS: PENDING */}
        {status === 'pending' && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 sm:p-7 shadow-sm animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Clock className="w-7 h-7" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-500 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full">
                      در صف بررسی دستی
                    </span>
                    <h2 className="text-lg sm:text-xl font-black text-amber-950">
                      مدارک هویتی شما در حال بررسی است
                    </h2>
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed max-w-2xl">
                    تصاویر کارت ملی و سلفی شما با موفقیت ارسال شد و هم‌اکنون در صف بررسی توسط ادمین همجا قرار دارد. پس از تأیید نهایی، نشان هویت تأییدشده در پروفایل شما فعال خواهد شد.
                  </p>
                  {currentUser.verification_docs?.submitted_at && (
                    <p className="text-[11px] text-amber-700">
                      تاریخ ارسال مدارک: {currentUser.verification_docs.submitted_at}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setShowVerifyModal(true)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>ویرایش و بارگذاری مجدد مدارک</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STATUS: APPROVED */}
        {status === 'approved' && (
          <div className="bg-[#EBF5F1] border-2 border-[#1E5647]/30 rounded-3xl p-6 sm:p-7 shadow-sm animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#1E5647] text-white flex items-center justify-center shrink-0 shadow-md">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#1E5647] text-white text-[11px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      هویت تأیید شده
                    </span>
                    <h2 className="text-lg sm:text-xl font-black text-[#1E5647]">
                      حساب کاربری شما معتبر و تأیید شده است
                    </h2>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed max-w-2xl">
                    تصاویر کارت ملی و سلفی شما توسط تیم پشتیبانی بررسی و تأیید گردید. شما دسترسی کامل برای ارسال درخواست میزبانی و میزبانی از سایر مسافران همجا دارید.
                  </p>
                </div>
              </div>

              <div className="px-4 py-2 rounded-2xl bg-white/80 border border-[#1E5647]/20 text-xs font-bold text-[#1E5647] flex items-center gap-1.5 shrink-0">
                <Sparkles className="w-4 h-4 text-[#C25E38]" />
                <span>عضو معتبر همجا</span>
              </div>
            </div>
          </div>
        )}

        {/* STATUS: UNVERIFIED */}
        {status === 'unverified' && (
          <div className="bg-[#FBF4F0] border-2 border-[#C25E38]/30 rounded-3xl p-6 sm:p-7 shadow-sm animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#C25E38] text-white flex items-center justify-center shrink-0 shadow-md">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#C25E38] text-white text-[11px] font-black px-2.5 py-0.5 rounded-full">
                      احراز هویت نشده
                    </span>
                    <h2 className="text-lg sm:text-xl font-black text-gray-800">
                      برای فعال‌سازی کامل امکانات، هویت خود را احراز کنید
                    </h2>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed max-w-2xl">
                    ثبت‌نام شما انجام شده است؛ اما برای ارسال پیام به میزبانان و ثبت درخواست اقامت، ارسال تصویر کارت ملی و یک سلفی الزامی است.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowVerifyModal(true)}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#C25E38] hover:bg-[#A84E2D] text-white text-sm font-black rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
              >
                <Upload className="w-4 h-4" />
                <span>ارسال مدارک احراز هویت</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MAIN PROFILE CARD: USER HEADER & DETAILS                      */}
        {/* ============================================================== */}
        <div className="bg-white rounded-3xl border border-[#EADFD5] shadow-sm overflow-hidden">
          {/* Banner cover */}
          <div className="h-36 sm:h-48 bg-gradient-to-r from-[#C25E38]/25 via-[#1E5647]/20 to-[#C25E38]/25 relative">
            <div className="absolute inset-0 bg-[radial-gradient(#C25E38_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
          </div>

          {/* Profile Header Content */}
          <div className="px-6 sm:px-8 pb-8 pt-0 relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 -mt-16 sm:-mt-20 mb-8 pb-6 border-b border-gray-100">
              {/* User Avatar + Identity Info */}
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-right">
                <div className="relative shrink-0">
                  <img
                    src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'}
                    alt={currentUser.full_name}
                    className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover border-4 border-white shadow-xl bg-white"
                  />
                  {currentUser.is_identity_verified && (
                    <div
                      title="هویت تأیید شده"
                      className="absolute -bottom-1.5 -left-1.5 w-9 h-9 rounded-full bg-[#1E5647] text-white flex items-center justify-center border-2 border-white shadow-md"
                    >
                      <Check className="w-5 h-5" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                      {currentUser.full_name}
                    </h1>
                    {currentUser.username && (
                      <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2.5 py-1 rounded-xl dir-ltr">
                        @{currentUser.username}
                      </span>
                    )}
                    <span className="text-xs font-bold px-3 py-1 rounded-xl bg-[#FBF4F0] text-[#C25E38] border border-[#C25E38]/20">
                      {roleLabel}
                    </span>
                    {currentUser.is_identity_verified ? (
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-[#EBF5F1] text-[#1E5647] border border-[#1E5647]/20 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        هویت تأیید شده
                      </span>
                    ) : status === 'pending' ? (
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        در صف بررسی مدارک
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-gray-100 text-gray-500 border border-gray-200">
                        احراز هویت نشده
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-gray-600 flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3">
                    <span className="flex items-center gap-1 font-bold text-gray-800">
                      <MapPin className="w-4 h-4 text-[#C25E38]" />
                      {currentUser.city}
                    </span>
                    {currentUser.age && (
                      <span className="text-gray-500">
                        • {currentUser.age} ساله
                      </span>
                    )}
                    {currentUser.job_education && (
                      <span className="text-gray-500">
                        • {currentUser.job_education}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center justify-center sm:justify-end gap-2.5 w-full md:w-auto">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="px-5 py-2.5 bg-[#C25E38] hover:bg-[#A84E2D] text-white rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>ویرایش مشخصات</span>
                </button>

                <button
                  onClick={logout}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-rose-50 text-gray-600 hover:text-rose-600 rounded-2xl text-xs font-bold transition-colors flex items-center gap-1.5 border border-gray-200"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>خروج از حساب</span>
                </button>
              </div>
            </div>

            {/* Dedicated 3-Card Stats Grid */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
              <div className="p-4 bg-[#F9F8F6] rounded-2xl border border-[#EADFD5] text-center shadow-xs">
                <span className="block text-xl sm:text-2xl font-black text-gray-900 mb-0.5">
                  {toPersianDigits(currentUser.hosting_count ?? 0)}
                </span>
                <span className="text-[11px] sm:text-xs text-gray-500 font-bold">میزبانی‌های انجام‌شده</span>
              </div>
              <div className="p-4 bg-[#F9F8F6] rounded-2xl border border-[#EADFD5] text-center shadow-xs">
                <span className="block text-xl sm:text-2xl font-black text-gray-900 mb-0.5">
                  {toPersianDigits(currentUser.response_rate_percent ?? 100)}٪
                </span>
                <span className="text-[11px] sm:text-xs text-gray-500 font-bold">نرخ پاسخ‌دهی</span>
              </div>
              <div className="p-4 bg-[#F9F8F6] rounded-2xl border border-[#EADFD5] text-center shadow-xs">
                <span className="block text-xl sm:text-2xl font-black text-gray-900 mb-0.5">
                  {toPersianDigits(currentUser.member_since_year || '۱۴۰۴')}
                </span>
                <span className="text-[11px] sm:text-xs text-gray-500 font-bold">سال عضویت در همجا</span>
              </div>
            </div>

            {/* Profile Bio Headline */}
            {currentUser.bio_headline && (
              <div className="p-4 sm:p-5 bg-[#FBF4F0] rounded-2xl border border-[#C25E38]/20 mb-6 flex items-start gap-3">
                <div className="text-2xl text-[#C25E38] font-serif shrink-0 leading-none">«</div>
                <p className="text-xs sm:text-sm font-semibold text-gray-800 leading-relaxed italic">
                  {currentUser.bio_headline}
                </p>
                <div className="text-2xl text-[#C25E38] font-serif shrink-0 leading-none mr-auto">»</div>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Box 1: Personal & Contact Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-black text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-100">
                  <User className="w-4 h-4 text-[#C25E38]" />
                  <span>اطلاعات فردی و ارتباطی</span>
                </h3>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      شماره تماس:
                    </span>
                    <span className="font-bold text-gray-800 font-mono">
                      {currentUser.phone || 'ثبت‌نشده'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-gray-400" />
                      اینستاگرام:
                    </span>
                    <span className="font-bold text-[#C25E38] font-mono">
                      {currentUser.instagram ? `@${currentUser.instagram}` : 'ثبت‌نشده'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      شهر سکونت:
                    </span>
                    <span className="font-bold text-gray-800">{currentUser.city}</span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                      تحصیلات یا شغل:
                    </span>
                    <span className="font-bold text-gray-800">
                      {currentUser.job_education || 'ثبت‌نشده'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
                      وضعیت احراز هویت:
                    </span>
                    <span className="font-bold">
                      {status === 'approved' && <span className="text-[#1E5647]">تأیید شده</span>}
                      {status === 'pending' && <span className="text-amber-600">در انتظار بررسی</span>}
                      {status === 'rejected' && <span className="text-red-600">رد شده</span>}
                      {status === 'unverified' && <span className="text-gray-500">عدم احراز</span>}
                    </span>
                  </div>
                </div>
              </div>

              {/* Box 2: Hosting Capability */}
              <div className="space-y-4">
                <h3 className="text-sm font-black text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-100">
                  <HomeIcon className="w-4 h-4 text-[#1E5647]" />
                  <span>شرایط و امکانات میزبانی</span>
                </h3>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-500">نقش در همجا:</span>
                    <span className="font-bold text-gray-800">{roleLabel}</span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-500">حداکثر ظرفیت مهمان:</span>
                    <span className="font-bold text-gray-800">
                      {currentUser.max_guests ? `${currentUser.max_guests} نفر` : 'مشخص‌نشده'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-500">وضعیت خواب:</span>
                    <span className="font-bold text-gray-800">{sleepingLabel}</span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-500">ترجیح پذیرش مهمان:</span>
                    <span className="font-bold text-gray-800">{guestPrefLabel}</span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-gray-500">آمادگی میزبانی:</span>
                    <span className="font-bold text-[#1E5647]">
                      {currentUser.hosting_status === 'ready_for_hosting' ? 'آماده میزبانی' : 'غیرفعال'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* House Rules */}
            {currentUser.house_rules && currentUser.house_rules.length > 0 && (
              <div className="mt-6 pt-5 border-t border-gray-100">
                <h4 className="text-xs font-black text-gray-800 mb-2.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#C25E38]" />
                  <span>قوانین خانه:</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentUser.house_rules.map((rule, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-[#F9F8F6] text-gray-700 text-xs rounded-xl border border-[#EADFD5]"
                    >
                      ✓ {rule}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Traveler Destination & Dates (If Traveler) */}
            {(currentUser.target_destination || currentUser.target_travel_dates) && (
              <div className="mt-5 pt-5 border-t border-gray-100">
                <h4 className="text-xs font-black text-sky-800 mb-2.5 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-sky-600" />
                  <span>برنامه و مقصد سفر مسافر:</span>
                </h4>
                <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs text-sky-950 flex flex-wrap gap-4">
                  {currentUser.target_destination && (
                    <span className="font-bold flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#C25E38]" />
                      مقصد مدنظر: {currentUser.target_destination}
                    </span>
                  )}
                  {currentUser.target_travel_dates && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-sky-700" />
                      بازه زمانی سفر: {currentUser.target_travel_dates}
                    </span>
                  )}
                  {currentUser.target_guests_count && (
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-sky-700" />
                      تعداد همراهان: {currentUser.target_guests_count} نفر
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Interests & Lifestyle */}
            <div className="mt-5 pt-5 border-t border-gray-100">
              <h4 className="text-xs font-black text-gray-800 mb-2.5 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#C25E38]" />
                <span>علاقه‌مندی‌ها و سبک زندگی:</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentUser.interests && currentUser.interests.length > 0 ? (
                  currentUser.interests.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-[#FBF4F0] text-[#C25E38] text-xs font-semibold rounded-xl border border-[#C25E38]/20"
                    >
                      #{tag}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400">علاقه‌مندی ثبت نشده است (از دکمه ویرایش اضافه کنید)</span>
                )}
              </div>
            </div>

            {/* Languages & Destinations */}
            <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-black text-gray-800 mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#1E5647]" />
                  <span>زبان‌های مسلط:</span>
                </h4>
                <p className="text-xs text-gray-700 font-medium">
                  {currentUser.languages && currentUser.languages.length > 0
                    ? currentUser.languages.join(' · ')
                    : 'فارسی (مادری)'}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-black text-gray-800 mb-1.5 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#C25E38]" />
                  <span>مقصدهای محبوب من:</span>
                </h4>
                <p className="text-xs text-gray-700 font-medium">
                  {currentUser.favorite_destinations && currentUser.favorite_destinations.length > 0
                    ? currentUser.favorite_destinations.join(' · ')
                    : 'هنوز مقصدی ثبت نشده است'}
                </p>
              </div>
            </div>

            {/* Interests & About Me */}
            {currentUser.about_me && (
              <div className="mt-5 pt-5 border-t border-gray-100">
                <h4 className="text-xs font-black text-gray-800 mb-2 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#C25E38]" />
                  <span>درباره من:</span>
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed bg-[#F9F8F6] p-4 rounded-2xl border border-[#EADFD5]">
                  {currentUser.about_me}
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Global Verification Modal */}
      <VerificationModal
        isOpen={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        reason={currentUser.rejection_reason}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
    </div>
  );
}
