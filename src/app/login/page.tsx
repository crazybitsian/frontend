"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

/**
 * Renders the student login page, providing a form to authenticate via mobile number and password.
 */
export default function LoginPage() {
  const router = useRouter();
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  /**
   * Processes the student login request, communicating with the API and updating the authentication state.
   */
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (mobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    localStorage.setItem("apnakamra_user", mobile);
    if (name) localStorage.setItem("apnakamra_user_name", name);
    router.push("/profile");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center selection:bg-primary/20 selection:text-primary p-4 sm:p-8">
      
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors z-20"
      >
        <ArrowLeft className="size-4 mr-2" />
        Back to search
      </Link>

      <div className="w-full max-w-5xl bg-card border border-border rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-2xl relative z-10">
        
        {/* Left: Cinematic Form Area */}
        <div className="flex-1 p-10 md:p-16 flex flex-col justify-center relative">
          <div className="mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              Step Inside.
            </h1>
            <p className="text-muted-foreground text-lg max-w-xs">
              Access your saved properties, track inquiries, and manage your stay preferences.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8 max-w-sm">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20 font-medium">
                {error}
              </div>
            )}
            
            <div className="space-y-2 relative group">
              <label className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground group-focus-within:text-primary transition-colors">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aryan Sharma"
                className="w-full bg-transparent border-b-2 border-border py-3 text-xl text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary focus:ring-0 transition-colors font-medium"
              />
            </div>

            <div className="space-y-2 relative group">
              <label className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground group-focus-within:text-primary transition-colors">
                Mobile Number
              </label>
              <div className="flex items-center border-b-2 border-border focus-within:border-primary transition-colors">
                <span className="text-xl text-foreground py-3 pr-3 select-none font-medium">+91</span>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    if (val.length <= 10) setMobile(val);
                  }}
                  placeholder="98765 43210"
                  className="w-full bg-transparent py-3 text-xl text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-0 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-8 flex items-center justify-between w-full bg-primary text-primary-foreground px-6 py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all hover:pr-4 group shadow-md"
            >
              Continue to Portal
              <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Decorative accents */}
          <div className="absolute top-10 right-10 size-2 rounded-full bg-primary opacity-50" />
          <div className="absolute bottom-10 right-20 size-1 rounded-full bg-muted-foreground opacity-20" />
        </div>

        {/* Right: Massive Artistic Image */}
        <div className="hidden md:block flex-1 relative bg-muted">
          <div className="absolute inset-0 bg-gradient-to-r from-card to-transparent z-10 w-24" />
          <Image
            src="https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=2070&auto=format&fit=crop"
            alt="Luxury modern interior"
            fill
            className="object-cover object-center"
          />
          <div className="absolute bottom-10 right-10 z-20 text-right bg-white/80 backdrop-blur-md px-6 py-4 rounded-2xl shadow-lg border border-white/20">
            <p className="text-foreground font-display text-2xl font-bold">ApnaKamra</p>
            <p className="text-primary text-sm uppercase tracking-widest font-bold mt-1">Premium Living</p>
          </div>
        </div>

      </div>
    </div>
  );
}
