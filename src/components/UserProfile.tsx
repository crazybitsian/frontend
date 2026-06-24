"use client";

import { useState, useEffect } from "react";
import { User } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface UserProfileProps {
  variant?: "default" | "transparent";
}

export function UserProfile({ variant = "default" }: UserProfileProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const userStr = localStorage.getItem("apnakamra_user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setIsLoggedIn(true);
        setUserName(user.name);
      } catch (e) {
        // ignore
      }
    }
  }, []);

  // Prevent hydration mismatch by not rendering anything until mounted
  if (!mounted) {
    return (
      <div className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors opacity-0",
        variant === "transparent" 
          ? "bg-white/10 text-white border border-white/20" 
          : "bg-muted text-foreground border border-border"
      )}>
        <User className="w-4 h-4" />
        <span>Loading</span>
      </div>
    );
  }

  return (
    <Link
      href={isLoggedIn ? "/profile" : "/login"}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all",
        variant === "transparent" 
          ? "bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-md" 
          : "bg-muted/50 hover:bg-muted text-foreground border border-border"
      )}
    >
      <User className="w-4 h-4" />
      <span>{isLoggedIn ? userName.split(' ')[0] : "My Profile"}</span>
    </Link>
  );
}
