'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, Upload, CheckCircle2, Clock, Lock, Sparkles, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
  reason?: string;
}

export default function VerificationModal({
  isOpen,
  onClose,
  onComplete,
  reason,
}: VerificationModalProps) {
  const { currentUser, submitVerification, adminApproveUser, adminResetVerification } = useAuth();

  const [nationalCardFile, setNationalCardFile] = useState<string | null>(
    currentUser?.verification_docs?.national_card_url || null
  );
  const [selfieWithCardFile, setSelfieWithCardFile] = useState<string | null>(
    currentUser?.verification_docs?.selfie_with_card_url || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentStatus = currentUser?.verification_status || 'unverified';

  const handleSimulatedUpload = (type: 'card' | 'selfie') => {
    // Simulate image upload with sample photo
    if (type === 'card') {
      setNationalCardFile('uploaded_national_card.jpg');
    } else {
      setSelfieWithCardFile('uploaded_selfie_with_card.jpg');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nationalCardFile || !selfieWithCardFile) {
      alert('لطفاً هر دو تصویر (عکس کارت ملی و سلفی همراه با کارت ملی) را بارگذاری فرمایید.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      submitVerification(nationalCardFile, selfieWithCardFile);
      setIsSubmitting(false);
      if (onComplete) onComplete();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 text-right overflow-hidden border border-[#EADFD5]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 left-6 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="بستن"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#1E5647]/10 text-[#1E5647] mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#1F2937]">
            احراز هویت و عضویت امن
          </h3>
          {reason ? (
            <p className="text-xs text-[#C25E38] font-bold mt-1.5 bg-[#FBF4F0] p-2 rounded-xl">
              ⚠️ {reason}
            </p>
          ) : (
            <p className="text-xs text-gray-500 mt-1">
              صرفاً ارسال تصویر کارت ملی و یک سلفی همراه با کارت جهت بررسی دستی کافیست.
            </p>
          )}
        </div>

        {/* Status 1: APPROVED */}
        {currentStatus === 'approved' && (
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 rounded-full bg-[#1E5647] text-white flex items-center justify-center mx-auto shadow-md">
              <Check className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-800">هویت شما تأیید شده است</h4>
              <p className="text-xs text-gray-600 mt-1 max-w-xs mx-auto">
                شما می‌توانید آزادانه به سایر میزبانان پیام و درخواست میزبانی بفرستید یا مهمانان را در خانه‌تان بپذیرید.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full py-3 bg-[#1E5647] text-white font-bold rounded-2xl text-sm"
              >
                متوجه شدم و بستن
              </button>
            </div>
          </div>
        )}

        {/* Status 2: PENDING MANUAL REVIEW */}
        {currentStatus === 'pending' && (
          <div className="text-center space-y-4 py-3">
            <div className="w-16 h-16 rounded-full bg-amber-500 text-white flex items-center justify-center mx-auto shadow-md animate-pulse">
              <Clock className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-lg font-bold text-gray-800">مدارک در انتظار بررسی دستی</h4>
              <p className="text-xs text-gray-600 leading-relaxed max-w-sm mx-auto">
                مدارک شناسایی شما با موفقیت ثبت شد. تیم پشتیبانی همجا به صورت دستی تصویر کارت ملی و سلفی شما را تطبیق داده و پس از تأیید، امکان ارسال درخواست برای شما فعال خواهد شد.
              </p>
            </div>

            {/* Admin demo bypass button for instant test */}
            <div className="p-3.5 bg-[#FBF4F0] rounded-2xl border border-[#C25E38]/20 text-right space-y-2">
              <span className="text-[11px] font-bold text-[#C25E38] block">
                تست و شبیه‌سازی ادمین:
              </span>
              <p className="text-[10px] text-gray-600">
                در حالت واقعی، ادمین مدارک را در پنل بررسی می‌کند. برای اینکه بتوانید بلافاصله قابلیت‌ها را تست کنید، روی دکمه زیر کلیک نمایید:
              </p>
              <button
                type="button"
                onClick={() => {
                  adminApproveUser();
                  if (onComplete) onComplete();
                }}
                className="w-full py-2 bg-[#1E5647] hover:bg-[#164337] text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>تأیید فوری مدارک توسط ادمین (تست دمو)</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl"
            >
              بستن پنجره
            </button>
          </div>
        )}

        {/* Status 3: UNVERIFIED FORM */}
        {currentStatus === 'unverified' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Upload 1: National Card */}
            <div>
              <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                ۱. تصویر کارت ملی یا برگه رهگیری <span className="text-red-500">*</span>
              </label>
              <div
                onClick={() => handleSimulatedUpload('card')}
                className={`p-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all text-center flex flex-col items-center justify-center ${
                  nationalCardFile
                    ? 'border-[#1E5647] bg-[#EBF5F1]'
                    : 'border-gray-300 hover:border-[#C25E38] bg-[#F9F8F6]'
                }`}
              >
                {nationalCardFile ? (
                  <div className="flex items-center gap-2 text-[#1E5647] text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تصویر کارت ملی انتخاب شد ✓</span>
                  </div>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-gray-400 mb-1" />
                    <span className="text-xs font-semibold text-gray-700">
                      کلیک برای انتخاب عکس کارت ملی
                    </span>
                    <span className="text-[10px] text-gray-400 mt-0.5">فرمت‌های JPG، PNG</span>
                  </>
                )}
              </div>
            </div>

            {/* Upload 2: Selfie with National Card */}
            <div>
              <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                ۲. تصویر سلفی به همراه کارت ملی <span className="text-red-500">*</span>
              </label>
              <div
                onClick={() => handleSimulatedUpload('selfie')}
                className={`p-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all text-center flex flex-col items-center justify-center ${
                  selfieWithCardFile
                    ? 'border-[#1E5647] bg-[#EBF5F1]'
                    : 'border-gray-300 hover:border-[#C25E38] bg-[#F9F8F6]'
                }`}
              >
                {selfieWithCardFile ? (
                  <div className="flex items-center gap-2 text-[#1E5647] text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تصویر سلفی با کارت ملی انتخاب شد ✓</span>
                  </div>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-gray-400 mb-1" />
                    <span className="text-xs font-semibold text-gray-700">
                      کلیک برای انتخاب سلفی به همراه کارت ملی
                    </span>
                    <span className="text-[10px] text-gray-400 mt-0.5">
                      کارت ملی را کنار چهره بگیرید تا مشخصات خوانا باشد
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Privacy notice */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 pt-1">
              <Lock className="w-3.5 h-3.5 text-gray-400" />
              <span>مدارک شما کاملاً محرمانه بوده و به هیچ کاربری نمایش داده نمی‌شود.</span>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#C25E38] hover:bg-[#A84E2D] text-white font-bold rounded-2xl shadow transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>در حال ارسال مدارک...</span>
                ) : (
                  <span>ارسال مدارک جهت بررسی دستی</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
