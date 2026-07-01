export type NodeType =
  | "start"
  | "message"
  | "question"
  | "condition"
  | "aiPrompt"
  | "knowledge"
  | "apiCall"
  | "humanHandoff"
  | "end";

export interface NodePosition {
  x: number;
  y: number;
}

export interface ConditionRule {
  id: string;
  variable: string;
  operator: "equals" | "contains" | "greater_than" | "less_than" | "exists";
  value: string;
  targetNodeId: string | null;
}

export interface BotNodeConfig {
  text?: string;
  buttons?: string[]; // button options
  variableName?: string; // for question value captures
  validationRegex?: string;
  conditions?: ConditionRule[];
  apiMethod?: "GET" | "POST";
  apiUrl?: string;
  apiHeaders?: string;
  apiBody?: string;
  agentQueue?: string;
  notes?: string;
  fallbackText?: string;
}

export interface BotNode {
  id: string;
  type: NodeType;
  name: string;
  position: NodePosition;
  config: BotNodeConfig;
}

export interface BotLink {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  sourcePortId?: string; // for mapping conditional branches
}

export interface ChatbotStats {
  sessionsCount: number;
  completionRate: number;
  fallbackRate: number;
  csatScore: number;
}

export interface Chatbot {
  id: string;
  name: string;
  description: string;
  status: "draft" | "published" | "archived";
  category: "customer_support" | "marketing" | "sales" | "utility";
  tags: string[];
  nodes: BotNode[];
  links: BotLink[];
  stats: ChatbotStats;
  createdAt: string;
  updatedAt: string;
}

export interface Intent {
  id: string;
  name: string;
  trainingPhrases: string[];
  confidenceScore: number; // e.g. 0.85
  priority: "high" | "normal" | "low";
}

export interface CrmEntity {
  id: string;
  name: string;
  regexPattern?: string;
  synonymsList: string[]; // comma separated values
}

export interface GlobalVariable {
  id: string;
  name: string;
  scope: "global" | "user" | "session" | "workflow" | "env";
  value: string;
  description?: string;
}

export interface SimulatorMessage {
  id: string;
  sender: "user" | "bot" | "system";
  text: string;
  timestamp: string;
  options?: string[]; // buttons
}
