import { create } from "zustand";
import { AiSuggestion, PromptTemplate, KnowledgeDoc, SentimentReport, SavedTimeLog } from "@/types/ai-assistant";

// Initial FAQ/Knowledge base data
const INITIAL_KNOWLEDGE_BASE: KnowledgeDoc[] = [
  {
    id: "kb-1",
    title: "ExpendMore Pricing & Subscription Plans",
    content: "ExpendMore offers three pricing tiers: Growth Plan ($29/month for up to 5 team members, 2000 messages/day), Scale Plan ($79/month for up to 15 team members, 10,000 messages/day), and Enterprise Plan (Custom pricing, unlimited seats, dedicated support, and custom LLM integrations). All plans include a 14-day free trial. Billing can be monthly or annual with a 20% discount on annual subscriptions.",
    category: "pricing",
    tags: ["pricing", "plans", "billing", "trial"]
  },
  {
    id: "kb-2",
    title: "Refund Policy and Cancellation Guidelines",
    content: "Subscribers can cancel their subscription at any time via the billing console. Refund requests must be submitted within 7 days of the invoice date. We offer full refunds for annual plans within the first 30 days if less than 500 messages have been processed. Standard monthly plans are non-refundable after the billing cycle starts but can be set to not renew.",
    category: "policy",
    tags: ["refund", "cancel", "billing", "policy"]
  },
  {
    id: "kb-3",
    title: "WhatsApp Cloud API Integration Setup Guide",
    content: "To connect your WhatsApp Business Account (WABA) using WhatsApp Cloud API: 1. Set up a Meta Developer Account. 2. Register your business phone number and verify your Meta Business Manager. 3. Generate a Permanent System User Token. 4. Paste the Phone Number ID, WABA ID, and Permanent Token inside the ExpendMore WhatsApp Integration Hub page. Our system will automatically verify webhooks and enable status tracking.",
    category: "technical",
    tags: ["whatsapp", "integration", "setup", "api"]
  },
  {
    id: "kb-4",
    title: "Working with Custom AI Agents and LLMs",
    content: "Agents in ExpendMore can use OpenAI GPT-4o, Anthropic Claude 3.5 Sonnet, or Llama 3 70B models. Go to the AI Agent Platform dashboard, click 'Create Agent', fill in the system prompt instructions, choose your LLM model, configure temperature settings, upload knowledge base PDFs, and attach workflow tools. These agents can be linked to campaigns or assigned to handle fallback queries automatically in the Live Inbox.",
    category: "technical",
    tags: ["agents", "models", "setup", "llm"]
  },
  {
    id: "kb-5",
    title: "Common Sync Errors and Webhook Failures",
    content: "If messages are not syncing: 1. Confirm your Meta developer App is in 'Live' mode rather than 'Development' mode. 2. Check if webhook status in ExpendMore dashboard is marked active. 3. Validate your WhatsApp number quality rating (must be Above Average or Medium). 4. Check if webhook payload URLs match precisely and security verification tokens haven't changed.",
    category: "technical",
    tags: ["errors", "sync", "webhooks", "troubleshooting"]
  },
  {
    id: "kb-6",
    title: "Customer Data Privacy and GDPR Compliance",
    content: "ExpendMore is fully GDPR and HIPAA compliant. All message payloads routed through our platform are encrypted in transit using TLS 1.3 and at rest with AES-256 keys. We store contact profiles and chat transcript history for standard operational use, which can be deleted permanently using the 'Purge Contact' action inside the Contacts CRM workspace.",
    category: "policy",
    tags: ["privacy", "security", "gdpr", "compliance"]
  }
];

