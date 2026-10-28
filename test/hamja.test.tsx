import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MemberCard from '@/components/members/MemberCard';
import VerificationModal from '@/components/modals/VerificationModal';
import HostingRequestModal from '@/components/modals/HostingRequestModal';
import IranMap from '@/components/explore/IranMap';
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

  it('renders VerificationModal with 3-step liveness selfie matching PDF Page 1', () => {
    render(<VerificationModal isOpen={true} onClose={vi.fn()} />);

    // Modal title & privacy notice
    expect(screen.getByText('احراز هویت و عضویت امن')).toBeInTheDocument();
    expect(
      screen.getByText('اطلاعات شما نزد همجا کاملاً محرمانه می‌ماند.')
    ).toBeInTheDocument();

    // Step 2 indicator and live face frame
    expect(screen.getByText('گام ۲ از ۳: احراز چهره')).toBeInTheDocument();
    expect(screen.getByText('چهره در کادر قرار گرفت')).toBeInTheDocument();
    expect(
      screen.getByText(
        'جهت حفظ امنیت جامعه، تصویر زنده چهره شما باید با کارت ملی تطبیق داده شود.'
      )
    ).toBeInTheDocument();

    // Action button
    const nextBtn = screen.getByText('ثبت و ادامه به گام بعد');
    expect(nextBtn).toBeInTheDocument();

    // Click next -> transitions to step 3
    fireEvent.click(nextBtn);
    expect(screen.getByText('گام ۳ از ۳: تکمیل عضویت')).toBeInTheDocument();
    expect(
      screen.getByText('میزبانی متقابل (میزبان و مسافر)')
    ).toBeInTheDocument();
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
