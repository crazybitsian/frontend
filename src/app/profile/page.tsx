"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, LogOut, Heart, MapPin, 
  IndianRupee, ChevronRight, BadgeCheck
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api/client";
import { StayCard } from "@/components/StayCard";
import { Property } from "@/lib/api/types";

/**
 * Renders the user's profile dashboard, displaying their saved properties and account details.
 */
export default function ProfilePage() {
  const router = useRouter();
  const [userName, setUserName] = useState("Student");
  const [userMobile, setUserMobile] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const [wishlistSlugs, setWishlistSlugs] = useState<string[]>([]);
  const [wishlistProperties, setWishlistProperties] = useState<Property[]>([]);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<Property[]>([]);

  useEffect(() => {
    const mobile = localStorage.getItem("apnakamra_user");
    if (!mobile) {
      router.push("/login");
      return;
    }
    setUserMobile(mobile);
    const name = localStorage.getItem("apnakamra_user_name");
    if (name) setUserName(name);

    /**
     * Fetches the user's saved or favorite properties from the backend or local storage.
     */
    const loadWishlist = async () => {
      const storedItems = JSON.parse(localStorage.getItem("apnakamra_wishlist") || "[]");
      
      // Migrate old data: filter out any numeric IDs that were stored previously
      const validSlugs = storedItems.filter((item: unknown) => typeof item === 'string' && Number.isNaN(Number(item)));
      
      if (validSlugs.length !== storedItems.length) {
        localStorage.setItem("apnakamra_wishlist", JSON.stringify(validSlugs));
      }
      
      setWishlistSlugs(validSlugs);
      
      if (validSlugs.length > 0) {
        setIsWishlistLoading(true);
        try {
          const resolvedProperties = await Promise.all(
            validSlugs.map((slug: string) => 
              api.getProperty(slug).catch((e) => {
                console.warn(`Failed to fetch property ${slug}:`, e);
                return null;
              })
            )
          );
          setWishlistProperties(resolvedProperties.filter(Boolean) as Property[]);
        } catch(e) {
          console.error(e);
        }
        setIsWishlistLoading(false);
      } else {
        setWishlistProperties([]);
      }
    };
    loadWishlist();

    /**
     * Retrieves the list of recently viewed properties from local storage to display in the profile.
     */
    const loadRecentlyViewed = async () => {
      const storedRV = JSON.parse(localStorage.getItem("apnakamra_recently_viewed") || "[]");
      if (storedRV.length > 0) {
        try {
          const resolvedRVProps = await Promise.all(
            storedRV.map((slug: string) => 
              api.getProperty(slug).catch(() => null)
            )
          );
          setRecentlyViewed(resolvedRVProps.filter(Boolean) as Property[]);
        } catch (e) {
          console.error(e);
        }
      }
    };
    loadRecentlyViewed();

    const handleWishlistUpdate = () => {
      loadWishlist();
    };
    window.addEventListener("wishlistUpdated", handleWishlistUpdate);
    return () => window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
  }, [router]);

  const handleSaveToggle = (slug: string) => {
    let newWishlist = [...wishlistSlugs];
    if (newWishlist.includes(slug)) {
      newWishlist = newWishlist.filter(s => s !== slug);
    } else {
      newWishlist.push(slug);
    }
    setWishlistSlugs(newWishlist);
    localStorage.setItem("apnakamra_wishlist", JSON.stringify(newWishlist));
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const handleLogout = () => {
    localStorage.removeItem("apnakamra_user");
    localStorage.removeItem("apnakamra_user_name");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      
      {/* Compact Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto max-w-6xl px-4 md:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link 
              href="/"
              className="flex items-center justify-center size-10 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-all shadow-sm hover:shadow-md"
            >
              <ArrowLeft className="size-5" />
            </Link>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
                {userName}&apos;s Portal
              </h1>
              <p className="text-muted-foreground text-sm flex items-center gap-2">
                +91 {userMobile} 
                <span className="size-1 rounded-full bg-border" />
                <span className="text-primary flex items-center gap-1 font-medium">
                  <BadgeCheck className="size-3.5" /> Verified
                </span>
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut className="size-4" />
            Sign Out
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="container mx-auto max-w-6xl px-4 md:px-8 flex items-center gap-8 overflow-x-auto no-scrollbar border-t border-border/50 pt-2">
          {["Overview", "Wishlist"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={cn(
                "pb-4 text-sm font-semibold tracking-wide uppercase transition-all whitespace-nowrap border-b-2 relative",
                activeTab === tab.toLowerCase()
                  ? "text-primary border-primary"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto max-w-6xl px-4 md:px-8 py-10">
        
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left Column (Stats & Quick Actions) */}
            <div className="md:col-span-4 flex flex-col gap-6">
              {/* Profile Card */}
              <div className="bg-card border border-border rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent opacity-50" />
                <div className="size-16 rounded-full bg-background border border-border flex items-center justify-center mb-6 shadow-sm">
                  <span className="font-display text-2xl font-bold text-primary">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="font-display text-2xl font-bold mb-1">{userName}</h2>
                <p className="text-muted-foreground mb-6">Member since Jun 2026</p>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground text-sm font-medium">Saved Properties</span>
                    <span className="font-bold font-display text-xl text-foreground">{wishlistSlugs.length}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column (Recent Activity) */}
            <div className="md:col-span-8 flex flex-col gap-6">
              
              {/* Recently Viewed Grid */}
              {recentlyViewed.length > 0 && (
                <div className="bg-card border border-border rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display font-bold text-xl text-foreground">Recently Viewed</h3>
                    <button 
                      onClick={() => setActiveTab("wishlist")}
                      className="text-primary text-sm font-semibold hover:underline flex items-center"
                    >
                      View Wishlist <ChevronRight className="size-4 ml-1" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recentlyViewed.map((prop) => (
                      <Link href={`/${prop.city_slug || 'city'}/${prop.slug}`} key={prop.slug} className="flex gap-4 p-4 rounded-2xl bg-background border border-border hover:border-primary/50 transition-colors shadow-sm cursor-pointer group outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <div className="relative size-20 rounded-xl overflow-hidden shrink-0 bg-muted">
                          <Image
                            src={prop.images?.[0] || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2000&auto=format&fit=crop"}
                            alt="Room preview"
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex flex-col justify-center">
                          <h4 className="font-display font-bold text-foreground line-clamp-1 mb-1">
                            {prop.name}
                          </h4>
                          <p className="text-muted-foreground font-medium text-xs mb-2 flex items-center gap-1 line-clamp-1">
                            <MapPin className="size-3 text-primary/70 shrink-0" /> {prop.locality || "Location"}
                          </p>
                          <p className="font-bold text-primary text-sm flex items-center">
                            <IndianRupee className="size-3.5 mr-0.5" />
                            {prop.lowest_price ? `${Number(prop.lowest_price).toLocaleString("en-IN")} / mo` : 'TBD'}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Dummy Tabs to complete the illusion */}
        {activeTab === "wishlist" && (
          <div className="space-y-6">
            <h2 className="font-display text-3xl font-bold text-foreground mb-6">Your Wishlist</h2>
            {isWishlistLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1,2,3].map(i => (
                  <div key={i} className="animate-pulse bg-card border border-border rounded-[14px] h-[300px]" />
                ))}
              </div>
            ) : wishlistProperties.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {wishlistProperties.map((property) => (
                  <Link href={`/${property.city_slug || 'city'}/${property.slug}`} key={property.slug} className="block outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-[14px]">
                    <StayCard 
                      property={property} 
                      isSaved={wishlistSlugs.includes(property.slug)} 
                      onSaveToggle={handleSaveToggle} 
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-card border border-border rounded-3xl p-16 text-center shadow-sm">
                <Heart className="size-16 text-muted-foreground/30 mx-auto mb-6" />
                <p className="text-muted-foreground max-w-md mx-auto mb-8">
                  Properties you&apos;ve saved will appear here. Build your collection of premium stays.
                </p>
                <Link 
                  href="/"
                  className="inline-flex items-center justify-center bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-sm"
                >
                  Explore Properties
                </Link>
              </div>
            )}
          </div>
        )}


      </main>
      
      {/* Mobile Logout */}
      <div className="md:hidden px-4 pb-10">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-4 bg-card border border-border rounded-xl text-foreground font-bold hover:bg-muted transition-colors shadow-sm"
        >
          <LogOut className="size-5" />
          Sign Out
        </button>
      </div>

    </div>
  );
}
