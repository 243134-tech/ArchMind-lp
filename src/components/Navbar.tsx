import React, { useState } from 'react';
import { ArchMindLogo } from './ArchMindLogo';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Route } from '../types';

interface NavbarProps {
  currentRoute: Route;
  onNavigate: (route: Route) => void;
  onScrollToSection?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  onScrollToSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (currentRoute !== '/') {
      onNavigate('/');
      setTimeout(() => {
        onScrollToSection?.(sectionId);
      }, 100);
    } else {
      onScrollToSection?.(sectionId);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full px-6 lg:px-12 pt-6 pb-4 bg-transparent transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 bg-transparent">
        
        {/* Brand Wordmark & Architectural Symbol */}
        <button
          onClick={() => {
            setMobileMenuOpen(false);
            onNavigate('/');
          }}
          className="flex items-center text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55C7D9] rounded-sm py-1 transition-opacity hover:opacity-85 cursor-pointer drop-shadow-md"
          aria-label="ArchMind Home"
        >
          <ArchMindLogo size="md" theme="light" />
        </button>

        {/* Minimal Pure Text Navigation Links (Desktop) */}
        <nav
          className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300"
          aria-label="Main Navigation"
        >
          <a
            href="#process"
            onClick={(e) => handleLinkClick(e, 'process')}
            className="hover:text-white transition-colors py-1 cursor-pointer drop-shadow-sm"
          >
            Evolution Process
          </a>
          <a
            href="#intelligence"
            onClick={(e) => handleLinkClick(e, 'intelligence')}
            className="hover:text-white transition-colors py-1 cursor-pointer drop-shadow-sm"
          >
            AI Intelligence
          </a>
          <a
            href="#comparison"
            onClick={(e) => handleLinkClick(e, 'comparison')}
            className="hover:text-white transition-colors py-1 cursor-pointer drop-shadow-sm"
          >
            Workflow Matrix
          </a>
          <a
            href="#about"
            onClick={(e) => handleLinkClick(e, 'about')}
            className="hover:text-white transition-colors py-1 cursor-pointer drop-shadow-sm"
          >
            About
          </a>
        </nav>

        {/* Action CTAs (Desktop) */}
        <div className="hidden md:flex items-center gap-6 shrink-0">
          <button
            onClick={() => onNavigate('/app/overview')}
            className="text-sm font-semibold text-[#55C7D9] hover:text-white transition-colors cursor-pointer drop-shadow-sm flex items-center gap-1.5"
          >
            <span>Open App</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigate('/signin')}
            className={`text-sm font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer drop-shadow-sm ${
              currentRoute === '/signin' ? 'text-white font-semibold' : ''
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => onNavigate('/app/overview')}
            className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-black bg-white hover:bg-[#55C7D9] px-6 py-2.5 rounded-full transition-all duration-200 whitespace-nowrap shadow-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55C7D9]"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white hover:text-[#55C7D9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55C7D9] rounded cursor-pointer drop-shadow-md"
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Accessible Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 max-w-7xl mx-auto rounded-3xl border border-white/15 bg-black/90 backdrop-blur-2xl p-6 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150 text-white">
          <nav className="flex flex-col gap-4 text-base font-medium">
            <a
              href="#process"
              onClick={(e) => handleLinkClick(e, 'process')}
              className="py-2.5 border-b border-white/10 text-zinc-300 hover:text-white"
            >
              Evolution Process
            </a>
            <a
              href="#intelligence"
              onClick={(e) => handleLinkClick(e, 'intelligence')}
              className="py-2.5 border-b border-white/10 text-zinc-300 hover:text-white"
            >
              AI Intelligence
            </a>
            <a
              href="#comparison"
              onClick={(e) => handleLinkClick(e, 'comparison')}
              className="py-2.5 border-b border-white/10 text-zinc-300 hover:text-white"
            >
              Workflow Matrix
            </a>
            <a
              href="#about"
              onClick={(e) => handleLinkClick(e, 'about')}
              className="py-2.5 border-b border-white/10 text-zinc-300 hover:text-white"
            >
              About ArchMind
            </a>

            <div className="pt-3 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('/signin');
                }}
                className="w-full text-center py-2.5 border border-white/20 text-white rounded-full text-sm font-medium hover:bg-white/10 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('/signup');
                }}
                className="w-full text-center py-2.5 bg-white text-black hover:bg-[#55C7D9] rounded-full text-sm font-medium transition-colors font-semibold"
              >
                Get Started
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
