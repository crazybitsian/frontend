import React from "react";
import {
  Snowflake, Wifi, UtensilsCrossed, ShowerHead, BookOpen, Zap,
  ShieldCheck, WashingMachine, Dumbbell, Car, Home, Tv,
} from "lucide-react";

const AMENITY_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  ac: Snowflake,
  "air conditioning": Snowflake,
  "air conditioned": Snowflake,
  wifi: Wifi,
  "wi-fi": Wifi,
  internet: Wifi,
  food: UtensilsCrossed,
  meals: UtensilsCrossed,
  mess: UtensilsCrossed,
  "meals included": UtensilsCrossed,
  laundry: WashingMachine,
  "washing machine": WashingMachine,
  "hot water": ShowerHead,
  geyser: ShowerHead,
  "study room": BookOpen,
  "study area": BookOpen,
  "power backup": Zap,
  generator: Zap,
  security: ShieldCheck,
  cctv: ShieldCheck,
  gym: Dumbbell,
  parking: Car,
  "attached bathroom": Home,
  tv: Tv,
  television: Tv,
};

function getAmenityIcon(amenity: string): React.ComponentType<{ className?: string }> {
  const lower = amenity.toLowerCase().trim();
  for (const [key, icon] of Object.entries(AMENITY_ICON_MAP)) {
    if (lower.includes(key)) return icon;
  }
  return Home;
}

/**
 * Displays a categorized list of amenities available at a property,
 * rendering the appropriate icons and text labels for each amenity.
 */
export function AmenityList({ amenities }: { amenities: string[] }) {
  if (!amenities || amenities.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">No amenities listed.</p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {amenities.map((amenity, i) => {
        const Icon = getAmenityIcon(amenity);
        return (
          <div key={i} className="flex items-center gap-4 py-1">
            <div className="flex items-center justify-center size-10 rounded-xl bg-accent shrink-0">
              <Icon className="size-5 text-primary stroke-[1.5]" />
            </div>
            <span className="text-[15px] text-foreground font-medium">{amenity}</span>
          </div>
        );
      })}
    </div>
  );
}
