'use client';

import React, { useState } from 'react';
import { X, XCircle, HeartHandshake, AlertCircle } from 'lucide-react';
import { HostingRequest } from '@/types/database';
import { toPersianDigits } from '@/lib/persian-utils';

interface DeclineRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: HostingRequest | null;
  onConfirm: (requestId: string, reason: string, note?: string) => Promise<void>;
}

const PRESET_REASONS = [
  'در تاریخ‌های انتخابی در سفر هستم یا در خانه حضور ندارم',
  'ظرفیت اقامت خانه در این تاریخ‌ها تکمیل است',
  'عدم تطابق با شرایط میزبانی خانه (مانند تعداد نفرات، هماهنگی خانواده و...)',
  'مشغله کاری و شخصی و عدم امکان همراهی مناسب در این بازه',
  'سایر دلایل (توضیح دلخواه)',
];

export default function DeclineRequestModal({
  isOpen,
  onClose,
  request,
  onConfirm,
}: DeclineRequestModalProps) {
  const [selectedReason, setSelectedReason] = useState(PRESET_REASONS[0]);
  const [customReason, setCustomReason] = useState('');
  const [friendlyNote, setFriendlyNote] = useState('ان‌شاءالله در سفرهای بعدی در خدمتتون باشم.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !request) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = selectedReason === 'سایر دلایل (توضیح دلخواه)' ? (customReason.trim() || 'عدم امکان میزبانی در این بازه') : selectedReason;

    setIsSubmitting(true);
    try {
      await onConfirm(request.id, finalReason, friendlyNote.trim());
      onClose();
    } catch (err: any) {
      alert(err.message || 'خطا در ثبت پاسخ.');
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
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              رد محترمانه درخواست {request.sender_name}
            </h3>
            <p className="text-xs text-gray-500">
              لطفاً علت عدم امکان میزبانی را مشخص فرمایید تا به مسافر اطلاع داده شود.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Reason Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 mb-1">
              علت عدم امکان پذیرش:
            </label>
            <div className="space-y-2">
              {PRESET_REASONS.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all text-xs font-medium ${
                    selectedReason === reason
                      ? 'border-[#C25E38] bg-[#FBF4F0] text-gray-900 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="declineReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason)}
                    className="accent-[#C25E38] w-4 h-4"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Custom Reason Field if "سایر" */}
          {selectedReason === 'سایر دلایل (توضیح دلخواه)' && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                توضیح علت:
              </label>
              <input
                type="text"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="توضیح کوتاه درباره علت رد درخواست..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C25E38] outline-none"
                required
              />
            </div>
          )}

          {/* Friendly Note */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              یادداشت دوستانه برای مسافر (اختیاری):
            </label>
            <textarea
              rows={2}
              value={friendlyNote}
              onChange={(e) => setFriendlyNote(e.target.value)}
              placeholder="مثال: امیدوارم در سفرهای بعدی فرصت دیدار شما دست بدهد..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C25E38] outline-none leading-relaxed"
            />
          </div>

          {/* Reassurance */}
          <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200 text-[11px] text-gray-500 flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-gray-400 shrink-0" />
            <span>پاسخ‌گویی شفاف و دوستانه باعث بالا ماندن نرخ پاسخ‌دهی و اعتبار پروفایل شما می‌شود.</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold rounded-2xl shadow transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" />
              <span>{isSubmitting ? 'در حال ثبت...' : 'تایید رد درخواست'}</span>
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
