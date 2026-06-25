"use client";

import { PhoneCall } from "lucide-react";
import { Property } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ContactOwnerButtonProps {
  property: Property;
  className?: string;
  variant?: "icon" | "full";
}

export function ContactOwnerButton({ property, className, variant = "full" }: ContactOwnerButtonProps) {
  const [error, setError] = useState(false);

  const handleContact = () => {
    if (!property.owner_mobile) {
      setError(true);
      setTimeout(() => setError(false), 3000);
      return;
    }

    try {
      // Record inquiry
      const stored = JSON.parse(localStorage.getItem("apnakamra_inquiries") || "[]");
      // filter out if already inquired for this property, keep others
      const inquiries = stored.filter((inquiry: { slug: string }) => inquiry.slug !== property.slug);
      
      inquiries.unshift({
        slug: property.slug,
        date: new Date().toISOString(),
        rent: property.lowest_price || 0,
        name: property.name,
        locality: property.locality,
        city: property.city_slug,
        image: property.images?.[0]
      });

      localStorage.setItem("apnakamra_inquiries", JSON.stringify(inquiries));
    } catch (e) {
      console.error(e);
    }

    window.location.href = `tel:${property.owner_mobile}`;
  };

  if (variant === "icon") {
    return (
      <button 
        onClick={handleContact}
        className={cn("font-semibold py-3 px-6 rounded-xl transition-colors flex items-center gap-2 text-sm", 
          error ? "bg-destructive/10 text-destructive hover:bg-destructive/20" : "bg-primary hover:bg-primary/90 text-primary-foreground",
          className)}
      >
        <PhoneCall className="size-4" />
        {error ? "Contact support" : "Contact owner"}
      </button>
    );
  }

  return (
    <button 
      onClick={handleContact}
      className={cn("w-full px-8 py-4 rounded-lg font-bold flex items-center justify-center gap-3 transition-all", 
        error ? "bg-destructive/10 text-destructive hover:bg-destructive/20 shadow-none" : "bg-primary text-primary-foreground hover:opacity-90 active:scale-95 shadow-lg shadow-primary/20",
        className)}
    >
      <PhoneCall className="size-5" />
      {error ? "Owner contact unavailable. Email help@apnakamra.com" : "Contact owner"}
    </button>
  );
}
