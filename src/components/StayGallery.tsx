"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronUp, LayoutGrid, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface StayGalleryProps {
  images: string[];
  title: string;
}

/**
 * Displays a masonry or grid gallery of images for a specific property,
 * allowing users to view high-quality photos of the stay.
 */
export function StayGallery({ images, title }: StayGalleryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  // If no images, show a placeholder
  const displayImages = images.length > 0
    ? images
    : ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1200&auto=format&fit=crop"];

  const [mainImage] = displayImages;
  const sideImages = displayImages.slice(1, 5); // Show up to 4 more images for closed state

  const handlePrevious = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : displayImages.length - 1));
  }, [displayImages.length]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedImageIndex((prev) => (prev !== null && prev < displayImages.length - 1 ? prev + 1 : 0));
  }, [displayImages.length]);

  const handleClose = useCallback(() => {
    setSelectedImageIndex(null);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, handleClose, handlePrevious, handleNext]);

  // Lock body scroll when lightbox is open
  const isLightboxOpen = selectedImageIndex !== null;
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLightboxOpen]);

  /**
   * Helper function that renders an individual image card within the gallery, handling lazy loading and aspect ratios.
   */
  const renderImageCard = (item: { src: string; originalIndex: number }, key: number, sizes: string) => (
    <div
      key={key}
      className="rounded-xl overflow-hidden relative group border border-border shadow-sm bg-muted cursor-pointer"
      onClick={() => setSelectedImageIndex(item.originalIndex)}
    >
      <Image
        src={item.src}
        alt={`${title} photo`}
        width={800}
        height={600}
        sizes={sizes}
        className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 ease-out" />
    </div>
  );

  return (
    <div className="flex flex-col">
      {/* 
        ========================================
        LIGHTBOX OVERLAY
        ========================================
      */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex flex-col overflow-hidden"
            onClick={handleClose}
          >
            {/* Ambient Immersive Background */}
            <div className="absolute inset-0 z-0">
              <Image
                src={displayImages[selectedImageIndex]}
                fill
                className="object-cover blur-[100px] opacity-40 scale-125"
                alt=""
              />
              <div className="absolute inset-0 bg-background/80 backdrop-blur-2xl" />
            </div>

            {/* Top Bar */}
            <div className="relative flex-none p-4 sm:p-6 flex justify-between items-center z-50">
              <span className="text-foreground/80 font-[family-name:var(--font-dm-sans)] font-medium text-sm tracking-widest uppercase drop-shadow-sm">
                {selectedImageIndex + 1} / {displayImages.length}
              </span>
              <button
                onClick={handleClose}
                className="p-2 rounded-full bg-black/5 hover:bg-black/10 text-foreground transition-colors backdrop-blur-md"
              >
                <X className="size-6" />
              </button>
            </div>

            {/* Main Stage Area */}
            <div className="relative flex-1 flex items-center justify-center px-4 sm:px-20 z-10">
              {/* Navigation Left */}
              <button
                onClick={handlePrevious}
                className="absolute left-2 sm:left-6 p-3 rounded-full bg-background/80 hover:bg-background border border-border/50 text-foreground transition-colors shadow-sm z-50 group backdrop-blur-md"
              >
                <ChevronLeft className="size-5 sm:size-6 group-hover:-translate-x-0.5 transition-transform" />
              </button>

              {/* Sharp Foreground Image */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImageIndex}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  src={displayImages[selectedImageIndex]}
                  alt={`${title} photo ${selectedImageIndex + 1}`}
                  className="max-w-full max-h-[70vh] rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] ring-1 ring-border/20 object-contain z-20"
                  onClick={(e) => e.stopPropagation()}
                />
              </AnimatePresence>

              {/* Navigation Right */}
              <button
                onClick={handleNext}
                className="absolute right-2 sm:right-6 p-3 rounded-full bg-background/80 hover:bg-background border border-border/50 text-foreground transition-colors shadow-sm z-50 group backdrop-blur-md"
              >
                <ChevronRight className="size-5 sm:size-6 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Bottom Filmstrip */}
            <div
              className="relative flex-none h-28 sm:h-32 px-4 pb-6 mt-4 flex items-center justify-start sm:justify-center overflow-x-auto hide-scrollbar z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-0">
                {displayImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative size-16 sm:size-20 rounded-xl overflow-hidden shrink-0 transition-all duration-300 ${idx === selectedImageIndex
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-transparent opacity-100 scale-105 shadow-lg"
                      : "opacity-50 hover:opacity-100 grayscale hover:grayscale-0"
                      }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 
        ========================================
        EXPANDED GRID VIEW
        ========================================
      */}
      {isExpanded ? (
        <div className="w-full relative pb-16 animate-in fade-in duration-500">
          {/* Mobile View (2 Columns) */}
          <div className="flex md:hidden gap-2 sm:gap-3">
            {Array.from({ length: 2 }, (_, colIndex) => (
              <div key={colIndex} className="flex flex-col gap-2 sm:gap-3 flex-1">
                {displayImages
                  .map((src, originalIndex) => ({ src, originalIndex }))
                  .filter((_, i) => i % 2 === colIndex)
                  .map((item, i) => renderImageCard(item, i, "50vw"))}
              </div>
            ))}
          </div>

          {/* Desktop View (3 Columns) */}
          <div className="hidden md:flex gap-2 sm:gap-3">
            {Array.from({ length: 3 }, (_, colIndex) => (
              <div key={colIndex} className="flex flex-col gap-2 sm:gap-3 flex-1">
                {displayImages
                  .map((src, originalIndex) => ({ src, originalIndex }))
                  .filter((_, i) => i % 3 === colIndex)
                  .map((item, i) => renderImageCard(item, i, "33vw"))}
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
              <ChevronUp className="size-5" />
              Show less
            </button>
          </div>
        </div>
      ) : (
        /* 
          ========================================
          COLLAPSED BENTO GRID VIEW
          ========================================
        */
        <>
          <div
            className="relative w-full aspect-[4/3] sm:aspect-auto sm:h-[55vh] max-h-[550px] rounded-3xl overflow-hidden shadow-sm border border-border bg-muted"
          >
            {/* Mobile/Tablet View - Single Image */}
            <div
              className="md:hidden relative size-full cursor-pointer group"
              onClick={() => setSelectedImageIndex(0)}
            >
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

            {/* Desktop View - Adaptive Gallery Grid */}
            <div className={`hidden md:grid gap-2 size-full absolute inset-0 ${
              displayImages.length === 1 ? 'grid-cols-1' :
              displayImages.length === 2 ? 'grid-cols-2' :
              displayImages.length === 3 ? 'grid-cols-3' :
              'grid-cols-4 grid-rows-2'
            }`}>
              {/* Main large image */}
              <div
                className={`relative bg-muted overflow-hidden group/main cursor-pointer ${
                  displayImages.length === 1 ? '' :
                  displayImages.length === 2 ? '' :
                  displayImages.length === 3 ? 'row-span-1' :
                  sideImages.length > 0 ? 'col-span-2 row-span-2' : 'col-span-4 row-span-2'
                }`}
                onClick={() => setSelectedImageIndex(0)}
              >
                <Image
                  src={mainImage}
                  alt={`${title} main photo`}
                  fill
                  priority
                  sizes={displayImages.length <= 2 ? "(max-width: 1200px) 50vw, 800px" : "(max-width: 1200px) 50vw, 600px"}
                  className="object-cover transition-transform duration-700 ease-out group-hover/main:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover/main:bg-black/10 transition-colors duration-500 ease-out" />
              </div>

              {/* Side images */}
              {sideImages.map((img, i) => (
                <div
                  key={i}
                  className="relative bg-muted overflow-hidden group/side cursor-pointer"
                  onClick={() => setSelectedImageIndex(i + 1)}
                >
                  <Image
                    src={img}
                    alt={`${title} photo ${i + 2}`}
                    fill
                    sizes={displayImages.length <= 3 ? "33vw" : "25vw"}
                    className="object-cover transition-transform duration-700 ease-out group-hover/side:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover/side:bg-black/10 transition-colors duration-500 ease-out" />
                </div>
              ))}
            </div>

            {/* Inline "Show all photos" pill overlay */}
            {displayImages.length > 1 && (
              <button
                onClick={() => setIsExpanded(true)}
                className="absolute bottom-4 right-4 z-30 bg-white/95 backdrop-blur-sm text-foreground px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg hover:bg-white hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 border border-black/5 cursor-pointer"
              >
                <LayoutGrid className="size-4" />
                Show all photos
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
