-- ==============================================================================
-- هم‌بام (Hambam) - Persian Social Travel and Mutual Hosting Platform
-- Supabase PostgreSQL Schema & Row Level Security (RLS)
-- ==============================================================================

-- 1. Create Enums
CREATE TYPE user_role AS ENUM ('traveler', 'host', 'both');
CREATE TYPE hosting_status AS ENUM ('ready_for_hosting', 'not_hosting', 'traveling');
CREATE TYPE room_type AS ENUM ('private_room', 'shared_room', 'entire_place', 'couch');
CREATE TYPE request_status AS ENUM ('pending', 'accepted', 'declined', 'canceled', 'completed');
CREATE TYPE verification_status AS ENUM ('unverified', 'pending', 'approved', 'rejected');

-- 2. Profiles Table (Extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    city TEXT NOT NULL,
    province TEXT,
    role user_role DEFAULT 'both' NOT NULL,
    hosting_status hosting_status DEFAULT 'ready_for_hosting' NOT NULL,
    bio_headline TEXT,
    about_me TEXT,
    interests TEXT[] DEFAULT '{}',
    languages TEXT[] DEFAULT '{"فارسی (زبان مادری)"}',
    favorite_destinations TEXT[] DEFAULT '{}',
    response_rate_percent INT DEFAULT 98,
    hosting_count INT DEFAULT 0,
    is_identity_verified BOOLEAN DEFAULT FALSE,
    verification_status verification_status DEFAULT 'unverified',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Identity Verification Table (Secure & Isolated)
CREATE TABLE IF NOT EXISTS public.identity_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    national_id_hash TEXT,
    national_card_image_path TEXT,
    selfie_image_path TEXT,
    status verification_status DEFAULT 'pending' NOT NULL,
    rejection_reason TEXT,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Home Listings Table
CREATE TABLE IF NOT EXISTS public.home_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    host_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    room_type room_type NOT NULL DEFAULT 'private_room',
    capacity INT NOT NULL DEFAULT 1,
    amenities TEXT[] DEFAULT '{}',
    house_rules TEXT,
    neighborhood_name TEXT,
    exact_address TEXT NOT NULL,
    photos TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Hosting Requests Table
CREATE TABLE IF NOT EXISTS public.hosting_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES public.home_listings(id) ON DELETE SET NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    guest_count INT NOT NULL DEFAULT 1,
    message TEXT NOT NULL,
    status request_status DEFAULT 'pending' NOT NULL,
    host_response_note TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT check_different_users CHECK (sender_id != receiver_id),
    CONSTRAINT check_dates CHECK (end_date >= start_date)
);

-- 6. Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES public.hosting_requests(id) ON DELETE SET NULL,
    reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reviewee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    stay_date_label TEXT,
    is_verified_experience BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.identity_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hosting_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- Identity Verifications Policies (Strict Privacy)
CREATE POLICY "Users can view their own verification record"
ON public.identity_verifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own verification record"
ON public.identity_verifications FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Home Listings Policies
CREATE POLICY "Active listings are viewable by everyone without exact address"
ON public.home_listings FOR SELECT
USING (is_active = true);

CREATE POLICY "Hosts can manage their own listing"
ON public.home_listings FOR ALL
USING (auth.uid() = host_id);

-- Hosting Requests Policies
CREATE POLICY "Participants can view their requests"
ON public.hosting_requests FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Authenticated users can create requests"
ON public.hosting_requests FOR INSERT
WITH CHECK (auth.uid() = sender_id AND sender_id != receiver_id);

CREATE POLICY "Participants can update their requests"
ON public.hosting_requests FOR UPDATE
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Reviews Policies
CREATE POLICY "Reviews are viewable by everyone"
ON public.reviews FOR SELECT
USING (true);

CREATE POLICY "Reviewers can insert review for valid stay"
ON public.reviews FOR INSERT
WITH CHECK (auth.uid() = reviewer_id);

-- ==============================================================================
-- Function to trigger on Auth Signup: auto-creates public.profiles record
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url, city, role)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', 'عضو جدید هم‌بام'),
        COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
        COALESCE(new.raw_user_meta_data->>'city', 'تهران'),
        'both'
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
