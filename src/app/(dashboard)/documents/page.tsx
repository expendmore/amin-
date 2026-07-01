"use client";

import React, { useState } from "react";
import DashboardShell from "@/components/navigation/DashboardShell";
import PageContainer from "@/components/navigation/PageContainer";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useDashboard } from "@/store/use-dashboard";
import { useToast } from "@/store/use-toast";
import { FileText, Plus, FileEdit, Trash, Search, Star, Archive } from "lucide-react";

type DocTab = "all" | "pinned" | "drafts" | "shared" | "archived";

export default function DocumentsPage() {
  const { addToast } = useToast();
  const { 
    documents, 
    addDocument, 
    deleteDocument, 
    togglePinDocument, 
    toggleArchiveDocument 
  } = useDashboard();

  const [activeTab, setActiveTab] = useState<DocTab>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreateDocument = () => {
    const id = addDocument("Untitled Document");
    addToast("New document canvas created successfully!", "success");
  };

  const handleDelete = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteDocument(id);
    addToast(`Document "${name}" deleted`, "info");
  };

  const handleTogglePin = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    togglePinDocument(id);
    addToast(`Toggled pin state for "${name}"`, "success");
  };

  const handleToggleArchive = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleArchiveDocument(id);
    addToast(`Toggled archive state for "${name}"`, "success");
  };

  // Filter logic
  const filteredDocs = documents
    .filter((doc) => {
      // Archive filter behavior
      if (activeTab === "archived") return doc.isArchived;
      if (doc.isArchived) return false; // Hide archived in general lists

      if (activeTab === "pinned") return doc.isPinned;
      if (activeTab === "drafts") return doc.isDraft;
      if (activeTab === "shared") return doc.isShared;
      return true;
    })
    .filter((doc) => {
      if (!searchQuery) return true;
      return doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    });

  return (
    <DashboardShell>
      <PageContainer
        title="Documents Directory"
        subtitle="Manage and edit your Markdown document workspaces side-by-side with chats."
        headerActions={
          <Button onClick={handleCreateDocument} size="sm">
            <Plus className="h-4 w-4 mr-1.5" />
            <span>Create Document</span>
          </Button>
        }
      >
        <div className="flex flex-col lg:flex-row gap-6 border border-border bg-card rounded-2xl p-6 h-[calc(100vh-180px)] md:h-[calc(100vh-140px)] overflow-hidden">
          
          {/* Navigation Sidebar Panel */}
          <div className="w-full lg:w-56 shrink-0 flex flex-col gap-1 border-b lg:border-b-0 lg:border-r border-border pb-4 lg:pb-0 lg:pr-4 select-none">
            {(["all", "pinned", "drafts", "shared", "archived"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2.5 px-3 h-10 rounded-lg text-xs font-semibold text-left capitalize transition-colors duration-150 ${
                  activeTab === tab
                    ? "bg-secondary text-foreground border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === "pinned" ? (
                  <Star className="h-4 w-4 shrink-0 text-yellow-500" fill="currentColor" />
                ) : tab === "archived" ? (
                  <Archive className="h-4 w-4 shrink-0" />
                ) : (
                  <FileText className="h-4 w-4 shrink-0" />
                )}
                <span>{tab === "all" ? "All Documents" : `${tab} documents`}</span>
              </button>
            ))}
          </div>

          {/* Core Documents Directory Area */}
          <div className="flex-grow flex flex-col gap-4 overflow-hidden h-full">
            
            {/* Filter & Search Header Panel */}
            <div className="w-full sm:w-64 shrink-0 select-none">
              <Input
                placeholder="Search document title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                startIcon={<Search className="h-4 w-4" />}
              />
            </div>

            {/* Documents Grid Viewport */}
            <div className="flex-grow overflow-y-auto pr-1 pb-4">
              {filteredDocs.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center max-w-sm mx-auto my-auto h-64 gap-4 select-none">
                  <span className="p-3 bg-secondary text-muted-foreground rounded-full border border-border">
                    <FileText className="h-6 w-6" />
                  </span>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-bold text-foreground">No documents found</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Create a new canvas to start drafting structured markdown pieces.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="obsidian-glass-dark p-5 rounded-2xl border border-border flex flex-col justify-between gap-5 hover:scale-[1.015] active:scale-[0.99] transition-all duration-200 group cursor-pointer select-none"
                    >
                      <div className="flex gap-4 items-start">
                        <span className="p-2.5 bg-secondary text-muted-foreground rounded-xl border border-border group-hover:text-brand-500 transition-colors shrink-0">
                          <FileText className="h-5 w-5" />
                        </span>
                        <div className="flex flex-col gap-0.5">
                          <h4 className="font-semibold text-foreground text-sm line-clamp-1">{doc.title}</h4>
                          <span className="text-[10px] text-muted-foreground">
                            Last edited: {new Date(doc.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        </div>
                      </div>

                      {/* Document Actions row */}
                      <div className="flex gap-2 justify-end pt-2 border-t border-border/45">
                        <button
                          onClick={(e) => handleTogglePin(doc.id, doc.title, e)}
                          className={`p-1.5 rounded-lg hover:bg-secondary transition-colors ${
                            doc.isPinned ? "text-yellow-500" : "text-muted-foreground hover:text-foreground"
                          }`}
                          title="Pin Document"
                        >
                          <Star className="h-4 w-4" fill={doc.isPinned ? "currentColor" : "none"} />
                        </button>
                        <button
                          onClick={(e) => handleToggleArchive(doc.id, doc.title, e)}
                          className={`p-1.5 rounded-lg hover:bg-secondary transition-colors ${
                            doc.isArchived ? "text-brand-500" : "text-muted-foreground hover:text-foreground"
                          }`}
                          title="Archive Document"
                        >
                          <Archive className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(doc.id, doc.title, e)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded-lg hover:bg-secondary"
                          title="Delete Document"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </PageContainer>
    </DashboardShell>
  );
}
