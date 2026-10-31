'use client';

import React, { useState, useEffect } from 'react';
import { X, User, Heart, Globe, Compass, Check, Plus, MapPin, Briefcase } from 'lucide-react';
import { UserProfile } from '@/types/database';
import { useAuth } from '@/lib/auth-context';
import { parsePersianNumber } from '@/lib/persian-utils';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_INTERESTS = [
  'سفر و ماجراجویی',
  'عکاسی',
  'طبیعت‌گردی',
  'کوهنوردی',
  'کتاب و ادبیات',
  'موسیقی',
  'کافه‌گردی',
  'آشپزی و خوراک',
  'تاریخ و معماری',
  'کمپینگ',
  'هنر و سینما',
  'زبان‌آموزی',
  'ورزش و دوچرخه‌سواری',
];

const PRESET_LANGUAGES = [
  'فارسی (مادری)',
  'انگلیسی',
  'ترکی',
  'کردی',
  'عربی',
  'فرانسوی',
  'آلمانی',
];

const PRESET_DESTINATIONS = [
  'گیلان و مازندران',
  'شیراز',
  'اصفهان',
  'جزیره هرمز و قشم',
  'یزد',
  'کردستان و اورامان',
  'کویر مصر و لوت',
  'تبریز و جلفا',
  'بوشهر و چابهار',
];

