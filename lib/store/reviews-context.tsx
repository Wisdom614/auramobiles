"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  CustomerReview,
  INITIAL_REVIEWS,
  AspectRatings,
  ConciergeResponse,
} from "@/lib/data/mock-reviews";
import {
  getReviewsFromDB,
  insertReviewToDB,
  updateReviewInDB,
  deleteReviewFromDB,
  subscribeToReviews,
} from "@/lib/supabase/client";

export interface PhoneReviewStats {
  averageRating: number;
  totalReviews: number;
  starCounts: Record<number, number>; // 5: count, 4: count, etc.
  starPercentages: Record<number, number>; // 5: %, 4: %, etc.
  aspects: {
    batteryHealth: number;
    deliverySpeed: number;
    conditionAccuracy: number;
  };
}

interface ReviewsContextType {
  reviews: CustomerReview[];
  isLoading: boolean;
  getReviewsForPhone: (phoneIdOrSlug: string) => CustomerReview[];
  getPhoneStats: (phoneIdOrSlug: string) => PhoneReviewStats;
  addReview: (
    review: Omit<CustomerReview, "id" | "createdAt" | "helpfulCount" | "status"> & {
      status?: "published" | "hidden";
    }
  ) => Promise<CustomerReview>;
  voteHelpful: (reviewId: string) => Promise<void>;
  replyToReview: (
    reviewId: string,
    responseText: string,
    responderName?: string
  ) => Promise<void>;
  updateReviewStatus: (
    reviewId: string,
    status: "published" | "hidden"
  ) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

const STORAGE_KEY = "aura_reviews_v1";

export function ReviewsProvider({ children }: { children: React.ReactNode }) {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from LocalStorage or DB
  useEffect(() => {
    async function loadReviews() {
      try {
        // 1. Check local storage cache
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setReviews(parsed);
              setIsLoading(false);
            }
          } catch {}
        } else {
          setReviews(INITIAL_REVIEWS);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REVIEWS));
          setIsLoading(false);
        }

