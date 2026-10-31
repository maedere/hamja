import { NextResponse } from 'next/server';
import { getUserById, updateUser } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getUserById(id);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'کاربر یافت نشد' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error('API GET /api/users/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'خطا در دریافت اطلاعات کاربر' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await req.json();

    const updatedUser = await updateUser(id, updates);

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'کاربر برای به‌روزرسانی یافت نشد' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error('API PUT /api/users/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'خطا در ویرایش اطلاعات کاربر' },
      { status: 500 }
    );
  }
}
