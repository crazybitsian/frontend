"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && mobile.trim()) {
      localStorage.setItem("apnakamra_user", JSON.stringify({ name, mobile }));
      router.push("/profile");
      router.refresh();
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden selection:bg-primary/20 selection:text-primary">
      {/* Full-bleed immersive architectural photography background */}
      <Image
        src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop"
        alt="Premium student living space"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center scale-105"
      />
      {/* Very subtle elegant gradient to ensure text readability on the edges, but preserving photo clarity */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

      {/* Back button floats above the photo */}
      <Link 
        href="/" 
        className="absolute top-8 left-8 lg:top-12 lg:left-12 flex items-center text-sm font-medium text-white hover:text-white/80 transition-colors z-20 drop-shadow-md"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to home
      </Link>

      {/* 
        The Bento Card:
        A crisp, completely opaque white card positioned asymmetrically (slightly right-aligned on large screens).
        No blur, no glassmorphism - solid honesty and high contrast.
      */}
      <div className="relative z-10 w-full max-w-md mx-4 lg:mx-0 lg:absolute lg:right-[10%] lg:top-1/2 lg:-translate-y-1/2 bg-white rounded-3xl p-8 lg:p-12 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]">
        
        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-3 font-display">
          Welcome home.
        </h1>
        <p className="text-muted-foreground mb-10 text-lg">
          Enter your details to access your saved rooms and premium student stays.
        </p>

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-2 relative group">
            <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground group-focus-within:text-primary transition-colors">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Abhinav Singh"
              className="w-full bg-transparent border-b-2 border-border py-2 px-0 text-lg text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary focus:ring-0 transition-all font-medium"
            />
          </div>

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
                  if (val.length <= 10) {
                    setMobile(val);
                  }
                }}
                placeholder="98765 43210"
                className="w-full bg-transparent py-2 px-0 text-lg font-medium text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-0"
              />
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-4 rounded-xl text-lg font-medium hover:bg-primary/90 transition-colors shadow-sm flex justify-center items-center gap-2"
            >
              Continue
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          By continuing, you agree to our <br className="hidden lg:block"/> 
          <Link href="#" className="underline hover:text-foreground underline-offset-4 decoration-border hover:decoration-primary transition-colors">Terms of Service</Link> 
          {" "}and{" "}
          <Link href="#" className="underline hover:text-foreground underline-offset-4 decoration-border hover:decoration-primary transition-colors">Privacy Policy</Link>.
        </div>
      </div>
    </div>
  );
}
