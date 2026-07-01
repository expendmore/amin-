import { pgTable, text, timestamp, integer, boolean, real, pgEnum, index } from "drizzle-orm/pg-core";

export const roleTypeEnum = pgEnum("role_type", ["SUPER_ADMIN", "ORG_ADMIN", "MEMBER", "GUEST"]);
export const severityEnum = pgEnum("severity", ["CRITICAL", "HIGH", "MEDIUM", "LOW"]);
export const statusEnum = pgEnum("status", ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]);

// Users table
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
  organizationId: text("organization_id"),
}, (table) => {
  return {
    emailIdx: index("users_email_idx").on(table.email),
  };
});

// Organizations
export const organizations = pgTable("organizations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

// Workspaces
export const workspaces = pgTable("workspaces", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  organizationId: text("organization_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
}, (table) => {
  return {
    orgIdx: index("workspaces_org_idx").on(table.organizationId),
  };
});

// Sessions
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    userIdx: index("sessions_user_idx").on(table.userId),
  };
});

// API Keys
export const apiKeys = pgTable("api_keys", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull(),
  name: text("name").notNull(),
  secretValue: text("secret_value").notNull().unique(),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    workspaceIdx: index("api_keys_workspace_idx").on(table.workspaceId),
  };
});

// AI Chats
export const aiChats = pgTable("ai_chats", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    workspaceIdx: index("ai_chats_workspace_idx").on(table.workspaceId),
  };
});

// AI Messages
export const aiMessages = pgTable("ai_messages", {
  id: text("id").primaryKey(),
  chatId: text("chat_id").notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    chatIdx: index("ai_messages_chat_idx").on(table.chatId),
  };
});

// AI Agents
export const aiAgents = pgTable("ai_agents", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull(),
  name: text("name").notNull(),
  modelName: text("model_name").notNull(),
  temperature: real("temperature").default(0.7).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    workspaceIdx: index("ai_agents_workspace_idx").on(table.workspaceId),
  };
});

// Knowledge Bases
export const knowledgeBases = pgTable("knowledge_bases", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    workspaceIdx: index("knowledge_bases_workspace_idx").on(table.workspaceId),
  };
});

// Documents
export const documents = pgTable("documents", {
  id: text("id").primaryKey(),
  knowledgeBaseId: text("knowledge_base_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    kbIdx: index("documents_kb_idx").on(table.knowledgeBaseId),
  };
});

// Workflows
export const workflows = pgTable("workflows", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull(),
  name: text("name").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    workspaceIdx: index("workflows_workspace_idx").on(table.workspaceId),
  };
});

// Workflow Executions
export const workflowExecutions = pgTable("workflow_executions", {
  id: text("id").primaryKey(),
  workflowId: text("workflow_id").notNull(),
  status: text("status").notNull(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
}, (table) => {
  return {
    wfIdx: index("workflow_executions_wf_idx").on(table.workflowId),
  };
});

// WhatsApp Accounts
export const whatsappAccounts = pgTable("whatsapp_accounts", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull(),
  phoneNumber: text("phone_number").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    workspaceIdx: index("whatsapp_accounts_workspace_idx").on(table.workspaceId),
  };
});

// WhatsApp Messages
export const whatsappMessages = pgTable("whatsapp_messages", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  direction: text("direction").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    acctIdx: index("whatsapp_messages_acct_idx").on(table.accountId),
  };
});

// CRM Contacts
export const crmContacts = pgTable("crm_contacts", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull(),
  name: text("name").notNull(),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    workspaceIdx: index("crm_contacts_workspace_idx").on(table.workspaceId),
  };
});

// Folders
export const folders = pgTable("folders", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    workspaceIdx: index("folders_workspace_idx").on(table.workspaceId),
  };
});

// Files
export const files = pgTable("files", {
  id: text("id").primaryKey(),
  folderId: text("folder_id").notNull(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    folderIdx: index("files_folder_idx").on(table.folderId),
  };
});

// Orders
export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull(),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    workspaceIdx: index("orders_workspace_idx").on(table.workspaceId),
  };
});

// Subscriptions
export const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull(),
  planTier: text("plan_tier").notNull(),
  status: text("status").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    orgIdx: index("subscriptions_org_idx").on(table.organizationId),
  };
});

// Invoices
export const invoices = pgTable("invoices", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull(),
  amount: integer("amount").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    orgIdx: index("invoices_org_idx").on(table.organizationId),
  };
});

// Notifications
export const notifications = pgTable("notifications", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    workspaceIdx: index("notifications_workspace_idx").on(table.workspaceId),
  };
});

// Audit Logs
export const auditLogs = pgTable("audit_logs", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  action: text("action").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
}, (table) => {
  return {
    userIdx: index("audit_logs_user_idx").on(table.userId),
  };
});

// Settings
export const settings = pgTable("settings", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull(),
  key: text("key").notNull(),
  value: text("value").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    workspaceIdx: index("settings_workspace_idx").on(table.workspaceId),
  };
});
