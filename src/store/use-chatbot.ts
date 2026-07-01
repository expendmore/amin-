import { create } from "zustand";
import { Chatbot, BotNode, BotLink, Intent, CrmEntity, GlobalVariable, SimulatorMessage, NodeType } from "@/types/chatbot";

interface ChatbotState {
  bots: Chatbot[];
  intents: Intent[];
  entities: CrmEntity[];
  variables: GlobalVariable[];
  activeBotId: string | null;
  selectedNodeId: string | null;
  loading: boolean;

  // Simulator
  simulatorMessages: SimulatorMessage[];
  simulatorCurrentNodeId: string | null;
  simulatorVariables: Record<string, string>;

  // Canvas View State
  zoomLevel: number;
  panOffset: { x: number; y: number };
  snapToGrid: boolean;

  // Actions
  setActiveBotId: (id: string | null) => void;
  setSelectedNodeId: (id: string | null) => void;
  setCanvasViewport: (zoomLevel: number, panOffset: { x: number; y: number }) => void;
  toggleSnapToGrid: () => void;

  addBot: (bot: Omit<Chatbot, "id" | "createdAt" | "updatedAt" | "stats" | "nodes" | "links">) => void;
  updateBot: (id: string, updates: Partial<Chatbot>) => void;
  deleteBot: (id: string) => void;
  duplicateBot: (id: string) => void;

  addNode: (node: Omit<BotNode, "id">) => void;
  updateNode: (nodeId: string, updates: Partial<BotNode>) => void;
  deleteNode: (nodeId: string) => void;

  addLink: (link: Omit<BotLink, "id">) => void;
  deleteLink: (linkId: string) => void;

  // Intents, Entities & Variables
  addIntent: (intent: Omit<Intent, "id">) => void;
  updateIntent: (id: string, updates: Partial<Intent>) => void;
  deleteIntent: (id: string) => void;

  addEntity: (entity: Omit<CrmEntity, "id">) => void;
  updateEntity: (id: string, updates: Partial<CrmEntity>) => void;
  deleteEntity: (id: string) => void;

  addVariable: (variable: Omit<GlobalVariable, "id">) => void;
  updateVariable: (id: string, updates: Partial<GlobalVariable>) => void;
  deleteVariable: (id: string) => void;

  // Simulator Actions
  restartSimulator: () => void;
  sendUserMessage: (text: string) => void;
  executeSimulatorNode: (nodeId: string) => void;
}

const mockIntents = (): Intent[] => [
  { id: "i-1", name: "Billing Inquiry", trainingPhrases: ["pricing tiers", "how much is pro plan?", "stripe invoices", "charges"], confidenceScore: 0.9, priority: "high" },
  { id: "i-2", name: "Connect API", trainingPhrases: ["connect whatsapp account", "generate sandbox api key", "webhooks url setup"], confidenceScore: 0.85, priority: "normal" },
  { id: "i-3", name: "Trigger Support Callback", trainingPhrases: ["speak to manager", "transfer to human", "agent please", "need support team help"], confidenceScore: 0.95, priority: "high" },
];

const mockEntities = (): CrmEntity[] => [
  { id: "e-1", name: "Shopify Order No", regexPattern: "^ORD-\\d{4}$", synonymsList: ["order code", "order reference", "ref number"] },
  { id: "e-2", name: "Crypto Token Name", synonymsList: ["btc", "bitcoin", "eth", "ethereum", "sol", "solana"] },
];

const mockVariables = (): GlobalVariable[] => [
  { id: "v-1", name: "shopify_api_key", scope: "env", value: "shpat_a1b2c3d4e5f6g7h8", description: "Global token credentials for order queries" },
  { id: "v-2", name: "user_vip_status", scope: "user", value: "VIP_GOLD", description: "User segmentation priority flag" },
  { id: "v-3", name: "current_session_token", scope: "session", value: "sess_90210", description: "Transient webhook session identifier" },
];

