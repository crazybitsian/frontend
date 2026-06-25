import { CityListingClient } from "./CityListingClient";
import { api } from "@/lib/api/client";
import { Footer } from "@/components/Footer";
import { Metadata } from "next";
import { Property, City } from "@/lib/api/types";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const cities = await api.getCities();
    return cities.map((city) => ({
      city: city.slug,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  let title = "Stays in City — ApnaKamra";
  try {
    const cities = await api.getCities();
    const city = cities.find(c => c.slug === resolvedParams.city);
    if (city) {
      title = `Hostels & PGs in ${city.name} — ApnaKamra`;
    }
  } catch {
    // Ignore error
  }
  return { title, description: `Find verified hostels, PGs, and shared rooms. Zero brokerage.` };
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const resolvedParams = await params;
  
  let cityInfo = null;
  let allCities: City[] = [];
  try {
    allCities = await api.getCities();
    cityInfo = allCities.find(c => c.slug === resolvedParams.city);
  } catch {
    // Ignore error
  }
  let initialProperties: Property[] = [];
  try {
    initialProperties = await api.getProperties({ city: resolvedParams.city });
  } catch {
    // Will be fetched client-side
  }

  const cityName = cityInfo?.name || resolvedParams.city.charAt(0).toUpperCase() + resolvedParams.city.slice(1);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground relative">
      {/* Main Content - No standard header, CityListingClient handles the floating island */}
      <main className="flex-1">
        <CityListingClient
          citySlug={resolvedParams.city}
          cityName={cityName}
          cities={allCities}
          initialProperties={initialProperties}
        />
      </main>

      <Footer />
    </div>
  );
}
