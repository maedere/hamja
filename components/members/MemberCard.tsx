import React from 'react';
import Link from 'next/link';
import { ShieldCheck, MapPin, ArrowLeft, HeartHandshake, Compass, Quote, CheckCircle } from 'lucide-react';
import { Profile } from '@/types/database';
import { useAuth } from '@/lib/auth-context';
import { toPersianDigits, getAvatarUrl } from '@/lib/persian-utils';

interface MemberCardProps {
  member: Profile;
}

export default function MemberCard({ member }: MemberCardProps) {
  const { currentUser } = useAuth();
  const isOwnCard = !!(currentUser && currentUser.id === member.id);
  const isTravelerOnly = member.can_host === false || member.role === 'traveler';

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EADFD5] shadow-xs hover:shadow-xl hover:-translate-y-1.5 hover:border-[#C25E38]/30 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
      {/* Subtle background decoration on hover */}
      <div className="absolute -top-12 -left-12 w-28 h-28 bg-[#C25E38]/5 rounded-full blur-2xl group-hover:bg-[#C25E38]/10 transition-colors pointer-events-none" />

      <div>
        {/* Top Header: Avatar & Verified Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="relative">
            <img
              src={getAvatarUrl(member.avatar_url)}
              alt={member.full_name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#EADFD5] group-hover:ring-[#C25E38]/40 group-hover:scale-102 transition-all duration-300 bg-[#F4EFEA]"
            />
            {member.is_identity_verified && (
              <span
                className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#1E5647] text-white rounded-full flex items-center justify-center text-[10px] shadow-md ring-2 ring-white"
                title="هویت احراز شده با استعلام کد ملی و سلفی زنده"
              >
                ✓
              </span>
            )}
          </div>

          {/* Verification Badge */}
          {member.is_identity_verified ? (
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EBF5F1] text-[#1E5647] text-xs font-bold border border-[#1E5647]/20 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1E5647]" />
              <span>هویت تأییدشده</span>
            </div>
          ) : (
            <span className="text-[11px] text-gray-400 font-medium">عضو همجا</span>
          )}
        </div>

        {/* Name and City */}
        <div className="mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="text-base font-extrabold text-[#1F2937] group-hover:text-[#C25E38] transition-colors leading-snug">
              {member.full_name}
            </h3>
            {isOwnCard && (
              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md border border-amber-200">
                (شما)
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#C25E38] shrink-0" />
            <span>{member.city}</span>
            {member.age && <span className="text-gray-300">•</span>}
            {member.age && <span>{toPersianDigits(member.age)} ساله</span>}
          </p>
        </div>

        {/* Dynamic Badge: Traveler (Seeking Host) vs Host (Ready) */}
        <div className="my-3">
          {isTravelerOnly ? (
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 text-sky-800 text-xs font-bold border border-sky-200 shadow-xs">
                <Compass className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                {member.target_destination ? (
                  <span>قصد سفر به {member.target_destination} (مشتاق میزبان)</span>
                ) : (
                  <span>مسافر · در جستجوی میزبان</span>
                )}
              </span>
              {member.target_travel_dates && (
                <p className="text-[11px] text-gray-500 font-medium pr-1">
                  تاریخ سفر: {member.target_travel_dates}
                </p>
              )}
            </div>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EBF5F1] text-[#1E5647] text-xs font-bold border border-[#1E5647]/20 shadow-xs">
              <HeartHandshake className="w-3.5 h-3.5 text-[#1E5647] shrink-0" />
              <span>{member.role === 'host' ? 'آماده میزبانی از مسافران' : 'آماده میزبانی متقابل'}</span>
            </span>
          )}
        </div>

        {/* Interests Tags */}
        {member.interests && member.interests.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {member.interests.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium text-[#C25E38] bg-[#FBF4F0] px-2.5 py-0.5 rounded-lg border border-[#C25E38]/15 group-hover:border-[#C25E38]/30 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Bio Quote */}
        {member.bio_headline && (
          <div className="relative text-xs text-gray-600 line-clamp-2 leading-relaxed bg-[#F9F8F6] p-3 rounded-2xl border border-gray-100 mb-4 group-hover:bg-[#FAF7F4] transition-colors">
            <Quote className="w-3.5 h-3.5 text-[#C25E38]/30 absolute top-2 left-2 rotate-180" />
            <p className="italic pr-1">&ldquo;{member.bio_headline}&rdquo;</p>
          </div>
        )}
      </div>

      {/* Footer Info & Action */}
      <div className="pt-3.5 border-t border-gray-100 flex items-center justify-between text-xs">
        <span className="text-[11px] text-gray-500 font-medium">
          {isTravelerOnly
            ? 'مسافر مهمان همجا'
            : member.hosting_count && member.hosting_count > 0
            ? `${toPersianDigits(member.hosting_count)} تجربه میزبانی`
            : `عضو از ${toPersianDigits(member.member_since_year || '۱۴۰۴')}`}
        </span>
        <Link
          href={isOwnCard ? '/profile' : `/members/${member.id}`}
          className="inline-flex items-center gap-1.5 font-bold text-[#C25E38] group-hover:text-[#A84E2D] hover:underline"
        >
          <span>
            {isOwnCard
              ? 'پروفایل شما'
              : isTravelerOnly
              ? 'پیشنهاد میزبانی'
              : 'مشاهده پروفایل'}
          </span>
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
