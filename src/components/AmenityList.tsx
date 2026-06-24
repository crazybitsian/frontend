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

export function AmenityList({ amenities }: { amenities: string[] }) {
  if (!amenities || amenities.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">No amenities listed.</p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
      {amenities.map((amenity, i) => {
        const Icon = getAmenityIcon(amenity);
        return (
          <div key={i} className="flex items-center gap-3">
            <Icon className="h-5 w-5 text-primary shrink-0 stroke-[1.5]" />
            <span className="text-[15px] text-foreground">{amenity}</span>
          </div>
        );
      })}
    </div>
  );
}
