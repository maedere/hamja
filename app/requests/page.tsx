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
  Home,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import VerificationModal from '@/components/modals/VerificationModal';
import { useAuth } from '@/lib/auth-context';
import { HostingRequest } from '@/types/database';
import { INITIAL_REQUESTS } from '@/lib/mock-data';

export default function RequestsPage() {
  const { currentUser, isVerified } = useAuth();
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent');
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [pendingAcceptReqId, setPendingAcceptReqId] = useState<string | null>(null);

  const [requests, setRequests] = useState<HostingRequest[]>([
    ...INITIAL_REQUESTS,
    {
      id: 'req-2',
      sender_id: 'behnam-rezaei',
      sender_name: 'بهنام رضایی',
      sender_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      sender_city: 'بوشهر',
      receiver_id: 'guest-current-user',
      receiver_name: 'شما (میزبان در تهران)',
      receiver_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      receiver_city: 'تهران',
      start_date: '۱۴۰۵/۰۸/۰۱',
      end_date: '۱۴۰۵/۰۸/۰۴',
      guest_count: 1,
      message: 'درود بر شما، برای حضور در یک جشنواره موسیقی به تهران می‌آیم و خوشحال می‌شوم با هم گپی بزنیم.',
      status: 'pending',
      created_at: '۱۴۰۵/۰۷/۰۳',
    },
  ]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
          const res = await fetch('/api/requests');
          if (res.ok) {
            const data = await res.json();
            if (data.success && Array.isArray(data.requests) && data.requests.length > 0) {
              setRequests(data.requests);
            }
          }
        }
      } catch (e) {
        // fallback
      }
    };
    fetchRequests();
  }, []);

  const handleStatusChange = async (requestId: string, newStatus: 'accepted' | 'declined') => {
    if (newStatus === 'accepted' && !isVerified) {
      setPendingAcceptReqId(requestId);
      setShowVerifyModal(true);
      return;
    }

    const exactAddress =
      newStatus === 'accepted'
        ? (currentUser?.city ? `${currentUser.city}، آدرس دقیق پس از تایید نهایی اشتراک گذاشته شد.` : 'تهران، خیابان ولیعصر، بالاتر از پارک ساعی، کوچه گلستان، پلاک ۵')
        : undefined;

    setRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          return {
            ...req,
            status: newStatus,
            exact_address_unlocked: exactAddress,
          };
        }
        return req;
      })
    );

    try {
      if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
        await fetch(`/api/requests/${requestId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: newStatus,
            exact_address_unlocked: exactAddress,
          }),
        });
      }
    } catch (err) {
      console.error('Failed to update request status in API:', err);
    }
  };

  const currentUserId = currentUser?.id || 'guest-current-user';
  const sentRequests = requests.filter(
    (r) => r.sender_id === currentUserId || (currentUser && r.sender_id === currentUser.username)
  );
  const receivedRequests = requests.filter(
    (r) =>
      r.receiver_id === currentUserId ||
      (currentUser && r.receiver_id === currentUser.username) ||
      r.receiver_id === 'guest-current-user'
  );

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
            پیگیری درخواست‌های اقامت، پذیرش مهمانان و دسترسی به اطلاعات تماس و نشانی خانه پس از تایید دوطرفه.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-3 border-b border-[#EADFD5] mb-8 pb-1">
          <button
            onClick={() => setActiveTab('sent')}
            className={`px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'sent'
                ? 'border-[#C25E38] text-[#C25E38]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <span>درخواست‌های ارسالی من (مسافر)</span>
            <span className="w-5 h-5 rounded-full bg-[#FBF4F0] text-[#C25E38] text-xs flex items-center justify-center font-semibold">
              {sentRequests.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('received')}
            className={`px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'received'
                ? 'border-[#C25E38] text-[#C25E38]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <span>درخواست‌های دریافتی من (میزبان)</span>
            <span className="w-5 h-5 rounded-full bg-[#EBF5F1] text-[#1E5647] text-xs flex items-center justify-center font-semibold">
              {receivedRequests.length}
            </span>
          </button>
        </div>

        {/* Sent Requests List */}
        {activeTab === 'sent' && (
          <div className="space-y-6 text-right">
            {sentRequests.length > 0 ? (
              sentRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-3xl p-6 border border-[#EADFD5] shadow-sm space-y-5"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <img
                        src={req.receiver_avatar}
                        alt={req.receiver_name}
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#EADFD5]"
                      />
                      <div>
                        <h3 className="text-base font-bold text-gray-800">
                          میزبان: {req.receiver_name}
                        </h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-[#C25E38]" />
                          {req.receiver_city}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {req.status === 'accepted' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#EBF5F1] text-[#1E5647] text-xs font-bold border border-[#1E5647]/20">
                          <CheckCircle2 className="w-4 h-4" />
                          پذیرفته‌شده توسط میزبان
                        </span>
                      )}
                      {req.status === 'pending' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                          <Clock className="w-4 h-4" />
                          در انتظار پاسخ میزبان
                        </span>
                      )}
                      {req.status === 'declined' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                          <XCircle className="w-4 h-4" />
                          رد شده
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stay Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#F9F8F6] p-4 rounded-2xl border border-gray-100 text-xs text-gray-700">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#C25E38]" />
                      <span>تاریخ سفر: {req.start_date} تا {req.end_date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#C25E38]" />
                      <span>تعداد مهمانان: {req.guest_count} نفر</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#C25E38]" />
                      <span>تاریخ ثبت: {req.created_at}</span>
                    </div>
                  </div>

                  {/* Intro message */}
                  <div className="text-xs text-gray-600 bg-gray-50 p-3.5 rounded-2xl border border-gray-100 leading-relaxed">
                    <span className="font-bold text-gray-700 block mb-1">پیام ارسالی شما:</span>
                    &ldquo;{req.message}&rdquo;
                  </div>

                  {/* UNLOCKED ADDRESS (The core trust feature) */}
                  {req.status === 'accepted' && req.exact_address_unlocked && (
                    <div className="p-5 rounded-2xl bg-[#EBF5F1] border border-[#1E5647]/30 space-y-3 animate-fade-in">
                      <div className="flex items-center gap-2 text-sm font-bold text-[#1E5647]">
                        <ShieldCheck className="w-5 h-5 text-[#1E5647]" />
                        <span>نشانی دقیق و اطلاعات تماس خانه بازگشایی شد</span>
                      </div>
                      <div className="space-y-1.5 text-xs text-gray-700 leading-relaxed">
                        <p className="flex items-start gap-2">
                          <Home className="w-4 h-4 text-[#1E5647] shrink-0 mt-0.5" />
                          <span className="font-semibold">{req.exact_address_unlocked}</span>
                        </p>
                        {req.host_response_note && (
                          <p className="text-[11px] text-gray-600 pt-1">
                            یادداشت میزبان: &ldquo;{req.host_response_note}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#EADFD5]">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h4 className="text-base font-bold text-gray-700">هنوز درخواستی ارسال نکرده‌اید</h4>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  از طریق صفحه کاوش اعضا می‌توانید میزبانان شهرهای مختلف را ببینید و با آن‌ها آشنا شوید.
                </p>
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#C25E38] text-white text-xs font-bold rounded-xl shadow mt-4"
                >
                  <span>کاوش اعضا</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Received Requests List (For Host) */}
        {activeTab === 'received' && (
          <div className="space-y-6 text-right">
            {receivedRequests.length > 0 ? (
              receivedRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-3xl p-6 border border-[#EADFD5] shadow-sm space-y-5"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <img
                        src={req.sender_avatar}
                        alt={req.sender_name}
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#EADFD5]"
                      />
                      <div>
                        <h3 className="text-base font-bold text-gray-800">
                          مسافر: {req.sender_name}
                        </h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-[#C25E38]" />
                          از شهر {req.sender_city}
                        </p>
                      </div>
                    </div>

                    <div>
                      {req.status === 'accepted' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#EBF5F1] text-[#1E5647] text-xs font-bold border border-[#1E5647]/20">
                          <CheckCircle2 className="w-4 h-4" />
                          تایید شده توسط شما
                        </span>
                      )}
                      {req.status === 'pending' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                          <Clock className="w-4 h-4" />
                          در انتظار تصمیم شما
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#F9F8F6] p-4 rounded-2xl border border-gray-100 text-xs text-gray-700">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#C25E38]" />
                      <span>تاریخ اقامت پیشنهادی: {req.start_date} تا {req.end_date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#C25E38]" />
                      <span>تعداد مهمانان: {req.guest_count} نفر</span>
                    </div>
                  </div>

                  {/* Intro message */}
                  <div className="text-xs text-gray-600 bg-gray-50 p-3.5 rounded-2xl border border-gray-100 leading-relaxed">
                    <span className="font-bold text-gray-700 block mb-1">پیام مسافر:</span>
                    &ldquo;{req.message}&rdquo;
                  </div>

                  {/* Host Actions */}
                  {req.status === 'pending' && (
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={() => handleStatusChange(req.id, 'accepted')}
                        className="px-5 py-2.5 bg-[#1E5647] hover:bg-[#164337] text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>پذیرش درخواست و اشتراک نشانی خانه</span>
                      </button>

                      <button
                        onClick={() => handleStatusChange(req.id, 'declined')}
                        className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors"
                      >
                        رد محترمانه
                      </button>
                    </div>
                  )}

                  {req.status === 'accepted' && (
                    <div className="p-3.5 rounded-xl bg-[#EBF5F1] text-xs text-[#1E5647] flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
                      <span>
                        نشانی خانه شما برای {req.sender_name} نمایان شد تا برای زمان رسیدن با شما هماهنگ شود.
                      </span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#EADFD5]">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h4 className="text-base font-bold text-gray-700">درخواست دریافتی جدیدی ندارید</h4>
                <p className="text-xs text-gray-500 mt-1">
                  پروفایل خود را کامل و به روز نگه دارید تا مسافران علاقه‌مند به شهر شما پیام بفرستند.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
      
      {/* Verification modal for unverified hosts */}
      <VerificationModal
        isOpen={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        reason="جهت امنیت جامعه همجا و اطمینان از هویت میزبان قبل از پذیرش مسافر، ارسال تصویر کارت ملی و سلفی الزامی است."
        onComplete={() => {
          setShowVerifyModal(false);
          if (pendingAcceptReqId) {
            handleStatusChange(pendingAcceptReqId, 'accepted');
            setPendingAcceptReqId(null);
          }
        }}
      />
    </div>
  );
}
