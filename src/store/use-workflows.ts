import { create } from "zustand";
import { Workflow, WorkflowStep, WorkflowRun, WorkflowVersion, WorkflowComment } from "@/types/workflows";

interface WorkflowsState {
  workflows: Workflow[];
  runsHistory: WorkflowRun[];
  activeWorkflowId: string | null;
  
  // Canvas Local Visual State
  panOffset: { x: number; y: number };
  zoomLevel: number;
  selectedStepId: string | null;
  selectedStepIds: string[]; // For multi-select
  undoStack: WorkflowStep[][];
  redoStack: WorkflowStep[][];

  // Canvas Actions
  setActiveWorkflowId: (id: string | null) => void;
  setPanOffset: (pan: { x: number; y: number }) => void;
  setZoomLevel: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  centerCanvas: () => void;
  setSelectedStepId: (id: string | null) => void;
  setSelectedStepIds: (ids: string[]) => void;

  // Workflow CRUD Actions
  toggleWorkflow: (id: string) => void;
  addWorkflow: (name: string, description: string, triggerType: "whatsapp_message" | "schedule" | "form_submit") => string;
  deleteWorkflow: (id: string) => void;
  updateWorkflow: (id: string, updates: Partial<Workflow>) => void;
  
  // Node Layout & Link Connection Actions
  addStep: (workflowId: string, step: Omit<WorkflowStep, "id"> & { position?: { x: number; y: number } }) => void;
  updateStep: (workflowId: string, stepId: string, updates: Partial<WorkflowStep>) => void;
  removeStep: (workflowId: string, stepId: string) => void;
  addConnection: (workflowId: string, fromStepId: string, toStepId: string) => void;
  removeConnection: (workflowId: string, fromStepId: string, toStepId: string) => void;
  
  // History Undo / Redo Actions
  pushToHistory: (workflowId: string) => void;
  undo: (workflowId: string) => void;
  redo: (workflowId: string) => void;

  // Debugger Actions
  addWorkflowRun: (run: Omit<WorkflowRun, "id" | "startedAt">) => void;

  // Version Control Actions
  saveVersion: (workflowId: string, name: string, description: string) => void;
  rollbackVersion: (workflowId: string, versionId: string) => void;

  // Collaboration Comments Actions
  addComment: (workflowId: string, author: string, text: string, nodeId?: string) => void;
  removeComment: (workflowId: string, commentId: string) => void;
}

