-- ==========================================
-- 1. CREATE WHATSAPP ACCOUNTS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS public.whatsapp_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    phone_number_id VARCHAR(100) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'CONNECTED' CHECK (status IN ('CONNECTED', 'DISCONNECTED', 'SUSPENDED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- ==========================================
-- 2. CREATE WHATSAPP TEMPLATES TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS public.whatsapp_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- e.g. 'Marketing', 'Utility'
    status VARCHAR(50) DEFAULT 'APPROVED' CHECK (status IN ('APPROVED', 'PENDING', 'REJECTED')),
    body_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- ==========================================
-- 3. CREATE SYSTEM INDEXES
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_whatsapp_accounts_user_id ON public.whatsapp_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_templates_user_id ON public.whatsapp_templates(user_id);


-- ==========================================
-- 4. ENABLE ROW LEVEL SECURITY (RLS)
-- ==========================================

ALTER TABLE public.whatsapp_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_templates ENABLE ROW LEVEL SECURITY;


-- ==========================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- 5.1. Accounts Policies
CREATE POLICY "Users can manage own WhatsApp accounts" ON public.whatsapp_accounts
    FOR ALL USING (auth.uid() = user_id);

-- 5.2. Templates Policies
CREATE POLICY "Users can manage own WhatsApp templates" ON public.whatsapp_templates
    FOR ALL USING (auth.uid() = user_id);
