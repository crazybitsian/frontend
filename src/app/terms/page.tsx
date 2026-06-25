"use client";

import { Footer } from "@/components/Footer";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function TermsOfServicePage() {
  const [activeSection, setActiveSection] = useState("acceptance");

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]");
      let current = "";
      
      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        if (window.pageYOffset >= sectionTop - 150) {
          current = section.getAttribute("id") || "";
        }
      });

      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 120,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background scroll-smooth">
      <main className="flex-grow max-w-6xl mx-auto px-6 py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 items-start">
          
          {/* Left Column: Sticky Sidebar */}
          <aside className="hidden lg:block sticky top-32">
            <div className="flex flex-col gap-1">
              <p className="font-sans text-xs uppercase tracking-widest text-muted-foreground mb-4">Contents</p>
              <a 
                href="#acceptance" 
                onClick={(e) => scrollToSection(e, "acceptance")}
                className={`group flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${activeSection === "acceptance" ? "bg-accent text-primary font-semibold" : "text-muted-foreground hover:bg-accent hover:text-primary"}`}
              >
                <span className="font-sans font-medium">Acceptance</span>
              </a>
              <a 
                href="#user-rules" 
                onClick={(e) => scrollToSection(e, "user-rules")}
                className={`group flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${activeSection === "user-rules" ? "bg-accent text-primary font-semibold" : "text-muted-foreground hover:bg-accent hover:text-primary"}`}
              >
                <span className="font-sans font-medium">User Rules</span>
              </a>
              <a 
                href="#payments" 
                onClick={(e) => scrollToSection(e, "payments")}
                className={`group flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${activeSection === "payments" ? "bg-accent text-primary font-semibold" : "text-muted-foreground hover:bg-accent hover:text-primary"}`}
              >
                <span className="font-sans font-medium">Payments</span>
              </a>
              <a 
                href="#termination" 
                onClick={(e) => scrollToSection(e, "termination")}
                className={`group flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${activeSection === "termination" ? "bg-accent text-primary font-semibold" : "text-muted-foreground hover:bg-accent hover:text-primary"}`}
              >
                <span className="font-sans font-medium">Termination</span>
              </a>
            </div>
            
            <div className="mt-12 p-6 rounded-xl border border-border bg-card shadow-sm">
              <p className="text-sm font-sans font-semibold text-foreground mb-2">Need clarity?</p>
              <p className="text-xs text-muted-foreground mb-4">Our support team is here to help you understand your rights.</p>
              <Link href="/contact" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
                Contact Support →
              </Link>
            </div>
          </aside>
          
          {/* Right Column: Main Content */}
          <article className="lg:col-span-3">
            <header className="mb-16">
              <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tighter text-foreground mb-4">Terms of Service</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span className="font-sans text-sm uppercase tracking-widest">Legal Editorial</span>
                <span className="h-1 w-1 bg-border rounded-full"></span>
                <p className="font-sans text-sm uppercase tracking-widest">Last Updated: October 24, 2024</p>
              </div>
            </header>
            
            <div className="prose prose-zinc prose-lg max-w-none space-y-20">
              
              {/* Acceptance Section */}
              <section className="scroll-mt-32" id="acceptance">
                <h2 className="text-3xl font-display font-semibold tracking-tighter text-foreground mb-6">1. Acceptance of Terms</h2>
                <div className="space-y-4 text-foreground leading-relaxed">
                  <p>By accessing or using the ApnaKamra platform, website, or mobile application, you agree to comply with and be bound by these Terms of Service. These terms constitute a legally binding agreement between you and ApnaKamra regarding your use of our premium student housing services.</p>
                  <p>If you do not agree to these terms, please refrain from using our platform. We provide a curated selection of verified PGs, hostels, and shared rooms specifically tailored for students and young professionals seeking a secure start in a new city.</p>
                </div>
              </section>
              

              
              {/* User Rules Section */}
              <section className="scroll-mt-32" id="user-rules">
                <div className="flex items-center gap-3 mb-6">
                  <span className="p-2 bg-accent text-primary rounded-lg flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                  </span>
                  <h2 className="text-3xl font-display font-semibold tracking-tighter text-foreground">2. User Rules &amp; Conduct</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="p-8 rounded-xl border border-border bg-card hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
                    <h3 className="font-display font-semibold text-xl mb-3">Verified Stays</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">Users agree to provide accurate identification. Our verification process ensures safety for all residents. Falsifying documents will result in immediate ban.</p>
                  </div>
                  <div className="p-8 rounded-xl border border-border bg-card hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
                    <h3 className="font-display font-semibold text-xl mb-3">Resident Conduct</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">Respect for fellow residents and host properties is mandatory. Quiet hours and community guidelines must be observed at all times.</p>
                  </div>
                </div>
                
                <p className="text-foreground leading-relaxed">
                  ApnaKamra acts as an editorial bridge between premium hosts and students. We reserve the right to mediate disputes but expect all users to maintain a high standard of professional and civil behavior.
                </p>
              </section>
              
              {/* Payments Section */}
              <section className="scroll-mt-32" id="payments">
                <h2 className="text-3xl font-display font-semibold tracking-tighter text-foreground mb-6">3. Payment Terms</h2>
                <div className="bg-muted p-10 rounded-2xl border border-border">
                  <ul className="space-y-6">
                    <li className="flex gap-4">
                      <CheckCircle2 className="text-primary w-6 h-6 shrink-0" />
                      <div>
                        <h4 className="font-semibold font-display text-lg">Zero Brokerage Guarantee</h4>
                        <p className="text-muted-foreground">ApnaKamra does not charge students any brokerage fees for finding rooms through our platform.</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <CheckCircle2 className="text-primary w-6 h-6 shrink-0" />
                      <div>
                        <h4 className="font-semibold font-display text-lg">Rent Processing</h4>
                        <p className="text-muted-foreground">Payments made via our secure portal are held in escrow until the check-in is verified, ensuring student protection.</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <CheckCircle2 className="text-primary w-6 h-6 shrink-0" />
                      <div>
                        <h4 className="font-semibold font-display text-lg">Refund Policy</h4>
                        <p className="text-muted-foreground">Cancellations made 7 days prior to check-in are eligible for a full refund of the security deposit.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </section>
              
              {/* Termination Section */}
              <section className="scroll-mt-32" id="termination">
                <h2 className="text-3xl font-display font-semibold tracking-tighter text-foreground mb-6">4. Termination Policies</h2>
                <p className="text-foreground leading-relaxed mb-6">
                  Either party may terminate the housing agreement subject to the notice period specified in the property-specific rental contract. ApnaKamra reserves the right to terminate access to the platform for users who repeatedly violate community standards or fail to meet payment obligations.
                </p>
                <div className="p-6 border-l-4 border-primary bg-accent rounded-r-xl">
                  <p className="text-primary font-medium italic">&quot;Our mission is to provide relief and belonging. Termination is always a last resort after mediation efforts.&quot;</p>
                </div>
              </section>
              
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
