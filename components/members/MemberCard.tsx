import React from 'react';
import Link from 'next/link';
import { ShieldCheck, MapPin, ArrowLeft, HeartHandshake } from 'lucide-react';
import { Profile } from '@/types/database';

interface MemberCardProps {
  member: Profile;
}

export default function MemberCard({ member }: MemberCardProps) {
  return (
    <div className="bg-white rounded-3xl p-5 border border-[#EADFD5] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Top Header: Avatar & Verified Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="relative">
            <img
              src={member.avatar_url}
              alt={member.full_name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#EADFD5] group-hover:ring-[#C25E38]/30 transition-all"
            />
            {member.is_identity_verified && (
              <span
                className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#1E5647] text-white rounded-full flex items-center justify-center text-[10px] shadow"
                title="هویت تأییدشده"
              >
                ✓
              </span>
            )}
          </div>

          {/* Verification Badge */}
          {member.is_identity_verified && (
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EBF5F1] text-[#1E5647] text-xs font-semibold border border-[#1E5647]/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>هویت تأییدشده</span>
            </div>
          )}
        </div>

        {/* Name and City */}
        <div className="mb-2">
          <h3 className="text-base font-bold text-[#1F2937] group-hover:text-[#C25E38] transition-colors flex items-center gap-1.5">
            {member.full_name}
          </h3>
          <p className="text-xs text-[#6B7280] flex items-center gap-1 mt-0.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#C25E38]" />
            {member.city}
          </p>
        </div>

        {/* Ready Badge: آماده میزبانی متقابل */}
        <div className="my-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#EBF5F1] text-[#1E5647] text-xs font-medium border border-[#1E5647]/15">
            <HeartHandshake className="w-3.5 h-3.5" />
            آماده میزبانی متقابل
          </span>
        </div>

        {/* Interests Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {member.interests?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-medium text-[#C25E38] bg-[#FBF4F0] px-2 py-0.5 rounded-lg"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Bio Quote */}
        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed italic bg-[#F9F8F6] p-2.5 rounded-xl border border-gray-100 mb-4">
          &ldquo;{member.bio_headline}&rdquo;
        </p>
      </div>

      {/* Footer Info & Action */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-[11px] text-gray-500 font-normal">
          {member.hosting_count} تجربه میزبانی · عضو از {member.member_since_year}
        </span>
        <Link
          href={`/members/${member.id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#C25E38] group-hover:text-[#A84E2D] hover:underline"
        >
          <span>مشاهده پروفایل</span>
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
