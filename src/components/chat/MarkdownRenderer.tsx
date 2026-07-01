"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
  children: string;
  language: string;
}

const CodeBlock = ({ children, language }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group/code my-3 border border-border rounded-lg overflow-hidden bg-zinc-950 font-mono select-text">
      <div className="px-4 py-1.5 bg-zinc-900 border-b border-border flex justify-between items-center text-[10px] text-muted-foreground select-none">
        <span className="font-semibold uppercase tracking-wider">{language}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="hover:text-foreground flex items-center gap-1 cursor-pointer transition-colors text-[10px] font-medium"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs text-zinc-300 leading-relaxed font-mono">
        <code>{children}</code>
      </pre>
    </div>
  );
};

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const components = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "");
      const codeVal = String(children).replace(/\n$/, "");
      return !inline && match ? (
        <CodeBlock language={match[1]}>{codeVal}</CodeBlock>
      ) : (
        <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-[11px] text-brand-navy dark:text-zinc-300" {...props}>
          {children}
        </code>
      );
    },
    // Table styling
    table({ children }: any) {
      return (
        <div className="my-4 overflow-x-auto rounded-lg border border-border max-w-full">
          <table className="w-full border-collapse text-left text-xs min-w-[400px]">{children}</table>
        </div>
      );
    },
    thead({ children }: any) {
      return <thead className="bg-zinc-100 dark:bg-zinc-900 border-b border-border text-muted-foreground uppercase tracking-wider font-bold text-[9px] select-none">{children}</thead>;
    },
    tbody({ children }: any) {
      return <tbody className="divide-y divide-border bg-white dark:bg-zinc-950/20">{children}</tbody>;
    },
    th({ children }: any) {
      return <th className="p-3 font-semibold">{children}</th>;
    },
    td({ children }: any) {
      return <td className="p-3 text-foreground">{children}</td>;
    },
    // Citations / blockquotes
    blockquote({ children }: any) {
      return <blockquote className="border-l-4 border-brand-sky pl-4 italic my-3 text-muted-foreground/90">{children}</blockquote>;
    },
    // Lists
    ul({ children }: any) {
      return <ul className="list-disc pl-5 my-2 space-y-1.5">{children}</ul>;
    },
    ol({ children }: any) {
      return <ol className="list-decimal pl-5 my-2 space-y-1.5">{children}</ol>;
    },
    p({ children }: any) {
      return <p className="leading-relaxed my-2 last:mb-0 select-text">{children}</p>;
    },
    h1({ children }: any) {
      return <h1 className="text-base font-bold mt-4 mb-2 text-foreground">{children}</h1>;
    },
    h2({ children }: any) {
      return <h2 className="text-sm font-bold mt-3 mb-1.5 text-foreground">{children}</h2>;
    },
    h3({ children }: any) {
      return <h3 className="text-xs font-bold mt-2.5 mb-1 text-foreground">{children}</h3>;
    }
  };

  return (
    <div className="markdown-body text-xs md:text-sm text-foreground leading-relaxed flex flex-col gap-0.5 select-text w-full max-w-full overflow-hidden">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownRenderer;