export default function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { currentUser, updateUserProfile } = useAuth();

  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [jobEducation, setJobEducation] = useState('');
  const [bioHeadline, setBioHeadline] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState('');
  const [languages, setLanguages] = useState<string[]>([]);
  const [customLanguage, setCustomLanguage] = useState('');
  const [destinations, setDestinations] = useState<string[]>([]);
  const [customDestination, setCustomDestination] = useState('');
  const [targetDestination, setTargetDestination] = useState('');
  const [targetDates, setTargetDates] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.full_name || '');
      setAge(currentUser.age !== undefined && currentUser.age !== null ? currentUser.age.toString() : '');
      setCity(currentUser.city || '');
      setJobEducation(currentUser.job_education || '');
      setBioHeadline(currentUser.bio_headline || '');
      setAboutMe(currentUser.about_me || '');
      setInterests(currentUser.interests || ['سفر و ماجراجویی', 'عکاسی']);
      setLanguages(currentUser.languages || ['فارسی (مادری)']);
      setDestinations(currentUser.favorite_destinations || []);
      setTargetDestination(currentUser.target_destination || '');
      setTargetDates(currentUser.target_travel_dates || '');
    }
  }, [currentUser, isOpen]);

  if (!isOpen || !currentUser) return null;

  const toggleInterest = (tag: string) => {
    setInterests((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const addCustomInterest = () => {
    const val = customInterest.trim();
    if (val && !interests.includes(val)) {
      setInterests((prev) => [...prev, val]);
      setCustomInterest('');
    }
  };

  const toggleLanguage = (lang: string) => {
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const addCustomLanguage = () => {
    const val = customLanguage.trim();
    if (val && !languages.includes(val)) {
      setLanguages((prev) => [...prev, val]);
      setCustomLanguage('');
    }
  };

  const toggleDestination = (dest: string) => {
    setDestinations((prev) =>
      prev.includes(dest) ? prev.filter((d) => d !== dest) : [...prev, dest]
    );
  };

  const addCustomDestination = () => {
    const val = customDestination.trim();
    if (val && !destinations.includes(val)) {
      setDestinations((prev) => [...prev, val]);
      setCustomDestination('');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAge = parsePersianNumber(age);

    updateUserProfile({
      full_name: fullName.trim() || currentUser.full_name,
      age: parsedAge,
      city: city.trim() || currentUser.city,
      job_education: jobEducation.trim() || undefined,
      bio_headline: bioHeadline.trim() || undefined,
      about_me: aboutMe.trim() || undefined,
      interests: interests.length > 0 ? interests : undefined,
      languages: languages.length > 0 ? languages : undefined,
      favorite_destinations: destinations.length > 0 ? destinations : undefined,
      target_destination: targetDestination.trim() || undefined,
      target_travel_dates: targetDates.trim() || undefined,
    });

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#EADFD5] flex flex-col text-right">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-[#FBF4F0] text-[#C25E38] flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">ویرایش مشخصات پروفایل</h2>
              <p className="text-xs text-gray-500">مشخصات فردی، سن، علاقه‌مندی‌ها و زبان‌ها را بروزرسانی کنید</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Section: Basic info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-500 pb-1 border-b border-gray-100 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#C25E38]" />
              <span>مشخصات فردی و هویتی</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  نام و نام خانوادگی
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#F9F8F6] border border-gray-200 rounded-xl outline-none focus:border-[#C25E38]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  سن شما (عدد به فارسی یا انگلیسی)
                </label>
                <input
                  type="text"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="مثال: ۲۸"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#F9F8F6] border border-gray-200 rounded-xl outline-none focus:border-[#C25E38]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  شهر سکونت فعلی
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#F9F8F6] border border-gray-200 rounded-xl outline-none focus:border-[#C25E38]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  شغل یا تحصیلات
                </label>
                <input
                  type="text"
                  value={jobEducation}
                  onChange={(e) => setJobEducation(e.target.value)}
                  placeholder="مثال: مهندس نرم‌افزار، عکاس..."
                  className="w-full px-3.5 py-2.5 text-xs bg-[#F9F8F6] border border-gray-200 rounded-xl outline-none focus:border-[#C25E38]"
                />
              </div>
            </div>
          </div>

          {/* Section: Bio */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold text-gray-500 pb-1 border-b border-gray-100 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#C25E38]" />
              <span>معرفی و بیوگرافی</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                تیتر کوتاه بیوگرافی (یک جمله معرفی جذاب)
              </label>
              <input
                type="text"
                value={bioHeadline}
                onChange={(e) => setBioHeadline(e.target.value)}
                placeholder="مثال: عاشق عکاسی از بناهای تاریخی و پیاده‌روی در طبیعت"
                className="w-full px-3.5 py-2.5 text-xs bg-[#F9F8F6] border border-gray-200 rounded-xl outline-none focus:border-[#C25E38]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                درباره من (توضیحات مفصل‌تر)
              </label>
              <textarea
                rows={3}
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
                placeholder="چند خط درباره سبک زندگی، تجربیات سفر یا میزبانی..."
                className="w-full p-3.5 text-xs bg-[#F9F8F6] border border-gray-200 rounded-2xl outline-none focus:border-[#C25E38] leading-relaxed"
              />
            </div>
          </div>

          {/* Section: Traveler Specific Fields */}
          {(currentUser.role === 'traveler' || currentUser.can_host === false) && (
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold text-sky-700 pb-1 border-b border-sky-100 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-sky-600" />
                <span>برنامه سفر و مقصد مدنظر (ویژه مسافران)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    شهر مقصد سفر
                  </label>
                  <input
                    type="text"
                    value={targetDestination}
                    onChange={(e) => setTargetDestination(e.target.value)}
                    placeholder="مثال: شیراز، اصفهان، چابهار..."
                    className="w-full px-3.5 py-2.5 text-xs bg-[#F9F8F6] border border-gray-200 rounded-xl outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    بازه زمانی مدنظر
                  </label>
                  <input
                    type="text"
                    value={targetDates}
                    onChange={(e) => setTargetDates(e.target.value)}
                    placeholder="مثال: نیمه اول اردیبهشت"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#F9F8F6] border border-gray-200 rounded-xl outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section: Interests */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between pb-1 border-b border-gray-100">
              <h3 className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#C25E38]" />
                <span>علاقه‌مندی‌ها</span>
              </h3>
              <span className="text-[11px] text-gray-400">{interests.length} انتخاب شده</span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {PRESET_INTERESTS.map((tag) => {
                const isSelected = interests.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleInterest(tag)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#C25E38] text-white shadow-sm'
                        : 'bg-[#F9F8F6] text-gray-700 border border-gray-200'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {tag}
                  </button>
                );
              })}
              {interests
                .filter((t) => !PRESET_INTERESTS.includes(t))
                .map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleInterest(tag)}
                    className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-[#C25E38] text-white shadow-sm flex items-center gap-1"
                  >
                    <span>✓ {tag}</span>
                    <span className="text-[10px] opacity-75">×</span>
                  </button>
                ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
                placeholder="افزودن علاقه‌مندی جدید..."
                className="flex-1 px-3 py-1.5 text-xs bg-[#F9F8F6] border border-gray-200 rounded-xl outline-none"
              />
              <button
                type="button"
                onClick={addCustomInterest}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl"
              >
                + افزودن
              </button>
            </div>
          </div>

          {/* Section: Languages */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between pb-1 border-b border-gray-100">
              <h3 className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#1E5647]" />
                <span>زبان‌ها</span>
              </h3>
              <span className="text-[11px] text-gray-400">{languages.length} زبان</span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {PRESET_LANGUAGES.map((lang) => {
                const isSelected = languages.includes(lang);
                return (
                  <button
                    type="button"
                    key={lang}
                    onClick={() => toggleLanguage(lang)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#1E5647] text-white shadow-sm'
                        : 'bg-[#F9F8F6] text-gray-700 border border-gray-200'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {lang}
                  </button>
                );
              })}
              {languages
                .filter((l) => !PRESET_LANGUAGES.includes(l))
                .map((lang) => (
                  <button
                    type="button"
                    key={lang}
                    onClick={() => toggleLanguage(lang)}
                    className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-[#1E5647] text-white shadow-sm flex items-center gap-1"
                  >
                    <span>✓ {lang}</span>
                    <span className="text-[10px] opacity-75">×</span>
                  </button>
                ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={customLanguage}
                onChange={(e) => setCustomLanguage(e.target.value)}
                placeholder="افزودن زبان جدید..."
                className="flex-1 px-3 py-1.5 text-xs bg-[#F9F8F6] border border-gray-200 rounded-xl outline-none"
              />
              <button
                type="button"
                onClick={addCustomLanguage}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl"
              >
                + افزودن
              </button>
            </div>
          </div>

          {/* Section: Favorite Destinations */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between pb-1 border-b border-gray-100">
              <h3 className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#C25E38]" />
                <span>مقصدهای محبوب من برای سفر</span>
              </h3>
              <span className="text-[11px] text-gray-400">{destinations.length} مقصد</span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {PRESET_DESTINATIONS.map((dest) => {
                const isSelected = destinations.includes(dest);
                return (
                  <button
                    type="button"
                    key={dest}
                    onClick={() => toggleDestination(dest)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#C25E38] text-white shadow-sm'
                        : 'bg-[#F9F8F6] text-gray-700 border border-gray-200'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {dest}
                  </button>
                );
              })}
              {destinations
                .filter((d) => !PRESET_DESTINATIONS.includes(d))
                .map((dest) => (
                  <button
                    type="button"
                    key={dest}
                    onClick={() => toggleDestination(dest)}
                    className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-[#C25E38] text-white shadow-sm flex items-center gap-1"
                  >
                    <span>✓ {dest}</span>
                    <span className="text-[10px] opacity-75">×</span>
                  </button>
                ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={customDestination}
                onChange={(e) => setCustomDestination(e.target.value)}
                placeholder="افزودن مقصد دیگر..."
                className="flex-1 px-3 py-1.5 text-xs bg-[#F9F8F6] border border-gray-200 rounded-xl outline-none"
              />
              <button
                type="button"
                onClick={addCustomDestination}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl"
              >
                + افزودن
              </button>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#C25E38] hover:bg-[#A84E2D] text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{isSaved ? 'ذخیره شد!' : 'ذخیره تغییرات'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
