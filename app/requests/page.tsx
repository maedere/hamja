'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  CheckCircle2,
  Clock,
  XCircle,
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
  Phone,
  PhoneCall,
  Copy,
  Check,
  Home,
  ArrowLeft,
  Sparkles,
  Star,
  Heart,
  ExternalLink,
  Compass,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import VerificationModal from '@/components/modals/VerificationModal';
import AcceptRequestModal from '@/components/modals/AcceptRequestModal';
import DeclineRequestModal from '@/components/modals/DeclineRequestModal';
import ReviewExperienceModal from '@/components/modals/ReviewExperienceModal';
import { useAuth } from '@/lib/auth-context';
import { HostingRequest } from '@/types/database';
import {
  toPersianDigits,
  getAvatarUrl,
  extractPhoneAndAddress,
  extractDeclineReason,
  extractReviewInfo,
  extractMutualReviews,
  SingleReviewData,
  MutualReviewsData,
} from '@/lib/persian-utils';

type StatusFilterType = 'all' | 'pending' | 'accepted' | 'completed' | 'declined';

export default function RequestsPage() {
  const { currentUser, isVerified, refreshRequestsCount, markRequestsAsSeen } = useAuth();
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent');
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('all');

  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [activeAcceptReq, setActiveAcceptReq] = useState<HostingRequest | null>(null);
  const [activeDeclineReq, setActiveDeclineReq] = useState<HostingRequest | null>(null);
  const [activeReviewReq, setActiveReviewReq] = useState<HostingRequest | null>(null);
  const [reviewRole, setReviewRole] = useState<'guest' | 'host'>('guest');

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [requests, setRequests] = useState<HostingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const formatPersianDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    if (dateStr.includes('۱۴۰') || dateStr.includes('140')) {
      return toPersianDigits(dateStr);
    }
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        return toPersianDigits(
          new Intl.DateTimeFormat('fa-IR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }).format(d)
        );
      }
    } catch (e) {
      // fallback
    }
    return toPersianDigits(dateStr);
  };

  const fetchRequests = async () => {
    try {
      if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
        const res = await fetch('/api/requests', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.requests)) {
            setRequests(data.requests);
          }
        }
      }
    } catch (e) {
      // fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    if (markRequestsAsSeen) {
      markRequestsAsSeen();
    }
  }, [currentUser, markRequestsAsSeen]);

  const handleCopyPhone = (phone: string, id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(phone);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Open Accept Modal
  const handleOpenAccept = (req: HostingRequest) => {
    if (currentUser?.verification_status !== 'approved') {
      if (currentUser?.verification_status === 'pending') {
        alert(
          'مدارک هویتی شما بارگذاری شده و در حال بررسی است. پس از تأیید نهایی احراز هویت توسط مدیر، امکان پذیرش درخواست فعال خواهد شد.'
        );
      } else {
        setShowVerifyModal(true);
      }
      return;
    }
    setActiveAcceptReq(req);
  };

  // Confirm Accept
  const handleConfirmAccept = async (
    requestId: string,
    address: string,
    phone: string,
    note?: string
  ) => {
    const addressPayload = JSON.stringify({ address, phone });
    const notePayload = note || 'پذیرفته شد.';

    setRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          return {
            ...req,
            status: 'accepted',
            exact_address_unlocked: addressPayload,
            host_response_note: notePayload,
          };
        }
        return req;
      })
    );

    try {
      await fetch(`/api/requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'accepted',
          exact_address_unlocked: addressPayload,
          host_response_note: notePayload,
        }),
      });
      await refreshRequestsCount();
    } catch (err) {
      console.error('Failed to accept request:', err);
    }
  };

  // Open Decline Modal
  const handleOpenDecline = (req: HostingRequest) => {
    setActiveDeclineReq(req);
  };

  // Confirm Decline
  const handleConfirmDecline = async (
    requestId: string,
    reason: string,
    note?: string
  ) => {
    const declinePayload = JSON.stringify({ reason, note });

    setRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          return {
            ...req,
            status: 'declined',
            host_response_note: declinePayload,
          };
        }
        return req;
      })
    );

    try {
      await fetch(`/api/requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'declined',
          host_response_note: declinePayload,
        }),
      });
      await refreshRequestsCount();
    } catch (err) {
      console.error('Failed to decline request:', err);
    }
  };

  // Open Review Modal
  const handleOpenReview = (req: HostingRequest, role: 'guest' | 'host') => {
    setActiveReviewReq(req);
    setReviewRole(role);
  };

  // Confirm Review & Complete Stay (Two-sided mutual review support)
  const handleConfirmReview = async (
    requestId: string,
    rating: number,
    comment: string,
    tags: string[]
  ) => {
    const targetReq = requests.find((r) => r.id === requestId);
    const existingMutual = extractMutualReviews(targetReq?.host_response_note);

    const singleReview: SingleReviewData = {
      rating,
      comment,
      tags,
      reviewer_id: currentUser?.id || 'user',
      reviewer_name: currentUser?.full_name || 'کاربر هم‌بام',
      reviewer_city: currentUser?.city || 'ایران',
      reviewer_avatar: currentUser?.avatar_url,
      target_user_id:
        reviewRole === 'guest'
          ? targetReq?.receiver_id || ''
          : targetReq?.sender_id || '',
      completed_at: new Date().toISOString(),
    };

    const updatedMutual: MutualReviewsData = {
      ...existingMutual,
      ...(reviewRole === 'guest'
        ? { guest_review: singleReview }
        : { host_review: singleReview }),
    };

    const reviewPayload = JSON.stringify({
      type: 'completed_reviews',
      guest_review: updatedMutual.guest_review,
      host_review: updatedMutual.host_review,
    });

    setRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          return {
            ...req,
            status: 'completed',
            host_response_note: reviewPayload,
          };
        }
        return req;
      })
    );

    try {
      await fetch(`/api/requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'completed',
          host_response_note: reviewPayload,
        }),
      });
      await refreshRequestsCount();
      alert('سپاس از شما! نظر و امتیاز شما با موفقیت ثبت شد و در پروفایل کاربر مقابل به عنوان تجربه تأییدشده نمایش می‌یابد.');
    } catch (err) {
      console.error('Failed to complete review:', err);
    }
  };

  // Filter requests by sender/receiver
  const sentRequests = requests.filter((r) => {
    if (!currentUser) return false;
    return (
      r.sender_id === currentUser.id ||
      (currentUser.username && r.sender_id === currentUser.username) ||
      (currentUser.phone && r.sender_id === currentUser.phone)
    );
  });

  const receivedRequests = requests.filter((r) => {
    if (!currentUser) return false;
    return (
      r.receiver_id === currentUser.id ||
      (currentUser.username && r.receiver_id === currentUser.username) ||
      (currentUser.phone && r.receiver_id === currentUser.phone)
    );
  });

  const currentTabList = activeTab === 'sent' ? sentRequests : receivedRequests;
  const filteredList = currentTabList.filter((r) => {
    if (statusFilter === 'all') return true;
    return r.status === statusFilter;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F8F6]">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="text-right mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBF4F0] text-[#C25E38] text-xs font-semibold mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>صندوق درخواست‌ها و هماهنگی سفر</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1F2937]">
            درخواست‌های میزبانی و ارتباط
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            پیگیری درخواست‌های اقامت، پذیرش مهمانان، دسترسی به شماره تماس مستقیم پس از تأیید و ثبت تجربه اقامت.
          </p>
        </div>

        {/* Verification Status Banner if not approved */}
        {currentUser && currentUser.verification_status !== 'approved' && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-right flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <p className="font-bold text-amber-800">
                {currentUser.verification_status === 'pending'
                  ? 'مدارک هویتی شما در انتظار بررسی کارشناسان است'
                  : 'حساب کاربری شما هنوز احراز هویت نشده است'}
              </p>
              <p className="text-amber-700 leading-relaxed">
                {currentUser.verification_status === 'pending'
                  ? 'مدارک شما دریافت شده و در حال بررسی است. برای حفظ امنیت اعضا، ارسال درخواست جدید یا تأیید نهایی میزبانی پس از تأیید فعال می‌شود.'
                  : 'برای امکان ارسال درخواست میزبانی به کاربران یا پذیرش مهمان در خانه، لطفاً مدارک هویتی خود را ارسال فرمایید.'}
              </p>
            </div>
          </div>
        )}

        {/* If user is not logged in */}
        {!currentUser ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-[#EADFD5] shadow-sm max-w-lg mx-auto space-y-4 my-8">
            <div className="w-16 h-16 rounded-2xl bg-[#FBF4F0] text-[#C25E38] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">ورود به حساب کاربری</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              جهت مشاهده درخواست‌های ارسالی یا دریافتی، هماهنگی اقامت با میزبانان و دسترسی به اطلاعات تماس، لطفاً وارد حساب کاربری خود شوید.
            </p>
            <div className="pt-2">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#C25E38] hover:bg-[#A84E2D] text-white text-xs font-bold rounded-2xl shadow transition-colors"
              >
                ورود یا ثبت‌نام در هم‌بام
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Tab switch */}
            <div className="flex items-center gap-3 border-b border-[#EADFD5] mb-6 pb-1">
              <button
                onClick={() => {
                  setActiveTab('sent');
                  setStatusFilter('all');
                }}
                className={`px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === 'sent'
                    ? 'border-[#C25E38] text-[#C25E38]'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <span>درخواست‌های ارسالی من (مسافر)</span>
                <span className="w-5 h-5 rounded-full bg-[#FBF4F0] text-[#C25E38] text-xs flex items-center justify-center font-bold">
                  {toPersianDigits(sentRequests.length)}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('received');
                  setStatusFilter('all');
                }}
                className={`px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === 'received'
                    ? 'border-[#C25E38] text-[#C25E38]'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <span>درخواست‌های دریافتی من (میزبان)</span>
                <span className="w-5 h-5 rounded-full bg-[#EBF5F1] text-[#1E5647] text-xs flex items-center justify-center font-bold">
                  {toPersianDigits(receivedRequests.length)}
                </span>
              </button>
            </div>

            {/* Status Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none text-right">
              <span className="text-xs font-bold text-gray-400 shrink-0 ml-1">فیلتر وضعیت:</span>
              {[
                { id: 'all', label: 'همه' },
                { id: 'pending', label: 'در انتظار پاسخ' },
                { id: 'accepted', label: 'پذیرفته‌شده (آماده تماس)' },
                { id: 'completed', label: 'اقامت‌های پایان‌یافته' },
                { id: 'declined', label: 'رد شده' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id as StatusFilterType)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    statusFilter === f.id
                      ? 'bg-[#1F2937] text-white shadow-xs'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-[#EADFD5]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* List Content */}
            <div className="space-y-6 text-right">
              {filteredList.length > 0 ? (
                filteredList.map((req) => {
                  const phoneAddress = extractPhoneAndAddress(req.exact_address_unlocked);
                  const declineInfo = extractDeclineReason(req.host_response_note);
                  const reviewInfo = extractReviewInfo(req.host_response_note);

                  return (
                    <div
                      key={req.id}
                      className="bg-white rounded-3xl p-6 border border-[#EADFD5] shadow-sm space-y-5"
                    >
                      {/* Top Row: User info and Status Badge */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <img
                            src={getAvatarUrl(
                              activeTab === 'sent' ? req.receiver_avatar : req.sender_avatar
                            )}
                            alt={activeTab === 'sent' ? req.receiver_name : req.sender_name}
                            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#EADFD5] bg-[#F4EFEA]"
                          />
                          <div>
                            <h3 className="text-base font-bold text-gray-800">
                              {activeTab === 'sent'
                                ? `میزبان: ${req.receiver_name}`
                                : `مسافر: ${req.sender_name}`}
                            </h3>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3.5 h-3.5 text-[#C25E38]" />
                              {activeTab === 'sent' ? req.receiver_city : `از شهر ${req.sender_city}`}
                            </p>
                          </div>
                        </div>

                        {/* Status Badges */}
                        <div>
                          {req.status === 'accepted' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EBF5F1] text-[#1E5647] text-xs font-bold border border-[#1E5647]/20">
                              <CheckCircle2 className="w-4 h-4" />
                              {activeTab === 'sent'
                                ? 'پذیرفته‌شده · اطلاعات تماس بازگشایی شد'
                                : 'تأیید شده توسط شما'}
                            </span>
                          )}
                          {req.status === 'completed' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                              سفر و اقامت پایان‌یافته · تجربه ثبت شد
                            </span>
                          )}
                          {req.status === 'pending' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                              <Clock className="w-4 h-4" />
                              {activeTab === 'sent' ? 'در انتظار پاسخ میزبان' : 'در انتظار تصمیم شما'}
                            </span>
                          )}
                          {req.status === 'declined' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                              <XCircle className="w-4 h-4" />
                              {activeTab === 'sent' ? 'رد شده توسط میزبان' : 'رد شده توسط شما'}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stay Dates & Count Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#F9F8F6] p-4 rounded-2xl border border-gray-100 text-xs text-gray-700">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#C25E38] shrink-0" />
                          <span>
                            تاریخ سفر: {toPersianDigits(req.start_date)} تا{' '}
                            {toPersianDigits(req.end_date)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#C25E38] shrink-0" />
                          <span>تعداد مهمانان: {toPersianDigits(req.guest_count)} نفر</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#C25E38] shrink-0" />
                          <span>تاریخ ثبت: {formatPersianDate(req.created_at)}</span>
                        </div>
                      </div>

                      {/* Travel Message */}
                      <div className="text-xs text-gray-600 bg-gray-50 p-3.5 rounded-2xl border border-gray-100 leading-relaxed">
                        <span className="font-bold text-gray-700 block mb-1">
                          {activeTab === 'sent' ? 'پیام ارسالی شما:' : 'پیام مسافر:'}
                        </span>
                        &ldquo;{req.message}&rdquo;
                      </div>

                      {/* CASE 1 & 2: ACCEPTED OR COMPLETED STAY (UNLOCKED CONTACT & MUTUAL REVIEWS) */}
                      {(req.status === 'accepted' || req.status === 'completed') && (() => {
                        const mutualReviews = extractMutualReviews(req.host_response_note);
                        const isGuest = activeTab === 'sent';
                        const myReview = isGuest ? mutualReviews.guest_review : mutualReviews.host_review;
                        const otherReview = isGuest ? mutualReviews.host_review : mutualReviews.guest_review;
                        const otherName = isGuest ? req.receiver_name : req.sender_name;
                        const hasMyReview = !!myReview;
                        const hasOtherReview = !!otherReview;

                        return (
                          <div className="p-5 rounded-2xl bg-[#EBF5F1] border border-[#1E5647]/30 space-y-4 animate-fade-in">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#1E5647]/15">
                              <div className="flex items-center gap-2 text-sm font-bold text-[#1E5647]">
                                <ShieldCheck className="w-5 h-5 text-[#1E5647]" />
                                <span>
                                  {isGuest
                                    ? 'اطلاعات تماس مستقیم و نشانی میزبان بازگشایی شد'
                                    : 'نشانی و شماره تماس شما با مسافر به اشتراک گذاشته شد'}
                                </span>
                              </div>
                              <span className="text-[11px] text-[#1E5647] font-semibold bg-white/70 px-2.5 py-1 rounded-full">
                                {req.status === 'completed' ? 'اقامت پایان‌یافته' : 'هماهنگی مستقیم'}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-800">
                              {/* Phone Box with Direct Actions */}
                              {phoneAddress.phone && (
                                <div className="bg-white p-4 rounded-xl border border-[#1E5647]/20 space-y-2.5">
                                  <div className="flex items-center justify-between">
                                    <span className="text-gray-500 font-medium flex items-center gap-1.5">
                                      <Phone className="w-3.5 h-3.5 text-[#1E5647]" />
                                      <span>شماره تماس {isGuest ? 'میزبان' : 'مسافر'}:</span>
                                    </span>
                                    <span className="text-sm font-black text-gray-900 tracking-wider">
                                      {phoneAddress.phone}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 pt-1">
                                    <a
                                      href={`tel:${phoneAddress.phone.replace(/[^0-9]/g, '')}`}
                                      className="flex-1 py-2 bg-[#1E5647] hover:bg-[#164337] text-white font-bold rounded-lg text-center transition-colors flex items-center justify-center gap-1 text-[11px]"
                                    >
                                      <PhoneCall className="w-3 h-3" />
                                      <span>تماس تلفنی</span>
                                    </a>
                                    <button
                                      onClick={() => handleCopyPhone(phoneAddress.phone!, req.id)}
                                      className="py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors flex items-center gap-1 text-[11px]"
                                    >
                                      {copiedId === req.id ? (
                                        <>
                                          <Check className="w-3 h-3 text-emerald-600" />
                                          <span className="text-emerald-700">کپی شد!</span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="w-3 h-3" />
                                          <span>کپی شماره</span>
                                        </>
                                      )}
                                    </button>
                                    <a
                                      href={`sms:${phoneAddress.phone.replace(/[^0-9]/g, '')}`}
                                      className="py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors text-[11px]"
                                    >
                                      پیامک
                                    </a>
                                  </div>
                                </div>
                              )}

                              {/* Address Box */}
                              <div className="bg-white p-4 rounded-xl border border-[#1E5647]/20 space-y-1.5 flex flex-col justify-center">
                                <span className="text-gray-500 font-medium flex items-center gap-1.5">
                                  <Home className="w-3.5 h-3.5 text-[#1E5647]" />
                                  <span>نشانی دقیق اقامتگاه:</span>
                                </span>
                                <p className="font-bold text-gray-900 leading-relaxed text-xs">
                                  {phoneAddress.address || 'نشانی پس از تماس هماهنگ می‌شود.'}
                                </p>
                                {req.host_response_note && !req.host_response_note.startsWith('{') && (
                                  <p className="text-[11px] text-gray-500 pt-1 border-t border-gray-100 mt-1">
                                    یادداشت میزبان: &ldquo;{req.host_response_note}&rdquo;
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* MUTUAL REVIEWS SECTION */}
                            {(hasMyReview || hasOtherReview) && (
                              <div className="space-y-3 pt-2 border-t border-[#1E5647]/15">
                                <div className="flex items-center justify-between text-xs font-bold text-[#1E5647]">
                                  <span className="flex items-center gap-1.5">
                                    <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                                    <span>نظرات و امتیازهای ثبت‌شده برای این اقامت:</span>
                                  </span>
                                  {hasMyReview && hasOtherReview && (
                                    <span className="text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full">
                                      ثبت دوطرفه کامل
                                    </span>
                                  )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                  {/* My review */}
                                  {myReview && (
                                    <div className="bg-white/90 p-3.5 rounded-xl border border-emerald-200 space-y-1.5">
                                      <div className="flex items-center justify-between">
                                        <span className="font-bold text-gray-800 text-[11px]">
                                          نظر شما درباره {otherName}:
                                        </span>
                                        <div className="flex items-center gap-1 text-amber-600 font-black text-xs">
                                          <span>{toPersianDigits(myReview.rating)}</span>
                                          <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                                        </div>
                                      </div>
                                      <p className="text-gray-700 italic leading-relaxed text-[11px]">
                                        &ldquo;{myReview.comment}&rdquo;
                                      </p>
                                      {myReview.tags && myReview.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 pt-1">
                                          {myReview.tags.map((t) => (
                                            <span
                                              key={t}
                                              className="text-[10px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-100"
                                            >
                                              ✓ {t}
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Other person's review */}
                                  {otherReview && (
                                    <div className="bg-white/90 p-3.5 rounded-xl border border-emerald-200 space-y-1.5">
                                      <div className="flex items-center justify-between">
                                        <span className="font-bold text-gray-800 text-[11px]">
                                          نظر {otherName} درباره شما:
                                        </span>
                                        <div className="flex items-center gap-1 text-amber-600 font-black text-xs">
                                          <span>{toPersianDigits(otherReview.rating)}</span>
                                          <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                                        </div>
                                      </div>
                                      <p className="text-gray-700 italic leading-relaxed text-[11px]">
                                        &ldquo;{otherReview.comment}&rdquo;
                                      </p>
                                      {otherReview.tags && otherReview.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 pt-1">
                                          {otherReview.tags.map((t) => (
                                            <span
                                              key={t}
                                              className="text-[10px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-100"
                                            >
                                              ✓ {t}
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* REVIEW CALL-TO-ACTION (Visible for whoever hasn't reviewed yet!) */}
                            {!hasMyReview ? (
                              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/70 p-3.5 rounded-xl border border-[#1E5647]/20">
                                <div className="text-xs text-gray-700">
                                  <span className="font-bold text-gray-900 block">
                                    {hasOtherReview
                                      ? `${otherName} نظر و امتیاز خود را ثبت کرد. حالا نوبت شماست!`
                                      : 'آیا اقامت انجام شد و سفر به پایان رسید؟'}
                                  </span>
                                  <span className="text-[11px] text-gray-500">
                                    با ثبت نظر و امتیاز، تجربه تأییدشده در پروفایل {otherName} ثبت خواهد شد.
                                  </span>
                                </div>
                                <button
                                  onClick={() =>
                                    handleOpenReview(req, isGuest ? 'guest' : 'host')
                                  }
                                  className="w-full sm:w-auto px-4 py-2.5 bg-[#C25E38] hover:bg-[#A84E2D] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 shrink-0"
                                >
                                  <Heart className="w-3.5 h-3.5 fill-white" />
                                  <span>
                                    {isGuest
                                      ? 'مهمان شدم (ثبت پایان سفر و امتیازدهی)'
                                      : 'میزبان شدم (ثبت پایان میزبانی و امتیازدهی)'}
                                  </span>
                                </button>
                              </div>
                            ) : !hasOtherReview ? (
                              <div className="p-3 bg-white/60 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                                <span className="flex items-center gap-1.5 font-medium">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                  <span>شما نظر خود را ثبت کردید. در انتظار ثبت نظر توسط {otherName}...</span>
                                </span>
                              </div>
                            ) : null}
                          </div>
                        );
                      })()}

                      {/* CASE 3: DECLINED REQUEST WITH REASON & HELPFUL ALTERNATIVES */}
                      {req.status === 'declined' && (
                        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-950 space-y-3 animate-fade-in">
                          <div className="flex items-center gap-2 font-bold text-rose-800">
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                            <span>
                              {activeTab === 'sent'
                                ? 'متأسفانه میزبان امکان پذیرش این درخواست را نداشت.'
                                : 'این درخواست توسط شما رد شد.'}
                            </span>
                          </div>

                          {/* Decline Reason Display */}
                          <div className="bg-white/80 p-3.5 rounded-xl border border-rose-200/80 space-y-1.5">
                            <p className="text-gray-700">
                              <span className="font-bold text-rose-900">علت اعلام‌شده: </span>
                              <span className="font-semibold">{declineInfo.reason}</span>
                            </p>
                            {declineInfo.note && (
                              <p className="text-[11px] text-gray-500">
                                یادداشت دوستانه میزبان: &ldquo;{declineInfo.note}&rdquo;
                              </p>
                            )}
                          </div>

                          {/* Encouraging Explore link for Traveler */}
                          {activeTab === 'sent' && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1 border-t border-rose-200/50">
                              <span className="text-[11px] text-gray-600">
                                نگران نباشید! میزبانان متعددی در شهر {req.receiver_city} حضور دارند.
                              </span>
                              <Link
                                href={`/explore?city=${encodeURIComponent(req.receiver_city)}`}
                                className="px-3.5 py-1.5 bg-white hover:bg-gray-50 text-[#C25E38] border border-[#C25E38]/30 font-bold rounded-xl text-xs transition-colors flex items-center gap-1 shrink-0"
                              >
                                <Compass className="w-3.5 h-3.5" />
                                <span>مشاهده سایر میزبانان در {req.receiver_city}</span>
                              </Link>
                            </div>
                          )}
                        </div>
                      )}

                      {/* CASE 4: PENDING HOST ACTIONS (Only in Received tab) */}
                      {activeTab === 'received' && req.status === 'pending' && (
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                          <button
                            onClick={() => handleOpenAccept(req)}
                            className="px-5 py-2.5 bg-[#1E5647] hover:bg-[#164337] text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>پذیرش درخواست و اشتراک نشانی و شماره تماس</span>
                          </button>

                          <button
                            onClick={() => handleOpenDecline(req)}
                            className="px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>رد محترمانه درخواست با ذکر علت</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-[#EADFD5]">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-gray-700">
                    {statusFilter === 'all'
                      ? activeTab === 'sent'
                        ? 'هنوز درخواستی ارسال نکرده‌اید'
                        : 'درخواست دریافتی جدیدی ندارید'
                      : 'درخواستی با این وضعیت یافت نشد'}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                    {activeTab === 'sent'
                      ? 'از طریق صفحه کاوش اعضا می‌توانید میزبانان شهرهای مختلف را ببینید و پیام بفرستید.'
                      : 'پروفایل خود را کامل نگه دارید تا مسافران علاقه‌مند به شهر شما برایتان درخواست بفرستند.'}
                  </p>
                  {activeTab === 'sent' && (
                    <Link
                      href="/explore"
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#C25E38] text-white text-xs font-bold rounded-xl shadow mt-4"
                    >
                      <span>کاوش اعضا</span>
                      <ArrowLeft className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <Footer />

      {/* Accept Request Modal */}
      <AcceptRequestModal
        isOpen={!!activeAcceptReq}
        onClose={() => setActiveAcceptReq(null)}
        request={activeAcceptReq}
        currentUser={currentUser}
        onConfirm={handleConfirmAccept}
      />

      {/* Decline Request Modal */}
      <DeclineRequestModal
        isOpen={!!activeDeclineReq}
        onClose={() => setActiveDeclineReq(null)}
        request={activeDeclineReq}
        onConfirm={handleConfirmDecline}
      />

      {/* Review & Complete Experience Modal */}
      <ReviewExperienceModal
        isOpen={!!activeReviewReq}
        onClose={() => setActiveReviewReq(null)}
        request={activeReviewReq}
        reviewerRole={reviewRole}
        onConfirm={handleConfirmReview}
      />

      {/* Verification modal for unverified hosts */}
      <VerificationModal
        isOpen={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        reason="جهت امنیت جامعه هم‌بام و اطمینان از هویت میزبان قبل از پذیرش مسافر، ارسال تصویر کارت ملی و سلفی الزامی است."
        onComplete={() => {
          setShowVerifyModal(false);
          alert(
            'مدارک هویتی شما با موفقیت ثبت شد و در صف بررسی تیم هم‌بام قرار گرفت. پس از تأیید احراز هویت توسط مدیر، امکان پذیرش درخواست فعال خواهد شد.'
          );
        }}
      />
    </div>
  );
}
