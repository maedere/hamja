import React from 'react';
import Link from 'next/link';
import { MapPin, ArrowLeft, Check } from 'lucide-react';
import { Profile } from '@/types/database';
import { useAuth } from '@/lib/auth-context';
import { toPersianDigits, getAvatarUrl } from '@/lib/persian-utils';

interface MemberCardProps {
  member: Profile;
}

// Stylized Persian Arch SVG with authentic pointed arches
function PersianArchIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      {/* Outer shoulder arches */}
      <path
        d="M -15 100 L -15 75 Q 15 52 45 44"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.3"
      />
      <path
        d="M 255 100 L 255 75 Q 225 52 195 44"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.3"
      />

      {/* Left Arch */}
      <path
        d="M 12 100 L 12 60 Q 12 32 45 22 Q 78 32 78 60 L 78 100"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M 20 100 L 20 62 Q 20 38 45 30 Q 70 38 70 62 L 70 100"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* Right Arch */}
      <path
        d="M 162 100 L 162 60 Q 162 32 195 22 Q 228 32 228 60 L 228 100"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M 170 100 L 170 62 Q 170 38 195 30 Q 220 38 220 62 L 220 100"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* Center Grand Pointed Arch */}
      <path
        d="M 68 100 L 68 50 Q 68 14 120 6 Q 172 14 172 50 L 172 100"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M 76 100 L 76 53 Q 76 22 120 14 Q 164 22 164 53 L 164 100"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M 84 100 L 84 57 Q 84 30 120 22 Q 156 30 156 57 L 156 100"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  );
}

function getCardTheme(member: Profile, isTravelerOnly: boolean) {
  if (isTravelerOnly) {
    return {
      bannerGradient: 'bg-gradient-to-r from-[#4E99B8] via-[#66AEC8] to-[#96CBDC]',
      archColor: 'text-[#286C88]',
      buttonClass: 'bg-[#C25E38] hover:bg-[#A84E2D] text-white shadow-sm hover:shadow-md',
      buttonText: 'پیشنهاد میزبانی',
      footerText: 'مسافر مهمان هم‌بام',
    };
  }

  // Check if member should get the warm terracotta theme or sage green theme
  const isTerracotta =
    member.city === 'اصفهان' ||
    member.full_name?.includes('سارا') ||
    member.id === 'sara-rahimi' ||
    (member.id ? member.id.charCodeAt(member.id.length - 1) % 2 === 0 : false);

  if (isTerracotta) {
    return {
      bannerGradient: 'bg-gradient-to-r from-[#CE714D] via-[#DF8561] to-[#EBB393]',
      archColor: 'text-[#9E4522]',
      buttonClass: 'bg-[#F8EFE9] hover:bg-[#EFE2D6] text-[#8C3D1E]',
      buttonText: 'مشاهده پروفایل',
      footerText: member.member_since_year ? `عضو از ${toPersianDigits(member.member_since_year)}` : 'عضو هم‌بام',
    };
  }

  return {
    bannerGradient: 'bg-gradient-to-r from-[#5A947C] via-[#6FA38D] to-[#9DC3B1]',
    archColor: 'text-[#356853]',
    buttonClass: 'bg-[#F8EFE9] hover:bg-[#EFE2D6] text-[#8C3D1E]',
    buttonText: 'مشاهده پروفایل',
    footerText: member.member_since_year ? `عضو از ${toPersianDigits(member.member_since_year)}` : 'عضو از ۱۴۰۵',
  };
}

