// Utility functions for Persian digits and numbers parsing
export function parsePersianNumber(val: string | number | undefined | null): number | undefined {
  if (val === undefined || val === null) return undefined;
  if (typeof val === 'number') return isNaN(val) ? undefined : val;
  const str = val.toString().trim();
  if (!str) return undefined;

  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

  let cleanStr = str;
  for (let i = 0; i < 10; i++) {
    cleanStr = cleanStr.replaceAll(persianDigits[i], i.toString()).replaceAll(arabicDigits[i], i.toString());
  }

  // Remove any non-numeric characters except minus sign
  cleanStr = cleanStr.replace(/[^0-9-]/g, '');
  if (!cleanStr) return undefined;

  const parsed = parseInt(cleanStr, 10);
  return isNaN(parsed) ? undefined : parsed;
}

export function toEnglishDigits(str: string | number | undefined | null): string {
  if (str === undefined || str === null) return '';
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  let res = str.toString();
  for (let i = 0; i < 10; i++) {
    res = res.replaceAll(persianDigits[i], i.toString()).replaceAll(arabicDigits[i], i.toString());
  }
  return res;
}

export function toPersianDigits(num: number | string | undefined | null): string {
  if (num === undefined || num === null) return '';
  const str = num.toString();
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/\d/g, (d) => persianDigits[parseInt(d, 10)] || d);
}

export const DEFAULT_AVATAR = '/images/default-avatar.svg';

export function getAvatarUrl(url?: string | null): string {
  if (!url || typeof url !== 'string') return DEFAULT_AVATAR;
  const trimmed = url.trim();
  if (!trimmed) return DEFAULT_AVATAR;
  if (trimmed.includes('1535713875002-d1d0cf377fde')) return DEFAULT_AVATAR;
  return trimmed;
}

export interface IranCityData {
  name: string;
  topPercent: number;
  leftPercent: number;
  province: string;
}

export const IRAN_CITIES_MAP: Record<string, IranCityData> = {
  'تبریز': { name: 'تبریز', topPercent: 12, leftPercent: 13, province: 'آذربایجان شرقی' },
  'ارومیه': { name: 'ارومیه', topPercent: 15, leftPercent: 7, province: 'آذربایجان غربی' },
  'اردبیل': { name: 'اردبیل', topPercent: 11, leftPercent: 22, province: 'اردبیل' },
  'رشت': { name: 'رشت', topPercent: 17, leftPercent: 29, province: 'گیلان' },
  'ساری': { name: 'ساری', topPercent: 22, leftPercent: 47, province: 'مازندران' },
  'گرگان': { name: 'گرگان', topPercent: 20, leftPercent: 54, province: 'گلستان' },
  'مشهد': { name: 'مشهد', topPercent: 24, leftPercent: 81, province: 'خراسان رضوی' },
  'بجنورد': { name: 'بجنورد', topPercent: 17, leftPercent: 69, province: 'خراسان شمالی' },
  'بیرجند': { name: 'بیرجند', topPercent: 48, leftPercent: 79, province: 'خراسان جنوبی' },
  'تهران': { name: 'تهران', topPercent: 28, leftPercent: 38, province: 'تهران' },
  'کرج': { name: 'کرج', topPercent: 27, leftPercent: 36, province: 'البرز' },
  'قزوین': { name: 'قزوین', topPercent: 24, leftPercent: 31, province: 'قزوین' },
  'زنجان': { name: 'زنجان', topPercent: 22, leftPercent: 23, province: 'زنجان' },
  'سنندج': { name: 'سنندج', topPercent: 30, leftPercent: 16, province: 'کردستان' },
  'کرمانشاه': { name: 'کرمانشاه', topPercent: 37, leftPercent: 16, province: 'کرمانشاه' },
  'ایلام': { name: 'ایلام', topPercent: 43, leftPercent: 13, province: 'ایلام' },
  'همدان': { name: 'همدان', topPercent: 34, leftPercent: 23, province: 'همدان' },
  'اراک': { name: 'اراک', topPercent: 39, leftPercent: 30, province: 'مرکزی' },
  'قم': { name: 'قم', topPercent: 35, leftPercent: 36, province: 'قم' },
  'کاشان': { name: 'کاشان', topPercent: 39, leftPercent: 39, province: 'اصفهان' },
  'اصفهان': { name: 'اصفهان', topPercent: 48, leftPercent: 40, province: 'اصفهان' },
  'خرم‌آباد': { name: 'خرم‌آباد', topPercent: 43, leftPercent: 23, province: 'لرستان' },
  'اهواز': { name: 'اهواز', topPercent: 57, leftPercent: 24, province: 'خوزستان' },
  'دزفول': { name: 'دزفول', topPercent: 50, leftPercent: 23, province: 'خوزستان' },
  'آبادان': { name: 'آبادان', topPercent: 64, leftPercent: 22, province: 'خوزستان' },
  'شهرکرد': { name: 'شهرکرد', topPercent: 51, leftPercent: 35, province: 'چهارمحال و بختیاری' },
  'یاسوج': { name: 'یاسوج', topPercent: 62, leftPercent: 39, province: 'کهگیلویه و بویراحمد' },
  'شیراز': { name: 'شیراز', topPercent: 69, leftPercent: 45, province: 'فارس' },
  'بوشهر': { name: 'بوشهر', topPercent: 74, leftPercent: 35, province: 'بوشهر' },
  'یزد': { name: 'یزد', topPercent: 53, leftPercent: 54, province: 'یزد' },
  'کرمان': { name: 'کرمان', topPercent: 64, leftPercent: 68, province: 'کرمان' },
  'بندرعباس': { name: 'بندرعباس', topPercent: 85, leftPercent: 64, province: 'هرمزگان' },
  'کیش': { name: 'کیش', topPercent: 90, leftPercent: 52, province: 'هرمزگان' },
  'قشم': { name: 'قشم', topPercent: 87, leftPercent: 63, province: 'هرمزگان' },
  'زاهدان': { name: 'زاهدان', topPercent: 70, leftPercent: 87, province: 'سیستان و بلوچستان' },
  'چابهار': { name: 'چابهار', topPercent: 96, leftPercent: 86, province: 'سیستان و بلوچستان' },
};

