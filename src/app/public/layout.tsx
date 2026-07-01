import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import Footer from "@/components/navigation/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 font-sans text-brand-navy dark:text-foreground transition-colors">
      {/* Light public header */}
      <header className="h-16 border-b border-brand-border dark:border-border/50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 mb-0.5 focus:outline-none">
            <div className="w-8 h-8 rounded-full bg-brand-navy dark:bg-white flex items-center justify-center text-white dark:text-brand-navy shadow-sm">
              <Sparkles className="h-4 w-4 text-brand-green" />
            </div>
            <span className="font-extrabold text-sm tracking-tight">ExpendMore</span>
          </Link>
        </div>

        <nav className="flex items-center gap-6 text-xs font-bold select-none">
          <Link href="/terms" className="hover:underline text-on-surface-variant hover:text-brand-navy">Terms of Service</Link>
          <Link href="/privacy" className="hover:underline text-on-surface-variant hover:text-brand-navy">Privacy Policy</Link>
          <Link href="/auth/sign-in" className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-navy dark:bg-white text-white dark:text-brand-navy hover:opacity-90 rounded-lg shadow-sm">
            <span>Sign In</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </nav>
      </header>

      {/* Main viewport */}
      <main className="flex-1 p-6 md:p-8 max-w-[1000px] mx-auto w-full flex flex-col gap-6">
        {children}
      </main>

      {/* Minimal system Footer */}
      <Footer />
    </div>
  );
}
