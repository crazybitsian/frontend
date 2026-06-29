"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

/**
 * Renders the login page specifically for property owners.
 */
export default function OwnerLoginPage() {
  const router = useRouter();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Processes the owner login request, managing authentication and redirecting to the owner dashboard.
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (mobile.trim().length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("https://apna-kamra.up.railway.app/api/owner/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, password }),
      });

      if (!res.ok) {
        throw new Error("Invalid mobile number or password.");
      }

      // Successful login
      localStorage.setItem("apnakamra_owner", JSON.stringify({ mobile, password }));
      router.push("/owner/dashboard");
      router.refresh();
      
    } catch (err) {
      if (err instanceof Error) setError(err.message || "Failed to login. Please try again.");
      else setError("Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden selection:bg-primary/20 selection:text-primary">
      {/* High-end architectural background */}
      <Image
        src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
        alt="Premium property interior"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center scale-105"
      />
      {/* Professional dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/60" />

      <Link 
        href="/" 
        className="absolute top-8 left-8 lg:top-12 lg:left-12 flex items-center text-sm font-medium text-white hover:text-white/80 transition-colors z-20 drop-shadow-md"
      >
        <ArrowLeft className="size-4 mr-2" />
        Back to home
      </Link>

      <div className="relative z-10 w-full max-w-md mx-4 bg-white rounded-3xl p-8 lg:p-12 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
        <div className="mb-8">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase rounded-full mb-4">
            Owner Portal
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3 font-display leading-tight">
            Partner with ApnaKamra.
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Manage your properties, track leads, and reach thousands of students searching for their next home.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20 font-medium">
              {error}
            </div>
          )}

          <div className="space-y-2 relative group">
            <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground group-focus-within:text-primary transition-colors">
              Mobile Number
            </label>
            <div className="relative flex items-center border-b-2 border-border focus-within:border-primary transition-all">
              <span className="text-lg text-foreground font-medium py-2 pr-3 select-none">+91</span>
              <input
                type="tel"
                required
                value={mobile}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  if (val.length <= 10) setMobile(val);
                }}
                placeholder="98765 43210"
                className="w-full bg-transparent py-2 px-0 text-lg font-medium text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-0"
              />
            </div>
          </div>

          <div className="space-y-2 relative group">
            <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground group-focus-within:text-primary transition-colors">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-transparent border-b-2 border-border py-2 px-0 text-lg text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary focus:ring-0 transition-all font-medium tracking-widest"
            />
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground py-4 rounded-xl text-lg font-medium hover:bg-primary/90 transition-colors shadow-sm flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Login to Dashboard"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
