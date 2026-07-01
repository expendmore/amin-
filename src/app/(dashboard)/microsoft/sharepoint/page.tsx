"use client";

import React, { useMemo, useState } from "react";
import { useMicrosoft365 } from "@/store/use-microsoft-365";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/store/use-toast";
import {
  Layers,
  ArrowRight,
  FileText,
  Search,
  Download,
  Share2,
  Lock
} from "lucide-react";

export default function SharePointPage() {
  const { addToast } = useToast();
  const {
    sharepointSites,
    sharepointLibraries,
    onedriveFiles,
    activeAccountId
  } = useMicrosoft365();

  const [selectedSiteId, setSelectedSiteId] = useState<string>("sp-site-1");
  const [selectedLibraryId, setSelectedLibraryId] = useState<string>("sp-lib-1");

  const activeSite = useMemo(() => {
    return sharepointSites.find(s => s.id === selectedSiteId) || null;
  }, [sharepointSites, selectedSiteId]);

  const activeLibraries = useMemo(() => {
    return sharepointLibraries.filter(lib => lib.siteId === selectedSiteId);
  }, [sharepointLibraries, selectedSiteId]);

  // Mock sharepoint documents pulled from active OneDrive items for preview
  const libraryDocuments = useMemo(() => {
    const list = onedriveFiles[activeAccountId] || [];
    return list.slice(0, 2); // show sample docs as library items
  }, [onedriveFiles, activeAccountId]);

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            SharePoint Corporate Sites
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Review SharePoint sites catalogs, manage document libraries access, and synchronize intranet folders.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        {/* Sites registry selector */}
        <Card className="lg:col-span-4 p-4 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
          <h3 className="font-bold text-xs text-brand-navy dark:text-foreground uppercase tracking-wider block">
            SharePoint Sites Registry
          </h3>

          <div className="flex flex-col gap-2.5">
            {sharepointSites.map((site) => {
              const isSelected = site.id === selectedSiteId;
              return (
                <div
                  key={site.id}
                  onClick={() => setSelectedSiteId(site.id)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    isSelected
                      ? "border-brand-navy bg-brand-slate/60 dark:border-white dark:bg-zinc-900/60"
                      : "border-brand-border dark:border-zinc-800 hover:border-brand-navy/60 bg-white dark:bg-zinc-950"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Layers className="h-5 w-5 text-brand-sky shrink-0" />
                    <div className="flex flex-col min-w-0 text-left">
                      <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate font-sans">
                        {site.displayName}
                      </span>
                      <span className="text-[10px] text-on-surface-variant/80 truncate font-semibold">
                        {site.webUrl}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-on-surface-variant/60" />
                </div>
              );
            })}
          </div>
        </Card>

        {/* Libraries listing and Documents preview */}
        <Card className="lg:col-span-8 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 overflow-hidden text-left">
          {activeSite ? (
            <div className="flex flex-col gap-4 h-full overflow-hidden text-left">
              {/* Site Details */}
              <div className="pb-3 border-b border-brand-border text-left">
                <h3 className="font-extrabold text-sm text-brand-navy dark:text-foreground">
                  {activeSite.displayName}
                </h3>
                <p className="text-xs text-on-surface-variant/80 font-medium leading-relaxed mt-1">
                  {activeSite.description}
                </p>
              </div>

              {/* Document libraries inside this site */}
              <div className="flex flex-col gap-2.5">
                <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-wider block">
                  Document Libraries
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {activeLibraries.map((lib) => {
                    const isSelected = lib.id === selectedLibraryId;
                    return (
                      <div
                        key={lib.id}
                        onClick={() => setSelectedLibraryId(lib.id)}
                        className={`p-3.5 rounded-xl border flex flex-col gap-1 cursor-pointer transition-all ${
                          isSelected
                            ? "border-brand-navy bg-brand-slate/60 dark:border-white dark:bg-zinc-900/60"
                            : "border-brand-border dark:border-zinc-800 hover:border-brand-navy/60 bg-white dark:bg-zinc-950"
                        }`}
                      >
                        <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate font-sans">
                          {lib.name}
                        </span>
                        <p className="text-[10px] text-on-surface-variant/80 font-semibold truncate">
                          {lib.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Documents preview inside active library */}
              <div className="flex flex-col gap-2.5 mt-2 flex-1 overflow-hidden">
                <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-wider block">
                  Shared Intranet Documents Index
                </span>

                <div className="border border-brand-border dark:border-zinc-800 rounded-xl overflow-hidden divide-y divide-brand-border dark:divide-zinc-800 flex-1 overflow-y-auto">
                  {libraryDocuments.map((doc) => (
                    <div key={doc.id} className="p-3.5 bg-white dark:bg-zinc-900/10 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="h-5 w-5 text-brand-sky shrink-0" />
                        <div className="flex flex-col min-w-0 text-left">
                          <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate font-sans">
                            {doc.name}
                          </span>
                          <span className="text-[10px] text-on-surface-variant/80 font-semibold">
                            Modified {new Date(doc.lastModifiedDateTime).toLocaleDateString()} • {doc.size}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <a href={doc.webUrl} target="_blank" rel="noreferrer">
                          <button className="h-8 px-3 rounded-lg border border-brand-border text-xs text-on-surface-variant font-bold hover:bg-brand-slate hover:text-brand-navy cursor-pointer flex items-center gap-1.5">
                            <Download className="h-3.5 w-3.5" />
                            Download
                          </button>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-2">
              <Layers className="h-10 w-10 text-on-surface-variant/40" />
              <span className="text-xs text-on-surface-variant/80 font-semibold">
                Select a SharePoint site on the left registry.
              </span>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
