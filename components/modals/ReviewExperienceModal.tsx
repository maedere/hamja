'use client';

import React, { useState } from 'react';
import { X, Star, Heart, Check, Sparkles, MessageSquare } from 'lucide-react';
import { HostingRequest } from '@/types/database';
import { toPersianDigits, getAvatarUrl } from '@/lib/persian-utils';

interface ReviewExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: HostingRequest | null;
  reviewerRole: 'guest' | 'host';
  onConfirm: (requestId: string, rating: number, comment: string, tags: string[]) => Promise<void>;
}

const EXPERIENCE_TAGS = [
  'خوش‌برخورد و صمیمی',
  'خانه پاکیزه و مرتب',
  'راهنمایی عالی در گردشگری',
  'احترام به قوانین و حریم شخصی',
  'امن و قابل اعتماد',
  'پاسخ‌گویی سریع و خوش‌قول',
  'گفت‌وگوهای دلنشین و عمیق',
  'مهمان‌نوازی اصیل ایرانی',
];

const RATING_LABELS: Record<number, string> = {
  5: 'عالی و به یادماندنی (۵ از ۵)',
  4: 'خیلی خوب و دلنشین (۴ از ۵)',
  3: 'معمولی و مناسب (۳ از ۵)',
  2: 'دارای کاستی و نیاز به بهبود (۲ از ۵)',
  1: 'تجربه ضعیف (۱ از ۵)',
};

export default function ReviewExperienceModal({
  isOpen,
  onClose,
  request,
  reviewerRole,
  onConfirm,
}: ReviewExperienceModalProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'خوش‌برخورد و صمیمی',
    'امن و قابل اعتماد',
  ]);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !request) return null;

  const targetName = reviewerRole === 'guest' ? request.receiver_name : request.sender_name;
  const targetAvatar = reviewerRole === 'guest' ? request.receiver_avatar : request.sender_avatar;
  const targetCity = reviewerRole === 'guest' ? request.receiver_city : request.sender_city;

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert('لطفاً نظر و تجربه خود را به طور خلاصه بنویسید.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(request.id, rating, comment.trim(), selectedTags);
      onClose();
    } catch (err: any) {
      alert(err.message || 'خطا در ثبت تجربه.');
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
          <img
            src={getAvatarUrl(targetAvatar)}
            alt={targetName}
            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#C25E38]/20 bg-[#F4EFEA]"
          />
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {reviewerRole === 'guest'
                ? `مهمان شدم · ثبت تجربه اقامت با ${targetName}`
                : `میزبان شدم · ثبت تجربه میزبانی از ${targetName}`}
            </h3>
            <p className="text-xs text-gray-500">
              شهر {targetCity} · ثبت نظر شما به ارتقای اعتماد در جامعه همجا کمک می‌کند.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Star Rating */}
          <div className="bg-[#FBF4F0] p-4 rounded-2xl border border-[#C25E38]/20 text-center space-y-2">
            <span className="block text-xs font-bold text-gray-700">
              امتیاز شما به این تجربه:
            </span>
            <div className="flex items-center justify-center gap-1.5 direction-ltr">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                        active
                          ? 'fill-amber-400 text-amber-500 drop-shadow-xs'
                          : 'fill-transparent text-gray-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <p className="text-xs font-bold text-[#C25E38] pt-1">
              {RATING_LABELS[hoverRating || rating]}
            </p>
          </div>

          {/* Quick Experience Tags */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C25E38]" />
              <span>ویژگی‌های برجسته این تجربه (انتخاب چندتایی):</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {EXPERIENCE_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1 ${
                      isSelected
                        ? 'bg-[#1E5647] text-white border-[#1E5647] shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#C25E38]" />
              <span>روایت و خاطره شما از این اقامت (نظرسنجی):</span>
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                reviewerRole === 'guest'
                  ? `از روزهایی که مهمان خانه ${targetName} بودید بگویید؛ چطور پیش رفت؟ چه حسی داشتید؟`
                  : `از میزبانی از ${targetName} بنویسید؛ همراهی و هماهنگی چطور بود؟`
              }
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C25E38] outline-none leading-relaxed"
              required
            />
          </div>

          {/* Submit Action */}
          <div className="flex items-center gap-2.5 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3.5 bg-[#C25E38] hover:bg-[#A84E2D] text-white text-xs sm:text-sm font-bold rounded-2xl shadow transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>{isSubmitting ? 'در حال ثبت...' : 'ثبت تجربه و پایان موفقیت‌آمیز سفر'}</span>
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
