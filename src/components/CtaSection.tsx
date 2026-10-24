import React from 'react';
import { ArrowRight, Check, X, Shield, Sparkles } from 'lucide-react';

interface CtaSectionProps {
  onCreateAccount: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ onCreateAccount }) => {
  const comparison = [
    {
      metric: 'Concept to Photorealistic Visualization',
      traditional: '6 to 10 weeks of drafting',
      archmind: 'Under 30 seconds real-time',
    },
    {
      metric: 'Cost per Design Revision',
      traditional: '₹2,50,000 – ₹4,50,000 per cycle',
      archmind: 'Instant & unlimited iterations',
    },
    {
      metric: 'Environmental & Solar Simulation',
      traditional: 'Manual third-party consulting',
      archmind: 'Built-in 365-day solar ray tracing',
    },
    {
      metric: 'Construction Handoff Deliverables',
      traditional: 'Static paper/PDF schematics',
      archmind: 'Production BIM, CAD, and VR walkthroughs',
    },
  ];

  return (
    <section id="comparison" className="relative py-28 md:py-44 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto flex flex-col gap-24">
        
        {/* Workflow Comparison Matrix: Pure Floating Table Layout */}
        <div className="w-full">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[#55C7D9] text-xs sm:text-sm font-mono font-bold tracking-widest uppercase mb-4 block drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              ✦ PERFORMANCE ADVANTAGE
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
              Traditional Studio vs. ArchMind AI
            </h2>
            <p className="mt-4 text-base sm:text-lg text-zinc-200 font-light drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              Why leading developers and visionaries are building with neural spatial workflows.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm sm:text-base">
              <thead>
                <tr className="border-b border-white/20 text-xs sm:text-sm font-mono uppercase tracking-wider text-zinc-300">
                  <th className="py-5 pr-6 font-semibold drop-shadow-md">Workflow Metric</th>
                  <th className="py-5 px-6 font-semibold text-zinc-300 drop-shadow-md">Traditional Process</th>
                  <th className="py-5 pl-6 font-semibold text-[#55C7D9] drop-shadow-md">ArchMind Engine</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 font-light">
                {comparison.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="py-5 pr-6 font-medium text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">{row.metric}</td>
                    <td className="py-5 px-6 text-zinc-300 flex items-center gap-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                      <X className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{row.traditional}</span>
                    </td>
                    <td className="py-5 pl-6 text-[#55C7D9] font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#55C7D9] shrink-0" />
                        <span>{row.archmind}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Final Conversion CTA: Pure Floating Text over Frame 300 Finale */}
        <div className="max-w-4xl mx-auto w-full text-center flex flex-col items-center pt-8">
          
          <div className="text-[#55C7D9] mb-6 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            <Sparkles className="w-10 h-10" />
          </div>

          {/* Section Heading: Pure Text */}
          <h2
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.05] drop-shadow-[0_4px_35px_rgba(0,0,0,0.95)]"
            style={{ letterSpacing: '-0.035em', textWrap: 'balance' }}
          >
            Ready to Imagine Something Better?
          </h2>

          {/* Supporting text: Pure Text */}
          <p
            className="mt-6 md:mt-8 text-xl sm:text-2xl text-zinc-100 max-w-2xl leading-relaxed font-light drop-shadow-[0_2px_16px_rgba(0,0,0,0.95)]"
            style={{ textWrap: 'balance' }}
          >
            Begin your journey toward a space that reflects your vision. Design in real time, audit in 3D, and build with absolute certainty.
          </p>

          {/* Primary CTA button */}
          <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={onCreateAccount}
              className="inline-flex items-center justify-center gap-2.5 text-base sm:text-lg font-bold text-black bg-[#55C7D9] hover:bg-white px-10 py-4 sm:py-5 rounded-full transition-all duration-200 shadow-2xl hover:shadow-[0_0_35px_rgba(85,199,217,0.6)] group cursor-pointer"
            >
              <span>Create Your Account</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Trust Guarantees: Pure Text */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-zinc-300 font-mono drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#55C7D9]" /> No credit card required
            </span>
            <span>·</span>
            <span>Instant browser execution</span>
            <span>·</span>
            <span>Full export rights</span>
          </div>

        </div>

      </div>
    </section>
  );
};
