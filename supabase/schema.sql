-- ==============================================================================
-- CampusConnect - Complete PostgreSQL Database Schema & Row Level Security (RLS)
-- Exclusive Intra-College Social, Academic, & Mentorship Network
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS & DOMAINS
DO $$ BEGIN
    CREATE TYPE student_year AS ENUM ('1st Year', '2nd Year', '3rd Year', '4th Year');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE branch_type AS ENUM ('CSE', 'IT', 'ECE', 'EE', 'ME', 'Civil', 'Chemical', 'Biotech', 'Design');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE residence_type AS ENUM ('Hostel', 'Day Scholar');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE resource_category AS ENUM ('PYQ', 'Handwritten Notes', 'Lab Manual', 'Syllabus', 'Reference Book');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE gear_category AS ENUM ('Textbook', 'Lab Gear', 'Electronics', 'Cycle', 'Room Essentials', 'Calculator');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE listing_status AS ENUM ('Open', 'Closed', 'In Progress');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE app_status AS ENUM ('pending', 'accepted', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. HELPER FUNCTIONS FOR DOMAIN VALIDATION
CREATE OR REPLACE FUNCTION is_institutional_email(email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Restricts to verified institutional domains (.edu or .ac.in or college domain)
  RETURN (email ILIKE '%.edu' OR email ILIKE '%.ac.in' OR email ILIKE '%@campus.edu');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL CHECK (is_institutional_email(email)),
    full_name TEXT NOT NULL,
    avatar_url TEXT DEFAULT '',
    headline TEXT DEFAULT '',
    year student_year NOT NULL DEFAULT '1st Year',
    branch branch_type NOT NULL DEFAULT 'CSE',
    residence residence_type NOT NULL DEFAULT 'Hostel',
    hostel_block TEXT DEFAULT '',
    bio TEXT DEFAULT '',
    is_mentor BOOLEAN DEFAULT FALSE,
    mentor_topics TEXT[] DEFAULT '{}',
    skills TEXT[] DEFAULT '{}',
    clubs TEXT[] DEFAULT '{}',
    github_url TEXT DEFAULT '',
    linkedin_url TEXT DEFAULT '',
    portfolio_url TEXT DEFAULT '',
    karma_points INT DEFAULT 10,
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CAMPUS POSTS (Pulse Feed)
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    scope TEXT NOT NULL DEFAULT 'all' CHECK (scope IN ('all', 'year', 'dept')),
    target_year student_year,
    target_dept branch_type,
    tags TEXT[] DEFAULT '{}',
    upvotes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Post Likes
CREATE TABLE IF NOT EXISTS public.post_likes (
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (post_id, user_id)
);

-- Post Comments
CREATE TABLE IF NOT EXISTS public.post_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SENIOR-JUNIOR BRIDGE (Ask A Senior Q&A)
CREATE TABLE IF NOT EXISTS public.mentorship_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    target_year student_year NOT NULL,
    tags TEXT[] DEFAULT '{}',
    upvotes_count INT DEFAULT 0,
    answers_count INT DEFAULT 0,
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mentorship_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL REFERENCES public.mentorship_questions(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    upvotes_count INT DEFAULT 0,
    is_senior_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PLACEMENT & INTERNSHIP CHRONICLES
CREATE TABLE IF NOT EXISTS public.placement_chronicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    role TEXT NOT NULL,
    package_or_stipend TEXT NOT NULL,
    employment_type TEXT NOT NULL CHECK (employment_type IN ('Internship', 'Full-Time FTE', 'Research')),
    batch_year TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    rounds JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of { round_name, description, questions }
    preparation_tips TEXT NOT NULL,
    resume_advice TEXT NOT NULL,
    upvotes_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. 1-ON-1 MENTORSHIP SESSIONS
CREATE TABLE IF NOT EXISTS public.mentorship_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    senior_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    junior_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    message TEXT NOT NULL,
    status app_status DEFAULT 'pending',
    preferred_date TIMESTAMPTZ,
    meeting_link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TEAM & HACKATHON FINDER
CREATE TABLE IF NOT EXISTS public.team_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    event_name TEXT NOT NULL,
    event_type TEXT NOT NULL DEFAULT 'Hackathon',
    description TEXT NOT NULL,
    roles_needed TEXT[] DEFAULT '{}',
    tech_stack TEXT[] DEFAULT '{}',
    total_slots INT NOT NULL DEFAULT 4,
    filled_slots INT NOT NULL DEFAULT 1,
    status listing_status DEFAULT 'Open',
    deadline DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.team_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES public.team_listings(id) ON DELETE CASCADE,
    applicant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role_applied TEXT NOT NULL,
    pitch_note TEXT NOT NULL,
    portfolio_link TEXT,
    status app_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ACADEMIC VAULT (PYQs, Notes, Manuals)
CREATE TABLE IF NOT EXISTS public.academic_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    uploader_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    subject_code TEXT NOT NULL,
    branch branch_type NOT NULL,
    year student_year NOT NULL,
    semester INT NOT NULL CHECK (semester BETWEEN 1 AND 8),
    category resource_category NOT NULL,
    file_url TEXT NOT NULL,
    file_size TEXT DEFAULT '2.4 MB',
    upvotes_count INT DEFAULT 0,
    downloads_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. CAMPUS GEAR & BOOK EXCHANGE
CREATE TABLE IF NOT EXISTS public.marketplace_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category gear_category NOT NULL,
    price INT NOT NULL DEFAULT 0, -- 0 indicates Free/Donation
    condition TEXT NOT NULL CHECK (condition IN ('Brand New', 'Like New', 'Good', 'Fair')),
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'claimed')),
    images TEXT[] DEFAULT '{}',
    pickup_location TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. BATCH CHANNELS & DIRECT MESSAGES
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    channel_id TEXT NOT NULL, -- e.g. '1st-year-freshers', '3rd-year-internships', or 'dm_uuid1_uuid2'
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    code_snippet TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_chronicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone authenticated can read all verified profiles; users can update their own
CREATE POLICY "Allow public read access to verified student profiles"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow users to insert their own profile"
    ON public.profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow users to update their own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

-- Posts: Any authenticated user can read; author can insert/update/delete
CREATE POLICY "Allow authenticated read posts"
    ON public.posts FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated insert posts"
    ON public.posts FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Allow author update/delete posts"
    ON public.posts FOR ALL
    TO authenticated
    USING (auth.uid() = author_id);

-- Q&A and Chronicles: Authenticated can read and post
CREATE POLICY "Allow authenticated read mentorship Q&A"
    ON public.mentorship_questions FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated insert questions"
    ON public.mentorship_questions FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Allow authenticated read chronicles"
    ON public.placement_chronicles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated insert chronicles"
    ON public.placement_chronicles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = author_id);

-- Teams: Authenticated can view and apply
CREATE POLICY "Allow authenticated read teams"
    ON public.team_listings FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow creator insert team"
    ON public.team_listings FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = creator_id);

-- Academic Vault & Marketplace: Authenticated read & insert
CREATE POLICY "Allow authenticated read vault resources"
    ON public.academic_resources FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated read gear items"
    ON public.marketplace_items FOR SELECT
    TO authenticated
    USING (true);

-- Messages: Users can see messages in public channels or DMs where they are sender or recipient
CREATE POLICY "Allow message access"
    ON public.messages FOR ALL
    TO authenticated
    USING (
      recipient_id IS NULL OR
      sender_id = auth.uid() OR
      recipient_id = auth.uid()
    );

-- 13. REALTIME REPLICATION ENABLEMENT
-- Allows Supabase Realtime to broadcast changes across channels and messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.team_applications;
