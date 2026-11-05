import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MemberCard from '@/components/members/MemberCard';
import VerificationModal from '@/components/modals/VerificationModal';
import HostingRequestModal from '@/components/modals/HostingRequestModal';
import IranMap from '@/components/explore/IranMap';
import ProfilePage from '@/app/profile/page';
import { AuthProvider } from '@/lib/auth-context';
import { MOCK_PROFILES } from '@/lib/mock-data';

// Mock Next.js navigation hooks
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('Hamja Components & Core Features Test Suite', () => {
  const sara = MOCK_PROFILES[0]; // Sara Rahimi from Isfahan

  it('renders MemberCard with correct Persian details and badges', () => {
    render(<MemberCard member={sara} />);

    // Name & City
    expect(screen.getByText('سارا رحیمی')).toBeInTheDocument();
    expect(screen.getByText('اصفهان')).toBeInTheDocument();

    // Badges from PDF design
    expect(screen.getByText('آماده میزبانی متقابل')).toBeInTheDocument();
    expect(screen.getByText('هویت تأییدشده')).toBeInTheDocument();

    // Tags
    expect(screen.getByText('#عکاسی')).toBeInTheDocument();
    expect(screen.getByText('#کتاب')).toBeInTheDocument();

    // Bio headline
    expect(
      screen.getByText(/شهرم را از قاب دوربینم به تو نشان می‌دهم/)
    ).toBeInTheDocument();

    // Profile link
    expect(screen.getByText('مشاهده پروفایل')).toBeInTheDocument();
  });

  it('renders VerificationModal with manual national card and selfie uploads for new users', () => {
    render(
      <AuthProvider>
        <VerificationModal isOpen={true} onClose={vi.fn()} />
      </AuthProvider>
    );

    // Modal title & status
    expect(screen.getByText('احراز هویت و عضویت امن')).toBeInTheDocument();
    expect(
      screen.getByText(/صرفاً بارگذاری تصویر کارت ملی و سلفی همراه با کارت ملی/)
    ).toBeInTheDocument();
    expect(screen.getByText(/تصویر کارت ملی یا برگه رهگیری/)).toBeInTheDocument();
    expect(screen.getByText(/تصویر سلفی به همراه کارت ملی/)).toBeInTheDocument();
    expect(screen.getByText('ارسال مدارک جهت بررسی دستی همجا')).toBeInTheDocument();
  });

  it('renders HostingRequestModal and handles stay submission', () => {
    const verifiedUser = {
      ...MOCK_PROFILES[1],
      id: 'verified-test-user-1',
      verification_status: 'approved' as const,
      is_identity_verified: true,
    };
    window.localStorage.setItem('hamja_current_user_clean_v1', JSON.stringify(verifiedUser));

    render(
      <AuthProvider>
        <HostingRequestModal
          isOpen={true}
          onClose={vi.fn()}
          host={sara}
        />
      </AuthProvider>
    );

    expect(
      screen.getByText(`درخواست میزبانی و ارتباط با ${sara.full_name}`)
    ).toBeInTheDocument();
    expect(screen.getByText('تاریخ ورود')).toBeInTheDocument();
    expect(screen.getByText('تاریخ خروج')).toBeInTheDocument();
    expect(screen.getByText('تعداد مهمانان')).toBeInTheDocument();
    expect(screen.getByText('ارسال درخواست میزبانی')).toBeInTheDocument();
  });

  it('renders IranMap with city points and triggers selection', () => {
    const handleSelectCity = vi.fn();
    render(
      <IranMap selectedCity="" onSelectCity={handleSelectCity} />
    );

    expect(screen.getByText('میزبان‌های همجا روی نقشه')).toBeInTheDocument();
    expect(screen.getByText('دریای خزر')).toBeInTheDocument();
    expect(screen.getByText('خلیج فارس')).toBeInTheDocument();

    // City markers
    const isfahanBtn = screen.getByText('اصفهان');
    expect(isfahanBtn).toBeInTheDocument();

    fireEvent.click(isfahanBtn);
    expect(handleSelectCity).toHaveBeenCalledWith('اصفهان');
  });

  it('renders VerificationModal with rejection reason and re-upload form when rejected', () => {
    render(
      <AuthProvider>
        <VerificationModal
          isOpen={true}
          onClose={vi.fn()}
          reason="تصویر کارت ملی ناخواناست و مشخصات به وضوح دیده نمی‌شود."
        />
      </AuthProvider>
    );

    // Should render the alert with reason
    expect(
      screen.getByText(/تصویر کارت ملی ناخواناست و مشخصات به وضوح دیده نمی‌شود/)
    ).toBeInTheDocument();
  });

  it('renders ProfilePage with login prompt when not logged in', () => {
    window.localStorage.clear();
    render(
      <AuthProvider>
        <ProfilePage />
      </AuthProvider>
    );

    expect(screen.getByText('ورود به حساب کاربری همجا')).toBeInTheDocument();
    expect(screen.getByText('ورود / ثبت‌نام در همجا')).toBeInTheDocument();
  });

  it('renders ProfilePage with user details when logged in', async () => {
    const testUser = {
      id: 'test-user-1',
      username: 'testuser',
      full_name: 'کاربر تستی',
      city: 'تهران',
      role: 'both' as const,
      hosting_status: 'ready_for_hosting' as const,
      verification_status: 'approved' as const,
      is_identity_verified: true,
      member_since_year: '۱۴۰۵',
      response_rate_percent: 100,
      hosting_count: 0,
    };

    window.localStorage.setItem('hamja_current_user_clean_v1', JSON.stringify(testUser));
    window.localStorage.setItem('hamja_all_users_clean_v1', JSON.stringify([testUser]));

    render(
      <AuthProvider>
        <ProfilePage />
      </AuthProvider>
    );

    expect(await screen.findByText('کاربر تستی')).toBeInTheDocument();
    expect(screen.getByText('@testuser')).toBeInTheDocument();
    expect(screen.getAllByText('تهران').length).toBeGreaterThan(0);
    expect(screen.getByText('اطلاعات فردی و ارتباطی')).toBeInTheDocument();
  });

  it('renders MemberCard for traveler-only member without mutual hosting badge and with host offer CTA', () => {
    const travelerUser = {
      id: 'traveler-user-1',
      username: 'traveler1',
      full_name: 'کیوان بهرامی',
      city: 'رشت',
      role: 'traveler' as const,
      can_host: false,
      hosting_status: 'not_hosting' as const,
      verification_status: 'approved' as const,
      is_identity_verified: true,
      member_since_year: '۱۴۰۵',
      response_rate_percent: 95,
      hosting_count: 0,
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      bio_headline: 'عاشق سفر و آشنایی با فرهنگ‌های جدید',
      target_destination: 'شیراز',
      target_travel_dates: 'نیمه اول اردیبهشت',
      target_guests_count: 1,
      interests: ['طبیعت‌گردی', 'عکاسی'],
    };

    render(<MemberCard member={travelerUser} />);

    // Should NOT have mutual hosting badge
    expect(screen.queryByText('آماده میزبانی متقابل')).not.toBeInTheDocument();

    // Should display traveler badge with target destination
    expect(screen.getByText('قصد سفر به شیراز (مشتاق میزبان)')).toBeInTheDocument();
    expect(screen.getByText(/نیمه اول اردیبهشت/)).toBeInTheDocument();

    // CTA should say "پیشنهاد میزبانی" instead of plain view
    expect(screen.getByText('پیشنهاد میزبانی')).toBeInTheDocument();
  });

  it('renders HostingRequestModal in offer_hosting mode with invitation copy', () => {
    const travelerUser = {
      id: 'traveler-user-2',
      username: 'traveler2',
      full_name: 'آرزو مرادی',
      city: 'تهران',
      role: 'traveler' as const,
      can_host: false,
      hosting_status: 'not_hosting' as const,
      verification_status: 'approved' as const,
      is_identity_verified: true,
      member_since_year: '۱۴۰۵',
      response_rate_percent: 100,
      hosting_count: 0,
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      bio_headline: 'مشتاق دیدن اصفهان زیبا',
      target_destination: 'اصفهان',
    };

    const verifiedUser = {
      ...MOCK_PROFILES[1],
      id: 'verified-test-user-2',
      verification_status: 'approved' as const,
      is_identity_verified: true,
    };
    window.localStorage.setItem('hamja_current_user_clean_v1', JSON.stringify(verifiedUser));

    render(
      <AuthProvider>
        <HostingRequestModal
          isOpen={true}
          onClose={vi.fn()}
          host={travelerUser}
          mode="offer_hosting"
        />
      </AuthProvider>
    );

    expect(
      screen.getByText(`پیشنهاد میزبانی به ${travelerUser.full_name} (دعوت به خانه شما)`)
    ).toBeInTheDocument();
    expect(screen.getByText('ارسال پیشنهاد و دعوت به میزبانی')).toBeInTheDocument();
  });

  it('blocks unverified users in HostingRequestModal from sending requests', () => {
    const unverifiedUser = {
      ...MOCK_PROFILES[1],
      id: 'unverified-test-user',
      verification_status: 'unverified' as const,
      is_identity_verified: false,
    };
    window.localStorage.setItem('hamja_current_user_clean_v1', JSON.stringify(unverifiedUser));

    render(
      <AuthProvider>
        <HostingRequestModal
          isOpen={true}
          onClose={vi.fn()}
          host={sara}
        />
      </AuthProvider>
    );

    expect(screen.getByText('نیاز به تأیید احراز هویت')).toBeInTheDocument();
    expect(
      screen.getByText(/تنها کاربرانی که مدارک هویتی آن‌ها تأیید شده است مجاز به ارسال درخواست یا پیشنهاد میزبانی هستند/)
    ).toBeInTheDocument();
  });

  it('prevents self-requests in HostingRequestModal when user requests themselves', () => {
    const ownUser = {
      id: 'current-user-123',
      username: 'myself',
      full_name: 'من خودم',
      city: 'تهران',
      role: 'host' as const,
      can_host: true,
      hosting_status: 'ready_for_hosting' as const,
      verification_status: 'approved' as const,
      is_identity_verified: true,
      member_since_year: '۱۴۰۵',
      response_rate_percent: 100,
      hosting_count: 1,
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    };

    window.localStorage.setItem('hamja_current_user_clean_v1', JSON.stringify(ownUser));
    window.localStorage.setItem('hamja_all_users_clean_v1', JSON.stringify([ownUser]));

    render(
      <AuthProvider>
        <HostingRequestModal
          isOpen={true}
          onClose={vi.fn()}
          host={ownUser}
        />
      </AuthProvider>
    );

    expect(screen.getByText('ارسال درخواست به خود امکان‌پذیر نیست')).toBeInTheDocument();
  });

  it('renders IranMap with real dynamic member counts for active cities', () => {
    const testUsers = [
      {
        id: 'u1',
        full_name: 'میزبان ۱',
        city: 'شیراز',
        role: 'host' as const,
        hosting_status: 'ready_for_hosting' as const,
        verification_status: 'approved' as const,
        is_identity_verified: true,
        member_since_year: '۱۴۰۵',
        response_rate_percent: 100,
        hosting_count: 1,
      },
      {
        id: 'u2',
        full_name: 'میزبان ۲',
        city: 'شیراز',
        role: 'both' as const,
        hosting_status: 'ready_for_hosting' as const,
        verification_status: 'approved' as const,
        is_identity_verified: true,
        member_since_year: '۱۴۰۵',
        response_rate_percent: 100,
        hosting_count: 2,
      },
    ];

    render(<IranMap selectedCity="" onSelectCity={vi.fn()} users={testUsers} />);

    // Header should reflect dynamic count
    expect(screen.getByText('۲ عضو در ۱ شهر')).toBeInTheDocument();
  });
});

