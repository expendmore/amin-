export interface WorkflowStep {
  id: string;
  type: "trigger" | "filter" | "ai_prompt" | "action" | "logic" | "utility" | "database" | "webhook" | "communication";
  label: string;
  description?: string;
  position?: { x: number; y: number };
  nextStepIds?: string[];
  config: {
    // For Trigger
    triggerType?: "manual" | "webhook" | "schedule" | "whatsapp_message" | "api" | "file_upload" | "database";
    keyword?: string;
    cronExpression?: string;
    
    // For AI Node
    provider?: "openai" | "anthropic" | "google" | "deepseek" | "groq" | "openrouter";
    modelName?: string;
    promptTemplate?: string;
    memoryEnabled?: boolean;
    vectorSearchIndex?: string;
    outputParserType?: string;
    
    // For Action
    actionType?: "whatsapp_template" | "whatsapp_custom" | "stripe_invoice" | "crm_sync" | "send_email" | "http_request" | "google_sheets" | "database_insert" | "delay" | "condition" | "loop" | "merge" | "split" | "transform_data" | "webhook_response";
    templateId?: string;
    recipientPhone?: string;
    bodyText?: string;
    
    // Generic configuration
    [key: string]: any;
  };
  variables?: Record<string, string>;
  expressions?: Record<string, string>;
  authId?: string;
  retryPolicy?: {
    retries: number;
    intervalMs: number;
  };
  timeoutSec?: number;
  notes?: string;
  validationErrors?: string[];
}

export interface WorkflowVersion {
  id: string;
  versionNumber: number;
  name: string;
  description: string;
  steps: WorkflowStep[];
  createdAt: string;
}

export interface WorkflowComment {
  id: string;
  nodeId?: string;
  author: string;
  text: string;
  date: string;
}

export interface Workflow {
  id: string;
  userId: string;
  name: string;
  description: string;
  isActive: boolean;
  successRate: number;
  totalRuns: number;
  steps: WorkflowStep[];
  createdAt: string;
  updatedAt: string;
  envVariables?: Record<string, string>;
  secrets?: Record<string, string>;
  versions?: WorkflowVersion[];
  comments?: WorkflowComment[];
  isFavorite?: boolean;
}

export interface WorkflowRun {
  id: string;
  workflowId: string;
  status: "success" | "running" | "failed";
  startedAt: string;
  latencyMs: number;
  logs: string[];
}