export function extractPhoneAndAddress(raw?: string | null): { address: string; phone?: string } {
  if (!raw) return { address: '' };

  const trimmed = raw.trim();
  if (trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed.address || parsed.phone) {
        return {
          address: parsed.address || '',
          phone: parsed.phone ? toPersianDigits(parsed.phone) : undefined,
        };
      }
    } catch (e) {
      // not JSON
    }
  }

  // Check for "تماس:" or "تلفن:" or "شماره:"
  const phonePattern = /(?:تماس|تلفن|شماره|همراه)[:\s-]*([0-9۰-۹\s+]{10,14})/i;
  const match = trimmed.match(phonePattern);
  if (match) {
    const phone = match[1].trim();
    const address = trimmed
      .replace(match[0], '')
      .replace(/[-–|،,]\s*$/, '')
      .trim();
    return { address: address || trimmed, phone: toPersianDigits(phone) };
  }

  // Check for standalone 09xx
  const standalone09 = /(09[0-9]{9}|۰۹[۰-۹]{9})/;
  const m2 = trimmed.match(standalone09);
  if (m2) {
    const phone = m2[1].trim();
    const address = trimmed
      .replace(phone, '')
      .replace(/(?:تماس|تلفن|شماره|همراه)[:\s-]*/gi, '')
      .replace(/[-–|،,]\s*$/, '')
      .trim();
    return { address: address || trimmed, phone: toPersianDigits(phone) };
  }

  return { address: trimmed };
}

export function extractDeclineReason(note?: string | null): { reason: string; note?: string } {
  if (!note) return { reason: 'علتی از سوی میزبان ثبت نشده است.' };

  const trimmed = note.trim();
  if (trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed.reason || parsed.note) {
        return {
          reason: parsed.reason || 'رد محترمانه درخواست',
          note: parsed.note,
        };
      }
    } catch (e) {
      // not JSON
    }
  }

  if (trimmed.includes('علت رد:')) {
    const parts = trimmed.split('|');
    const reasonPart = parts[0]?.replace('علت رد:', '').trim() || '';
    const notePart = parts[1]?.replace('یادداشت میزبان:', '').replace('یادداشت:', '').trim();
    return {
      reason: reasonPart || trimmed,
      note: notePart,
    };
  }

  return { reason: trimmed };
}

export interface SingleReviewData {
  rating: number;
  comment: string;
  tags?: string[];
  reviewer_id?: string;
  reviewer_name?: string;
  reviewer_city?: string;
  reviewer_avatar?: string;
  target_user_id?: string;
  completed_at?: string;
}

export interface MutualReviewsData {
  guest_review?: SingleReviewData;
  host_review?: SingleReviewData;
}

export function extractMutualReviews(note?: string | null): MutualReviewsData {
  if (!note) return {};
  const trimmed = note.trim();
  if (trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed.guest_review || parsed.host_review) {
        return {
          guest_review: parsed.guest_review,
          host_review: parsed.host_review,
        };
      }
      if (parsed.rating !== undefined || parsed.type === 'completed_review') {
        const single: SingleReviewData = {
          rating: Number(parsed.rating) || 5,
          comment: parsed.comment || '',
          tags: Array.isArray(parsed.tags) ? parsed.tags : [],
          reviewer_id: parsed.reviewer_id,
          reviewer_name: parsed.reviewer_name,
          reviewer_city: parsed.reviewer_city,
          reviewer_avatar: parsed.reviewer_avatar,
          target_user_id: parsed.target_user_id,
          completed_at: parsed.completed_at,
        };
        if (parsed.reviewer_role === 'host') {
          return { host_review: single };
        } else {
          return { guest_review: single };
        }
      }
    } catch (e) {
      // not JSON
    }
  }
  return {};
}

export interface ReviewExperienceData {
  rating: number;
  comment: string;
  tags?: string[];
  completed_at?: string;
  reviewer_role?: 'guest' | 'host';
}

export function extractReviewInfo(
  note?: string | null,
  preferredRole?: 'guest' | 'host'
): ReviewExperienceData | null {
  const mutual = extractMutualReviews(note);
  const rev =
    preferredRole === 'host'
      ? mutual.host_review || mutual.guest_review
      : mutual.guest_review || mutual.host_review;

  if (rev) {
    return {
      rating: rev.rating,
      comment: rev.comment,
      tags: rev.tags,
      completed_at: rev.completed_at,
      reviewer_role: rev === mutual.host_review ? 'host' : 'guest',
    };
  }
  return null;
}
