"use client";

import React, { useMemo, useState } from "react";
import { useMarketplace } from "@/store/use-marketplace";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import { MessageSquare, Star, Save } from "lucide-react";

export default function ReviewsPage() {
  const { addToast } = useToast();
  const { items, reviews, addReview } = useMarketplace();

  const [selectedItemId, setSelectedItemId] = useState(items[0]?.id || "item-1");
  const [rating, setRating] = useState("5");
  const [reviewText, setReviewText] = useState("");

  const activeItemObj = useMemo(() => {
    return items.find((it) => it.id === selectedItemId);
  }, [items, selectedItemId]);

  const activeReviews = useMemo(() => {
    return reviews[selectedItemId] || [];
  }, [reviews, selectedItemId]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    addReview(selectedItemId, parseInt(rating), reviewText.trim());
    addToast("Review submitted successfully. Syncing catalog rating average...", "success");
    setReviewText("");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-brand-navy dark:text-foreground tracking-tight">
            Reviews & Ratings
          </h1>
          <p className="text-xs text-on-surface-variant/80 font-medium">
            Read template installations testimonials, submit ratings, and check recommendations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor form panel */}
        <Card className="lg:col-span-2 p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left font-sans">
          <div className="flex flex-col gap-1 border-b border-brand-border pb-3">
            <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
              Select Target Asset
            </label>
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              className="bg-brand-slate dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-lg p-2.5 text-xs font-bold text-brand-navy focus:outline-none cursor-pointer w-full sm:w-72"
            >
              {items.map((it) => (
                <option key={it.id} value={it.id}>
                  {it.name}
                </option>
              ))}
            </select>
          </div>

          <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4 text-left mt-2">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                Rating Stars Count (1-5)
              </label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="bg-white dark:bg-zinc-950 border border-brand-border dark:border-zinc-800 rounded-lg p-2 text-xs font-semibold focus:outline-none cursor-pointer w-32"
              >
                <option value="5">5 Stars (Excellent)</option>
                <option value="4">4 Stars (Good)</option>
                <option value="3">3 Stars (Average)</option>
                <option value="2">2 Stars (Poor)</option>
                <option value="1">1 Star (Very Poor)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                Comments
              </label>
              <Input
                placeholder="Write your testimonial here..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-end border-t border-brand-border pt-4 mt-2">
              <Button
                type="submit"
                variant="success"
                size="sm"
                className="font-bold text-white shrink-0"
                leftIcon={<Save className="h-4 w-4 text-white" />}
              >
                Submit Review
              </Button>
            </div>
          </form>
        </Card>

        {/* Reviews list */}
        <div className="flex flex-col gap-6 font-sans">
          <Card className="p-5 border-brand-border bg-white dark:bg-zinc-950 flex flex-col gap-4 text-left">
            <h3 className="font-bold text-sm text-brand-navy dark:text-foreground flex items-center gap-1.5">
              <MessageSquare className="h-4.5 w-4.5 text-brand-sky" />
              User Reviews ({activeReviews.length})
            </h3>

            <div className="flex flex-col gap-3">
              {activeReviews.map((rev) => (
                <div key={rev.id} className="p-3 bg-brand-slate rounded-xl border border-brand-border text-left">
                  <div className="flex items-center justify-between text-xs font-bold text-brand-navy dark:text-foreground">
                    <span className="truncate">{rev.author}</span>
                    <span className="text-[10px] text-amber-500 font-bold flex items-center gap-0.5 shrink-0">
                      <Star className="h-3.5 w-3.5 fill-amber-500" />
                      {rev.rating}
                    </span>
                  </div>
                  <p className="text-[10px] text-on-surface-variant/80 font-medium leading-relaxed mt-1.5">
                    {rev.text}
                  </p>
                  <span className="text-[8px] text-on-surface-variant/50 block mt-1.5 font-semibold">
                    Posted {new Date(rev.date).toLocaleDateString()}
                  </span>
                </div>
              ))}

              {activeReviews.length === 0 && (
                <span className="text-xs text-on-surface-variant/80 font-medium">
                  No review claims logged for this asset template yet.
                </span>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
