import { NextResponse } from 'next/server';
import { clearAllUsers } from '@/lib/db';

export async function POST() {
  try {
    await clearAllUsers();
    return NextResponse.json({ success: true, message: 'تمام داده‌های دیتابیس با موفقیت بازنشانی شدند.' });
  } catch (error: any) {
    console.error('API POST /api/admin/clear error:', error);
    return NextResponse.json(
      { success: false, error: 'خطا در بازنشانی داده‌های دیتابیس' },
      { status: 500 }
    );
  }
}
