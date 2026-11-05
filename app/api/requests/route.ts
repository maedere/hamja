import { NextResponse } from 'next/server';
import { getAllRequests, createRequest, getUserById } from '@/lib/db';
import { HostingRequest } from '@/types/database';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    const requests = await getAllRequests();

    if (userId) {
      const filtered = requests.filter(
        (r) => r.sender_id === userId || r.receiver_id === userId
      );
      return NextResponse.json(
        { success: true, requests: filtered },
        {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        }
      );
    }

    return NextResponse.json(
      { success: true, requests },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error: any) {
    console.error('API GET /api/requests error:', error);
    return NextResponse.json(
      { success: false, error: 'خطا در بارگذاری درخواست‌های میزبانی' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.sender_id || !body.receiver_id) {
      return NextResponse.json(
        { success: false, error: 'مشخصات فرستنده و گیرنده الزامی است.' },
        { status: 400 }
      );
    }

    if (body.sender_id === body.receiver_id) {
      return NextResponse.json(
        { success: false, error: 'ارسال درخواست به خود امکان‌پذیر نیست.' },
        { status: 400 }
      );
    }

    // Ensure sender is authenticated and identity is approved
    if (!body.sender_id || body.sender_id === 'guest-current-user') {
      return NextResponse.json(
        { success: false, error: 'برای ارسال درخواست میزبانی، لطفاً ابتدا وارد حساب کاربری خود شوید.' },
        { status: 401 }
      );
    }

    const sender = await getUserById(body.sender_id);
    if (sender && sender.verification_status !== 'approved') {
      return NextResponse.json(
        { success: false, error: 'برای ارسال درخواست میزبانی، هویت شما باید توسط ادمین تأیید شده باشد.' },
        { status: 403 }
      );
    }

    const isoCreatedAt =
      body.created_at && !isNaN(new Date(body.created_at).getTime())
        ? new Date(body.created_at).toISOString()
        : new Date().toISOString();

    const newRequest: HostingRequest = {
      ...body,
      id: body.id || `req-${Date.now()}`,
      status: body.status || 'pending',
      created_at: isoCreatedAt,
    };

    const saved = await createRequest(newRequest);
    return NextResponse.json({ success: true, request: saved }, { status: 201 });
  } catch (error: any) {
    console.error('API POST /api/requests error:', error);
    return NextResponse.json(
      { success: false, error: 'خطا در ثبت درخواست میزبانی در دیتابیس' },
      { status: 500 }
    );
  }
}