const seedChatbots = (): Chatbot[] => [
  {
    id: "bot-1",
    name: "Shopify Assistant Automator",
    description: "Greets users, requests order references, triggers API lookups and processes human escalations.",
    status: "published",
    category: "customer_support",
    tags: ["Shopify", "Auto Responder", "Support"],
    nodes: [
      { id: "n-start", type: "start", name: "Start Inbound", position: { x: 100, y: 150 }, config: { text: "Keyword trigger: Hi, Order, Status" } },
      { id: "n-msg1", type: "message", name: "Welcome Message", position: { x: 300, y: 150 }, config: { text: "Hi there! 👋 I'm your ExpendMore Assistant. How can I help you today?", buttons: ["Check Order", "Talk to Support"] } },
      { id: "n-quest", type: "question", name: "Ask Order No", position: { x: 550, y: 100 }, config: { text: "Sure! Please type your 4-digit order number (e.g. ORD-9012)", variableName: "orderNumber", validationRegex: "^ORD-\\d{4}$" } },
      { id: "n-api", type: "apiCall", name: "Shopify Order Lookup", position: { x: 800, y: 100 }, config: { apiMethod: "GET", apiUrl: "https://api.shopify.com/orders/{{orderNumber}}" } },
      { id: "n-msg2", type: "message", name: "Order Result Summary", position: { x: 1050, y: 100 }, config: { text: "Found your order details! Status: Fulfilled. Estimated delivery: 2 days.", buttons: ["Main Menu"] } },
      { id: "n-human", type: "humanHandoff", name: "Escalate to Team Inbox", position: { x: 800, y: 300 }, config: { text: "Transferred to Live Inbox queue. One of our support managers will take over shortly.", agentQueue: "Support Tier 1" } },
      { id: "n-end", type: "end", name: "Terminator Block", position: { x: 1300, y: 200 }, config: { text: "Session ended." } }
    ],
    links: [
      { id: "l-1", sourceNodeId: "n-start", targetNodeId: "n-msg1" },
      { id: "l-2", sourceNodeId: "n-msg1", targetNodeId: "n-quest", sourcePortId: "Check Order" },
      { id: "l-3", sourceNodeId: "n-msg1", targetNodeId: "n-human", sourcePortId: "Talk to Support" },
      { id: "l-4", sourceNodeId: "n-quest", targetNodeId: "n-api" },
      { id: "l-5", sourceNodeId: "n-api", targetNodeId: "n-msg2" },
      { id: "l-6", sourceNodeId: "n-msg2", targetNodeId: "n-end" }
    ],
    stats: { sessionsCount: 1250, completionRate: 88, fallbackRate: 4, csatScore: 4.8 },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: "bot-2",
    name: "Lead Generation Campaign Bot",
    description: "Captures business contact info, prompts dynamic question forms and logs to Google Sheets.",
    status: "draft",
    category: "marketing",
    tags: ["Leads", "Forms", "Marketing"],
    nodes: [
      { id: "n2-start", type: "start", name: "Inbound Trigger", position: { x: 100, y: 150 }, config: { text: "Keyword: Campaign, Promo" } }
    ],
    links: [],
    stats: { sessionsCount: 0, completionRate: 0, fallbackRate: 0, csatScore: 0 },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  }
];

