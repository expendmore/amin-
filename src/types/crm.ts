export type CustomFieldType =
  | "text"
  | "textarea"
  | "number"
  | "currency"
  | "email"
  | "phone"
  | "checkbox"
  | "radio"
  | "dropdown"
  | "date"
  | "time"
  | "multiselect"
  | "url"
  | "json";

export interface CustomFieldDefinition {
  id: string;
  name: string; // User-facing name (e.g. "VIP ID")
  type: CustomFieldType;
  options?: string[]; // For dropdown, radio, multiselect
  defaultValue?: any;
}

export interface CrmActivity {
  id: string;
  type: "message" | "call" | "email" | "whatsapp" | "workflow" | "ai" | "note" | "system";
  title: string;
  text: string;
  timestamp: string;
  actor?: string;
  details?: string;
}

export interface OrderPlaceholder {
  id: string;
  orderNumber: string;
  amount: number;
  currency: string;
  status: "fulfilled" | "unfulfilled" | "cancelled" | "refunded";
  date: string;
}

export interface InvoicePlaceholder {
  id: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: "paid" | "open" | "void" | "uncollectible";
  dueDate: string;
}

export interface ContactFile {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  url: string;
}

export type LifecycleStage =
  | "lead"
  | "qualified"
  | "customer"
  | "blocked"
  | "archived";

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  whatsappNumber: string;
  company: string;
  designation: string;
  source: string;
  owner: "Me" | "John" | "Sarah" | null;
  tags: string[];
  labels: string[]; // Color labels
  lifecycleStage: LifecycleStage;
  notes: string;
  timezone: string;
  language: string;
  address?: string;
  city?: string;
  country?: string;
  customFields: Record<string, any>; // key (definition id) -> value
  timeline: CrmActivity[];
  orders: OrderPlaceholder[];
  invoices: InvoicePlaceholder[];
  files: ContactFile[];
  createdAt: string;
  updatedAt: string;
}

export interface SmartSegment {
  id: string;
  name: string;
  description: string;
  rules: {
    field: string;
    operator: "equals" | "contains" | "greater_than" | "less_than" | "in_list";
    value: string;
  }[];
}
