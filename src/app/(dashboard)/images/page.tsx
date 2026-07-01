"use client";

import React, { useState } from "react";
import DashboardShell from "@/components/navigation/DashboardShell";
import PageContainer from "@/components/navigation/PageContainer";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import { Image as ImageIcon, Sparkles, Wand2 } from "lucide-react";

export default function ImagesPage() {
  const { addToast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    addToast("Image generation request queued...", "info");

    setTimeout(() => {
      setIsGenerating(false);
      // Mock generated image
      setImages((prev) => [
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
        ...prev,
      ]);
      setPrompt("");
      addToast("Image generated successfully!", "success");
    }, 2000);
  };

  return (
    <DashboardShell>
      <PageContainer title="Visual Studio" subtitle="Generate high-fidelity assets and artwork">
        <div className="flex-1 flex flex-col lg:flex-row gap-6 h-[calc(100vh-180px)] md:h-[calc(100vh-140px)] border border-border bg-card rounded-2xl p-6 overflow-hidden">
          {/* Options Sidebar */}
          <form
            onSubmit={handleGenerate}
            className="w-full lg:w-80 flex flex-col gap-6 shrink-0 border-b lg:border-b-0 lg:border-r border-border pb-6 lg:pb-0 lg:pr-6 justify-between select-none"
          >
            <div className="flex flex-col gap-4">
              <Input
                label="Prompt"
                placeholder="A minimalist premium glassmorphic icon..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isGenerating}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Aspect Ratio</label>
                <div className="grid grid-cols-4 gap-2">
                  {["1:1", "16:9", "9:16", "4:3"].map((ratio, index) => (
                    <button
                      key={ratio}
                      type="button"
                      disabled={isGenerating}
                      className={`h-9 text-xs rounded-lg border font-medium transition-all duration-150 active:scale-95 ${
                        index === 0
                          ? "border-brand-500 bg-brand-950/20 text-brand-500"
                          : "border-border text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <Button type="submit" isLoading={isGenerating} className="w-full">
              <Wand2 className="h-4 w-4 mr-2" />
              <span>Generate Image</span>
            </Button>
          </form>

          {/* Results Grid Canvas */}
          <div className="flex-grow overflow-y-auto pr-2">
            {images.length === 0 && !isGenerating ? (
              <div className="flex flex-col items-center justify-center text-center max-w-sm mx-auto my-auto h-full gap-4 select-none">
                <span className="p-3 bg-secondary text-muted-foreground rounded-full border border-border">
                  <ImageIcon className="h-6 w-6" />
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="font-bold text-foreground">Visual Gallery</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Visual outputs will appear here as soon as generation triggers complete.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {isGenerating && (
                  <div className="aspect-square bg-secondary border border-border rounded-2xl shimmer-active flex flex-col items-center justify-center text-xs text-muted-foreground select-none gap-2">
                    <Sparkles className="h-5 w-5 animate-spin" />
                    <span>Rendering artwork...</span>
                  </div>
                )}
                {images.map((url, i) => (
                  <div
                    key={i}
                    className="aspect-square relative rounded-2xl overflow-hidden border border-border group"
                  >
                    <img
                      src={url}
                      alt="AI generated"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                      <Button size="sm">Download</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    </DashboardShell>
  );
}
