import { CityListingClient } from "./CityListingClient";
import { api } from "@/lib/api/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  let title = "Stays in City — ApnaKamra";
  try {
    const cities = await api.getCities();
    const city = cities.find(c => c.slug === resolvedParams.city);
    if (city) {
      title = `Hostels & PGs in ${city.name} — ApnaKamra`;
    }
  } catch (e) {
    // Ignore error
  }
  return { title, description: `Find verified hostels, PGs, and shared rooms. Zero brokerage.` };
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const resolvedParams = await params;
  
  let cityInfo = null;
  let initialProperties = [];
  try {
    const cities = await api.getCities();
    cityInfo = cities.find(c => c.slug === resolvedParams.city);
  } catch (e) {
    // Ignore error
  }

  try {
    initialProperties = await api.getProperties({ city: resolvedParams.city });
  } catch (e) {
    // Will be fetched client-side
  }

  const cityName = cityInfo?.name || resolvedParams.city.charAt(0).toUpperCase() + resolvedParams.city.slice(1);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/40">
        <div className="container mx-auto px-4 max-w-6xl flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center justify-center h-9 w-9 rounded-lg hover:bg-muted transition-colors"
              aria-label="Back to home"
            >
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </Link>
            <h1 className="font-display text-lg font-bold tracking-tight">{cityName}</h1>
          </div>
          <Link
            href="/"
            className="font-display text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            ApnaKamra
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 max-w-6xl py-6">
          <CityListingClient
            citySlug={resolvedParams.city}
            cityName={cityName}
            initialCount={initialProperties.length}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
