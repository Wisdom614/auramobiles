-- ==========================================================
-- AURA LUXE MOBILE - SUPABASE DATABASE SCHEMA & GRANTS
-- Run this in your Supabase Dashboard -> SQL Editor
-- ==========================================================

-- 0. GRANT ESSENTIAL SCHEMA USAGE & TABLE PRIVILEGES
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;

-- 1. PHONES / INVENTORY TABLE
CREATE TABLE IF NOT EXISTS public.phones (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    tagline TEXT,
    category TEXT DEFAULT 'flagship',
    price_fcfa BIGINT NOT NULL,
    original_price_fcfa BIGINT,
    rating NUMERIC(3, 1) DEFAULT 4.9,
    review_count INTEGER DEFAULT 1,
    is_new BOOLEAN DEFAULT true,
    is_bestseller BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    condition TEXT NOT NULL DEFAULT 'Brand New',
    warranty TEXT DEFAULT 'Official Boutique Warranty',
    storage_variants JSONB DEFAULT '[]'::JSONB,
    color_variants JSONB DEFAULT '[]'::JSONB,
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    thumbnail TEXT NOT NULL,
    specs JSONB DEFAULT '{}'::JSONB,
    highlights TEXT[] DEFAULT ARRAY[]::TEXT[],
    box_contents TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all columns exist if table was previously created:
ALTER TABLE public.phones ALTER COLUMN model DROP NOT NULL;
ALTER TABLE public.phones ADD COLUMN IF NOT EXISTS model TEXT;
ALTER TABLE public.phones ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.phones ADD COLUMN IF NOT EXISTS tagline TEXT;
ALTER TABLE public.phones ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'flagship';
ALTER TABLE public.phones ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT true;
ALTER TABLE public.phones ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 1;
ALTER TABLE public.phones ADD COLUMN IF NOT EXISTS warranty TEXT DEFAULT 'Official Boutique Warranty';
ALTER TABLE public.phones ADD COLUMN IF NOT EXISTS storage_variants JSONB DEFAULT '[]'::JSONB;
ALTER TABLE public.phones ADD COLUMN IF NOT EXISTS color_variants JSONB DEFAULT '[]'::JSONB;
ALTER TABLE public.phones ADD COLUMN IF NOT EXISTS highlights TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE public.phones ADD COLUMN IF NOT EXISTS box_contents TEXT[] DEFAULT ARRAY[]::TEXT[];

-- 2. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    tracking_number TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'placed',
    estimated_delivery TEXT,
    subtotal BIGINT NOT NULL,
    discount BIGINT DEFAULT 0,
    delivery_fee BIGINT DEFAULT 0,
    total BIGINT NOT NULL,
    customer JSONB NOT NULL,
    items JSONB NOT NULL,
    timeline JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TRADE-IN APPRAISALS TABLE
CREATE TABLE IF NOT EXISTS public.trade_ins (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    client_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    city TEXT NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    storage TEXT NOT NULL,
    condition TEXT NOT NULL,
    valuation_fcfa BIGINT NOT NULL,
    voucher_code TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    notes TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ADMIN USERS TABLE (ROLE-BASED AUTHORIZATION)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    full_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT DEFAULT 'system'
);

-- Seed Primary Super Admin: wisdombesong123@gmail.com
INSERT INTO public.admin_users (email, role, full_name, created_by)
VALUES ('wisdombesong123@gmail.com', 'super_admin', 'Wisdom Besong', 'system')
ON CONFLICT (email) DO NOTHING;

-- 5. SITE SETTINGS TABLE (DYNAMIC BOUTIQUE CONFIGURATION)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'default_settings',
    settings JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by TEXT DEFAULT 'admin'
);

-- GRANT PRIVILEGES ON SPECIFIC TABLES
GRANT ALL ON TABLE public.phones TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.orders TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.trade_ins TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.admin_users TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.site_settings TO postgres, anon, authenticated, service_role;

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.phones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- POLICIES:
DROP POLICY IF EXISTS "Allow all on phones" ON public.phones;
CREATE POLICY "Allow all on phones" ON public.phones FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on orders" ON public.orders;
CREATE POLICY "Allow all on orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on trade_ins" ON public.trade_ins;
CREATE POLICY "Allow all on trade_ins" ON public.trade_ins FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on admin_users" ON public.admin_users;
CREATE POLICY "Allow all on admin_users" ON public.admin_users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on site_settings" ON public.site_settings;
CREATE POLICY "Allow all on site_settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);


