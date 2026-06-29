"use client";

import Image from "next/image";
import { Footer } from "@/components/Footer";
import { Mail, Download, ShieldCheck } from "lucide-react";
import { useScrollSpy } from "@/hooks/useScrollSpy";

/**
 * Renders the privacy policy page outlining data collection and usage practices.
 */
export default function PrivacyPolicyPage() {
  const { activeSection, scrollToSection } = useScrollSpy("collect");

  return (
    <div className="flex flex-col min-h-screen bg-background scroll-smooth">
      <main className="grow max-w-6xl mx-auto px-6 py-24 w-full">
        {/* Page Header */}
        <header className="mb-16 border-b border-border pb-12">
          <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tighter mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground font-sans text-sm font-medium">Last Updated: October 24, 2024</p>
        </header>
        
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-20 items-start">
          
          {/* Left Column: Sticky Sidebar */}
          <aside className="lg:sticky lg:top-32 space-y-4">
            <nav className="flex flex-col space-y-1">
              <a 
                href="#collect" 
                onClick={(e) => scrollToSection(e, "collect")}
                className={`text-sm font-sans py-2 transition-all hover:text-primary ${activeSection === "collect" ? "text-primary font-semibold" : "text-muted-foreground"}`}
              >
                Information we collect
              </a>
              <a 
                href="#use" 
                onClick={(e) => scrollToSection(e, "use")}
                className={`text-sm font-sans py-2 transition-all hover:text-primary ${activeSection === "use" ? "text-primary font-semibold" : "text-muted-foreground"}`}
              >
                How we use your info
              </a>
              <a 
                href="#security" 
                onClick={(e) => scrollToSection(e, "security")}
                className={`text-sm font-sans py-2 transition-all hover:text-primary ${activeSection === "security" ? "text-primary font-semibold" : "text-muted-foreground"}`}
              >
                Data Security
              </a>
              <a 
                href="#contact" 
                onClick={(e) => scrollToSection(e, "contact")}
                className={`text-sm font-sans py-2 transition-all hover:text-primary ${activeSection === "contact" ? "text-primary font-semibold" : "text-muted-foreground"}`}
              >
                Contact
              </a>
            </nav>
            
            {/* Editorial Accent Box */}
            <div className="hidden lg:block p-6 bg-accent rounded-xl border border-primary/10 mt-12">
              <ShieldCheck className="text-primary size-6 mb-3" />
              <h4 className="font-display font-semibold text-primary leading-tight mb-2">Student Trust Guarantee</h4>
              <p className="text-xs text-primary/80 leading-relaxed">We never sell your data to third-party advertisers. Your information is used strictly to facilitate verified housing.</p>
            </div>
          </aside>
          
          {/* Right Column: Policy Content */}
          <div className="lg:col-span-3 space-y-16">
            
            {/* Section 1 */}
            <section className="scroll-mt-32" id="collect">
              <h2 className="text-3xl font-display font-bold tracking-tighter mb-6">Information we collect</h2>
              <div className="prose prose-zinc max-w-none space-y-4 text-muted-foreground leading-relaxed">
                <p>At ApnaKamra, we collect information that helps us provide a safe and personalized experience for students searching for housing. This includes:</p>
                <ul className="list-disc pl-5 space-y-2 marker:text-primary">
                  <li><strong className="text-foreground">Personal Identity:</strong> Your full name, university enrollment details, and government-issued ID (for verification purposes).</li>
                  <li><strong className="text-foreground">Contact Information:</strong> Your primary email address, WhatsApp number, and emergency contact details.</li>
                  <li><strong className="text-foreground">Preferences:</strong> Roommate preferences, dietary habits (for mess-integrated stays), and city of interest.</li>
                  <li><strong className="text-foreground">Usage Data:</strong> Information about the listings you view, messages sent to hosts, and your search history on our platform.</li>
                </ul>
              </div>
            </section>
            
            {/* Section 2 */}
            <section className="scroll-mt-32" id="use">
              <h2 className="text-3xl font-display font-bold tracking-tighter mb-6">How we use your info</h2>
              <div className="prose prose-zinc max-w-none space-y-4 text-muted-foreground leading-relaxed">
                <p>We process your information based on your consent and the necessity to fulfill our service commitments. Specifically, we use your data to:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="p-6 bg-card border border-border rounded-xl">
                    <h4 className="font-display font-semibold text-foreground mb-2">Verification</h4>
                    <p className="text-sm">To ensure every student and host on ApnaKamra is authentic, creating a safe ecosystem for young residents.</p>
                  </div>
                  <div className="p-6 bg-card border border-border rounded-xl">
                    <h4 className="font-display font-semibold text-foreground mb-2">Matching</h4>
                    <p className="text-sm">To suggest rooms and roommates that align with your personality, budget, and proximity to your college.</p>
                  </div>
                </div>
                
                <p className="mt-4">We also use aggregated, anonymized data to understand student housing trends in cities like Bangalore and Delhi to improve our editorial listings.</p>
              </div>
            </section>
            
            {/* Section 3 */}
            <section className="scroll-mt-32" id="security">
              <h2 className="text-3xl font-display font-bold tracking-tighter mb-6">Data Security</h2>
              <div className="relative w-full h-80 rounded-xl overflow-hidden mb-8">
                <div className="absolute inset-0 bg-zinc-900/40 z-10"></div>
                <Image 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgThSDKyFyxq5ipEqT2E_V4FzcCP0veVzPqC4XmqkAOZQtSkHO6dxdUP0c-usoX8gyhdVlWthcnA3QI4zTwYtFBCAMiWBEz4FJBYx2X7_SQJyp8yiUN5XRAAKC16y-3B7glsIgxobaYpzeZAc_lekdFHeLDR_mPH-4VJGsBKIAqevNILitDbgfDK15Ile3BaDkeZl79oF89fYFsDLQpBqRSpNkHIrj_5hI-Z5sUVOSRipc964zVVui_alSLnkpXGOvEcDuSfZYqa3v" 
                  alt="Data Security"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-6 left-6 z-20 text-white">
                  <span className="inline-block px-3 py-1 bg-primary rounded-full text-[10px] font-sans font-bold uppercase tracking-widest mb-2">Protocol 2.0</span>
                  <p className="font-display text-xl font-bold">Bank-grade encryption for every tenant.</p>
                </div>
              </div>
              <div className="prose prose-zinc max-w-none space-y-4 text-muted-foreground leading-relaxed">
                <p>We implement industry-standard security measures to protect your sensitive data. This includes AES-256 encryption for all stored personal identifiers and SSL/TLS protocols for all data in transit.</p>
                <p>Access to personal data is strictly limited to authorized ApnaKamra employees who require access to perform verification and support tasks. We conduct regular security audits to identify and mitigate potential vulnerabilities.</p>
              </div>
            </section>
            
            {/* Section 4 */}
            <section className="scroll-mt-32" id="contact">
              <div className="p-8 md:p-12 bg-muted rounded-2xl border border-border">
                <h2 className="text-3xl font-display font-bold tracking-tighter mb-4">Questions about your data?</h2>
                <p className="text-muted-foreground mb-8 max-w-lg">If you have any questions regarding this Privacy Policy, or if you would like to exercise your right to access, delete, or modify your data, our privacy team is ready to help.</p>
                <div className="flex flex-col md:flex-row gap-4">
                  <a className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-foreground text-white rounded-lg font-sans font-medium transition-transform active:scale-95" href="mailto:privacy@apnakamra.com">
                    <Mail className="size-4" />
                    privacy@apnakamra.com
                  </a>
                  <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-card border border-border text-foreground rounded-lg font-sans font-medium transition-transform active:scale-95">
                    Download PDF Policy
                    <Download className="size-4" />
                  </button>
                </div>
              </div>
            </section>
            
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