const mockWorkflows: Workflow[] = [
  {
    id: "wf-1",
    userId: "u-1",
    name: "Lead Qualify - WhatsApp",
    description: "Automated WhatsApp lead filter and qualification chatbot that runs queries via gpt-4o-mini.",
    isActive: true,
    successRate: 98,
    totalRuns: 320,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    envVariables: {
      "DEFAULT_LANGUAGE": "English",
      "SUPPORT_HOTLINE": "+91 99999 88888"
    },
    secrets: {
      "CRM_API_KEY": "••••••••••••••••"
    },
    steps: [
      {
        id: "step-1",
        type: "trigger",
        label: "WhatsApp Message Received",
        description: "Triggers on incoming messages containing key phrases.",
        position: { x: 100, y: 150 },
        nextStepIds: ["step-2"],
        config: { triggerType: "whatsapp_message", keyword: "quote" },
      },
      {
        id: "step-2",
        type: "ai_prompt",
        label: "Qualify Intent (AI)",
        description: "Analyze lead query text using OpenAI GPT-4o-mini.",
        position: { x: 380, y: 150 },
        nextStepIds: ["step-3"],
        config: { provider: "openai", modelName: "gpt-4o-mini", promptTemplate: "Determine if the user is asking for custom corporate rates: {{lastMessage}}." },
      },
      {
        id: "step-3",
        type: "action",
        label: "Dispatch WhatsApp Confirmation",
        description: "Send WhatsApp approved template confirmation response.",
        position: { x: 660, y: 150 },
        nextStepIds: [],
        config: { actionType: "whatsapp_template", templateId: "tpl-1" },
      },
    ],
    versions: [
      {
        id: "v-1-1",
        versionNumber: 1,
        name: "Initial Draft Deploy",
        description: "Baseline sequence with triggers and message templates.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
        steps: [
          {
            id: "step-1",
            type: "trigger",
            label: "WhatsApp Message Received",
            description: "Triggers on incoming messages containing key phrases.",
            position: { x: 100, y: 150 },
            nextStepIds: ["step-2"],
            config: { triggerType: "whatsapp_message", keyword: "quote" },
          },
          {
            id: "step-2",
            type: "ai_prompt",
            label: "Qualify Intent (AI)",
            description: "Analyze lead query text using OpenAI GPT-4o-mini.",
            position: { x: 380, y: 150 },
            nextStepIds: [],
            config: { provider: "openai", modelName: "gpt-4o-mini", promptTemplate: "Determine if the user is asking for custom corporate rates: {{lastMessage}}." },
          }
        ]
      }
    ],
    comments: [
      {
        id: "c-1-1",
        nodeId: "step-2",
        author: "Arjun (Lead)",
        text: "Make sure we tune the temperature to 0.3 for precision in qualification.",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24).toLocaleDateString()
      }
    ]
  },
  {
    id: "wf-2",
    userId: "u-1",
    name: "Weekly Reporting AI",
    description: "Consolidates weekly logs, generates PDF metrics summaries, and alerts channels.",
    isActive: true,
    successRate: 100,
    totalRuns: 45,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    envVariables: {},
    secrets: {},
    steps: [
      {
        id: "step-4",
        type: "trigger",
        label: "Schedule Trigger (Cron)",
        description: "Runs automatically every Monday morning.",
        position: { x: 100, y: 150 },
        nextStepIds: ["step-5"],
        config: { triggerType: "schedule", cronExpression: "0 9 * * 1" },
      },
      {
        id: "step-5",
        type: "ai_prompt",
        label: "Aggregate Metrics Summary (AI)",
        description: "Summarize weekly runs counts using Claude 3.5 Sonnet.",
        position: { x: 380, y: 150 },
        nextStepIds: ["step-6"],
        config: { provider: "anthropic", modelName: "claude-3-5-sonnet", promptTemplate: "Summarize weekly CRM data and generate a PDF markdown." },
      },
      {
        id: "step-6",
        type: "action",
        label: "CRM Salesforce Sync",
        description: "Invokes backend data updates to synced customer profiles.",
        position: { x: 660, y: 150 },
        nextStepIds: [],
        config: { actionType: "crm_sync" },
      },
    ],
    versions: [],
    comments: []
  },
  {
    id: "wf-3",
    userId: "u-1",
    name: "Sync CRM Contacts",
    description: "Updates Salesforce customer profiles whenever data triggers fire.",
    isActive: false,
    successRate: 92,
    totalRuns: 1205,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    envVariables: {},
    secrets: {},
    steps: [
      {
        id: "step-7",
        type: "trigger",
        label: "Workspace Member Onboarded",
        description: "Triggers when a new client details are synced.",
        position: { x: 100, y: 150 },
        nextStepIds: ["step-8"],
        config: { triggerType: "webhook" },
      },
      {
        id: "step-8",
        type: "action",
        label: "Sync HubSpot Profile",
        description: "Create/Update record contact logs.",
        position: { x: 380, y: 150 },
        nextStepIds: [],
        config: { actionType: "crm_sync" },
      },
    ],
    versions: [],
    comments: []
  },
  {
    id: "wf-4",
    userId: "u-1",
    name: "Invoice Follow-up",
    description: "Triggers payment reminders via Stripe configuration webhook alerts.",
    isActive: true,
    successRate: 96,
    totalRuns: 88,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    envVariables: {},
    secrets: {},
    steps: [
      {
        id: "step-9",
        type: "trigger",
        label: "Stripe Payment Overdue",
        description: "Triggers on payment status failures.",
        position: { x: 100, y: 150 },
        nextStepIds: ["step-10"],
        config: { triggerType: "webhook" },
      },
      {
        id: "step-10",
        type: "action",
        label: "Create Stripe Invoice Reminder",
        description: "Generates localized payment link requests.",
        position: { x: 380, y: 150 },
        nextStepIds: [],
        config: { actionType: "stripe_invoice" },
      },
    ],
    versions: [],
    comments: []
  },
];

