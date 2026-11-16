import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HostingRequestModal from '@/components/modals/HostingRequestModal';
import AcceptRequestModal from '@/components/modals/AcceptRequestModal';
import DeclineRequestModal from '@/components/modals/DeclineRequestModal';
import ReviewExperienceModal from '@/components/modals/ReviewExperienceModal';
import { AuthProvider } from '@/lib/auth-context';
import { UserProfile, HostingRequest } from '@/types/database';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
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

describe('Hambam Multi-User Real-world Scenarios Test Suite', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  // User 1: Host in Shiraz
  const hostUser: UserProfile = {
    id: 'user-arash-shiraz',
    full_name: 'آرش قوامی',
    username: 'arash_shiraz',
    city: 'شیراز',
    role: 'host',
    can_host: true,
    hosting_status: 'ready_for_hosting',
    verification_status: 'approved',
    is_identity_verified: true,
    member_since_year: '۱۴۰۵',
    response_rate_percent: 100,
    hosting_count: 5,
    bio_headline: 'معمار و دوستدار شعر در بافت سنتی شیراز',
    interests: ['معماری', 'عکاسی'],
  };

  // User 2: Traveler from Tehran
  const travelerUser: UserProfile = {
    id: 'user-pouya-traveler',
    full_name: 'پویا کمالی',
    username: 'pouya_traveler',
    city: 'تهران',
    role: 'traveler',
    can_host: false,
    hosting_status: 'not_hosting',
    verification_status: 'approved',
    is_identity_verified: true,
    member_since_year: '۱۴۰۵',
    response_rate_percent: 100,
    hosting_count: 0,
    target_destination: 'شیراز',
    target_travel_dates: 'اردیبهشت ۱۴۰۵',
    target_guests_count: 1,
    bio_headline: 'کوله‌گرد مشتاق تجربه میزبانی‌های بومی',
    interests: ['تکنولوژی', 'کتاب'],
  };

  // Sample Request between Traveler and Host
  const sampleRequest: HostingRequest = {
    id: 'req-test-123',
    sender_id: travelerUser.id,
    sender_name: travelerUser.full_name,
    sender_city: travelerUser.city,
    receiver_id: hostUser.id,
    receiver_name: hostUser.full_name,
    receiver_city: hostUser.city,
    start_date: '1405/02/10',
    end_date: '1405/02/14',
    guest_count: 1,
    message: 'درود آرش عزیز، مشتاق اقامت در شیراز زیبا هستم.',
    status: 'pending',
    request_type: 'stay_request',
    created_at: new Date().toISOString(),
  };

  it('Scenario 1: Verified traveler sends stay request to host in Shiraz', () => {
    window.localStorage.setItem('hamja_current_user_clean_v1', JSON.stringify(travelerUser));
    const handleClose = vi.fn();

    render(
      <AuthProvider>
        <HostingRequestModal
          isOpen={true}
          onClose={handleClose}
          host={hostUser}
          mode="request_stay"
        />
      </AuthProvider>
    );

    expect(screen.getByText(`درخواست میزبانی و ارتباط با ${hostUser.full_name}`)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`میزبان در ${hostUser.city}`))).toBeInTheDocument();
    expect(screen.getByText('تاریخ ورود')).toBeInTheDocument();
    expect(screen.getByText('تاریخ خروج')).toBeInTheDocument();
    expect(screen.getByText('ارسال درخواست میزبانی')).toBeInTheDocument();
  });

  it('Scenario 2: Host accepts stay request and provides phone & exact address', () => {
    const handleConfirm = vi.fn().mockResolvedValue(undefined);
    const handleClose = vi.fn();

    render(
      <AcceptRequestModal
        isOpen={true}
        onClose={handleClose}
        request={sampleRequest}
        currentUser={hostUser}
        onConfirm={handleConfirm}
      />
    );

    expect(screen.getByText(`پذیرش درخواست ${sampleRequest.sender_name}`)).toBeInTheDocument();
    expect(screen.getByText(/شماره تماس و نشانی شما تنها پس از تایید در دسترس/)).toBeInTheDocument();
    expect(screen.getByText('تایید نهایی و پذیرش درخواست')).toBeInTheDocument();

    fireEvent.click(screen.getByText('تایید نهایی و پذیرش درخواست'));
    expect(handleConfirm).toHaveBeenCalledWith(
      sampleRequest.id,
      expect.any(String),
      expect.any(String),
      expect.any(String)
    );
  });

  it('Scenario 3: Host offers hosting proactively to traveler heading to their city', () => {
    window.localStorage.setItem('hamja_current_user_clean_v1', JSON.stringify(hostUser));

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

    expect(screen.getByText(`پیشنهاد میزبانی به ${travelerUser.full_name} (دعوت به خانه شما)`)).toBeInTheDocument();
    expect(screen.getByText('ارسال پیشنهاد و دعوت به میزبانی')).toBeInTheDocument();
  });

  it('Scenario 4: Declining a request with preset reason and note', () => {
    const handleConfirm = vi.fn().mockResolvedValue(undefined);

    render(
      <DeclineRequestModal
        isOpen={true}
        onClose={vi.fn()}
        request={sampleRequest}
        onConfirm={handleConfirm}
      />
    );

    expect(screen.getByText(/عدم امکان میزبانی/)).toBeInTheDocument();
    expect(screen.getByText('تایید رد درخواست')).toBeInTheDocument();

    fireEvent.click(screen.getByText('تایید رد درخواست'));
    expect(handleConfirm).toHaveBeenCalledWith(
      sampleRequest.id,
      expect.any(String),
      expect.any(String)
    );
  });

  it('Scenario 5: Completing stay with mutual rating, review comments and tags', () => {
    const handleConfirm = vi.fn().mockResolvedValue(undefined);

    render(
      <ReviewExperienceModal
        isOpen={true}
        onClose={vi.fn()}
        request={sampleRequest}
        reviewerRole="guest"
        onConfirm={handleConfirm}
      />
    );

    expect(screen.getByText(new RegExp(`مهمان شدم · ثبت تجربه اقامت با ${sampleRequest.receiver_name}`))).toBeInTheDocument();
    expect(screen.getByText('ثبت تجربه و پایان موفقیت‌آمیز سفر')).toBeInTheDocument();

    // Type a review note so the form passes validation
    const textarea = screen.getByPlaceholderText(/مهمان خانه/);
    fireEvent.change(textarea, { target: { value: 'تجربه‌ای بسیار گرم و به‌یادماندنی در شیراز بود.' } });

    fireEvent.click(screen.getByText('ثبت تجربه و پایان موفقیت‌آمیز سفر'));
    expect(handleConfirm).toHaveBeenCalledWith(
      sampleRequest.id,
      expect.any(Number),
      expect.any(String),
      expect.any(Array)
    );
  });

  it('Scenario 6: Unverified user is blocked from sending requests and prompted to verify', () => {
    const unverifiedUser = {
      ...travelerUser,
      id: 'unverified-user',
      verification_status: 'unverified' as const,
      is_identity_verified: false,
    };
    window.localStorage.setItem('hamja_current_user_clean_v1', JSON.stringify(unverifiedUser));

    render(
      <AuthProvider>
        <HostingRequestModal
          isOpen={true}
          onClose={vi.fn()}
          host={hostUser}
        />
      </AuthProvider>
    );

    expect(screen.getByText('نیاز به تأیید احراز هویت')).toBeInTheDocument();
    expect(screen.getByText(/جهت حفظ امنیت جامعه هم‌بام و اعتماد متقابل اعضا/)).toBeInTheDocument();
    expect(screen.queryByText('ارسال درخواست میزبانی')).not.toBeInTheDocument();
  });
});
