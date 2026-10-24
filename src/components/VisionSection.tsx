import React from 'react';
import { Compass, Sun, Layers, CheckCircle2 } from 'lucide-react';

export const VisionSection: React.FC = () => {
  const phases = [
    {
      step: '01',
      frameTag: 'Frames 01–75',
      icon: Compass,
      title: 'Structural & Spatial Telemetry',
      description:
        'Sub-millimeter spatial mapping and beam load calculations directly over raw concrete pillars and ceiling conduit pathways before manual work begins.',
      metric: '99.8% Dimensional Precision',
    },
    {
      step: '02',
      frameTag: 'Frames 76–160',
      icon: Sun,
      title: 'Daylight & Climate Envelope',
      description:
        'Solar path ray tracing positions panoramic floor-to-ceiling glass patio systems to optimize natural illumination and passive seasonal thermal efficiency.',
      metric: '34% Passive Solar Gain',
    },
    {
      step: '03',
      frameTag: 'Frames 161–240',
      icon: Layers,
      title: 'Material Intelligence & Illumination',
      description:
        'Precision French blonde oak planking, fluted timber architectural joinery, and 2700K ambient cove LED lighting simulated with optical physics.',
      metric: 'Tactile Blonde Oak & Fluted Walnut',
    },
    {
      step: '04',
      frameTag: 'Frames 241–300',
      icon: CheckCircle2,
      title: 'From Vision to Reality',
      description:
        'The completed luxury residence: sculptural solid wood coffee tables, modular linen sofa systems, private courtyard vistas, and 1-click BIM blueprints.',
      metric: 'VR Ready • 1-Click CAD/BIM Export',
    },
  ];

  return (
    <section id="process" className="relative py-28 md:py-44 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto flex flex-col gap-16 md:gap-20">
        
        {/* Section Header: Pure Text Floating directly on Video */}
        <div className="max-w-3xl">
          <span className="text-[#55C7D9] text-xs sm:text-sm font-mono font-bold tracking-widest uppercase mb-4 block drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            ✦ EVOLUTION PIPELINE
          </span>

          <h2
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.08] drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]"
            style={{ letterSpacing: '-0.03em', textWrap: 'balance' }}
          >
            Watch Architecture Unfold in Real Time.
          </h2>

          <p
            className="mt-6 text-lg sm:text-xl text-zinc-200 leading-relaxed font-light drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)]"
            style={{ textWrap: 'balance' }}
          >
            As you scroll, the background synchronizes with ArchMind’s four core execution phases. From exposed construction concrete to the finished dream residence.
          </p>
        </div>

        {/* 4-Step Structured Text Grid: No Backgrounds Behind Texts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {phases.map((phase) => {
            const Icon = phase.icon;
            return (
              <div
                key={phase.step}
                className="flex flex-col justify-between py-2"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="font-mono text-3xl font-black text-[#55C7D9] drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                      {phase.step}
                    </span>
                    <span className="font-mono text-xs text-zinc-300 tracking-wider uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                      {phase.frameTag}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <Icon className="w-5 h-5 text-[#55C7D9] shrink-0 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]" />
                    <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight drop-shadow-[0_3px_15px_rgba(0,0,0,0.95)]">
                      {phase.title}
                    </h3>
                  </div>

                  <p className="mt-3 text-base sm:text-lg text-zinc-200 leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] font-light">
                    {phase.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-white/20 flex items-center justify-between text-xs sm:text-sm font-mono text-[#55C7D9] drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                  <span>Telemetry:</span>
                  <span className="text-zinc-100 font-semibold">{phase.metric}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
