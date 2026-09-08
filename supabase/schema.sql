-- ==========================================================
-- AURA LUXE MOBILE - SUPABASE DATABASE SCHEMA
-- Run this in your Supabase Dashboard -> SQL Editor
-- ==========================================================

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
    warranty TEXT DEFAULT '12 Months Official Boutique Warranty',
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

-- Ensure all columns exist if table was already created previously:
ALTER TABLE public.phones ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.phones ADD COLUMN IF NOT EXISTS tagline TEXT;
ALTER TABLE public.phones ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'flagship';
ALTER TABLE public.phones ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT true;
ALTER TABLE public.phones ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 1;
ALTER TABLE public.phones ADD COLUMN IF NOT EXISTS warranty TEXT DEFAULT '12 Months Official Boutique Warranty';
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

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.phones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_ins ENABLE ROW LEVEL SECURITY;

-- POLICIES:
DROP POLICY IF EXISTS "Public can view phones" ON public.phones;
CREATE POLICY "Public can view phones" ON public.phones FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow manage phones" ON public.phones;
CREATE POLICY "Allow manage phones" ON public.phones FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow read orders" ON public.orders;
CREATE POLICY "Allow read orders" ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow create orders" ON public.orders;
CREATE POLICY "Allow create orders" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update orders" ON public.orders;
CREATE POLICY "Allow update orders" ON public.orders FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow manage trade_ins" ON public.trade_ins;
CREATE POLICY "Allow manage trade_ins" ON public.trade_ins FOR ALL USING (true);
