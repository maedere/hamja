'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, VerificationStatus } from '@/types/database';

interface AuthContextType {
  currentUser: UserProfile | null;
  usersList: UserProfile[];
  isLoggedIn: boolean;
  isVerified: boolean;
  register: (data: Omit<UserProfile, 'id' | 'member_since_year' | 'response_rate_percent' | 'hosting_count' | 'verification_status' | 'is_identity_verified'>) => UserProfile;
  login: (identifier: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  isUsernameTaken: (username: string) => boolean;
  submitVerification: (nationalCardUrl: string, selfieWithCardUrl: string) => void;
  approveUser: (userId: string) => void;
  rejectUser: (userId: string, reason: string) => void;
  switchUser: (userId: string) => void;
  updateUserProfile: (data: Partial<UserProfile>) => void;
  clearAllUsers: () => void;
  refreshUsers?: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'hamja_current_user_clean_v1';
const LOCAL_STORAGE_USERS_KEY = 'hamja_all_users_clean_v1';

// Initial users is completely empty for real testing
const INITIAL_USERS: UserProfile[] = [];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const refreshUsers = async () => {
    try {
      if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
        const res = await fetch('/api/users');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.users)) {
            setUsersList(data.users);
            if (typeof window.localStorage !== 'undefined') {
              window.localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(data.users));
            }
          }
        }
      }
    } catch (e) {
      // ignore in tests / offline
    }
  };

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.getItem === 'function') {
        // Clean up any legacy mock data keys
        window.localStorage.removeItem('hamja_current_user_v3');
        window.localStorage.removeItem('hamja_all_users_v3');
        window.localStorage.removeItem('hamja_current_user_v2');
        window.localStorage.removeItem('hamja_all_users_v2');
        window.localStorage.removeItem('hamja_current_user');
        window.localStorage.removeItem('hamja_all_users');

        const storedUsers = window.localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
        if (storedUsers) {
          try {
            setUsersList(JSON.parse(storedUsers));
          } catch (e) {
            setUsersList([]);
          }
        } else {
          setUsersList([]);
          window.localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify([]));
        }

        const storedUser = window.localStorage.getItem(LOCAL_STORAGE_USER_KEY);
        if (storedUser) {
          try {
            setCurrentUser(JSON.parse(storedUser));
          } catch (e) {
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
      }
    } catch (e) {
      // ignore
    } finally {
      setIsLoaded(true);
      // Fetch latest from server database
      refreshUsers();
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

  const isUsernameTaken = (username: string): boolean => {
    if (!username) return false;
    const clean = username.trim().toLowerCase();
    return usersList.some((u) => u.username?.toLowerCase() === clean);
  };

  const register = (
    data: Omit<UserProfile, 'id' | 'member_since_year' | 'response_rate_percent' | 'hosting_count' | 'verification_status' | 'is_identity_verified'>
  ): UserProfile => {
    const newUser: UserProfile = {
      ...data,
      id: `user-${Date.now()}`,
      username: data.username?.trim().toLowerCase() || `user_${Date.now().toString().slice(-4)}`,
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

    // Save to real database
    if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
      fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      }).catch((e) => console.error('Failed to sync new user with database', e));
    }

    return newUser;
  };

  const login = (identifier: string, pass: string): { success: boolean; error?: string } => {
    const clean = identifier.trim().toLowerCase();
    const found = usersList.find(
      (u) =>
        u.username?.toLowerCase() === clean ||
        u.phone?.replace(/\s+/g, '') === clean ||
        u.instagram?.toLowerCase() === clean
    );

    if (!found) {
      return { success: false, error: 'کاربری با این نام کاربری یا شماره موبایل یافت نشد.' };
    }

    if (found.password && found.password !== pass) {
      return { success: false, error: 'رمز عبور وارد شده نادرست است.' };
    }

    saveCurrentUser(found);
    return { success: true };
  };

  const logout = () => {
    saveCurrentUser(null);
  };

  const submitVerification = (nationalCardUrl: string, selfieWithCardUrl: string) => {
    if (!currentUser) return;
    const updatedUser: UserProfile = {
      ...currentUser,
      verification_status: 'pending',
      rejection_reason: undefined,
      verification_docs: {
        national_card_url: nationalCardUrl,
        selfie_with_card_url: selfieWithCardUrl,
        submitted_at: new Date().toLocaleDateString('fa-IR'),
      },
    };

    const updatedList = usersList.map((u) => (u.id === currentUser.id ? updatedUser : u));
    saveUsersList(updatedList);
    saveCurrentUser(updatedUser);

    if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
      fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          action: 'submit_docs',
          docs: { nationalCardUrl, selfieWithCardUrl },
        }),
      }).catch((e) => console.error('Failed to sync verification docs with database', e));
    }
  };

  const approveUser = (userId: string) => {
    const updatedList = usersList.map((u) => {
      if (u.id === userId) {
        return {
          ...u,
          verification_status: 'approved' as VerificationStatus,
          is_identity_verified: true,
          rejection_reason: undefined,
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
        rejection_reason: undefined,
      });
    }

    if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
      fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'approve' }),
      }).catch((e) => console.error('Failed to sync approval with database', e));
    }
  };

  const rejectUser = (userId: string, reason: string) => {
    const updatedList = usersList.map((u) => {
      if (u.id === userId) {
        return {
          ...u,
          verification_status: 'rejected' as VerificationStatus,
          is_identity_verified: false,
          rejection_reason: reason,
          verification_docs: u.verification_docs
            ? { ...u.verification_docs, rejection_reason: reason }
            : undefined,
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
        rejection_reason: reason,
        verification_docs: currentUser.verification_docs
          ? { ...currentUser.verification_docs, rejection_reason: reason }
          : undefined,
      });
    }

    if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
      fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'reject', reason }),
      }).catch((e) => console.error('Failed to sync rejection with database', e));
    }
  };

  const switchUser = (userId: string) => {
    const target = usersList.find((u) => u.id === userId);
    if (target) {
      saveCurrentUser(target);
    }
  };

  const updateUserProfile = (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updatedUser: UserProfile = {
      ...currentUser,
      ...data,
    };
    const updatedList = usersList.map((u) => (u.id === currentUser.id ? updatedUser : u));
    saveUsersList(updatedList);
    saveCurrentUser(updatedUser);

    if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
      fetch(`/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).catch((e) => console.error('Failed to sync profile update with database', e));
    }
  };

  const clearAllUsers = () => {
    setUsersList([]);
    setCurrentUser(null);
    try {
      if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.setItem === 'function') {
        window.localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
        window.localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify([]));
      }
    } catch (e) {
      // ignore
    }

    if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
      fetch('/api/admin/clear', { method: 'POST' }).catch((e) =>
        console.error('Failed to clear database on server', e)
      );
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
        login,
        logout,
        isUsernameTaken,
        submitVerification,
        approveUser,
        rejectUser,
        switchUser,
        updateUserProfile,
        clearAllUsers,
        refreshUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      currentUser: null,
      usersList: [],
      isLoggedIn: false,
      isVerified: false,
      register: () => ({} as any),
      login: () => ({ success: false, error: undefined }),
      logout: () => {},
      isUsernameTaken: () => false,
      submitVerification: () => {},
      approveUser: () => {},
      rejectUser: () => {},
      switchUser: () => {},
      updateUserProfile: () => {},
      clearAllUsers: () => {},
      refreshUsers: async () => {},
    };
  }
  return context;
}
