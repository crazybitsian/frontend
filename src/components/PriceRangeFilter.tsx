"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface PriceRangeFilterProps {
  min: number;
  max: number;
  absoluteMin?: number;
  absoluteMax?: number;
  onChange: (min: number, max: number) => void;
}

// Curved histogram distribution (mimicking a realistic price curve)
const HISTOGRAM_DATA = [
  2, 4, 8, 12, 16, 25, 30, 45, 60, 80, 
  100, 90, 85, 70, 50, 45, 30, 25, 20, 18, 
  15, 12, 10, 8, 7, 6, 5, 4, 3, 3, 
  2, 2, 2, 1, 1, 1, 1, 1, 1, 1
];

export function PriceRangeFilter({
  min,
  max,
  absoluteMin = 0,
  absoluteMax = 30000,
  onChange,
}: PriceRangeFilterProps) {
  const [localMin, setLocalMin] = useState(min);
  const [localMax, setLocalMax] = useState(max);

  // Sync props to state if they change externally (like hitting "Clear All")
  useEffect(() => {
    setLocalMin(min);
    setLocalMax(max);
  }, [min, max]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), localMax - 1000);
    setLocalMin(value);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), localMin + 1000);
    setLocalMax(value);
  };

  const handleDragEnd = () => {
    onChange(localMin, localMax);
  };

  const minPercent = ((localMin - absoluteMin) / (absoluteMax - absoluteMin)) * 100;
  const maxPercent = ((localMax - absoluteMin) / (absoluteMax - absoluteMin)) * 100;

  return (
    <div className="w-full flex flex-col gap-6">
      <style dangerouslySetInnerHTML={{ __html: `
        .dual-range {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          pointer-events: none;
        }
        .dual-range::-webkit-slider-thumb {
          pointer-events: auto;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: white;
          border: 1px solid #E6E6E1;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          -webkit-appearance: none;
          cursor: pointer;
          margin-top: -14px; /* Centers thumb over a 4px track */
        }
        .dual-range::-moz-range-thumb {
          pointer-events: auto;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: white;
          border: 1px solid #E6E6E1;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          cursor: pointer;
        }
      `}} />

      {/* Histogram + Slider Container */}
      <div className="relative pt-6 pb-2 px-2">
        
        {/* Histogram */}
        <div className="flex items-end justify-between h-16 w-full gap-[1px] mb-4">
          {HISTOGRAM_DATA.map((height, i) => {
            const bucketMin = absoluteMin + (i / HISTOGRAM_DATA.length) * (absoluteMax - absoluteMin);
            const bucketMax = absoluteMin + ((i + 1) / HISTOGRAM_DATA.length) * (absoluteMax - absoluteMin);
            // Check if this bar falls inside the active range
            const isActive = bucketMax > localMin && bucketMin < localMax;
            
            return (
              <div 
                key={i}
                className={`flex-1 rounded-t-sm transition-colors duration-200 ${isActive ? "bg-primary" : "bg-muted"}`}
                style={{ height: `${height}%` }}
              />
            );
          })}
        </div>

        {/* Custom Track (Visual) */}
        <div className="relative h-1 w-full bg-muted rounded-full">
          {/* Active Track Fill */}
          <div 
            className="absolute top-0 bottom-0 bg-primary rounded-full transition-all duration-75"
            style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
          />
        </div>

        {/* Native Input Overlays */}
        <div className="absolute left-2 right-2 bottom-2 h-1">
          <input 
            type="range"
            min={absoluteMin}
            max={absoluteMax}
            step={500}
            value={localMin}
            onChange={handleMinChange}
            onMouseUp={handleDragEnd}
            onTouchEnd={handleDragEnd}
            className="dual-range absolute top-0 w-full z-30"
          />
          <input 
            type="range"
            min={absoluteMin}
            max={absoluteMax}
            step={500}
            value={localMax}
            onChange={handleMaxChange}
            onMouseUp={handleDragEnd}
            onTouchEnd={handleDragEnd}
            className="dual-range absolute top-0 w-full z-40"
          />
        </div>
      </div>

      {/* Min / Max Input Pills */}
      <div className="flex items-center justify-between gap-4 mt-2">
        <div className="flex-1 flex flex-col gap-1.5">
          <label className="text-xs text-muted-foreground ml-1">Minimum</label>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-muted-foreground">₹</span>
            <Input 
              type="number" 
              value={localMin === 0 ? "" : localMin}
              onChange={(e) => {
                 const v = Number(e.target.value);
                 setLocalMin(v);
              }}
              onBlur={() => {
                let v = localMin;
                if (v < absoluteMin) v = absoluteMin;
                if (v > localMax - 1000) v = localMax - 1000;
                setLocalMin(v);
                onChange(v, localMax);
              }}
              className="pl-8 h-14 rounded-full text-base border-border/60 hover:border-border transition-colors bg-white shadow-sm focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
        </div>

        <div className="w-4 h-[1px] bg-border mt-6 shrink-0" />

        <div className="flex-1 flex flex-col gap-1.5">
          <label className="text-xs text-muted-foreground ml-1">Maximum</label>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-muted-foreground">₹</span>
            <Input 
              type="number" 
              value={localMax === 0 ? "" : localMax}
              onChange={(e) => {
                 const v = Number(e.target.value);
                 setLocalMax(v);
              }}
              onBlur={() => {
                let v = localMax;
                if (v > absoluteMax) v = absoluteMax;
                if (v < localMin + 1000) v = localMin + 1000;
                setLocalMax(v);
                onChange(localMin, v);
              }}
              className="pl-8 h-14 rounded-full text-base border-border/60 hover:border-border transition-colors bg-white shadow-sm focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
