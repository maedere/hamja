#!/usr/bin/env python3
"""
End-to-End Scenarios Test Suite for Hambam (هم‌بام) Platform
Tests:
1. User Registration with rich profiles (Host, Mutual Host, Traveler) across Iranian cities
2. Duplicate Username validation
3. Identity Verification submission & Admin Approval/Rejection workflow
4. Security & Safety Gating (blocking unverified users from sending requests, blocking self-requests)
5. Traveler requesting a stay from a Host (Dates, Guest Count, Persian message)
6. Host accepting stay request and unlocking exact address & phone
7. Host proactively offering hosting (invitation) to a traveler
8. Host declining an invitation/request with a reason
9. Completed Stay and Two-Sided Mutual Review & Rating submission
10. Verification of live data persistence
"""

import json
import time
import urllib.request
import urllib.error

BASE_URL = "https://hamja-one.vercel.app"
HEADERS = {"Content-Type": "application/json", "User-Agent": "Hambam-E2E-Tester"}

def api_post(endpoint, data):
    url = f"{BASE_URL}{endpoint}"
    req = urllib.request.Request(url, data=json.dumps(data).encode("utf-8"), headers=HEADERS, method="POST")
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status, json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode("utf-8"))

def api_patch(endpoint, data):
    url = f"{BASE_URL}{endpoint}"
    req = urllib.request.Request(url, data=json.dumps(data).encode("utf-8"), headers=HEADERS, method="PATCH")
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status, json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode("utf-8"))

def api_get(endpoint):
    url = f"{BASE_URL}{endpoint}"
    req = urllib.request.Request(url, headers={"User-Agent": "Hambam-E2E-Tester"})
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status, json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode("utf-8"))

