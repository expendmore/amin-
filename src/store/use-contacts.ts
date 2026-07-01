import { create } from "zustand";
import {
  Contact,
  CustomFieldDefinition,
  SmartSegment,
  LifecycleStage,
  CrmActivity,
  OrderPlaceholder,
  InvoicePlaceholder,
  ContactFile,
} from "@/types/crm";

interface ContactsState {
  contacts: Contact[];
  customFields: CustomFieldDefinition[];
  segments: SmartSegment[];
  selectedContactIds: string[];
  activeContactId: string | null;
  loading: boolean;
  viewMode: "table" | "kanban" | "compact";

  // Search and Filter states
  searchQuery: string;
  lifecycleFilter: string; // "all" | LifecycleStage
  ownerFilter: string; // "all" | "Me" | "John" | "Sarah" | "unassigned"
  labelFilter: string; // "all" | labelName
  tagFilter: string; // "all" | tagName
  segmentFilter: string | null; // segmentId or null

  // Actions
  setViewMode: (mode: "table" | "kanban" | "compact") => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: {
    lifecycleFilter?: string;
    ownerFilter?: string;
    labelFilter?: string;
    tagFilter?: string;
    segmentFilter?: string | null;
  }) => void;

  setSelectedContactIds: (ids: string[]) => void;
  setActiveContactId: (id: string | null) => void;

  addContact: (
    contact: Omit<
      Contact,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "timeline"
      | "orders"
      | "invoices"
      | "files"
      | "customFields"
    > & { customFields?: Record<string, any> }
  ) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;

  // Bulk Actions
  bulkDelete: (ids: string[]) => void;
  bulkAssignOwner: (ids: string[], owner: "Me" | "John" | "Sarah" | null) => void;
  bulkAddTags: (ids: string[], tags: string[]) => void;
  bulkAddLabels: (ids: string[], labels: string[]) => void;
  bulkUpdateLifecycle: (ids: string[], stage: LifecycleStage) => void;
  bulkArchive: (ids: string[]) => void;
  bulkBlock: (ids: string[]) => void;

  // Custom Fields & Segments Actions
  addCustomField: (field: Omit<CustomFieldDefinition, "id">) => void;
  saveSmartSegment: (segment: Omit<SmartSegment, "id">) => void;
  deleteSmartSegment: (id: string) => void;

  // Import / Export Simulation
  importContacts: (contacts: Partial<Contact>[]) => void;
}

const mockCustomFields: CustomFieldDefinition[] = [
  { id: "cf-1", name: "Shopify Customer ID", type: "text" },
  { id: "cf-2", name: "Contract Value", type: "currency", defaultValue: 0 },
  { id: "cf-3", name: "Renewal Date", type: "date" },
  { id: "cf-4", name: "Opt-in Marketing", type: "checkbox", defaultValue: true },
];

const mockSegments: SmartSegment[] = [
  {
    id: "seg-1",
    name: "VIP Customers",
    description: "Customers who are in customer stage and tagged with VIP",
    rules: [
      { field: "lifecycleStage", operator: "equals", value: "customer" },
      { field: "tags", operator: "contains", value: "VIP" },
    ],
  },
  {
    id: "seg-2",
    name: "Unassigned Leads",
    description: "Leads with no owner assigned",
    rules: [
      { field: "lifecycleStage", operator: "equals", value: "lead" },
      { field: "owner", operator: "equals", value: "" },
    ],
  },
  {
    id: "seg-3",
    name: "Enterprise Accounts",
    description: "Contacts belonging to enterprise firms",
    rules: [{ field: "tags", operator: "contains", value: "Enterprise" }],
  },
];

