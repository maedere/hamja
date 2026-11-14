'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldCheck,
  UserCheck,
  Menu,
  X,
  Compass,
  Home as HomeIcon,
  MessageSquare,
  LogOut,
  User,
  Clock,
  Sparkles,
  AlertTriangle,
  ArrowLeft,
} from 'lucide-react';
import VerificationModal from '../modals/VerificationModal';
import { useAuth } from '@/lib/auth-context';
import { getAvatarUrl, toPersianDigits } from '@/lib/persian-utils';

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, isLoggedIn, isVerified, logout, pendingRequestsCount } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const navLinks = [
    { label: 'کاوش اعضا', href: '/explore', icon: Compass },
    { label: 'میزبانی متقابل', href: '/#mutual', icon: HomeIcon },
    { label: 'امنیت و اعتماد', href: '/#trust', icon: ShieldCheck },
    { label: 'صندوق درخواست‌ها', href: '/requests', icon: MessageSquare },
    { label: 'پروفایل من', href: '/profile', icon: User },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#F9F8F6]/90 backdrop-blur-md border-b border-[#EADFD5]/80 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo & Brand */}
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-11 h-11 rounded-2xl bg-[#FAF5EE] border border-[#E8DED1] p-1 flex items-center justify-center shadow-xs transition-all duration-300 group-hover:scale-105 group-hover:shadow-md">
                  <img
                    src="/images/logo-icon.png"
                    alt="لوگوی هم‌بام"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-[#1F2937] tracking-tight leading-none">هم‌بام</span>
                  <span className="text-[10px] text-[#6B7280] mt-1 font-medium">میزبانی متقابل و سفر</span>
                </div>
              </Link>

              {/* Desktop Navigation Links */}
              <nav className="hidden lg:flex items-center gap-1.5">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  const isRequests = link.href === '/requests';
                  const hasBadge = isRequests && pendingRequestsCount > 0;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`text-sm font-semibold transition-all px-3.5 py-2 rounded-xl flex items-center gap-1.5 relative ${
                        isActive
                          ? 'bg-[#FBF4F0] text-[#C25E38] shadow-xs'
                          : 'text-gray-600 hover:text-[#C25E38] hover:bg-white/60'
                      }`}
                    >
                      <link.icon className={`w-4 h-4 ${isActive ? 'text-[#C25E38]' : 'text-gray-400'}`} />
                      <span>{link.label}</span>
                      {hasBadge && (
                        <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-[10px] font-black bg-[#C25E38] text-white rounded-full leading-none shadow-sm animate-pulse mr-0.5">
                          {toPersianDigits(pendingRequestsCount)}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Desktop Action Buttons / User Status */}
            <div className="hidden md:flex items-center gap-3">
              {isLoggedIn && currentUser ? (
                <div className="flex items-center gap-3 bg-white px-3.5 py-2 rounded-2xl border border-[#EADFD5] shadow-xs">
                  {/* Verification Status Pill */}
                  {currentUser.verification_status === 'approved' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EBF5F1] text-[#1E5647] text-xs font-bold border border-[#1E5647]/20">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      هویت تأییدشده
                    </span>
                  )}

                  {currentUser.verification_status === 'pending' && (
                    <button
                      onClick={() => setShowVerifyModal(true)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 hover:bg-amber-100 transition-colors"
                    >
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      در صف بررسی
                    </button>
                  )}

                  {currentUser.verification_status === 'rejected' && (
                    <Link
                      href="/profile"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200 hover:bg-red-100 transition-colors"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                      مدارک رد شد
                    </Link>
                  )}

                  {currentUser.verification_status === 'unverified' && (
                    <button
                      onClick={() => setShowVerifyModal(true)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FBF4F0] text-[#C25E38] text-xs font-bold border border-[#C25E38]/20 hover:bg-[#C25E38] hover:text-white transition-all shadow-xs"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      احراز هویت
                    </button>
                  )}

                  {/* User Profile Info */}
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 border-r border-gray-200 pr-3 mr-1 hover:opacity-85 transition-opacity"
                    title="مشاهده پروفایل من"
                  >
                    <img
                      src={getAvatarUrl(currentUser.avatar_url)}
                      alt={currentUser.full_name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-[#EADFD5] bg-[#F4EFEA]"
                    />
                    <div className="text-right">
                      <p className="text-xs font-extrabold text-gray-800 leading-tight">{currentUser.full_name}</p>
                      <p className="text-[10px] text-gray-500 font-medium">{currentUser.city}</p>
                    </div>
                  </Link>

                  {/* Logout Button */}
                  <button
                    onClick={logout}
                    title="خروج از حساب"
                    className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/register"
                    className="px-4 py-2.5 text-xs sm:text-sm font-bold text-gray-700 hover:text-[#C25E38] transition-colors"
                  >
                    ورود به حساب
                  </Link>

                  <Link
                    href="/register"
                    className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#C25E38] hover:bg-[#A84E2D] rounded-2xl shadow-sm transition-all hover:shadow hover:scale-102 active:scale-98 flex items-center gap-1.5"
                  >
                    <span>عضویت در هم‌بام</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative p-2.5 rounded-2xl text-gray-600 hover:text-gray-900 bg-white border border-[#EADFD5] shadow-xs transition-colors"
                aria-label="منو"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                {!isMenuOpen && pendingRequestsCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C25E38] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#C25E38] border-2 border-white"></span>
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="md:hidden border-b border-[#EADFD5] bg-[#F9F8F6] px-4 pt-3 pb-6 space-y-3 animate-fade-in shadow-lg">
            {isLoggedIn && currentUser ? (
              <div className="p-3.5 bg-white rounded-2xl border border-[#EADFD5] flex items-center justify-between shadow-xs">
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 hover:opacity-85 transition-opacity"
                >
                  <img
                    src={getAvatarUrl(currentUser.avatar_url)}
                    alt={currentUser.full_name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-[#EADFD5] bg-[#F4EFEA]"
                  />
                  <div>
                    <h4 className="text-xs font-black text-gray-800">{currentUser.full_name}</h4>
                    <span className="text-[10px] text-gray-500 font-medium">ساکن {currentUser.city}</span>
                  </div>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="text-xs text-rose-600 font-bold px-3 py-1.5 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors"
                >
                  خروج
                </button>
              </div>
            ) : null}

            <div className="space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const isRequests = link.href === '/requests';
                const hasBadge = isRequests && pendingRequestsCount > 0;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-bold transition-colors ${
                      isActive
                        ? 'bg-[#FBF4F0] text-[#C25E38]'
                        : 'text-gray-700 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <link.icon className={`w-4 h-4 ${isActive ? 'text-[#C25E38]' : 'text-gray-400'}`} />
                      <span>{link.label}</span>
                    </div>
                    {hasBadge && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-[#C25E38] text-white rounded-full animate-pulse shadow-xs">
                        <span>{toPersianDigits(pendingRequestsCount)}</span>
                        <span className="text-[10px]">جدید</span>
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {!isLoggedIn && (
              <div className="pt-3 border-t border-[#EADFD5] space-y-2">
                <Link
                  href="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full py-3 text-center text-sm font-bold text-white bg-[#C25E38] hover:bg-[#A84E2D] rounded-2xl shadow transition-colors"
                >
                  عضویت رایگان در هم‌بام
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full py-2.5 text-center text-xs font-bold text-gray-600 hover:text-gray-900 bg-white border border-[#EADFD5] rounded-2xl"
                >
                  ورود به حساب کاربری
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Global Identity Verification Modal */}
      <VerificationModal
        isOpen={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
      />
    </>
  );
}
