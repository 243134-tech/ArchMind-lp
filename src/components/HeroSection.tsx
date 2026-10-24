import React from 'react';
import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onGetStarted,
  onSignIn,
}) => {
  const scrollToProcess = () => {
    const el = document.getElementById('process');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-6 lg:px-12 text-center pt-20 pb-20">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        
        {/* Sleek architectural kicker: pure floating text */}
        <div className="inline-flex items-center gap-2 text-[#55C7D9] text-xs sm:text-sm font-mono font-bold tracking-widest uppercase mb-6 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
          <Sparkles className="w-4 h-4" />
          <span>REAL-TIME SPATIAL REASONING ENGINE</span>
        </div>

        {/* Main Headline: Pure text with dramatic presence */}
        <h1
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white tracking-tight leading-[1.02] max-w-5xl drop-shadow-[0_4px_35px_rgba(0,0,0,0.95)]"
          style={{ letterSpacing: '-0.04em', textWrap: 'balance' }}
        >
          From Raw Concrete <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#55C7D9] to-white">
            To Living Art.
          </span>
        </h1>

        {/* Supporting Text: Pure floating text */}
        <p
          className="mt-6 md:mt-8 text-lg sm:text-2xl md:text-3xl text-zinc-100 max-w-3xl font-light leading-relaxed drop-shadow-[0_2px_16px_rgba(0,0,0,0.95)]"
          style={{ textWrap: 'balance' }}
        >
          Experience intelligent architecture in motion. Scroll to scrub the live physical transformation from raw framing to bespoke modern luxury.
        </p>

        {/* Call to Action Controls */}
        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto">
          {/* Primary CTA */}
          <button
            onClick={() => onGetStarted()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 text-base font-bold text-black bg-[#55C7D9] hover:bg-white px-9 py-4 rounded-full transition-all duration-200 shadow-2xl hover:shadow-[0_0_35px_rgba(85,199,217,0.6)] cursor-pointer"
          >
            <span>Enter ArchMind App</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          {/* Secondary CTA */}
          <button
            onClick={scrollToProcess}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-base font-semibold text-white hover:text-black hover:bg-white border-2 border-white/70 px-8 py-4 rounded-full transition-all duration-200 drop-shadow-lg cursor-pointer"
          >
            <span>Explore Evolution</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Minimal Scroll Scrub Telemetry: Pure text */}
        <div className="mt-16 sm:mt-20 inline-flex items-center gap-2.5 text-xs sm:text-sm font-mono text-zinc-300 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#55C7D9] animate-ping" />
          <span>↓ SCROLL DOWN TO SCRUB 300-FRAME TRANSFORMATION</span>
        </div>

      </div>
    </section>
  );
};
