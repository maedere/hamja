'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, Lock, Check, Camera, Upload, ArrowRight, ArrowLeft } from 'lucide-react';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export default function VerificationModal({ isOpen, onClose, onComplete }: VerificationModalProps) {
  const [step, setStep] = useState<number>(2); // Default to Step 2 as shown in PDF screenshot
  const [nationalCode, setNationalCode] = useState('');
  const [role, setRole] = useState<'both' | 'host' | 'traveler'>('both');
  const [faceDetected, setFaceDetected] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setStep(2);
        if (onComplete) onComplete();
        onClose();
      }, 1500);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
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
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#C25E38]/10 text-[#C25E38] mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#1F2937]">احراز هویت و عضویت امن</h3>
          <p className="text-xs sm:text-sm text-[#C25E38] font-medium mt-1">
            {step === 1 && 'گام ۱ از ۳: استعلام کارت ملی'}
            {step === 2 && 'گام ۲ از ۳: احراز چهره'}
            {step === 3 && 'گام ۳ از ۳: تکمیل عضویت'}
          </p>
        </div>

        {/* Stepper Indicator matching Page 1 */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {/* Step 3: تکمیل عضویت */}
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                step === 3
                  ? 'bg-[#C25E38] text-white'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              ۳
            </div>
            <span className="text-[11px] text-gray-500 mt-1.5 font-medium">تکمیل عضویت</span>
          </div>

          <div className={`w-12 h-0.5 ${step >= 3 ? 'bg-[#C25E38]' : 'bg-gray-200'}`} />

          {/* Step 2: سلفی زنده */}
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                step === 2
                  ? 'bg-[#C25E38] text-white ring-4 ring-[#C25E38]/20'
                  : step > 2
                  ? 'bg-[#1E5647] text-white'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {step > 2 ? <Check className="w-4 h-4" /> : '۲'}
            </div>
            <span className="text-[11px] text-gray-700 mt-1.5 font-medium">سلفی زنده</span>
          </div>

          <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-[#1E5647]' : 'bg-gray-200'}`} />

          {/* Step 1: کارت ملی */}
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                step > 1
                  ? 'bg-[#1E5647] text-white'
                  : 'bg-[#C25E38] text-white ring-4 ring-[#C25E38]/20'
              }`}
            >
              <Check className="w-4 h-4" />
            </div>
            <span className="text-[11px] text-gray-700 mt-1.5 font-medium">کارت ملی</span>
          </div>
        </div>

        {/* Step 1 Content: کارت ملی */}
        {step === 1 && (
          <div className="space-y-4 mb-6">
            <p className="text-xs sm:text-sm text-center text-gray-600">
              برای آغاز فرآیند اعتمادسازی، لطفاً کد ملی ۱۰ رقمی خود را وارد فرمایید.
            </p>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">کد ملی</label>
              <input
                type="text"
                placeholder="مثال: ۰۰۱۲۳۴۵۶۷۸"
                value={nationalCode}
                onChange={(e) => setNationalCode(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-center text-base tracking-widest focus:ring-2 focus:ring-[#C25E38] focus:border-transparent outline-none"
              />
            </div>
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:bg-gray-50 cursor-pointer transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-xs text-gray-600 font-medium">بارگذاری تصویر کارت ملی یا برگه رهگیری</p>
              <p className="text-[10px] text-gray-400 mt-1">حداکثر حجم: ۵ مگابایت (JPG, PNG)</p>
            </div>
          </div>
        )}

        {/* Step 2 Content: سلفی زنده (Exact UI from Page 1 of PDF) */}
        {step === 2 && (
          <div className="flex flex-col items-center text-center space-y-4 mb-6">
            <p className="text-xs sm:text-sm text-gray-600 max-w-sm leading-relaxed">
              جهت حفظ امنیت جامعه، تصویر زنده چهره شما باید با کارت ملی تطبیق داده شود.
            </p>

            {/* Circular face outline frame */}
            <div className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-full border-2 border-dashed border-[#1E5647] flex items-center justify-center bg-[#F9F8F6] p-4 transition-all">
              <div className="w-36 h-36 rounded-full border border-gray-200 flex flex-col items-center justify-center text-gray-400">
                {/* Stylized face illustration */}
                <svg className="w-20 h-20 text-gray-400" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M30 40 Q35 37 40 40" strokeLinecap="round" />
                  <path d="M60 40 Q65 37 70 40" strokeLinecap="round" />
                  <path d="M50 48 L50 60 L46 60" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M36 70 Q50 82 64 70" strokeLinecap="round" />
                  <ellipse cx="50" cy="52" rx="36" ry="42" strokeDasharray="3 3" />
                </svg>
              </div>

              {/* Bottom camera badge icon */}
              <div className="absolute -bottom-2 bg-white px-2 py-0.5 rounded-full shadow border border-gray-200">
                <Camera className="w-4 h-4 text-gray-600" />
              </div>
            </div>

            {/* Status Pill: چهره در کادر قرار گرفت */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF5F1] text-[#1E5647] text-xs font-medium border border-[#1E5647]/20">
              <span className="w-2 h-2 rounded-full bg-[#1E5647] animate-pulse" />
              چهره در کادر قرار گرفت
            </div>

            {/* Alternative link */}
            <button
              type="button"
              className="text-xs text-gray-500 hover:text-[#C25E38] transition-colors underline decoration-dotted"
            >
              یا بارگذاری تصویر سلفی همراه با کارت ملی
            </button>
          </div>
        )}

        {/* Step 3 Content: تکمیل عضویت و تعیین وضعیت */}
        {step === 3 && (
          <div className="space-y-4 mb-6">
            <p className="text-xs sm:text-sm text-center text-gray-600">
              چگونه می‌خواهید در جمع همجا همراه ما باشید؟
            </p>
            <div className="grid grid-cols-1 gap-2.5">
              <button
                type="button"
                onClick={() => setRole('both')}
                className={`p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between ${
                  role === 'both'
                    ? 'border-[#C25E38] bg-[#FBF4F0]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div>
                  <h4 className="text-sm font-bold text-gray-800">میزبانی متقابل (میزبان و مسافر)</h4>
                  <p className="text-xs text-gray-500 mt-0.5">هم مایل به میزبانی از دوستانم و هم در سفرها مهمان می‌شوم.</p>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${role === 'both' ? 'border-[#C25E38] bg-[#C25E38] text-white' : 'border-gray-300'}`}>
                  {role === 'both' && <Check className="w-3 h-3" />}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('host')}
                className={`p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between ${
                  role === 'host'
                    ? 'border-[#C25E38] bg-[#FBF4F0]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div>
                  <h4 className="text-sm font-bold text-gray-800">فقط میزبان</h4>
                  <p className="text-xs text-gray-500 mt-0.5">امکان در اختیار گذاشتن فضا برای مسافران شهرم را دارم.</p>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${role === 'host' ? 'border-[#C25E38] bg-[#C25E38] text-white' : 'border-gray-300'}`}>
                  {role === 'host' && <Check className="w-3 h-3" />}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('traveler')}
                className={`p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between ${
                  role === 'traveler'
                    ? 'border-[#C25E38] bg-[#FBF4F0]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div>
                  <h4 className="text-sm font-bold text-gray-800">فقط مسافر</h4>
                  <p className="text-xs text-gray-500 mt-0.5">فعلاً در سفرها به دنبال آشنایی با میزبان‌های محلی هستم.</p>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${role === 'traveler' ? 'border-[#C25E38] bg-[#C25E38] text-white' : 'border-gray-300'}`}>
                  {role === 'traveler' && <Check className="w-3 h-3" />}
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Privacy Note with Lock matching Page 1 */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 mb-6">
          <Lock className="w-3.5 h-3.5 text-gray-400" />
          <span>اطلاعات شما نزد همجا کاملاً محرمانه می‌ماند.</span>
        </div>

        {/* Action Buttons matching Page 1 */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleNext}
            className="w-full py-3.5 px-4 bg-[#C25E38] hover:bg-[#A84E2D] text-white font-semibold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            {step === 3 ? 'تکمیل و آغاز دوستی در همجا' : 'ثبت و ادامه به گام بعد'}
            <ArrowLeft className="w-4 h-4" />
          </button>

          {step > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="w-full py-2.5 text-xs text-gray-500 hover:text-gray-800 transition-colors flex items-center justify-center gap-1 font-medium"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              بازگشت به مرحله قبل
            </button>
          )}
        </div>

        {isSuccess && (
          <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-[#1E5647] text-white flex items-center justify-center mb-4">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-gray-800">احراز هویت با موفقیت انجام شد!</h4>
            <p className="text-sm text-gray-600 mt-2">به جمع میزبانان و مسافران همجا خوش آمدید.</p>
          </div>
        )}
      </div>
    </div>
  );
}
