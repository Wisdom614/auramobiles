"use client";

import React, { useState } from "react";
import {
  X,
  Star,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  MapPin,
  Smartphone,
  BatteryCharging,
  Truck,
  FileCheck,
} from "lucide-react";
import { Phone } from "@/lib/data/phones";
import { useReviews } from "@/lib/store/reviews-context";

interface WriteReviewModalProps {
  phone: Phone;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CAMEROON_CITIES = [
  "Molyko, Buea",
  "Check Point, Buea",
  "Town, Limbe",
  "Akwa, Douala",
  "Bonapriso, Douala",
  "Bonamoussadi, Douala",
  "Bastos, Yaoundé",
  "Centre Ville, Yaoundé",
  "Commercial Ave, Bamenda",
  "Bafoussam",
  "Kumba",
  "Other City in Cameroon",
];

const RATING_LABELS: Record<number, string> = {
  5: "5 Stars — Exceptional Flagship Quality & Service",
  4: "4 Stars — Very Good & Highly Recommended",
  3: "3 Stars — Satisfactory Experience",
  2: "2 Stars — Minor Issues Encountered",
  1: "1 Star — Disappointed with Purchase",
};

export function WriteReviewModal({
  phone,
  isOpen,
  onClose,
  onSuccess,
}: WriteReviewModalProps) {
  const { addReview } = useReviews();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [clientName, setClientName] = useState("");
  const [city, setCity] = useState(CAMEROON_CITIES[0]);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [orderId, setOrderId] = useState("");
  const [variantPurchased, setVariantPurchased] = useState(
    `${phone.storageVariants[0]?.size || "256GB"} • ${phone.colorVariants[0]?.name || "Official"}`
  );
  const [condition, setCondition] = useState<string>(phone.condition || "Brand New Sealed");

  // Aspect ratings
  const [batteryHealth, setBatteryHealth] = useState<number>(5);
  const [deliverySpeed, setDeliverySpeed] = useState<number>(5);
  const [conditionAccuracy, setConditionAccuracy] = useState<number>(5);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!clientName.trim()) {
      setErrorMsg("Please enter your full name or nickname.");
      return;
    }
    if (!title.trim()) {
      setErrorMsg("Please provide a short headline for your review.");
      return;
    }
    if (!comment.trim() || comment.trim().length < 15) {
      setErrorMsg("Please write at least 15 characters sharing your genuine experience.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addReview({
        phoneId: phone.id,
        phoneName: phone.name,
        clientName: clientName.trim(),
        city,
        rating,
        title: title.trim(),
        comment: comment.trim(),
        isVerified: true,
        orderId: orderId.trim() || undefined,
        variantPurchased,
        condition,
        aspectRatings: {
          batteryHealth,
          deliverySpeed,
          conditionAccuracy,
        },
      });

      setIsSuccess(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setErrorMsg("Failed to post review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeDisplayRating = hoverRating || rating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/90 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      <div className="relative w-full max-w-2xl bg-[#0D0D12] border-2 border-[#D4AF37] shadow-[0_0_50px_rgba(212,175,55,0.15)] text-white p-6 sm:p-8 space-y-6 my-auto max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition border border-white/10 cursor-pointer"
          aria-label="Close review dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          /* Celebratory Success State */
          <div className="py-12 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 mx-auto bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)]">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold uppercase tracking-wider text-white">
                Review Published Successfully!
              </h3>
              <p className="text-xs text-zinc-300 max-w-md mx-auto">
                Thank you, <strong className="text-white">{clientName}</strong>! Your genuine feedback helps Cameroon phone shoppers make confident decisions.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-mono text-[11px] font-bold">
              <span>✓ Verified Buyer Badge Attached</span>
            </div>
          </div>
        ) : (
          /* Review Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Header */}
            <div className="border-b border-white/10 pb-4 space-y-1">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified Customer Review</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black uppercase tracking-tight text-white">
                Rate &amp; Review: {phone.name}
              </h2>
              <p className="text-xs text-zinc-400">
                Share your unboxing, battery performance, and courier inspection experience.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs font-mono">
                {errorMsg}
              </div>
            )}

            {/* 1. Overall Star Rating */}
            <div className="p-4 bg-black/60 border border-white/10 space-y-2.5 text-center sm:text-left">
              <label className="text-xs font-mono uppercase font-bold text-zinc-300 block tracking-wider">
                Overall Device &amp; Service Rating *
              </label>
              
