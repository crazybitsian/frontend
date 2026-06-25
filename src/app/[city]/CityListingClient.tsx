"use client";

import React, { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { Property } from "@/lib/api/types";
import { StayCard } from "@/components/StayCard";
import { useRouter } from "next/navigation";
import { Search, BadgeCheck, Snowflake, UtensilsCrossed, ChevronDown, MapPin, SlidersHorizontal, ArrowLeft, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PriceRangeFilter } from "@/components/PriceRangeFilter";
import Fuse from "fuse.js";

interface CityListingClientProps {
  citySlug: string;
  cityName: string;
  cities?: any[];
  initialCount?: number;
  initialProperties?: Property[];
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

const formatCityName = (name: string) => {
  if (!name) return "";
  return name.toLowerCase().split(" ").map(word => 
    word === "ncr" ? "NCR" : word.charAt(0).toUpperCase() + word.slice(1)
  ).join(" ");
};

export function CityListingClient({ citySlug, cityName, cities = [], initialCount, initialProperties }: CityListingClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sort, setSort] = useState("newest");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [minBudget, setMinBudget] = useState<number>(0);
  const [maxBudget, setMaxBudget] = useState<number>(30000);
  const debouncedQuery = useDebounce(searchQuery, 400);

  React.useEffect(() => {
    const updateWishlist = () => {
      setWishlist(JSON.parse(localStorage.getItem("apnakamra_wishlist") || "[]"));
    };
    updateWishlist();
    window.addEventListener("wishlistUpdated", updateWishlist);
    return () => window.removeEventListener("wishlistUpdated", updateWishlist);
  }, []);

  const handleSaveToggle = (slug: string) => {
    let newWishlist = [...wishlist];
    if (newWishlist.includes(slug)) {
      newWishlist = newWishlist.filter(s => s !== slug);
    } else {
      newWishlist.push(slug);
    }
    setWishlist(newWishlist);
    localStorage.setItem("apnakamra_wishlist", JSON.stringify(newWishlist));
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

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
    return { city: citySlug, flag, amenities, sort };
  }, [citySlug, activeFilters, sort]);

  const isDefaultQuery = activeFilters.length === 0 && sort === "newest";
  const { data: properties, isLoading, isError, refetch } = useQuery({
    queryKey: ["properties", citySlug, activeFilters, sort],
    queryFn: () => api.getProperties(getFilterParams()),
    initialData: isDefaultQuery ? initialProperties : undefined,
  });

  const filteredProperties = React.useMemo(() => {
    if (!properties) return [];
    
    // First, filter by budget locally
    let results = properties.filter((p: Property) => {
      const price = Number(p.lowest_price);
      return price >= minBudget && price <= maxBudget;
    });

    // Then, perform fuzzy search locally if there's a query
    if (debouncedQuery.trim()) {
      const fuse = new Fuse(results, {
        keys: ["name", "locality", "city_name", "type"],
        threshold: 0.4, // Lower threshold = stricter match, 0.4 allows typos
        ignoreLocation: true, // Finds match anywhere in the string
      });
      results = fuse.search(debouncedQuery).map(result => result.item);
    }

    return results;
  }, [properties, minBudget, maxBudget, debouncedQuery]);

  const router = useRouter();

  return (
    <div>
      {/* Floating Command Center (Sticky) */}
      <div className="fixed top-4 left-0 right-0 z-50 px-4 pointer-events-none flex justify-center">
        <div className="pointer-events-auto flex items-center bg-white/95 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-black/5 rounded-[100px] p-2 w-full max-w-3xl transition-all duration-300">
          
          {/* Back Button (Mobile Only) */}
          <Link href="/" className="md:hidden flex items-center justify-center h-11 w-11 rounded-full hover:bg-black/5 transition-colors shrink-0 mr-1">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </Link>

          {/* City Dropdown */}
          <div className="shrink-0">
            <Select value={citySlug} onValueChange={(val) => router.push(`/${val}`)}>
              <SelectTrigger className="border-0 bg-transparent shadow-none hover:bg-black/5 focus:ring-0 rounded-[100px] h-11 px-3 sm:px-5 font-semibold text-foreground text-[15px]">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4.5 w-4.5 text-primary hidden sm:block" />
                  <span>{formatCityName(cityName)}</span>
                </div>
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false} className="rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border-border/40 p-4 min-w-[320px] sm:min-w-[420px] bg-white/95 backdrop-blur-3xl" align="start" sideOffset={32}>
                <div className="px-2 pb-3 mb-3 border-b border-border/60 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70">Select Destination</span>
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase tracking-wide">{cities.length} Cities</span>
                </div>
                <SelectGroup className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {cities.map((city, index) => {
                    const gradients = [
                      "from-emerald-100 to-teal-50",
                      "from-blue-100 to-indigo-50",
                      "from-rose-100 to-orange-50",
                      "from-amber-100 to-yellow-50",
                      "from-purple-100 to-fuchsia-50",
                      "from-sky-100 to-cyan-50"
                    ];
                    const gradient = gradients[index % gradients.length];
                    
                    return (
                      <SelectItem 
                        key={city.slug} 
                        value={city.slug}
                        className="p-2 cursor-pointer rounded-2xl hover:bg-black/5 focus:bg-black/5 transition-all duration-300 group"
                      >
                        <div className="flex items-center gap-3.5 pr-2">
                          <div className={`h-11 w-11 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm border border-black/5 shrink-0 overflow-hidden`}>
                            {city.image ? (
                              <img src={city.image} alt={city.name} className="h-full w-full rounded-full object-cover" />
                            ) : (
                              <span className="font-bold text-foreground/40 text-lg uppercase">{city.name.charAt(0)}</span>
                            )}
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="font-semibold text-[14px] text-foreground group-hover:text-primary transition-colors">{formatCityName(city.name)}</span>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="w-px h-6 bg-border mx-1 sm:mx-2 shrink-0" />

          {/* Search Input */}
          <div className="flex-1 relative flex items-center h-11">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search localities..."
              className="h-full w-full border-0 bg-transparent shadow-none focus-visible:ring-0 px-2 sm:px-4 text-[15px] placeholder:text-muted-foreground/70"
            />
          </div>

          {/* Search Icon (Non-interactive) */}
          <div className="shrink-0 ml-1">
            <div className="flex items-center justify-center h-11 w-11 rounded-full bg-primary text-primary-foreground shadow-sm">
              <Search className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Sort & Filter */}
      <div className="flex items-center justify-end gap-4 mb-4 mt-2">
        {/* Premium Sort & Filter */}
        <div className="shrink-0 z-10 flex items-center gap-2">
          
          {/* Advanced Filters Button */}
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-semibold transition-all bg-white border border-border/60 text-foreground hover:bg-muted/50 hover:border-border"
          >
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            Filters
            {(activeFilters.length > 0 || minBudget > 0 || maxBudget < 30000) && (
              <span className="ml-1 bg-primary w-2 h-2 rounded-full" />
            )}
          </button>

          {/* Premium Sort Dropdown */}
          <div className="hidden sm:block">
            <Select value={sort} onValueChange={(val) => setSort(val || "newest")}>
            <SelectTrigger className="w-fit h-auto rounded-full px-5 py-2.5 bg-transparent border-0 shadow-none hover:bg-muted/50 transition-all focus:ring-0 outline-none">
              <div className="flex items-center gap-2 font-medium text-[14px]">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Sort:</span>
                <span className="text-foreground">{SORT_OPTIONS.find(o => o.value === sort)?.label || "Newest first"}</span>
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
      </div>

      {/* Results Count */}
      {!isLoading && !isError && filteredProperties && (
        <p className="text-[15px] font-semibold text-foreground mb-4 flex items-center gap-2">
          <span>{filteredProperties.length} {filteredProperties.length === 1 ? "stay" : "stays"} found</span>
          <span className="h-px bg-border flex-1 ml-4" />
        </p>
      )}

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-12 sm:gap-y-16">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse flex flex-col overflow-hidden">
              <div className="bg-muted aspect-[20/19] w-full rounded-[16px] mb-3" />
              <div className="space-y-3">
                <div className="h-5 bg-muted rounded w-1/3" />
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="py-16 px-6 text-center border border-border/50 rounded-[24px] bg-card max-w-md mx-auto mt-8">
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
      {/* Results Grid */}
      {!isLoading && !isError && filteredProperties && filteredProperties.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-8 sm:gap-y-12">
            {filteredProperties.map((property, index) => (
              <Link
                href={`/${citySlug}/${property.slug}`}
                key={property.id || property.slug}
                className="block outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-[16px]"
              >
                <StayCard 
                  property={property} 
                  priorityImage={index < 4} 
                  isSaved={wishlist.includes(property.slug)}
                  onSaveToggle={handleSaveToggle}
                />
              </Link>
            ))}
          </div>
          
          <div className="mt-16 text-center pb-8">
            <p className="text-muted-foreground font-medium">You've reached the end of the list</p>
          </div>
        </>
      )}

      {!isLoading && !isError && filteredProperties && filteredProperties.length === 0 && (
        <div className="py-24 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold font-display mb-2">No rooms match these filters</h3>
          <p className="text-muted-foreground max-w-sm mx-auto mb-8">
            Try widening your search area or removing some filters to see more results.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveFilters([]);
              setMinBudget(0);
              setMaxBudget(30000);
            }}
            className="px-6 py-3 bg-card border border-border text-foreground rounded-xl font-semibold hover:bg-muted transition-colors shadow-sm"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Ultra-Premium Advanced Filters Modal */}
      <AnimatePresence>
        {isFilterModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterModalOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            />
            
            {/* Modal Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed bottom-0 left-0 right-0 z-[101] bg-background rounded-t-[32px] shadow-2xl flex flex-col md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-xl md:rounded-[32px] md:h-auto max-h-[90vh] overflow-hidden border border-border/50"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-10">
                <button 
                  onClick={() => setIsFilterModalOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
                <h2 className="font-display font-bold text-xl">Advanced Filters</h2>
                <div className="w-10" /> {/* Spacer for centering */}
              </div>

              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto hide-scrollbar flex flex-col gap-8 pb-32 md:pb-6">
                
                {/* Sharing Type (Segmented Control style) */}
                <div>
                  <h3 className="font-display font-bold text-lg mb-4">Sharing Type</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {["Single", "2-Sharing", "3-Sharing"].map((type) => {
                      const filterId = type.toLowerCase();
                      const isActive = activeFilters.includes(filterId);
                      return (
                        <button 
                          key={type}
                          onClick={() => toggleFilter(filterId)}
                          className={`py-3 px-4 rounded-xl border font-semibold text-sm transition-all ${
                            isActive 
                              ? "border-primary bg-primary/5 ring-1 ring-primary/20 text-primary" 
                              : "border-border/60 hover:border-primary/50 text-foreground"
                          }`}
                        >
                          {type}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-display font-bold text-lg mb-2">Price range</h3>
                  <p className="text-muted-foreground text-sm mb-6">Monthly rent, before security deposit</p>
                  <PriceRangeFilter 
                    min={minBudget} 
                    max={maxBudget} 
                    absoluteMin={0} 
                    absoluteMax={30000} 
                    onChange={(min, max) => {
                      setMinBudget(min);
                      setMaxBudget(max);
                    }} 
                  />
                </div>

                {/* Amenities Grid */}
                <div>
                  <h3 className="font-display font-bold text-lg mb-4">Amenities</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "AC", icon: Snowflake },
                      { label: "Food Included", icon: UtensilsCrossed },
                      { label: "Verified", icon: BadgeCheck },
                    ].map((amenity) => {
                      const Icon = amenity.icon;
                      const isActive = activeFilters.includes(amenity.label.split(" ")[0].toLowerCase());
                      return (
                        <button 
                          key={amenity.label}
                          onClick={() => toggleFilter(amenity.label.split(" ")[0].toLowerCase())}
                          className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                            isActive 
                              ? "border-primary bg-primary/5 ring-1 ring-primary/20 text-primary" 
                              : "border-border/60 hover:border-primary/30 text-foreground"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="font-semibold">{amenity.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Sticky Footer */}
              <div className="p-6 border-t border-border/50 bg-background/80 backdrop-blur-md absolute md:relative bottom-0 left-0 right-0 flex items-center justify-between">
                <button 
                  onClick={() => {
                    setActiveFilters([]);
                    setMinBudget(0);
                    setMaxBudget(30000);
                  }}
                  className="font-semibold text-foreground underline decoration-muted-foreground/50 underline-offset-4 hover:decoration-foreground transition-colors"
                >
                  Clear all
                </button>
                <button 
                  onClick={() => setIsFilterModalOpen(false)}
                  className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-full hover:scale-105 active:scale-95 transition-all shadow-md flex items-center gap-2"
                >
                  <span>Show {filteredProperties?.length || 0} stays</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
