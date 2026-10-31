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
} from 'lucide-react';
import VerificationModal from '../modals/VerificationModal';
import { useAuth } from '@/lib/auth-context';

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, isLoggedIn, isVerified, logout } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const navLinks = [
    { label: 'کاوش اعضا', href: '/explore', icon: Compass },
    { label: 'میزبانی متقابل', href: '/#mutual', icon: HomeIcon },
    { label: 'امنیت و اعتماد', href: '/#trust', icon: ShieldCheck },
    { label: 'درخواست‌های من', href: '/requests', icon: MessageSquare },
    { label: 'پروفایل من', href: '/profile', icon: User },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#F9F8F6]/95 backdrop-blur-md border-b border-[#EADFD5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo & Brand */}
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-[#C25E38] text-white flex items-center justify-center shadow-md transition-transform group-hover:scale-105">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 10l9-7 9 7v10a1 1 0 01-1 1H4a1 1 0 01-1-1V10z" />
                    <path d="M9 21V12h6v9" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-[#1F2937] tracking-tight">همجا</span>
                  <span className="text-[10px] text-[#6B7280] -mt-1 font-medium">میزبانی متقابل و سفر</span>
                </div>
              </Link>

              {/* Desktop Navigation Links */}
              <nav className="hidden md:flex items-center gap-6">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`text-sm font-medium transition-colors py-2 px-1 border-b-2 ${
                        isActive
                          ? 'border-[#C25E38] text-[#C25E38]'
                          : 'border-transparent text-[#4B5563] hover:text-[#C25E38]'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Desktop Action Buttons / User Status */}
            <div className="hidden md:flex items-center gap-3">
              {isLoggedIn && currentUser ? (
                <div className="flex items-center gap-3 bg-white px-3.5 py-1.5 rounded-2xl border border-[#EADFD5] shadow-sm">
                  {/* Verification Status Pill */}
                  {currentUser.verification_status === 'approved' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EBF5F1] text-[#1E5647] text-xs font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      هویت تأییدشده
                    </span>
                  )}

                  {currentUser.verification_status === 'pending' && (
                    <button
                      onClick={() => setShowVerifyModal(true)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200 hover:bg-amber-100 transition-colors"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      در انتظار بررسی دستی
                    </button>
                  )}

                  {currentUser.verification_status === 'rejected' && (
                    <Link
                      href="/profile"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold border border-red-200 hover:bg-red-100 transition-colors"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      مدارک رد شد (بررسی)
                    </Link>
                  )}

                  {currentUser.verification_status === 'unverified' && (
                    <button
                      onClick={() => setShowVerifyModal(true)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FBF4F0] text-[#C25E38] text-xs font-semibold border border-[#C25E38]/20 hover:bg-[#C25E38] hover:text-white transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      احراز هویت
                    </button>
                  )}

                  {/* User Profile Info */}
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 border-r border-gray-200 pr-3 mr-1 hover:opacity-80 transition-opacity"
                    title="مشاهده پروفایل من"
                  >
                    <img
                      src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                      alt={currentUser.full_name}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-300"
                    />
                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-800">{currentUser.full_name}</p>
                      <p className="text-[10px] text-gray-500">{currentUser.city}</p>
                    </div>
                  </Link>

                  {/* Logout Button */}
                  <button
                    onClick={logout}
                    title="خروج از حساب"
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="px-4 py-2 text-sm font-medium text-[#4B5563] hover:text-[#1F2937] transition-colors"
                  >
                    ورود
                  </Link>

                  <Link
                    href="/register"
                    className="px-4 py-2 text-sm font-medium text-white bg-[#C25E38] hover:bg-[#A84E2D] rounded-xl shadow-sm transition-all hover:shadow"
                  >
                    عضویت در همجا
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F0EDE8] transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="md:hidden border-b border-[#EADFD5] bg-[#F9F8F6] px-4 pt-2 pb-6 space-y-3">
            {isLoggedIn && currentUser && (
              <div className="p-3 bg-white rounded-2xl border border-gray-200 flex items-center justify-between">
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
                >
                  <img
                    src={currentUser.avatar_url}
                    alt={currentUser.full_name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-gray-800">{currentUser.full_name}</h4>
                    <span className="text-[10px] text-gray-500">{currentUser.city}</span>
                  </div>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="text-xs text-red-600 font-medium"
                >
                  خروج
                </button>
              </div>
            )}

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#374151] hover:bg-[#F0EDE8] hover:text-[#C25E38]"
              >
                <link.icon className="w-4 h-4 text-[#6B7280]" />
                {link.label}
              </Link>
            ))}

            {!isLoggedIn && (
              <div className="pt-3 border-t border-[#EADFD5]">
                <Link
                  href="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full py-2.5 text-center text-sm font-medium text-white bg-[#C25E38] rounded-xl"
                >
                  عضویت در همجا
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
