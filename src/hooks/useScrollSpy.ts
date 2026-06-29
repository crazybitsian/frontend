"use client";

import { useState, useEffect } from "react";

/**
 * Custom hook that tracks the currently active section on a page based on scroll position,
 * useful for updating navigation menus or progress indicators.
 */
export function useScrollSpy(initialSection: string, offset: number = 150) {
  const [activeSection, setActiveSection] = useState(initialSection);

  useEffect(() => {
    /**
     * Event listener callback that calculates which section is currently in the viewport
     * and updates the active section state accordingly.
     */
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]");
      let current = "";
      
      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        if (window.pageYOffset >= sectionTop - offset) {
          current = section.getAttribute("id") || "";
        }
      });

      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [offset]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      window.scrollTo({
        top: target.offsetTop - (offset - 30),
        behavior: "smooth"
      });
    }
  };

  return { activeSection, scrollToSection };
}