        // 2. Fetch from Supabase
        const dbReviews = await getReviewsFromDB();
        if (dbReviews && dbReviews.length > 0) {
          // Merge with initial if needed
          const map = new Map<string, CustomerReview>();
          INITIAL_REVIEWS.forEach((r) => map.set(r.id, r));
          dbReviews.forEach((r) => map.set(r.id, r));
          const merged = Array.from(map.values()).sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setReviews(merged);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        }
      } catch (err) {
        console.error("Failed to load customer reviews:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadReviews();

    // Supabase Realtime
    const unsubscribe = subscribeToReviews(() => {
      getReviewsFromDB().then((data) => {
        if (data) {
          setReviews(data);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Save changes helper
  const persistReviews = (updated: CustomerReview[]) => {
    setReviews(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  };

  // Get published reviews for a phone
  const getReviewsForPhone = useCallback(
    (phoneIdOrSlug: string): CustomerReview[] => {
      const normalizedTarget = phoneIdOrSlug.toLowerCase().trim();
      return reviews.filter(
        (r) =>
          r.status === "published" &&
          (r.phoneId.toLowerCase() === normalizedTarget ||
            r.phoneName.toLowerCase().replace(/\s+/g, "-") === normalizedTarget ||
            normalizedTarget.includes(r.phoneId.toLowerCase()))
      );
    },
    [reviews]
  );

  // Calculate aggregate stats for a phone
  const getPhoneStats = useCallback(
    (phoneIdOrSlug: string): PhoneReviewStats => {
      const phoneReviews = getReviewsForPhone(phoneIdOrSlug);
      const total = phoneReviews.length;

      const starCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      const starPercentages: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

      if (total === 0) {
        return {
          averageRating: 5.0,
          totalReviews: 0,
          starCounts,
          starPercentages,
          aspects: {
            batteryHealth: 5.0,
            deliverySpeed: 5.0,
            conditionAccuracy: 5.0,
          },
        };
      }

      let sumRating = 0;
      let sumBattery = 0;
      let sumDelivery = 0;
      let sumCondition = 0;
      let countAspects = 0;

      phoneReviews.forEach((r) => {
        const rounded = Math.min(5, Math.max(1, Math.round(r.rating)));
        starCounts[rounded] = (starCounts[rounded] || 0) + 1;
        sumRating += r.rating;

        if (r.aspectRatings) {
          if (r.aspectRatings.batteryHealth) sumBattery += r.aspectRatings.batteryHealth;
          if (r.aspectRatings.deliverySpeed) sumDelivery += r.aspectRatings.deliverySpeed;
          if (r.aspectRatings.conditionAccuracy)
            sumCondition += r.aspectRatings.conditionAccuracy;
          countAspects += 1;
        }
      });

      for (let star = 1; star <= 5; star++) {
        starPercentages[star] = Math.round(((starCounts[star] || 0) / total) * 100);
      }

      const aspectCountSafe = countAspects > 0 ? countAspects : 1;

      return {
        averageRating: Number((sumRating / total).toFixed(1)),
        totalReviews: total,
        starCounts,
        starPercentages,
        aspects: {
          batteryHealth: Number((sumBattery / aspectCountSafe || 5.0).toFixed(1)),
          deliverySpeed: Number((sumDelivery / aspectCountSafe || 5.0).toFixed(1)),
          conditionAccuracy: Number((sumCondition / aspectCountSafe || 5.0).toFixed(1)),
        },
      };
    },
    [getReviewsForPhone]
  );

  // Add a new review
  const addReview = async (
    input: Omit<CustomerReview, "id" | "createdAt" | "helpfulCount" | "status"> & {
      status?: "published" | "hidden";
    }
  ): Promise<CustomerReview> => {
    const newReview: CustomerReview = {
      ...input,
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      helpfulCount: 0,
      status: input.status || "published",
    };

    const updated = [newReview, ...reviews];
    persistReviews(updated);

    // Sync to Supabase
    await insertReviewToDB(newReview);

    return newReview;
  };

  // Vote helpful
  const voteHelpful = async (reviewId: string) => {
    const target = reviews.find((r) => r.id === reviewId);
    if (!target) return;

    const newCount = target.helpfulCount + 1;
    const updated = reviews.map((r) =>
      r.id === reviewId ? { ...r, helpfulCount: newCount } : r
    );
    persistReviews(updated);

    await updateReviewInDB(reviewId, { helpfulCount: newCount });
  };

  // Admin reply
  const replyToReview = async (
    reviewId: string,
    responseText: string,
    responderName: string = "AURA Concierge"
  ) => {
    const conciergeResponse: ConciergeResponse = {
      response: responseText,
      respondedAt: new Date().toISOString(),
      responderName,
    };

    const updated = reviews.map((r) =>
      r.id === reviewId ? { ...r, conciergeResponse } : r
    );
    persistReviews(updated);

    await updateReviewInDB(reviewId, { conciergeResponse });
  };

  // Admin status update
  const updateReviewStatus = async (
    reviewId: string,
    status: "published" | "hidden"
  ) => {
    const updated = reviews.map((r) => (r.id === reviewId ? { ...r, status } : r));
    persistReviews(updated);

    await updateReviewInDB(reviewId, { status });
  };

  // Delete review
  const deleteReview = async (reviewId: string) => {
    const updated = reviews.filter((r) => r.id !== reviewId);
    persistReviews(updated);

    await deleteReviewFromDB(reviewId);
  };

  return (
    <ReviewsContext.Provider
      value={{
        reviews,
        isLoading,
        getReviewsForPhone,
        getPhoneStats,
        addReview,
        voteHelpful,
        replyToReview,
        updateReviewStatus,
        deleteReview,
      }}
    >
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error("useReviews must be used within a ReviewsProvider");
  }
  return context;
}
