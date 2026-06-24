"use client";

import React from "react";
import Image from "next/image";
import { BadgeCheck, Heart, MapPin, Snowflake, Users, UtensilsCrossed, Star, ShieldAlert, Wifi } from "lucide-react";
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

  const displayImage = images?.[0] || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=60&w=480&auto=format&fit=crop";

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

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-[14px] border border-border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-14px_rgba(24,24,27,0.18)]">
      {/* Photo */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <Image
          src={displayImage}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priorityImage}
          loading={priorityImage ? undefined : "lazy"}
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {Boolean(is_trusted) && (
            <span className="inline-flex items-center gap-1 bg-primary text-primary-foreground py-1 px-2.5 rounded-lg text-xs font-semibold">
              <BadgeCheck className="h-3.5 w-3.5" />
              Verified
            </span>
          )}
          {Boolean(is_featured) && (
            <span className="inline-flex items-center gap-1 bg-amber-500 text-white py-1 px-2.5 rounded-lg text-xs font-semibold">
              <Star className="h-3.5 w-3.5 fill-current" />
              Featured
            </span>
          )}
          {Boolean(is_unverified) && (
            <span className="inline-flex items-center gap-1 bg-destructive text-white py-1 px-2.5 rounded-lg text-xs font-semibold">
              <ShieldAlert className="h-3.5 w-3.5" />
              Unverified
            </span>
          )}
        </div>

        {/* Heart */}
        {onSaveToggle && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSaveToggle(slug);
            }}
            className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-foreground backdrop-blur-sm transition-all hover:bg-white active:scale-95 z-10"
            aria-label={isSaved ? "Remove from saved" : "Save stay"}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                isSaved ? "fill-destructive text-destructive" : "text-foreground"
              )}
            />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Name */}
        <h3 className="font-display text-lg font-bold tracking-tight text-foreground line-clamp-1 mb-1 leading-snug group-hover:text-primary transition-colors">
          {name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-1">{displayLocality}</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline mb-3">
          <span className="text-xl font-semibold tracking-tight text-primary tabular-nums">
            {formatPrice(lowest_price)}
          </span>
          {Boolean(lowest_price) && (
            <span className="text-sm text-muted-foreground ml-1">/mo</span>
          )}
        </div>

        {/* Amenity Chips */}
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {sharingText && (
            <span className="inline-flex items-center gap-1 bg-accent text-accent-foreground px-2.5 py-1 rounded-md text-xs font-medium">
              <Users className="h-3 w-3" />
              {sharingText}
            </span>
          )}
          {hasAC && (
            <span className="inline-flex items-center gap-1 bg-accent text-accent-foreground px-2.5 py-1 rounded-md text-xs font-medium">
              <Snowflake className="h-3 w-3" />
              AC
            </span>
          )}
          {hasFood && (
            <span className="inline-flex items-center gap-1 bg-accent text-accent-foreground px-2.5 py-1 rounded-md text-xs font-medium">
              <UtensilsCrossed className="h-3 w-3" />
              Food
            </span>
          )}
          {hasWifi && (
            <span className="inline-flex items-center gap-1 bg-accent text-accent-foreground px-2.5 py-1 rounded-md text-xs font-medium">
              <Wifi className="h-3 w-3" />
              WiFi
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
