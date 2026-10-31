import { NextResponse } from 'next/server';
import { updateUser } from '@/lib/db';
import { VerificationStatus } from '@/types/database';

export async function POST(req: Request) {
  try {
    const { userId, action, reason, docs } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'شناسه کاربر الزامی است.' },
        { status: 400 }
      );
    }

    let updates: any = {};

    if (action === 'submit_docs') {
      updates = {
        verification_status: 'pending',
        is_identity_verified: false,
        rejection_reason: undefined,
        verification_docs: {
          national_card_url: docs?.nationalCardUrl,
          selfie_with_card_url: docs?.selfieWithCardUrl,
          submitted_at: new Date().toLocaleDateString('fa-IR'),
          rejection_reason: undefined,
        },
      };
    } else if (action === 'approve') {
      updates = {
        verification_status: 'approved' as VerificationStatus,
        is_identity_verified: true,
        rejection_reason: undefined,
      };
    } else if (action === 'reject') {
      updates = {
        verification_status: 'rejected' as VerificationStatus,
        is_identity_verified: false,
        rejection_reason: reason || 'عدم وضوح مدارک هویتی ارسال شده',
        verification_docs: {
          submitted_at: new Date().toLocaleDateString('fa-IR'),
          rejection_reason: reason || 'عدم وضوح مدارک هویتی ارسال شده',
        },
      };
    } else {
      return NextResponse.json(
        { success: false, error: 'عملیات نامعتبر است.' },
        { status: 400 }
      );
    }

    const updatedUser = await updateUser(userId, updates);
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error('API POST /api/admin/verify error:', error);
    return NextResponse.json(
      { success: false, error: 'خطا در تغییر وضعیت احراز هویت' },
      { status: 500 }
    );
  }
}
