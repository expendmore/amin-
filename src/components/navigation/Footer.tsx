import React from "react";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-brand-border dark:border-border/50 py-6 px-6 bg-white dark:bg-zinc-950/20 text-[10px] md:text-xs text-on-surface-variant font-medium select-none transition-colors">
      <div className="max-w-[1280px] mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Copyright */}
        <span>
          © {currentYear} ExpendMore. All rights reserved. Version 1.2.0.
        </span>

        {/* Links */}
        <div className="flex gap-4">
          <Link href="/terms" className="hover:text-brand-navy dark:hover:text-foreground transition-colors hover:underline">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:text-brand-navy dark:hover:text-foreground transition-colors hover:underline">
            Privacy Policy
          </Link>
          <Link href="/help" className="hover:text-brand-navy dark:hover:text-foreground transition-colors hover:underline">
            Help Center
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
