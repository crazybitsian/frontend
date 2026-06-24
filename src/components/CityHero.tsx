"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { City } from "@/lib/api/types";
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

export function CityHero({ cities }: CityHeroProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const match = cities.find((c) =>
      c.name.toLowerCase().includes(query.toLowerCase())
    );
    if (match) {
      router.push(`/${match.slug}`);
    } else {
      document
        .getElementById("cities-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-screen flex flex-col overflow-hidden bg-foreground selection:bg-primary/30">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
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
      <div className="absolute top-0 left-0 right-0 z-20">
        <div className="container mx-auto px-4 max-w-6xl flex items-center justify-between h-16">
          <Link
            href="/"
            className="font-display text-xl font-bold tracking-tight text-white"
          >
            ApnaKamra
          </Link>
          <button
            className="md:hidden flex items-center justify-center h-10 w-10 rounded-lg text-white/80 hover:text-white transition-colors"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <nav className="hidden md:flex items-center gap-6">
            <UserProfile variant="transparent" />
            <Link
              href="/owner"
              className="text-sm font-semibold text-white border border-white px-6 py-2.5 rounded-full hover:bg-white hover:text-foreground transition-all duration-200"
            >
              List your property
            </Link>
          </nav>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center container mx-auto px-4 max-w-5xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-4xl sm:text-5xl lg:text-[4.5rem] font-bold tracking-tighter text-white leading-[1.08] mb-8"
        >
          Find your place.
          <br />
          Find your people.
        </motion.h1>

        {/* Frosted Search Bar */}
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.15,
            ease: [0.16, 1, 0.3, 1],
          }}
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-2 w-full max-w-4xl bg-white/[0.1] backdrop-blur-xl border border-white/[0.15] p-2.5 rounded-2xl"
        >
          <div className="relative flex-1 flex items-center">
            <Search className="absolute left-5 h-5 w-5 text-white/50" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by city or property"
              className="border-none bg-transparent h-14 sm:h-16 text-lg focus-visible:ring-0 shadow-none text-white placeholder:text-white/50 pl-13 pr-4 font-medium"
            />
          </div>
          <Button
            type="submit"
            size="lg"
            className="h-14 sm:h-16 px-10 rounded-xl font-semibold text-base shrink-0 bg-white text-foreground hover:bg-gray-100 transition-all duration-200"
          >
            Search
          </Button>
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
