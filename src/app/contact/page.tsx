"use client";

import { Footer } from "@/components/Footer";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/api/client";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    
    try {
      await api.submitLead({
        name: formData.get("fullName") as string,
        mobile: formData.get("mobileNumber") as string,
        message: formData.get("message") as string,
      });
      setIsSuccess(true);
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error("Failed to submit message", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow max-w-6xl mx-auto px-6 py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-start">
          {/* Left Column: Branding & Info */}
          <div className="space-y-12">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tighter leading-[1.1]">
                Get in touch<span className="text-primary">.</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-md leading-relaxed">
                Moving to a new city is a big step. Whether you&apos;re looking for a room or have questions about a stay, our team is here to help you find your sense of belonging.
              </p>
            </div>

            <div className="space-y-8">
              {/* Contact Item 1 */}
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
                  <Mail className="text-primary w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-sans font-medium uppercase tracking-widest text-muted-foreground mb-1">Email our team</p>
                  <p className="text-lg font-medium text-foreground">help@apnakamra.com</p>
                </div>
              </div>

              {/* Contact Item 2 */}
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
                  <Phone className="text-primary w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-sans font-medium uppercase tracking-widest text-muted-foreground mb-1">Give us a call</p>
                  <p className="text-lg font-medium text-foreground">+91 98765 43210</p>
                </div>
              </div>

              {/* Contact Item 3 */}
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
                  <MapPin className="text-primary w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-sans font-medium uppercase tracking-widest text-muted-foreground mb-1">Visit our office</p>
                  <p className="text-lg font-medium text-foreground">Indiranagar, Bengaluru, India</p>
                </div>
              </div>
            </div>


          </div>

          {/* Right Column: Contact Form */}
          <div className="relative w-full">
            {/* Background decoration for high-end feel */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-accent rounded-full blur-3xl -z-10 opacity-60"></div>

            <div className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-sm relative z-10">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block font-sans text-sm text-muted-foreground font-medium" htmlFor="fullName">Full Name</label>
                    <input
                      className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground transition-all placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      id="fullName"
                      name="fullName"
                      placeholder="Arjun Singh"
                      required
                      type="text"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-sans text-sm text-muted-foreground font-medium" htmlFor="mobileNumber">Mobile Number</label>
                    <div className="flex w-full items-center px-4 py-3 border border-border rounded-xl bg-background transition-all focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent">
                      <span className="text-muted-foreground font-medium mr-2 whitespace-nowrap">+91</span>
                      <input 
                        className="w-full bg-transparent text-foreground placeholder:text-muted-foreground outline-none" 
                        id="mobileNumber" 
                        name="mobileNumber" 
                        placeholder="9876543210" 
                        required 
                        type="tel"
                        maxLength={10}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block font-sans text-sm text-muted-foreground font-medium" htmlFor="email">Email Address</label>
                  <input
                    className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground transition-all placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    id="email"
                    name="email"
                    placeholder="arjun@university.edu"
                    required
                    type="email"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-sans text-sm text-muted-foreground font-medium" htmlFor="message">Message</label>
                  <textarea
                    className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground transition-all placeholder:text-muted-foreground resize-none focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    id="message"
                    name="message"
                    placeholder="I'm looking for a single-sharing room in Bangalore near Koramangala..."
                    required
                    rows={4}
                  ></textarea>
                </div>

                <button
                  className="w-full bg-primary text-white font-sans font-medium py-4 rounded-xl hover:bg-primary/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={isSubmitting || isSuccess}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isSuccess ? (
                    <span>Message Sent</span>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {isSuccess && (
                <div className="mt-6 p-4 bg-accent text-primary rounded-xl text-center font-medium animate-in fade-in slide-in-from-bottom-4 duration-500">
                  Thank you! We&apos;ll get back to you within 24 hours.
                </div>
              )}
            </div>


          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
