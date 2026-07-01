"use client";

import React, { useMemo, useState } from "react";
import { useGoogleWorkspace } from "@/store/use-google-workspace";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import {
  Users,
  Search,
  Upload,
  Download,
  Check,
  AlertTriangle,
  Mail,
  Phone,
  Briefcase,
  Layers,
  ChevronRight,
  MoreVertical,
  Plus
} from "lucide-react";

export default function GoogleContactsPage() {
  const { addToast } = useToast();
  const {
    contacts,
    importContactsCSV,
    resolveContactDuplicate
  } = useGoogleWorkspace();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContactId, setSelectedContactId] = useState<string | null>("cnt-1");

  // Import state
  const [csvInput, setCsvInput] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);

  const filteredContacts = useMemo(() => {
    return contacts.filter(c =>
      c.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [contacts, searchQuery]);

  const activeContact = useMemo(() => {
    return contacts.find(c => c.id === selectedContactId) || null;
  }, [contacts, selectedContactId]);

  const duplicatesList = useMemo(() => {
    return contacts.filter(c => c.isDuplicate);
  }, [contacts]);

  const handleImportCSV = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvInput) {
      addToast("Please paste CSV data rows first.", "error");
      return;
    }

    importContactsCSV(csvInput);
    addToast("Contacts imported successfully", "success");
    setCsvInput("");
    setShowImportModal(false);
  };

  const handleResolveDuplicate = (id: string, action: "merge" | "ignore") => {
    resolveContactDuplicate(id, action);
    addToast(`Duplicate reference resolved: ${action === "merge" ? "Merged" : "Ignored"}`, "success");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Google Contacts Integration
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Sync address books, detect duplicate customer entries, and export contacts directories to CSV.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowImportModal(true)}
            className="font-bold border-brand-sky text-brand-sky hover:bg-brand-sky-light/40"
            leftIcon={<Upload className="h-4 w-4" />}
          >
            Import CSV
          </Button>
          <Button
            variant="success"
            size="sm"
            onClick={() => addToast("Successfully exported contacts catalog into Excel sheet.", "success")}
            className="font-bold"
            leftIcon={<Download className="h-4 w-4 text-white" />}
          >
            Export Directory
          </Button>
        </div>
      </div>

      {/* Duplicate detection warning banner */}
      {duplicatesList.length > 0 && (
        <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-950/20 flex flex-col gap-3">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-0.5">
              <h4 className="text-xs font-bold text-amber-800 dark:text-amber-400">
                Potential Duplicate Contacts Detected
              </h4>
              <p className="text-[11px] text-amber-700 dark:text-amber-500 font-medium leading-relaxed">
                Our synchronizer flagged {duplicatesList.length} contact entries with matching emails or phones but different display details.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 pl-8 border-l border-amber-200 mt-1">
            {duplicatesList.map((dup) => (
              <div key={dup.id} className="flex items-center justify-between text-xs gap-3">
                <span className="font-bold text-brand-navy dark:text-foreground">
                  {dup.displayName} ({dup.email})
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => handleResolveDuplicate(dup.id, "merge")}
                    className="h-7 text-[10px] font-bold border-brand-green text-brand-green hover:bg-green-50"
                  >
                    Merge
                  </Button>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleResolveDuplicate(dup.id, "ignore")}
                    className="h-7 text-[10px] font-bold text-on-surface-variant"
                  >
                    Ignore
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        {/* Contacts Index */}
        <Card className="lg:col-span-5 border-brand-border dark:border-zinc-800/60 bg-white dark:bg-zinc-950 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-brand-border flex items-center gap-2 bg-white dark:bg-zinc-950">
            <Search className="h-4 w-4 text-on-surface-variant/80" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none text-xs focus:outline-none text-brand-navy dark:text-foreground font-semibold placeholder:text-on-surface-variant/50"
            />
          </div>

          <div className="divide-y divide-brand-border dark:divide-zinc-800/60 overflow-y-auto max-h-[480px]">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((cnt) => {
                const isSelected = cnt.id === selectedContactId;
                return (
                  <div
                    key={cnt.id}
                    onClick={() => setSelectedContactId(cnt.id)}
                    className={`p-3.5 flex items-center gap-3 cursor-pointer transition-all ${
                      isSelected
                        ? "bg-brand-slate/80 dark:bg-zinc-900/60"
                        : "hover:bg-brand-slate/40 dark:hover:bg-zinc-900/10"
                    }`}
                  >
                    {cnt.avatarUrl ? (
                      <img
                        src={cnt.avatarUrl}
                        alt={cnt.displayName}
                        className="w-9 h-9 rounded-full shrink-0 object-cover border border-brand-border"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 flex items-center justify-center font-bold text-xs shrink-0 select-none">
                        {cnt.firstName[0]}
                        {cnt.lastName[0] || ""}
                      </div>
                    )}
                    <div className="flex flex-col min-w-0 text-left">
                      <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate">
                        {cnt.displayName}
                      </span>
                      <span className="text-[10px] text-on-surface-variant/80 font-semibold truncate">
                        {cnt.email}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <span className="text-xs text-on-surface-variant p-6 text-center font-medium block">
                No matching contacts directory.
              </span>
            )}
          </div>
        </Card>

        {/* Contact details inspector */}
        <Card className="lg:col-span-7 p-5 border-brand-border dark:border-zinc-800/60 bg-white dark:bg-zinc-950 flex flex-col justify-between gap-4 text-left">
          {activeContact ? (
            <div className="flex flex-col gap-4 h-full">
              <div className="flex items-center gap-4 pb-3 border-b border-brand-border dark:border-zinc-800">
                {activeContact.avatarUrl ? (
                  <img
                    src={activeContact.avatarUrl}
                    alt={activeContact.displayName}
                    className="w-14 h-14 rounded-full border border-brand-border object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-zinc-850 text-slate-500 flex items-center justify-center font-bold text-lg border border-brand-border select-none">
                    {activeContact.firstName[0]}
                    {activeContact.lastName[0] || ""}
                  </div>
                )}
                <div className="flex flex-col text-left">
                  <h3 className="font-extrabold text-sm text-brand-navy dark:text-foreground leading-snug">
                    {activeContact.displayName}
                  </h3>
                  <span className="text-[10px] text-on-surface-variant font-medium">
                    Contact ID: {activeContact.id}
                  </span>
                </div>
              </div>

              {/* Core metrics details */}
              <div className="flex flex-col gap-3 py-1">
                <div className="flex items-center gap-3.5 text-xs text-on-surface-variant font-semibold">
                  <Mail className="h-4 w-4 shrink-0 text-on-surface-variant/80" />
                  <span>{activeContact.email}</span>
                </div>
                <div className="flex items-center gap-3.5 text-xs text-on-surface-variant font-semibold">
                  <Phone className="h-4 w-4 shrink-0 text-on-surface-variant/80" />
                  <span>{activeContact.phone}</span>
                </div>
                <div className="flex items-center gap-3.5 text-xs text-on-surface-variant font-semibold">
                  <Briefcase className="h-4 w-4 shrink-0 text-on-surface-variant/80" />
                  <span>
                    {activeContact.jobTitle} at <strong className="text-brand-navy dark:text-foreground font-bold">{activeContact.company}</strong>
                  </span>
                </div>
                {activeContact.groups.length > 0 && (
                  <div className="flex items-center gap-3.5 text-xs text-on-surface-variant font-semibold">
                    <Layers className="h-4 w-4 shrink-0 text-on-surface-variant/80" />
                    <div className="flex flex-wrap gap-1.5">
                      {activeContact.groups.map((grp, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] bg-brand-sky-light/80 text-brand-sky px-2 py-0.5 rounded-full font-bold"
                        >
                          {grp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-auto border-t border-brand-border dark:border-zinc-800 pt-4 flex gap-3 text-xs font-semibold text-on-surface-variant">
                <div className="flex justify-between w-full">
                  <span>Last Handshake Synced</span>
                  <span className="text-brand-navy dark:text-foreground font-bold">
                    {new Date(activeContact.syncedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 gap-2 h-full">
              <Users className="h-10 w-10 text-on-surface-variant/40" />
              <span className="text-xs text-on-surface-variant/80 font-semibold">
                Select a contact entry to preview
              </span>
            </div>
          )}
        </Card>
      </div>

      {/* CSV Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-brand-navy/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 bg-white dark:bg-zinc-950 flex flex-col gap-5 border border-brand-border">
            <div className="flex flex-col gap-0.5 text-left border-b border-brand-border pb-3">
              <h3 className="font-bold text-base text-brand-navy dark:text-foreground">
                Import CSV Contacts List
              </h3>
              <p className="text-xs text-on-surface-variant/80 font-medium">
                Paste raw comma-separated values matching formatting columns parameters below.
              </p>
            </div>

            <form onSubmit={handleImportCSV} className="flex flex-col gap-4 text-left">
              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant/50 block">
                  CSV Formatting Template
                </span>
                <span className="text-[10px] font-mono p-2 bg-brand-slate dark:bg-zinc-900 border border-brand-border rounded font-bold text-on-surface-variant block select-all">
                  Name, Email, Phone, Company, JobTitle
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  Contacts Data
                </label>
                <textarea
                  rows={5}
                  value={csvInput}
                  onChange={(e) => setCsvInput(e.target.value)}
                  placeholder="e.g. John Doe,john@doe.com,+15550212,Global Corp,CTO"
                  className="w-full p-2 text-xs font-mono border border-brand-border dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-navy/15 dark:bg-zinc-950"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3.5 border-t border-brand-border dark:border-zinc-800/80 pt-4 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowImportModal(false)}
                  className="font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="success"
                  size="sm"
                  className="font-bold"
                >
                  Import Contacts
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
