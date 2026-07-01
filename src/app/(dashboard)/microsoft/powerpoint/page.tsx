"use client";

import React, { useMemo, useState } from "react";
import { useMicrosoft365 } from "@/store/use-microsoft-365";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import {
  FileText,
  Search,
  Plus,
  Play,
  Download
} from "lucide-react";

export default function PowerPointPage() {
  const { addToast } = useToast();
  const { activeAccountId } = useMicrosoft365();
  const [searchQuery, setSearchQuery] = useState("");

  const presentations = [
    { id: "ppt-1", title: "ExpendMore Pitch Deck.pptx", slides: 18, modified: getPastDateString(1), author: "anshuman@anshumanenterprises1119.onmicrosoft.com" },
    { id: "ppt-2", title: "Stitch Design Guidelines overview.pptx", slides: 12, modified: getPastDateString(4), author: "rohan@stitchdesignhub.onmicrosoft.com" }
  ];

  function getPastDateString(offsetDays: number = 0) {
    const d = new Date();
    d.setDate(d.getDate() - offsetDays);
    return d.toLocaleDateString();
  }

  const filteredPpts = useMemo(() => {
    return presentations.filter(p =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            PowerPoint Online Integration
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Browse corporate pitch decks, manage presentation assets, and generate slide summaries.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[400px]">
        {/* Presentation lists */}
        <Card className="lg:col-span-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-brand-border flex items-center gap-2">
            <Search className="h-4 w-4 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Search presentations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none text-xs focus:outline-none text-brand-navy dark:text-foreground font-semibold placeholder:text-on-surface-variant/50"
            />
          </div>

          <div className="divide-y divide-brand-border overflow-y-auto max-h-[350px]">
            {filteredPpts.map((ppt) => (
              <div
                key={ppt.id}
                className="p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-brand-slate/40 dark:hover:bg-zinc-900/10"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="h-5 w-5 text-[#D83B01] shrink-0" />
                  <div className="flex flex-col min-w-0 text-left">
                    <span className="text-xs font-bold text-brand-navy dark:text-foreground truncate font-sans">
                      {ppt.title}
                    </span>
                    <span className="text-[10px] text-on-surface-variant/80 font-semibold">
                      {ppt.slides} slides • Modified {ppt.modified}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Preview and Slides operations */}
        <Card className="lg:col-span-7 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col items-center justify-center text-center gap-3.5 min-h-[300px]">
          <Play className="h-10 w-10 text-[#D83B01]" />
          <div className="flex flex-col gap-0.5">
            <h4 className="font-extrabold text-xs text-brand-navy dark:text-foreground">
              PowerPoint Presentation Simulator
            </h4>
            <p className="text-[10px] text-on-surface-variant/80 max-w-[280px] leading-relaxed font-semibold">
              Select presentation from your OneDrive catalog to review outlines summaries, slide transcripts, and shared permissions.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
