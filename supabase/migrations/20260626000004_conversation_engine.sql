-- ==========================================
-- 1. EXTEND CONVERSATIONS & MESSAGES TABLES
-- ==========================================

-- Alter conversations table to support folder mappings and soft deletes
ALTER TABLE public.conversations 
ADD COLUMN IF NOT EXISTS folder_id UUID,
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Alter messages table to support message states, metadata, and drafts
ALTER TABLE public.messages
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'sent' CHECK (status IN ('draft', 'sending', 'sent', 'error')),
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS is_draft BOOLEAN DEFAULT FALSE;


-- ==========================================
-- 2. CREATE NEW WORKSPACE/CONVERSATION TABLES
-- ==========================================

-- CONVERSATION FOLDERS
CREATE TABLE IF NOT EXISTS public.conversation_folders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(50) DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- CONVERSATION TAGS
CREATE TABLE IF NOT EXISTS public.conversation_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(50) DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, name)
);

-- CONVERSATION TAG RELATIONS (Join Table)
CREATE TABLE IF NOT EXISTS public.conversation_tag_relations (
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES public.conversation_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (conversation_id, tag_id)
);

-- CONVERSATION FAVORITES
CREATE TABLE IF NOT EXISTS public.conversation_favorites (
    conversation_id UUID PRIMARY KEY REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- CONVERSATION ARCHIVES
CREATE TABLE IF NOT EXISTS public.conversation_archives (
    conversation_id UUID PRIMARY KEY REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- ==========================================
-- 3. DEFINE RELATIONSHIPS & CONSTRAINTS
-- ==========================================

-- Add folder foreign key constraint on conversations
ALTER TABLE public.conversations
DROP CONSTRAINT IF EXISTS fk_conversations_folder_id,
ADD CONSTRAINT fk_conversations_folder_id FOREIGN KEY (folder_id) REFERENCES public.conversation_folders(id) ON DELETE SET NULL;


-- ==========================================
-- 4. CREATE SYSTEM INDEXES FOR SEARCH & JOINS
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_conversations_folder_id ON public.conversations(folder_id);
CREATE INDEX IF NOT EXISTS idx_conversations_is_deleted ON public.conversations(is_deleted);
CREATE INDEX IF NOT EXISTS idx_conversation_folders_user_id ON public.conversation_folders(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_tags_user_id ON public.conversation_tags(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_tag_relations_conv_id ON public.conversation_tag_relations(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_favorites_user_id ON public.conversation_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_archives_user_id ON public.conversation_archives(user_id);


-- ==========================================
-- 5. ENABLE ROW LEVEL SECURITY (RLS)
-- ==========================================

ALTER TABLE public.conversation_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_tag_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_archives ENABLE ROW LEVEL SECURITY;


-- ==========================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- 6.1. Conversation Folders Policies
CREATE POLICY "Users can manage own folders" ON public.conversation_folders
    FOR ALL USING (auth.uid() = user_id);

-- 6.2. Conversation Tags Policies
CREATE POLICY "Users can manage own tags" ON public.conversation_tags
    FOR ALL USING (auth.uid() = user_id);

-- 6.3. Conversation Tag Relations Policies
CREATE POLICY "Users can manage tag relations if owning conversation" ON public.conversation_tag_relations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.conversations
            WHERE conversations.id = conversation_tag_relations.conversation_id
            AND conversations.user_id = auth.uid()
        )
    );

-- 6.4. Conversation Favorites Policies
CREATE POLICY "Users can manage own favorites" ON public.conversation_favorites
    FOR ALL USING (auth.uid() = user_id);

-- 6.5. Conversation Archives Policies
CREATE POLICY "Users can manage own archives" ON public.conversation_archives
    FOR ALL USING (auth.uid() = user_id);
