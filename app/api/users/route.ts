import { NextResponse } from 'next/server';
import { getAllUsers, createUser, getUserByUsername } from '@/lib/db';
import { UserProfile } from '@/types/database';

export async function GET() {
  try {
    const users = await getAllUsers();
    return NextResponse.json(
      { success: true, users },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error: any) {
    console.error('API GET /api/users error:', error);
    return NextResponse.json(
      { success: false, error: 'خطا در بارگذاری کاربران' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Check if username is already taken
    if (body.username) {
      const existing = await getUserByUsername(body.username);
      if (existing) {
        return NextResponse.json(
          { success: false, error: 'این نام کاربری قبلاً توسط شخص دیگری انتخاب شده است.' },
          { status: 400 }
        );
      }
    }

    const newUser: UserProfile = {
      ...body,
      id: body.id || `user-${Date.now()}`,
      username: body.username?.trim().toLowerCase() || `user_${Date.now().toString().slice(-4)}`,
      avatar_url:
        body.avatar_url ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      member_since_year: body.member_since_year || '۱۴۰۵',
      response_rate_percent: body.response_rate_percent ?? 100,
      hosting_count: body.hosting_count ?? 0,
      verification_status: body.verification_status || 'unverified',
      is_identity_verified: body.is_identity_verified ?? false,
      last_active: 'همین الان',
      created_at: new Date().toISOString(),
    };

    const savedUser = await createUser(newUser);
    return NextResponse.json({ success: true, user: savedUser }, { status: 201 });
  } catch (error: any) {
    console.error('API POST /api/users error:', error);
    return NextResponse.json(
      { success: false, error: 'خطا در ثبت اطلاعات کاربر در دیتابیس' },
      { status: 500 }
    );
  }
}
