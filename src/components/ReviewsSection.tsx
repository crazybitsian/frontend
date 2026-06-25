"use client";

import React from "react";
import { Star, ThumbsUp, Quote } from "lucide-react";

interface Review {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
  helpful: number;
  stayDuration: string;
}

// Fake reviews for UI demonstration — will be replaced with real API data later
const FAKE_REVIEWS: Review[] = [
  {
    id: 1,
    name: "Priya Sharma",
    avatar: "PS",
    rating: 5,
    date: "2 weeks ago",
    text: "This place is absolutely amazing! The rooms are clean, food is homely and delicious, and the location is super convenient — just 10 mins from my college. The owner aunty is really caring and treats everyone like family. Highly recommend for girls looking for a safe PG!",
    helpful: 12,
    stayDuration: "Stayed 6 months",
  },
  {
    id: 2,
    name: "Rahul Verma",
    avatar: "RV",
    rating: 4,
    date: "1 month ago",
    text: "Good value for money. The WiFi could be faster but rooms are spacious and well-maintained. Power backup works perfectly even during long outages. The mess food is decent — nothing fancy but fills you up well. Great for students on a budget.",
    helpful: 8,
    stayDuration: "Stayed 4 months",
  },
  {
    id: 3,
    name: "Ananya Reddy",
    avatar: "AR",
    rating: 5,
    date: "3 weeks ago",
    text: "Best PG I've stayed in during my 3 years in this city! The security is top-notch with CCTV and biometric entry. Made some of my closest friends here. The study room is quiet and well-lit — perfect for late night exam prep.",
    helpful: 15,
    stayDuration: "Stayed 1 year",
  },
  {
    id: 4,
    name: "Kunal Mehta",
    avatar: "KM",
    rating: 4,
    date: "2 months ago",
    text: "The location is the biggest plus — metro station is literally 5 mins walking distance. Rooms are okay, not luxury but clean and functional. Hot water availability is sometimes an issue in winters. Overall a solid choice for the price.",
    helpful: 6,
    stayDuration: "Stayed 8 months",
  },
];

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const starSize = size === "lg" ? "h-5 w-5" : "h-3.5 w-3.5";
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`${starSize} ${
            i < rating
              ? "text-amber-400 fill-amber-400"
              : "text-border fill-border"
          }`}
        />
      ))}
    </div>
  );
}

function getAverageRating(reviews: Review[]) {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

export function ReviewsSection() {
  const reviews = FAKE_REVIEWS;
  const avgRating = getAverageRating(reviews);

  return (
    <div>
      {/* Rating Summary */}
      <div className="flex items-center gap-6 mb-8">
        {/* Big Rating Number */}
        <div className="flex flex-col items-center">
          <span className="text-5xl font-display font-bold tracking-tight text-foreground">
            {avgRating.toFixed(1)}
          </span>
          <StarRating rating={Math.round(avgRating)} size="lg" />
          <span className="text-xs text-muted-foreground mt-1.5 font-medium">
            {reviews.length} reviews
          </span>
        </div>

        {/* Rating Bars */}
        <div className="flex-1 max-w-xs space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter((r) => r.rating === star).length;
            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-3">
                <span className="text-xs font-medium text-muted-foreground w-3 text-right">{star}</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-700"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-5 tabular-nums">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Cards */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="group"
          >
            {/* Reviewer Info */}
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0 select-none">
                {review.avatar}
              </div>

              <div className="flex-1 min-w-0">
                {/* Name + Rating Row */}
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span className="font-semibold text-[15px] text-foreground">{review.name}</span>
                    <span className="text-muted-foreground text-xs ml-2">{review.date}</span>
                  </div>
                  <StarRating rating={review.rating} />
                </div>

                {/* Stay Duration */}
                <span className="text-xs text-muted-foreground font-medium block mb-2">
                  {review.stayDuration}
                </span>

                {/* Review Text */}
                <p className="text-foreground/80 text-[14.5px] leading-relaxed mb-3">
                  {review.text}
                </p>

                {/* Helpful */}
                <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors group/helpful">
                  <ThumbsUp className="h-3.5 w-3.5 group-hover/helpful:scale-110 transition-transform" />
                  <span>Helpful ({review.helpful})</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
