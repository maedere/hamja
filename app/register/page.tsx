'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  Phone,
  Camera,
  MapPin,
  Briefcase,
  Home,
  ShieldCheck,
  CheckCircle2,
  Users,
  Compass,
  ArrowLeft,
  Sparkles,
  Lock,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth-context';
import { GuestPreference, SleepingArrangement } from '@/types/database';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  // Form State matching Google Form
  const [fullName, setFullName] = useState('آرش قدیمی');
  const [age, setAge] = useState('۳۵');
  const [city, setCity] = useState('رشت');
  const [instagram, setInstagram] = useState('Arashghadimi701');
  const [phone, setPhone] = useState('09355363846');
  const [jobEducation, setJobEducation] = useState('کاردانی - آزاد');

  // Page 2: Hosting capability
  const [canHost, setCanHost] = useState(true);
  const [maxGuests, setMaxGuests] = useState('۳');
  const [guestPreference, setGuestPreference] = useState<GuestPreference>('any');
  const [sleepingArrangement, setSleepingArrangement] = useState<SleepingArrangement>('private_with_bed');

  // Page 3: House rules & Travel
  const [rulePet, setRulePet] = useState(true);
  const [ruleSmoking, setRuleSmoking] = useState(true);
  const [ruleCurfew, setRuleCurfew] = useState(true);
  const [customRule, setCustomRule] = useState('');

  const [targetDestination, setTargetDestination] = useState('گیلان');
  const [targetDates, setTargetDates] = useState('پاییز ۱۴۰۵ - ۳ روز');
  const [targetGuests, setTargetGuests] = useState('۱');
  const [bioSnippet, setBioSnippet] = useState('علاقه‌مند به طبیعت‌گردی، عکاسی و آشنایی با فرهنگ و مردم شهرهای مختلف ایران.');

  // Page 4: Agreements
  const [agreeId, setAgreeId] = useState(true);
  const [agreeEthic, setAgreeEthic] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeId || !agreeEthic || !agreeTerms) {
      alert('لطفاً تمامی تاییده‌ها و شرایط امنیتی همجا را تایید فرمایید.');
      return;
    }

    setIsSubmitting(true);

    const houseRules: string[] = [];
    if (rulePet) houseRules.push('ورود حیوان خانگی ممنوع است');
    if (ruleSmoking) houseRules.push('استعمال دخانیات داخل خانه ممنوع است');
    if (ruleCurfew) houseRules.push('محدوده ساعت رفت‌وآمد (ورود قبل از ۱۱ شب)');
    if (customRule.trim()) houseRules.push(customRule.trim());

    setTimeout(() => {
      register({
        full_name: fullName,
        phone,
        instagram,
        city,
        age: parseInt(age) || 30,
        job_education: jobEducation,
        can_host: canHost,
        role: canHost ? 'both' : 'traveler',
        hosting_status: canHost ? 'ready_for_hosting' : 'not_hosting',
        max_guests: canHost ? parseInt(maxGuests) || 2 : undefined,
        guest_preference: canHost ? guestPreference : undefined,
        sleeping_arrangement: canHost ? sleepingArrangement : undefined,
        house_rules: houseRules,
        target_destination: targetDestination,
        target_travel_dates: targetDates,
        target_guests_count: parseInt(targetGuests) || 1,
        bio_headline: bioSnippet.slice(0, 70),
        about_me: bioSnippet,
        interests: ['سفر', 'عکاسی', 'فرهنگ بومی'],
        agreed_to_provide_id: agreeId,
        agreed_to_respect_house_rules: agreeEthic,
        agreed_to_hamja_terms: agreeTerms,
      });

      setIsSubmitting(false);
      setSuccessMessage(true);

      setTimeout(() => {
        router.push('/explore');
      }, 1500);
    }, 700);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F8F6]">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-10 text-right">
        {/* Header matching Google Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADFD5] shadow-sm mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBF4F0] text-[#C25E38] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>عضویت ساده و سریع</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1F2937]">
            فرم ثبت‌نام اولیه همجا
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            به همجا (پلتفرم میزبانی و سفر) خوش آمدید. اطلاعات شما نزد ما محفوظ است و صرفاً جهت هماهنگی و ارتباط امن اعضا استفاده می‌شود. در این مرحله نیازی به ارسال کارت ملی نیست و ثبت‌نام در چند لحظه انجام می‌شود.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* بخش ۱: مشخصات فردی و ارتباطی */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADFD5] shadow-sm space-y-5">
            <h2 className="text-base font-bold text-gray-800 pb-2 border-b border-gray-100 flex items-center gap-2">
              <User className="w-4 h-4 text-[#C25E38]" />
              <span>بخش ۱: اطلاعات فردی و ارتباطی</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  نام و نام‌خانوادگی کامل <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="مثال: آرش قدیمی"
                  className="w-full px-4 py-2.5 text-sm bg-[#F9F8F6] border border-gray-200 rounded-xl focus:border-[#C25E38] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  سن
                </label>
                <input
                  type="text"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="مثال: ۳۵"
                  className="w-full px-4 py-2.5 text-sm bg-[#F9F8F6] border border-gray-200 rounded-xl focus:border-[#C25E38] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  شهر محل سکونت فعلی <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="مثال: رشت، اصفهان، شیراز..."
                  className="w-full px-4 py-2.5 text-sm bg-[#F9F8F6] border border-gray-200 rounded-xl focus:border-[#C25E38] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  شماره موبایل (ترجیحاً به نام خود فرد) <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="مثال: 09355363846"
                  className="w-full px-4 py-2.5 text-sm bg-[#F9F8F6] border border-gray-200 rounded-xl focus:border-[#C25E38] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  آیدی اینستاگرام (جهت بررسی اولیه و ارتباط) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="مثال: Arashghadimi701"
                  className="w-full px-4 py-2.5 text-sm bg-[#F9F8F6] border border-gray-200 rounded-xl focus:border-[#C25E38] outline-none text-left font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  شغل / وضعیت تحصیلی
                </label>
                <input
                  type="text"
                  value={jobEducation}
                  onChange={(e) => setJobEducation(e.target.value)}
                  placeholder="مثال: کاردانی، مهندس، آزاد..."
                  className="w-full px-4 py-2.5 text-sm bg-[#F9F8F6] border border-gray-200 rounded-xl focus:border-[#C25E38] outline-none"
                />
              </div>
            </div>
          </div>

          {/* بخش ۲: شرایط و امکانات میزبانی (Google Form Page 2) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADFD5] shadow-sm space-y-5">
            <h2 className="text-base font-bold text-gray-800 pb-2 border-b border-gray-100 flex items-center gap-2">
              <Home className="w-4 h-4 text-[#C25E38]" />
              <span>بخش ۲: شرایط و امکانات میزبانی</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-gray-800 mb-3">
                آیا در حال حاضر امکان میزبانی از مسافران را در شهر خود دارید؟ <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCanHost(true)}
                  className={`p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between ${
                    canHost
                      ? 'border-[#C25E38] bg-[#FBF4F0]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-sm font-bold text-gray-800">بله (آماده میزبانی)</span>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${canHost ? 'border-[#C25E38] bg-[#C25E38] text-white' : 'border-gray-300'}`}>
                    {canHost && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setCanHost(false)}
                  className={`p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between ${
                    !canHost
                      ? 'border-[#C25E38] bg-[#FBF4F0]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-sm font-bold text-gray-800">فعلاً نه (فقط می‌خواهم مهمان شوم)</span>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${!canHost ? 'border-[#C25E38] bg-[#C25E38] text-white' : 'border-gray-300'}`}>
                    {!canHost && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </button>
              </div>
            </div>

            {/* If Can Host is TRUE */}
            {canHost && (
              <div className="space-y-4 pt-4 border-t border-gray-100 animate-fade-in">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    حداکثر تعداد مهمانی که می‌توانید بپذیرید
                  </label>
                  <input
                    type="text"
                    value={maxGuests}
                    onChange={(e) => setMaxGuests(e.target.value)}
                    placeholder="مثال: ۱، ۲، ۳..."
                    className="w-full sm:w-48 px-4 py-2 text-sm bg-[#F9F8F6] border border-gray-200 rounded-xl focus:border-[#C25E38] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    ترجیح شما برای پذیرش مهمان چیست؟
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'any', label: 'تفاوتی ندارد' },
                      { id: 'females_only', label: 'فقط خانم‌ها' },
                      { id: 'males_only', label: 'فقط آقایان' },
                      { id: 'couples_families', label: 'زوج‌ها / خانواده‌ها' },
                    ].map((pref) => (
                      <button
                        key={pref.id}
                        type="button"
                        onClick={() => setGuestPreference(pref.id as GuestPreference)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                          guestPreference === pref.id
                            ? 'border-[#C25E38] bg-[#FBF4F0] text-[#C25E38]'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {pref.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    امکانات خواب برای مهمان
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'private_with_bed', label: 'اتاق خواب مجزا با تخت' },
                      { id: 'private_without_bed', label: 'اتاق مجزا بدون تخت (رختخواب)' },
                      { id: 'shared_space', label: 'فضای مشترک (پذیرایی / کاناپه)' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSleepingArrangement(item.id as SleepingArrangement)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                          sleepingArrangement === item.id
                            ? 'border-[#C25E38] bg-[#FBF4F0] text-[#C25E38]'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* بخش ۳: قوانین خانه و سفر (Google Form Page 3) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADFD5] shadow-sm space-y-5">
            <h2 className="text-base font-bold text-gray-800 pb-2 border-b border-gray-100 flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#C25E38]" />
              <span>بخش ۳: قوانین خانه و برنامه سفر</span>
            </h2>

            {canHost && (
              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-2">
                  قوانین خاص خانه شما (House Rules)
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rulePet}
                      onChange={(e) => setRulePet(e.target.checked)}
                      className="w-4 h-4 text-[#C25E38] rounded accent-[#C25E38]"
                    />
                    <span>ورود حیوان خانگی ممنوع است</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ruleSmoking}
                      onChange={(e) => setRuleSmoking(e.target.checked)}
                      className="w-4 h-4 text-[#C25E38] rounded accent-[#C25E38]"
                    />
                    <span>استعمال دخانیات داخل خانه ممنوع است</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ruleCurfew}
                      onChange={(e) => setRuleCurfew(e.target.checked)}
                      className="w-4 h-4 text-[#C25E38] rounded accent-[#C25E38]"
                    />
                    <span>محدوده ساعت رفت‌وآمد (مثلاً ورود قبل از ۱۱ شب)</span>
                  </label>
                  <input
                    type="text"
                    value={customRule}
                    onChange={(e) => setCustomRule(e.target.value)}
                    placeholder="قانون خاص دیگر اگر دارید بنویسید..."
                    className="w-full px-3.5 py-2 text-xs bg-[#F9F8F6] border border-gray-200 rounded-xl outline-none"
                  />
                </div>
              </div>
            )}

            <div className="pt-2">
              <label className="block text-xs font-semibold text-gray-800 mb-2">
                معرفی کوتاه از خودتان و علایق سفر
              </label>
              <textarea
                rows={3}
                value={bioSnippet}
                onChange={(e) => setBioSnippet(e.target.value)}
                placeholder="چند خط درباره خودتان، علایق، شغل و هدف‌تان از سفر بگویید..."
                className="w-full p-3.5 text-xs sm:text-sm bg-[#F9F8F6] border border-gray-200 rounded-2xl outline-none focus:border-[#C25E38] leading-relaxed"
              />
            </div>
          </div>

          {/* بخش ۴: تایید قوانین و تعهدات امنیتی (Google Form Page 4) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADFD5] shadow-sm space-y-4">
            <h2 className="text-base font-bold text-gray-800 pb-2 border-b border-gray-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#1E5647]" />
              <span>بخش ۴: تأیید قوانین و تعهدات امنیتی</span>
            </h2>

            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3 rounded-2xl bg-[#F9F8F6] border border-gray-200 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agreeId}
                  onChange={(e) => setAgreeId(e.target.checked)}
                  className="w-4 h-4 text-[#1E5647] rounded accent-[#1E5647] mt-0.5 shrink-0"
                />
                <span className="text-xs text-gray-700 leading-relaxed">
                  <strong className="text-gray-900 block mb-0.5">تأییدیه مدارک شناسایی:</strong>
                  تایید می‌کنم که در صورت پیدا شدن میزبان/مهمان مناسب و هنگام ارسال یا پذیرش درخواست، تصویر کارت ملی و سلفی خود را جهت احراز هویت ارائه دهم.
                </span>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-2xl bg-[#F9F8F6] border border-gray-200 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agreeEthic}
                  onChange={(e) => setAgreeEthic(e.target.checked)}
                  className="w-4 h-4 text-[#1E5647] rounded accent-[#1E5647] mt-0.5 shrink-0"
                />
                <span className="text-xs text-gray-700 leading-relaxed">
                  <strong className="text-gray-900 block mb-0.5">تأیید قوانین اخلاقی و حفظ امنیت:</strong>
                  متعهد می‌شوم به قوانین خانه میزبان احترام گذاشته و در حفظ امنیت و نظافت کوشا باشم.
                </span>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-2xl bg-[#F9F8F6] border border-gray-200 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 text-[#1E5647] rounded accent-[#1E5647] mt-0.5 shrink-0"
                />
                <span className="text-xs text-gray-700 leading-relaxed">
                  <strong className="text-gray-900 block mb-0.5">تأیید شرایط و توافق‌نامه همجا:</strong>
                  &ldquo;همجا&rdquo; صرفاً بستر ارتباطی و معرفی کاربران اهل سفر به یکدیگر است. مسئولیت حفظ اموال شخصی و رعایت قوانین کشور بر عهده مهمان و میزبان است و ارسال این فرم به منزله پذیرش مسئولیت شخصی در ارتباط با سایر کاربران است.
                </span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#C25E38] hover:bg-[#A84E2D] text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-base disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>در حال ثبت اطلاعات و ایجاد حساب...</span>
              ) : (
                <>
                  <span>ثبت‌نام و عضویت در همجا</span>
                  <ArrowLeft className="w-5 h-5" />
                </>
              )}
            </button>
            <p className="text-center text-xs text-gray-500">
              با ثبت‌نام، حساب کاربری شما فوراً ساخته می‌شود و می‌توانید بدون احراز هویت اعضا را کاوش کنید.
            </p>
          </div>
        </form>

        {successMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl border border-[#EADFD5]">
              <div className="w-16 h-16 rounded-full bg-[#1E5647] text-white flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                ثبت‌نام شما با موفقیت انجام شد!
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                خوش آمدید، {fullName}. حساب شما ایجاد شد و وارد سیستم شدید. در حال هدایت به صفحه کاوش اعضا...
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