export const useChatbot = create<ChatbotState>((set, get) => ({
  bots: seedChatbots(),
  intents: mockIntents(),
  entities: mockEntities(),
  variables: mockVariables(),
  activeBotId: "bot-1",
  selectedNodeId: "n-msg1",
  loading: false,

  simulatorMessages: [],
  simulatorCurrentNodeId: null,
  simulatorVariables: {},

  zoomLevel: 100,
  panOffset: { x: 0, y: 0 },
  snapToGrid: true,

  setActiveBotId: (activeBotId) => set({ activeBotId, selectedNodeId: null, simulatorMessages: [], simulatorCurrentNodeId: null }),
  setSelectedNodeId: (selectedNodeId) => set({ selectedNodeId }),
  setCanvasViewport: (zoomLevel, panOffset) => set({ zoomLevel, panOffset }),
  toggleSnapToGrid: () => set((state) => ({ snapToGrid: !state.snapToGrid })),

  addBot: (botData) =>
    set((state) => {
      const now = new Date().toISOString();
      const newBot: Chatbot = {
        ...botData,
        id: `bot-${Math.random().toString(36).substring(2, 9)}`,
        nodes: [
          { id: "n-start", type: "start", name: "Start Inbound", position: { x: 100, y: 150 }, config: { text: "Trigger Keyword" } }
        ],
        links: [],
        stats: { sessionsCount: 0, completionRate: 0, fallbackRate: 0, csatScore: 0 },
        createdAt: now,
        updatedAt: now,
      };
      return { bots: [newBot, ...state.bots], activeBotId: newBot.id };
    }),

  updateBot: (id, updates) =>
    set((state) => ({
      bots: state.bots.map((b) => (b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b)),
    })),

  deleteBot: (id) =>
    set((state) => ({
      bots: state.bots.filter((b) => b.id !== id),
      activeBotId: state.activeBotId === id ? null : state.activeBotId,
    })),

  duplicateBot: (id) =>
    set((state) => {
      const target = state.bots.find((b) => b.id === id);
      if (!target) return {};
      const now = new Date().toISOString();
      const duplicated: Chatbot = {
        ...target,
        id: `bot-${Math.random().toString(36).substring(2, 9)}`,
        name: `Copy of ${target.name}`,
        status: "draft",
        stats: { sessionsCount: 0, completionRate: 0, fallbackRate: 0, csatScore: 0 },
        createdAt: now,
        updatedAt: now,
      };
      return { bots: [duplicated, ...state.bots] };
    }),

  // Nodes Actions
  addNode: (nodeData) =>
    set((state) => {
      if (!state.activeBotId) return {};
      const newNode: BotNode = {
        ...nodeData,
        id: `n-${Math.random().toString(36).substring(2, 9)}`,
      };

      const updatedBots = state.bots.map((b) => {
        if (b.id === state.activeBotId) {
          return { ...b, nodes: [...b.nodes, newNode], updatedAt: new Date().toISOString() };
        }
        return b;
      });

      return { bots: updatedBots, selectedNodeId: newNode.id };
    }),

  updateNode: (nodeId, updates) =>
    set((state) => {
      if (!state.activeBotId) return {};
      const updatedBots = state.bots.map((b) => {
        if (b.id === state.activeBotId) {
          const nodes = b.nodes.map((n) => (n.id === nodeId ? { ...n, config: { ...n.config, ...updates.config }, name: updates.name || n.name } : n));
          return { ...b, nodes, updatedAt: new Date().toISOString() };
        }
        return b;
      });
      return { bots: updatedBots };
    }),

  deleteNode: (nodeId) =>
    set((state) => {
      if (!state.activeBotId) return {};
      const updatedBots = state.bots.map((b) => {
        if (b.id === state.activeBotId) {
          const nodes = b.nodes.filter((n) => n.id !== nodeId);
          const links = b.links.filter((l) => l.sourceNodeId !== nodeId && l.targetNodeId !== nodeId);
          return { ...b, nodes, links, updatedAt: new Date().toISOString() };
        }
        return b;
      });
      return {
        bots: updatedBots,
        selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
      };
    }),

  // Links Actions
  addLink: (linkData) =>
    set((state) => {
      if (!state.activeBotId) return {};
      
      // Prevent duplicate links mapping same sockets
      const activeBot = state.bots.find(b => b.id === state.activeBotId);
      if (activeBot?.links.some(l => l.sourceNodeId === linkData.sourceNodeId && l.sourcePortId === linkData.sourcePortId)) {
        return {}; // Already linked
      }

      const newLink: BotLink = {
        ...linkData,
        id: `l-${Math.random().toString(36).substring(2, 9)}`,
      };

      const updatedBots = state.bots.map((b) => {
        if (b.id === state.activeBotId) {
          return { ...b, links: [...b.links, newLink], updatedAt: new Date().toISOString() };
        }
        return b;
      });

      return { bots: updatedBots };
    }),

  deleteLink: (linkId) =>
    set((state) => {
      if (!state.activeBotId) return {};
      const updatedBots = state.bots.map((b) => {
        if (b.id === state.activeBotId) {
          return { ...b, links: b.links.filter((l) => l.id !== linkId), updatedAt: new Date().toISOString() };
        }
        return b;
      });
      return { bots: updatedBots };
    }),

  // Intents, Entities & Variables CRUD
  addIntent: (intentData) =>
    set((state) => {
      const newIntent: Intent = {
        ...intentData,
        id: `i-${Math.random().toString(36).substring(2, 9)}`,
      };
      return { intents: [...state.intents, newIntent] };
    }),

  updateIntent: (id, updates) =>
    set((state) => ({
      intents: state.intents.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    })),

  deleteIntent: (id) =>
    set((state) => ({
      intents: state.intents.filter((i) => i.id !== id),
    })),

  addEntity: (entityData) =>
    set((state) => {
      const newEntity: CrmEntity = {
        ...entityData,
        id: `e-${Math.random().toString(36).substring(2, 9)}`,
      };
      return { entities: [...state.entities, newEntity] };
    }),

  updateEntity: (id, updates) =>
    set((state) => ({
      entities: state.entities.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    })),

  deleteEntity: (id) =>
    set((state) => ({
      entities: state.entities.filter((e) => e.id !== id),
    })),

  addVariable: (varData) =>
    set((state) => {
      const newVar: GlobalVariable = {
        ...varData,
        id: `v-${Math.random().toString(36).substring(2, 9)}`,
      };
      return { variables: [...state.variables, newVar] };
    }),

  updateVariable: (id, updates) =>
    set((state) => ({
      variables: state.variables.map((v) => (v.id === id ? { ...v, ...updates } : v)),
    })),

  deleteVariable: (id) =>
    set((state) => ({
      variables: state.variables.filter((v) => v.id !== id),
    })),

  // PREVIEW SIMULATOR EXECUTION CORE
  restartSimulator: () => {
    const activeBot = get().bots.find((b) => b.id === get().activeBotId);
    if (!activeBot) return;

    // Start with Start Node
    const startNode = activeBot.nodes.find((n) => n.type === "start");
    if (!startNode) return;

    const startupMsg: SimulatorMessage = {
      id: "sim-start",
      sender: "system",
      text: "⚡ Conversation Simulator initialized. Triggers log initialized.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    set({
      simulatorMessages: [startupMsg],
      simulatorVariables: {},
      simulatorCurrentNodeId: startNode.id,
    });

    get().executeSimulatorNode(startNode.id);
  },

  sendUserMessage: (text) => {
    const userMsg: SimulatorMessage = {
      id: `u-${Math.random().toString(36).substring(2, 9)}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    set((state) => ({
      simulatorMessages: [...state.simulatorMessages, userMsg],
    }));

    const currentNodeId = get().simulatorCurrentNodeId;
    const activeBot = get().bots.find((b) => b.id === get().activeBotId);

    if (currentNodeId && activeBot) {
      const currentNode = activeBot.nodes.find((n) => n.id === currentNodeId);
      
      // If we are waiting at a question node, save input to variable and advance
      if (currentNode && currentNode.type === "question") {
        const varName = currentNode.config.variableName || "tempVar";
        set((state) => ({
          simulatorVariables: {
            ...state.simulatorVariables,
            [varName]: text,
          },
        }));

        const link = activeBot.links.find((l) => l.sourceNodeId === currentNode.id);
        if (link) {
          get().executeSimulatorNode(link.targetNodeId);
        } else {
          // No link: End
          set((state) => ({
            simulatorMessages: [
              ...state.simulatorMessages,
              { id: "sim-fail", sender: "system", text: "No linking node mapped. End of execution.", timestamp: new Date().toLocaleTimeString() },
            ],
          }));
        }
      } else if (currentNode && (currentNode.type === "message" || currentNode.type === "start")) {
        // User clicked a button or typed. Check button branch matching
        const matchingLink = activeBot.links.find(
          (l) => l.sourceNodeId === currentNode.id && l.sourcePortId?.toLowerCase() === text.toLowerCase()
        );

        if (matchingLink) {
          get().executeSimulatorNode(matchingLink.targetNodeId);
        } else {
          // Check standard fallthrough link (no port label)
          const fallthroughLink = activeBot.links.find((l) => l.sourceNodeId === currentNode.id && !l.sourcePortId);
          if (fallthroughLink) {
            get().executeSimulatorNode(fallthroughLink.targetNodeId);
          }
        }
      }
    }
  },

  executeSimulatorNode: (nodeId) => {
    const activeBot = get().bots.find((b) => b.id === get().activeBotId);
    if (!activeBot) return;

    const node = activeBot.nodes.find((n) => n.id === nodeId);
    if (!node) return;

    set({ simulatorCurrentNodeId: nodeId });

    setTimeout(() => {
      const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      if (node.type === "start") {
        // Trace to next node automatically
        const link = activeBot.links.find((l) => l.sourceNodeId === node.id);
        if (link) get().executeSimulatorNode(link.targetNodeId);
      } else if (node.type === "message") {
        const text = node.config.text || "Hello!";
        const buttons = node.config.buttons || [];
        
        const botMsg: SimulatorMessage = {
          id: `b-${Math.random().toString(36).substring(2, 9)}`,
          sender: "bot",
          text,
          options: buttons,
          timestamp: nowTime,
        };

        set((state) => ({
          simulatorMessages: [...state.simulatorMessages, botMsg],
        }));

        // If message has no buttons, auto-advance after 1.5 seconds if linked
        if (buttons.length === 0) {
          const nextLink = activeBot.links.find((l) => l.sourceNodeId === node.id);
          if (nextLink) {
            setTimeout(() => {
              get().executeSimulatorNode(nextLink.targetNodeId);
            }, 1200);
          }
        }
      } else if (node.type === "question") {
        const botMsg: SimulatorMessage = {
          id: `b-${Math.random().toString(36).substring(2, 9)}`,
          sender: "bot",
          text: node.config.text || "Please enter values:",
          timestamp: nowTime,
        };
        set((state) => ({
          simulatorMessages: [...state.simulatorMessages, botMsg],
        }));
        // Handoff cursor remains here, waiting for sendUserMessage input
      } else if (node.type === "apiCall") {
        const sysMsg: SimulatorMessage = {
          id: `sys-${Math.random().toString(36).substring(2, 9)}`,
          sender: "system",
          text: `🔗 [Webhook API] Triggering HTTP POST: ${node.config.apiUrl || "https://api.expendmore.com/test"}`,
          timestamp: nowTime,
        };
        const botMsg: SimulatorMessage = {
          id: `b-${Math.random().toString(36).substring(2, 9)}`,
          sender: "bot",
          text: `🤖 [API Success response]: Obtained Shopify Order details payload. Delivery: 2 Days.`,
          timestamp: nowTime,
        };

        set((state) => ({
          simulatorMessages: [...state.simulatorMessages, sysMsg, botMsg],
        }));

        const nextLink = activeBot.links.find((l) => l.sourceNodeId === node.id);
        if (nextLink) {
          setTimeout(() => {
            get().executeSimulatorNode(nextLink.targetNodeId);
          }, 1500);
        }
      } else if (node.type === "humanHandoff") {
        const botMsg: SimulatorMessage = {
          id: `b-${Math.random().toString(36).substring(2, 9)}`,
          sender: "bot",
          text: node.config.text || "Transferred to human support queue.",
          timestamp: nowTime,
        };
        const sysMsg: SimulatorMessage = {
          id: `sys-${Math.random().toString(36).substring(2, 9)}`,
          sender: "system",
          text: `👥 Chat reassigned dynamically to agent queue: "${node.config.agentQueue || "General Support"}"`,
          timestamp: nowTime,
        };

        set((state) => ({
          simulatorMessages: [...state.simulatorMessages, botMsg, sysMsg],
        }));
      } else if (node.type === "end") {
        const sysMsg: SimulatorMessage = {
          id: `sys-${Math.random().toString(36).substring(2, 9)}`,
          sender: "system",
          text: "⏹️ Chatbot workflow finalized. Session closed.",
          timestamp: nowTime,
        };
        set((state) => ({
          simulatorMessages: [...state.simulatorMessages, sysMsg],
          simulatorCurrentNodeId: null,
        }));
      }
    }, 600);
  },
}));
