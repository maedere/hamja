'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Phone,
  Camera,
  MapPin,
  Calendar,
  ExternalLink,
  Eye,
  ArrowRight,
  Filter,
  Check,
  X,
  Sparkles,
  AlertTriangle,
  Trash2,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { UserProfile, VerificationStatus } from '@/types/database';

export default function AdminPage() {
  const { usersList, approveUser, rejectUser, switchUser, currentUser, clearAllUsers } = useAuth();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Rejection Modal State
  const [rejectingUser, setRejectingUser] = useState<UserProfile | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>(
    'تصویر کارت ملی ناخواناست و مشخصات به وضوح دیده نمی‌شود.'
  );

  const pendingCount = usersList.filter((u) => u.verification_status === 'pending').length;
  const approvedCount = usersList.filter((u) => u.verification_status === 'approved').length;

  const filteredUsers = usersList.filter((u) => {
    if (filterStatus === 'all') return true;
    return u.verification_status === filterStatus;
  });

  const handleApprove = (user: UserProfile) => {
    approveUser(user.id);
    setActionNotice(`مدارک ${user.full_name} با موفقیت تایید شد.`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleConfirmReject = () => {
    if (!rejectingUser) return;
    rejectUser(rejectingUser.id, rejectionReason);
    setActionNotice(`مدارک ${rejectingUser.full_name} با ذکر دلیل رد شد.`);
    setRejectingUser(null);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const presetReasons = [
    'تصویر کارت ملی ناخواناست و مشخصات به وضوح دیده نمی‌شود.',
    'تصویر سلفی با چهره روی کارت ملی تطابق ندارد.',
    'کارت ملی در تصویر سلفی وجود ندارد یا مبهم است.',
    'عکس مخدوش یا برش‌خورده است؛ لطفاً عکس کامل و واضح بگیرید.',
  ];

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#1F2937] py-8 text-right font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Admin Navigation Bar */}
        <div className="bg-white rounded-3xl p-6 border border-[#EADFD5] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1E5647] text-white flex items-center justify-center shadow">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-gray-800">
                  پنل مدیریت و بررسی مدارک هویتی همجا
                </h1>
                <span className="text-[11px] bg-[#C25E38] text-white font-bold px-2.5 py-0.5 rounded-full">
                  Admin
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                بررسی دستی تصاویر کارت ملی و سلفی کاربران ثبت‌نام‌شده
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                if (window.confirm('آیا از پاکسازی تمام کاربران و مدارک اطمینان دارید؟')) {
                  clearAllUsers();
                  setActionNotice('تمام داده‌های تستی پاکسازی شدند.');
                  setTimeout(() => setActionNotice(null), 3000);
                }
              }}
              className="w-full sm:w-auto px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 transition-colors flex items-center justify-center gap-1.5"
              title="پاکسازی تمام داده‌ها و ریست"
            >
              <Trash2 className="w-4 h-4" />
              <span>پاکسازی کامل کاربران</span>
            </button>

            <Link
              href="/"
              className="w-full sm:w-auto px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowRight className="w-4 h-4" />
              <span>بازگشت به سایت اصلی</span>
            </Link>
          </div>
        </div>

        {/* Action Notice Banner */}
        {actionNotice && (
          <div className="p-4 bg-[#EBF5F1] text-[#1E5647] rounded-2xl border border-[#1E5647]/30 text-xs font-bold flex items-center gap-2 animate-fade-in shadow-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Stats and Filter Tabs */}
        <div className="bg-white rounded-3xl p-5 border border-[#EADFD5] shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                filterStatus === 'all'
                  ? 'bg-[#1F2937] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              همه کاربران ({usersList.length})
            </button>

            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                filterStatus === 'pending'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>در انتظار بررسی دستی</span>
              <span className="w-5 h-5 rounded-full bg-white text-amber-800 text-[10px] flex items-center justify-center font-bold">
                {pendingCount}
              </span>
            </button>

            <button
              onClick={() => setFilterStatus('approved')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                filterStatus === 'approved'
                  ? 'bg-[#1E5647] text-white shadow-sm'
                  : 'bg-[#EBF5F1] text-[#1E5647] border border-[#1E5647]/20 hover:bg-[#d8ece4]'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>هویت تأییدشده ({approvedCount})</span>
            </button>

            <button
              onClick={() => setFilterStatus('unverified')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                filterStatus === 'unverified'
                  ? 'bg-[#C25E38] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              احراز نشده
            </button>
          </div>

          <div className="text-xs text-gray-500 font-medium">
            نمایش {filteredUsers.length} از {usersList.length} کاربر
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => {
              const hasDocs = !!user.verification_docs?.national_card_url;
              const isCurrentUser = currentUser?.id === user.id;

              return (
                <div
                  key={user.id}
                  className={`bg-white rounded-3xl p-6 border shadow-sm transition-all ${
                    user.verification_status === 'pending'
                      ? 'border-amber-300 ring-2 ring-amber-100'
                      : user.verification_status === 'rejected'
                      ? 'border-rose-300 bg-rose-50/20'
                      : 'border-[#EADFD5]'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    {/* User Identity & Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <img
                        src={user.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'}
                        alt={user.full_name}
                        className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#EADFD5] shrink-0"
                      />

                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-bold text-gray-900">{user.full_name}</h3>
                          
                          {/* Username Badge */}
                          {user.username && (
                            <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded-lg">
                              @{user.username}
                            </span>
                          )}

                          {/* Verification Status Badge */}
                          {user.verification_status === 'approved' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EBF5F1] text-[#1E5647] text-[11px] font-bold border border-[#1E5647]/20">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              هویت تأییدشده
                            </span>
                          )}
                          {user.verification_status === 'pending' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-200">
                              <Clock className="w-3.5 h-3.5 animate-spin" />
                              در انتظار بررسی دستی
                            </span>
                          )}
                          {user.verification_status === 'unverified' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[11px] font-medium">
                              بدون مدارک
                            </span>
                          )}
                          {user.verification_status === 'rejected' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[11px] font-bold border border-rose-200">
                              <XCircle className="w-3.5 h-3.5" />
                              رد شده
                            </span>
                          )}

                          {isCurrentUser && (
                            <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-md">
                              کاربر فعلی لاگین‌شده
                            </span>
                          )}
                        </div>

                        {/* Contact & Demographics */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 pt-0.5">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#C25E38]" />
                            {user.city}
                          </span>
                          {user.phone && (
                            <span className="flex items-center gap-1 font-mono text-gray-700" dir="ltr">
                              <Phone className="w-3.5 h-3.5 text-gray-400" />
                              {user.phone}
                            </span>
                          )}
                          {user.instagram && (
                            <span className="flex items-center gap-1 font-mono text-gray-700" dir="ltr">
                              <Camera className="w-3.5 h-3.5 text-pink-600" />
                              @{user.instagram}
                            </span>
                          )}
                          {user.age && <span>{user.age} سال</span>}
                          {user.job_education && <span className="text-gray-500">({user.job_education})</span>}
                        </div>

                        {/* Rejection Notice if rejected */}
                        {user.verification_status === 'rejected' && user.rejection_reason && (
                          <div className="mt-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                            <span>
                              <strong>دلیل رد ثبت‌شده:</strong> {user.rejection_reason}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Uploaded Documents Preview & Approval Actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                      {hasDocs && user.verification_docs ? (
                        <div className="flex items-center gap-3">
                          {/* Card Thumbnail */}
                          {user.verification_docs.national_card_url && (
                            <div
                              onClick={() =>
                                setPreviewImage({
                                  url: user.verification_docs!.national_card_url!,
                                  title: `عکس کارت ملی: ${user.full_name}`,
                                })
                              }
                              className="group relative cursor-pointer"
                            >
                              <img
                                src={user.verification_docs.national_card_url}
                                alt="کارت ملی"
                                className="w-16 h-16 rounded-xl object-cover border-2 border-gray-200 group-hover:border-[#C25E38] shadow-sm transition-all"
                              />
                              <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                <Eye className="w-4 h-4" />
                              </div>
                              <span className="block text-[9px] text-gray-500 text-center mt-1">
                                کارت ملی
                              </span>
                            </div>
                          )}

                          {/* Selfie Thumbnail */}
                          {user.verification_docs.selfie_with_card_url && (
                            <div
                              onClick={() =>
                                setPreviewImage({
                                  url: user.verification_docs!.selfie_with_card_url!,
                                  title: `سلفی با کارت ملی: ${user.full_name}`,
                                })
                              }
                              className="group relative cursor-pointer"
                            >
                              <img
                                src={user.verification_docs.selfie_with_card_url}
                                alt="سلفی با کارت ملی"
                                className="w-16 h-16 rounded-xl object-cover border-2 border-gray-200 group-hover:border-[#C25E38] shadow-sm transition-all"
                              />
                              <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                <Eye className="w-4 h-4" />
                              </div>
                              <span className="block text-[9px] text-gray-500 text-center mt-1">
                                سلفی با کارت
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">
                          هنوز مدرکی ارسال نکرده است
                        </span>
                      )}

                      {/* Approval Buttons */}
                      <div className="flex items-center gap-2">
                        {user.verification_status !== 'approved' && (
                          <button
                            onClick={() => handleApprove(user)}
                            className="px-4 py-2 bg-[#1E5647] hover:bg-[#164337] text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>تأیید مدارک</span>
                          </button>
                        )}

                        {user.verification_status !== 'rejected' && (
                          <button
                            onClick={() => setRejectingUser(user)}
                            className="px-3 py-2 bg-gray-100 hover:bg-rose-100 text-gray-700 hover:text-rose-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>رد مدارک</span>
                          </button>
                        )}

                        <button
                          onClick={() => switchUser(user.id)}
                          title="ورود به عنوان این کاربر برای تست در سایت"
                          className="px-3 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                          سوییچ لاگین
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#EADFD5] space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                <User className="w-8 h-8" />
              </div>
              {usersList.length === 0 ? (
                <>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-gray-800">هیچ کاربری در سامانه ثبت‌نام نکرده است</h4>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                      تمام داده‌های تستی پاکسازی شدند. شما می‌توانید از طریق صفحه ثبت‌نام، اولین کاربران آزمایشی را بسازید.
                    </p>
                  </div>
                  <div>
                    <Link
                      href="/register"
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#C25E38] hover:bg-[#A84E2D] text-white text-xs font-bold rounded-xl shadow transition-colors"
                    >
                      ثبت‌نام اولین کاربر
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <h4 className="text-base font-bold text-gray-700">کاربری در این وضعیت یافت نشد</h4>
                  <p className="text-xs text-gray-400 mt-1">می‌توانید فیلتر وضعیت را روی «همه کاربران» بگذارید.</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* REJECTION REASON MODAL */}
      {rejectingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-right">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 border border-[#EADFD5] shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span>ثبت دلیل رد مدارک {rejectingUser.full_name}</span>
              </h3>
              <button
                onClick={() => setRejectingUser(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              این دلیل در صفحه پروفایل کاربر به او نمایش داده خواهد شد تا بتواند مدارک اصلاح‌شده را مجدداً بارگذاری کند:
            </p>

            {/* Quick Reason Presets */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">دلایل آماده متداول:</label>
              <div className="space-y-1.5">
                {presetReasons.map((reason, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setRejectionReason(reason)}
                    className={`w-full p-2.5 rounded-xl text-xs text-right transition-all border ${
                      rejectionReason === reason
                        ? 'border-rose-500 bg-rose-50 text-rose-900 font-bold'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    • {reason}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Reason Textarea */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                یا متن اختصاصی دلیل رد را بنویسید:
              </label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-3 text-xs bg-[#F9F8F6] border border-gray-200 rounded-xl outline-none focus:border-rose-500 leading-relaxed"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleConfirmReject}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors shadow"
              >
                ثبت رد مدارک و اطلاع به کاربر
              </button>
              <button
                type="button"
                onClick={() => setRejectingUser(null)}
                className="py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal for Large Document Inspection */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-white/20 p-4 space-y-3 cursor-default"
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h4 className="text-sm font-bold text-gray-800">{previewImage.title}</h4>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[75vh] overflow-hidden rounded-2xl flex items-center justify-center bg-gray-900">
              <img
                src={previewImage.url}
                alt={previewImage.title}
                className="max-h-[75vh] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
