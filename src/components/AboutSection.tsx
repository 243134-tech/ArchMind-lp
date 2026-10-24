import React from 'react';
import { Cpu, Eye, ShieldCheck, Zap } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const capabilities = [
    {
      icon: Cpu,
      title: 'Generative Spatial Algorithms',
      desc: 'Simultaneously explores thousands of structural permutations, balancing aesthetic harmony with structural loads and local building codes.',
    },
    {
      icon: Eye,
      title: 'Photorealistic Physical Lighting',
      desc: 'Calculates real-world ray bounces, indirect 2700K cove washes, and true solar declination angles for indistinguishable-from-reality views.',
    },
    {
      icon: ShieldCheck,
      title: 'Material Intelligence & BOM',
      desc: 'Direct integration with architectural suppliers for French oak, travertine, and thermally-broken glazing with automated bill of materials.',
    },
    {
      icon: Zap,
      title: 'Instant BIM & CAD Export',
      desc: 'Turn visual concepts directly into actionable construction schematics compatible with Revit, Rhino, and AutoCAD in one click.',
    },
  ];

  return (
    <section id="about" className="relative py-28 md:py-44 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto flex flex-col gap-20">
        
        {/* Core Brand Narrative: Pure Floating Typography */}
        <div id="intelligence" className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          <div className="lg:col-span-5">
            <span className="text-[#55C7D9] text-xs sm:text-sm font-mono font-bold tracking-widest uppercase mb-4 block drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              ✦ ABOUT ARCHMIND
            </span>
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08] drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]"
              style={{ letterSpacing: '-0.03em', textWrap: 'balance' }}
            >
              Architectural Intelligence for Modern Living.
            </h2>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-6 text-zinc-200 text-lg sm:text-xl font-light leading-relaxed drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
            <p>
              ArchMind was founded at the intersection of rigorous architectural discipline and advanced neural intelligence. We believe visionary design should not be locked behind months of manual drafting or inaccessible consulting fees.
            </p>
            <p>
              By combining physical spatial reasoning, material science, and generative 3D modeling, we empower architects, developers, and homeowners to conceive, test, and materialize spaces with unprecedented clarity.
            </p>
            
            {/* Architectural Principles Datum: Pure text */}
            <div className="pt-6 mt-2 border-t border-white/20 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm font-mono text-[#55C7D9] drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              <span>Precision Spatial Planning</span>
              <span aria-hidden="true" className="text-white/40">·</span>
              <span>Contextual Materiality</span>
              <span aria-hidden="true" className="text-white/40">·</span>
              <span>Intelligent Light Simulation</span>
              <span aria-hidden="true" className="text-white/40">·</span>
              <span>Zero Carbon Auditing</span>
            </div>
          </div>

        </div>

        {/* 4 Feature Capabilities Matrix: Pure Floating Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pt-10 border-t border-white/20">
          {capabilities.map((cap, i) => {
            const Icon = cap.icon;
            return (
              <div
                key={i}
                className="flex flex-col justify-between py-2"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="w-6 h-6 text-[#55C7D9] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" />
                    <h3 className="text-xl font-bold text-white tracking-tight drop-shadow-[0_3px_15px_rgba(0,0,0,0.95)]">
                      {cap.title}
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base text-zinc-200 leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] font-light">
                    {cap.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
