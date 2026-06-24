"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, User, LogOut, Heart, ShieldCheck, 
  LayoutDashboard, MessageSquare, Settings, Calendar,
  Building2, MapPin, ChevronRight
} from "lucide-react";
import Link from "next/link";
import { StayCard } from "@/components/StayCard";
import { cn } from "@/lib/utils";

interface StayData {
  id: number;
  slug: string;
  name: string;
  location: string;
  price: number;
  sharing_type: string;
  gender_allowed: string;
  food_included: boolean;
  ac_available: boolean;
  verified: boolean;
  photos: string[];
}

type TabType = "overview" | "inquiries" | "wishlist" | "preferences";

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<{ name: string; mobile: string } | null>(null);
  const [wishlist, setWishlist] = useState<StayData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  useEffect(() => {
    // 1. Check Login
    const storedUser = localStorage.getItem("apnakamra_user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    setUserData(JSON.parse(storedUser));

    // 2. Fetch Wishlist Properties
    const loadWishlist = async () => {
      try {
        const storedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
        if (storedWishlist.length === 0) {
          setIsLoading(false);
          return;
        }

        const res = await fetch("https://apna-kamra.up.railway.app/api/properties");
        if (!res.ok) throw new Error("Failed to load properties");
        
        const data = await res.json();
        const likedProperties = data.filter((p: StayData) => storedWishlist.includes(p.id));
        setWishlist(likedProperties);
      } catch (error) {
        console.error("Error loading wishlist:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlist();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("apnakamra_user");
    router.push("/");
    router.refresh();
  };

  if (!userData) return null; // Wait for redirect

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "inquiries", label: "Inquiries", icon: MessageSquare },
    { id: "preferences", label: "Preferences", icon: Settings },
  ] as const;

  return (
    <div className="min-h-screen bg-[#F4F4F5] pb-24">
      {/* SaaS-Style Compact Header */}
      <div className="bg-white border-b border-border sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="py-4 flex items-center justify-between">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to home
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-6 pb-6 pt-2">
            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 shrink-0">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold font-display text-foreground">
                  {userData.name}
                </h1>
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  +91 {userData.mobile}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  Joined Sep 2023
                </span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar border-t border-border pt-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={cn(
                    "flex items-center gap-2 py-4 text-sm font-medium transition-colors relative whitespace-nowrap",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
        
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold font-display text-foreground">Dashboard Overview</h2>
            
            {/* Bento Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Saved Properties</p>
                  <p className="text-3xl font-bold font-display">{wishlist.length}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Active Inquiries</p>
                  <p className="text-3xl font-bold font-display">0</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between">
                <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Building2 className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Tours Scheduled</p>
                  <p className="text-3xl font-bold font-display">0</p>
                </div>
              </div>
            </div>

            {/* Recent Activity Mock */}
            <div className="bg-white rounded-2xl border border-border shadow-sm p-6 mt-8">
              <h3 className="text-lg font-semibold font-display mb-6">Recent Activity</h3>
              <div className="text-center py-12">
                <p className="text-muted-foreground">Your recent activity will appear here once you start contacting properties.</p>
                <button onClick={() => setActiveTab("wishlist")} className="mt-4 text-primary font-medium hover:underline">
                  View your wishlist
                </button>
              </div>
            </div>
          </div>
        )}

        {/* WISHLIST TAB */}
        {activeTab === "wishlist" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-display text-foreground">Your Saved Properties</h2>
              <span className="bg-white border border-border text-foreground px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                {wishlist.length} saved
              </span>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse bg-muted rounded-2xl h-[400px]" />
                ))}
              </div>
            ) : wishlist.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((stay) => (
                  <StayCard key={stay.id} stay={stay} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white rounded-2xl border border-border shadow-sm">
                <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2 font-display">No properties saved yet</h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Heart properties you like while browsing to save them here for later.
                </p>
                <Link 
                  href="/"
                  className="inline-flex items-center justify-center bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm"
                >
                  Explore Properties
                </Link>
              </div>
            )}
          </div>
        )}

        {/* INQUIRIES TAB */}
        {activeTab === "inquiries" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold font-display text-foreground">Recent Inquiries</h2>
            
            <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2 font-display">No inquiries sent yet</h3>
                <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                  When you contact a property owner or schedule a tour, it will show up here so you can keep track of your conversations.
                </p>
                <Link 
                  href="/"
                  className="inline-flex items-center justify-center bg-white border border-border text-foreground px-6 py-3 rounded-lg font-medium hover:bg-muted transition-colors shadow-sm"
                >
                  Find a property to contact
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* PREFERENCES TAB */}
        {activeTab === "preferences" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold font-display text-foreground">Search Preferences</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Budget Pref */}
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-border shadow-sm">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">₹</span>
                  Budget Range
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>₹5,000</span>
                    <span>₹30,000+</span>
                  </div>
                  <input type="range" className="w-full accent-primary" min="5000" max="30000" defaultValue="15000" />
                  <p className="text-center font-medium text-lg mt-4">Up to ₹15,000 / month</p>
                </div>
              </div>

              {/* City Pref */}
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-border shadow-sm">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  Preferred Cities
                </h3>
                <div className="flex flex-wrap gap-3">
                  {["Delhi & NCR", "Bangalore", "Mumbai", "Kota", "Jaipur", "Hyderabad"].map((city, i) => (
                    <button 
                      key={city}
                      className={cn(
                        "px-4 py-2 rounded-lg border text-sm font-medium transition-colors",
                        i === 0 || i === 1 
                          ? "bg-primary/5 border-primary text-primary" 
                          : "bg-white border-border text-muted-foreground hover:border-muted-foreground"
                      )}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

            </div>
            
            <div className="flex justify-end mt-6">
              <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm">
                Save Preferences
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
