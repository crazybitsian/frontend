"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Building2, Users, Settings, LogOut, Plus, 
  MapPin, IndianRupee, ShieldCheck, Home
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Property {
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

export default function OwnerDashboard() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("properties");

  useEffect(() => {
    const ownerData = localStorage.getItem("apnakamra_owner");
    if (!ownerData) {
      router.push("/owner/login");
      return;
    }

    const { mobile, password } = JSON.parse(ownerData);

    const fetchProperties = async () => {
      try {
        const res = await fetch(`https://apna-kamra.up.railway.app/api/owner/properties?mobile=${encodeURIComponent(mobile)}&password=${encodeURIComponent(password)}`);
        
        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("apnakamra_owner");
            router.push("/owner/login");
            return;
          }
          throw new Error("Failed to load properties");
        }

        const data = await res.json();
        setProperties(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("apnakamra_owner");
    router.push("/owner/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-border flex flex-col sticky top-0 md:h-screen z-20">
        <div className="p-6 border-b border-border">
          <Link href="/" className="font-display font-bold text-2xl tracking-tight text-primary">
            ApnaKamra
          </Link>
          <span className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mt-1">
            Owner Portal
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <button 
            onClick={() => setActiveTab("properties")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
              activeTab === "properties" 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <Building2 className="w-4 h-4" />
            My Properties
          </button>
          <button 
            onClick={() => setActiveTab("leads")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
              activeTab === "leads" 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <Users className="w-4 h-4" />
            Student Leads
          </button>
          <button 
            onClick={() => setActiveTab("settings")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
              activeTab === "settings" 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </nav>

        <div className="p-4 border-t border-border">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        {activeTab === "properties" && (
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold font-display text-foreground mb-2">My Properties</h1>
                <p className="text-muted-foreground">Manage your listed hostels and PGs.</p>
              </div>
              <button 
                onClick={() => alert("Contact support")}
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Add New Property
              </button>
            </div>

            {error ? (
              <div className="bg-destructive/10 text-destructive p-6 rounded-2xl border border-destructive/20">
                <p className="font-medium">Error loading properties</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            ) : properties.length === 0 ? (
              <div className="bg-white border border-border rounded-3xl p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <Home className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-xl font-bold font-display text-foreground mb-2">No properties yet</h3>
                <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                  You haven't listed any properties. Add your first property to start receiving leads from students.
                </p>
                <button 
                  onClick={() => alert("Contact support")}
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Property
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <div key={property.id} className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col">
                    <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                      {property.photos && property.photos.length > 0 ? (
                        <Image
                          src={property.photos[0]}
                          alt={property.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Home className="w-8 h-8 text-muted-foreground/30" />
                        </div>
                      )}
                      {property.verified && (
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-sm">
                          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Verified</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-display font-bold text-lg text-foreground line-clamp-1 mb-1">
                        {property.name}
                      </h3>
                      <div className="flex items-center text-muted-foreground text-sm mb-4">
                        <MapPin className="w-3.5 h-3.5 mr-1 shrink-0" />
                        <span className="line-clamp-1">{property.location}</span>
                      </div>
                      
                      <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5">Monthly Rent</p>
                          <p className="font-bold text-foreground flex items-center">
                            <IndianRupee className="w-4 h-4 mr-0.5" />
                            {property.price ? property.price.toLocaleString("en-IN") : "0"}
                          </p>
                        </div>
                        <button 
                          onClick={() => alert("Edit functionality coming soon!")}
                          className="px-4 py-2 bg-muted text-foreground text-sm font-medium rounded-lg hover:bg-border transition-colors"
                        >
                          Edit Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Dummy tabs for UI completeness */}
        {activeTab === "leads" && (
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold font-display text-foreground mb-2">Student Leads</h1>
            <p className="text-muted-foreground mb-8">Students who have contacted you about your properties.</p>
            <div className="bg-white border border-border rounded-3xl p-12 text-center shadow-sm">
              <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold font-display text-foreground mb-2">No leads yet</h3>
              <p className="text-muted-foreground">When students inquire about your properties, they will appear here.</p>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold font-display text-foreground mb-2">Account Settings</h1>
            <p className="text-muted-foreground mb-8">Manage your owner profile and preferences.</p>
            <div className="bg-white border border-border rounded-3xl p-8 shadow-sm">
              <p className="text-muted-foreground text-center">Settings panel coming soon.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
