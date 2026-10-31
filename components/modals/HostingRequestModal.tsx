'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Calendar, Users, Send, ShieldCheck, HeartHandshake } from 'lucide-react';
import { Profile } from '@/types/database';
import { useAuth } from '@/lib/auth-context';

interface HostingRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  host: Profile;
  mode?: 'request_stay' | 'offer_hosting';
}

export default function HostingRequestModal({
  isOpen,
  onClose,
  host,
  mode = 'request_stay',
}: HostingRequestModalProps) {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [startDate, setStartDate] = useState(host.target_travel_dates || '');
  const [endDate, setEndDate] = useState('');
  const [guestCount, setGuestCount] = useState(host.target_guests_count || 1);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const isSelf = !!(currentUser && host && currentUser.id === host.id);
  const isOffering = mode === 'offer_hosting';

  if (isSelf) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 text-right border border-[#EADFD5] space-y-4">
          <button
            onClick={onClose}
            className="absolute top-6 left-6 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            aria-label="بستن"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-gray-900 text-center">ارسال درخواست به خود امکان‌پذیر نیست</h3>
          <p className="text-xs text-gray-600 leading-relaxed text-center">
            این حساب متعلق به شماست. اعضای همجا به یکدیگر درخواست ارسال می‌کنند و امکان ارسال درخواست یا پیشنهاد به خود وجود ندارد.
          </p>
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-2xl text-xs transition-colors"
          >
            متوجه شدم
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const payload = {
        sender_id: currentUser?.id || 'guest-current-user',
        sender_name: currentUser?.full_name || 'کاربر مهمان',
        sender_avatar: currentUser?.avatar_url,
        sender_city: currentUser?.city || 'تهران',
        receiver_id: host.id,
        receiver_name: host.full_name,
        receiver_avatar: host.avatar_url,
        receiver_city: host.city,
        start_date: startDate || '۱۴۰۵/۰۸/۱۰',
        end_date: endDate || '۱۴۰۵/۰۸/۱۴',
        guest_count: guestCount,
        message,
        status: 'pending',
        request_type: isOffering ? 'host_invitation' : 'stay_request',
        created_at: new Date().toLocaleDateString('fa-IR'),
      };

      if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
        await fetch('/api/requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
    } catch (err) {
      console.error('Error submitting request to API:', err);
    } finally {
      setIsSending(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        router.push('/requests');
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 text-right overflow-hidden border border-[#EADFD5]">
        <button
          onClick={onClose}
          className="absolute top-6 left-6 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="بستن"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <img
            src={host.avatar_url}
            alt={host.full_name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-[#C25E38]/20"
          />
          <div>
            <h3 className="text-lg font-bold text-[#1F2937]">
              {isOffering
                ? `پیشنهاد میزبانی به ${host.full_name} (دعوت به خانه شما)`
                : `درخواست میزبانی و ارتباط با ${host.full_name}`}
            </h3>
            <p className="text-xs text-[#6B7280]">
              {isOffering
                ? `این کاربر قصد سفر دارد و به دنبال میزبان است · پاسخ‌دهی ${host.response_rate_percent}٪`
                : `میزبان در ${host.city} · پاسخ‌دهی ${host.response_rate_percent}٪`}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dates Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#C25E38]" />
                تاریخ ورود
              </label>
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="۱۴۰۵/۰۷/۱۰"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C25E38] focus:border-transparent outline-none text-center font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#C25E38]" />
                تاریخ خروج
              </label>
              <input
                type="text"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="۱۴۰۵/۰۷/۱۳"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C25E38] focus:border-transparent outline-none text-center font-medium"
                required
              />
            </div>
          </div>

          {/* Guest Count */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#C25E38]" />
              تعداد مهمانان
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGuestCount(1)}
                className={`py-2 px-3 text-xs rounded-xl font-medium border transition-colors ${
                  guestCount === 1
                    ? 'border-[#C25E38] bg-[#FBF4F0] text-[#C25E38]'
                    : 'border-gray-200 text-gray-600'
                }`}
              >
                ۱ نفر (تنها سفر می‌کنم)
              </button>
              <button
                type="button"
                onClick={() => setGuestCount(2)}
                className={`py-2 px-3 text-xs rounded-xl font-medium border transition-colors ${
                  guestCount === 2
                    ? 'border-[#C25E38] bg-[#FBF4F0] text-[#C25E38]'
                    : 'border-gray-200 text-gray-600'
                }`}
              >
                ۲ نفر (همراه با همسفر)
              </button>
            </div>
          </div>

          {/* Message Area */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center justify-between">
              <span>{isOffering ? 'پیام دعوت و معرفی شرایط اقامت در خانه شما' : 'از سفرت بگو و معرفی کن'}</span>
              <span className="text-[10px] text-gray-400 font-normal">شروع یک دوستی تازه</span>
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                isOffering
                  ? `سلام ${host.full_name.split(' ')[0]} عزیز! دیدم قصد سفر داری، خوشحال می‌شم در خانه‌ام میزبان شما باشم و با هم گپ بزنیم...`
                  : `سلام ${host.full_name.split(' ')[0]} عزیز! من برای سفر و آشنایی با شهر زیبای شما می‌آیم و خوشحال می‌شم مهمان شما باشم...`
              }
              className="w-full p-3 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C25E38] focus:border-transparent outline-none leading-relaxed"
              required
            />
          </div>

          {/* Privacy Note */}
          <div className="p-3 rounded-xl bg-[#F9F8F6] border border-[#EADFD5] text-[11px] text-gray-600 flex items-start gap-2 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-[#1E5647] shrink-0 mt-0.5" />
            <span>
              جهت حفظ حریم خصوصی اعضا، نشانی دقیق خانه و شماره تماس پس از تایید دوطرفه میزبان و مهمان در دسترس قرار خواهد گرفت.
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSending}
            className="w-full py-3.5 bg-[#C25E38] hover:bg-[#A84E2D] text-white font-semibold rounded-2xl shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSending ? (
              <span className="text-xs">در حال ارسال پیام...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{isOffering ? 'ارسال پیشنهاد و دعوت به میزبانی' : 'ارسال درخواست میزبانی'}</span>
              </>
            )}
          </button>
        </form>

        {isSuccess && (
          <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-[#1E5647] text-white flex items-center justify-center mb-4">
              <HeartHandshake className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-gray-800">
              {isOffering ? 'پیشنهاد میزبانی شما با موفقیت ارسال شد!' : 'درخواست شما با موفقیت ارسال شد!'}
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              {isOffering
                ? 'پیام شما به عنوان دعوت به اقامت در صندوق درخواست‌ها ثبت گردید.'
                : 'در حال انتقال به صندوق درخواست‌ها برای پیگیری پاسخ میزبان...'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
