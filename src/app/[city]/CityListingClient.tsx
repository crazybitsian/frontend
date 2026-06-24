"use client";

import React, { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { StayCard } from "@/components/StayCard";
import { Search, BadgeCheck, Snowflake, UtensilsCrossed, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import Link from "next/link";

interface CityListingClientProps {
  citySlug: string;
  cityName: string;
  initialCount?: number;
}

const FILTER_OPTIONS = [
  { id: "all", label: "All Stays", icon: null },
  { id: "verified", label: "Verified", icon: BadgeCheck },
  { id: "ac", label: "AC Rooms", icon: Snowflake },
  { id: "food", label: "Food", icon: UtensilsCrossed },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "rating_desc", label: "Highest rating" },
];

export function CityListingClient({ citySlug, cityName, initialCount }: CityListingClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sort, setSort] = useState("newest");
  const debouncedQuery = useDebounce(searchQuery, 400);

  const toggleFilter = (filterId: string) => {
    if (filterId === "all") {
      setActiveFilters([]);
      return;
    }
    setActiveFilters((prev) => 
      prev.includes(filterId) 
        ? prev.filter((id) => id !== filterId) 
        : [...prev, filterId]
    );
  };

  const getFilterParams = useCallback(() => {
    let flag = "";
    let amenitiesArr: string[] = [];
    if (activeFilters.includes("verified")) flag = "trusted";
    if (activeFilters.includes("ac")) amenitiesArr.push("AC");
    if (activeFilters.includes("food")) amenitiesArr.push("Meals Included");
    const amenities = amenitiesArr.join(",");
    return { city: citySlug, q: debouncedQuery, flag, amenities, sort };
  }, [citySlug, debouncedQuery, activeFilters, sort]);

  const { data: properties, isLoading, isError, refetch } = useQuery({
    queryKey: ["properties", citySlug, debouncedQuery, activeFilters, sort],
    queryFn: () => api.getProperties(getFilterParams()),
  });

  return (
    <div>
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search stays in ${cityName}...`}
          className="h-12 pl-11 pr-4 rounded-xl border-border bg-card text-base font-medium focus-visible:ring-primary"
        />
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex-1 flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1 pr-4 -mr-4 md:pr-0 md:mr-0">
          {FILTER_OPTIONS.map((filter) => {
            const isActive = filter.id === "all" ? activeFilters.length === 0 : activeFilters.includes(filter.id);
            const Icon = filter.icon;
            return (
              <button
                key={filter.id}
                onClick={() => toggleFilter(filter.id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {filter.label}
              </button>
            );
          })}
        </div>

        {/* Premium Sort Dropdown */}
        <div className="shrink-0 z-10 pl-2">
          <Select value={sort} onValueChange={(val) => setSort(val || "newest")}>
            <SelectTrigger className="w-fit h-auto rounded-full px-5 py-2.5 bg-card border-border shadow-sm hover:shadow-md transition-all focus:ring-2 focus:ring-primary outline-none">
              <div className="flex items-center gap-1.5 font-medium">
                <span className="text-muted-foreground font-normal">Sort by:</span>
                <span>{SORT_OPTIONS.find(o => o.value === sort)?.label || "Newest first"}</span>
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl shadow-xl border-border p-1" alignItemWithTrigger={false} align="end" sideOffset={8}>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem 
                  key={opt.value} 
                  value={opt.value}
                  className="py-3 px-4 cursor-pointer rounded-xl hover:bg-muted/50 focus:bg-muted/50 font-medium transition-colors"
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      {!isLoading && !isError && properties && (
        <p className="text-sm font-medium text-muted-foreground mb-5">
          {properties.length} {properties.length === 1 ? "stay" : "stays"} found
        </p>
      )}

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse flex flex-col rounded-[14px] border border-border overflow-hidden">
              <div className="bg-muted aspect-[4/3] w-full" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-6 bg-muted rounded w-1/3" />
                <div className="flex gap-2">
                  <div className="h-6 bg-muted rounded-md w-16" />
                  <div className="h-6 bg-muted rounded-md w-12" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="py-16 px-6 text-center border border-border rounded-2xl bg-card max-w-md mx-auto mt-8">
          <p className="text-foreground font-semibold mb-2 text-lg">Couldn't load rooms</p>
          <p className="text-muted-foreground mb-6">Check your connection and try again.</p>
          <button
            onClick={() => refetch()}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && properties && properties.length === 0 && (
        <div className="py-16 px-6 text-center border border-border rounded-2xl bg-card max-w-md mx-auto mt-8">
          <h3 className="text-xl font-bold mb-2 text-foreground font-display tracking-tight">No matches found</h3>
          <p className="text-muted-foreground mb-6">
            No rooms match these filters yet — try widening your budget or area.
          </p>
          <button
            onClick={() => {
              setActiveFilters([]);
              setSearchQuery("");
              setSort("newest");
            }}
            className="px-6 py-2.5 bg-muted text-foreground rounded-lg font-semibold hover:bg-muted/80 transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Results Grid */}
      {!isLoading && !isError && properties && properties.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {properties.map((property) => (
              <Link
                href={`/${citySlug}/${property.slug}`}
                key={property.id || property.slug}
                className="block outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-[14px]"
              >
                <StayCard property={property} />
              </Link>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-10 mb-4">
            Showing all {properties.length} {properties.length === 1 ? "stay" : "stays"}
          </p>
        </>
      )}
    </div>
  );
}
