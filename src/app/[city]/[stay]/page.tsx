import { api } from "@/lib/api/client";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, MapPin, Users, PhoneCall, ShieldCheck, Star, Share2, Heart, BedDouble,
  Snowflake, UtensilsCrossed, Wifi, Zap, Droplets, BookOpen, ShieldAlert, CigaretteOff, Clock, UserCheck, IdCard,
} from "lucide-react";
import { AmenityList } from "@/components/AmenityList";
import { Footer } from "@/components/Footer";
import { notFound } from "next/navigation";
import { StayGallery } from "@/components/StayGallery";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const properties = await api.getProperties();
    return properties.map((property) => ({
      city: property.city_slug || 'other',
      stay: property.slug,
    }));
  } catch (e) {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ city: string; stay: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const property = await api.getProperty(resolvedParams.stay);
    return {
      title: `${property.name} in ${property.locality || resolvedParams.city} — ApnaKamra`,
      description: property.description || `Premium verified stay in ${property.locality}. Zero brokerage.`,
    };
  } catch (e) {
    return { title: "Stay Detail — ApnaKamra" };
  }
}

export default async function StayDetailPage({ params }: { params: Promise<{ city: string; stay: string }> }) {
  const resolvedParams = await params;

  let property;
  try {
    property = await api.getProperty(resolvedParams.stay);
  } catch (e) {
    notFound();
  }

  if (!property) {
    notFound();
  }

  const formatPrice = (price?: number) => {
    if (!price) return "Price on request";
    return "₹" + Number(price).toLocaleString("en-IN");
  };

  const getSharingOptions = () => {
    const options = [];
    if (property.price_single) options.push({ label: "Single", price: property.price_single });
    if (property.price_double) options.push({ label: "2 Sharing", price: property.price_double });
    if (property.price_triple) options.push({ label: "3 Sharing", price: property.price_triple });
    return options;
  };

  const sharingOptions = getSharingOptions();
  const displayLocality = [property.locality, property.city_name].filter(x => x && x !== "Other").join(", ");
  const heroImage = property.images?.[0] || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1200&auto=format&fit=crop";

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Main Content Area */}
      <main className="flex-1 relative pb-24">
        <div className="container mx-auto max-w-3xl pt-4 sm:pt-6 px-4">
          
          {/* Header Controls */}
          <header className="mb-4 flex items-center justify-between">
            <Link
              href={`/${resolvedParams.city}`}
              className="flex items-center justify-center h-10 w-10 rounded-full bg-card border border-border text-foreground hover:bg-muted transition-colors shadow-sm"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex gap-2">
              <button className="flex items-center justify-center h-10 w-10 rounded-full bg-card border border-border text-foreground hover:bg-muted transition-colors shadow-sm" aria-label="Share">
                <Share2 className="h-4.5 w-4.5" />
              </button>
              <button className="flex items-center justify-center h-10 w-10 rounded-full bg-card border border-border text-foreground hover:bg-muted transition-colors shadow-sm" aria-label="Save">
                <Heart className="h-4.5 w-4.5" />
              </button>
            </div>
          </header>

          {/* Premium Inset Photo Gallery */}
          <section className="mb-8">
            <StayGallery images={property.images || []} title={property.name} />
          </section>

          {/* Property Info */}
          <div className="flex flex-col gap-8">
            
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Verified Badge */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {!!property.is_trusted && (
                  <span className="inline-flex items-center gap-1.5 bg-accent text-accent-foreground px-3 py-1.5 rounded-lg text-xs font-semibold">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified Stay
                  </span>
                )}
                {!!property.is_featured && (
                  <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-600 px-3 py-1.5 rounded-lg text-xs font-semibold">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    Featured
                  </span>
                )}
              </div>

              {/* Name */}
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-2">
                {property.name}
              </h1>

              {/* Location */}
              <div className="flex items-center gap-1.5 text-muted-foreground text-[15px] mb-8">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>{displayLocality}</span>
              </div>

              {/* Premium Bento Price Card (Stitch Design) */}
              <div className="bg-card border border-border rounded-xl shadow-sm hover:shadow-[0_10px_30px_-14px_rgba(24,24,27,0.12)] transition-shadow mb-12 p-6 w-full">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  {/* Left: Pricing */}
                  <div className="w-full md:w-auto text-left flex flex-col items-center md:items-start">
                    <span className="text-muted-foreground font-[family-name:var(--font-dm-sans)] text-xs uppercase tracking-wider mb-1">Starting from</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-display font-bold text-primary tracking-tight">
                        {formatPrice(property.lowest_price)}
                      </span>
                      {property.lowest_price ? (
                        <span className="text-muted-foreground font-medium">/month</span>
                      ) : null}
                    </div>
                  </div>
                  
                  {/* Middle: Quick Info (Bento Sections) */}
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 w-full md:w-auto border-y md:border-y-0 md:border-x border-border/50 py-4 md:py-0 md:px-8">
                    {sharingOptions.length > 0 && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-accent/30 rounded-lg border border-primary/10">
                        <BedDouble className="w-5 h-5 text-primary" />
                        <span className="text-sm font-[family-name:var(--font-dm-sans)] font-medium text-primary">{sharingOptions[0].label} Available</span>
                      </div>
                    )}
                    {!!property.is_trusted && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg border border-border">
                        <ShieldCheck className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm font-[family-name:var(--font-dm-sans)] font-medium text-foreground">Verified Property</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Right: Action Button */}
                  <div className="w-full md:w-auto shrink-0">
                    <button className="w-full bg-primary text-primary-foreground px-8 py-4 rounded-lg font-bold flex items-center justify-center gap-3 hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20">
                      <PhoneCall className="w-5 h-5" />
                      Contact owner
                    </button>
                  </div>
                </div>
              </div>

              {/* Content Grid */}
              <div className="space-y-10">
            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <section>
                <h2 className="font-display text-xl font-bold mb-5 tracking-tight">What this place offers</h2>
                <AmenityList amenities={property.amenities} />
              </section>
            )}

            {/* Room Options */}
            {sharingOptions.length > 0 && (
              <section>
                <h2 className="font-display text-xl font-bold mb-5 tracking-tight">Room options</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {sharingOptions.map((opt, i) => {
                    const isCheapest = opt.price === property.lowest_price;
                    return (
                      <div
                        key={i}
                        className={`flex flex-col p-4 rounded-xl border transition-colors ${
                          isCheapest
                            ? "border-primary bg-accent/30"
                            : "border-border bg-card"
                        }`}
                      >
                        <span className="text-[15px] font-semibold mb-1">{opt.label}</span>
                        <span className="text-lg font-bold text-primary tabular-nums">
                          {formatPrice(opt.price)}
                          <span className="text-sm text-muted-foreground font-normal">/mo</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Description */}
            {property.description && (
              <section>
                <h2 className="font-display text-xl font-bold mb-4 tracking-tight">About this property</h2>
                <p className="text-foreground/80 leading-relaxed text-[15px]">
                  {property.description}
                </p>
              </section>
            )}

            {/* House Rules */}
            <section>
              <h2 className="font-display text-xl font-bold mb-5 tracking-tight">House rules</h2>
              <div className="space-y-3">
                {[
                  { icon: CigaretteOff, text: "No smoking" },
                  { icon: Clock, text: "Gate closes at 10:30 PM" },
                  { icon: UserCheck, text: "Visitors allowed till 8 PM" },
                  { icon: IdCard, text: "ID proof required at check-in" },
                ].map((rule, i) => (
                  <div key={i} className="flex items-center gap-3 text-[15px] text-foreground/80">
                    <rule.icon className="h-5 w-5 text-muted-foreground shrink-0 stroke-[1.5]" />
                    <span>{rule.text}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Location */}
            <section>
              <h2 className="font-display text-xl font-bold mb-5 tracking-tight">Location</h2>
              {property.map_link ? (
                <a
                  href={property.map_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full aspect-[16/9] rounded-xl border border-border bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors overflow-hidden"
                >
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <MapPin className="h-8 w-8" />
                    <span className="text-sm font-medium text-primary">View on Google Maps</span>
                  </div>
                </a>
              ) : (
                <div className="w-full aspect-[16/9] rounded-xl border border-border bg-muted flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <MapPin className="h-8 w-8" />
                    <span className="text-sm font-medium">Map not available</span>
                  </div>
                </div>
              )}
              <p className="text-sm text-muted-foreground mt-3">{displayLocality}</p>
            </section>
            </div>
          </div>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Bar */}
      <div className="sticky bottom-0 z-40 bg-background/95 backdrop-blur-lg border-t border-border py-3 px-4 lg:hidden">
        <div className="container mx-auto max-w-4xl flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-primary tabular-nums">
              {formatPrice(property.lowest_price)}
            </span>
            {property.lowest_price ? (
              <span className="text-sm text-muted-foreground">/mo</span>
            ) : null}
            {sharingOptions.length > 0 && (
              <p className="text-xs text-muted-foreground">{sharingOptions[0].label}</p>
            )}
          </div>
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-xl transition-colors flex items-center gap-2 text-sm">
            <PhoneCall className="h-4 w-4" />
            Contact owner
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
