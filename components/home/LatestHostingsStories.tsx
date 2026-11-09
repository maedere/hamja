'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Heart,
  Star,
  CheckCircle2,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Calendar,
  MessageSquare,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import { toPersianDigits, getAvatarUrl, extractMutualReviews } from '@/lib/persian-utils';
import { HostingRequest } from '@/types/database';

export interface HostingStory {
  id: string;
  title: string;
  stayDateLabel: string;
  isMutual?: boolean;
  guest: {
    name: string;
    city: string;
    avatar: string;
    quote: string;
    rating: number;
    tags?: string[];
  };
  host: {
    name: string;
    city: string;
    avatar: string;
    quote: string;
    rating: number;
    tags?: string[];
  };
}

const STATIC_5_STORIES: HostingStory[] = [
  {
    id: 'story-maryam-mahsa',
    title: 'مریم از رشت مهمان مهسا در تهران شد',
    stayDateLabel: 'آبان ۱۴۰۵ · ۲ شب اقامت',
    isMutual: false,
    guest: {
      name: 'مریم احمدی',
      city: 'رشت',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      rating: 5,
      tags: ['خانه تمیز و پرنور', 'خوش‌برخورد و صمیمی'],
      quote:
        'پیش مهسا از لحظه ورود حس امنیت و راحتی کامل داشتم. خانه‌اش تمیز و پر از گل‌های قشنگ بود. بعدازظهر با هم در کافه‌های خیابان انقلاب کلی گپ زدیم. حالا بی‌صبرانه منتظرم به رشت بیاد تا من میزبانش باشم!',
    },
    host: {
      name: 'مهسا امینی',
      city: 'تهران',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
      rating: 5,
      tags: ['مهمان باوقار و مرتب', 'احترام به قوانین خانه'],
      quote:
        'مریم فوق‌العاده باادب، خوش‌صحبت و مرتب بود. برای من از فرهنگ گیلان گفت و با خودش سوغاتی کلوچه فومن آورده بود. همجا واقعاً برای من مثل پیدا کردن یک دوست صمیمی و ارزشمند بود.',
    },
  },
  {
    id: 'story-ali-behnam',
    title: 'علی از تبریز میزبان بهنام از بوشهر شد؛ چند ماه بعد در بوشهر مهمان او بود!',
    stayDateLabel: 'شهریور و آبان ۱۴۰۵ · میزبانی متقابل',
    isMutual: true,
    guest: {
      name: 'بهنام رضایی',
      city: 'بوشهر',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      rating: 5,
      tags: ['میزبانی بی‌نظیر', 'راهنمایی عالی در تبریزگردی'],
      quote:
        'وقتی در تبریز بودم، علی با روی باز من رو به خانه‌اش برد و بازار تاریخی تبریز و کوچه‌های ایل‌گلی رو نشونم داد. یک تجربه اصیل که هیچ هتل یا اقامتگاه تجاری نمی‌تونست به من بده.',
    },
    host: {
      name: 'علی محمدی',
      city: 'تبریز',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      rating: 5,
      tags: ['شروع یک برادری', 'صمیمی و پرانرژی'],
      quote:
        'شش ماه بعد من در بوشهر مهمان خانه بهنام بودم. کنار آتش لب ساحل خلیج فارس با هم خیام‌خوانی کردیم و از موسیقی جنوب گفتیم. همجا برای ما فراتر از یک سقف بود؛ شروع یک برادری همیشگی.',
    },
  },
  {
    id: 'story-kimia-sara',
    title: 'کیمیا از شیراز مهمان سارا در اصفهان شد',
    stayDateLabel: 'مهر ۱۴۰۵ · ۳ شب اقامت عکاسی',
    isMutual: false,
    guest: {
      name: 'کیمیا راد',
      city: 'شیراز',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      rating: 5,
      tags: ['هنرمند و مهربان', 'کوچه‌های جلفا'],
      quote:
        'سارا یک میزبان هنرمند و فوق‌العاده باحوصله است. کوچه‌های جلفا و زاینده‌رود رو با دید عکاسانه‌اش نشونم داد و شب‌ها ساعت‌ها از ادبیات و تاریخ گفتیم. حس می‌کردم سال‌هاست می‌شناسمش.',
    },
    host: {
      name: 'سارا رحیمی',
      city: 'اصفهان',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
      rating: 5,
      tags: ['همسفر عالی', 'پرانرژی و متواضع'],
      quote:
        'کیمیا پرانرژی، خوش‌سفر و بی‌نهایت مهربان بود. صحبت از شعر حافظ و هنر اصفهان، شب‌های فراموش‌نشدنی برامون ساخت. خوشحالم که خانه‌ام در اصفهان محلی برای این پیوند عمیق بود.',
    },
  },
  {
    id: 'story-navid-reza',
    title: 'نوید از مشهد مهمان رضا در یزد شد',
    stayDateLabel: 'آبان ۱۴۰۵ · ۲ شب اقامت کویری',
    isMutual: false,
    guest: {
      name: 'نوید حسینی',
      city: 'مشهد',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
      rating: 5,
      tags: ['مهمان‌نوازی کویری', 'آرامش و سکوت خانه'],
      quote:
        'رضا با چای آتشی و قطاب تازه یزد ازم استقبال کرد. پشت‌بام خانه‌اش رو به بادگیرهای خشتی یزد چشم‌اندازی داشت که روح آدم رو تازه می‌کرد. سفر کاری من تبدیل به یکی از آرام‌ترین روزهام شد.',
    },
    host: {
      name: 'رضا کمالی',
      city: 'یزد',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80',
      rating: 5,
      tags: ['خوش‌قول و بادقت', 'احترام به فرهنگ سنتی'],
      quote:
        'نوید خیلی باوقار، اهل مطالعه و خوش‌قول بود. احترام کامل به آرامش خانه گذاشت و کلی گپ علمی و فرهنگی زدیم. به تمام میزبان‌های همجا اقامت دادن به نوید عزیز رو توصیه می‌کنم.',
    },
  },
  {
    id: 'story-niloufar-zahra',
    title: 'نیلوفر از تهران مهمان زهرا در سنندج شد',
    stayDateLabel: 'مهر ۱۴۰۵ · ۲ شب اقامت خانوادگی',
    isMutual: false,
    guest: {
      name: 'نیلوفر معتمد',
      city: 'تهران',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
      rating: 5,
      tags: ['غذای محلی کردی', 'مهمان‌نوازی بی‌نظیر'],
      quote:
        'گرمای دل خانواده زهرا در سنندج برای همیشه در یادم می‌مونه. کلانه محلی پختند و برام از تاریخ کردستان و کوه‌های آبیدر گفتند. این دوستی زیباترین هدیه‌ای بود که همجا بهم داد.',
    },
    host: {
      name: 'زهرا کریمی',
      city: 'سنندج',
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=300&q=80',
      rating: 5,
      tags: ['بااحترام و مهربان', 'دوست خانواده ما'],
      quote:
        'نیلوفر با ادب و صمیمیتش خیلی زود عضوی از خانواده ما شد. احترامش به سنت‌ها و فرهنگ ما بسیار دلنشین بود. مشتاقانه منتظر دیدارش دوباره در سنندج هستیم.',
    },
  },
];

