import React from 'react';
import { ArchMindLogo } from './ArchMindLogo';
import { Route } from '../types';

interface FooterProps {
  onNavigate: (route: Route) => void;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
  onOpenIntegrationSettings: () => void;
  onScrollToSection?: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenTerms,
  onOpenPrivacy,
  onOpenIntegrationSettings,
  onScrollToSection,
}) => {
  return (
    <footer className="w-full bg-transparent border-t border-white/20 py-16 md:py-24 px-6 lg:px-12 text-zinc-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
        
        {/* Brand Lockup & Tagline: Pure Text */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55C7D9] rounded-sm cursor-pointer drop-shadow-md"
            aria-label="ArchMind Home"
          >
            <ArchMindLogo size="md" theme="light" />
          </button>
          <p className="text-sm text-zinc-300 mt-1 font-light drop-shadow-sm">
            Imagine It. Design It. Live It.
          </p>
        </div>

        {/* Minimal Navigation & Legal Links: Pure Text */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
          <a
            href="#process"
            onClick={(e) => {
              e.preventDefault();
              onScrollToSection?.('process');
            }}
            className="hover:text-white transition-colors cursor-pointer drop-shadow-sm"
          >
            Process
          </a>
          <a
            href="#intelligence"
            onClick={(e) => {
              e.preventDefault();
              onScrollToSection?.('intelligence');
            }}
            className="hover:text-white transition-colors cursor-pointer drop-shadow-sm"
          >
            Intelligence
          </a>
          <a
            href="#comparison"
            onClick={(e) => {
              e.preventDefault();
              onScrollToSection?.('comparison');
            }}
            className="hover:text-white transition-colors cursor-pointer drop-shadow-sm"
          >
            Comparison
          </a>
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              onScrollToSection?.('about');
            }}
            className="hover:text-white transition-colors cursor-pointer drop-shadow-sm"
          >
            About
          </a>
          <button
            onClick={() => onNavigate('/signin')}
            className="hover:text-white transition-colors cursor-pointer drop-shadow-sm"
          >
            Sign In
          </button>
          <button
            onClick={() => onNavigate('/signup')}
            className="hover:text-white transition-colors cursor-pointer drop-shadow-sm"
          >
            Get Started
          </button>
          <button
            onClick={onOpenPrivacy}
            className="hover:text-white transition-colors cursor-pointer drop-shadow-sm"
          >
            Privacy Policy
          </button>
          <button
            onClick={onOpenTerms}
            className="hover:text-white transition-colors cursor-pointer drop-shadow-sm"
          >
            Terms of Service
          </button>
        </div>

      </div>

      {/* Bottom Copyright Row: Pure Text */}
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400 font-mono">
        <p>© {new Date().getFullYear()} ArchMind Inc. All rights reserved.</p>
        <p className="hidden sm:block">AI-POWERED ARCHITECTURAL TRANSFORMATION ENGINE</p>
      </div>
    </footer>
  );
};
