"use client";

import React, { useState } from "react";
import { StayCard } from "@/components/StayCard";
import { Property } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { Moon, Sun } from "lucide-react";

// Mock stays matching Indian student context
const MOCK_PROPERTIES: Property[] = [
  {
    id: 101,
    name: "Stanza Living Dublin House",
    slug: "stanza-living-dublin-house",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=60&w=480&auto=format&fit=crop",
    ],
    lowest_price: 8500,
    price_single: 12000,
    price_double: 8500,
    price_triple: 6500,
    locality: "Gota (Near Nirma University)",
    city_name: "Ahmedabad",
    city_slug: "ahmedabad",
    amenities: ["WiFi", "AC", "Power Backup", "Food/Meals", "Laundry", "Attached Bathroom"],
    is_trusted: true,
    is_featured: true,
    views: 1420,
    description: "Premium student accommodation for boys near Nirma University. Fully managed meals, laundry, housekeeping, and ultra-high-speed WiFi included.",
    map_link: "https://maps.google.com",
    owner_mobile: "9876543210",
  },
  {
    id: 102,
    name: "Zolo Stays Premium PG",
    slug: "zolo-stays-premium-pg",
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=60&w=480&auto=format&fit=crop",
    ],
    lowest_price: 6800,
    price_double: 6800,
    price_triple: 5000,
    locality: "Viman Nagar (Near Symbiosis)",
    city_name: "Pune",
    city_slug: "pune",
    amenities: ["WiFi", "AC", "Laundry", "Daily Cleaning", "Attached Bathroom"],
    is_trusted: true,
    views: 890,
    description: "Co-living PG for students and working professionals. Conveniently situated in Viman Nagar near top colleges and IT parks. Zero brokerage fees.",
    map_link: "https://maps.google.com",
    owner_mobile: "9123456789",
  },
  {
    id: 103,
    name: "Shree Hostel & PG Accommodations",
    slug: "shree-hostel-pg",
    images: [
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=60&w=480&auto=format&fit=crop",
    ],
    lowest_price: 5200,
    price_triple: 5200,
    locality: "Thaltej Metro Station Area",
    city_name: "Ahmedabad",
    city_slug: "ahmedabad",
    amenities: ["WiFi", "Food/Meals", "Housekeeping"],
    is_unverified: true,
    views: 310,
    description: "Budget-friendly student rooms near Thaltej Metro Station. Includes 3 vegetarian meals daily and basic daily cleaning. Contact for single options.",
    map_link: "https://maps.google.com",
    owner_mobile: "9988776655",
  },
];