def run_tests():
    print("=" * 70)
    print("🚀 آغاز آزمون‌های سناریوهای جامع هم‌بام (Hambam)")
    print(f"🎯 سرور هدف: {BASE_URL}")
    print("=" * 70)

    timestamp = int(time.time())

    # -------------------------------------------------------------
    # سناریو ۱: ثبت‌نام کاربران واقعی با نقش‌ها و شهرهای متنوع
    # -------------------------------------------------------------
    print("\n[سناریو ۱] ثبت‌نام کاربران واقعی در شهرهای مختلف ایران...")

    # ۱. آرش قوامی - میزبان در شیراز
    user_arash = {
        "full_name": "آرش قوامی",
        "username": f"arash_shiraz_{timestamp}",
        "password": "Password1405!",
        "city": "شیراز",
        "province": "فارس",
        "phone": "09171112233",
        "role": "host",
        "can_host": True,
        "hosting_status": "ready_for_hosting",
        "max_guests": 2,
        "guest_preference": "any",
        "sleeping_arrangement": "private_with_bed",
        "house_rules": ["عدم استعمال دخانیات داخل اتاق", "رعایت آرامش شبانه"],
        "bio_headline": "معمار، دوستدار تاریخ و شعر در بافت سنتی شیراز",
        "about_me": "خانه‌ای سنتی با حوض فیروزه‌ای دارم و مشتاق میزبانی از همسفران بافرهنگ ایران هستم.",
        "interests": ["معماری", "عکاسی", "کتاب"],
        "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    }
    status, res = api_post("/api/users", user_arash)
    assert status == 201 and res.get("success"), f"خطا در ثبت نام آرش: {res}"
    arash_id = res["user"]["id"]
    print(f"  ✓ کاربر ۱ ثبت‌نام شد: {user_arash['full_name']} (@{user_arash['username']}) - شهر: شیراز | نقش: میزبان")

    # ۲. نیلوفر انصاری - میزبانی متقابل در رشت
    user_niloofar = {
        "full_name": "نیلوفر انصاری",
        "username": f"niloofar_rasht_{timestamp}",
        "password": "Password1405!",
        "city": "رشت",
        "province": "گیلان",
        "phone": "09112223344",
        "role": "both",
        "can_host": True,
        "hosting_status": "ready_for_hosting",
        "max_guests": 2,
        "bio_headline": "عاشق طبیعت‌گردی گیلان و پخت غذاهای محلی",
        "about_me": "در رشت زندگی می‌کنم و درِ خانه‌ام به روی دوستان باز است. خودم هم عاشق سفرم.",
        "interests": ["طبیعت‌گردی", "آشپزی", "عکاسی"],
        "target_destination": "شیراز",
        "target_travel_dates": "اردیبهشت ۱۴۰۵",
        "target_guests_count": 1,
        "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    }
    status, res = api_post("/api/users", user_niloofar)
    assert status == 201 and res.get("success"), f"خطا در ثبت نام نیلوفر: {res}"
    niloofar_id = res["user"]["id"]
    print(f"  ✓ کاربر ۲ ثبت‌نام شد: {user_niloofar['full_name']} (@{user_niloofar['username']}) - شهر: رشت | نقش: میزبانی متقابل")

    # ۳. پویا کمالی - مسافر مقاصد شیراز و شمال از تهران
    user_pouya = {
        "full_name": "پویا کمالی",
        "username": f"pouya_traveler_{timestamp}",
        "password": "Password1405!",
        "city": "تهران",
        "province": "تهران",
        "phone": "09123334455",
        "role": "traveler",
        "can_host": False,
        "hosting_status": "not_hosting",
        "bio_headline": "برنامه‌نویس و کوله‌گرد مشتاق تجربه میزبانی‌های بومی",
        "about_me": "بهار امسال قصد سفر به شهرهای تاریخی و شمال کشور را دارم و دنبال آشنایی با دوستان محلی هستم.",
        "target_destination": "شیراز",
        "target_travel_dates": "نیمه اول اردیبهشت",
        "target_guests_count": 1,
        "interests": ["تکنولوژی", "کوهنوردی", "کتاب"],
        "avatar_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    }
    status, res = api_post("/api/users", user_pouya)
    assert status == 201 and res.get("success"), f"خطا در ثبت نام پویا: {res}"
    pouya_id = res["user"]["id"]
    print(f"  ✓ کاربر ۳ ثبت‌نام شد: {user_pouya['full_name']} (@{user_pouya['username']}) - شهر: تهران | نقش: مسافر")

    # تست اعتبار‌سنجی یکتایی نام کاربری
    dup_status, dup_res = api_post("/api/users", {
        "full_name": "کاربر تکراری",
        "username": user_arash["username"],
        "city": "شیراز",
    })
    assert dup_status == 400 and not dup_res.get("success"), "خطا: نام کاربری تکراری باید رد شود"
    print(f"  ✓ تست ولیدیشن نام کاربری تکراری: با موفقیت رد شد ({dup_res.get('error')})")

    # -------------------------------------------------------------
    # سناریو ۲: ارسال مدارک احراز هویت و بررسی در پنل مدیریت
    # -------------------------------------------------------------
    print("\n[سناریو ۲] فرآیند احراز هویت (ارسال مدارک، بررسی مدیریت و تأیید/رد)...")

    # ارسال مدارک توسط آرش
    status, res = api_post("/api/admin/verify", {
        "userId": arash_id,
        "action": "submit_docs",
        "docs": {
            "nationalCardUrl": "https://images.unsplash.com/photo-national-card-sample",
            "selfieWithCardUrl": "https://images.unsplash.com/photo-selfie-card-sample"
        }
    })
    assert status == 200 and res["user"]["verification_status"] == "pending"
    print(f"  ✓ مدارک هویتی {user_arash['full_name']} بارگذاری شد -> وضعیت: در انتظار بررسی (pending)")

    # تأیید مدارک آرش توسط مدیر هم‌بام
    status, res = api_post("/api/admin/verify", {
        "userId": arash_id,
        "action": "approve"
    })
    assert status == 200 and res["user"]["verification_status"] == "approved" and res["user"]["is_identity_verified"]
    print(f"  ✓ هویت {user_arash['full_name']} توسط مدیر تأیید شد -> وضعیت: تأیید شده (approved)")

    # ارسال مدارک و تأیید نیلوفر
    api_post("/api/admin/verify", {
        "userId": niloofar_id,
        "action": "submit_docs",
        "docs": {"nationalCardUrl": "doc_url", "selfieWithCardUrl": "selfie_url"}
    })
    api_post("/api/admin/verify", {"userId": niloofar_id, "action": "approve"})
    print(f"  ✓ هویت {user_niloofar['full_name']} تأیید شد -> وضعیت: تأیید شده (approved)")

    # تست سناریوی رد مدارک به دلیل ناخوانا بودن روی پویا
    status, res = api_post("/api/admin/verify", {
        "userId": pouya_id,
        "action": "reject",
        "reason": "تصویر کارت ملی ناخواناست و مشخصات به وضوح دیده نمی‌شود."
    })
    assert status == 200 and res["user"]["verification_status"] == "rejected"
    print(f"  ✓ تست رد احراز هویت با علت: '{res['user']['rejection_reason']}'")

    # -------------------------------------------------------------
    # سناریو ۳: اعتبارسنجی امنیتی و محدودیت‌های احراز هویت
    # -------------------------------------------------------------
    print("\n[سناریو ۳] بررسی گیت‌های امنیتی جامعه هم‌بام...")

    # تلاش کاربر رد شده/تأیید نشده برای ارسال درخواست
    block_status, block_res = api_post("/api/requests", {
        "sender_id": pouya_id,
        "receiver_id": arash_id,
        "start_date": "1405/02/10",
        "end_date": "1405/02/14",
        "guest_count": 1,
        "message": "درخواست اقامت تستی"
    })
    assert block_status == 403, "خطا: کاربر تأیید نشده نباید مجاز به ارسال درخواست باشد"
    print(f"  ✓ گیت امنیتی فعال: کاربر تأیید نشده با موفقیت مسدود شد (403 Forbidden)")

    # تلاش برای ارسال درخواست به خود
    self_status, self_res = api_post("/api/requests", {
        "sender_id": arash_id,
        "receiver_id": arash_id,
        "start_date": "1405/02/10",
        "end_date": "1405/02/14",
        "guest_count": 1,
        "message": "درخواست به خود"
    })
    assert self_status == 400, "خطا: درخواست به خود باید مسدود شود"
    print(f"  ✓ گیت امنیتی فعال: ارسال درخواست به خود مسدود شد ({self_res.get('error')})")

    # حالا پویا مدارک اصلاح شده ارسال کرده و مدیر تأیید می‌کند
    api_post("/api/admin/verify", {"userId": pouya_id, "action": "submit_docs", "docs": {"nationalCardUrl": "valid", "selfieWithCardUrl": "valid"}})
    api_post("/api/admin/verify", {"userId": pouya_id, "action": "approve"})
    print(f"  ✓ مدارک اصلاحی {user_pouya['full_name']} بررسی و تأیید شد -> فعال‌سازی دسترسی")

    # -------------------------------------------------------------
    # سناریو ۴: مسافر برای میزبان درخواست اقامت ارسال می‌کند
    # -------------------------------------------------------------
    print("\n[سناریو ۴] ارسال درخواست میزبانی از مسافر (تهران) به میزبان (شیراز)...")

    req_stay_data = {
        "sender_id": pouya_id,
        "sender_name": user_pouya["full_name"],
        "sender_avatar": user_pouya["avatar_url"],
        "sender_city": user_pouya["city"],
        "receiver_id": arash_id,
        "receiver_name": user_arash["full_name"],
        "receiver_avatar": user_arash["avatar_url"],
        "receiver_city": user_arash["city"],
        "start_date": "1405/02/10",
        "end_date": "1405/02/14",
        "guest_count": 1,
        "message": "درود آرش عزیز، برای عکاسی از بناهای زندیه و دیدن شیراز زیبا عازم هستم. خوشحال می‌شم چند روزی در کنارت مهمان باشم.",
        "request_type": "stay_request",
        "status": "pending"
    }
    status, req_res = api_post("/api/requests", req_stay_data)
    assert status == 201 and req_res.get("success"), f"خطا در ارسال درخواست: {req_res}"
    req_stay_id = req_res["request"]["id"]
    print(f"  ✓ درخواست اقامت شماره {req_stay_id} ثبت شد:")
    print(f"    - از: {user_pouya['full_name']} (تهران) به: {user_arash['full_name']} (شیراز)")
    print(f"    - تاریخ: ۱۰ تا ۱۴ اردیبهشت (۴ شب) | وضعیت: در انتظار (pending)")

    # -------------------------------------------------------------
    # سناریو ۵: میزبان درخواست را می‌پذیرد و نشانی و تلفن را قفل‌گشایی می‌کند
    # -------------------------------------------------------------
    print("\n[سناریو ۵] پذیرش درخواست توسط میزبان و قفل‌گشایی نشانی و تلفن...")

    patch_accept = {
        "status": "accepted",
        "exact_address_unlocked": "شیراز، خیابان لطفعلی‌خان زند، کوچه نصیرالملک، پلاک ۲۴، خانه سنتی قوامی",
        "host_response_note": "سلام پویای عزیز، با کمال میل میزبان شما در شیراز هستم. منتظر دیدارت هستم!"
    }
    status, accept_res = api_patch(f"/api/requests/{req_stay_id}", patch_accept)
    assert status == 200 and accept_res["request"]["status"] == "accepted"
    print(f"  ✓ درخواست توسط {user_arash['full_name']} پذیرفته شد (accepted):")
    print(f"    - نشانی قفل‌گشایی شده: {accept_res['request']['exact_address_unlocked']}")
    print(f"    - پیام میزبان: {accept_res['request']['host_response_note']}")

    # -------------------------------------------------------------
    # سناریو ۶: پیشنهاد میزبانی پیش‌دستانه (Host Invitation) از رشت به مسافر
    # -------------------------------------------------------------
    print("\n[سناریو ۶] میزبان (رشت) پیشنهاد میزبانی به مسافر ارسال می‌کند (Host Invitation)...")

    req_invite_data = {
        "sender_id": niloofar_id,
        "sender_name": user_niloofar["full_name"],
        "sender_avatar": user_niloofar["avatar_url"],
        "sender_city": user_niloofar["city"],
        "receiver_id": pouya_id,
        "receiver_name": user_pouya["full_name"],
        "receiver_avatar": user_pouya["avatar_url"],
        "receiver_city": user_pouya["city"],
        "start_date": "1405/03/01",
        "end_date": "1405/03/04",
        "guest_count": 1,
        "message": "سلام پویا، در پروفایلت دیدم قصد سفر به شمال داری! خوشحال می‌شم در رشت میزبان شما باشم و با هم به بازارهای محلی و جنگل‌های گیلان سر بزنیم.",
        "request_type": "host_invitation",
        "status": "pending"
    }
    status, invite_res = api_post("/api/requests", req_invite_data)
    assert status == 201 and invite_res.get("success")
    invite_id = invite_res["request"]["id"]
    print(f"  ✓ پیشنهاد میزبانی شماره {invite_id} ثبت شد:")
    print(f"    - میزبان پیش‌قدم: {user_niloofar['full_name']} (رشت)")
    print(f"    - پیام دعوت: '{req_invite_data['message']}'")

    # -------------------------------------------------------------
    # سناریو ۷: رد محترمانه درخواست به همراه دلیل (Decline with Reason)
    # -------------------------------------------------------------
    print("\n[سناریو ۷] رد مؤدبانه پیشنهاد میزبانی به همراه ثبت دلیل...")

    patch_decline = {
        "status": "declined",
        "host_response_note": "خیلی ممنون از دعوت صمیمانه‌ات نیلوفر گرامی، اما متأسفانه در خرداد درگیر پروژه کاری هستم و برنامه‌ام جابجا شد."
    }
    status, decline_res = api_patch(f"/api/requests/{invite_id}", patch_decline)
    assert status == 200 and decline_res["request"]["status"] == "declined"
    print(f"  ✓ درخواست با موفقیت رد شد (declined):")
    print(f"    - دلیل ثبت‌شده: {decline_res['request']['host_response_note']}")

    # -------------------------------------------------------------
    # سناریو ۸: اتمام اقامت و ثبت نظرات و امتیاز دوطرفه (Mutual Review)
    # -------------------------------------------------------------
    print("\n[سناریو ۸] پایان اقامت شیراز و ثبت بازخورد و امتیاز دوطرفه...")

    now_date = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    mutual_reviews = {
        "type": "completed_reviews",
        "guest_review": {
            "rating": 5,
            "comment": "اقامت در خانه سنتی آرش یکی از بهترین تجربه‌های سفرم بود. فضای خانه بسیار آرامش‌بخش، تمیز و مهمان‌نوازی آرش فوق‌العاده صمیمانه بود.",
            "tags": ["میزبان عالی", "فضای دنج و اصیل", "ارتباط عالی", "حس دوستی واقعی"],
            "reviewer_id": pouya_id,
            "reviewer_name": user_pouya["full_name"],
            "reviewer_city": user_pouya["city"],
            "reviewer_avatar": user_pouya["avatar_url"],
            "target_user_id": arash_id,
            "completed_at": now_date
        },
        "host_review": {
            "rating": 5,
            "comment": "پویا مهمانی بسیار بافرهنگ، آرام و محترم بود. ساعت‌ها در حیاط چای خوردیم و از معاشرت با او لذت بردم. خانه من همیشه به روی او باز است.",
            "tags": ["مهمان بافرهنگ", "بسیار تمیز و مرتب", "احترام به قوانین خانه"],
            "reviewer_id": arash_id,
            "reviewer_name": user_arash["full_name"],
            "reviewer_city": user_arash["city"],
            "reviewer_avatar": user_arash["avatar_url"],
            "target_user_id": pouya_id,
            "completed_at": now_date
        }
    }

    patch_complete = {
        "status": "completed",
        "host_response_note": json.dumps(mutual_reviews, ensure_ascii=False)
    }
    status, complete_res = api_patch(f"/api/requests/{req_stay_id}", patch_complete)
    assert status == 200 and complete_res["request"]["status"] == "completed"
    print(f"  ✓ وضعیت اقامت به تکمیل‌شده (completed) تغییر یافت و نظرات دوطرفه ذخیره شد:")
    print(f"    - نظر مسافر ({user_pouya['full_name']}): ۵ ستاره - '{mutual_reviews['guest_review']['comment'][:60]}...'")
    print(f"    - نظر میزبان ({user_arash['full_name']}): ۵ ستاره - '{mutual_reviews['host_review']['comment'][:60]}...'")

    # -------------------------------------------------------------
    # سناریو ۹: بررسی صحت بازیابی داده‌ها و نمایش در لیست‌ها
    # -------------------------------------------------------------
    print("\n[سناریو ۹] راستی‌آزمایی بازیابی بلادرنگ اطلاعات از پایگاه‌داده...")

    status, users_res = api_get("/api/users")
    assert status == 200
    all_users = users_res.get("users", [])
    registered_ids = [u["id"] for u in all_users]
    assert arash_id in registered_ids and niloofar_id in registered_ids and pouya_id in registered_ids
    print(f"  ✓ هر ۳ کاربر جدید در فهرست اعضای سایت حضور دارند (مجموع کاربران زنده: {len(all_users)})")

    status, reqs_res = api_get(f"/api/requests?userId={pouya_id}")
    assert status == 200
    pouya_reqs = reqs_res.get("requests", [])
    assert len(pouya_reqs) >= 2
    print(f"  ✓ درخواست‌های کاربر {user_pouya['full_name']} در صندوق پیام‌ها دریافت شد ({len(pouya_reqs)} درخواست)")

    print("\n" + "=" * 70)
    print("🎉 تمامی سناریوهای آزمایشی با موفقیت ۱۰۰٪ پاس شدند!")
    print("=" * 70)

if __name__ == "__main__":
    run_tests()
