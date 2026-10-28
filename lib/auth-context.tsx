'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, VerificationStatus } from '@/types/database';

interface AuthContextType {
  currentUser: UserProfile | null;
  isLoggedIn: boolean;
  isVerified: boolean;
  register: (data: Omit<UserProfile, 'id' | 'member_since_year' | 'response_rate_percent' | 'hosting_count' | 'verification_status' | 'is_identity_verified'>) => UserProfile;
  logout: () => void;
  submitVerification: (nationalCardUrl: string, selfieWithCardUrl: string) => void;
  adminApproveUser: () => void;
  adminResetVerification: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'hamja_current_user_v1';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.getItem === 'function') {
        const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          setCurrentUser(JSON.parse(stored));
        }
      }
    } catch (e) {
      // ignore in environments without localStorage
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save user to localStorage whenever updated
  const saveUser = (user: UserProfile | null) => {
    setCurrentUser(user);
    try {
      if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.setItem === 'function') {
        if (user) {
          window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
        } else {
          window.localStorage.removeItem(LOCAL_STORAGE_KEY);
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

    saveUser(newUser);
    return newUser;
  };

  const logout = () => {
    saveUser(null);
  };

  const submitVerification = (nationalCardUrl: string, selfieWithCardUrl: string) => {
    if (!currentUser) return;
    const updated: UserProfile = {
      ...currentUser,
      verification_status: 'pending',
      verification_docs: {
        national_card_url: nationalCardUrl,
        selfie_with_card_url: selfieWithCardUrl,
        submitted_at: new Date().toLocaleDateString('fa-IR'),
      },
    };
    saveUser(updated);
  };

  const adminApproveUser = () => {
    if (!currentUser) return;
    const updated: UserProfile = {
      ...currentUser,
      verification_status: 'approved',
      is_identity_verified: true,
    };
    saveUser(updated);
  };

  const adminResetVerification = () => {
    if (!currentUser) return;
    const updated: UserProfile = {
      ...currentUser,
      verification_status: 'unverified',
      is_identity_verified: false,
      verification_docs: undefined,
    };
    saveUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoggedIn: !!currentUser,
        isVerified: currentUser?.verification_status === 'approved',
        register,
        logout,
        submitVerification,
        adminApproveUser,
        adminResetVerification,
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