// Initial prompt templates
const INITIAL_TEMPLATES: PromptTemplate[] = [
  {
    id: "t-1",
    name: "Welcome Greeting",
    description: "Friendly introduction greeting for new customers who contact us.",
    prompt: "Hello! Welcome to ExpendMore. My name is [Agent Name]. How can I assist you with your marketing, automation, or CRM integrations today?",
    category: "welcome",
    isSystem: true
  },
  {
    id: "t-2",
    name: "Service Outage Apology",
    description: "Formal apology message explaining current system maintenance or outages.",
    prompt: "Dear customer, we are currently experiencing a temporary outage on our [Service Name]. Our engineering team is actively investigating the issue and expects full resolution within [Time Frame]. We sincerely apologize for this inconvenience and appreciate your patience.",
    category: "apology",
    isSystem: true
  },
  {
    id: "t-3",
    name: "Feedback & CSAT Survey",
    description: "Requesting a satisfaction review or score rating after resolving an issue.",
    prompt: "Thank you for chatting with us today! We hope we resolved your issue. Could you take 5 seconds to reply with a rating from 1 (Poor) to 5 (Excellent) to let us know how we did?",
    category: "support",
    isSystem: true
  },
  {
    id: "t-4",
    name: "Pricing Proposal Summary",
    description: "Standard pitch response summarizing Growth and Scale tiers.",
    prompt: "We offer tailored plans for your business: Our Growth plan ($29/mo) supports up to 5 seats and 2,000 daily messages, while the Scale plan ($79/mo) supports up to 15 seats and 10,000 messages. You can start with a 14-day free trial. Let me know if you would like me to share a signup link!",
    category: "sales",
    isSystem: true
  }
];

// Usage performance logs for charts
const INITIAL_TIME_LOGS: SavedTimeLog[] = [
  { id: "log-1", date: "Jun 20", minutesSaved: 120, acceptedCount: 60, rejectedCount: 8, totalSuggestions: 68 },
  { id: "log-2", date: "Jun 21", minutesSaved: 154, acceptedCount: 77, rejectedCount: 12, totalSuggestions: 89 },
  { id: "log-3", date: "Jun 22", minutesSaved: 198, acceptedCount: 99, rejectedCount: 15, totalSuggestions: 114 },
  { id: "log-4", date: "Jun 23", minutesSaved: 240, acceptedCount: 120, rejectedCount: 22, totalSuggestions: 142 },
  { id: "log-5", date: "Jun 24", minutesSaved: 290, acceptedCount: 145, rejectedCount: 18, totalSuggestions: 163 },
  { id: "log-6", date: "Jun 25", minutesSaved: 340, acceptedCount: 170, rejectedCount: 20, totalSuggestions: 190 },
  { id: "log-7", date: "Jun 26", minutesSaved: 412, acceptedCount: 206, rejectedCount: 24, totalSuggestions: 230 }
];

