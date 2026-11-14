import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#1E5647] text-[#EBF5F1] pt-14 pb-10 border-t border-[#164337]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand & Mission Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#FAF5EE] p-1 flex items-center justify-center shadow-xs shrink-0">
                <img
                  src="/images/logo-icon.png"
                  alt="لوگوی هم‌بام"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-2xl font-black text-white">هم‌بام</span>
              <span className="text-xs text-white/70 mr-2 border-r border-white/20 pr-2">
                خانه‌ای به وسعت دوستی
              </span>
            </div>
            <p className="text-sm text-white/80 leading-relaxed max-w-sm">
              هم‌بام، جمعی برای سفرهای انسانی‌تر؛ جایی برای آشنایی با آدم‌های محلی و تجربه میزبانی رایگان و دوطرفه. در هم‌بام، خانه مقصد بعدی یک دوست است.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <span className="text-xs text-white/60">همراهی در شبکه‌های اجتماعی:</span>
              <div className="flex items-center gap-2 text-white/80">
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-xs"
                  aria-label="اینستاگرام"
                >
                  📷
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-xs"
                  aria-label="تلگرام"
                >
                  ✈️
                </a>
              </div>
            </div>
          </div>

          {/* Column: جامعه */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide">جامعه</h4>
            <ul className="space-y-2 text-sm text-white/75">
              <li>
                <Link href="/explore" className="hover:text-white transition-colors">
                  کاوش اعضا
                </Link>
              </li>
              <li>
                <Link href="/#mutual" className="hover:text-white transition-colors">
                  میزبانی متقابل
                </Link>
              </li>
              <li>
                <Link href="/#stories" className="hover:text-white transition-colors">
                  داستان‌های هم‌بام
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: قوانین و امنیت */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide">قوانین و امنیت</h4>
            <ul className="space-y-2 text-sm text-white/75">
              <li>
                <Link href="/#safety" className="hover:text-white transition-colors">
                  راهنمای سفر امن
                </Link>
              </li>
              <li>
                <Link href="/#rules" className="hover:text-white transition-colors">
                  قوانین استفاده
                </Link>
              </li>
              <li>
                <Link href="/#privacy" className="hover:text-white transition-colors">
                  حریم خصوصی
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: پشتیبانی و تماس */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide">پشتیبانی</h4>
            <ul className="space-y-2 text-sm text-white/75">
              <li>
                <Link href="/#faq" className="hover:text-white transition-colors">
                  پرسش‌های متداول
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="hover:text-white transition-colors">
                  تماس با ما
                </Link>
              </li>
              <li>
                <Link href="/#report" className="hover:text-white transition-colors">
                  گزارش مشکل
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-4">
          <p>© ۱۴۰۵ هم‌بام؛ ساخته‌شده برای دوستی، سفر و اعتماد.</p>
          <div className="flex items-center gap-6">
            <span>تأیید هویت و امنیت سفر</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
            <span>میزبانی محلی بدون تبادل مالی</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
