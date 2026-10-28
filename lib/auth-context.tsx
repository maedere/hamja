'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, VerificationStatus } from '@/types/database';

interface AuthContextType {
  currentUser: UserProfile | null;
  usersList: UserProfile[];
  isLoggedIn: boolean;
  isVerified: boolean;
  register: (data: Omit<UserProfile, 'id' | 'member_since_year' | 'response_rate_percent' | 'hosting_count' | 'verification_status' | 'is_identity_verified'>) => UserProfile;
  logout: () => void;
  submitVerification: (nationalCardUrl: string, selfieWithCardUrl: string) => void;
  approveUser: (userId: string) => void;
  rejectUser: (userId: string, reason?: string) => void;
  switchUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'hamja_current_user_v2';
const LOCAL_STORAGE_USERS_KEY = 'hamja_all_users_v2';

const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user-arash',
    full_name: 'آرش قدیمی',
    phone: '09355363846',
    instagram: 'Arashghadimi701',
    city: 'رشت',
    age: 35,
    job_education: 'کاردانی - آزاد',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    can_host: true,
    role: 'both',
    hosting_status: 'ready_for_hosting',
    max_guests: 3,
    guest_preference: 'any',
    sleeping_arrangement: 'private_with_bed',
    house_rules: ['ورود حیوان خانگی ممنوع است', 'استعمال دخانیات داخل خانه ممنوع است', 'محدوده ساعت رفت‌وآمد (ورود قبل از ۱۱ شب)'],
    bio_headline: 'علاقه‌مند به طبیعت‌گردی، عکاسی و همنشینی با دوستان سفر.',
    about_me: 'اهل رشت و عاشق هوای بارانی و طبیعت گیلان. خوشحال می‌شوم میزبان دوستان اهل سفر باشم.',
    interests: ['طبیعت‌گردی', 'عکاسی', 'سفر'],
    agreed_to_provide_id: true,
    agreed_to_respect_house_rules: true,
    agreed_to_hamja_terms: true,
    verification_status: 'pending',
    is_identity_verified: false,
    verification_docs: {
      national_card_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
      selfie_with_card_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      submitted_at: '۱۴۰۵/۰۷/۱۰',
    },
    member_since_year: '۱۴۰۵',
    response_rate_percent: 100,
    hosting_count: 0,
    last_active: 'امروز',
  },
  {
    id: 'sara-rahimi',
    full_name: 'سارا رحیمی',
    phone: '09131234567',
    instagram: 'sara_rahimi_art',
    city: 'اصفهان',
    age: 29,
    job_education: 'طراح گرافیک',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    can_host: true,
    role: 'both',
    hosting_status: 'ready_for_hosting',
    max_guests: 2,
    guest_preference: 'any',
    sleeping_arrangement: 'private_with_bed',
    house_rules: ['خانه بدون سیگار است', 'ساعت سکوت از ۱۱ شب'],
    bio_headline: 'شهرم را از قاب دوربینم به تو نشان می‌دهم.',
    about_me: 'طراح گرافیک در محله جلفای اصفهان.',
    interests: ['عکاسی', 'کتاب', 'طبیعت‌گردی'],
    agreed_to_provide_id: true,
    agreed_to_respect_house_rules: true,
    agreed_to_hamja_terms: true,
    verification_status: 'approved',
    is_identity_verified: true,
    verification_docs: {
      national_card_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
      selfie_with_card_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      submitted_at: '۱۴۰۴/۰۵/۱۲',
    },
    member_since_year: '۱۴۰۳',
    response_rate_percent: 98,
    hosting_count: 3,
    last_active: 'امروز، ۲ ساعت پیش',
  },
  {
    id: 'ali-mohammadi',
    full_name: 'علی محمدی',
    phone: '09141112233',
    instagram: 'ali_tabriz_trip',
    city: 'تبریز',
    age: 32,
    job_education: 'مهندس نرم‌افزار',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    can_host: true,
    role: 'both',
    hosting_status: 'ready_for_hosting',
    max_guests: 2,
    bio_headline: 'اهل کوه و کشف گوشه‌های کمتر دیده‌شده.',
    interests: ['کوهنوردی', 'عکاسی', 'تاریخ'],
    agreed_to_provide_id: true,
    agreed_to_respect_house_rules: true,
    agreed_to_hamja_terms: true,
    verification_status: 'approved',
    is_identity_verified: true,
    member_since_year: '۱۴۰۳',
    response_rate_percent: 95,
    hosting_count: 5,
    last_active: 'امروز',
  },
  {
    id: 'behnam-rezaei',
    full_name: 'بهنام رضایی',
    phone: '09173334455',
    instagram: 'behnam_bushehr',
    city: 'بوشهر',
    age: 28,
    job_education: 'موسیقی‌دان و صیاد',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    can_host: true,
    role: 'both',
    hosting_status: 'ready_for_hosting',
    max_guests: 2,
    bio_headline: 'با هم غروب ساحل را تماشا کنیم.',
    interests: ['سفر', 'موسیقی', 'دریا'],
    agreed_to_provide_id: true,
    agreed_to_respect_house_rules: true,
    agreed_to_hamja_terms: true,
    verification_status: 'unverified',
    is_identity_verified: false,
    member_since_year: '۱۴۰۲',
    response_rate_percent: 92,
    hosting_count: 3,
    last_active: 'دیروز',
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [usersList, setUsersList] = useState<UserProfile[]>(INITIAL_USERS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.getItem === 'function') {
        const storedUsers = window.localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
        if (storedUsers) {
          setUsersList(JSON.parse(storedUsers));
        } else {
          window.localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(INITIAL_USERS));
        }

        const storedUser = window.localStorage.getItem(LOCAL_STORAGE_USER_KEY);
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        } else {
          // Default logged-in user: Arash Ghadimi for seamless exploration
          setCurrentUser(INITIAL_USERS[0]);
          window.localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(INITIAL_USERS[0]));
        }
      }
    } catch (e) {
      // ignore
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveUsersList = (newUsers: UserProfile[]) => {
    setUsersList(newUsers);
    try {
      if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.setItem === 'function') {
        window.localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(newUsers));
      }
    } catch (e) {
      // ignore
    }
  };

  const saveCurrentUser = (user: UserProfile | null) => {
    setCurrentUser(user);
    try {
      if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.setItem === 'function') {
        if (user) {
          window.localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
        } else {
          window.localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
        }
      }
    } catch (e) {
      // ignore
    }
  };

  const register = (
    data: Omit<UserProfile, 'id' | 'member_since_year' | 'response_rate_percent' | 'hosting_count' | 'verification_status' | 'is_identity_verified'>
  ): UserProfile => {
    const newUser: UserProfile = {
      ...data,
      id: `user-${Date.now()}`,
      avatar_url:
        data.avatar_url ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      member_since_year: '۱۴۰۵',
      response_rate_percent: 100,
      hosting_count: 0,
      verification_status: 'unverified',
      is_identity_verified: false,
      last_active: 'همین الان',
    };

    const updatedUsers = [newUser, ...usersList];
    saveUsersList(updatedUsers);
    saveCurrentUser(newUser);
    return newUser;
  };

  const logout = () => {
    saveCurrentUser(null);
  };

  const submitVerification = (nationalCardUrl: string, selfieWithCardUrl: string) => {
    if (!currentUser) return;
    const updatedUser: UserProfile = {
      ...currentUser,
      verification_status: 'pending',
      verification_docs: {
        national_card_url: nationalCardUrl,
        selfie_with_card_url: selfieWithCardUrl,
        submitted_at: new Date().toLocaleDateString('fa-IR'),
      },
    };

    // Update in usersList
    const updatedList = usersList.map((u) => (u.id === currentUser.id ? updatedUser : u));
    saveUsersList(updatedList);
    saveCurrentUser(updatedUser);
  };

  const approveUser = (userId: string) => {
    const updatedList = usersList.map((u) => {
      if (u.id === userId) {
        return {
          ...u,
          verification_status: 'approved' as VerificationStatus,
          is_identity_verified: true,
        };
      }
      return u;
    });

    saveUsersList(updatedList);

    if (currentUser?.id === userId) {
      saveCurrentUser({
        ...currentUser,
        verification_status: 'approved',
        is_identity_verified: true,
      });
    }
  };

  const rejectUser = (userId: string, reason?: string) => {
    const updatedList = usersList.map((u) => {
      if (u.id === userId) {
        return {
          ...u,
          verification_status: 'rejected' as VerificationStatus,
          is_identity_verified: false,
        };
      }
      return u;
    });

    saveUsersList(updatedList);

    if (currentUser?.id === userId) {
      saveCurrentUser({
        ...currentUser,
        verification_status: 'rejected',
        is_identity_verified: false,
      });
    }
  };

  const switchUser = (userId: string) => {
    const target = usersList.find((u) => u.id === userId);
    if (target) {
      saveCurrentUser(target);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        usersList,
        isLoggedIn: !!currentUser,
        isVerified: currentUser?.verification_status === 'approved',
        register,
        logout,
        submitVerification,
        approveUser,
        rejectUser,
        switchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
