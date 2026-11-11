'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  X,
  ShieldCheck,
  Upload,
  CheckCircle2,
  Clock,
  Lock,
  Check,
  FileText,
  Image as ImageIcon,
  Trash2,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';
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
  const { currentUser, submitVerification, approveUser } = useAuth();

  const cardInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  const [nationalCardPreview, setNationalCardPreview] = useState<string | null>(
    currentUser?.verification_docs?.national_card_url || null
  );
  const [nationalCardName, setNationalCardName] = useState<string>(
    currentUser?.verification_docs?.national_card_url ? 'تصویر کارت ملی' : ''
  );

  const [selfiePreview, setSelfiePreview] = useState<string | null>(
    currentUser?.verification_docs?.selfie_with_card_url || null
  );
  const [selfieName, setSelfieName] = useState<string>(
    currentUser?.verification_docs?.selfie_with_card_url ? 'تصویر سلفی با کارت ملی' : ''
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentStatus = currentUser?.verification_status || 'unverified';

  const handleCardFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNationalCardName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setNationalCardPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelfieFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelfieName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelfiePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNationalCardPreview(null);
    setNationalCardName('');
    if (cardInputRef.current) cardInputRef.current.value = '';
  };

  const handleRemoveSelfie = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelfiePreview(null);
    setSelfieName('');
    if (selfieInputRef.current) selfieInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nationalCardPreview || !selfiePreview) {
      alert('لطفاً هر دو تصویر (عکس کارت ملی و سلفی همراه با کارت ملی) را انتخاب فرمایید.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      submitVerification(nationalCardPreview, selfiePreview);
      setIsSubmitting(false);
      if (onComplete) onComplete();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 text-right overflow-hidden border border-[#EADFD5] max-h-[92vh] overflow-y-auto">
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
            <p className="text-xs text-[#C25E38] font-bold mt-1.5 bg-[#FBF4F0] p-2.5 rounded-xl border border-[#C25E38]/20">
              ⚠️ {reason}
            </p>
          ) : (
            <p className="text-xs text-gray-500 mt-1">
              صرفاً بارگذاری تصویر کارت ملی و سلفی همراه با کارت ملی جهت بررسی دستی کافیست.
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
                مدارک شما با موفقیت دریافت شد. تیم هم‌بام به صورت دستی مدارک را در پنل ادمین بررسی کرده و پس از تأیید، امکان ارسال درخواست برای شما فعال خواهد شد.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-[#1E5647] hover:bg-[#164337] text-white text-xs font-bold rounded-2xl shadow transition-colors"
            >
              متوجه شدم و بستن
            </button>
          </div>
        )}

        {/* Status 3: UNVERIFIED OR REJECTED FORM WITH REAL FILE PICKER */}
        {(currentStatus === 'unverified' || currentStatus === 'rejected') && (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* If Rejected, show rejection reason alert box */}
            {currentStatus === 'rejected' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-right animate-fade-in space-y-1.5">
                <div className="flex items-center gap-2 text-red-700 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>دلیل رد شدن احراز هویت قبلی:</span>
                </div>
                <p className="text-xs text-red-900 bg-white/70 p-2.5 rounded-xl border border-red-100 font-semibold leading-relaxed">
                  {currentUser?.rejection_reason || reason || 'تصویر مدرک ارسالی ناخوانا یا نامعتبر بود.'}
                </p>
                <p className="text-[11px] text-red-600">
                  لطفاً مدارک جدید و واضح‌تری انتخاب و بارگذاری فرمایید تا ادمین بررسی و تایید کند.
                </p>
              </div>
            )}

            {/* Hidden Real File Inputs */}
            <input
              type="file"
              ref={cardInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleCardFileChange}
            />
            <input
              type="file"
              ref={selfieInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleSelfieFileChange}
            />

            {/* Upload 1: National Card */}
            <div>
              <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                ۱. تصویر کارت ملی یا برگه رهگیری <span className="text-red-500">*</span>
              </label>

              {nationalCardPreview ? (
                <div className="relative p-3 rounded-2xl border-2 border-[#1E5647] bg-[#EBF5F1] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img
                      src={nationalCardPreview}
                      alt="پیش‌نمایش کارت ملی"
                      className="w-14 h-14 rounded-xl object-cover border border-[#1E5647]/30 shrink-0"
                    />
                    <div className="text-right truncate">
                      <p className="text-xs font-bold text-[#1E5647] truncate">{nationalCardName || 'تصویر کارت ملی'}</p>
                      <span className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3 h-3 text-[#1E5647]" />
                        فایل با موفقیت انتخاب شد
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => cardInputRef.current?.click()}
                      className="px-2.5 py-1 text-[11px] bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 font-medium"
                    >
                      تغییر عکس
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveCard}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => cardInputRef.current?.click()}
                  className="p-5 rounded-2xl border-2 border-dashed border-gray-300 hover:border-[#C25E38] bg-[#F9F8F6] cursor-pointer transition-all text-center flex flex-col items-center justify-center group"
                >
                  <Upload className="w-7 h-7 text-gray-400 group-hover:text-[#C25E38] mb-1.5 transition-colors" />
                  <span className="text-xs font-bold text-gray-700 group-hover:text-[#C25E38]">
                    کلیک برای انتخاب فایل عکس کارت ملی از دستگاه
                  </span>
                  <span className="text-[10px] text-gray-400 mt-1">فرمت‌های JPG، PNG یا WEBP</span>
                </div>
              )}
            </div>

            {/* Upload 2: Selfie with National Card */}
            <div>
              <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                ۲. تصویر سلفی به همراه کارت ملی <span className="text-red-500">*</span>
              </label>

              {selfiePreview ? (
                <div className="relative p-3 rounded-2xl border-2 border-[#1E5647] bg-[#EBF5F1] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img
                      src={selfiePreview}
                      alt="پیش‌نمایش سلفی با کارت ملی"
                      className="w-14 h-14 rounded-xl object-cover border border-[#1E5647]/30 shrink-0"
                    />
                    <div className="text-right truncate">
                      <p className="text-xs font-bold text-[#1E5647] truncate">{selfieName || 'سلفی با کارت ملی'}</p>
                      <span className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3 h-3 text-[#1E5647]" />
                        فایل با موفقیت انتخاب شد
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => selfieInputRef.current?.click()}
                      className="px-2.5 py-1 text-[11px] bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 font-medium"
                    >
                      تغییر عکس
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveSelfie}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => selfieInputRef.current?.click()}
                  className="p-5 rounded-2xl border-2 border-dashed border-gray-300 hover:border-[#C25E38] bg-[#F9F8F6] cursor-pointer transition-all text-center flex flex-col items-center justify-center group"
                >
                  <Upload className="w-7 h-7 text-gray-400 group-hover:text-[#C25E38] mb-1.5 transition-colors" />
                  <span className="text-xs font-bold text-gray-700 group-hover:text-[#C25E38]">
                    کلیک برای انتخاب عکس سلفی همراه با کارت ملی
                  </span>
                  <span className="text-[10px] text-gray-400 mt-1">
                    کارت ملی را کنار چهره بگیرید تا چهره و اطلاعات کارت مشخص باشند
                  </span>
                </div>
              )}
            </div>

            {/* Privacy notice */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 pt-1">
              <Lock className="w-3.5 h-3.5 text-gray-400" />
              <span>مدارک شما کاملاً محرمانه بوده و تنها توسط ادمین هم‌بام بررسی می‌شود.</span>
            </div>

            {/* Action button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !nationalCardPreview || !selfiePreview}
                className="w-full py-3.5 bg-[#C25E38] hover:bg-[#A84E2D] text-white font-bold rounded-2xl shadow transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>در حال ارسال مدارک...</span>
                ) : currentStatus === 'rejected' ? (
                  <span>بارگذاری مجدد مدارک جهت بررسی مجدد</span>
                ) : (
                  <span>ارسال مدارک جهت بررسی دستی هم‌بام</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
