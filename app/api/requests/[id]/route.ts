import { NextResponse } from 'next/server';
import { updateRequestStatus } from '@/lib/db';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status, exact_address_unlocked } = await req.json();

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'وضعیت جدید درخواست الزامی است.' },
        { status: 400 }
      );
    }

    const updated = await updateRequestStatus(id, status, exact_address_unlocked);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'درخواست مورد نظر یافت نشد.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, request: updated });
  } catch (error: any) {
    console.error('API PATCH /api/requests/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'خطا در به‌روزرسانی وضعیت درخواست' },
      { status: 500 }
    );
  }
}
