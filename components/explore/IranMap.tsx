'use client';

import React from 'react';
import { MapPin, Info } from 'lucide-react';

interface CityPoint {
  id: string;
  name: string;
  topPercent: number;
  leftPercent: number;
  hostCount: number;
}

const CITIES: CityPoint[] = [
  { id: 'تبریز', name: 'تبریز', topPercent: 22, leftPercent: 20, hostCount: 1 },
  { id: 'رشت', name: 'رشت', topPercent: 28, leftPercent: 35, hostCount: 1 },
  { id: 'تهران', name: 'تهران', topPercent: 36, leftPercent: 48, hostCount: 1 },
  { id: 'اصفهان', name: 'اصفهان', topPercent: 54, leftPercent: 49, hostCount: 1 },
  { id: 'شیراز', name: 'شیراز', topPercent: 72, leftPercent: 54, hostCount: 1 },
  { id: 'بوشهر', name: 'بوشهر', topPercent: 78, leftPercent: 42, hostCount: 1 },
];

interface IranMapProps {
  selectedCity: string;
  onSelectCity: (city: string) => void;
}

export default function IranMap({ selectedCity, onSelectCity }: IranMapProps) {
  return (
    <div className="bg-white rounded-3xl p-5 border border-[#EADFD5] shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-[#1F2937] flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-[#C25E38]" />
          <span>میزبان‌های همجا روی نقشه</span>
        </h4>
        <span className="text-[11px] text-gray-500 font-medium">۶ عضو در ۶ شهر ایران</span>
      </div>

      {/* Stylized SVG Map Representation */}
      <div className="relative w-full h-80 bg-[#FBF9F5] rounded-2xl border border-[#EADFD5] overflow-hidden flex items-center justify-center p-4">
        {/* Geographic labels */}
        <span className="absolute top-3 right-6 text-[11px] text-sky-800 font-medium">
          دریای خزر
        </span>
        <span className="absolute bottom-4 left-8 text-[11px] text-sky-800 font-medium">
          خلیج فارس
        </span>
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-black text-gray-200 pointer-events-none select-none tracking-widest">
          ایران
        </span>

        {/* Iran Map Outline Sketch */}
        <svg
          viewBox="0 0 400 350"
          className="absolute inset-0 w-full h-full text-[#EADFD5] fill-white stroke-current stroke-2 pointer-events-none opacity-80"
        >
          <path d="M 60 50 Q 120 40 180 50 T 260 70 Q 340 90 350 160 T 320 280 Q 240 320 180 310 T 90 280 Q 40 220 50 140 Z" />
        </svg>

        {/* City Markers */}
        {CITIES.map((city) => {
          const isSelected = selectedCity === city.name;
          return (
            <button
              key={city.id}
              onClick={() => onSelectCity(isSelected ? '' : city.name)}
              style={{
                top: `${city.topPercent}%`,
                left: `${city.leftPercent}%`,
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 group z-10 transition-transform ${
                isSelected ? 'scale-125 z-20' : 'hover:scale-110'
              }`}
            >
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold shadow-md transition-all ${
                  isSelected
                    ? 'bg-[#C25E38] text-white ring-4 ring-[#C25E38]/20'
                    : 'bg-white text-gray-800 border border-gray-300 hover:border-[#C25E38]'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isSelected ? 'bg-white' : 'bg-[#C25E38]'
                  }`}
                />
                <span>{city.name}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Safety & Privacy Notice matching Page 4 */}
      <div className="mt-4 p-3.5 bg-[#F9F8F6] rounded-2xl border border-[#EADFD5] text-[11px] text-gray-600 flex items-start gap-2 leading-relaxed">
        <Info className="w-4 h-4 text-[#C25E38] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-gray-800">۶ میزبان، ۶ شروع تازه</span>
          <p className="mt-0.5">
            نشان‌ها محدوده تقریبی شهر را نمایش می‌دهند، نه نشانی دقیق خانه اعضا. حریم خصوصی شما همواره اولویت همجاست.
          </p>
        </div>
      </div>
    </div>
  );
}