              <div className="flex items-center justify-center sm:justify-start gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-zinc-600 hover:scale-110 transition cursor-pointer"
                  >
                    <Star
                      className={`w-7 h-7 sm:w-8 sm:h-8 transition ${
                        star <= activeDisplayRating
                          ? "fill-[#D4AF37] text-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]"
                          : "text-zinc-700 hover:text-zinc-500"
                      }`}
                    />
                  </button>
                ))}
              </div>

              <span className="text-[11px] font-mono text-[#D4AF37] font-bold block">
                {RATING_LABELS[activeDisplayRating]}
              </span>
            </div>

            {/* 2. Aspect Ratings (Battery, Delivery, Condition) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Battery Score */}
              <div className="p-3 bg-black/40 border border-white/10 space-y-1.5">
                <div className="flex items-center gap-1.5 text-zinc-300 text-[11px] font-bold font-mono uppercase">
                  <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Battery &amp; Speed</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setBatteryHealth(s)}
                      className={`flex-1 py-1 text-[10px] font-mono font-bold transition border ${
                        s <= batteryHealth
                          ? "bg-emerald-950/80 border-emerald-500 text-emerald-400"
                          : "bg-white/5 border-white/10 text-zinc-500"
                      }`}
                    >
                      {s}★
                    </button>
                  ))}
                </div>
              </div>

              {/* Delivery Speed */}
              <div className="p-3 bg-black/40 border border-white/10 space-y-1.5">
                <div className="flex items-center gap-1.5 text-zinc-300 text-[11px] font-bold font-mono uppercase">
                  <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Delivery Speed</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setDeliverySpeed(s)}
                      className={`flex-1 py-1 text-[10px] font-mono font-bold transition border ${
                        s <= deliverySpeed
                          ? "bg-amber-950/80 border-[#D4AF37] text-[#D4AF37]"
                          : "bg-white/5 border-white/10 text-zinc-500"
                      }`}
                    >
                      {s}★
                    </button>
                  ))}
                </div>
              </div>

              {/* Condition Accuracy */}
              <div className="p-3 bg-black/40 border border-white/10 space-y-1.5">
                <div className="flex items-center gap-1.5 text-zinc-300 text-[11px] font-bold font-mono uppercase">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Condition Match</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setConditionAccuracy(s)}
                      className={`flex-1 py-1 text-[10px] font-mono font-bold transition border ${
                        s <= conditionAccuracy
                          ? "bg-cyan-950/80 border-cyan-500 text-cyan-400"
                          : "bg-white/5 border-white/10 text-zinc-500"
                      }`}
                    >
                      {s}★
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* 3. Reviewer Info (Name, City, Order ID) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-300 font-bold">
                  Your Full Name / Nickname *
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Divine Arrey"
                  required
                  className="w-full px-3.5 py-2.5 bg-black border border-white/20 text-white placeholder-zinc-600 text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-300 font-bold">
                  Your City / Town in Cameroon *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black border border-white/20 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                >
                  {CAMEROON_CITIES.map((c) => (
                    <option key={c} value={c} className="bg-zinc-900 text-white">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* 4. Variant & Condition */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-300 font-bold">
                  Purchased Variant
                </label>
                <input
                  type="text"
                  value={variantPurchased}
                  onChange={(e) => setVariantPurchased(e.target.value)}
                  placeholder="e.g. 256GB • Natural Titanium"
                  className="w-full px-3.5 py-2.5 bg-black border border-white/20 text-white placeholder-zinc-600 text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-300 font-bold">
                  Order ID (Optional for Badge Verification)
                </label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. AUR-89210"
                  className="w-full px-3.5 py-2.5 bg-black border border-white/20 text-white placeholder-zinc-600 text-xs font-mono focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            {/* 5. Review Headline & Detailed Comment */}
            <div className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-300 font-bold">
                  Review Headline *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Pristine sealed unit, checked battery health before paying rider"
                  required
                  className="w-full px-3.5 py-2.5 bg-black border border-white/20 text-white placeholder-zinc-600 text-xs focus:border-[#D4AF37] focus:outline-none font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-300 font-bold">
                  Your Detailed Review &amp; Experience *
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  placeholder="Describe your device unboxing, screen condition, camera testing, battery health, and courier delivery experience in Cameroon..."
                  required
                  className="w-full px-3.5 py-2.5 bg-black border border-white/20 text-white placeholder-zinc-600 text-xs focus:border-[#D4AF37] focus:outline-none leading-relaxed"
                />
              </div>

            </div>

            {/* Submit & Cancel Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-5 py-3 bg-white/5 hover:bg-white/10 text-zinc-300 font-mono text-xs uppercase tracking-wider border border-white/10 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-7 py-3 gold-gradient-bg text-black font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition hover:opacity-95 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Publishing Review...</span>
                ) : (
                  <>
                    <FileCheck className="w-4 h-4" />
                    <span>Publish Verified Review</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
