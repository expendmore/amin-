"use client";

import React, { useMemo, useState } from "react";
import { useGoogleWorkspace } from "@/store/use-google-workspace";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import {
  FileText,
  Search,
  Plus,
  BookOpen,
  ArrowRight,
  Settings,
  Star,
  Download
} from "lucide-react";

export default function GoogleDocsPage() {
  const { addToast } = useToast();
  const {
    docs,
    docTemplates
  } = useGoogleWorkspace();

  const [selectedDocId, setSelectedDocId] = useState<string | null>("file-4");
  const [searchQuery, setSearchQuery] = useState("");

  const activeDoc = useMemo(() => {
    return docs.find(d => d.id === selectedDocId) || null;
  }, [docs, selectedDocId]);

  const filteredDocs = useMemo(() => {
    return docs.filter(d =>
      d.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [docs, searchQuery]);

  const handleUseTemplate = (tplName: string) => {
    addToast(`Successfully generated new document from template: ${tplName}`, "success");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Google Docs Integration
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Access organization playbooks, generate proposals from templates, and embed documents index maps.
          </p>
        </div>
      </div>

      {/* Template picker gallery */}
      <div className="flex flex-col gap-3 text-left">
        <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-wider block">
          Document Template Library
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {docTemplates.map((tpl) => (
            <Card key={tpl.id} className="p-4 border-brand-border dark:border-zinc-800/60 bg-white dark:bg-zinc-950 flex flex-col justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-16 bg-brand-slate border border-brand-border rounded flex items-center justify-center shrink-0 text-slate-400">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="flex flex-col gap-1 text-left min-w-0">
                  <h4 className="font-bold text-xs text-brand-navy dark:text-foreground">
                    {tpl.name}
                  </h4>
                  <span className="text-[9px] bg-brand-sky-light/80 text-brand-sky px-2 py-0.5 rounded-full font-bold w-fit">
                    {tpl.category}
                  </span>
                  <p className="text-[10px] text-on-surface-variant/80 mt-1 font-semibold leading-relaxed">
                    {tpl.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => handleUseTemplate(tpl.name)}
                  className="font-bold text-[10px]"
                >
                  Create Document
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[400px] mt-2">
        {/* Document list selector */}
        <Card className="lg:col-span-5 border-brand-border dark:border-zinc-800/60 bg-white dark:bg-zinc-950 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-brand-border flex items-center gap-2">
            <Search className="h-4 w-4 text-on-surface-variant/80" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none text-xs focus:outline-none text-brand-navy dark:text-foreground font-semibold placeholder:text-on-surface-variant/50"
            />
          </div>

          <div className="divide-y divide-brand-border dark:divide-zinc-800/60 overflow-y-auto max-h-[350px]">
            {filteredDocs.length > 0 ? (
              filteredDocs.map((doc) => {
                const isSelected = doc.id === selectedDocId;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDocId(doc.id)}
                    className={`p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      isSelected
                        ? "bg-brand-slate/80 dark:bg-zinc-900/60"
                        : "hover:bg-brand-slate/40 dark:hover:bg-zinc-900/10"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="h-5 w-5 text-brand-sky shrink-0" />
                      <div className="flex flex-col min-w-0 text-left">
                        <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate">
                          {doc.title}
                        </span>
                        <span className="text-[10px] text-on-surface-variant/80 font-semibold truncate">
                          Modified {new Date(doc.lastModified).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {doc.starred && (
                      <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />
                    )}
                  </div>
                );
              })
            ) : (
              <span className="text-xs text-on-surface-variant/80 p-6 text-center font-medium block">
                No matching documents.
              </span>
            )}
          </div>
        </Card>

        {/* Doc Preview description Panel */}
        <Card className="lg:col-span-7 p-5 border-brand-border dark:border-zinc-800/60 bg-white dark:bg-zinc-950 flex flex-col justify-between gap-4 text-left">
          {activeDoc ? (
            <div className="flex flex-col gap-4 h-full">
              <div className="flex flex-col gap-3 pb-3 border-b border-brand-border dark:border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <FileText className="h-6 w-6 text-brand-sky shrink-0" />
                  <div className="flex flex-col text-left">
                    <h3 className="font-extrabold text-sm text-brand-navy dark:text-foreground leading-snug">
                      {activeDoc.title}
                    </h3>
                    <a
                      href={activeDoc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-brand-sky font-bold hover:underline"
                    >
                      Open in Google Docs
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 text-[11px] font-semibold text-on-surface-variant">
                <div className="flex justify-between">
                  <span>Word Count</span>
                  <span className="text-brand-navy dark:text-foreground font-bold">
                    {activeDoc.wordCount} words
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Author</span>
                  <span className="text-brand-navy dark:text-foreground truncate max-w-[120px]">
                    {activeDoc.ownedBy}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Last Modified</span>
                  <span className="text-brand-navy dark:text-foreground">
                    {new Date(activeDoc.lastModified).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-auto border-t border-brand-border dark:border-zinc-800 pt-4 flex gap-2.5">
                <a
                  href={activeDoc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1"
                >
                  <Button variant="success" size="sm" className="w-full font-bold text-xs" leftIcon={<Download className="h-4 w-4" />}>
                    Download Document
                  </Button>
                </a>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 gap-2 h-full">
              <FileText className="h-10 w-10 text-on-surface-variant/40" />
              <span className="text-xs text-on-surface-variant/80 font-semibold">
                Select a document to inspect preview
              </span>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
