-- ====================================================================
-- AURA LUXE MOBILE - MASTER DATABASE ARCHITECTURE (POSTGRESQL / SUPABASE)
-- High-Performance Schema, Full-Text Indexes, Triggers, RPCs & RLS Policies
-- Execute in Supabase Dashboard -> SQL Editor
-- ====================================================================

-- --------------------------------------------------------------------
-- 0. EXTENSIONS & SCHEMA PRIVILEGES
-- --------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;

-- --------------------------------------------------------------------
-- 1. UTILITY TRIGGER FUNCTION: AUTOMATIC TIMESTAMPS
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- --------------------------------------------------------------------
-- 2. TABLE: PHONES / LUXURY HARDWARE CATALOG
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.phones (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    model TEXT,
    brand TEXT NOT NULL,
    tagline TEXT,
    category TEXT DEFAULT 'flagship',
    price_fcfa BIGINT NOT NULL CHECK (price_fcfa >= 0),
    original_price_fcfa BIGINT CHECK (original_price_fcfa IS NULL OR original_price_fcfa >= 0),
    rating NUMERIC(3, 1) DEFAULT 4.9 CHECK (rating >= 0 AND rating <= 5.0),
    review_count INTEGER DEFAULT 1 CHECK (review_count >= 0),
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

-- Ensure backwards-compatible column safety:
ALTER TABLE public.phones ADD COLUMN IF NOT EXISTS model TEXT;
ALTER TABLE public.phones ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.phones ADD COLUMN IF NOT EXISTS tagline TEXT;
ALTER TABLE public.phones ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'flagship';
ALTER TABLE public.phones ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT true;
ALTER TABLE public.phones ADD COLUMN IF NOT EXISTS is_bestseller BOOLEAN DEFAULT false;
ALTER TABLE public.phones ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.phones ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 1;
ALTER TABLE public.phones ADD COLUMN IF NOT EXISTS warranty TEXT DEFAULT 'Official Boutique Warranty';
ALTER TABLE public.phones ADD COLUMN IF NOT EXISTS storage_variants JSONB DEFAULT '[]'::JSONB;
ALTER TABLE public.phones ADD COLUMN IF NOT EXISTS color_variants JSONB DEFAULT '[]'::JSONB;
ALTER TABLE public.phones ADD COLUMN IF NOT EXISTS highlights TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE public.phones ADD COLUMN IF NOT EXISTS box_contents TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE public.phones ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Auto-update trigger for phones
DROP TRIGGER IF EXISTS tr_phones_updated_at ON public.phones;
CREATE TRIGGER tr_phones_updated_at
BEFORE UPDATE ON public.phones
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- --------------------------------------------------------------------
-- 3. TABLE: ORDERS & VIP DELIVERY MANIFESTS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    tracking_number TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'placed' CHECK (status IN ('placed', 'confirmed', 'preparing', 'delivering', 'completed', 'cancelled')),
    estimated_delivery TEXT,
    subtotal BIGINT NOT NULL CHECK (subtotal >= 0),
    discount BIGINT DEFAULT 0 CHECK (discount >= 0),
    delivery_fee BIGINT DEFAULT 0 CHECK (delivery_fee >= 0),
    total BIGINT NOT NULL CHECK (total >= 0),
    customer JSONB NOT NULL,
    items JSONB NOT NULL,
    timeline JSONB NOT NULL,
    notes TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Backwards-compatible safety
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Auto-update trigger for orders
DROP TRIGGER IF EXISTS tr_orders_updated_at ON public.orders;
CREATE TRIGGER tr_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- --------------------------------------------------------------------
-- 4. TABLE: TRADE-INS & APPRAISAL PRICE-LOCK VOUCHERS
-- --------------------------------------------------------------------
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
    valuation_fcfa BIGINT NOT NULL CHECK (valuation_fcfa >= 0),
    voucher_code TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'completed', 'rejected')),
    notes TEXT,
    inspected_by TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Backwards-compatible safety
ALTER TABLE public.trade_ins ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.trade_ins ADD COLUMN IF NOT EXISTS inspected_by TEXT;
ALTER TABLE public.trade_ins ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Auto-update trigger for trade_ins
DROP TRIGGER IF EXISTS tr_trade_ins_updated_at ON public.trade_ins;
CREATE TRIGGER tr_trade_ins_updated_at
BEFORE UPDATE ON public.trade_ins
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- --------------------------------------------------------------------
-- 5. TABLE: ADMIN USERS (ROLE-BASED GOVERNANCE)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin')),
    full_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT DEFAULT 'system',
    last_login_at TIMESTAMPTZ
);

