'use client';

import React, { useMemo } from 'react';
import { MapPin, Info, Compass, X, Users, Sparkles } from 'lucide-react';
import { UserProfile } from '@/types/database';
import { toPersianDigits } from '@/lib/persian-utils';

interface CityCoordinate {
  name: string;
  topPercent: number;
  leftPercent: number;
  province?: string;
}

// Geographically calibrated coordinates for Iranian cities (Percentage relative to map container)
const CITY_COORDINATES: Record<string, { topPercent: number; leftPercent: number; province: string }> = {
  'تبریز': { topPercent: 16.3, leftPercent: 16.7, province: 'آذربایجان شرقی' },
  'ارومیه': { topPercent: 20.2, leftPercent: 13.3, province: 'آذربایجان غربی' },
  'اردبیل': { topPercent: 15.4, leftPercent: 24.2, province: 'اردبیل' },
  'رشت': { topPercent: 21.2, leftPercent: 31.7, province: 'گیلان' },
  'ساری': { topPercent: 25.0, leftPercent: 45.8, province: 'مازندران' },
  'گرگان': { topPercent: 23.1, leftPercent: 53.3, province: 'گلستان' },
  'مشهد': { topPercent: 27.9, leftPercent: 77.5, province: 'خراسان رضوی' },
  'بجنورد': { topPercent: 20.0, leftPercent: 68.0, province: 'خراسان شمالی' },
  'بیرجند': { topPercent: 52.0, leftPercent: 75.0, province: 'خراسان جنوبی' },
  'تهران': { topPercent: 31.7, leftPercent: 39.2, province: 'تهران' },
  'کرج': { topPercent: 30.8, leftPercent: 36.7, province: 'البرز' },
  'قزوین': { topPercent: 28.8, leftPercent: 32.5, province: 'قزوین' },
  'زنجان': { topPercent: 26.0, leftPercent: 26.7, province: 'زنجان' },
  'سنندج': { topPercent: 34.6, leftPercent: 20.0, province: 'کردستان' },
  'کرمانشاه': { topPercent: 41.3, leftPercent: 19.2, province: 'کرمانشاه' },
  'ایلام': { topPercent: 46.0, leftPercent: 16.0, province: 'ایلام' },
  'همدان': { topPercent: 37.5, leftPercent: 25.8, province: 'همدان' },
  'اراک': { topPercent: 42.0, leftPercent: 31.0, province: 'مرکزی' },
  'قم': { topPercent: 39.4, leftPercent: 37.5, province: 'قم' },
  'کاشان': { topPercent: 44.2, leftPercent: 40.0, province: 'اصفهان' },
  'اصفهان': { topPercent: 51.9, leftPercent: 40.8, province: 'اصفهان' },
  'خرم‌آباد': { topPercent: 45.0, leftPercent: 24.5, province: 'لرستان' },
  'اهواز': { topPercent: 60.6, leftPercent: 25.0, province: 'خوزستان' },
  'دزفول': { topPercent: 53.0, leftPercent: 24.0, province: 'خوزستان' },
  'آبادان': { topPercent: 67.0, leftPercent: 23.5, province: 'خوزستان' },
  'شهرکرد': { topPercent: 54.0, leftPercent: 36.0, province: 'چهارمحال و بختیاری' },
  'یاسوج': { topPercent: 64.0, leftPercent: 39.5, province: 'کهگیلویه و بویراحمد' },
  'شیراز': { topPercent: 70.2, leftPercent: 44.2, province: 'فارس' },
  'بوشهر': { topPercent: 74.0, leftPercent: 34.2, province: 'بوشهر' },
  'یزد': { topPercent: 56.7, leftPercent: 54.2, province: 'یزد' },
  'کرمان': { topPercent: 66.3, leftPercent: 65.0, province: 'کرمان' },
  'بندرعباس': { topPercent: 83.7, leftPercent: 60.8, province: 'هرمزگان' },
  'کیش': { topPercent: 86.5, leftPercent: 50.0, province: 'هرمزگان' },
  'قشم': { topPercent: 86.5, leftPercent: 59.2, province: 'هرمزگان' },
  'زاهدان': { topPercent: 71.2, leftPercent: 80.8, province: 'سیستان و بلوچستان' },
  'چابهار': { topPercent: 92.3, leftPercent: 80.0, province: 'سیستان و بلوچستان' },
};

// Major landmark hubs to always show as subtle reference points on Iran map
const BASE_HUBS = ['تهران', 'اصفهان', 'شیراز', 'مشهد', 'تبریز', 'رشت', 'یزد', 'بوشهر', 'کیش'];

