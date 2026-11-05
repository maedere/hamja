'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Phone, MapPin, MessageSquare, AlertCircle } from 'lucide-react';
import { HostingRequest, UserProfile } from '@/types/database';
import { toPersianDigits, getAvatarUrl } from '@/lib/persian-utils';

interface AcceptRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: HostingRequest | null;
  currentUser: UserProfile | null;
  onConfirm: (requestId: string, address: string, phone: string, note?: string) => Promise<void>;
}

export default function AcceptRequestModal({
  isOpen,
  onClose,
  request,
  currentUser,
  onConfirm,
}: AcceptRequestModalProps) {
  const [address, setAddress] = useState(
    currentUser?.city
      ? `${currentUser.city}، خیابان اصلی، پلاک ۱۰ (نشانی برای مسافر ارسال می‌شود)`
      : 'تهران، خیابان ولیعصر، بالاتر از پارک ساعی، کوچه گلستان، پلاک ۵'
  );
  const [phone, setPhone] = useState(currentUser?.phone || '۰۹۱۲۳۴۵۶۷۸۹');
  const [note, setNote] = useState(
    'سلام و درود! قدمتون روی چشم. خوشحال می‌شم در این سفر میزبان شما باشم. لطفاً جهت هماهنگی ساعت رسیدن تماس بگیرید.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !request) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim() || !phone.trim()) {
      alert('لطفاً نشانی اقامتگاه و شماره تماس را وارد فرمایید.');
      return;
    }
    setIsSubmitting(true);
    try {
      await onConfirm(request.id, address.trim(), phone.trim(), note.trim());
      onClose();
    } catch (err: any) {
      alert(err.message || 'خطا در تایید درخواست.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-right">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden border border-[#EADFD5] max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 left-6 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="بستن"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className="w-12 h-12 rounded-2xl bg-[#EBF5F1] text-[#1E5647] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              پذیرش درخواست {request.sender_name}
            </h3>
            <p className="text-xs text-gray-500">
              اقامت پیشنهادی: {toPersianDigits(request.start_date)} تا {toPersianDigits(request.end_date)} ({toPersianDigits(request.guest_count)} نفر)
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Privacy Note */}
          <div className="p-3.5 rounded-2xl bg-[#EBF5F1]/80 border border-[#1E5647]/20 text-[11px] text-gray-700 flex items-start gap-2.5 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-[#1E5647] shrink-0 mt-0.5" />
            <span>
              شماره تماس و نشانی شما تنها پس از تایید در دسترس <strong>{request.sender_name}</strong> قرار خواهد گرفت و برای عموم نمایش داده نمی‌شود.
            </span>
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#1E5647]" />
              <span>شماره تماس مستقیم شما جهت هماهنگی مسافر</span>
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
              dir="ltr"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E5647] focus:border-transparent outline-none text-right font-medium"
              required
            />
            <p className="text-[10px] text-gray-400 mt-1">مسافر می‌تواند با این شماره با شما تماس بگیرد یا پیام بفرستد.</p>
          </div>

          {/* Address Field */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#1E5647]" />
              <span>نشانی دقیق خانه یا محل قرار در شهر {currentUser?.city || request.receiver_city}</span>
            </label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="نشانی پستی دقیق، کوچه، پلاک و راهنمای دسترسی..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E5647] focus:border-transparent outline-none leading-relaxed"
              required
            />
          </div>

          {/* Host Welcome Note */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#1E5647]" />
              <span>پیام خوش‌آمدگویی یا راهنمایی برای مسافر</span>
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="پیامی دوستانه برای زمان رسیدن، همراه داشتن مدارک یا هر نکته ضروری..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E5647] focus:border-transparent outline-none leading-relaxed"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-[#1E5647] hover:bg-[#164337] text-white text-xs sm:text-sm font-bold rounded-2xl shadow transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'در حال ثبت و ارسال...' : 'تایید نهایی و پذیرش درخواست'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="py-3 px-5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs sm:text-sm font-bold rounded-2xl transition-colors"
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
