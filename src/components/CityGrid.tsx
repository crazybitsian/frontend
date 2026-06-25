import React from "react";
import Link from "next/link";
import Image from "next/image";
import { City } from "@/lib/api/types";
import { ArrowRight } from "lucide-react";

const CITY_IMAGES: Record<string, string> = {
  delhi: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1200&auto=format&fit=crop",
  bangalore: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=800&auto=format&fit=crop",
  mumbai: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=800&auto=format&fit=crop",
  kota: "https://images.unsplash.com/photo-1622308644420-b00eb0ae0f70?q=80&w=800&auto=format&fit=crop", // High quality Kota image
  jaipur: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=800&auto=format&fit=crop",
  hyderabad: "https://images.unsplash.com/photo-1580227181515-fb19356f103b?q=80&w=800&auto=format&fit=crop",
  "delhi-ncr": "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1200&auto=format&fit=crop", // Added Delhi NCR
};

const DEFAULT_CITY_IMAGE =
  "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=800&auto=format&fit=crop";

export function CityGrid({ cities }: { cities: City[] }) {
  if (!cities || cities.length === 0) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        No cities available at the moment.
      </div>
    );
  }

  // Display up to 8 cities in the layout
  const displayCities = cities.slice(0, 8);

  return (
    <div className="w-full flex-1 h-full min-h-0">
      <div className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-3 gap-3 md:gap-4 lg:gap-6 w-full h-full">
        {displayCities.map((city, index) => {
          const imageUrl =
            city.image ||
            CITY_IMAGES[city.slug?.toLowerCase()] ||
            DEFAULT_CITY_IMAGE;

          // Asymmetrical Mastery Layout Logic (4x3 Grid)
          let gridClass = "";
          const len = displayCities.length;
          switch (index) {
            case 0:
              gridClass = "col-span-2 row-span-1 md:col-span-2 md:row-span-2"; // Large featured
              break;
            case 1:
              gridClass = "col-span-1 row-span-1 md:col-span-1 md:row-span-2"; // Tall vertical
              break;
            case 2:
              gridClass = "col-span-1 row-span-1 md:col-span-1 md:row-span-1"; // Small top right
              break;
            case 3:
              gridClass = "col-span-1 row-span-1 md:col-span-1 md:row-span-1"; // Small middle right
              break;
            case 4:
              gridClass = len === 5
                ? "col-span-2 row-span-1 md:col-span-4 md:row-span-1" // Panoramic if 5
                : len === 6
                  ? "col-span-1 row-span-1 md:col-span-2 md:row-span-1" // Wide if 6
                  : len === 7
                    ? "col-span-1 row-span-1 md:col-span-2 md:row-span-1" // Wide if 7
                    : "col-span-1 row-span-1 md:col-span-1 md:row-span-1"; // Small if 8
              break;
            case 5:
              gridClass = len === 6
                ? "col-span-1 row-span-1 md:col-span-2 md:row-span-1" // Wide if 6
                : len === 7
                  ? "col-span-1 row-span-1 md:col-span-1 md:row-span-1" // Small if 7
                  : "col-span-1 row-span-1 md:col-span-1 md:row-span-1"; // Small if 8
              break;
            case 6:
              gridClass = "col-span-1 row-span-1 md:col-span-1 md:row-span-1"; // Small if 7 or 8
              break;
            case 7:
              gridClass = "col-span-1 row-span-1 md:col-span-1 md:row-span-1"; // Small if 8
              break;
            default:
              gridClass = "hidden"; // Hide any extras
          }

          return (
            <Link
              href={`/${city.slug}`}
              key={city.id || city.slug}
              className={`group relative overflow-hidden rounded-[24px] bg-card outline-none focus-visible:ring-4 focus-visible:ring-primary ${gridClass}`}
            >
              <Image
                src={imageUrl}
                alt={`Hostels and PGs in ${city.name}`}
                fill
                sizes={
                  index === 0 ? "(max-width: 768px) 100vw, 50vw" :
                    index === 3 ? "(max-width: 768px) 100vw, 50vw" :
                      "(max-width: 768px) 100vw, 25vw"
                }
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Elegant gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="flex items-end justify-between w-full translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div>
                    <h3 className={`font-display font-bold text-white tracking-tight ${index === 0 ? 'text-4xl lg:text-5xl mb-2' :
                      'text-2xl lg:text-3xl'
                      }`}>
                      {city.name}
                    </h3>
                    <p className={`text-white/80 font-medium ${index === 0 ? 'text-lg' : 'text-sm'}`}>
                      Explore properties
                    </p>
                  </div>

                  <div className="flex items-center justify-center h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/20 backdrop-blur-md text-white opacity-0 transition-all duration-500 group-hover:opacity-100">
                    <ArrowRight className="h-5 w-5 md:h-6 md:w-6" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
