"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Menu, MapPin, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { City, Property } from "@/lib/api/types";
import { api } from "@/lib/api/client";
import { motion } from "framer-motion";
import Link from "next/link";
import { UserProfile } from "@/components/UserProfile";

interface CityHeroProps {
  cities: City[];
}

const CITY_PILLS = [
  { label: "Delhi", slug: "delhi" },
  { label: "Bangalore", slug: "bangalore" },
  { label: "Mumbai", slug: "mumbai" },
  { label: "Kota", slug: "kota" },
  { label: "Jaipur", slug: "jaipur" },
  { label: "Hyderabad", slug: "hyderabad" },
];

function getEditDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = Array(a.length + 1).fill(null).map(() => Array(b.length + 1).fill(null));
  for (let i = 0; i <= a.length; i += 1) { matrix[i][0] = i; }
  for (let j = 0; j <= b.length; j += 1) { matrix[0][j] = j; }
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i][j - 1] + 1,
        matrix[i - 1][j] + 1,
        matrix[i - 1][j - 1] + indicator
      );
    }
  }
  return matrix[a.length][b.length];
}

type SearchResult = {
  type: "city" | "property";
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  url: string;
  score: number;
};

export function CityHero({ cities }: CityHeroProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  // Fuzzy Search State
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLFormElement>(null);

  // Load properties silently in the background
  useEffect(() => {
    let mounted = true;
    api.getProperties().then((data) => {
      if (mounted) setAllProperties(data);
      return data;
    }).catch((err) => {
      console.warn("Could not pre-fetch properties for search", err);
    });
    return () => { mounted = false; };
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search logic
  useEffect(() => {
    const handler = setTimeout(() => {
      if (!query.trim() || query.length < 2) {
        setResults([]);
        return;
      }

      const q = query.toLowerCase().trim();
      const maxDistance = 3;
      const scoredResults: SearchResult[] = [];

      // 1. Score Cities
      cities.forEach((city) => {
        const name = city.name.toLowerCase();
        if (name.includes(q)) {
          scoredResults.push({
            type: "city",
            id: `city-${city.slug}`,
            title: city.name,
            slug: city.slug,
            url: `/${city.slug}`,
            score: name === q ? 0 : 1
          });
        } else {
          const dist = getEditDistance(q, name);
          if (dist <= maxDistance) {
            scoredResults.push({
              type: "city",
              id: `city-${city.slug}`,
              title: city.name,
              slug: city.slug,
              url: `/${city.slug}`,
              score: dist + 2
            });
          }
        }
      });

      // 2. Score Properties
      allProperties.forEach((prop) => {
        const name = prop.name.toLowerCase();
        if (name.includes(q)) {
          scoredResults.push({
            type: "property",
            id: `prop-${prop.slug}`,
            title: prop.name,
            subtitle: prop.locality ? `${prop.locality}, ${prop.city_name}` : prop.city_name,
            slug: prop.slug,
            url: `/${prop.city_slug || 'other'}/${prop.slug}`,
            score: name === q ? 0 : 1
          });
        } else {
          const words = name.split(" ");
          let minWordDist = 99;
          for (const word of words) {
            if (word.length >= 3) {
              const d = getEditDistance(q, word);
              if (d < minWordDist) minWordDist = d;
            }
          }
          const dist = getEditDistance(q, name);
          const finalDist = Math.min(dist, minWordDist);

          if (finalDist <= maxDistance) {
            scoredResults.push({
              type: "property",
              id: `prop-${prop.slug}`,
              title: prop.name,
              subtitle: prop.locality ? `${prop.locality}, ${prop.city_name}` : prop.city_name,
              slug: prop.slug,
              url: `/${prop.city_slug || 'other'}/${prop.slug}`,
              score: finalDist + 2
            });
          }
        }
      });

      // 3. Sort, Deduplicate, Limit to Top 3
      scoredResults.sort((a, b) => a.score - b.score);
      const unique = [];
      const seen = new Set();
      for (const item of scoredResults) {
        if (!seen.has(item.id)) {
          seen.add(item.id);
          unique.push(item);
          if (unique.length === 3) break;
        }
      }

      setResults(unique);
    }, 250); // 250ms debounce

    return () => clearTimeout(handler);
  }, [query, cities, allProperties]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (results.length > 0) {
      // Go to the best match
      router.push(results[0].url);
      setShowDropdown(false);
    } else {
      // Fallback
      document.getElementById("cities-section")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-screen min-h-[600px] flex flex-col bg-foreground selection:bg-primary/30 z-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2000&auto=format&fit=crop"
          alt="Modern hostel common area"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Top Navbar Overlay */}
      <div className="absolute top-0 inset-x-0 z-20">
        <div className="container mx-auto px-4 max-w-6xl flex items-center justify-between h-16">
          <Link
            href="/"
            className="font-display text-xl font-bold tracking-tight text-white"
          >
            ApnaKamra
          </Link>
          <button
            className="md:hidden flex items-center justify-center size-10 rounded-lg text-white/80 hover:text-white transition-colors"
            aria-label="Menu"
          >
            <Menu className="size-5" />
          </button>
          <nav className="hidden md:flex items-center gap-6">
            <UserProfile variant="transparent" />
            <Link
              href="/owner/login"
              className="text-sm font-semibold text-white border border-white px-6 py-2.5 rounded-full hover:bg-white hover:text-foreground transition-all duration-200"
            >
              List your property
            </Link>
          </nav>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-start pt-[20vh] md:justify-center md:pt-0 container mx-auto px-4 max-w-5xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-4xl sm:text-5xl lg:text-[4.5rem] font-bold tracking-tighter text-white leading-[1.08] mb-8"
        >
          Find your place.
          <br />
          Find your peace.
        </motion.h1>

        {/* Frosted Search Bar */}
        <motion.form
          ref={dropdownRef}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.15,
            ease: [0.16, 1, 0.3, 1],
          }}
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-2 w-full max-w-4xl bg-white/[0.1] backdrop-blur-xl border border-white/[0.15] p-2.5 rounded-2xl relative z-50"
        >
          <div className="relative flex-1 flex items-center">
            <Search className="absolute left-5 size-5 text-white/50 z-10" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search for a city or property..."
              className="border-none bg-transparent h-14 sm:h-16 text-lg focus-visible:ring-0 shadow-none text-white placeholder:text-white/50 pl-13 pr-4 font-medium relative z-10"
              autoComplete="off"
            />

          </div>
          <Button
            type="submit"
            size="lg"
            className="h-14 sm:h-16 px-10 rounded-xl font-semibold text-base shrink-0 bg-white text-foreground hover:bg-gray-100 transition-all duration-200"
          >
            Search
          </Button>

          {/* Real-time Autocomplete Dropdown */}
          {showDropdown && query.trim().length >= 2 && (
            <div className="absolute top-[calc(100%+8px)] inset-x-0 bg-white rounded-2xl overflow-hidden border border-black/5 shadow-2xl z-50 text-left origin-top animate-in fade-in zoom-in-95 duration-200">
              {results.length > 0 ? (
                <ul className="flex flex-col">
                  {results.map((result) => (
                    <li key={result.id} className="border-b border-border/40 last:border-0">
                      <Link 
                        href={result.url}
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition-colors w-full group"
                      >
                        <div className="flex items-center justify-center size-10 rounded-full bg-primary/5 text-primary shrink-0 group-hover:scale-105 transition-transform">
                          {result.type === 'city' ? <MapPin className="size-[18px] stroke-[2]" /> : <Building className="size-[18px] stroke-[2]" />}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-foreground font-semibold text-[15px] tracking-tight truncate group-hover:text-primary transition-colors">{result.title}</span>
                          {result.subtitle ? (
                            <span className="text-muted-foreground text-[13px] truncate mt-0.5">{result.subtitle}</span>
                          ) : (
                            <span className="text-primary/70 font-medium text-[11px] tracking-wider uppercase mt-0.5 truncate">City</span>
                          )}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-10 text-center flex flex-col items-center justify-center gap-3">
                  <div className="size-14 rounded-full bg-primary/5 flex items-center justify-center mb-2 shadow-inner border border-primary/10">
                    <Search className="size-6 text-primary/40" />
                  </div>
                  <p className="text-foreground font-display text-lg font-bold tracking-tight">No matches found</p>
                  <p className="text-muted-foreground text-[14.5px]">We couldn&apos;t find any cities or properties matching &quot;{query}&quot;</p>
                </div>
              )}
            </div>
          )}
        </motion.form>

        {/* City Quick-Access Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="grid grid-cols-3 gap-2 md:flex md:flex-wrap justify-center mt-8 w-full max-w-4xl px-4 md:px-0 py-2"
        >
          {CITY_PILLS.map((city) => (
            <Link
              key={city.slug}
              href={`/${city.slug}`}
              className="flex justify-center items-center whitespace-nowrap text-[13px] sm:text-base font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/20 px-2 sm:px-5 py-2.5 rounded-full transition-all duration-200 backdrop-blur-sm hover:scale-105"
            >
              {city.label}
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