const seedContacts = (): Contact[] => {
  const now = new Date().toISOString();
  return [
    {
      id: "c-1",
      name: "Rohan Kumar",
      phone: "+91 99999 88888",
      email: "rohan.kumar@shopifytech.in",
      whatsappNumber: "+91 99999 88888",
      company: "ShopifyTech India",
      designation: "Product Lead",
      source: "WhatsApp Inbound",
      owner: "Me",
      tags: ["VIP", "High Value", "Shopify"],
      labels: ["Blue", "Purple"],
      lifecycleStage: "customer",
      notes: "Met Rohan at the Retail Tech Summit. Interested in WhatsApp automation API integrations for customer checkout alerts.",
      timezone: "IST (UTC+5:30)",
      language: "Hindi, English",
      address: "MG Road Sector 4",
      city: "Gurugram",
      country: "India",
      customFields: { "cf-1": "shopify_9012", "cf-2": 2400, "cf-3": "2027-06-15" },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      files: [
        { id: "f-1", name: "whatsapp_specs_final.pdf", size: "1.2 MB", uploadedAt: "2026-06-10", url: "#" },
      ],
      orders: [
        { id: "o-1", orderNumber: "ORD-9872", amount: 1200, currency: "USD", status: "fulfilled", date: "2026-05-10" },
        { id: "o-2", orderNumber: "ORD-9954", amount: 1200, currency: "USD", status: "fulfilled", date: "2026-06-15" },
      ],
      invoices: [
        { id: "inv-1", invoiceNumber: "INV-2026-01", amount: 1200, currency: "USD", status: "paid", dueDate: "2026-05-15" },
        { id: "inv-2", invoiceNumber: "INV-2026-02", amount: 1200, currency: "USD", status: "paid", dueDate: "2026-06-20" },
      ],
      timeline: [
        { id: "a-1", type: "system", title: "Contact Created", text: "Contact created automatically via WhatsApp inbound message", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180).toISOString() },
        { id: "a-2", type: "whatsapp", title: "WhatsApp Message Received", text: "Hello, we want to integrate WhatsApp Shopify templates.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180).toISOString() },
        { id: "a-3", type: "note", title: "Private Note Added", text: "Rohan is evaluating our pricing tier. Needs Business features.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 150).toISOString(), actor: "Me" },
        { id: "a-4", type: "workflow", title: "Workflow Triggered", text: "WhatsApp Welcome Onboarding Flow finished successfully", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString() },
        { id: "a-5", type: "ai", title: "AI Interaction", text: "AI auto-replied with pricing and checkout guidelines.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString() },
      ],
    },
    {
      id: "c-2",
      name: "Sarah Jenkins",
      phone: "+1 415-555-2671",
      email: "sjenkins@metacreative.co",
      whatsappNumber: "+1 415-555-2671",
      company: "Meta Creative Agency",
      designation: "Founder",
      source: "Google Ads",
      owner: "John",
      tags: ["Creative", "Agency", "Enterprise"],
      labels: ["Green"],
      lifecycleStage: "qualified",
      notes: "Billing questions regarding multiple client campaign triggers.",
      timezone: "PST (UTC-8:00)",
      language: "English",
      address: "555 Market St Suite 10",
      city: "San Francisco",
      country: "USA",
      customFields: { "cf-2": 5000, "cf-3": "2027-01-10" },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      files: [],
      orders: [],
      invoices: [],
      timeline: [
        { id: "a-6", type: "system", title: "Lead Inbound", text: "Contact created via landing page form submission", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString() },
        { id: "a-7", type: "call", title: "Discovery Call Logged", text: "Discussed Meta Creative campaign scaling. Target: 100k messages monthly.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 85).toISOString(), actor: "John" },
      ],
    },
    {
      id: "c-3",
      name: "Amit Patel",
      phone: "+91 90000 11111",
      email: "amit.patel@mumbaiweb.org",
      whatsappNumber: "+91 90000 11111",
      company: "Mumbai Web Solutions",
      designation: "Director",
      source: "Organic Search",
      owner: null,
      tags: ["Lead", "Shopify"],
      labels: ["Yellow"],
      lifecycleStage: "lead",
      notes: "Looking for simple transactional alerts.",
      timezone: "IST (UTC+5:30)",
      language: "English, Gujarati",
      address: "12 Bandra Kurla Complex",
      city: "Mumbai",
      country: "India",
      customFields: { "cf-1": "shopify_5631", "cf-4": false },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      files: [],
      orders: [],
      invoices: [],
      timeline: [
        { id: "a-8", type: "system", title: "Contact Created", text: "Contact created manually in team console", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString() },
      ],
    },
    {
      id: "c-4",
      name: "Elena Rostova",
      phone: "+7 901-555-0143",
      email: "e.rostova@siberianlogistic.ru",
      whatsappNumber: "+7 901-555-0143",
      company: "Siberian Logistics",
      designation: "Head of Support",
      source: "Referral",
      owner: "Sarah",
      tags: ["Enterprise", "Support Focus"],
      labels: ["Red"],
      lifecycleStage: "customer",
      notes: "Requires WhatsApp template support in Cyrillic. Multi-agent routing settings configuration is ongoing.",
      timezone: "MSK (UTC+3:00)",
      language: "Russian, English",
      address: "10 Leningradsky Ave",
      city: "Moscow",
      country: "Russia",
      customFields: { "cf-2": 9600 },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      files: [
        { id: "f-2", name: "siberian_logistics_contract.pdf", size: "3.5 MB", uploadedAt: "2026-04-10", url: "#" },
      ],
      orders: [
        { id: "o-3", orderNumber: "ORD-9201", amount: 4800, currency: "USD", status: "fulfilled", date: "2026-03-01" },
        { id: "o-4", orderNumber: "ORD-9531", amount: 4800, currency: "USD", status: "fulfilled", date: "2026-05-15" },
      ],
      invoices: [
        { id: "inv-3", invoiceNumber: "INV-2026-09", amount: 4800, currency: "USD", status: "paid", dueDate: "2026-03-10" },
        { id: "inv-4", invoiceNumber: "INV-2026-10", amount: 4800, currency: "USD", status: "paid", dueDate: "2026-05-20" },
      ],
      timeline: [
        { id: "a-9", type: "system", title: "Import Successful", text: "Contact details imported successfully", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString() },
        { id: "a-10", type: "email", title: "Contract Signed", text: "Siberian logistics contract signed by Elena", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 115).toISOString() },
      ],
    },
    {
      id: "c-5",
      name: "Marcus Aurelius",
      phone: "+39 06-555-0100",
      email: "marcus.aurelius@rome.it",
      whatsappNumber: "+39 06-555-0100",
      company: "Rome Empire Consulting",
      designation: "Strategic Advisor",
      source: "Partner Channel",
      owner: "Me",
      tags: ["VIP", "Strategic Advisor"],
      labels: ["Purple"],
      lifecycleStage: "blocked",
      notes: "Account blocked temporary due to message frequency policy violations.",
      timezone: "CET (UTC+1:00)",
      language: "Italian, Latin",
      address: "1 Forum Romanum Way",
      city: "Rome",
      country: "Italy",
      customFields: { "cf-2": 0 },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 300).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      files: [],
      orders: [],
      invoices: [],
      timeline: [
        { id: "a-11", type: "system", title: "Policy Block", text: "Account automatically flagged and suspended due to heavy outbound alerts spam.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString() },
      ],
    },
  ];
};

export const useContacts = create<ContactsState>((set, get) => ({
  contacts: seedContacts(),
  customFields: mockCustomFields,
  segments: mockSegments,
  selectedContactIds: [],
  activeContactId: null,
  loading: false,
  viewMode: "table",

  searchQuery: "",
  lifecycleFilter: "all",
  ownerFilter: "all",
  labelFilter: "all",
  tagFilter: "all",
  segmentFilter: null,

  setViewMode: (viewMode) => set({ viewMode }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setFilters: (filters) => set((state) => ({ ...state, ...filters })),
  setSelectedContactIds: (selectedContactIds) => set({ selectedContactIds }),
  setActiveContactId: (activeContactId) => set({ activeContactId }),

  addContact: (contactData) =>
    set((state) => {
      const now = new Date().toISOString();
      const newContact: Contact = {
        ...contactData,
        id: `c-${Math.random().toString(36).substring(2, 9)}`,
        customFields: contactData.customFields || {},
        timeline: [
          {
            id: `a-${Math.random().toString(36).substring(2, 9)}`,
            type: "system",
            title: "Contact Created",
            text: "Contact created manually in CRM console",
            timestamp: now,
          },
        ],
        orders: [],
        invoices: [],
        files: [],
        createdAt: now,
        updatedAt: now,
      };

      return {
        contacts: [newContact, ...state.contacts],
      };
    }),

  updateContact: (id, updates) =>
    set((state) => {
      const updatedContacts = state.contacts.map((c) => {
        if (c.id === id) {
          const now = new Date().toISOString();
          const activity: CrmActivity = {
            id: `a-${Math.random().toString(36).substring(2, 9)}`,
            type: "system",
            title: "Contact Updated",
            text: "Fields modified in workspace",
            timestamp: now,
          };
          return {
            ...c,
            ...updates,
            timeline: [activity, ...c.timeline],
            updatedAt: now,
          };
        }
        return c;
      });

      return { contacts: updatedContacts };
    }),

  deleteContact: (id) =>
    set((state) => ({
      contacts: state.contacts.filter((c) => c.id !== id),
      activeContactId: state.activeContactId === id ? null : state.activeContactId,
      selectedContactIds: state.selectedContactIds.filter((cid) => cid !== id),
    })),

  // Bulk Operations
  bulkDelete: (ids) =>
    set((state) => ({
      contacts: state.contacts.filter((c) => !ids.includes(c.id)),
      selectedContactIds: [],
      activeContactId:
        state.activeContactId && ids.includes(state.activeContactId)
          ? null
          : state.activeContactId,
    })),

  bulkAssignOwner: (ids, owner) =>
    set((state) => {
      const now = new Date().toISOString();
      const updated = state.contacts.map((c) => {
        if (ids.includes(c.id)) {
          const act: CrmActivity = {
            id: `a-${Math.random().toString(36).substring(2, 9)}`,
            type: "system",
            title: "Owner Reassigned",
            text: `Contact owner set to ${owner || "Unassigned"} in bulk`,
            timestamp: now,
          };
          return { ...c, owner, timeline: [act, ...c.timeline], updatedAt: now };
        }
        return c;
      });
      return { contacts: updated, selectedContactIds: [] };
    }),

  bulkAddTags: (ids, newTags) =>
    set((state) => {
      const now = new Date().toISOString();
      const updated = state.contacts.map((c) => {
        if (ids.includes(c.id)) {
          const mergedTags = Array.from(new Set([...c.tags, ...newTags]));
          const act: CrmActivity = {
            id: `a-${Math.random().toString(36).substring(2, 9)}`,
            type: "system",
            title: "Tags Added",
            text: `Bulk added tags: ${newTags.join(", ")}`,
            timestamp: now,
          };
          return { ...c, tags: mergedTags, timeline: [act, ...c.timeline], updatedAt: now };
        }
        return c;
      });
      return { contacts: updated, selectedContactIds: [] };
    }),

  bulkAddLabels: (ids, newLabels) =>
    set((state) => {
      const now = new Date().toISOString();
      const updated = state.contacts.map((c) => {
        if (ids.includes(c.id)) {
          const mergedLabels = Array.from(new Set([...c.labels, ...newLabels]));
          const act: CrmActivity = {
            id: `a-${Math.random().toString(36).substring(2, 9)}`,
            type: "system",
            title: "Labels Added",
            text: `Bulk added labels: ${newLabels.join(", ")}`,
            timestamp: now,
          };
          return { ...c, labels: mergedLabels, timeline: [act, ...c.timeline], updatedAt: now };
        }
        return c;
      });
      return { contacts: updated, selectedContactIds: [] };
    }),

  bulkUpdateLifecycle: (ids, stage) =>
    set((state) => {
      const now = new Date().toISOString();
      const updated = state.contacts.map((c) => {
        if (ids.includes(c.id)) {
          const act: CrmActivity = {
            id: `a-${Math.random().toString(36).substring(2, 9)}`,
            type: "system",
            title: "Lifecycle Stage Updated",
            text: `Stage changed to ${stage} in bulk`,
            timestamp: now,
          };
          return { ...c, lifecycleStage: stage, timeline: [act, ...c.timeline], updatedAt: now };
        }
        return c;
      });
      return { contacts: updated, selectedContactIds: [] };
    }),

  bulkArchive: (ids) => {
    get().bulkUpdateLifecycle(ids, "archived");
  },

  bulkBlock: (ids) => {
    get().bulkUpdateLifecycle(ids, "blocked");
  },

  addCustomField: (fieldData) =>
    set((state) => {
      const newField: CustomFieldDefinition = {
        ...fieldData,
        id: `cf-${Math.random().toString(36).substring(2, 9)}`,
      };
      return { customFields: [...state.customFields, newField] };
    }),

  saveSmartSegment: (segmentData) =>
    set((state) => {
      const newSegment: SmartSegment = {
        ...segmentData,
        id: `seg-${Math.random().toString(36).substring(2, 9)}`,
      };
      return { segments: [...state.segments, newSegment] };
    }),

  deleteSmartSegment: (id) =>
    set((state) => ({
      segments: state.segments.filter((s) => s.id !== id),
      segmentFilter: state.segmentFilter === id ? null : state.segmentFilter,
    })),

  // CSV Import Simulation
  importContacts: (incomingContacts) =>
    set((state) => {
      const now = new Date().toISOString();
      const newImported: Contact[] = incomingContacts.map((ic) => {
        const id = `c-${Math.random().toString(36).substring(2, 9)}`;
        return {
          id,
          name: ic.name || "Unnamed Import",
          phone: ic.phone || "",
          email: ic.email || "",
          whatsappNumber: ic.whatsappNumber || ic.phone || "",
          company: ic.company || "",
          designation: ic.designation || "",
          source: ic.source || "CSV Import",
          owner: ic.owner || null,
          tags: ic.tags || ["Imported"],
          labels: ic.labels || [],
          lifecycleStage: ic.lifecycleStage || "lead",
          notes: ic.notes || "",
          timezone: ic.timezone || "UTC",
          language: ic.language || "English",
          address: ic.address || "",
          city: ic.city || "",
          country: ic.country || "",
          customFields: ic.customFields || {},
          timeline: [
            {
              id: `a-${Math.random().toString(36).substring(2, 9)}`,
              type: "system",
              title: "Contact Imported",
              text: "Imported via CSV/JSON Upload manager",
              timestamp: now,
            },
          ],
          orders: [],
          invoices: [],
          files: [],
          createdAt: now,
          updatedAt: now,
        };
      });

      return {
        contacts: [...newImported, ...state.contacts],
      };
    }),
}));
