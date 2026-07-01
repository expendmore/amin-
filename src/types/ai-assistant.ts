export interface AiSuggestion {
  id: string;
  text: string;
  tone: "professional" | "friendly" | "support" | "casual";
  confidence: number; // 0 to 100
  source: "faq" | "llm" | "template";
  createdAt: string;
}

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  prompt: string;
  category: "welcome" | "support" | "apology" | "sales" | "custom";
  isSystem: boolean;
}

export interface KnowledgeDoc {
  id: string;
  title: string;
  content: string;
  category: "policy" | "faq" | "pricing" | "technical";
  tags: string[];
}

export interface SentimentReport {
  sentiment: "positive" | "neutral" | "negative" | "frustrated" | "happy" | "urgent";
  score: number; // 0 to 100
  urgency: "low" | "medium" | "high";
  detectedLanguage: string;
}

export interface RewriteAction {
  action: "improve" | "simplify" | "shorten" | "expand" | "correct" | "empathy";
  inputText: string;
  outputText: string;
}

export interface SavedTimeLog {
  id: string;
  date: string; // e.g. "2026-06-26"
  minutesSaved: number;
  acceptedCount: number;
  rejectedCount: number;
  totalSuggestions: number;
}
