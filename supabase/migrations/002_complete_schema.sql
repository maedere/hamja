-- ==============================================================================
-- هم‌بام (Hambam) - Persian Social Travel and Mutual Hosting Platform
-- Complete PostgreSQL Schema for Supabase
-- ==============================================================================

-- 1. Profiles Table (All User & Host Details)
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    phone TEXT,
    instagram TEXT,
    city TEXT NOT NULL,
    province TEXT,
    age INT,
    job_education TEXT,
    role TEXT DEFAULT 'both' NOT NULL,
    can_host BOOLEAN DEFAULT TRUE,
    hosting_status TEXT DEFAULT 'ready_for_hosting' NOT NULL,
    max_guests INT DEFAULT 2,
    guest_preference TEXT DEFAULT 'any',
    sleeping_arrangement TEXT DEFAULT 'private_with_bed',
    house_rules TEXT[] DEFAULT '{}',
    target_destination TEXT,
    target_travel_dates TEXT,
    target_guests_count INT,
    bio_headline TEXT,
    about_me TEXT,
    interests TEXT[] DEFAULT '{}',
    languages TEXT[] DEFAULT '{"فارسی (زبان مادری)"}',
    favorite_destinations TEXT[] DEFAULT '{}',
    agreed_to_provide_id BOOLEAN DEFAULT TRUE,
    agreed_to_respect_house_rules BOOLEAN DEFAULT TRUE,
    agreed_to_hamja_terms BOOLEAN DEFAULT TRUE,
    username TEXT UNIQUE,
    password TEXT,
    verification_status TEXT DEFAULT 'unverified' NOT NULL,
    is_identity_verified BOOLEAN DEFAULT FALSE,
    rejection_reason TEXT,
    verification_docs JSONB,
    member_since_year TEXT DEFAULT '۱۴۰۵',
    response_rate_percent INT DEFAULT 100,
    hosting_count INT DEFAULT 0,
    last_active TEXT DEFAULT 'همین الان',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Hosting Requests Table
CREATE TABLE IF NOT EXISTS public.hosting_requests (
    id TEXT PRIMARY KEY,
    sender_id TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    sender_avatar TEXT,
    sender_city TEXT,
    receiver_id TEXT NOT NULL,
    receiver_name TEXT NOT NULL,
    receiver_avatar TEXT,
    receiver_city TEXT,
    listing_id TEXT,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    guest_count INT NOT NULL DEFAULT 1,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL,
    request_type TEXT DEFAULT 'stay_request' NOT NULL,
    host_response_note TEXT,
    exact_address_unlocked TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hosting_requests ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert profiles"
ON public.profiles FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update profiles"
ON public.profiles FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete profiles"
ON public.profiles FOR DELETE
USING (true);

-- Requests Policies
CREATE POLICY "Hosting requests viewable by all"
ON public.hosting_requests FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert hosting requests"
ON public.hosting_requests FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update hosting requests"
ON public.hosting_requests FOR UPDATE
USING (true);

-- 4. Grant table privileges to Supabase roles
GRANT ALL ON TABLE public.profiles TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.hosting_requests TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