export default function LatestHostingsStories() {
  const [stories, setStories] = useState<HostingStory[]>(STATIC_5_STORIES);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Try to load any dynamic completed mutual reviews from API and merge them on top!
  useEffect(() => {
    const fetchDynamicHostings = async () => {
      try {
        const res = await fetch('/api/requests', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.requests)) {
            const dynamicList: HostingStory[] = [];
            data.requests.forEach((req: HostingRequest) => {
              const mutual = extractMutualReviews(req.host_response_note);
              if (mutual.guest_review && mutual.host_review) {
                dynamicList.push({
                  id: `dyn-story-${req.id}`,
                  title: `${req.sender_name} از ${req.sender_city} مهمان ${req.receiver_name} در ${req.receiver_city} شد`,
                  stayDateLabel: `${toPersianDigits(req.start_date)} تا ${toPersianDigits(req.end_date)} · اقامت تأییدشده`,
                  isMutual: true,
                  guest: {
                    name: req.sender_name,
                    city: req.sender_city,
                    avatar: getAvatarUrl(req.sender_avatar),
                    rating: mutual.guest_review.rating || 5,
                    tags: mutual.guest_review.tags || ['تجربه عالی'],
                    quote: mutual.guest_review.comment,
                  },
                  host: {
                    name: req.receiver_name,
                    city: req.receiver_city,
                    avatar: getAvatarUrl(req.receiver_avatar),
                    rating: mutual.host_review.rating || 5,
                    tags: mutual.host_review.tags || ['مهمان‌نواز و امن'],
                    quote: mutual.host_review.comment,
                  },
                });
              }
            });

            if (dynamicList.length > 0) {
              // Combine dynamic stories with static stories and keep up to 5
              const combined = [...dynamicList, ...STATIC_5_STORIES].slice(0, 5);
              setStories(combined);
            }
          }
        }
      } catch (e) {
        // keep static 5 stories
      }
    };

    fetchDynamicHostings();
  }, []);

  const story = stories[currentIndex] || STATIC_5_STORIES[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  return (
    <section id="stories" className="py-20 bg-gradient-to-b from-[#F9F8F6] via-[#F4EFEA]/60 to-[#F9F8F6]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-right">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBF4F0] text-[#C25E38] text-xs font-bold border border-[#C25E38]/20 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>۵ میزبانی و دوستی اخیر در همجا</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1F2937] leading-tight">
              روایت‌های واقعی از اقامت‌های دوطرفه
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-xl">
              اعضایی که در شهرهای مختلف درهای خانه‌شان را گشودند و تجربه‌ای امن، صمیمی و ماندگار را رقم زدند.
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-2xl bg-white border border-[#EADFD5] text-gray-700 hover:text-[#C25E38] hover:border-[#C25E38] shadow-xs transition-all active:scale-95"
              aria-label="داستان قبلی"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="text-xs font-bold text-gray-500 px-2">
              <span>{toPersianDigits(currentIndex + 1)}</span> از <span>{toPersianDigits(stories.length)}</span>
            </div>
            <button
              onClick={handleNext}
              className="p-2.5 rounded-2xl bg-white border border-[#EADFD5] text-gray-700 hover:text-[#C25E38] hover:border-[#C25E38] shadow-xs transition-all active:scale-95"
              aria-label="داستان بعدی"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stories Quick Navigation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {stories.map((s, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={s.id}
                onClick={() => setCurrentIndex(idx)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border ${
                  isActive
                    ? 'bg-[#1E5647] text-white border-[#1E5647] shadow-md scale-102'
                    : 'bg-white text-gray-700 border-[#EADFD5] hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center -space-x-1.5 space-x-reverse">
                  <img
                    src={getAvatarUrl(s.guest.avatar)}
                    alt={s.guest.name}
                    className="w-5 h-5 rounded-full object-cover ring-1 ring-white"
                  />
                  <img
                    src={getAvatarUrl(s.host.avatar)}
                    alt={s.host.name}
                    className="w-5 h-5 rounded-full object-cover ring-1 ring-white"
                  />
                </div>
                <span>
                  {s.guest.name.split(' ')[0]} و {s.host.name.split(' ')[0]}
                </span>
                <span className={`text-[10px] ${isActive ? 'text-white/80' : 'text-gray-400'}`}>
                  ({s.guest.city} - {s.host.city})
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Hosting Showcase Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EADFD5] shadow-sm space-y-8 animate-fade-in relative overflow-hidden">
          {/* Subtle Background Accent */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#FBF4F0] via-transparent to-transparent -z-0 opacity-70 pointer-events-none rounded-br-full" />

          {/* Top Banner: Connected Avatars and Title */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-gray-100 relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Dual Interlinked Avatars */}
              <div className="relative flex items-center">
                <div className="relative group">
                  <img
                    src={getAvatarUrl(story.guest.avatar)}
                    alt={story.guest.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-white shadow-md bg-[#F4EFEA]"
                  />
                  <span className="absolute -bottom-2 right-1/2 translate-x-1/2 bg-[#C25E38] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs whitespace-nowrap">
                    مهمان: {story.guest.city}
                  </span>
                </div>

                <div className="w-8 h-8 rounded-full bg-white shadow-md border border-[#EADFD5] flex items-center justify-center -mx-2 z-20 text-[#C25E38]">
                  <Heart className="w-4 h-4 fill-[#C25E38]" />
                </div>

                <div className="relative group">
                  <img
                    src={getAvatarUrl(story.host.avatar)}
                    alt={story.host.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-white shadow-md bg-[#F4EFEA]"
                  />
                  <span className="absolute -bottom-2 right-1/2 translate-x-1/2 bg-[#1E5647] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs whitespace-nowrap">
                    میزبان: {story.host.city}
                  </span>
                </div>
              </div>

              {/* Title & Badges */}
              <div className="space-y-1.5 pt-2 sm:pt-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1E5647] bg-[#EBF5F1] px-2.5 py-0.5 rounded-full border border-[#1E5647]/20">
                    <CheckCircle2 className="w-3 h-3" />
                    تجربه تأییدشده همجا
                  </span>
                  {story.isMutual && (
                    <span className="text-[11px] font-bold text-[#C25E38] bg-[#FBF4F0] px-2.5 py-0.5 rounded-full border border-[#C25E38]/20">
                      میزبانی متقابل
                    </span>
                  )}
                  <span className="text-[11px] text-gray-500 font-medium">
                    {story.stayDateLabel}
                  </span>
                </div>
                <h3 className="text-lg sm:text-2xl font-black text-gray-900 leading-snug">
                  {story.title}
                </h3>
              </div>
            </div>

            <Link
              href="/explore"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#FBF4F0] hover:bg-[#F4EFEA] text-[#C25E38] text-xs font-bold rounded-xl transition-colors shrink-0"
            >
              <span>دیدن همه اعضا و میزبانان</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Dual Review Perspectives (What each thought of the other) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {/* 1. Guest's Review of the Host */}
            <div className="p-6 rounded-3xl bg-[#FAF7F4] border border-[#EADFD5] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-[#EADFD5]/60">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={getAvatarUrl(story.guest.avatar)}
                      alt={story.guest.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-[#C25E38]/20"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1">
                        <span>نظر {story.guest.name}</span>
                        <span className="text-[10px] text-gray-500 font-normal">({story.guest.city})</span>
                      </h4>
                      <span className="text-[10px] text-[#C25E38] font-bold">درباره اقامت با {story.host.name}</span>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-amber-200">
                    <span className="text-xs font-black text-amber-600">
                      {toPersianDigits(story.guest.rating)}
                    </span>
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic font-medium">
                  &ldquo;{story.guest.quote}&rdquo;
                </p>
              </div>

              {/* Tags */}
              {story.guest.tags && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {story.guest.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-semibold text-gray-600 bg-white px-2.5 py-1 rounded-lg border border-gray-200"
                    >
                      ✓ {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Host's Review of the Guest */}
            <div className="p-6 rounded-3xl bg-[#FAF7F4] border border-[#EADFD5] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-[#EADFD5]/60">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={getAvatarUrl(story.host.avatar)}
                      alt={story.host.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-[#1E5647]/20"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1">
                        <span>نظر {story.host.name}</span>
                        <span className="text-[10px] text-gray-500 font-normal">({story.host.city})</span>
                      </h4>
                      <span className="text-[10px] text-[#1E5647] font-bold">درباره میزبانی از {story.guest.name}</span>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-amber-200">
                    <span className="text-xs font-black text-amber-600">
                      {toPersianDigits(story.host.rating)}
                    </span>
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic font-medium">
                  &ldquo;{story.host.quote}&rdquo;
                </p>
              </div>

              {/* Tags */}
              {story.host.tags && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {story.host.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-semibold text-gray-600 bg-white px-2.5 py-1 rounded-lg border border-gray-200"
                    >
                      ✓ {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