-- Ensure initial root super administrator
INSERT INTO public.admin_users (email, role, full_name, created_by)
VALUES ('wisdombesong123@gmail.com', 'super_admin', 'Wisdom Besong (Owner)', 'system')
ON CONFLICT (email) DO UPDATE 
SET role = 'super_admin', full_name = 'Wisdom Besong (Owner)';

-- --------------------------------------------------------------------
-- 6. TABLE: BOUTIQUE SETTINGS (SINGLETON CONFIGURATION)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'default_settings',
    settings JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by TEXT DEFAULT 'admin'
);

-- Auto-update trigger for site_settings
DROP TRIGGER IF EXISTS tr_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER tr_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- --------------------------------------------------------------------
-- 7. TABLE: INVENTORY AUDIT LOGS (STOCK HISTORY & LEDGER)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.inventory_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_id TEXT NOT NULL REFERENCES public.phones(id) ON DELETE CASCADE,
    storage_size TEXT,
    previous_stock INT,
    new_stock INT,
    reason TEXT NOT NULL,
    adjusted_by TEXT DEFAULT 'system',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 8. TABLE: CUSTOMER REVIEWS & RATINGS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customer_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_id TEXT NOT NULL REFERENCES public.phones(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    city TEXT,
    is_verified BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 9. PERFORMANCE INDEXING STRATEGY
-- --------------------------------------------------------------------
-- Phones indexes
CREATE INDEX IF NOT EXISTS idx_phones_slug ON public.phones (slug);
CREATE INDEX IF NOT EXISTS idx_phones_brand ON public.phones (brand);
CREATE INDEX IF NOT EXISTS idx_phones_category ON public.phones (category);
CREATE INDEX IF NOT EXISTS idx_phones_price ON public.phones (price_fcfa);
CREATE INDEX IF NOT EXISTS idx_phones_featured ON public.phones (is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_phones_bestseller ON public.phones (is_bestseller) WHERE is_bestseller = true;
CREATE INDEX IF NOT EXISTS idx_phones_created ON public.phones (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_phones_storage_gin ON public.phones USING GIN (storage_variants);
CREATE INDEX IF NOT EXISTS idx_phones_specs_gin ON public.phones USING GIN (specs);

-- Trigram Fuzzy Full-Text Search Index for Phones
CREATE INDEX IF NOT EXISTS idx_phones_search_trgm ON public.phones USING GIN (
    (name || ' ' || brand || ' ' || COALESCE(tagline, '')) gin_trgm_ops
);

-- Orders indexes
CREATE INDEX IF NOT EXISTS idx_orders_tracking ON public.orders (tracking_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_customer_gin ON public.orders USING GIN (customer);

-- Trade-Ins indexes
CREATE INDEX IF NOT EXISTS idx_tradeins_voucher ON public.trade_ins (voucher_code);
CREATE INDEX IF NOT EXISTS idx_tradeins_phone ON public.trade_ins (phone);
CREATE INDEX IF NOT EXISTS idx_tradeins_status ON public.trade_ins (status);
CREATE INDEX IF NOT EXISTS idx_tradeins_created ON public.trade_ins (created_at DESC);

-- Admin Users indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users (email);

-- Audit & Reviews indexes
CREATE INDEX IF NOT EXISTS idx_audit_phone ON public.inventory_audit_logs (phone_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_phone ON public.customer_reviews (phone_id, created_at DESC);

-- --------------------------------------------------------------------
-- 10. STORED PROCEDURES (SQL RPC FUNCTIONS)
-- --------------------------------------------------------------------

-- RPC 1: Unified Sales & Inventory Analytics in 1 Query
CREATE OR REPLACE FUNCTION public.get_sales_analytics()
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT json_build_object(
        'total_revenue_fcfa', COALESCE((SELECT SUM(total) FROM public.orders), 0),
        'total_orders_count', (SELECT COUNT(*) FROM public.orders),
        'pending_orders_count', (SELECT COUNT(*) FROM public.orders WHERE status IN ('placed', 'confirmed', 'preparing')),
        'completed_orders_count', (SELECT COUNT(*) FROM public.orders WHERE status = 'completed'),
        'total_trade_ins_count', (SELECT COUNT(*) FROM public.trade_ins),
        'pending_trade_ins_count', (SELECT COUNT(*) FROM public.trade_ins WHERE status = 'pending'),
        'total_phones_count', (SELECT COUNT(*) FROM public.phones),
        'generated_at', NOW()
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC 2: Atomic Storage Stock Adjustment (Prevents Race Conditions)
CREATE OR REPLACE FUNCTION public.adjust_storage_stock(
    p_phone_id TEXT,
    p_tier_size TEXT,
    p_quantity_change INT,
    p_reason TEXT DEFAULT 'Checkout stock deduction'
)
RETURNS JSONB AS $$
DECLARE
    v_phone RECORD;
    v_variants JSONB;
    v_updated_variants JSONB := '[]'::JSONB;
    v_item JSONB;
    v_found BOOLEAN := false;
    v_prev_stock INT := 0;
    v_new_stock INT := 0;
BEGIN
    SELECT * INTO v_phone FROM public.phones WHERE id = p_phone_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Phone not found');
    END IF;

    v_variants := v_phone.storage_variants;

    FOR v_item IN SELECT * FROM jsonb_array_elements(v_variants)
    LOOP
        IF (v_item->>'size' = p_tier_size) OR (v_item->>'id' = p_tier_size) THEN
            v_found := true;
            v_prev_stock := COALESCE((v_item->>'stock')::INT, 0);
            v_new_stock := GREATEST(0, v_prev_stock + p_quantity_change);
            v_item := jsonb_set(v_item, '{stock}', to_jsonb(v_new_stock));
        END IF;
        v_updated_variants := v_updated_variants || jsonb_build_array(v_item);
    END LOOP;

    IF NOT v_found THEN
        RETURN json_build_object('success', false, 'error', 'Storage tier not found');
    END IF;

    UPDATE public.phones
    SET storage_variants = v_updated_variants, updated_at = NOW()
    WHERE id = p_phone_id;

    -- Record audit log
    INSERT INTO public.inventory_audit_logs (phone_id, storage_size, previous_stock, new_stock, reason)
    VALUES (p_phone_id, p_tier_size, v_prev_stock, v_new_stock, p_reason);

    RETURN json_build_object(
        'success', true,
        'phone_id', p_phone_id,
        'tier_size', p_tier_size,
        'previous_stock', v_prev_stock,
        'new_stock', v_new_stock
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC 3: Safe Fast Order Tracking Lookup
CREATE OR REPLACE FUNCTION public.get_order_by_tracking(p_tracking_number TEXT)
RETURNS JSONB AS $$
DECLARE
    v_order RECORD;
BEGIN
    SELECT * INTO v_order 
    FROM public.orders 
    WHERE tracking_number = TRIM(p_tracking_number) OR id = TRIM(p_tracking_number)
    LIMIT 1;

    IF NOT FOUND THEN
        RETURN NULL;
    END IF;

    RETURN to_jsonb(v_order);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC 4: Safe Voucher Verification Lookup
CREATE OR REPLACE FUNCTION public.lookup_trade_in_voucher(p_voucher_code TEXT)
RETURNS JSONB AS $$
DECLARE
    v_trade RECORD;
BEGIN
    SELECT * INTO v_trade 
    FROM public.trade_ins 
    WHERE voucher_code = UPPER(TRIM(p_voucher_code))
    LIMIT 1;

    IF NOT FOUND THEN
        RETURN NULL;
    END IF;

    RETURN to_jsonb(v_trade);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- --------------------------------------------------------------------
-- 11. ROW LEVEL SECURITY (RLS) & ACCESS CONTROL
-- --------------------------------------------------------------------
ALTER TABLE public.phones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_reviews ENABLE ROW LEVEL SECURITY;

-- Grant broad table privileges to standard roles
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- Drop old policies to ensure clean idempotent state
DROP POLICY IF EXISTS "Allow all on phones" ON public.phones;
DROP POLICY IF EXISTS "Allow all on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow all on trade_ins" ON public.trade_ins;
DROP POLICY IF EXISTS "Allow all on admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Allow all on site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Allow all on inventory_audit_logs" ON public.inventory_audit_logs;
DROP POLICY IF EXISTS "Allow all on customer_reviews" ON public.customer_reviews;

-- Create production policies
CREATE POLICY "Allow all on phones" ON public.phones FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on trade_ins" ON public.trade_ins FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on admin_users" ON public.admin_users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on site_settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on inventory_audit_logs" ON public.inventory_audit_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on customer_reviews" ON public.customer_reviews FOR ALL USING (true) WITH CHECK (true);

-- --------------------------------------------------------------------
-- 12. REAL-TIME SUBSCRIPTION ENABLEMENT
-- --------------------------------------------------------------------
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'orders'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'phones'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.phones;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'trade_ins'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.trade_ins;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        NULL; -- Continue gracefully if publication is managed externally
END $$;
