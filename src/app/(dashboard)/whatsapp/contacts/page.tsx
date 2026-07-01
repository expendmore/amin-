"use client";

import React, { useState, useMemo, useRef } from "react";
import DashboardShell from "@/components/navigation/DashboardShell";
import Card from "@/components/ui/Card";
import StatusChip from "@/components/ui/StatusChip";
import Toggle from "@/components/ui/Toggle";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import { useDashboard } from "@/store/use-dashboard";
import { useContacts } from "@/store/use-contacts";
import { Contact, CustomFieldDefinition, SmartSegment, LifecycleStage, CrmActivity } from "@/types/crm";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserPlus,
  Upload,
  Download,
  Search,
  Filter,
  Layers,
  Table as TableIcon,
  Kanban as KanbanIcon,
  List as ListIcon,
  Settings,
  ChevronRight,
  ChevronLeft,
  X,
  Plus,
  Trash2,
  Lock,
  Mail,
  Phone,
  Building,
  Briefcase,
  Globe,
  Clock,
  Activity,
  FileText,
  DollarSign,
  TrendingUp,
  Award,
  AlertOctagon,
  Eye,
  Check,
  CheckCheck,
  Info,
  Calendar,
  Sparkles,
  HelpCircle,
  Folder,
  Tag as TagIcon,
  UserCheck,
  ShieldAlert,
  ArrowUpDown,
  BookOpen,
  Share2,
  FileDown
} from "lucide-react";

