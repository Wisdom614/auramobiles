"use client";

import React, { useState, useMemo } from "react";
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  ThumbsUp,
  MessageCircle,
  PenTool,
  Sparkles,
  Filter,
  ArrowUpDown,
  BatteryCharging,
  Truck,
  Award,
  BadgeCheck,
  Check,
} from "lucide-react";
import { Phone } from "@/lib/data/phones";
import { useReviews } from "@/lib/store/reviews-context";
import { CustomerReview } from "@/lib/data/mock-reviews";
import { WriteReviewModal } from "./write-review-modal";

interface ProductReviewsSectionProps {
  phone: Phone;
}

export function ProductReviewsSection({ phone }: ProductReviewsSectionProps) {
  const { getReviewsForPhone, getPhoneStats, voteHelpful } = useReviews();

  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [starFilter, setStarFilter] = useState<number | null>(null); // null = all
  const [sortBy, setSortBy] = useState<"recent" | "rating" | "helpful">("recent");
  const [votedMap, setVotedMap] = useState<Record<string, boolean>>({});

  const stats = usePhoneStats(phone.id);
  const rawReviews = getReviewsForPhone(phone.id);

  // Helper hook logic
  function usePhoneStats(phoneId: string) {
    return useMemo(() => getPhoneStats(phoneId), [getPhoneStats, phoneId]);
  }

  // Filtered & Sorted Reviews
  const displayReviews = useMemo(() => {
    let list = [...rawReviews];

    if (starFilter !== null) {
      list = list.filter((r) => Math.round(r.rating) === starFilter);
    }

    list.sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === "rating") {
        return b.rating - a.rating;
      }
      if (sortBy === "helpful") {
        return (b.helpfulCount || 0) - (a.helpfulCount || 0);
      }
      return 0;
    });

    return list;
  }, [rawReviews, starFilter, sortBy]);

  const handleVoteHelpful = (reviewId: string) => {
    if (votedMap[reviewId]) return;
    voteHelpful(reviewId);
    setVotedMap((prev) => ({ ...prev, [reviewId]: true }));
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Recent Purchase";
    }
  };

  return (
    <section id="reviews-section" className="mt-16 pt-10 border-t border-white/10 space-y-8 font-sans scroll-mt-24">
      
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10.5px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>Verified Cameroon Customer Feedback</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-white uppercase tracking-tight font-sans mt-1">
            Ratings &amp; Authentic Reviews
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
            Real experiences from showroom visitors and doorstep delivery customers across Buea, Douala, Yaoundé, and nationwide.
          </p>
        </div>

        <button
          onClick={() => setIsWriteModalOpen(true)}
          className="w-full sm:w-auto px-6 py-3.5 gold-gradient-bg text-black font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition hover:opacity-95 cursor-pointer shadow-lg shadow-[#D4AF37]/10"
        >
          <PenTool className="w-4 h-4" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* RATING SNAPSHOT & ASPECT BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8 bg-[#0E0E12] border border-white/15">
        
        {/* Left: Overall Rating Hero (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col justify-center items-center text-center p-5 bg-black/60 border border-white/10 space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
            OVERALL SATISFACTION
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
              {stats.averageRating.toFixed(1)}
            </span>
            <span className="text-sm font-mono text-zinc-500 font-bold">/ 5.0</span>
          </div>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(stats.averageRating)
                    ? "fill-[#D4AF37] text-[#D4AF37]"
                    : "text-zinc-700"
                }`}
              />
            ))}
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-emerald-400 block">
              100% Verified Purchases
            </span>
            <span className="text-[11px] text-zinc-400 font-sans block">
              Based on {rawReviews.length} authenticated customer reviews
            </span>
          </div>
        </div>

        {/* Middle: Star Rating Distribution (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col justify-center space-y-2 p-5 bg-black/40 border border-white/5">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold mb-1">
            RATING DISTRIBUTION
          </span>

          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats.starCounts[star] || 0;
            const pct = stats.starPercentages[star] || 0;
            const isSelected = starFilter === star;

            return (
              <button
                key={star}
                type="button"
                onClick={() => setStarFilter(isSelected ? null : star)}
                className={`w-full flex items-center gap-2.5 py-1 px-1.5 transition text-left cursor-pointer rounded-none ${
                  isSelected ? "bg-[#D4AF37]/15 border border-[#D4AF37]/50" : "hover:bg-white/5"
                }`}
              >
                <span className="font-mono text-xs font-bold text-zinc-300 w-8 shrink-0 flex items-center gap-0.5">
                  <span>{star}</span>
                  <Star className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
                </span>

                <div className="flex-1 h-2 bg-white/10 overflow-hidden relative">
                  <div
                    className="h-full bg-[#D4AF37] transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <span className="font-mono text-[11px] text-zinc-400 w-10 text-right shrink-0">
                  {count} ({pct}%)
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: Key Aspect Ratings (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col justify-center space-y-3 p-5 bg-black/40 border border-white/5 text-xs">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
            ATTRIBUTE BENCHMARKS
          </span>

          <div className="space-y-3">
            {/* Battery & Hardware */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-300">
                <BatteryCharging className="w-4 h-4 text-emerald-400" />
                <span>Battery &amp; Speed</span>
              </div>
              <span className="font-mono font-bold text-emerald-400">
                {stats.aspects.batteryHealth.toFixed(1)} / 5.0
              </span>
            </div>

            {/* Delivery Speed */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-300">
                <Truck className="w-4 h-4 text-[#D4AF37]" />
                <span>Delivery Speed &amp; Care</span>
              </div>
              <span className="font-mono font-bold text-[#D4AF37]">
                {stats.aspects.deliverySpeed.toFixed(1)} / 5.0
              </span>
            </div>

            {/* Condition Match */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-300">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Condition Accuracy</span>
              </div>
              <span className="font-mono font-bold text-cyan-400">
                {stats.aspects.conditionAccuracy.toFixed(1)} / 5.0
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 text-[10.5px] text-zinc-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Tested on bench before handover</span>
          </div>
        </div>

      </div>

      {/* FILTER & SORT BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#121217] border border-white/10">
        
        {/* Star Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-zinc-500 uppercase tracking-wider text-[10px] font-bold mr-1 hidden sm:inline">
            FILTER:
          </span>
          <button
            onClick={() => setStarFilter(null)}
            className={`px-3 py-1.5 transition border text-xs cursor-pointer font-bold ${
              starFilter === null
                ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                : "bg-black/60 text-zinc-400 border-white/10 hover:text-white"
            }`}
          >
            All ({rawReviews.length})
          </button>

          {[5, 4, 3].map((star) => (
            <button
              key={star}
              onClick={() => setStarFilter(starFilter === star ? null : star)}
              className={`px-3 py-1.5 transition border text-xs cursor-pointer flex items-center gap-1 font-bold ${
                starFilter === star
                  ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                  : "bg-black/60 text-zinc-400 border-white/10 hover:text-white"
              }`}
            >
              <span>{star}★</span>
              <span>({stats.starCounts[star] || 0})</span>
            </button>
          ))}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-500 uppercase font-mono text-[10px] font-bold">
            SORT BY:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 bg-black border border-white/20 text-white font-mono text-xs focus:border-[#D4AF37] focus:outline-none"
          >
            <option value="recent">Most Recent</option>
            <option value="helpful">Most Helpful</option>
            <option value="rating">Highest Rating</option>
          </select>
        </div>

      </div>

      {/* REVIEWS LIST */}
      {displayReviews.length === 0 ? (
        <div className="p-12 text-center bg-[#0E0E12] border border-white/10 space-y-3">
          <PenTool className="w-8 h-8 text-zinc-600 mx-auto" />
          <h3 className="text-sm font-bold uppercase text-white font-mono">
            No reviews match this filter
          </h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Be the first to share your verified review for this flagship model!
          </p>
          <button
            onClick={() => setIsWriteModalOpen(true)}
            className="px-5 py-2.5 gold-gradient-bg text-black font-extrabold text-xs uppercase tracking-wider mt-2 cursor-pointer inline-block"
          >
            Write a Review
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {displayReviews.map((review) => (
            <div
              key={review.id}
              className="p-6 bg-[#0E0E12] border border-white/10 space-y-4 transition hover:border-white/20 relative"
            >
              {/* Card Header: Client Info, City, Date, Rating */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">
                      {review.clientName}
                    </span>
                    {review.isVerified && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-mono text-[9.5px] font-bold">
                        <Check className="w-3 h-3" />
                        <span>Verified Buyer</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                    <span className="text-[#D4AF37]">{review.city}</span>
                    <span>•</span>
                    <span>{formatDate(review.createdAt)}</span>
                  </div>
                </div>

                {/* Star Rating Badge */}
                <div className="flex items-center gap-1 px-2.5 py-1 bg-black border border-white/10">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= review.rating
                          ? "fill-[#D4AF37] text-[#D4AF37]"
                          : "text-zinc-700"
                      }`}
                    />
                  ))}
                  <span className="font-mono text-xs font-bold text-white ml-1">
                    {review.rating}.0
                  </span>
                </div>
              </div>

              {/* Variant Badge & Condition */}
              {review.variantPurchased && (
                <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/5 border border-white/10 text-[10.5px] font-mono text-zinc-300">
                  <span className="text-zinc-500 uppercase">Purchased:</span>
                  <span className="font-semibold text-white">{review.variantPurchased}</span>
                  {review.condition && (
                    <>
                      <span className="text-zinc-600">|</span>
                      <span className="text-emerald-400">{review.condition}</span>
                    </>
                  )}
                </div>
              )}

              {/* Review Headline & Body */}
              <div className="space-y-2">
                <h4 className="text-sm sm:text-base font-bold text-white font-sans">
                  {review.title}
                </h4>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
                  {review.comment}
                </p>
              </div>

              {/* Aspect Scores breakdown if present */}
              {review.aspectRatings && (
                <div className="flex flex-wrap items-center gap-3 pt-2 text-[10.5px] font-mono text-zinc-400">
                  {review.aspectRatings.batteryHealth && (
                    <div className="flex items-center gap-1 bg-black px-2 py-0.5 border border-white/5">
                      <BatteryCharging className="w-3 h-3 text-emerald-400" />
                      <span>Battery: <strong>{review.aspectRatings.batteryHealth}★</strong></span>
                    </div>
                  )}
                  {review.aspectRatings.deliverySpeed && (
                    <div className="flex items-center gap-1 bg-black px-2 py-0.5 border border-white/5">
                      <Truck className="w-3 h-3 text-[#D4AF37]" />
                      <span>Delivery: <strong>{review.aspectRatings.deliverySpeed}★</strong></span>
                    </div>
                  )}
                  {review.aspectRatings.conditionAccuracy && (
                    <div className="flex items-center gap-1 bg-black px-2 py-0.5 border border-white/5">
                      <ShieldCheck className="w-3 h-3 text-cyan-400" />
                      <span>Condition: <strong>{review.aspectRatings.conditionAccuracy}★</strong></span>
                    </div>
                  )}
                </div>
              )}

              {/* Concierge Response Callout if present */}
              {review.conciergeResponse && (
                <div className="p-4 bg-gradient-to-r from-[#14141C] to-[#0F0F14] border-l-2 border-[#D4AF37] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[#D4AF37] font-mono font-bold text-[10.5px] uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{review.conciergeResponse.responderName || "AURA Concierge Response"}</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {formatDate(review.conciergeResponse.respondedAt)}
                    </span>
                  </div>
                  <p className="text-zinc-300 text-xs leading-relaxed font-sans">
                    {review.conciergeResponse.response}
                  </p>
                </div>
              )}

              {/* Helpful Vote Action */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <button
                  onClick={() => handleVoteHelpful(review.id)}
                  disabled={votedMap[review.id]}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 font-mono text-[11px] transition border cursor-pointer ${
                    votedMap[review.id]
                      ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/40 font-bold"
                      : "bg-black/60 text-zinc-400 hover:text-white border-white/10 hover:border-white/20"
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${votedMap[review.id] ? "text-emerald-400" : "text-[#D4AF37]"}`} />
                  <span>
                    {votedMap[review.id] ? "Helpful Vote Recorded" : `Helpful (${review.helpfulCount || 0})`}
                  </span>
                </button>

                <span className="text-[10px] font-mono text-zinc-500 uppercase">
                  Inspected in Cameroon
                </span>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Write Review Modal Component */}
      <WriteReviewModal
        phone={phone}
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
      />

    </section>
  );
}
