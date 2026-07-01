import React from "react";
import Link from "next/link";
import { Sparkles, MessageSquare, Zap, Shield, BarChart3, Bot } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex bg-[#0a0f1e] relative overflow-hidden font-sans">
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* LEFT PANEL — Branding + Features (hidden on mobile)                */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0c1222]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.1),transparent_60%)]" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Floating glow orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 right-10 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 focus:outline-none mb-16 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight">LetsGrow</h1>
              <p className="text-[10px] font-medium text-indigo-300/70 -mt-0.5">WhatsApp Business Platform</p>
            </div>
          </Link>

          {/* Hero Text */}
          <div className="flex-1 flex flex-col justify-center -mt-10">
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-semibold text-indigo-300">Trusted by 500+ businesses</span>
              </div>
              <h2 className="text-[2.5rem] leading-[1.15] font-extrabold text-white tracking-tight">
                Automate your<br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                  WhatsApp Business
                </span><br />
                at scale.
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-slate-400 max-w-md">
                AI-powered CRM, team inbox, broadcast campaigns, and chatbot flows — everything you need to grow revenue via WhatsApp.
              </p>
            </div>

            {/* Feature pills */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: MessageSquare, label: "Team Inbox", desc: "Real-time shared inbox" },
                { icon: Zap, label: "Broadcasts", desc: "100K+ msgs/campaign" },
                { icon: Bot, label: "AI Chatbots", desc: "Gemini Pro powered" },
                { icon: BarChart3, label: "Analytics", desc: "ROI & delivery tracking" },
              ].map((feat) => (
                <div key={feat.label} className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm hover:bg-white/[0.05] transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <feat.icon className="h-4 w-4 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-white">{feat.label}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom social proof */}
          <div className="relative z-10 flex items-center gap-4 pt-8 border-t border-white/[0.06]">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0f172a] bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ background: ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b'][i] }}>
                  {['A', 'R', 'P', 'S'][i]}
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Join 2,400+ teams</p>
              <div className="flex items-center gap-1 mt-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3 h-3 text-amber-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-[11px] text-slate-500 ml-1">4.9/5 rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* RIGHT PANEL — Auth Forms                                           */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="w-full lg:w-[48%] flex flex-col justify-center items-center p-6 sm:p-8 lg:p-12 relative">
        {/* Subtle background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1117] to-[#0a0f1e] lg:bg-[#0d1117]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.04),transparent_70%)]" />

        {/* Mobile Logo (shown on small screens) */}
        <div className="lg:hidden relative z-10 mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 focus:outline-none">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-lg font-extrabold text-white tracking-tight">LetsGrow</h1>
              <p className="text-[9px] font-medium text-indigo-400/70 -mt-0.5">WhatsApp Business Platform</p>
            </div>
          </Link>
        </div>

        {/* Form Card */}
        <div className="relative z-10 w-full max-w-[420px]">
          <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-8 shadow-2xl shadow-black/40">
            {children}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center px-2 mt-5 text-[10px] text-slate-600 font-medium select-none">
            <span>© 2024 LetsGrow AI</span>
            <div className="flex gap-3">
              <Link href="/terms" className="hover:text-slate-400 transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-slate-400 transition-colors">Privacy</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