interface IranMapProps {
  selectedCity: string;
  onSelectCity: (city: string) => void;
  users?: UserProfile[];
}

export default function IranMap({ selectedCity, onSelectCity, users = [] }: IranMapProps) {
  // Aggregate real member counts per city
  const cityCounts = useMemo(() => {
    const counts: Record<string, { total: number; hosts: number; travelers: number }> = {};
    users.forEach((u) => {
      const cityName = u.city?.trim();
      if (cityName) {
        if (!counts[cityName]) {
          counts[cityName] = { total: 0, hosts: 0, travelers: 0 };
        }
        counts[cityName].total += 1;
        if (u.can_host !== false && u.role !== 'traveler') {
          counts[cityName].hosts += 1;
        } else {
          counts[cityName].travelers += 1;
        }
      }
    });
    return counts;
  }, [users]);

  // Combine cities with registered members + baseline hubs
  const displayedCities = useMemo(() => {
    const citiesSet = new Set<string>();

    // 1. Add all cities where users actually exist
    Object.keys(cityCounts).forEach((c) => citiesSet.add(c));

    // 2. Add base hubs
    BASE_HUBS.forEach((c) => citiesSet.add(c));

    // Map to coordinate objects
    return Array.from(citiesSet).map((cityName) => {
      const coord = CITY_COORDINATES[cityName] || {
        topPercent: 50,
        leftPercent: 50,
        province: 'ایران',
      };
      const stats = cityCounts[cityName] || { total: 0, hosts: 0, travelers: 0 };
      return {
        name: cityName,
        topPercent: coord.topPercent,
        leftPercent: coord.leftPercent,
        province: coord.province,
        memberCount: stats.total,
        hostCount: stats.hosts,
        travelerCount: stats.travelers,
        hasActiveMembers: stats.total > 0,
      };
    });
  }, [cityCounts]);

  const totalMembers = users.length;
  const activeCitiesCount = Object.keys(cityCounts).length;

  return (
    <div className="bg-white rounded-3xl p-5 border border-[#EADFD5] shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-[#1F2937] flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-[#C25E38]" />
          <span>میزبان‌های همجا روی نقشه</span>
        </h4>
        <span className="text-[11px] text-gray-500 font-medium">
          {totalMembers > 0
            ? `${toPersianDigits(totalMembers)} عضو در ${toPersianDigits(activeCitiesCount)} شهر`
            : 'شهرهای فعال ایران'}
        </span>
      </div>

      {/* Selected City Filter Pill Bar */}
      {selectedCity && (
        <div className="mb-3 px-3.5 py-2 bg-[#FBF4F0] border border-[#C25E38]/30 rounded-2xl flex items-center justify-between text-xs animate-fade-in">
          <span className="font-bold text-[#C25E38] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            فیلتر فعال: اعضای شهر {selectedCity}
          </span>
          <button
            onClick={() => onSelectCity('')}
            className="text-[11px] font-bold text-gray-600 hover:text-red-600 flex items-center gap-1 bg-white px-2 py-1 rounded-xl shadow-sm transition-colors"
          >
            <X className="w-3 h-3" />
            <span>حذف فیلتر نقشه</span>
          </button>
        </div>
      )}

      {/* Interactive Map Visual Area */}
      <div className="relative w-full h-88 sm:h-96 bg-gradient-to-b from-[#F5F9FA] via-[#FCFAF7] to-[#F5F9FA] rounded-3xl border border-[#EADFD5] overflow-hidden flex items-center justify-center select-none shadow-inner">
        {/* Sea Background Labels */}
        <div className="absolute top-2.5 right-6 z-0 flex items-center gap-1 text-[11px] font-black text-sky-800/80 bg-sky-100/60 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-sky-200/50">
          <span>دریای خزر</span>
        </div>

        <div className="absolute bottom-3 left-6 z-0 flex items-center gap-1 text-[11px] font-black text-sky-800/80 bg-sky-100/60 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-sky-200/50">
          <span>خلیج فارس</span>
        </div>

        {/* Decorative Compass Rose */}
        <div className="absolute top-3 left-3 opacity-20 pointer-events-none">
          <Compass className="w-8 h-8 text-[#1E5647]" />
        </div>

        {/* Authentic SVG Map of Iran Vector Outline */}
        <svg
          viewBox="0 0 600 520"
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          {/* Subtle water waves for Caspian */}
          <path
            d="M 170 50 Q 230 70 300 65 T 400 55"
            fill="none"
            stroke="#BAE6FD"
            strokeWidth="3"
            strokeDasharray="4 6"
            opacity="0.6"
          />

          {/* Iran Mainland Silhouette Path */}
          <path
            d="M 75 75 
               C 95 65, 120 70, 140 60 
               C 150 55, 165 70, 175 80 
               C 195 95, 230 110, 260 112 
               C 290 114, 325 110, 350 90 
               C 370 75, 410 70, 440 85 
               C 470 95, 510 110, 520 135 
               C 530 155, 515 180, 505 200 
               C 495 230, 490 265, 495 295 
               C 500 325, 530 360, 535 400 
               C 538 435, 525 460, 505 475 
               C 475 480, 420 480, 375 460 
               C 350 450, 335 435, 330 420 
               C 320 405, 290 415, 260 410 
               C 225 405, 205 380, 190 355 
               C 180 340, 160 325, 140 315 
               C 125 300, 115 260, 110 220 
               C 105 185, 95 150, 85 120 
               Z"
            fill="#FFFFFF"
            stroke="#E0D3C5"
            strokeWidth="3"
            strokeLinejoin="round"
            className="filter drop-shadow-sm"
          />

          {/* Persian Gulf Islands: Kish & Qeshm */}
          <ellipse cx="300" cy="450" rx="8" ry="4" fill="#C25E38" fillOpacity="0.3" stroke="#C25E38" strokeWidth="1.5" />
          <ellipse cx="355" cy="450" rx="14" ry="5" fill="#1E5647" fillOpacity="0.3" stroke="#1E5647" strokeWidth="1.5" />

          {/* Stylized Alborz & Zagros Mountain Ridges */}
          <path
            d="M 180 120 Q 250 140 340 125"
            fill="none"
            stroke="#EADFD5"
            strokeWidth="2"
            strokeDasharray="2 3"
          />
          <path
            d="M 130 180 Q 180 270 270 370"
            fill="none"
            stroke="#EADFD5"
            strokeWidth="2"
            strokeDasharray="2 3"
          />
        </svg>

        {/* Dynamic City Markers */}
        {displayedCities.map((city) => {
          const isSelected = selectedCity === city.name;
          const hasMembers = city.hasActiveMembers;

          return (
            <button
              type="button"
              key={city.name}
              onClick={() => onSelectCity(isSelected ? '' : city.name)}
              style={{
                top: `${city.topPercent}%`,
                left: `${city.leftPercent}%`,
              }}
              title={`${city.name} (${city.province}) - ${city.memberCount} عضو`}
              className={`absolute -translate-x-1/2 -translate-y-1/2 group z-10 transition-all cursor-pointer ${
                isSelected ? 'scale-125 z-30' : hasMembers ? 'scale-105 hover:scale-115 z-20' : 'hover:scale-110 opacity-75 hover:opacity-100 z-10'
              }`}
            >
              {/* Outer pulsing ring for cities with registered members */}
              {hasMembers && !isSelected && (
                <span className="absolute -inset-1 rounded-full bg-[#C25E38]/20 animate-ping pointer-events-none" />
              )}

              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md transition-all ${
                  isSelected
                    ? 'bg-[#C25E38] text-white ring-4 ring-[#C25E38]/30 scale-110 shadow-lg'
                    : hasMembers
                    ? 'bg-white text-gray-900 border-2 border-[#C25E38] hover:bg-[#FBF4F0]'
                    : 'bg-white/90 text-gray-600 border border-gray-300 hover:border-[#C25E38]'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    isSelected
                      ? 'bg-white'
                      : hasMembers
                      ? 'bg-[#C25E38]'
                      : 'bg-gray-400'
                  }`}
                />
                <span className="whitespace-nowrap">{city.name}</span>
                {hasMembers && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-black ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-[#C25E38] text-white'
                    }`}
                  >
                    {toPersianDigits(city.memberCount)}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Safety & Instructions Footer */}
      <div className="mt-4 p-3.5 bg-[#F9F8F6] rounded-2xl border border-[#EADFD5] text-[11px] text-gray-600 flex items-start gap-2 leading-relaxed">
        <Info className="w-4 h-4 text-[#C25E38] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-gray-800">
            {totalMembers > 0
              ? `شبکه میزبانی با ${totalMembers} عضو فعال`
              : 'شروع شبکه همجا'}
          </span>
          <p className="mt-0.5">
            با کلیک روی هر شهر روی نقشه، اعضای آن شهر فیلتر می‌شوند. جهت حفظ امنیت و حریم خصوصی، نشان‌ها محدوده کلی شهر را نمایش می‌دهند نه نشانی دقیق.
          </p>
        </div>
      </div>
    </div>
  );
}
