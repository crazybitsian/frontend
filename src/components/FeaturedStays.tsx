import React from "react";
import Link from "next/link";
import { StayCard } from "@/components/StayCard";
import { Property } from "@/lib/api/types";

interface FeaturedStaysProps {
  properties: Property[];
}

/**
 * Renders a carousel or grid of highly rated or sponsored properties for the homepage.
 */
export function FeaturedStays({ properties }: FeaturedStaysProps) {
  if (!properties || properties.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property, i) => (
        <Link
          href={`/${property.city_slug}/${property.slug}`}
          key={property.id || property.slug}
          className="block outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-[14px]"
        >
          <StayCard property={property} priorityImage={i < 3} />
        </Link>
      ))}
    </div>
  );
}
