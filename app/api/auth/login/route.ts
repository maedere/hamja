import { NextResponse } from 'next/server';
import { getUserByUsername } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, error: 'لطفاً نام کاربری و رمز عبور را وارد کنید.' },
        { status: 400 }
      );
    }

    const user = await getUserByUsername(identifier);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'کاربری با این مشخصات یافت نشد.' },
        { status: 404 }
      );
    }

    if (user.password && user.password !== password) {
      return NextResponse.json(
        { success: false, error: 'رمز عبور وارد شده نادرست است.' },
        { status: 401 }
      );
    }

    // Return the authenticated user profile (excluding sensitive password if desired, but user needs profile)
    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error('API POST /api/auth/login error:', error);
    return NextResponse.json(
      { success: false, error: 'خطا در فرآیند ورود به سیستم' },
      { status: 500 }
    );
  }
}
