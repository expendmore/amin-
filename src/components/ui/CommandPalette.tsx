"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { useTheme } from "@/store/use-theme";
import { useToast } from "@/store/use-toast";
import {
  Search,
  MessageSquare,
  FileText,
  Settings,
  Sun,
  Moon,
  ArrowRight,
  LayoutDashboard,
  Bolt,
  Bot,
  User,
  FolderOpen,
  Calendar,
} from "lucide-react";

interface CommandItem {
  label: string;
  category: "Navigation" | "Workflows & Agents" | "Contacts" | "Recent Files" | "Actions";
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
}

export function CommandPalette() {
  const router = useRouter();
  const { theme, toggleTheme, setTheme } = useTheme();
  const { addToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Capture Cmd+K / Ctrl+K hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const commands: CommandItem[] = [
    // Navigation
    { label: "Go to Dashboard", category: "Navigation", icon: LayoutDashboard, action: () => router.push("/dashboard") },
    { label: "Go to AI Assistant", category: "Navigation", icon: MessageSquare, action: () => router.push("/chat") },
    { label: "Go to AI Agents Studio", category: "Navigation", icon: Bot, action: () => router.push("/chat/agents") },
    { label: "Go to Workflow Builder", category: "Navigation", icon: Bolt, action: () => router.push("/workflows") },
    { label: "Go to File Manager", category: "Navigation", icon: FolderOpen, action: () => router.push("/files") },
    { label: "Go to Settings", category: "Navigation", icon: Settings, action: () => router.push("/settings") },
    
    // Workflows
    { label: "Abandoned Cart Recovery Flow", category: "Workflows & Agents", icon: Bolt, action: () => router.push("/workflows") },
    { label: "Lead Qualification Smart Agent", category: "Workflows & Agents", icon: Bot, action: () => router.push("/chat/agents") },
    { label: "Stripe Payment Invoice Generator", category: "Workflows & Agents", icon: Bolt, action: () => router.push("/workflows") },

    // Contacts
    { label: "Arjun Sharma (arjun@expendmore.com)", category: "Contacts", icon: User, action: () => router.push("/whatsapp/contacts") },
    { label: "Sarah Connor (sarah@expendmore.com)", category: "Contacts", icon: User, action: () => router.push("/whatsapp/contacts") },
    { label: "David Miller (david@expendmore.com)", category: "Contacts", icon: User, action: () => router.push("/whatsapp/contacts") },

    // Files
    { label: "weekly_report_june.pdf", category: "Recent Files", icon: FileText, action: () => router.push("/files") },
    { label: "whatsapp_templates.json", category: "Recent Files", icon: FileText, action: () => router.push("/files") },
    { label: "crm_integration_logs.txt", category: "Recent Files", icon: FileText, action: () => router.push("/files") },

    // Actions
    { label: "Switch to Light Theme", category: "Actions", icon: Sun, action: () => { setTheme("light"); addToast("Light mode enabled", "info"); } },
    { label: "Switch to Dark Theme", category: "Actions", icon: Moon, action: () => { setTheme("dark"); addToast("Dark mode enabled", "info"); } },
    { label: "Switch to System Theme", category: "Actions", icon: Settings, action: () => { setTheme("system"); addToast("System theme enabled", "info"); } },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cmd.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group filtered commands by category for display
  const categoriesMap: Record<string, CommandItem[]> = {};
  filteredCommands.forEach((cmd) => {
    if (!categoriesMap[cmd.category]) {
      categoriesMap[cmd.category] = [];
    }
    categoriesMap[cmd.category].push(cmd);
  });

  const categoriesOrder = ["Navigation", "Workflows & Agents", "Contacts", "Recent Files", "Actions"];

  // Handle keyboard list indexes
  const handleKeyDownList = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredCommands.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredCommands.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        setIsOpen(false);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
      setSearchQuery("");
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Translate categorized items back to global index for keyboard highlighting
  let globalItemIndex = 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-xl p-0 overflow-hidden bg-white dark:bg-zinc-950 border-brand-border dark:border-border/60 shadow-2xl rounded-2xl transition-colors">
        
        {/* Search bar input container */}
        <div className="flex items-center px-4 border-b border-brand-border dark:border-border/50">
          <Search className="h-4.5 w-4.5 text-on-surface-variant shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type search queries (e.g. settings, workflow, files)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDownList}
            className="w-full h-12 bg-transparent text-xs md:text-sm text-brand-navy dark:text-foreground placeholder:text-on-surface-variant/60 focus:outline-none"
          />
          <kbd className="h-5 px-1.5 bg-brand-slate dark:bg-surface border border-brand-border dark:border-border rounded text-[9px] font-bold text-on-surface-variant/80 flex items-center select-none shrink-0">
            ESC
          </kbd>
        </div>

        {/* Categories scroll area */}
        <div className="p-2 max-h-[350px] overflow-y-auto scrollbar-thin">
          {filteredCommands.length === 0 ? (
            <div className="text-center py-8 text-xs text-on-surface-variant select-none">
              No matching workspace items found.
            </div>
          ) : (
            categoriesOrder.map((catName) => {
              const catItems = categoriesMap[catName];
              if (!catItems || catItems.length === 0) return null;

              return (
                <div key={catName} className="mb-3 last:mb-0">
                  {/* Category Section Header */}
                  <span className="block text-[9px] font-bold uppercase tracking-wider text-on-surface-variant/60 px-3 py-1.5 select-none">
                    {catName}
                  </span>

                  {/* Render category child items */}
                  <div className="flex flex-col gap-0.5">
                    {catItems.map((cmd) => {
                      const Icon = cmd.icon;
                      const currentGlobalIndex = globalItemIndex++;
                      const isSelected = currentGlobalIndex === selectedIndex;

                      return (
                        <div
                          key={cmd.label}
                          onClick={() => {
                            cmd.action();
                            setIsOpen(false);
                          }}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors select-none ${
                            isSelected
                              ? "bg-brand-navy text-white dark:bg-white dark:text-brand-navy"
                              : "text-on-surface-variant hover:text-brand-navy dark:hover:text-foreground hover:bg-brand-slate dark:hover:bg-surface-container"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-4.5 w-4.5 shrink-0 text-current" />
                            <span>{cmd.label}</span>
                          </div>
                          {isSelected && (
                            <ArrowRight className="h-3.5 w-3.5 text-current shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommandPalette;
