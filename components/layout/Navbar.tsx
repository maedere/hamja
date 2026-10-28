'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, UserCheck, Menu, X, Compass, Home as HomeIcon, MessageSquare } from 'lucide-react';
import VerificationModal from '../modals/VerificationModal';

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const navLinks = [
    { label: 'کاوش اعضا', href: '/explore', icon: Compass },
    { label: 'میزبانی متقابل', href: '/#mutual', icon: HomeIcon },
    { label: 'امنیت و اعتماد', href: '/#trust', icon: ShieldCheck },
    { label: 'درخواست‌های من', href: '/requests', icon: MessageSquare },
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

            {/* Desktop Action Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => setShowVerifyModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#1E5647] bg-[#EBF5F1] hover:bg-[#d8ece4] rounded-lg transition-colors border border-[#1E5647]/20"
              >
                <ShieldCheck className="w-4 h-4 text-[#1E5647]" />
                احراز هویت امن
              </button>

              <Link
                href="/explore"
                className="px-4 py-2 text-sm font-medium text-[#4B5563] hover:text-[#1F2937] transition-colors"
              >
                ورود
              </Link>

              <button
                onClick={() => setShowVerifyModal(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-[#C25E38] hover:bg-[#A84E2D] rounded-xl shadow-sm transition-all hover:shadow"
              >
                عضویت در همجا
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setShowVerifyModal(true)}
                className="p-2 text-[#1E5647] bg-[#EBF5F1] rounded-lg text-xs font-semibold"
                aria-label="احراز هویت"
              >
                <ShieldCheck className="w-5 h-5" />
              </button>
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
            <div className="pt-3 border-t border-[#EADFD5] flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setShowVerifyModal(true);
                }}
                className="w-full py-2.5 text-center text-sm font-medium text-white bg-[#C25E38] rounded-xl"
              >
                عضویت در همجا
              </button>
            </div>
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
