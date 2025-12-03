"use client";
import WrapButton from "@/components/ui/wrap-button";
import { Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative   mt-25 bg-transparent">
      <div className="relative z-10 container mx-auto px-6 md:px-8">
        <div className="mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 
                          px-5 py-2 rounded-full text-sm font-medium tracking-wider 
                          animate-fade-in"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
              Now Live: Stanect is here
            </span>
            <span className="ml-2">Launch</span>
          </div>

          {/* Main Headline */}
          <h1
            className="mt-8 text-5xl md:text-6xl lg:text-8xl tracking-tight 
                          bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent
                          leading-tight animate-fade-up animation-delay-200"
          >
            Never{" "}
            <span
              className="inline-block bg-gradient-to-r from-amber-400 to-amber-500 
                             text-black px-3 py-1 rounded-xl -rotate-2 
                             animate-fade-up animation-delay-400"
            >
              freeze
            </span>
            <br />
            meeting someone you really like.
          </h1>

          {/* Subheadline */}
          <p
            className="mx-auto mt-6 md:mt-8 max-w-3xl text-lg  lg:text-xl 
                         text-white/80 font-inter leading-relaxed 
                         animate-fade-up animation-delay-600"
          >
            Made For People who Struggle to Connect
          </p>

          {/* CTA */}

          <div className="mt-8 animate-fade-up animation-delay-800">
            <WrapButton
              className=" text-lg md:text-xl font-display 
                         shadow-2xl shadow-amber-500/25 
                         hover:shadow-amber-500/40 hover:scale-105 
                         transition-all duration-300"
            >
              Start For Free
            </WrapButton>
          </div>

          {/* Trust signal (optional) */}
          <p className="mt-8 text-sm text-white/60 animate-fade-up animation-delay-1000 font-inter">
            Join 8,000+ people already building real-world confidence
          </p>
        </div>
      </div>
    </section>
  );
}
