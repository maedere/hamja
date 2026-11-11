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
  ArrowLeft,
  Clock,
} from 'lucide-react';
import { toPersianDigits, getAvatarUrl, extractMutualReviews } from '@/lib/persian-utils';
import { HostingRequest } from '@/types/database';

export interface HostingStory {
  id: string;
  title: string;
  stayDateLabel: string;
  isMutual?: boolean;
  completedAt?: string;
  guest: {
    name: string;
    city: string;
    avatar: string;
    quote?: string | null;
    rating?: number;
    tags?: string[];
  };
  host: {
    name: string;
    city: string;
    avatar: string;
    quote?: string | null;
    rating?: number;
    tags?: string[];
  };
}

function formatStayLabel(startDate?: string, endDate?: string, createdAt?: string): string {
  const hasValidStart =
    startDate && (startDate.includes('۱۴') || startDate.includes('14') || startDate.includes('/'));
  const hasValidEnd =
    endDate && (endDate.includes('۱۴') || endDate.includes('14') || endDate.includes('/'));

  if (hasValidStart && hasValidEnd) {
    return `${toPersianDigits(startDate)} تا ${toPersianDigits(endDate)} · اقامت تأییدشده`;
  } else if (hasValidStart) {
    return `تاریخ اقامت: ${toPersianDigits(startDate)} · اقامت تأییدشده`;
  }

  if (createdAt) {
    try {
      const d = new Date(createdAt);
      if (!isNaN(d.getTime())) {
        const persianMonthYear = new Intl.DateTimeFormat('fa-IR', {
          month: 'long',
          year: 'numeric',
        }).format(d);
        return `${persianMonthYear} · اقامت تأییدشده`;
      }
    } catch {
      // ignore
    }
  }

  return 'اقامت تأییدشده هم‌بام';
}

function parseStoryFromRequest(req: HostingRequest): HostingStory | null {
  const mutual = extractMutualReviews(req.host_response_note);
  const guestRev = mutual.guest_review;
  const hostRev = mutual.host_review;

  const hasGuestReview = Boolean(guestRev && guestRev.comment && guestRev.comment.trim());
  const hasHostReview = Boolean(hostRev && hostRev.comment && hostRev.comment.trim());

  // Must have at least one real written review from actual user
  if (!hasGuestReview && !hasHostReview) {
    return null;
  }

  const guestName = req.sender_name || guestRev?.reviewer_name || 'مهمان هم‌بام';
  const guestCity = req.sender_city || guestRev?.reviewer_city || 'ایران';
  const guestAvatar = getAvatarUrl(req.sender_avatar || guestRev?.reviewer_avatar);

  const hostName = req.receiver_name || hostRev?.reviewer_name || 'میزبان هم‌بام';
  const hostCity = req.receiver_city || hostRev?.reviewer_city || 'ایران';
  const hostAvatar = getAvatarUrl(req.receiver_avatar || hostRev?.reviewer_avatar);

  const isMutual = hasGuestReview && hasHostReview;

  return {
    id: `story-${req.id}`,
    title: `${guestName} از ${guestCity} مهمان ${hostName} در ${hostCity} شد`,
    stayDateLabel: formatStayLabel(req.start_date, req.end_date, req.created_at),
    isMutual,
    completedAt:
      guestRev?.completed_at ||
      hostRev?.completed_at ||
      (req as any).updated_at ||
      req.created_at ||
      '',
    guest: {
      name: guestName,
      city: guestCity,
      avatar: guestAvatar,
      rating: guestRev?.rating || 5,
      tags: guestRev?.tags || [],
      quote: guestRev?.comment?.trim() || null,
    },
    host: {
      name: hostName,
      city: hostCity,
      avatar: hostAvatar,
      rating: hostRev?.rating || 5,
      tags: hostRev?.tags || [],
      quote: hostRev?.comment?.trim() || null,
    },
  };
}

