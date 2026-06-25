"use client";

import { useEffect } from "react";

export function RecentlyViewedTracker({ propertySlug }: { propertySlug: string }) {
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("apnakamra_recently_viewed") || "[]");
      // filter out old numeric IDs just in case, and remove current slug if it exists
      let valid = stored.filter((item: any) => typeof item === 'string' && Number.isNaN(Number(item)) && item !== propertySlug);
      
      // add to start
      valid.unshift(propertySlug);
      
      // keep only last 4
      if (valid.length > 4) {
        valid = valid.slice(0, 4);
      }
      
      localStorage.setItem("apnakamra_recently_viewed", JSON.stringify(valid));
    } catch (e) {
      console.error(e);
    }
  }, [propertySlug]);

  return null;
}
