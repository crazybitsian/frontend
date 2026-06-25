import { api } from "@/lib/api/client";
import { CityHero } from "@/components/CityHero";
import { CityGrid } from "@/components/CityGrid";
import { FeaturedStays } from "@/components/FeaturedStays";
import { Footer } from "@/components/Footer";
import { BadgeCheck, Banknote, Users } from "lucide-react";
import { City, Property } from "@/lib/api/types";
import Link from "next/link";

export const revalidate = 3600;

export default async function Home() {
  let cities: City[] = [];
  let featuredProperties: Property[] = [];

  try {
    let fetchedCities = await api.getCities();
    
    // Fix capitalizations and override specific images for maximum aesthetic quality
    fetchedCities = fetchedCities.map(city => {
      if (city.slug === "delhi-ncr") return { 
        ...city, 
        name: "Delhi NCR", 
        image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1200&auto=format&fit=crop" // Premium Skyline
      };
      if (city.slug === "hyderabad") return { 
        ...city, 
        name: "Hyderabad", 
        image: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Durgam_Cheruvu_Panorama_V2.jpg" // Authentic premium Hyderabad image
      };
      if (city.slug === "kota") return { ...city, name: "Kota" };
      return city;
    });

    // Swap Bangalore and Kota
    const bIndex = fetchedCities.findIndex(c => c.slug === "bangalore");
    const kIndex = fetchedCities.findIndex(c => c.slug === "kota");
    
    if (bIndex !== -1 && kIndex !== -1) {
      const temp = fetchedCities[bIndex];
      fetchedCities[bIndex] = fetchedCities[kIndex];
      fetchedCities[kIndex] = temp;
    }
    
    cities = fetchedCities;
  } catch (error) {
    console.error("Failed to fetch cities:", error);
  }

  try {
    const allProperties = await api.getProperties({});
    featuredProperties = allProperties
      .filter((p) => p.is_featured || p.is_trusted)
      .slice(0, 6);
    if (featuredProperties.length === 0) {
      featuredProperties = allProperties.slice(0, 6);
    }
  } catch (error) {
    console.error("Failed to fetch properties:", error);
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section — full viewport with immersive photo */}
      <CityHero cities={cities} />

      {/* Explore Cities Section - 100vh Mastery */}
      <section id="cities-section" className="h-screen w-full bg-background overflow-hidden relative flex flex-col justify-center items-center py-12 md:py-24">
        <div className="w-full max-w-5xl px-4 flex flex-col h-full justify-center">
          {/* Single Horizontal Line Heading */}
          <div className="w-full text-center mb-6 md:mb-10">
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/50 leading-none whitespace-nowrap overflow-hidden text-ellipsis drop-shadow-sm pb-2">
              Where will you move next?
            </h2>
          </div>
          <CityGrid cities={cities} />
        </div>
      </section>

      {/* Featured Stays Section */}
      {featuredProperties.length > 0 && (
        <section className="py-20 sm:py-24 bg-card">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="mb-10">
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tighter text-foreground">
                Featured stays
              </h2>
              <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
                Hand-picked properties with the best reviews.
              </p>
            </div>
            <FeaturedStays properties={featuredProperties} />
          </div>
        </section>
      )}

      {/* Why ApnaKamra — Trust Section */}
      <section className="py-20 sm:py-32 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[600px] bg-primary/[0.03] rounded-full blur-[120px] pointer-events-none" />

        <div className="container relative z-10 mx-auto px-4 max-w-6xl">
          <div className="mb-14 md:mb-20 max-w-2xl">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter text-foreground mb-4">
              Designed for the{" "}
              <br className="hidden sm:block" />
              modern student.
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              We replaced the chaos of finding a room with a curated, verified, and completely transparent platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="group flex flex-col p-7 sm:p-8 rounded-2xl bg-card border border-border/40 hover:border-primary/20 shadow-[0_2px_12px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-500">
              <div className="mb-6 p-3.5 bg-accent w-fit rounded-xl group-hover:scale-110 transition-transform duration-500">
                <BadgeCheck className="h-7 w-7 text-primary stroke-[1.5]" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-display tracking-tight">100% Verified</h3>
              <p className="text-muted-foreground leading-relaxed text-[15px]">
                Every stay is physically verified by our team. The photos you see are exactly what you get.
              </p>
            </div>

            <div className="group flex flex-col p-7 sm:p-8 rounded-2xl bg-card border border-border/40 hover:border-primary/20 shadow-[0_2px_12px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-500">
              <div className="mb-6 p-3.5 bg-accent w-fit rounded-xl group-hover:scale-110 transition-transform duration-500">
                <Banknote className="h-7 w-7 text-primary stroke-[1.5]" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-display tracking-tight">Zero Brokerage</h3>
              <p className="text-muted-foreground leading-relaxed text-[15px]">
                Connect directly with property owners. Keep your deposit money for yourself, not middlemen.
              </p>
            </div>

            <div className="group flex flex-col p-7 sm:p-8 rounded-2xl bg-card border border-border/40 hover:border-primary/20 shadow-[0_2px_12px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-500">
              <div className="mb-6 p-3.5 bg-accent w-fit rounded-xl group-hover:scale-110 transition-transform duration-500">
                <Users className="h-7 w-7 text-primary stroke-[1.5]" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-display tracking-tight">Student Community</h3>
              <p className="text-muted-foreground leading-relaxed text-[15px]">
                Live with like-minded peers. Find roommates from your college and build lifelong friendships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 sm:py-20 bg-primary">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary-foreground tracking-tight mb-3">
            List your property
          </h2>
          <p className="text-primary-foreground/70 text-base sm:text-lg mb-8 max-w-lg mx-auto">
            Reach thousands of students looking for a room in your city.
          </p>
          <Link href="/owner/login" className="inline-flex items-center justify-center bg-white text-foreground px-8 py-3 rounded-lg font-medium hover:bg-muted transition-colors shadow-sm">
            List your property
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
