"use client";

import React, { useState } from "react";
import Image from "next/image";
import { BadgeCheck, Heart, MapPin, Snowflake, Users, UtensilsCrossed, Star, ShieldAlert, Wifi, ChevronLeft, ChevronRight } from "lucide-react";
import { Property } from "@/lib/api/types";
import { cn } from "@/lib/utils";

interface StayCardProps {
  property: Property;
  isSaved?: boolean;
  onSaveToggle?: (slug: string) => void;
  priorityImage?: boolean;
}

export function StayCard({ property, isSaved = false, onSaveToggle, priorityImage = false }: StayCardProps) {
  const {
    name,
    slug,
    images,
    lowest_price,
    price_single,
    price_double,
    price_triple,
    locality,
    city_name,
    amenities = [],
    is_trusted,
    is_featured,
    is_unverified,
  } = property;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const validImages = images && images.length > 0 
    ? images 
    : ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=60&w=480&auto=format&fit=crop"];

  const formatPrice = (price?: number) => {
    if (!price) return "Price on request";
    return "₹" + Number(price).toLocaleString("en-IN");
  };

  const getSharingText = () => {
    const options: string[] = [];
    if (price_single) options.push("Single");
    if (price_double) options.push("2 Sharing");
    if (price_triple) options.push("3 Sharing");
    if (options.length === 0) return null;
    return options[0]; // Show the first/cheapest option
  };

  const hasAC = amenities.some((a) => /ac|air condition/i.test(a));
  const hasFood = amenities.some((a) => /food|meal|mess/i.test(a));
  const hasWifi = amenities.some((a) => /wifi|wi-fi|internet/i.test(a));

  const displayLocality = locality || city_name;
  const sharingText = getSharingText();

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="group block w-full relative transition-all duration-300 cursor-pointer">
      {/* Photo */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[16px] bg-muted mb-3 group/carousel">
        <Image
          src={validImages[currentImageIndex]}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priorityImage && currentImageIndex === 0}
          loading={priorityImage && currentImageIndex === 0 ? undefined : "lazy"}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Carousel Navigation Controls (Only show if multiple images) */}
        {validImages.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-black opacity-0 transition-opacity group-hover/carousel:opacity-100 hover:scale-110 shadow-sm z-20"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-black opacity-0 transition-opacity group-hover/carousel:opacity-100 hover:scale-110 shadow-sm z-20"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Gradient for Carousel Dots */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/20 to-transparent z-10 pointer-events-none" />

            {/* Real Carousel Dots */}
            <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 z-20">
              {validImages.map((_, idx) => {
                // Show at most 5 dots. If there are more than 5 images, just show 5 to prevent overflow.
                if (idx > 4) return null;
                return (
                  <div 
                    key={idx}
                    className={cn(
                      "h-1.5 rounded-full bg-white shadow-sm transition-all duration-300",
                      idx === currentImageIndex || (idx === 4 && currentImageIndex >= 4)
                        ? "opacity-100 w-1.5 scale-110" 
                        : "opacity-60 w-1.5 scale-90"
                    )} 
                  />
                );
              })}
            </div>
          </>
        )}

        {/* Minimalist Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-20">
          {Boolean(is_trusted) && (
            <span className="inline-flex items-center gap-1 bg-white text-black py-1 px-2 rounded-md text-[10px] uppercase font-bold tracking-wider shadow-sm">
              Verified
            </span>
          )}
          {Boolean(is_featured) && (
            <span className="inline-flex items-center gap-1 bg-white text-black py-1 px-2 rounded-md text-[10px] uppercase font-bold tracking-wider shadow-sm">
              Guest Favorite
            </span>
          )}
        </div>

        {/* Premium Heart */}
        {onSaveToggle && (
          <button
            suppressHydrationWarning
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSaveToggle(slug);
            }}
            className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 backdrop-blur-xl shadow-lg border border-black/5 transition-all duration-300 hover:scale-110 active:scale-90 z-20 group"
            aria-label={isSaved ? "Remove from saved" : "Save stay"}
          >
            <Heart
              className={cn(
                "h-[18px] w-[18px] transition-colors duration-300",
                isSaved ? "fill-rose-500 text-rose-500" : "fill-transparent text-muted-foreground group-hover:text-foreground"
              )}
              strokeWidth={isSaved ? 2 : 2.5}
            />
          </button>
        )}
      </div>

      {/* Content - Vertically Stacked */}
      <div className="flex flex-col px-0.5">
        {/* Price (First Line) */}
        <div className="mb-1">
          {lowest_price ? (
            <div className="text-[16px]">
              <span className="font-bold text-foreground tracking-tight">{formatPrice(lowest_price)}</span>
              <span className="text-foreground ml-1">/mo</span>
            </div>
          ) : (
            <div className="text-[15px] font-medium text-foreground tracking-tight">
              {formatPrice()}
            </div>
          )}
        </div>

        {/* Name */}
        <h3 className="text-[15px] font-semibold text-foreground line-clamp-1 leading-snug">
          {name}
        </h3>

        {/* Location */}
        <div className="text-[14px] text-muted-foreground line-clamp-1 mt-0.5">
          {displayLocality}
        </div>

        {/* Elegant Trust + Fit Row */}
        <div className="flex items-center gap-1.5 text-[14px] text-muted-foreground mt-0.5 flex-wrap">
          {sharingText && (
            <span>{sharingText}</span>
          )}
          {hasAC && (
            <>
              {sharingText && <span className="text-[10px]">·</span>}
              <span>AC</span>
            </>
          )}
          {hasFood && (
            <>
              {(sharingText || hasAC) && <span className="text-[10px]">·</span>}
              <span>Food</span>
            </>
          )}
          {hasWifi && (
            <>
              {(sharingText || hasAC || hasFood) && <span className="text-[10px]">·</span>}
              <span>WiFi</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