export default function LatestHostingsStories() {
  const [stories, setStories] = useState<HostingStory[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchRealHostings = async () => {
      try {
        const res = await fetch('/api/requests', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.requests)) {
            const parsedList: HostingStory[] = [];

            data.requests.forEach((req: HostingRequest) => {
              const story = parseStoryFromRequest(req);
              if (story) {
                parsedList.push(story);
              }
            });

            // Sort newest first
            parsedList.sort((a, b) => {
              const timeA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
              const timeB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
              return timeB - timeA;
            });

            if (isMounted) {
              setStories(parsedList.slice(0, 5));
            }
          }
        }
      } catch (e) {
        // network or server error
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchRealHostings();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleNext = () => {
    if (stories.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  };

  const handlePrev = () => {
    if (stories.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <section id="stories" className="py-20 bg-gradient-to-b from-[#F9F8F6] via-[#F4EFEA]/60 to-[#F9F8F6]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-right animate-pulse space-y-4">
          <div className="h-6 w-48 bg-gray-200 rounded-full mb-2" />
          <div className="h-8 w-72 bg-gray-200 rounded-2xl mb-6" />
          <div className="h-72 bg-white rounded-3xl border border-[#EADFD5] p-8" />
        </div>
      </section>
    );
  }

  // 100% Authentic Empty State for Launch Phase (when no completed stays with reviews exist yet)
  if (stories.length === 0) {
    return (
      <section id="stories" className="py-20 bg-gradient-to-b from-[#F9F8F6] via-[#F4EFEA]/60 to-[#F9F8F6]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#EADFD5] shadow-xs space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-[#FBF4F0] text-[#C25E38] flex items-center justify-center mx-auto border border-[#C25E38]/20">
              <Sparkles className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#C25E38]">روایت‌های واقعی از اقامت‌های دوطرفه</span>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 leading-snug">
                داستان‌های میزبانی و دوستی هم‌بام به زودی در اینجا ثبت می‌شوند
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
                تمام روایت‌ها و نظرات این بخش ۱۰۰٪ واقعی و بر اساس اقامت‌های تأییدشده اعضای هم‌بام هستند. با ارسال درخواست یا گشودن درِ خانه به روی مسافران، شما می‌توانید اولین روایت ماندگار هم‌بام را رقم بزنید.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/explore"
                className="px-6 py-3 bg-[#C25E38] hover:bg-[#A84E2D] text-white text-xs font-bold rounded-2xl shadow-xs transition-colors flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                <span>کاوش اعضا و میزبان‌ها</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const activeStoryIndex = currentIndex < stories.length ? currentIndex : 0;
  const story = stories[activeStoryIndex];

  return (
    <section id="stories" className="py-20 bg-gradient-to-b from-[#F9F8F6] via-[#F4EFEA]/60 to-[#F9F8F6]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-right">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBF4F0] text-[#C25E38] text-xs font-bold border border-[#C25E38]/20 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {stories.length === 1
                  ? 'جدیدترین میزبانی و دوستی در هم‌بام'
                  : `${toPersianDigits(stories.length)} میزبانی و دوستی اخیر در هم‌بام`}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1F2937] leading-tight">
              روایت‌های واقعی از اقامت‌های دوطرفه
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-xl">
              اعضایی که در شهرهای مختلف درهای خانه‌شان را گشودند و تجربه‌ای امن، صمیمی و ماندگار را رقم زدند.
            </p>
          </div>

          {/* Navigation Arrows (shown if more than 1 story) */}
          {stories.length > 1 && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={handlePrev}
                className="p-2.5 rounded-2xl bg-white border border-[#EADFD5] text-gray-700 hover:text-[#C25E38] hover:border-[#C25E38] shadow-xs transition-all active:scale-95"
                aria-label="داستان قبلی"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="text-xs font-bold text-gray-500 px-2">
                <span>{toPersianDigits(activeStoryIndex + 1)}</span> از{' '}
                <span>{toPersianDigits(stories.length)}</span>
              </div>
              <button
                onClick={handleNext}
                className="p-2.5 rounded-2xl bg-white border border-[#EADFD5] text-gray-700 hover:text-[#C25E38] hover:border-[#C25E38] shadow-xs transition-all active:scale-95"
                aria-label="داستان بعدی"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Stories Quick Navigation Pills (shown if more than 1 story) */}
        {stories.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
            {stories.map((s, idx) => {
              const isActive = idx === activeStoryIndex;
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
        )}

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
                    تجربه تأییدشده هم‌بام
                  </span>
                  {story.isMutual && (
                    <span className="text-[11px] font-bold text-[#C25E38] bg-[#FBF4F0] px-2.5 py-0.5 rounded-full border border-[#C25E38]/20">
                      بازخورد دوطرفه
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

          {/* Dual Review Perspectives */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {/* 1. Guest's Review */}
            {story.guest.quote ? (
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
                        {toPersianDigits(story.guest.rating || 5)}
                      </span>
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic font-medium">
                    &ldquo;{story.guest.quote}&rdquo;
                  </p>
                </div>

                {/* Tags */}
                {story.guest.tags && story.guest.tags.length > 0 && (
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
            ) : (
              <div className="p-6 rounded-3xl bg-[#FAF7F4]/60 border border-dashed border-[#EADFD5] space-y-3 flex flex-col items-center justify-center text-center">
                <Clock className="w-6 h-6 text-gray-400" />
                <p className="text-xs font-bold text-gray-600">
                  اقامت با موفقیت انجام شده است
                </p>
                <span className="text-[11px] text-gray-400">
                  در انتظار ثبت نظر و بازخورد توسط مهمان ({story.guest.name})
                </span>
              </div>
            )}

            {/* 2. Host's Review */}
            {story.host.quote ? (
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
                        {toPersianDigits(story.host.rating || 5)}
                      </span>
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic font-medium">
                    &ldquo;{story.host.quote}&rdquo;
                  </p>
                </div>

                {/* Tags */}
                {story.host.tags && story.host.tags.length > 0 && (
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
            ) : (
              <div className="p-6 rounded-3xl bg-[#FAF7F4]/60 border border-dashed border-[#EADFD5] space-y-3 flex flex-col items-center justify-center text-center">
                <Clock className="w-6 h-6 text-gray-400" />
                <p className="text-xs font-bold text-gray-600">
                  میزبانی با موفقیت انجام شده است
                </p>
                <span className="text-[11px] text-gray-400">
                  در انتظار ثبت نظر و بازخورد توسط میزبان ({story.host.name})
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