// Mock translation database for realism
const MOCK_TRANSLATIONS: Record<string, Record<string, string>> = {
  spanish: {
    "Hello! Welcome to ExpendMore. My name is [Agent Name]. How can I assist you with your marketing, automation, or CRM integrations today?":
      "¡Hola! Bienvenido a ExpendMore. Mi nombre es [Agent Name]. ¿Cómo puedo ayudarle hoy con su marketing, automatización o integraciones de CRM?",
    "Dear customer, we are currently experiencing a temporary outage on our [Service Name]. Our engineering team is actively investigating the issue and expects full resolution within [Time Frame]. We sincerely apologize for this inconvenience and appreciate your patience.":
      "Estimado cliente, actualmente estamos experimentando una interrupción temporal en nuestro [Service Name]. Nuestro equipo de ingeniería está investigando activamente el problema y espera una resolución completa dentro de [Time Frame]. Nos disculpamos sinceramente por este inconveniente y agradecemos su paciencia.",
    "Thank you for chatting with us today! We hope we resolved your issue. Could you take 5 seconds to reply with a rating from 1 (Poor) to 5 (Excellent) to let us know how we did?":
      "¡Gracias por chatear con nosotros hoy! Esperamos haber resuelto su problema. ¿Podría tomarse 5 segundos para responder con una calificación del 1 (Malo) al 5 (Excelente) para hacernos saber cómo lo hicimos?",
    "We offer tailored plans for your business: Our Growth plan ($29/mo) supports up to 5 seats and 2,000 daily messages, while the Scale plan ($79/mo) supports up to 15 seats and 10,000 messages. You can start with a 14-day free trial. Let me know if you would like me to share a signup link!":
      "Ofrecemos planes adaptados a su negocio: Nuestro plan Growth ($29/mes) admite hasta 5 usuarios y 2,000 mensajes diarios, mientras que el plan Scale ($79/mes) admite hasta 15 usuarios y 10,000 mensajes. Puede comenzar con una prueba gratuita de 14 días. ¡Avíseme si desea que comparta un enlace de registro!"
  },
  french: {
    "Hello! Welcome to ExpendMore. My name is [Agent Name]. How can I assist you with your marketing, automation, or CRM integrations today?":
      "Bonjour ! Bienvenue chez ExpendMore. Je m'appelle [Agent Name]. Comment puis-je vous aider aujourd'hui avec votre marketing, vos automatisations ou vos intégrations CRM ?",
    "Dear customer, we are currently experiencing a temporary outage on our [Service Name]. Our engineering team is actively investigating the issue and expects full resolution within [Time Frame]. We sincerely apologize for this inconvenience and appreciate your patience.":
      "Cher client, nous subissons actuellement une interruption temporaire de notre service [Service Name]. Notre équipe d'ingénieurs enquête activement sur le problème et prévoit un rétablissement complet d'ici [Time Frame]. Nous vous présentons nos excuses les plus sincères pour ce désagrément et vous remercions de votre patience.",
    "Thank you for chatting with us today! We hope we resolved your issue. Could you take 5 seconds to reply with a rating from 1 (Poor) to 5 (Excellent) to let us know how we did?":
      "Merci d'avoir discuté avec nous aujourd'hui ! Nous espérons avoir résolu votre problème. Pourriez-vous prendre 5 secondes pour répondre par une note de 1 (Mauvais) à 5 (Excellent) afin de nous faire part de votre avis ?",
    "We offer tailored plans for your business: Our Growth plan ($29/mo) supports up to 5 seats and 2,000 daily messages, while the Scale plan ($79/mo) supports up to 15 seats and 10,000 messages. You can start with a 14-day free trial. Let me know if you would like me to share a signup link!":
      "Nous proposons des forfaits adaptés à votre entreprise : notre forfait Growth (29 $/mois) comprend jusqu'à 5 utilisateurs et 2 000 messages/jour, tandis que le forfait Scale (79 $/mois) comprend jusqu'à 15 utilisateurs et 10 000 messages. Vous pouvez commencer par un essai gratuit de 14 jours. Faites-moi savoir si vous souhaitez que je partage le lien d'inscription !"
  },
  german: {
    "Hello! Welcome to ExpendMore. My name is [Agent Name]. How can I assist you with your marketing, automation, or CRM integrations today?":
      "Hallo! Willkommen bei ExpendMore. Mein Name ist [Agent Name]. Wie kann ich Ihnen heute bei Ihrem Marketing, Ihren Automatisierungen oder CRM-Integrationen helfen?",
    "Dear customer, we are currently experiencing a temporary outage on our [Service Name]. Our engineering team is actively investigating the issue and expects full resolution within [Time Frame]. We sincerely apologize for this inconvenience and appreciate your patience.":
      "Sehr geehrter Kunde, wir haben derzeit einen vorübergehenden Ausfall unseres [Service Name]. Unser Technikteam untersucht das Problem aktiv und erwartet eine vollständige Behebung innerhalb von [Time Frame]. Wir entschuldigen uns aufrichtig für diese Unannehmlichkeiten und bedanken uns für Ihre Geduld.",
    "Thank you for chatting with us today! We hope we resolved your issue. Could you take 5 seconds to reply with a rating from 1 (Poor) to 5 (Excellent) to let us know how we did?":
      "Vielen Dank, dass Sie heute mit uns gechattet haben! Wir hoffen, wir konnten Ihr Problem lösen. Könnten Sie sich 5 Sekunden Zeit nehmen, um mit einer Bewertung von 1 (Schlecht) bis 5 (Sehr gut) zu antworten, damit wir wissen, wie wir uns geschlagen haben?",
    "We offer tailored plans for your business: Our Growth plan ($29/mo) supports up to 5 seats and 2,000 daily messages, while the Scale plan ($79/mo) supports up to 15 seats and 10,000 messages. You can start with a 14-day free trial. Let me know if you would like me to share a signup link!":
      "Wir bieten maßgeschneiderte Tarife für Ihr Unternehmen: Unser Growth-Tarif ($29/Monat) unterstützt bis zu 5 Plätze und 2.000 tägliche Nachrichten, während der Scale-Tarif ($79/Monat) bis zu 15 Plätze und 10.000 Nachrichten unterstützt. Sie können mit einer 14-tägigen kostenlosen Testversion starten. Lassen Sie mich wissen, ob ich den Registrierungslink teilen soll!"
  }
};

