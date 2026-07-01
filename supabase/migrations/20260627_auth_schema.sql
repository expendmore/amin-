-- Enable multi-tenant policies for database tables
ALTER TABLE IF EXISTS sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ai_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS files ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS audit_logs ENABLE ROW LEVEL SECURITY;

-- Sessions policies
CREATE POLICY session_isolation_policy ON sessions
  FOR ALL
  USING (
    user_id = auth.uid()
  );

-- API Keys policies
CREATE POLICY apikey_isolation_policy ON api_keys
  FOR ALL
  USING (
    workspace_id IN (
      SELECT w.id FROM workspaces w
      JOIN users u ON w.organization_id = u.organization_id
      WHERE u.id = auth.uid()
    )
  );

-- AI Chats RLS
CREATE POLICY chat_isolation_policy ON ai_chats
  FOR ALL
  USING (
    workspace_id IN (
      SELECT w.id FROM workspaces w
      JOIN users u ON w.organization_id = u.organization_id
      WHERE u.id = auth.uid()
    )
  );

-- Folders RLS
CREATE POLICY folder_isolation_policy ON folders
  FOR ALL
  USING (
    workspace_id IN (
      SELECT w.id FROM workspaces w
      JOIN users u ON w.organization_id = u.organization_id
      WHERE u.id = auth.uid()
    )
  );
