-- ==========================================
-- 1. CREATE AI GATEWAY LOGS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS public.ai_gateway_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE SET NULL,
    provider VARCHAR(100) NOT NULL,
    model_name VARCHAR(255) NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    prompt_tokens INT DEFAULT 0,
    completion_tokens INT DEFAULT 0,
    total_tokens INT DEFAULT 0,
    latency_ms INT NOT NULL,
    status_code INT NOT NULL,
    is_success BOOLEAN DEFAULT TRUE,
    error_message TEXT DEFAULT NULL,
    error_code VARCHAR(100) DEFAULT NULL,
    request_metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- ==========================================
-- 2. CREATE SYSTEM INDEXES FOR TELEMETRY
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_ai_gateway_logs_user_id ON public.ai_gateway_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_gateway_logs_provider_model ON public.ai_gateway_logs(provider, model_name);
CREATE INDEX IF NOT EXISTS idx_ai_gateway_logs_created_at ON public.ai_gateway_logs(created_at DESC);


-- ==========================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- ==========================================

ALTER TABLE public.ai_gateway_logs ENABLE ROW LEVEL SECURITY;


-- ==========================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

CREATE POLICY "Users can view own gateway logs" ON public.ai_gateway_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own gateway logs" ON public.ai_gateway_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);