export default function ContactsCrmPage() {
  const { addToast } = useToast();
  const { profile } = useDashboard();
  
  // Contacts Store Selectors
  const {
    contacts,
    customFields,
    segments,
    selectedContactIds,
    activeContactId,
    viewMode,
    searchQuery,
    lifecycleFilter,
    ownerFilter,
    labelFilter,
    tagFilter,
    segmentFilter,
    setViewMode,
    setSearchQuery,
    setFilters,
    setSelectedContactIds,
    setActiveContactId,
    addContact,
    updateContact,
    deleteContact,
    bulkDelete,
    bulkAssignOwner,
    bulkAddTags,
    bulkAddLabels,
    bulkUpdateLifecycle,
    addCustomField,
    saveSmartSegment,
    deleteSmartSegment,
    importContacts
  } = useContacts();

  // Navigation tab: directory | dashboard | segments
  const [activeTab, setActiveTab] = useState<"directory" | "dashboard" | "segments">("directory");

  // Modals visibility states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showCustomFieldsModal, setShowCustomFieldsModal] = useState(false);
  const [showSegmentModal, setShowSegmentModal] = useState(false);

  // Sorting
  const [sortField, setSortField] = useState<keyof Contact>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Drawer detail tabs: overview | timeline | orders | fields | files
  const [activeDrawerTab, setActiveDrawerTab] = useState<"overview" | "timeline" | "orders" | "fields" | "files">("overview");

  // Form states - Create Contact
  const [createForm, setCreateForm] = useState({
    name: "",
    phone: "",
    email: "",
    whatsappNumber: "",
    company: "",
    designation: "",
    source: "Manual",
    owner: "Me" as "Me" | "John" | "Sarah" | null,
    lifecycleStage: "lead" as LifecycleStage,
    notes: "",
    timezone: "IST (UTC+5:30)",
    language: "English",
    address: "",
    city: "",
    country: "",
    customFields: {} as Record<string, any>
  });

  // Custom Field Form
  const [customFieldForm, setCustomFieldForm] = useState({
    name: "",
    type: "text" as any,
    optionsString: "", // comma separated
    defaultValue: ""
  });

  // Segment Builder Form
  const [segmentForm, setSegmentForm] = useState({
    name: "",
    description: "",
    field: "lifecycleStage",
    operator: "equals" as any,
    value: ""
  });

  // Import State
  const [csvFileContent, setCsvFileContent] = useState<string>("");
  const [importHeaders, setImportHeaders] = useState<string[]>([]);
  const [importMappings, setImportMappings] = useState<Record<string, string>>({});
  const [importPreviewRows, setImportPreviewRows] = useState<any[]>([]);

  // Local details notes state
  const [newNoteInput, setNewNoteInput] = useState("");
  const [newTagInput, setNewTagInput] = useState("");
  const [newLabelInput, setNewLabelInput] = useState("");
  const [activeContactCustomFieldEdits, setActiveContactCustomFieldEdits] = useState<Record<string, any>>({});

  // Active Contact selector
  const activeContact = useMemo(() => {
    return contacts.find((c) => c.id === activeContactId) || null;
  }, [contacts, activeContactId]);

  // Bulk options actions state
  const [bulkOwnerInput, setBulkOwnerInput] = useState("");
  const [bulkTagInput, setBulkTagInput] = useState("");
  const [bulkLabelInput, setBulkLabelInput] = useState("");
  const [bulkLifecycleInput, setBulkLifecycleInput] = useState("");

  // Column Customization visible columns
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    phone: true,
    email: true,
    company: true,
    owner: true,
    lifecycle: true,
    tags: true,
    labels: true
  });

  // Auto-save feedback visual timer
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  // Filtering Logic
  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      // 1. Search Query
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        c.name.toLowerCase().includes(searchLower) ||
        c.email.toLowerCase().includes(searchLower) ||
        c.phone.includes(searchLower) ||
        c.company.toLowerCase().includes(searchLower) ||
        c.designation.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;

      // 2. Lifecycle filter
      if (lifecycleFilter !== "all" && c.lifecycleStage !== lifecycleFilter) {
        return false;
      }

      // 3. Owner Filter
      if (ownerFilter !== "all") {
        if (ownerFilter === "unassigned" && c.owner !== null) return false;
        if (ownerFilter !== "unassigned" && c.owner !== ownerFilter) return false;
      }

      // 4. Label Filter
      if (labelFilter !== "all" && !c.labels.includes(labelFilter)) {
        return false;
      }

      // 5. Tag Filter
      if (tagFilter !== "all" && !c.tags.includes(tagFilter)) {
        return false;
      }

      // 6. Smart Segment filter
      if (segmentFilter) {
        const seg = segments.find((s) => s.id === segmentFilter);
        if (seg) {
          // Verify segment rules
          const ruleMatch = seg.rules.every((rule) => {
            const contactVal = (c as any)[rule.field];
            if (rule.operator === "equals") {
              return String(contactVal).toLowerCase() === rule.value.toLowerCase();
            }
            if (rule.operator === "contains") {
              if (Array.isArray(contactVal)) {
                return contactVal.some((v) => String(v).toLowerCase().includes(rule.value.toLowerCase()));
              }
              return String(contactVal).toLowerCase().includes(rule.value.toLowerCase());
            }
            return true;
          });
          if (!ruleMatch) return false;
        }
      }

      return true;
    });
  }, [contacts, searchQuery, lifecycleFilter, ownerFilter, labelFilter, tagFilter, segmentFilter, segments]);

  // Sorting Logic
  const sortedContacts = useMemo(() => {
    const sorted = [...filteredContacts];
    sorted.sort((a, b) => {
      let aVal = a[sortField] || "";
      let bVal = b[sortField] || "";

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredContacts, sortField, sortDirection]);

  // Paginated contacts
  const paginatedContacts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedContacts.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedContacts, currentPage]);

  const totalPages = Math.ceil(sortedContacts.length / itemsPerPage);

  // Growth Analytics Calculations
  const stats = useMemo(() => {
    const total = contacts.length;
    const leads = contacts.filter((c) => c.lifecycleStage === "lead").length;
    const qualified = contacts.filter((c) => c.lifecycleStage === "qualified").length;
    const customers = contacts.filter((c) => c.lifecycleStage === "customer").length;
    const blocked = contacts.filter((c) => c.lifecycleStage === "blocked").length;
    const archived = contacts.filter((c) => c.lifecycleStage === "archived").length;

    // Lead conversion rate
    const conversion = total > 0 ? Math.round(((customers + qualified) / total) * 100) : 0;

    return { total, leads, qualified, customers, blocked, archived, conversion };
  }, [contacts]);

  // Handle Sort
  const requestSort = (field: keyof Contact) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Create Contact submit
  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name || !createForm.phone) {
      addToast("Name and Phone Number are required.", "error");
      return;
    }
    addContact({
      ...createForm,
      whatsappNumber: createForm.whatsappNumber || createForm.phone,
      labels: [],
      tags: []
    });
    addToast(`Contact ${createForm.name} created successfully.`, "success");
    setShowCreateModal(false);
    // Reset Form
    setCreateForm({
      name: "",
      phone: "",
      email: "",
      whatsappNumber: "",
      company: "",
      designation: "",
      source: "Manual",
      owner: "Me",
      lifecycleStage: "lead",
      notes: "",
      timezone: "IST (UTC+5:30)",
      language: "English",
      address: "",
      city: "",
      country: "",
      customFields: {}
    });
  };

  // Autosaving inline updates
  const handleInlineUpdate = (field: keyof Contact, value: any) => {
    if (!activeContactId) return;
    setSaveStatus("saving");
    
    // Simulate database network delay
    setTimeout(() => {
      updateContact(activeContactId, { [field]: value });
      setSaveStatus("saved");
      addToast("Contact auto-saved successfully.", "success");
      setTimeout(() => setSaveStatus("idle"), 1500);
    }, 800);
  };

  // Autosave custom field updates
  const handleCustomFieldUpdate = (fieldId: string, value: any) => {
    if (!activeContactId || !activeContact) return;
    setSaveStatus("saving");
    
    setTimeout(() => {
      const updatedFields = {
        ...activeContact.customFields,
        [fieldId]: value
      };
      updateContact(activeContactId, { customFields: updatedFields });
      setSaveStatus("saved");
      addToast("Custom fields updated.", "success");
      setTimeout(() => setSaveStatus("idle"), 1500);
    }, 800);
  };

  // Add tag in drawer
  const handleAddTagInDrawer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagInput.trim() || !activeContact) return;
    if (activeContact.tags.includes(newTagInput.trim())) {
      addToast("Tag already exists.", "info");
      return;
    }
    const updatedTags = [...activeContact.tags, newTagInput.trim()];
    updateContact(activeContact.id, { tags: updatedTags });
    setNewTagInput("");
    addToast("Tag added.", "success");
  };

  // Add label in drawer
  const handleAddLabelInDrawer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabelInput.trim() || !activeContact) return;
    if (activeContact.labels.includes(newLabelInput.trim())) {
      addToast("Label already exists.", "info");
      return;
    }
    const updatedLabels = [...activeContact.labels, newLabelInput.trim()];
    updateContact(activeContact.id, { labels: updatedLabels });
    setNewLabelInput("");
    addToast("Label added.", "success");
  };

  // Log private timeline note
  const handlePostTimelineNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteInput.trim() || !activeContact) return;
    
    const newAct: CrmActivity = {
      id: `a-${Math.random().toString(36).substring(2, 9)}`,
      type: "note",
      title: "Note Recorded",
      text: newNoteInput.trim(),
      timestamp: new Date().toISOString(),
      actor: "Me"
    };

    const updatedTimeline = [newAct, ...activeContact.timeline];
    updateContact(activeContact.id, { timeline: updatedTimeline });
    setNewNoteInput("");
    addToast("Timeline activity logged.", "success");
  };

  // Custom Fields Creator Submit
  const handleAddCustomField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customFieldForm.name) return;
    
    let defaultValue: any = customFieldForm.defaultValue;
    if (customFieldForm.type === "checkbox") {
      defaultValue = customFieldForm.defaultValue === "true";
    } else if (customFieldForm.type === "number" || customFieldForm.type === "currency") {
      defaultValue = Number(customFieldForm.defaultValue) || 0;
    }

    addCustomField({
      name: customFieldForm.name,
      type: customFieldForm.type,
      options: customFieldForm.optionsString
        ? customFieldForm.optionsString.split(",").map((s) => s.trim())
        : undefined,
      defaultValue
    });

    addToast(`Custom Field "${customFieldForm.name}" created successfully.`, "success");
    setShowCustomFieldsModal(false);
    setCustomFieldForm({
      name: "",
      type: "text",
      optionsString: "",
      defaultValue: ""
    });
  };

  // Smart Segment Builder Submit
  const handleCreateSegment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!segmentForm.name) return;

    saveSmartSegment({
      name: segmentForm.name,
      description: segmentForm.description,
      rules: [
        {
          field: segmentForm.field,
          operator: segmentForm.operator,
          value: segmentForm.value
        }
      ]
    });

    addToast(`Smart Segment "${segmentForm.name}" created.`, "success");
    setShowSegmentModal(false);
    setSegmentForm({
      name: "",
      description: "",
      field: "lifecycleStage",
      operator: "equals",
      value: ""
    });
  };

  // CSV Import mapping handler
  const handleCsvUploadSimulate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate CSV Reader
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvFileContent(text);
      // Hardcode mock parse CSV headers
      const mockHeaders = ["Name", "Phone", "Email", "Company", "Designation", "Source", "Lifecycle Stage"];
      setImportHeaders(mockHeaders);
      
      const defaultMappings: Record<string, string> = {
        Name: "name",
        Phone: "phone",
        Email: "email",
        Company: "company",
        Designation: "designation",
        Source: "source",
        "Lifecycle Stage": "lifecycleStage"
      };
      setImportMappings(defaultMappings);

      const mockRows = [
        { name: "John Doe", phone: "+1 555-102-3921", email: "johndoe@web.com", company: "Aero Corp", designation: "Engineer", source: "CSV Import", lifecycleStage: "lead" },
        { name: "Melissa Carter", phone: "+44 7911 123456", email: "melissa@carterinc.co.uk", company: "Carter Inc", designation: "VP Operations", source: "CSV Import", lifecycleStage: "qualified" },
        { name: "Kenji Sato", phone: "+81 90-1234-5678", email: "k.sato@tokyotech.jp", company: "Tokyo Tech", designation: "Architect", source: "CSV Import", lifecycleStage: "customer" }
      ];
      setImportPreviewRows(mockRows);
    };
    reader.readAsText(file);
  };

  const handleExecuteImport = () => {
    if (importPreviewRows.length === 0) return;
    importContacts(importPreviewRows);
    addToast(`${importPreviewRows.length} contacts imported successfully!`, "success");
    setShowImportModal(false);
    setCsvFileContent("");
    setImportPreviewRows([]);
  };

  // Export Mock Trigger
  const handleExportSimulate = (format: "csv" | "xlsx" | "json") => {
    addToast(`Exporting ${filteredContacts.length} contacts as ${format.toUpperCase()}...`, "info");
    
    // Simulate Download
    setTimeout(() => {
      const dataStr = JSON.stringify(filteredContacts, null, 2);
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `expendmore_crm_export_${new Date().toISOString().split("T")[0]}.${format}`;
      
      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();
      
      addToast("Export complete. File downloaded.", "success");
      setShowExportModal(false);
    }, 1200);
  };

  // Bulk operations executor
  const executeBulkAction = (action: "delete" | "assign" | "tag" | "label" | "lifecycle" | "archive" | "block") => {
    if (selectedContactIds.length === 0) return;

    if (action === "delete") {
      bulkDelete(selectedContactIds);
      addToast(`Deleted ${selectedContactIds.length} contacts.`, "success");
    } else if (action === "assign") {
      if (!bulkOwnerInput) return;
      bulkAssignOwner(selectedContactIds, (bulkOwnerInput === "unassigned" ? null : bulkOwnerInput) as any);
      addToast(`Reassigned ${selectedContactIds.length} contacts.`, "success");
      setBulkOwnerInput("");
    } else if (action === "tag") {
      if (!bulkTagInput.trim()) return;
      bulkAddTags(selectedContactIds, [bulkTagInput.trim()]);
      addToast(`Added tag to ${selectedContactIds.length} contacts.`, "success");
      setBulkTagInput("");
    } else if (action === "label") {
      if (!bulkLabelInput.trim()) return;
      bulkAddLabels(selectedContactIds, [bulkLabelInput.trim()]);
      addToast(`Added label to ${selectedContactIds.length} contacts.`, "success");
      setBulkLabelInput("");
    } else if (action === "lifecycle") {
      if (!bulkLifecycleInput) return;
      bulkUpdateLifecycle(selectedContactIds, bulkLifecycleInput as LifecycleStage);
      addToast(`Updated stage for ${selectedContactIds.length} contacts.`, "success");
      setBulkLifecycleInput("");
    } else if (action === "archive") {
      bulkUpdateLifecycle(selectedContactIds, "archived");
      addToast(`Archived ${selectedContactIds.length} contacts.`, "success");
    } else if (action === "block") {
      bulkUpdateLifecycle(selectedContactIds, "blocked");
      addToast(`Blocked ${selectedContactIds.length} contacts.`, "success");
    }
  };

  // Helper colors
  const getBadgeColor = (stage: LifecycleStage) => {
    switch (stage) {
      case "lead":
        return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
      case "qualified":
        return "bg-brand-sky-light/10 text-brand-sky border border-brand-sky/20";
      case "customer":
        return "bg-brand-green/10 text-brand-green border border-brand-green/20";
      case "blocked":
        return "bg-red-500/10 text-red-500 border border-red-500/20";
      case "archived":
        return "bg-zinc-800 text-zinc-400 border border-zinc-700/50";
      default:
        return "bg-zinc-800 text-zinc-300";
    }
  };

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6 max-w-full font-sans select-none pb-12 px-6 h-[calc(100vh-140px)] overflow-y-auto scrollbar-thin text-left">
        
        {/* TOP ACTION BAR BANNER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-border dark:border-border/40 pb-5 shrink-0">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-xl font-extrabold text-brand-navy dark:text-foreground tracking-tight">
              Customer Relationship Hub
            </h1>
            <p className="text-xs text-on-surface-variant font-medium">
              Manage custom CRM fields, smart pipelines, communication touchpoints and user tags.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 select-none">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCustomFieldsModal(true)}
              className="text-xs font-bold"
              leftIcon={<Settings className="h-4 w-4" />}
            >
              Fields Schema
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowImportModal(true)}
              className="text-xs font-bold"
              leftIcon={<Upload className="h-4 w-4" />}
            >
              Import CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExportModal(true)}
              className="text-xs font-bold"
              leftIcon={<Download className="h-4 w-4" />}
            >
              Export
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowCreateModal(true)}
              className="text-xs font-bold"
              leftIcon={<UserPlus className="h-4 w-4" />}
            >
              New Contact
            </Button>
          </div>
        </div>

        {/* CORE STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {[
            { label: "Total Contacts", value: stats.total, sub: "+12.4% vs last month", icon: Users, color: "text-brand-sky" },
            { label: "Active Leads", value: stats.leads, sub: "Qualified pipeline: " + stats.qualified, icon: Activity, color: "text-amber-500" },
            { label: "Active Customers", value: stats.customers, sub: "Loyal buyers", icon: Award, color: "text-brand-green" },
            { label: "Blocked Accounts", value: stats.blocked, sub: "Policy restrictions", icon: ShieldAlert, color: "text-red-500" },
            { label: "Archived Logs", value: stats.archived, sub: "Past campaigns", icon: BookOpen, color: "text-zinc-500" },
            { label: "Win Ratio", value: stats.conversion + "%", sub: "Lead-to-client velocity", icon: TrendingUp, color: "text-[#8B5CF6]" }
          ].map((item, idx) => (
            <Card key={idx} className="p-4 flex flex-col justify-between h-[105px]">
              <div className="flex justify-between items-start">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">{item.label}</span>
                <item.icon className={`h-4 w-4 ${item.color}`} />
              </div>
              <div className="flex flex-col mt-2">
                <span className="text-xl font-black text-foreground">{item.value}</span>
                <span className="text-[9px] text-muted-foreground mt-0.5 font-medium">{item.sub}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* WORKSPACE TAB CONTROLS */}
        <div className="flex border-b border-brand-border dark:border-border/40 select-none pb-0.5">
          {[
            { id: "directory", label: "Directory", icon: TableIcon },
            { id: "dashboard", label: "CRM Analytics", icon: Layers },
            { id: "segments", label: "Smart Segments", icon: Filter }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "border-brand-sky text-brand-sky font-extrabold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* WORKSPACE TAB RENDERING */}
        <div className="flex-grow">
          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-none">
              {/* Chart 1: Signup growth simulation */}
              <Card className="p-5 flex flex-col justify-between h-[360px]">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-foreground">Contact Inbound Growth Log</span>
                    <span className="text-[10px] text-muted-foreground">Rolling monthly contact acquisition volume</span>
                  </div>
                  <TrendingUp className="h-4 w-4 text-brand-green" />
                </div>
                {/* CSS Bar Chart */}
                <div className="flex items-end justify-between flex-grow h-[200px] border-b border-border/60 pb-2 px-4">
                  {[
                    { month: "Jan", val: 40 },
                    { month: "Feb", val: 65 },
                    { month: "Mar", val: 50 },
                    { month: "Apr", val: 90 },
                    { month: "May", val: 120 },
                    { month: "Jun", val: 145 }
                  ].map((bar, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 w-1/8">
                      <div
                        className="w-8 rounded-t bg-brand-sky hover:bg-brand-sky/80 transition-all duration-300 relative group cursor-pointer"
                        style={{ height: `${(bar.val / 160) * 100}%` }}
                      >
                        <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-[8px] font-bold px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {bar.val}
                        </span>
                      </div>
                      <span className="text-[9px] font-bold font-mono text-zinc-500">{bar.month}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 text-[9px] font-bold uppercase text-zinc-400 mt-2">
                  <span>Total Q1 volume: 155</span>
                  <span>Total Q2 volume: 385</span>
                </div>
              </Card>

              {/* Chart 2: Lead sources distribution */}
              <Card className="p-5 flex flex-col justify-between h-[360px]">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-foreground">Marketing Lead Channels</span>
                    <span className="text-[10px] text-muted-foreground">Primary acquisition channels breakdown</span>
                  </div>
                  <Globe className="h-4 w-4 text-brand-sky" />
                </div>
                <div className="flex flex-col gap-3 justify-center flex-grow pr-4 select-none">
                  {[
                    { source: "WhatsApp Inbound", count: 42, color: "bg-[#25D366]" },
                    { source: "Google Ads campaigns", count: 28, color: "bg-[#3B82F6]" },
                    { source: "Organic Web Searches", count: 18, color: "bg-[#8B5CF6]" },
                    { source: "Partners & Integrations", count: 12, color: "bg-[#EC4899]" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-1 w-full">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-foreground">{item.source}</span>
                        <span className="font-mono text-zinc-400">{item.count}%</span>
                      </div>
                      <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color}`} style={{ width: `${item.count}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <span className="text-[9px] font-bold text-zinc-500">Analytics calculated based on total indexed database count.</span>
              </Card>
            </div>
          )}

          {activeTab === "segments" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
              {segments.map((seg) => (
                <Card key={seg.id} className="p-5 flex flex-col justify-between h-[180px] border border-border">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <span className="font-extrabold text-foreground text-xs">{seg.name}</span>
                      <button
                        onClick={() => {
                          deleteSmartSegment(seg.id);
                          addToast(`Smart Segment "${seg.name}" deleted.`, "info");
                        }}
                        className="text-muted-foreground hover:text-red-500 transition-colors p-1 rounded"
                        title="Delete segment"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed truncate">{seg.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {seg.rules.map((rule, ri) => (
                        <span key={ri} className="bg-zinc-900/50 border border-border px-2 py-0.5 rounded text-[8px] font-mono text-zinc-300">
                          {rule.field} {rule.operator} "{rule.value}"
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => {
                      setFilters({ segmentFilter: seg.id });
                      setActiveTab("directory");
                      addToast(`Selected smart segment: ${seg.name}`, "info");
                    }}
                    className="w-full text-[9px] uppercase tracking-wider font-bold mt-2"
                  >
                    Load Filtered Directory
                  </Button>
                </Card>
              ))}
              
              {/* Create new segment card */}
              <button
                onClick={() => setShowSegmentModal(true)}
                className="flex flex-col items-center justify-center text-center p-5 border-2 border-dashed border-border/80 hover:border-brand-sky/60 bg-transparent rounded-xl transition-all cursor-pointer h-[180px] group"
              >
                <Plus className="h-6 w-6 text-muted-foreground group-hover:text-brand-sky transition-colors mb-2" />
                <span className="font-bold text-foreground text-xs">Build custom Segment</span>
                <p className="text-[9px] text-muted-foreground mt-1 max-w-[160px] leading-relaxed">
                  Specify field operations and matching tags to index active users dynamically.
                </p>
              </button>
            </div>
          )}

          {activeTab === "directory" && (
            <div className="flex flex-col gap-4">
              
              {/* FILTERS & SEARCH ROW */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-950/15 p-3 rounded-xl border border-border/40 select-none">
                
                {/* Search & views toggle */}
                <div className="flex items-center gap-3 flex-grow md:flex-none max-w-sm relative">
                  <Search className="h-4 w-4 absolute left-3 top-3.5 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search name, email, designation..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full h-10 pl-9 pr-3 bg-white dark:bg-zinc-900 border border-brand-border dark:border-border rounded-xl text-xs focus:outline-none focus:border-brand-sky text-foreground"
                  />
                </div>

                {/* Directory Controls Dropdowns */}
                <div className="flex flex-wrap items-center gap-2 select-none">
                  {/* Segment Select */}
                  <select
                    value={segmentFilter || ""}
                    onChange={(e) => {
                      setFilters({ segmentFilter: e.target.value || null });
                      setCurrentPage(1);
                    }}
                    className="h-9 px-3.5 bg-white border border-brand-border rounded-xl text-[10px] font-bold text-foreground cursor-pointer focus:outline-none"
                  >
                    <option value="">All Segments</option>
                    {segments.map((seg) => (
                      <option key={seg.id} value={seg.id}>{seg.name}</option>
                    ))}
                  </select>

                  {/* Lifecycle Filter */}
                  <select
                    value={lifecycleFilter}
                    onChange={(e) => {
                      setFilters({ lifecycleFilter: e.target.value });
                      setCurrentPage(1);
                    }}
                    className="h-9 px-3.5 bg-white border border-brand-border rounded-xl text-[10px] font-bold text-foreground cursor-pointer focus:outline-none"
                  >
                    <option value="all">All Stages</option>
                    <option value="lead">Leads</option>
                    <option value="qualified">Qualified Leads</option>
                    <option value="customer">Customers</option>
                    <option value="blocked">Blocked</option>
                    <option value="archived">Archived</option>
                  </select>

                  {/* Owner Filter */}
                  <select
                    value={ownerFilter}
                    onChange={(e) => {
                      setFilters({ ownerFilter: e.target.value });
                      setCurrentPage(1);
                    }}
                    className="h-9 px-3.5 bg-white border border-brand-border rounded-xl text-[10px] font-bold text-foreground cursor-pointer focus:outline-none"
                  >
                    <option value="all">All Owners</option>
                    <option value="Me">Me (Admin)</option>
                    <option value="John">John (Support)</option>
                    <option value="Sarah">Sarah (Creative)</option>
                    <option value="unassigned">Unassigned</option>
                  </select>

                  {/* Tag Filter */}
                  <select
                    value={tagFilter}
                    onChange={(e) => {
                      setFilters({ tagFilter: e.target.value });
                      setCurrentPage(1);
                    }}
                    className="h-9 px-3.5 bg-white border border-brand-border rounded-xl text-[10px] font-bold text-foreground cursor-pointer focus:outline-none"
                  >
                    <option value="all">All Tags</option>
                    {Array.from(new Set(contacts.flatMap((c) => c.tags))).map((t, idx) => (
                      <option key={idx} value={t}>{t}</option>
                    ))}
                  </select>

                  {/* Reset Filters */}
                  {(lifecycleFilter !== "all" || ownerFilter !== "all" || labelFilter !== "all" || tagFilter !== "all" || segmentFilter !== null) && (
                    <button
                      onClick={() => {
                        setFilters({
                          lifecycleFilter: "all",
                          ownerFilter: "all",
                          labelFilter: "all",
                          tagFilter: "all",
                          segmentFilter: null
                        });
                        setCurrentPage(1);
                        addToast("Filters cleared.", "info");
                      }}
                      className="text-xs text-brand-sky hover:text-brand-sky/80 font-bold px-2 py-1 select-none cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>

                {/* VIEW MODES SWITCHER */}
                <div className="flex items-center bg-white border border-brand-border dark:border-border rounded-xl p-0.5 select-none">
                  {[
                    { mode: "table", label: "Grid View", icon: TableIcon },
                    { mode: "kanban", label: "Kanban Board", icon: KanbanIcon },
                    { mode: "compact", label: "Compact List", icon: ListIcon }
                  ].map((item) => (
                    <button
                      key={item.mode}
                      onClick={() => setViewMode(item.mode as any)}
                      className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                        viewMode === item.mode
                          ? "bg-secondary text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      title={item.label}
                    >
                      <item.icon className="h-4 w-4" />
                    </button>
                  ))}
                </div>

              </div>

              {/* DIRECTORY DISPLAY PANEL */}
              <div className="relative border border-brand-border dark:border-border/60 bg-card rounded-2xl overflow-hidden min-h-[400px]">
                
                {sortedContacts.length === 0 ? (
                  <div className="p-20 text-center italic text-xs text-muted-foreground flex flex-col items-center justify-center gap-3">
                    <Users className="h-8 w-8 text-zinc-600 animate-bounce" />
                    <span>No contact logs match search parameters or directory filters.</span>
                  </div>
                ) : (
                  <>
                    {/* TABLE VIEW DISPLAY */}
                    {viewMode === "table" && (
                      <div className="overflow-x-auto w-full">
                        <table className="w-full text-xs text-left border-collapse select-text">
                          <thead className="bg-zinc-950/20 text-zinc-400 uppercase tracking-wider font-extrabold select-none border-b border-border">
                            <tr>
                              <th className="p-4 w-10 text-center select-none">
                                <input
                                  type="checkbox"
                                  checked={selectedContactIds.length === paginatedContacts.length && paginatedContacts.length > 0}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedContactIds(paginatedContacts.map((c) => c.id));
                                    } else {
                                      setSelectedContactIds([]);
                                    }
                                  }}
                                  className="cursor-pointer"
                                />
                              </th>
                              
                              {visibleColumns.name && (
                                <th className="p-4 cursor-pointer hover:bg-zinc-900/10" onClick={() => requestSort("name")}>
                                  <div className="flex items-center gap-1.5">
                                    <span>Contact Profile</span>
                                    <ArrowUpDown className="h-3 w-3" />
                                  </div>
                                </th>
                              )}
                              
                              {visibleColumns.phone && <th className="p-4">Phone / WhatsApp</th>}
                              {visibleColumns.email && <th className="p-4">Email</th>}
                              {visibleColumns.company && <th className="p-4">Company</th>}
                              {visibleColumns.owner && <th className="p-4">Assigned Owner</th>}
                              {visibleColumns.lifecycle && <th className="p-4">Lifecycle Stage</th>}
                              
                              {visibleColumns.tags && <th className="p-4">Tags</th>}
                              
                              <th className="p-4 select-none text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedContacts.map((contact) => {
                              const isChecked = selectedContactIds.includes(contact.id);
                              return (
                                <tr
                                  key={contact.id}
                                  className={`border-b border-border/40 hover:bg-zinc-900/10 cursor-pointer transition-colors duration-150 ${
                                    isChecked ? "bg-secondary/40" : ""
                                  }`}
                                  onClick={() => setActiveContactId(contact.id)}
                                >
                                  <td className="p-4 text-center select-none" onClick={(e) => e.stopPropagation()}>
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedContactIds([...selectedContactIds, contact.id]);
                                        } else {
                                          setSelectedContactIds(selectedContactIds.filter((id) => id !== contact.id));
                                        }
                                      }}
                                      className="cursor-pointer"
                                    />
                                  </td>
                                  
                                  {visibleColumns.name && (
                                    <td className="p-4">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-zinc-800 text-[10px] font-bold text-brand-sky flex items-center justify-center shrink-0 uppercase select-none">
                                          {contact.name.charAt(0)}
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                          <span className="font-extrabold text-foreground">{contact.name}</span>
                                          <span className="text-[10px] text-muted-foreground">{contact.designation}</span>
                                        </div>
                                      </div>
                                    </td>
                                  )}

                                  {visibleColumns.phone && (
                                    <td className="p-4 select-text font-mono">
                                      {contact.phone}
                                    </td>
                                  )}

                                  {visibleColumns.email && (
                                    <td className="p-4 select-text">
                                      {contact.email}
                                    </td>
                                  )}

                                  {visibleColumns.company && (
                                    <td className="p-4 font-bold text-foreground">
                                      {contact.company || "—"}
                                    </td>
                                  )}

                                  {visibleColumns.owner && (
                                    <td className="p-4 select-none">
                                      <span className={`text-[10px] font-bold ${contact.owner ? "text-foreground" : "text-zinc-500 italic"}`}>
                                        {contact.owner ? `👤 ${contact.owner}` : "Unassigned"}
                                      </span>
                                    </td>
                                  )}

                                  {visibleColumns.lifecycle && (
                                    <td className="p-4 select-none">
                                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${getBadgeColor(contact.lifecycleStage)}`}>
                                        {contact.lifecycleStage}
                                      </span>
                                    </td>
                                  )}

                                  {visibleColumns.tags && (
                                    <td className="p-4 select-none">
                                      <div className="flex flex-wrap gap-1 max-w-[120px]">
                                        {contact.tags.slice(0, 2).map((t, idx) => (
                                          <span key={idx} className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded text-[8px] font-bold">{t}</span>
                                        ))}
                                        {contact.tags.length > 2 && (
                                          <span className="bg-zinc-700 text-zinc-400 px-1 py-0.5 rounded text-[8px] font-bold">+{contact.tags.length - 2}</span>
                                        )}
                                      </div>
                                    </td>
                                  )}

                                  <td className="p-4 text-right select-none" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex items-center justify-end gap-1.5">
                                      <button
                                        onClick={() => setActiveContactId(contact.id)}
                                        className="p-1.5 hover:bg-zinc-800 rounded text-muted-foreground hover:text-foreground transition-colors"
                                        title="View Profile Detail"
                                      >
                                        <Eye className="h-4 w-4" />
                                      </button>
                                      <button
                                        onClick={() => {
                                          if (confirm(`Are you sure you want to delete ${contact.name}?`)) {
                                            deleteContact(contact.id);
                                            addToast("Contact deleted.", "success");
                                          }
                                        }}
                                        className="p-1.5 hover:bg-red-950/20 rounded text-muted-foreground hover:text-red-500 transition-colors"
                                        title="Delete Contact"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </td>

                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* KANBAN BOARD VIEW */}
                    {viewMode === "kanban" && (
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 min-h-[480px]">
                        {(["lead", "qualified", "customer", "blocked", "archived"] as LifecycleStage[]).map((stage) => {
                          const stageContacts = sortedContacts.filter((c) => c.lifecycleStage === stage);
                          return (
                            <div key={stage} className="bg-zinc-950/15 border border-border/40 rounded-xl p-3 flex flex-col gap-3 max-h-[500px] overflow-y-auto scrollbar-thin">
                              
                              <div className="flex justify-between items-center select-none border-b border-border/40 pb-2">
                                <span className="font-extrabold uppercase text-[10px] text-foreground tracking-wider">{stage}</span>
                                <span className="text-[10px] font-mono font-bold bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">{stageContacts.length}</span>
                              </div>

                              <div className="flex flex-col gap-2.5 flex-grow">
                                {stageContacts.map((contact) => (
                                  <div
                                    key={contact.id}
                                    onClick={() => setActiveContactId(contact.id)}
                                    className="p-3 bg-card border border-border/50 rounded-xl hover:border-brand-sky hover:shadow-md cursor-pointer transition-all duration-200 text-left flex flex-col gap-2"
                                  >
                                    <div className="flex justify-between items-start gap-1">
                                      <span className="font-bold text-foreground text-[11px] truncate leading-tight">{contact.name}</span>
                                      {contact.owner && (
                                        <span className="text-[8px] font-mono font-bold bg-zinc-900 border border-border px-1.5 py-0.5 rounded text-zinc-300">
                                          {contact.owner}
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[9px] text-muted-foreground truncate">{contact.company || "No Company"}</span>
                                    
                                    {contact.tags.length > 0 && (
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {contact.tags.slice(0, 2).map((t, ti) => (
                                          <span key={ti} className="bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded text-[8px] font-bold">{t}</span>
                                        ))}
                                      </div>
                                    )}
                                    
                                    <div className="flex items-center justify-between text-[8px] text-zinc-500 font-mono mt-1 border-t border-border/20 pt-1.5">
                                      <span>{contact.phone}</span>
                                      <span className="text-brand-sky flex items-center gap-0.5">
                                        Open <ChevronRight className="h-2 w-2" />
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* COMPACT VIEW */}
                    {viewMode === "compact" && (
                      <div className="flex flex-col divide-y divide-border/40 select-text max-h-[500px] overflow-y-auto scrollbar-thin">
                        {sortedContacts.map((contact) => (
                          <div
                            key={contact.id}
                            onClick={() => setActiveContactId(contact.id)}
                            className="p-3 flex items-center justify-between gap-4 hover:bg-zinc-900/10 cursor-pointer transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded-full bg-zinc-800 text-[9px] font-bold text-brand-sky flex items-center justify-center shrink-0 uppercase select-none">
                                {contact.name.charAt(0)}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-foreground text-xs leading-tight">{contact.name}</span>
                                <span className="text-[9px] text-muted-foreground">{contact.designation} @ {contact.company || "No Company"}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-6">
                              <span className="text-[10px] font-mono text-zinc-400">{contact.phone}</span>
                              <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${getBadgeColor(contact.lifecycleStage)}`}>
                                {contact.lifecycleStage}
                              </span>
                              <ChevronRight className="h-4.5 w-4.5 text-muted-foreground shrink-0" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  </>
                )}

              </div>

              {/* PAGINATION PANEL */}
              {viewMode === "table" && totalPages > 1 && (
                <div className="flex justify-between items-center select-none pt-2">
                  <span className="text-[10px] text-muted-foreground font-semibold">
                    Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, sortedContacts.length)} of {sortedContacts.length} Contacts
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="xs"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      <ChevronLeft className="h-3 w-3" />
                    </Button>
                    <span className="text-[10px] font-mono font-bold px-2.5 text-foreground">
                      {currentPage} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="xs"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* BULK ACTIONS BOTTOM DRAWER OVERLAY */}
        <AnimatePresence>
          {selectedContactIds.length > 0 && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-zinc-950/95 border border-zinc-800 p-4 rounded-2xl shadow-2xl flex flex-wrap items-center gap-4 select-none backdrop-blur-md max-w-4xl text-left"
            >
              <div className="flex items-center gap-2 border-r border-zinc-800 pr-4">
                <span className="text-[10px] font-black text-brand-sky uppercase font-mono tracking-wider">
                  Bulk Actions console
                </span>
                <span className="h-5 px-1.5 bg-brand-sky text-white rounded text-[9px] font-bold flex items-center">
                  {selectedContactIds.length} Selected
                </span>
              </div>

              {/* Bulk options dropdowns */}
              <div className="flex flex-wrap items-center gap-2 text-[9px] font-bold">
                
                {/* Lifecycle */}
                <select
                  value={bulkLifecycleInput}
                  onChange={(e) => {
                    setBulkLifecycleInput(e.target.value);
                    if (e.target.value) {
                      bulkUpdateLifecycle(selectedContactIds, e.target.value as any);
                      addToast("Bulk lifecycle stage modified.", "success");
                      setBulkLifecycleInput("");
                    }
                  }}
                  className="h-8 bg-zinc-900 border border-zinc-850 rounded-lg text-[9px] font-bold text-white px-2 focus:outline-none"
                >
                  <option value="">Set Stage</option>
                  <option value="lead">Lead</option>
                  <option value="qualified">Qualified</option>
                  <option value="customer">Customer</option>
                  <option value="blocked">Blocked</option>
                  <option value="archived">Archived</option>
                </select>

                {/* Owner */}
                <select
                  value={bulkOwnerInput}
                  onChange={(e) => {
                    setBulkOwnerInput(e.target.value);
                    if (e.target.value) {
                      bulkAssignOwner(selectedContactIds, e.target.value === "unassigned" ? null : e.target.value as any);
                      addToast("Bulk owner reassigned.", "success");
                      setBulkOwnerInput("");
                    }
                  }}
                  className="h-8 bg-zinc-900 border border-zinc-850 rounded-lg text-[9px] font-bold text-white px-2 focus:outline-none"
                >
                  <option value="">Set Owner</option>
                  <option value="Me">Me</option>
                  <option value="John">John</option>
                  <option value="Sarah">Sarah</option>
                  <option value="unassigned">Unassigned</option>
                </select>

                {/* Tags */}
                <input
                  type="text"
                  placeholder="Bulk Add Tag..."
                  value={bulkTagInput}
                  onChange={(e) => setBulkTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && bulkTagInput.trim()) {
                      bulkAddTags(selectedContactIds, [bulkTagInput.trim()]);
                      addToast("Bulk tags appended.", "success");
                      setBulkTagInput("");
                    }
                  }}
                  className="h-8 bg-zinc-900 border border-zinc-850 rounded-lg text-[9px] text-white px-2 focus:outline-none w-[110px]"
                />

                {/* Labels */}
                <input
                  type="text"
                  placeholder="Bulk Add Label..."
                  value={bulkLabelInput}
                  onChange={(e) => setBulkLabelInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && bulkLabelInput.trim()) {
                      bulkAddLabels(selectedContactIds, [bulkLabelInput.trim()]);
                      addToast("Bulk labels appended.", "success");
                      setBulkLabelInput("");
                    }
                  }}
                  className="h-8 bg-zinc-900 border border-zinc-850 rounded-lg text-[9px] text-white px-2 focus:outline-none w-[110px]"
                />
              </div>

              <div className="flex items-center gap-1.5 border-l border-zinc-800 pl-4 select-none">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => executeBulkAction("archive")}
                  className="h-8 text-[8px]"
                >
                  Archive
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => executeBulkAction("block")}
                  className="h-8 text-[8px]"
                >
                  Block
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete these ${selectedContactIds.length} contacts in bulk?`)) {
                      executeBulkAction("delete");
                    }
                  }}
                  className="h-8 border-red-500/20 text-red-500 hover:bg-red-500/10 text-[8px]"
                >
                  Delete
                </Button>
                <button
                  onClick={() => setSelectedContactIds([])}
                  className="p-1 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                  title="Clear Selection"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* RIGHT DRAWER PROFILE DETAIL PANEL */}
        <AnimatePresence>
          {activeContact && (
            <motion.aside
              initial={{ x: "100%", opacity: 0.8 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.8 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen w-full md:w-[480px] bg-card border-l border-border shadow-2xl z-50 flex flex-col justify-between overflow-hidden text-left font-sans"
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-border bg-zinc-950/15 flex justify-between items-center select-none shrink-0">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 text-xs font-bold text-brand-sky flex items-center justify-center shrink-0 uppercase select-none">
                    {activeContact.name.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-foreground truncate max-w-[200px]">{activeContact.name}</span>
                    <div className="flex items-center gap-2 select-none mt-0.5">
                      <span className="text-[9px] text-muted-foreground font-semibold leading-none">{activeContact.designation}</span>
                      {saveStatus === "saving" && <span className="text-[8px] text-brand-sky font-bold uppercase animate-pulse">Autosaving...</span>}
                      {saveStatus === "saved" && <span className="text-[8px] text-brand-green font-bold uppercase flex items-center gap-0.5">Saved <Check className="h-2 w-2" /></span>}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setActiveContactId(null)}
                  className="p-1.5 hover:bg-zinc-800 rounded transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Close Inspector"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Tabs sheet */}
              <div className="flex border-b border-border/40 select-none bg-zinc-950/5 shrink-0 font-mono text-[9px] font-bold uppercase">
                {[
                  { id: "overview", label: "Overview" },
                  { id: "timeline", label: "Timeline" },
                  { id: "fields", label: "Custom fields" },
                  { id: "orders", label: "Commerce Hub" },
                  { id: "files", label: "Files" }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveDrawerTab(t.id as any)}
                    className={`flex-1 py-2.5 text-center border-b transition-all cursor-pointer ${
                      activeDrawerTab === t.id
                        ? "border-brand-sky text-brand-sky font-bold bg-card"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Drawer Scroll body */}
              <div className="flex-grow overflow-y-auto p-5 scrollbar-thin select-text">
                
                {activeDrawerTab === "overview" && (
                  <div className="flex flex-col gap-5 text-left">
                    
                    {/* CRM Details Form Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      
                      <div className="flex flex-col gap-1">
                        <label className="text-[8px] uppercase font-bold text-zinc-500 select-none">Full Name</label>
                        <input
                          type="text"
                          defaultValue={activeContact.name}
                          onBlur={(e) => handleInlineUpdate("name", e.target.value)}
                          className="h-8 px-2 bg-zinc-900/50 border border-brand-border dark:border-border rounded text-xs focus:outline-none text-foreground font-bold"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[8px] uppercase font-bold text-zinc-500 select-none">Email Address</label>
                        <input
                          type="email"
                          defaultValue={activeContact.email}
                          onBlur={(e) => handleInlineUpdate("email", e.target.value)}
                          className="h-8 px-2 bg-zinc-900/50 border border-brand-border dark:border-border rounded text-xs focus:outline-none text-foreground font-mono"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[8px] uppercase font-bold text-zinc-500 select-none">Phone Number</label>
                        <input
                          type="text"
                          defaultValue={activeContact.phone}
                          onBlur={(e) => handleInlineUpdate("phone", e.target.value)}
                          className="h-8 px-2 bg-zinc-900/50 border border-brand-border dark:border-border rounded text-xs focus:outline-none text-foreground font-mono"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[8px] uppercase font-bold text-zinc-500 select-none">WhatsApp Account</label>
                        <input
                          type="text"
                          defaultValue={activeContact.whatsappNumber}
                          onBlur={(e) => handleInlineUpdate("whatsappNumber", e.target.value)}
                          className="h-8 px-2 bg-zinc-900/50 border border-brand-border dark:border-border rounded text-xs focus:outline-none text-foreground font-mono"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[8px] uppercase font-bold text-zinc-500 select-none">Company Firm</label>
                        <input
                          type="text"
                          defaultValue={activeContact.company}
                          onBlur={(e) => handleInlineUpdate("company", e.target.value)}
                          className="h-8 px-2 bg-zinc-900/50 border border-brand-border dark:border-border rounded text-xs focus:outline-none text-foreground font-bold"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[8px] uppercase font-bold text-zinc-500 select-none">Job Designation</label>
                        <input
                          type="text"
                          defaultValue={activeContact.designation}
                          onBlur={(e) => handleInlineUpdate("designation", e.target.value)}
                          className="h-8 px-2 bg-zinc-900/50 border border-brand-border dark:border-border rounded text-xs focus:outline-none text-foreground"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[8px] uppercase font-bold text-zinc-500 select-none">Source Lead</label>
                        <input
                          type="text"
                          defaultValue={activeContact.source}
                          onBlur={(e) => handleInlineUpdate("source", e.target.value)}
                          className="h-8 px-2 bg-zinc-900/50 border border-brand-border dark:border-border rounded text-xs focus:outline-none text-foreground"
                        />
                      </div>

                      <div className="flex flex-col gap-1 select-none">
                        <label className="text-[8px] uppercase font-bold text-zinc-500 select-none">Owner Assigned</label>
                        <select
                          value={activeContact.owner || ""}
                          onChange={(e) => handleInlineUpdate("owner", e.target.value || null)}
                          className="h-8 px-2 bg-zinc-900/50 border border-brand-border dark:border-border rounded text-xs focus:outline-none text-foreground font-bold"
                        >
                          <option value="">Unassigned</option>
                          <option value="Me">Me (Admin)</option>
                          <option value="John">John (Support)</option>
                          <option value="Sarah">Sarah (Creative)</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1 select-none">
                        <label className="text-[8px] uppercase font-bold text-zinc-500 select-none">Lifecycle Stage</label>
                        <select
                          value={activeContact.lifecycleStage}
                          onChange={(e) => handleInlineUpdate("lifecycleStage", e.target.value)}
                          className="h-8 px-2 bg-zinc-900/50 border border-brand-border dark:border-border rounded text-xs focus:outline-none text-foreground font-bold"
                        >
                          <option value="lead">Lead</option>
                          <option value="qualified">Qualified Lead</option>
                          <option value="customer">Customer</option>
                          <option value="blocked">Blocked</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[8px] uppercase font-bold text-zinc-500 select-none">Timezone</label>
                        <input
                          type="text"
                          defaultValue={activeContact.timezone}
                          onBlur={(e) => handleInlineUpdate("timezone", e.target.value)}
                          className="h-8 px-2 bg-zinc-900/50 border border-brand-border dark:border-border rounded text-xs focus:outline-none text-foreground"
                        />
                      </div>

                    </div>

                    <hr className="border-border/40 select-none" />

                    {/* Labels list */}
                    <div className="flex flex-col gap-2 text-left">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase select-none">Color Labels</span>
                      <div className="flex flex-wrap gap-1 select-none mt-0.5">
                        {activeContact.labels.map((lbl, idx) => (
                          <span
                            key={idx}
                            className="bg-brand-sky-light/10 text-brand-sky border border-brand-sky/20 px-2.5 py-0.5 rounded text-[8px] font-extrabold uppercase flex items-center gap-1"
                          >
                            {lbl}
                            <button
                              onClick={() => {
                                const rem = activeContact.labels.filter((l) => l !== lbl);
                                updateContact(activeContact.id, { labels: rem });
                                addToast("Label removed.", "info");
                              }}
                              className="hover:text-red-500 text-[8px]"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <form onSubmit={handleAddLabelInDrawer} className="flex gap-1.5 select-none mt-1">
                        <input
                          type="text"
                          placeholder="Add Label..."
                          value={newLabelInput}
                          onChange={(e) => setNewLabelInput(e.target.value)}
                          className="flex-grow h-7 px-2 bg-zinc-900/50 border border-brand-border rounded text-[9px] focus:outline-none text-foreground"
                        />
                        <Button type="submit" size="xs" className="h-7 px-2.5 shrink-0">
                          Add
                        </Button>
                      </form>
                    </div>

                    {/* Tags list */}
                    <div className="flex flex-col gap-2 text-left">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase select-none">Tags Manager</span>
                      <div className="flex flex-wrap gap-1 select-none mt-0.5">
                        {activeContact.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-secondary border border-border px-2 py-0.5 rounded text-[8px] font-bold text-foreground flex items-center gap-1"
                          >
                            {tag}
                            <button
                              onClick={() => {
                                const rem = activeContact.tags.filter((t) => t !== tag);
                                updateContact(activeContact.id, { tags: rem });
                                addToast("Tag removed.", "info");
                              }}
                              className="hover:text-red-500 text-[8px]"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <form onSubmit={handleAddTagInDrawer} className="flex gap-1.5 select-none mt-1">
                        <input
                          type="text"
                          placeholder="Add Tag..."
                          value={newTagInput}
                          onChange={(e) => setNewTagInput(e.target.value)}
                          className="flex-grow h-7 px-2 bg-zinc-900/50 border border-brand-border rounded text-[9px] focus:outline-none text-foreground"
                        />
                        <Button type="submit" size="xs" className="h-7 px-2.5 shrink-0">
                          Add
                        </Button>
                      </form>
                    </div>

                    <hr className="border-border/40 select-none" />

                    {/* Primary notes editor */}
                    <div className="flex flex-col gap-1 text-left">
                      <label className="text-[8px] uppercase font-bold text-zinc-500 select-none">Internal Workspace Notes</label>
                      <textarea
                        defaultValue={activeContact.notes}
                        onBlur={(e) => handleInlineUpdate("notes", e.target.value)}
                        className="w-full h-24 p-2 bg-zinc-900/50 border border-brand-border dark:border-border rounded-xl text-xs focus:outline-none resize-none text-foreground leading-relaxed"
                        placeholder="Write detailed CRM log..."
                      />
                    </div>

                  </div>
                )}

                {activeDrawerTab === "timeline" && (
                  <div className="flex flex-col gap-5 text-left">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase select-none">Communication Timeline Logs</span>
                    
                    {/* Add note to timeline */}
                    <form onSubmit={handlePostTimelineNote} className="flex flex-col gap-2 select-none border-b border-border/40 pb-4">
                      <textarea
                        placeholder="Type interaction note (e.g. Call logs, WhatsApp notes)..."
                        value={newNoteInput}
                        onChange={(e) => setNewNoteInput(e.target.value)}
                        className="w-full h-16 p-2 bg-zinc-900/50 border border-brand-border rounded-xl text-xs focus:outline-none text-foreground"
                      />
                      <Button type="submit" size="xs" className="self-end" disabled={!newNoteInput.trim()}>
                        Post Note
                      </Button>
                    </form>

                    <div className="flex flex-col gap-3.5 pr-1 select-text">
                      {activeContact.timeline.map((act) => (
                        <div key={act.id} className="flex gap-3 items-start select-text leading-normal">
                          <div className="p-1.5 bg-zinc-900 border border-border rounded-lg text-zinc-400 shrink-0 mt-0.5">
                            {act.type === "call" && <Phone className="h-3 w-3 text-brand-sky" />}
                            {act.type === "email" && <Mail className="h-3 w-3 text-[#BA8B02]" />}
                            {act.type === "whatsapp" && <Sparkles className="h-3 w-3 text-brand-green" />}
                            {act.type === "workflow" && <Layers className="h-3 w-3 text-[#EC4899]" />}
                            {act.type === "ai" && <Sparkles className="h-3 w-3 text-[#BA8B02]" />}
                            {act.type === "note" && <FileText className="h-3 w-3 text-amber-500" />}
                            {act.type === "system" && <Clock className="h-3 w-3 text-zinc-500" />}
                          </div>

                          <div className="flex-grow flex flex-col gap-0.5">
                            <span className="font-bold text-foreground text-xs leading-snug">{act.title}</span>
                            <p className="text-[10px] text-zinc-300 select-text leading-relaxed whitespace-pre-wrap">{act.text}</p>
                            <span className="text-[8px] text-zinc-500 font-mono select-none mt-1">
                              {new Date(act.timestamp).toLocaleString([], { hour: "2-digit", minute: "2-digit", month: "short", day: "numeric" })}
                              {act.actor && ` by ${act.actor}`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeDrawerTab === "fields" && (
                  <div className="flex flex-col gap-4 text-left">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase select-none">Schema Custom Fields</span>
                    {customFields.length === 0 ? (
                      <div className="text-[10px] text-zinc-500 italic p-4 text-center">No custom fields defined in schema workspace.</div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        {customFields.map((field) => {
                          const val = activeContact.customFields[field.id] ?? field.defaultValue ?? "";
                          return (
                            <div key={field.id} className="flex flex-col gap-1 w-full text-left">
                              <label className="text-[9px] font-bold text-zinc-400 flex justify-between uppercase">
                                <span>{field.name}</span>
                                <span className="text-[8px] text-zinc-600">({field.type})</span>
                              </label>

                              {field.type === "checkbox" ? (
                                <Toggle
                                  checked={!!val}
                                  onChange={(chk) => handleCustomFieldUpdate(field.id, chk)}
                                />
                              ) : field.type === "textarea" ? (
                                <textarea
                                  defaultValue={val}
                                  onBlur={(e) => handleCustomFieldUpdate(field.id, e.target.value)}
                                  className="w-full h-16 p-2 bg-zinc-900/50 border border-brand-border rounded text-xs focus:outline-none text-foreground"
                                />
                              ) : field.type === "dropdown" ? (
                                <select
                                  defaultValue={val}
                                  onChange={(e) => handleCustomFieldUpdate(field.id, e.target.value)}
                                  className="h-8 px-2 bg-zinc-900/50 border border-brand-border rounded text-xs focus:outline-none text-foreground font-bold cursor-pointer"
                                >
                                  <option value="">Select option</option>
                                  {field.options?.map((opt, oi) => (
                                    <option key={oi} value={opt}>{opt}</option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  type={field.type === "number" || field.type === "currency" ? "number" : "text"}
                                  defaultValue={val}
                                  onBlur={(e) => handleCustomFieldUpdate(field.id, field.type === "number" || field.type === "currency" ? Number(e.target.value) : e.target.value)}
                                  className="h-8 px-2 bg-zinc-900/50 border border-brand-border rounded text-xs focus:outline-none text-foreground font-bold"
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {activeDrawerTab === "orders" && (
                  <div className="flex flex-col gap-5 text-left">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase select-none">Commerce hub (Shopify / Stripe)</span>
                    
                    {/* Orders */}
                    <div className="flex flex-col gap-2.5">
                      <span className="text-[10px] font-bold text-foreground">Active Orders</span>
                      {activeContact.orders.length === 0 ? (
                        <div className="p-4 border border-dashed border-border rounded-xl text-center text-[10px] text-zinc-500 italic">No sync orders log found.</div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {activeContact.orders.map((ord) => (
                            <div key={ord.id} className="p-3 border border-border rounded-xl bg-zinc-950/15 flex justify-between items-center text-[10px]">
                              <div className="flex flex-col gap-0.5 text-left">
                                <span className="font-extrabold text-foreground">{ord.orderNumber}</span>
                                <span className="text-zinc-500 font-mono">{ord.date}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-foreground font-mono">${ord.amount}</span>
                                <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                                  ord.status === "fulfilled" ? "bg-brand-green/10 text-brand-green" : "bg-zinc-800 text-zinc-400"
                                }`}>
                                  {ord.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Invoices */}
                    <div className="flex flex-col gap-2.5">
                      <span className="text-[10px] font-bold text-foreground">Stripe Invoices</span>
                      {activeContact.invoices.length === 0 ? (
                        <div className="p-4 border border-dashed border-border rounded-xl text-center text-[10px] text-zinc-500 italic">No stripe invoices logged.</div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {activeContact.invoices.map((inv) => (
                            <div key={inv.id} className="p-3 border border-border rounded-xl bg-zinc-950/15 flex justify-between items-center text-[10px]">
                              <div className="flex flex-col gap-0.5 text-left">
                                <span className="font-extrabold text-foreground">{inv.invoiceNumber}</span>
                                <span className="text-zinc-500 font-mono">Due: {inv.dueDate}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-foreground font-mono">${inv.amount}</span>
                                <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                                  inv.status === "paid" ? "bg-brand-green/10 text-brand-green" : "bg-amber-500/10 text-amber-500"
                                }`}>
                                  {inv.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                )}

                {activeDrawerTab === "files" && (
                  <div className="flex flex-col gap-4 text-left">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase select-none">Client Contracts & Documents</span>
                    {activeContact.files.length === 0 ? (
                      <div className="p-8 border border-dashed border-border rounded-xl text-center text-[10px] text-zinc-500 italic">No attachments uploaded for this contact.</div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {activeContact.files.map((file) => (
                          <div key={file.id} className="p-3 border border-border rounded-xl bg-zinc-950/15 flex items-center justify-between text-[10px]">
                            <div className="flex items-center gap-3">
                              <FileText className="h-7 w-7 text-brand-sky shrink-0" />
                              <div className="flex flex-col text-left">
                                <span className="font-bold text-foreground truncate max-w-[150px]">{file.name}</span>
                                <span className="text-[8px] text-zinc-500 mt-0.5">{file.size} • {file.uploadedAt}</span>
                              </div>
                            </div>
                            <button className="p-1.5 hover:bg-zinc-800 rounded shrink-0 cursor-pointer" title="Download Spec file">
                              <Download className="h-4 w-4 text-brand-sky" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>
              
              {/* Drawer Footer Actions */}
              <div className="p-4 border-t border-border bg-zinc-950/15 select-none shrink-0 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 font-bold text-xs"
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this contact?")) {
                      deleteContact(activeContact.id);
                      addToast("Contact deleted.", "success");
                    }
                  }}
                >
                  Delete Contact
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-grow font-bold text-xs"
                  onClick={() => setActiveContactId(null)}
                >
                  Finish Audit
                </Button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* MODAL: CREATE CONTACT */}
        <AnimatePresence>
          {showCreateModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col justify-between"
              >
                <div className="p-5 border-b border-border flex justify-between items-center bg-zinc-950/10">
                  <span className="font-extrabold text-foreground text-sm">Create New CRM Contact</span>
                  <button onClick={() => setShowCreateModal(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <form onSubmit={handleCreateContact} className="p-5 overflow-y-auto max-h-[480px] grid grid-cols-2 gap-4 text-left">
                  
                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Contact Name *</label>
                    <input
                      type="text"
                      required
                      value={createForm.name}
                      onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="h-9 px-3 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Phone Number *</label>
                    <input
                      type="text"
                      required
                      value={createForm.phone}
                      onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                      placeholder="e.g. +91 98765 43210"
                      className="h-9 px-3 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Email Address</label>
                    <input
                      type="email"
                      value={createForm.email}
                      onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                      placeholder="e.g. john@company.com"
                      className="h-9 px-3 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Company</label>
                    <input
                      type="text"
                      value={createForm.company}
                      onChange={(e) => setCreateForm({ ...createForm, company: e.target.value })}
                      placeholder="e.g. Acme Inc"
                      className="h-9 px-3 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Designation</label>
                    <input
                      type="text"
                      value={createForm.designation}
                      onChange={(e) => setCreateForm({ ...createForm, designation: e.target.value })}
                      placeholder="e.g. VP Sales"
                      className="h-9 px-3 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Owner</label>
                    <select
                      value={createForm.owner || ""}
                      onChange={(e) => setCreateForm({ ...createForm, owner: (e.target.value || null) as any })}
                      className="h-9 px-3 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground cursor-pointer font-bold"
                    >
                      <option value="Me">Me (Admin)</option>
                      <option value="John">John (Support)</option>
                      <option value="Sarah">Sarah (Creative)</option>
                      <option value="">Unassigned</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Lifecycle Stage</label>
                    <select
                      value={createForm.lifecycleStage}
                      onChange={(e) => setCreateForm({ ...createForm, lifecycleStage: e.target.value as any })}
                      className="h-9 px-3 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground cursor-pointer font-bold"
                    >
                      <option value="lead">Lead</option>
                      <option value="qualified">Qualified</option>
                      <option value="customer">Customer</option>
                      <option value="blocked">Blocked</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Initial Profile Note</label>
                    <textarea
                      value={createForm.notes}
                      onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })}
                      placeholder="Type important context about this contact..."
                      className="w-full h-16 p-2 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground"
                    />
                  </div>

                  <div className="flex items-center gap-2 col-span-2 justify-end pt-3 border-t border-border mt-3 select-none">
                    <Button variant="outline" size="sm" type="button" onClick={() => setShowCreateModal(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" size="sm" type="submit">
                      Create Contact
                    </Button>
                  </div>

                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: CUSTOM FIELDS SCHEMA MANAGER */}
        <AnimatePresence>
          {showCustomFieldsModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col justify-between"
              >
                <div className="p-5 border-b border-border flex justify-between items-center bg-zinc-950/10">
                  <span className="font-extrabold text-foreground text-sm">Custom Fields Schema Settings</span>
                  <button onClick={() => setShowCustomFieldsModal(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="p-5 flex flex-col gap-4 text-left overflow-y-auto max-h-[480px]">
                  
                  {/* List existing custom fields */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase select-none">Configured Custom Fields</span>
                    {customFields.length === 0 ? (
                      <span className="text-[10px] text-zinc-500 italic">No custom fields defined yet.</span>
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        {customFields.map((cf) => (
                          <div key={cf.id} className="p-2.5 border border-border rounded-lg bg-zinc-950/20 flex justify-between items-center text-[10px]">
                            <div className="flex flex-col text-left">
                              <span className="font-extrabold text-foreground">{cf.name}</span>
                              <span className="text-zinc-500 font-mono">Type: {cf.type}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <hr className="border-border/40" />

                  {/* Add field form */}
                  <form onSubmit={handleAddCustomField} className="flex flex-col gap-3.5 mt-1">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase select-none">Add custom property field</span>
                    
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] uppercase font-bold text-zinc-500 select-none">Field Label Name</label>
                      <input
                        type="text"
                        required
                        value={customFieldForm.name}
                        onChange={(e) => setCustomFieldForm({ ...customFieldForm, name: e.target.value })}
                        placeholder="e.g. Lead Value, SLA Target"
                        className="h-9 px-3 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] uppercase font-bold text-zinc-500 select-none">Field Data Type</label>
                      <select
                        value={customFieldForm.type}
                        onChange={(e) => setCustomFieldForm({ ...customFieldForm, type: e.target.value as any })}
                        className="h-9 px-3 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground cursor-pointer font-bold"
                      >
                        <option value="text">Single Text</option>
                        <option value="textarea">Multi-line Text</option>
                        <option value="number">Number</option>
                        <option value="currency">Currency ($)</option>
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                        <option value="checkbox">Toggle Checkbox</option>
                        <option value="dropdown">Dropdown Options</option>
                        <option value="date">Calendar Date</option>
                      </select>
                    </div>

                    {customFieldForm.type === "dropdown" && (
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] uppercase font-bold text-zinc-500 select-none">Dropdown options (comma separated)</label>
                        <input
                          type="text"
                          required
                          value={customFieldForm.optionsString}
                          onChange={(e) => setCustomFieldForm({ ...customFieldForm, optionsString: e.target.value })}
                          placeholder="e.g. Option A, Option B, Option C"
                          className="h-9 px-3 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground"
                        />
                      </div>
                    )}

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] uppercase font-bold text-zinc-500 select-none">Default Value</label>
                      <input
                        type="text"
                        value={customFieldForm.defaultValue}
                        onChange={(e) => setCustomFieldForm({ ...customFieldForm, defaultValue: e.target.value })}
                        placeholder="Optional default placeholder..."
                        className="h-9 px-3 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground"
                      />
                    </div>

                    <div className="flex gap-2 justify-end pt-3 border-t border-border mt-3 select-none">
                      <Button variant="outline" size="sm" type="button" onClick={() => setShowCustomFieldsModal(false)}>
                        Close
                      </Button>
                      <Button variant="primary" size="sm" type="submit">
                        Add Field
                      </Button>
                    </div>

                  </form>

                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: SMART SEGMENT CREATOR */}
        <AnimatePresence>
          {showSegmentModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col justify-between"
              >
                <div className="p-5 border-b border-border flex justify-between items-center bg-zinc-950/10">
                  <span className="font-extrabold text-foreground text-sm">Build Smart Target Segment</span>
                  <button onClick={() => setShowSegmentModal(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <form onSubmit={handleCreateSegment} className="p-5 flex flex-col gap-4 text-left">
                  
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Segment Name</label>
                    <input
                      type="text"
                      required
                      value={segmentForm.name}
                      onChange={(e) => setSegmentForm({ ...segmentForm, name: e.target.value })}
                      placeholder="e.g. VIP Customers, Unassigned Leads"
                      className="h-9 px-3 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Description</label>
                    <input
                      type="text"
                      value={segmentForm.description}
                      onChange={(e) => setSegmentForm({ ...segmentForm, description: e.target.value })}
                      placeholder="Brief segment criteria details..."
                      className="h-9 px-3 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground"
                    />
                  </div>

                  <hr className="border-border/40" />
                  <span className="text-[10px] font-bold text-zinc-400 uppercase select-none">Dynamic Rule Filter</span>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] uppercase font-bold text-zinc-500">Field</label>
                      <select
                        value={segmentForm.field}
                        onChange={(e) => setSegmentForm({ ...segmentForm, field: e.target.value })}
                        className="h-9 px-2 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground cursor-pointer font-bold"
                      >
                        <option value="lifecycleStage">Lifecycle Stage</option>
                        <option value="source">Source</option>
                        <option value="company">Company</option>
                        <option value="tags">Tags</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] uppercase font-bold text-zinc-500">Operator</label>
                      <select
                        value={segmentForm.operator}
                        onChange={(e) => setSegmentForm({ ...segmentForm, operator: e.target.value as any })}
                        className="h-9 px-2 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground cursor-pointer font-bold"
                      >
                        <option value="equals">Equals</option>
                        <option value="contains">Contains</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] uppercase font-bold text-zinc-500">Value</label>
                      <input
                        type="text"
                        required
                        value={segmentForm.value}
                        onChange={(e) => setSegmentForm({ ...segmentForm, value: e.target.value })}
                        placeholder="e.g. customer, VIP"
                        className="h-9 px-2 bg-zinc-900 border border-brand-border rounded-lg text-xs focus:outline-none text-foreground"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-3 border-t border-border mt-3 select-none">
                    <Button variant="outline" size="sm" type="button" onClick={() => setShowSegmentModal(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" size="sm" type="submit">
                      Save Segment
                    </Button>
                  </div>

                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: IMPORT CSV WIZARD */}
        <AnimatePresence>
          {showImportModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col justify-between"
              >
                <div className="p-5 border-b border-border flex justify-between items-center bg-zinc-950/10">
                  <span className="font-extrabold text-foreground text-sm font-sans flex items-center gap-1.5">
                    <Upload className="h-4 w-4 text-brand-sky" />
                    Contacts Bulk Import Wizard
                  </span>
                  <button onClick={() => setShowImportModal(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="p-5 flex flex-col gap-4 text-left">
                  
                  {/* File Dropzone */}
                  {!csvFileContent ? (
                    <div className="border-2 border-dashed border-border/80 hover:border-brand-sky/60 bg-zinc-950/5 p-8 rounded-xl text-center select-none flex flex-col items-center justify-center gap-2 cursor-pointer relative transition-all">
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleCsvUploadSimulate}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <span className="font-bold text-foreground text-xs">Upload your CSV Contacts spreadsheet</span>
                      <p className="text-[10px] text-zinc-500 leading-normal max-w-[280px]">
                        Support mapping column headers directly into our CRM attributes database schema.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      
                      {/* Headers Mapping Checklist */}
                      <div className="flex flex-col gap-1.5 text-[10px] font-bold text-zinc-400">
                        <span className="uppercase select-none">Select attributes mappings</span>
                        <div className="grid grid-cols-2 gap-2 bg-zinc-950/20 p-3 border border-border rounded-xl">
                          {importHeaders.map((head) => (
                            <div key={head} className="flex justify-between items-center h-8 bg-zinc-900 border border-zinc-850 px-2 rounded-lg text-[9px] text-white">
                              <span className="truncate max-w-[100px]">{head}</span>
                              <select
                                value={importMappings[head] || ""}
                                onChange={(e) => setImportMappings({ ...importMappings, [head]: e.target.value })}
                                className="bg-transparent border-none text-[9px] font-bold text-brand-sky focus:outline-none cursor-pointer"
                              >
                                <option value="name">Name</option>
                                <option value="phone">Phone</option>
                                <option value="email">Email</option>
                                <option value="company">Company</option>
                                <option value="designation">Designation</option>
                                <option value="source">Source</option>
                                <option value="lifecycleStage">Stage</option>
                              </select>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Import Row Previews */}
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] uppercase font-bold text-zinc-400 select-none">Preview Parse Rows</span>
                        <div className="max-h-[140px] overflow-y-auto scrollbar-thin border border-border rounded-xl bg-zinc-950/20 divide-y divide-border/40 select-text">
                          {importPreviewRows.map((row, idx) => (
                            <div key={idx} className="p-2 flex justify-between items-center text-[9px] text-zinc-300">
                              <div className="flex flex-col text-left">
                                <span className="font-extrabold text-foreground">{row.name}</span>
                                <span className="font-mono text-zinc-500">{row.email} • {row.phone}</span>
                              </div>
                              <span className="bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded text-[8px] font-bold">{row.lifecycleStage}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                  <div className="flex gap-2 justify-end pt-3 border-t border-border mt-3 select-none">
                    <Button variant="outline" size="sm" type="button" onClick={() => {
                      setCsvFileContent("");
                      setImportPreviewRows([]);
                    }}>
                      Reset File
                    </Button>
                    <Button variant="primary" size="sm" onClick={handleExecuteImport} disabled={!csvFileContent}>
                      Execute Import
                    </Button>
                  </div>

                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: EXPORT CRM OPTIONS */}
        <AnimatePresence>
          {showExportModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-card border border-border rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col justify-between"
              >
                <div className="p-5 border-b border-border flex justify-between items-center bg-zinc-950/10">
                  <span className="font-extrabold text-foreground text-sm font-sans flex items-center gap-1.5">
                    <Download className="h-4 w-4 text-brand-sky" />
                    Export Contacts Dataset
                  </span>
                  <button onClick={() => setShowExportModal(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="p-5 flex flex-col gap-4 text-left">
                  <p className="text-xs text-muted-foreground leading-normal">
                    Download custom filtered segments list directly for campaign integrations or backup logs.
                  </p>
                  
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleExportSimulate("csv")}
                      className="p-3 bg-zinc-950/20 border border-border hover:border-brand-sky rounded-xl flex items-center justify-between text-xs font-bold text-foreground cursor-pointer transition-all"
                    >
                      <span>Comma Separated Values (.CSV)</span>
                      <FileDown className="h-4 w-4 text-brand-sky" />
                    </button>
                    
                    <button
                      onClick={() => handleExportSimulate("xlsx")}
                      className="p-3 bg-zinc-950/20 border border-border hover:border-brand-sky rounded-xl flex items-center justify-between text-xs font-bold text-foreground cursor-pointer transition-all"
                    >
                      <span>Excel Spreadsheet (.XLSX)</span>
                      <FileDown className="h-4 w-4 text-brand-sky" />
                    </button>

                    <button
                      onClick={() => handleExportSimulate("json")}
                      className="p-3 bg-zinc-950/20 border border-border hover:border-brand-sky rounded-xl flex items-center justify-between text-xs font-bold text-foreground cursor-pointer transition-all"
                    >
                      <span>Javascript Object Notation (.JSON)</span>
                      <FileDown className="h-4 w-4 text-brand-sky" />
                    </button>
                  </div>

                  <div className="flex gap-2 justify-end pt-3 border-t border-border mt-3 select-none">
                    <Button variant="outline" size="sm" type="button" onClick={() => setShowExportModal(false)}>
                      Close
                    </Button>
                  </div>

                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </DashboardShell>
  );
}
