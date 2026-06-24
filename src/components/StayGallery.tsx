"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronUp, LayoutGrid, ArrowRight } from "lucide-react";

interface StayGalleryProps {
  images: string[];
  title: string;
}

export function StayGallery({ images, title }: StayGalleryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // If no images, show a placeholder
  const displayImages = images.length > 0 
    ? images 
    : ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1200&auto=format&fit=crop"];

  const mainImage = displayImages[0];
  const sideImages = displayImages.slice(1, 5); // Show up to 4 more images for closed state

  if (isExpanded) {
    return (
      <div className="w-full relative pb-16 animate-in fade-in duration-500">
        {/* Mobile View (2 Columns) */}
        <div className="flex md:hidden gap-2 sm:gap-3">
          {Array.from({ length: 2 }, (_, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-2 sm:gap-3 flex-1">
              {displayImages.filter((_, i) => i % 2 === colIndex).map((img, i) => (
                <div key={i} className="rounded-xl overflow-hidden relative group border border-border shadow-sm bg-muted" onClick={() => window.open(img, '_blank')}>
                  <Image
                    src={img}
                    alt={`${title} photo`}
                    width={800}
                    height={600}
                    sizes="50vw"
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105 cursor-zoom-in"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Desktop View (3 Columns) */}
        <div className="hidden md:flex gap-2 sm:gap-3">
          {Array.from({ length: 3 }, (_, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-2 sm:gap-3 flex-1">
              {displayImages.filter((_, i) => i % 3 === colIndex).map((img, i) => (
                <div key={i} className="rounded-xl overflow-hidden relative group border border-border shadow-sm bg-muted" onClick={() => window.open(img, '_blank')}>
                  <Image
                    src={img}
                    alt={`${title} photo`}
                    width={800}
                    height={600}
                    sizes="33vw"
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105 cursor-zoom-in"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
        
        {/* Floating Show Less Button */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="bg-white/90 backdrop-blur-md text-primary px-6 py-2.5 rounded-full font-[family-name:var(--font-dm-sans)] font-semibold text-sm shadow-lg flex items-center gap-2 hover:scale-95 hover:bg-white transition-all border border-border"
          >
            <ChevronUp className="w-5 h-5" />
            Show less
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div 
        className="relative w-full aspect-[16/10] sm:aspect-auto sm:h-[40vh] max-h-[450px] rounded-2xl overflow-hidden shadow-sm border border-border bg-muted cursor-pointer group" 
        onClick={() => setIsExpanded(true)}
      >
      {/* Mobile/Tablet View - Single Image */}
      <div className="md:hidden relative h-full w-full">
        <Image
          src={mainImage}
          alt={`${title} main photo`}
          fill
          priority
          sizes="100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {displayImages.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
            1 / {displayImages.length}
          </div>
        )}
      </div>

      {/* Desktop View - Bento Grid */}
      <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 h-full w-full absolute inset-0">
        {/* Main large image */}
        <div className={`relative ${sideImages.length > 0 ? "col-span-2 row-span-2" : "col-span-4 row-span-2"} bg-muted overflow-hidden`}>
          <Image
            src={mainImage}
            alt={`${title} main photo`}
            fill
            priority
            sizes="(max-width: 1200px) 50vw, 800px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        
        {/* Side smaller images */}
        {sideImages.map((img, i) => (
          <div key={i} className="relative col-span-1 row-span-1 bg-muted overflow-hidden">
            <Image
              src={img}
              alt={`${title} photo ${i + 2}`}
              fill
              sizes="25vw"
              className="object-cover transition-transform duration-500"
            />
          </div>
        ))}
      </div>

      </div>
      
      {/* External Gallery Control (Desktop only) */}
      {displayImages.length > 5 && (
        <div className="hidden md:flex mt-3 justify-center">
          <button 
            onClick={() => setIsExpanded(true)}
            className="w-full flex items-center justify-between px-5 py-3 rounded-xl border border-border bg-card hover:bg-muted transition-colors group/btn shadow-sm"
          >
            <span className="font-[family-name:var(--font-dm-sans)] font-semibold text-sm tracking-wide uppercase text-foreground">View all {displayImages.length} photos</span>
            <div className="flex items-center gap-2 text-primary">
              <span className="text-xs font-semibold uppercase tracking-wider">Gallery</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