const mockRuns: WorkflowRun[] = [
  {
    id: "run-1",
    workflowId: "wf-1",
    status: "success",
    startedAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    latencyMs: 1450,
    logs: [
      "[TRIGGER] Inbound message received from +91 99999 88888 containing 'quote'.",
      "[AI NODE] Prompt dispatched to OpenAI (gpt-4o-mini). Latency: 650ms.",
      "[AI NODE] Intent resolved: User is requesting rates quote confirmation.",
      "[ACTION] Dispatched WhatsApp Approved Template Confirmation (tpl-1).",
      "[SUCCESS] Workflow execution finished. Status: 200 OK.",
    ],
  },
  {
    id: "run-2",
    workflowId: "wf-1",
    status: "failed",
    startedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    latencyMs: 980,
    logs: [
      "[TRIGGER] Inbound message received from +1 415-555-2671.",
      "[AI NODE] Prompt dispatched to OpenAI. Latency: 980ms.",
      "[ERROR] OpenAI API endpoint rate limit reached. Retrying aborted.",
      "[FAILED] Workflow execution terminated with error 429.",
    ],
  },
];

export const useWorkflows = create<WorkflowsState>((set, get) => ({
  workflows: mockWorkflows,
  runsHistory: mockRuns,
  activeWorkflowId: "wf-1",
  
  // Canvas Visual Local variables initial states
  panOffset: { x: 0, y: 0 },
  zoomLevel: 1.0,
  selectedStepId: null,
  selectedStepIds: [],
  undoStack: [],
  redoStack: [],

  setActiveWorkflowId: (id) => set({ 
    activeWorkflowId: id,
    selectedStepId: null,
    selectedStepIds: [],
    undoStack: [],
    redoStack: []
  }),

  setPanOffset: (pan) => set({ panOffset: pan }),
  setZoomLevel: (zoom) => set({ zoomLevel: zoom }),
  zoomIn: () => set((state) => ({ zoomLevel: Math.min(state.zoomLevel + 0.1, 2.0) })),
  zoomOut: () => set((state) => ({ zoomLevel: Math.max(state.zoomLevel - 0.1, 0.4) })),
  centerCanvas: () => set({ panOffset: { x: 0, y: 0 }, zoomLevel: 1.0 }),
  setSelectedStepId: (id) => set({ selectedStepId: id }),
  setSelectedStepIds: (ids) => set({ selectedStepIds: ids }),

  toggleWorkflow: (id) =>
    set((state) => ({
      workflows: state.workflows.map((w) =>
        w.id === id ? { ...w, isActive: !w.isActive, updatedAt: new Date().toISOString() } : w
      ),
    })),

  addWorkflow: (name, description, triggerType) => {
    const id = `wf-${Math.random().toString(36).substring(2, 9)}`;
    const now = new Date().toISOString();
    
    // Add default trigger step
    const defaultTriggerStep: WorkflowStep = {
      id: `step-${Math.random().toString(36).substring(2, 9)}`,
      type: "trigger",
      label: triggerType === "whatsapp_message" ? "WhatsApp Message Received" : triggerType === "schedule" ? "Schedule Trigger (Cron)" : "Form Submission Received",
      description: "Auto-generated baseline entry gate.",
      position: { x: 100, y: 150 },
      nextStepIds: [],
      config: { triggerType: triggerType === "form_submit" ? "webhook" : triggerType as any },
    };

    const newWorkflow: Workflow = {
      id,
      userId: "u-1",
      name,
      description,
      isActive: true,
      successRate: 100,
      totalRuns: 0,
      steps: [defaultTriggerStep],
      versions: [],
      comments: [],
      envVariables: {},
      secrets: {},
      createdAt: now,
      updatedAt: now,
    };

    set((state) => ({
      workflows: [newWorkflow, ...state.workflows],
      activeWorkflowId: id,
    }));
    return id;
  },

  deleteWorkflow: (id) =>
    set((state) => ({
      workflows: state.workflows.filter((w) => w.id !== id),
      activeWorkflowId: state.activeWorkflowId === id ? null : state.activeWorkflowId,
    })),

  updateWorkflow: (id, updates) =>
    set((state) => ({
      workflows: state.workflows.map((w) =>
        w.id === id ? { ...w, ...updates, updatedAt: new Date().toISOString() } : w
      ),
    })),

  // Node actions
  addStep: (workflowId, step) => {
    get().pushToHistory(workflowId);
    
    set((state) => {
      const newStep: WorkflowStep = {
        ...step,
        id: `step-${Math.random().toString(36).substring(2, 9)}`,
        position: step.position || { x: 250, y: 150 },
        nextStepIds: step.nextStepIds || [],
      };
      
      return {
        workflows: state.workflows.map((w) =>
          w.id === workflowId
            ? {
                ...w,
                steps: [...w.steps, newStep],
                updatedAt: new Date().toISOString(),
              }
            : w
        ),
      };
    });
  },

  updateStep: (workflowId, stepId, updates) =>
    set((state) => ({
      workflows: state.workflows.map((w) =>
        w.id === workflowId
          ? {
              ...w,
              steps: w.steps.map((s) => (s.id === stepId ? { ...s, ...updates } : s)),
              updatedAt: new Date().toISOString(),
            }
          : w
      ),
    })),

  removeStep: (workflowId, stepId) => {
    get().pushToHistory(workflowId);
    
    set((state) => ({
      workflows: state.workflows.map((w) =>
        w.id === workflowId
          ? {
              ...w,
              // Filter out the step, and also clean up any connections pointing to this stepId
              steps: w.steps
                .filter((s) => s.id !== stepId)
                .map((s) => ({
                  ...s,
                  nextStepIds: s.nextStepIds?.filter((nid) => nid !== stepId) || [],
                })),
              updatedAt: new Date().toISOString(),
            }
          : w
      ),
      selectedStepId: state.selectedStepId === stepId ? null : state.selectedStepId,
    }));
  },

  addConnection: (workflowId, fromStepId, toStepId) => {
    get().pushToHistory(workflowId);
    
    set((state) => ({
      workflows: state.workflows.map((w) =>
        w.id === workflowId
          ? {
              ...w,
              steps: w.steps.map((s) => {
                if (s.id === fromStepId) {
                  const currentNext = s.nextStepIds || [];
                  if (currentNext.includes(toStepId)) return s;
                  return { ...s, nextStepIds: [...currentNext, toStepId] };
                }
                return s;
              }),
              updatedAt: new Date().toISOString(),
            }
          : w
      ),
    }));
  },

  removeConnection: (workflowId, fromStepId, toStepId) => {
    get().pushToHistory(workflowId);
    
    set((state) => ({
      workflows: state.workflows.map((w) =>
        w.id === workflowId
          ? {
              ...w,
              steps: w.steps.map((s) => {
                if (s.id === fromStepId) {
                  return {
                    ...s,
                    nextStepIds: (s.nextStepIds || []).filter((id) => id !== toStepId),
                  };
                }
                return s;
              }),
              updatedAt: new Date().toISOString(),
            }
          : w
      ),
    }));
  },

  // Undo / Redo Stacks
  pushToHistory: (workflowId) => {
    const wf = get().workflows.find((w) => w.id === workflowId);
    if (!wf) return;
    
    // Copy steps list
    const stepsSnapshot = JSON.parse(JSON.stringify(wf.steps));
    
    set((state) => ({
      undoStack: [...state.undoStack, stepsSnapshot],
      redoStack: [], // Clear redo stack on new action
    }));
  },

  undo: (workflowId) => {
    const undoStack = get().undoStack;
    if (undoStack.length === 0) return;
    
    const previousSteps = undoStack[undoStack.length - 1];
    const newUndoStack = undoStack.slice(0, -1);
    
    const wf = get().workflows.find((w) => w.id === workflowId);
    if (!wf) return;
    
    const currentStepsSnapshot = JSON.parse(JSON.stringify(wf.steps));

    set((state) => ({
      undoStack: newUndoStack,
      redoStack: [...state.redoStack, currentStepsSnapshot],
      workflows: state.workflows.map((w) =>
        w.id === workflowId ? { ...w, steps: previousSteps, updatedAt: new Date().toISOString() } : w
      ),
    }));
  },

  redo: (workflowId) => {
    const redoStack = get().redoStack;
    if (redoStack.length === 0) return;
    
    const nextSteps = redoStack[redoStack.length - 1];
    const newRedoStack = redoStack.slice(0, -1);
    
    const wf = get().workflows.find((w) => w.id === workflowId);
    if (!wf) return;
    
    const currentStepsSnapshot = JSON.parse(JSON.stringify(wf.steps));

    set((state) => ({
      redoStack: newRedoStack,
      undoStack: [...state.undoStack, currentStepsSnapshot],
      workflows: state.workflows.map((w) =>
        w.id === workflowId ? { ...w, steps: nextSteps, updatedAt: new Date().toISOString() } : w
      ),
    }));
  },

  // Debugger Execution runs
  addWorkflowRun: (run) => {
    const id = `run-${Math.random().toString(36).substring(2, 9)}`;
    const newRun: WorkflowRun = {
      ...run,
      id,
      startedAt: new Date().toISOString(),
    };

    set((state) => {
      const updatedWorkflows = state.workflows.map((w) => {
        if (w.id === run.workflowId) {
          const totalRuns = w.totalRuns + 1;
          const successRuns = state.runsHistory.filter(r => r.workflowId === run.workflowId && r.status === "success").length + (run.status === "success" ? 1 : 0);
          const successRate = Math.round((successRuns / totalRuns) * 100);
          return {
            ...w,
            totalRuns,
            successRate,
            updatedAt: new Date().toISOString()
          };
        }
        return w;
      });

      return {
        runsHistory: [newRun, ...state.runsHistory],
        workflows: updatedWorkflows
      };
    });
  },

  // Version Control
  saveVersion: (workflowId, name, description) => {
    set((state) => ({
      workflows: state.workflows.map((w) => {
        if (w.id === workflowId) {
          const currentVersions = w.versions || [];
          const nextVersionNum = currentVersions.length + 1;
          const newVersion: WorkflowVersion = {
            id: `v-${workflowId}-${Math.random().toString(36).substring(2, 6)}`,
            versionNumber: nextVersionNum,
            name,
            description,
            steps: JSON.parse(JSON.stringify(w.steps)),
            createdAt: new Date().toISOString(),
          };
          return {
            ...w,
            versions: [newVersion, ...currentVersions],
            updatedAt: new Date().toISOString(),
          };
        }
        return w;
      }),
    }));
  },

  rollbackVersion: (workflowId, versionId) => {
    set((state) => ({
      workflows: state.workflows.map((w) => {
        if (w.id === workflowId) {
          const targetVer = w.versions?.find((v) => v.id === versionId);
          if (!targetVer) return w;
          return {
            ...w,
            steps: JSON.parse(JSON.stringify(targetVer.steps)),
            updatedAt: new Date().toISOString(),
          };
        }
        return w;
      }),
    }));
  },

  // Collaboration Comments
  addComment: (workflowId, author, text, nodeId) => {
    set((state) => ({
      workflows: state.workflows.map((w) => {
        if (w.id === workflowId) {
          const newComment: WorkflowComment = {
            id: `c-${Math.random().toString(36).substring(2, 9)}`,
            nodeId,
            author,
            text,
            date: new Date().toLocaleDateString(),
          };
          return {
            ...w,
            comments: [newComment, ...(w.comments || [])],
            updatedAt: new Date().toISOString(),
          };
        }
        return w;
      }),
    }));
  },

  removeComment: (workflowId, commentId) => {
    set((state) => ({
      workflows: state.workflows.map((w) => {
        if (w.id === workflowId) {
          return {
            ...w,
            comments: (w.comments || []).filter((c) => c.id !== commentId),
            updatedAt: new Date().toISOString(),
          };
        }
        return w;
      }),
    }));
  },
}));
