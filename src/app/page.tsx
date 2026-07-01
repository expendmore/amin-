"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  CheckCircle2, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  Workflow, 
  Lock, 
  ArrowRight, 
  HelpCircle, 
  FileText, 
  Image as ImageIcon,
  MousePointerClick,
  Star,
  Users,
  Terminal,
  ArrowUpRight,
  ShieldCheck,
  Send,
  Code
} from "lucide-react";

export default function LandingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  
  // Interactive mockup chat demonstration
  const [mockMessages, setMockMessages] = useState<Array<{ role: "user" | "ai"; text: string }>>([
    { role: "user", text: "Create an outline for a SaaS launch blog post." },
    { role: "ai", text: "I have prepared the draft structure. Click 'Send to Canvas' to review or edit the full markdown article." }
  ]);
  const [demoPrompt, setDemoPrompt] = useState("");
  const [isDemoTyping, setIsDemoTyping] = useState(false);
  const [demoCanvasOpen, setDemoCanvasOpen] = useState(true);
  const [demoCanvasText, setDemoCanvasText] = useState(
    "# Launching ExpendMore: The Unified Workspace\n\n## 1. Introduction\nExpendMore integrates fragment models into a singular, dark-mode first terminal interface...\n\n## 2. Core Modules\n- **Unified Chat Console**: GPT-4o, Claude 3.5, Gemini.\n- **Image Generator Studio**: Stable Diffusion, DALL-E.\n- **Side-by-side split screen canvas**: Live Markdown editing."
  );

  const triggerDemoPrompt = (promptText: string) => {
    if (isDemoTyping) return;
    setDemoPrompt("");
    setIsDemoTyping(true);
    
    // Simulate keyboard typing effect
    let charIndex = 0;
    const interval = setInterval(() => {
      setDemoPrompt((prev) => prev + promptText.charAt(charIndex));
      charIndex++;
      if (charIndex >= promptText.length) {
        clearInterval(interval);
        
        // Wait and add message
        setTimeout(() => {
          setMockMessages((prev) => [...prev, { role: "user", text: promptText }]);
          setDemoPrompt("");
          
          // AI response typing simulation
          setTimeout(() => {
            setMockMessages((prev) => [
              ...prev, 
              { 
                role: "ai", 
                text: "Updating split-editor workspace with the new framework section..." 
              }
            ]);
            setIsDemoTyping(false);
            setDemoCanvasText((prev) => prev + "\n\n## 3. Implementation Framework\nOur deployment uses cookie-based Firebase edge session middleware to restrict routes securely.");
          }, 800);
        }, 300);
      }
    }, 40);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  // Pricing calculations
  const plans = [
    {
      name: "Free",
      description: "Ideal for testing visual builders and basic chat completions.",
      priceMonthly: 0,
      priceYearly: 0,
      cta: "Start Free",
      features: [
        "20 Free daily credits",
        "Access to GPT-4o-mini",
        "1 Active chat thread session",
        "Standard latency queue bounds"
      ],
      recommended: false
    },
    {
      name: "Pro",
      description: "Best for content writers, bloggers, and designers.",
      priceMonthly: 999,
      priceYearly: 799,
      cta: "Upgrade to Pro",
      features: [
        "Unlimited chats history log",
        "Access to Claude 3.5 & GPT-4o",
        "Standard DALL-E image generation",
        "Split document editor canvas access",
        "150 req/minute rate boundaries"
      ],
      recommended: true
    },
    {
      name: "Business",
      description: "Designed for small startup engineering & writing teams.",
      priceMonthly: 2499,
      priceYearly: 1999,
      cta: "Join Business",
      features: [
        "Everything in Pro tier level",
        "Collaborative sharing workspace links",
        "Priority dedicated processing queues",
        "API tokens dashboard settings",
        "Unlimited stored document files"
      ],
      recommended: false
    },
    {
      name: "Enterprise",
      description: "For agencies and large scale production pipelines.",
      priceMonthly: "Custom",
      priceYearly: "Custom",
      cta: "Contact Enterprise",
      features: [
        "Unlimited model adapter invocations",
        "Custom daily credit quota mappings",
        "Audit log exports & usage details",
        "Row-level security API key integrations",
        "Dedicated container proxy routing"
      ],
      recommended: false
    }
  ];

  const faqs = [
    {
      q: "What AI models does ExpendMore support?",
      a: "ExpendMore provides adapters to leading LLM and image providers, including Claude 3.5 Sonnet, GPT-4o, GPT-4o-mini, and DALL-E, all accessible via a singular, visual dashboard without needing separate subscriptions."
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

  const testimonials = [
    {
      quote: "ExpendMore has completely eliminated our need for separate OpenAI and Anthropic subscriptions. The side-by-side split canvas editor is a game-changer for our copywriters.",
      author: "Arjun Mehta",
      role: "VP of Product",
      company: "Aether SaaS",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80"
    },
    {
      quote: "The unified chat console is incredibly fast. Having real-time streams of GPT-4o and Claude Sonnet in one shared workspace allows us to generate code drafts in seconds.",
      author: "Sarah Connor",
      role: "Tech Lead",
      company: "Cyberdyne Systems",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80"
    },
    {
      quote: "We use the Visual Art Studio to generate all our marketing assets. The multi-tenant isolation and PostgreSQL RLS security give us full confidence in private data safety.",
      author: "David Miller",
      role: "Creative Director",
      company: "PixelForge Studio",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80"
    }
  ];

  return (
    <main className="min-h-screen flex flex-col bg-[#030712] text-slate-100 selection:bg-emerald-500/30 selection:text-white relative overflow-hidden font-sans">
      {/* Decorative Neon Lighting Blobs */}
      <div className="absolute top-[-10%] left-[-15%] w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[550px] h-[550px] rounded-full bg-emerald-600/5 blur-[130px] pointer-events-none" />
      
      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 select-none">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md ring-1 ring-emerald-500/30">
              <Terminal className="h-5 w-5 text-white" />
            </div>
            <span className="font-extrabold tracking-tight text-lg text-white font-mono">
              EXPEND<span className="text-emerald-400">MORE</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-slate-400 select-none">
            <a href="#features" className="hover:text-emerald-400 transition-colors duration-150">Features</a>
            <a href="#demo" className="hover:text-emerald-400 transition-colors duration-150">Interactive Demo</a>
            <a href="#testimonials" className="hover:text-emerald-400 transition-colors duration-150">Testimonials</a>
            <a href="#pricing" className="hover:text-emerald-400 transition-colors duration-150">Pricing</a>
            <a href="#faq" className="hover:text-emerald-400 transition-colors duration-150">FAQs</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors duration-150"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="h-9 px-4 text-xs font-bold uppercase tracking-wider rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-150 flex items-center justify-center border border-emerald-500/20 hover:scale-[1.02] active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16 flex flex-col items-center text-center gap-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 select-none animate-pulse">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Production Release 1.0 Live</span>
        </span>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-5xl bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent leading-[1.1] select-none">
          One workspace.<br />Every AI capability. Zero compromise.
        </h1>

        <p className="text-sm sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
          Access unified AI chat interfaces, generative visual studios, and side-by-side Markdown document drafting tools within a single, optimized terminal window.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-4 select-none w-full sm:w-auto">
          <Link
            href="/signup"
            className="h-12 px-6 text-sm font-bold uppercase tracking-wider rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-150 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-98"
          >
            <span>Create Free Account</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#demo"
            className="h-12 px-6 text-sm font-bold uppercase tracking-wider rounded-xl bg-white/[0.02] text-slate-300 border border-white/10 hover:bg-white/[0.06] hover:text-white transition-all duration-150 flex items-center justify-center hover:scale-[1.02] active:scale-98"
          >
            Try Interactive Demo
          </a>
        </div>
      </section>

      {/* Features Matrix Grid */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-white/[0.06] w-full">
        <div className="text-center max-w-xl mx-auto flex flex-col gap-3 mb-16 select-none">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Supercharged Modules</h2>
          <p className="text-sm text-slate-400">
            Eliminate context-switching between chat windows, canvas files, and gallery studio panels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.01] p-8 transition-all duration-300 hover:border-emerald-500/30 hover:bg-white/[0.02] hover:-translate-y-1">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="relative flex flex-col gap-4">
              <span className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 rounded-xl self-start">
                <MessageSquare className="h-5 w-5" />
              </span>
              <h3 className="text-xl font-bold text-white">Agnostic AI Chat</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Query multiple LLM nodes (Claude 3.5 Sonnet, GPT-4o, Gemini) inside a singular thread with real-time, low latency Server-Sent Events stream tokens.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.01] p-8 transition-all duration-300 hover:border-emerald-500/30 hover:bg-white/[0.02] hover:-translate-y-1">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="relative flex flex-col gap-4">
              <span className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 rounded-xl self-start">
                <ImageIcon className="h-5 w-5" />
              </span>
              <h3 className="text-xl font-bold text-white">Visual Art Studio</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Generate images and assets using DALL-E and Stability API models, configure aspect ratios, select formats, and manage a structured image gallery.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.01] p-8 transition-all duration-300 hover:border-emerald-500/30 hover:bg-white/[0.02] hover:-translate-y-1">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="relative flex flex-col gap-4">
              <span className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 rounded-xl self-start">
                <FileText className="h-5 w-5" />
              </span>
              <h3 className="text-xl font-bold text-white">Split Canvas Editor</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Draft texts, code outlines, or documentation side-by-side with your active conversation window. Features live markdown styling and auto-saving.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Mockup Workspace Section */}
      <section id="demo" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/[0.06] w-full">
        <div className="text-center max-w-xl mx-auto flex flex-col gap-3 mb-12 select-none">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Interactive Workspace Canvas</h2>
          <p className="text-sm text-slate-400">
            Test the live layout integration. Click a quick prompt below to see the interactive split workspace.
          </p>
          
          <div className="flex flex-wrap gap-2 justify-center mt-3">
            <button
              onClick={() => triggerDemoPrompt("Add a Next.js 15 routing section to the markdown draft.")}
              disabled={isDemoTyping}
              className="px-3 py-1.5 text-[10px] sm:text-xs font-semibold bg-white/[0.02] border border-white/10 rounded-full hover:bg-white/[0.06] hover:text-white transition-all flex items-center gap-1.5"
            >
              <MousePointerClick className="h-3 w-3 text-emerald-400" />
              <span>Prompt: "Add Next.js 15 routing"</span>
            </button>
            <button
              onClick={() => triggerDemoPrompt("Document the Supabase trigger sync architecture.")}
              disabled={isDemoTyping}
              className="px-3 py-1.5 text-[10px] sm:text-xs font-semibold bg-white/[0.02] border border-white/10 rounded-full hover:bg-white/[0.06] hover:text-white transition-all flex items-center gap-1.5"
            >
              <MousePointerClick className="h-3 w-3 text-emerald-400" />
              <span>Prompt: "Document Supabase triggers"</span>
            </button>
          </div>
        </div>

        {/* Mockup Dashboard Shell */}
        <div className="w-full max-w-5xl mx-auto bg-slate-950/40 border border-white/[0.06] rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[500px] backdrop-blur-xl">
          {/* Header Panel */}
          <div className="h-12 border-b border-white/[0.06] bg-slate-950/70 px-4 flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/30 border border-red-500/40" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/30" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/30" />
              <span className="text-[11px] text-slate-500 font-mono ml-4">Workspace Console</span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-450 animate-pulse" />
                Live Demo Active
              </span>
              <button 
                onClick={() => setDemoCanvasOpen(!demoCanvasOpen)} 
                className="text-[11px] font-semibold px-3 py-1 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06] hover:text-white border border-white/10 rounded-md transition-colors"
              >
                {demoCanvasOpen ? "Hide Editor" : "Open Editor"}
              </button>
            </div>
          </div>

          {/* Editor Workspace Split Grid */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Chat Window */}
            <div className="flex-grow flex flex-col justify-between p-4 border-r border-white/[0.06] h-full overflow-hidden bg-slate-950/10">
              <div className="flex-grow overflow-y-auto flex flex-col gap-3 mb-4 pr-1">
                {mockMessages.map((msg, index) => (
                  <div 
                    key={index}
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs ${
                      msg.role === "user"
                        ? "bg-white/[0.03] text-slate-200 self-end rounded-tr-none border border-white/10"
                        : "bg-emerald-500/5 text-slate-200 border border-emerald-500/10 self-start rounded-tl-none"
                    }`}
                  >
                    <span className="text-[9px] font-bold text-slate-500 select-none block mb-0.5 uppercase tracking-wide">
                      {msg.role === "user" ? "USER" : "EXPENDMORE"}
                    </span>
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                ))}

                {isDemoTyping && (
                  <div className="max-w-[80%] rounded-2xl p-3 bg-emerald-500/5 border border-emerald-500/10 self-start rounded-tl-none select-none flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                )}
              </div>

              {/* Chat Form Mock */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={isDemoTyping ? "AI is replying..." : "Ask ExpendMore anything..."}
                  disabled={isDemoTyping || true}
                  value={demoPrompt}
                  className="flex-grow h-9 px-3 text-xs bg-white/[0.02] border border-white/10 rounded-lg placeholder-slate-500 focus:outline-none"
                />
                <button 
                  disabled
                  className="h-9 w-9 bg-emerald-600 rounded-lg flex items-center justify-center text-white opacity-50 shrink-0 cursor-not-allowed"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Right Canvas Window (Conditional) */}
            {demoCanvasOpen && (
              <div className="w-[50%] flex flex-col justify-between p-4 h-full bg-slate-950/20 relative select-none">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 mb-3 shrink-0">
                  <span className="text-[11px] font-bold text-slate-400 font-mono flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-emerald-400" />
                    saas_launch_article.md
                  </span>
                  
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/30 border border-emerald-500/10 text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Auto-saved
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto pr-1">
                  <textarea
                    value={demoCanvasText}
                    onChange={(e) => setDemoCanvasText(e.target.value)}
                    className="w-full h-full bg-transparent text-xs font-mono resize-none focus:outline-none leading-relaxed text-slate-350"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-white/[0.06] w-full">
        <div className="text-center max-w-xl mx-auto flex flex-col gap-3 mb-16 select-none">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Trusted by Innovators</h2>
          <p className="text-sm text-slate-400">
            See how scaling software teams and creative leaders utilize our workspace daily.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div 
              key={idx}
              className="relative rounded-2xl border border-white/[0.06] bg-white/[0.01] p-8 flex flex-col justify-between"
            >
              <div className="flex flex-col gap-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-emerald-400 text-emerald-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3.5 mt-6 pt-6 border-t border-white/[0.06]">
                <img 
                  src={t.avatar} 
                  alt={t.author} 
                  className="h-10 w-10 rounded-full object-cover border border-white/10"
                />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white leading-none">{t.author}</h4>
                  <p className="text-[10px] text-slate-500 mt-1">{t.role}, <span className="text-emerald-400">{t.company}</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Subscription Pricing Grid */}
      <section id="pricing" className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-white/[0.06] w-full flex flex-col items-center">
        <div className="text-center max-w-xl mx-auto flex flex-col gap-3 mb-12 select-none">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Flexible SaaS Pricing</h2>
          <p className="text-sm text-slate-400">
            Pick a plan that matches your project requirements. Switch cycles to toggle discounts.
          </p>

          {/* Cycle Toggle Switch */}
          <div className="inline-flex p-1 bg-white/[0.02] border border-white/10 rounded-xl mt-4 self-center gap-1 select-none">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                billingCycle === "monthly"
                  ? "bg-slate-950 border border-white/10 text-white shadow-md"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                billingCycle === "yearly"
                  ? "bg-slate-950 border border-white/10 text-white shadow-md"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <span>Yearly</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 text-[9px] font-extrabold">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full select-none">
          {plans.map((plan, i) => {
            const price = billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly;
            
            return (
              <div
                key={i}
                className={`relative rounded-3xl p-6 flex flex-col justify-between border bg-white/[0.01] transition-all duration-300 hover:scale-[1.02] ${
                  plan.recommended
                    ? "border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.1)] bg-slate-950/40"
                    : "border-white/[0.06] hover:border-white/10"
                }`}
              >
                {plan.recommended && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[9px] font-bold tracking-wider uppercase shadow-md select-none border border-emerald-500/30">
                    Most Popular
                  </span>
                )}

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-bold text-lg text-white">{plan.name}</h3>
                    <p className="text-[11px] text-slate-400 min-h-[32px] leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1 my-2">
                    {typeof price === "number" ? (
                      <>
                        <span className="text-3xl sm:text-4xl font-extrabold text-white">
                          ₹{price.toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs text-slate-500">/mo</span>
                      </>
                    ) : (
                      <span className="text-3xl sm:text-4xl font-extrabold text-white">
                        {price}
                      </span>
                    )}
                  </div>

                  {typeof price === "number" && billingCycle === "yearly" && price > 0 && (
                    <span className="text-[10px] text-emerald-450 font-semibold">
                      Billed ₹{(price * 12).toLocaleString("en-IN")} annually
                    </span>
                  )}

                  <hr className="border-white/[0.06] my-2" />

                  <ul className="flex flex-col gap-2.5">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-slate-300 leading-normal">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/signup"
                  className={`w-full h-10 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-150 flex items-center justify-center mt-8 border ${
                    plan.recommended
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-emerald-500/25 shadow-lg shadow-emerald-500/10"
                      : "bg-white/[0.02] text-slate-300 border-white/10 hover:bg-white/[0.06]"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive FAQ Accordion */}
      <section id="faq" className="relative z-10 max-w-4xl mx-auto px-6 py-24 border-t border-white/[0.06] w-full select-none">
        <div className="text-center flex flex-col gap-3 mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Frequently Asked Questions</h2>
          <p className="text-sm text-slate-400">
            Clear responses to system mechanisms and account limits.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, i) => {
            const isOpen = openFaqIndex === i;
            return (
              <div 
                key={i}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.01] overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none hover:bg-white/[0.02]"
                >
                  <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-500 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 border-t border-white/[0.04] bg-slate-950/20">
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-16 flex flex-col items-center select-none text-center bg-gradient-to-br from-slate-950/80 via-slate-900/60 to-emerald-950/10 border border-white/[0.06] rounded-3xl my-10">
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-b from-white to-slate-450 bg-clip-text text-transparent mb-4">
          Ready to experience ExpendMore?
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-8 leading-relaxed">
          Create your account today and receive 20 daily free credits. No billing credentials needed for onboarding signup.
        </p>
        <Link
          href="/signup"
          className="h-12 px-6 text-sm font-bold uppercase tracking-wider rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-98 transition-all duration-150 flex items-center justify-center gap-2"
        >
          <span>Get Started Free</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* Footer Panel */}
      <footer className="relative z-10 w-full border-t border-white/[0.06] bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 select-none gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
              <Terminal className="h-3 w-3 text-white" />
            </div>
            <span className="font-bold text-white font-mono">ExpendMore</span>
            <span>&copy; {new Date().getFullYear()} ExpendMore Inc. All rights reserved.</span>
          </div>

          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
