"use client";

import React, { useState } from "react";
import DashboardShell from "@/components/navigation/DashboardShell";
import PageContainer from "@/components/navigation/PageContainer";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import { 
  HelpCircle, 
  BookOpen, 
  MessageSquareCode, 
  Bug, 
  Keyboard, 
  Info,
  ChevronDown,
  ChevronUp,
  Mail,
  Send
} from "lucide-react";

type HelpTab = "faq" | "docs" | "support" | "shortcuts" | "about";

export default function HelpPage() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<HelpTab>("faq");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Forms states
  const [feedback, setFeedback] = useState("");
  const [bugTitle, setBugTitle] = useState("");
  const [bugDesc, setBugDesc] = useState("");
  const [supportMsg, setSupportMsg] = useState("");

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    addToast("Thank you for your feedback!", "success");
    setFeedback("");
  };

  const handleReportBug = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bugTitle.trim() || !bugDesc.trim()) return;
    addToast("Bug report submitted successfully. Our engineers are investigating.", "success");
    setBugTitle("");
    setBugDesc("");
  };

  const handleContactSupport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMsg.trim()) return;
    addToast("Support ticket raised. You will receive an email response shortly.", "success");
    setSupportMsg("");
  };

  const faqs = [
    {
      q: "What AI models does ExpendMore support?",
      a: "ExpendMore provides integration adapters to Claude 3.5 Sonnet, GPT-4o, GPT-4o-mini, Gemini Lite, and DALL-E, all accessible via a singular, visual dashboard without needing separate subscriptions."
    },
    {
      q: "How does the token tracking/credit system work?",
      a: "Each account receives free credits refreshed daily. Actions consume credits depending on model complexity (e.g. standard GPT-4o-mini vs. Claude 3.5). Paid tiers upgrade your rate limit bounds and daily credits allocation."
    },
    {
      q: "Is my workspace content private?",
      a: "Yes. All database records (conversations, messages, and uploaded files) are protected using PostgreSQL Row-Level Security (RLS) constraints, restricting access strictly to authenticated account owners."
    },
    {
      q: "Can I cancel my subscription at any time?",
      a: "Yes. Subscription renewals are self-serviced. You can modify billing cycles or terminate plans instantly via the Stripe subscription setting dashboard available in the Account drawer."
    }
  ];

  return (
    <DashboardShell>
      <PageContainer
        title="Help Center"
        subtitle="Access platform guides, submit bug logs, and contact support nodes."
      >
        <div className="flex flex-col lg:flex-row gap-6 border border-border bg-card rounded-2xl p-6 h-[calc(100vh-180px)] md:h-[calc(100vh-140px)] overflow-hidden">
          
          {/* Navigation Sidebar Panel */}
          <div className="w-full lg:w-56 shrink-0 flex flex-col gap-1 border-b lg:border-b-0 lg:border-r border-border pb-4 lg:pb-0 lg:pr-4 select-none">
            <button
              onClick={() => setActiveTab("faq")}
              className={`flex items-center gap-2.5 px-3 h-10 rounded-lg text-xs font-semibold text-left transition-colors duration-150 ${
                activeTab === "faq"
                  ? "bg-secondary text-foreground border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <HelpCircle className="h-4 w-4 shrink-0" />
              <span>FAQ Directory</span>
            </button>
            <button
              onClick={() => setActiveTab("docs")}
              className={`flex items-center gap-2.5 px-3 h-10 rounded-lg text-xs font-semibold text-left transition-colors duration-150 ${
                activeTab === "docs"
                  ? "bg-secondary text-foreground border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookOpen className="h-4 w-4 shrink-0" />
              <span>Guides & Documentation</span>
            </button>
            <button
              onClick={() => setActiveTab("support")}
              className={`flex items-center gap-2.5 px-3 h-10 rounded-lg text-xs font-semibold text-left transition-colors duration-150 ${
                activeTab === "support"
                  ? "bg-secondary text-foreground border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MessageSquareCode className="h-4 w-4 shrink-0" />
              <span>Support & Feedback</span>
            </button>
            <button
              onClick={() => setActiveTab("shortcuts")}
              className={`flex items-center gap-2.5 px-3 h-10 rounded-lg text-xs font-semibold text-left transition-colors duration-150 ${
                activeTab === "shortcuts"
                  ? "bg-secondary text-foreground border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Keyboard className="h-4 w-4 shrink-0" />
              <span>Keyboard Shortcuts</span>
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`flex items-center gap-2.5 px-3 h-10 rounded-lg text-xs font-semibold text-left transition-colors duration-150 ${
                activeTab === "about"
                  ? "bg-secondary text-foreground border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Info className="h-4 w-4 shrink-0" />
              <span>About Workspace</span>
            </button>
          </div>

          {/* Interactive Form Area */}
          <div className="flex-grow overflow-y-auto lg:pl-4">
            
            {/* FAQ TAB */}
            {activeTab === "faq" && (
              <div className="flex flex-col gap-4 max-w-2xl select-none">
                <div className="flex flex-col gap-1 mb-2">
                  <h3 className="text-sm font-bold text-foreground">Frequently Asked Questions</h3>
                  <p className="text-xs text-muted-foreground">General questions regarding model rate limits and privacy.</p>
                </div>

                {faqs.map((faq, i) => (
                  <div 
                    key={i}
                    className="obsidian-glass-dark border border-border/45 rounded-xl overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                      className="w-full px-4 py-3 flex items-center justify-between text-left focus:outline-none hover:bg-zinc-950/20"
                    >
                      <span className="text-xs font-semibold text-foreground">{faq.q}</span>
                      {openFaqIndex === i ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                    {openFaqIndex === i && (
                      <div className="px-4 pb-3 pt-1 border-t border-border/20 bg-zinc-950/10 text-xs text-muted-foreground leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* GUIDES TAB */}
            {activeTab === "docs" && (
              <div className="flex flex-col gap-6 max-w-2xl">
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-bold text-foreground">Guides & Documentation</h3>
                  <p className="text-xs text-muted-foreground">Learn how to maximize performance inside the workspaces.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 select-none">
                  <div className="p-5 bg-zinc-900/40 border border-border rounded-2xl flex flex-col gap-2 hover:border-brand-500/25 transition-all">
                    <span className="text-xs font-bold text-brand-400 font-mono">01 / CHAT WORKSPACE</span>
                    <h4 className="font-semibold text-sm">Token streaming & Canceling</h4>
                    <p className="text-[11px] text-muted-foreground leading-normal">
                      Learn how to trigger model changes and abort requests mid-stream.
                    </p>
                  </div>
                  <div className="p-5 bg-zinc-900/40 border border-border rounded-2xl flex flex-col gap-2 hover:border-brand-500/25 transition-all">
                    <span className="text-xs font-bold text-brand-400 font-mono">02 / CANVAS WORKSPACE</span>
                    <h4 className="font-semibold text-sm">Split document drafting</h4>
                    <p className="text-[11px] text-muted-foreground leading-normal">
                      Understand how debounced auto-saving works with Postgres schemas.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SUPPORT & FEEDBACK TAB */}
            {activeTab === "support" && (
              <div className="flex flex-col gap-8 max-w-xl">
                {/* Support Ticket */}
                <form onSubmit={handleContactSupport} className="flex flex-col gap-3">
                  <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase select-none">
                    <Mail className="h-4 w-4 text-brand-400" />
                    <span>Contact Support Node</span>
                  </h3>
                  <textarea
                    placeholder="Describe your issue or request support..."
                    value={supportMsg}
                    onChange={(e) => setSupportMsg(e.target.value)}
                    className="w-full h-24 p-3 text-xs bg-zinc-900 border border-border rounded-lg placeholder-muted-foreground focus:outline-none leading-relaxed text-zinc-300 resize-none"
                  />
                  <Button type="submit" className="w-32 h-9 text-xs self-start">
                    <Send className="h-3.5 w-3.5 mr-1.5" />
                    <span>Send Message</span>
                  </Button>
                </form>

                <hr className="border-border/45" />

                {/* Bug Report */}
                <form onSubmit={handleReportBug} className="flex flex-col gap-4">
                  <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase select-none">
                    <Bug className="h-4 w-4 text-brand-400" />
                    <span>Report System Bug</span>
                  </h3>
                  <Input
                    placeholder="e.g., Markdown table alignment shifts"
                    value={bugTitle}
                    onChange={(e) => setBugTitle(e.target.value)}
                    label="Issue Title"
                  />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Describe Bug Details</label>
                    <textarea
                      placeholder="Input diagnostic console details or reproduction steps..."
                      value={bugDesc}
                      onChange={(e) => setBugDesc(e.target.value)}
                      className="w-full h-24 p-3 text-xs bg-zinc-900 border border-border rounded-lg placeholder-muted-foreground focus:outline-none leading-relaxed text-zinc-300 resize-none"
                    />
                  </div>
                  <Button type="submit" className="w-32 h-9 text-xs self-start">
                    Submit Report
                  </Button>
                </form>
              </div>
            )}

            {/* KEYBOARD SHORTCUTS TAB */}
            {activeTab === "shortcuts" && (
              <div className="flex flex-col gap-6 max-w-xl select-none">
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-bold text-foreground">Keyboard Shortcuts</h3>
                  <p className="text-xs text-muted-foreground">Control dashboard workspaces using active keyboard configurations.</p>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="p-3.5 bg-zinc-900/40 border border-border rounded-xl flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">Global Search Console</span>
                    <kbd className="h-6 px-1.5 bg-zinc-950 border border-zinc-800 rounded-md text-[10px] font-mono text-zinc-400 flex items-center select-none shadow-md">
                      ⌘K / Ctrl+K
                    </kbd>
                  </div>
                  <div className="p-3.5 bg-zinc-900/40 border border-border rounded-xl flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">Focus Prompter Input</span>
                    <kbd className="h-6 px-1.5 bg-zinc-950 border border-zinc-800 rounded-md text-[10px] font-mono text-zinc-400 flex items-center select-none shadow-md">
                      /
                    </kbd>
                  </div>
                  <div className="p-3.5 bg-zinc-900/40 border border-border rounded-xl flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">Close Active Modal</span>
                    <kbd className="h-6 px-1.5 bg-zinc-950 border border-zinc-800 rounded-md text-[10px] font-mono text-zinc-400 flex items-center select-none shadow-md">
                      Esc
                    </kbd>
                  </div>
                </div>
              </div>
            )}

            {/* ABOUT TAB */}
            {activeTab === "about" && (
              <div className="flex flex-col gap-4 max-w-xl select-none">
                <div className="flex flex-col gap-1 mb-2">
                  <h3 className="text-sm font-bold text-foreground">About ExpendMore Workspace</h3>
                  <p className="text-xs text-muted-foreground">Workspace build details and technology metrics.</p>
                </div>

                <div className="flex flex-col gap-3 text-xs text-zinc-300 leading-relaxed">
                  <p>
                    ExpendMore is built on Next.js 15 App Router structures and Supabase Server Helpers, isolated using Row-Level Security checks.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="p-4 bg-zinc-900/30 border border-border rounded-xl flex flex-col">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Build Version</span>
                      <span className="text-sm font-semibold text-foreground font-mono mt-1">1.0.0-release</span>
                    </div>
                    <div className="p-4 bg-zinc-900/30 border border-border rounded-xl flex flex-col">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Latency Standard</span>
                      <span className="text-sm font-semibold text-brand-400 font-mono mt-1">TTFB &lt; 300ms</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    </DashboardShell>
  );
}
