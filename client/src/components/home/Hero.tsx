import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Particles } from "@/components/ui/particles";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center pt-16 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1578632292335-df3abbb0d586?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-dark/70" />
      </div>

      {/* Ambient Particles */}
      <Particles
        className="absolute inset-0 z-10"
        quantity={30}
        staticity={30}
      />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-heading font-extrabold text-4xl md:text-6xl text-white mb-6 leading-tight">
            Experience Reality{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Reimagined
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-10 leading-relaxed">
            Immerse yourself in extraordinary interactive worlds that blur the
            line between reality and imagination.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/booking">
              <Button className="px-8 py-6 text-lg bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-md hover:opacity-90 transition-opacity shadow-lg">
                Book an Experience
              </Button>
            </Link>
            <Link href="/membership">
              <Button
                variant="outline"
                className="px-8 py-6 text-lg bg-white/10 backdrop-blur-sm text-white border border-white/30 font-medium rounded-md hover:bg-white/20 transition-colors"
              >
                Become a Member
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center z-10">
        <p className="mb-2 text-sm font-medium">Scroll to explore</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 animate-bounce mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
