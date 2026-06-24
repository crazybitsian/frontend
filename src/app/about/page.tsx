"use client";

import Image from "next/image";
import { Footer } from "@/components/Footer";
import { ShieldCheck, Sparkles, Building2 } from "lucide-react";
import { useEffect } from "react";

export default function AboutUsPage() {
  useEffect(() => {
    // Simple scroll reveal interaction
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100');
                entry.target.classList.remove('opacity-0', 'translate-y-8');
            }
        });
    }, observerOptions);

    document.querySelectorAll('section > div').forEach(section => {
        section.classList.add('transition-all', 'duration-1000', 'ease-out', 'opacity-0', 'translate-y-8');
        observer.observe(section);
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 w-full h-full">
            <Image 
              src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=3840&auto=format&fit=crop" 
              alt="Premium student living space" 
              fill
              className="object-cover"
              priority
            />
            {/* Dark gradient for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/60 to-zinc-900/20"></div>
          </div>
          <div className="relative z-10 max-w-6xl mx-auto px-6 text-center md:text-left w-full">
            <div className="max-w-3xl">
              <h1 className="font-display text-white text-5xl md:text-7xl font-bold leading-[1.1] mb-6 opacity-0 translate-y-8 animate-[fade-up_1s_ease-out_forwards]">
                Building the infrastructure for student ambition.
              </h1>
              <p className="text-white/90 text-lg md:text-xl font-sans max-w-2xl leading-relaxed opacity-0 translate-y-8 animate-[fade-up_1s_ease-out_0.2s_forwards]">
                Redefining student living through editorial curation and architectural empathy.
              </p>
            </div>
          </div>
        </section>

        {/* Section 1: The Origin Story */}
        <section className="py-24 md:py-32 bg-background">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
              <div className="md:col-span-5">
                <h2 className="font-display text-4xl md:text-5xl font-semibold text-primary tracking-tighter leading-tight">
                  The Origin Story
                </h2>
              </div>
              <div className="md:col-span-7 space-y-6 text-foreground leading-relaxed text-lg font-sans">
                <p>
                  It began with a single move to Bangalore. Like thousands of students every year, our founder faced the overwhelming anxiety of navigating unverified PG listings, deceptive photos, and living spaces that felt more like transit camps than homes.
                </p>
                <p>
                  The problem wasn&apos;t just a lack of beds; it was a lack of dignity. Moving to a new city for coaching, college, or a first job is a pivotal life moment. Yet, the infrastructure supporting this transition was broken—steeped in uncertainty and architectural neglect.
                </p>
                <p>
                  ApnaKamra was born from the vision to create a safe haven. We wanted to build something that didn&apos;t just provide a room, but provided &quot;your own room&quot;—a place where ambition could breathe and where a student truly belonged from the moment they dropped their bags.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Our Philosophy */}
        <section className="py-24 md:py-32 bg-muted">
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-16">
              <span className="inline-block px-3 py-1 rounded-full bg-accent text-primary text-xs font-sans uppercase tracking-widest mb-4 font-bold">Our Philosophy</span>
              <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tighter">Manifesto for Better Living</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Point 1 */}
              <div className="bg-card p-10 border border-border rounded-xl hover:-translate-y-2 hover:shadow-lg transition-all duration-300 group">
                <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-4">Safety by Design</h3>
                <p className="text-muted-foreground leading-relaxed font-sans">
                  Beyond locks and keys, we curate for psychological safety. Our spaces are vetted for well-lit surroundings, community vetting, and intuitive layouts that foster a sense of security.
                </p>
              </div>
              
              {/* Point 2 */}
              <div className="bg-card p-10 border border-border rounded-xl hover:-translate-y-2 hover:shadow-lg transition-all duration-300 group">
                <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-4">Editorial Standards</h3>
                <p className="text-muted-foreground leading-relaxed font-sans">
                  Every room is scouted with the eye of a designer. We look for natural light, ventilation, and functional aesthetics—ensuring that every listing on our platform meets a high visual and livability bar.
                </p>
              </div>
              
              {/* Point 3 */}
              <div className="bg-card p-10 border border-border rounded-xl hover:-translate-y-2 hover:shadow-lg transition-all duration-300 group">
                <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-4">Empathy in Architecture</h3>
                <p className="text-muted-foreground leading-relaxed font-sans">
                  Living spaces that respect a student&apos;s need for both intense focus and vibrant community. We prioritize zoning that allows for quiet study while facilitating organic social interaction.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: The Team */}
        <section className="py-24 md:py-32 bg-background">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center md:text-left mb-16">
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tighter">The Team</h2>
              <p className="text-muted-foreground mt-4 text-lg font-sans">The minds behind the mission.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-12">
              {/* Member 1 */}
              <div className="space-y-6">
                <div className="aspect-[4/5] bg-muted overflow-hidden rounded-xl grayscale hover:grayscale-0 transition-all duration-500 relative">
                  <Image 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop" 
                    alt="Portrait of Hardik Agarwal"
                    fill
                    className="object-cover object-center"
                  />
                </div>
                <div>
                  <h4 className="font-display text-xl font-bold">Hardik Agarwal</h4>
                  <p className="text-primary font-sans text-sm uppercase tracking-wide font-bold">CEO</p>
                </div>
              </div>
              
              {/* Member 2 */}
              <div className="space-y-6">
                <div className="aspect-[4/5] bg-muted overflow-hidden rounded-xl grayscale hover:grayscale-0 transition-all duration-500 relative">
                  <Image 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop" 
                    alt="Portrait of Hardik Singla"
                    fill
                    className="object-cover object-center"
                  />
                </div>
                <div>
                  <h4 className="font-display text-xl font-bold">Hardik Singla</h4>
                  <p className="text-primary font-sans text-sm uppercase tracking-wide font-bold">CAO</p>
                </div>
              </div>

              {/* Member 3 */}
              <div className="space-y-6">
                <div className="aspect-[4/5] bg-muted overflow-hidden rounded-xl grayscale hover:grayscale-0 transition-all duration-500 relative">
                  <Image 
                    src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop" 
                    alt="Portrait of Raj Shukla"
                    fill
                    className="object-cover object-center"
                  />
                </div>
                <div>
                  <h4 className="font-display text-xl font-bold">Raj Shukla</h4>
                  <p className="text-primary font-sans text-sm uppercase tracking-wide font-bold">CTO</p>
                </div>
              </div>

              {/* Member 4 */}
              <div className="space-y-6">
                <div className="aspect-[4/5] bg-muted overflow-hidden rounded-xl grayscale hover:grayscale-0 transition-all duration-500 relative">
                  <Image 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop" 
                    alt="Portrait of Prince Gupta"
                    fill
                    className="object-cover object-center"
                  />
                </div>
                <div>
                  <h4 className="font-display text-xl font-bold">Prince Gupta</h4>
                  <p className="text-primary font-sans text-sm uppercase tracking-wide font-bold">COO</p>
                </div>
              </div>

              {/* Member 5 */}
              <div className="space-y-6">
                <div className="aspect-[4/5] bg-muted overflow-hidden rounded-xl grayscale hover:grayscale-0 transition-all duration-500 relative">
                  <Image 
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop" 
                    alt="Portrait of Aditya Bhatiwal"
                    fill
                    className="object-cover object-center"
                  />
                </div>
                <div>
                  <h4 className="font-display text-xl font-bold">Aditya Bhatiwal</h4>
                  <p className="text-primary font-sans text-sm uppercase tracking-wide font-bold">CPO</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-up {
            from {
                opacity: 0;
                transform: translateY(2rem);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
      `}} />
    </div>
  );
}