export default function StylePage() {
  const [savedStays, setSavedStays] = useState<Record<string, boolean>>({
    "stanza-living-dublin-house": true,
  });
  
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  const toggleSave = (slug: string) => {
    setSavedStays((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  const toggleTheme = (mode: "light" | "dark") => {
    setThemeMode(mode);
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 py-10 px-4 md:px-12 max-w-7xl mx-auto space-y-16">
      
      {/* Header and Theme Switcher */}
      <header className="flex flex-col md:flex-row md:items-center justify-between border-b border-border pb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full border border-primary/20">
              ApnaKamra Design System
            </span>
            <span className="bg-muted text-muted-foreground text-xs font-medium px-2 py-0.5 rounded-md">
              v1.0
            </span>
          </div>
          <h1 className="font-heading text-4xl font-bold tracking-tight">
            Style Guide & Kitchen Sink
          </h1>
          <p className="text-muted-foreground mt-1.5 max-w-xl text-sm leading-relaxed">
            A comprehensive overview of our visual identity tokens, typography system, custom styling overrides, and shadcn components. Light mode by default.
          </p>
        </div>

        {/* Theme Controls */}
        <div className="flex items-center gap-1.5 bg-muted p-1 rounded-lg self-start md:self-center border border-border/80">
          <Button
            variant={themeMode === "light" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => toggleTheme("light")}
            className="gap-1.5 h-8 font-medium rounded-md px-3 text-xs"
          >
            <Sun className="size-3.5" />
            Light
          </Button>
          <Button
            variant={themeMode === "dark" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => toggleTheme("dark")}
            className="gap-1.5 h-8 font-medium rounded-md px-3 text-xs"
          >
            <Moon className="size-3.5" />
            Dark
          </Button>
        </div>
      </header>

      {/* Grid: Color Tokens & Typography */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Color Palette */}
        <div>
          <h2 className="font-heading text-2xl font-semibold tracking-tight mb-6">
            1. Color Tokens
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2 rounded-xl p-3 border border-border bg-card">
              <div className="h-12 w-full rounded-md border border-border bg-background" />
              <div>
                <p className="text-xs font-semibold">Background</p>
                <p className="text-[10px] text-muted-foreground">--background</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 rounded-xl p-3 border border-border bg-card">
              <div className="h-12 w-full rounded-md border border-border bg-foreground" />
              <div>
                <p className="text-xs font-semibold">Foreground</p>
                <p className="text-[10px] text-muted-foreground">--foreground</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 rounded-xl p-3 border border-border bg-card">
              <div className="h-12 w-full rounded-md border border-border bg-primary" />
              <div>
                <p className="text-xs font-semibold text-primary">Primary (Forest)</p>
                <p className="text-[10px] text-muted-foreground">--primary</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 rounded-xl p-3 border border-border bg-card">
              <div className="h-12 w-full rounded-md border border-border bg-accent" />
              <div>
                <p className="text-xs font-semibold text-accent-foreground">Accent (Wash)</p>
                <p className="text-[10px] text-muted-foreground">--accent</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 rounded-xl p-3 border border-border bg-card">
              <div className="h-12 w-full rounded-md border border-border bg-muted" />
              <div>
                <p className="text-xs font-semibold">Muted</p>
                <p className="text-[10px] text-muted-foreground">--muted</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 rounded-xl p-3 border border-border bg-card">
              <div className="h-12 w-full rounded-md border border-border bg-border" />
              <div>
                <p className="text-xs font-semibold">Border</p>
                <p className="text-[10px] text-muted-foreground">--border</p>
              </div>
            </div>
          </div>
        </div>

        {/* Typography Scale */}
        <div className="space-y-6">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            2. Typography
          </h2>
          <div className="space-y-4 border border-border rounded-xl p-6 bg-card">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Display H1 (Bricolage Grotesque)</p>
              <h1 className="font-heading text-3xl font-bold tracking-tight">
                Premium Stays for Students
              </h1>
            </div>
            <div className="border-t border-border/60 pt-3">
              <p className="text-xs text-muted-foreground mb-1">Display H2 (Bricolage Grotesque)</p>
              <h2 className="font-heading text-2xl font-semibold tracking-tight">
                Explore Destinations
              </h2>
            </div>
            <div className="border-t border-border/60 pt-3">
              <p className="text-xs text-muted-foreground mb-1">Display H3 (Bricolage Grotesque)</p>
              <h3 className="font-heading text-lg font-semibold tracking-tight text-primary">
                Verified Hostels
              </h3>
            </div>
            <div className="border-t border-border/60 pt-3">
              <p className="text-xs text-muted-foreground mb-1">Body Text (Inter)</p>
              <p className="text-sm text-foreground leading-relaxed">
                Experience premium, verified student and professional accommodations across India&apos;s top cities. Zero brokerage.
              </p>
            </div>
            <div className="border-t border-border/60 pt-3">
              <p className="text-xs text-muted-foreground mb-1">Caption & Price</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Near college (0.4 km)</span>
                <span className="text-lg font-bold tabular-nums text-foreground">₹8,500 /mo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spacing & Radii System */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Border Radii */}
        <div>
          <h2 className="font-heading text-2xl font-semibold tracking-tight mb-6">
            3. Border Radii
          </h2>
          <div className="space-y-4 border border-border rounded-xl p-6 bg-card">
            <div className="flex items-center gap-4">
              <div className="h-10 w-24 bg-primary rounded-sm flex items-center justify-center text-xs font-semibold text-primary-foreground">
                8px (sm)
              </div>
              <p className="text-xs text-muted-foreground">Buttons, Inputs, Small Chips</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-10 w-24 bg-primary rounded-md flex items-center justify-center text-xs font-semibold text-primary-foreground">
                10px (md)
              </div>
              <p className="text-xs text-muted-foreground">Modals, Selection Selects, Small Cards</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-10 w-24 bg-primary rounded-lg flex items-center justify-center text-xs font-semibold text-primary-foreground">
                14px (lg)
              </div>
              <p className="text-xs text-muted-foreground">Stays Accommodation Cards, Images</p>
            </div>
          </div>
        </div>

        {/* Spacing Metrics */}
        <div>
          <h2 className="font-heading text-2xl font-semibold tracking-tight mb-6">
            4. Layout Spacing (8px System)
          </h2>
          <div className="border border-border rounded-xl p-6 bg-card space-y-3">
            <div className="flex items-center gap-4">
              <span className="w-12 text-xs font-semibold text-muted-foreground">4px</span>
              <div className="h-4 bg-primary/20 border border-primary/30 rounded w-1" />
            </div>
            <div className="flex items-center gap-4">
              <span className="w-12 text-xs font-semibold text-muted-foreground">8px</span>
              <div className="h-4 bg-primary/20 border border-primary/30 rounded w-2" />
            </div>
            <div className="flex items-center gap-4">
              <span className="w-12 text-xs font-semibold text-muted-foreground">16px</span>
              <div className="h-4 bg-primary/20 border border-primary/30 rounded w-4" />
            </div>
            <div className="flex items-center gap-4">
              <span className="w-12 text-xs font-semibold text-muted-foreground">24px</span>
              <div className="h-4 bg-primary/20 border border-primary/30 rounded w-6" />
            </div>
            <div className="flex items-center gap-4">
              <span className="w-12 text-xs font-semibold text-muted-foreground">32px</span>
              <div className="h-4 bg-primary/20 border border-primary/30 rounded w-8" />
            </div>
          </div>
        </div>
      </section>

      {/* Primitives Section */}
      <section className="space-y-6">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">
          5. Interactive Primitives
        </h2>
        
        <Card className="border-border">
          <CardHeader className="border-b border-border/50">
            <CardTitle>Standard Components States</CardTitle>
            <CardDescription>Visual state testing dashboard for ApnaKamra form and navigation controls.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            {/* Buttons Row */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Buttons</h4>
              <div className="flex flex-wrap gap-3">
                <Button>Primary Button</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="destructive">Destructive</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>

            {/* Inputs & Select Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Default Input</h4>
                <Input placeholder="Enter your mobile..." />
              </div>
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Disabled Input</h4>
                <Input disabled placeholder="Cannot edit this..." />
              </div>
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Dropdown Selection</h4>
                <Select defaultValue="pune">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ahmedabad">Ahmedabad</SelectItem>
                    <SelectItem value="pune">Pune</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tabs & Tooltips Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              {/* Tabs */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tabs Switcher</h4>
                <Tabs defaultValue="city" className="w-full">
                  <TabsList className="grid grid-cols-3 w-full max-w-[400px]">
                    <TabsTrigger value="city">By City</TabsTrigger>
                    <TabsTrigger value="property">By PG Name</TabsTrigger>
                    <TabsTrigger value="near">Near Me</TabsTrigger>
                  </TabsList>
                  <TabsContent value="city" className="mt-3 text-xs text-muted-foreground">
                    Search properties based on city name (Ahmedabad, Pune, Delhi, etc.)
                  </TabsContent>
                  <TabsContent value="property" className="mt-3 text-xs text-muted-foreground">
                    Direct search by PG brand or listing name.
                  </TabsContent>
                  <TabsContent value="near" className="mt-3 text-xs text-muted-foreground">
                    Find stays near your GPS location.
                  </TabsContent>
                </Tabs>
              </div>

              {/* Dialog, Tooltip, and Skeleton */}
              <div className="space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Overlay Primitives</h4>
                
                <div className="flex flex-wrap items-center gap-3">
                  {/* Dialog Trigger */}
                  <Dialog>
                    <DialogTrigger render={<Button variant="outline">Open Modal Dialog</Button>} />
                    <DialogContent className="max-w-[400px]">
                      <DialogHeader>
                        <DialogTitle className="font-heading">Submit Contact Lead</DialogTitle>
                        <DialogDescription>
                          Submit your contact details and the property owner will contact you shortly.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-3 py-4">
                        <Input placeholder="Your mobile number" />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline">Cancel</Button>
                        <Button>Submit Lead</Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Tooltip */}
                  <Tooltip>
                    <TooltipTrigger render={<Button variant="outline">Hover Tooltip</Button>} />
                    <TooltipContent className="bg-card text-card-foreground border border-border">
                      <p className="text-xs font-medium">Verified by ApnaKamra Staff</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                {/* Skeletons */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Loading Skeleton</h4>
                  <div className="flex gap-3 items-center">
                    <Skeleton className="size-10 rounded-full" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-3 w-[70%]" />
                      <Skeleton className="h-3 w-[45%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* StayCard Examples Section */}
      <section className="space-y-6">
        <div>
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            6. Signature Stay Cards (4:3 aspect ratio)
          </h2>
          <p className="text-muted-foreground text-sm mt-1 max-w-xl">
            Live preview of the stay card with Indian student fit/trust signals. Includes save status state tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_PROPERTIES.map((property) => (
            <StayCard
              key={property.id}
              property={property}
              isSaved={Boolean(savedStays[property.slug])}
              onSaveToggle={toggleSave}
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border pt-6 text-center text-xs text-muted-foreground">
        <p>Apna Kamra Design System • Light by default with warm-neutral dark mode</p>
      </footer>
    </div>
  );
}
