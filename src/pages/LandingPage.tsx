import React from 'react';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { VisionSection } from '../components/VisionSection';
import { AboutSection } from '../components/AboutSection';
import { CtaSection } from '../components/CtaSection';
import { Footer } from '../components/Footer';
import { ScrollBackgroundAnimation } from '../components/ScrollBackgroundAnimation';
import { Route } from '../types';

interface LandingPageProps {
  onNavigate: (route: Route) => void;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
  onOpenIntegrationSettings: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onOpenTerms,
  onOpenPrivacy,
  onOpenIntegrationSettings,
}) => {
  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col selection:bg-[#55C7D9]/20 selection:text-[#20211F]">
      
      {/* 300-Frame Scroll-Based Video Animation as Whole Background */}
      <ScrollBackgroundAnimation />

      {/* Sticky Minimal Navbar with Frosted Glassmorphism */}
      <Navbar
        currentRoute="/"
        onNavigate={onNavigate}
        onScrollToSection={handleScrollToSection}
      />

      {/* Main Content Area floating over Background Animation */}
      <main className="relative z-10 flex-1">
        {/* Hero Section */}
        <HeroSection
          onGetStarted={() => onNavigate('/app/overview')}
          onSignIn={() => onNavigate('/signin')}
        />

        {/* Minimal Brand Vision Section */}
        <VisionSection />

        {/* Brand Story & Architectural Discipline (About Section) */}
        <AboutSection />

        {/* Final Call to Action */}
        <CtaSection
          onCreateAccount={() => onNavigate('/signup')}
        />
      </main>

      {/* Minimal Footer with Frosted Glassmorphism */}
      <div className="relative z-10">
        <Footer
          onNavigate={onNavigate}
          onOpenTerms={onOpenTerms}
          onOpenPrivacy={onOpenPrivacy}
          onOpenIntegrationSettings={onOpenIntegrationSettings}
          onScrollToSection={handleScrollToSection}
        />
      </div>

    </div>
  );
};
