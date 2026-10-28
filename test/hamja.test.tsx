import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MemberCard from '@/components/members/MemberCard';
import VerificationModal from '@/components/modals/VerificationModal';
import HostingRequestModal from '@/components/modals/HostingRequestModal';
import IranMap from '@/components/explore/IranMap';
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

  it('renders VerificationModal with manual national card and selfie uploads', () => {
    render(
      <AuthProvider>
        <VerificationModal isOpen={true} onClose={vi.fn()} />
      </AuthProvider>
    );

    // Modal title & subtitle
    expect(screen.getByText('احراز هویت و عضویت امن')).toBeInTheDocument();
    expect(
      screen.getByText(/صرفاً بارگذاری تصویر کارت ملی و سلفی همراه با کارت ملی/)
    ).toBeInTheDocument();

    // Upload items
    expect(
      screen.getByText(/تصویر کارت ملی یا برگه رهگیری/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/تصویر سلفی به همراه کارت ملی/)
    ).toBeInTheDocument();

    // Submit button
    expect(screen.getByText('ارسال مدارک جهت بررسی دستی همجا')).toBeInTheDocument();
  });

  it('renders HostingRequestModal and handles stay submission', () => {
    render(
      <HostingRequestModal
        isOpen={true}
        onClose={vi.fn()}
        host={sara}
      />
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
});
