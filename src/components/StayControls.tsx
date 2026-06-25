"use client";

import { Share2, Heart } from "lucide-react";
import { useState, useEffect } from "react";

interface StayControlsProps {
  propertySlug: string;
  propertyName: string;
}

export function StayControls({ propertySlug, propertyName }: StayControlsProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const wishlist = JSON.parse(localStorage.getItem("apnakamra_wishlist") || "[]");
    setIsLiked(wishlist.includes(propertySlug));
  }, [propertySlug]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: propertyName,
          text: `Check out ${propertyName} on ApnaKamra!`,
          url: url,
        });
      } catch (err) {
        console.error("Error sharing", err);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  const handleLike = () => {
    let wishlist = JSON.parse(localStorage.getItem("apnakamra_wishlist") || "[]");
    
    if (isLiked) {
      wishlist = wishlist.filter((slug: string) => slug !== propertySlug);
    } else {
      wishlist.push(propertySlug);
    }
    
    localStorage.setItem("apnakamra_wishlist", JSON.stringify(wishlist));
    setIsLiked(!isLiked);
    
    // Dispatch a custom event so other components (like Navbar) can react if needed
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  if (!isMounted) return (
    <div className="flex gap-2">
      <button className="flex items-center justify-center h-10 w-10 rounded-full bg-card border border-border text-foreground shadow-sm" aria-label="Share">
        <Share2 className="h-4.5 w-4.5" />
      </button>
      <button className="flex items-center justify-center h-10 w-10 rounded-full bg-card border border-border text-foreground shadow-sm" aria-label="Save">
        <Heart className="h-4.5 w-4.5" />
      </button>
    </div>
  );

  return (
    <div className="flex gap-2">
      <button 
        onClick={handleShare}
        className="flex items-center justify-center h-10 w-10 rounded-full bg-card border border-border text-foreground hover:bg-muted transition-colors shadow-sm" 
        aria-label="Share"
      >
        <Share2 className="h-4.5 w-4.5" />
      </button>
      <button 
        onClick={handleLike}
        className={`flex items-center justify-center h-10 w-10 rounded-full border transition-colors shadow-sm ${isLiked ? 'bg-primary/10 border-primary/20 text-primary hover:bg-primary/20' : 'bg-card border-border text-foreground hover:bg-muted'}`} 
        aria-label="Save"
      >
        <Heart className={`h-4.5 w-4.5 transition-all duration-300 ${isLiked ? 'fill-current scale-110' : 'scale-100'}`} />
      </button>
    </div>
  );
}
