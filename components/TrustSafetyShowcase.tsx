import React from 'react';
import { ShieldCheck, UserCheck, Heart, Lock, Check, Star } from 'lucide-react';

export default function TrustSafetyShowcase() {
  return (
    <section id="trust" className="py-20 sm:py-24 bg-[#FAF8F5] border-y border-[#EADFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EBF5F1] text-[#1E5647] text-xs font-bold mb-3.5 border border-[#C6E7D9] shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-[#1E5647]" />
            <span>اعتماد، پیش از اولین سلام</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1F2937] tracking-tight mb-4">
            با خیال راحت <span className="text-[#C25E38]">درِ خانه</span> را باز کن
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto font-medium leading-relaxed">
            امنیت اولویت نخست ماست. مکانیزم‌های چندلایه هم‌بام برای تضمین آسودگی خاطر شما طراحی شده‌اند.
          </p>
        </div>

        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Right Column (in RTL): Big Selfie KYC Card */}
          <div className="lg:col-span-6 bg-white rounded-[32px] p-6 sm:p-8 lg:p-10 border border-[#EADFD5] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            {/* Phone Mockup on left */}
            <div className="relative shrink-0 mx-auto md:mx-0">
              {/* iPhone Frame */}
              <div className="w-[230px] sm:w-[250px] h-[380px] sm:h-[410px] rounded-[44px] p-2.5 bg-gradient-to-b from-[#24292E] via-[#1A1E22] to-[#0D1013] shadow-[0_20px_50px_rgba(0,0,0,0.18)] relative ring-1 ring-white/20 border border-gray-700/50">
                {/* Screen */}
                <div className="w-full h-full rounded-[35px] overflow-hidden relative bg-black flex flex-col justify-between select-none">
                  {/* Dynamic Island */}
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-30 flex items-center justify-end px-2 gap-1.5 shadow-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#11161B] ring-1 ring-[#1f2937]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/90" />
                  </div>

                  {/* Selfie Photo */}
                  <img
                    src="/images/verification-selfie.jpg"
                    alt="احراز هویت سلفی همراه با کارت ملی"
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />

                  {/* Floating ID Card Graphic peeking in corner (as seen in mockup) */}
                  <div className="absolute top-24 -left-4 w-28 h-18 rounded-lg bg-white/95 p-1.5 shadow-xl border border-sky-200 transform -rotate-6 z-20 pointer-events-none hidden sm:block opacity-90">
                    <div className="flex items-center justify-between text-[6px] font-bold text-sky-900 border-b border-sky-100 pb-0.5">
                      <span>ایران</span>
                      <span>کارت ملی</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="w-4 h-5 rounded-xs bg-gray-600" />
                      <div className="space-y-0.5">
                        <div className="h-1 w-8 bg-sky-200 rounded-full" />
                        <div className="h-1 w-6 bg-sky-100 rounded-full" />
                      </div>
                    </div>
                  </div>

                  {/* Glowing Match Badge inside Screen */}
                  <div className="absolute bottom-5 inset-x-4 z-30">
                    <div className="bg-black/65 backdrop-blur-md border border-emerald-400/60 shadow-[0_0_24px_rgba(16,185,129,0.45)] py-2.5 px-3.5 rounded-2xl flex items-center justify-center gap-2 text-white text-xs font-black">
                      <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                      <span>تأیید و تطبیق شد</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Text description on right */}
            <div className="text-right flex-1 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FDF4EE] border border-[#F5D9C8] flex items-center justify-center text-[#C25E38] shadow-2xs">
                <ShieldCheck className="w-6 h-6 text-[#C25E38]" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-gray-900">
                احراز هویت سلفی با کارت ملی
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                ارسال یک عکس سلفی همراه با کارت ملی در کنار صورت، برای تطبیق دقیق هویت و اطمینان از واقعی بودن هر پروفایل.
              </p>
            </div>
          </div>

          {/* Left Column (in RTL): 2 Stacked Cards */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-6">
            {/* Top Card: National ID */}
            <div className="bg-white rounded-[32px] p-6 sm:p-7 border border-[#EADFD5] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col-reverse sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
              {/* National ID Illustration on left */}
              <div className="relative shrink-0 flex flex-col items-center">
                <div className="w-56 sm:w-60 rounded-2xl p-3.5 bg-gradient-to-br from-[#EEF7FC] via-[#F4F9FD] to-[#E3F0F8] border border-sky-200/80 shadow-md relative overflow-hidden text-right select-none">
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-sky-200/60 mb-2">
                    <div className="flex items-center gap-1.5">
                      {/* Flag */}
                      <div className="w-4 h-2.5 rounded-xs overflow-hidden border border-gray-300 flex flex-col shadow-2xs">
                        <span className="h-1/3 bg-[#239f40]" />
                        <span className="h-1/3 bg-white" />
                        <span className="h-1/3 bg-[#da0000]" />
                      </div>
                      <span className="text-[8px] font-bold text-sky-900/80">جمهوری اسلامی ایران</span>
                    </div>
                    <span className="text-[9px] font-black text-sky-950">کارت هوشمند ملی</span>
                  </div>

                  {/* Card Body */}
                  <div className="flex items-center gap-3">
                    {/* Silhouette Box */}
                    <div className="w-12 h-14 rounded-lg bg-white/95 border border-sky-300/80 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs relative">
                      <div className="w-7 h-7 rounded-full bg-gray-700 mx-auto mt-1" />
                      <div className="w-10 h-7 bg-gray-700 rounded-t-full absolute -bottom-1" />
                    </div>

                    {/* Chip and Masked Code */}
                    <div className="flex-1 space-y-1">
                      <div className="w-6 h-4.5 rounded-sm bg-gradient-to-br from-amber-200 via-amber-400 to-amber-500 border border-amber-600/70 shadow-2xs flex items-center justify-center">
                        <div className="w-4 h-2.5 border-t border-b border-amber-800/40" />
                      </div>
                      <div className="text-center font-black tracking-widest text-sky-950 text-xs sm:text-sm pt-0.5 dir-ltr font-mono">
                        ۰۰۲****۴۵۸
                      </div>
                      <div className="space-y-0.5 pt-0.5">
                        <div className="h-1 w-16 bg-sky-200/90 rounded-full" />
                        <div className="h-1 w-20 bg-sky-200/60 rounded-full" />
                      </div>
                    </div>
                  </div>

                  {/* Watermark Sun / Guilloche Curves */}
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full border border-sky-300/40 pointer-events-none" />
                  <div className="absolute -top-3 -right-3 w-14 h-14 rounded-full border border-sky-300/30 pointer-events-none" />

                  {/* Floating Glowing Lock Shield */}
                  <div className="absolute bottom-2 left-2 z-10 w-9 h-9 rounded-xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 text-amber-950 flex items-center justify-center shadow-[0_6px_18px_rgba(245,158,11,0.45)] border border-white/70">
                    <Lock className="w-4 h-4 text-amber-950" />
                  </div>
                </div>

                {/* Sub-badge: Confirmed & Encrypted */}
                <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF5F1] text-[#1E5647] border border-[#C6E7D9] text-[11px] font-bold shadow-2xs">
                  <Check className="w-3.5 h-3.5 text-[#1E5647] stroke-[2.5]" />
                  <span>مدارک تایید و رمزنگاری شد</span>
                </div>
              </div>

              {/* Text info on right */}
              <div className="text-right flex-1 space-y-2">
                <div className="w-11 h-11 rounded-2xl bg-[#EBF5F1] text-[#1E5647] flex items-center justify-center shadow-2xs">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-gray-900">
                  ثبت کد ملی و مدارک شناسایی
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  کد ملی و تصویر مدارک هویتی اعضا در سامانه ثبت و جهت امنیت جامعه و پیگیری‌های لازم نزد هم‌بام محفوظ می‌ماند.
                </p>
              </div>
            </div>

            {/* Bottom Card: Mutual Reviews */}
            <div className="bg-white rounded-[32px] p-6 sm:p-7 border border-[#EADFD5] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col-reverse sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
              {/* Stacked Review Bubbles on left */}
              <div className="relative shrink-0 flex flex-col items-center sm:items-start py-2">
                {/* Bubble 1: Sara (Host in Rasht) */}
                <div className="w-56 sm:w-60 bg-white rounded-2xl p-3 shadow-md border border-gray-100 relative z-10 text-right">
                  <div className="flex items-start gap-2.5">
                    {/* Sara Avatar */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#9B51E0] to-[#E289F2] ring-2 ring-purple-200 shrink-0 overflow-hidden flex items-center justify-center text-white text-xs font-bold shadow-xs">
                      <svg viewBox="0 0 36 36" className="w-full h-full" fill="currentColor">
                        <circle cx="18" cy="14" r="7" fill="#FAD0C4" />
                        <path d="M18 4 C11 4 9 9 9 15 C9 22 13 25 18 25 C23 25 27 22 27 15 C27 9 25 4 18 4 Z" fill="#4A306D" />
                        <circle cx="18" cy="15" r="5" fill="#FAD0C4" />
                        <path d="M10 34 C10 26 14 25 18 25 C22 25 26 26 26 34 Z" fill="#4A306D" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block text-[10px] text-gray-400 font-bold">سارا • میزبان در رشت:</span>
                      <p className="text-xs font-black text-gray-800 truncate mt-0.5">مهمان بسیار محترم و خوش‌سفر</p>
                      <div className="flex items-center gap-0.5 text-amber-400 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Bubble Pointer */}
                  <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white rotate-45 border-r border-b border-gray-100" />
                </div>

                {/* Bubble 2: Amir (Guest) */}
                <div className="w-56 sm:w-60 bg-white rounded-2xl p-3 shadow-lg border border-gray-100 relative -mt-2 mr-6 sm:mr-8 z-20 text-right">
                  <div className="flex items-start gap-2.5">
                    {/* Amir Avatar */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2F80ED] to-[#56CCF2] ring-2 ring-sky-200 shrink-0 overflow-hidden flex items-center justify-center text-white text-xs font-bold shadow-xs">
                      <svg viewBox="0 0 36 36" className="w-full h-full" fill="currentColor">
                        <circle cx="18" cy="14" r="7" fill="#FAD0C4" />
                        <path d="M12 10 C12 6 15 4 18 4 C21 4 24 6 24 10 C24 11 23 12 18 12 C13 12 12 11 12 10 Z" fill="#3E2723" />
                        <path d="M14 17 C14 20 16 22 18 22 C20 22 22 20 22 17 Z" fill="#3E2723" />
                        <path d="M10 34 C10 26 14 24 18 24 C22 24 26 26 26 34 Z" fill="#2F80ED" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block text-[10px] text-gray-400 font-bold">امیر • مهمان:</span>
                      <p className="text-xs font-black text-gray-800 truncate mt-0.5">تجربه عالی و میزبانی گرم!</p>
                      <div className="flex items-center gap-0.5 text-amber-400 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Bubble Pointer */}
                  <div className="absolute -bottom-1.5 right-8 w-3 h-3 bg-white rotate-45 border-r border-b border-gray-100" />
                </div>
              </div>

              {/* Text info on right */}
              <div className="text-right flex-1 space-y-2">
                <div className="w-11 h-11 rounded-2xl bg-[#EBF5F1] text-[#1E5647] flex items-center justify-center shadow-2xs">
                  <Heart className="w-5 h-5 fill-[#1E5647]" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-gray-900">
                  امتیاز و بازخورد دوطرفه
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  بعد از هر میزبانی، تجربه‌تان را برای هم و برای جامعه بنویسید تا زنجیره اعتماد روز به‌روز محکم‌تر شود.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
