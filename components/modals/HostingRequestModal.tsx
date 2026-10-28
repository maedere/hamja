'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Calendar, Users, Send, ShieldCheck, HeartHandshake } from 'lucide-react';
import { Profile } from '@/types/database';

interface HostingRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  host: Profile;
}

export default function HostingRequestModal({ isOpen, onClose, host }: HostingRequestModalProps) {
  const router = useRouter();
  const [startDate, setStartDate] = useState('۱۴۰۵/۰۷/۱۰');
  const [endDate, setEndDate] = useState('۱۴۰۵/۰۷/۱۳');
  const [guestCount, setGuestCount] = useState(1);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    setTimeout(() => {
      setIsSending(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        router.push('/requests');
      }, 1400);
    }, 800);
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
            <h3 className="text-lg font-bold text-[#1F2937]">درخواست میزبانی و ارتباط با {host.full_name}</h3>
            <p className="text-xs text-[#6B7280]">
              میزبان در {host.city} · پاسخ‌دهی {host.response_rate_percent}٪
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
              <span>از سفرت بگو و معرفی کن</span>
              <span className="text-[10px] text-gray-400 font-normal">شروع یک دوستی تازه</span>
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="سلام سارا جان، من برای آشنایی با اصفهان و گپ و گفت به شهر زیبای شما سفر می‌کنم..."
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
              <span className="text-xs">در حال ارسال پیام و درخواست...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>ارسال درخواست میزبانی</span>
              </>
            )}
          </button>
        </form>

        {isSuccess && (
          <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-[#1E5647] text-white flex items-center justify-center mb-4">
              <HeartHandshake className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-gray-800">درخواست شما با موفقیت ارسال شد!</h4>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              در حال انتقال به صندوق درخواست‌ها برای پیگیری پاسخ میزبان...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
