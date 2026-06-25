"use client";

import React, { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { Property, City } from "@/lib/api/types";
import { StayCard } from "@/components/StayCard";
import { useRouter } from "next/navigation";
import { Search, BadgeCheck, Snowflake, UtensilsCrossed, MapPin, SlidersHorizontal, ArrowLeft, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PriceRangeFilter } from "@/components/PriceRangeFilter";
import Fuse from "fuse.js";

interface CityListingClientProps {
  citySlug: string;
  cityName: string;
  cities?: City[];
  initialProperties?: Property[];
}



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

export function CityListingClient({ citySlug, cityName, cities = [], initialProperties }: CityListingClientProps) {
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
    const amenitiesArr: string[] = [];
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
      {/* Premium Sticky Navigation Bar (Stitch Design) */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border/40 mb-8 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4 md:gap-8">
          
          {/* Left: Brand / Mobile Back Button */}
          <div className="shrink-0 flex items-center">
            <Link href="/" className="md:hidden flex items-center justify-center h-10 w-10 rounded-full hover:bg-black/5 transition-colors mr-2">
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </Link>
            <Link href="/" className="hidden md:block font-display font-bold text-primary tracking-tighter text-2xl">
              ApnaKamra
            </Link>
          </div>

          {/* Center: Search Pill */}
          <div className="flex-1 max-w-2xl hidden sm:flex justify-center">
            <div className="w-full flex items-center bg-white border border-border/80 rounded-full px-2 py-1.5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_4px_6px_-2px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-md">
              {/* City Selector */}
              <Select value={citySlug} onValueChange={(val) => router.push(`/${val}`)}>
                <SelectTrigger className="border-0 bg-transparent shadow-none hover:bg-muted focus:ring-0 rounded-full h-auto py-1 px-4 text-sm font-medium transition-colors cursor-pointer w-auto shrink-0">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-[20px] w-[20px] text-primary" />
                    <span className="font-medium text-sm">{formatCityName(cityName)}</span>
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-[24px] shadow-[0_24px_80px_-12px_rgba(0,0,0,0.15)] border-border/40 p-4 min-w-[320px] sm:min-w-[420px] bg-white/95 backdrop-blur-3xl" alignItemWithTrigger={false} align="start" sideOffset={16}>
                  <div className="px-3 pb-3 mb-3 border-b border-border/60 flex items-center justify-between">
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
                          className="p-2 cursor-pointer rounded-2xl hover:bg-black/5 focus:bg-black/5 transition-colors duration-200"
                        >
                          <div className="flex items-center gap-3.5 pr-2 w-full">
                            <div className={`h-11 w-11 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm border border-black/5 shrink-0 overflow-hidden relative isolate`}>
                              {city.image ? (
                                <img src={city.image} alt={city.name} className="h-full w-full object-cover" />
                              ) : (
                                <span className="font-bold text-foreground/50 text-lg uppercase">{city.name.charAt(0)}</span>
                              )}
                            </div>
                            <div className="flex flex-col items-start overflow-hidden">
                              <span className="font-semibold text-[14px] text-foreground truncate w-full">{formatCityName(city.name)}</span>
                            </div>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {/* Divider */}
              <div className="w-[1px] h-6 bg-border mx-1 shrink-0"></div>

              {/* Input Area */}
              <div className="flex-1 px-4">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by area..."
                  className="w-full h-auto p-0 bg-transparent border-none focus-visible:ring-0 text-sm placeholder:text-muted-foreground shadow-none"
                />
              </div>

              {/* Search Button */}
              <div className="bg-primary hover:bg-[#125633] text-white w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95 shrink-0 shadow-sm cursor-pointer">
                <Search className="h-[20px] w-[20px]" />
              </div>
            </div>
          </div>

          {/* Right: Filter & Sort Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              suppressHydrationWarning
              onClick={() => setIsFilterModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 border border-border/80 rounded-full text-sm font-medium hover:bg-muted transition-colors bg-white cursor-pointer"
            >
              <SlidersHorizontal className="h-[18px] w-[18px]" />
              <span className="hidden sm:inline">Filters</span>
              {(activeFilters.length > 0 || minBudget > 0 || maxBudget < 30000) && (
                <span className="bg-primary w-2 h-2 rounded-full hidden sm:inline" />
              )}
            </button>
            
            <Select value={sort} onValueChange={(val) => setSort(val || "newest")}>
              <SelectTrigger className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 border border-border/80 rounded-full text-sm font-medium hover:bg-muted transition-colors bg-white cursor-pointer w-auto shadow-none focus:ring-0">
                <div className="flex items-center gap-1.5">
                  <span className="hidden lg:inline text-muted-foreground">Sort:</span>
                  <span className="truncate">{SORT_OPTIONS.find(o => o.value === sort)?.label || "Newest first"}</span>
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-[20px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border-border/50 p-2" alignItemWithTrigger={false} align="end" sideOffset={12}>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="cursor-pointer rounded-xl font-medium py-3 px-4 hover:bg-muted/50 transition-colors">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Mobile Search Pill (Below Header on Mobile) */}
        <div className="sm:hidden px-4 pb-4">
          <div className="w-full flex items-center bg-white border border-border/80 rounded-full px-2 py-1.5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_4px_6px_-2px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-md">
            <Select value={citySlug} onValueChange={(val) => router.push(`/${val}`)}>
              <SelectTrigger className="border-0 bg-transparent shadow-none hover:bg-muted focus:ring-0 rounded-full h-auto py-1 px-3 text-sm font-medium transition-colors cursor-pointer w-auto shrink-0">
                <MapPin className="h-4 w-4 text-primary" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl shadow-xl border-border p-2 min-w-[200px]">
                <SelectGroup className="flex flex-col gap-1 p-1">
                  {cities.map((city) => (
                    <SelectItem key={city.slug} value={city.slug} className="cursor-pointer rounded-xl font-medium px-4 py-3">
                      {formatCityName(city.name)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="w-[1px] h-6 bg-border mx-1 shrink-0"></div>
            <div className="flex-1 px-2">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by area..."
                className="w-full h-auto p-0 bg-transparent border-none focus-visible:ring-0 text-sm placeholder:text-muted-foreground shadow-none"
              />
            </div>
            <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm cursor-pointer">
              <Search className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
      {/* Main Content Area */}
      <div className="container mx-auto px-4 max-w-6xl py-4">
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
            <p className="text-foreground font-semibold mb-2 text-lg">Couldn&apos;t load rooms</p>
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
                  key={property._id || property.slug}
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
              <p className="text-muted-foreground font-medium">You&apos;ve reached the end of the list</p>
            </div>
          </>
        )}

        {/* Empty State */}
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
      </div>

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