export default function MemberCard({ member }: MemberCardProps) {
  const { currentUser } = useAuth();
  const isOwnCard = !!(currentUser && currentUser.id === member.id);
  const isTravelerOnly = member.can_host === false || member.role === 'traveler';
  const theme = getCardTheme(member, isTravelerOnly);

  // Clean bio headline from extra quotes
  const cleanBio = member.bio_headline ? member.bio_headline.replace(/^[«"'\s]+|[»"'\s]+$/g, '') : '';

  return (
    <div className="bg-white rounded-[28px] sm:rounded-[32px] border border-[#EADFD5] shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden group select-none relative">
      <div>
        {/* Architectural Header Banner with Persian Arches */}
        <div className={`relative h-28 sm:h-32 w-full ${theme.bannerGradient} overflow-hidden flex items-end justify-center`}>
          <div className={`absolute inset-0 w-full h-full opacity-45 ${theme.archColor} pointer-events-none`}>
            <PersianArchIllustration className="w-full h-full" />
          </div>
        </div>

        {/* Avatar with White Ring & Verified Checkmark */}
        <div className="relative -mt-11 sm:-mt-13 mb-3 flex justify-center z-10">
          <div className="relative">
            <img
              src={getAvatarUrl(member.avatar_url)}
              alt={member.full_name}
              className="w-20 h-20 sm:w-[84px] sm:h-[84px] rounded-full object-cover ring-4 ring-white shadow-md bg-[#F4EFEA] group-hover:scale-103 transition-transform duration-300"
            />
            {member.is_identity_verified && (
              <span
                className="absolute bottom-0 right-0 sm:right-0.5 w-6 h-6 rounded-full bg-[#1E5647] text-white flex items-center justify-center ring-2 ring-white shadow-xs"
                title="هویت تأییدشده"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span className="sr-only">هویت تأییدشده</span>
              </span>
            )}
          </div>
        </div>

        {/* Name and City */}
        <div className="text-center px-4 mb-3">
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            <h3 className="text-base sm:text-lg font-black text-gray-900 group-hover:text-[#C25E38] transition-colors leading-tight">
              {member.full_name}
            </h3>
            {isOwnCard && (
              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md border border-amber-200">
                (شما)
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 font-medium flex items-center justify-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span>{member.city}</span>
            {member.age && <span className="text-gray-300">•</span>}
            {member.age && <span>{toPersianDigits(member.age)} ساله</span>}
          </p>
        </div>

        {/* Status Pill Badge */}
        <div className="flex justify-center px-4 mb-3">
          {isTravelerOnly ? (
            <span className="inline-flex items-center justify-center gap-1 px-3.5 py-1.5 rounded-full bg-[#EAF5F9] text-[#1E6888] border border-[#BCE1EE] text-xs font-bold shadow-2xs text-center">
              {member.target_destination ? (
                <>
                  <span className="sr-only">قصد سفر به {member.target_destination} (مشتاق میزبان)</span>
                  <span>
                    قصد سفر به {member.target_destination}
                    {member.target_travel_dates ? ` • ${member.target_travel_dates}` : ''}
                  </span>
                </>
              ) : (
                <span>مسافر مهمان • در جستجوی میزبان</span>
              )}
            </span>
          ) : (
            <span className="inline-flex items-center justify-center gap-1 px-4 py-1.5 rounded-full bg-[#EBF5F1] text-[#1E5647] border border-[#C6E7D9] text-xs font-bold shadow-2xs text-center">
              <span>
                {member.role === 'host'
                  ? 'آماده میزبانی از مسافران'
                  : 'آماده میزبانی متقابل'}
              </span>
            </span>
          )}
        </div>

        {/* Interests Tags */}
        {member.interests && member.interests.length > 0 && (
          <div className="flex items-center justify-center flex-wrap gap-1.5 px-4 mb-3">
            {member.interests.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-bold text-[#9C4A28] bg-[#FBF3EE] px-2.5 py-1 rounded-lg border border-[#F4DACF]/80 group-hover:border-[#C25E38]/30 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Bio Headline Quote Box */}
        {cleanBio && (
          <div className="px-4 mb-3.5">
            <div className="bg-[#FAF7F3] p-3 rounded-2xl border border-[#EFE8E0] text-center min-h-[52px] flex items-center justify-center">
              <p className="text-xs sm:text-[13px] font-bold text-gray-700 leading-relaxed line-clamp-2">
                «{cleanBio}»
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Button & Footer Info */}
      <div className="flex flex-col mt-auto">
        <div className="px-4 sm:px-5 mb-3.5">
          <Link
            href={isOwnCard ? '/profile' : `/members/${member.id}`}
            className={`w-full py-2.5 sm:py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all duration-200 ${
              isOwnCard
                ? 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                : theme.buttonClass
            }`}
          >
            <span>{isOwnCard ? 'پروفایل شما' : theme.buttonText}</span>
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>

        <div className="pt-2.5 pb-3.5 border-t border-gray-100/90 text-center text-[11px] text-gray-400 font-medium">
          {theme.footerText}
        </div>
      </div>
    </div>
  );
}
