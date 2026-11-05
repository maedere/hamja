import { NextResponse } from 'next/server';
import { getAllRequests, createRequest } from '@/lib/db';
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

    const newRequest: HostingRequest = {
      ...body,
      id: body.id || `req-${Date.now()}`,
      status: body.status || 'pending',
      created_at: body.created_at || new Date().toLocaleDateString('fa-IR'),
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