interface AiAssistantState {
  // Performance KPIs
  totalSuggestions: number;
  acceptedCount: number;
  rejectedCount: number;
  averageResponseTimeSec: number;
  totalSavedHours: number;
  timeLogs: SavedTimeLog[];

  // Lists
  promptTemplates: PromptTemplate[];
  knowledgeBase: KnowledgeDoc[];
  suggestionsHistory: AiSuggestion[];

  // Search
  searchQuery: string;
  searchResults: KnowledgeDoc[];

  // Active status / State
  status: "idle" | "analyzing" | "thinking" | "generating";
  currentSuggestion: string;
  currentSentiment: SentimentReport | null;
  translationLanguage: string;
  translatedText: string;

  // Actions
  setSearchQuery: (query: string) => void;
  searchKnowledgeBase: (query: string) => void;
  savePromptTemplate: (template: Omit<PromptTemplate, "id" | "isSystem">) => void;
  deletePromptTemplate: (id: string) => void;
  logSuggestionFeedback: (id: string, feedback: "accept" | "reject") => void;

  // AI Operations
  analyzeSentiment: (text: string) => Promise<SentimentReport>;
  generateReply: (prompt: string, tone: "professional" | "friendly" | "support" | "casual", contactContext?: string) => Promise<string>;
  rewriteText: (text: string, action: "improve" | "simplify" | "shorten" | "expand" | "correct" | "empathy") => Promise<string>;
  translateText: (text: string, lang: string) => Promise<string>;
  clearCurrent: () => void;
}

