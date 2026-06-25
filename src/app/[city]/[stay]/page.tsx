import { api } from "@/lib/api/client";
import { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft, MapPin, ShieldCheck, Star, BedDouble, CigaretteOff, Clock, UserCheck, IdCard,
} from "lucide-react";
import { AmenityList } from "@/components/AmenityList";
import { Footer } from "@/components/Footer";
import { notFound } from "next/navigation";
import { StayGallery } from "@/components/StayGallery";
import { StayControls } from "@/components/StayControls";
import { ContactOwnerButton } from "@/components/ContactOwnerButton";
import { RecentlyViewedTracker } from "@/components/RecentlyViewedTracker";
import { ReviewsSection } from "@/components/ReviewsSection";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const properties = await api.getProperties();
    return properties.map((property) => ({
      city: property.city_slug || 'other',
      stay: property.slug,
    }));
  } catch {
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
  } catch {
    return { title: "Stay Detail — ApnaKamra" };
  }
}

export default async function StayDetailPage({ params }: { params: Promise<{ city: string; stay: string }> }) {
  const resolvedParams = await params;

  let property;
  try {
    property = await api.getProperty(resolvedParams.stay);
  } catch {
    notFound();
  }

  if (!property) {
    notFound();
  }

  const formatPrice = (price?: number) => {
    if (!price) return "Price on request";
    return "\u20B9" + Number(price).toLocaleString("en-IN");
  };

  const getSharingOptions = () => {
    const options = [];
    if (property.price_single) options.push({ label: "Single", price: property.price_single });
    if (property.price_double) options.push({ label: "Double", price: property.price_double });
    if (property.price_triple) options.push({ label: "Triple", price: property.price_triple });
    return options;
  };

  const sharingOptions = getSharingOptions();
  const displayLocality = [property.locality, property.city_name].filter(x => x && x !== "Other").join(", ");

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-1 relative pb-24 lg:pb-12">
        
        {/* Wide Container for Gallery + Content */}
        <div className="container mx-auto max-w-6xl pt-4 sm:pt-6 px-4">
          
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
              <StayControls propertySlug={property.slug} propertyName={property.name} />
            </div>
          </header>

          <RecentlyViewedTracker propertySlug={property.slug} />

          {/* Premium Full-Width Photo Gallery */}
          <section className="mb-10">
            <StayGallery images={property.images || []} title={property.name} />
          </section>

          {/* Two-Column Layout: Content + Sticky Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-x-16 gap-y-8">
            
            {/* ═══ LEFT COLUMN — Property Details ═══ */}
            <div className="min-w-0">
              
              {/* Property Header */}
              <div className="pb-8 border-b border-border">
                {/* Badges */}
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

                {/* Title */}
                <h1 className="font-display text-3xl lg:text-4xl font-bold tracking-tight mb-3">
                  {property.name}
                </h1>

                {/* Location */}
                <div className="flex items-center gap-2 text-muted-foreground text-[15px]">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span>{displayLocality}</span>
                </div>
              </div>

              {/* Mobile-only inline pricing card */}
              <div className="lg:hidden py-6 border-b border-border">
                <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
                  <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold block mb-1">Starting from</span>
                  <div className="flex items-baseline gap-1.5 mb-4">
                    <span className="text-3xl font-display font-bold text-foreground tracking-tight">
                      {formatPrice(property.lowest_price)}
                    </span>
                    {property.lowest_price ? (
                      <span className="text-muted-foreground font-medium">/month</span>
                    ) : null}
                  </div>
                  {sharingOptions.length > 0 && (() => {
                    const allSamePrice = sharingOptions.every(o => o.price === sharingOptions[0].price);
                    return (
                    <div className="flex flex-wrap gap-2 mb-5">
                      {sharingOptions.map((opt, i) => {
                        const isCheapest = !allSamePrice && opt.price === property.lowest_price;
                        return (
                          <div
                            key={i}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm ${
                              isCheapest
                                ? "border-primary/30 bg-accent/40 text-primary font-bold"
                                : "border-border bg-muted/30 text-foreground font-medium"
                            }`}
                          >
                            <BedDouble className="h-4 w-4" />
                            <span>{opt.label}: {formatPrice(opt.price)}</span>
                          </div>
                        );
                      })}
                    </div>
                    );
                  })()}
                  <ContactOwnerButton property={property} />
                </div>
              </div>

              {/* Description */}
              {property.description && (
                <section className="py-8 border-b border-border">
                  <h2 className="font-display text-2xl font-bold mb-4 tracking-tight">About this property</h2>
                  <p className="text-foreground/80 leading-relaxed text-[15px] max-w-2xl break-words whitespace-pre-wrap">
                    {property.description}
                  </p>
                </section>
              )}



              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <section className="py-8 border-b border-border">
                  <h2 className="font-display text-2xl font-bold mb-6 tracking-tight">What this place offers</h2>
                  <AmenityList amenities={property.amenities} />
                </section>
              )}

              {/* Reviews */}
              <section className="py-8 border-b border-border">
                <h2 className="font-display text-2xl font-bold mb-6 tracking-tight">Guest reviews</h2>
                <ReviewsSection />
              </section>

              {/* House Rules */}
              <section className="py-8 border-b border-border">
                <h2 className="font-display text-2xl font-bold mb-6 tracking-tight">House rules</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: CigaretteOff, text: "No smoking" },
                    { icon: Clock, text: "Gate closes at 10:30 PM" },
                    { icon: UserCheck, text: "Visitors allowed till 8 PM" },
                    { icon: IdCard, text: "ID proof required at check-in" },
                  ].map((rule, i) => (
                    <div key={i} className="flex items-center gap-4 py-1">
                      <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-muted shrink-0">
                        <rule.icon className="h-5 w-5 text-muted-foreground stroke-[1.5]" />
                      </div>
                      <span className="text-[15px] text-foreground/80 font-medium">{rule.text}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Location */}
              <section className="py-8">
                <h2 className="font-display text-2xl font-bold mb-6 tracking-tight">Location</h2>
                {property.map_link ? (
                  <a
                    href={property.map_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full aspect-[16/9] rounded-2xl border border-border bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors overflow-hidden group"
                  >
                    <div className="flex flex-col items-center gap-3 text-muted-foreground group-hover:text-primary transition-colors">
                      <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-accent">
                        <MapPin className="h-7 w-7 text-primary" />
                      </div>
                      <span className="text-sm font-semibold">View on Google Maps</span>
                    </div>
                  </a>
                ) : (
                  <div className="w-full aspect-[16/9] rounded-2xl border border-border bg-muted flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                      <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-muted">
                        <MapPin className="h-7 w-7" />
                      </div>
                      <span className="text-sm font-medium">Map not available</span>
                    </div>
                  </div>
                )}
                <p className="text-sm text-muted-foreground mt-4">{displayLocality}</p>
              </section>
            </div>

            {/* ═══ RIGHT COLUMN — Sticky Pricing Sidebar (Desktop only) ═══ */}
            <div className="hidden lg:block">
              <div className="sticky top-6">
                <div className="bg-card border border-border rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-7">
                  
                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold block mb-1">Starting from</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-4xl font-display font-bold text-foreground tracking-tight">
                        {formatPrice(property.lowest_price)}
                      </span>
                      {property.lowest_price ? (
                        <span className="text-muted-foreground font-medium text-base">/month</span>
                      ) : null}
                    </div>
                  </div>

                  {/* Sharing Options */}
                  {sharingOptions.length > 0 && (() => {
                    const allSamePrice = sharingOptions.every(o => o.price === sharingOptions[0].price);
                    return (
                    <div className="mb-6 pb-6 border-b border-border">
                      <div className="flex flex-col gap-3">
                        {sharingOptions.map((opt, i) => {
                          const isCheapest = !allSamePrice && opt.price === property.lowest_price;
                          return (
                            <div
                              key={i}
                              className={`flex items-center justify-between p-3.5 rounded-xl border transition-colors ${
                                isCheapest
                                  ? "border-primary/30 bg-accent/40"
                                  : "border-border bg-muted/30"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <BedDouble className={`h-5 w-5 ${isCheapest ? 'text-primary' : 'text-muted-foreground'}`} />
                                <span className="text-sm font-semibold">{opt.label} sharing</span>
                              </div>
                              <span className={`text-sm font-bold tabular-nums ${isCheapest ? 'text-primary' : 'text-foreground'}`}>
                                {formatPrice(opt.price)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    );
                  })()}

                  {/* Trust Signals */}
                  {!!property.is_trusted && (
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
                      <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-accent shrink-0">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-foreground block">Verified Property</span>
                        <span className="text-xs text-muted-foreground">Physically verified by our team</span>
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <ContactOwnerButton property={property} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Bar (Mobile/Tablet only) */}
      <div className="sticky bottom-0 z-40 bg-background/95 backdrop-blur-lg border-t border-border py-4 px-4 lg:hidden">
        <div className="container mx-auto max-w-6xl flex items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="text-xl font-bold text-foreground tabular-nums">
              {formatPrice(property.lowest_price)}
            </span>
            {property.lowest_price ? (
              <span className="text-sm text-muted-foreground ml-1">/mo</span>
            ) : null}
            {sharingOptions.length > 0 && (
              <p className="text-xs text-muted-foreground truncate">{sharingOptions[0].label} sharing · {displayLocality}</p>
            )}
          </div>
          <ContactOwnerButton property={property} variant="icon" />
        </div>
      </div>

      <Footer />
    </div>
  );
}
