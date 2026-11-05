'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, VerificationStatus } from '@/types/database';

interface AuthContextType {
  currentUser: UserProfile | null;
  usersList: UserProfile[];
  isLoggedIn: boolean;
  isVerified: boolean;
  register: (
    data: Omit<
      UserProfile,
      'id' | 'member_since_year' | 'response_rate_percent' | 'hosting_count' | 'verification_status' | 'is_identity_verified'
    >
  ) => Promise<{ success: boolean; user?: UserProfile; error?: string }>;
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isUsernameTaken: (username: string) => boolean;
  submitVerification: (nationalCardUrl: string, selfieWithCardUrl: string) => Promise<void>;
  approveUser: (userId: string) => Promise<void>;
  rejectUser: (userId: string, reason: string) => Promise<void>;
  switchUser: (userId: string) => void;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  clearAllUsers: () => Promise<void>;
  refreshUsers: () => Promise<UserProfile[] | void>;
  pendingRequestsCount: number;
  refreshRequestsCount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'hamja_current_user_clean_v1';
const LOCAL_STORAGE_USERS_KEY = 'hamja_all_users_clean_v1';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const saveUsersList = useCallback((newUsers: UserProfile[]) => {
    setUsersList(newUsers);
    try {
      if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.setItem === 'function') {
        window.localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(newUsers));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const saveCurrentUser = useCallback((user: UserProfile | null) => {
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
  }, []);

  const refreshUsers = useCallback(async (): Promise<UserProfile[] | void> => {
    try {
      if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
        const res = await fetch('/api/users', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.users)) {
            saveUsersList(data.users);
            return data.users;
          }
        }
      }
    } catch (e) {
      // ignore in tests / offline
    }
  }, [saveUsersList]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.getItem === 'function') {
        // Clean up legacy keys
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
      refreshUsers();
    }
  }, [refreshUsers]);

  const isUsernameTaken = useCallback(
    (username: string): boolean => {
      if (!username) return false;
      const clean = username.trim().toLowerCase();
      return usersList.some((u) => u.username?.toLowerCase() === clean);
    },
    [usersList]
  );

  const register = async (
    data: Omit<
      UserProfile,
      'id' | 'member_since_year' | 'response_rate_percent' | 'hosting_count' | 'verification_status' | 'is_identity_verified'
    >
  ): Promise<{ success: boolean; user?: UserProfile; error?: string }> => {
    const newUser: UserProfile = {
      ...data,
      id: `user-${Date.now()}`,
      username: data.username?.trim().toLowerCase() || `user_${Date.now().toString().slice(-4)}`,
      avatar_url:
        data.avatar_url ||
        '/images/default-avatar.svg',
      member_since_year: '۱۴۰۵',
      response_rate_percent: 100,
      hosting_count: 0,
      verification_status: 'unverified',
      is_identity_verified: false,
      last_active: 'همین الان',
    };

    // Save to real database
    if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
      try {
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser),
        });
        const result = await res.json();
        if (!res.ok || !result.success) {
          return {
            success: false,
            error: result.error || 'خطا در ثبت اطلاعات در دیتابیس',
          };
        }

        const savedUser: UserProfile = result.user || newUser;
        saveCurrentUser(savedUser);
        await refreshUsers();
        return { success: true, user: savedUser };
      } catch (err: any) {
        console.error('Failed to sync new user with database', err);
        return {
          success: false,
          error: 'خطا در برقراری ارتباط با سرور دیتابیس. لطفاً اتصال اینترنت خود را بررسی کنید.',
        };
      }
    }

    // Local / Offline fallback
    const updatedUsers = [newUser, ...usersList];
    saveUsersList(updatedUsers);
    saveCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  const login = async (identifier: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const clean = identifier.trim().toLowerCase();

    // 1. Try server authentication first
    if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: clean, password: pass }),
        });
        const result = await res.json();
        if (res.ok && result.success && result.user) {
          saveCurrentUser(result.user);
          await refreshUsers();
          return { success: true };
        } else if (res.status === 400 || res.status === 401 || res.status === 404) {
          return { success: false, error: result.error || 'اطلاعات ورود نادرست است.' };
        }
      } catch (e) {
        // Server unreachable, fallback to local usersList
      }
    }

    // 2. Offline / local fallback
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

  const submitVerification = async (nationalCardUrl: string, selfieWithCardUrl: string) => {
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

    saveCurrentUser(updatedUser);
    const updatedList = usersList.map((u) => (u.id === currentUser.id ? updatedUser : u));
    saveUsersList(updatedList);

    if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
      try {
        await fetch('/api/admin/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: currentUser.id,
            action: 'submit_docs',
            docs: { nationalCardUrl, selfieWithCardUrl },
          }),
        });
        await refreshUsers();
      } catch (e) {
        console.error('Failed to sync verification docs with database', e);
      }
    }
  };

  const approveUser = async (userId: string) => {
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
      try {
        await fetch('/api/admin/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, action: 'approve' }),
        });
        await refreshUsers();
      } catch (e) {
        console.error('Failed to sync approval with database', e);
      }
    }
  };

  const rejectUser = async (userId: string, reason: string) => {
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
      try {
        await fetch('/api/admin/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, action: 'reject', reason }),
        });
        await refreshUsers();
      } catch (e) {
        console.error('Failed to sync rejection with database', e);
      }
    }
  };

  const switchUser = (userId: string) => {
    const target = usersList.find((u) => u.id === userId);
    if (target) {
      saveCurrentUser(target);
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updatedUser: UserProfile = {
      ...currentUser,
      ...data,
    };
    saveCurrentUser(updatedUser);
    const updatedList = usersList.map((u) => (u.id === currentUser.id ? updatedUser : u));
    saveUsersList(updatedList);

    if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
      try {
        await fetch(`/api/users/${currentUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        await refreshUsers();
      } catch (e) {
        console.error('Failed to sync profile update with database', e);
      }
    }
  };

  const clearAllUsers = async () => {
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
      try {
        await fetch('/api/admin/clear', { method: 'POST' });
        await refreshUsers();
      } catch (e) {
        console.error('Failed to clear database on server', e);
      }
    }
  };

  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

  const refreshRequestsCount = useCallback(async () => {
    if (!currentUser) {
      setPendingRequestsCount(0);
      return;
    }
    try {
      if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
        const res = await fetch('/api/requests', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.requests)) {
            const pending = data.requests.filter(
              (r: any) =>
                (r.receiver_id === currentUser.id ||
                  (currentUser.username && r.receiver_id === currentUser.username) ||
                  (currentUser.phone && r.receiver_id === currentUser.phone)) &&
                r.status === 'pending'
            ).length;
            setPendingRequestsCount(pending);
          }
        }
      }
    } catch (e) {
      // ignore
    }
  }, [currentUser]);

  useEffect(() => {
    refreshRequestsCount();
  }, [currentUser, refreshRequestsCount]);

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
        pendingRequestsCount,
        refreshRequestsCount,
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
      register: async () => ({ success: false, error: 'Auth context not available' }),
      login: async () => ({ success: false, error: 'Auth context not available' }),
      logout: () => {},
      isUsernameTaken: () => false,
      submitVerification: async () => {},
      approveUser: async () => {},
      rejectUser: async () => {},
      switchUser: () => {},
      updateUserProfile: async () => {},
      clearAllUsers: async () => {},
      refreshUsers: async () => {},
      pendingRequestsCount: 0,
      refreshRequestsCount: async () => {},
    };
  }
  return context;
}