export const useAiAssistant = create<AiAssistantState>((set, get) => ({
  // Performance KPIs
  totalSuggestions: 993,
  acceptedCount: 828,
  rejectedCount: 165,
  averageResponseTimeSec: 4.8,
  totalSavedHours: 29.5,
  timeLogs: INITIAL_TIME_LOGS,

  // Lists
  promptTemplates: INITIAL_TEMPLATES,
  knowledgeBase: INITIAL_KNOWLEDGE_BASE,
  suggestionsHistory: [],

  // Search
  searchQuery: "",
  searchResults: INITIAL_KNOWLEDGE_BASE,

  // Active status / State
  status: "idle",
  currentSuggestion: "",
  currentSentiment: null,
  translationLanguage: "english",
  translatedText: "",

  setSearchQuery: (query) => set({ searchQuery: query }),

  searchKnowledgeBase: (query) => {
    const kb = get().knowledgeBase;
    if (!query.trim()) {
      set({ searchResults: kb });
      return;
    }
    const lowercaseQuery = query.toLowerCase();
    const results = kb.filter(
      (doc) =>
        doc.title.toLowerCase().includes(lowercaseQuery) ||
        doc.content.toLowerCase().includes(lowercaseQuery) ||
        doc.category.toLowerCase().includes(lowercaseQuery) ||
        doc.tags.some((t) => t.toLowerCase().includes(lowercaseQuery))
    );
    set({ searchResults: results });
  },

  savePromptTemplate: (template) => {
    const newTemplate: PromptTemplate = {
      ...template,
      id: `t-${Date.now()}`,
      isSystem: false
    };
    set((state) => ({
      promptTemplates: [...state.promptTemplates, newTemplate]
    }));
  },

  deletePromptTemplate: (id) => {
    set((state) => ({
      promptTemplates: state.promptTemplates.filter((t) => t.id !== id || t.isSystem)
    }));
  },

  logSuggestionFeedback: (id, feedback) => {
    const isAccept = feedback === "accept";
    set((state) => {
      // Find recommendation in history to update it if we want
      const updatedHistory = state.suggestionsHistory.map((s) => {
        if (s.id === id) {
          return { ...s, confidence: isAccept ? 99 : 0 };
        }
        return s;
      });

      const updatedAccepted = isAccept ? state.acceptedCount + 1 : state.acceptedCount;
      const updatedRejected = !isAccept ? state.rejectedCount + 1 : state.rejectedCount;
      const newTotal = state.totalSuggestions + 1;
      
      // Calculate saved minutes (2 mins per accepted suggestion)
      const additionalMins = isAccept ? 2.5 : 0;
      const additionalHours = additionalMins / 60;
      const newSavedHours = Number((state.totalSavedHours + additionalHours).toFixed(2));

      // Append to the last item in time logs or create a new entry for today
      const todayLabel = "Jun 26";
      const updatedTimeLogs = state.timeLogs.map((log) => {
        if (log.date === todayLabel) {
          return {
            ...log,
            acceptedCount: isAccept ? log.acceptedCount + 1 : log.acceptedCount,
            rejectedCount: !isAccept ? log.rejectedCount + 1 : log.rejectedCount,
            totalSuggestions: log.totalSuggestions + 1,
            minutesSaved: Number((log.minutesSaved + additionalMins).toFixed(1))
          };
        }
        return log;
      });

      return {
        suggestionsHistory: updatedHistory,
        acceptedCount: updatedAccepted,
        rejectedCount: updatedRejected,
        totalSuggestions: newTotal,
        totalSavedHours: newSavedHours,
        timeLogs: updatedTimeLogs
      };
    });
  },

  analyzeSentiment: async (text) => {
    set({ status: "analyzing" });
    await new Promise((resolve) => setTimeout(resolve, 800));

    const content = text.toLowerCase();
    let sentiment: SentimentReport["sentiment"] = "neutral";
    let score = 50;
    let urgency: SentimentReport["urgency"] = "low";
    let detectedLanguage = "English";

    // Simple keyword mapping for mock realism
    if (content.includes("help") || content.includes("urgent") || content.includes("broken") || content.includes("error") || content.includes("fail")) {
      sentiment = "urgent";
      score = 88;
      urgency = "high";
    } else if (content.includes("angry") || content.includes("terrible") || content.includes("refund") || content.includes("worst") || content.includes("cancel")) {
      sentiment = "frustrated";
      score = 92;
      urgency = "high";
    } else if (content.includes("great") || content.includes("thanks") || content.includes("awesome") || content.includes("love") || content.includes("amazing")) {
      sentiment = "happy";
      score = 95;
      urgency = "low";
    } else if (content.includes("yes") || content.includes("interested") || content.includes("price") || content.includes("cost") || content.includes("buy")) {
      sentiment = "positive";
      score = 75;
      urgency = "medium";
    } else if (content.includes("no") || content.includes("not ready") || content.includes("maybe")) {
      sentiment = "negative";
      score = 35;
      urgency = "medium";
    }

    if (content.includes("hola") || content.includes("gracias") || content.includes("por favor")) {
      detectedLanguage = "Spanish";
    } else if (content.includes("bonjour") || content.includes("merci") || content.includes("s'il vous plaît")) {
      detectedLanguage = "French";
    } else if (content.includes("hallo") || content.includes("danke") || content.includes("bitte")) {
      detectedLanguage = "German";
    }

    const report: SentimentReport = {
      sentiment,
      score,
      urgency,
      detectedLanguage
    };

    set({ currentSentiment: report, status: "idle" });
    return report;
  },

  generateReply: async (prompt, tone, contactContext) => {
    set({ status: "thinking", currentSuggestion: "" });
    await new Promise((resolve) => setTimeout(resolve, 600));
    set({ status: "generating" });

    // Build standard reply drafts based on tone
    let reply = "";
    const greeting = tone === "friendly" ? "Hi there! 👋" : "Dear Customer,";
    const contextStr = contactContext ? ` regarding "${contactContext}"` : "";

    if (prompt.toLowerCase().includes("pricing") || prompt.toLowerCase().includes("cost")) {
      if (tone === "friendly") {
        reply = `${greeting} Thanks for asking about our pricing plans! ExpendMore offers simple plans: the Growth tier is just $29/mo, and the Scale tier is $79/mo. Both come with a free 14-day trial! Let me know if you would like a link to register. 🚀`;
      } else if (tone === "support") {
        reply = `${greeting} In response to your pricing inquiry${contextStr}, our Growth plan ($29/month) covers 5 users, and the Scale plan ($79/month) supports up to 15 users. I can assist in setting up a subscription if you have any questions.`;
      } else {
        reply = `${greeting} Thank you for your inquiry${contextStr}. ExpendMore pricing structures consist of: Growth ($29/mo) and Scale ($79/mo) with full CRM capability. Let us know if you require further assistance.`;
      }
    } else if (prompt.toLowerCase().includes("refund") || prompt.toLowerCase().includes("cancel")) {
      if (tone === "friendly") {
        reply = `${greeting} We are really sorry to hear you're looking to cancel. 😢 You can easily cancel directly in your Settings > Billing panel. Standard refund requests are honored within the first 7 days. Let me know if we can help resolve any issues!`;
      } else if (tone === "support") {
        reply = `${greeting} I understand you want to cancel your subscription${contextStr}. You may perform cancellation in your Workspace Settings page under Billing. Standard refunds are applicable within 7 days of invoice generation. Please contact billing@expendmore.com if you need help processing this.`;
      } else {
        reply = `${greeting} We acknowledge your request to cancel${contextStr}. Cancellation is available in the account administration settings. Refund protocols dictate requests must be logged within 7 days of the transaction.`;
      }
    } else if (prompt.toLowerCase().includes("welcome") || prompt.toLowerCase().includes("hello")) {
      if (tone === "friendly") {
        reply = `${greeting} A very warm welcome to ExpendMore! 🌟 We're super excited to have you. What automation projects or WhatsApp flows are we building today?`;
      } else if (tone === "support") {
        reply = `${greeting} Welcome to ExpendMore Support. How can we assist you with configuration, agents, or workflow pipelines today?`;
      } else {
        reply = `${greeting} Welcome to the ExpendMore workspace. Please let us know if you require assistance navigating our WhatsApp hubs or integration consoles.`;
      }
    } else {
      // General response fallback
      if (tone === "friendly") {
        reply = `${greeting} Thanks for reaching out! I've analyzed your prompt "${prompt}". I'd love to help you configure your chatbot triggers or team workspace. Let me know what you need! ✨`;
      } else if (tone === "support") {
        reply = `${greeting} Thank you for contacting customer support. Regarding your query: "${prompt}". I am here to help you resolve this. Could you share more details or error logs so we can troubleshoot?`;
      } else if (tone === "casual") {
        reply = `Hey! Got your message about "${prompt}". Let's jump on this, what seems to be the main blocker? Let me know!`;
      } else {
        reply = `${greeting} We have received your query: "${prompt}". Our technical assistants are verifying the details. We will provide updates shortly.`;
      }
    }

    // Simulate streaming typing effect
    const words = reply.split(" ");
    let typed = "";
    for (let i = 0; i < words.length; i++) {
      typed += (i === 0 ? "" : " ") + words[i];
      set({ currentSuggestion: typed });
      await new Promise((resolve) => setTimeout(resolve, 20 + Math.random() * 25));
    }

    // Save suggestion to history
    const newSuggestion: AiSuggestion = {
      id: `sug-${Date.now()}`,
      text: reply,
      tone,
      confidence: 85 + Math.floor(Math.random() * 14),
      source: "llm",
      createdAt: new Date().toISOString()
    };

    set((state) => ({
      suggestionsHistory: [newSuggestion, ...state.suggestionsHistory],
      status: "idle"
    }));

    return reply;
  },

  rewriteText: async (text, action) => {
    set({ status: "thinking" });
    await new Promise((resolve) => setTimeout(resolve, 700));

    let output = text;
    switch (action) {
      case "simplify":
        output = text
          .replace(/experience a temporary outage/g, "have a small breakdown")
          .replace(/sincerely apologize for this inconvenience/g, "are sorry for the trouble")
          .replace(/actively investigating the issue and expects full resolution/g, "fixing it right now and it will be working");
        if (output === text) {
          output = `Here is the simplified version: We are checking your issue. We will resolve it quickly. Thanks!`;
        }
        break;
      case "shorten":
        output = text.length > 30 ? text.substring(0, Math.floor(text.length * 0.6)) + "..." : text;
        break;
      case "expand":
        output = `${text} We want to make sure your experience using ExpendMore is excellent. If you need any immediate walkthroughs, configuration help, or troubleshooting documents, do not hesitate to contact our 24/7 technical team.`;
        break;
      case "correct":
        output = text
          .replace(/dont/gi, "don't")
          .replace(/recieve/gi, "receive")
          .replace(/your welcome/gi, "you're welcome")
          .replace(/i am write/gi, "I am writing")
          .replace(/teh/gi, "the");
        if (output === text) {
          output = `${text} (Grammar checked and verified)`;
        }
        break;
      case "empathy":
        output = `We completely understand how frustrating this must be for you, and we sincerely apologize for any stress caused. ❤️ ${text}`;
        break;
      case "improve":
      default:
        output = `🌟 ${text} We are fully committed to resolving your queries instantly. Please let us know if this works for you.`;
        break;
    }

    set({ currentSuggestion: output, status: "idle" });
    return output;
  },

  translateText: async (text, lang) => {
    set({ status: "thinking" });
    await new Promise((resolve) => setTimeout(resolve, 600));

    let translation = "";
    const lowercaseLang = lang.toLowerCase();
    
    // Check if we have standard mock translations matching exactly
    const langDict = MOCK_TRANSLATIONS[lowercaseLang];
    if (langDict && langDict[text]) {
      translation = langDict[text];
    } else {
      // Fallback translations simulation
      if (lowercaseLang === "spanish") {
        translation = `[Traducido al Español]: ${text.replace(/Hello/gi, "Hola").replace(/Welcome/gi, "Bienvenido").replace(/Thank you/gi, "Gracias")}`;
      } else if (lowercaseLang === "french") {
        translation = `[Traduit en Français]: ${text.replace(/Hello/gi, "Bonjour").replace(/Welcome/gi, "Bienvenue").replace(/Thank you/gi, "Merci")}`;
      } else if (lowercaseLang === "german") {
        translation = `[Ins Deutsche übersetzt]: ${text.replace(/Hello/gi, "Hallo").replace(/Welcome/gi, "Willkommen").replace(/Thank you/gi, "Danke")}`;
      } else if (lowercaseLang === "japanese") {
        translation = `[日本語訳]: ${text.replace(/Hello/gi, "こんにちは").replace(/Welcome/gi, "ようこそ").replace(/Thank you/gi, "ありがとう")}`;
      } else if (lowercaseLang === "arabic") {
        translation = `[مترجم إلى العربية]: ${text.replace(/Hello/gi, "مرحباً").replace(/Welcome/gi, "أهلاً وسهلاً").replace(/Thank you/gi, "شكراً")}`;
      } else {
        translation = `[Translated to ${lang}]: ${text}`;
      }
    }

    set({ translationLanguage: lang, translatedText: translation, status: "idle" });
    return translation;
  },

  clearCurrent: () => {
    set({ currentSuggestion: "", currentSentiment: null, translatedText: "" });
  }
}));
